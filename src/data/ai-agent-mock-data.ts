import { AIAgent } from "./ai-agent-types";

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
    voice_tone: "clinical",
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
    conversations_today: 12,
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-04-12T11:00:00Z",
    created_by: "Dot Koh",
  },
];

export const availableKnowledgeBaseSets = [
  { id: "kb_clinical", name: "Clinical Info" },
  { id: "kb_general", name: "General FAQs" },
  { id: "kb_insurance", name: "Insurance Policies" },
  { id: "kb_cardiology", name: "Cardiology Clinical" },
  { id: "kb_obgyn", name: "OBGYN Clinical" },
  { id: "kb_procedures", name: "Procedure Preparation" },
  { id: "kb_pricing", name: "Pricing & Packages" },
];

export const availableChannels = [
  { type: "whatsapp" as const, label: "WhatsApp 1", identifier: "+65 9123 4567" },
  { type: "whatsapp" as const, label: "WhatsApp 2", identifier: "+65 9876 5432" },
  { type: "messenger" as const, label: "Facebook Messenger", identifier: "Mary Mediatrix Medical Center" },
  { type: "instagram" as const, label: "Instagram", identifier: "@marymediatrix" },
  { type: "webchat" as const, label: "Web Chat Widget", identifier: "mediatrix.com.ph" },
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

export const availableRecommendations = [
  { id: "rec_wellness", name: "Wellness Screening Recommendation" },
  { id: "rec_insurance", name: "Insurance Plan Upsell" },
  { id: "rec_cardio_package", name: "Cardiology Health Package" },
  { id: "rec_obgyn_prenatal", name: "Prenatal Care Bundle" },
];
