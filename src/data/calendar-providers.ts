import { ProviderDefinition } from "./calendar-types";

export const providers: ProviderDefinition[] = [
  {
    id: "acuity",
    name: "Acuity Scheduling",
    description: "Online appointment scheduling for healthcare",
    fields: [
      { key: "user_id", label: "Acuity User ID", placeholder: "Enter your Acutiy User ID", required: true },
      { key: "api_key", label: "API key", placeholder: "Enter your API key", required: true },
    ],
    helpText: "Input your API key and User ID to finalize your connection to Acuity.",
    helpLink: "https://acuityscheduling.com/api",
  },
  {
    id: "bizbox",
    name: "BizBox",
    description: "Healthcare practice management system",
    fields: [
      { key: "api_key", label: "API key", placeholder: "Enter your API key", required: true },
    ],
    helpText: "Input your API key to finalize your connection to BizBox.",
    helpLink: "https://bizbox.com/settings/api",
  },
  {
    id: "hummingbird",
    name: "Hummingbird",
    description: "Clinical scheduling and workflow management",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Enter your API key from Hummingbird", required: true },
      { key: "api_url", label: "API URL", placeholder: "Enter your API URL from Hummingbird", required: true },
    ],
    helpText: "Input your API key and API URL to connect to Hummingbird.",
    helpSteps: [
      "Log in to the Hummingbird Dashboard",
      "Navigate to System \u2192 General Settings \u2192 API",
      "Click Add Webhook",
      "Enter a name in the Name field (e.g., BotMD Webhook)",
      "Copy the webhook URL from the value provided below and paste it into the URL field",
      "Click Create to save the webhook",
    ],
  },
  {
    id: "plato",
    name: "Plato Medical",
    description: "Medical practice and EMR scheduling",
    fields: [
      { key: "database_name", label: "Database Name", placeholder: "Enter your Plato database name", required: true },
      { key: "api_token", label: "API Token", placeholder: "Enter your API token", required: true },
      { key: "base_url", label: "Base URL", placeholder: "https://clinic.platomedical.com", required: false },
    ],
    helpText: "Input your database name and API token to connect to Plato Medical.",
  },
];
