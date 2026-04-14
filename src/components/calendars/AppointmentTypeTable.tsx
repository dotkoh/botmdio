"use client";

import { AppointmentTypeRow } from "@/data/calendar-types";

interface AppointmentTypeTableProps {
  rows: AppointmentTypeRow[];
}

export default function AppointmentTypeTable({
  rows,
}: AppointmentTypeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] border-b border-gray-200">
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">
              Account
            </th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">
              Calendar
            </th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">
              Appointment Type
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.appointmentTypeId}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-5 py-3.5 text-sm text-gray-700">
                {row.account}
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-700">
                {row.calendar}
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-700">
                {row.appointmentType}
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-5 py-12 text-center text-sm text-gray-400"
              >
                No appointment types found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
