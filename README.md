# Drilon Hoxha — Official Site

Single-page cinematic site for Drilon Hoxha (actor · director · producer · screenwriter)
and D.H Production.

**Stack:** Next.js 16 (Pages Router) · React 19 · Tailwind v4 · GSAP + ScrollTrigger · Lenis · TypeScript
**Deploy target:** Vercel

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
```

`predev` / `prebuild` clear the other mode's generated route types. Next writes dev types to `.next/dev/types` and build types to `.next/types`, and `tsconfig.json` includes both — when both exist they redeclare `PagesPageConfig` and `tsc` fails. The pre-scripts keep only one set present.

---

## Design system

- **Base** `#16181A` charcoal · **Crimson** `#C1121F` (taken from the play triangle in the D.H mark) · **Bone** `#EDEAE4`
- `--primary` (`#C1121F`) is only 2.94:1 against the background, so it is used for **fills and large display type only**. Small crimson text uses `--primary-bright` (`#F5333F`, 4.75:1) which passes WCAG AA. White on a crimson fill is 6.24:1.
- **Type:** one variable family, Archivo (weight 100–900 *and* width 62–125 in a single file), plus JetBrains Mono for metadata. Utilities in `globals.css`:
  - `.type-display` — condensed 800, poster titling
  - `.type-title` — section headings
  - `.type-meta` — mono, uppercase, wide-tracked (years, roles, reel numbers)
- Albanian needs `latin-ext`. `.line-wrapper` carries deliberate top padding: display type runs at `line-height: 0.84`, and without it the reveal mask slices the diaeresis off every uppercase `Ë`.

## Interaction

Every control is `src/components/ui/action.tsx` — a rounded pill where three things move on hover, none of them layout-affecting: a fill wipes up on `scaleY`, the label pair slides so a duplicate replaces it, and the whole control eases toward the cursor. Pass `still` to disable the magnetic pull inside the pinned filmography track, where a second transform reads as a glitch.

## Motion

All timing comes from `src/constants/motion.ts` (`EASE`, `DURATION`, `STAGGER`, `TRIGGER_START`) — never hardcode. Import GSAP from `@/lib/gsap`, never from `gsap` directly. Only `transform` / `opacity` / `clip-path` are animated.

Filmography is the only pinned section. The pin is desktop-only and motion-gated via `gsap.matchMedia()`; below `lg`, or under `prefers-reduced-motion`, the same cards render as a plain vertical stack with no pin.

## Content

`src/constants/films.ts` is the single source of truth for the filmography.
`src/constants/copy.ts` holds the Albanian/English dictionary (Albanian is default; the toggle persists to `localStorage`).

### Swapping in real posters

Cards currently use the trailers' YouTube stills, cached to `public/stills/` so the site does not depend on YouTube's CDN. Set `poster` on a film in `films.ts` to override — one field per film, no layout change.

Cards are **16:10, not poster-shaped**, because the stills are 16:9; a 2:3 portrait frame would crop them badly. If real 2:3 posters arrive, the card aspect ratio should be revisited.

To refresh a cached still:

```bash
curl -o public/stills/<slug>.jpg https://img.youtube.com/vi/<videoId>/maxresdefault.jpg
```

---

## Demo data — replace before launch

Two blocks are illustrative so the client can see the finished behaviour. Both are marked in code and **must** be replaced before this is shown publicly:

- **`src/constants/screenings.ts`** — five Ego 2 screenings across Tiranë, Prishtinë, Shkup and Durrës, with seat status and prices. There is no ticketing provider connected; each "Bli bileta" resolves to a prefilled email so nothing is a dead link. Swap `url`/`href` per row once a provider is chosen.
- **`audience` in `src/constants/site.ts`** — geography, age and gender splits. These are invented. Replace with the real figures from Instagram Insights before any sponsor sees the media kit.

## Still needed from the client

| Item | Current state |
|---|---|
| High-res posters | YouTube stills used as stand-ins |
| Real audience demographics | Placeholder figures — see above |
| Ticketing provider | Demo screenings — see above |
| Ego 2 release window | Currently stated as September 2026 (demo) |
| Sponsor / past partners | `collaborators` is empty; the strip renders nothing until filled |
| Golden Brothers trailer | Linked as full film, per the brief |
| Çimi trailer | None supplied — renders as a typographic debut card |

### Press

`src/components/sections/press.tsx` is built and mounted, driven by `src/constants/press.ts`. That array is **deliberately empty**: every entry is a claim about a real publication, so nothing goes in until the client supplies the actual link — inventing plausible coverage would fabricate a record, unlike `screenings.ts`, which mocks a mechanism. While empty the section renders nothing at all, and it appears fully formed the moment items are added.

Section numbering is derived in `src/constants/sections.ts` from one ordered list, so adding press shifts Contact from 05 to 06 automatically rather than duplicating a number or leaving a gap.

### Ticket checkout

Clicking a screening opens `src/components/film/checkout-modal.tsx`: seat tier, quantity stepper, live order summary, then a confirmation with an order reference. Pricing is calculated **server-side** in `src/pages/api/checkout.ts` — never trusted from the client — and the route rejects sold-out screenings (409) and out-of-range quantities (400).

**No card details are collected anywhere, by design.** Real Stripe Checkout never collects them on your own site; it redirects to Stripe's hosted page. To go live: set `STRIPE_SECRET_KEY`, add the `stripe` package, and replace the marked block in the API route with a Checkout Session. The client already redirects when the response contains a `url`, so **no UI changes are needed** — the demo confirmation is simply what shows while that key is absent.

### Partnership enquiries

`/partneritet` replaces the old `mailto:` hand-off with a real page: validated form (client *and* server), field-level errors wired via `aria-describedby`, success state. `src/pages/api/partner.ts` validates and logs the enquiry so nothing a visitor writes is lost during the demo. To deliver by email, set `RESEND_API_KEY` and uncomment the marked block — the payload is already assembled.

## Notes

- The supplied logo was a JPEG on solid black. `public/logo.png` is a true-alpha conversion of it; `favicon.png`, `apple-touch-icon.png` and `og.jpg` are generated from that.
- The opening is a film-leader sequence: the six titles cut past, the name resolves, then letterbox bars split to reveal the hero. It holds the scroll lock, so it carries a 7s failsafe (`FAILSAFE_MS`) that force-releases if the timeline ever stalls — rAF is paused in backgrounded tabs, and without it the page could stay unscrollable.
- The reach counters carry the same kind of guard. A stalled count-up would leave a partial figure like "26K" where the real number is "340K" — wrong data in front of a sponsor is worse than no animation, so a timeout writes the true value regardless.
- Never format dates with `toLocaleDateString`: Node and the browser resolve Albanian months differently ("18 sht" vs "18 Sept") and it breaks hydration. `formatScreeningDate` uses a fixed month table.
- Do not put a colon in the project folder path: `PATH` is colon-separated, and it breaks every npm script.
