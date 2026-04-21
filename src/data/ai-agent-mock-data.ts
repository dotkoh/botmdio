import { AIAgent } from "./ai-agent-types";

export interface KnowledgeBaseSetDetail {
  id: string;
  name: string;
  description: string;
  sources_count: number;
  qa_count: number;
  used_by_agents: string[];
}

export interface RecommendationDetail {
  id: string;
  name: string;
  description: string;
  collects: string[];
  recommends: string[];
  used_by_agents: string[];
}

export interface ChannelOption {
  type: "whatsapp" | "messenger" | "instagram" | "webchat" | "telegram";
  label: string;
  identifier: string;
  used_by_agent: string | null;
  messages_last_7d?: number;
  unique_senders_last_7d?: number;
  language_breakdown?: { lang: string; pct: number }[];
}

export const mockAgents: AIAgent[] = [
  {
    id: "agent_1",
    name: "Patient Bot",
    description: "Primary patient-facing agent for bookings, FAQs, and general inquiries",
    status: "active",
    channel: {
      type: "whatsapp",
      label: "WhatsApp 1",
      identifier: "+65 9123 4567",
    },
    persona_name: "Mira",
    voice_tone: "warm_friendly",
    languages: ["en", "zh"],
    consent_template: "warm_friendly",
    knowledge_base_sets: [
      { id: "kb_clinical", name: "Clinical Info" },
      { id: "kb_general", name: "General FAQs" },
    ],
    scheduling_calendars: ["Cardiology Cons.", "Wellness Screening", "OBGYN Consultation"],
    scheduling_rules: [
      { id: "rule_001", name: "Cardiology Consultation" },
    ],
    recommendations: [
      { id: "rec_wellness", name: "Wellness Screening Recommendation" },
    ],
    custom_instructions: "Always remind patients over 50 about our annual wellness package discount.",
    model_tier: "essential",
    handover_team: "Patient services team",
    fallback_email: "ops@mediatrix.com.ph",
    after_hours_behavior: "handover_all",
    after_hours_start: "18:00",
    after_hours_end: "09:00",
    conversations_today: 47,
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-04-14T08:00:00Z",
    created_by: "Dot Koh",
  },
  {
    id: "agent_2",
    name: "Insurance Bot",
    description: "Handles insurance verification, claims inquiries, and policy questions",
    status: "draft",
    channel: {
      type: "whatsapp",
      label: "WhatsApp 2",
      identifier: "+65 9876 5432",
    },
    persona_name: "Ari",
    voice_tone: "professional_concise",
    languages: ["en"],
    consent_template: "professional_concise",
    knowledge_base_sets: [
      { id: "kb_insurance", name: "Insurance Policies" },
    ],
    scheduling_calendars: [],
    scheduling_rules: [
      { id: "rule_003", name: "OBGYN Consultation" },
    ],
    recommendations: [
      { id: "rec_insurance", name: "Insurance Plan Upsell" },
    ],
    custom_instructions: "Always verify insurance provider before discussing coverage details. Never quote specific amounts without disclaimers.",
    model_tier: "essential",
    handover_team: "Insurance desk",
    fallback_email: "insurance@mediatrix.com.ph",
    after_hours_behavior: "auto_reply",
    after_hours_start: "17:00",
    after_hours_end: "09:00",
    conversations_today: 0,
    sandbox_code: "PA-7Z4K",
    created_at: "2026-03-20T14:00:00Z",
    updated_at: "2026-04-13T16:00:00Z",
    created_by: "Admin User",
  },
  {
    id: "agent_3",
    name: "Cardiology Assistant",
    description: "Specialized cardiology assistant for pre/post consultation and patient education",
    status: "active",
    channel: {
      type: "whatsapp",
      label: "WhatsApp 1",
      identifier: "+65 9123 4567",
    },
    persona_name: "Dr. Mira",
    voice_tone: "professional_concise",
    languages: ["en", "zh", "ms"],
    consent_template: "professional_concise",
    knowledge_base_sets: [
      { id: "kb_cardiology", name: "Cardiology Clinical" },
      { id: "kb_clinical", name: "Clinical Info" },
    ],
    scheduling_calendars: ["Cardiology Cons."],
    scheduling_rules: [
      { id: "rule_001", name: "Cardiology Consultation" },
    ],
    recommendations: [],
    custom_instructions: "Use medical terminology when appropriate but always provide patient-friendly explanations.",
    model_tier: "premium",
    handover_team: "Cardiology nurses",
    fallback_email: "cardio@mediatrix.com.ph",
    after_hours_behavior: "normal",
    after_hours_start: "18:00",
    after_hours_end: "08:00",
    conversations_today: 12,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-04-12T11:00:00Z",
    created_by: "Dot Koh",
  },
];

