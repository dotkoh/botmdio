"use client";

import CalendarPicker from "./CalendarPicker";

type RangePreset = "today" | "week" | "month" | "custom";

interface AppointmentDateRangeProps {
  preset: RangePreset;
  startDate: string;
  endDate: string;
  onPresetChange: (preset: RangePreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function AppointmentDateRange({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
}: AppointmentDateRangeProps) {
  const presets: { label: string; value: RangePreset }[] = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  return (
    <div className="flex items-center gap-3">
      <CalendarPicker
        selectedDate={startDate}
        onDateSelect={(d) => {
          onStartDateChange(d);
          onPresetChange("custom");
        }}
        endDate={endDate}
        onEndDateSelect={(d) => {
          onEndDateChange(d);
          onPresetChange("custom");
        }}
      />

      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onPresetChange(p.value)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              preset === p.value
                ? "bg-white text-[#4361EE] font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
