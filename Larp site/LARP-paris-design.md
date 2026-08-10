# LARP.PARIS — Design System

> Architectural, intellectual, dark. Theatre without a stage — a digital space that feels like one.

---

## 0. Philosophy

The visual language mirrors the LARP experience itself: you arrive in darkness and things reveal themselves slowly. Nothing is decorative. Every element earns its place. The grid is strict, the palette is monochrome, and restraint is the primary creative tool.

**Three non-negotiables:**
1. No rounded corners — ever. 0px border-radius everywhere.
2. No color — ever. Except Qualia (see §7).
3. No magic numbers — every value comes from a token.

---

## 1. Color Tokens

### Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0c0c0c` | Page background — near-black, slight warmth |
| `--surface` | `#141414` | Elevated surfaces (future: cards, drawers) |
| `--border` | `rgba(255,255,255,0.07)` | Dividers, outlines |
| `--text-1` | `#f0f0f0` | Primary text — softer than pure white |
| `--text-2` | `#888888` | Secondary text (body, descriptions) |
| `--text-3` | `#484848` | Tertiary text (labels, captions, meta) |
| `--white` | `#ffffff` | Interactive elements, button hover states |
| `--black` | `#000000` | Inverted button text |

### Rules
- `--bg` is the only background color used on the page.
- Gray tones are **text-only** — never used as backgrounds or fills.
- The border token is applied via `rgba` so it works on any surface without manual adjustment.
- Never use hex values directly in CSS — always reference a token.

---

## 2. Typography

### Font
**Proxima Nova** via Adobe Fonts (Typekit kit: `dry2ghs`)

```html
<link rel="stylesheet" href="https://use.typekit.net/dry2ghs.css">
```

```css
font-family: "proxima-nova", system-ui, -apple-system, sans-serif;
```

### Weight Vocabulary

| Weight | Value | Personality |
|---|---|---|
| Thin | 100 | Ghost / barely there |
| Light | 300 | Editorial, manifesto |
| Regular | 400 | Body copy |
| Semibold | 600 | Labels, uppercase tags |
| Bold | 700 | Names, subheadings |
| Extrabold | 800 | Section titles, show names |
| Black | 900 | Hero display, maximum impact |

**Contrast rule:** Within a single headline, pair opposing weights. Example: **LARP** (900) + .PARIS (300). This mirrors the logo's logic and creates visual hierarchy within a single typographic element.

### Type Scale

| Token | Value | Weight | Usage |
|---|---|---|---|
| `--t-label` | `0.68rem` | 600 | Section labels, uppercase tags, button text |
| `--t-sm` | `0.875rem` | 400 | Credits, meta, FAQ answers, captions |
| `--t-body` | `1rem` | 400 | Standard body copy |
| `--t-body-lg` | `1.15rem` | 300 | Intro text, manifesto support, taglines |
| `--t-heading` | `clamp(1.4rem, 2.5vw, 2rem)` | 700 | Show titles (text), team names, edu headings |
| `--t-display` | `clamp(2.4rem, 5vw, 4rem)` | 800 | Show titles (display), contact name, manifesto |
| `--t-hero` | `clamp(2.75rem, 7vw, 6rem)` | 900 | Hero headline (`.hero-headline`) — see §6.8 |

### Line Height
| Context | Value |
|---|---|
| Body text | `1.8` |
| Large / display | `1.2–1.3` |
| Labels / caps | `1.5–1.6` |
| Lists | `2.0` |

### Other Rules
- `font-style: normal` forced on `em` and `i` — no italics anywhere.
- `letter-spacing: 0.32em` on all uppercase labels (`--t-label`).
- `-webkit-font-smoothing: antialiased` on `body`.

---

## 3. Spacing Scale

Base unit: **8px**

