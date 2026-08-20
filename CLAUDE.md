# Project Guide

A Next.js starter using the Pages Router, React 19, Tailwind v4, and shadcn/ui. This document describes the stack, layout, and code style so any AI assistant (or developer) can extend the project consistently.

---

## Platform-Owned Files

The platform invokes these in a strict, expected shape. **Modifying or removing the listed entries breaks how the project boots, builds, and serves — the user cannot debug the result.**

### `package.json` scripts

- **Do not modify or remove** the `dev`, `build`, and `start` entries. The platform calls them as `npm run dev`, `npm run build`, and `npm run start` — changing their command or removing them breaks the dev preview and production publish.
- **You may add new scripts** (e.g. `db:migrate`, `codegen`, `seed`) when the user's request needs them. New scripts must not shadow or rename the three reserved entries.

### `next.config.ts`

- **Do not modify or remove** these platform-required flags: `productionBrowserSourceMaps: false`, `experimental.cpus`, `experimental.workerThreads`, `typescript.ignoreBuildErrors`. They keep the build inside the container's memory budget.
- **You may add new options** (e.g. `images`, `redirects`, `headers`, additional `experimental` flags) as long as the listed ones are preserved.

### Other framework wiring — do not modify

- `tsconfig.json`, `postcss.config.*`, `next-env.d.ts`. These are fixed by the platform.

If a user's request genuinely requires changing any of the protected entries, stop and surface that to the user explicitly instead of editing silently.

---

## Stack

- **Framework:** Next.js 16 (Pages Router)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI primitives:** shadcn/ui (style: `base-nova`, base color: `neutral`)
- **Icons:** lucide-react
- **Class utilities:** `clsx` + `tailwind-merge` (combined as `cn()` in `@/lib/utils`)
- **Animation:** `gsap` + `@gsap/react` (ScrollTrigger) and `lenis` for smooth scroll — see Motion & Animation below
- **Database:** Postgres via `pg`, pooled singleton in `@/lib/db`, called from API routes only
- **Language:** TypeScript

---

## Directory Layout

```
src/
├── pages/          Next.js pages (_app, _document, index, 404, 500, api/...)
├── components/
│   ├── ui/         shadcn-generated components
│   ├── generals/   shared layout/utility components (incl. motion primitives)
│   └── landing/    page-specific composition components
├── hooks/          shared hooks (e.g. use-magnetic.ts)
├── lib/            small utilities (utils.ts, gsap.ts, db.ts)
├── constants/      static configuration (incl. motion.ts tokens)
├── styles/         globals.css
└── types/          shared TypeScript types
public/             static assets
```

## Imports

- **Path alias:** Use `@/` (maps to `src/`). Avoid relative paths like `../../`.
- **Type imports:** Use `import type { ... }` first, separated from value imports by a blank line.
- **Multiline imports:** When importing more than 4 items, put each on its own line. Add a blank line before the multiline import. Single-line imports come before multiline imports within the same category.

    ```tsx
    import type { ReactNode } from 'react'
    import type { SiteConfig } from '@/types'

    import { Fragment, useState } from 'react'
    import { cn } from '@/lib/utils'

    import {
        Container,
        Layout,
        Seo
    } from '@/components/generals'
    ```

- **Order:**
    1. Type imports
    2. External packages
    3. Internal modules via `@/`
    4. Constants
    5. Relative imports (avoid when possible)

---

## Icons

Use lucide-react. Lucide exports names without an `Icon` suffix:

```tsx
import { Check, ChevronDown, User } from 'lucide-react'

<Check className='size-4' />
```

Use consistent sizes across a page — typically `size-4` (16px), `size-5` (20px), or `size-6` (24px). Don't mix arbitrary sizes within the same UI.

---

## Components

### shadcn primitives

This project is configured to use shadcn for UI primitives (buttons, inputs, dialogs, etc). Add them with:

```bash
npx shadcn add <name>
```

The CLI installs the component into `src/components/ui/` based on the configuration in `components.json`. Aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.

**Never run `shadcn init` or `shadcn create`** — the project is already initialized with its shadcn base CSS inlined into `src/styles/globals.css` (see the `/* ejected from shadcn@... */` block). Init would re-insert `@import "shadcn/tailwind.css"`, which does not resolve in this environment and breaks the build. Never add that import manually either.

