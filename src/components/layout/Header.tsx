"use client";

import { Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mary Mediatrix Medical Center{" "}
          <span className="text-gray-400">(Org ID: mediatrix)</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
              DK
            </div>
            <span className="text-sm font-medium text-gray-700">
              Dot Koh
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
