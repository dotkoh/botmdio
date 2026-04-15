"use client";

import { useState, useRef } from "react";
import { HelpCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import WidgetPreview from "@/components/chat-widget/WidgetPreview";
import EmbedCode from "@/components/chat-widget/EmbedCode";
import Modal from "@/components/ui/Modal";

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
    label: "LINE URL",
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
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
  }

  function removeLogo() {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updateChannel(key: string, value: string) {
    setChannels((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Chat Widget</h1>
        <p className="text-[16px] text-gray-500 mt-1">
          Customize your chat widget and easily embed it on your website
        </p>
      </div>

      <div className="flex gap-8">
        {/* Left: Configuration */}
        <div className="flex-1 max-w-2xl">
          {/* Logo upload */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Widget Logo
            </label>
            <p className="text-xs text-gray-400 mb-3">
              Upload your hospital or clinic logo (PNG or JPEG). Recommended size: 512 x 512px. This will appear in the widget header and as the chat bubble icon.
            </p>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="relative">
                  <Image
                    src={logoUrl}
                    alt="Widget logo"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#4361EE] hover:bg-blue-50 transition-colors"
                >
                  <Upload size={20} className="text-gray-400" />
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {logoUrl ? "Change Logo" : "Upload Logo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-5">
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
                  <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-sm text-gray-500 select-none">
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
        </div>

        {/* Right: Preview */}
        <div className="w-80 shrink-0">
          <WidgetPreview
            channels={channels}
            logoUrl={logoUrl}
            onAddWidget={() => setEmbedModalOpen(true)}
          />
        </div>
      </div>

      {/* Embed Code Modal */}
      <Modal
        open={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
        title="Embed Code"
        width="w-[640px]"
      >
        <EmbedCode channels={channels} />
      </Modal>
    </div>
  );
}
