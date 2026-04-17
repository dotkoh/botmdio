export type SegmentType = "dynamic" | "static";
export type ConditionOperator = "equals" | "not_equals" | "contains" | "not_contains" | "greater_than" | "less_than" | "is_set" | "is_not_set";
export type LogicOperator = "AND" | "OR";

export interface SegmentCondition {
  id: string;
  property_key: string;
  operator: ConditionOperator;
  value: string;
}

export interface ConditionGroup {
  id: string;
  logic: LogicOperator;
  conditions: SegmentCondition[];
}

export interface Segment {
  id: string;
  org_id: string;
  name: string;
  description: string;
  type: SegmentType;
  condition_groups?: ConditionGroup[];
  contact_ids?: string[];
  contact_count: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export const operatorLabels: Record<ConditionOperator, string> = {
  equals: "equals",
  not_equals: "does not equal",
  contains: "contains",
  not_contains: "does not contain",
  greater_than: "greater than",
  less_than: "less than",
  is_set: "is set",
  is_not_set: "is not set",
};
