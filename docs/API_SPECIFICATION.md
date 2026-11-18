# VidyaSathi (विद्यासाथी) — API Specification

> **Base URL (Local):** `http://localhost:3000/api`  
> **Base URL (Production):** `https://vidyasathi.vercel.app/api`  
> **Protocols:** HTTPS, REST, Server-Sent Events / JSON  

---

## 1. POST `/api/screen`

Computes standardized DSM-5 composite risk percentiles from client-extracted game telemetry vectors.

### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

### Request Payload
```json
{
  "student": {
    "anonymousId": "stu_c8f2a91b",
    "grade": 3,
    "age": 8,
    "language": "en"
  },
  "telemetry": {
    "dyslexia": {
      "avgVocalOnsetLatencyMs": 1420,
      "pauseCountOver250ms": 6,
      "phonemeAccuracyPercent": 68.5,
      "stimulusCount": 4
    },
    "dysgraphia": {
      "avgKinematicJitterScore": 0.74,
      "strokeVelocityVariance": 0.62,
      "reversalCount": 3,
      "penLiftsPerLetter": 4.2
    },
    "dyscalculia": {
      "subitizingAvgLatencyMs": 1850,
      "subitizingAccuracyPercent": 50.0,
      "magnitudeComparisonErrorRate": 0.40
    },
    "adhd": {
      "impulsiveRapidClickCount": 7,
      "reactionTimeVarianceMs": 480,
      "idleDwellOver5sCount": 4
    }
  }
}
```

### Response Payload (200 OK)
```json
{
  "status": "success",
  "calculatedAt": "2026-11-18T15:00:00Z",
  "assessmentId": "asmt_71b9942a",
  "indices": {
    "dyslexia": {
      "percentile": 84,
      "riskTier": "HIGH_ATTENTION_REQUIRED",
      "primaryIndicator": "Delayed vocal onset and elevated intra-word pause duration"
    },
    "dysgraphia": {
      "percentile": 78,
      "riskTier": "HIGH_ATTENTION_REQUIRED",
      "primaryIndicator": "High kinematic stroke jitter and letter reversal tendencies"
    },
    "dyscalculia": {
      "percentile": 36,
      "riskTier": "LOW_RISK",
      "primaryIndicator": "Typical subitizing range and magnitude comparison"
    },
    "adhd": {
      "percentile": 62,
      "riskTier": "MODERATE_WATCHLIST",
      "primaryIndicator": "Elevated reaction time variance with moderate impulsive tapping"
    }
  },
  "overallRiskSummary": {
    "highestRiskDomain": "dyslexia",
    "recommendClinicalEvaluation": true,
    "iepEligible": true
  }
}
```

---

## 2. POST `/api/iep`

Generates a clinically structured, bilingual (English & Hindi) Individualized Education Program (IEP) using Google AI Studio's Gemini 1.5 Flash (with Groq Cloud failover).

### Request Payload
```json
{
  "assessmentId": "asmt_71b9942a",
  "studentGrade": 3,
  "studentAge": 8,
  "indices": {
    "dyslexia": { "percentile": 84, "riskTier": "HIGH_ATTENTION_REQUIRED" },
    "dysgraphia": { "percentile": 78, "riskTier": "HIGH_ATTENTION_REQUIRED" },
    "dyscalculia": { "percentile": 36, "riskTier": "LOW_RISK" },
    "adhd": { "percentile": 62, "riskTier": "MODERATE_WATCHLIST" }
  },
  "preferredLanguage": "bilingual"
}
```

### Response Payload (200 OK)
```json
{
  "status": "success",
  "engine": "gemini-1.5-flash",
  "latencyMs": 1420,
  "iepPlan": {
    "title": "VidyaSathi Personalized Learning & Support Plan (IEP)",
    "nepAlignment": "NEP 2020 Section 6 (Equitable & Inclusive Education)",
    "parentSummary": {
      "english": "Aarav shows creative strengths with specific challenges in matching letter sounds to spoken words and maintaining fine-motor pencil stability.",
      "hindi": "आरव में बहुत रचनात्मक क्षमताएं हैं, लेकिन अक्षरों की ध्वनियों को बोलने और पेंसिल पकड़ने में थोड़ा अतिरिक्त अभ्यास चाहिए।"
    },
    "classroomAccommodations": [
      {
        "area": "Reading & Visuals",
        "action": "Use OpenDyslexic font (16pt+) and off-white background paper.",
        "zeroCost": true
      },
      {
        "area": "Examinations",
        "action": "Provide 15 minutes extra time per hour and allow oral examination options.",
        "zeroCost": true
      },
      {
        "area": "Writing Support",
        "action": "Permit pencil grips or digital tablet speech-to-text notes.",
        "zeroCost": true
      }
    ],
    "fourWeekIntervention": [
      {
        "week": 1,
        "focus": "Phonemic Segmentation & Tactile Letter Tracing",
        "activity": "Sand-tray finger tracing of 'b' and 'd' with simultaneous vocalization (15 mins/day)."
      },
      {
        "week": 2,
        "focus": "Rapid Automatized Naming (RAN)",
        "activity": "Timed color-and-shape flashcards to reduce vocal hesitation."
      },
      {
        "week": 3,
        "focus": "Rhythm & Motor Coordination",
        "activity": "Clapping games paired with multi-syllable word breakdowns."
      },
      {
        "week": 4,
        "focus": "Integrated Reading Fluency",
        "activity": "Paired reading with teacher or parent using high-interest illustrated stories."
      }
    ],
    "reviewTimeline": {
      "checkpoint30Day": "Re-screen reading fluency via Star Echoes.",
      "checkpoint60Day": "Evaluate classroom writing samples with class teacher.",
      "checkpoint90Day": "Comprehensive follow-up screening review."
    }
  }
}
```

---

## 3. POST `/api/v1/integrations/prasunex/telemetry`

Simulates native webhook dispatch into the PRASUNEX Education OS & Prerana AI core.

### Request Headers
```http
Content-Type: application/json
X-Prasunex-Signature: sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

### Request Payload
```json
{
  "event": "screening.completed",
  "schoolId": "SCH_PRASUNEX_DELHI_042",
  "studentId": "stu_c8f2a91b",
  "screeningEngine": "VidyaSathi-v1.0",
  "dsm5RiskProfile": {
    "dyslexiaRisk": "HIGH",
    "dysgraphiaRisk": "HIGH",
    "dyscalculiaRisk": "LOW",
    "adhdRisk": "MODERATE"
  },
  "iepGenerated": true,
  "timestamp": "2026-11-18T15:02:10Z"
}
```

### Response Payload (200 OK)
```json
{
  "success": true,
  "syncStatus": "ACKNOWLEDGED",
  "prasunexStudentProfileUpdated": true,
  "recordRef": "PRX_REC_9812401",
  "message": "Telemetry successfully synchronized with PRASUNEX Education OS."
}
```
