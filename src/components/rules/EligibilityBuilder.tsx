"use client";

import { EligibilityCondition, ConditionOperator, LogicOperator, operatorLabels } from "@/data/rule-types";
import { allProperties } from "@/data/properties";
import { Plus, Trash2 } from "lucide-react";

interface EligibilityBuilderProps {
  logic: LogicOperator;
  conditions: EligibilityCondition[];
  onLogicChange: (logic: LogicOperator) => void;
  onConditionsChange: (conditions: EligibilityCondition[]) => void;
}

const noValueOperators: ConditionOperator[] = ["is_empty", "is_not_empty"];

// Pick a sensible operator list per property type
function operatorsForProperty(propertyKey: string): ConditionOperator[] {
  const prop = allProperties.find((p) => p.key === propertyKey);
  if (!prop) return ["eq", "neq", "contains", "is_empty", "is_not_empty"];
  switch (prop.type) {
    case "number":
      return ["eq", "neq", "gt", "lt", "gte", "lte", "is_empty", "is_not_empty"];
    case "boolean":
      return ["eq", "neq"];
    case "options":
      return ["eq", "neq", "in", "not_in", "is_empty", "is_not_empty"];
    case "date":
      return ["eq", "neq", "gt", "lt", "is_empty", "is_not_empty"];
    default:
      return ["eq", "neq", "contains", "is_empty", "is_not_empty"];
  }
}

export default function EligibilityBuilder({
  logic,
  conditions,
  onLogicChange,
  onConditionsChange,
}: EligibilityBuilderProps) {
  function addCondition() {
    onConditionsChange([
      ...conditions,
      { id: `cond_${Date.now()}`, property_id: "", operator: "eq", value: "" },
    ]);
  }

  function removeCondition(id: string) {
    onConditionsChange(conditions.filter((c) => c.id !== id));
  }

  function updateCondition(id: string, patch: Partial<EligibilityCondition>) {
    onConditionsChange(
      conditions.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  return (
    <div className="bg-white dark:bg-[#121A2B] border border-gray-200 dark:border-[#263248] rounded-lg p-4">
      {/* Logic header */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-700 dark:text-[#C7CFDB] flex-wrap">
        <span>Patients must meet</span>
        <div className="flex items-center bg-gray-100 dark:bg-[#182234] rounded-md p-0.5">
          {(["AND", "OR"] as LogicOperator[]).map((op) => (
            <button
              key={op}
              onClick={() => onLogicChange(op)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                logic === op
                  ? "bg-white dark:bg-[#121A2B] text-[#111824] dark:text-[#F5F7FB] shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {op === "AND" ? "ALL" : "ANY"}
            </button>
          ))}
        </div>
        <span>of these criteria:</span>
      </div>

      {/* Conditions */}
      <div className="space-y-2">
        {conditions.map((cond) => {
          const availableOps = operatorsForProperty(cond.property_id);
          const prop = allProperties.find((p) => p.key === cond.property_id);
          const showValueInput = !noValueOperators.includes(cond.operator);

          return (
            <div key={cond.id} className="flex items-center gap-2 flex-wrap">
              <select
                value={cond.property_id}
                onChange={(e) => updateCondition(cond.id, { property_id: e.target.value, operator: "eq" })}
                className="flex-1 min-w-[160px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                <option value="">Select property...</option>
                {allProperties.map((p) => (
                  <option key={p.key} value={p.key}>{p.name}</option>
                ))}
              </select>

              <select
                value={cond.operator}
                onChange={(e) => updateCondition(cond.id, { operator: e.target.value as ConditionOperator })}
                className="min-w-[140px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              >
                {availableOps.map((op) => (
                  <option key={op} value={op}>{operatorLabels[op]}</option>
                ))}
              </select>

              {showValueInput && (
                prop?.type === "options" && prop.config.options ? (
                  <select
                    value={cond.value}
                    onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                    className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select value...</option>
                    {prop.config.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : prop?.type === "boolean" ? (
                  <select
                    value={cond.value}
                    onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                    className="flex-1 min-w-[100px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    type={prop?.type === "number" ? "number" : prop?.type === "date" ? "date" : "text"}
                    value={cond.value}
                    onChange={(e) => updateCondition(cond.id, { value: e.target.value })}
                    placeholder="Value"
                    className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                )
              )}

              {conditions.length > 1 && (
                <button
                  onClick={() => removeCondition(cond.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-[#2D1818] rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={addCondition}
        className="flex items-center gap-1.5 text-sm font-medium text-[#4361EE] hover:text-[#3651DE] mt-3 transition-colors"
      >
        <Plus size={14} />
        Add condition
      </button>
    </div>
  );
}
