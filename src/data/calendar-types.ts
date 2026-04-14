export type CalendarProvider = "acuity" | "bizbox" | "hummingbird" | "plato";
export type IntegrationStatus = "connected" | "error" | "syncing" | "disconnected";

export interface ProviderDefinition {
  id: CalendarProvider;
  name: string;
  description: string;
  fields: CredentialField[];
  helpText: string;
  helpLink?: string;
}

export interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface CalendarIntegration {
  id: string;
  org_id: string;
  provider: CalendarProvider;
  provider_name: string;
  account_identifier: string;
  account_label?: string;
  status: IntegrationStatus;
  status_message?: string;
  webhook_url: string;
  created_at: string;
  last_synced_at: string;
  is_active: boolean;
}

export interface Calendar {
  id: string;
  integration_id: string;
  org_id: string;
  external_id: string;
  name: string;
  description?: string;
  timezone: string;
  is_enabled_for_ai: boolean;
  synced_at: string;
}

export interface AppointmentType {
  id: string;
  integration_id: string;
  calendar_id: string;
  org_id: string;
  external_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  category?: string;
  is_request_type: boolean;
  confirmed_type_id?: string;
  is_enabled_for_ai: boolean;
  display_name?: string;
  synced_at: string;
}

export interface AppointmentTypeRow {
  account: string;
  calendar: string;
  appointmentType: string;
  appointmentTypeId: string;
}
