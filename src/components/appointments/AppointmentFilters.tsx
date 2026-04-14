"use client";

import Dropdown from "@/components/ui/Dropdown";

interface AppointmentFiltersProps {
  accounts: string[];
  calendars: string[];
  appointmentTypes: string[];
  statuses: string[];
  selectedAccount: string | null;
  selectedCalendar: string | null;
  selectedType: string | null;
  selectedStatus: string | null;
  onAccountChange: (v: string | null) => void;
  onCalendarChange: (v: string | null) => void;
  onTypeChange: (v: string | null) => void;
  onStatusChange: (v: string | null) => void;
}

export default function AppointmentFilters({
  accounts,
  calendars,
  appointmentTypes,
  statuses,
  selectedAccount,
  selectedCalendar,
  selectedType,
  selectedStatus,
  onAccountChange,
  onCalendarChange,
  onTypeChange,
  onStatusChange,
}: AppointmentFiltersProps) {
  const hasFilters = selectedAccount || selectedCalendar || selectedType || selectedStatus;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Dropdown label="Account" value={selectedAccount} options={accounts.map((a) => ({ label: a, value: a }))} onChange={onAccountChange} />
      <Dropdown label="Calendar" value={selectedCalendar} options={calendars.map((c) => ({ label: c, value: c }))} onChange={onCalendarChange} />
      <Dropdown label="Appointment Type" value={selectedType} options={appointmentTypes.map((t) => ({ label: t, value: t }))} onChange={onTypeChange} />
      <Dropdown label="Status" value={selectedStatus} options={statuses.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1).replace("_", " "), value: s }))} onChange={onStatusChange} />
      {hasFilters && (
        <button
          onClick={() => { onAccountChange(null); onCalendarChange(null); onTypeChange(null); onStatusChange(null); }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
