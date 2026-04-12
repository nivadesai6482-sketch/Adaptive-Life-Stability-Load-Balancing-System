import React, { useMemo } from 'react';
import { useStabilityStore } from '../../store/stabilityStore';
import { calculateLSI, generateDomainAlerts, DomainScores } from '../../utils/stabilityCalculator';
import { getDomainAction } from '../../utils/recommendationEngine';
import { Shield, TrendingUp, TrendingDown, AlertCircle, AlertTriangle } from 'lucide-react';

interface SystemSummaryProps {
    currentScores: DomainScores;
}

export const SystemSummary: React.FC<SystemSummaryProps> = React.memo(({ currentScores }) => {
    const { historicalScores } = useStabilityStore();
    
    // Cache calculation outputs strictly based on input scores
    const { lsiScore, alerts, weakestDomain } = useMemo(() => {
        const lsi = calculateLSI(currentScores);
        const generatedAlerts = generateDomainAlerts(currentScores);
        
        const entries = Object.entries(currentScores) as [keyof DomainScores, number][];
        const weakestEntry = entries.reduce((min, current) => 
            current[1] < min[1] ? current : min
        , entries[0]);
        
        return {
            lsiScore: lsi,
            alerts: generatedAlerts,
            weakestDomain: weakestEntry[0]
        };
    }, [currentScores]);
    
    // Calculate trend
    const lastScore = historicalScores.length > 0 ? historicalScores[historicalScores.length - 1].score : lsiScore;
    const trendValue = lsiScore - lastScore;
    const isUp = trendValue >= 0;

    // Alert counts
    const criticalCount = alerts.filter(a => a.level === 'critical').length;
    const warningCount = alerts.filter(a => a.level === 'warning').length;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-indigo-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="rounded-[0.9rem] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-6 lg:p-8 transition-all duration-300">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
                    <div>
                        <h3 className="text-xl lg:text-2xl font-black tracking-tight text-gray-900 dark:text-white">System Capability Summary</h3>
                        <p className="mt-0.5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Aggregated real-time stability intelligence</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-inner border border-indigo-100/50 dark:border-indigo-800/30">
                        <Shield className="h-6 w-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-8 md:gap-y-0 md:grid-cols-2 lg:grid-cols-4 md:divide-x divide-gray-100 dark:divide-gray-800">
                    {/* LSI & Trend */}
                    <div className="flex flex-col md:pr-8 lg:px-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Stability Index</span>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{lsiScore.toFixed(1)}</span>
                            <div className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black ${isUp ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/30' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100/50 dark:border-red-800/30'}`}>
                                {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {Math.abs(trendValue).toFixed(1)}
                            </div>
                        </div>
                    </div>

                    {/* Weakest Point */}
                    <div className="flex flex-col md:pl-8 lg:px-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Critical Bottleneck</span>
                        <div className="mt-2 flex flex-col gap-0.5">
                            <span className="text-xl font-black text-red-600 dark:text-red-400 tracking-tight uppercase">{weakestDomain}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-tight">{getDomainAction(weakestDomain)}</span>
                        </div>
                    </div>

                    {/* Alert Status */}
                    <div className="flex flex-col md:pr-8 lg:px-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Active Signals</span>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-xl border border-red-100 dark:border-red-900/50">
                                <AlertCircle className="h-4.5 w-4.5 mr-1.5" />
                                <span className="text-lg font-black">{criticalCount}</span>
                            </div>
                            <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                <AlertTriangle className="h-4.5 w-4.5 mr-1.5" />
                                <span className="text-lg font-black">{warningCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance State */}
                    <div className="flex flex-col lg:pl-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">System State</span>
                        <div className="mt-2 flex items-center">
                            <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm border ${
                                lsiScore >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' :
                                lsiScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                            }`}>
                                {lsiScore >= 70 ? 'Operational' : lsiScore >= 40 ? 'Warning' : 'Critical Failure'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
