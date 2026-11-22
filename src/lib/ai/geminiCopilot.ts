/**
 * Gemini 1.5 Flash Bilingual IEP Copilot
 * Generates clinical, actionable Individualized Education Programs aligned with NEP 2020.
 * Includes hot failover to Groq and calibrated deterministic synthesis for zero-crash resilience.
 */

export interface IEPAccommodation {
  area: string;
  action: string;
  zeroCost: boolean;
}

export interface IEPWeeklyIntervention {
  week: number;
  focus: string;
  activity: string;
}

export interface IEPDocument {
  title: string;
  nepAlignment: string;
  parentSummary: {
    english: string;
    hindi: string;
  };
  classroomAccommodations: IEPAccommodation[];
  fourWeekIntervention: IEPWeeklyIntervention[];
  reviewTimeline: {
    checkpoint30Day: string;
    checkpoint60Day: string;
    checkpoint90Day: string;
  };
}

export interface IEPGenerationInput {
  assessmentId: string;
  studentName?: string;
  studentGrade: number;
  studentAge: number;
  indices: {
    dyslexia: { percentile: number; riskTier: string };
    dysgraphia: { percentile: number; riskTier: string };
    dyscalculia: { percentile: number; riskTier: string };
    adhd: { percentile: number; riskTier: string };
  };
  preferredLanguage?: string;
}

