"use client";

import { CalendarIntegration, CalendarProvider } from "@/data/calendar-types";
import { ProviderDefinition } from "@/data/calendar-types";
import ConnectedAccountCard from "./ConnectedAccountCard";
import {
  CalendarDays,
  Grid3X3,
  Bird,
  Stethoscope,
  Plus,
} from "lucide-react";

const providerIcons: Record<CalendarProvider, typeof CalendarDays> = {
  acuity: CalendarDays,
  bizbox: Grid3X3,
  hummingbird: Bird,
  plato: Stethoscope,
};

const providerIconColors: Record<CalendarProvider, string> = {
  acuity: "bg-blue-100 text-blue-600",
  bizbox: "bg-indigo-100 text-indigo-600",
  hummingbird: "bg-amber-100 text-amber-600",
  plato: "bg-purple-100 text-purple-600",
};

interface ProviderCardProps {
  provider: ProviderDefinition;
  integrations: CalendarIntegration[];
  onConnect: (providerId: CalendarProvider) => void;
  onAddAccount: (providerId: CalendarProvider) => void;
  onRefresh: (integrationId: string) => void;
  onDisconnect: (integrationId: string) => void;
  onViewDetail: (providerId: CalendarProvider) => void;
}

export default function ProviderCard({
  provider,
  integrations,
  onConnect,
  onAddAccount,
  onRefresh,
  onDisconnect,
  onViewDetail,
}: ProviderCardProps) {
  const Icon = providerIcons[provider.id] || CalendarDays;
  const iconColor = providerIconColors[provider.id] || "bg-gray-100 text-gray-600";
  const isConnected = integrations.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-5 py-4 ${
          isConnected ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
        }`}
        onClick={() => isConnected && onViewDetail(provider.id)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}
          >
            <Icon size={18} />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {provider.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(provider.id);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <CalendarDays size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddAccount(provider.id);
                }}
                className="w-8 h-8 bg-[#4361EE] hover:bg-[#3651DE] text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => onConnect(provider.id)}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Connected accounts */}
      {integrations.map((integration) => (
        <ConnectedAccountCard
          key={integration.id}
          integration={integration}
          onRefresh={onRefresh}
          onDisconnect={onDisconnect}
        />
      ))}
    </div>
  );
}
