"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          collapsed ? "ml-20" : "ml-60"
        }`}
      >
        <Header />
        <main className="px-10 pt-6 pb-16 flex-1">{children}</main>
      </div>
    </div>
  );
}
