"use client";

import { useState, useRef, useEffect } from "react";
import { SchedulingRule, RuleStatus, bookingMethodLabels, statusLabels } from "@/data/rule-types";
import { MoreVertical, Bot, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const statusStyles: Record<RuleStatus, { dot: string; text: string }> = {
  active: { dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  paused: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  draft: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400" },
};

const bookingStyles: Record<string, string> = {
  direct: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900",
  link: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900",
  request: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-900",
};

type SortField = "name" | "calendar_name" | "booking_method" | "used_by" | "status";
type SortDir = "asc" | "desc";

interface RulesTableProps {
  rules: SchedulingRule[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onRowAction: (id: string, action: "view" | "edit" | "duplicate" | "toggle_status" | "delete") => void;
}

export default function RulesTable({ rules, selectedIds, onToggleSelect, onToggleAll, onRowAction }: RulesTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpenPopover(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sorted = [...rules].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";
    switch (sortField) {
      case "name": aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break;
      case "calendar_name": aVal = a.calendar_name.toLowerCase(); bVal = b.calendar_name.toLowerCase(); break;
      case "booking_method": aVal = a.booking_method; bVal = b.booking_method; break;
      case "used_by": aVal = a.used_by.length; bVal = b.used_by.length; break;
      case "status": aVal = a.status; bVal = b.status; break;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const allSelected = rules.length > 0 && rules.every((r) => selectedIds.has(r.id));
  const someSelected = rules.some((r) => selectedIds.has(r.id)) && !allSelected;

  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) return null;
    return sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  }

  const headers: { label: string; field?: SortField; className?: string }[] = [
    { label: "Name", field: "name" },
    { label: "Calendar", field: "calendar_name" },
    { label: "Booking", field: "booking_method" },
    { label: "Used by", field: "used_by" },
    { label: "Status", field: "status" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] dark:bg-[#1A2336] border-b border-gray-200 dark:border-[#263248]">
            <th className="pl-6 pr-2 py-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected; }}
                onChange={onToggleAll}
                className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
              />
            </th>
            {headers.map((h) => (
              <th key={h.label} className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">
                {h.field ? (
                  <button onClick={() => handleSort(h.field!)} className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                    {h.label}
                    <SortIcon field={h.field} />
                  </button>
                ) : h.label}
              </th>
            ))}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((rule) => {
            const isSelected = selectedIds.has(rule.id);
            const statusStyle = statusStyles[rule.status];
            return (
              <tr
                key={rule.id}
                className={`border-b border-gray-100 dark:border-[#1D2638] transition-colors ${
                  isSelected ? "bg-blue-50/50 dark:bg-[#151E3A]/50" : "hover:bg-gray-50 dark:hover:bg-[#182234]"
                }`}
              >
                <td className="pl-6 pr-2 py-5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(rule.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                  />
                </td>
                <td className="px-5 py-5">
                  <Link href={`/rules/${rule.id}`} className="block group">
                    <div className="text-sm font-medium text-[#111824] group-hover:text-[#4361EE] transition-colors">
                      {rule.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{rule.description}</div>
                  </Link>
                </td>
                <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">{rule.calendar_name}</td>
                <td className="px-5 py-5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bookingStyles[rule.booking_method]}`}>
                    {bookingMethodLabels[rule.booking_method]}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenPopover(openPopover === rule.id ? null : rule.id)}
                      className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded-md transition-colors ${
                        rule.used_by.length === 0
                          ? "text-gray-400 hover:bg-gray-100 dark:hover:bg-[#182234]"
                          : "text-[#111824] dark:text-[#C7CFDB] hover:bg-gray-100 dark:hover:bg-[#182234]"
                      }`}
                    >
                      <Bot size={14} />
                      <span className="font-medium">{rule.used_by.length}</span>
                    </button>
                    {openPopover === rule.id && rule.used_by.length > 0 && (
                      <div ref={popoverRef} className="absolute left-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[220px] py-1">
                        <div className="px-3 py-2 border-b border-gray-100 dark:border-[#1D2638]">
                          <div className="text-xs text-gray-400 font-medium">Used by {rule.used_by.length} agent{rule.used_by.length !== 1 ? "s" : ""}</div>
                        </div>
                        {rule.used_by.map((agent) => (
                          <Link
                            key={agent.id}
                            href={`/ai-agents`}
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <Bot size={14} className="text-[#4361EE]" />
                              <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{agent.name}</span>
                            </div>
                            <ArrowRight size={12} className="text-gray-400 group-hover:text-[#4361EE] transition-colors" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-5">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusLabels[rule.status]}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === rule.id ? null : rule.id); }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === rule.id && (
                      <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[160px] py-1">
                        <button onClick={() => { onRowAction(rule.id, "view"); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">View</button>
                        <button onClick={() => { onRowAction(rule.id, "edit"); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">Edit</button>
                        <button onClick={() => { onRowAction(rule.id, "duplicate"); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">Duplicate</button>
                        <button onClick={() => { onRowAction(rule.id, "toggle_status"); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
                          {rule.status === "active" ? "Pause" : "Activate"}
                        </button>
                        <div className="border-t border-gray-100 dark:border-[#1D2638] my-1" />
                        <button onClick={() => { onRowAction(rule.id, "delete"); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
