"use client";

import { useState, useMemo, useCallback, use } from "react";
import Link from "next/link";
import { providers } from "@/data/calendar-providers";
import {
  mockIntegrations,
  mockCalendars,
  mockAppointmentTypes,
  buildAppointmentTypeRows,
} from "@/data/calendar-mock-data";
import { AppointmentTypeRow } from "@/data/calendar-types";
import AppointmentTypeTable from "@/components/calendars/AppointmentTypeTable";
import CalendarFilters from "@/components/calendars/CalendarFilters";
import Pagination from "@/components/contacts/Pagination";
import { ChevronLeft, Search, X, RefreshCw } from "lucide-react";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: providerId } = use(params);
  const provider = providers.find((p) => p.id === providerId);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<string | null>(null);
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Build rows from mock data
  const allRows = useMemo(
    () =>
      buildAppointmentTypeRows(
        mockIntegrations.filter((i) => i.provider === providerId),
        mockCalendars,
        mockAppointmentTypes
      ),
    [providerId]
  );

  // Unique filter values
  const uniqueAccounts = useMemo(
    () => [...new Set(allRows.map((r) => r.account))],
    [allRows]
  );
  const uniqueCalendars = useMemo(
    () => [...new Set(allRows.map((r) => r.calendar))],
    [allRows]
  );
  const uniqueAppointmentTypes = useMemo(
    () => [...new Set(allRows.map((r) => r.appointmentType))],
    [allRows]
  );

  // Filtered rows
  const filteredRows = useMemo(() => {
    let result = allRows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) =>
        r.appointmentType.toLowerCase().includes(q)
      );
    }
    if (accountFilter) {
      result = result.filter((r) => r.account === accountFilter);
    }
    if (calendarFilter) {
      result = result.filter((r) => r.calendar === calendarFilter);
    }
    if (appointmentTypeFilter) {
      result = result.filter((r) => r.appointmentType === appointmentTypeFilter);
    }
    return result;
  }, [allRows, searchQuery, accountFilter, calendarFilter, appointmentTypeFilter]);

  const totalPages = Math.ceil(filteredRows.length / perPage);
  const paginatedRows = useMemo(
    () => filteredRows.slice((page - 1) * perPage, page * perPage),
    [filteredRows, page, perPage]
  );

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", {
    month: "long",
  })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;

  if (!provider) {
    return (
      <div>
        <Link
          href="/calendars"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft size={16} />
          Back
        </Link>
        <h1 className="text-[32px] font-medium text-[#111824]">Provider not found</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Back navigation */}
      <Link
        href="/calendars"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      {/* Header */}
      <h1 className="text-[32px] font-medium text-[#111824] mb-5">
        {provider.name}
      </h1>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by appointment type"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <RefreshCw size={16} />
        </button>
        <span className="text-xs text-gray-400">
          Last Refreshed on {refreshTime}
        </span>
      </div>

      {/* Result count */}
      <div className="text-sm text-gray-500 mb-3">
        Showing{" "}
        {Math.min((page - 1) * perPage + 1, filteredRows.length)}-
        {Math.min(page * perPage, filteredRows.length)} of{" "}
        <strong>{filteredRows.length}</strong> results
      </div>

      {/* Filters */}
      <div className="mb-4">
        <CalendarFilters
          accounts={uniqueAccounts}
          calendars={uniqueCalendars}
          appointmentTypes={uniqueAppointmentTypes}
          selectedAccount={accountFilter}
          selectedCalendar={calendarFilter}
          selectedAppointmentType={appointmentTypeFilter}
          onAccountChange={(v) => {
            setAccountFilter(v);
            setPage(1);
          }}
          onCalendarChange={(v) => {
            setCalendarFilter(v);
            setPage(1);
          }}
          onAppointmentTypeChange={(v) => {
            setAppointmentTypeFilter(v);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <AppointmentTypeTable rows={paginatedRows} />
        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={filteredRows.length}
          onPageChange={setPage}
          onPerPageChange={(v) => {
            setPerPage(v);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
