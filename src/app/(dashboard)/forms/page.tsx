"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  mockIntegratedForms,
  formProviders,
  formTypeLabels,
  IntegratedForm,
  FormStatus,
  FormType,
} from "@/data/form-provider-data";
import Dropdown from "@/components/ui/Dropdown";
import Pagination from "@/components/contacts/Pagination";
import { Search, X as XIcon, RefreshCw, MoreVertical, ExternalLink, FileText, Pencil, CircleDashed, Trash2 } from "lucide-react";

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const statusStyles: Record<FormStatus, { dot: string; text: string }> = {
  active: { dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  inactive: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400" },
};

const statusLabels: Record<FormStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export default function FormsPage() {
  const [forms, setForms] = useState<IntegratedForm[]>(mockIntegratedForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [formTypeFilter, setFormTypeFilter] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
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

  const uniqueProviders = useMemo(
    () => [...new Set(forms.map((f) => f.provider_id))],
    [forms]
  );

  const uniqueFormTypes = useMemo(
    () => [...new Set(forms.map((f) => f.form_type))],
    [forms]
  );

  const uniqueLanguages = useMemo(() => {
    const set = new Set<string>();
    forms.forEach((f) => f.languages.forEach((l) => set.add(l)));
    return [...set].sort();
  }, [forms]);

  const filtered = useMemo(() => {
    return forms.filter((f) => {
      if (searchQuery.trim() && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (providerFilter && f.provider_id !== providerFilter) return false;
      if (statusFilter && f.status !== statusFilter) return false;
      if (formTypeFilter && f.form_type !== formTypeFilter) return false;
      if (languageFilter && !f.languages.includes(languageFilter)) return false;
      return true;
    });
  }, [forms, searchQuery, providerFilter, statusFilter, formTypeFilter, languageFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage]
  );

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", { month: "long" })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

  function handleDelete(id: string) {
    setForms((prev) => prev.filter((f) => f.id !== id));
    setOpenMenu(null);
  }

  function handleToggleStatus(id: string) {
    setForms((prev) => prev.map((f) => f.id === id ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f));
    setOpenMenu(null);
  }

  const hasFilters = !!(providerFilter || statusFilter || formTypeFilter || languageFilter);
  const isEmpty = forms.length === 0;

  function clearAllFilters() {
    setProviderFilter(null);
    setStatusFilter(null);
    setFormTypeFilter(null);
    setLanguageFilter(null);
    setPage(1);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Forms</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          All forms integrated via your{" "}
          <Link href="/form-providers" className="text-blue-600 hover:underline">
            Form Providers
          </Link>
          . Forms appear here automatically when a webhook is attached.
        </p>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center mb-4">
            <FileText size={28} className="text-[#4361EE]" />
          </div>
          <h3 className="text-lg font-semibold text-[#111824] mb-2">No forms integrated yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Connect a form provider and attach the webhook URL to your forms. They&apos;ll appear here automatically.
          </p>
          <Link href="/form-providers" className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Connect a Form Provider
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
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} of <strong>{filtered.length}</strong> results
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4 mb-5 flex-wrap">
            <Dropdown
              label="Provider"
              value={providerFilter}
              options={uniqueProviders.map((p) => ({
                label: formProviders.find((fp) => fp.id === p)?.name || p,
                value: p,
              }))}
              onChange={(v) => { setProviderFilter(v); setPage(1); }}
            />
            <Dropdown
              label="Form Type"
              value={formTypeFilter}
              options={uniqueFormTypes.map((t) => ({
                label: formTypeLabels[t],
                value: t,
              }))}
              onChange={(v) => { setFormTypeFilter(v); setPage(1); }}
            />
            <Dropdown
              label="Language"
              value={languageFilter}
              options={uniqueLanguages.map((l) => ({ label: l, value: l }))}
              onChange={(v) => { setLanguageFilter(v); setPage(1); }}
            />
            <Dropdown
              label="Status"
              value={statusFilter}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
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
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] pl-6 pr-5 py-4">Form Name</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Provider</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Form Type</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Language</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Submissions</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Last Submission</th>
                    <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-5 py-4">Status</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((form) => {
                    const provider = formProviders.find((p) => p.id === form.provider_id);
                    const statusStyle = statusStyles[form.status];

                    return (
                      <tr
                        key={form.id}
                        className="border-b border-gray-100 dark:border-[#1D2638] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                      >
                        <td className="pl-6 pr-5 py-5">
                          <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{form.name}</div>
                          <div className="text-xs text-gray-400 dark:text-[#8E99AB] mt-0.5 truncate max-w-md">{form.description}</div>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">{provider?.name || form.provider_id}</td>
                        <td className="px-5 py-5">
                          <span className="inline-flex items-center text-xs font-medium text-gray-700 dark:text-[#C7CFDB] bg-gray-100 dark:bg-[#1A2336] border border-gray-200 dark:border-[#263248] px-2.5 py-1 rounded-full">
                            {formTypeLabels[form.form_type]}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">
                          {form.languages.join(", ")}
                        </td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB] tabular-nums">{form.submissions_count.toLocaleString()}</td>
                        <td className="px-5 py-5 text-sm text-gray-700 dark:text-[#C7CFDB]">{formatDate(form.last_submission_at)}</td>
                        <td className="px-5 py-5">
                          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {statusLabels[form.status]}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === form.id ? null : form.id); }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === form.id && (
                              <div ref={menuRef} className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[180px] py-1">
                                <a
                                  href={form.form_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setOpenMenu(null)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <ExternalLink size={14} /> View Form
                                </a>
                                <button
                                  onClick={() => setOpenMenu(null)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <Pencil size={14} /> Edit Details
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(form.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                                >
                                  <CircleDashed size={14} />
                                  {form.status === "active" ? "Mark as Inactive" : "Mark as Active"}
                                </button>
                                <div className="border-t border-gray-100 dark:border-[#1D2638] my-1" />
                                <button
                                  onClick={() => handleDelete(form.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors"
                                >
                                  <Trash2 size={14} /> Delete Form
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
                        No forms match your filters
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
              onPerPageChange={(v) => { setPerPage(v); setPage(1); }}
            />
          </div>
        </>
      )}
    </div>
  );
}
