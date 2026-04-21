export type FormProviderStatus = "connected" | "disconnected" | "error";
export type FormStatus = "active" | "inactive";
export type FormType = "pre_visit" | "prem" | "prom" | "post_visit" | "monitoring";

export const formTypeLabels: Record<FormType, string> = {
  pre_visit: "Pre-Visit",
  prem: "PREM",
  prom: "PROM",
  post_visit: "Post-Visit",
  monitoring: "Monitoring",
};

export interface FormProviderDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  webhookInstructions: string[];
}

// A provider-level connection. One per provider. Pulls all forms that have the webhook URL attached.
export interface ConnectedFormProvider {
  id: string;
  provider_id: string;
  webhook_url: string;
  webhook_secret: string;
  status: FormProviderStatus;
  date_added: string;
  last_received_at: string | null;
  forms_count: number;
}

// An individual form that has been integrated via a provider's webhook.
export interface IntegratedForm {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  form_type: FormType;
  languages: string[];
  form_url: string;
  status: FormStatus;
  submissions_count: number;
  last_submission_at: string | null;
  created_at: string;
}

export const formProviders: FormProviderDefinition[] = [
  {
    id: "botmd_forms",
    name: "Bot MD Forms",
    description: "Native Bot MD form builder with AI-powered question generation",
    icon: "/form-providers/botmd-forms.svg",
    webhookInstructions: [
      "Open your form in Bot MD Forms Dashboard",
      "Go to form Settings → Integrations",
      "Click 'Add Webhook' and paste the webhook URL below",
      "Select the form events you want to receive (submission, completion)",
      "Click Save to activate the webhook",
    ],
  },
  {
    id: "google_forms",
    name: "Google Forms",
    description: "Connect your Google Forms to receive submissions in Bot MD",
    icon: "/form-providers/google-forms.svg",
    webhookInstructions: [
      "Open your Google Form and go to Responses tab",
      "Click the 3-dot menu → 'Link to Sheets'",
      "Install the 'Google Forms Webhook' extension from the Marketplace",
      "Paste the webhook URL below into the extension configuration",
      "Enable the trigger for 'On form submit'",
    ],
  },
  {
    id: "typeform",
    name: "Typeform",
    description: "Receive form submissions from Typeform into Bot MD",
    icon: "/form-providers/typeform.svg",
    webhookInstructions: [
      "Log into Typeform and open your form",
      "Go to Connect → Webhooks",
      "Click 'Add a new webhook'",
      "Paste the webhook URL below",
      "Toggle the webhook to 'On' to activate",
    ],
  },
];

export const mockConnectedProviders: ConnectedFormProvider[] = [
  {
    id: "cp_001",
    provider_id: "botmd_forms",
    webhook_url: "https://nova-api.production.botmd.io/forms/botmd_forms/abc123xyz/callback",
    webhook_secret: "whsec_abc123xyz789",
    status: "connected",
    date_added: "2026-03-15T00:00:00Z",
    last_received_at: "2026-04-21T09:30:00Z",
    forms_count: 5,
  },
  {
    id: "cp_002",
    provider_id: "google_forms",
    webhook_url: "https://nova-api.production.botmd.io/forms/google_forms/def456uvw/callback",
    webhook_secret: "whsec_def456uvw012",
    status: "connected",
    date_added: "2026-04-01T00:00:00Z",
    last_received_at: "2026-04-20T16:20:00Z",
    forms_count: 4,
  },
  {
    id: "cp_003",
    provider_id: "typeform",
    webhook_url: "https://nova-api.production.botmd.io/forms/typeform/ghi789abc/callback",
    webhook_secret: "whsec_ghi789abc345",
    status: "connected",
    date_added: "2026-02-20T00:00:00Z",
    last_received_at: "2026-04-21T08:00:00Z",
    forms_count: 3,
  },
];