export class GeminiCopilot {
  /**
   * Generates a structured bilingual IEP plan.
   */
  static async generate(input: IEPGenerationInput): Promise<{
    source: "gemini-1.5-flash" | "groq-llama3" | "openrouter" | "calibrated-clinical-engine";
    latencyMs: number;
    iep: IEPDocument;
  }> {
    const startTime = performance.now();
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Try Google AI Studio (Gemini 1.5 Flash) if key is configured
    if (geminiKey) {
      try {
        const prompt = this.buildPrompt(input);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.2,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed: IEPDocument = JSON.parse(rawText);
            return {
              source: "gemini-1.5-flash",
              latencyMs: Math.round(performance.now() - startTime),
              iep: parsed,
            };
          }
        }
      } catch (err) {
        console.warn("Gemini 1.5 Flash call failed, trying fallback:", err);
      }
    }

    // 2. Try Groq Cloud failover if key is configured
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const prompt = this.buildPrompt(input);
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed: IEPDocument = JSON.parse(content);
            return {
              source: "groq-llama3",
              latencyMs: Math.round(performance.now() - startTime),
              iep: parsed,
            };
          }
        }
      } catch (err) {
        console.warn("Groq failover call failed, trying OpenRouter:", err);
      }
    }

    // 3. Try OpenRouter multi-model router failover if key is configured
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    if (openrouterKey) {
      try {
        const prompt = this.buildPrompt(input);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openrouterKey}`,
            "HTTP-Referer": "https://vidyasathi.vercel.app",
            "X-Title": "VidyaSathi PRASUNEX Education OS",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed: IEPDocument = JSON.parse(content);
            return {
              source: "openrouter",
              latencyMs: Math.round(performance.now() - startTime),
              iep: parsed,
            };
          }
        }
      } catch (err) {
        console.warn("OpenRouter failover call failed:", err);
      }
    }

    // 4. Calibrated Deterministic Synthesis Engine (Zero-Crash Guarantee)
    const calibratedIEP = this.synthesizeCalibratedIEP(input);
    return {
      source: "calibrated-clinical-engine",
      latencyMs: Math.round(performance.now() - startTime),
      iep: calibratedIEP,
    };
  }

  private static buildPrompt(input: IEPGenerationInput): string {
    return `You are a clinical pediatric educational psychologist generating an Individualized Education Program (IEP) for an elementary student under India's National Education Policy (NEP 2020) and RPwD Act 2016.

Student Profile:
Grade: Class ${input.studentGrade}, Age: ${input.studentAge}
Screening Percentiles:
- Dyslexia Risk: ${input.indices.dyslexia.percentile}th percentile (${input.indices.dyslexia.riskTier})
- Dysgraphia Risk: ${input.indices.dysgraphia.percentile}th percentile (${input.indices.dysgraphia.riskTier})
- Dyscalculia Risk: ${input.indices.dyscalculia.percentile}th percentile (${input.indices.dyscalculia.riskTier})
- ADHD Focus Risk: ${input.indices.adhd.percentile}th percentile (${input.indices.adhd.riskTier})

Instructions:
1. Provide a compassionate, non-stigmatizing summary for parents in both English and natural conversational Hindi (Devanagari script).
2. Recommend 3-5 immediate zero-cost classroom accommodations for teachers.
3. Formulate a 4-week structured skill-building intervention plan (15 mins/day).
4. Outline 30, 60, and 90-day review checkpoints.

You MUST return strictly valid JSON matching this exact structure:
{
  "title": "VidyaSathi Personalized Learning & Support Plan (IEP)",
  "nepAlignment": "NEP 2020 Section 6 (Equitable & Inclusive Education)",
  "parentSummary": {
    "english": "string",
    "hindi": "string"
  },
  "classroomAccommodations": [
    { "area": "string", "action": "string", "zeroCost": true }
  ],
  "fourWeekIntervention": [
    { "week": 1, "focus": "string", "activity": "string" },
    { "week": 2, "focus": "string", "activity": "string" },
    { "week": 3, "focus": "string", "activity": "string" },
    { "week": 4, "focus": "string", "activity": "string" }
  ],
  "reviewTimeline": {
    "checkpoint30Day": "string",
    "checkpoint60Day": "string",
    "checkpoint90Day": "string"
  }
}`;
  }

  /**
   * Deterministic clinical synthesis matching NEP 2020 recommendations.
   * Guarantees zero downtime even during offline tests or quota limits.
   */
  private static synthesizeCalibratedIEP(input: IEPGenerationInput): IEPDocument {
    const isDyslexic = input.indices.dyslexia.percentile >= 60;
    const isDysgraphic = input.indices.dysgraphia.percentile >= 60;
    const isDyscalculic = input.indices.dyscalculia.percentile >= 60;
    const isAdhd = input.indices.adhd.percentile >= 60;

    const accommodations: IEPAccommodation[] = [
      {
        area: "Examination Flexibility",
        action: "Grant 15 minutes additional time per hour during written tests and allow oral answer verification.",
        zeroCost: true,
      },
      {
        area: "Classroom Seating",
        action: "Position student in the first two rows near the teacher to minimize ambient visual distractions.",
        zeroCost: true,
      },
    ];

    if (isDyslexic) {
      accommodations.push({
        area: "Reading Materials",
        action: "Provide reading passages with increased line spacing and sans-serif fonts on tinted or off-white paper.",
        zeroCost: true,
      });
    }

    if (isDysgraphic) {
      accommodations.push({
        area: "Writing & Motor Support",
        action: "Allow the use of ergonomic triangular pencil grips and reduce repetitive manual copying from the blackboard.",
        zeroCost: true,
      });
    }

    if (isDyscalculic) {
      accommodations.push({
        area: "Mathematics Instruction",
        action: "Permit physical math manipulatives (beads, number lines) and provide visual dot-pattern anchor sheets.",
        zeroCost: true,
      });
    }

    if (isAdhd) {
      accommodations.push({
        area: "Task Structuring",
        action: "Chunk long classroom assignments into 10-minute micro-tasks paired with immediate positive verbal reinforcement.",
        zeroCost: true,
      });
    }

    return {
      title: "VidyaSathi Personalized Learning & Support Plan (IEP)",
      nepAlignment: "NEP 2020 Section 6 (Equitable & Inclusive Education) & RPwD Act 2016",
      parentSummary: {
        english: `The student demonstrates strong conceptual reasoning and active curiosity. Current screening indicates mild-to-moderate needs in ${
          isDyslexic ? "phonological decoding speed" : "task pacing"
        }${isDysgraphic ? " and pencil grip coordination" : ""}. With structured classroom accommodations, the student is well-positioned for rapid academic confidence.`,
        hindi: "छात्र में बहुत अच्छी सीखने की क्षमता और जिज्ञासा है। वर्तमान जांच के अनुसार, छात्र को पढ़ने की गति और लिखावट के अभ्यास में थोड़ा अतिरिक्त समय और प्रोत्साहन देने की आवश्यकता है। घर और स्कूल के सहयोग से छात्र आसानी से प्रगति करेगा।",
      },
      classroomAccommodations: accommodations,
      fourWeekIntervention: [
        {
          week: 1,
          focus: "Phonemic Awareness & Sensory Fine-Motor Tracing",
          activity: "Daily 10-minute sand-tray or textured letter tracing with simultaneous sound vocalization.",
        },
        {
          week: 2,
          focus: "Rapid Automatized Naming & Number Sense",
          activity: "Color-coded flashcard drills to build rapid visual-verbal retrieval without anxiety.",
        },
        {
          week: 3,
          focus: "Rhythm & Motor Bilateral Coordination",
          activity: "Bilateral hand clapping rhymes paired with multi-syllable vocabulary words.",
        },
        {
          week: 4,
          focus: "Integrated Classroom Confidence Building",
          activity: "Guided paired reading with teacher and celebration of weekly learning milestones.",
        },
      ],
      reviewTimeline: {
        checkpoint30Day: "Evaluate reading fluency and pencil grip comfort with the class teacher.",
        checkpoint60Day: "Review classroom homework samples and adjust visual accommodations if required.",
        checkpoint90Day: "Conduct VidyaSathi follow-up progress screening to measure percentile improvements.",
      },
    };
  }
}
