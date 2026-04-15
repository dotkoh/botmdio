"use client";

import { useState } from "react";
import Link from "next/link";
import { workflowTemplates } from "@/data/workflow-templates";
import { WorkflowCategory, categoryLabels } from "@/data/workflow-types";
import TemplateCategoryTabs from "@/components/workflows/TemplateCategoryTabs";
import TemplateCard from "@/components/workflows/TemplateCard";
import { ChevronLeft } from "lucide-react";

export default function CreateWorkflowPage() {
  const [category, setCategory] = useState<WorkflowCategory>("appointment");

  const filteredTemplates = workflowTemplates.filter(
    (t) => t.category === category
  );

  return (
    <div>
      <Link
        href="/workflows"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824] mb-6">
        Create {categoryLabels[category]} Workflow
      </h1>

      <TemplateCategoryTabs active={category} onChange={setCategory} />

      <div className="flex gap-8">
        {/* Left sidebar */}
        <div className="w-48 shrink-0">
          <h3 className="text-sm font-semibold text-[#111824] mb-1">Templates</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Start with a workflow template to automate messages for {categoryLabels[category].toLowerCase()} events.
          </p>
        </div>

        {/* Template cards grid */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}
