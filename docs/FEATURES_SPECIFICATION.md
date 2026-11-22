# VidyaSathi (विद्यासाथी) — Features Specification

> **Engineering Specifications for Round 3 MVP Prototype**  
> **Architecture Principle:** Each major feature is encapsulated as an independent, modular component with clear contracts and failure fallbacks.

---

## Feature 1: The Gamified Assessment Quest ("Cosmic Explorer")

Designed for children aged 6–14 (Classes 1–8) with high-engagement space exploration aesthetics to eliminate clinical anxiety.

### Component 1.1: Star Echoes — Dyslexia Screening Engine
* **Component Path:** `src/components/quest/missions/StarEchoesMission.tsx`
* **Clinical Purpose:** Screen for phonological decoding deficits and slow rapid automatized naming (RAN).
* **Interactive Mechanism:**
  1. Displays an animated space card with a target stimulus word (e.g., "B-A-T", "कमल", "P-E-N").
  2. Initiates microphone capture using the Web Audio API (`navigator.mediaDevices.getUserMedia`).
  3. Real-time visual audio waveform/frequency visualizer provides feedback to the child.
  4. Automatically detects speech start through energy threshold gating ($> -35\text{ dB}$).
  5. Computes:
     * **Vocal Onset Latency (VOL):** Time in milliseconds from card display to speech onset.
     * **Pause Jitter:** Frequency and duration of mid-word hesitations (>250ms).
     * **Phonological Pronunciation Score:** Levenshtein/Soundex phonetic matching against stimulus.
* **Fallback Mode:** If microphone permission is denied, switches seamlessly to a visual phoneme-matching puzzle without crashing.

---

### Component 1.2: Constellation Tracing — Dysgraphia Kinematic Canvas
* **Component Path:** `src/components/quest/missions/ConstellationTracingMission.tsx`
* **Clinical Purpose:** Screen for fine motor dyspraxia, kinematic instability, and character reversal tendencies.
* **Interactive Mechanism:**
  1. Presents glowing constellation paths shaped like letters prone to mirror reversals ('b', 'd', 'p', 'q', or Hindi 'व', 'ब').
  2. Responsive HTML5 Canvas records `PointerEvents` with sub-millisecond precision.
  3. Real-time particle trail follows the child's touch or mouse stroke.
  4. Computes:
     * **Stroke Velocity Profile:** Velocity variance and acceleration spikes.
     * **Kinematic Tremor (Micro-jitter):** High-frequency deviation perpendicular to the target template curve.
     * **Stroke Reversals & Pen-Lifts:** Count of unnatural stroke interruptions and retrograde direction changes.

---

### Component 1.3: Comet Collector — Dyscalculia Subitizing Engine
* **Component Path:** `src/components/quest/missions/CometCollectorMission.tsx`
* **Clinical Purpose:** Screen for core numerical deficit (inability to perceive small cardinalities instantaneously) vs. slow serial counting.
* **Interactive Mechanism:**
  1. Flashes a constellation cluster of 1 to 6 stars for precisely 400 milliseconds (canonical subitizing threshold).
  2. Prompts the child to tap the corresponding number button.
  3. Measures:
     * **Subitizing Reaction Time (SRT):** Milliseconds elapsed before answer selection.
     * **Cardinality Accuracy:** Correct identification rate under rapid exposure.
     * **Magnitude Comparison Latency:** Distinguishing between pairs of numbers (e.g., 3 vs 8).

---

### Component 1.4: Galactic Radar — ADHD Behavioral Focus Metric
* **Component Path:** `src/components/quest/missions/GalacticRadarMission.tsx`
* **Clinical Purpose:** Screen for impulsive motor disinhibition and executive attention lapses without direct clinical questioning.
* **Interactive Mechanism:**
  1. Passive telemetry collector embedded across all missions.
  2. Measures:
     * **Impulsive Double-Clicks:** Rapid duplicate taps on non-clickable or disabled UI elements.
     * **Attention Wandering:** Idle dwell time exceeding 5 seconds between stimulus presentation and interaction.
     * **Reaction Time Variance:** Standard deviation of reaction times across consistent stimuli.

