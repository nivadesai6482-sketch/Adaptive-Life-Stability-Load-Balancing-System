import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { RadarChart } from '../components/charts/RadarChart';
import { StabilityTrendChart } from '../components/charts/StabilityTrendChart';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { WeakestDomainIndicator } from '../components/analytics/WeakestDomainIndicator';
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
                <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px] flex items-center justify-center">
                    <StabilityTrendChart />
                </div>

                {/* Radar Chart & Weakest Domain Area */}
                <div className="flex flex-col gap-6">
                    <WeakestDomainIndicator />
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex-1 flex items-center justify-center min-h-[300px]">
                        <RadarChart />
                    </div>
                </div>
            </div>

            {/* System Alerts Row */}
            <div className="grid grid-cols-1 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[300px] max-h-[400px]">
                    <NotificationPanel />
                </div>
            </div>
        </div>
    );
};
