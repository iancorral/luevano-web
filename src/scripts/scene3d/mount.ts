import type { ServicePiece } from '@/data/services';

// Descarga three.js solo cuando el contenedor está por aparecer en pantalla.
// Si no hay WebGL, marca el contenedor para que el diseño se acomode sin la pieza.
export function mountStageWhenNear(container: HTMLElement, getActive: () => ServicePiece): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mount = async () => {
    try {
      const fontFamily =
        getComputedStyle(document.documentElement).getPropertyValue('--font-display').trim() || 'sans-serif';
      await document.fonts.load(`700 46px ${fontFamily}`).catch(() => undefined);
      const { mountServiceStage } = await import('./stage');
      mountServiceStage({ container, getActive, reducedMotion, fontFamily });
      container.dataset.stage = 'ready';
    } catch {
      container.dataset.stage = 'unavailable';
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void mount();
      }
    },
    { rootMargin: '400px 0px' },
  );
  observer.observe(container);
}
