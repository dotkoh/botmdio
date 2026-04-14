"use client";

import { useState } from "react";
import { Contact, ContactType, ContactProperty } from "@/data/types";
import Modal from "@/components/ui/Modal";

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: Contact) => void;
  properties: ContactProperty[];
}

export default function AddContactModal({
  open,
  onClose,
  onAdd,
  properties,
}: AddContactModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ContactType>("prospect");
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    const props: Record<string, string | number | boolean | null> = {};
    properties.forEach((p) => {
      if (p.key === "name") return;
      const val = values[p.key];
      if (val !== undefined && val !== "") {
        if (p.type === "number") {
          props[p.key] = Number(val);
        } else if (p.type === "boolean") {
          props[p.key] = val === "true";
        } else {
          props[p.key] = val;
        }
      }
    });

    const contact: Contact = {
      id: `c${Date.now()}`,
      org_id: "mediatrix",
      name: name.trim(),
      type,
      source: "manual",
      devices: [],
      properties: props,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: "user_admin",
      last_interaction_at: new Date().toISOString(),
      related_contacts: [],
    };

    onAdd(contact);
    setName("");
    setType("prospect");
    setValues({});
    setError("");
    onClose();
  }

  function renderField(prop: ContactProperty) {
    if (prop.key === "name") return null;
    const val = values[prop.key] || "";

    switch (prop.type) {
      case "options":
        return (
          <select
            value={val}
            onChange={(e) =>
              setValues({ ...values, [prop.key]: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          >
            <option value="">Select...</option>
            {prop.config.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "boolean":
        return (
          <select
            value={val}
            onChange={(e) =>
              setValues({ ...values, [prop.key]: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            value={val}
            onChange={(e) =>
              setValues({ ...values, [prop.key]: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={val}
            min={prop.config.min}
            max={prop.config.max}
            onChange={(e) =>
              setValues({ ...values, [prop.key]: e.target.value })
            }
            placeholder={prop.description}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
        );
      default:
        return (
          <input
            type="text"
            value={val}
            onChange={(e) =>
              setValues({ ...values, [prop.key]: e.target.value })
            }
            placeholder={prop.description}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
        );
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Contact"
      footer={
        <>
          <button
            onClick={onClose}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add Contact
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Contact Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContactType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          >
            <option value="prospect">Prospect</option>
            <option value="patient">Patient</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        {properties
          .filter((p) => p.key !== "name" && p.is_visible)
          .map((prop) => (
            <div key={prop.key}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {prop.name}
                {prop.is_required && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
              {renderField(prop)}
            </div>
          ))}
      </div>
    </Modal>
  );
}
