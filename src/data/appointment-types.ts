export type AppointmentStatus = "scheduled" | "confirmed" | "cancelled" | "completed" | "no_show";

export interface AppointmentLogEntry {
  agent: string;
  timestamp: string;
  action: string;
  detail?: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  appointment_id: string;
  appointment_type: string;
  calendar: string;
  account: string;
  provider: string;
  appointment_date: string;
  booking_date: string;
  status: AppointmentStatus;
  last_sync_time: string | null;
  log: AppointmentLogEntry[];
}
