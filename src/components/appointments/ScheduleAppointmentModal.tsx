"use client";

import { useState, useMemo } from "react";
import { mockContacts } from "@/data/contacts";
import { mockIntegrations, mockCalendars, mockAppointmentTypes } from "@/data/calendar-mock-data";
import { providers } from "@/data/calendar-providers";
import Modal from "@/components/ui/Modal";

interface ScheduleAppointmentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ScheduleAppointmentModal({ open, onClose }: ScheduleAppointmentModalProps) {
  const [accountId, setAccountId] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [appointmentTypeId, setAppointmentTypeId] = useState("");
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  const selectedIntegration = mockIntegrations.find((i) => i.id === accountId);
  const providerDef = selectedIntegration ? providers.find((p) => p.id === selectedIntegration.provider) : null;

  const filteredContacts = useMemo(() => {
    if (!contactSearch.trim()) return [];
    const q = contactSearch.toLowerCase();
    return mockContacts.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [contactSearch]);

  const availableCalendars = mockCalendars.filter((c) => c.integration_id === accountId);
  const availableTypes = mockAppointmentTypes.filter((t) => t.calendar_id === calendarId);

  function handleClose() {
    setAccountId("");
    setContactSearch("");
    setSelectedContact("");
    setCalendarId("");
    setAppointmentTypeId("");
    onClose();
  }

  const hasAccount = !!accountId;
  const actionLabel = providerDef ? `Go to ${providerDef.name} dashboard` : "Select appointment slot";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule Appointment"
      width="w-[560px]"
      footer={
        <>
          <button onClick={handleClose} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
            Cancel
          </button>
          <button
            disabled={!hasAccount}
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLabel}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Calendar Account */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Calendar account (Required)</label>
          <select
            value={accountId}
            onChange={(e) => { setAccountId(e.target.value); setCalendarId(""); setAppointmentTypeId(""); }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          >
            <option value="">Select account</option>
            {mockIntegrations.map((i) => {
              const p = providers.find((pr) => pr.id === i.provider);
              return (
                <option key={i.id} value={i.id}>
                  {i.account_label || i.account_identifier} ({p?.name})
                </option>
              );
            })}
          </select>
        </div>

        {/* Remaining fields only shown when account selected */}
        {hasAccount && (
          <>
            {/* Select Contact */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-500 mb-1 block">Select Contact (Required)</label>
              <input
                type="text"
                value={selectedContact || contactSearch}
                onChange={(e) => {
                  setContactSearch(e.target.value);
                  setSelectedContact("");
                  setShowContactDropdown(true);
                }}
                onFocus={() => setShowContactDropdown(true)}
                placeholder="Search by contact name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              {showContactDropdown && filteredContacts.length > 0 && !selectedContact && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30 max-h-48 overflow-y-auto">
                  {filteredContacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedContact(c.name);
                        setContactSearch("");
                        setShowContactDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-[#111824]">{c.name}</div>
                      <div className="text-xs text-gray-400">{(c.properties.email as string) || (c.properties.mobile_number as string) || ""}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Calendar */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Calendar (Required)</label>
              <select
                value={calendarId}
                onChange={(e) => { setCalendarId(e.target.value); setAppointmentTypeId(""); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="">Select calendar</option>
                {availableCalendars.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Appointment Type (Required)</label>
              <select
                value={appointmentTypeId}
                onChange={(e) => setAppointmentTypeId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="">Select appointment type</option>
                {availableTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
