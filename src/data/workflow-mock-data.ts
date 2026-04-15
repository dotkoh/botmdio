import { Workflow } from "./workflow-types";

export const mockWorkflows: Workflow[] = [
  {
    id: "wf_001", name: "ALL - Appointment Reminder", template_id: "tpl_appt_reminder",
    template_name: "Appointment Reminder", category: "appointment", workflow_type: "Appointment Reminder",
    applies_to: "6 appointments", when_to_send: "Send message 6 hours, 1 day before appointment",
    status: "active", attached_template: "Appointment Reminder",
    account: "marketing.digital@mediatrix.com.ph", channel: "Messenger", created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "wf_002", name: "ALL - Cancellation Confirmation", template_id: "tpl_cancel_confirm",
    template_name: "Cancellation Confirmation", category: "appointment", workflow_type: "Cancellation Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is cancelled",
    status: "active", attached_template: "Appointment Cancellation",
    account: "marketing.digital@mediatrix.com.ph", channel: "Messenger", created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "wf_003", name: "ALL - Confirmed Booking Confirmation", template_id: "tpl_update_confirm",
    template_name: "Update Confirmation", category: "appointment", workflow_type: "Update Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is updated",
    status: "active", attached_template: "Confirmed Booking Confirmation Message",
    account: "marketing.digital@mediatrix.com.ph", channel: "Messenger", created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "wf_004", name: "ALL - Request Booking Confirmation", template_id: "tpl_booking_confirm",
    template_name: "Booking Confirmation", category: "appointment", workflow_type: "Booking Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is booked",
    status: "active", attached_template: "Request Booking Confirmation Message",
    account: "marketing.digital@mediatrix.com.ph", channel: "Messenger", created_at: "2026-03-01T00:00:00Z",
  },
];
