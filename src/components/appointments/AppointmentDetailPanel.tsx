"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Appointment, AppointmentStatus } from "@/data/appointment-types";
import { X, RotateCcw, MoreVertical } from "lucide-react";

const statusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-show",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface AppointmentDetailPanelProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function AppointmentDetailPanel({ appointment, onClose }: AppointmentDetailPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [appointment]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (appointment) {
      document.addEventListener("mousedown", handleClick);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("mousedown", handleClick); document.body.style.overflow = ""; };
  }, [appointment, onClose]);

  if (!appointment) return null;

  const fields = [
    { label: "Patient", value: appointment.patient_name },
    { label: "Appointment Type", value: appointment.appointment_type },
    { label: "Calendar", value: appointment.calendar },
    { label: "Appointment date", value: formatDate(appointment.appointment_date) },
    { label: "Appointment status", value: statusLabels[appointment.status] },
    { label: "Booking date", value: formatDate(appointment.booking_date) },
    { label: "Last sync time", value: appointment.last_sync_time ? formatDate(appointment.last_sync_time) : "-" },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div ref={ref} className="absolute right-0 top-0 h-full w-[480px] max-w-[90vw] bg-white shadow-xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111824]">Appointment</h2>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Reschedule">
              <RotateCcw size={18} />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30 min-w-[160px]">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Fields */}
          <div className="px-6 py-5 space-y-5">
            {fields.map((f) => (
              <div key={f.label}>
                <div className="text-xs text-gray-400 mb-0.5">{f.label}</div>
                <div className="text-sm font-medium text-[#111824]">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Appointment Log */}
          <div className="px-6 py-5 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-[#111824] mb-4">Appointment Log</h3>
            <div className="space-y-3">
              {appointment.log.map((entry, i) => (
                <div key={i} className="flex gap-3 border border-gray-100 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src="/botmd-icon.png" alt="" width={32} height={32} className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-gray-500">{entry.agent}</span>
                      <span className="text-xs text-gray-400">{formatDate(entry.timestamp)}</span>
                    </div>
                    <div className="text-sm text-[#111824]">{entry.action}</div>
                    {entry.detail && (
                      <div className="text-sm text-gray-500">{entry.detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
