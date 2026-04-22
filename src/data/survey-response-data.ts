import { mockIntegratedForms } from "./form-provider-data";

export type SurveyResponseStatus = "completed" | "not_completed";

export interface SurveyResponse {
  id: string;
  form_id: string;
  patient_name: string;
  patient_phone: string;
  sent_at: string;
  completed_at: string | null;
  status: SurveyResponseStatus;
}

// Stable pseudo-random helpers ----------------------------------------------
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

const firstNames = [
  "Mei Lin", "Ahmad", "Priya", "Daniel", "Siti", "Robert", "Nurul", "James",
  "Lakshmi", "Marcus", "Aisha", "Ramesh", "Catherine", "Paolo", "Yuki", "Hassan",
  "Olivia", "Wei Ming", "Grace", "Nathan", "Farah", "Vincent", "Rashida", "Joon",
  "Anita", "Bryan", "Elena", "Faisal", "Ginny", "Hugo", "Indira", "Jasper",
  "Karina", "Liam", "Maya", "Noah", "Omar", "Pooja", "Quentin", "Rina",
  "Sasha", "Tomoko", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zane",
  "Adrian", "Beatrice", "Cyrus", "Dahlia",
];

const lastNames = [
  "Chen", "Tan", "Lim", "Wong", "Lee", "Ng", "Goh", "Koh",
  "Bin Razak", "Subramaniam", "Brown", "Iyer", "Pillai", "Santos", "Tanaka",
  "Al-Farsi", "Rahman", "Cruz", "Reyes", "Gonzales", "Torres", "Ho", "Kim",
  "Park", "Choi", "Singh", "Sharma", "Patel", "Khan", "Nguyen", "Tran",
  "Pham", "Bui", "Suzuki", "Sato", "Takahashi", "Watanabe", "Mendoza",
  "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Smith",
  "Johnson", "Williams", "Davis", "Miller",
];

function randomPhone(rand: () => number): string {
  const codes = ["+65", "+60", "+62", "+63", "+66", "+91", "+852"];
  const code = codes[Math.floor(rand() * codes.length)];
  let digits = "";
  for (let i = 0; i < 8; i++) digits += Math.floor(rand() * 10).toString();
  return `${code} ${digits.slice(0, 4)} ${digits.slice(4)}`;
}

// "Today" anchor — must match other mock data. App uses 2026-04-22 as today.
const TODAY = new Date("2026-04-22T12:00:00Z");

function generateResponsesForForm(formId: string, count: number): SurveyResponse[] {
  const seed = hashString(formId);
  const rand = mulberry32(seed);
  const responses: SurveyResponse[] = [];

  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(rand() * firstNames.length)];
    const last = lastNames[Math.floor(rand() * lastNames.length)];
    const name = `${first} ${last}`;
    const phone = randomPhone(rand);

    // Sent any time in the last 60 days
    const sentDaysAgo = Math.floor(rand() * 60);
    const sentMinutesOffset = Math.floor(rand() * 24 * 60);
    const sentAt = new Date(
      TODAY.getTime() - sentDaysAgo * 86_400_000 - sentMinutesOffset * 60_000
    );

    // ~62% completion baseline; older sends slightly more likely to be completed.
    const completionBaseline = 0.55 + Math.min(0.25, sentDaysAgo / 240);
    const completed = rand() < completionBaseline;
    let completedAt: Date | null = null;
    if (completed) {
      // Completed within 0-3 days of being sent
      const completionLagMs =
        Math.floor(rand() * 3 * 86_400_000) + Math.floor(rand() * 6 * 60 * 60 * 1000);
      completedAt = new Date(sentAt.getTime() + completionLagMs);
      // Don't allow completion in the future
      if (completedAt.getTime() > TODAY.getTime()) {
        completedAt = TODAY;
      }
    }

    responses.push({
      id: `resp_${formId}_${i.toString().padStart(4, "0")}`,
      form_id: formId,
      patient_name: name,
      patient_phone: phone,
      sent_at: sentAt.toISOString(),
      completed_at: completedAt ? completedAt.toISOString() : null,
      status: completed ? "completed" : "not_completed",
    });
  }

  // Sort newest sent first
  responses.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  return responses;
}

// Build the response cache lazily on first access per form.
const responseCache = new Map<string, SurveyResponse[]>();

export function getSurveyResponses(formId: string): SurveyResponse[] {
  if (!responseCache.has(formId)) {
    const form = mockIntegratedForms.find((f) => f.id === formId);
    // Send-out volume: scale roughly with submissions_count, with a floor so the
    // table is always visibly populated. If the form is unknown, fall back to 30.
    const submissions = form?.submissions_count ?? 0;
    const sentCount = Math.max(40, Math.round(submissions * 1.6));
    responseCache.set(formId, generateResponsesForForm(formId, sentCount));
  }
  return responseCache.get(formId)!;
}

export const surveyResponseStatusLabels: Record<SurveyResponseStatus, string> = {
  completed: "Completed",
  not_completed: "Not Completed",
};
