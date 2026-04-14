"use client";

import { Calendar as CalendarIcon } from "lucide-react";

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
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onPresetChange(p.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              preset === p.value
                ? "bg-white text-[#111824] font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <CalendarIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              onStartDateChange(e.target.value);
              onPresetChange("custom");
            }}
            className="pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none"
          />
        </div>
        <span className="text-gray-400">→</span>
        <div className="relative">
          <CalendarIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              onEndDateChange(e.target.value);
              onPresetChange("custom");
            }}
            className="pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
}
