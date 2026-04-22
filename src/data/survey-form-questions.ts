// Per-form question banks + deterministic answer generator.
// Answers are seeded by response_id so reloads show the same data.

export type QuestionType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multi_choice"
  | "rating_5"
  | "rating_10"
  | "yes_no"
  | "date"
  | "number";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for single_choice / multi_choice
  unit?: string; // for number (e.g. "mg/dL")
}

export interface Answer {
  question_id: string;
  value: string | string[] | number | boolean | null;
}

// === Question banks per form ===
export const formQuestions: Record<string, Question[]> = {
  form_001: [
    { id: "q1", text: "Full name", type: "short_text" },
    { id: "q2", text: "Date of birth", type: "date" },
    { id: "q3", text: "Reason for visit", type: "long_text" },
    {
      id: "q4",
      text: "Existing medical conditions",
      type: "multi_choice",
      options: ["Hypertension", "Diabetes", "Asthma", "Heart disease", "None"],
    },
    { id: "q5", text: "Currently taking any medications?", type: "yes_no" },
    { id: "q6", text: "List current medications", type: "long_text" },
    {
      id: "q7",
      text: "Insurance provider",
      type: "single_choice",
      options: ["AIA", "Great Eastern", "Prudential", "NTUC Income", "Self-pay", "Other"],
    },
    { id: "q8", text: "Emergency contact name", type: "short_text" },
    { id: "q9", text: "Emergency contact phone", type: "short_text" },
  ],
  form_002: [
    {
      id: "q1",
      text: "Type of surgery scheduled",
      type: "single_choice",
      options: ["Cardiac bypass", "Knee replacement", "Hip replacement", "Gallbladder removal", "Other"],
    },
    { id: "q2", text: "Have you eaten or drunk anything in the last 8 hours?", type: "yes_no" },
    {
      id: "q3",
      text: "Known allergies",
      type: "multi_choice",
      options: ["Penicillin", "Latex", "Iodine", "Shellfish", "Anaesthesia", "None"],
    },
    { id: "q4", text: "Currently taking blood thinners?", type: "yes_no" },
    { id: "q5", text: "Have you had previous surgeries?", type: "yes_no" },
    { id: "q6", text: "Briefly describe previous surgeries", type: "long_text" },
    {
      id: "q7",
      text: "Lifestyle factors",
      type: "multi_choice",
      options: ["Smoker", "Alcohol regularly", "Recreational drugs", "None of the above"],
    },
    { id: "q8", text: "I have read and consent to the surgery procedure", type: "yes_no" },
  ],
  form_003: [
    { id: "q1", text: "Overall satisfaction with your stay", type: "rating_5" },
    { id: "q2", text: "Quality of nursing care", type: "rating_5" },
    { id: "q3", text: "Quality of doctor care", type: "rating_5" },
    { id: "q4", text: "Were your concerns and questions addressed?", type: "yes_no" },
    { id: "q5", text: "Would you recommend our hospital to friends and family?", type: "yes_no" },
    { id: "q6", text: "Is there anything we could have done better?", type: "long_text" },
  ],
  form_004: [
    { id: "q1", text: "Overall satisfaction with the consultation", type: "rating_5" },
    { id: "q2", text: "Wait time satisfaction", type: "rating_5" },
    { id: "q3", text: "How likely are you to recommend us? (0-10)", type: "rating_10" },
    { id: "q4", text: "Comments or suggestions", type: "long_text" },
  ],
  form_005: [
    {
      id: "q1",
      text: "Vaccine name",
      type: "single_choice",
      options: ["Pfizer-BioNTech", "Moderna", "Sinovac", "AstraZeneca", "Influenza Quadrivalent", "Other"],
    },
    { id: "q2", text: "Date administered", type: "date" },
    { id: "q3", text: "Lot number", type: "short_text" },
    { id: "q4", text: "Administered by (clinic / hospital name)", type: "short_text" },
    { id: "q5", text: "Any side effects experienced?", type: "yes_no" },
    { id: "q6", text: "Describe side effects (if any)", type: "long_text" },
  ],
  form_006: [
    {
      id: "q1",
      text: "How often have you experienced chest pain in the last month?",
      type: "single_choice",
      options: ["Never", "1-2 times", "Weekly", "Several times a week", "Daily"],
    },
    { id: "q2", text: "Shortness of breath severity", type: "rating_5" },
    { id: "q3", text: "Energy level on a typical day", type: "rating_5" },
    {
      id: "q4",
      text: "How would you describe your activity tolerance?",
      type: "single_choice",
      options: ["No limitations", "Mild limitations", "Moderate limitations", "Severe limitations"],
    },
    { id: "q5", text: "Overall quality of life", type: "rating_5" },
    { id: "q6", text: "Any new symptoms since last visit?", type: "long_text" },
  ],
  form_007: [
    { id: "q1", text: "Today's fasting glucose", type: "number", unit: "mg/dL" },
    { id: "q2", text: "Highest glucose reading this week", type: "number", unit: "mg/dL" },
    { id: "q3", text: "Number of hypoglycaemic events this week", type: "number" },
    {
      id: "q4",
      text: "Medication adherence this week",
      type: "single_choice",
      options: ["100% — every dose", "Missed 1-2 doses", "Missed 3-5 doses", "Missed many doses"],
    },
    { id: "q5", text: "Diet adherence", type: "rating_5" },
    {
      id: "q6",
      text: "Symptoms experienced this week",
      type: "multi_choice",
      options: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision", "None"],
    },
  ],
  form_008: [
    {
      id: "q1",
      text: "How long did you wait before your infusion started?",
      type: "single_choice",
      options: ["< 15 min", "15-30 min", "30-60 min", "> 60 min"],
    },
    { id: "q2", text: "Comfort during infusion", type: "rating_5" },
    {
      id: "q3",
      text: "Side effects experienced",
      type: "multi_choice",
      options: ["Nausea", "Fatigue", "Headache", "Skin reaction", "None"],
    },
    { id: "q4", text: "How well did staff communicate with you?", type: "rating_5" },
    { id: "q5", text: "Any concerns or feedback for the team?", type: "long_text" },
  ],
  form_009: [
    { id: "q1", text: "Estimated due date", type: "date" },
    { id: "q2", text: "Number of previous pregnancies", type: "number" },
    { id: "q3", text: "Current week of pregnancy", type: "number", unit: "weeks" },
    {
      id: "q4",
      text: "Existing pregnancy complications",
      type: "multi_choice",
      options: ["Gestational diabetes", "Pre-eclampsia", "Anaemia", "Bleeding", "None"],
    },
    { id: "q5", text: "Any allergies?", type: "long_text" },
    { id: "q6", text: "Currently taking prenatal vitamins?", type: "yes_no" },
  ],
  form_010: [
    { id: "q1", text: "Pain level today (0 = none, 10 = worst)", type: "rating_10" },
    { id: "q2", text: "Have you had a fever (>= 38°C) in the last 24 hours?", type: "yes_no" },
    { id: "q3", text: "Have you experienced nausea or vomiting?", type: "yes_no" },
    { id: "q4", text: "Does your wound site look clean and dry?", type: "yes_no" },
    { id: "q5", text: "Any unusual symptoms to report?", type: "long_text" },
  ],
  form_011: [
    { id: "q1", text: "Overall health rating", type: "rating_5" },
    { id: "q2", text: "Mental wellbeing", type: "rating_5" },
    { id: "q3", text: "Sleep quality", type: "rating_5" },
    {
      id: "q4",
      text: "Have you made any lifestyle changes since last year?",
      type: "multi_choice",
      options: ["More exercise", "Better diet", "Quit smoking", "Reduced alcohol", "Stress management", "None"],
    },
    { id: "q5", text: "What are your health goals for next year?", type: "long_text" },
  ],
  form_012: [
    { id: "q1", text: "Are you pregnant or could you be pregnant?", type: "yes_no" },
    { id: "q2", text: "Do you have any metal implants?", type: "yes_no" },
    { id: "q3", text: "Do you have a pacemaker or cochlear implant?", type: "yes_no" },
    { id: "q4", text: "Do you experience claustrophobia?", type: "yes_no" },
    { id: "q5", text: "Are you allergic to contrast dye?", type: "yes_no" },
    { id: "q6", text: "List any other allergies", type: "long_text" },
  ],
};

