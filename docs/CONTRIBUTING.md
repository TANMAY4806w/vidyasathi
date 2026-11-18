# VidyaSathi (विद्यासाथी) — Engineering Team Guidelines

> **Team:** Dynamic Duo (*Tanmay Patil & Rajat Gupta*)  
> **Event:** PRASUNEX INNOVATHON 2026 — Round 3 Prototype Development  
> **Core Constraint:** 100% Free-Tier Architecture ($0.00 / ₹0.00 Cloud Compute & API Expenses)

---

## 1. Team Responsibilities & Workflow

| Member | Focus Areas | Primary Responsibilities |
| :--- | :--- | :--- |
| **Tanmay Patil** | Architecture, Core Next.js PWA, Edge AI & Gemini Integration | Next.js 14 App Router, Web Audio & HTML5 Canvas hooks, Gemini 1.5 Flash structured API integration, Vercel CI/CD deployment. |
| **Rajat Gupta** | UI/UX Gamification, Test Scenarios & Quality Demonstration | Tailwind styling, sound effects / visual feedback, realistic child test data generation, demonstration video script & narration. |

---

## 2. Engineering Standards

1. **Type Safety:** 100% TypeScript with strict null checks (`strict: true` in `tsconfig.json`).
2. **Zero-Crash Rule:** Every asynchronous API call (microphone permissions, Gemini inference, local storage) MUST have a resilient, graceful fallback UI so that an evaluation never throws an uncaught error.
3. **DPDP Act 2023 Compliance:** Under no circumstances should raw microphone audio recordings or canvas handwriting images be transmitted to external servers or logged in console logs. Only numerical telemetry vectors may leave client memory.
4. **Zero Cloud Expense:** Do not introduce paid services, paid GPU tiers, or unverified paid APIs. Strictly rely on Google AI Studio, Groq Cloud, Vercel Free, and Supabase Free tiers.

---

## 3. Git Branching & Commit Message Format

We adhere to the Conventional Commits specification:
* `feat(quest): add star echoes microphone audio analysis engine`
* `feat(canvas): implement constellation tracing pointer event jitter tracker`
* `feat(ai): integrate gemini 1.5 flash structured bilingual iep generator`
* `feat(dashboard): implement teacher class overview and prasunex webhook simulator`
* `fix(audio): handle microphone permission denied with interactive fallback`
* `docs: update round 3 architectural documentation`

---

## 4. Local Environment Setup

```bash
# Clone the repository
git clone https://github.com/TANMAY4806w/vidyasathi.git
cd vidyasathi

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run the local development server
npm run dev
```
