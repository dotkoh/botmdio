"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  mockAgents,
  availableChannels,
  availableKnowledgeBaseSets,
  availableRecommendations,
  availableHandoverTeams,
  availableConsentTemplates,
  defaultHandoverRules,
  instructionExamples,
  type HandoverRule,
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
import { ChevronLeft, ChevronDown, ChevronUp, Copy, FileText, Plus, Trash2 } from "lucide-react";

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

const handoverTriggers = [
  { value: "emergency", label: "Emergency keywords detected" },
  { value: "keyword", label: "Specific keyword mentioned" },
  { value: "sentiment", label: "Patient expresses frustration" },
  { value: "after_turns", label: "After N conversation turns" },
  { value: "no_kb_match", label: "No matching knowledge base answer" },
  { value: "custom", label: "Custom condition" },
];

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

  // Handover Rules
  const [handoverRules, setHandoverRules] = useState<HandoverRule[]>(defaultHandoverRules);

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

  const selectedChannel = channelIdx !== null ? availableChannels[channelIdx] : null;
  const selectedMessageTemplate = availableConsentTemplates.find((t) => t.id === messageTemplateId);

  // Build KB picker items
  const kbItems: LibraryPickerItem[] = availableKnowledgeBaseSets.map((kb) => ({
    id: kb.id,
    name: kb.name,
    subtitle: `${kb.sources_count} source${kb.sources_count !== 1 ? "s" : ""} · ${kb.qa_count} Q&A · used by ${kb.used_by_agents.length} ${kb.used_by_agents.length === 1 ? "agent" : "agents"}`,
    description: kb.description,
  }));

  // Build Scheduling rule picker items
  const ruleItems: LibraryPickerItem[] = mockRules.map((rule) => {
    const hasNoAppointmentTypes = rule.appointment_types.length === 0;
    return {
      id: rule.id,
      name: rule.name,
      subtitle: `Calendar: ${rule.calendar_name} · ${rule.booking_method === "direct" ? "Direct booking" : rule.booking_method === "request" ? "Request + approval" : "Link"} · ${rule.fields_collected_count} fields`,
      badge: hasNoAppointmentTypes ? { label: "⚠ not bookable", tone: "warning" as const } : undefined,
    };
  });

  // Build Recommendations picker items
  const recItems: LibraryPickerItem[] = availableRecommendations.map((rec) => ({
    id: rec.id,
    name: rec.name,
    subtitle: `Collects: ${rec.collects.join(", ")}`,
    description: `Recommends: ${rec.recommends.join(" / ")}${rec.used_by_agents.length > 0 ? ` · used by ${rec.used_by_agents.length} other agent${rec.used_by_agents.length !== 1 ? "s" : ""}` : ""}`,
  }));

  // Consent preview
  const consentPreview = useMemo(() => {
    if (consentMode === "free_text") {
      return freeTextConsent
        .replace(/\{agentName\}/g, displayName || "[Agent Name]")
        .replace(/\{hospitalName\}/g, "Mary Mediatrix Medical Center");
    }
    const tpl = availableConsentTemplates.find((t) => t.id === messageTemplateId);
    return tpl
      ? tpl.preview
          .replace(/\{agentName\}/g, displayName || "[Agent Name]")
          .replace(/\{hospitalName\}/g, "Mary Mediatrix Medical Center")
      : "";
  }, [consentMode, freeTextConsent, messageTemplateId, displayName]);

  const charCount = customInstructions.length;
  const maxChars = 500;

  // Handover rule management
  function addHandoverRule() {
    setHandoverRules((prev) => [
      ...prev,
      {
        id: `hr_${Date.now()}`,
        trigger: "keyword",
        trigger_value: "",
        destination: availableHandoverTeams[0],
      },
    ]);
  }

  function updateHandoverRule(id: string, patch: Partial<HandoverRule>) {
    setHandoverRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeHandoverRule(id: string) {
    setHandoverRules((prev) => prev.filter((r) => r.id !== id));
  }

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
                startFrom === "blank"
                  ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                  : "border-gray-200 hover:border-gray-300"
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
                startFrom === "clone"
                  ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                  : "border-gray-200 hover:border-gray-300"
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

            {/* Channel dropdown selector */}
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

            {/* Channel summary card */}
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
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={2} />
            <h3 className="text-base font-semibold text-[#111824]">Persona</h3>
          </div>
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
              <label className="text-sm font-medium text-gray-500 mb-1 block">Voice tone</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(voiceToneLabels) as VoiceTone[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setVoiceTone(tone)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      voiceTone === tone
                        ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                        : "border-gray-200 hover:border-gray-300"
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
                options={availableLanguages.map((l) => ({ value: l.code, label: l.label }))}
                selected={languages}
                onChange={setLanguages}
                placeholder="Select languages..."
              />
              <p className="text-xs text-gray-400 mt-2">Languages the agent may respond in. We detect the patient&apos;s language automatically.</p>
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
            <p className="text-sm text-gray-500 mb-4">Subscribe this agent to one or more knowledge base sets. The agent will use these to answer patient questions.</p>
            <LibraryPicker
              items={kbItems}
              selectedIds={kbSets}
              onToggle={(id) => toggleSet(kbSets, setKbSets, id)}
              searchPlaceholder="Search knowledge base sets..."
              itemLabel="sets"
              createLabel="Create new set"
              createHref="/knowledge-base"
              manageHref="/knowledge-base"
              manageLabel="Manage Knowledge Base sets"
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
            <p className="text-sm text-gray-500 mb-4">Subscribe to scheduling rules. Each rule comes with its calendar.</p>
            <LibraryPicker
              items={ruleItems}
              selectedIds={enabledRules}
              onToggle={(id) => toggleSet(enabledRules, setEnabledRules, id)}
              searchPlaceholder="Search scheduling rules..."
              itemLabel="rules"
              createLabel="Create new rule"
              createHref="/rules"
              manageHref="/rules"
              manageLabel="Manage Scheduling Rules"
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
            <p className="text-sm text-gray-500 mb-4">Flows the agent can proactively suggest to patients.</p>
            <LibraryPicker
              items={recItems}
              selectedIds={enabledRecs}
              onToggle={(id) => toggleSet(enabledRecs, setEnabledRecs, id)}
              searchPlaceholder="Search recommendation flows..."
              itemLabel="flows"
              createLabel="Create recommendation flow"
              createHref="/recommendations"
              manageHref="/recommendations"
              manageLabel="Manage Recommendations"
            />
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 6: Handover Rules */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={6} />
            <h3 className="text-base font-semibold text-[#111824]">Handover Rules</h3>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-4">
              Define when the AI should hand over the conversation to a human team member.
            </p>

            <div className="space-y-3">
              {handoverRules.map((rule, idx) => (
                <div key={rule.id} className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rule {idx + 1}</span>
                    <button
                      onClick={() => removeHandoverRule(rule.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-[#2D1818] rounded-md transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-[90px_1fr] gap-3 items-center">
                    <span className="text-xs font-medium text-gray-500">When</span>
                    <select
                      value={rule.trigger}
                      onChange={(e) => updateHandoverRule(rule.id, { trigger: e.target.value as HandoverRule["trigger"] })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                    >
                      {handoverTriggers.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>

                    {(rule.trigger === "keyword" || rule.trigger === "after_turns" || rule.trigger === "custom") && (
                      <>
                        <span className="text-xs font-medium text-gray-500">
                          {rule.trigger === "keyword" ? "Keywords" : rule.trigger === "after_turns" ? "After N turns" : "Condition"}
                        </span>
                        <input
                          type={rule.trigger === "after_turns" ? "number" : "text"}
                          value={rule.trigger_value}
                          onChange={(e) => updateHandoverRule(rule.id, { trigger_value: e.target.value })}
                          placeholder={
                            rule.trigger === "keyword"
                              ? '"speak to human", "talk to staff"'
                              : rule.trigger === "after_turns"
                              ? "e.g., 5"
                              : "Describe the condition"
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                        />
                      </>
                    )}

                    <span className="text-xs font-medium text-gray-500">Hand off to</span>
                    <select
                      value={rule.destination}
                      onChange={(e) => updateHandoverRule(rule.id, { destination: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                    >
                      {availableHandoverTeams.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {handoverRules.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 dark:border-[#263248] rounded-lg">
                  No handover rules yet. Add one to let the AI hand off conversations when needed.
                </div>
              )}

              <button
                onClick={addHandoverRule}
                className="flex items-center gap-1.5 text-sm font-medium text-[#4361EE] hover:text-[#3651DE] transition-colors"
              >
                <Plus size={14} />
                Add handover rule
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 7: Behavior (advanced, collapsible) */}
        <div className="py-8">
          <button
            onClick={() => setBehaviorOpen(!behaviorOpen)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <SectionNumber num={7} />
              <h3 className="text-base font-semibold text-[#111824]">Behavior (advanced)</h3>
            </div>
            <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              {behaviorOpen ? "Hide" : "Show"}
              {behaviorOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {behaviorOpen && (
            <div className="ml-10 mt-6 space-y-6">
              {/* Model Tier */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">AI Model tier</label>
                <div className="space-y-2">
                  {(Object.keys(modelTierLabels) as ModelTier[]).map((tier) => (
                    <label key={tier} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors">
                      <input
                        type="radio"
                        name="modelTier"
                        checked={modelTier === tier}
                        onChange={() => setModelTier(tier)}
                      />
                      <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{modelTierLabels[tier]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-1 block">Custom instructions</label>
                <p className="text-xs text-gray-500 mb-3">
                  Additional AI agent prompts appended to default prompts. Does not override safety rules (emergency handling, medical advice, handover rules). Max 500 characters.
                </p>
                <div className="relative">
                  <textarea
                    value={customInstructions}
                    onChange={(e) => {
                      if (e.target.value.length <= maxChars) setCustomInstructions(e.target.value);
                    }}
                    rows={5}
                    placeholder="e.g., Always remind patients over 50 about our annual wellness package discount."
                    className="w-full px-4 py-3 pb-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
                  />
                  <span className={`absolute right-3 bottom-3 text-xs tabular-nums ${
                    charCount > maxChars * 0.9 ? "text-amber-600" : "text-gray-400"
                  }`}>
                    {charCount}/{maxChars}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Examples other hospitals use:</div>
                  <ul className="space-y-1">
                    {instructionExamples.map((ex, i) => (
                      <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                        <span className="text-gray-400 shrink-0">▸</span>
                        <button
                          onClick={() => charCount + ex.length <= maxChars && setCustomInstructions(customInstructions ? `${customInstructions} ${ex}` : ex)}
                          className="text-left hover:text-[#4361EE] transition-colors"
                        >
                          &ldquo;{ex}&rdquo;
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
