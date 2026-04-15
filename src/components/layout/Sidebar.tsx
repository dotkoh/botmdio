"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import {
  Inbox,
  Users,
  CalendarDays,
  MessageSquare,
  LayoutTemplate,
  Bot,
  BarChart3,
  UserCog,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  Mail,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  customIcon?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
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
      { name: "Appointments", href: "/appointments", customIcon: "/icons/appointments.svg" },
      { name: "Calendars", href: "/calendars", icon: CalendarDays },
    ],
  },
  {
    label: "MESSAGING",
    items: [
      { name: "Channels", href: "/channels", icon: MessageSquare },
      { name: "Templates", href: "/templates", icon: LayoutTemplate },
      { name: "Chat Widget", href: "/chat-widget", customIcon: "/icons/chat-widget.svg" },
    ],
  },
  {
    label: "AUTOMATION",
    items: [
      { name: "AI Agents", href: "/ai-agents", icon: Bot },
      { name: "Workflows", href: "/workflows", customIcon: "/icons/workflows.svg" },
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
      className={`fixed left-0 top-0 h-screen bg-gray-50 dark:bg-[#13151e] border-r border-gray-200 dark:border-gray-800 z-10 flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className={`py-4 ${collapsed ? "px-4 flex justify-center" : "px-5"}`}>
        {collapsed ? (
          <Image
            src="/botmd-icon.png"
            alt="Bot MD"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
        ) : (
          <Image
            src="/botmd-logo.png"
            alt="Bot MD"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto py-3 ${collapsed ? "px-2" : "px-3"}`}>
        {navSections.map((section, sectionIdx) => (
          <div key={section.label}>
            {/* Section divider */}
            {sectionIdx > 0 && (
              <div className={`border-b border-gray-200 dark:border-gray-700 my-2 ${collapsed ? "mx-3" : "mx-2"}`} />
            )}

            {!collapsed && (
              <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1.5 mt-3">
                {section.label}
              </div>
            )}

            {section.items.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const iconColor = isActive ? "text-[#4361EE]" : "text-[#111824] dark:text-gray-300";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors ${
                    collapsed ? "justify-center px-2" : "px-3"
                  } ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-[#4361EE] font-semibold"
                      : "text-[#111824] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.customIcon ? (
                    <div
                      className="w-[22px] h-[22px] shrink-0"
                      style={{
                        WebkitMaskImage: `url(${item.customIcon})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${item.customIcon})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        backgroundColor: "currentColor",
                      }}
                    />
                  ) : Icon ? (
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2 : 1.7}
                      className={iconColor}
                    />
                  ) : null}
                  {!collapsed && (
                    <span className="text-[15px] font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: Collapse toggle + Help + Support */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-3">
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