| Token | Value | Named Use |
|---|---|---|
| `--s-1` | `4px` | Icon gaps, tight nudges |
| `--s-2` | `8px` | Nav padding, small gaps |
| `--s-3` | `16px` | Default element padding |
| `--s-4` | `24px` | Standard card padding |
| `--s-5` | `32px` | Component gap |
| `--s-6` | `48px` | Section sub-spacing |
| `--s-7` | `64px` | Between major elements |
| `--s-8` | `80px` | Section interior |
| `--s-9` | `96px` | Large interior |
| `--s-10` | `128px` | Between sections (non-responsive) |
| `--s-11` | `160px` | Maximum fixed gap |

### Section Padding
```css
--section-y: clamp(80px, 12vw, 160px);
```
Applied as `padding-top` and `padding-bottom` on every `<section>`.

### Mosaic Gap
Photo grid gap: **3px** (fixed). Not a token — this is a deliberate "hair gap" that reads as a single editorial unit.

---

## 4. Layout

### Container
```css
--container-max: 1200px;
--container-pad: clamp(24px, 5vw, 80px);
```

```css
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-pad);
}
```

### Full-Bleed Pattern
Elements that need to break out of the container (photo mosaics):
```css
margin: 0 calc(-1 * var(--container-pad));
```

### Responsive Breakpoints

| Name | Value | What changes |
|---|---|---|
| Tablet | `900px` | Team grid collapses to 1 column |
| Mobile nav | `768px` | Nav becomes full-screen overlay |
| Mobile | `600px` | Team cards stack vertically, mosaic collapses to 1 column |
| Small mobile | `480px` | Base font-size: 15px |

---

## 5. Motion

### Tokens
```css
--ease:     cubic-bezier(0.16, 1, 0.3, 1);   /* Expressive — overshoots slightly */
--ease-std: cubic-bezier(0.4, 0, 0.2, 1);    /* Material standard — smooth */
```

### Scroll Reveal (`.reveal`)
Elements start hidden and emerge as the user scrolls:
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.85s var(--ease), transform 0.85s var(--ease);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```
Triggered via `IntersectionObserver` with `rootMargin: '0px 0px -80px 0px'`.

### Stagger
Sibling elements (team cards) stagger with `80ms` per child:
```js
card.style.transitionDelay = `${i * 0.08}s`;
```

### Hero Entrance
Keyframe animation on page load (not scroll-triggered):
```css
@keyframes heroIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Logo: `1.6s delay 0.3s` → tagline: `1.6s delay 0.8s` → scroll cue: `1s delay 1.8s`

### Standard Transitions
| Property | Duration | Easing |
|---|---|---|
| Hover color / bg | `0.28s` | `--ease-std` |
| Nav link underline | `0.35s` | `--ease` |
| Image scale | `0.7s` | `--ease` |
| FAQ max-height | `0.45s` | `--ease` |
| Header backdrop | `0.4s` | `--ease-std` |

---

## 6. Components

### 6.1 Button

```css
.btn {
  display: inline-block;
  border: 1px solid var(--white);
  border-radius: 0;                        /* Non-negotiable */
  padding: 11px 28px;
  font-family: var(--font);
  font-size: var(--t-label);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--white);
  background: transparent;
  cursor: pointer;
  transition: background 0.28s var(--ease-std), color 0.28s var(--ease-std);
}

.btn:hover {
  background: var(--white);
  color: var(--black);
}
```

| State | Visual |
|---|---|
| Default | Transparent bg, white border, white text |
| Hover | White bg, black text — sharp inversion |
| Focus | Same as hover + browser focus ring (do not suppress) |
| Disabled | `opacity: 0.35`, `pointer-events: none` |

**Rules:**
- `border-radius: 0` always — no exceptions
- Hover is a full inversion — no intermediate states
- Text is always uppercase + letter-spaced

---

### 6.2 Nav Link

```css
#main-nav a {
  font-size: var(--t-label);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-1);
  text-decoration: none;
  padding: var(--s-2) var(--s-3);
  position: relative;
}

#main-nav a::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: var(--s-3);
  right: var(--s-3);
  height: 1px;
  background: var(--white);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease);
}

#main-nav a:hover::after { transform: scaleX(1); }
```

| State | Visual |
|---|---|
| Default | White text, no underline |
| Hover | Underline slides in from left (scaleX 0→1) |

