"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  formProviders,
  mockConnectedProviders,
  mockIntegratedForms,
  ConnectedFormProvider,
  FormProviderDefinition,
} from "@/data/form-provider-data";
import WebhookConnectModal from "@/components/form-providers/WebhookConnectModal";
import { MoreVertical, Copy, Check } from "lucide-react";

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function FormProvidersPage() {
  const [connections, setConnections] = useState<ConnectedFormProvider[]>(mockConnectedProviders);
  const [connectProvider, setConnectProvider] = useState<FormProviderDefinition | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleConnect(providerId: string) {
    const existing = connections.find((c) => c.provider_id === providerId);
    if (existing) {
      setConnectProvider(null);
      return;
    }
    const newConnection: ConnectedFormProvider = {
      id: `cp_${Date.now()}`,
      provider_id: providerId,
      webhook_url: `https://nova-api.production.botmd.io/forms/${providerId}/${Math.random().toString(36).slice(2, 14)}/callback`,
      webhook_secret: `whsec_${Math.random().toString(36).slice(2, 18)}`,
      status: "connected",
      date_added: new Date().toISOString(),
      last_received_at: null,
      forms_count: 0,
    };
    setConnections((prev) => [...prev, newConnection]);
    setConnectProvider(null);
  }

  function handleDisconnect(id: string) {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    setOpenMenu(null);
  }

  async function copyWebhook(id: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Providers</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          Connect external form providers via webhook. All forms configured with the webhook URL will automatically appear in your{" "}
          <Link href="/forms" className="text-blue-600 hover:underline">
            Survey Data
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {formProviders.map((provider) => {
          const connection = connections.find((c) => c.provider_id === provider.id);
          const formCount = mockIntegratedForms.filter((f) => f.provider_id === provider.id).length;
          const isConnected = !!connection;

          return (
            <div key={provider.id} className="bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] overflow-hidden">
              {/* Provider header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <Image src={provider.icon} alt="" width={40} height={40} className="w-10 h-10 rounded-lg" />
                  <div>
                    <div className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">{provider.name}</div>
                    <div className="text-xs text-gray-400 dark:text-[#8E99AB]">{provider.description}</div>
                  </div>
                </div>
                {!isConnected && (
                  <button
                    onClick={() => setConnectProvider(provider)}
                    className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              {/* Connection details */}
              {connection && (
                <div className="border border-gray-200 dark:border-[#263248] rounded-lg p-4 mx-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#111824] dark:text-[#F5F7FB]">Webhook connection</span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === connection.id ? null : connection.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#182234] rounded-md transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === connection.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[140px]">
                          <button
                            onClick={() => handleDisconnect(connection.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-[#2D1818] transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400 dark:text-[#8E99AB]">Status</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-[#163826] dark:text-[#7EE2A8]">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400 dark:text-[#8E99AB]">Date Added</span>
                      <span className="text-gray-700 dark:text-[#C7CFDB]">
                        {new Date(connection.date_added).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400 dark:text-[#8E99AB]">Forms integrated</span>
                      <span className="text-gray-700 dark:text-[#C7CFDB] font-medium">{formCount}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400 dark:text-[#8E99AB]">Last received</span>
                      <span className="text-gray-700 dark:text-[#C7CFDB]">{formatDate(connection.last_received_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-36 text-gray-400 dark:text-[#8E99AB] shrink-0 pt-0.5">Webhook URL</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <code className="text-xs text-gray-700 dark:text-[#C7CFDB] font-mono truncate flex-1">{connection.webhook_url}</code>
                        <button
                          onClick={() => copyWebhook(connection.id, connection.webhook_url)}
                          className="p-1.5 text-gray-400 hover:text-[#4361EE] hover:bg-blue-50 dark:hover:bg-[#151E3A] rounded-md transition-colors shrink-0"
                          title="Copy webhook URL"
                        >
                          {copiedId === connection.id ? (
                            <Check size={12} className="text-green-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-400 dark:text-[#8E99AB] mt-6 max-w-3xl">
        View our{" "}
        <a href="https://api.botmd.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          API Documentation
        </a>
        . If you need to add a custom form provider, please reach out to{" "}
        <a href="mailto:support@botmd.io" className="text-blue-600 hover:underline">
          support@botmd.io
        </a>
      </p>

      <WebhookConnectModal
        open={connectProvider !== null}
        provider={connectProvider}
        onClose={() => setConnectProvider(null)}
        onConnect={handleConnect}
      />
    </div>
  );
}
