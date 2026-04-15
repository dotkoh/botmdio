"use client";

import { useState } from "react";
import { WorkflowTemplate } from "@/data/workflow-types";
import { mockIntegrations, mockCalendars, mockAppointmentTypes } from "@/data/calendar-mock-data";
import { providers } from "@/data/calendar-providers";
import Link from "next/link";

interface WorkflowBuilderProps {
  template: WorkflowTemplate;
}

function SectionNumber({ num }: { num: number }) {
  return (
    <div className="w-7 h-7 bg-blue-100 text-[#4361EE] rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

export default function WorkflowBuilder({ template }: WorkflowBuilderProps) {
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [channel, setChannel] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(true);

  const availableCalendars = mockCalendars.filter((c) => c.integration_id === accountId);

  return (
    <div className="max-w-3xl space-y-0">
      {/* Section 1: Details */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={1} />
          <h3 className="text-base font-semibold text-[#111824]">Details</h3>
        </div>
        <div className="ml-10 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Workflow type</label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50">
                {template.name}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Workflow name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  placeholder="Enter workflow name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {name.length}/50 characters
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Select Calendar Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
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

          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Which appointment types will this apply to?</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition">
              <option>All appointments</option>
              {mockAppointmentTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">Messaging Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            >
              <option value="">Select channel</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="messenger">Messenger</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Section 2: When to send */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={2} />
          <h3 className="text-base font-semibold text-[#111824]">When to send</h3>
        </div>
        <div className="ml-10">
          <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#111824] bg-white">
            {template.defaultTrigger}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Section 3: Send this message */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={3} />
          <h3 className="text-base font-semibold text-[#111824]">Send this message</h3>
        </div>
        <div className="ml-10 space-y-2">
          <label className="text-sm font-medium text-gray-500 mb-1 block">Message template</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition">
            <option value="">Select...</option>
            <option>Appointment Reminder</option>
            <option>Booking Confirmation Message</option>
            <option>Cancellation Notice</option>
          </select>
          <p className="text-sm text-gray-400">
            You can set up message templates in{" "}
            <Link href="/templates" className="text-blue-600 hover:underline">
              Messaging Templates
            </Link>{" "}
            module.
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Section 4: Trigger an alert */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={4} />
          <h3 className="text-base font-semibold text-[#111824]">Trigger an alert</h3>
        </div>
        <div className="ml-10">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#111824]">Trigger an alert</span>
              <button
                onClick={() => setAlertEnabled(!alertEnabled)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  alertEnabled ? "bg-[#4361EE]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    alertEnabled ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              The system will send an alert to dashboard users. You may customise how you receive alerts on the{" "}
              <Link href="/settings" className="text-blue-600 hover:underline">
                Alerts settings
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Section 5: Exceptions */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={5} />
          <h3 className="text-base font-semibold text-[#111824]">Exceptions</h3>
        </div>
        <div className="ml-10">
          <label className="text-sm font-medium text-gray-500 mb-1 block">
            Which calendars should be excluded from this workflow?
          </label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition">
            <option value="">None</option>
            {availableCalendars.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