---

### 6.3 Section Label

A repeated typographic component used to identify sections.

```css
.section-label {
  display: block;
  font-size: var(--t-label);
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: clamp(40px, 6vw, 72px);
}
```

Always placed as the first element inside `.container` before section content. Uses `--text-3` (darkest gray) to create maximum contrast with the content below.

---

### 6.4 Photo Mosaic (Gallery)

Layout for showing a performance's photography. Full-bleed (breaks out of container).

**Structure:**
```
[ mosaic-hero: full width, taller ]     ← main image
[ mosaic-sm ]  [ mosaic-sm ]            ← 2 secondary images, 3px gap
```

```css
.show-mosaic {
  margin: 0 calc(-1 * var(--container-pad)) var(--s-6);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mosaic-hero {
  width: 100%;
  height: clamp(240px, 44vw, 520px);
  overflow: hidden;
}

.mosaic-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.mosaic-sm { height: clamp(140px, 24vw, 280px); overflow: hidden; }
```

**Image rules:**
```css
.show-mosaic img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);  /* B&W always */
  transition: transform 0.7s var(--ease), filter 0.5s var(--ease-std);
}

.show-mosaic img:hover {
  transform: scale(1.04);
  filter: grayscale(1) contrast(1.1);  /* STAY grayscale on hover */
}
```

**Qualia exception — see §7.**

**Mobile collapse:** At `600px`, `mosaic-row` becomes `grid-template-columns: 1fr` (single column).

---

### 6.5 Team Card

```
[ photo 140×140 ] [ name + role + bio ]
```

```css
.team-card {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--s-5);
  align-items: start;
}

.team-photo {
  width: 140px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.team-photo img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top center;
  filter: grayscale(1) contrast(1.05);
  transition: transform 0.7s var(--ease);
}

.team-card:hover .team-photo img {
  transform: scale(1.04);
  /* Filter stays grayscale — no color on hover */
}
```

| Element | Style |
|---|---|
| Name | `--t-heading`, weight 700 |
| Role | `--t-label`, weight 600, uppercase, `--text-3` |
| Bio | `--t-sm`, weight 400, `--text-2`, `line-height: 1.8` |

Team grid: `grid-template-columns: 1fr 1fr` (desktop) → `1fr` (below 900px) → photo stacks above text (below 600px).

---

### 6.6 FAQ Accordion

Expandable Q&A with `aria-expanded` and animated `max-height`.

```css
.faq-question {
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  background: none; border: none;
  color: var(--text-1);
  font-size: var(--t-body); font-weight: 600;
  text-align: left;
  padding: var(--s-4) 0;
  cursor: pointer;
}

.faq-icon {
  font-weight: 300;
  color: var(--text-3);
  transition: transform 0.35s var(--ease);
}

.faq-question[aria-expanded="true"] .faq-icon {
  transform: rotate(45deg);
  color: var(--text-2);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.45s var(--ease);
}
```

JavaScript pattern:
```js
btn.setAttribute('aria-expanded', !expanded);
icon.textContent = expanded ? '+' : '−';
answer.style.maxHeight = expanded ? null : answer.scrollHeight + 'px';
```

Only one answer open at a time (close others on open).

---

### 6.7 Contact Link

Behaves like a button but anchors to email/phone/social.

```css
.contact-link {
  display: inline-block;
  text-decoration: none;
  color: var(--text-1);
  font-size: var(--t-sm); font-weight: 500;
  letter-spacing: 0.05em;
  padding: 11px var(--s-4);
  border: 1px solid var(--border);
  border-radius: 0;
  transition: background 0.28s var(--ease-std),
              color 0.28s var(--ease-std),
              border-color 0.28s var(--ease-std);
}

.contact-link:hover {
  background: var(--white);
  color: var(--black);
  border-color: var(--white);
}
```

Starts with `--border` (subtle), inverts to full white on hover. Same inversion logic as `.btn`.

---

### 6.8 Hero Headline

