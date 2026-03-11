import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { RadarChart } from '../components/charts/RadarChart';
import { Activity, Battery, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        ALS-LBS Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Real-time life stability and load balancing metrics.
                    </p>
                </div>
                <div className="flex">
                    <button type="button" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                        Run Capacity Assessment
                    </button>
                </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Current Energy Level"
                    value="78%"
                    trend="down"
                    trendValue="-5% from yesterday"
                    icon={<Battery className="h-5 w-5" />}
                />
                <MetricCard
                    title="Active Commitments"
                    value="12"
                    trend="up"
                    trendValue="+2 new tasks"
                    icon={<Activity className="h-5 w-5" />}
                />
                <MetricCard
                    title="System Stability"
                    value="Stable"
                    trend="neutral"
                    trendValue="Optimal load"
                    icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                />
                <MetricCard
                    title="Burnout Risk"
                    value="Low"
                    trend="down"
                    trendValue="Improved by 12%"
                    icon={<AlertTriangle className="h-5 w-5" />}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Analytics Area Primary */}
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Time Series Data Yet</h3>
                    <p className="text-gray-500 text-center max-w-sm mb-6">
                        Connect your data sources or run an initial capacity assessment to begin populating real-time timeline metrics.
                    </p>
                    <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Configure Data Sources
                    </button>
                </div>

                {/* Radar Chart Area */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px] flex items-center justify-center">
                    <RadarChart />
                </div>
            </div>
        </div>
    );
};
