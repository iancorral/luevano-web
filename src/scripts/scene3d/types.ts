import type * as THREE from 'three';

export interface Piece {
  object: THREE.Object3D;
  update: (time: number, delta: number) => void;
  // Objetos que no cuentan para encuadrar la pieza (piso, rayos láser).
  excludeFromFit?: THREE.Object3D[];
}

export const smoothstep = (x: number): number => x * x * (3 - 2 * x);
export const DEG = Math.PI / 180;
