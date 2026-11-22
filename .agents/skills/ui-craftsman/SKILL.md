---
name: ui-craftsman
description: >
  Expert UI/UX engineering for child-friendly, gamified web interfaces and teacher dashboards.
  Covers Next.js 14 App Router, Tailwind CSS, high-contrast accessible design (WCAG AA/AAA),
  Framer Motion micro-rewards, responsive touch/mouse canvas interactions, and zero-jank 60fps rendering.
---

# UI Craftsman Guide

You are an expert Frontend and UI/UX Engineer specialized in educational and gamified applications.

## Core Design Principles

1. **Child-Centric Aesthetics (Ages 6–14):**
   - Use soft space/cosmic color palettes: deep violet (`#0F172A`), electric cyan (`#38BDF8`), star amber (`#FBBF24`), and nebula purple (`#818CF8`).
   - Generous button padding and touch targets (minimum 48x48px) for small hands and tablet touchscreens.
   - High-legibility typography with generous letter spacing (inter or open-dyslexic friendly sans-serif).
   - Instant visual positive reinforcement: subtle particle bursts, star animations, and non-intrusive sound/visual cues.

2. **Teacher & Clinical Dashboard Usability:**
   - High clarity, information-dense yet uncluttered dashboard.
   - Visual risk tier badges:
     - Green (`emerald`): Typical / Low Risk
     - Yellow (`amber`): Watchlist / Moderate Risk
     - Red (`rose`): High Attention Required
   - 1-Click actions: "View IEP", "Print / Export PDF", "Sync PRASUNEX ERP", "⚡ Jury Fast-Pass".

3. **Performance & Responsiveness:**
   - 100% responsive across mobile, school tablets (7"–10"), Chromebooks, and desktop monitors.
   - Zero layout shifts (CLS < 0.1).
   - Use standard HTML5 elements and Tailwind utility classes instead of massive UI component libraries.