The hero previously only carried the logo and a small tagline, leaving `--t-hero` (defined above) unused. It now opens with a two-line headline that uses the reserved token and follows the same weight-contrast logic as `.contact-name` / `.contact-name-thin`.

```css
.hero-headline {
  margin-top: var(--s-4);
  font-size: var(--t-hero);
  line-height: 1.08;
  letter-spacing: -0.01em;
}

.hero-headline-thin { font-weight: 300; }
.hero-headline-bold { font-weight: 900; }
```

Markup: an `<h1>` with two `<span>` lines — the setup at weight 300, the payoff at weight 900. Enters via the same `heroIn` keyframe as the logo/tagline, sequenced between them (see §5 Hero Entrance timing below).

**Updated hero entrance sequence** (§5): logo `0.3s` → headline `0.7s` → tagline `1.15s` → scroll cue `2.1s` (line grow `2.7s`). Several sizing changes keep the four stacked hero elements clear of the absolutely-positioned `.scroll-cue` on shorter viewports: the logo shrank (`clamp(120px, 16vw, 200px)`, was `clamp(160px, 26vw, 300px)`); `--t-hero` itself was scaled down (`clamp(2.75rem, 7vw, 6rem)`, was `clamp(3.5rem, 9vw, 8rem)`) since it's now consumed by a two-line headline rather than reserved for a short display word; `#hero` top padding is `clamp(96px, 14vh, 120px)`, bottom padding `--s-11` (a deliberately large reserve so the scroll cue never crowds the tagline even when the hero content is vertically centered in a short viewport); element margins are `--s-4`; headline `line-height: 1.08`.

---

## 7. Photography Rules

### Default (all shows except Qualia)
```css
filter: grayscale(1) contrast(1.05);
```
- Always B&W — on rest AND on hover
- Hover: `transform: scale(1.04)` only — no filter change
- This rule is absolute. No exceptions for "nice" color photos.

### Qualia Exception
Qualia is a show about color perception — experiencing color for the first time. The website mirrors the concept: Qualia photos appear in full color in an otherwise monochromatic world.

```css
.show-block--qualia .show-mosaic img {
  filter: contrast(1.05);  /* No grayscale — full color */
}

.show-block--qualia .show-mosaic img:hover {
  transform: scale(1.04);
  filter: contrast(1.1);
}
```

Applied via the `.show-block--qualia` modifier class on the article element.

**This is the ONLY place color appears in the UI.**

---

## 8. Header Behavior

The header is fixed and has two states:

**Default (at top of page):**
- Transparent background
- Logo hidden (hero section has its own logo)

**Compact (scrolled > 60px):**
```css
#site-header.is-compact {
  background: rgba(12, 12, 12, 0.90);
  backdrop-filter: blur(20px);
}
```

**Logo handoff:**
The logo appears in the header only after the hero logo scrolls out of view — observed via `IntersectionObserver`. The two logos never appear simultaneously.

```css
#header-logo-img {
  opacity: 0;
  transition: opacity 1.2s var(--ease-std);
}
#header-logo-img.visible { opacity: 1; }
```

---

## 9. Accessibility Notes

- All interactive elements (buttons, links) must be keyboard-navigable
- FAQ buttons use `aria-expanded` (true/false)
- Nav toggle uses `aria-expanded` and `aria-label`
- Never suppress `outline` on focused elements — the dark theme provides sufficient contrast for the default browser ring
- All images must have descriptive `alt` text
- `role="region"` on FAQ answer panels

---

## 10. What Not to Do

| ❌ Don't | ✅ Do instead |
|---|---|
| Add `border-radius` to anything | Keep 0px always |
| Use color on any element outside Qualia | Keep it grayscale |
| Let team/gallery photos show color on hover | Scale only, no filter change |
| Use hardcoded hex values in CSS | Reference a `--token` |
| Use hardcoded `px` sizes for type or spacing | Use `--t-*` or `--s-*` tokens |
| Add italic text | `font-style: normal` on `em` and `i` |
| Use `border-radius > 0` on buttons | `border-radius: 0` always |
| Use different font families | Proxima Nova only, with system fallback |

---

*Last updated: August 2026*
