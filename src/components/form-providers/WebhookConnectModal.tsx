"use client";

import { useState } from "react";
import { FormProviderDefinition } from "@/data/form-provider-data";
import Modal from "@/components/ui/Modal";
import { Copy, Check, Loader2 } from "lucide-react";

interface WebhookConnectModalProps {
  open: boolean;
  provider: FormProviderDefinition | null;
  onClose: () => void;
  onConnect: (providerId: string, name: string) => void;
}

export default function WebhookConnectModal({ open, provider, onClose, onConnect }: WebhookConnectModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!provider) return null;

  // Generate a unique webhook URL
  const webhookId = Math.random().toString(36).slice(2, 14);
  const webhookUrl = `https://nova-api.production.botmd.io/forms/${provider.id}/${webhookId}/callback`;
  const webhookSecret = `whsec_${Math.random().toString(36).slice(2, 18)}`;

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleConnect() {
    if (!name.trim() || !provider) return;
    const providerId = provider.id;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConnect(providerId, name);
      setName("");
    }, 1500);
  }

  function handleClose() {
    setName("");
    setLoading(false);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Connect ${provider.name}`}
      width="w-[600px]"
      footer={
        <>
          <button onClick={handleClose} disabled={loading} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={!name.trim() || loading}
            className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Connect
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Form name */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Form name (Required)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Patient Intake Form"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
          />
          <p className="text-xs text-gray-400 mt-1">A label to help you identify this form connection</p>
        </div>

        {/* Webhook URL */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Webhook URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#182234] border border-gray-200 dark:border-[#263248] rounded-lg text-xs font-mono text-gray-700 break-all">
              {webhookUrl}
            </div>
            <button
              onClick={() => handleCopy(webhookUrl)}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-sm transition-colors shrink-0"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Webhook Secret */}
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">Webhook Secret</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#182234] border border-gray-200 dark:border-[#263248] rounded-lg text-xs font-mono text-gray-700 break-all">
              {webhookSecret}
            </div>
            <button
              onClick={() => handleCopy(webhookSecret)}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-3 rounded-lg text-sm transition-colors shrink-0"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">Use this secret to verify webhook signatures</p>
        </div>

        {/* Setup instructions */}
        <div className="bg-blue-50 dark:bg-[#151E3A] border border-blue-100 dark:border-[#1E3A6E] rounded-lg p-4">
          <p className="text-sm font-semibold text-[#111824] mb-2">
            Setup instructions for {provider.name}
          </p>
          <ol className="text-sm text-gray-600 dark:text-[#C7CFDB] space-y-1.5 list-decimal list-inside">
            {provider.webhookInstructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}
