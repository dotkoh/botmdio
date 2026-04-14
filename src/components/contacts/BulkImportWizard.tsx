"use client";

import { useState, useMemo } from "react";
import { Contact, ContactProperty } from "@/data/types";
import Modal from "@/components/ui/Modal";
import {
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Download,
} from "lucide-react";

interface BulkImportWizardProps {
  open: boolean;
  onClose: () => void;
  onImport: (contacts: Contact[]) => void;
  properties: ContactProperty[];
  existingContacts: Contact[];
}

type DuplicateHandling = "skip" | "update" | "create";

interface ColumnMapping {
  columnIndex: number;
  columnHeader: string;
  propertyKey: string | "skip";
}

export default function BulkImportWizard({
  open,
  onClose,
  onImport,
  properties,
  existingContacts,
}: BulkImportWizardProps) {
  const [step, setStep] = useState(1);
  const [rawData, setRawData] = useState("");
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [duplicateHandling, setDuplicateHandling] =
    useState<DuplicateHandling>("skip");
  const [importResult, setImportResult] = useState<{
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  function parseData() {
    const lines = rawData.trim().split("\n");
    if (lines.length < 2) return;

    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const parsed = lines.map((line) =>
      line.split(delimiter).map((cell) => cell.trim().replace(/^"|"$/g, ""))
    );

    const hdrs = parsed[0];
    const rows = parsed.slice(1).filter((row) => row.some((cell) => cell));

    setHeaders(hdrs);
    setParsedRows(rows);

    // Auto-map columns
    const autoMappings: ColumnMapping[] = hdrs.map((header, i) => {
      const normalizedHeader = header.toLowerCase().replace(/[\s_-]/g, "");
      const matched = properties.find((p) => {
        const normalizedKey = p.key.replace(/_/g, "");
        const normalizedName = p.name.toLowerCase().replace(/[\s_-]/g, "");
        return (
          normalizedKey === normalizedHeader ||
          normalizedName === normalizedHeader
        );
      });
      return {
        columnIndex: i,
        columnHeader: header,
        propertyKey: matched ? matched.key : "skip",
      };
    });

    setMappings(autoMappings);
    setStep(2);
  }

  const validationErrors = useMemo(() => {
    const errors: { row: number; message: string }[] = [];
    const nameMapping = mappings.find((m) => m.propertyKey === "name");

    if (!nameMapping) {
      errors.push({ row: 0, message: "No column mapped to Name (required)" });
      return errors;
    }

    parsedRows.forEach((row, i) => {
      const name = row[nameMapping.columnIndex];
      if (!name) {
        errors.push({ row: i + 2, message: `Row ${i + 2}: Name is empty` });
      }

      const emailMapping = mappings.find((m) => m.propertyKey === "email");
      if (emailMapping) {
        const email = row[emailMapping.columnIndex];
        if (email && !email.includes("@")) {
          errors.push({
            row: i + 2,
            message: `Row ${i + 2}: Invalid email "${email}"`,
          });
        }
      }
    });

    return errors;
  }, [parsedRows, mappings]);

  const duplicates = useMemo(() => {
    const emailMapping = mappings.find((m) => m.propertyKey === "email");
    const mobileMapping = mappings.find(
      (m) => m.propertyKey === "mobile_number"
    );
    const dupes: number[] = [];

    parsedRows.forEach((row, i) => {
      const email = emailMapping ? row[emailMapping.columnIndex] : "";
      const mobile = mobileMapping ? row[mobileMapping.columnIndex] : "";

      const exists = existingContacts.some((c) => {
        if (email && c.properties.email === email) return true;
        if (mobile && c.properties.mobile_number === mobile) return true;
        return false;
      });

      if (exists) dupes.push(i);
    });

    return dupes;
  }, [parsedRows, mappings, existingContacts]);

  function executeImport() {
    const nameMapping = mappings.find((m) => m.propertyKey === "name");
    if (!nameMapping) return;

    const created: Contact[] = [];
    let updatedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    parsedRows.forEach((row, i) => {
      const name = row[nameMapping.columnIndex];
      if (!name) {
        errors.push(`Row ${i + 2}: Skipped (no name)`);
        skippedCount++;
        return;
      }

      const isDuplicate = duplicates.includes(i);
      if (isDuplicate && duplicateHandling === "skip") {
        skippedCount++;
        return;
      }

      const props: Record<string, string | number | boolean | null> = {};
      mappings.forEach((m) => {
        if (m.propertyKey === "skip" || m.propertyKey === "name") return;
        const val = row[m.columnIndex];
        if (!val) return;

        const propDef = properties.find((p) => p.key === m.propertyKey);
        if (propDef?.type === "number") {
          props[m.propertyKey] = Number(val) || 0;
        } else {
          props[m.propertyKey] = val;
        }
      });

      if (isDuplicate && duplicateHandling === "update") {
        updatedCount++;
      }

      created.push({
        id: `c${Date.now()}_${i}`,
        org_id: "mediatrix",
        name,
        type: "prospect",
        source: "imported",
        devices: [],
        properties: props,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: `import_batch_${Date.now()}`,
        last_interaction_at: new Date().toISOString(),
        related_contacts: [],
      });
    });

    setImportResult({
      created: created.length - updatedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors,
    });

    onImport(created);
    setStep(4);
  }

  function reset() {
    setStep(1);
    setRawData("");
    setParsedRows([]);
    setHeaders([]);
    setMappings([]);
    setImportResult(null);
    onClose();
  }

  const stepTitles = [
    "",
    "Step 1: Paste Data",
    "Step 2: Map Columns",
    "Step 3: Validate & Preview",
    "Step 4: Import Complete",
  ];

  return (
    <Modal
      open={open}
      onClose={reset}
      title={stepTitles[step]}
      width="w-[720px]"
      footer={
        step === 1 ? (
          <>
            <button
              onClick={reset}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={parseData}
              disabled={!rawData.trim()}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </>
        ) : step === 2 ? (
          <>
            <button
              onClick={() => setStep(1)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!mappings.some((m) => m.propertyKey === "name")}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </>
        ) : step === 3 ? (
          <>
            <button
              onClick={() => setStep(2)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              onClick={executeImport}
              disabled={
                validationErrors.some((e) => e.row === 0)
              }
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload size={14} />
              Import {parsedRows.length} contacts
            </button>
          </>
        ) : (
          <button
            onClick={reset}
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Done
          </button>
        )
      }
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                s < step
                  ? "bg-green-100 text-green-700"
                  : s === step
                  ? "bg-[#4361EE] text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-8 h-0.5 ${
                  s < step ? "bg-green-200" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Paste */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Paste data from Excel or Google Sheets. First row should be column
            headers. Tab-separated or comma-separated values are accepted.
          </p>
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            rows={12}
            placeholder={`Name\tEmail\tMobile Number\tAge\nMaria Santos\tmaria@gmail.com\t+639171234567\t41\nJuan Dela Cruz\tjuan@yahoo.com\t+639189876543\t55`}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
          />
          {rawData.trim() && (
            <div className="mt-2 text-sm text-gray-500">
              Detected{" "}
              <strong>
                {rawData.trim().split("\n").length - 1}
              </strong>{" "}
              rows and{" "}
              <strong>
                {
                  rawData
                    .trim()
                    .split("\n")[0]
                    .split(rawData.includes("\t") ? "\t" : ",").length
                }
              </strong>{" "}
              columns
            </div>
          )}
        </div>
      )}

      {/* Step 2: Map Columns */}
      {step === 2 && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Map each column to a contact property. Columns mapped to
            &quot;Skip&quot; will be ignored.
          </p>
          <div className="space-y-3">
            {mappings.map((mapping, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-40 text-sm font-medium text-gray-700 truncate">
                  {mapping.columnHeader}
                </div>
                <ArrowRight size={14} className="text-gray-400 shrink-0" />
                <select
                  value={mapping.propertyKey}
                  onChange={(e) => {
                    const updated = [...mappings];
                    updated[i] = {
                      ...mapping,
                      propertyKey: e.target.value,
                    };
                    setMappings(updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                >
                  <option value="skip">-- Skip --</option>
                  {properties.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.name} ({p.key})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {!mappings.some((m) => m.propertyKey === "name") && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertCircle size={14} />
              You must map at least one column to &quot;Full Name&quot;
            </div>
          )}
        </div>
      )}

      {/* Step 3: Validate & Preview */}
      {step === 3 && (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-700">
                {parsedRows.length - duplicates.length}
              </div>
              <div className="text-xs text-green-600">New contacts</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-amber-700">
                {duplicates.length}
              </div>
              <div className="text-xs text-amber-600">Duplicates</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-700">
                {validationErrors.filter((e) => e.row > 0).length}
              </div>
              <div className="text-xs text-red-600">Errors</div>
            </div>
          </div>

          {/* Duplicate handling */}
          {duplicates.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Handle duplicates:
              </label>
              <select
                value={duplicateHandling}
                onChange={(e) =>
                  setDuplicateHandling(e.target.value as DuplicateHandling)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="skip">Skip duplicates</option>
                <option value="update">Update existing</option>
                <option value="create">Create anyway</option>
              </select>
            </div>
          )}

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-600 mb-2">
                Validation Errors
              </h4>
              <div className="bg-red-50 rounded-lg p-3 space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.map((e, i) => (
                  <div key={i} className="text-sm text-red-600">
                    {e.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview table */}
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Preview (first 10 rows)
          </h4>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {mappings
                    .filter((m) => m.propertyKey !== "skip")
                    .map((m) => (
                      <th
                        key={m.columnIndex}
                        className="text-left px-3 py-2 text-xs font-semibold text-gray-500"
                      >
                        {properties.find((p) => p.key === m.propertyKey)?.name ||
                          m.columnHeader}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {parsedRows.slice(0, 10).map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-gray-100 ${
                      duplicates.includes(i) ? "bg-amber-50" : ""
                    }`}
                  >
                    {mappings
                      .filter((m) => m.propertyKey !== "skip")
                      .map((m) => (
                        <td
                          key={m.columnIndex}
                          className="px-3 py-2 text-gray-700"
                        >
                          {row[m.columnIndex] || "-"}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 4 && importResult && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Import Complete
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4 max-w-sm mx-auto">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-xl font-bold text-green-700">
                {importResult.created}
              </div>
              <div className="text-xs text-green-600">Created</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xl font-bold text-blue-700">
                {importResult.updated}
              </div>
              <div className="text-xs text-blue-600">Updated</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xl font-bold text-gray-700">
                {importResult.skipped}
              </div>
              <div className="text-xs text-gray-500">Skipped</div>
            </div>
          </div>
          {importResult.errors.length > 0 && (
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mx-auto">
              <Download size={14} />
              Download error report
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
