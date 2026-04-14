"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EmbedCodeProps {
  channels: Record<string, string>;
}

export default function EmbedCode({ channels }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);

  const activeChannels = Object.entries(channels).filter(
    ([, url]) => url.trim() !== ""
  );

  const channelKeyMap: Record<string, string> = {
    whatsapp: "whatsappUrl",
    messenger: "messengerUrl",
    viber: "viberUrl",
    instagram: "instagramUrl",
    line: "lineUrl",
  };

  const configLines = activeChannels
    .map(([key, url]) => {
      const configKey = channelKeyMap[key] || key;
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      return `    "${configKey}": "${fullUrl}"`;
    })
    .join(",\n");

  const code = `<div id="chat-widget"></div>

<script src="https://chat-widget.botmd.io/chat-widget.js"></script>

<script>
  const chatWidget = new ChatWidget({
${configLines}
  });
  chatWidget.show();
</script>`;

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Embed code</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Code"}
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-x-auto">
        <pre className="text-sm text-gray-700 font-mono whitespace-pre leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}