---

## Feature 2: In-Browser Scoring & Risk Engine

* **Component Path:** `src/lib/scoring/riskEngine.ts`
* **API Handler:** `src/app/api/screen/route.ts`
* **Purpose:** Convert raw game telemetry into standardized DSM-5 aligned percentile scores.
* **Scoring Formulas:**
  * **Dyslexia Index:** $S_{\text{dyslexia}} = 0.45 \cdot \text{VOL} + 0.35 \cdot \text{PauseDist} + 0.20 \cdot \text{PhoneticError}$
  * **Dysgraphia Index:** $S_{\text{dysgraphia}} = 0.50 \cdot \text{Jitter} + 0.30 \cdot \text{VelocityVar} + 0.20 \cdot \text{Reversals}$
  * **Dyscalculia Index:** $S_{\text{dyscalculia}} = 0.55 \cdot \text{SubitizeLatency} + 0.45 \cdot \text{MagnitudeError}$
  * **ADHD Index:** $S_{\text{adhd}} = 0.40 \cdot \text{ImpulsiveClicks} + 0.35 \cdot \text{RT\_Variance} + 0.25 \cdot \text{IdleDwell}$
* **Risk Categorization:**
  * **Green (Low Risk / Typical):** Composite Percentile $< 40$
  * **Yellow (Moderate Watchlist):** Composite Percentile $40 - 75$
  * **Red (High Attention Required):** Composite Percentile $> 75$

---

## Feature 3: Gemini 1.5 Flash Automated Bilingual IEP Copilot

* **Component Path:** `src/lib/ai/geminiCopilot.ts`
* **API Handler:** `src/app/api/iep/route.ts`
* **Model:** `gemini-1.5-flash` (with hot fallback to Groq `llama-3.3-70b-versatile`)
* **Output Specification:**
  * Returns structured JSON adhering to NEP 2020 inclusive education guidelines.
  * **Parent Explanation:** Empathetic, stigma-free summary in both English and Hindi.
  * **Teacher Classroom Accommodations:** 5 immediate, zero-cost environmental adjustments (e.g., seating position, dyslexia-friendly fonts, oral testing allowance).
  * **4-Week Intervention Plan:** Weekly targeted exercises (e.g., phonemic blending, tactile sand tracing, dot arrays).
  * **Review Timeline:** Scheduled 30, 60, and 90-day progress checkpoints.

---

## Feature 4: Teacher Dashboard, PRASUNEX Sync & Jury Fast-Pass

### Component 4.1: Teacher Dashboard
* **Component Path:** `src/components/dashboard/TeacherDashboard.tsx`
* Roster view displaying students, screening dates, risk badges, and composite scores.
* Detailed diagnostic view with radar chart visualization of the 4 screening dimensions.
* 1-Click PDF export / printable view of the complete IEP.

### Component 4.2: PRASUNEX Education OS Webhook Sync
* **Component Path:** `src/components/dashboard/PrasunexSyncCard.tsx`
* Simulated enterprise webhook emitter pushing to `POST /api/v1/integrations/prasunex/telemetry`.
* Live interactive inspector showing outgoing JSON payload, cryptographic HMAC signature, and mock 200 OK acknowledgment.

### Component 4.3: Jury Fast-Pass (30-Second Evaluation Mode)
* **Route:** `/demo?jury=true` or prominent navbar button **"⚡ Jury Fast-Pass"**.
* Pre-loaded with 3 representative student screening profiles:
  * *Profile 1: Aarav (Class 3)* — High Dyslexia + Dysgraphia indicators.
  * *Profile 2: Diya (Class 5)* — High Dyscalculia indicators.
  * *Profile 3: Rohan (Class 2)* — Typical development / Low risk.
* Enables jury members to immediately inspect game analytics, trigger live Gemini IEP generation, and test the PRASUNEX sync without playing through the full 15 minutes.
