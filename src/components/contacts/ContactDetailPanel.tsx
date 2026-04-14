"use client";

import { useEffect, useRef } from "react";
import { Contact, ContactProperty } from "@/data/types";
import { X, MessageSquare, Phone, Mail, Calendar, LinkIcon } from "lucide-react";
import ContactTypeBadge from "./ContactTypeBadge";

interface ContactDetailPanelProps {
  contact: Contact | null;
  properties: ContactProperty[];
  onClose: () => void;
}

export default function ContactDetailPanel({
  contact,
  properties,
  onClose,
}: ContactDetailPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (contact) {
      document.addEventListener("mousedown", handleClick);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.body.style.overflow = "";
    };
  }, [contact, onClose]);

  if (!contact) return null;

  const channelIcons: Record<string, typeof MessageSquare> = {
    whatsapp: Phone,
    messenger: MessageSquare,
    webchat: MessageSquare,
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/20">
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-[480px] max-w-[90vw] bg-white shadow-xl border-l border-gray-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {contact.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <ContactTypeBadge type={contact.type} />
              <span className="text-xs text-gray-400 capitalize">
                {contact.source}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Devices */}
          {contact.devices.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Linked Devices
              </h3>
              {contact.devices.map((device) => {
                const Icon = channelIcons[device.channel] || LinkIcon;
                return (
                  <div
                    key={device.device_id}
                    className="flex items-center gap-3 py-2"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Icon size={14} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-900">
                        {device.identifier}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {device.channel}
                        {device.is_primary && " (Primary)"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Properties */}
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Properties
            </h3>
            <div className="space-y-3">
              {properties.map((prop) => {
                const val = contact.properties[prop.key];
                return (
                  <div key={prop.key} className="flex items-start">
                    <div className="w-36 text-sm text-gray-500 shrink-0">
                      {prop.name}
                    </div>
                    <div className="text-sm text-gray-900">
                      {val !== null && val !== undefined
                        ? String(val)
                        : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Contacts */}
          {contact.related_contacts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Related Contacts
              </h3>
              <div className="text-sm text-gray-500">
                {contact.related_contacts.length} linked contact(s)
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="px-6 py-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Activity
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-700">
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-gray-500">Last interaction:</span>
                <span className="text-gray-700">
                  {new Date(contact.last_interaction_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <span className="text-gray-500">Created by:</span>
                <span className="text-gray-700 capitalize">
                  {contact.created_by}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button className="w-full bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View in Inbox
          </button>
        </div>
      </div>
    </div>
  );
}
