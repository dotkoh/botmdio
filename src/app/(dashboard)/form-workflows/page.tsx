"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  mockFormWorkflows,
  formWorkflowStatusLabels,
  formWorkflowStatusStyles,
  formatStepShort,
  FormWorkflow,
  FormWorkflowStatus,
} from "@/data/form-workflow-data";
import Pagination from "@/components/contacts/Pagination";
import {
  Search,
  X as XIcon,
  RefreshCw,
  Plus,
  MoreVertical,
  Pencil,
  CircleDashed,
  Trash2,
  Workflow as WorkflowIcon,
} from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FormWorkflowsPage() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<FormWorkflow[]>(mockFormWorkflows);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return workflows;
    const q = searchQuery.toLowerCase();
    return workflows.filter((w) => w.name.toLowerCase().includes(q));
  }, [workflows, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  function handleToggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              status: (w.status === "active" ? "paused" : "active") as FormWorkflowStatus,
            }
          : w
      )
    );
    setOpenMenu(null);
  }

  function handleDelete(id: string) {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    setOpenMenu(null);
  }

  const isEmpty = workflows.length === 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Workflows</h1>
          <p className="text-[16px] text-gray-500 mt-2">
            Automate sending survey forms before and after patient visits — set the cadence once and let Bot MD handle the rest.
          </p>
        </div>
        <Link
          href="/form-workflows/create"
          className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          Create workflow
        </Link>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center mb-4">
            <WorkflowIcon size={28} className="text-[#4361EE]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111824] mb-2">No workflows yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Create your first survey workflow to automate sending forms before and after appointments.
          </p>
          <Link
            href="/form-workflows/create"
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            Create workflow
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
                placeholder="Search workflows by name..."
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

          <div className="text-sm text-gray-500 mt-5 mb-4">
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}-
            {Math.min(page * perPage, filtered.length)} of <strong>{filtered.length}</strong> workflows
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F4F6F8] dark:bg-[#1A2336] border-b border-gray-200 dark:border-[#263248]">
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] pl-6 pr-5 py-4">Workflow Name</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Applies to</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Reminder Frequency</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Status</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Created</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((w) => {
                    const statusStyle = formWorkflowStatusStyles[w.status];
                    return (
                      <tr
                        key={w.id}
                        onClick={() => router.push(`/form-workflows/${w.id}`)}
                        className="border-b border-gray-100 dark:border-[#1D2638] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors cursor-pointer"
                      >
                        <td className="pl-6 pr-5 py-5">
                          <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{w.name}</div>
                          <div className="text-xs text-gray-400 dark:text-[#8E99AB] mt-0.5 truncate max-w-md">{w.description}</div>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB] tabular-nums whitespace-nowrap">
                          {w.audience_size.toLocaleString()} {w.audience_size === 1 ? "patient" : "patients"}
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex flex-col gap-1">
                            {w.steps.slice(0, 3).map((s) => (
                              <span
                                key={s.id}
                                className="inline-flex items-center text-xs font-medium text-gray-700 dark:text-[#C7CFDB] bg-gray-100 dark:bg-[#1A2336] border border-gray-200 dark:border-[#263248] px-2 py-0.5 rounded-full w-fit whitespace-nowrap"
                              >
                                {formatStepShort(s)}
                              </span>
                            ))}
                            {w.steps.length > 3 && (
                              <span className="text-xs text-gray-400 ml-1">+{w.steps.length - 3} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {formWorkflowStatusLabels[w.status]}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">
                          <div>{formatDate(w.created_at)}</div>
                          <div className="text-xs text-gray-400 mt-0.5">by {w.created_by}</div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(openMenu === w.id ? null : w.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === w.id && (
                              <div
                                ref={menuRef}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[180px] py-1"
                              >
                                <button
                                  onClick={() => {
                                    router.push(`/form-workflows/${w.id}`);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <Pencil size={14} /> Edit Workflow
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(w.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <CircleDashed size={14} />
                                  {w.status === "active" ? "Pause" : "Activate"}
                                </button>
                                <div className="border-t border-gray-100 dark:border-[#1D2638] my-1" />
                                <button
                                  onClick={() => handleDelete(w.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors"
                                >
                                  <Trash2 size={14} /> Delete
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
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                        No workflows match your search
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
    </div>
  );
}
