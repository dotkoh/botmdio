"use client";

import { ConditionGroup, SegmentCondition, ConditionOperator, LogicOperator, operatorLabels } from "@/data/segment-types";
import { allProperties } from "@/data/properties";
import { Plus, Trash2 } from "lucide-react";

interface ConditionBuilderProps {
  groups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const operators: ConditionOperator[] = ["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "is_set", "is_not_set"];
const noValueOperators: ConditionOperator[] = ["is_set", "is_not_set"];

export default function ConditionBuilder({ groups, onChange }: ConditionBuilderProps) {
  function addGroup() {
    const newGroup: ConditionGroup = {
      id: `grp_${Date.now()}`,
      logic: "AND",
      conditions: [{ id: `cond_${Date.now()}`, property_key: "", operator: "equals", value: "" }],
    };
    onChange([...groups, newGroup]);
  }

  function removeGroup(groupId: string) {
    onChange(groups.filter((g) => g.id !== groupId));
  }

  function updateGroupLogic(groupId: string, logic: LogicOperator) {
    onChange(groups.map((g) => (g.id === groupId ? { ...g, logic } : g)));
  }

  function addCondition(groupId: string) {
    onChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, { id: `cond_${Date.now()}`, property_key: "", operator: "equals" as ConditionOperator, value: "" }] }
          : g
      )
    );
  }

  function removeCondition(groupId: string, conditionId: string) {
    onChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter((c) => c.id !== conditionId) }
          : g
      )
    );
  }

  function updateCondition(groupId: string, conditionId: string, field: keyof SegmentCondition, value: string) {
    onChange(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.map((c) => (c.id === conditionId ? { ...c, [field]: value } : c)) }
          : g
      )
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group, groupIdx) => (
        <div key={group.id} className="border border-gray-200 dark:border-[#263248] rounded-xl p-4">
          {/* Group header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">Group {groupIdx + 1}</span>
              {group.conditions.length > 1 && (
                <div className="flex items-center bg-gray-100 dark:bg-[#182234] rounded-md p-0.5">
                  {(["AND", "OR"] as LogicOperator[]).map((op) => (
                    <button
                      key={op}
                      onClick={() => updateGroupLogic(group.id, op)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        group.logic === op
                          ? "bg-white dark:bg-[#121A2B] text-[#111824] dark:text-[#F5F7FB] shadow-sm"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {groups.length > 1 && (
              <button onClick={() => removeGroup(group.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            {group.conditions.map((cond, condIdx) => (
              <div key={cond.id} className="flex items-center gap-2 flex-wrap">
                {condIdx > 0 && (
                  <span className="text-xs font-semibold text-[#4361EE] dark:text-[#7DA2FF] w-10 text-center">
                    {group.logic}
                  </span>
                )}
                {condIdx === 0 && <span className="w-10 text-xs text-gray-400 text-center">Where</span>}

                <select
                  value={cond.property_key}
                  onChange={(e) => updateCondition(group.id, cond.id, "property_key", e.target.value)}
                  className="flex-1 min-w-[140px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                >
                  <option value="">Select property...</option>
                  {allProperties.map((p) => (
                    <option key={p.key} value={p.key}>{p.name}</option>
                  ))}
                </select>

                <select
                  value={cond.operator}
                  onChange={(e) => updateCondition(group.id, cond.id, "operator", e.target.value)}
                  className="min-w-[150px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>{operatorLabels[op]}</option>
                  ))}
                </select>

                {!noValueOperators.includes(cond.operator) && (
                  <input
                    type="text"
                    value={cond.value}
                    onChange={(e) => updateCondition(group.id, cond.id, "value", e.target.value)}
                    placeholder="Value"
                    className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                )}

                {group.conditions.length > 1 && (
                  <button onClick={() => removeCondition(group.id, cond.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => addCondition(group.id)}
            className="flex items-center gap-1.5 text-sm text-[#4361EE] hover:text-[#3651DE] font-medium mt-3 transition-colors"
          >
            <Plus size={14} />
            Add condition
          </button>
        </div>
      ))}

      {/* Add group (OR between groups) */}
      <div className="flex items-center gap-3">
        {groups.length > 0 && (
          <span className="text-xs font-semibold text-gray-400">OR</span>
        )}
        <button
          onClick={addGroup}
          className="flex items-center gap-2 text-sm text-[#4361EE] hover:text-[#3651DE] font-medium transition-colors"
        >
          <Plus size={14} />
          Add condition group
        </button>
      </div>
    </div>
  );
}
