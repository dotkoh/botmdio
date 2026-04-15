"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Workflow, WorkflowStatus, categoryLabels } from "@/data/workflow-types";
import { X, MoreVertical, Clock } from "lucide-react";

const statusStyles: Record<WorkflowStatus, string> = {
  active: "text-green-600 bg-green-50",
  paused: "text-amber-600 bg-amber-50",
  draft: "text-gray-500 bg-gray-100",
  archived: "text-gray-400 bg-gray-50",
};

const channelIcons: Record<string, string> = {
  whatsapp: "/channels/whatsapp.svg",
  messenger: "/channels/messenger.svg",
  instagram: "/channels/instagram.svg",
  viber: "/channels/viber.svg",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface WorkflowDetailPanelProps {
  workflow: Workflow | null;
  onClose: () => void;
}

export default function WorkflowDetailPanel({ workflow, onClose }: WorkflowDetailPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reset menu when workflow changes (panel opens/closes)
  useEffect(() => {
    setMenuOpen(false);
  }, [workflow]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    if (workflow) {
      document.addEventListener("mousedown", handleClick);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("mousedown", handleClick); document.body.style.overflow = ""; };
  }, [workflow, onClose]);

  if (!workflow) return null;

  const fields = [
    { label: "Category", value: categoryLabels[workflow.category] },
    { label: "Workflow Type", value: workflow.workflow_type },
    { label: "Applies to", value: workflow.applies_to },
    { label: "When to send", value: workflow.when_to_send },
    { label: "Channel", value: workflow.channel.charAt(0).toUpperCase() + workflow.channel.slice(1) },
    { label: "Account", value: workflow.account },
    { label: "Attached Template", value: workflow.attached_template },
    { label: "Created by", value: workflow.created_by },
    { label: "Created", value: formatDate(workflow.created_at) },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div ref={ref} className="absolute right-0 top-0 h-full w-[480px] max-w-[90vw] bg-white shadow-xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#111824]">{workflow.name}</h2>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={18} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30 min-w-[160px]">
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Edit Workflow
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Duplicate
                  </button>
                  <button onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    Delete Workflow
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Status */}
          <div className="px-6 py-4 border-b border-gray-100">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[workflow.status]}`}>
              {workflow.status}
            </span>
          </div>

          {/* Fields */}
          <div className="px-6 py-5 space-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <div className="text-xs text-gray-400 mb-0.5">{f.label}</div>
                <div className="text-sm font-medium text-[#111824]">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Audit Log */}
          <div className="px-6 py-5 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-[#111824] mb-4">Audit Log</h3>
            <div className="space-y-3">
              {workflow.audit_log.map((entry, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#111824]">{entry.action}</div>
                    <div className="text-xs text-gray-400">
                      {entry.user} &middot; {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
