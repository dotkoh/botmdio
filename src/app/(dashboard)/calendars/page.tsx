"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIntegration, CalendarProvider } from "@/data/calendar-types";
import { providers } from "@/data/calendar-providers";
import { mockIntegrations } from "@/data/calendar-mock-data";
import ProviderCard from "@/components/calendars/ProviderCard";
import ConnectModal from "@/components/calendars/ConnectModal";

export default function CalendarsPage() {
  const router = useRouter();
  const [integrations, setIntegrations] =
    useState<CalendarIntegration[]>(mockIntegrations);
  const [connectProvider, setConnectProvider] = useState<CalendarProvider | null>(null);

  const selectedProviderDef = connectProvider
    ? providers.find((p) => p.id === connectProvider) || null
    : null;

  function handleConnect(providerId: string, credentials: Record<string, string>) {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;

    const firstFieldValue = credentials[provider.fields[0].key] || "user@example.com";

    const newIntegration: CalendarIntegration = {
      id: `int_${providerId}_${Date.now()}`,
      org_id: "mediatrix",
      provider: providerId as CalendarProvider,
      provider_name: provider.name,
      account_identifier: firstFieldValue,
      status: "connected",
      webhook_url: `https://nova-api.production.botmd.io/${providerId}/${Math.random().toString(36).slice(2, 14)}/callback`,
      created_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString(),
      is_active: true,
    };

    setIntegrations((prev) => [...prev, newIntegration]);
    setConnectProvider(null);
  }

  function handleDisconnect(integrationId: string) {
    setIntegrations((prev) => prev.filter((i) => i.id !== integrationId));
  }

  function handleRefresh(integrationId: string) {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integrationId
          ? { ...i, last_synced_at: new Date().toISOString() }
          : i
      )
    );
  }

  function handleViewDetail(providerId: CalendarProvider) {
    router.push(`/calendars/${providerId}`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Calendars</h1>
        <p className="text-[16px] text-gray-500 mt-1">
          View and manage your calendar providers
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {providers.map((provider) => {
          const providerIntegrations = integrations.filter(
            (i) => i.provider === provider.id
          );
          return (
            <ProviderCard
              key={provider.id}
              provider={provider}
              integrations={providerIntegrations}
              onConnect={setConnectProvider}
              onAddAccount={setConnectProvider}
              onRefresh={handleRefresh}
              onDisconnect={handleDisconnect}
              onViewDetail={handleViewDetail}
            />
          );
        })}
      </div>

      <p className="text-sm text-gray-400 mt-6 max-w-3xl">
        View our{" "}
        <a
          href="https://api.botmd.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          API Documentation
        </a>
        . If you require assistance with custom integrations, please reach out to{" "}
        <a
          href="mailto:support@botmd.io"
          className="text-blue-600 hover:underline"
        >
          support@botmd.io
        </a>
      </p>

      <ConnectModal
        open={connectProvider !== null}
        provider={selectedProviderDef}
        onClose={() => setConnectProvider(null)}
        onConnect={handleConnect}
      />
    </div>
  );
}
