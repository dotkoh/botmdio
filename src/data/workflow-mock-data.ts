import { Workflow } from "./workflow-types";

export const mockWorkflows: Workflow[] = [
  {
    id: "wf_001", name: "ALL - Appointment Reminder", template_id: "tpl_appt_reminder",
    template_name: "Appointment Reminder", category: "appointment", workflow_type: "Appointment Reminder",
    applies_to: "6 appointments", when_to_send: "Send message 6 hours, 1 day before appointment",
    status: "active", attached_template: "Appointment Reminder",
    account: "marketing.digital@mediatrix.com.ph", channel: "messenger", created_at: "2026-03-01T00:00:00Z",
    created_by: "Dot Koh",
    audit_log: [
      { action: "Created workflow", user: "Dot Koh", timestamp: "2026-03-01T10:00:00Z" },
      { action: "Published workflow", user: "Dot Koh", timestamp: "2026-03-01T10:05:00Z" },
      { action: "Updated trigger timing to 6h, 1d before", user: "Dot Koh", timestamp: "2026-03-15T14:30:00Z" },
    ],
  },
  {
    id: "wf_002", name: "ALL - Cancellation Confirmation", template_id: "tpl_cancel_confirm",
    template_name: "Cancellation Confirmation", category: "appointment", workflow_type: "Cancellation Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is cancelled",
    status: "active", attached_template: "Appointment Cancellation",
    account: "marketing.digital@mediatrix.com.ph", channel: "messenger", created_at: "2026-03-01T00:00:00Z",
    created_by: "Dot Koh",
    audit_log: [
      { action: "Created workflow", user: "Dot Koh", timestamp: "2026-03-01T10:10:00Z" },
      { action: "Published workflow", user: "Dot Koh", timestamp: "2026-03-01T10:12:00Z" },
    ],
  },
  {
    id: "wf_003", name: "ALL - Confirmed Booking Confirmation", template_id: "tpl_update_confirm",
    template_name: "Update Confirmation", category: "appointment", workflow_type: "Update Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is updated",
    status: "active", attached_template: "Confirmed Booking Confirmation Message",
    account: "marketing.digital@mediatrix.com.ph", channel: "whatsapp", created_at: "2026-03-01T00:00:00Z",
    created_by: "Admin User",
    audit_log: [
      { action: "Created workflow", user: "Admin User", timestamp: "2026-03-01T11:00:00Z" },
      { action: "Published workflow", user: "Admin User", timestamp: "2026-03-01T11:05:00Z" },
      { action: "Duplicated from 'Booking Confirmation'", user: "Dot Koh", timestamp: "2026-03-10T09:00:00Z" },
    ],
  },
  {
    id: "wf_004", name: "ALL - Request Booking Confirmation", template_id: "tpl_booking_confirm",
    template_name: "Booking Confirmation", category: "appointment", workflow_type: "Booking Confirmation",
    applies_to: "6 appointments", when_to_send: "Send message when appointment is booked",
    status: "active", attached_template: "Request Booking Confirmation Message",
    account: "marketing.digital@mediatrix.com.ph", channel: "whatsapp", created_at: "2026-03-01T00:00:00Z",
    created_by: "Dot Koh",
    audit_log: [
      { action: "Created workflow", user: "Dot Koh", timestamp: "2026-03-01T09:00:00Z" },
      { action: "Published workflow", user: "Dot Koh", timestamp: "2026-03-01T09:05:00Z" },
    ],
  },
];
