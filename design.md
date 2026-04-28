# FILAZUL — Design System v1

---

## Vibe

Cinematic. Unhurried. The page doesn't ask for attention — it earns it.

The scroll experience is the brand. A near-black canvas, warm gold text appearing and dissolving, video scrubbing as the user moves through the page. No nav overlay, no hero banner, no "above the fold" thinking. The bottle reveal is the payoff at the end of a slow burn.

References: Apple iPhone product pages (scroll mechanic), Clase Azul (premium brand language), highland Jalisco landscape photography (color world).

---

## Color

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0a0a0a` | Base background, near-black |
| `--parchment` | `#f5f0e8` | Primary text on dark |
| `--gold` | `#c9a96e` | Accent — overlay text, dividers, borders |
| `--gold-dim` | `rgba(201,169,110,0.6)` | Secondary overlay text |
| `--gold-rule` | `rgba(201,169,110,0.3)` | Hairline dividers |
| `--terracotta` | `#d97832` | CTA buttons, nav underline, spec accents |
| `--peach` | `#f4a460` | Gradient partner to terracotta |
| `--highland-blue` | `#1a4d6d` | Product headings, image side background |
| `--sky-blue` | `#5a7ba6` | Gradient fill, mid-tone |

**The core contrast:** warm gold `#c9a96e` on near-black `#0a0a0a`. Everything else is a supporting player.

Do not use cool greys, pure white, or any default Tailwind blue/indigo. The palette is warm, earthy, with a single cool note (highland blue) for the product context.

---

## Typography

### Fonts loaded

| Family | Source | Weight(s) | Use |
|---|---|---|---|
| `worker` | Adobe Fonts (`vwf7bbs.css`) | Regular, 500 | Body, nav links, all prose |
| `Barlow Condensed` | Google Fonts | 300 (italic), 800 | Scroll overlays, scroll indicator |
| Logo | PNG image | — | Never re-render in type; always use `filazul-logo.png` |

**Barlow Condensed 800** is the headline workhorse — tight, industrial, commanding. Used for the `SCROLL` label and the logo wordmark display.

**Barlow Condensed 300 italic** is the whisper — dictionary definitions, provenance lines, the quiet detail text that rewards close reading.

**`worker`** is the utility voice — nav, body paragraphs, spec labels.

### Type scale

| Role | Size | Weight | Tracking | Font |
|---|---|---|---|---|
| Scroll overlay — main word | `clamp(0.75rem, 1.5vw, 1.05rem)` | 400 | `0.2em` | Barlow Condensed |
| Scroll overlay — sub text | `clamp(0.75rem, 1.5vw, 1.05rem)` | 300 italic | `0.08em` | Barlow Condensed |
| Scroll indicator label | `44px` | 800 | `3px` | Barlow Condensed |
| Section heading | `4rem` | — | `3px` | `worker` |
| Product heading | `3.5rem` | — | `3px` | `worker` |
| Body | `1.2–1.4rem` | 300–400 | normal | `worker` |
| Spec label | `0.85rem` | normal | `1px` | `worker` |
| Nav links | `0.9rem` | 500 | `1px` | `worker` |

### Text color rules on dark backgrounds
- Primary: `#f5f0e8`
- Accent / emphasis: `#c9a96e`
- Dim / secondary: `rgba(201,169,110,0.6)`
- Ghost / footnote: `rgba(201,169,110,0.55)` italic
- `text-shadow: 0 2px 20px rgba(0,0,0,0.8)` on all floating overlays

---

## Scroll Experience Architecture

The main experience lives in a `500vh` tall div (`#fz-track`). A `position: sticky` inner container (`#fz-sticky`) holds everything at full viewport height. The user's physical scroll drives a progress value `0→1` that:

1. Seeks the video (`assets/videos/filazul-master.mp4`) to the matching frame via canvas
2. Fades text overlays in and out based on scroll position

### Text layer choreography

| Layer | Fade in | Fade out | Content |
|---|---|---|---|
| `#row` (fila sub) | 12–17% | 36–43% | Dictionary entry for *fila* |
| `#fila` (wordmark crop) | 17–24% | 36–43% | Left half of logo |
| `#blue` (azul sub) | 44–50% | 63–69% | Dictionary entry for *azul* |
| `#azul` (wordmark crop) | 50–58% | 63–69% | Right half of logo |
| `#tag` (provenance) | 73–78% | 84–91% | Eagle SVG + "hand-crafted in the highlands" |
| `#logo` (full wordmark) | 69–75% | 84–91% | Full logo |
| `#scroll-hint` | 0% | 7% | Agave quiote + SCROLL arrow |

### Progress bar
`#pb` — 2px hairline at the bottom of the sticky frame, `background: rgba(201,169,110,0.5)`, width tracks scroll progress.

