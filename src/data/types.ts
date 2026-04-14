export type ContactType = "prospect" | "patient" | "lead";
export type ContactSource = "organic" | "imported" | "manual" | "referral";
export type PropertyType = "string" | "number" | "boolean" | "options" | "date" | "location" | "file";

export interface DeviceLink {
  device_id: string;
  channel: "whatsapp" | "messenger" | "webchat";
  identifier: string;
  is_primary: boolean;
  linked_at: string;
}

export interface Contact {
  id: string;
  org_id: string;
  name: string;
  type: ContactType;
  source: ContactSource;
  devices: DeviceLink[];
  properties: Record<string, string | number | boolean | null>;
  created_at: string;
  updated_at: string;
  created_by: string;
  last_interaction_at: string;
  related_contacts: string[];
}

export interface ContactProperty {
  id: string;
  org_id: string;
  name: string;
  key: string;
  description: string;
  type: PropertyType;
  is_default: boolean;
  is_required: boolean;
  is_visible: boolean;
  config: {
    min?: number;
    max?: number;
    options?: string[];
    file_types?: string[];
    max_length?: number;
  };
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type SortDirection = "asc" | "desc";
export type SortField = "name" | "type" | "source" | "dob" | "mobile_number" | "created_at";
