# FILAZUL — Claude Code Project Brief
## Scroll-Scrubbed Cinematic Tequila Website

---

## Project Overview

A single-page website for **Filazul**, a premium tequila brand. The entire experience is a **scroll-scrubbed video** — the user scrolls and controls a pre-rendered video playhead. Text overlays animate in and out as CSS/GSAP layers on top of the video. No traditional navigation. No sections. Just one cinematic vertical scroll.

This is modelled on the Apple product page scroll experience.

---

## Brand Identity

- **Name:** FILAZUL
- **Meaning:** FILA = row / line / file (Spanish). AZUL = blue (Spanish). A row of blue agave.
- **Tagline concept:** Single vertical row of blue Weber agave against Jalisco highland soil
- **Colour palette:**
  - Primary accent: `#c9a96e` (warm gold)
  - Background: near-black `#0a0a0a`
  - Text: `#f5f0e8` (warm off-white)
  - Agave blue-grey: `#7a9ba8`
- **Typography:**
  - FILA / secondary text: **Cormorant Garamond** — Light or Light Italic (Google Fonts)
  - AZUL / FILAZUL logo text: **Cinzel** — Bold or Black weight (Google Fonts)
  - Body/UI: **Cormorant Garamond** Regular

---

## Technical Architecture

### Core Mechanic
```
User scrolls → ScrollyVideo.js reads scroll % → seeks video to matching frame
```

### Libraries Required
- **ScrollyVideo.js** — `https://cdn.jsdelivr.net/npm/scrollyvideo/dist/scrollyvideo.js`
- **GSAP** — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- **GSAP ScrollTrigger** — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- **Google Fonts** — Cormorant Garamond + Cinzel

### Video Requirements
- Format: MP4 (H.264)
- **CRITICAL export flag: `keyframes=1`** (every frame must be a keyframe — without this, seeking is choppy)
- Resolution: 1920×1080 minimum, 4K preferred
- Aspect ratio: **16:9** — use `object-fit: cover` to fill any screen
- File location: `/assets/video/filazul-master.mp4`

### File Structure
```
/filazul-web
  /assets
    /video
      filazul-master.mp4       ← the scroll-scrubbed video (keyframes=1)
    /images
      keyframe-01.jpg          ← fallback / OG image
      label-landscape.jpg      ← bottle label background (frame 7)
      bottle.png               ← product shot (frame 8)
    /fonts                     ← if self-hosting
  /css
    main.css
  /js
    main.js
  index.html
```

---

## Scroll Sequence

The video has 9 distinct visual moments. Scroll percentage is approximate.

| # | Scene | Camera | Scroll % |
|---|-------|--------|----------|
| 1 | Single agave row, top-down, portrait-fill | Overhead extreme close | 0–10% |
| 2 | Pull back, 2nd row appears | Slow aerial pullback | 10–25% |
| 3 | 8 rows visible, birds-eye | Continued pullback | 25–45% |
| 4 | Zoom reverses — push into single plant | Forward push from above | 45–60% |
| 5 | Half-plant macro, ground level | Extreme close-up low angle | 60–65% |
| 6 | Ground level, horizon emerges | Camera drops, tilts up | 65–75% |
| 7 | Bottle label landscape — brand hero image | Matches label illustration | 75–85% |
| 8 | Pull back to reveal full bottle with label | Product reveal | 85–92% |
| 9 | Push through the F in label — world inside | Camera enters letterform | 92–100% |

---

## Text Choreography

All text is a **CSS/GSAP overlay layer** — it is NOT baked into the video. Text fades in and out based on ScrollTrigger scrub positions.

| Text Element | Fade In | Fade Out | Font | Style |
|---|---|---|---|---|
| `FILA` | 17–24% | 36–43% | Cinzel | 12–14vw, weight 700, tracking 0.3em |
| `row · line · file` | 21–27% | 36–43% | Cormorant Garamond | 1.8vw, italic, #c9a96e |
| `AZUL` | 50–58% | 63–69% | Cinzel | 12–14vw, weight 700, tracking 0.3em |
| `blue · blue weber agave · tequila` | 53–59% | 63–69% | Cormorant Garamond | 1.8vw, italic, #c9a96e, low opacity |
| `FILAZUL` (logo) | 69–75% | 84–91% | Cinzel | 8vw, weight 900, tracking 0.5em |
| `jalisco highlands · méxico` | 73–78% | 84–91% | Cormorant Garamond | 1.5vw, italic, #c9a96e |