export const mockIntegratedForms: IntegratedForm[] = [
  {
    id: "form_001",
    provider_id: "botmd_forms",
    name: "Patient Intake Form",
    description: "Initial patient registration and medical history",
    form_type: "pre_visit",
    languages: ["English", "Mandarin", "Malay"],
    form_url: "https://forms.botmd.io/patient-intake",
    status: "active",
    submissions_count: 142,
    last_submission_at: "2026-04-21T09:30:00Z",
    created_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "form_002",
    provider_id: "botmd_forms",
    name: "Pre-Surgery Questionnaire",
    description: "Pre-operative health assessment and consent",
    form_type: "pre_visit",
    languages: ["English", "Mandarin"],
    form_url: "https://forms.botmd.io/pre-surgery",
    status: "active",
    submissions_count: 38,
    last_submission_at: "2026-04-19T11:00:00Z",
    created_at: "2026-03-20T00:00:00Z",
  },
  {
    id: "form_003",
    provider_id: "botmd_forms",
    name: "Discharge Feedback",
    description: "Post-discharge satisfaction and feedback form",
    form_type: "prem",
    languages: ["English", "Mandarin", "Malay", "Tamil"],
    form_url: "https://forms.botmd.io/discharge-feedback",
    status: "active",
    submissions_count: 89,
    last_submission_at: "2026-04-20T14:15:00Z",
    created_at: "2026-03-25T00:00:00Z",
  },
  {
    id: "form_004",
    provider_id: "google_forms",
    name: "Post-Visit Feedback Survey",
    description: "Patient satisfaction after consultation",
    form_type: "post_visit",
    languages: ["English"],
    form_url: "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform",
    status: "active",
    submissions_count: 67,
    last_submission_at: "2026-04-20T16:20:00Z",
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "form_005",
    provider_id: "google_forms",
    name: "Vaccination Record Upload",
    description: "Upload vaccination records for verification",
    form_type: "monitoring",
    languages: ["English", "Mandarin"],
    form_url: "https://docs.google.com/forms/d/e/2BFJqQMTd.../viewform",
    status: "inactive",
    submissions_count: 23,
    last_submission_at: "2026-04-10T08:45:00Z",
    created_at: "2026-04-05T00:00:00Z",
  },
  {
    id: "form_006",
    provider_id: "botmd_forms",
    name: "Cardiology PROM Assessment",
    description: "6-month post-cardiac procedure outcome assessment",
    form_type: "prom",
    languages: ["English", "Mandarin", "Malay"],
    form_url: "https://forms.botmd.io/cardio-prom",
    status: "active",
    submissions_count: 54,
    last_submission_at: "2026-04-20T10:30:00Z",
    created_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "form_007",
    provider_id: "typeform",
    name: "Chronic Care Monitoring — Diabetes",
    description: "Weekly glucose, diet and symptom monitoring form",
    form_type: "monitoring",
    languages: ["English", "Mandarin"],
    form_url: "https://botmd.typeform.com/chronic-diabetes",
    status: "active",
    submissions_count: 218,
    last_submission_at: "2026-04-21T07:15:00Z",
    created_at: "2026-02-20T00:00:00Z",
  },
  {
    id: "form_008",
    provider_id: "typeform",
    name: "Oncology PREM — Infusion Experience",
    description: "Experience feedback after infusion appointment",
    form_type: "prem",
    languages: ["English", "Mandarin"],
    form_url: "https://botmd.typeform.com/oncology-prem",
    status: "active",
    submissions_count: 41,
    last_submission_at: "2026-04-19T15:00:00Z",
    created_at: "2026-03-05T00:00:00Z",
  },
  {
    id: "form_009",
    provider_id: "google_forms",
    name: "Maternity Intake Form",
    description: "Prenatal patient registration",
    form_type: "pre_visit",
    languages: ["English", "Malay", "Tamil"],
    form_url: "https://docs.google.com/forms/d/e/3CGkrRNUe.../viewform",
    status: "active",
    submissions_count: 29,
    last_submission_at: "2026-04-18T12:00:00Z",
    created_at: "2026-04-02T00:00:00Z",
  },
  {
    id: "form_010",
    provider_id: "typeform",
    name: "Post-Op Recovery Check-in",
    description: "Daily recovery symptom check after surgery",
    form_type: "monitoring",
    languages: ["English"],
    form_url: "https://botmd.typeform.com/post-op-check",
    status: "active",
    submissions_count: 173,
    last_submission_at: "2026-04-21T08:00:00Z",
    created_at: "2026-02-28T00:00:00Z",
  },
  {
    id: "form_011",
    provider_id: "botmd_forms",
    name: "Annual Wellness PREM Survey",
    description: "Annual patient experience measure",
    form_type: "prem",
    languages: ["English", "Mandarin", "Malay", "Tamil"],
    form_url: "https://forms.botmd.io/wellness-prem",
    status: "active",
    submissions_count: 112,
    last_submission_at: "2026-04-20T09:45:00Z",
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "form_012",
    provider_id: "google_forms",
    name: "Radiology Pre-Scan Form",
    description: "Safety screening before MRI/CT scans",
    form_type: "pre_visit",
    languages: ["English", "Mandarin"],
    form_url: "https://docs.google.com/forms/d/e/4DHlsSPVf.../viewform",
    status: "inactive",
    submissions_count: 12,
    last_submission_at: "2026-04-12T11:20:00Z",
    created_at: "2026-04-08T00:00:00Z",
  },
];
