import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Franja en movimiento constante. Al hacer scroll acelera y sigue la dirección.
export function initTicker(): void {
  gsap.utils.toArray<HTMLElement>('[data-ticker]').forEach((ticker) => {
    const track = ticker.querySelector<HTMLElement>('[data-ticker-track]');
    if (!track) return;

    const loop = gsap.to(track, { xPercent: -50, duration: 45, ease: 'none', repeat: -1, paused: true });
    // Arranca "adelantado" para poder correr en reversa sin topar con el inicio.
    loop.totalTime(loop.duration() * 100);
    let direction = 1;

    ScrollTrigger.create({
      trigger: ticker,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        direction = self.direction;
        const boost = Math.min(Math.abs(self.getVelocity()) / 350, 5);
        gsap
          .timeline({ defaults: { overwrite: 'auto' } })
          .to(loop, { timeScale: direction * (1 + boost), duration: 0.2, ease: 'power1.out' })
          .to(loop, { timeScale: direction, duration: 1.4, ease: 'power2.out' });
      },
    });
  });
}
