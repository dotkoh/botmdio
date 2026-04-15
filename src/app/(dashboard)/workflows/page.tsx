"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockWorkflows } from "@/data/workflow-mock-data";
import WorkflowsTable from "@/components/workflows/WorkflowsTable";
import Pagination from "@/components/contacts/Pagination";
import Dropdown from "@/components/ui/Dropdown";
import { Search, X, RefreshCw, Plus } from "lucide-react";

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const uniqueTypes = [...new Set(mockWorkflows.map((w) => w.workflow_type))];
  const uniqueStatuses = [...new Set(mockWorkflows.map((w) => w.status))];

  const filtered = useMemo(() => {
    return mockWorkflows.filter((wf) => {
      if (searchQuery.trim() && !wf.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (typeFilter && wf.workflow_type !== typeFilter) return false;
      if (statusFilter && wf.status !== statusFilter) return false;
      return true;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Workflows</h1>
          <p className="text-[16px] text-gray-500 mt-2">
            View and manage workflows to automate messages for appointments including reminders, confirmation messages and follow-ups
          </p>
        </div>
        <Link
          href="/workflows/create"
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={16} />
          Create workflow
        </Link>
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center mt-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by workflow name"
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

      <div className="text-sm text-gray-500 mt-5">
        Showing {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} of <strong>{filtered.length}</strong> results
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mt-4 mb-5">
        <Dropdown
          label="Workflow type"
          value={typeFilter}
          options={uniqueTypes.map((t) => ({ label: t, value: t }))}
          onChange={(v) => { setTypeFilter(v); setPage(1); }}
        />
        <Dropdown
          label="Status"
          value={statusFilter}
          options={uniqueStatuses.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
        />
        {(typeFilter || statusFilter) && (
          <button
            onClick={() => { setTypeFilter(null); setStatusFilter(null); }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <WorkflowsTable workflows={paginated} />
        <Pagination
          page={page}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={filtered.length}
          onPageChange={setPage}
          onPerPageChange={(v) => { setPerPage(v); setPage(1); }}
        />
      </div>
    </div>
  );
}
