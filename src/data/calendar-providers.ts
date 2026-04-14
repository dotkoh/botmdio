import { ProviderDefinition } from "./calendar-types";

export const providers: ProviderDefinition[] = [
  {
    id: "acuity",
    name: "Acuity Scheduling",
    description: "Online appointment scheduling for healthcare",
    fields: [
      { key: "user_id", label: "Acuity User ID", placeholder: "Enter your Acuity User ID", required: true },
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
      { key: "api_key", label: "API key", placeholder: "Enter your API key", required: true },
      { key: "org_id", label: "Organization ID", placeholder: "Enter your Organization ID", required: true },
    ],
    helpText: "Input your API key and Organization ID to finalize your connection to Hummingbird.",
  },
  {
    id: "plato",
    name: "Plato Medical",
    description: "Medical practice and EMR scheduling",
    fields: [
      { key: "api_key", label: "API key", placeholder: "Enter your API key", required: true },
      { key: "clinic_id", label: "Clinic ID", placeholder: "Enter your Clinic ID", required: true },
    ],
    helpText: "Input your API key and Clinic ID to finalize your connection to Plato Medical.",
  },
];
