import './styles/main.css';
import { iniciarUI, estado } from './ui.js';
import { iniciarMovimiento } from './movimiento.js';

iniciarUI();
iniciarMovimiento();

// La escena 3D se carga aparte para que la página aparezca rápido.
const vista = document.getElementById('v-pieza');
const canvas = document.getElementById('gl');
if (vista && canvas) {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  import('./escena3d/index.js')
    .then(({ iniciarServicios }) => {
      iniciarServicios({ canvas, vista, reducido, obtenerServicio: () => estado.servicio });
      document.documentElement.classList.add('gl-ok');
    })
    .catch(() => canvas.remove());
}
