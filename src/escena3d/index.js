// Escena de servicios: una pieza 3D por servicio.
// Cambio sin traslape: la pieza actual se va primero y luego entra la nueva.
import * as THREE from 'three';
import { iniciarTaller } from './motor.js';
import { C, M, hacerRueda, hacerSuspension, hacerVolante, hacerFreno, hacerLlave, hacerLaser } from './piezas.js';

const grados = Math.PI / 180;
const suave = (x) => x * x * (3 - 2 * x); // smoothstep

// Alineación: eje delantero visto desde arriba. Las llantas llegan abiertas y quedan derechas.
function hacerEjeAlineacion() {
  const g = new THREE.Group();
  const izq = hacerRueda({ rinColor: 'oscuro' });
  const der = hacerRueda({ rinColor: 'oscuro' });
  [izq, der].forEach((r, i) => { r.scale.setScalar(0.5); r.position.x = i ? 1.15 : -1.15; g.add(r); });
  const barra = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.0, 20), M.rinOscuro);
  barra.rotation.z = Math.PI / 2; g.add(barra);
  const l1 = hacerLaser(3.4), l2 = hacerLaser(3.4);
  [l1, l2].forEach((l) => { l.rotation.x = -Math.PI / 2; g.add(l); });
  const piso = new THREE.GridHelper(6, 12, 0x2c3f7a, 0x1a2552); piso.position.y = -0.52; g.add(piso);
  g.rotation.x = 0.85;
  g.userData.actualizar = (t, dt) => {
    const fase = (t % 6) / 6; // ciclo de 6 s
    const p = fase < 0.3 ? 0 : fase < 0.62 ? suave((fase - 0.3) / 0.32) : 1;
    const toe = (1 - p) * 10 * grados;
    izq.rotation.y = -Math.PI / 2 - toe; der.rotation.y = Math.PI / 2 + toe;
    izq.userData.gira.rotation.z -= dt * 1.2; der.userData.gira.rotation.z -= dt * 1.2;
    l1.rotation.z = toe; l2.rotation.z = -toe;
    l1.position.set(-1.15 - Math.sin(toe) * 1.7, 0.36, -1.7); l2.position.set(1.15 + Math.sin(toe) * 1.7, 0.36, -1.7);
    const color = C.laserRojo.clone().lerp(C.laserVerde, p);
    l1.userData.setColor(color); l2.userData.setColor(color);
  };
  return g;
}

// Balanceo: la llanta en la balanceadora. Tiembla, se le pone la pesa y queda pareja.
function hacerBalanceadora() {
  const g = new THREE.Group();
  const rueda = hacerRueda({ conPesa: true });
  const pesa = rueda.userData.gira.children[rueda.userData.gira.children.length - 1];
  const flecha = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.6, 24).rotateX(Math.PI / 2), M.cromo);
  flecha.position.z = -0.5;
  const caja = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.7), M.negroMate);
  caja.position.set(0, -0.2, -1.35);
  g.add(caja, flecha, rueda);
  g.rotation.set(0.12, 0.55, 0);
  g.userData.actualizar = (t, dt) => {
    const fase = (t % 6) / 6;
    const temblor = fase < 0.55 ? 1 : fase < 0.72 ? 1 - suave((fase - 0.55) / 0.17) : 0;
    rueda.userData.gira.rotation.z -= dt * 7;
    rueda.rotation.x = Math.sin(t * 38) * 0.035 * temblor;
    rueda.rotation.y = Math.cos(t * 38) * 0.035 * temblor;
    const s = fase < 0.5 ? 0 : fase < 0.58 ? suave((fase - 0.5) / 0.08) : 1;
    pesa.scale.setScalar(Math.max(0.001, s));
  };
  return g;
}

export function iniciarServicios({ canvas, vista, reducido, obtenerServicio }) {
  const eng = iniciarTaller({ canvas, reducido });
  const piezas = {
    alinea: hacerEjeAlineacion(),
    suspension: hacerSuspension(),
    balanceo: hacerBalanceadora(),
    direccion: hacerVolante(),
    frenos: hacerFreno(),
    mecanica: hacerLlave()
  };
  piezas.suspension.rotation.set(0.15, 0, 0.3);
  piezas.direccion.rotation.x = -0.35;
  piezas.frenos.rotation.set(0.12, -0.5, 0);
  piezas.mecanica.rotation.set(0.45, -0.25, 0.5);

  const grupo = new THREE.Group();
  Object.values(piezas).forEach((p) => { p.visible = false; p.userData.s = 0; p.userData.base = p.scale.x; grupo.add(p); });
  let mostrando = obtenerServicio();

  eng.agregarVista(vista, { objeto: grupo, camZ: 4.0, luzColor: 0x9dbbff, actualizar: (v, dt, t) => {
    const destino = obtenerServicio();
    const vel = reducido ? 1 : Math.min(1, dt * 9);
    // 1) si cambió, la pieza actual sale primero
    if (destino !== mostrando) {
      const a = piezas[mostrando];
      a.userData.s += (0 - a.userData.s) * vel;
      if (a.userData.s < 0.03) { a.userData.s = 0; a.visible = false; mostrando = destino; }
    } else {
      const b = piezas[mostrando];
      b.userData.s += (1 - b.userData.s) * vel;
    }
    for (const p of Object.values(piezas)) {
      p.visible = p.userData.s > 0.01;
      const k = p.userData.s;
      p.scale.setScalar(p.userData.base * (0.75 + 0.25 * k));
      p.position.y = (1 - k) * -0.35;
    }
    const tt = reducido ? 0 : t, dd = reducido ? 0 : dt;
    piezas.alinea.userData.actualizar(reducido ? 5 : tt, dd);
    piezas.balanceo.userData.actualizar(reducido ? 5 : tt, dd);
    piezas.suspension.rotation.y += dd * 0.35;
    piezas.suspension.userData.resorte.scale.y = 1 - Math.abs(Math.sin(tt * 0.9)) * 0.06;
    piezas.direccion.rotation.z = Math.sin(tt * 0.6) * 0.3;
    piezas.frenos.userData.gira.rotation.z -= dd * 0.6;
    piezas.mecanica.rotation.y += dd * 0.3;
    piezas.mecanica.userData.tuerca.rotation.z -= dd * 0.6;
  } });
  window.__luevanoEng = eng; // útil para depurar desde la consola
  return eng;
}
