"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  availableChannels,
  availableKnowledgeBaseSets,
  availableCalendars,
  availableRecommendations,
} from "@/data/ai-agent-mock-data";
import { mockRules } from "@/data/rule-mock-data";
import {
  VoiceTone,
  ConsentTemplate,
  voiceToneLabels,
  consentTemplateLabels,
  availableLanguages,
} from "@/data/ai-agent-types";
import { ChevronLeft, Bot, Check } from "lucide-react";

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

export default function CreateAgentPage() {
  // Details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channelIdx, setChannelIdx] = useState<number>(0);

  // Persona
  const [personaName, setPersonaName] = useState("Mira");
  const [voiceTone, setVoiceTone] = useState<VoiceTone>("warm_friendly");
  const [languages, setLanguages] = useState<string[]>(["en"]);
  const [consentTemplate, setConsentTemplate] = useState<ConsentTemplate>("warm_friendly");

  // Knowledge
  const [kbSets, setKbSets] = useState<Set<string>>(new Set());

  // Scheduling
  const [enabledCalendars, setEnabledCalendars] = useState<Set<string>>(new Set());
  const [enabledRules, setEnabledRules] = useState<Set<string>>(new Set());

  // Recommendations
  const [enabledRecs, setEnabledRecs] = useState<Set<string>>(new Set());

  // Behavior
  const [customInstructions, setCustomInstructions] = useState("");

  function toggleSet(set: Set<string>, setSet: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setSet(next);
  }

  function toggleLanguage(code: string) {
    if (languages.includes(code)) {
      setLanguages(languages.filter((l) => l !== code));
    } else {
      setLanguages([...languages, code]);
    }
  }

  const selectedChannel = availableChannels[channelIdx];

  return (
    <div className="pb-16">
      <Link href="/ai-agents" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Create AI Agent</h1>
          <p className="text-[16px] text-gray-500 mt-2">Configure a new AI agent to handle patient conversations</p>
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
        {/* Section 1: Details */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={1} />
            <h3 className="text-base font-semibold text-[#111824]">Details</h3>
          </div>
          <div className="ml-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Agent Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Patient Bot"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Description</label>
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
              <select
                value={channelIdx}
                onChange={(e) => setChannelIdx(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                {availableChannels.map((ch, i) => (
                  <option key={i} value={i}>
                    {ch.label} — {ch.identifier}
                  </option>
                ))}
              </select>
              {selectedChannel && channelIcons[selectedChannel.type] && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <Image src={channelIcons[selectedChannel.type]} alt="" width={16} height={16} className="w-4 h-4 rounded" />
                  Connected via {selectedChannel.label}
                </div>
              )}
            </div>
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
              <label className="text-sm font-medium text-gray-500 mb-1 block">Persona name</label>
              <input
                type="text"
                value={personaName}
                onChange={(e) => setPersonaName(e.target.value)}
                placeholder="e.g., Mira"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">How the agent introduces itself to patients</p>
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
              <label className="text-sm font-medium text-gray-500 mb-1 block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((lang) => {
                  const selected = languages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF]"
                          : "border-gray-200 dark:border-[#263248] text-gray-600 dark:text-[#C7CFDB] hover:border-gray-300"
                      }`}
                    >
                      {selected && <Check size={12} className="inline mr-1" />}
                      {lang.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-2">Select all languages the agent should speak</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Consent template</label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(consentTemplateLabels) as ConsentTemplate[]).map((tpl) => (
                  <button
                    key={tpl}
                    onClick={() => setConsentTemplate(tpl)}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      consentTemplate === tpl
                        ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium text-[#111824]">{consentTemplateLabels[tpl]}</div>
                  </button>
                ))}
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
          <div className="ml-10 space-y-3">
            <p className="text-sm text-gray-500">Subscribe this agent to one or more knowledge base sets. The agent will use these to answer patient questions.</p>
            <div className="space-y-2">
              {availableKnowledgeBaseSets.map((kb) => (
                <label
                  key={kb.id}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={kbSets.has(kb.id)}
                    onChange={() => toggleSet(kbSets, setKbSets, kb.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                  />
                  <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{kb.name}</span>
                </label>
              ))}
            </div>
            <Link href="/knowledge-base" className="text-sm text-blue-600 hover:underline inline-block mt-1">
              Manage Knowledge Base sets →
            </Link>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 4: Scheduling */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={4} />
            <h3 className="text-base font-semibold text-[#111824]">Scheduling</h3>
          </div>
          <div className="ml-10 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Enabled calendars</label>
              <div className="flex flex-wrap gap-2">
                {availableCalendars.map((cal) => {
                  const selected = enabledCalendars.has(cal);
                  return (
                    <button
                      key={cal}
                      onClick={() => toggleSet(enabledCalendars, setEnabledCalendars, cal)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF]"
                          : "border-gray-200 dark:border-[#263248] text-gray-600 dark:text-[#C7CFDB] hover:border-gray-300"
                      }`}
                    >
                      {selected && <Check size={12} className="inline mr-1" />}
                      {cal}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Scheduling rules</label>
              <div className="space-y-2">
                {mockRules.map((rule) => (
                  <label
                    key={rule.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={enabledRules.has(rule.id)}
                        onChange={() => toggleSet(enabledRules, setEnabledRules, rule.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                      />
                      <div>
                        <div className="text-sm text-[#111824] dark:text-[#F5F7FB]">{rule.name}</div>
                        <div className="text-xs text-gray-400">{rule.calendar_name}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <Link href="/rules" className="text-sm text-blue-600 hover:underline inline-block mt-2">
                Manage Scheduling Rules →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 5: Recommendations */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={5} />
            <h3 className="text-base font-semibold text-[#111824]">Recommendations</h3>
          </div>
          <div className="ml-10 space-y-3">
            <p className="text-sm text-gray-500">Enable recommendation flows that the agent can proactively suggest to patients.</p>
            <div className="space-y-2">
              {availableRecommendations.map((rec) => (
                <label
                  key={rec.id}
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-[#263248] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={enabledRecs.has(rec.id)}
                    onChange={() => toggleSet(enabledRecs, setEnabledRecs, rec.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#4361EE]"
                  />
                  <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">{rec.name}</span>
                </label>
              ))}
            </div>
            <Link href="/recommendations" className="text-sm text-blue-600 hover:underline inline-block mt-1">
              Manage Recommendations →
            </Link>
          </div>
        </div>

        <div className="border-b border-gray-200" />

        {/* Section 6: Custom Instructions */}
        <div className="py-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionNumber num={6} />
            <h3 className="text-base font-semibold text-[#111824]">Custom Instructions</h3>
          </div>
          <div className="ml-10">
            <p className="text-sm text-gray-500 mb-3">Add additional instructions to shape how this agent behaves. These are added to the system prompt.</p>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={5}
              placeholder="e.g., Always remind patients over 50 about our annual wellness package discount."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