**Notes:**
- All text is centred horizontally and vertically
- Use `mix-blend-mode: screen` or `overlay` on text to help it read over bright video frames
- Text should have a very subtle `text-shadow: 0 2px 20px rgba(0,0,0,0.8)` for legibility
- Scroll % maps to GSAP ScrollTrigger `scrub: 1` progress values (0–1)

---

## ScrollyVideo.js Integration

```javascript
// Basic setup
const scrollyVideo = new ScrollyVideo({
  scrollyVideoContainer: "scrolly-video",
  src: "/assets/video/filazul-master.mp4",
  transitionSpeed: 8,
  frameThreshold: 0.5,
  cover: true,
  sticky: true,
  full: true,
  trackScroll: true,
  useWebCodecs: true,
});
```

The container `#scrolly-video` should be a full-screen fixed div. The scrollable area should be 5–6× the viewport height (controls how much physical scrolling covers the whole video).

---

## GSAP ScrollTrigger — Text Overlay Setup

```javascript
// Convert scroll % to ScrollTrigger progress values
// Scroll container total height = 500vh (adjust to match)

// Example: FILA text (in: 17%, out: 36–43%)
gsap.fromTo(".text-fila",
  { opacity: 0, y: 20 },
  {
    opacity: 1, y: 0,
    scrollTrigger: {
      trigger: ".scroll-container",
      start: "17% top",
      end: "24% top",
      scrub: 1,
    }
  }
);

gsap.fromTo(".text-fila",
  { opacity: 1 },
  {
    opacity: 0,
    scrollTrigger: {
      trigger: ".scroll-container",
      start: "36% top",
      end: "43% top",
      scrub: 1,
    }
  }
);
```

---

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- fonts, meta, css -->
</head>
<body>

  <!-- Fixed video layer -->
  <div id="scrolly-video"></div>

  <!-- Fixed text overlay layer -->
  <div id="text-overlay">
    <div class="text-layer text-fila">FILA</div>
    <div class="text-layer text-fila-sub">row · line · file</div>
    <div class="text-layer text-azul">AZUL</div>
    <div class="text-layer text-azul-sub">blue · blue weber agave · tequila</div>
    <div class="text-layer text-logo">FILAZUL</div>
    <div class="text-layer text-logo-sub">jalisco highlands · méxico</div>
  </div>

  <!-- Scroll spacer — this is what the user actually scrolls -->
  <div id="scroll-container" style="height: 500vh;"></div>

</body>
</html>
```

---

## Placeholder / Development State

Until the real video exists, use a **canvas-drawn placeholder** that:
- Draws a different background gradient for each scroll zone (mapped to the 9 scenes)
- Shows the agave reference image as a full-screen CSS background-image with parallax
- Lets you test all text choreography and scroll mechanics at real scroll positions

This placeholder was built in the previous design session and can be used as the starting codebase. See: `filazul-demo.html` (attached or in the project).

---

## Assets Status

| Asset | Status | Notes |
|-------|--------|-------|
| `filazul-master.mp4` | ⏳ In production | Prompts written, keyframes being generated |
| `agave-field.jpg` (reference) | ✅ Done | Uploaded — golden hour, terracotta soil, Jalisco |
| `label-landscape.jpg` | ⏳ Pending | Frame 7 prompt needs label image as reference |
| `bottle.png` | ⏳ Pending | Product shot for frame 8 |
| Keyframe images 01–09 | ⏳ In progress | Being generated in OpenArt / Flux 1.1 Pro |
| Video segments A–D | ⏳ Pending | Kling 1.6 (A–C), Runway Gen-3 (D) |

---

## Design References / Inspiration

- Apple iPhone product pages — scroll-scrubbed video
- Clase Azul tequila — premium brand language
- Patrón — clean product photography
- The colour relationship: blue-grey agave + terracotta red soil + warm gold (#c9a96e)

---

## Future Features (Post-Launch)

- AI chatbot integration via Anthropic API (Claude) or third-party
- Possible interactive label explorer
- Age gate on entry

---

## Known Decisions / Non-Negotiables

1. **No traditional nav bar** — the experience is the nav
2. **16:9 video, object-fit: cover** — handles all screen ratios
3. **Text overlays never baked into video** — always CSS/GSAP layers
4. **keyframes=1 on video export** — non-negotiable for smooth seeking
5. **Terracotta soil** — red-clay Jalisco soil, not limestone grey
6. **Single row hero** — compositional choice within 16:9 frame, not a format choice

---

*Brief generated from design session with Claude. Companion files: `filazul-demo.html` (working scroll prototype)*
