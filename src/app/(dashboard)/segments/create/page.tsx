"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SegmentType, ConditionGroup } from "@/data/segment-types";
import { mockContacts } from "@/data/contacts";
import ConditionBuilder from "@/components/segments/ConditionBuilder";
import { ChevronLeft, Search, X, Upload } from "lucide-react";

export default function CreateSegmentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SegmentType>("dynamic");

  // Dynamic segment state
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([
    { id: "grp_init", logic: "AND", conditions: [{ id: "cond_init", property_key: "", operator: "equals", value: "" }] },
  ]);

  // Static segment state
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [pasteData, setPasteData] = useState("");
  const [showPaste, setShowPaste] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return mockContacts.slice(0, 20);
    const q = contactSearch.toLowerCase();
    return mockContacts.filter(
      (c) => c.name.toLowerCase().includes(q) || ((c.properties.email as string) || "").toLowerCase().includes(q)
    ).slice(0, 20);
  }, [contactSearch]);

  function toggleContact(id: string) {
    setSelectedContacts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
  }

  function clearAll() {
    setSelectedContacts(new Set());
  }

  return (
    <div className="pb-16">
      <Link href="/segments" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Create Segment</h1>
        <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Save Segment
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
              placeholder="e.g., Female patients over 40"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of this segment"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Segment Type */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">Segment type</label>
          <div className="flex gap-3">
            <button
              onClick={() => setType("dynamic")}
              className={`flex-1 p-4 rounded-xl border-2 transition-colors text-left ${
                type === "dynamic"
                  ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-semibold text-[#111824] mb-1">Dynamic Segment</div>
              <div className="text-xs text-gray-500">Automatically groups contacts based on contact properties. Updates as contacts change.</div>
            </button>
            <button
              onClick={() => setType("static")}
              className={`flex-1 p-4 rounded-xl border-2 transition-colors text-left ${
                type === "static"
                  ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-semibold text-[#111824] mb-1">Static Segment</div>
              <div className="text-xs text-gray-500">Manually select contacts or upload a list. Does not update automatically.</div>
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Dynamic: Condition Builder */}
        {type === "dynamic" && (
          <div>
            <h3 className="text-base font-semibold text-[#111824] mb-1">Conditions</h3>
            <p className="text-sm text-gray-400 mb-4">
              Define rules to automatically include contacts. Conditions within a group use the selected logic (AND/OR). Groups are combined with OR.
            </p>
            <ConditionBuilder groups={conditionGroups} onChange={setConditionGroups} />
          </div>
        )}

        {/* Static: Contact Selection */}
        {type === "static" && (
          <div>
            <h3 className="text-base font-semibold text-[#111824] mb-1">Select contacts</h3>
            <p className="text-sm text-gray-400 mb-4">
              Search and select contacts, or paste/upload a list.
            </p>

            {/* Toggle: Search vs Paste */}
            <div className="flex items-center gap-2 mb-4">
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
              <>
                {/* Search */}
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search by name or email"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                  {contactSearch && (
                    <button onClick={() => setContactSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Selected count + actions */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{selectedContacts.size} contact{selectedContacts.size !== 1 ? "s" : ""} selected</span>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className="text-xs text-[#4361EE] hover:underline">Select all visible</button>
                    <button onClick={clearAll} className="text-xs text-gray-400 hover:underline">Clear</button>
                  </div>
                </div>

                {/* Contact list */}
                <div className="border border-gray-200 rounded-xl max-h-72 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <label
                      key={contact.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContacts.has(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[#111824]">{contact.name}</div>
                        <div className="text-xs text-gray-400 truncate">{(contact.properties.email as string) || (contact.properties.mobile_number as string) || ""}</div>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        contact.type === "patient" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
                      }`}>
                        {contact.type}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Paste area */}
                <p className="text-sm text-gray-500 mb-2">
                  Paste names, emails, or phone numbers (one per line or comma-separated). Or upload a CSV file.
                </p>
                <textarea
                  value={pasteData}
                  onChange={(e) => setPasteData(e.target.value)}
                  rows={8}
                  placeholder={`maria.santos@gmail.com\n+639171234567\nJuan Dela Cruz`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none mb-3"
                />
                <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                  <Upload size={14} />
                  Upload CSV file
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
