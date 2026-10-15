import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { getGreeting, getOpenStatus } from '@/lib/hours';

function buildHeroTimeline(hero: HTMLElement): gsap.core.Timeline {
  const timeline = gsap.timeline({ paused: true });
  const title = hero.querySelector<HTMLElement>('[data-hero-title]');
  const image = hero.querySelector<HTMLElement>('[data-hero-image]');
  const fades = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');

  if (title) {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    timeline.from(split.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0);
    timeline.fromTo(
      title,
      { '--underline': 0 },
      { '--underline': 1, duration: 0.9, ease: 'power3.inOut' },
      0.6,
    );
  }
  if (fades.length) {
    timeline.from(fades, { y: 16, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.3);
  }
  if (image) {
    timeline.from(image, { scale: 1.12, duration: 2.4, ease: 'power2.out' }, 0);
    gsap.to(image, {
      yPercent: 7,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
  return timeline;
}

function getShutterGreeting(): string {
  try {
    return `${getGreeting()} · ${getOpenStatus().label}`;
  } catch {
    return 'Taller familiar en la Campesina';
  }
}

export function playIntro(): void {
  const root = document.documentElement;
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const heroTimeline = hero ? buildHeroTimeline(hero) : null;
  const shutter = document.querySelector<HTMLElement>('[data-shutter]');

  if (!shutter || root.dataset.intro !== 'pending') {
    shutter?.remove();
    heroTimeline?.play();
    return;
  }

  const greeting = shutter.querySelector('[data-shutter-greeting]');
  if (greeting) greeting.textContent = getShutterGreeting();

  gsap
    .timeline({
      onComplete: () => {
        shutter.remove();
        delete root.dataset.intro;
      },
    })
    .from('[data-shutter-center]', { y: 12, autoAlpha: 0, duration: 0.45, ease: 'power2.out' })
    .to(shutter, { yPercent: -102, duration: 0.95, ease: 'power3.inOut', delay: 0.55 })
    .add(() => {
      heroTimeline?.play();
    }, '-=0.55');
}
