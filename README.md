# VidyaSathi (विद्यासाथी)

> **15-Minute Gamified Multimodal AI Early Screening Engine for Specific Learning Disabilities & Automated IEP Copilot**  
> Built for **PRASUNEX INNOVATHON 2026** — Round 3 Prototype Development  
> **Team:** Dynamic Duo (*Tanmay Patil & Rajat Gupta*)

---

## Overview

VidyaSathi addresses the critical gap in early childhood education where millions of children with Specific Learning Disabilities (Dyslexia, Dysgraphia, Dyscalculia, and ADHD) remain undiagnosed due to inaccessible, high-cost psychological testing ($100+).

VidyaSathi transforms early screening into a 15-minute, child-friendly space exploration quest that runs directly in any modern web browser on low-cost devices at **$0.00 cloud compute cost**.

---

## Key Modules & Features

1. **Star Echoes (Dyslexia Screener):** Evaluates vocal onset latency and speech pause intervals against visual stimuli using the in-browser Web Audio API.
2. **Constellation Tracing (Dysgraphia Screener):** Captures high-frequency pointer kinematics on an HTML5 canvas to detect stroke tremor, micro-jitter, and letter reversals.
3. **Comet Collector (Dyscalculia Screener):** 400ms flash subitizing exercises measuring instantaneous numerical quantity perception versus slow counting.
4. **Galactic Radar (ADHD Behavioral Focus Metric):** Passive telemetry tracking reaction time variance, hesitation pauses, and impulsive double-taps.
5. **Automated Bilingual IEP Copilot:** Powered by Google AI Studio's Gemini 1.5 Flash, generating actionable Individualized Education Programs aligned with NEP 2020 in English and Hindi in under 3 seconds.
6. **PRASUNEX Education OS Bridge:** Simulated webhook dispatcher streaming real-time diagnostic JSON payloads to institutional ERPs.
7. **Jury Fast-Pass Route (`/demo?jury=true`):** 30-second evaluation mode pre-loaded with sample student profiles for rapid hackathon jury review.

---

## Technical Architecture

* **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
* **Client-Side Edge Inference:** Web Audio API and HTML5 PointerEvent kinematics running in Web Workers.
* **Serverless Backend:** Next.js Route Handlers deployed on Vercel.
* **Generative AI:** Google AI Studio (Gemini 1.5 Flash) with Groq Cloud (Llama-3.3-70B) fallback.
* **Database & Storage:** Supabase PostgreSQL (Free Tier with Row Level Security).
* **Data Privacy:** Full DPDP Act 2023 compliance. No raw audio or handwriting images leave the browser; only numerical telemetry vectors are transmitted.

---

## Project Structure

```
vidyasathi/
├── docs/
│   ├── ARCHITECTURE.md          # Full C4 system architecture and zero-cost design
│   ├── FEATURES_SPECIFICATION.md# Detailed technical specs for each screening module
│   ├── API_SPECIFICATION.md     # Route handler contracts and JSON schemas
│   └── CONTRIBUTING.md          # Engineering standards and workflow
├── src/                         # Next.js 14 source code (scaffolded in Phase 1)
├── public/                      # Static assets and web worker scripts
├── README.md                    # Project documentation
└── .gitignore                   # Version control ignore rules
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/TANMAY4806w/vidyasathi.git

# Enter the project directory
cd vidyasathi

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

---

## Team Dynamic Duo
* **Tanmay Patil** — Architecture, Core Next.js PWA, Edge AI & Gemini Integration
* **Rajat Gupta** — UI/UX Gamification, Test Scenarios & Demonstration Quality
