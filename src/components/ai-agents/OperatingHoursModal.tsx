"use client";

import { useState } from "react";
import { OperatingHours } from "@/data/ai-agent-mock-data";
import Modal from "@/components/ui/Modal";

interface OperatingHoursModalProps {
  open: boolean;
  hours: OperatingHours[];
  onClose: () => void;
  onSave: (hours: OperatingHours[]) => void;
}

const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

export default function OperatingHoursModal({ open, hours, onClose, onSave }: OperatingHoursModalProps) {
  const [local, setLocal] = useState<OperatingHours[]>(hours);

  function toggleDay(day: string) {
    setLocal((prev) => prev.map((h) => (h.day === day ? { ...h, enabled: !h.enabled } : h)));
  }

  function updateTime(day: string, field: "start" | "end", value: string) {
    setLocal((prev) => prev.map((h) => (h.day === day ? { ...h, [field]: value } : h)));
  }

  function handleSave() {
    onSave(local);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit operating hours"
      width="w-[600px]"
      footer={
        <>
          <button onClick={onClose} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Save changes
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-500 mb-5">Define the hours where your human agents are available for handover.</p>
      <div className="space-y-3">
        {local.map((h) => (
          <div key={h.day} className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={() => toggleDay(h.day)}
                className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
              />
              <span className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{h.day}</span>
            </label>
            {h.enabled ? (
              <div className="flex items-center gap-2">
                <select
                  value={h.start}
                  onChange={(e) => updateTime(h.day, "start", e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="text-gray-400 text-sm">—</span>
                <select
                  value={h.end}
                  onChange={(e) => updateTime(h.day, "end", e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                >
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
