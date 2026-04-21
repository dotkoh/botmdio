"use client";

import Link from "next/link";
import type { MessageTemplate } from "@/data/ai-agent-mock-data";

export type MessageMode = "free_text" | "template";

interface MessageInputProps {
  mode: MessageMode;
  onModeChange: (mode: MessageMode) => void;
  freeText: string;
  onFreeTextChange: (text: string) => void;
  templateId: string;
  onTemplateIdChange: (id: string) => void;
  templates: MessageTemplate[];
  placeholder?: string;
}

export default function MessageInput({
  mode,
  onModeChange,
  freeText,
  onFreeTextChange,
  templateId,
  onTemplateIdChange,
  templates,
  placeholder = "Type your message...",
}: MessageInputProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={() => onModeChange("free_text")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            mode === "free_text"
              ? "bg-[#4361EE] text-white"
              : "bg-gray-100 dark:bg-[#182234] text-gray-600 dark:text-[#C7CFDB] hover:bg-gray-200 dark:hover:bg-[#1D2638]"
          }`}
        >
          Free text
        </button>
        <button
          type="button"
          onClick={() => onModeChange("template")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            mode === "template"
              ? "bg-[#4361EE] text-white"
              : "bg-gray-100 dark:bg-[#182234] text-gray-600 dark:text-[#C7CFDB] hover:bg-gray-200 dark:hover:bg-[#1D2638]"
          }`}
        >
          Template
        </button>
      </div>

      {mode === "free_text" ? (
        <textarea
          value={freeText}
          onChange={(e) => onFreeTextChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
        />
      ) : (
        <>
          <select
            value={templateId}
            onChange={(e) => onTemplateIdChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          >
            <option value="">Select template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}{t.has_buttons ? " (with buttons)" : ""}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">
            You can set up message templates in{" "}
            <Link href="/templates" className="text-blue-600 hover:underline">
              Messaging Templates
            </Link>{" "}
            module.
          </p>
        </>
      )}
    </div>
  );
}
