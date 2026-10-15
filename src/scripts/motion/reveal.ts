import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const START = 'top 88%';

function revealHeadings(): void {
  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((heading) => {
    SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: heading, start: START, once: true },
        }),
    });
  });
}

function revealBlocks(): void {
  const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(blocks, { autoAlpha: 0, y: 28 });
  ScrollTrigger.batch(blocks, {
    start: START,
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });
}

// La foto se descubre de abajo hacia arriba, como la cortina del taller.
function revealImages(): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal-image]').forEach((frame) => {
    const image = frame.querySelector('img');
    gsap
      .timeline({ scrollTrigger: { trigger: frame, start: 'top 85%', once: true } })
      .fromTo(
        frame,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' },
      )
      .fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2);

    if (image) {
      gsap.fromTo(
        image,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    }
  });
}

function drawKickerLines(): void {
  gsap.utils.toArray<HTMLElement>('[data-kicker]').forEach((kicker) => {
    gsap.fromTo(
      kicker,
      { '--line-progress': 0 },
      {
        '--line-progress': 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: kicker, start: START, once: true },
      },
    );
  });
}

function countUp(): void {
  gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo);
    const decimals = Number(el.dataset.decimals ?? 0);
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: START, once: true },
      onUpdate: () => {
        el.textContent = counter.value.toFixed(decimals);
      },
    });
  });
}

export function initReveals(): void {
  revealHeadings();
  revealBlocks();
  revealImages();
  drawKickerLines();
  countUp();
}
