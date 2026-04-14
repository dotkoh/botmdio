"use client";

import { MessageSquare, Send } from "lucide-react";

interface ChannelConfig {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}

const channelDisplay: Record<string, ChannelConfig> = {
  whatsapp: { id: "whatsapp", name: "WhatsApp", label: "Open WhatsApp", color: "#25D366", bgColor: "bg-green-50", icon: "🟢" },
  messenger: { id: "messenger", name: "Facebook Messenger", label: "Open Facebook Messenger", color: "#0084FF", bgColor: "bg-blue-50", icon: "🔵" },
  viber: { id: "viber", name: "Viber", label: "Open Viber", color: "#7360F2", bgColor: "bg-purple-50", icon: "🟣" },
  instagram: { id: "instagram", name: "Instagram", label: "Open Instagram", color: "#E1306C", bgColor: "bg-pink-50", icon: "📸" },
  line: { id: "line", name: "LINE", label: "Open LINE", color: "#00C300", bgColor: "bg-green-50", icon: "🟩" },
};

interface WidgetPreviewProps {
  channels: Record<string, string>;
}

export default function WidgetPreview({ channels }: WidgetPreviewProps) {
  const activeChannels = Object.entries(channels).filter(
    ([, url]) => url.trim() !== ""
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Preview your widget
      </h3>

      {/* Add widget button */}
      <div className="border border-blue-200 rounded-lg py-2.5 px-4 text-center text-sm text-blue-600 font-medium mb-4 cursor-default">
        Add widget to your website
      </div>

      {/* Widget mockup */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
        {/* Widget card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-xs mx-auto">
          {/* Dark header */}
          <div className="bg-[#1B2559] px-4 py-5 flex items-center justify-between">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageSquare size={18} className="text-white" />
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#1B2559]" />
              <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#1B2559]" />
              <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#1B2559]" />
            </div>
          </div>

          {/* Message input area */}
          <div className="px-4 py-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              How can we help you today?
            </p>
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-400 flex-1">
                Type your message here
              </span>
              <div className="w-7 h-7 bg-[#4361EE] rounded-md flex items-center justify-center">
                <Send size={12} className="text-white" />
              </div>
            </div>
          </div>

          {/* Channel links */}
          {activeChannels.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Talk to us elsewhere
              </p>
              <div className="space-y-2">
                {activeChannels.map(([key, url]) => {
                  const channel = channelDisplay[key];
                  if (!channel) return null;
                  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
                  return (
                    <a
                      key={key}
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${channel.bgColor}`}
                      >
                        {channel.icon}
                      </div>
                      <span className="text-sm text-gray-700">
                        {channel.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 text-center">
            <span className="text-xs text-gray-400">
              Powered by <span className="font-medium">Bot MD</span>
            </span>
          </div>
        </div>

        {/* Chat bubble */}
        <div className="flex justify-end mt-3">
          <div className="w-12 h-12 bg-[#1B2559] rounded-full flex items-center justify-center shadow-lg">
            <MessageSquare size={20} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
