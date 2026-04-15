"use client";

import { WorkflowCategory, categoryLabels } from "@/data/workflow-types";

const categories: WorkflowCategory[] = [
  "appointment", "prom_prem", "medication", "payment", "clinical",
];

interface TemplateCategoryTabsProps {
  active: WorkflowCategory;
  onChange: (category: WorkflowCategory) => void;
}

export default function TemplateCategoryTabs({ active, onChange }: TemplateCategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 pb-3 text-sm font-medium border-b-2 transition-colors ${
            active === cat
              ? "border-[#4361EE] text-[#4361EE]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}
