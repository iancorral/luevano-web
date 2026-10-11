// Movimiento con identidad propia del taller:
//  1) Al entrar, se sube la cortina metálica del taller (una vez por visita).
//  2) Al bajar, los bloques llegan ligeramente chuecos y "se alinean".
//  3) Las fotos se descubren de abajo hacia arriba, como cuando se abre la cortina.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { estadoHorario, horaChihuahua } from './ui.js';

gsap.registerPlugin(ScrollTrigger);
const reducido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function saludo() {
  try {
    const { min } = horaChihuahua();
    const h = min / 60;
    const s = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
    return `${s} · ${estadoHorario().texto}`;
  } catch (e) { return 'Taller familiar en la Campesina'; }
}

function yaVisto() {
  try { if (sessionStorage.getItem('cortina')) return true; sessionStorage.setItem('cortina', '1'); } catch (e) { /* sin almacenamiento */ }
  return false;
}

function entradaHero() {
  gsap.from('.hero h1 .linea > span', { yPercent: 105, duration: 1, ease: 'power4.out', stagger: 0.1 });
  gsap.fromTo('.hero h1 .rotulo', { '--u': 0 }, { '--u': 1, duration: 0.9, delay: 0.6, ease: 'power3.inOut' });
  gsap.from('.h-in', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.3 });
  gsap.from('#img-hero', { scale: 1.1, duration: 2.2, ease: 'power2.out' });
}

function cortina(alTerminar) {
  const c = document.createElement('div');
  c.className = 'cortina';
  c.setAttribute('aria-hidden', 'true');
  c.innerHTML = `<div class="cortina-centro"><span class="placa"><img src="img/logo-luevano.png" alt="" width="476" height="204"></span><p>${saludo()}</p></div><span class="cortina-jaladera"></span>`;
  document.body.appendChild(c);
  const tl = gsap.timeline({ onComplete: () => { c.remove(); } });
  tl.from(c.querySelector('.cortina-centro'), { y: 12, opacity: 0, duration: 0.45, ease: 'power2.out' })
    .to(c, { yPercent: -102, duration: 0.95, ease: 'power3.inOut', delay: 0.55 })
    .add(alTerminar, '-=0.55');
  setTimeout(() => { if (c.isConnected) { c.remove(); } }, 4000); // seguro
}

export function iniciarMovimiento() {
  if (reducido()) return;

  if (yaVisto()) entradaHero(); else cortina(entradaHero);

  // Parallax suave de la foto principal
  gsap.to('#img-hero', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Bloques que llegan chuecos y se alinean
  ScrollTrigger.batch('.rv', {
    start: 'top bottom-=40', once: true,
    onEnter: (els) => gsap.fromTo(els,
      { opacity: 0, y: 26, rotate: -1.6, transformOrigin: '0% 100%' },
      { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: 'back.out(1.4)', stagger: 0.08, overwrite: true })
  });

  // La línea del kicker se dibuja como la guía de la alineadora
  document.querySelectorAll('.kicker').forEach((k) => {
    gsap.fromTo(k, { '--k': 0 }, { '--k': 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: k, start: 'top bottom-=40', once: true } });
  });

  // Fotos: se descubren de abajo hacia arriba, como la cortina
  document.querySelectorAll('.revela').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', immediateRender: false,
      scrollTrigger: { trigger: img, start: 'top bottom', once: true } });
  });
}
