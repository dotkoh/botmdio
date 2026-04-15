"use client";

import Image from "next/image";
import { MessageSquare } from "lucide-react";

interface ChannelConfig {
  label: string;
  icon: string;
}

const channelDisplay: Record<string, ChannelConfig> = {
  whatsapp: { label: "Open WhatsApp", icon: "/channels/whatsapp.svg" },
  messenger: { label: "Open Messenger", icon: "/channels/messenger.svg" },
  viber: { label: "Open Viber", icon: "/channels/viber.svg" },
  instagram: { label: "Open Instagram", icon: "/channels/instagram.svg" },
  line: { label: "Open LINE", icon: "/channels/line.svg" },
};

interface WidgetPreviewProps {
  channels: Record<string, string>;
  logoUrl: string | null;
  onAddWidget: () => void;
}

function DefaultIcon({ size = 18 }: { size?: number }) {
  return <MessageSquare size={size} className="text-white" />;
}

function LogoOrIcon({ logoUrl, size, rounded }: { logoUrl: string | null; size: number; rounded: string }) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt="Logo"
        width={size}
        height={size}
        className={`w-full h-full object-cover ${rounded}`}
      />
    );
  }
  return <DefaultIcon size={Math.round(size * 0.45)} />;
}

export default function WidgetPreview({ channels, logoUrl, onAddWidget }: WidgetPreviewProps) {
  const activeChannels = Object.entries(channels).filter(
    ([, url]) => url.trim() !== ""
  );

  const isSingleChannel = activeChannels.length === 1;
  const singleChannelKey = isSingleChannel ? activeChannels[0][0] : null;
  const singleChannelUrl = isSingleChannel ? activeChannels[0][1] : null;
  const singleChannelIcon = singleChannelKey
    ? channelDisplay[singleChannelKey]?.icon
    : null;

  function getFullUrl(url: string) {
    return url.startsWith("http") ? url : `https://${url}`;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-[#111824] mb-4">
        Preview your widget
      </h3>

      {/* Add widget button */}
      <button
        onClick={onAddWidget}
        className="w-full border border-blue-200 dark:border-[#2B3B59] rounded-lg py-2.5 px-4 text-center text-sm text-blue-600 dark:text-[#86A8FF] font-medium mb-4 hover:bg-blue-50 dark:hover:bg-[rgba(91,124,255,0.08)] transition-colors"
      >
        Add widget to your website
      </button>

      {/* Widget mockup — light: blue tint shell, dark: dark navy shell */}
      <div className="bg-blue-50/50 dark:bg-[#182131] border border-blue-100 dark:border-[#24324A] rounded-2xl p-4">
        {/* Single channel: just show the fab that links directly */}
        {isSingleChannel && singleChannelUrl ? (
          <div className="flex justify-end">
            <a
              href={getFullUrl(singleChannelUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] overflow-hidden dark:ring-1 dark:ring-white/[0.08]"
            >
              {logoUrl ? (
                <Image src={logoUrl} alt="" width={56} height={56} className="w-14 h-14 object-cover rounded-full" />
              ) : (
                <Image src={singleChannelIcon!} alt="" width={56} height={56} className="w-14 h-14" />
              )}
            </a>
          </div>
        ) : (
          <>
            {/* Widget card */}
            <div className="bg-white dark:bg-[#0F172A] rounded-xl shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-[#24324A] overflow-hidden max-w-xs mx-auto">
              {/* Header — light: brand blue, dark: deep navy with blue accent */}
              <div className="bg-[#005ABF] dark:bg-[#12203A] px-4 py-5 dark:border-b dark:border-[#1E3A6E]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 overflow-hidden bg-white/20 dark:bg-[#1E3A6E]">
                  <LogoOrIcon logoUrl={logoUrl} size={36} rounded="rounded-lg" />
                </div>
                <p className="text-white dark:text-[#F8FAFC] text-sm font-semibold">
                  Mary Mediatrix Medical Center
                </p>
              </div>

              {/* Channel links */}
              {activeChannels.length > 0 && (
                <div className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#111824] dark:text-[#F8FAFC] mb-3">
                    Chat with us through:
                  </p>
                  <div className="space-y-2">
                    {activeChannels.map(([key, url]) => {
                      const channel = channelDisplay[key];
                      if (!channel) return null;
                      return (
                        <a
                          key={key}
                          href={getFullUrl(url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 border border-gray-200 dark:border-[#24324A] rounded-lg px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#182234] transition-colors cursor-pointer"
                        >
                          <Image
                            src={channel.icon}
                            alt=""
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-md"
                          />
                          <span className="text-sm text-[#111824] dark:text-[#C7D2E5]">
                            {channel.label}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeChannels.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-[#C7D2E5]">
                  Enter a channel URL to preview
                </div>
              )}

              {/* Footer */}
              <div className="px-4 py-3 text-center">
                <span className="text-xs text-gray-400 dark:text-[#7E8AA3]">
                  Powered by <span className="font-medium">Bot MD</span>
                </span>
              </div>
            </div>

            {/* Chat bubble */}
            <div className="flex justify-end mt-3">
              <div className="w-12 h-12 bg-[#005ABF] dark:bg-[#1560D1] rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:ring-1 dark:ring-white/[0.08] overflow-hidden">
                <LogoOrIcon logoUrl={logoUrl} size={48} rounded="rounded-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
