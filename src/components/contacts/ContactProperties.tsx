"use client";

import { useState } from "react";
import { ContactProperty, PropertyType } from "@/data/types";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { generateKey } from "@/lib/utils";

interface ContactPropertiesProps {
  properties: ContactProperty[];
  onAdd: (property: ContactProperty) => void;
  onUpdate: (property: ContactProperty) => void;
  onDelete: (id: string) => void;
}

const typeLabels: Record<PropertyType, string> = {
  string: "String",
  number: "Number",
  boolean: "Yes/No",
  options: "Options",
  date: "Date",
  location: "Location",
  file: "File",
};

export default function ContactProperties({
  properties,
  onAdd,
  onUpdate,
  onDelete,
}: ContactPropertiesProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<ContactProperty | null>(null);

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PropertyType>("string");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [error, setError] = useState("");

  function openAdd() {
    setEditingProp(null);
    setName("");
    setKey("");
    setDescription("");
    setType("string");
    setRequired(false);
    setOptions("");
    setError("");
    setModalOpen(true);
  }

  function openEdit(prop: ContactProperty) {
    setEditingProp(prop);
    setName(prop.name);
    setKey(prop.key);
    setDescription(prop.description);
    setType(prop.type);
    setRequired(prop.is_required);
    setOptions(prop.config.options?.join(", ") || "");
    setError("");
    setModalOpen(true);
  }

  function handleSave() {
    if (!name.trim()) {
      setError("Property name is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required (used by AI for data collection)");
      return;
    }

    const finalKey = key.trim() || generateKey(name);

    if (
      !editingProp &&
      properties.some((p) => p.key === finalKey)
    ) {
      setError("A property with this key already exists");
      return;
    }

    const prop: ContactProperty = {
      id: editingProp?.id || `prop_${Date.now()}`,
      org_id: "mediatrix",
      name: name.trim(),
      key: finalKey,
      description: description.trim(),
      type,
      is_default: false,
      is_required: required,
      is_visible: true,
      config: {
        options:
          type === "options"
            ? options
                .split(",")
                .map((o) => o.trim())
                .filter(Boolean)
            : undefined,
      },
      display_order: editingProp?.display_order || properties.length + 1,
      created_at: editingProp?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (editingProp) {
      onUpdate(prop);
    } else {
      onAdd(prop);
    }
    setModalOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Manage the properties used to store contact information. Descriptions
          are used by AI agents to understand what data to collect.
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Property Name
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Key
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Description
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Type
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Category
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                Required
              </th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr
                key={prop.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-3 text-sm font-medium text-gray-900">
                  {prop.name}
                </td>
                <td className="px-5 py-3">
                  <code className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {prop.key}
                  </code>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500 max-w-xs truncate">
                  {prop.description}
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {typeLabels[prop.type]}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      prop.is_default
                        ? "bg-gray-100 text-gray-600"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {prop.is_default ? "Default" : "Custom"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-700">
                  {prop.is_required ? "Yes" : "No"}
                </td>
                <td className="px-5 py-3">
                  {!prop.is_default && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(prop)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(prop.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProp ? "Edit Property" : "Add Property"}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {editingProp ? "Save Changes" : "Add Property"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingProp) setKey(generateKey(e.target.value));
              }}
              placeholder="e.g., Insurance Provider"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="auto_generated_key"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what this property represents. AI agents use this to understand what data to collect."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Field Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
            >
              {Object.entries(typeLabels).map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {type === "options" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Options (comma-separated)
              </label>
              <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="Option 1, Option 2, Option 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="required" className="text-sm text-gray-700">
              Required (AI will attempt to collect this during conversations)
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