---

## Iconography & Illustration

All illustrations are inline SVG, `stroke` only (no fill), `stroke-width` 0.8–1.6.

**Mexican eagle** (`#tag`): Heraldic eagle on cactus with snake — the national coat of arms simplified to outline. `stroke="#c9a96e"`, `stroke-width="0.8"`, `opacity: 0.30`. Deliberately faint — a watermark, not a logo.

**Agave quiote** (`#scroll-hint`): Botanical cross-section of an agave flower stalk with 5 branch pairs, terminal flowers, and a rosette base. Used as the scroll cue. Pulses gold → white → gold via `scrollPulse` animation.

**Rule**: All SVG illustrations are thin-line botanical/heraldic in spirit. No filled shapes, no geometric icons. The visual language is engraved, not flat.

---

## Animation

Only animate `transform` and `opacity`. No `transition-all`. No layout animations.

| Name | Use | Timing |
|---|---|---|
| `fadeInUp` | Hero content entrance | `1.5s ease forwards`, staggered 0.5s–1.3s |
| `scrollPulse` | Scroll indicator color pulse | `2.2s ease-in-out infinite` |
| `bounce` | Legacy scroll indicator | `2s infinite` |
| Scroll text crossfades | All overlay layers | Lerp-smoothed, `requestAnimationFrame` |
| Section reveal | `.animated-section` | `1s ease`, threshold 0.2 via IntersectionObserver |

Canvas video seeking uses `lerp(prog, target, 0.075)` — a spring-style approach where fast scrolls don't drop frames.

---

## Surfaces & Z-layers

| Layer | z-index | Description |
|---|---|---|
| Canvas / video | absolute, base | Full-bleed video frame via canvas |
| Text overlays | absolute, above canvas | All `#fila`, `#azul`, `#logo`, `#tag` etc. |
| Scroll hint | z-index 10 | Agave quiote, above everything in sticky frame |
| Progress bar | absolute bottom | Gold hairline |
| Nav | z-index 1000 | Fixed, blur backdrop |

---

## Components

### Navigation
Fixed, `background: rgba(0,0,0,0.8)`, `backdrop-filter: blur(10px)`. Logo left, three links right. On scroll past 50px: `background: rgba(0,0,0,0.95)`, reduced padding. Link hover state: `#d97832` underline grows from 0→100% width.

### CTA Button
Primary: `background: linear-gradient(135deg, #d97832, #f4a460)`, `border-radius: 50px`, `padding: 1.2rem 3.5rem`. Hover: `translateY(-3px)` + `box-shadow: 0 15px 40px rgba(217,120,50,0.4)`. Ripple on `::before` (width/height expand from 0 to 300px).

Secondary: `background: transparent`, `border: 2px solid white`. Hover: subtle white fill + `border-color: #f4a460`.

### Spec Card
`border-left: 4px solid #d97832`, `background: white`, `box-shadow: 0 5px 15px rgba(0,0,0,0.1)`. Label in `#888`, value in `#1a4d6d`.

### Pillar Card
`background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(10px)`, `border: 1px solid rgba(255,255,255,0.1)`. Hover: `translateY(-10px)`, border becomes `#d97832`.

---

## Section Map

1. **Scroll experience** — 500vh, sticky canvas + text overlays. The entire brand argument.
2. **Story** — `#0a0a0a`, warm gold gradient heading, prose. `::before` light sweep on reveal.
3. **Product showcase** — Split grid. Left: highland blue gradient + bottle placeholder. Right: `#f9f9f9`, specs, CTA.
4. **Brand pillars** — `linear-gradient(135deg, #1a4d6d → #2c5f7d)`, 4-column grid, staggered reveal.
5. **CTA** — `#0a0a0a`, radial gold pulse animation, distribution call-to-action.
6. **Footer** — `#0a0a0a`, logo, nav, social icons, legal.

---

## Logo Rules

- Source file: `filazul-logo.png`
- Always use the SVG filter `#fz-font` (luminance → alpha → `#f5f0e8` fill) to render on dark backgrounds — this strips the background and colorizes the letterforms warm white.
- Minimum display width: `280px`
- Never re-render the wordmark in type. The logo font is the logo.
- Drop shadow on hero logo: `filter: drop-shadow(0 2px 24px rgba(0,0,0,0.7))`

---

## Voice (copy tone for UI text)

- Lowercase preferred for sub-labels and metadata: `hand-crafted in the highlands`, `arandas, jalisco, mexico`
- All-caps for structural labels: `SCROLL`, `FILAZUL`, section headings
- Dictionary-style definitions are the brand's signature voice — etymological, bilingual, understated
- No exclamation points outside of "enjoy!" (which is intentional, familial)
