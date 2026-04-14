import { CalendarIntegration, Calendar, AppointmentType, AppointmentTypeRow } from "./calendar-types";

export const mockIntegrations: CalendarIntegration[] = [
  {
    id: "int_acuity_001",
    org_id: "mediatrix",
    provider: "acuity",
    provider_name: "Acuity Scheduling",
    account_identifier: "marketing.digital@mediatrix.com.ph",
    account_label: "Mary Mediatrix Medical Center",
    status: "connected",
    webhook_url: "https://nova-api.production.botmd.io/acuity/2SXaySGdTuAk4fYl/callback",
    created_at: "2025-11-27T00:00:00Z",
    last_synced_at: "2026-04-14T07:20:00Z",
    is_active: true,
  },
];

export const mockCalendars: Calendar[] = [
  { id: "cal_001", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_mri", name: "MRI", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_002", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_ct", name: "CT Scan", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_003", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_us", name: "Ultrasound", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_004", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_nm", name: "Nuclear Medicine", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_005", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_mammo", name: "Mammography", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_006", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_bu", name: "Breast Ultrasound", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_007", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_wm", name: "Weight Management", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_008", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_emg", name: "EMG/NCV", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_009", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_sleep", name: "Sleep Lab", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
  { id: "cal_010", integration_id: "int_acuity_001", org_id: "mediatrix", external_id: "ext_eeg", name: "EEG", timezone: "Asia/Manila", is_enabled_for_ai: true, synced_at: "2026-04-14T07:20:00Z" },
];

function apt(id: string, calId: string, name: string, category: string, isRequest: boolean, confirmedId?: string): AppointmentType {
  return {
    id,
    integration_id: "int_acuity_001",
    calendar_id: calId,
    org_id: "mediatrix",
    external_id: `ext_${id}`,
    name,
    duration_minutes: 30,
    category,
    is_request_type: isRequest,
    confirmed_type_id: confirmedId,
    is_enabled_for_ai: true,
    synced_at: "2026-04-14T07:20:00Z",
  };
}

export const mockAppointmentTypes: AppointmentType[] = [
  apt("apt_001", "cal_001", "MRI Contrast - Request", "MRI", true, "apt_002"),
  apt("apt_002", "cal_001", "MRI Contrast - Confirmed", "MRI", false),
  apt("apt_003", "cal_001", "MRI without Contrast - Request", "MRI", true, "apt_004"),
  apt("apt_004", "cal_001", "MRI without Contrast - Confirmed", "MRI", false),
  apt("apt_005", "cal_002", "CT Scan Contrast - Request", "CT Scan", true, "apt_006"),
  apt("apt_006", "cal_002", "CT Scan Contrast - Confirmed", "CT Scan", false),
  apt("apt_007", "cal_002", "CT Scan without Contrast - Request", "CT Scan", true, "apt_008"),
  apt("apt_008", "cal_002", "CT Scan without Contrast - Confirmed", "CT Scan", false),
  apt("apt_009", "cal_003", "Ultrasound - Request", "Ultrasound", true, "apt_010"),
  apt("apt_010", "cal_003", "Ultrasound - Confirmed", "Ultrasound", false),
  apt("apt_011", "cal_004", "Nuclear Medicine - Request", "Nuclear Medicine", true, "apt_012"),
  apt("apt_012", "cal_004", "Nuclear Medicine - Confirmed", "Nuclear Medicine", false),
  apt("apt_013", "cal_005", "Mammogram Request", "Mammography", true, "apt_014"),
  apt("apt_014", "cal_005", "Mammogram Confirmed", "Mammography", false),
  apt("apt_015", "cal_006", "Breast Ultrasound Request", "Breast Ultrasound", true, "apt_016"),
  apt("apt_016", "cal_006", "Breast Ultrasound Confirmed", "Breast Ultrasound", false),
  apt("apt_017", "cal_007", "Weight Management - Request", "Weight Management", true, "apt_018"),
  apt("apt_018", "cal_007", "Weight Management - Confirmed", "Weight Management", false),
  apt("apt_019", "cal_008", "EMG NCV Request", "EMG/NCV", true, "apt_020"),
  apt("apt_020", "cal_008", "EMG NCV Confirmed", "EMG/NCV", false),
  apt("apt_021", "cal_009", "Sleep Study Request", "Sleep Lab", true, "apt_022"),
  apt("apt_022", "cal_009", "Sleep Study Confirmed", "Sleep Lab", false),
  apt("apt_023", "cal_010", "Electroencephalogram (EEG) Request", "EEG", true, "apt_024"),
  apt("apt_024", "cal_010", "Electroencephalogram (EEG) Confirmed", "EEG", false),
];

export function buildAppointmentTypeRows(
  integrations: CalendarIntegration[],
  calendars: Calendar[],
  appointmentTypes: AppointmentType[]
): AppointmentTypeRow[] {
  return appointmentTypes.map((apt) => {
    const cal = calendars.find((c) => c.id === apt.calendar_id);
    const integration = integrations.find((i) => i.id === apt.integration_id);
    return {
      account: integration?.account_identifier || "-",
      calendar: cal?.name || "-",
      appointmentType: apt.name,
      appointmentTypeId: apt.id,
    };
  });
}
