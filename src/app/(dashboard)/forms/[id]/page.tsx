"use client";

import { use, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  mockIntegratedForms,
  formProviders,
  formTypeLabels,
} from "@/data/form-provider-data";
import {
  getSurveyResponses,
  surveyResponseStatusLabels,
  SurveyResponse,
  SurveyResponseStatus,
} from "@/data/survey-response-data";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/contacts/Pagination";
import {
  ChevronLeft,
  Search,
  X as XIcon,
  RefreshCw,
  Send,
  PercentSquare,
  CheckCircle2,
  CircleSlash,
  Calendar as CalendarIcon,
} from "lucide-react";

type DateRangePreset = "all" | "day" | "week" | "month" | "custom";

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

const statusStyles: Record<SurveyResponseStatus, { dot: string; text: string; bg: string }> = {
  completed: {
    dot: "bg-green-500",
    text: "text-green-700 dark:text-green-300",
    bg: "bg-green-50 dark:bg-[#163826]",
  },
  not_completed: {
    dot: "bg-gray-400",
    text: "text-gray-600 dark:text-gray-300",
    bg: "bg-gray-100 dark:bg-[#1A2336]",
  },
};

const dateRangeOptions: { value: DateRangePreset; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "day", label: "Last 24 hours" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
  { value: "custom", label: "Custom range" },
];

export default function SurveyResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const form = mockIntegratedForms.find((f) => f.id === id);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangePreset>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [showCustom, setShowCustom] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (customRef.current && !customRef.current.contains(e.target as Node)) {
        setShowCustom(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const responses: SurveyResponse[] = useMemo(() => (form ? getSurveyResponses(form.id) : []), [form]);

  const totalSent = responses.length;
  const completedCount = useMemo(
    () => responses.filter((r) => r.status === "completed").length,
    [responses]
  );
  const notCompletedCount = totalSent - completedCount;
  const responseRate = totalSent === 0 ? 0 : Math.round((completedCount / totalSent) * 1000) / 10;

  const filtered = useMemo(() => {
    const now = new Date("2026-04-22T12:00:00Z").getTime();
    const dayMs = 86_400_000;

    return responses.filter((r) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.patient_name.toLowerCase().includes(q) && !r.patient_phone.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Status
      if (statusFilter && r.status !== statusFilter) return false;

      // Date range filter (against sent_at)
      const sent = new Date(r.sent_at).getTime();
      if (dateRange === "day" && sent < now - dayMs) return false;
      if (dateRange === "week" && sent < now - 7 * dayMs) return false;
      if (dateRange === "month" && sent < now - 30 * dayMs) return false;
      if (dateRange === "custom") {
        if (customStart) {
          const start = new Date(customStart + "T00:00:00Z").getTime();
          if (sent < start) return false;
        }
        if (customEnd) {
          const end = new Date(customEnd + "T23:59:59Z").getTime();
          if (sent > end) return false;
        }
      }

      return true;
    });
  }, [responses, searchQuery, statusFilter, dateRange, customStart, customEnd]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const hasFilters = !!(statusFilter || dateRange !== "all");

  function clearAllFilters() {
    setStatusFilter(null);
    setDateRange("all");
    setCustomStart("");
    setCustomEnd("");
    setShowCustom(false);
    setPage(1);
  }

  if (!form) {
    return (
      <div>
        <Link href="/forms" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back to Survey Data
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Form not found</h1>
        <p className="text-[16px] text-gray-500 mt-2">The form you&apos;re looking for doesn&apos;t exist or has been removed.</p>
      </div>
    );
  }

  const provider = formProviders.find((p) => p.id === form.provider_id);

  return (
    <div className="pb-16">
      <Link href="/forms" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back to Survey Data
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Survey Responses</h1>
        <p className="text-[16px] text-gray-500 mt-2">View all responses to your survey</p>

        {/* Form context line */}
        <div className="flex items-center gap-2 mt-4 flex-wrap text-sm text-gray-500">
          <span className="font-medium text-[#111824]">{form.name}</span>
          <span className="text-gray-300">•</span>
          <span>{provider?.name || form.provider_id}</span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center text-xs font-medium text-gray-700 dark:text-[#C7CFDB] bg-gray-100 dark:bg-[#1A2336] border border-gray-200 dark:border-[#263248] px-2 py-0.5 rounded-full">
            {formTypeLabels[form.form_type]}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Send size={18} className="text-blue-600" />}
          label="Patients sent"
          value={totalSent.toLocaleString()}
        />
        <StatCard
          icon={<PercentSquare size={18} className="text-violet-600" />}
          label="Response rate"
          value={`${responseRate}%`}
          sublabel={`${completedCount} of ${totalSent}`}
        />
        <StatCard
          icon={<CheckCircle2 size={18} className="text-green-600" />}
          label="Completed"
          value={completedCount.toLocaleString()}
        />
        <StatCard
          icon={<CircleSlash size={18} className="text-gray-500" />}
          label="Not completed"
          value={notCompletedCount.toLocaleString()}
        />
      </div>

      {/* Search + refresh */}
      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <RefreshCw size={16} />
        </button>
        <span className="ml-4 text-xs text-gray-400 whitespace-nowrap">Last Refreshed on {refreshTime}</span>
      </div>

      <div className="text-sm text-gray-500 mt-5">
        Showing {Math.min((page - 1) * perPage + 1, filtered.length)}-
        {Math.min(page * perPage, filtered.length)} of <strong>{filtered.length}</strong> results
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mt-4 mb-5 flex-wrap">
        {/* Date range dropdown (with inline custom-range popover) */}
        <div ref={customRef} className="relative">
          <Dropdown
            label="Date sent"
            value={dateRange === "all" ? null : dateRange}
            options={dateRangeOptions
              .filter((o) => o.value !== "all")
              .map((o) => ({ value: o.value, label: o.label }))}
            onChange={(v) => {
              const next = (v as DateRangePreset | null) ?? "all";
              setDateRange(next);
              setPage(1);
              if (next === "custom") {
                setShowCustom(true);
              } else {
                setShowCustom(false);
              }
            }}
          />
          {dateRange === "custom" && showCustom && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 p-4 min-w-[300px]">
              <div className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                <CalendarIcon size={12} /> Custom date range (sent date)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => {
                      setCustomStart(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => {
                      setCustomEnd(e.target.value);
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => setShowCustom(false)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        <Dropdown
          label="Status"
          value={statusFilter}
          options={[
            { value: "completed", label: "Completed" },
            { value: "not_completed", label: "Not Completed" },
          ]}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        />

        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F6F8] dark:bg-[#1A2336] border-b border-gray-200 dark:border-[#263248]">
                <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] pl-6 pr-5 py-4">Patient</th>
                <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Date Sent</th>
                <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Date Completed</th>
                <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const style = statusStyles[r.status];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 dark:border-[#1D2638] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                  >
                    <td className="pl-6 pr-5 py-5">
                      <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{r.patient_name}</div>
                      <div className="text-xs text-gray-400 dark:text-[#8E99AB] mt-0.5">{r.patient_phone}</div>
                    </td>
                    <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB] whitespace-nowrap">
                      {formatDateTime(r.sent_at)}
                    </td>
                    <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB] whitespace-nowrap">
                      {r.completed_at ? formatDateTime(r.completed_at) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {surveyResponseStatusLabels[r.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-400">
                    No responses match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={filtered.length}
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

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold text-[#111824] dark:text-[#F5F7FB] mt-3 tabular-nums">{value}</div>
      {sublabel && <div className="text-xs text-gray-400 mt-1">{sublabel}</div>}
    </div>
  );
}
