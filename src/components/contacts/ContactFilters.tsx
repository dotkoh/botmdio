"use client";

import { ContactSource, ContactType } from "@/data/types";
import Dropdown from "@/components/ui/Dropdown";

interface ContactFiltersProps {
  source: ContactSource | null;
  type: ContactType | null;
  onSourceChange: (source: ContactSource | null) => void;
  onTypeChange: (type: ContactType | null) => void;
}

const sourceOptions = [
  { label: "Organic", value: "organic" },
  { label: "Imported", value: "imported" },
  { label: "Manual", value: "manual" },
  { label: "Referral", value: "referral" },
];

const typeOptions = [
  { label: "Prospect", value: "prospect" },
  { label: "Patient", value: "patient" },
  { label: "Lead", value: "lead" },
];

export default function ContactFilters({
  source,
  type,
  onSourceChange,
  onTypeChange,
}: ContactFiltersProps) {
  const hasFilters = source !== null || type !== null;

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        label="Source"
        value={source}
        options={sourceOptions}
        onChange={(v) => onSourceChange(v as ContactSource | null)}
      />
      <Dropdown
        label="Contact Type"
        value={type}
        options={typeOptions}
        onChange={(v) => onTypeChange(v as ContactType | null)}
      />
      {hasFilters && (
        <button
          onClick={() => {
            onSourceChange(null);
            onTypeChange(null);
          }}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
