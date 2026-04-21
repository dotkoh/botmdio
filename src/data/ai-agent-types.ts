export type AgentStatus = "active" | "draft" | "paused";
export type VoiceTone = "warm_friendly" | "professional_concise" | "empathetic" | "clinical";
export type ConsentTemplate = "warm_friendly" | "professional_concise";

export interface AgentChannel {
  type: "whatsapp" | "messenger" | "instagram" | "webchat";
  label: string;
  identifier: string;
}

export interface KnowledgeBaseSet {
  id: string;
  name: string;
}

export interface SchedulingRuleRef {
  id: string;
  name: string;
}

export interface RecommendationRef {
  id: string;
  name: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;

  // Channel
  channel: AgentChannel;

  // Persona
  persona_name: string;
  voice_tone: VoiceTone;
  languages: string[];
  consent_template: ConsentTemplate;

  // Subscriptions
  knowledge_base_sets: KnowledgeBaseSet[];
  scheduling_calendars: string[];
  scheduling_rules: SchedulingRuleRef[];
  recommendations: RecommendationRef[];

  // Behavior
  custom_instructions: string;

  // Metadata
  conversations_today: number;
  sandbox_code?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const voiceToneLabels: Record<VoiceTone, string> = {
  warm_friendly: "Warm & Friendly",
  professional_concise: "Professional & Concise",
  empathetic: "Empathetic",
  clinical: "Clinical",
};

export const consentTemplateLabels: Record<ConsentTemplate, string> = {
  warm_friendly: "Warm & Friendly",
  professional_concise: "Professional & Concise",
};

export const availableLanguages = [
  { code: "en", label: "English" },
  { code: "zh", label: "Chinese (Mandarin)" },
  { code: "ms", label: "Malay" },
  { code: "ta", label: "Tamil" },
  { code: "id", label: "Indonesian" },
  { code: "fil", label: "Filipino" },
  { code: "th", label: "Thai" },
  { code: "vi", label: "Vietnamese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
];
