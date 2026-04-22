import Link from "next/link";
import { ChevronLeft, Workflow as WorkflowIcon } from "lucide-react";

export default function CreateFormWorkflowPage() {
  return (
    <div className="pb-16">
      <Link href="/form-workflows" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} /> Back to Workflows
      </Link>

      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Create workflow</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          Build an automated cadence to send survey forms before and after patient visits.
        </p>
      </div>

      <div className="border-b border-gray-200 mb-10" />

      <div className="max-w-3xl bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-xl p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 dark:bg-[#151E3A] rounded-full flex items-center justify-center mb-4">
          <WorkflowIcon size={28} className="text-[#4361EE]" />
        </div>
        <h2 className="text-lg font-semibold text-[#111824] mb-2">Workflow builder coming soon</h2>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          The drag-and-drop workflow builder is in development. For now, please reach out to your Bot MD account manager to set up new workflows.
        </p>
        <Link
          href="/form-workflows"
          className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Back to Workflows
        </Link>
      </div>
    </div>
  );
}