After generation, adjust formatting to match the rules above (4-space indent, single quotes, no semicolons).

### Custom components

- File names: kebab-case (`hero-section.tsx`).
- Component names: PascalCase, default-exported when there's one component per file.
- Compose Tailwind class strings with `cn()` from `@/lib/utils`.
- Prefer Tailwind utilities over inline `style`. Use `style` only for runtime-computed values.

---

## Pages Router

- Pages live in `src/pages/*.tsx`.
- `_app.tsx` wraps every page (global layout/providers).
- `_document.tsx` controls the HTML shell.
- Data fetching: prefer `getStaticProps` for static content; use `getServerSideProps` only when per-request data is required.

### Built-in utilities

These ship with the boilerplate — reuse them rather than reimplementing:

- `@/components/generals/seo` — `<Seo>` component for page `<title>`, meta description, and Open Graph tags. Use it on every page.
- `@/components/generals/layout` — page layout wrapper.
- `@/components/generals/smooth-scroll-provider` — `<SmoothScrollProvider>` (mounted once in `_app.tsx`) + `useLenis()` hook for programmatic smooth-scrolling to anchors.
- `@/components/generals/cursor` — `<Cursor>` magnetic custom cursor (mounted once in `_app.tsx`, desktop only). Add `data-cursor-hover` to any element that should trigger it.
- `@/components/generals/preloader` — `<Preloader>` intro loader (percentage counter + clip-path wipe). Only mount on `/` (or another true landing entry point), not on every page.
- `@/components/generals/split-lines` — `<SplitLines lines={string[]} />` line-by-line text reveal mask, pair with ScrollTrigger `y: '100%' → '0%'` on `.line-inner` (or a scoped variant class passed via `innerClassName`).
- `@/components/generals/reveal-image` — `<RevealImage>` clip-path + scale image reveal.

---

## Motion & Animation

GSAP is the animation engine for every scroll/reveal/hover interaction. Lenis drives smooth scroll.

- **Always import GSAP from `@/lib/gsap`**, never straight from `'gsap'`/`'@gsap/react'`. That module registers `ScrollTrigger` and `useGSAP` once (client-only guarded) and re-exports `gsap`, `ScrollTrigger`, `useGSAP`.
- **Always pull timing/easing from `@/constants/motion`** (`EASE`, `DURATION`, `STAGGER`, `TRIGGER_START`, `PRELOADER_DURATION`) instead of hardcoding numbers or easing strings, so the whole site stays choreographed to the same rhythm. Add a new named token there if a genuinely new case comes up rather than inlining a one-off value.
- **Use `useGSAP(() => {...}, { scope: ref })`** from `@/lib/gsap`, not raw `useEffect` + manual `.kill()`, for anything that creates tweens/ScrollTriggers — it auto-reverts on unmount.
- Only animate `transform`/`opacity`/`clip-path`. Never animate `width`/`height`/`margin`/`padding`/`top`/`left`.
- Magnetic hover buttons: `useMagnetic(ref)` from `@/hooks/use-magnetic`.
- Constant-speed loops (marquees, spinners) intentionally use `ease: 'none'` / CSS `animate-spin` — that's correct, not a violation of the "no linear easing" rule, which applies to reveal/entrance/exit animations.

---

## Styling

- Tailwind utilities for everything.
- Custom CSS only in `src/styles/globals.css` and only when utilities can't express it. Append to the file — never rewrite it from scratch, and never remove the inlined `/* ejected from shadcn@... */` block or add an `@import "shadcn/tailwind.css"` line.
- shadcn theme tokens are defined as CSS variables in `globals.css` — reference them via Tailwind (`bg-background`, `text-foreground`, etc.) rather than hex/HSL literals.

---

## TypeScript

- Keep types close to their use. Put cross-cutting shared types in `src/types/index.ts`.
- For component props, declare a local `interface ComponentProps { ... }` at the top of the file.
- Prefer `unknown` + narrowing over `any`.

---

This file is intended to evolve. If you (the assistant or developer) introduce a new convention, update this document so future contributors stay aligned.