import * as THREE from 'three';

export const COLORS = {
  accent: 0x3b6fe0,
  rubber: 0x121314,
  laserRed: new THREE.Color(0xff3b2f),
  laserGreen: new THREE.Color(0x3dff8f),
} as const;

export const MATERIALS = {
  rubber: new THREE.MeshStandardMaterial({ color: COLORS.rubber, roughness: 0.86, metalness: 0 }),
  tread: new THREE.MeshStandardMaterial({ color: 0x18191b, roughness: 0.78, metalness: 0 }),
  rim: new THREE.MeshPhysicalMaterial({
    color: 0xd4d7dc,
    metalness: 1,
    roughness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
  }),
  rimDark: new THREE.MeshPhysicalMaterial({ color: 0x3a3e44, metalness: 1, roughness: 0.32, clearcoat: 0.5 }),
  rimBarrel: new THREE.MeshStandardMaterial({
    color: 0x55595f,
    metalness: 1,
    roughness: 0.4,
    side: THREE.DoubleSide,
  }),
  disc: new THREE.MeshStandardMaterial({ color: 0x8d9095, metalness: 1, roughness: 0.38 }),
  accent: new THREE.MeshPhysicalMaterial({
    color: COLORS.accent,
    metalness: 0.2,
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.06 }),
  matteBlack: new THREE.MeshStandardMaterial({ color: 0x1b1c1e, metalness: 0.3, roughness: 0.6 }),
} as const;
