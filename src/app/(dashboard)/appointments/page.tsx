"use client";

import { useState, useMemo, useCallback } from "react";
import { mockAppointments } from "@/data/appointment-mock-data";
import { Appointment } from "@/data/appointment-types";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import AppointmentDateRange from "@/components/appointments/AppointmentDateRange";
import AppointmentDetailPanel from "@/components/appointments/AppointmentDetailPanel";
import ScheduleAppointmentModal from "@/components/appointments/ScheduleAppointmentModal";
import Pagination from "@/components/contacts/Pagination";
import { Search, X, RefreshCw, CalendarPlus } from "lucide-react";

type RangePreset = "today" | "week" | "month" | "custom";

function getDateRange(preset: RangePreset): { start: string; end: string } {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  switch (preset) {
    case "today":
      return { start: fmt(now), end: fmt(now) };
    case "week": {
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return { start: fmt(monday), end: fmt(sunday) };
    }
    case "month": {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { start: fmt(first), end: fmt(last) };
    }
    default:
      return { start: fmt(now), end: fmt(now) };
  }
}

export default function AppointmentsPage() {
  const [appointments] = useState<Appointment[]>(mockAppointments);

  // Date range
  const [preset, setPreset] = useState<RangePreset>("today");
  const initialRange = getDateRange("today");
  const [startDate, setStartDate] = useState(initialRange.start);
  const [endDate, setEndDate] = useState(initialRange.end);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  function handlePresetChange(p: RangePreset) {
    setPreset(p);
    if (p !== "custom") {
      const range = getDateRange(p);
      setStartDate(range.start);
      setEndDate(range.end);
    }
    setPage(1);
  }

  // Unique filter values
  const uniqueAccounts = [...new Set(appointments.map((a) => a.account))];
  const uniqueCalendars = [...new Set(appointments.map((a) => a.calendar))];
  const uniqueTypes = [...new Set(appointments.map((a) => a.appointment_type))];
  const uniqueStatuses = [...new Set(appointments.map((a) => a.status))];

  // Filtered data
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      // Date range
      const apptDate = appt.appointment_date.split("T")[0];
      if (apptDate < startDate || apptDate > endDate) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !appt.patient_name.toLowerCase().includes(q) &&
          !appt.appointment_type.toLowerCase().includes(q) &&
          !appt.calendar.toLowerCase().includes(q)
        ) return false;
      }

      // Filters
      if (accountFilter && appt.account !== accountFilter) return false;
      if (calendarFilter && appt.calendar !== calendarFilter) return false;
      if (typeFilter && appt.appointment_type !== typeFilter) return false;
      if (statusFilter && appt.status !== statusFilter) return false;

      return true;
    });
  }, [appointments, startDate, endDate, searchQuery, accountFilter, calendarFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / perPage);
  const paginatedAppointments = filteredAppointments.slice((page - 1) * perPage, page * perPage);

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  return (
    <div>
      {/* Header: title → subtitle 8px, subtitle → search 24px */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Appointments</h1>
          <p className="text-[16px] text-gray-500 mt-2">View and manage appointments</p>
        </div>
        <button
          onClick={() => setScheduleModalOpen(true)}
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <CalendarPlus size={16} />
          Add Appointment
        </button>
      </div>

      {/* Search + Refresh: 24px from subtitle */}
      <div className="flex items-center mt-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name, appointment type or calendar"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <RefreshCw size={16} />
        </button>
        <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">Last Refreshed on {refreshTime}</span>
      </div>

      {/* Result count: 20px from search */}
      <div className="text-sm text-gray-500 mt-5">
        Showing {Math.min((page - 1) * perPage + 1, filteredAppointments.length)}-{Math.min(page * perPage, filteredAppointments.length)} of <strong>{filteredAppointments.length}</strong> results
      </div>

      {/* Filters + Date Range: 16px from count, 20px to table */}
      <div className="flex items-center justify-between mt-4 mb-5 gap-4 flex-wrap">
        <AppointmentFilters
          accounts={uniqueAccounts}
          calendars={uniqueCalendars}
          appointmentTypes={uniqueTypes}
          statuses={uniqueStatuses}
          selectedAccount={accountFilter}
          selectedCalendar={calendarFilter}
          selectedType={typeFilter}
          selectedStatus={statusFilter}
          onAccountChange={(v) => { setAccountFilter(v); setPage(1); }}
          onCalendarChange={(v) => { setCalendarFilter(v); setPage(1); }}
          onTypeChange={(v) => { setTypeFilter(v); setPage(1); }}
          onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
        />
        <AppointmentDateRange
          preset={preset}
          startDate={startDate}
          endDate={endDate}
          onPresetChange={handlePresetChange}
          onStartDateChange={(d) => { setStartDate(d); setPage(1); }}
          onEndDateChange={(d) => { setEndDate(d); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <AppointmentsTable
          appointments={paginatedAppointments}
          onRowClick={setSelectedAppointment}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={filteredAppointments.length}
          onPageChange={setPage}
          onPerPageChange={(v) => { setPerPage(v); setPage(1); }}
        />
      </div>

      {/* Detail Panel */}
      <AppointmentDetailPanel
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* Schedule Modal */}
      <ScheduleAppointmentModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
      />
    </div>
  );
}
