import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => bar.style.setProperty('--progress', self.progress.toFixed(4)),
  });
}
