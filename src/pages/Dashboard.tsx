import React, { Suspense, lazy } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { ChartSkeleton } from '../components/common/ChartSkeleton';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { WeakestDomainIndicator } from '../components/analytics/WeakestDomainIndicator';
import { DomainInputForm } from '../components/forms/DomainInputForm';
import {
    Activity, Battery, ShieldAlert, AlertTriangle,
    LineChart, Server, SlidersHorizontal, BarChart2,
    Smartphone, RefreshCw, Layers
} from 'lucide-react';
import { calculateLSI } from '../utils/stabilityCalculator';
import { useStabilityStore } from '../store/stabilityStore';
import { CollapseRiskIndicator } from '../components/analytics/CollapseRiskIndicator';
import { RecoverySuggestions } from '../components/analytics/RecoverySuggestions';
import { WeeklyReport } from '../components/reports/WeeklyReport';
import { SystemSummary } from '../components/analytics/SystemSummary';
import { HealthTelemetryCard } from '../components/common/HealthTelemetryCard';
import { getHealthData } from '../services/health/fitbitService';
import { calculateEnergyScore, calculateStressLevel, EnergyLevel, StressLevel } from '../services/health/healthAnalyzer';
import { BurnoutIndicator } from '../components/analytics/BurnoutIndicator';
import { predictBurnoutRisk } from '../utils/burnoutPredictor';
import { useTaskStore } from '../store/taskStore';
import { predictFutureStability, predictStabilityTrend } from '../utils/stabilityPrediction';
import { PredictionChart } from '../components/charts/PredictionChart';
import { CollapseForecast } from '../components/analytics/CollapseForecast';
import { TaskOptimizer } from '../components/analytics/TaskOptimizer';

// Lazy load heavy charting components
const RadarChart = lazy(() => import('../components/charts/RadarChart').then(module => ({ default: module.RadarChart })));
const CollapseForecastChart = lazy(() => import('../components/charts/CollapseForecastChart').then(module => ({ default: module.CollapseForecastChart })));
const DomainComparisonChart = lazy(() => import('../components/charts/DomainComparisonChart').then(module => ({ default: module.DomainComparisonChart })));
const StabilityHeatmap = lazy(() => import('../components/charts/StabilityHeatmap').then(module => ({ default: module.StabilityHeatmap })));

