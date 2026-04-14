"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import WidgetPreview from "@/components/chat-widget/WidgetPreview";
import EmbedCode from "@/components/chat-widget/EmbedCode";

interface ChannelDefinition {
  key: string;
  label: string;
  placeholder: string;
  tooltip: string;
}

const channelDefinitions: ChannelDefinition[] = [
  {
    key: "whatsapp",
    label: "WhatsApp URL",
    placeholder: "wa.me/<PHONE_NUMBER>?text=Hello",
    tooltip: "Enter your WhatsApp number in international format without + or spaces. Example: wa.me/6591234567?text=Hello",
  },
  {
    key: "messenger",
    label: "Messenger URL",
    placeholder: "m.me/<PAGE_ID>?text=Hello",
    tooltip: "Enter your Facebook Page ID or username. Example: m.me/YourPageName?text=Hello",
  },
  {
    key: "viber",
    label: "Viber URL",
    placeholder: "viber.me/<VIBER_URI>",
    tooltip: "Enter your Viber public account URI. Example: viber.me/YourBotName",
  },
  {
    key: "instagram",
    label: "Instagram URL",
    placeholder: "ig.me/m/<USERNAME>",
    tooltip: "Enter your Instagram username. Example: ig.me/m/yourusername",
  },
  {
    key: "line",
    label: "Line URL",
    placeholder: "line.me/ti/p/<LINE_ID>",
    tooltip: "Enter your LINE ID. Example: line.me/ti/p/@yourlineid",
  },
];

export default function ChatWidgetPage() {
  const [channels, setChannels] = useState<Record<string, string>>({
    whatsapp: "",
    messenger: "",
    viber: "",
    instagram: "",
    line: "",
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  function updateChannel(key: string, value: string) {
    setChannels((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat Widget</h1>
        <p className="text-sm text-gray-500 mt-1">
          Customize your chat widget and easily embed it on your website
        </p>
      </div>

      <div className="flex gap-8">
        {/* Left: Configuration */}
        <div className="flex-1 max-w-2xl">
          {/* Channel URL inputs */}
          <div className="space-y-5 mb-8">
            {channelDefinitions.map((channel) => (
              <div key={channel.key}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    {channel.label}
                  </label>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveTooltip(
                          activeTooltip === channel.key ? null : channel.key
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <HelpCircle size={14} />
                    </button>
                    {activeTooltip === channel.key && (
                      <div className="absolute left-6 top-0 z-30 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-64 shadow-lg">
                        {channel.tooltip}
                        <div className="absolute left-[-6px] top-2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-gray-900" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-sm text-gray-500 select-none">
                    https://
                  </div>
                  <input
                    type="text"
                    value={channels[channel.key]}
                    onChange={(e) => updateChannel(channel.key, e.target.value)}
                    placeholder={channel.placeholder}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-[#4361EE] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Embed code */}
          <EmbedCode channels={channels} />
        </div>

        {/* Right: Preview */}
        <div className="w-80 shrink-0">
          <WidgetPreview channels={channels} />
        </div>
      </div>
    </div>
  );
}
