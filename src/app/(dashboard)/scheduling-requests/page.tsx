"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  mockSchedulingRequests,
  schedulingRequestStatusLabels,
  schedulingRequestStatusStyles,
  PreferredSlot,
  SchedulingRequest,
  SchedulingRequestStatus,
} from "@/data/scheduling-request-data";
import { mockHospitalUsers } from "@/data/rule-mock-data";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/contacts/Pagination";
import {
  Search,
  X as XIcon,
  RefreshCw,
  MoreVertical,
  CalendarPlus,
  PhoneCall,
  XCircle,
  CheckCircle2,
  Mail,
  ClipboardList,
} from "lucide-react";

function formatSubmittedAt(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${datePart}, ${timePart}`;
}

function formatSlot(slot: PreferredSlot): string {
  const d = new Date(slot.date);
  const day = d.toLocaleDateString("en-GB", { weekday: "short" });
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${day} ${date}, ${slot.period}`;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatSubmittedAt(iso);
}

export default function SchedulingRequestsPage() {
  const [requests, setRequests] = useState<SchedulingRequest[]>(mockSchedulingRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarFilter, setCalendarFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [assignedFilter, setAssignedFilter] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const uniqueCalendars = useMemo(() => {
    const map = new Map<string, string>();
    requests.forEach((r) => map.set(r.calendar_id, r.calendar_name));
    return Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));
  }, [requests]);

  const userOptions = useMemo(
    () => [
      { value: "__unassigned__", label: "Unassigned" },
      ...mockHospitalUsers.map((u) => ({ value: u.id, label: u.name })),
    ],
    []
  );

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hits =
          r.patient_name.toLowerCase().includes(q) ||
          r.patient_phone.toLowerCase().includes(q) ||
          (r.patient_email?.toLowerCase().includes(q) ?? false);
        if (!hits) return false;
      }
      if (calendarFilter && r.calendar_id !== calendarFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (assignedFilter) {
        if (assignedFilter === "__unassigned__") {
          if (r.assigned_to_user_id !== null) return false;
        } else {
          if (r.assigned_to_user_id !== assignedFilter) return false;
        }
      }
      return true;
    });
  }, [requests, searchQuery, calendarFilter, statusFilter, assignedFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  const hasFilters = !!(calendarFilter || statusFilter || assignedFilter);

  function clearAllFilters() {
    setCalendarFilter(null);
    setStatusFilter(null);
    setAssignedFilter(null);
    setPage(1);
  }

  function updateStatus(id: string, status: SchedulingRequestStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setOpenMenu(null);
  }

  const activeRequest = activeRequestId ? requests.find((r) => r.id === activeRequestId) ?? null : null;

  const isEmpty = requests.length === 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Requests</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          Appointment requests collected by your{" "}
          <Link href="/rules" className="text-blue-600 hover:underline">
            Scheduling Rules
          </Link>
          . Confirm a slot in the calendar or hand back to the patient.
        </p>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center mb-4">
            <ClipboardList size={28} className="text-[#4361EE]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111824] mb-2">No appointment requests yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Requests appear here when a Scheduling Rule is set to <em>Request preferred date and time</em> and a patient submits their availability.
          </p>
          <Link
            href="/rules"
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Configure Scheduling Rules
          </Link>
        </div>
      ) : (
        <>
          {/* Search + refresh */}
          <div className="flex items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, phone or email..."
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
            <Dropdown
              label="Calendar"
              value={calendarFilter}
              options={uniqueCalendars}
              onChange={(v) => {
                setCalendarFilter(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Status"
              value={statusFilter}
              options={(Object.keys(schedulingRequestStatusLabels) as SchedulingRequestStatus[]).map((s) => ({
                value: s,
                label: schedulingRequestStatusLabels[s],
              }))}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            />
            <Dropdown
              label="Assigned to"
              value={assignedFilter}
              options={userOptions}
              onChange={(v) => {
                setAssignedFilter(v);
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
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Calendar</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Appointment Type</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Preferred Date(s) &amp; Time(s)</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Status</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Submitted</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Assigned to</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((req) => {
                    const statusStyle = schedulingRequestStatusStyles[req.status];
                    const assignedUser = req.assigned_to_user_id
                      ? mockHospitalUsers.find((u) => u.id === req.assigned_to_user_id)
                      : null;

                    return (
                      <tr
                        key={req.id}
                        onClick={() => setActiveRequestId(req.id)}
                        className="border-b border-gray-100 dark:border-[#1D2638] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors cursor-pointer"
                      >
                        <td className="pl-6 pr-5 py-5">
                          <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{req.patient_name}</div>
                          <div className="text-xs text-gray-400 dark:text-[#8E99AB] mt-0.5">{req.patient_phone}</div>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">{req.calendar_name}</td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">{req.appointment_type}</td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">
                          <div className="flex flex-col gap-0.5">
                            {req.preferred_slots.map((s, idx) => (
                              <span key={idx} className="whitespace-nowrap">{formatSlot(s)}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {schedulingRequestStatusLabels[req.status]}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB] whitespace-nowrap">
                          {timeAgo(req.submitted_at)}
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">
                          {assignedUser ? (
                            assignedUser.name
                          ) : (
                            <span className="text-gray-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-5 py-5">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(openMenu === req.id ? null : req.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === req.id && (
                              <div
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[200px] py-1"
                              >
                                <button
                                  onClick={() => {
                                    setActiveRequestId(req.id);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <CalendarPlus size={14} /> Schedule now
                                </button>
                                <button
                                  onClick={() => updateStatus(req.id, "contacted")}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <PhoneCall size={14} /> Mark as contacted
                                </button>
                                <button
                                  onClick={() => updateStatus(req.id, "scheduled")}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <CheckCircle2 size={14} /> Mark as scheduled
                                </button>
                                <div className="border-t border-gray-100 dark:border-[#1D2638] my-1" />
                                <button
                                  onClick={() => updateStatus(req.id, "declined")}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors"
                                >
                                  <XCircle size={14} /> Decline request
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">
                        No requests match your filters
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
        </>
      )}

      {/* Detail drawer */}
      {activeRequest && (
        <RequestDrawer
          request={activeRequest}
          onClose={() => setActiveRequestId(null)}
          onStatusChange={(status) => updateStatus(activeRequest.id, status)}
        />
      )}
    </div>
  );
}

function RequestDrawer({
  request,
  onClose,
  onStatusChange,
}: {
  request: SchedulingRequest;
  onClose: () => void;
  onStatusChange: (status: SchedulingRequestStatus) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const assignedUser = request.assigned_to_user_id
    ? mockHospitalUsers.find((u) => u.id === request.assigned_to_user_id)
    : null;
  const statusStyle = schedulingRequestStatusStyles[request.status];

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-[520px] max-w-[95vw] bg-white dark:bg-[#0A1020] border-l border-gray-200 dark:border-[#263248] flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200 dark:border-[#263248]">
          <div>
            <div className="text-xs text-gray-400 mb-1">Appointment Request</div>
            <h2 className="text-xl font-semibold text-[#111824] dark:text-[#F5F7FB]">{request.patient_name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {schedulingRequestStatusLabels[request.status]}
              </span>
              <span className="text-xs text-gray-400">Submitted {timeAgo(request.submitted_at)}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors">
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Contact */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#111824] dark:text-[#F5F7FB]">
                <PhoneCall size={14} className="text-gray-400" />
                <a href={`tel:${request.patient_phone}`} className="hover:underline">{request.patient_phone}</a>
              </div>
              {request.patient_email && (
                <div className="flex items-center gap-2 text-sm text-[#111824] dark:text-[#F5F7FB]">
                  <Mail size={14} className="text-gray-400" />
                  <a href={`mailto:${request.patient_email}`} className="hover:underline">{request.patient_email}</a>
                </div>
              )}
            </div>
          </div>

          {/* Appointment */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Appointment</div>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-32 text-gray-500">Calendar</span>
                <span className="text-[#111824] dark:text-[#F5F7FB]">{request.calendar_name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">Type</span>
                <span className="text-[#111824] dark:text-[#F5F7FB]">{request.appointment_type}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-500">From rule</span>
                <Link
                  href={`/rules/${request.source_rule_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {request.source_rule_name}
                </Link>
              </div>
            </div>
          </div>

          {/* Preferred slots */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Preferred Date(s) &amp; Time(s)
            </div>
            <div className="space-y-2">
              {request.preferred_slots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-gray-200 dark:border-[#263248] rounded-lg px-4 py-2.5"
                >
                  <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{formatSlot(slot)}</span>
                  <button className="text-xs text-blue-600 hover:underline font-medium">
                    Confirm this slot
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assignment</div>
            <div className="text-sm text-[#111824] dark:text-[#F5F7FB]">
              {assignedUser ? (
                <>
                  <div>{assignedUser.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{assignedUser.role}</div>
                </>
              ) : (
                <span className="text-gray-400 italic">Unassigned</span>
              )}
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Notes</div>
              <p className="text-sm text-[#111824] dark:text-[#F5F7FB] leading-relaxed">{request.notes}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-gray-200 dark:border-[#263248] px-6 py-4 flex items-center gap-2">
          <button
            onClick={() => onStatusChange("contacted")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] hover:bg-gray-50 dark:hover:bg-[#182234] text-gray-700 dark:text-[#C7CFDB] px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <PhoneCall size={14} />
            Mark contacted
          </button>
          <button
            onClick={() => onStatusChange("scheduled")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#4361EE] hover:bg-[#3651DE] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <CalendarPlus size={14} />
            Schedule now
          </button>
        </div>
      </div>
    </div>
  );
}
