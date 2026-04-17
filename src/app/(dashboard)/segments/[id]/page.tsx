"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { mockSegments } from "@/data/segment-mock-data";
import { mockContacts } from "@/data/contacts";
import { operatorLabels } from "@/data/segment-types";
import { allProperties } from "@/data/properties";
import { ChevronLeft, Search, X, Pencil, Zap, Users } from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getPropertyName(key: string): string {
  return allProperties.find((p) => p.key === key)?.name || key;
}

// Simple mock: for dynamic segments, compute matching contacts from mock data
function getMatchingContacts(segment: typeof mockSegments[0]) {
  if (segment.type === "static" && segment.contact_ids) {
    return mockContacts.filter((c) => segment.contact_ids!.includes(c.id));
  }
  // For dynamic, just return first N contacts as a simulation
  return mockContacts.slice(0, segment.contact_count);
}

export default function SegmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const segment = mockSegments.find((s) => s.id === id);
  const [searchQuery, setSearchQuery] = useState("");

  const contacts = useMemo(() => {
    if (!segment) return [];
    return getMatchingContacts(segment);
  }, [segment]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    const q = searchQuery.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        ((c.properties.email as string) || "").toLowerCase().includes(q)
    );
  }, [contacts, searchQuery]);

  if (!segment) {
    return (
      <div>
        <Link href="/segments" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Segment not found</h1>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Link href="/segments" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">{segment.name}</h1>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
              segment.type === "dynamic" ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300" : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
            }`}>
              {segment.type === "dynamic" ? <Zap size={10} /> : <Users size={10} />}
              {segment.type === "dynamic" ? "Dynamic" : "Static"}
            </span>
          </div>
          <p className="text-[16px] text-gray-500">{segment.description}</p>
        </div>
        <Link
          href={`/segments/${id}/edit`}
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Pencil size={14} /> Edit Segment
        </Link>
      </div>

      {/* Segment info */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Contacts</div>
          <div className="text-xl font-semibold text-[#111824]">{segment.contact_count}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Created by</div>
          <div className="text-sm font-medium text-[#111824]">{segment.created_by}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Created</div>
          <div className="text-sm font-medium text-[#111824]">{formatDate(segment.created_at)}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Last updated</div>
          <div className="text-sm font-medium text-[#111824]">{formatDate(segment.updated_at)}</div>
        </div>
      </div>

      {/* Dynamic: show conditions */}
      {segment.type === "dynamic" && segment.condition_groups && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#111824] mb-3">Segment conditions</h3>
          {segment.condition_groups.map((group, gi) => (
            <div key={group.id} className="mb-2">
              {gi > 0 && <div className="text-xs font-semibold text-gray-400 my-2 ml-2">OR</div>}
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-3 space-y-1.5">
                {group.conditions.map((cond, ci) => (
                  <div key={cond.id} className="text-sm text-[#111824]">
                    {ci > 0 && <span className="text-xs font-semibold text-[#4361EE] mr-1">{group.logic}</span>}
                    <span className="font-medium">{getPropertyName(cond.property_key)}</span>{" "}
                    <span className="text-gray-500">{operatorLabels[cond.operator]}</span>{" "}
                    {cond.value && <span className="font-medium">&quot;{cond.value}&quot;</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contacts table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#111824]">
            Contacts in this segment ({filteredContacts.length})
          </h3>
          <div className="relative w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID"
              className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F4F6F8] border-b border-gray-200">
                <th className="text-left text-[14px] font-normal text-[#111824] pl-6 pr-5 py-4">Contact</th>
                <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Email</th>
                <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Mobile</th>
                <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Type</th>
                <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="pl-6 pr-5 py-4">
                    <div className="text-sm text-[#111824]">{contact.name}</div>
                    <div className="text-xs text-gray-400">{contact.id}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{(contact.properties.email as string) || "-"}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{(contact.properties.mobile_number as string) || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      contact.type === "patient" ? "bg-green-100 text-green-700" :
                      contact.type === "prospect" ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700 capitalize">{contact.source}</td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">No contacts found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
