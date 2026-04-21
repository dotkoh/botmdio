"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockAgents, availableCalendars, availableKnowledgeBaseSets, availableRecommendations } from "@/data/ai-agent-mock-data";
import { mockRules } from "@/data/rule-mock-data";
import {
  AgentStatus,
  voiceToneLabels,
  consentTemplateLabels,
  availableLanguages,
} from "@/data/ai-agent-types";
import {
  ChevronLeft,
  Bot,
  User,
  BookOpen,
  CalendarDays,
  Sparkles,
  Settings2,
  MessageCircle,
  Send,
  Check,
} from "lucide-react";

const statusStyles: Record<AgentStatus, { dot: string; text: string; label: string }> = {
  active: { dot: "bg-green-500", text: "text-green-600 dark:text-green-400", label: "Active" },
  paused: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", label: "Paused" },
  draft: { dot: "bg-gray-400", text: "text-gray-500 dark:text-gray-400", label: "Draft" },
};

const channelIcons: Record<string, string> = {
  whatsapp: "/channels/whatsapp.svg",
  messenger: "/channels/messenger.svg",
  instagram: "/channels/instagram.svg",
};

type TabKey = "overview" | "persona" | "knowledge" | "scheduling" | "recommendations" | "behavior" | "playground";

const tabs: { key: TabKey; label: string; icon: typeof User }[] = [
  { key: "overview", label: "Overview", icon: Bot },
  { key: "persona", label: "Persona", icon: User },
  { key: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { key: "scheduling", label: "Scheduling", icon: CalendarDays },
  { key: "recommendations", label: "Recommendations", icon: Sparkles },
  { key: "behavior", label: "Behavior", icon: Settings2 },
  { key: "playground", label: "Playground", icon: MessageCircle },
];

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = mockAgents.find((a) => a.id === id);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [testMessage, setTestMessage] = useState("");
  const [testChat, setTestChat] = useState<{ role: "user" | "agent"; text: string }[]>([
    { role: "agent", text: agent ? `Hi! I'm ${agent.persona_name}. How can I help you today?` : "Hello!" },
  ]);

  if (!agent) {
    return (
      <div>
        <Link href="/ai-agents" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Agent not found</h1>
      </div>
    );
  }

  const statusStyle = statusStyles[agent.status];
  const channelIcon = channelIcons[agent.channel.type];

  function sendTest() {
    if (!testMessage.trim()) return;
    setTestChat([...testChat, { role: "user", text: testMessage }]);
    setTestMessage("");
    // Simulate response
    setTimeout(() => {
      setTestChat((prev) => [...prev, { role: "agent", text: "Thanks for your message! In a real deployment, I would respond based on my knowledge base and instructions." }]);
    }, 800);
  }

  return (
    <div className="pb-16">
      <Link href="/ai-agents" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 dark:bg-[#151E3A] rounded-xl flex items-center justify-center shrink-0">
            <Bot size={28} className="text-[#4361EE] dark:text-[#7DA2FF]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">{agent.name}</h1>
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusStyle.text}`}>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                {statusStyle.label}
              </span>
            </div>
            <p className="text-[15px] text-gray-500">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            {agent.status === "active" ? "Pause" : "Activate"}
          </button>
          <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-[#263248] mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-[#4361EE] text-[#4361EE] dark:text-[#7DA2FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-[#C7CFDB]"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="max-w-4xl">
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  {channelIcon && <Image src={channelIcon} alt="" width={14} height={14} className="w-3.5 h-3.5 rounded" />}
                  Channel
                </div>
                <div className="text-sm font-semibold text-[#111824]">{agent.channel.label}</div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">{agent.channel.identifier}</div>
              </div>
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-2">Persona</div>
                <div className="text-sm font-semibold text-[#111824]">{agent.persona_name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{voiceToneLabels[agent.voice_tone]} · {agent.languages.length} language{agent.languages.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="text-xs text-gray-400 mb-2">Today</div>
                <div className="text-2xl font-semibold text-[#111824]">{agent.conversations_today}</div>
                <div className="text-xs text-gray-500 mt-0.5">conversations</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <BookOpen size={12} /> Knowledge Base
                </div>
                <div className="text-sm font-semibold text-[#111824] mb-1">{agent.knowledge_base_sets.length} set{agent.knowledge_base_sets.length !== 1 ? "s" : ""}</div>
                <div className="text-xs text-gray-500">
                  {agent.knowledge_base_sets.map((kb) => kb.name).join(", ") || "No sets subscribed"}
                </div>
              </div>
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <CalendarDays size={12} /> Scheduling
                </div>
                <div className="text-sm font-semibold text-[#111824] mb-1">{agent.scheduling_rules.length} rule{agent.scheduling_rules.length !== 1 ? "s" : ""}</div>
                <div className="text-xs text-gray-500">{agent.scheduling_calendars.length} calendar{agent.scheduling_calendars.length !== 1 ? "s" : ""} enabled</div>
              </div>
              <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Sparkles size={12} /> Recommendations
                </div>
                <div className="text-sm font-semibold text-[#111824] mb-1">{agent.recommendations.length} active</div>
                <div className="text-xs text-gray-500">
                  {agent.recommendations.map((r) => r.name).join(", ") || "None enabled"}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "persona" && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Persona name</label>
              <input
                type="text"
                defaultValue={agent.persona_name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Voice tone</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(voiceToneLabels).map(([key, label]) => (
                  <button
                    key={key}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      agent.voice_tone === key
                        ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-medium text-[#111824]">{label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Languages</label>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map((lang) => {
                  const selected = agent.languages.includes(lang.code);
                  return (
                    <span
                      key={lang.code}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selected
                          ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF]"
                          : "border-gray-200 dark:border-[#263248] text-gray-400"
                      }`}
                    >
                      {selected && <Check size={12} className="inline mr-1" />}
                      {lang.label}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Consent template</label>
              <div className="text-sm text-[#111824] px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 dark:bg-[#182234]">
                {consentTemplateLabels[agent.consent_template]}
              </div>
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Subscribed knowledge base sets. The agent uses these to answer patient questions.</p>
            <div className="space-y-2">
              {availableKnowledgeBaseSets.map((kb) => {
                const subscribed = agent.knowledge_base_sets.some((s) => s.id === kb.id);
                return (
                  <div
                    key={kb.id}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${
                      subscribed
                        ? "border-[#4361EE] bg-blue-50/50 dark:bg-[#151E3A]"
                        : "border-gray-200 dark:border-[#263248] opacity-50"
                    }`}
                  >
                    <BookOpen size={16} className={subscribed ? "text-[#4361EE]" : "text-gray-400"} />
                    <span className="text-sm text-[#111824] dark:text-[#F5F7FB] flex-1">{kb.name}</span>
                    {subscribed && <span className="text-xs text-[#4361EE] font-medium">Subscribed</span>}
                  </div>
                );
              })}
            </div>
            <Link href="/knowledge-base" className="text-sm text-blue-600 hover:underline inline-block mt-2">Manage Knowledge Base →</Link>
          </div>
        )}

        {activeTab === "scheduling" && (
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-[#111824] mb-2">Enabled calendars</h4>
              <div className="flex flex-wrap gap-2">
                {availableCalendars.map((cal) => {
                  const enabled = agent.scheduling_calendars.includes(cal);
                  return (
                    <span
                      key={cal}
                      className={`px-3 py-1.5 text-sm rounded-full border ${
                        enabled
                          ? "border-[#4361EE] bg-blue-50 dark:bg-[#151E3A] text-[#4361EE] dark:text-[#7DA2FF]"
                          : "border-gray-200 dark:border-[#263248] text-gray-400"
                      }`}
                    >
                      {enabled && <Check size={12} className="inline mr-1" />}
                      {cal}
                    </span>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#111824] mb-2">Subscribed scheduling rules</h4>
              <div className="space-y-2">
                {mockRules.map((rule) => {
                  const subscribed = agent.scheduling_rules.some((r) => r.id === rule.id);
                  return (
                    <div
                      key={rule.id}
                      className={`flex items-center justify-between px-4 py-3 border rounded-lg ${
                        subscribed
                          ? "border-[#4361EE] bg-blue-50/50 dark:bg-[#151E3A]"
                          : "border-gray-200 dark:border-[#263248] opacity-50"
                      }`}
                    >
                      <div>
                        <div className="text-sm text-[#111824] dark:text-[#F5F7FB]">{rule.name}</div>
                        <div className="text-xs text-gray-400">{rule.calendar_name}</div>
                      </div>
                      {subscribed && <span className="text-xs text-[#4361EE] font-medium">Subscribed</span>}
                    </div>
                  );
                })}
              </div>
              <Link href="/rules" className="text-sm text-blue-600 hover:underline inline-block mt-2">Manage Rules →</Link>
            </div>
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Recommendation flows this agent can proactively suggest.</p>
            <div className="space-y-2">
              {availableRecommendations.map((rec) => {
                const enabled = agent.recommendations.some((r) => r.id === rec.id);
                return (
                  <div
                    key={rec.id}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${
                      enabled
                        ? "border-[#4361EE] bg-blue-50/50 dark:bg-[#151E3A]"
                        : "border-gray-200 dark:border-[#263248] opacity-50"
                    }`}
                  >
                    <Sparkles size={16} className={enabled ? "text-[#4361EE]" : "text-gray-400"} />
                    <span className="text-sm text-[#111824] dark:text-[#F5F7FB] flex-1">{rec.name}</span>
                    {enabled && <span className="text-xs text-[#4361EE] font-medium">Active</span>}
                  </div>
                );
              })}
            </div>
            <Link href="/recommendations" className="text-sm text-blue-600 hover:underline inline-block mt-2">Manage Recommendations →</Link>
          </div>
        )}

        {activeTab === "behavior" && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-500 mb-1 block">Custom instructions</label>
              <p className="text-xs text-gray-400 mb-3">Additional instructions that shape how this agent behaves.</p>
              <textarea
                defaultValue={agent.custom_instructions}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "playground" && (
          <div className="max-w-xl">
            <p className="text-sm text-gray-500 mb-4">Test your agent in a sandbox environment. Messages here don&apos;t count toward real usage.</p>
            <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl overflow-hidden">
              {/* Chat window */}
              <div className="p-4 space-y-3 h-80 overflow-y-auto bg-gray-50 dark:bg-[#0D1320]">
                {testChat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-[#4361EE] text-white"
                        : "bg-white dark:bg-[#182234] text-[#111824] dark:text-[#F5F7FB] border border-gray-200 dark:border-[#263248]"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="flex items-center gap-2 p-3 border-t border-gray-200 dark:border-[#263248]">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendTest(); }}
                  placeholder="Type a test message..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-[#263248] rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                />
                <button
                  onClick={sendTest}
                  disabled={!testMessage.trim()}
                  className="w-9 h-9 bg-[#4361EE] hover:bg-[#3651DE] text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
