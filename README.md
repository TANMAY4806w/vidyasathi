# VidyaSathi (विद्यासाथी)

> **15-Minute Gamified Multimodal AI Early Screening Engine for Specific Learning Disabilities & Automated Bilingual IEP Copilot**  
> Turnkey Inclusive Education Module for **PRASUNEX Education OS**  
> Built for **PRASUNEX INNOVATHON 2026** — Round 3 Prototype Development & Demonstration  
> **Team:** Dynamic Duo (*Tanmay Patil & Rajat Gupta*)

[![Deployment Status](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-success?style=for-the-badge&logo=vercel)](https://vidyasathi-eight.vercel.app/)
[![Live Prototype](https://img.shields.io/badge/Live%20App-vidyasathi--eight.vercel.app-4F46E5?style=for-the-badge)](https://vidyasathi-eight.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-TANMAY4806w%2Fvidyasathi-181717?style=for-the-badge&logo=github)](https://github.com/TANMAY4806w/vidyasathi)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/Compliance-NEP%202020%20%7C%20DPDP%20Act%202023-10B981?style=for-the-badge)](https://www.education.gov.in/nep)

---

## 🌐 Live Prototype & Quick Links

| Destination | Live URL | Target Audience / Purpose |
| :--- | :--- | :--- |
| **🚀 Production Web App** | [**vidyasathi-eight.vercel.app**](https://vidyasathi-eight.vercel.app/) | Main Entrypoint & Landing Page |
| **⚡ 30-Second Jury Fast-Pass** | [**vidyasathi-eight.vercel.app/demo**](https://vidyasathi-eight.vercel.app/demo) | **Evaluator Console:** 3-step rapid scoring, Gemini IEP & ERP webhook |
| **👩‍🏫 Teacher Diagnostic Hub** | [**vidyasathi-eight.vercel.app/dashboard**](https://vidyasathi-eight.vercel.app/dashboard) | Classroom Roster, DSM-5 Percentile Gauges & 1-Page Printable IEP |
| **🎮 Student Space Quest** | [**vidyasathi-eight.vercel.app/quest**](https://vidyasathi-eight.vercel.app/quest) | 15-Minute Gamified Multi-Modal In-Browser Screening Assessment |

---

## 💡 Executive Summary & Problem Statement

In India, an estimated **15% to 20% of elementary school students (Classes 1–8)** experience neurodevelopmental learning variations, including **Dyslexia, Dysgraphia, Dyscalculia, and ADHD**. 

### The Problem in Indian Schools:
1. **Late Diagnosis:** Most children are flagged only in Class 6–8 after severe academic trauma and repeated failing grades.
2. **Prohibitive Cost:** Formal clinical psycho-educational evaluations cost ₹5,000–₹15,000 per child, making diagnosis impossible for 90%+ of Indian households.
3. **Severe Shortage of Special Educators:** India has a ratio of over 1 special educator per 2,000 children.
4. **Data Privacy Barriers:** Storing raw audio recordings or handwriting samples of minors violates **Section 9 of the Digital Personal Data Protection (DPDP) Act 2023**.

### The VidyaSathi Solution:
VidyaSathi transforms diagnostic screening into a **15-minute, low-stress space adventure quest**. It captures high-frequency behavioral and acoustic biomarkers directly in browser RAM, calculates normalized DSM-5 percentiles, and synthesizes a **legally-compliant, bilingual Individualized Education Program (IEP)** with zero-cost classroom accommodations in under 3 seconds at **$0.00 cloud compute cost**.

---

## 🛠️ Implemented Features & Technical Architecture

```
                                  VIDYASATHI ARCHITECTURE
                                  
     [ STUDENT CLIENT (Browser RAM Only) ]
     ┌──────────────────────────────────────────────────────────────┐
     │ 1. Star Echoes      ──► Web Audio API (Vocal Onset Latency)  │
     │ 2. Constellations   ──► PointerEvent Kinematics (Jitter)     │
     │ 3. Comet Collector  ──► 400ms Subitizing Engine              │
     │ 4. Passive Telemetry──► Reaction Time Variance (ADHD)        │
     └──────────────────────────────┬───────────────────────────────┘
                                    │ Anonymized Numerical Vectors Only (<50KB)
                                    ▼
     [ SERVERLESS BACKEND (Next.js 14 on Vercel) ]
     ┌──────────────────────────────────────────────────────────────┐
     │ • POST /api/screen  ──► DSM-5 Composite Percentile Scorer    │
     │ • POST /api/iep     ──► 4-Tier Resilient AI Copilot Engine   │
     │ • POST /api/speech  ──► AssemblyAI Acoustic Phoneme Analyzer │
     │ • POST /api/sync    ──► PRASUNEX ERP Webhook Dispatcher      │
     └──────────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
     [ 4-TIER AI LLM COPILOT ENGINE ]
     ┌──────────────────────────────────────────────────────────────┐
     │ Tier 1: Google Gemini 1.5 Flash (Bilingual Structured JSON)  │
     │    └── (Fallback) ──► Tier 2: Groq Cloud (Llama 3.3 70B)     │
     │         └── (Fallback) ──► Tier 3: OpenRouter Multi-Model    │
     │              └── (Fallback) ──► Tier 4: Clinical Engine      │
     └──────────────────────────────────────────────────────────────┘
```

### 1. Multi-Modal Screening Engine
* **Dyslexia Screener (`Star Echoes`):** Uses the browser's `AudioContext` and `AnalyserNode` to compute **Vocal Onset Latency (VOL)**—the exact millisecond delta between visual word presentation and vocal burst—detecting phonological decoding hesitations (>250ms).
* **Dysgraphia Screener (`Constellation Tracing`):** HTML5 Canvas captures high-frequency `PointerEvents` at 60 FPS, calculating kinematic micro-jitter, velocity variance, stroke pen-lifts, and character reversal tendencies.
* **Dyscalculia Screener (`Comet Collector`):** 400ms visual flash tests measuring instant number sense (Subitizing) versus serial counting fallback.
* **ADHD Focus Metric:** Passively monitors reaction time variance ($\sigma$), impulsive pre-stimulus tapping (<150ms), and attention dwell.

### 2. Automated Bilingual IEP Copilot (NEP 2020 Aligned)
* Synthesizes actionable, destigmatized educational accommodations in **English and Hindi**.
* Features **100% Zero-Cost Classroom Accommodations**: 1.5x sans-serif font line spacing, extra 15-minute exam flexibility, ergonomic grip adjustments, and distraction-free front-row seating.
* **Single-Page Institutional PDF:** Formatted with student demographic metadata and official Special Educator signature / School Seal authorization blocks.

### 3. PRASUNEX Education OS Integration
* RESTful webhook dispatching signed payloads (`HMAC-SHA256`) to institutional school databases and ERP student profiles.

---

## 🔒 Data Privacy & DPDP Act 2023 Compliance

VidyaSathi was engineered from day one to comply with **Section 9 of the Digital Personal Data Protection (DPDP) Act 2023** (Processing of personal data of children):
* **Zero Audio Uploads:** Microphones stream strictly into volatile client-side audio buffers in RAM. No voice recording `.wav` or `.mp3` files are saved or uploaded to the cloud.
* **Zero Handwriting Uploads:** Canvas strokes are converted to mathematical vectors (velocity, acceleration, jitter score) and discarded.
* **Anonymized Telemetry:** The server only receives anonymous numerical metric payloads (e.g. `{ volMs: 1420, jitter: 0.78 }`).

---

## ⚖️ Limitations & Guardrails

* **Screening vs. Formal Diagnosis:** VidyaSathi is an **early screening & triage instrument**, not a diagnostic replacement for licensed child neuropsychiatrists. It produces a clinical watchlist to guide educators and parents.
* **Microphone Hardware Sensitivity:** Background classroom noise in rural schools can affect vocal threshold gating; an on-screen visual calibration meter is implemented to mitigate acoustic noise.
* **Touchscreen vs. Mouse Kinematics:** Fine-motor stroke tremor metrics are highest on capacitive touchscreens/styluses; mouse inputs apply a normalized calibration offset.

---

## 🚀 Future Development Roadmap

1. **Multilingual Expansion for Bharat:** Extend IEP generation and stimulus cards to **Tamil, Telugu, Kannada, Marathi, Bengali, and Gujarati**.
2. **Vision Transformer (ViT) Handwriting OCR:** On-device WebAssembly model for scanning physical notebook pages directly via webcam.
3. **Continuous Classroom Gamification:** Adapting quests into weekly 2-minute micro-games for longitudinal progress monitoring.
4. **Universal State Board SIS Integration:** Native connectors for state education portals (e.g., DIKSHA, UDISE+).

---

## 💻 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/TANMAY4806w/vidyasathi.git

# 2. Enter directory
cd vidyasathi

# 3. Install dependencies
npm install

# 4. Copy environment configuration
cp .env.example .env.local
# (Populate your Gemini, Groq, OpenRouter, and AssemblyAI keys)

# 5. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👥 Team Dynamic Duo

Built with precision and passion for **PRASUNEX INNOVATHON 2026**:
* **Tanmay Patil** (`@TANMAY4806w`) — Architecture, Next.js Fullstack Engine, Edge AI Audio/Kinematics & Multi-LLM Copilot
* **Rajat Gupta** — UI/UX Accessibility, NEP 2020 Clinical Schemas, Validation & Evaluation Telemetry

---

*VidyaSathi (विद्यासाथी) — Every child learns differently. Understand them early.*
