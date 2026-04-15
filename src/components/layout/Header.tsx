"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#1a1d27] px-10 py-3 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-medium text-[#111824] dark:text-gray-200">
          Mary Mediatrix Medical Center (Org ID: mediatrix)
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-semibold">
                DK
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dot Koh
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl z-30 min-w-[200px]">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="text-sm font-medium text-[#111824] dark:text-gray-200">Dot Koh</div>
                  <div className="text-xs text-gray-400">dot@botmd.io</div>
                </div>
                <button
                  onClick={() => { toggleTheme(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
