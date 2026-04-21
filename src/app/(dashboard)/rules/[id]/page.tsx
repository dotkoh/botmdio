"use client";

import { use } from "react";
import Link from "next/link";
import { mockRules } from "@/data/rule-mock-data";
import { bookingMethodLabels, statusLabels } from "@/data/rule-types";
import { ChevronLeft, Bot } from "lucide-react";

export default function RuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const rule = mockRules.find((r) => r.id === id);

  if (!rule) {
    return (
      <div>
        <Link href="/rules" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Rule not found</h1>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Link href="/rules" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">{rule.name}</h1>
          <p className="text-[16px] text-gray-500 mt-2">{rule.description}</p>
        </div>
        <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 max-w-4xl">
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Calendar</div>
          <div className="text-sm font-medium text-[#111824]">{rule.calendar_name}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Booking method</div>
          <div className="text-sm font-medium text-[#111824]">{bookingMethodLabels[rule.booking_method]}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className="text-sm font-medium text-[#111824]">{statusLabels[rule.status]}</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          <div className="text-xs text-gray-400 mb-1">Used by</div>
          <div className="text-sm font-medium text-[#111824]">{rule.used_by.length} agent{rule.used_by.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Placeholder detail sections */}
      <div className="max-w-4xl space-y-4">
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111824] mb-1">Data collection</h3>
          <p className="text-sm text-gray-500 mb-3">Configure the fields the AI agent collects during booking.</p>
          <div className="text-sm text-gray-700 dark:text-[#C7CFDB]">{rule.fields_collected_count} fields configured</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111824] mb-1">Handover conditions</h3>
          <p className="text-sm text-gray-500 mb-3">When should the AI hand off to a human staff member?</p>
          <div className="text-sm text-gray-700 dark:text-[#C7CFDB]">{rule.handover_rules_count} handover rules</div>
        </div>
        <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#111824] mb-3">Used by agents</h3>
          {rule.used_by.length === 0 ? (
            <p className="text-sm text-gray-400">Not subscribed by any agents yet.</p>
          ) : (
            <div className="space-y-2">
              {rule.used_by.map((agent) => (
                <Link key={agent.id} href="/ai-agents" className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#C7CFDB] hover:text-[#4361EE] dark:hover:text-[#7DA2FF] transition-colors">
                  <Bot size={14} className="text-[#4361EE]" />
                  {agent.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 pt-2">
          Detailed rule builder (fields, handover conditions, alerts) — Coming soon
        </div>
      </div>
    </div>
  );
}