// === Default fallback question set ===
const defaultQuestions: Question[] = [
  { id: "q1", text: "How would you rate your overall experience?", type: "rating_5" },
  { id: "q2", text: "Were you satisfied with the service?", type: "yes_no" },
  { id: "q3", text: "Any additional comments?", type: "long_text" },
];

export function getQuestionsForForm(formId: string): Question[] {
  return formQuestions[formId] ?? defaultQuestions;
}

// === Stable pseudo-random helpers (mirrors survey-response-data) ===
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const longTextSnippets = [
  "No major issues to report — feeling generally well.",
  "Some mild discomfort in the morning that resolved on its own.",
  "Everything has been progressing as expected.",
  "Slight fatigue but nothing concerning.",
  "Doctor and nursing team were very professional and reassuring.",
  "I appreciate the clear communication throughout the process.",
  "Was a little anxious about the procedure but staff put me at ease.",
  "Pain has reduced compared to last week.",
  "Following the diet plan strictly and feeling better.",
  "Would prefer shorter wait times in the waiting area.",
  "The clinic environment was clean and comfortable.",
  "Difficult to find parking, otherwise excellent.",
  "Will continue with the prescribed medication.",
  "Symptoms have improved since the last visit.",
  "No allergies known.",
  "Nil significant.",
];

