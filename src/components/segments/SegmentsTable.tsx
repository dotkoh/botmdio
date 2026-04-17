"use client";

import { Segment } from "@/data/segment-types";
import { MoreVertical, Users, Zap } from "lucide-react";
import { useState } from "react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

interface SegmentsTableProps {
  segments: Segment[];
  onView: (segment: Segment) => void;
  onEdit: (segment: Segment) => void;
  onDelete: (id: string) => void;
}

export default function SegmentsTable({ segments, onView, onEdit, onDelete }: SegmentsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] border-b border-gray-200">
            <th className="text-left text-[14px] font-normal text-[#111824] pl-6 pr-5 py-4">Segment Name</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Type</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Contacts</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Created by</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Created</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Last updated</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {segments.map((seg) => (
            <tr
              key={seg.id}
              onClick={() => onView(seg)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="pl-6 pr-5 py-5">
                <div className="text-sm font-medium text-[#111824]">{seg.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{seg.description}</div>
              </td>
              <td className="px-5 py-5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  seg.type === "dynamic"
                    ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                }`}>
                  {seg.type === "dynamic" ? <Zap size={10} /> : <Users size={10} />}
                  {seg.type === "dynamic" ? "Dynamic" : "Static"}
                </span>
              </td>
              <td className="px-5 py-5 text-sm text-gray-700">{seg.contact_count}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{seg.created_by}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{formatDate(seg.created_at)}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{formatDate(seg.updated_at)}</td>
              <td className="px-5 py-5">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === seg.id ? null : seg.id); }}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenu === seg.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[140px]">
                      <button onClick={(e) => { e.stopPropagation(); onView(seg); setOpenMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
                        View
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onEdit(seg); setOpenMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
                        Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(seg.id); setOpenMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {segments.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No segments found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
