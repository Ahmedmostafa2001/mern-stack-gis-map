'use client';

import React from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthProvider";
import Stats from "@/components/dashboard/Stats"; // Adjust import path as needed

export default function StatsPage() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Checking authentication...</p>
          </div>
        </div>
    );
  }

  if (!token) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
      <DashboardLayout className="bg-gray-100 h-full overflow-visible">
        <div className="p-8 bg-gray-50 h-full  w-screen">
          {/* Main Stats Component */}
          <Stats />
        </div>
      </DashboardLayout>
  );
}
