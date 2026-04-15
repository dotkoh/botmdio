import { WorkflowTemplate } from "./workflow-types";

export const workflowTemplates: WorkflowTemplate[] = [
  // === APPOINTMENT ===
  { id: "tpl_booking_confirm", category: "appointment", subcategory: "Confirmation", name: "Booking Confirmation", description: "Send a confirmation message to patients when appointments are scheduled", defaultTrigger: "Immediately upon booking", triggerType: "immediately", event: "appointment.booked" },
  { id: "tpl_update_confirm", category: "appointment", subcategory: "Confirmation", name: "Update Confirmation", description: "Send a confirmation message to patients when appointments are rescheduled", defaultTrigger: "Immediately upon rescheduling", triggerType: "immediately", event: "appointment.rescheduled" },
  { id: "tpl_cancel_confirm", category: "appointment", subcategory: "Confirmation", name: "Cancellation Confirmation", description: "Send a confirmation message to patients when appointments are cancelled", defaultTrigger: "Immediately upon cancellation", triggerType: "immediately", event: "appointment.cancelled" },
  { id: "tpl_appt_reminder", category: "appointment", subcategory: "Pre-appointment", name: "Appointment Reminder", description: "Remind patients about upcoming appointments", defaultTrigger: "X hours/days before appointment", triggerType: "before", event: "appointment.booked" },
  { id: "tpl_attendance_confirm", category: "appointment", subcategory: "Pre-appointment", name: "Attendance Confirmation", description: "Automate appointment confirmation before the visit", defaultTrigger: "X hours before appointment", triggerType: "before", event: "appointment.booked" },
  { id: "tpl_followup_reminder", category: "appointment", subcategory: "Follow-up", name: "Follow-up Visit Reminder", description: "Remind patients to schedule their follow-up visit", defaultTrigger: "X days after appointment", triggerType: "after", event: "appointment.completed" },
  { id: "tpl_appt_nudge", category: "appointment", subcategory: "Follow-up", name: "Appointment Nudge", description: "Remind patients to reschedule appointments that they canceled", defaultTrigger: "X days after cancellation", triggerType: "after", event: "appointment.cancelled" },

  // === PROM/PREM ===
  { id: "tpl_post_visit_survey", category: "prom_prem", subcategory: "Survey", name: "Post-Visit Survey", description: "Collect patient feedback after their visit", defaultTrigger: "X hours/days after appointment", triggerType: "after", event: "appointment.completed" },
  { id: "tpl_treatment_outcome", category: "prom_prem", subcategory: "Outcome", name: "Treatment Outcome Check", description: "Follow up on patient treatment outcomes after a procedure", defaultTrigger: "X days/weeks after procedure", triggerType: "after" },
  { id: "tpl_nps_survey", category: "prom_prem", subcategory: "Survey", name: "NPS Survey", description: "Measure patient satisfaction with Net Promoter Score", defaultTrigger: "X days after discharge", triggerType: "after", event: "patient.discharged" },
  { id: "tpl_care_quality", category: "prom_prem", subcategory: "Survey", name: "Care Quality Survey", description: "Assess overall care quality after an episode of care", defaultTrigger: "X days after episode", triggerType: "after" },

  // === MEDICATION ===
  { id: "tpl_prescription_ready", category: "medication", subcategory: "Medication", name: "Prescription Ready", description: "Notify patients when their prescription is ready for pickup", defaultTrigger: "Immediately when filled", triggerType: "immediately", event: "prescription.filled" },
  { id: "tpl_med_reminder", category: "medication", subcategory: "Medication", name: "Medication Reminder", description: "Remind patients to take their scheduled medication", defaultTrigger: "At scheduled dose time", triggerType: "recurring" },
  { id: "tpl_refill_reminder", category: "medication", subcategory: "Medication", name: "Refill Reminder", description: "Remind patients when it's time to refill their medication", defaultTrigger: "X days before refill due", triggerType: "before" },
  { id: "tpl_adherence_checkin", category: "medication", subcategory: "Adherence", name: "Adherence Check-in", description: "Check in with patients about their treatment adherence", defaultTrigger: "Recurring (daily/weekly)", triggerType: "recurring" },

  // === MARKETING ===
  { id: "tpl_welcome_msg", category: "marketing", subcategory: "Engagement", name: "Welcome Message", description: "Send a welcome message when a new patient registers", defaultTrigger: "Immediately upon registration", triggerType: "immediately", event: "patient.registered" },
  { id: "tpl_health_tips", category: "marketing", subcategory: "Engagement", name: "Health Tips", description: "Send periodic health tips and wellness content to patients", defaultTrigger: "Recurring schedule", triggerType: "recurring" },
  { id: "tpl_promo_campaign", category: "marketing", subcategory: "Campaign", name: "Promotional Campaign", description: "Send promotional messages for services and health packages", defaultTrigger: "Manual trigger", triggerType: "manual" },
  { id: "tpl_reengagement", category: "marketing", subcategory: "Engagement", name: "Re-engagement", description: "Reach out to inactive patients to encourage a visit", defaultTrigger: "X days since last visit", triggerType: "after" },

  // === PAYMENT ===
  { id: "tpl_invoice_notif", category: "payment", subcategory: "Invoice", name: "Invoice Notification", description: "Notify patients when a new invoice is generated", defaultTrigger: "Immediately upon creation", triggerType: "immediately", event: "invoice.created" },
  { id: "tpl_payment_reminder", category: "payment", subcategory: "Payment", name: "Payment Reminder", description: "Remind patients about upcoming or overdue payments", defaultTrigger: "X days before/after due date", triggerType: "before" },
  { id: "tpl_payment_confirm", category: "payment", subcategory: "Payment", name: "Payment Confirmation", description: "Confirm receipt of payment to patients", defaultTrigger: "Immediately upon payment", triggerType: "immediately", event: "payment.received" },
  { id: "tpl_overdue_notice", category: "payment", subcategory: "Invoice", name: "Overdue Notice", description: "Notify patients of overdue invoices requiring attention", defaultTrigger: "X days after due date", triggerType: "after", event: "payment.overdue" },

  // === CLINICAL ===
  { id: "tpl_admission_notif", category: "clinical", subcategory: "Notification", name: "Admission Notification", description: "Notify relevant parties when a patient is admitted", defaultTrigger: "Immediately upon admission", triggerType: "immediately", event: "patient.admitted" },
  { id: "tpl_discharge_instructions", category: "clinical", subcategory: "Notification", name: "Discharge Instructions", description: "Send discharge instructions and care plan to patients", defaultTrigger: "Immediately upon discharge", triggerType: "immediately", event: "patient.discharged" },
  { id: "tpl_post_discharge", category: "clinical", subcategory: "Follow-up", name: "Post-Discharge Check", description: "Follow up with patients after discharge to check recovery", defaultTrigger: "X hours/days after discharge", triggerType: "after", event: "patient.discharged" },
  { id: "tpl_lab_results", category: "clinical", subcategory: "Notification", name: "Lab Results Ready", description: "Notify patients when their lab results are available", defaultTrigger: "Immediately when available", triggerType: "immediately", event: "lab.results_ready" },
  { id: "tpl_care_plan", category: "clinical", subcategory: "Care Plan", name: "Care Plan Reminder", description: "Remind patients about their ongoing care plan activities", defaultTrigger: "Recurring schedule", triggerType: "recurring" },
];
