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
  { id: "tpl_pre_visit_reg", category: "prom_prem", subcategory: "Registration", name: "Pre-Visit Registration", description: "Send pre-visit registration forms to patients before their admission", defaultTrigger: "X days before appointment", triggerType: "before", event: "appointment.booked" },
  { id: "tpl_post_visit_survey", category: "prom_prem", subcategory: "Survey", name: "Post-Visit Survey", description: "Send post-visit surveys to patients after their visit or discharge", defaultTrigger: "X hours/days after visit", triggerType: "after", event: "appointment.completed" },
  { id: "tpl_prom_survey", category: "prom_prem", subcategory: "PROM", name: "PROM Survey", description: "Send clinical outcome surveys to patients at predefined intervals pre and post visit", defaultTrigger: "At predefined intervals", triggerType: "recurring" },
  { id: "tpl_prem_survey", category: "prom_prem", subcategory: "Survey", name: "PREM Survey", description: "Send patient experience surveys to measure satisfaction with care delivery and service quality", defaultTrigger: "X days after visit", triggerType: "after", event: "appointment.completed" },

  // === MEDICATION ===
  { id: "tpl_prescription_ready", category: "medication", subcategory: "Medication", name: "Prescription Ready", description: "Notify patients when their prescription is ready for pickup", defaultTrigger: "Immediately when filled", triggerType: "immediately", event: "prescription.filled" },
  { id: "tpl_med_reminder", category: "medication", subcategory: "Medication", name: "Medication Reminder", description: "Remind patients to take their scheduled medication", defaultTrigger: "At scheduled dose time", triggerType: "recurring" },
  { id: "tpl_refill_reminder", category: "medication", subcategory: "Medication", name: "Refill Reminder", description: "Remind patients when it's time to refill their medication", defaultTrigger: "X days before refill due", triggerType: "before" },
  { id: "tpl_adherence_checkin", category: "medication", subcategory: "Adherence", name: "Adherence Check-in", description: "Check in with patients about their treatment adherence", defaultTrigger: "Recurring (daily/weekly)", triggerType: "recurring" },

  // === PAYMENT ===
  { id: "tpl_payment_notif", category: "payment", subcategory: "Payment", name: "Payment Notification", description: "Notify patient that payment is due", defaultTrigger: "Immediately upon creation", triggerType: "immediately", event: "invoice.created" },
  { id: "tpl_payment_confirm", category: "payment", subcategory: "Payment", name: "Payment Confirmation", description: "Confirm receipt of payment", defaultTrigger: "Immediately upon payment", triggerType: "immediately", event: "payment.received" },
  { id: "tpl_payment_reminder", category: "payment", subcategory: "Payment", name: "Payment Reminder", description: "Remind patient to pay an overdue invoice", defaultTrigger: "X days after due date", triggerType: "after", event: "payment.overdue" },

  // === CLINICAL NOTIFICATIONS ===
  { id: "tpl_pre_visit_reminder", category: "clinical", subcategory: "Pre-visit", name: "Pre-Visit Reminder", description: "Send pre-visit preparation instructions and reminders to patients", defaultTrigger: "X days before appointment", triggerType: "before", event: "appointment.booked" },
  { id: "tpl_post_discharge_instructions", category: "clinical", subcategory: "Post-discharge", name: "Post-Discharge Instructions", description: "Send discharge instructions and care plan to patients after discharge", defaultTrigger: "Immediately upon discharge", triggerType: "immediately", event: "patient.discharged" },
  { id: "tpl_post_discharge_check", category: "clinical", subcategory: "Post-discharge", name: "Post-Discharge Check", description: "Follow up with patients after discharge to check on recovery", defaultTrigger: "X hours/days after discharge", triggerType: "after", event: "patient.discharged" },
  { id: "tpl_lab_results", category: "clinical", subcategory: "Results", name: "Lab Results Ready", description: "Notify patients when their lab results are available for review", defaultTrigger: "Immediately when available", triggerType: "immediately", event: "lab.results_ready" },
  { id: "tpl_radiology_report", category: "clinical", subcategory: "Results", name: "Radiology Report Ready", description: "Notify patients when their radiology report is ready for review", defaultTrigger: "Immediately when available", triggerType: "immediately", event: "radiology.report_ready" },
];
