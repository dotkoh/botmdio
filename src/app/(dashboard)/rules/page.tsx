"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockRules } from "@/data/rule-mock-data";
import { SchedulingRule } from "@/data/rule-types";
import RulesTable from "@/components/rules/RulesTable";
import Dropdown from "@/components/ui/Dropdown";
import { Search, X, Plus, Play, Pause, Copy, Trash2, FileWarning } from "lucide-react";

export default function RulesPage() {
  const router = useRouter();
  const [rules, setRules] = useState<SchedulingRule[]>(mockRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [calendarFilter, setCalendarFilter] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const uniqueCalendars = useMemo(
    () => [...new Set(mockRules.map((r) => r.calendar_name))],
    []
  );

  const filtered = useMemo(() => {
    return rules.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      if (calendarFilter && r.calendar_name !== calendarFilter) return false;
      if (bookingFilter && r.booking_method !== bookingFilter) return false;
      return true;
    });
  }, [rules, searchQuery, statusFilter, calendarFilter, bookingFilter]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (filtered.every((r) => selectedIds.has(r.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleRowAction(id: string, action: "view" | "edit" | "duplicate" | "toggle_status" | "delete") {
    if (action === "view" || action === "edit") {
      router.push(`/rules/${id}`);
    } else if (action === "duplicate") {
      const rule = rules.find((r) => r.id === id);
      if (rule) {
        const dup: SchedulingRule = { ...rule, id: `rule_${Date.now()}`, name: `${rule.name} (Copy)`, status: "draft", used_by: [] };
        setRules((prev) => [...prev, dup]);
      }
    } else if (action === "toggle_status") {
      setRules((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r));
    } else if (action === "delete") {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  }

  function bulkAction(action: "activate" | "pause" | "duplicate" | "delete") {
    const ids = Array.from(selectedIds);
    if (action === "activate") {
      setRules((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "active" } : r));
    } else if (action === "pause") {
      setRules((prev) => prev.map((r) => ids.includes(r.id) ? { ...r, status: "paused" } : r));
    } else if (action === "duplicate") {
      const dups: SchedulingRule[] = ids
        .map((id) => rules.find((r) => r.id === id))
        .filter((r): r is SchedulingRule => !!r)
        .map((r) => ({ ...r, id: `rule_${Date.now()}_${Math.random()}`, name: `${r.name} (Copy)`, status: "draft", used_by: [] }));
      setRules((prev) => [...prev, ...dups]);
    } else if (action === "delete") {
      setRules((prev) => prev.filter((r) => !ids.includes(r.id)));
    }
    clearSelection();
  }

  // Check if any selected rule is used by an active agent (for disabling delete)
  const deleteDisabled = Array.from(selectedIds).some((id) => {
    const rule = rules.find((r) => r.id === id);
    return rule && rule.used_by.length > 0 && rule.status === "active";
  });

  const hasFilters = statusFilter || calendarFilter || bookingFilter;
  const showEmptyState = rules.length === 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Scheduling Rules</h1>
          <p className="text-[16px] text-gray-500 mt-2">
            Configure per-calendar booking rules, data collection, handover conditions and alerts
          </p>
        </div>
        {!showEmptyState && (
          <Link href="/rules/create" className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus size={16} /> Create Rule
          </Link>
        )}
      </div>

      {/* Empty state */}
      {showEmptyState && (
        <div className="mt-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center mb-4">
            <FileWarning size={28} className="text-[#4361EE]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111824] mb-2">No scheduling rules yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Rules tell your AI agent which fields to collect, who to hand over to, and how to behave per calendar.
          </p>
          <Link href="/rules/create" className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> Create your first rule
          </Link>
        </div>
      )}

      {!showEmptyState && (
        <>
          {/* Search + Result count */}
          <div className="flex items-center gap-3 mt-6">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filters + Result count */}
          <div className="flex items-center justify-between mt-4 mb-5">
            <div className="flex items-center gap-3">
              <Dropdown
                label="Status"
                value={statusFilter}
                options={[
                  { label: "Active", value: "active" },
                  { label: "Paused", value: "paused" },
                  { label: "Draft", value: "draft" },
                ]}
                onChange={setStatusFilter}
              />
              <Dropdown
                label="Calendar"
                value={calendarFilter}
                options={uniqueCalendars.map((c) => ({ label: c, value: c }))}
                onChange={setCalendarFilter}
              />
              <Dropdown
                label="Booking method"
                value={bookingFilter}
                options={[
                  { label: "Direct", value: "direct" },
                  { label: "Link", value: "link" },
                  { label: "Request", value: "request" },
                ]}
                onChange={setBookingFilter}
              />
              {hasFilters && (
                <button
                  onClick={() => { setStatusFilter(null); setCalendarFilter(null); setBookingFilter(null); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {filtered.length} of {rules.length}
            </div>
          </div>

          {/* Bulk actions bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 dark:bg-[#151E3A] border border-blue-200 dark:border-[#1E3A6E] rounded-lg">
              <span className="text-sm font-medium text-[#4361EE] dark:text-[#7DA2FF]">
                {selectedIds.size} rule{selectedIds.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => bulkAction("activate")}
                  className="flex items-center gap-1.5 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] hover:bg-gray-50 dark:hover:bg-[#182234] text-gray-700 dark:text-[#C7CFDB] px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  <Play size={12} /> Activate
                </button>
                <button
                  onClick={() => bulkAction("pause")}
                  className="flex items-center gap-1.5 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] hover:bg-gray-50 dark:hover:bg-[#182234] text-gray-700 dark:text-[#C7CFDB] px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  <Pause size={12} /> Pause
                </button>
                <button
                  onClick={() => bulkAction("duplicate")}
                  className="flex items-center gap-1.5 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] hover:bg-gray-50 dark:hover:bg-[#182234] text-gray-700 dark:text-[#C7CFDB] px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                  <Copy size={12} /> Duplicate
                </button>
                <button
                  onClick={() => bulkAction("delete")}
                  disabled={deleteDisabled}
                  title={deleteDisabled ? "Cannot delete rules used by active agents" : ""}
                  className="flex items-center gap-1.5 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-[#C7CFDB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200"
                >
                  <Trash2 size={12} /> Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-gray-400">No rules match your filters</div>
            ) : (
              <RulesTable
                rules={filtered}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                onRowAction={handleRowAction}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
