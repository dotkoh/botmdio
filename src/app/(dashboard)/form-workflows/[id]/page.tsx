"use client";

import { use } from "react";
import Link from "next/link";
import {
  mockFormWorkflows,
  formWorkflowStatusLabels,
  formWorkflowStatusStyles,
  formatStepLong,
  channelLabels,
} from "@/data/form-workflow-data";
import { mockIntegratedForms } from "@/data/form-provider-data";
import {
  ChevronLeft,
  Users,
  Send,
  CheckCircle2,
  ListChecks,
  ArrowRight,
  MessageCircle,
  Smartphone,
  Mail,
  Pause,
  Play,
  Pencil,
  Trash2,
} from "lucide-react";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const channelIcons = {
  whatsapp: MessageCircle,
  sms: Smartphone,
  email: Mail,
};

export default function FormWorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const workflow = mockFormWorkflows.find((w) => w.id === id);

  if (!workflow) {
    return (
      <div>
        <Link href="/form-workflows" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back to Workflows
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Workflow not found</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          The workflow you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const statusStyle = formWorkflowStatusStyles[workflow.status];
  const responseRate =
    workflow.enrolled_count === 0
      ? 0
      : Math.round((workflow.completed_count / Math.max(workflow.enrolled_count, 1)) * 1000) / 10;

  return (
    <div className="pb-16">
      <Link href="/form-workflows" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back to Workflows
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824] truncate">{workflow.name}</h1>
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {formWorkflowStatusLabels[workflow.status]}
            </span>
          </div>
          <p className="text-[16px] text-gray-500">{workflow.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            Created {formatDate(workflow.created_at)} by <span className="text-gray-500">{workflow.created_by}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
            {workflow.status === "active" ? <Pause size={14} /> : <Play size={14} />}
            {workflow.status === "active" ? "Pause" : "Activate"}
          </button>
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
            <Pencil size={14} /> Edit
          </button>
          <button className="bg-white border border-gray-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-4xl">
        <StatCard icon={<Users size={18} className="text-blue-600" />} label="Enrolled patients" value={workflow.enrolled_count.toLocaleString()} />
        <StatCard icon={<Send size={18} className="text-violet-600" />} label="Pending sends" value={workflow.pending_sends_count.toLocaleString()} />
        <StatCard icon={<CheckCircle2 size={18} className="text-green-600" />} label="Completed surveys" value={workflow.completed_count.toLocaleString()} />
        <StatCard icon={<ListChecks size={18} className="text-amber-600" />} label="Response rate" value={`${responseRate}%`} />
      </div>

      <div className="max-w-3xl space-y-10">
        {/* Audience */}
        <section>
          <h2 className="text-base font-semibold text-[#111824] mb-3">Who this workflow applies to</h2>
          <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-[#151E3A] rounded-lg flex items-center justify-center shrink-0">
                <Users size={18} className="text-[#4361EE]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{workflow.audience_description}</div>
                <div className="text-xs text-gray-500 mt-1 tabular-nums">
                  {workflow.audience_size.toLocaleString()} {workflow.audience_size === 1 ? "patient" : "patients"} currently match
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reminder timeline */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#111824]">Reminder timeline</h2>
            <span className="text-xs text-gray-400">
              {workflow.steps.length} {workflow.steps.length === 1 ? "step" : "steps"}
            </span>
          </div>

          <div className="space-y-3">
            {workflow.steps.map((step, idx) => {
              const form = mockIntegratedForms.find((f) => f.id === step.form_id);
              const ChannelIcon = channelIcons[step.channel];
              return (
                <div
                  key={step.id}
                  className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-5 flex items-center gap-4"
                >
                  <div className="w-9 h-9 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center shrink-0 text-sm font-semibold text-[#4361EE] tabular-nums">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">
                      {formatStepLong(step)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <ArrowRight size={12} className="text-gray-400" />
                      <span>Send</span>
                      {form ? (
                        <Link
                          href={`/forms/${form.id}`}
                          className="text-blue-600 hover:underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {form.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400 italic">Form not found ({step.form_id})</span>
                      )}
                      <span className="text-gray-300">•</span>
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <ChannelIcon size={11} /> {channelLabels[step.channel]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-semibold text-[#111824] dark:text-[#F5F7FB] mt-3 tabular-nums">{value}</div>
    </div>
  );
}
