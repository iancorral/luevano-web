// ============================================================
//  Taller 3D — piezas procedurales (llanta, rin, freno, resorte,
//  volante, llave) renderizadas con UN solo WebGLRenderer en
//  varias "ventanas" (scissor) que siguen a elementos del DOM.
// ============================================================
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const C = {
  senal: 0x3b6fe0,
  caucho: 0x121314,
  metal: 0xc9ccd1,
  grafito: 0x2a2d31,
  laserRojo: new THREE.Color(0xff3b2f),
  laserVerde: new THREE.Color(0x3dff8f)
};

// ---------- Materiales compartidos ----------
export const M = {
  caucho: new THREE.MeshStandardMaterial({ color: C.caucho, roughness: 0.86, metalness: 0.0 }),
  cauchoTaco: new THREE.MeshStandardMaterial({ color: 0x18191b, roughness: 0.78, metalness: 0.0 }),
  rin: new THREE.MeshPhysicalMaterial({ color: 0xd4d7dc, metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.15 }),
  rinOscuro: new THREE.MeshPhysicalMaterial({ color: 0x3a3e44, metalness: 1, roughness: 0.32, clearcoat: 0.5 }),
  disco: new THREE.MeshStandardMaterial({ color: 0x8d9095, metalness: 1, roughness: 0.38 }),
  senal: new THREE.MeshPhysicalMaterial({ color: C.senal, metalness: 0.2, roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.08 }),
  cromo: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06 }),
  negroMate: new THREE.MeshStandardMaterial({ color: 0x1b1c1e, metalness: 0.3, roughness: 0.6 })
};

