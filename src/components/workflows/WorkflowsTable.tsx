"use client";

import { Workflow, WorkflowStatus } from "@/data/workflow-types";
import { MoreVertical, AlertCircle } from "lucide-react";

const statusStyles: Record<WorkflowStatus, string> = {
  active: "text-green-600 bg-green-50",
  paused: "text-amber-600 bg-amber-50",
  draft: "text-gray-500 bg-gray-100",
  archived: "text-gray-400 bg-gray-50",
};

interface WorkflowsTableProps {
  workflows: Workflow[];
}

export default function WorkflowsTable({ workflows }: WorkflowsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] border-b border-gray-200">
            <th className="text-left text-[14px] font-normal text-[#111824] pl-6 pr-5 py-4">Workflow Name</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Applies to</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">When to send</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Status</th>
            <th className="text-left text-[14px] font-normal text-[#111824] px-5 py-4">Attached template</th>
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf) => (
            <tr key={wf.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
              <td className="pl-6 pr-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#111824]">{wf.name}</div>
                    <div className="text-xs text-gray-400">{wf.workflow_type}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-5 text-sm text-gray-700">{wf.applies_to}</td>
              <td className="px-5 py-5 text-sm text-gray-700">{wf.when_to_send}</td>
              <td className="px-5 py-5">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[wf.status]}`}>
                  {wf.status}
                </span>
              </td>
              <td className="px-5 py-5 text-sm text-gray-700">{wf.attached_template}</td>
              <td className="px-5 py-5">
                <button onClick={(e) => e.stopPropagation()} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
          {workflows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">No workflows found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
