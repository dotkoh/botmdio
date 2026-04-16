"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { workflowTemplates } from "@/data/workflow-templates";
import { WorkflowCategory, categoryLabels } from "@/data/workflow-types";
import TemplateCategoryTabs from "@/components/workflows/TemplateCategoryTabs";
import TemplateCard from "@/components/workflows/TemplateCard";
import { ChevronLeft } from "lucide-react";

const validCategories: WorkflowCategory[] = ["appointment", "prom_prem", "medication", "payment", "clinical"];

function CreateWorkflowContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as WorkflowCategory | null;
  const [category, setCategory] = useState<WorkflowCategory>(
    initialCategory && validCategories.includes(initialCategory) ? initialCategory : "appointment"
  );

  useEffect(() => {
    const cat = searchParams.get("category") as WorkflowCategory | null;
    if (cat && validCategories.includes(cat)) {
      setCategory(cat);
    }
  }, [searchParams]);

  const filteredTemplates = workflowTemplates.filter(
    (t) => t.category === category
  );

  return (
    <div className="pb-16">
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
        <div className="w-48 shrink-0">
          <h3 className="text-sm font-semibold text-[#111824] mb-1">Templates</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Start with a workflow template to automate messages for {categoryLabels[category].toLowerCase()} events.
          </p>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CreateWorkflowPage() {
  return (
    <Suspense>
      <CreateWorkflowContent />
    </Suspense>
  );
}
