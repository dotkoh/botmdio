export type AgentStatus = "active" | "draft" | "paused";
export type VoiceTone = "warm_friendly" | "professional_concise";
export type ConsentTemplateMode = "warm_friendly" | "professional_concise" | "custom";
export type ModelTier = "basic" | "essential" | "premium";
export type AfterHoursBehavior = "normal" | "handover_all" | "auto_reply";

export interface AgentChannel {
  type: "whatsapp" | "messenger" | "instagram" | "webchat" | "telegram";
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
  consent_template: ConsentTemplateMode;
  custom_consent?: string;

  // Subscriptions
  knowledge_base_sets: KnowledgeBaseSet[];
  scheduling_calendars: string[];
  scheduling_rules: SchedulingRuleRef[];
  recommendations: RecommendationRef[];

  // Behavior
  custom_instructions: string;
  model_tier?: ModelTier;
  handover_team?: string;
  fallback_email?: string;
  after_hours_behavior?: AfterHoursBehavior;
  after_hours_start?: string;
  after_hours_end?: string;

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
};

export const consentTemplateLabels: Record<ConsentTemplateMode, string> = {
  warm_friendly: "Warm & Friendly",
  professional_concise: "Professional & Concise",
  custom: "Custom",
};

export const defaultConsentTemplates: Record<"warm_friendly" | "professional_concise", string> = {
  warm_friendly:
    "Hi! 👋 I'm {agentName}, the AI assistant for {hospitalName}. I can help you book appointments, answer general questions, and more. Replies may be monitored for quality. How can I help you today?",
  professional_concise:
    "You are now chatting with {agentName}, an AI assistant for {hospitalName}. This conversation may be logged for quality assurance. For emergencies, please call your local emergency number.",
};

export const modelTierLabels: Record<ModelTier, string> = {
  basic: "Basic (faster, cheaper — for simple flows)",
  essential: "Essential (recommended)",
  premium: "Premium (most capable — for complex reasoning)",
};

export const availableLanguages = [
  { code: "af", label: "Afrikaans" },
  { code: "sq", label: "Albanian" },
  { code: "am", label: "Amharic" },
  { code: "ar", label: "Arabic" },
  { code: "hy", label: "Armenian" },
  { code: "bn", label: "Bengali" },
  { code: "zh", label: "Chinese (Mandarin)" },
  { code: "zh-HK", label: "Chinese (Cantonese)" },
  { code: "hr", label: "Croatian" },
  { code: "cs", label: "Czech" },
  { code: "da", label: "Danish" },
  { code: "nl", label: "Dutch" },
  { code: "en", label: "English" },
  { code: "fil", label: "Filipino" },
  { code: "fi", label: "Finnish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "el", label: "Greek" },
  { code: "gu", label: "Gujarati" },
  { code: "he", label: "Hebrew" },
  { code: "hi", label: "Hindi" },
  { code: "hu", label: "Hungarian" },
  { code: "id", label: "Indonesian" },
  { code: "it", label: "Italian" },
  { code: "ja", label: "Japanese" },
  { code: "kn", label: "Kannada" },
  { code: "ko", label: "Korean" },
  { code: "ms", label: "Malay" },
  { code: "ml", label: "Malayalam" },
  { code: "mr", label: "Marathi" },
  { code: "no", label: "Norwegian" },
  { code: "pl", label: "Polish" },
  { code: "pt", label: "Portuguese" },
  { code: "pa", label: "Punjabi" },
  { code: "ro", label: "Romanian" },
  { code: "ru", label: "Russian" },
  { code: "es", label: "Spanish" },
  { code: "sw", label: "Swahili" },
  { code: "sv", label: "Swedish" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "th", label: "Thai" },
  { code: "tr", label: "Turkish" },
  { code: "uk", label: "Ukrainian" },
  { code: "ur", label: "Urdu" },
  { code: "vi", label: "Vietnamese" },
];
