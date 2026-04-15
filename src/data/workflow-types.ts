export type WorkflowCategory = "appointment" | "prom_prem" | "medication" | "marketing" | "payment" | "clinical";
export type WorkflowStatus = "active" | "paused" | "draft" | "archived";
export type TriggerType = "immediately" | "before" | "after" | "recurring" | "manual" | "api";

export interface WorkflowTemplate {
  id: string;
  category: WorkflowCategory;
  subcategory: string;
  name: string;
  description: string;
  defaultTrigger: string;
  triggerType: TriggerType;
  event?: string;
}

export interface Workflow {
  id: string;
  name: string;
  template_id: string;
  template_name: string;
  category: WorkflowCategory;
  workflow_type: string;
  applies_to: string;
  when_to_send: string;
  status: WorkflowStatus;
  attached_template: string;
  account: string;
  channel: string;
  created_at: string;
}

export const categoryLabels: Record<WorkflowCategory, string> = {
  appointment: "Appointment",
  prom_prem: "PROM/PREM",
  medication: "Medication",
  marketing: "Marketing",
  payment: "Payment",
  clinical: "Clinical",
};

export const subcategoryColors: Record<string, { text: string; bg: string; border: string }> = {
  Confirmation: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  "Pre-appointment": { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  "Follow-up": { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  Survey: { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  Outcome: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200" },
  Medication: { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
  Adherence: { text: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200" },
  Engagement: { text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
  Campaign: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
  Invoice: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  Payment: { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  Notification: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  "Care Plan": { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" },
};
