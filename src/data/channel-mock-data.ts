import { ChannelProvider, ConnectedAccount } from "./channel-types";

export const channelProviders: ChannelProvider[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "/channels/whatsapp.svg",
    category: "messaging",
    authMethod: "meta_oauth",
  },
  {
    id: "messenger",
    name: "Facebook Messenger",
    icon: "/channels/messenger.svg",
    category: "messaging",
    authMethod: "meta_oauth",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/channels/instagram.svg",
    category: "messaging",
    authMethod: "meta_oauth",
  },
  {
    id: "promotexter",
    name: "Promotexter",
    icon: "/channels/viber.svg",
    category: "one_way",
    authMethod: "api_key",
    fields: [
      { key: "sender_id", label: "Sender ID", placeholder: "Enter your Sender ID", required: true },
      { key: "api_key", label: "API Key", placeholder: "Enter your API Key", required: true },
      { key: "api_secret", label: "API Secret", placeholder: "Enter your API Secret", required: true },
    ],
    helpText: "Input your Sender ID, API Key, and API Secret to finalize your connection to Promotexter.",
  },
  {
    id: "twilio",
    name: "Twilio SMS",
    icon: "/channels/whatsapp.svg",
    category: "one_way",
    authMethod: "api_key",
    fields: [
      { key: "account_sid", label: "Account SID", placeholder: "Enter your Twilio Account SID", required: true },
      { key: "auth_token", label: "Auth Token", placeholder: "Enter your Auth Token", required: true },
      { key: "phone_number", label: "Phone Number", placeholder: "Enter your Twilio phone number", required: true },
    ],
    helpText: "Input your Account SID, Auth Token, and Phone Number to finalize your connection to Twilio.",
  },
];

export const mockConnectedAccounts: ConnectedAccount[] = [
  {
    id: "ch_001",
    provider_id: "messenger",
    name: "Mary Mediatrix Staging",
    account_id: "866955413167316",
    page_name: "Mary Mediatrix Staging",
    page_url: "https://facebook.com/MaryMediatrixStaging",
    status: "disconnected",
    is_enabled: false,
    date_added: "2026-01-07T00:00:00Z",
    token_expiry: null,
  },
  {
    id: "ch_002",
    provider_id: "messenger",
    name: "Mary Mediatrix Medical Center - A Mount Grace Hospital",
    account_id: "869376406269850",
    page_name: "Mary Mediatrix Medical Center - A Mount Grace Hospital",
    page_url: "https://facebook.com/MaryMediatrixMedicalCenter",
    status: "connected",
    is_enabled: true,
    date_added: "2026-01-21T00:00:00Z",
    token_expiry: null,
  },
];
