"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  mockAgents,
  availableChannels,
  availableKnowledgeBaseSets,
  availableRecommendations,
  availableConsentTemplates,
  handoverMessageTemplates,
  awaitingResponseTemplates,
  defaultOperatingHours,
  type OperatingHours,
} from "@/data/ai-agent-mock-data";
import { mockRules } from "@/data/rule-mock-data";
import {
  VoiceTone,
  ModelTier,
  voiceToneLabels,
  modelTierLabels,
  availableLanguages,
} from "@/data/ai-agent-types";
import LibraryPicker, { LibraryPickerItem } from "@/components/ai-agents/LibraryPicker";
import MultiSelect from "@/components/ui/MultiSelect";
import MessageInput, { MessageMode } from "@/components/ai-agents/MessageInput";
import OperatingHoursModal from "@/components/ai-agents/OperatingHoursModal";
import { ChevronLeft, ChevronDown, ChevronUp, Copy, FileText, ExternalLink, Clock } from "lucide-react";

const channelIcons: Record<string, string> = {
  whatsapp: "/channels/whatsapp.svg",
  messenger: "/channels/messenger.svg",
  instagram: "/channels/instagram.svg",
};

function SectionNumber({ num }: { num: number }) {
  return (
    <div className="w-7 h-7 bg-blue-100 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF] rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
      {num}
    </div>
  );
}

type StartFrom = "blank" | "clone";
type ConsentMode = "free_text" | "message_template";
type TimeUnit = "minutes" | "hours";
type RatingType = "stars" | "satisfaction";

const ALL_LANGUAGES_CODE = "__all__";

function formatHoursSummary(hours: OperatingHours[]): string {
  const enabled = hours.filter((h) => h.enabled);
  if (enabled.length === 0) return "No operating hours set";
  if (enabled.length === 7) return "Every day";
  const days = enabled.map((h) => h.day.slice(0, 3)).join(", ");
  const sameHours = enabled.every((h) => h.start === enabled[0].start && h.end === enabled[0].end);
  if (sameHours) {
    return `${days} · ${enabled[0].start}–${enabled[0].end}`;
  }
  return days;
}