const previousSurgerySnippets = [
  "Appendectomy in 2018, no complications.",
  "Tonsillectomy as a child.",
  "Knee arthroscopy 5 years ago.",
  "C-section in 2020.",
  "Cataract surgery in 2022.",
  "None.",
];

function pickFromBank(
  rand: () => number,
  bank: string[],
  fallbackProb = 0
): string {
  if (fallbackProb > 0 && rand() < fallbackProb) return "—";
  return bank[Math.floor(rand() * bank.length)];
}

// Generate a deterministic answer for a single question.
function answerFor(question: Question, rand: () => number, ctx: { isLikelyHealthy: boolean }): Answer {
  switch (question.type) {
    case "yes_no": {
      // Yes-no answers are biased per question semantically. Default to slight Yes-bias.
      const yesProb = ctx.isLikelyHealthy ? 0.75 : 0.55;
      return { question_id: question.id, value: rand() < yesProb };
    }
    case "rating_5": {
      // Bias to 3-5
      const r = rand();
      let v = 3;
      if (r < 0.05) v = 1;
      else if (r < 0.15) v = 2;
      else if (r < 0.4) v = 3;
      else if (r < 0.75) v = 4;
      else v = 5;
      return { question_id: question.id, value: v };
    }
    case "rating_10": {
      // Bias to 6-10
      const v = 5 + Math.floor(rand() * 6); // 5..10
      return { question_id: question.id, value: v };
    }
    case "number": {
      // Heuristic ranges by unit
      let val: number;
      if (question.unit === "mg/dL") {
        val = 90 + Math.floor(rand() * 110); // 90-199
      } else if (question.unit === "weeks") {
        val = 8 + Math.floor(rand() * 32); // 8-39
      } else {
        val = Math.floor(rand() * 6); // 0-5
      }
      return { question_id: question.id, value: val };
    }
    case "date": {
      // A date in the next 1-180 days
      const offset = 1 + Math.floor(rand() * 180);
      const d = new Date(Date.UTC(2026, 3, 22) + offset * 86_400_000);
      return { question_id: question.id, value: d.toISOString().slice(0, 10) };
    }
    case "single_choice": {
      const opts = question.options ?? [];
      if (opts.length === 0) return { question_id: question.id, value: null };
      return { question_id: question.id, value: opts[Math.floor(rand() * opts.length)] };
    }
    case "multi_choice": {
      const opts = question.options ?? [];
      if (opts.length === 0) return { question_id: question.id, value: [] };
      // Pick 1-3 random options; if "None" is among options, sometimes pick just that.
      const noneIdx = opts.findIndex((o) => /^(None|Nil)/i.test(o));
      if (noneIdx !== -1 && rand() < 0.35) {
        return { question_id: question.id, value: [opts[noneIdx]] };
      }
      const pickCount = 1 + Math.floor(rand() * Math.min(3, opts.length));
      const picked = new Set<string>();
      while (picked.size < pickCount) {
        const candidate = opts[Math.floor(rand() * opts.length)];
        if (noneIdx !== -1 && candidate === opts[noneIdx]) continue; // avoid mixing None with others
        picked.add(candidate);
      }
      return { question_id: question.id, value: Array.from(picked) };
    }
    case "long_text": {
      // Use a tailored bank for "previous surgeries" question by id heuristic.
      if (question.text.toLowerCase().includes("previous surger")) {
        return { question_id: question.id, value: pickFromBank(rand, previousSurgerySnippets) };
      }
      return { question_id: question.id, value: pickFromBank(rand, longTextSnippets, 0.15) };
    }
    case "short_text": {
      // Patient-specific short texts get filled in by the page using context (name, phone),
      // so for generic short_text we return a placeholder.
      return { question_id: question.id, value: "—" };
    }
    default:
      return { question_id: question.id, value: null };
  }
}