// ---------- Texto en el costado de la llanta (canvas → textura) ----------
function texturaCostado(texto) {
  const S = 1024, cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  g.clearRect(0, 0, S, S);
  g.translate(S / 2, S / 2);
  const R = S / 2 * (0.835 / 0.95);
  g.fillStyle = '#7f838a';
  g.font = '700 46px "Big Shoulders Display", "Arial Narrow", Arial, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const chars = texto.split('');
  const paso = (Math.PI * 2) / chars.length;
  chars.forEach((ch, i) => {
    g.save(); g.rotate(i * paso); g.translate(0, -R); g.fillText(ch, 0, 0); g.restore();
  });
  // aro fino
  g.strokeStyle = 'rgba(127,131,138,.5)'; g.lineWidth = 3;
  g.beginPath(); g.arc(0, 0, S / 2 * (0.905 / 0.95), 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(0, 0, S / 2 * (0.765 / 0.95), 0, Math.PI * 2); g.stroke();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// ---------- Llanta + rin + disco + caliper ----------
export function hacerRueda({ texto = 'LUEVANO · ALINEACIÓN Y BALANCEO · CHIHUAHUA · ', rinColor = 'claro', conPesa = false } = {}) {
  const raiz = new THREE.Group();
  const gira = new THREE.Group(); // lo que rueda
  raiz.add(gira);

  // Perfil de la llanta (radio, profundidad) girado alrededor de Y
  const W = 0.34; // media anchura
  const p = [];
  const perfil = [
    [0.64, -W + 0.03], [0.70, -W], [0.80, -W - 0.008], [0.90, -W + 0.004], [0.955, -W + 0.03], [0.985, -W + 0.07],
    [0.995, -W + 0.12], [0.998, 0], [0.995, W - 0.12], [0.985, W - 0.07], [0.955, W - 0.03], [0.90, W - 0.004],
    [0.80, W + 0.008], [0.70, W], [0.64, W - 0.03]
  ];
  perfil.forEach(([r, y]) => p.push(new THREE.Vector2(r, y)));
  const llantaGeo = new THREE.LatheGeometry(p, 128);
  llantaGeo.rotateX(Math.PI / 2); // eje → Z
  const llanta = new THREE.Mesh(llantaGeo, M.caucho);
  gira.add(llanta);

  // Tacos del dibujo (2 filas en V)
  const tacoGeo = new RoundedBoxGeometry(0.075, 0.05, 0.2, 2, 0.016);
  const N = 72;
  const tacos = new THREE.InstancedMesh(tacoGeo, M.cauchoTaco, N * 2);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), pos = new THREE.Vector3(), esc = new THREE.Vector3(1, 1, 1);
  let k = 0;
  for (let i = 0; i < N; i++) {
    for (let lado = -1; lado <= 1; lado += 2) {
      const a = (i / N) * Math.PI * 2 + (lado > 0 ? Math.PI / N : 0);
      pos.set(Math.cos(a) * 0.99, Math.sin(a) * 0.99, lado * 0.135);
      e.set(0, 0, a + Math.PI / 2);
      q.setFromEuler(e);
      const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), lado * 0.5);
      q.multiply(q2);
      m4.compose(pos, q, esc);
      tacos.setMatrixAt(k++, m4);
    }
  }
  gira.add(tacos);

  // Letras del costado (ambos lados)
  const tex = texturaCostado(texto);
  const letraMat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.7, metalness: 0, depthWrite: false });
  const aro = new THREE.RingGeometry(0.66, 0.95, 128, 1);
  // UVs planos (x,y) → [0,1]
  const uv = aro.attributes.uv, ps = aro.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, ps.getX(i) / 1.9 + 0.5, ps.getY(i) / 1.9 + 0.5);
  const letrasFrente = new THREE.Mesh(aro, letraMat);
  letrasFrente.position.z = W + 0.012;
  gira.add(letrasFrente);
  const letrasAtras = letrasFrente.clone();
  letrasAtras.rotation.y = Math.PI; letrasAtras.position.z = -W - 0.012;
  gira.add(letrasAtras);

  // Rin: barril + cara de 5 rayos extruida
  const matRin = rinColor === 'oscuro' ? M.rinOscuro : M.rin;
  const barril = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.56, 96, 1, true), new THREE.MeshStandardMaterial({ color: 0x55595f, metalness: 1, roughness: 0.4, side: THREE.DoubleSide }));
  barril.rotation.x = Math.PI / 2;
  gira.add(barril);

  const cara = new THREE.Shape();
  cara.absarc(0, 0, 0.635, 0, Math.PI * 2, false);
  const rayos = 5;
  for (let i = 0; i < rayos; i++) {
    const a0 = (i / rayos) * Math.PI * 2 + 0.24, a1 = ((i + 1) / rayos) * Math.PI * 2 - 0.24;
    const h = new THREE.Path();
    const rIn = 0.24, rOut = 0.56;
    h.moveTo(Math.cos(a0 + 0.1) * rIn, Math.sin(a0 + 0.1) * rIn);
    h.lineTo(Math.cos(a0) * rOut, Math.sin(a0) * rOut);
    h.absarc(0, 0, rOut, a0, a1, false);
    h.lineTo(Math.cos(a1 - 0.1) * rIn, Math.sin(a1 - 0.1) * rIn);
    h.absarc(0, 0, rIn, a1 - 0.1, a0 + 0.1, true);
    cara.holes.push(h);
  }
  const hub = new THREE.Path(); hub.absarc(0, 0, 0.075, 0, Math.PI * 2, true); cara.holes.push(hub);
  const caraGeo = new THREE.ExtrudeGeometry(cara, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 4, curveSegments: 48 });
  const caraMesh = new THREE.Mesh(caraGeo, matRin);
  caraMesh.position.z = 0.16;
  gira.add(caraMesh);

  // Labio exterior del rin
  const labio = new THREE.Mesh(new THREE.TorusGeometry(0.635, 0.022, 16, 128), matRin);
  labio.position.z = 0.235;
  gira.add(labio);

  // Birlos
  const birloGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.06, 6);
  birloGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 5;
    const b = new THREE.Mesh(birloGeo, M.cromo);
    b.position.set(Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0.255);
    gira.add(b);
  }
  // Tapón central amarillo
  const tapon = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.075, 0.05, 48).rotateX(Math.PI / 2), M.senal);
  tapon.position.z = 0.26;
  gira.add(tapon);

  // Disco de freno ventilado (gira) + caliper amarillo (fijo)
  const discoShape = new THREE.Shape(); discoShape.absarc(0, 0, 0.5, 0, Math.PI * 2, false);
  const hueco = new THREE.Path(); hueco.absarc(0, 0, 0.2, 0, Math.PI * 2, true); discoShape.holes.push(hueco);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, r = i % 2 ? 0.34 : 0.41;
    const o = new THREE.Path(); o.absarc(Math.cos(a) * r, Math.sin(a) * r, 0.016, 0, Math.PI * 2, true); discoShape.holes.push(o);
  }
  const disco = new THREE.Mesh(new THREE.ExtrudeGeometry(discoShape, { depth: 0.07, bevelEnabled: false, curveSegments: 48 }), M.disco);
  disco.position.z = -0.02;
  gira.add(disco);

  const caliper = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.36, 0.2, 3, 0.05), M.senal);
  caliper.position.set(0.37, 0.24, 0.02);
  caliper.rotation.z = -0.58;
  raiz.add(caliper);

  if (conPesa) {
    const pesa = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.05, 0.05, 2, 0.012), M.cromo);
    pesa.position.set(0, 0.6, 0.22);
    gira.add(pesa);
  }

  raiz.userData.gira = gira;
  raiz.userData.caliper = caliper;
  return raiz;
}

// ---------- Resorte + amortiguador ----------
export function hacerSuspension() {
  const g = new THREE.Group();
  class Helice extends THREE.Curve {
    getPoint(t, out = new THREE.Vector3()) {
      const vueltas = 6.5, a = t * Math.PI * 2 * vueltas;
      return out.set(Math.cos(a) * 0.36, -0.95 + t * 1.9, Math.sin(a) * 0.36);
    }
  }
  const resorte = new THREE.Mesh(new THREE.TubeGeometry(new Helice(), 420, 0.055, 16, false), M.senal);
  g.add(resorte);
  const cuerpo = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.15, 48), M.negroMate);
  cuerpo.position.y = -0.38; g.add(cuerpo);
  const vastago = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 32), M.cromo);
  vastago.position.y = 0.55; g.add(vastago);
  const plato1 = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.05, 64), M.rinOscuro);
  plato1.position.y = 1.0; g.add(plato1);
  const plato2 = plato1.clone(); plato2.position.y = -0.98; g.add(plato2);
  const ojo = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.045, 16, 48), M.negroMate);
  ojo.position.y = -1.08; g.add(ojo);
  g.scale.setScalar(0.85);
  g.userData.resorte = resorte;
  return g;
}

