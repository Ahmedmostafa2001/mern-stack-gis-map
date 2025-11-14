'use client';
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-bg-body-panel text-white">
      <div className="flex flex-1 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}
