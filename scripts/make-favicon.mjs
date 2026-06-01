import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('assets/artync-icon.png');
const embeddedIcon = source.toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#fff"/>
  <image href="data:image/png;base64,${embeddedIcon}" x="24" y="72" width="208" height="112" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

await writeFile('assets/artync-favicon.svg', svg);
