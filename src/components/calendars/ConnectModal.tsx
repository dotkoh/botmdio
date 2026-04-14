"use client";

import { useState } from "react";
import { ProviderDefinition } from "@/data/calendar-types";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface ConnectModalProps {
  open: boolean;
  provider: ProviderDefinition | null;
  onClose: () => void;
  onConnect: (providerId: string, credentials: Record<string, string>) => void;
}

export default function ConnectModal({
  open,
  provider,
  onClose,
  onConnect,
}: ConnectModalProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!provider) return null;

  const allFilled = provider.fields
    .filter((f) => f.required)
    .every((f) => values[f.key]?.trim());

  function handleConnect() {
    if (!allFilled || !provider) return;
    setLoading(true);
    setError("");

    // Simulate API validation
    setTimeout(() => {
      setLoading(false);
      onConnect(provider.id, values);
      setValues({});
    }, 1500);
  }

  function handleClose() {
    setValues({});
    setError("");
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
          <button
            onClick={handleClose}
            disabled={loading}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
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
        <div className="text-sm text-gray-600">
          {provider.helpText}
          {provider.helpLink && (
            <>
              <br />
              Log in and click{" "}
              <a
                href={provider.helpLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                this link
              </a>{" "}
              to view API key
              {provider.fields.length > 1
                ? ` and ${provider.fields[0].label}`
                : ""}
              .
            </>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {provider.fields.map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {field.label}
              {field.required ? " (Required)" : " (optional)"}
            </label>
            <input
              type="text"
              value={values[field.key] || ""}
              onChange={(e) =>
                setValues({ ...values, [field.key]: e.target.value })
              }
              placeholder={field.placeholder}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>
        ))}

        {provider.helpSteps && (
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-2">
              To add the webhook URL to your {provider.name} account, please
              follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-500">
              {provider.helpSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Modal>
  );
}
