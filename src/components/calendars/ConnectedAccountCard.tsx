"use client";

import { CalendarIntegration } from "@/data/calendar-types";
import { RefreshCw } from "lucide-react";

interface ConnectedAccountCardProps {
  integration: CalendarIntegration;
  onRefresh: (id: string) => void;
  onDisconnect: (id: string) => void;
}

const statusStyles: Record<string, { badge: string; label: string }> = {
  connected: { badge: "bg-green-100 text-green-700", label: "Connected" },
  error: { badge: "bg-red-100 text-red-700", label: "Error" },
  syncing: { badge: "bg-yellow-100 text-yellow-700", label: "Syncing" },
  disconnected: { badge: "bg-gray-100 text-gray-500", label: "Disconnected" },
};

export default function ConnectedAccountCard({
  integration,
  onRefresh,
  onDisconnect,
}: ConnectedAccountCardProps) {
  const status = statusStyles[integration.status] || statusStyles.disconnected;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-3 ml-4 mr-4 mb-2">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-900 font-medium">
          {integration.account_identifier}
          {integration.account_label && (
            <span className="text-gray-500 font-normal">
              {" "}({integration.account_label})
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefresh(integration.id)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => onDisconnect(integration.id)}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="w-28 text-gray-500">Status</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.badge}`}>
            {status.label}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-28 text-gray-500">Date added</span>
          <span className="text-gray-700">
            {new Date(integration.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-start">
          <span className="w-28 text-gray-500 shrink-0">Webhook URL</span>
          <span className="text-gray-700 text-xs break-all font-mono">
            {integration.webhook_url}
          </span>
        </div>
      </div>
    </div>
  );
}
