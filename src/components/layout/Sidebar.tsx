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
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Mail,
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 z-10 flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className={`py-4 border-b border-gray-200 ${collapsed ? "px-4 flex justify-center" : "px-5"}`}>
        {collapsed ? (
          <Image
            src="/botmd-icon.png"
            alt="Bot MD"
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
        ) : (
          <Image
            src="/botmd-logo.png"
            alt="Bot MD"
            width={140}
            height={44}
            className="h-9 w-auto"
            priority
          />
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-3 ${collapsed ? "px-2" : "px-3"}`}>
        {navSections.map((section, sectionIdx) => (
          <div key={section.label} className="mb-1">
            {!collapsed && (
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5 mt-4">
                {section.label}
              </div>
            )}
            {collapsed && sectionIdx > 0 && (
              <div className="border-b border-gray-100 mx-3 my-3" />
            )}
            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors ${
                    collapsed ? "justify-center px-2" : "px-3"
                  } ${
                    isActive
                      ? "bg-blue-50 text-[#4361EE] font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={isActive ? "text-[#4361EE]" : "text-gray-500"}
                  />
                  {!collapsed && (
                    <span className="text-[13px]">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: Collapse toggle + Help + Support */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div
          className={`flex items-center ${
            collapsed ? "flex-col gap-3" : "justify-between"
          }`}
        >
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight size={20} />
            ) : (
              <ChevronsLeft size={20} />
            )}
          </button>

          <div
            className={`flex items-center ${
              collapsed ? "flex-col gap-3" : "gap-1"
            }`}
          >
            <a
              href="https://guide.botmd.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help Guide"
            >
              <HelpCircle size={20} />
            </a>
            <a
              href="mailto:support@botmd.io"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Contact Support"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
