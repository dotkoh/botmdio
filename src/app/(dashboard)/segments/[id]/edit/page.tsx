"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { mockSegments } from "@/data/segment-mock-data";
import { mockContacts } from "@/data/contacts";
import { ConditionGroup } from "@/data/segment-types";
import ConditionBuilder from "@/components/segments/ConditionBuilder";
import { ChevronLeft, Search, X, Upload, Trash2 } from "lucide-react";

export default function EditSegmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const segment = mockSegments.find((s) => s.id === id);

  const [name, setName] = useState(segment?.name || "");
  const [description, setDescription] = useState(segment?.description || "");

  // Dynamic state
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>(
    segment?.condition_groups || [{ id: "grp_init", logic: "AND", conditions: [{ id: "cond_init", property_key: "", operator: "equals", value: "" }] }]
  );

  // Static state
  const [contactIds, setContactIds] = useState<Set<string>>(
    new Set(segment?.contact_ids || [])
  );
  const [contactSearch, setContactSearch] = useState("");
  const [pasteData, setPasteData] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const currentContacts = useMemo(() => {
    return mockContacts.filter((c) => contactIds.has(c.id));
  }, [contactIds]);

  const searchableContacts = useMemo(() => {
    if (!contactSearch.trim()) return [];
    const q = contactSearch.toLowerCase();
    return mockContacts
      .filter((c) => !contactIds.has(c.id))
      .filter((c) => c.name.toLowerCase().includes(q) || ((c.properties.email as string) || "").toLowerCase().includes(q))
      .slice(0, 10);
  }, [contactSearch, contactIds]);

  function addContact(cid: string) {
    setContactIds((prev) => new Set([...prev, cid]));
    setContactSearch("");
  }

  function removeContact(cid: string) {
    setContactIds((prev) => {
      const next = new Set(prev);
      next.delete(cid);
      return next;
    });
  }

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
      <Link href={`/segments/${id}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">
          Edit Segment
        </h1>
        <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Save Changes
        </button>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Name & Description */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Segment name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
            />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Dynamic: Condition Builder */}
        {segment.type === "dynamic" && (
          <div>
            <h3 className="text-base font-semibold text-[#111824] mb-1">Edit conditions</h3>
            <p className="text-sm text-gray-400 mb-4">
              Update the rules that determine which contacts are included in this segment.
            </p>
            <ConditionBuilder groups={conditionGroups} onChange={setConditionGroups} />
          </div>
        )}

        {/* Static: Manage contacts */}
        {segment.type === "static" && (
          <div>
            <h3 className="text-base font-semibold text-[#111824] mb-1">Manage contacts</h3>
            <p className="text-sm text-gray-400 mb-4">
              Add or remove contacts from this segment. {contactIds.size} contact{contactIds.size !== 1 ? "s" : ""} currently in segment.
            </p>

            {/* Add contacts */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setShowPaste(false)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    !showPaste ? "bg-[#4361EE] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Search contacts
                </button>
                <button
                  onClick={() => setShowPaste(true)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    showPaste ? "bg-[#4361EE] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Paste / Upload
                </button>
              </div>

              {!showPaste ? (
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search contacts to add by name or email..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                  {searchableContacts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 max-h-48 overflow-y-auto">
                      {searchableContacts.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => addContact(c.id)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-[#151E3A] transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="text-[#111824]">{c.name}</div>
                            <div className="text-xs text-gray-400">{(c.properties.email as string) || (c.properties.mobile_number as string) || ""}</div>
                          </div>
                          <span className="text-xs text-[#4361EE] font-medium">+ Add</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Paste names, emails, or phone numbers (one per line). Or upload a CSV file.
                  </p>
                  <textarea
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    rows={6}
                    placeholder={`maria.santos@gmail.com\n+639171234567\nJuan Dela Cruz`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none mb-3"
                  />
                  <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                    <Upload size={14} /> Upload CSV file
                  </button>
                </div>
              )}
            </div>

            {/* Current members */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Current members ({contactIds.size})
              </h4>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F6F8] border-b border-gray-200">
                      <th className="text-left text-[13px] font-normal text-[#111824] pl-4 pr-3 py-3">Contact</th>
                      <th className="text-left text-[13px] font-normal text-[#111824] px-3 py-3">Email</th>
                      <th className="text-left text-[13px] font-normal text-[#111824] px-3 py-3">Type</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentContacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="pl-4 pr-3 py-3">
                          <div className="text-sm text-[#111824]">{contact.name}</div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-700">{(contact.properties.email as string) || "-"}</td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                            contact.type === "patient" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
                          }`}>
                            {contact.type}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => removeContact(contact.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
