"use client";

import { useState } from "react";
import Image from "next/image";
import { formProviders, mockFormAccounts, ConnectedFormAccount, FormProviderDefinition } from "@/data/form-provider-data";
import WebhookConnectModal from "@/components/form-providers/WebhookConnectModal";
import { Plus, MoreVertical, Copy } from "lucide-react";

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function FormProvidersPage() {
  const [accounts, setAccounts] = useState<ConnectedFormAccount[]>(mockFormAccounts);
  const [connectProvider, setConnectProvider] = useState<FormProviderDefinition | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleConnect(providerId: string, name: string) {
    const newAccount: ConnectedFormAccount = {
      id: `fa_${Date.now()}`,
      provider_id: providerId,
      name,
      webhook_url: `https://nova-api.production.botmd.io/forms/${providerId}/${Math.random().toString(36).slice(2, 14)}/callback`,
      webhook_secret: `whsec_${Math.random().toString(36).slice(2, 18)}`,
      status: "connected",
      date_added: new Date().toISOString(),
      last_received_at: null,
      submissions_count: 0,
    };
    setAccounts((prev) => [...prev, newAccount]);
    setConnectProvider(null);
  }

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
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
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Form Providers</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          Connect external form providers to receive survey and form submissions in Bot MD
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {formProviders.map((provider) => {
          const providerAccounts = accounts.filter((a) => a.provider_id === provider.id);
          const hasAccounts = providerAccounts.length > 0;

          return (
            <div key={provider.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Provider header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <Image src={provider.icon} alt="" width={40} height={40} className="w-10 h-10 rounded-lg" />
                  <div>
                    <div className="text-sm font-medium text-[#111824]">{provider.name}</div>
                    <div className="text-xs text-gray-400">{provider.description}</div>
                  </div>
                </div>
                {hasAccounts ? (
                  <button
                    onClick={() => setConnectProvider(provider)}
                    className="w-8 h-8 bg-[#4361EE] hover:bg-[#3651DE] text-white rounded-lg flex items-center justify-center transition-colors"
                    title="Add another form"
                  >
                    <Plus size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setConnectProvider(provider)}
                    className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              {/* Connected forms */}
              {providerAccounts.map((account) => (
                <div key={account.id} className="border border-gray-200 dark:border-[#263248] rounded-lg p-4 mx-4 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#111824]">{account.name}</span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === account.id ? null : account.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenu === account.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#121A2B] rounded-xl border border-gray-200 dark:border-[#263248] shadow-xl z-30 min-w-[140px]">
                          <button
                            onClick={() => handleDisconnect(account.id)}
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
                      <span className="w-36 text-gray-400">Status</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        account.status === "connected" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {account.status === "connected" ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400">Date Added</span>
                      <span className="text-gray-700">
                        {new Date(account.date_added).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400">Submissions</span>
                      <span className="text-gray-700 font-medium">{account.submissions_count}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-36 text-gray-400">Last received</span>
                      <span className="text-gray-700">{formatDate(account.last_received_at)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-36 text-gray-400 shrink-0 pt-0.5">Webhook URL</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <code className="text-xs text-gray-700 font-mono truncate flex-1">{account.webhook_url}</code>
                        <button
                          onClick={() => copyWebhook(account.id, account.webhook_url)}
                          className="p-1.5 text-gray-400 hover:text-[#4361EE] hover:bg-blue-50 rounded-md transition-colors shrink-0"
                          title="Copy webhook URL"
                        >
                          {copiedId === account.id ? (
                            <span className="text-xs text-green-600 font-medium px-1">Copied</span>
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-400 mt-6 max-w-3xl">
        View our{" "}
        <a href="https://api.botmd.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          API Documentation
        </a>
        . If you need to add a custom form provider, please reach out to{" "}
        <a href="mailto:support@botmd.io" className="text-blue-600 hover:underline">
          support@botmd.io
        </a>
      </p>

      {/* Connect Modal */}
      <WebhookConnectModal
        open={connectProvider !== null}
        provider={connectProvider}
        onClose={() => setConnectProvider(null)}
        onConnect={handleConnect}
      />
    </div>
  );
}
