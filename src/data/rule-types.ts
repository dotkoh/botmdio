export type BookingMethod = "direct" | "link" | "request";
export type RuleStatus = "active" | "paused" | "draft";

export interface SubscribingAgent {
  id: string;
  name: string;
}

export interface SchedulingRule {
  id: string;
  name: string;
  description: string;
  calendar_id: string;
  calendar_name: string;
  appointment_types: string[];
  booking_method: BookingMethod;
  status: RuleStatus;
  used_by: SubscribingAgent[];
  fields_collected_count: number;
  handover_rules_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const bookingMethodLabels: Record<BookingMethod, string> = {
  direct: "Direct",
  link: "Link",
  request: "Request",
};

export const statusLabels: Record<RuleStatus, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
};
