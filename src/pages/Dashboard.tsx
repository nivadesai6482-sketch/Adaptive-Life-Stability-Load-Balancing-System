import React, { Suspense, lazy } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { ChartSkeleton } from '../components/common/ChartSkeleton';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { WeakestDomainIndicator } from '../components/analytics/WeakestDomainIndicator';
import { TaskRedistributionSuggestions } from '../components/analytics/TaskRedistributionSuggestions';
import { DomainInputForm } from '../components/forms/DomainInputForm';
import { Activity, Battery, ShieldAlert, AlertTriangle, LineChart, Server, SlidersHorizontal, BarChart2 } from 'lucide-react';
import { calculateLSI } from '../utils/stabilityCalculator';
import { useStabilityStore } from '../store/stabilityStore';
import { CollapseRiskIndicator } from '../components/analytics/CollapseRiskIndicator';
import { RecoverySuggestions } from '../components/analytics/RecoverySuggestions';
import { WeeklyReport } from '../components/reports/WeeklyReport';
import { SystemSummary } from '../components/analytics/SystemSummary';

// Lazy load heavy charting components
const RadarChart = lazy(() => import('../components/charts/RadarChart').then(module => ({ default: module.RadarChart })));
const StabilityTrendChart = lazy(() => import('../components/charts/StabilityTrendChart').then(module => ({ default: module.StabilityTrendChart })));
const CollapseForecastChart = lazy(() => import('../components/charts/CollapseForecastChart').then(module => ({ default: module.CollapseForecastChart })));
const DomainComparisonChart = lazy(() => import('../components/charts/DomainComparisonChart').then(module => ({ default: module.DomainComparisonChart })));
const StabilityHeatmap = lazy(() => import('../components/charts/StabilityHeatmap').then(module => ({ default: module.StabilityHeatmap })));

export const Dashboard = () => {
    const { addDailyScore, historicalScores, fetchHistoricalScores } = useStabilityStore();
    
    React.useEffect(() => {
        fetchHistoricalScores();
    }, [fetchHistoricalScores]);

    // Current mock domain data
    // Setting Cognitive to 40 to actively demonstrate the warning alert
    const currentScores = {
        Time: 85,
        Energy: 60,
        Cognitive: 40,
        Emotional: 75,
        Financial: 80,
    };
    
    const lsiScore = calculateLSI(currentScores);

    // Persist daily score if not already present for today
    React.useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const hasTodayScore = historicalScores.some(s => s.date === today);
        if (!hasTodayScore) {
            addDailyScore(lsiScore);
        }
    }, [lsiScore, historicalScores, addDailyScore]);

    return (
        <div className="space-y-8 pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-transform hover:scale-105">
                        <SlidersHorizontal className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl transition-colors">
                            ALS-LBS Dashboard
                        </h2>
                        <p className="mt-0.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors">
                            Real-time life stability and load balancing metrics.
                        </p>
                    </div>
                </div>
                <div className="flex">
                    <button type="button" className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95">
                        Run Capacity Assessment
                    </button>
                </div>
            </div>

            {/* AI Load Balancing Redirection System */}
            <TaskRedistributionSuggestions />

            <SystemSummary currentScores={currentScores} />

            {/* SECTION: Core Metrics */}
            <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                        <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Core System Metrics</h3>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Real-time vital indicators</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                        title="Life Stability Index"
                        value={lsiScore.toFixed(1)}
                        trend="up"
                        trendValue="+1.2 from last week"
                        icon={<ShieldAlert className="h-5 w-5" />}
                    />
                    <MetricCard
                        title="Current Energy Level"
                        value={`${currentScores.Energy}%`}
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
                </div>
            </div>

            {/* SECTION: Predictive Analytics */}
            <div className="space-y-6">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                        <LineChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Predictive Analytics & Trajectories</h3>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Growth projections and risk modeling</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Analytics Area Primary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm min-h-[400px] flex items-center justify-center transition-all duration-300 hover:shadow-md backdrop-blur-sm">
                            <Suspense fallback={<ChartSkeleton />}>
                                <StabilityTrendChart />
                            </Suspense>
                        </div>
                        
                        <Suspense fallback={<div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm min-h-[300px] flex items-center justify-center"><ChartSkeleton /></div>}>
                            <CollapseForecastChart />
                        </Suspense>
                        
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm min-h-[400px] flex items-center justify-center transition-all duration-300 hover:shadow-md backdrop-blur-sm">
                            <Suspense fallback={<ChartSkeleton />}>
                                <DomainComparisonChart scores={currentScores} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Radar Chart & Risk Indicators Area */}
                    <div className="flex flex-col gap-6">
                        <CollapseRiskIndicator lsi={lsiScore} />
                        {lsiScore < 70 && <RecoverySuggestions lsi={lsiScore} />}
                        <WeakestDomainIndicator />
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm flex-1 flex items-center justify-center min-h-[300px] transition-all duration-300 hover:shadow-md backdrop-blur-sm">
                            <Suspense fallback={<ChartSkeleton />}>
                                <RadarChart />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION: Live Diagnostics */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                        <SlidersHorizontal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Live System Diagnostics</h3>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Real-time heatmaps and metrics</p>
                    </div>
                </div>

                <Suspense fallback={<div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm min-h-[300px] flex items-center justify-center"><ChartSkeleton /></div>}>
                    <StabilityHeatmap scores={currentScores} />
                </Suspense>

                <WeeklyReport />
            </div>

            {/* SECTION: Operations & Input */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                        <Server className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Operations & Input</h3>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">System alerts and manual adjustments</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* System Alerts Row */}
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/40 p-6 shadow-sm min-h-[300px] max-h-[400px] transition-all duration-300 hover:shadow-md overflow-hidden backdrop-blur-sm">
                        <NotificationPanel lsiScore={lsiScore} domainScores={currentScores} />
                    </div>
                    
                    {/* Domain Input Form */}
                    <div className="rounded-2xl shadow-sm min-h-[300px] max-h-[400px] bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md overflow-hidden backdrop-blur-sm">
                        <DomainInputForm />
                    </div>
                </div>
            </div>
        </div>
    );
};
