"use client";

import { ConnectedAccount } from "@/data/channel-types";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onToggle: (id: string) => void;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
}

export default function ConnectedAccountCard({
  account,
  onToggle,
  onDisconnect,
  onReconnect,
}: ConnectedAccountCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isConnected = account.status === "connected";

  return (
    <div className="border border-gray-200 rounded-lg p-4 mx-4 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[#111824]">{account.name}</span>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              {/* Toggle */}
              <button
                onClick={() => onToggle(account.id)}
                className={`relative w-10 h-6 rounded-full transition-colors ${
                  account.is_enabled ? "bg-[#4361EE]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    account.is_enabled ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </button>
              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-30 min-w-[140px]">
                    <button
                      onClick={() => { onDisconnect(account.id); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => onReconnect(account.id)}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center">
          <span className="w-36 text-gray-400">Account ID</span>
          <span className="text-gray-700">{account.account_id}</span>
        </div>
        {account.page_name && (
          <div className="flex items-center">
            <span className="w-36 text-gray-400">Page Name</span>
            {account.page_url ? (
              <a href={account.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {account.page_name}
              </a>
            ) : (
              <span className="text-gray-700">{account.page_name}</span>
            )}
          </div>
        )}
        {account.phone_number && (
          <div className="flex items-center">
            <span className="w-36 text-gray-400">Phone Number</span>
            <span className="text-gray-700">{account.phone_number}</span>
          </div>
        )}
        <div className="flex items-center">
          <span className="w-36 text-gray-400">Status</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isConnected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-36 text-gray-400">Date Added</span>
          <span className="text-gray-700">
            {new Date(account.date_added).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-36 text-gray-400">Token Expiry Date</span>
          <span className="text-gray-700">{account.token_expiry ? new Date(account.token_expiry).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "No expiry date"}</span>
        </div>
      </div>
    </div>
  );
}
