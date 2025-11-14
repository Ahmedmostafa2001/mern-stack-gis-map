'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthProvider";

// Dynamic import: must be client-only for Cesium
const AddPlace = dynamic(() => import('@/components/dashboard/AddPlace'), { ssr: false });

export default function AddPlacePage() {
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
            <div className="p-8 bg-gray-50 h-full">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">🏗️ Add a New Building</h1>
                <AddPlace />
            </div>
        </DashboardLayout>
    );
}
