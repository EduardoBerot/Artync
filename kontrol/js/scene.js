/* Kontrol LP — cenário 3D do hero (Three.js via CDN)
   Falha de rede no CDN não quebra a página: só o fundo deixa de aparecer. */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const canvas = document.getElementById("bg3d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x05081a, 14, 42);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 16);

  /* ---- luzes: ambiente fria + pontos azuis (branding) ---- */
  scene.add(new THREE.AmbientLight(0x223066, 1.4));
  const key = new THREE.PointLight(0x3b82f6, 220, 60);
  key.position.set(8, 6, 10);
  scene.add(key);
  const rim = new THREE.PointLight(0x6da5ff, 120, 50);
  rim.position.set(-10, -4, 6);
  scene.add(rim);

  /* ---- materiais ---- */
  const cardMat = new THREE.MeshStandardMaterial({
    color: 0x0d1b5e, metalness: 0.55, roughness: 0.3,
  });
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0x1c3aa8, metalness: 0.75, roughness: 0.25,
  });
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6, metalness: 0.4, roughness: 0.2,
    emissive: 0x123a8a, emissiveIntensity: 0.5,
  });
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.16,
  });

  /* ---- geometrias: cartões, moedas e cristais flutuando ---- */
  const geos = {
    card: new THREE.BoxGeometry(2.4, 1.5, 0.12),
    coin: new THREE.CylinderGeometry(0.65, 0.65, 0.14, 36),
    gem: new THREE.IcosahedronGeometry(0.55, 0),
    wire: new THREE.IcosahedronGeometry(1.5, 1),
  };

  const rand = (a, b) => a + Math.random() * (b - a);
  const group = new THREE.Group();
  scene.add(group);

  const floaters = [];
  const spawn = (geo, mat, count, spread) => {
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mat);
      // mantém o centro livre para o conteúdo do hero
      let x;
      do { x = rand(-spread.x, spread.x); } while (Math.abs(x) < 4.5);
      m.position.set(x, rand(-spread.y, spread.y), rand(-spread.z, 2));
      m.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI));
      const s = rand(0.7, 1.3);
      m.scale.setScalar(s);
      group.add(m);
      floaters.push({
        mesh: m,
        baseY: m.position.y,
        speed: rand(0.25, 0.7),
        amp: rand(0.4, 1.1),
        rotX: rand(-0.004, 0.004),
        rotY: rand(-0.004, 0.004),
        phase: rand(0, Math.PI * 2),
      });
    }
  };

  spawn(geos.card, cardMat, 7, { x: 13, y: 6.5, z: 9 });
  spawn(geos.coin, coinMat, 8, { x: 12, y: 6, z: 8 });
  spawn(geos.gem, gemMat, 9, { x: 12, y: 6.5, z: 8 });
  spawn(geos.wire, wireMat, 3, { x: 13, y: 5, z: 10 });

  /* ---- partículas de fundo ---- */
  const pCount = 320;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = rand(-24, 24);
    pPos[i * 3 + 1] = rand(-13, 13);
    pPos[i * 3 + 2] = rand(-18, 4);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x5d8bff, size: 0.05, transparent: true, opacity: 0.55 })
  );
  scene.add(points);

  /* ---- parallax do mouse ---- */
  let mx = 0, my = 0;
  window.addEventListener(
    "mousemove",
    (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  /* ---- resize ---- */
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  /* ---- só renderiza com o hero visível ---- */
  let active = true;
  new IntersectionObserver(([e]) => (active = e.isIntersecting), { threshold: 0 })
    .observe(canvas);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!active) return;
    const t = clock.getElapsedTime();

    for (const f of floaters) {
      f.mesh.position.y = f.baseY + Math.sin(t * f.speed + f.phase) * f.amp;
      f.mesh.rotation.x += f.rotX;
      f.mesh.rotation.y += f.rotY;
    }
    points.rotation.y = t * 0.012;
    group.rotation.y = Math.sin(t * 0.05) * 0.06;

    camera.position.x += (mx * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (-my * 0.9 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  });
}
