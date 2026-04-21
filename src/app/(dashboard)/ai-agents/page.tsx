"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockAgents } from "@/data/ai-agent-mock-data";
import { AgentStatus } from "@/data/ai-agent-types";
import Dropdown from "@/components/ui/Dropdown";
import { Search, X, Plus, Bot, MessageSquare, BookOpen, ListChecks, Sparkles } from "lucide-react";

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

export default function AIAgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return mockAgents.filter((a) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">AI Agents</h1>
          <p className="text-[16px] text-gray-500 mt-2">
            Configure and manage AI agents that interact with your patients across channels
          </p>
        </div>
        <Link href="/ai-agents/create" className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
          <Plus size={16} /> Create Agent
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mt-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mt-4 mb-5">
        <div className="flex items-center gap-3">
          <Dropdown
            label="Status"
            value={statusFilter}
            options={[
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Paused", value: "paused" },
            ]}
            onChange={setStatusFilter}
          />
          {statusFilter && (
            <button onClick={() => setStatusFilter(null)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Clear All</button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {filtered.length} of {mockAgents.length} agents
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
        {filtered.map((agent) => {
          const statusStyle = statusStyles[agent.status];
          const channelIcon = channelIcons[agent.channel.type];
          return (
            <Link
              key={agent.id}
              href={`/ai-agents/${agent.id}`}
              className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] p-5 hover:border-[#4361EE] dark:hover:border-[#4361EE] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-[#151E3A] rounded-lg flex items-center justify-center shrink-0">
                  <Bot size={20} className="text-[#4361EE] dark:text-[#7DA2FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#111824] truncate">{agent.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {statusStyle.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{agent.description}</p>
                </div>
              </div>

              {/* Channel */}
              <div className="flex items-center gap-2 mb-3 text-sm">
                {channelIcon ? (
                  <Image src={channelIcon} alt="" width={20} height={20} className="w-5 h-5 rounded" />
                ) : (
                  <MessageSquare size={16} className="text-gray-400" />
                )}
                <span className="text-[#111824] dark:text-[#C7CFDB]">{agent.channel.label}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-600 dark:text-[#8E99AB] font-mono text-xs">{agent.channel.identifier}</span>
              </div>

              {/* Stats / Sandbox */}
              <div className="mb-4 text-sm">
                {agent.status === "active" ? (
                  <div className="text-gray-600 dark:text-[#8E99AB]">
                    <span className="font-semibold text-[#111824] dark:text-[#F5F7FB]">{agent.conversations_today}</span> convos today
                  </div>
                ) : agent.status === "draft" && agent.sandbox_code ? (
                  <div className="text-gray-600 dark:text-[#8E99AB]">
                    sandbox: <span className="font-mono text-[#4361EE] dark:text-[#7DA2FF]">{agent.sandbox_code}</span>
                  </div>
                ) : (
                  <div className="text-gray-400">—</div>
                )}
              </div>

              {/* Subscriptions */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-[#1D2638] text-xs text-gray-500 dark:text-[#8E99AB]">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={12} />
                  <span>KB: <strong className="text-[#111824] dark:text-[#F5F7FB]">{agent.knowledge_base_sets.length}</strong> set{agent.knowledge_base_sets.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ListChecks size={12} />
                  <span>Rules: <strong className="text-[#111824] dark:text-[#F5F7FB]">{agent.scheduling_rules.length}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} />
                  <span>Recs: <strong className="text-[#111824] dark:text-[#F5F7FB]">{agent.recommendations.length}</strong></span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && mockAgents.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-sm text-gray-400 max-w-5xl">
          No agents match your filters
        </div>
      )}
    </div>
  );
}
