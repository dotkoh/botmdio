"use client";

import { use } from "react";
import Link from "next/link";
import { workflowTemplates } from "@/data/workflow-templates";
import { categoryLabels } from "@/data/workflow-types";
import WorkflowBuilder from "@/components/workflows/WorkflowBuilder";
import { ChevronLeft } from "lucide-react";

export default function WorkflowBuilderPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = use(params);
  const template = workflowTemplates.find((t) => t.id === templateId);

  if (!template) {
    return (
      <div>
        <Link href="/workflows/create" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft size={16} /> Back
        </Link>
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Template not found</h1>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <Link
        href="/workflows/create"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">
          Create {categoryLabels[template.category]} Workflow
        </h1>
        <button className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Publish Workflow
        </button>
      </div>

      <div className="border-b border-gray-200 mt-4" />

      <WorkflowBuilder template={template} />
    </div>
  );
}
