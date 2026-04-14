"use client";

import Dropdown from "@/components/ui/Dropdown";

interface CalendarFiltersProps {
  accounts: string[];
  calendars: string[];
  appointmentTypes: string[];
  selectedAccount: string | null;
  selectedCalendar: string | null;
  selectedAppointmentType: string | null;
  onAccountChange: (value: string | null) => void;
  onCalendarChange: (value: string | null) => void;
  onAppointmentTypeChange: (value: string | null) => void;
}

export default function CalendarFilters({
  accounts,
  calendars,
  appointmentTypes,
  selectedAccount,
  selectedCalendar,
  selectedAppointmentType,
  onAccountChange,
  onCalendarChange,
  onAppointmentTypeChange,
}: CalendarFiltersProps) {
  const hasFilters =
    selectedAccount !== null ||
    selectedCalendar !== null ||
    selectedAppointmentType !== null;

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        label="Account"
        value={selectedAccount}
        options={accounts.map((a) => ({ label: a, value: a }))}
        onChange={onAccountChange}
      />
      <Dropdown
        label="Calendar"
        value={selectedCalendar}
        options={calendars.map((c) => ({ label: c, value: c }))}
        onChange={onCalendarChange}
      />
      <Dropdown
        label="Appointment Type"
        value={selectedAppointmentType}
        options={appointmentTypes.map((t) => ({ label: t, value: t }))}
        onChange={onAppointmentTypeChange}
      />
      {hasFilters && (
        <button
          onClick={() => {
            onAccountChange(null);
            onCalendarChange(null);
            onAppointmentTypeChange(null);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
