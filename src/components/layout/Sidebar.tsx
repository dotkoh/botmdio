"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Inbox,
  Users,
  Calendar,
  CalendarDays,
  MessageSquare,
  LayoutTemplate,
  MessageCircle,
  Bot,
  GitBranch,
  BarChart3,
  UserCog,
  Settings,
} from "lucide-react";

const navSections = [
  {
    label: "CUSTOMERS",
    items: [
      { name: "Inbox", href: "/inbox", icon: Inbox },
      { name: "Contacts", href: "/contacts", icon: Users },
    ],
  },
  {
    label: "SCHEDULING",
    items: [
      { name: "Appointments", href: "/appointments", icon: Calendar },
      { name: "Calendars", href: "/calendars", icon: CalendarDays },
    ],
  },
  {
    label: "MESSAGING",
    items: [
      { name: "Channels", href: "/channels", icon: MessageSquare },
      { name: "Templates", href: "/templates", icon: LayoutTemplate },
      { name: "Chat Widget", href: "/chat-widget", icon: MessageCircle },
    ],
  },
  {
    label: "AUTOMATION",
    items: [
      { name: "AI Agents", href: "/ai-agents", icon: Bot },
      { name: "Workflows", href: "/workflows", icon: GitBranch },
    ],
  },
  {
    label: "WORKSPACE SETTINGS",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "User Management", href: "/user-management", icon: UserCog },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-56 h-screen bg-white border-r border-gray-200 z-10 flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200">
        <Image
          src="/botmd-logo.png"
          alt="Bot MD"
          width={120}
          height={40}
          className="h-8 w-auto"
          priority
        />
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              {section.label}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-3 border-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
