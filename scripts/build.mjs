import * as esbuild from 'esbuild';
import { readFile, writeFile, mkdir, rename, unlink, watch as fsWatch } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = 'js';
const DIST = 'dist';
const JSX_FILES = ['icons.jsx', 'tweaks-panel.jsx', 'components.jsx', 'app.jsx'];
const COPY_FILES = ['data.js'];

async function writeAtomic(filepath, content, attempts = 6) {
  const tmp = `${filepath}.${process.pid}.tmp`;
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      await writeFile(tmp, content);
      await rename(tmp, filepath);
      // OneDrive pode sobrescrever após o rename; aguarda + verifica.
      await new Promise(r => setTimeout(r, 80));
      const verify = await readFile(filepath, 'utf8');
      if (verify === content) return;
      lastErr = new Error(`post-write mismatch (${verify.length} vs ${content.length} bytes)`);
    } catch (err) {
      lastErr = err;
      try { await unlink(tmp); } catch {}
      if (err.code && err.code !== 'EBUSY' && err.code !== 'EPERM') throw err;
    }
    await new Promise(r => setTimeout(r, 200 * (i + 1)));
  }
  throw new Error(`writeAtomic ${filepath}: ${lastErr?.message ?? 'unknown'}`);
}

async function transformOne(file) {
  const src = await readFile(path.join(SRC, file), 'utf8');
  const result = await esbuild.transform(src, {
    loader: 'jsx',
    target: 'es2019',
    minify: true,
    legalComments: 'none',
    format: 'iife',
  });
  const out = file.replace(/\.jsx$/, '.js');
  await writeAtomic(path.join(DIST, out), result.code);
  return { file, out, bytes: result.code.length };
}

async function build() {
  if (!existsSync(DIST)) await mkdir(DIST, { recursive: true });
  const t0 = Date.now();

  for (const f of COPY_FILES) {
    const src = await readFile(path.join(SRC, f), 'utf8');
    await writeAtomic(path.join(DIST, f), src);
  }

  const results = [];
  for (const f of JSX_FILES) {
    results.push(await transformOne(f));
  }

  const total = results.reduce((s, r) => s + r.bytes, 0);
  for (const r of results) {
    console.log(`  ${r.file.padEnd(20)} → dist/${r.out.padEnd(20)} ${r.bytes.toLocaleString()} B`);
  }
  console.log(`build done in ${Date.now() - t0}ms (${total.toLocaleString()} B total)`);
}

async function watch() {
  await build();
  console.log(`\nwatching ${SRC}/ ...`);
  const watcher = fsWatch(SRC);
  let pending = false;
  for await (const event of watcher) {
    if (!event.filename) continue;
    if (![...JSX_FILES, ...COPY_FILES].includes(event.filename)) continue;
    if (pending) continue;
    pending = true;
    setTimeout(async () => {
      try {
        console.log(`\n[${new Date().toLocaleTimeString()}] ${event.filename} changed`);
        await build();
      } catch (err) {
        console.error(err.message);
      }
      pending = false;
    }, 50);
  }
}

const isWatch = process.argv.includes('--watch');
(isWatch ? watch() : build()).catch(err => {
  console.error(err);
  process.exit(1);
});
