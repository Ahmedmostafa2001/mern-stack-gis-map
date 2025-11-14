import { useEffect, useState } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { Calendar } from "@/components/dashboard/Calendar";

interface DashboardStats {
    users: number;
    buildings: number;
}

const Stats = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await DashboardService.getStats();
            setStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load statistics');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className=" min-h-screen w-screen bg-gray-50 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse">
                    <div className="flex justify-between items-center mb-6">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((item) => (
                            <div key={item} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-800 mb-1">
                            Unable to load statistics
                        </h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={fetchStats}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                        <p className="text-gray-500 mt-1">Real-time statistics and insights</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="inline-flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-all duration-200 mt-4 sm:mt-0 transform hover:scale-105 border border-gray-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Data
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Users Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 mb-1">Total Users</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stats?.users?.toLocaleString() ?? 0}
                                        </p>
                                        <p className="text-xs text-blue-500 mt-1">Registered in system</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        +12.5%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buildings Card */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-600 mb-1">Total Buildings</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stats?.buildings?.toLocaleString() ?? 0}
                                        </p>
                                        <p className="text-xs text-green-500 mt-1">Managed properties</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        +8.2%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Footer */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span>System is operational</span>
                        </div>
                        <div className="mt-2 sm:mt-0">
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>
            <Calendar />
        </div>
    );
};

export default Stats;
