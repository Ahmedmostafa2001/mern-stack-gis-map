'use client';
import React from "react";

export function Calendar() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const dayOfMonth = today.getDate();
    const month = today.toLocaleDateString('en-US', { month: 'short' });

    return (
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-2xl p-6 shadow-2xl border border-purple-400/30 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-white/10"></div>

            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    {/* Calendar icon */}
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">Today's Date</h3>
                        <p className="text-white/60 text-xs">Current local date</p>
                    </div>
                </div>

                {/* Main date display */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-bold mb-1">{formattedDate}</p>
                        <p className="text-white/70 text-sm">Have a wonderful day!</p>
                    </div>

                    {/* Date badge */}
                    <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl p-3 min-w-16 border border-white/30">
                        <div className="text-xs font-semibold text-white/80 uppercase tracking-wide">{month}</div>
                        <div className="text-2xl font-bold text-white">{dayOfMonth}</div>
                    </div>
                </div>

                {/* Progress indicator for the day */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Start of Day</span>
                        <span>Now</span>
                        <span>End of Day</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${(today.getHours() * 60 + today.getMinutes()) / (24 * 60) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