export const Dashboard = () => {
    const {
        addDailyScore,
        historicalScores,
        fetchHistoricalScores,
        currentScores,
        isDeviceConnected,
        isConnecting,
        healthData,
        connectDevice
    } = useStabilityStore();

    const { tasks, fetchTasks } = useTaskStore();

    React.useEffect(() => {
        fetchHistoricalScores();
        fetchTasks();
    }, [fetchHistoricalScores, fetchTasks]);

    const [healthAnalysis, setHealthAnalysis] = React.useState<{
        energy: EnergyLevel;
        stress: StressLevel;
    } | null>(null);

    const handleConnectDevice = async () => {
        try {
            await connectDevice();
            const data = await getHealthData();
            const energy = calculateEnergyScore(data.sleepHours, data.activityLevel);
            const stress = calculateStressLevel(data.heartRate);
            setHealthAnalysis({ energy, stress });
        } catch (error) {
            console.error('Connection failed', error);
        }
    };

    const cognitiveLoad = tasks.reduce((acc, task) => {
        if (task.status === 'completed') return acc;
        const weights = { high: 25, medium: 15, low: 5 };
        return acc + (weights[task.priority] || 5);
    }, 0);

    const lsiScore = calculateLSI(currentScores);
    const burnoutRisk = healthData ? predictBurnoutRisk({
        lifeStabilityIndex: lsiScore,
        cognitiveLoad: cognitiveLoad,
        sleepHours: healthData.sleepHours,
        heartRate: healthData.heartRate
    }) : 'LOW';

    const predictionResult = React.useMemo(() => {
        return predictStabilityTrend(historicalScores);
    }, [historicalScores]);

    const [hasAttemptedDailySave, setHasAttemptedDailySave] = React.useState(false);

    React.useEffect(() => {
        if (!historicalScores || (historicalScores.length === 0 && !hasAttemptedDailySave)) return;
        const today = new Date().toISOString().split('T')[0];
        const hasTodayScore = historicalScores.some(s => s.date === today);
        if (!hasTodayScore && !hasAttemptedDailySave) {
            setHasAttemptedDailySave(true);
            addDailyScore(currentScores);
        }
    }, [currentScores, historicalScores, addDailyScore, hasAttemptedDailySave]);

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* TOP SECTION: Header & Actions */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            <Layers className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                ALS-LBS Dashboard
                            </h1>
                            <p className="text-sm font-medium text-slate-400">
                                Adaptive Life Stability & Load Balancing System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isDeviceConnected && healthData && (
                            <HealthTelemetryCard
                                data={healthData}
                                energy={healthAnalysis?.energy}
                                stress={healthAnalysis?.stress}
                                isSyncing={isConnecting}
                                onRefresh={handleConnectDevice}
                            />
                        )}
                        <button
                            onClick={handleConnectDevice}
                            disabled={isConnecting}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95 ${isDeviceConnected
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-slate-900 text-white border border-slate-800 hover:bg-slate-800'
                                }`}
                        >
                            {isConnecting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
                            {isConnecting ? 'Bridging...' : isDeviceConnected ? 'Device Sync Active' : 'Connect Device'}
                        </button>
                        <button className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 shadow-indigo-500/20 transition-all active:scale-95">
                            Run Capacity Assessment
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-12 gap-6">

                    {/* ROW 1: System Summary (8) & Alerts Panel (4) */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-full">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-indigo-400" />
                                System Optimization & Insights
                            </h2>
                            <div className="space-y-6">
                                <TaskOptimizer
                                    tasks={tasks}
                                    cognitiveLoad={cognitiveLoad}
                                    energyScore={currentScores.Energy}
                                    burnoutRisk={burnoutRisk}
                                />
                                <SystemSummary currentScores={currentScores} />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-full overflow-hidden">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-400" />
                                Critical Alerts Panel
                            </h2>
                            <NotificationPanel
                                lsiScore={lsiScore}
                                domainScores={currentScores}
                                burnoutRisk={burnoutRisk}
                            />
                        </div>
                    </div>

                    {/* ROW 2: Collapse Forecast Chart (12) */}
                    <div className="col-span-12">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <LineChart className="h-5 w-5 text-emerald-400" />
                                Life Stability Trajectory & Collapse Forecast
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 h-[400px]">
                                    <Suspense fallback={<ChartSkeleton />}>
                                        <PredictionChart
                                            historicalData={historicalScores}
                                            predictedData={predictFutureStability(historicalScores, 5)}
                                        />
                                    </Suspense>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <CollapseForecast collapseWindow={predictionResult.collapseWindow} />
                                    <CollapseRiskIndicator lsi={lsiScore} />
                                    <BurnoutIndicator risk={burnoutRisk} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ROW 3: Radar Chart (6) & Core Metrics Cards (6) */}
                    <div className="col-span-12 lg:col-span-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg h-[450px] flex flex-col">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-indigo-400" />
                                Domain Equilibrium Analysis
                            </h2>
                            <div className="flex-1 flex items-center justify-center">
                                <Suspense fallback={<ChartSkeleton />}>
                                    <RadarChart />
                                </Suspense>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 shadow-lg overflow-hidden flex flex-col h-full">
                            <MetricCard
                                title="Stability Index"
                                value={lsiScore.toFixed(1)}
                                trend="up"
                                trendValue="+1.2%"
                                icon={<ShieldAlert className="h-5 w-5" />}
                            />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 shadow-lg overflow-hidden flex flex-col h-full">
                            <MetricCard
                                title="Bio-Energy"
                                value={`${currentScores.Energy}%`}
                                trend="down"
                                trendValue="-5%"
                                icon={<Battery className="h-5 w-5" />}
                            />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 shadow-lg overflow-hidden flex flex-col h-full">
                            <MetricCard
                                title="Cognitive Load"
                                value={`${cognitiveLoad}`}
                                trend="up"
                                trendValue="Active"
                                icon={<Activity className="h-5 w-5" />}
                            />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-center">
                            <WeakestDomainIndicator />
                        </div>
                        {(lsiScore < 70 || burnoutRisk !== 'LOW') && (
                            <div className="col-span-1 sm:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg border-l-4 border-l-amber-500">
                                <RecoverySuggestions lsi={lsiScore} />
                            </div>
                        )}
                    </div>

                    {/* ROW 4: Stress Heatmap (12) */}
                    <div className="col-span-12">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-rose-400" />
                                Dialectical Stress Heatmap
                            </h2>
                            <Suspense fallback={<ChartSkeleton />}>
                                <StabilityHeatmap scores={currentScores} />
                            </Suspense>
                        </div>
                    </div>

                    {/* ROW 5: Weekly Stability Report (12) */}
                    <div className="col-span-12">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Server className="h-5 w-5 text-blue-400" />
                                Weekly Performance Synthesis
                            </h2>
                            <WeeklyReport />
                        </div>
                    </div>

                    {/* ROW 6: Input Controls / Sliders (12) */}
                    <div className="col-span-12">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
                                Domain Parameter Adjustments
                            </h2>
                            <DomainInputForm />
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};
