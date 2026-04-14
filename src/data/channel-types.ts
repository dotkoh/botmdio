export type ChannelStatus = "connected" | "disconnected" | "error";
export type ChannelCategory = "messaging" | "one_way";
export type AuthMethod = "meta_oauth" | "api_key";

export interface ChannelProvider {
  id: string;
  name: string;
  icon: string;
  category: ChannelCategory;
  authMethod: AuthMethod;
  fields?: CredentialField[];
  helpText?: string;
}

export interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface ConnectedAccount {
  id: string;
  provider_id: string;
  name: string;
  account_id: string;
  page_name?: string;
  page_url?: string;
  phone_number?: string;
  status: ChannelStatus;
  is_enabled: boolean;
  date_added: string;
  token_expiry: string | null;
}
