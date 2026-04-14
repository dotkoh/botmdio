"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface MetaSignInModalProps {
  open: boolean;
  providerName: string;
  onClose: () => void;
  onConnect: (accountName: string) => void;
}

const mockBusinesses = [
  { name: "Mary Mediatrix Medical Center", id: "869376406269850", initial: "M", color: "bg-blue-500" },
  { name: "Mount Grace Hospital", id: "1278508485628675", initial: "M", color: "bg-green-500" },
  { name: "St. Luke's Medical Center", id: "423621146604924", initial: "S", color: "bg-purple-500" },
];

export default function MetaSignInModal({ open, providerName, onClose, onConnect }: MetaSignInModalProps) {
  const [step, setStep] = useState<"welcome" | "select" | "connecting">("welcome");
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (step === "welcome") {
      setStep("select");
    } else if (step === "select" && selected) {
      setStep("connecting");
      setTimeout(() => {
        const biz = mockBusinesses.find((b) => b.id === selected);
        onConnect(biz?.name || "Connected Account");
        reset();
      }, 2000);
    }
  }

  function reset() {
    setStep("welcome");
    setSelected(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      width="w-[520px]"
    >
      {/* Mock Meta header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 -mt-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2z" fill="#0866FF"/>
          <path d="M15.5 8.5c-1.5 0-2.5 1-3.5 2.5-1-1.5-2-2.5-3.5-2.5C6.5 8.5 5 10 5 12.5c0 4 4.5 7 7 8.5 2.5-1.5 7-4.5 7-8.5 0-2.5-1.5-4-3.5-4z" fill="white"/>
        </svg>
        <span className="text-sm font-semibold text-gray-700">Facebook Login for Business</span>
      </div>

      {step === "welcome" && (
        <div className="py-4">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg h-32 flex items-center justify-center mb-4">
            <div className="text-4xl">🤝</div>
          </div>

          <h3 className="text-lg font-semibold text-[#111824] mb-2">
            Seamlessly connect your account to Bot MD
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            This onboarding process will walk you through registering and connecting your business account to your partner.
          </p>

          <p className="text-sm font-semibold text-[#111824] mb-2">You&apos;ll be able to:</p>
          <ul className="text-sm text-gray-500 space-y-1 mb-6 list-disc list-inside">
            <li>Communicate with customers at scale via {providerName}</li>
            <li>Handle large volumes of messages with ease</li>
            <li>Reduce costs associated with traditional SMS or voice calls</li>
          </ul>

          <div className="text-xs text-gray-400 border-t border-gray-200 pt-3">
            By continuing, you agree to the Meta Hosting Terms for Cloud API and the Meta Terms for {providerName} Business.
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={handleClose} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
              Cancel
            </button>
            <button onClick={handleContinue} className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "select" && (
        <div className="py-4">
          <h3 className="text-lg font-semibold text-[#111824] mb-4">
            Which business portfolio would you like to connect to Bot MD Integration?
          </h3>

          <div className="space-y-2 mb-6">
            {mockBusinesses.map((biz) => (
              <label
                key={biz.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selected === biz.id ? "border-[#4361EE] bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="business"
                  value={biz.id}
                  checked={selected === biz.id}
                  onChange={() => setSelected(biz.id)}
                  className="sr-only"
                />
                <div className={`w-8 h-8 rounded-lg ${biz.color} text-white flex items-center justify-center text-sm font-semibold`}>
                  {biz.initial}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#111824]">{biz.name}</div>
                  <div className="text-xs text-gray-400">ID: {biz.id}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="text-xs text-gray-400 mb-4">
            By continuing, Bot MD Integration will receive ongoing access to the information you share and Meta will record when Bot MD Integration accesses it.
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={handleClose} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
              Not Now
            </button>
            <button
              onClick={handleContinue}
              disabled={!selected}
              className="bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "connecting" && (
        <div className="py-12 text-center">
          <Loader2 size={32} className="animate-spin text-[#4361EE] mx-auto mb-4" />
          <p className="text-sm font-medium text-[#111824]">Connecting to Meta Business Manager...</p>
          <p className="text-xs text-gray-400 mt-1">This may take a few seconds</p>
        </div>
      )}
    </Modal>
  );
}