export const availableKnowledgeBaseSets: KnowledgeBaseSetDetail[] = [
  { id: "kb_clinical", name: "Clinical Info", description: "Cardiology, oncology, and general medical facts", sources_count: 3, qa_count: 24, used_by_agents: ["Patient Bot", "Cardiology Assistant"] },
  { id: "kb_general", name: "General FAQs", description: "Hospital hours, policies, parking, general services", sources_count: 1, qa_count: 18, used_by_agents: ["Patient Bot", "Insurance Bot", "Cardiology Assistant"] },
  { id: "kb_insurance", name: "Insurance Policies", description: "Supported insurance providers, coverage details, claim process", sources_count: 2, qa_count: 12, used_by_agents: ["Insurance Bot"] },
  { id: "kb_cardiology", name: "Cardiology Clinical", description: "Cardiology-specific clinical protocols and patient education", sources_count: 4, qa_count: 31, used_by_agents: ["Cardiology Assistant"] },
  { id: "kb_obgyn", name: "OBGYN Clinical", description: "OBGYN procedures, prenatal care, women's health FAQs", sources_count: 3, qa_count: 27, used_by_agents: [] },
  { id: "kb_procedures", name: "Procedure Preparation", description: "Pre-procedure instructions for MRI, CT, colonoscopy, surgery", sources_count: 5, qa_count: 22, used_by_agents: ["Patient Bot", "Cardiology Assistant", "Insurance Bot", "Wellness Bot"] },
  { id: "kb_pricing", name: "Pricing & Packages", description: "Service pricing, health packages, promotional bundles", sources_count: 2, qa_count: 15, used_by_agents: ["Patient Bot", "Insurance Bot", "Cardiology Assistant", "Wellness Bot", "Marketing Bot"] },
];

export const availableChannels: ChannelOption[] = [
  {
    type: "whatsapp",
    label: "WhatsApp 1",
    identifier: "+65 9123 4567",
    used_by_agent: "Patient Bot",
    messages_last_7d: 892,
    unique_senders_last_7d: 238,
    language_breakdown: [{ lang: "English", pct: 78 }, { lang: "Chinese", pct: 18 }, { lang: "Other", pct: 4 }],
  },
  {
    type: "whatsapp",
    label: "WhatsApp 2",
    identifier: "+65 9876 5432",
    used_by_agent: "Insurance Bot",
    messages_last_7d: 142,
    unique_senders_last_7d: 38,
    language_breakdown: [{ lang: "English", pct: 92 }, { lang: "Chinese", pct: 8 }],
  },
  {
    type: "whatsapp",
    label: "WhatsApp 3 (Staging)",
    identifier: "+65 9999 1234",
    used_by_agent: null,
    messages_last_7d: 0,
    unique_senders_last_7d: 0,
  },
  {
    type: "messenger",
    label: "Facebook Messenger",
    identifier: "Mary Mediatrix Medical Center",
    used_by_agent: null,
    messages_last_7d: 347,
    unique_senders_last_7d: 112,
    language_breakdown: [{ lang: "English", pct: 65 }, { lang: "Filipino", pct: 35 }],
  },
  {
    type: "instagram",
    label: "Instagram",
    identifier: "@marymediatrix",
    used_by_agent: null,
    messages_last_7d: 89,
    unique_senders_last_7d: 54,
  },
  {
    type: "webchat",
    label: "Web Chat Widget",
    identifier: "mediatrix.com.ph",
    used_by_agent: null,
    messages_last_7d: 56,
    unique_senders_last_7d: 41,
  },
];

export const availableCalendars = [
  "Cardiology Cons.",
  "Colonoscopy",
  "OBGYN Consultation",
  "Oncology Consultation",
  "Radiology",
  "Wellness Screening",
  "Dermatology",
  "Orthopedics",
];

export const availableRecommendations: RecommendationDetail[] = [
  {
    id: "rec_wellness",
    name: "Wellness Screening Recommendation",
    description: "Recommends wellness screening packages based on patient profile",
    collects: ["age", "smoking status", "comorbidities", "family history"],
    recommends: ["Basic Screening", "Silver Screening", "Platinum Screening"],
    used_by_agents: ["Patient Bot", "Wellness Bot"],
  },
  {
    id: "rec_insurance",
    name: "Insurance Plan Upsell",
    description: "Recommends insurance plan upgrades based on patient needs",
    collects: ["current plan", "age", "household size"],
    recommends: ["Basic Upgrade", "Silver Upgrade", "Premium Upgrade"],
    used_by_agents: ["Insurance Bot"],
  },
  {
    id: "rec_cardio_package",
    name: "Cardiology Health Package",
    description: "Recommends cardiology-specific health screening packages",
    collects: ["age", "BMI", "family cardiac history"],
    recommends: ["Basic Cardiac Screening", "Advanced Cardiac Screening"],
    used_by_agents: [],
  },
  {
    id: "rec_obgyn_prenatal",
    name: "Prenatal Care Bundle",
    description: "Recommends prenatal care bundles for expecting mothers",
    collects: ["weeks pregnant", "prior pregnancies", "preferred delivery"],
    recommends: ["Standard Bundle", "Premium Bundle", "Maternity Concierge Bundle"],
    used_by_agents: [],
  },
];

export const availableHandoverTeams = [
  "Patient services team",
  "Insurance desk",
  "Cardiology nurses",
  "OBGYN nurses",
  "Admin team",
  "Triage nurse",
];

export const instructionExamples = [
  "Ask about fasting status before any bloodwork booking",
  "Mention complimentary valet parking for members",
  "For insurance partner bookings, always collect referring agent ID",
  "Remind patients over 50 about annual wellness package discount",
  "Don't quote specific prices — direct to insurance desk for coverage",
];
