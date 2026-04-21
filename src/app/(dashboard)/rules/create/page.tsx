"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockCalendarOptions, mockHospitalUsers } from "@/data/rule-mock-data";
import {
  EligibilityMode,
  EligibilityCondition,
  LogicOperator,
  BookingMode,
  TimeUnit,
  NoSlotsAction,
  SlotsUnsuitableAction,
  ReschedulePolicy,
  CancelPolicy,
  AlertMode,
} from "@/data/rule-types";
import { allProperties } from "@/data/properties";
import EligibilityBuilder from "@/components/rules/EligibilityBuilder";
import MultiSelect from "@/components/ui/MultiSelect";
import { ChevronLeft, Sparkles, Info } from "lucide-react";

function SectionNumber({ num }: { num: number }) {
  return (
    <div className="w-7 h-7 bg-blue-100 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF] rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

const timeUnitOptions: { value: TimeUnit; label: string }[] = [
  { value: "hours", label: "hours" },
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
];

const bookingWindowUnits: { value: TimeUnit; label: string }[] = [
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "months", label: "months" },
];

export default function CreateRulePage() {
  // Section 1: Details
  const [ruleName, setRuleName] = useState("");
  const [calendarId, setCalendarId] = useState("");
  const [appointmentType, setAppointmentType] = useState("All appointments");

  // Section 2: Description
  const [description, setDescription] = useState("");

  // Section 3: Eligibility
  const [eligibilityMode, setEligibilityMode] = useState<EligibilityMode>("anyone");
  const [eligibilityLogic, setEligibilityLogic] = useState<LogicOperator>("AND");
  const [eligibilityConditions, setEligibilityConditions] = useState<EligibilityCondition[]>([
    { id: "cond_init", property_id: "", operator: "eq", value: "" },
  ]);

  // Section 4: Booking Mode
  const [bookingMode, setBookingMode] = useState<BookingMode>("direct");
  const [slotsToOffer, setSlotsToOffer] = useState(3);
  const [bookingWindowValue, setBookingWindowValue] = useState(2);
  const [bookingWindowUnit, setBookingWindowUnit] = useState<TimeUnit>("weeks");
  const [noSlotsAction, setNoSlotsAction] = useState<NoSlotsAction>("handover");
  const [slotsUnsuitableAction, setSlotsUnsuitableAction] = useState<SlotsUnsuitableAction>("offer_more");
  const [maxRetries, setMaxRetries] = useState(3);
  const [schedulingLinkUrl, setSchedulingLinkUrl] = useState("");

  // Section 5: Property Collection Config
  const [propertyConfigs, setPropertyConfigs] = useState<Record<string, { required: boolean; when: "before" | "after" }>>({});
  const selectedPropertyKeys = Object.keys(propertyConfigs);

  function handlePropertiesChange(keys: string[]) {
    // Keep existing configs for kept keys; add defaults for new; drop removed
    const next: Record<string, { required: boolean; when: "before" | "after" }> = {};
    keys.forEach((k) => {
      next[k] = propertyConfigs[k] ?? { required: false, when: "before" };
    });
    setPropertyConfigs(next);
  }

  function updatePropertyConfig(key: string, patch: Partial<{ required: boolean; when: "before" | "after" }>) {
    setPropertyConfigs((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  // Section 6: Reschedule
  const [reschedulePolicy, setReschedulePolicy] = useState<ReschedulePolicy>("allowed");
  const [rescheduleWindowValue, setRescheduleWindowValue] = useState(24);
  const [rescheduleWindowUnit, setRescheduleWindowUnit] = useState<TimeUnit>("hours");

  // Section 7: Cancel
  const [cancelPolicy, setCancelPolicy] = useState<CancelPolicy>("allowed");
  const [cancelWindowValue, setCancelWindowValue] = useState(24);
  const [cancelWindowUnit, setCancelWindowUnit] = useState<TimeUnit>("hours");

  // Section 8: Alerts
  const [alertMode, setAlertMode] = useState<AlertMode>("none");
  const [alertOnNewBooking, setAlertOnNewBooking] = useState(true);
  const [alertOnChange, setAlertOnChange] = useState(true);
  const [alertUserIds, setAlertUserIds] = useState<string[]>([]);

  const selectedCalendar = mockCalendarOptions.find((c) => c.id === calendarId);

  const propertyOptions = useMemo(
    () => allProperties.map((p) => ({ value: p.key, label: p.name })),
    []
  );

  const userOptions = useMemo(
    () => mockHospitalUsers.map((u) => ({ value: u.id, label: `${u.name} — ${u.role}` })),
    []
  );

  return (
    <div className="pb-16">
      <Link href="/rules" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Create Scheduling Rule</h1>
          <p className="text-[16px] text-gray-500 mt-2">
            Configure how the AI handles booking for a calendar and appointment types
          </p>
        </div>
        <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Save Rule
        </button>
      </div>

      <div className="border-b border-gray-200" />

      <div className="max-w-3xl">
        {/* Section 1: Details */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={1} />
            <h3 className="text-base font-semibold text-[#111824]">Details</h3>
          </div>
          <div className="ml-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Rule Name</label>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="e.g. Cardiology — Patient Booking"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Short descriptive name for your team to recognize this rule.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Calendar Account</label>
              <select
                value={calendarId}
                onChange={(e) => { setCalendarId(e.target.value); setAppointmentType("All appointments"); }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="">Select calendar...</option>
                {mockCalendarOptions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Appointment Types</label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                disabled={!selectedCalendar}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50 dark:disabled:bg-[#1A2336]"
              >
                {selectedCalendar ? (
                  selectedCalendar.appointment_types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))
                ) : (
                  <option value="">Select a calendar first</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 2: Description */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <SectionNumber num={2} />
            <h3 className="text-base font-semibold text-[#111824]">Describe this appointment</h3>
          </div>
          <p className="ml-10 text-sm text-gray-500 mb-6">
            Helps the AI understand context and handle patient questions.
          </p>
          <div className="ml-10 space-y-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="e.g. This MRI/CT scan appointment is for patients who have been referred by their doctor. Patients must submit their referral letter in chat to book their appointment. Patients without a referral letter will be handed over to a human agent."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <span>💡</span>
                <span>Write like you&apos;re briefing a new receptionist.</span>
              </div>
              <button
                disabled={!description.trim()}
                className="flex items-center gap-1.5 text-sm font-medium text-[#4361EE] hover:text-[#3651DE] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles size={14} />
                Rewrite with AI
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 3: Eligibility */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={3} />
            <h3 className="text-base font-semibold text-[#111824]">Who can book this appointment?</h3>
          </div>
          <div className="ml-10 space-y-4">
            <label className="flex items-start gap-3 p-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
              <input
                type="radio"
                name="eligibility"
                checked={eligibilityMode === "anyone"}
                onChange={() => setEligibilityMode("anyone")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Anyone</div>
                <div className="text-xs text-gray-500 mt-0.5">Any patient can book this appointment type.</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
              <input
                type="radio"
                name="eligibility"
                checked={eligibilityMode === "criteria"}
                onChange={() => setEligibilityMode("criteria")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Patients who meet these criteria</div>
                <div className="text-xs text-gray-500 mt-0.5">Only patients matching the criteria below can book.</div>
              </div>
            </label>

            {eligibilityMode === "criteria" && (
              <EligibilityBuilder
                logic={eligibilityLogic}
                conditions={eligibilityConditions}
                onLogicChange={setEligibilityLogic}
                onConditionsChange={setEligibilityConditions}
              />
            )}
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 4: Booking Mode */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={4} />
            <h3 className="text-base font-semibold text-[#111824]">How would you like patients to book?</h3>
          </div>
          <div className="ml-10 space-y-4">
            {/* Direct booking */}
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input
                type="radio"
                name="bookingMode"
                checked={bookingMode === "direct"}
                onChange={() => setBookingMode("direct")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Scheduling AI to book directly</div>
                <div className="text-xs text-gray-500 mt-0.5">AI offers patient slots to choose from → Patient selects preferred slot → Appointment confirmed immediately.</div>
              </div>
            </label>

            {bookingMode === "direct" && (
              <div className="ml-7 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Slots to offer</label>
                    <select
                      value={slotsToOffer}
                      onChange={(e) => setSlotsToOffer(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} slot{n !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Booking window</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={bookingWindowValue}
                        onChange={(e) => setBookingWindowValue(Number(e.target.value))}
                        min={1}
                        className="w-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                      />
                      <select
                        value={bookingWindowUnit}
                        onChange={(e) => setBookingWindowUnit(e.target.value as TimeUnit)}
                        className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                      >
                        {bookingWindowUnits.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">When no slots are available</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="radio" name="noSlots" checked={noSlotsAction === "handover"} onChange={() => setNoSlotsAction("handover")} />
                      <span className="text-[#111824] dark:text-[#C7CFDB]">Handover to human agent</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="radio" name="noSlots" checked={noSlotsAction === "inform"} onChange={() => setNoSlotsAction("inform")} />
                      <span className="text-[#111824] dark:text-[#C7CFDB]">Inform patient no slots available</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-2 block">When none of the offered slots work for the patient</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 text-sm cursor-pointer flex-wrap">
                      <input type="radio" name="unsuitable" checked={slotsUnsuitableAction === "offer_more"} onChange={() => setSlotsUnsuitableAction("offer_more")} />
                      <span className="text-[#111824] dark:text-[#C7CFDB]">Offer next set (max</span>
                      <input
                        type="number"
                        value={maxRetries}
                        onChange={(e) => setMaxRetries(Number(e.target.value))}
                        min={1}
                        max={10}
                        disabled={slotsUnsuitableAction !== "offer_more"}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50"
                      />
                      <span className="text-[#111824] dark:text-[#C7CFDB]">retries)</span>
                    </label>
                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="radio" name="unsuitable" checked={slotsUnsuitableAction === "handover_immediately"} onChange={() => setSlotsUnsuitableAction("handover_immediately")} />
                      <span className="text-[#111824] dark:text-[#C7CFDB]">Handover to human immediately</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduling link */}
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input
                type="radio"
                name="bookingMode"
                checked={bookingMode === "scheduling_link"}
                onChange={() => setBookingMode("scheduling_link")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Send scheduling link</div>
                <div className="text-xs text-gray-500 mt-0.5">AI returns scheduling link to an external booking portal.</div>
              </div>
            </label>

            {bookingMode === "scheduling_link" && (
              <div className="ml-7">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Scheduling URL</label>
                <input
                  type="url"
                  value={schedulingLinkUrl}
                  onChange={(e) => setSchedulingLinkUrl(e.target.value)}
                  placeholder="https://bookings.example.com/cardiology"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                />
              </div>
            )}

            {/* Request preferred */}
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input
                type="radio"
                name="bookingMode"
                checked={bookingMode === "request_preferred"}
                onChange={() => setBookingMode("request_preferred")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Request preferred date and time</div>
                <div className="text-xs text-gray-500 mt-0.5">AI collects patient&apos;s preferred date and time (AM/PM) and hands over to a human.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 5: Property Collection Config */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={5} />
            <h3 className="text-base font-semibold text-[#111824]">What information do we need to collect from the patient?</h3>
          </div>
          <div className="ml-10 space-y-4">
            <MultiSelect
              options={propertyOptions}
              selected={selectedPropertyKeys}
              onChange={handlePropertiesChange}
              placeholder="Select patient properties..."
            />

            {selectedPropertyKeys.length > 0 && (
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F4F6F8] dark:bg-[#1A2336] border-b border-gray-200 dark:border-[#263248]">
                      <th className="text-left text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] pl-5 pr-4 py-3">Information</th>
                      <th className="text-center text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-4 py-3 w-28">Required</th>
                      <th className="text-center text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-4 py-3 w-44">Collect before booking</th>
                      <th className="text-center text-[14px] font-normal text-[#111824] dark:text-[#F5F7FB] px-4 py-3 w-44">Collect after booking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPropertyKeys.map((key) => {
                      const prop = allProperties.find((p) => p.key === key);
                      const config = propertyConfigs[key];
                      return (
                        <tr key={key} className="border-b border-gray-100 dark:border-[#1D2638] last:border-0">
                          <td className="pl-5 pr-4 py-4 text-sm text-[#111824] dark:text-[#F5F7FB]">
                            {prop?.name || key}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={config.required}
                              onChange={(e) => updatePropertyConfig(key, { required: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="radio"
                              name={`when_${key}`}
                              checked={config.when === "before"}
                              onChange={() => updatePropertyConfig(key, { when: "before" })}
                              className="w-4 h-4 text-[#4361EE]"
                            />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="radio"
                              name={`when_${key}`}
                              checked={config.when === "after"}
                              onChange={() => updatePropertyConfig(key, { when: "after" })}
                              className="w-4 h-4 text-[#4361EE]"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-sm text-gray-500">
              Select from patient properties. You can set them up in{" "}
              <Link href="/contacts" className="text-blue-600 hover:underline">
                Contacts module →
              </Link>
            </p>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 6: Reschedule */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={6} />
            <h3 className="text-base font-semibold text-[#111824]">Allow patient to reschedule appointment?</h3>
          </div>
          <div className="ml-10 space-y-3">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="reschedule" checked={reschedulePolicy === "allowed"} onChange={() => setReschedulePolicy("allowed")} className="mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#111824] mb-2 flex items-center gap-2 flex-wrap">
                  Yes, rescheduling is permitted up to
                  <input
                    type="number"
                    value={rescheduleWindowValue}
                    onChange={(e) => setRescheduleWindowValue(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    disabled={reschedulePolicy !== "allowed"}
                    min={1}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50"
                  />
                  <select
                    value={rescheduleWindowUnit}
                    onChange={(e) => setRescheduleWindowUnit(e.target.value as TimeUnit)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={reschedulePolicy !== "allowed"}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50"
                  >
                    {timeUnitOptions.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                  before appointment date.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="reschedule" checked={reschedulePolicy === "not_allowed_handover"} onChange={() => setReschedulePolicy("not_allowed_handover")} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium text-[#111824]">No, rescheduling is not permitted — handover to human</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="reschedule" checked={reschedulePolicy === "not_allowed_call"} onChange={() => setReschedulePolicy("not_allowed_call")} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium text-[#111824]">No, rescheduling is not permitted — ask patient to call to reschedule</div>
              </div>
            </label>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 7: Cancel */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={7} />
            <h3 className="text-base font-semibold text-[#111824]">Allow patient to cancel appointment?</h3>
          </div>
          <div className="ml-10 space-y-3">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="cancel" checked={cancelPolicy === "allowed"} onChange={() => setCancelPolicy("allowed")} className="mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#111824] mb-2 flex items-center gap-2 flex-wrap">
                  Yes, cancellation is permitted up to
                  <input
                    type="number"
                    value={cancelWindowValue}
                    onChange={(e) => setCancelWindowValue(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    disabled={cancelPolicy !== "allowed"}
                    min={1}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50"
                  />
                  <select
                    value={cancelWindowUnit}
                    onChange={(e) => setCancelWindowUnit(e.target.value as TimeUnit)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={cancelPolicy !== "allowed"}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:bg-gray-50"
                  >
                    {timeUnitOptions.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                  before appointment date.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="cancel" checked={cancelPolicy === "not_allowed_handover"} onChange={() => setCancelPolicy("not_allowed_handover")} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium text-[#111824]">Cancellation is not permitted — handover to human</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input type="radio" name="cancel" checked={cancelPolicy === "not_allowed_call"} onChange={() => setCancelPolicy("not_allowed_call")} className="mt-0.5" />
              <div>
                <div className="text-sm font-medium text-[#111824]">Cancellation is not permitted — ask patient to call to cancel</div>
              </div>
            </label>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 8: Alerts */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={8} />
            <h3 className="text-base font-semibold text-[#111824]">Do we need to alert anyone for bookings?</h3>
          </div>
          <div className="ml-10 space-y-4">
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input
                type="radio"
                name="alerts"
                checked={alertMode === "none"}
                onChange={() => setAlertMode("none")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">No alerts needed</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
              <input
                type="radio"
                name="alerts"
                checked={alertMode === "alert_users"}
                onChange={() => setAlertMode("alert_users")}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium text-[#111824]">Alert these users</div>
                <div className="text-xs text-gray-500 mt-0.5">Selected users receive a notification when bookings occur.</div>
              </div>
            </label>

            {alertMode === "alert_users" && (
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertOnNewBooking}
                      onChange={() => setAlertOnNewBooking(!alertOnNewBooking)}
                      className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                    />
                    <span className="text-[#111824] dark:text-[#C7CFDB]">Alert on new booking</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alertOnChange}
                      onChange={() => setAlertOnChange(!alertOnChange)}
                      className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                    />
                    <span className="text-[#111824] dark:text-[#C7CFDB]">Alert on cancel or reschedule</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Users to alert</label>
                  <MultiSelect
                    options={userOptions}
                    selected={alertUserIds}
                    onChange={setAlertUserIds}
                    placeholder="Select users..."
                  />
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 text-xs text-gray-500 px-1">
              <Info size={12} className="shrink-0 mt-0.5" />
              <span>Patient handover requests will always alert users, regardless of this setting.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
