"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockSegments } from "@/data/segment-mock-data";
import { Segment } from "@/data/segment-types";
import SegmentsTable from "@/components/segments/SegmentsTable";
import Pagination from "@/components/contacts/Pagination";
import Dropdown from "@/components/ui/Dropdown";
import { Search, X as XIcon, RefreshCw, Plus } from "lucide-react";

export default function SegmentsPage() {
  const router = useRouter();
  const [segments, setSegments] = useState(mockSegments);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const filtered = useMemo(() => {
    return segments.filter((s) => {
      if (searchQuery.trim() && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      return true;
    });
  }, [segments, searchQuery, typeFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function handleView(seg: Segment) {
    router.push(`/segments/${seg.id}`);
  }

  function handleEdit(seg: Segment) {
    router.push(`/segments/${seg.id}/edit`);
  }

  function handleDelete(id: string) {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Segments</h1>
          <p className="text-[16px] text-gray-500 mt-2">Create and manage contact segments for campaigns and broadcasts</p>
        </div>
        <Link href="/segments/create" className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
          <Plus size={16} /> Create segment
        </Link>
      </div>

      <div className="flex items-center mt-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by segment name" value={searchQuery}
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
      </div>

      <div className="text-sm text-gray-500 mt-5">
        Showing {Math.min((page - 1) * perPage + 1, filtered.length)}-{Math.min(page * perPage, filtered.length)} of <strong>{filtered.length}</strong> results
      </div>

      <div className="flex items-center gap-3 mt-4 mb-5">
        <Dropdown label="Type" value={typeFilter} options={[{ label: "Dynamic", value: "dynamic" }, { label: "Static", value: "static" }]} onChange={(v) => { setTypeFilter(v); setPage(1); }} />
        {typeFilter && <button onClick={() => setTypeFilter(null)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Clear All</button>}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <SegmentsTable segments={paginated} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        <Pagination page={page} totalPages={totalPages} perPage={perPage} totalItems={filtered.length} onPageChange={setPage} onPerPageChange={(v) => { setPerPage(v); setPage(1); }} />
      </div>
    </div>
  );
}
