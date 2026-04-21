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

// === Form-level types for Create/Edit flow ===

export type EligibilityMode = "anyone" | "criteria";
export type LogicOperator = "AND" | "OR";
export type ConditionOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "in" | "not_in" | "contains" | "is_empty" | "is_not_empty";
export type BookingMode = "direct" | "scheduling_link" | "request_preferred";
export type TimeUnit = "hours" | "days" | "weeks" | "months";
export type NoSlotsAction = "handover" | "inform";
export type SlotsUnsuitableAction = "offer_more" | "handover_immediately";
export type ReschedulePolicy = "allowed" | "not_allowed_handover" | "not_allowed_call";
export type CancelPolicy = "allowed" | "not_allowed_handover" | "not_allowed_call";
export type AlertMode = "none" | "alert_users";

export interface EligibilityCondition {
  id: string;
  property_id: string;
  operator: ConditionOperator;
  value: string;
}

export interface EligibilityCriteria {
  logic: LogicOperator;
  conditions: EligibilityCondition[];
}

export interface HospitalUser {
  id: string;
  name: string;
  role: string;
  email: string;
}

export const operatorLabels: Record<ConditionOperator, string> = {
  eq: "is",
  neq: "is not",
  gt: "is greater than",
  lt: "is less than",
  gte: "is at least",
  lte: "is at most",
  in: "is one of",
  not_in: "is not one of",
  contains: "contains",
  is_empty: "is empty",
  is_not_empty: "is not empty",
};
