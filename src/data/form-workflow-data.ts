export type FormWorkflowStatus = "active" | "paused" | "draft";

export type ReminderTrigger =
  | "before_appointment"
  | "after_appointment"
  | "after_discharge"
  | "after_enrolment"
  | "recurring";

export type ReminderUnit = "hours" | "days" | "weeks" | "months";

export type ReminderChannel = "whatsapp" | "sms" | "email";

export interface ReminderStep {
  id: string;
  // Offset relative to the trigger event. For "recurring", offset is the cadence (e.g. every 1 week).
  offset_value: number;
  offset_unit: ReminderUnit;
  trigger: ReminderTrigger;
  form_id: string; // which survey to send
  channel: ReminderChannel;
}

export interface FormWorkflow {
  id: string;
  name: string;
  description: string;
  audience_description: string;
  audience_size: number;
  // Pipeline counts (used in detail view stats)
  enrolled_count: number;
  pending_sends_count: number;
  completed_count: number;
  steps: ReminderStep[];
  status: FormWorkflowStatus;
  created_at: string;
  created_by: string;
}

export const formWorkflowStatusLabels: Record<FormWorkflowStatus, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
};

export const formWorkflowStatusStyles: Record<
  FormWorkflowStatus,
  { dot: string; text: string }
> = {
  active: { dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  paused: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  draft: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400" },
};

const triggerLabels: Record<ReminderTrigger, string> = {
  before_appointment: "before appointment",
  after_appointment: "after appointment",
  after_discharge: "after discharge",
  after_enrolment: "after enrolment",
  recurring: "(recurring)",
};

const unitShort: Record<ReminderUnit, { singular: string; plural: string }> = {
  hours: { singular: "h", plural: "h" },
  days: { singular: "d", plural: "d" },
  weeks: { singular: "w", plural: "w" },
  months: { singular: "mo", plural: "mo" },
};

const unitLong: Record<ReminderUnit, { singular: string; plural: string }> = {
  hours: { singular: "hour", plural: "hours" },
  days: { singular: "day", plural: "days" },
  weeks: { singular: "week", plural: "weeks" },
  months: { singular: "month", plural: "months" },
};

export function formatStepShort(step: ReminderStep): string {
  const u = unitShort[step.offset_unit];
  const num = `${step.offset_value}${step.offset_value === 1 ? u.singular : u.plural}`;
  if (step.trigger === "recurring") {
    return `Every ${num}`;
  }
  return `${num} ${triggerLabels[step.trigger]}`;
}

export function formatStepLong(step: ReminderStep): string {
  const u = unitLong[step.offset_unit];
  const num = `${step.offset_value} ${step.offset_value === 1 ? u.singular : u.plural}`;
  if (step.trigger === "recurring") {
    return `Every ${num}`;
  }
  return `Send ${num} ${triggerLabels[step.trigger]}`;
}

export const channelLabels: Record<ReminderChannel, string> = {
  whatsapp: "WhatsApp",
  sms: "SMS",
  email: "Email",
};

// === Mock workflows ===
export const mockFormWorkflows: FormWorkflow[] = [
  {
    id: "wf_001",
    name: "Cardiology Patient Journey",
    description:
      "End-to-end survey cadence for cardiology patients — pre-visit intake, post-visit feedback, and a 6-month outcome assessment.",
    audience_description: "All patients on a Cardiology Consultation appointment",
    audience_size: 184,
    enrolled_count: 184,
    pending_sends_count: 22,
    completed_count: 412,
    status: "active",
    created_at: "2026-02-12T09:00:00Z",
    created_by: "Dot Koh",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "days", trigger: "before_appointment", form_id: "form_001", channel: "whatsapp" },
      { id: "s2", offset_value: 1, offset_unit: "days", trigger: "after_appointment", form_id: "form_004", channel: "whatsapp" },
      { id: "s3", offset_value: 6, offset_unit: "months", trigger: "after_appointment", form_id: "form_006", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_002",
    name: "Pre-Surgery Workup",
    description: "Send the pre-surgery questionnaire one week before the procedure and a reminder one day before.",
    audience_description: "All patients with an upcoming surgery booking",
    audience_size: 38,
    enrolled_count: 38,
    pending_sends_count: 4,
    completed_count: 76,
    status: "active",
    created_at: "2026-02-20T14:00:00Z",
    created_by: "Grace Lim",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "weeks", trigger: "before_appointment", form_id: "form_002", channel: "whatsapp" },
      { id: "s2", offset_value: 1, offset_unit: "days", trigger: "before_appointment", form_id: "form_002", channel: "sms" },
    ],
  },
  {
    id: "wf_003",
    name: "Post-Discharge Feedback",
    description: "Collect a discharge feedback survey within 24 hours of leaving the hospital.",
    audience_description: "All inpatients on discharge",
    audience_size: 89,
    enrolled_count: 89,
    pending_sends_count: 6,
    completed_count: 248,
    status: "active",
    created_at: "2026-03-01T10:00:00Z",
    created_by: "Dot Koh",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "days", trigger: "after_discharge", form_id: "form_003", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_004",
    name: "Diabetes Weekly Monitoring",
    description: "Recurring weekly check-in for enrolled diabetes patients to track glucose and adherence.",
    audience_description: "Patients enrolled in the Chronic Care — Diabetes programme",
    audience_size: 76,
    enrolled_count: 76,
    pending_sends_count: 12,
    completed_count: 1124,
    status: "active",
    created_at: "2026-01-15T08:00:00Z",
    created_by: "Dr. Maria Cruz",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "weeks", trigger: "recurring", form_id: "form_007", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_005",
    name: "Post-Op Recovery Check-in",
    description: "Daily recovery monitoring for the first week after surgery, then weekly for one month.",
    audience_description: "All patients within 30 days of a surgical procedure",
    audience_size: 54,
    enrolled_count: 54,
    pending_sends_count: 9,
    completed_count: 612,
    status: "active",
    created_at: "2026-02-28T11:00:00Z",
    created_by: "Nurse Aileen Reyes",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "days", trigger: "after_appointment", form_id: "form_010", channel: "whatsapp" },
      { id: "s2", offset_value: 3, offset_unit: "days", trigger: "after_appointment", form_id: "form_010", channel: "whatsapp" },
      { id: "s3", offset_value: 1, offset_unit: "weeks", trigger: "after_appointment", form_id: "form_010", channel: "whatsapp" },
      { id: "s4", offset_value: 2, offset_unit: "weeks", trigger: "after_appointment", form_id: "form_010", channel: "whatsapp" },
      { id: "s5", offset_value: 1, offset_unit: "months", trigger: "after_appointment", form_id: "form_010", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_006",
    name: "Annual Wellness Survey",
    description: "Send the annual wellness PREM survey to all patients on the anniversary of their last visit.",
    audience_description: "Returning patients with a visit in the last 12 months",
    audience_size: 1284,
    enrolled_count: 1284,
    pending_sends_count: 31,
    completed_count: 942,
    status: "active",
    created_at: "2026-01-05T09:00:00Z",
    created_by: "Dot Koh",
    steps: [
      { id: "s1", offset_value: 12, offset_unit: "months", trigger: "after_appointment", form_id: "form_011", channel: "email" },
    ],
  },
  {
    id: "wf_007",
    name: "Oncology Infusion Experience",
    description: "Capture the patient's experience after each chemotherapy infusion appointment.",
    audience_description: "Patients with an Oncology Infusion appointment type",
    audience_size: 41,
    enrolled_count: 41,
    pending_sends_count: 3,
    completed_count: 156,
    status: "paused",
    created_at: "2026-03-05T15:00:00Z",
    created_by: "Dr. Benjamin Tan",
    steps: [
      { id: "s1", offset_value: 4, offset_unit: "hours", trigger: "after_appointment", form_id: "form_008", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_008",
    name: "Maternity Care Pathway",
    description:
      "Pre-natal intake on enrolment, then a monthly wellbeing check-in throughout the pregnancy.",
    audience_description: "Patients enrolled in the Maternity programme",
    audience_size: 29,
    enrolled_count: 29,
    pending_sends_count: 2,
    completed_count: 132,
    status: "active",
    created_at: "2026-04-02T12:00:00Z",
    created_by: "Dr. Benjamin Tan",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "days", trigger: "after_enrolment", form_id: "form_009", channel: "whatsapp" },
      { id: "s2", offset_value: 1, offset_unit: "months", trigger: "recurring", form_id: "form_011", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_009",
    name: "Wellness Screening Reminders",
    description: "Reminders before an executive health-check appointment so patients arrive prepared.",
    audience_description: "Patients with a Wellness Screening appointment",
    audience_size: 67,
    enrolled_count: 67,
    pending_sends_count: 5,
    completed_count: 184,
    status: "active",
    created_at: "2026-02-25T10:30:00Z",
    created_by: "Grace Lim",
    steps: [
      { id: "s1", offset_value: 1, offset_unit: "weeks", trigger: "before_appointment", form_id: "form_001", channel: "whatsapp" },
      { id: "s2", offset_value: 1, offset_unit: "days", trigger: "before_appointment", form_id: "form_001", channel: "whatsapp" },
    ],
  },
  {
    id: "wf_010",
    name: "Radiology Pre-Scan Safety",
    description: "Send the radiology safety screening form before MRI/CT scans.",
    audience_description: "Patients with a Radiology appointment",
    audience_size: 12,
    enrolled_count: 0,
    pending_sends_count: 0,
    completed_count: 0,
    status: "draft",
    created_at: "2026-04-15T16:00:00Z",
    created_by: "Dot Koh",
    steps: [
      { id: "s1", offset_value: 2, offset_unit: "days", trigger: "before_appointment", form_id: "form_012", channel: "whatsapp" },
    ],
  },
];