export interface GenerateAnswersInput {
  responseId: string;
  formId: string;
  patientName: string;
  patientPhone: string;
}

export function generateAnswers(input: GenerateAnswersInput): Answer[] {
  const questions = getQuestionsForForm(input.formId);
  const seed = hashString(input.responseId);
  const rand = mulberry32(seed);
  const ctx = { isLikelyHealthy: rand() < 0.7 };

  return questions.map((q) => {
    const ans = answerFor(q, rand, ctx);

    // Patient-aware short-text overrides
    if (q.type === "short_text") {
      const lower = q.text.toLowerCase();
      if (lower.includes("full name")) {
        return { question_id: q.id, value: input.patientName };
      }
      if (lower.includes("emergency contact name")) {
        // Synthesise a relative
        const relations = ["Spouse", "Parent", "Sibling", "Child"];
        const surname = input.patientName.split(" ").slice(-1)[0];
        const firstNames = ["Alex", "Sam", "Jordan", "Taylor", "Morgan", "Casey"];
        const fn = firstNames[Math.floor(rand() * firstNames.length)];
        return { question_id: q.id, value: `${fn} ${surname} (${relations[Math.floor(rand() * relations.length)]})` };
      }
      if (lower.includes("phone")) {
        // Vary the last 4 digits of the patient's phone for the emergency contact
        const digits = input.patientPhone.replace(/\D/g, "");
        const swapped = digits.slice(0, -4) + Math.floor(1000 + rand() * 9000).toString();
        const reformatted = `+${swapped.slice(0, swapped.length - 8)} ${swapped.slice(-8, -4)} ${swapped.slice(-4)}`;
        return { question_id: q.id, value: reformatted };
      }
      if (lower.includes("lot number")) {
        const letters = "ABCDEFGHJKLMN";
        const code = `${letters[Math.floor(rand() * letters.length)]}${letters[Math.floor(rand() * letters.length)]}${Math.floor(10000 + rand() * 89999)}`;
        return { question_id: q.id, value: code };
      }
      if (lower.includes("administered by")) {
        const clinics = [
          "Mediatrix Polyclinic",
          "Bot MD General Hospital",
          "Northpoint Family Clinic",
          "Eastside Medical Centre",
          "City GP Practice",
        ];
        return { question_id: q.id, value: clinics[Math.floor(rand() * clinics.length)] };
      }
    }

    return ans;
  });
}
