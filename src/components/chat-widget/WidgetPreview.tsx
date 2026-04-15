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
        className="w-full border border-blue-200 rounded-lg py-2.5 px-4 text-center text-sm text-blue-600 font-medium mb-4 hover:bg-blue-50 transition-colors"
      >
        Add widget to your website
      </button>

      {/* Widget mockup */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
        {/* Single channel: just show the fab that links directly */}
        {isSingleChannel && singleChannelUrl ? (
          <div className="flex justify-end">
            <a
              href={getFullUrl(singleChannelUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
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
            {/* Widget card - multiple channels */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-xs mx-auto">
              {/* Header with hospital name */}
              <div className="bg-[#005ABF] px-4 py-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 overflow-hidden bg-white/20">
                  <LogoOrIcon logoUrl={logoUrl} size={36} rounded="rounded-lg" />
                </div>
                <p className="text-white text-sm font-medium">
                  Mary Mediatrix Medical Center
                </p>
              </div>

              {/* Channel links */}
              {activeChannels.length > 0 && (
                <div className="px-4 py-4">
                  <p className="text-sm font-semibold text-[#111824] mb-3">
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
                          className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <Image
                            src={channel.icon}
                            alt=""
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-md"
                          />
                          <span className="text-sm text-[#111824]">
                            {channel.label}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeChannels.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  Enter a channel URL to preview
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
              <div className="w-12 h-12 bg-[#005ABF] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <LogoOrIcon logoUrl={logoUrl} size={48} rounded="rounded-full" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
