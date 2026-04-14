"use client";

import { useState } from "react";
import Image from "next/image";
import { channelProviders, mockConnectedAccounts } from "@/data/channel-mock-data";
import { ConnectedAccount, ChannelProvider } from "@/data/channel-types";
import ConnectedAccountCard from "@/components/channels/ConnectedAccountCard";
import MetaSignInModal from "@/components/channels/MetaSignInModal";
import ApiKeyModal from "@/components/channels/ApiKeyModal";
import { Plus } from "lucide-react";

export default function ChannelsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(mockConnectedAccounts);
  const [metaModalOpen, setMetaModalOpen] = useState(false);
  const [metaProvider, setMetaProvider] = useState<ChannelProvider | null>(null);
  const [apiKeyProvider, setApiKeyProvider] = useState<ChannelProvider | null>(null);

  const messagingProviders = channelProviders.filter((p) => p.category === "messaging");
  const oneWayProviders = channelProviders.filter((p) => p.category === "one_way");

  function handleConnect(provider: ChannelProvider) {
    if (provider.authMethod === "meta_oauth") {
      setMetaProvider(provider);
      setMetaModalOpen(true);
    } else {
      setApiKeyProvider(provider);
    }
  }

  function handleMetaConnect(accountName: string) {
    if (!metaProvider) return;
    const newAccount: ConnectedAccount = {
      id: `ch_${Date.now()}`,
      provider_id: metaProvider.id,
      name: accountName,
      account_id: String(Math.floor(Math.random() * 9000000000000) + 1000000000000),
      page_name: accountName,
      page_url: `https://facebook.com/${accountName.replace(/\s/g, "")}`,
      status: "connected",
      is_enabled: true,
      date_added: new Date().toISOString(),
      token_expiry: null,
    };
    setAccounts((prev) => [...prev, newAccount]);
    setMetaModalOpen(false);
    setMetaProvider(null);
  }

  function handleApiKeyConnect(providerId: string) {
    const provider = channelProviders.find((p) => p.id === providerId);
    if (!provider) return;
    const newAccount: ConnectedAccount = {
      id: `ch_${Date.now()}`,
      provider_id: providerId,
      name: `${provider.name} Account`,
      account_id: String(Math.floor(Math.random() * 9000000000) + 1000000000),
      status: "connected",
      is_enabled: true,
      date_added: new Date().toISOString(),
      token_expiry: null,
    };
    setAccounts((prev) => [...prev, newAccount]);
    setApiKeyProvider(null);
  }

  function handleToggle(id: string) {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_enabled: !a.is_enabled } : a))
    );
  }

  function handleDisconnect(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }

  function handleReconnect(id: string) {
    const account = accounts.find((a) => a.id === id);
    if (!account) return;
    const provider = channelProviders.find((p) => p.id === account.provider_id);
    if (provider) handleConnect(provider);
  }

  function renderProviderCard(provider: ChannelProvider) {
    const providerAccounts = accounts.filter((a) => a.provider_id === provider.id);
    const hasAccounts = providerAccounts.length > 0;

    return (
      <div key={provider.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Provider header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Image src={provider.icon} alt="" width={32} height={32} className="w-8 h-8 rounded-md" />
            <span className="text-sm font-medium text-[#111824]">{provider.name}</span>
          </div>
          {hasAccounts ? (
            <button
              onClick={() => handleConnect(provider)}
              className="w-8 h-8 bg-[#4361EE] hover:bg-[#3651DE] text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={16} />
            </button>
          ) : (
            <button
              onClick={() => handleConnect(provider)}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Connect
            </button>
          )}
        </div>

        {/* Connected accounts */}
        {providerAccounts.map((account) => (
          <ConnectedAccountCard
            key={account.id}
            account={account}
            onToggle={handleToggle}
            onDisconnect={handleDisconnect}
            onReconnect={handleReconnect}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Messaging</h1>
        <p className="text-[16px] text-gray-500 mt-2">
          View and manage your clinic&apos;s integrated messaging channels
        </p>
      </div>

      {/* Chat channels */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[#111824] mb-3">Chat channels</h3>
        <div className="space-y-4 max-w-3xl">
          {messagingProviders.map(renderProviderCard)}
        </div>
      </div>

      {/* One-way channels */}
      <div>
        <h3 className="text-sm font-semibold text-[#111824] mb-3">One-way channels</h3>
        <div className="space-y-4 max-w-3xl">
          {oneWayProviders.map(renderProviderCard)}
        </div>
      </div>

      {/* Meta Sign-In Modal */}
      <MetaSignInModal
        open={metaModalOpen}
        providerName={metaProvider?.name || ""}
        onClose={() => { setMetaModalOpen(false); setMetaProvider(null); }}
        onConnect={handleMetaConnect}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        open={apiKeyProvider !== null}
        provider={apiKeyProvider}
        onClose={() => setApiKeyProvider(null)}
        onConnect={handleApiKeyConnect}
      />
    </div>
  );
}
