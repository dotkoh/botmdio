"use client";

import { WorkflowTemplate, subcategoryColors } from "@/data/workflow-types";
import Link from "next/link";

interface TemplateCardProps {
  template: WorkflowTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const colors = subcategoryColors[template.subcategory] || {
    text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between hover:border-gray-300 transition-colors">
      <div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.text} ${colors.bg} ${colors.border}`}>
          {template.subcategory}
        </span>
        <h4 className="text-sm font-semibold text-[#111824] mt-3 mb-1.5">
          {template.name}
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          {template.description}
        </p>
      </div>
      <Link
        href={`/workflows/create/${template.id}`}
        className="mt-4 inline-flex bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors self-start"
      >
        Add workflow
      </Link>
    </div>
  );
}
