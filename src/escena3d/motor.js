import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { C } from './piezas.js';

// ============================================================
//  Motor: un renderer, muchas vistas
// ============================================================
export function iniciarTaller({ canvas, reducido = false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const vistas = [];
  function agregarVista(el, { objeto, camZ = 3.4, fov = 30, actualizar, luzColor = 0xffc400 }) {
    const scene = new THREE.Scene();
    scene.environment = env;
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(luzColor, 2.2); rim.position.set(-4, 1.5, -3); scene.add(rim);
    const fill = new THREE.PointLight(0xff3b2f, 0.0, 10); fill.position.set(-2, -1, 2); scene.add(fill);
    scene.add(objeto);
    const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 50);
    cam.position.set(0, 0, camZ);
    const v = { el, scene, cam, objeto, actualizar, luces: { key, rim, fill }, hover: 0, visible: true };
    el.addEventListener('pointerenter', () => { v.hoverTarget = 1; });
    el.addEventListener('pointerleave', () => { v.hoverTarget = 0; });
    const card = el.closest('[data-card3d]');
    if (card) { card.addEventListener('pointerenter', () => { v.hoverTarget = 1; }); card.addEventListener('pointerleave', () => { v.hoverTarget = 0; }); }
    vistas.push(v);
    return v;
  }

  function redimensionar() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  window.addEventListener('resize', redimensionar);
  redimensionar();

  const reloj = new THREE.Clock();
  let corriendo = true;
  document.addEventListener('visibilitychange', () => { corriendo = !document.hidden; if (corriendo) reloj.getDelta(); });

  function cuadro() {
    const dt = Math.min(reloj.getDelta(), 0.05);
    const t = reloj.elapsedTime;
    const H = renderer.domElement.clientHeight, Wd = renderer.domElement.clientWidth;
    renderer.setScissor(0, 0, Wd, H);
    renderer.setViewport(0, 0, Wd, H);
    renderer.clear();
    for (const v of vistas) {
      const r = v.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > Wd || r.width < 2) continue;
      v.hover += ((v.hoverTarget || 0) - v.hover) * Math.min(1, dt * 6);
      if (v.actualizar) v.actualizar(v, reducido ? 0 : dt, reducido ? 0 : t);
      v.cam.aspect = r.width / r.height;
      v.cam.updateProjectionMatrix();
      const y = H - r.bottom;
      renderer.setViewport(r.left, y, r.width, r.height);
      renderer.setScissor(r.left, y, r.width, r.height);
      renderer.render(v.scene, v.cam);
    }
  }
  let pausado = false;
  function loop() { if (corriendo && !pausado) cuadro(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

  return { agregarVista, renderer, cuadro, THREE, C, pausar: (x = true) => { pausado = x; } };
}