// ---------- Volante ----------
export function hacerVolante() {
  const g = new THREE.Group();
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.1, 24, 128), M.negroMate);
  g.add(aro);
  const costura = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.103, 8, 128, Math.PI * 0.28), M.senal);
  costura.rotation.z = Math.PI / 2 - Math.PI * 0.14; g.add(costura);
  const centro = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.16, 48).rotateX(Math.PI / 2), M.negroMate);
  g.add(centro);
  const logo = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 48).rotateX(Math.PI / 2), M.senal);
  logo.position.z = 0.09; g.add(logo);
  [[0, -1], [-0.87, 0.5], [0.87, 0.5]].forEach(([x, y], i) => {
    if (i === 0) {
      const r = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.6, 0.08, 2, 0.03), M.rinOscuro);
      r.position.set(0, -0.52, 0); g.add(r);
    } else {
      const r = new THREE.Mesh(new RoundedBoxGeometry(0.6, 0.18, 0.08, 2, 0.03), M.rinOscuro);
      r.position.set(x * 0.52, -0.06, 0); r.rotation.z = x > 0 ? -0.22 : 0.22; g.add(r);
    }
  });
  return g;
}

// ---------- Disco + caliper (frenos) ----------
export function hacerFreno() {
  const g = new THREE.Group();
  const s = new THREE.Shape(); s.absarc(0, 0, 0.9, 0, Math.PI * 2, false);
  const h = new THREE.Path(); h.absarc(0, 0, 0.36, 0, Math.PI * 2, true); s.holes.push(h);
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * Math.PI * 2, r = [0.55, 0.66, 0.77][i % 3];
    const o = new THREE.Path(); o.absarc(Math.cos(a) * r, Math.sin(a) * r, 0.028, 0, Math.PI * 2, true); s.holes.push(o);
  }
  const disco = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, curveSegments: 64 }), M.disco);
  disco.position.z = -0.06;
  const campana = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 64).rotateX(Math.PI / 2), M.rinOscuro);
  campana.position.z = 0.08;
  const gira = new THREE.Group(); gira.add(disco, campana);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 12).rotateX(Math.PI / 2), M.cromo);
    b.position.set(Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0.22); gira.add(b);
  }
  g.add(gira);
  const caliper = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.7, 0.36, 4, 0.08), M.senal);
  caliper.position.set(0.62, 0.42, 0); caliper.rotation.z = -0.6;
  g.add(caliper);
  g.userData.gira = gira;
  return g;
}

// ---------- Llave combinada ----------
export function hacerLlave() {
  const s = new THREE.Shape();
  const cx = -1.2, R = 0.29;
  s.moveTo(-0.95, -0.09); s.lineTo(0.95, -0.09);
  s.absarc(1.12, 0, 0.24, Math.PI + 0.38, Math.PI - 0.38, false);
  s.lineTo(-0.95, 0.09);
  // cabeza de boca abierta
  s.absarc(cx, 0, R, 0.32, Math.PI - 0.62, false);
  s.lineTo(cx - 0.3, 0.115);
  s.lineTo(cx - 0.02, 0.115);
  s.absarc(cx - 0.02, 0, 0.115, Math.PI / 2, -Math.PI / 2, true);
  s.lineTo(cx - 0.3, -0.115);
  s.absarc(cx, 0, R, Math.PI + 0.62, Math.PI * 2 - 0.32, false);
  s.lineTo(-0.95, -0.09);
  const anillo = new THREE.Path(); anillo.absarc(1.12, 0, 0.13, 0, Math.PI * 2, true); s.holes.push(anillo);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4, curveSegments: 48 });
  geo.center();
  const mat = M.cromo.clone(); mat.roughness = 0.16;
  const g = new THREE.Group(); g.add(new THREE.Mesh(geo, mat));
  const tuerca = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 6).rotateX(Math.PI / 2), M.senal);
  tuerca.position.set(0.7, -0.55, 0.1);
  g.add(tuerca);
  g.userData.tuerca = tuerca;
  g.scale.setScalar(0.8);
  return g;
}

// ---------- Láser de alineadora ----------
export function hacerLaser(alto = 2.6) {
  const geo = new THREE.PlaneGeometry(0.018, alto);
  const mat = new THREE.MeshBasicMaterial({ color: C.laserRojo.clone(), transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  const linea = new THREE.Mesh(geo, mat);
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.12, alto), new THREE.MeshBasicMaterial({ color: C.laserRojo.clone(), transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false }));
  const g = new THREE.Group(); g.add(halo, linea);
  g.userData.setColor = (c) => { mat.color.copy(c); halo.material.color.copy(c); };
  return g;
}

