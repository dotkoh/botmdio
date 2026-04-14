"use client";

import { useRef } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

type RangePreset = "today" | "week" | "month" | "custom";

interface AppointmentDateRangeProps {
  preset: RangePreset;
  startDate: string;
  endDate: string;
  onPresetChange: (preset: RangePreset) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export default function AppointmentDateRange({
  preset,
  startDate,
  endDate,
  onPresetChange,
  onStartDateChange,
  onEndDateChange,
}: AppointmentDateRangeProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const presets: { label: string; value: RangePreset }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => startRef.current?.showPicker()}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon size={14} className="text-gray-400" />
          <span>{formatDisplayDate(startDate)}</span>
          <ChevronDown size={12} className="text-gray-400" />
        </button>
        <input
          ref={startRef}
          type="date"
          value={startDate}
          onChange={(e) => {
            onStartDateChange(e.target.value);
            onPresetChange("custom");
          }}
          className="sr-only"
          tabIndex={-1}
        />

        <span className="text-gray-400">→</span>

        <button
          onClick={() => endRef.current?.showPicker()}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon size={14} className="text-gray-400" />
          <span>{formatDisplayDate(endDate)}</span>
          <ChevronDown size={12} className="text-gray-400" />
        </button>
        <input
          ref={endRef}
          type="date"
          value={endDate}
          onChange={(e) => {
            onEndDateChange(e.target.value);
            onPresetChange("custom");
          }}
          className="sr-only"
          tabIndex={-1}
        />
      </div>

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
    </div>
  );
}
