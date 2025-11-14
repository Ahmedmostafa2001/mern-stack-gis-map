'use client';
import React from "react";
import SideBar from "@/components/dashboard/SideBar";
import { SidebarProps, Map3DProps } from "@/types/DashboardType";
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next'


const Map3D = dynamic(() => import('@/components/dashboard/Map3D'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Initializing 3D Environment...</p>
            </div>
        </div>
    )
});

type DashboardContentProps = SidebarProps & Map3DProps;

export default function DashboardContent(props: DashboardContentProps) {
    const {
        buildings,
        startPoint,
        endPoint,
        distance,
        time,
        onCalculate,
        onClear,
        onStartPoint,
        onEndPoint,
        mode,
        setMode,
        speed,
        setSpeed,
    } = props;
    const { i18n } = useTranslation();
    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Enhanced Sidebar Container */}
                <div className="w-180 lg:w-96 h-full flex-shrink-0 border-r border-gray-200 bg-white shadow-sm">
                    <div className="h-full flex flex-col">

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto">
                            <SideBar
                                buildings={buildings}
                                startPoint={startPoint}
                                endPoint={endPoint}
                                distance={distance}
                                time={time}
                                onCalculate={onCalculate}
                                onClear={onClear}
                                mode={mode}
                                setMode={setMode}
                                speed={speed}
                                setSpeed={setSpeed}
                            />
                        </div>

                    </div>
                </div>

                {/*  Map Container */}
                <div className="flex-1 h-full relative bg-gray-900">

                 {/* 3D Map Component */}
                    <div className=" absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                        <Map3D
                            buildings={buildings}
                            startPoint={startPoint}
                            endPoint={endPoint}
                            onStartPoint={onStartPoint}
                            onEndPoint={onEndPoint}
                            currentLanguage={i18n.language}
                        />
                    </div>

                    {/* Map Overlay Controls */}
                    <div className="absolute top-2 right-64 z-10">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2 min-w-[200px]">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Route Status</span>
                                {startPoint && endPoint ? (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Active
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                        Inactive
                                    </span>
                                )}
                            </div>
                            {time && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Est. Time:</span>
                                    <span className="font-semibold text-gray-800">{time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
