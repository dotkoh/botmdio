"use client";

import { useState } from "react";
import { WorkflowTemplate } from "@/data/workflow-types";
import { mockIntegrations, mockCalendars, mockAppointmentTypes } from "@/data/calendar-mock-data";
import { providers } from "@/data/calendar-providers";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

interface WorkflowBuilderProps {
  template: WorkflowTemplate;
}

interface FollowOnReminder {
  id: string;
  amount: number;
  unit: string;
}

function SectionNumber({ num }: { num: number }) {
  return (
    <div className="w-7 h-7 bg-blue-100 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF] rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

const timeUnits = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
];

const timeUnitsWithMonths = [
  ...timeUnits,
  { label: "Months", value: "months" },
];

type TriggerEvent = "appointment_date" | "discharge_api";

export default function WorkflowBuilder({ template }: WorkflowBuilderProps) {
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [channel, setChannel] = useState("");
  const [alertEnabled, setAlertEnabled] = useState(true);

  // Timing
  const [timingAmount, setTimingAmount] = useState(24);
  const [timingUnit, setTimingUnit] = useState("hours");

  // Trigger event (for post-visit survey / PROM / PREM)
  const [triggerEvent, setTriggerEvent] = useState<TriggerEvent>("appointment_date");

  // Follow-on reminders
  const [followOnReminders, setFollowOnReminders] = useState<FollowOnReminder[]>([]);

  const availableCalendars = mockCalendars.filter((c) => c.integration_id === accountId);

  // Template type detection
  const isSurveyOrRegistration = template.category === "prom_prem";
  const isPreVisitRegistration = template.id === "tpl_pre_visit_reg";
  const isPostVisitSurvey = template.id === "tpl_post_visit_survey" || template.id === "tpl_prom_survey" || template.id === "tpl_prem_survey";
  const hasConfigurableTiming = template.triggerType === "before" || template.triggerType === "after" || template.triggerType === "recurring";
  const showAlertSection = !isSurveyOrRegistration;
  const showExceptionsSection = !isSurveyOrRegistration;
  const showFollowOnSection = isSurveyOrRegistration;
  const showTriggerEventSelector = isPostVisitSurvey;

  const timingDirection = template.triggerType === "before" ? "before" : "after";

  function getTimingEventLabel() {
    if (showTriggerEventSelector) {
      return triggerEvent === "appointment_date" ? "appointment date" : "discharge";
    }
    if (template.triggerType === "before") return "the appointment date";
    if (template.event?.includes("discharged")) return "discharge";
    if (template.event?.includes("completed")) return "the visit";
    return "the event";
  }

  function addFollowOnReminder() {
    if (followOnReminders.length >= 5) return;
    setFollowOnReminders((prev) => [
      ...prev,
      { id: `rem_${Date.now()}`, amount: 24, unit: "hours" },
    ]);
  }

  function removeFollowOnReminder(id: string) {
    setFollowOnReminders((prev) => prev.filter((r) => r.id !== id));
  }

  function updateFollowOnReminder(id: string, field: "amount" | "unit", value: string | number) {
    setFollowOnReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  let sectionNum = 0;

  return (
    <div className="max-w-3xl space-y-0">
      {/* Section: Details */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={++sectionNum} />
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

          {/* Trigger event selector for post-visit surveys */}
          {showTriggerEventSelector && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Select trigger event</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="triggerEvent"
                    value="appointment_date"
                    checked={triggerEvent === "appointment_date"}
                    onChange={() => setTriggerEvent("appointment_date")}
                    className="w-4 h-4 text-[#4361EE]"
                  />
                  <span className="text-sm text-[#111824]">Based on appointment date</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="triggerEvent"
                    value="discharge_api"
                    checked={triggerEvent === "discharge_api"}
                    onChange={() => setTriggerEvent("discharge_api")}
                    className="w-4 h-4 text-[#4361EE]"
                  />
                  <span className="text-sm text-[#111824]">Upon Discharge trigger (API)</span>
                </label>
              </div>
            </div>
          )}

          {/* Appointment-based fields */}
          {(!showTriggerEventSelector || triggerEvent === "appointment_date") && (
            <>
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
            </>
          )}

          {/* Discharge-based fields */}
          {showTriggerEventSelector && triggerEvent === "discharge_api" && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Discharge trigger name</label>
              <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50">
                patient.discharged
              </div>
              <p className="text-xs text-gray-400 mt-1">This trigger is configured via API and cannot be edited here.</p>
            </div>
          )}

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

      {/* Section: When to send */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={++sectionNum} />
          <h3 className="text-base font-semibold text-[#111824]">When to send</h3>
        </div>
        <div className="ml-10">
          {hasConfigurableTiming ? (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-700">Send message</span>
              <input
                type="number"
                value={timingAmount}
                onChange={(e) => setTimingAmount(Number(e.target.value))}
                min={1}
                className="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <select
                value={timingUnit}
                onChange={(e) => setTimingUnit(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                {(isPostVisitSurvey ? timeUnitsWithMonths : timeUnits).map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">
                {showTriggerEventSelector
                  ? triggerEvent === "appointment_date"
                    ? "after appointment date"
                    : "after discharge"
                  : `${timingDirection} ${getTimingEventLabel()}`}
              </span>
            </div>
          ) : (
            <div className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-[#111824] bg-white">
              {template.defaultTrigger}
            </div>
          )}
        </div>
      </div>

      <div className="border-b border-gray-200" />

      {/* Section: Send this message */}
      <div className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <SectionNumber num={++sectionNum} />
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

      {/* Section: Follow-on reminders (surveys/registration only) */}
      {showFollowOnSection && (
        <>
          <div className="border-b border-gray-200" />
          <div className="py-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionNumber num={++sectionNum} />
              <h3 className="text-base font-semibold text-[#111824]">Follow-on reminders</h3>
            </div>
            <div className="ml-10 space-y-4">
              <p className="text-sm text-gray-500">
                If the patient does not complete the form, automatically send a follow-up reminder.
                You can add up to 5 follow-on reminders.
              </p>

              {followOnReminders.map((reminder, index) => (
                <div key={reminder.id} className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-500 w-24 shrink-0">Reminder {index + 1}:</span>
                  <span className="text-sm text-gray-700">Send</span>
                  <input
                    type="number"
                    value={reminder.amount}
                    onChange={(e) => updateFollowOnReminder(reminder.id, "amount", Number(e.target.value))}
                    min={1}
                    className="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                  <select
                    value={reminder.unit}
                    onChange={(e) => updateFollowOnReminder(reminder.id, "unit", e.target.value)}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    {timeUnits.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-700">after the survey was sent</span>
                  <button
                    onClick={() => removeFollowOnReminder(reminder.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {followOnReminders.length < 5 && (
                <button
                  onClick={addFollowOnReminder}
                  className="flex items-center gap-2 text-sm text-[#4361EE] hover:text-[#3651DE] font-medium transition-colors"
                >
                  <Plus size={14} />
                  Add follow-on reminder
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Section: Trigger an alert (not for surveys) */}
      {showAlertSection && (
        <>
          <div className="border-b border-gray-200" />
          <div className="py-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionNumber num={++sectionNum} />
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
        </>
      )}

      {/* Section: Exceptions (not for surveys) */}
      {showExceptionsSection && (
        <>
          <div className="border-b border-gray-200" />
          <div className="py-8">
            <div className="flex items-center gap-3 mb-6">
              <SectionNumber num={++sectionNum} />
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
        </>
      )}
    </div>
  );
}
