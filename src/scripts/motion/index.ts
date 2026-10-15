// Movimiento del sitio. Concepto: precisión de alineadora.
// Títulos que suben línea por línea, bloques que aparecen sin brincos,
// fotos que se descubren como la cortina y una franja de servicios en movimiento.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { playIntro } from './intro';
import { initReveals } from './reveal';
import { initTicker } from './ticker';
import { initScrollProgress } from './progress';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initScrollProgress();

if (!reducedMotion) {
  playIntro();
  initReveals();
  initTicker();
}

document.documentElement.classList.remove('motion-pending');
