# Nakshatra S.V Portfolio

A static, editorial portfolio for Nakshatra S.V (CSE undergraduate, Sri Shakthi Institute of
Engineering and Technology). Built with Next.js 16 (App Router, static export), React 19,
TypeScript and Tailwind CSS v4. No animation library: motion is CSS plus one small
IntersectionObserver.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run check      # lint + typecheck + content consistency
```

`out/` is a plain static site (Vercel, Netlify, any static host at a domain root).

## Where things are

```
src/content/        all facts live here, separate from presentation
  site.ts           identity + contact config (email, LinkedIn)
  projects.ts       4 featured case studies + 7 supporting projects
  logos.ts          GENERATED technology logos (npm run logos, from Simple Icons)
src/components/     Opening (hero), Marquee, SelectedWork + WorkIndex, About, Contact,
                    Gallery (cards, more builds, tools), bits (shared parts)
src/components/visuals/   per-project diagrams (Gates, Channels, Loop)
src/app/            routes: `/` (short landing), `/work` (all projects), `/work/[slug]` (case studies)
scripts/            verify-content.mjs, optimise-images.mjs, make-logos.mjs, capture-screenshots.mjs
public/evidence/    the two genuine repository images used (optimised)
```

## Structure

- **Home** is one short scroll: a one-screen hero (the name as silk, one line, two actions), a slow
  strip of the technologies used, an interactive project index (hover or focus a row and its preview
  slides into a sticky panel), a single About statement, and Contact. Nothing else.
- **/work** is an uneven grid of the four case studies, a disclosure list of smaller builds, and the
  tools grouped by what they were used for.
- **Case studies** use a label-left, text-right column layout with a sticky heading. No table of
  contents, no numbering.
- **Shape:** panels and cards are 16px radius; buttons, chips and pills are fully round. Nothing else
  rounds. Copy uses no em or en dashes.

## Real screenshots

Each project can show a real capture instead of its diagram. Run the project locally, then:

```bash
npm i -D playwright && npx playwright install chromium   # once
node scripts/capture-screenshots.mjs suraksha http://localhost:5173
```

The script writes `public/projects/<slug>.webp` and prints the `shot: { ... }` line to add to that
project in `src/content/projects.ts` (write real alt text). Today the Museum Artifact Explorer and
ExamEye already use real images from their repositories; the other projects use diagrams.

## Evidence policy

Claims on the site are traceable. Each fact and case-study decision carries a `Source` (`repo` +
`path`) in the data; these are not shown in the UI, but are checked by a script. The site also states
plainly what each project is *not* (stubs, simulations, small corpora, mocked data). No
version-control details (commit counts, history, activity) are published.

```bash
REPOS_DIR=/path/to/clones node scripts/verify-content.mjs
```

This checks that every cited path exists at `HEAD`. Requires Node ≥ 22.18 (native TypeScript type
stripping).

## Updating

- **Contact details:** `email` and `linkedin` in `src/content/site.ts` (both set, with the
  owner's consent). Set either to `null` and it disappears from the Contact section.
- **Add a first-person reflection to a case study:** set `caseStudy.reflection` in
  `src/content/projects.ts`. No first-person reflections are invented; the field is empty until the author writes one.
- **Add a live demo:** set `live` on a project. None is claimed today because no repository records
  a deployment that responds.

## Design notes

Direction: dark editorial, in the supplied palette:
**Lavender `#CBB3E8`**, **Chartreuse `#D4FF3F`**, **Tomato Red `#E34234`**, plus a deep ink
`#110D16` for text. Type: Fraunces (display) / Instrument Sans (text) / JetBrains Mono (data).

**Colour.** One dark theme in the supplied palette: a deep-ink ground (`#110D16`) with Lavender
`#CBB3E8` type and Chartreuse `#D4FF3F` / Tomato Red `#E34234` as accents (chips, highlights,
marks, progress lines). Sections are separated by slightly different dark tones, not light fields.
All text meets WCAG AA. Role variables are documented at the top of `src/app/globals.css`.

Cross-page links are plain anchors on purpose: with `output: "export"`, Next's client-side segment
prefetch requests files static hosts don't serve, which logs 404s.

Navigation is a glassmorphic top bar (translucent, blurred, lit top edge; the hero runs beneath it) with a
highlighted Chartreuse "Index" pill (shine sweep on hover, a soft pulse ring, and a hamburger that folds
into an X), which opens a glass full-screen chapter sheet. The sheet's motion is modelled on Shreekumar B's
portfolio menu: a clip-path wipe (0.45s ease-in-out) with each link rising out of its own mask, staggered
0.15s + 0.07s per item, and the same sequence in reverse on close. Focus is trapped while open and Escape
closes it. There is no side rail.

Page transitions use a **curtain**: an ink panel wipes up over the page carrying the destination's
number and name, the browser navigates underneath, and the curtain lifts off the top of the new
page. The idea is borrowed from Shreekumar B's Portfolio-X2; here it is CSS `clip-path` plus
`src/components/PageTransition.tsx` (no animation library), with state in `html[data-curtain]`. The
label travels as CSS custom properties so React hydration cannot discard it. A 700 ms fallback
guarantees navigation, a 4 s fallback guarantees the curtain can never stay stuck, and it is
disabled under `prefers-reduced-motion`. Same-page `#hash` links, new-tab links and files do not
trigger it.

The hero background (`src/components/PrismaticSlats.tsx`) is an original WebGL shader — coloured liquid
refracted through diagonal fluted-glass slats, inspired by the "Prismatic Slats" effect but written
from scratch (no library, no copied code). It renders at reduced resolution at ~30 fps only while
visible, draws one still frame under `prefers-reduced-motion`, caps its brightness so Lavender text
stays readable, and falls back to a CSS slat pattern if WebGL is unavailable.

The name in the hero (`src/components/SilkLettering.tsx`) is rendered as silk by an original WebGL shader,
modelled on the *behaviour* of a "headline cut from silk" (documented on React Bits Pro's Mesh Lettering
page; no code from it is used): a slow breeze keeps it billowing, moving the mouse sends a gust (stronger
the faster you move), clicking or tapping puffs it up at that point, and it lays itself down along a
slanted edge on arrival. The real DOM name stays in the page for accessibility and layout and is
restored if WebGL is unavailable; `prefers-reduced-motion` gets a single still, draped frame.

**Sound.** All effects are synthesized live with the Web Audio API (`src/lib/sound.ts`) — no audio files. One bus
(compressor + a short synthetic room), pitched events on a pentatonic scale so they never clash, every effect
rate-limited and quiet. Events: click ticks and hover notes on links/buttons, a rising wipe with one note per
link when the Index sheet opens (and a falling one on close), a swoosh and chime on page changes, water
when you touch the silk name — droplets and a trickle as you sweep across it (more and louder the faster
you move), a plop, splash and drips when you click it. Browsers allow audio only after a
user gesture, so nothing plays (or warns) before the first click/tap/key. A round equaliser button in the bar
toggles sound; the choice is saved in `localStorage` (`nsv-sound`). Sound is on by default — set
`DEFAULT_ON = false` in `src/lib/sound.ts` to make it opt-in.

Motion respects `prefers-reduced-motion`; scroll progress and image drift use CSS scroll-driven
animations (no scroll listeners); the pointer-weight effect in the opening is mouse-only.
