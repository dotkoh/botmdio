"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  SurveyResponse,
  surveyResponseStatusLabels,
} from "@/data/survey-response-data";
import {
  generateAnswers,
  getQuestionsForForm,
  Answer,
  Question,
} from "@/data/survey-form-questions";
import {
  X,
  Download,
  Star,
  Check,
  X as XMark,
  PhoneCall,
  Calendar as CalendarIcon,
} from "lucide-react";

interface ResponseDrawerProps {
  response: SurveyResponse | null;
  formId: string;
  formName: string;
  onClose: () => void;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

function formatDateOnly(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ResponseDrawer({
  response,
  formId,
  formName,
  onClose,
}: ResponseDrawerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (response) {
      document.addEventListener("mousedown", handleClick);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [response, onClose]);

  const questions: Question[] = useMemo(
    () => (response ? getQuestionsForForm(formId) : []),
    [response, formId]
  );

  const answers: Answer[] = useMemo(() => {
    if (!response || response.status !== "completed") return [];
    return generateAnswers({
      responseId: response.id,
      formId,
      patientName: response.patient_name,
      patientPhone: response.patient_phone,
    });
  }, [response, formId]);

  const answersById = useMemo(() => {
    const map = new Map<string, Answer>();
    answers.forEach((a) => map.set(a.question_id, a));
    return map;
  }, [answers]);

  if (!response) return null;

  const isCompleted = response.status === "completed";

  // Mock PDF link — points to the production Bot MD Forms domain so the URL pattern
  // matches what the user will see in production.
  const pdfHref = `https://forms.production.botmd.io/responses/${response.id}.pdf`;

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-[560px] max-w-[95vw] bg-white dark:bg-[#0A1020] border-l border-gray-200 dark:border-[#263248] flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-200 dark:border-[#263248]">
          <div className="min-w-0">
            <div className="text-xs text-gray-400 mb-1 truncate">{formName}</div>
            <h2 className="text-xl font-semibold text-[#111824] dark:text-[#F5F7FB] truncate">
              {response.patient_name}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusPill status={response.status} />
              {isCompleted && response.completed_at ? (
                <span className="text-xs text-gray-400">Completed {formatDateTime(response.completed_at)}</span>
              ) : (
                <span className="text-xs text-gray-400">Sent {formatDateTime(response.sent_at)}</span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Contact + meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Phone</div>
              <div className="flex items-center gap-1.5 text-[#111824] dark:text-[#F5F7FB]">
                <PhoneCall size={12} className="text-gray-400" />
                <a href={`tel:${response.patient_phone}`} className="hover:underline truncate">
                  {response.patient_phone}
                </a>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Sent</div>
              <div className="flex items-center gap-1.5 text-[#111824] dark:text-[#F5F7FB]">
                <CalendarIcon size={12} className="text-gray-400" />
                <span>{formatDateTime(response.sent_at)}</span>
              </div>
            </div>
          </div>

          {/* Responses */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Responses</div>

            {!isCompleted ? (
              <div className="bg-gray-50 dark:bg-[#121A2B] border border-dashed border-gray-300 dark:border-[#263248] rounded-lg p-8 text-center">
                <p className="text-sm text-gray-500 mb-1">This survey has not been completed yet.</p>
                <p className="text-xs text-gray-400">Responses will appear here once the patient submits.</p>
              </div>
            ) : (
              <ol className="space-y-5">
                {questions.map((q, idx) => {
                  const a = answersById.get(q.id);
                  return (
                    <li key={q.id} className="border border-gray-200 dark:border-[#263248] rounded-lg p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-400 mt-0.5 w-5 shrink-0">{idx + 1}.</span>
                        <p className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB] leading-snug">
                          {q.text}
                          {q.unit && <span className="text-xs text-gray-400 ml-1">({q.unit})</span>}
                        </p>
                      </div>
                      <div className="ml-7">
                        <AnswerView question={q} answer={a} />
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* Footer: Download PDF */}
        <div className="border-t border-gray-200 dark:border-[#263248] px-6 py-4">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!isCompleted}
            onClick={(e) => {
              if (!isCompleted) e.preventDefault();
            }}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isCompleted
                ? "bg-[#4361EE] hover:bg-[#3651DE] text-white"
                : "bg-gray-100 dark:bg-[#1A2336] text-gray-400 cursor-not-allowed"
            }`}
          >
            <Download size={14} />
            Download PDF
          </a>
          {!isCompleted && (
            <p className="text-xs text-gray-400 text-center mt-2">PDF available once the patient completes the survey.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: SurveyResponse["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 dark:bg-[#163826] dark:text-green-300">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {surveyResponseStatusLabels.completed}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-[#1A2336] dark:text-gray-300">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
      {surveyResponseStatusLabels.not_completed}
    </span>
  );
}

function AnswerView({ question, answer }: { question: Question; answer: Answer | undefined }) {
  if (!answer || answer.value === null || answer.value === undefined || answer.value === "") {
    return <span className="text-sm text-gray-400 italic">No answer</span>;
  }

  switch (question.type) {
    case "yes_no": {
      const yes = answer.value === true;
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full ${
            yes
              ? "bg-green-50 text-green-700 dark:bg-[#163826] dark:text-green-300"
              : "bg-red-50 text-red-700 dark:bg-[#2D1818] dark:text-red-300"
          }`}
        >
          {yes ? <Check size={12} /> : <XMark size={12} />}
          {yes ? "Yes" : "No"}
        </span>
      );
    }
    case "rating_5":
    case "rating_10": {
      const max = question.type === "rating_5" ? 5 : 10;
      const value = Number(answer.value);
      // Render stars for 5-scale, dots for 10-scale (cleaner)
      if (max === 5) {
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < value ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-[#263248]"}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2 tabular-nums">{value} / 5</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-3 rounded-full ${
                  i < value ? "bg-[#4361EE]" : "bg-gray-200 dark:bg-[#263248]"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 tabular-nums">{value} / 10</span>
        </div>
      );
    }
    case "single_choice":
      return (
        <span className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-[#C7CFDB] bg-gray-100 dark:bg-[#1A2336] border border-gray-200 dark:border-[#263248] px-2.5 py-1 rounded-full">
          {String(answer.value)}
        </span>
      );
    case "multi_choice": {
      const arr = Array.isArray(answer.value) ? answer.value : [];
      if (arr.length === 0) return <span className="text-sm text-gray-400 italic">No selection</span>;
      return (
        <div className="flex flex-wrap gap-1.5">
          {arr.map((opt, i) => (
            <span
              key={i}
              className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-[#C7CFDB] bg-gray-100 dark:bg-[#1A2336] border border-gray-200 dark:border-[#263248] px-2.5 py-1 rounded-full"
            >
              {opt}
            </span>
          ))}
        </div>
      );
    }
    case "number": {
      const v = Number(answer.value);
      return (
        <span className="text-sm text-[#111824] dark:text-[#F5F7FB] tabular-nums font-medium">
          {v.toLocaleString()}
          {question.unit && <span className="text-gray-400 font-normal ml-1">{question.unit}</span>}
        </span>
      );
    }
    case "date":
      return (
        <span className="text-sm text-[#111824] dark:text-[#F5F7FB]">
          {formatDateOnly(String(answer.value))}
        </span>
      );
    case "long_text":
      return (
        <p className="text-sm text-[#111824] dark:text-[#F5F7FB] leading-relaxed whitespace-pre-wrap">
          {String(answer.value)}
        </p>
      );
    case "short_text":
    default:
      return <p className="text-sm text-[#111824] dark:text-[#F5F7FB]">{String(answer.value)}</p>;
  }
}
