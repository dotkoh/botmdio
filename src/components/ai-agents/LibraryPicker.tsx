"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Plus } from "lucide-react";

export interface LibraryPickerItem {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  meta?: string;
  badge?: { label: string; tone: "warning" | "info" | "muted" };
}

interface LibraryPickerProps {
  items: LibraryPickerItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  searchPlaceholder?: string;
  itemLabel?: string;
  createLabel?: string;
  createHref?: string;
  manageHref?: string;
  manageLabel?: string;
}

const badgeStyles: Record<"warning" | "info" | "muted", string> = {
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900",
  muted: "bg-gray-100 text-gray-600 dark:bg-[#1D2638] dark:text-gray-400 border-gray-200 dark:border-[#263248]",
};

export default function LibraryPicker({
  items,
  selectedIds,
  onToggle,
  searchPlaceholder = "Search…",
  itemLabel = "items",
  createLabel,
  createHref,
  manageHref,
  manageLabel,
}: LibraryPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.subtitle ?? "").toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const subscribed = filtered.filter((i) => selectedIds.has(i.id));
  const available = filtered.filter((i) => !selectedIds.has(i.id));

  function renderItem(item: LibraryPickerItem) {
    const selected = selectedIds.has(item.id);
    return (
      <label
        key={item.id}
        className={`flex items-start gap-3 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
          selected
            ? "border-[#4361EE] bg-blue-50/50 dark:bg-[#151E3A]"
            : "border-gray-200 dark:border-[#263248] hover:bg-gray-50 dark:hover:bg-[#182234]"
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(item.id)}
          className="w-4 h-4 rounded border-gray-300 text-[#4361EE] mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{item.name}</span>
            {item.badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[item.badge.tone]}`}>
                {item.badge.label}
              </span>
            )}
          </div>
          {item.subtitle && (
            <div className="text-xs text-gray-500 dark:text-[#8E99AB] mt-0.5">{item.subtitle}</div>
          )}
          {item.description && (
            <div className="text-xs text-gray-400 dark:text-[#667085] mt-1">{item.description}</div>
          )}
          {item.meta && (
            <div className="text-xs text-gray-400 dark:text-[#667085] mt-1">{item.meta}</div>
          )}
        </div>
      </label>
    );
  }

  return (
    <div>
      {/* Search + count */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {selectedIds.size} of {items.length} selected
        </div>
      </div>

      {/* Subscribed group */}
      {subscribed.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-semibold text-[#111824] dark:text-[#F5F7FB] uppercase tracking-wide">
              Subscribed ({subscribed.length})
            </div>
            <div className="flex-1 border-t border-gray-200 dark:border-[#263248]" />
          </div>
          <div className="space-y-2">{subscribed.map(renderItem)}</div>
        </div>
      )}

      {/* Available group */}
      {available.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Available ({available.length})
            </div>
            <div className="flex-1 border-t border-gray-200 dark:border-[#263248]" />
          </div>
          <div className="space-y-2">{available.map(renderItem)}</div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400">
          No {itemLabel} match &quot;{query}&quot;
        </div>
      )}

      {/* Footer actions */}
      {(createHref || manageHref) && (
        <div className="flex items-center gap-3 mt-4 pt-3">
          {createHref && createLabel && (
            <Link
              href={createHref}
              className="flex items-center gap-1.5 text-sm font-medium text-[#4361EE] hover:text-[#3651DE] transition-colors"
            >
              <Plus size={14} />
              {createLabel}
            </Link>
          )}
          {manageHref && manageLabel && (
            <>
              {createHref && <span className="text-gray-300">·</span>}
              <Link href={manageHref} className="text-sm text-blue-600 hover:underline">
                {manageLabel} →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
