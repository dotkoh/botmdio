"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X, Check } from "lucide-react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedOptions = useMemo(
    () => options.filter((o) => selected.includes(o.value)),
    [options, selected]
  );

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function removeOne(value: string) {
    onChange(selected.filter((v) => v !== value));
  }

  function clearAll() {
    onChange([]);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={`w-full min-h-[48px] px-3 py-2 border rounded-lg flex items-center gap-1.5 flex-wrap cursor-text transition ${
          open
            ? "border-[#4361EE] ring-2 ring-[#4361EE]/20"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {selectedOptions.length === 0 && !open && (
          <span className="text-sm text-gray-400 px-1">{placeholder}</span>
        )}

        {selectedOptions.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-[#182234] text-[#111824] dark:text-[#F5F7FB] px-2 py-1 rounded-md text-sm"
          >
            {opt.label}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeOne(opt.value);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        {open && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedOptions.length === 0 ? placeholder : "Search..."}
            className="flex-1 min-w-[100px] bg-transparent outline-none text-sm px-1 py-0.5"
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !query && selectedOptions.length > 0) {
                removeOne(selectedOptions[selectedOptions.length - 1].value);
              }
            }}
          />
        )}

        <div className="ml-auto flex items-center gap-1 pr-1">
          {selectedOptions.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear all"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 max-h-72 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              No matches for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-[#151E3A]"
                      : "hover:bg-gray-50 dark:hover:bg-[#182234]"
                  }`}
                >
                  <span className={`text-sm ${isSelected ? "text-[#4361EE] dark:text-[#7DA2FF] font-medium" : "text-[#111824] dark:text-[#F5F7FB]"}`}>
                    {opt.label}
                  </span>
                  {isSelected && <Check size={14} className="text-[#4361EE] dark:text-[#7DA2FF]" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
