export type FormProviderStatus = "connected" | "disconnected" | "error";

export interface FormProviderDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  webhookInstructions: string[];
}

export interface ConnectedFormAccount {
  id: string;
  provider_id: string;
  name: string;
  webhook_url: string;
  webhook_secret?: string;
  status: FormProviderStatus;
  date_added: string;
  last_received_at: string | null;
  submissions_count: number;
}

export const formProviders: FormProviderDefinition[] = [
  {
    id: "botmd_forms",
    name: "Bot MD Forms",
    description: "Native Bot MD form builder with AI-powered question generation",
    icon: "/form-providers/botmd-forms.svg",
    webhookInstructions: [
      "Create or open a form in Bot MD Forms Dashboard",
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
  {
    id: "jotform",
    name: "JotForm",
    description: "Integrate JotForm submissions with your Bot MD workflows",
    icon: "/form-providers/jotform.svg",
    webhookInstructions: [
      "Open your form in JotForm",
      "Go to Settings → Integrations",
      "Search for 'Webhooks' and click Connect",
      "Paste the webhook URL below",
      "Click 'Complete Integration'",
    ],
  },
  {
    id: "ms_forms",
    name: "Microsoft Forms",
    description: "Connect Microsoft Forms via Power Automate webhook",
    icon: "/form-providers/ms-forms.svg",
    webhookInstructions: [
      "Open Power Automate and create a new flow",
      "Trigger: 'When a new response is submitted' (Microsoft Forms)",
      "Add action: HTTP POST to URL",
      "Paste the webhook URL below as the POST endpoint",
      "Save and activate the flow",
    ],
  },
];

export const mockFormAccounts: ConnectedFormAccount[] = [
  {
    id: "fa_001",
    provider_id: "botmd_forms",
    name: "Patient Intake Form",
    webhook_url: "https://nova-api.production.botmd.io/forms/botmd/abc123xyz/callback",
    webhook_secret: "whsec_abc123",
    status: "connected",
    date_added: "2026-03-15T00:00:00Z",
    last_received_at: "2026-04-14T09:30:00Z",
    submissions_count: 142,
  },
  {
    id: "fa_002",
    provider_id: "google_forms",
    name: "Post-Visit Feedback Survey",
    webhook_url: "https://nova-api.production.botmd.io/forms/google/def456uvw/callback",
    status: "connected",
    date_added: "2026-04-01T00:00:00Z",
    last_received_at: "2026-04-13T16:20:00Z",
    submissions_count: 67,
  },
];
