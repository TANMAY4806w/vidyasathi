---
name: educational-uiux
description: >
  Child-centric educational UI/UX design system and accessibility guidelines.
  Specialized for Indian elementary schools (Classes 1–8), neurodivergent students
  (Dyslexia, Dysgraphia, Dyscalculia, ADHD), and school educators under NEP 2020.
  Enforces human-crafted aesthetics (warm surfaces, accessible typography, WCAG AAA contrast)
  over generic dark AI-vibe-coder tropes.
---

# Educational UI/UX Design System Guide

You are an expert Educational UI/UX Architect designing for children, teachers, and school administrators.

## 1. Anti-Patterns to Strictly Avoid
* ❌ **NO Dark Neon "Vibe-Coded" Cyberpunk Themes:** Pitch black backgrounds (`#000000`, `#070B14`) with glowing cyan/purple/pink gradient text look like crypto trading terminals, hacker consoles, or generic AI wrappers. They intimidate children and fail educational institutional trust.
* ❌ **NO Low-Contrast Floating Text:** Never place faint gray text (`#64748B`) on dark backgrounds.
* ❌ **NO Ambiguous Icon-Only Buttons:** Every critical action must have clear, legible text paired with an icon.

## 2. Core Educational Design Tokens
* **Base Surfaces:**
  * Background: Soft, warm educational canvas (`#F8FAFC` slate-50 / `#F1F5F9` slate-100) that reduces glare under classroom lighting.
  * Card Surfaces: Pure crisp white (`#FFFFFF`) with subtle border (`border-slate-200`) and soft elevation (`shadow-sm`, `shadow-md`).
* **Brand Primary (Trust & Learning):**
  * Indigo / Royal Educational Blue (`#4338CA` / `#4F46E5`). High contrast ratio (>7:1 against white).
* **Child-Friendly Accents:**
  * Star Sunshine / Marigold (`#D97706` / `#F59E0B`): Warmth, achievement stars, subitizing games.
  * Friendly Sky / Cyan (`#0284C7`): Calm encouragement, active states.
  * Growth Emerald (`#059669`): Success, typical developmental milestones.
  * Compassionate Rose (`#E11D48`): Non-stigmatizing attention indicators.
* **Typography:**
  * Deep readable slate (`#0F172A` text-slate-900) for primary text (14:1 contrast).
  * Slate-600 (`#475569`) for descriptive copy.
  * Generous line height (`leading-relaxed`) and letter spacing (`tracking-wide` for stimulus words) for dyslexic accessibility.

## 3. Child-Centric Ergonomics (Ages 6–14)
* Touch targets minimum 48px × 48px with tactile depth (subtle active down-shift, rounded-2xl corners).
* Encouraging, friendly microcopy ("Great job! Listen for the echo!" instead of "Awaiting speech onset threshold").
* Dual-language harmony: English and Devanagari Hindi rendered with equal visual weight.
