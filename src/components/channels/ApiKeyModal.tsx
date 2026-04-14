"use client";

import { useState } from "react";
import { ChannelProvider } from "@/data/channel-types";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface ApiKeyModalProps {
  open: boolean;
  provider: ChannelProvider | null;
  onClose: () => void;
  onConnect: (providerId: string) => void;
}

export default function ApiKeyModal({ open, provider, onClose, onConnect }: ApiKeyModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!provider || !provider.fields) return null;

  const allFilled = provider.fields.filter((f) => f.required).every((f) => values[f.key]?.trim());

  function handleConnect() {
    if (!allFilled || !provider) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConnect(provider.id);
      setValues({});
    }, 1500);
  }

  function handleClose() {
    setValues({});
    setLoading(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Connect account to ${provider.name}`}
      footer={
        <>
          <button onClick={handleClose} disabled={loading} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!allFilled || loading}
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Connect
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-gray-600">{provider.helpText}</p>

        {provider.fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              {field.label} {field.required && "(Required)"}
            </label>
            <input
              type="text"
              value={values[field.key] || ""}
              onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}
