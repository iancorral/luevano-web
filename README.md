# Auto Alineaciones Luevano — Website

Website for **Auto Alineaciones Luevano**, a family-owned wheel alignment and suspension
shop in Chihuahua, Mexico, open since 1968. The goal is local visibility: customers find
the shop on Google, see what it does, and call or send a WhatsApp message in one tap.

Custom website built for one client — not a template or a multi-tenant product.

---

## Features

- Home page plus one page per service (alignment, suspension, balancing, steering, brakes,
  repairs), each with its own SEO metadata and structured data.
- Service explorer as an accordion: details open right under the tapped service; on mobile
  the 3D piece moves inside the open item.
- Procedural 3D parts (three.js) that fit themselves to the frame, load only when the
  section is near and stop rendering when off screen.
- WhatsApp quote builder: the customer picks symptoms, car and day, and the message is
  composed for them.
- Open/closed status and hours computed in Chihuahua time (UTC-6).
- Motion system with GSAP (shutter intro, line-by-line headings, image reveals,
  scroll-reactive ticker) that turns off with `prefers-reduced-motion`.
- Fluid layout in `rem` that scales on large monitors and respects the browser font size.
- Mobile action bar (call · WhatsApp · directions) and a mobile menu.
- Work gallery that appears automatically when photos are added.
- `AutoRepair`, `Service` and `BreadcrumbList` JSON-LD, sitemap and robots.txt.
- Content Security Policy with hashes, plus security headers on Vercel.

---

## Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Framework | Astro 7 (static output)                           |
| Language  | TypeScript (strictest)                            |
| Styling   | Scoped CSS with design tokens (custom properties) |
| Animation | GSAP 3 (ScrollTrigger, SplitText)                 |
| 3D        | three.js                                          |
| Fonts     | Self-hosted via the Astro Fonts API (Fontsource)  |
| Images    | `astro:assets` (AVIF / WebP, responsive sizes)    |
| Testing   | Vitest                                            |
| Linting   | ESLint + Prettier                                 |
| Hosting   | Vercel                                            |

---

## Requirements

- Node.js 22.12 or later
- npm

---

## Getting started

```bash
git clone https://github.com/iancorral/luevano-web.git
cd luevano-web
npm install
npm run dev
```

The site runs at `http://localhost:4321`. No environment variables are needed.

---

## Scripts

```bash
npm run dev       # development server
npm run dev:lan   # development server visible on the local network (test on a phone)
npm run build     # type check + production build to dist/
npm run preview   # serve the production build
npm test          # unit tests (Vitest)
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Project structure

```
src/
├── config/          Business data (single source of truth) and site URL
├── data/            Content: services, suspension parts, FAQ, audiences, ticker
├── lib/             Hours, WhatsApp / Maps links, structured data (JSON-LD)
├── layouts/         BaseLayout: <head>, SEO, CSP, fonts, motion bootstrap
├── components/
│   ├── layout/      Header, Footer, mobile action bar, WhatsApp button, intro shutter
│   ├── sections/    Page sections (hero, services, quote builder, directions, ...)
│   └── ui/          Button, ArrowLink, Kicker, SectionHeader, Icon
├── scripts/
│   ├── motion/      GSAP: intro, reveals, ticker, scroll progress
│   └── scene3d/     three.js stage, auto-framing and procedural parts
├── pages/           index, [service], aviso-de-privacidad, 404, robots.txt
├── styles/          tokens.css, global.css
└── assets/images/   Photos (optimized at build time); work/ feeds the gallery
docs/                Google Business Profile playbook (Spanish, for the client)
vercel.json          Security headers and clean URLs
```

---

## Where to change things

| What                                                      | File                                        |
| --------------------------------------------------------- | ------------------------------------------- |
| Name, phones, WhatsApp, address, hours, rating, social    | `src/config/business.ts`                    |
| Site URL                                                  | `src/config/site.ts`                        |
| Services (home explorer + service pages)                  | `src/data/services.ts`                      |
| Parts list, ticker, quote builder options, FAQ, audiences | `src/data/content.ts`                       |
| Work photos                                               | `src/assets/images/work/` + `WORK_CAPTIONS` |
| Colors and spacing                                        | `src/styles/tokens.css`                     |
| Fonts                                                     | `astro.config.ts` → `fonts`                 |

---

## Conventions

- **Business data lives only in `src/config/business.ts`.** Text, links and JSON-LD are
  generated from it; never hard-code a phone number or address in markup.
- **Zero JavaScript by default.** Each component ships only the script it needs; three.js
  is a separate chunk loaded on demand.
- **Everything in `rem`.** The root size grows from 16px to 22px on wide screens.
- **Accessibility first:** 18px minimum body text, 58px buttons, high-contrast palette,
  keyboard-friendly accordion and menu, reduced-motion support.
- **Strict CSP:** no inline `style` attributes; dynamic styles go through CSSOM.
- Code, file names and identifiers in English; site copy in Mexican Spanish.

---

## Deployment

Deployed on **Vercel** from the `main` branch; every push triggers a new deployment.
Vercel detects Astro automatically (`npm run build`, output `dist/`).

While the site is served from a `*.vercel.app` URL it is marked `noindex` and robots.txt
disallows crawling, so search engines wait for the real domain. Once a custom domain is
added in Vercel, the site URL, canonical links and sitemap pick it up automatically.

---

## License

Copyright © 2026 Ian Corral. All rights reserved.

This website was developed for Auto Alineaciones Luevano, a family-owned auto repair shop
in Chihuahua, Mexico.