export default function CreateAgentPage() {
  // Start from
  const [startFrom, setStartFrom] = useState<StartFrom>("blank");
  const [cloneSource, setCloneSource] = useState<string>(mockAgents[0]?.id || "");

  // Details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channelIdx, setChannelIdx] = useState<number | null>(null);

  // Persona
  const [displayName, setDisplayName] = useState("Mira");
  const [hospitalName, setHospitalName] = useState("Mary Mediatrix Medical Center");
  const [voiceTone, setVoiceTone] = useState<VoiceTone>("warm_friendly");
  const [languages, setLanguages] = useState<string[]>(["en"]);

  // Consent template
  const [consentMode, setConsentMode] = useState<ConsentMode>("free_text");
  const [freeTextConsent, setFreeTextConsent] = useState(
    "Hi! 👋 I'm {agentName}, the AI assistant for {hospitalName}. Messages may be monitored for quality. How can I help you today?"
  );
  const [messageTemplateId, setMessageTemplateId] = useState(availableConsentTemplates[0].id);

  // Library subscriptions
  const [kbSets, setKbSets] = useState<Set<string>>(new Set());
  const [enabledRules, setEnabledRules] = useState<Set<string>>(new Set());
  const [enabledRecs, setEnabledRecs] = useState<Set<string>>(new Set());

  // Handover to Human Agent
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(defaultOperatingHours);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);

  const [duringMode, setDuringMode] = useState<MessageMode>("template");
  const [duringFreeText, setDuringFreeText] = useState("");
  const [duringTemplateId, setDuringTemplateId] = useState(handoverMessageTemplates[0].id);

  const [outsideMode, setOutsideMode] = useState<MessageMode>("template");
  const [outsideFreeText, setOutsideFreeText] = useState("");
  const [outsideTemplateId, setOutsideTemplateId] = useState(handoverMessageTemplates[1].id);

  const [awaitingEnabled, setAwaitingEnabled] = useState(false);
  const [awaitingMode, setAwaitingMode] = useState<MessageMode>("template");
  const [awaitingFreeText, setAwaitingFreeText] = useState("");
  const [awaitingTemplateId, setAwaitingTemplateId] = useState(awaitingResponseTemplates[0].id);

  // Conversation Resolution
  const [nudgeEnabled, setNudgeEnabled] = useState(false);
  const [nudgeAmount, setNudgeAmount] = useState(30);
  const [nudgeUnit, setNudgeUnit] = useState<TimeUnit>("minutes");

  const [autoResolveEnabled, setAutoResolveEnabled] = useState(false);
  const [autoResolveAmount, setAutoResolveAmount] = useState(24);
  const [autoResolveUnit, setAutoResolveUnit] = useState<TimeUnit>("hours");

  // CSAT
  const [csatEnabled, setCsatEnabled] = useState(false);
  const [csatType, setCsatType] = useState<RatingType>("stars");

  // Behavior (advanced)
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  const [modelTier, setModelTier] = useState<ModelTier>("essential");
  const [customInstructions, setCustomInstructions] = useState("");

  function toggleSet(set: Set<string>, setSet: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSet(next);
  }

  function handleLanguagesChange(newLangs: string[]) {
    const current = languages;
    const hadAll = current.includes(ALL_LANGUAGES_CODE);
    const wantsAll = newLangs.includes(ALL_LANGUAGES_CODE);

    // If "All languages" was just added, clear everything else
    if (wantsAll && !hadAll) {
      setLanguages([ALL_LANGUAGES_CODE]);
      return;
    }
    // If a specific language was selected while "All" was active, remove "All"
    if (wantsAll && hadAll && newLangs.length > 1) {
      setLanguages(newLangs.filter((l) => l !== ALL_LANGUAGES_CODE));
      return;
    }
    setLanguages(newLangs);
  }

  const selectedChannel = channelIdx !== null ? availableChannels[channelIdx] : null;
  const selectedMessageTemplate = availableConsentTemplates.find((t) => t.id === messageTemplateId);

  // Build picker items
  const kbItems: LibraryPickerItem[] = availableKnowledgeBaseSets.map((kb) => ({
    id: kb.id,
    name: kb.name,
    subtitle: `${kb.sources_count} source${kb.sources_count !== 1 ? "s" : ""} · ${kb.qa_count} Q&A · used by ${kb.used_by_agents.length} ${kb.used_by_agents.length === 1 ? "agent" : "agents"}`,
    description: kb.description,
  }));

  const ruleItems: LibraryPickerItem[] = mockRules.map((rule) => {
    const hasNoAppointmentTypes = rule.appointment_types.length === 0;
    return {
      id: rule.id,
      name: rule.name,
      subtitle: `Calendar: ${rule.calendar_name} · ${rule.booking_method === "direct" ? "Direct booking" : rule.booking_method === "request" ? "Request + approval" : "Link"} · ${rule.fields_collected_count} fields`,
      badge: hasNoAppointmentTypes ? { label: "⚠ not bookable", tone: "warning" as const } : undefined,
    };
  });

  const recItems: LibraryPickerItem[] = availableRecommendations.map((rec) => ({
    id: rec.id,
    name: rec.name,
    subtitle: `Collects: ${rec.collects.join(", ")}`,
    description: `Recommends: ${rec.recommends.join(" / ")}${rec.used_by_agents.length > 0 ? ` · used by ${rec.used_by_agents.length} other agent${rec.used_by_agents.length !== 1 ? "s" : ""}` : ""}`,
  }));

  // Consent preview
  const consentPreview = useMemo(() => {
    const replace = (s: string) => s
      .replace(/\{agentName\}/g, displayName || "[Agent Name]")
      .replace(/\{hospitalName\}/g, hospitalName || "[Hospital Name]");

    if (consentMode === "free_text") return replace(freeTextConsent);
    const tpl = availableConsentTemplates.find((t) => t.id === messageTemplateId);
    return tpl ? replace(tpl.preview) : "";
  }, [consentMode, freeTextConsent, messageTemplateId, displayName, hospitalName]);

  const charCount = customInstructions.length;
  const maxChars = 500;

  // Build language options with "All languages" at top
  const languageOptions = useMemo(
    () => [
      { value: ALL_LANGUAGES_CODE, label: "All languages" },
      ...availableLanguages.map((l) => ({ value: l.code, label: l.label })),
    ],
    []
  );

  return (
    <div className="pb-16">
      <Link href="/ai-agents" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Create AI Agent</h1>
          <p className="text-[16px] text-gray-500 mt-2">Configure a new AI agent for your channel</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Test in sandbox
          </button>
          <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Publish
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-2" />

      <div className="max-w-3xl">
        {/* Start from */}
        <div className="py-6">
          <h3 className="text-sm font-semibold text-[#111824] mb-3">Start from</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setStartFrom("blank")}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                startFrom === "blank" ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText size={14} className="text-gray-400" />
                <div className="text-sm font-medium text-[#111824]">Blank</div>
              </div>
              <div className="text-xs text-gray-500">Start from scratch</div>
            </button>
            <button
              onClick={() => setStartFrom("clone")}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                startFrom === "clone" ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Copy size={14} className="text-gray-400" />
                <div className="text-sm font-medium text-[#111824]">Clone existing agent</div>
              </div>
              <div className="text-xs text-gray-500">Copy config from another agent</div>
            </button>
          </div>

          {startFrom === "clone" && (
            <div className="mt-3">
              <select
                value={cloneSource}
                onChange={(e) => setCloneSource(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                {mockAgents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-2">Cloning carries over everything except channel, display name, and sandbox code.</p>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 1: Details */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={1} />
            <h3 className="text-base font-semibold text-[#111824]">Details</h3>
          </div>
          <div className="ml-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Agent Name (Internal)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Patient Bot"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Internal name for your team — not shown to patients.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Internal description (not shown to patients)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of what this agent does"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Channel</label>
              <p className="text-xs text-gray-400 mb-2">Each channel can only have one agent.</p>
              <select
                value={channelIdx ?? ""}
                onChange={(e) => setChannelIdx(e.target.value === "" ? null : Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="">Select a channel</option>
                {availableChannels.map((ch, idx) => {
                  const typeLabel = ch.type.charAt(0).toUpperCase() + ch.type.slice(1);
                  const disabled = !!ch.used_by_agent;
                  return (
                    <option key={idx} value={idx} disabled={disabled}>
                      {typeLabel} · {ch.label} — {ch.identifier}
                      {disabled ? ` (used by ${ch.used_by_agent})` : ""}
                    </option>
                  );
                })}
              </select>
              <div className="mt-2 text-xs text-gray-400">
                Don&apos;t see your channel?{" "}
                <Link href="/channels" className="text-blue-600 hover:underline">
                  Connect a channel →
                </Link>
              </div>
            </div>

            {selectedChannel && selectedChannel.messages_last_7d !== undefined && selectedChannel.messages_last_7d > 0 && (
              <div className="bg-blue-50 dark:bg-[#151E3A] border border-blue-100 dark:border-[#1E3A6E] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#111824] dark:text-[#F5F7FB] mb-2 flex items-center gap-2">
                  {channelIcons[selectedChannel.type] && (
                    <Image src={channelIcons[selectedChannel.type]} alt="" width={16} height={16} className="w-4 h-4 rounded" />
                  )}
                  Connected channel
                </div>
                <div className="text-sm text-[#111824] dark:text-[#F5F7FB] font-medium mb-1">
                  {selectedChannel.label} · {selectedChannel.identifier}
                </div>
                <div className="text-xs text-gray-600 dark:text-[#C7CFDB]">
                  <span className="font-semibold">{selectedChannel.messages_last_7d}</span> messages in last 7 days ·{" "}
                  <span className="font-semibold">{selectedChannel.unique_senders_last_7d}</span> unique senders
                </div>
                {selectedChannel.language_breakdown && selectedChannel.language_breakdown.length > 0 && (
                  <div className="text-xs text-gray-600 dark:text-[#C7CFDB] mt-1">
                    Most messages in {selectedChannel.language_breakdown.map((l) => `${l.lang} (${l.pct}%)`).join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 2: Persona */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-2">
            <SectionNumber num={2} />
            <h3 className="text-base font-semibold text-[#111824]">Persona</h3>
          </div>
          <p className="ml-10 text-sm text-gray-500 mb-6">How the AI introduces itself to patients.</p>
          <div className="ml-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Agent Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Mira"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">How the agent introduces itself to patients.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Hospital or Clinic Display Name</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g., Mary Mediatrix Medical Center"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">Used in greetings and messages patients see.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Voice tone</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(voiceToneLabels) as VoiceTone[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setVoiceTone(tone)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      voiceTone === tone ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium text-[#111824]">{voiceToneLabels[tone]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Language(s) supported</label>
              <MultiSelect
                options={languageOptions}
                selected={languages}
                onChange={handleLanguagesChange}
                placeholder="Select languages..."
              />
              <p className="text-xs text-gray-400 mt-2">
                Languages the agent may respond in. Select <strong>All languages</strong> to support every language automatically.
              </p>
            </div>

            {/* Consent template */}
            <div className="pt-2 border-t border-gray-100 dark:border-[#1D2638]">
              <label className="text-sm font-medium text-gray-500 mb-2 block mt-4">Consent template</label>
              <div className="space-y-2 mb-3">
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
                  <input
                    type="radio"
                    name="consent"
                    checked={consentMode === "free_text"}
                    onChange={() => setConsentMode("free_text")}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#111824]">Free text</div>
                    <div className="text-xs text-gray-500 mt-0.5">Write a fixed consent message patients will receive</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors border-gray-200 dark:border-[#263248]">
                  <input
                    type="radio"
                    name="consent"
                    checked={consentMode === "message_template"}
                    onChange={() => setConsentMode("message_template")}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#111824]">Message template</div>
                    <div className="text-xs text-gray-500 mt-0.5">Select an existing message template (may include Yes/No buttons)</div>
                  </div>
                </label>
              </div>

              {consentMode === "free_text" && (
                <div className="bg-gray-50 dark:bg-[#182234] border border-gray-200 dark:border-[#263248] rounded-lg p-4 space-y-3">
                  <div className="text-xs text-gray-500">
                    Available placeholders: <code className="px-1 py-0.5 bg-white dark:bg-[#121A2B] rounded">{"{agentName}"}</code>{" "}
                    <code className="px-1 py-0.5 bg-white dark:bg-[#121A2B] rounded">{"{hospitalName}"}</code>
                  </div>
                  <textarea
                    value={freeTextConsent}
                    onChange={(e) => setFreeTextConsent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
                  />
                </div>
              )}

              {consentMode === "message_template" && (
                <div className="space-y-3">
                  <select
                    value={messageTemplateId}
                    onChange={(e) => setMessageTemplateId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    {availableConsentTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}{t.has_buttons ? " (with buttons)" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="text-xs text-gray-400">
                    Don&apos;t see your template?{" "}
                    <Link href="/templates" className="text-blue-600 hover:underline">
                      Manage templates →
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-3 bg-blue-50 dark:bg-[#151E3A] border border-blue-100 dark:border-[#1E3A6E] rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Preview:</div>
                <div className="text-sm text-[#111824] dark:text-[#F5F7FB] italic">&ldquo;{consentPreview}&rdquo;</div>
                {consentMode === "message_template" && selectedMessageTemplate?.has_buttons && selectedMessageTemplate.buttons && (
                  <div className="flex gap-2 mt-3">
                    {selectedMessageTemplate.buttons.map((btn) => (
                      <span key={btn} className="text-xs px-3 py-1 bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-md text-[#4361EE] dark:text-[#7DA2FF] font-medium">
                        {btn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 3: Knowledge Base */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={3} />
            <h3 className="text-base font-semibold text-[#111824]">Knowledge Base</h3>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-4">
              Subscribe this agent to one or more knowledge base sets. The agent will use these to answer patient questions.{" "}
              <Link href="/knowledge-base" className="text-blue-600 hover:underline">
                Manage Knowledge Base →
              </Link>
            </p>
            <LibraryPicker
              items={kbItems}
              selectedIds={kbSets}
              onToggle={(id) => toggleSet(kbSets, setKbSets, id)}
              searchPlaceholder="Search knowledge base sets..."
              itemLabel="sets"
            />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 4: Scheduling */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={4} />
            <h3 className="text-base font-semibold text-[#111824]">Scheduling</h3>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-4">
              Subscribe to scheduling rules for calendar and appointment types.{" "}
              <Link href="/rules" className="text-blue-600 hover:underline">
                Manage Scheduling Rules →
              </Link>
            </p>
            <LibraryPicker
              items={ruleItems}
              selectedIds={enabledRules}
              onToggle={(id) => toggleSet(enabledRules, setEnabledRules, id)}
              searchPlaceholder="Search scheduling rules..."
              itemLabel="rules"
            />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 5: Recommendations */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={5} />
            <h3 className="text-base font-semibold text-[#111824]">Recommendations</h3>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-4">
              Recommendation logic for agent to suggest to patient.{" "}
              <Link href="/recommendations" className="text-blue-600 hover:underline">
                Manage Recommendations →
              </Link>
            </p>
            <LibraryPicker
              items={recItems}
              selectedIds={enabledRecs}
              onToggle={(id) => toggleSet(enabledRecs, setEnabledRecs, id)}
              searchPlaceholder="Search recommendation flows..."
              itemLabel="flows"
            />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 6: Handover to Human Agent */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={6} />
            <h3 className="text-base font-semibold text-[#111824]">Handover to Human Agent</h3>
          </div>
          <div className="ml-10 space-y-6">
            {/* Operating hours summary */}
            <div className="flex items-center justify-between bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Operating hours</div>
                  <div className="text-xs text-gray-500 dark:text-[#8E99AB]">{formatHoursSummary(operatingHours)}</div>
                </div>
              </div>
              <button
                onClick={() => setHoursModalOpen(true)}
                className="text-sm font-medium text-[#4361EE] hover:text-[#3651DE] transition-colors"
              >
                Customize operating hours
              </button>
            </div>

            {/* During operating hours */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Handover message: During operating hours</label>
              <MessageInput
                mode={duringMode}
                onModeChange={setDuringMode}
                freeText={duringFreeText}
                onFreeTextChange={setDuringFreeText}
                templateId={duringTemplateId}
                onTemplateIdChange={setDuringTemplateId}
                templates={handoverMessageTemplates}
                placeholder="Thanks for your patience! Connecting you with our team..."
              />
            </div>

            {/* Outside operating hours */}
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Handover message: Outside operating hours</label>
              <MessageInput
                mode={outsideMode}
                onModeChange={setOutsideMode}
                freeText={outsideFreeText}
                onFreeTextChange={setOutsideFreeText}
                templateId={outsideTemplateId}
                onTemplateIdChange={setOutsideTemplateId}
                templates={handoverMessageTemplates}
                placeholder="Our team is offline. We've logged your request..."
              />
            </div>

            {/* Awaiting human response */}
            <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-3">
                  <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Send message while awaiting human agent response</div>
                  <p className="text-xs text-gray-500 dark:text-[#8E99AB] mt-1">
                    If the patient sends another message while waiting for a human agent, send this response.
                  </p>
                </div>
                <button
                  onClick={() => setAwaitingEnabled(!awaitingEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                    awaitingEnabled ? "bg-[#4361EE]" : "bg-gray-300 dark:bg-[#263248]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      awaitingEnabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {awaitingEnabled && (
                <div className="mt-3">
                  <MessageInput
                    mode={awaitingMode}
                    onModeChange={setAwaitingMode}
                    freeText={awaitingFreeText}
                    onFreeTextChange={setAwaitingFreeText}
                    templateId={awaitingTemplateId}
                    onTemplateIdChange={setAwaitingTemplateId}
                    templates={awaitingResponseTemplates}
                    placeholder="Thanks — your message has been received..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 7: Conversation Resolution */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={7} />
            <h3 className="text-base font-semibold text-[#111824]">Conversation Resolution</h3>
          </div>
          <div className="ml-10 space-y-4">
            {/* Nudge */}
            <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-3">
                  <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Nudge patient for response</div>
                  <p className="text-xs text-gray-500 dark:text-[#8E99AB] mt-1">
                    Send a follow-up message if the patient has not responded.
                  </p>
                </div>
                <button
                  onClick={() => setNudgeEnabled(!nudgeEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                    nudgeEnabled ? "bg-[#4361EE]" : "bg-gray-300 dark:bg-[#263248]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      nudgeEnabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {nudgeEnabled && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-sm text-gray-700 dark:text-[#C7CFDB]">Send nudge</span>
                  <input
                    type="number"
                    value={nudgeAmount}
                    onChange={(e) => setNudgeAmount(Number(e.target.value))}
                    min={1}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                  <select
                    value={nudgeUnit}
                    onChange={(e) => setNudgeUnit(e.target.value as TimeUnit)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                  <span className="text-sm text-gray-700 dark:text-[#C7CFDB]">after patient&apos;s last response</span>
                </div>
              )}
            </div>

            {/* Auto-resolve */}
            <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-3">
                  <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Auto-resolve</div>
                  <p className="text-xs text-gray-500 dark:text-[#8E99AB] mt-1">
                    Mark a conversation as resolved if the patient does not respond within a set time. If the patient messages again after it has been resolved, a new conversation will open.
                  </p>
                </div>
                <button
                  onClick={() => setAutoResolveEnabled(!autoResolveEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                    autoResolveEnabled ? "bg-[#4361EE]" : "bg-gray-300 dark:bg-[#263248]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      autoResolveEnabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {autoResolveEnabled && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-sm text-gray-700 dark:text-[#C7CFDB]">Auto-resolve in</span>
                  <input
                    type="number"
                    value={autoResolveAmount}
                    onChange={(e) => setAutoResolveAmount(Number(e.target.value))}
                    min={1}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                  <select
                    value={autoResolveUnit}
                    onChange={(e) => setAutoResolveUnit(e.target.value as TimeUnit)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 8: Customer Satisfaction Rating */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={8} />
            <h3 className="text-base font-semibold text-[#111824]">Customer Satisfaction Rating</h3>
          </div>
          <div className="ml-10">
            <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-3">
                  <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Ask patient to rate their experience</div>
                  <p className="text-xs text-gray-500 dark:text-[#8E99AB] mt-1">
                    When a conversation is resolved, send a rating prompt to the patient.
                  </p>
                </div>
                <button
                  onClick={() => setCsatEnabled(!csatEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${
                    csatEnabled ? "bg-[#4361EE]" : "bg-gray-300 dark:bg-[#263248]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      csatEnabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {csatEnabled && (
                <div className="mt-3">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Rating scale</label>
                  <select
                    value={csatType}
                    onChange={(e) => setCsatType(e.target.value as RatingType)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    <option value="stars">Rate 1 to 5 stars</option>
                    <option value="satisfaction">Rate as Unsatisfied / Satisfied / Very Satisfied</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 9: Behavior (advanced) */}
        <div className="py-8">
          <button
            onClick={() => setBehaviorOpen(!behaviorOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <SectionNumber num={9} />
              <h3 className="text-base font-semibold text-[#111824]">Behavior (advanced)</h3>
            </div>
            <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              {behaviorOpen ? "Hide" : "Show"}
              {behaviorOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {behaviorOpen && (
            <div className="ml-10 mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">AI Model</label>
                <div className="space-y-2">
                  {(Object.keys(modelTierLabels) as ModelTier[]).map((tier) => (
                    <label key={tier} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
                      <input type="radio" name="modelTier" checked={modelTier === tier} onChange={() => setModelTier(tier)} />
                      <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{modelTierLabels[tier]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Custom instructions</label>
                <p className="text-xs text-gray-500 mb-3">
                  Additional AI agent prompts appended to default prompts. Does not override safety rules (emergency handling, medical advice, handover rules). Max 500 characters.
                </p>
                <div className="relative">
                  <textarea
                    value={customInstructions}
                    onChange={(e) => { if (e.target.value.length <= maxChars) setCustomInstructions(e.target.value); }}
                    rows={5}
                    placeholder="e.g., Always remind patients over 50 about our annual wellness package discount."
                    className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
                  />
                  <span className={`absolute right-3 bottom-3 text-xs tabular-nums ${charCount > maxChars * 0.9 ? "text-amber-600" : "text-gray-400"}`}>
                    {charCount}/{maxChars}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <OperatingHoursModal
        open={hoursModalOpen}
        hours={operatingHours}
        onClose={() => setHoursModalOpen(false)}
        onSave={setOperatingHours}
      />
    </div>
  );
}
