"use client";

import { Appointment, AppointmentStatus } from "@/data/appointment-types";
import { MoreVertical } from "lucide-react";

const statusStyles: Record<AppointmentStatus, string> = {
  scheduled: "text-blue-600",
  confirmed: "text-green-600",
  cancelled: "text-red-500",
  completed: "text-gray-500",
  no_show: "text-amber-600",
};

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

interface AppointmentsTableProps {
  appointments: Appointment[];
  onRowClick: (appointment: Appointment) => void;
}

export default function AppointmentsTable({ appointments, onRowClick }: AppointmentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] border-b border-gray-200">
            <th className="text-left text-[14px] font-normal text-[#111824] pl-6 pr-5 py-4">Patient</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Appointment ID</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Appointment Type</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Calendar</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Appointment Date</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Booking Date</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Status</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr
              key={appt.id}
              onClick={() => onRowClick(appt)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="pl-6 pr-5 py-5">
                <div className="text-sm font-medium text-[#111824]">{appt.patient_name}</div>
                <div className="text-xs text-gray-400">{appt.patient_email}</div>
              </td>
              <td className="px-5 py-5 text-sm text-gray-700">{appt.appointment_id}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{appt.appointment_type}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{appt.calendar}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{formatDate(appt.appointment_date)}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{formatDate(appt.booking_date)}</td>
              <td className="px-5 py-5">
                <span className={`text-sm font-medium ${statusStyles[appt.status]}`}>
                  {statusLabels[appt.status]}
                </span>
              </td>
              <td className="px-5 py-5">
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                No appointments found for this date range
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
