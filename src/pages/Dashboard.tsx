import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { RadarChart } from '../components/charts/RadarChart';
import { StabilityTrendChart } from '../components/charts/StabilityTrendChart';
import { CollapseForecastChart } from '../components/charts/CollapseForecastChart';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { WeakestDomainIndicator } from '../components/analytics/WeakestDomainIndicator';
import { DomainInputForm } from '../components/forms/DomainInputForm';
import { Activity, Battery, ShieldAlert, AlertTriangle } from 'lucide-react';
import { calculateLSI } from '../utils/stabilityCalculator';
import { useStabilityStore } from '../store/stabilityStore';
import { CollapseRiskIndicator } from '../components/analytics/CollapseRiskIndicator';
import { RecoverySuggestions } from '../components/analytics/RecoverySuggestions';
import { StabilityHeatmap } from '../components/charts/StabilityHeatmap';
import { DomainComparisonChart } from '../components/charts/DomainComparisonChart';
import { WeeklyReport } from '../components/reports/WeeklyReport';
import { SystemSummary } from '../components/analytics/SystemSummary';

export const Dashboard = () => {
    const { addDailyScore, historicalScores, fetchHistoricalScores } = useStabilityStore();
    
    React.useEffect(() => {
        fetchHistoricalScores();
    }, [fetchHistoricalScores]);

    // Current mock domain data
    const currentScores = {
        Time: 85,
        Energy: 60,
        Cognitive: 90,
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

            <SystemSummary currentScores={currentScores} />

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                    title="Life Stability Index"
                    value={lsiScore.toFixed(1)}
                    trend="up"
                    trendValue="+1.2 from last week"
                    icon={<ShieldAlert className="h-5 w-5 text-indigo-500" />}
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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Analytics Area Primary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px] flex items-center justify-center">
                        <StabilityTrendChart />
                    </div>
                    <CollapseForecastChart />
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px] flex items-center justify-center">
                        <DomainComparisonChart scores={currentScores} />
                    </div>
                </div>

                {/* Radar Chart & Risk Indicators Area */}
                <div className="flex flex-col gap-6">
                    <CollapseRiskIndicator lsi={lsiScore} />
                    {lsiScore < 70 && <RecoverySuggestions lsi={lsiScore} />}
                    <WeakestDomainIndicator />
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex-1 flex items-center justify-center min-h-[300px]">
                        <RadarChart />
                    </div>
                </div>
            </div>

            <StabilityHeatmap scores={currentScores} />

            <WeeklyReport />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* System Alerts Row */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[300px] max-h-[400px]">
                    <NotificationPanel />
                </div>
                
                {/* Domain Input Form */}
                <div className="rounded-xl shadow-sm min-h-[300px] max-h-[400px]">
                    <DomainInputForm />
                </div>
            </div>
        </div>
    );
};
