"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string;
  value: string | null;
  options: { label: string; value: string }[];
  onChange: (value: string | null) => void;
}

export default function Dropdown({
  label,
  value,
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg text-sm transition-colors h-10"
      >
        <span>
          {label}
          {selectedLabel ? `: ${selectedLabel}` : ""}
        </span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30 min-w-[180px]">
          <div
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
              value === null
                ? "bg-blue-50 text-blue-700 font-medium"
                : "hover:bg-blue-50"
            }`}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            All
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "hover:bg-blue-50"
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
