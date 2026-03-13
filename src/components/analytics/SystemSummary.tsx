import React from 'react';
import { useStabilityStore } from '../../store/stabilityStore';
import { calculateLSI, generateDomainAlerts, DomainScores } from '../../utils/stabilityCalculator';
import { getDomainAction } from '../../utils/recommendationEngine';
import { Shield, TrendingUp, TrendingDown, AlertCircle, AlertTriangle } from 'lucide-react';

interface SystemSummaryProps {
    currentScores: DomainScores;
}

export const SystemSummary: React.FC<SystemSummaryProps> = ({ currentScores }) => {
    const { historicalScores } = useStabilityStore();
    const lsiScore = calculateLSI(currentScores);
    const alerts = generateDomainAlerts(currentScores);
    
    // Calculate trend
    const lastScore = historicalScores.length > 0 ? historicalScores[historicalScores.length - 1].score : lsiScore;
    const trendValue = lsiScore - lastScore;
    const isUp = trendValue >= 0;

    // Find weakest domain
    const entries = Object.entries(currentScores) as [keyof DomainScores, number][];
    const weakestEntry = entries.reduce((min, current) => 
        current[1] < min[1] ? current : min
    , entries[0]);
    const weakestDomain = weakestEntry[0];

    // Alert counts
    const criticalCount = alerts.filter(a => a.level === 'critical').length;
    const warningCount = alerts.filter(a => a.level === 'warning').length;

    return (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-1 shadow-xl">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm p-6">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">System Capability Summary</h3>
                        <p className="text-sm text-gray-500">Aggregated real-time stability intelligence</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Shield className="h-6 w-6" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* LSI & Trend */}
                    <div className="flex flex-col border-r border-gray-100 pr-6 last:border-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Stability Index</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-4xl font-black text-indigo-600">{lsiScore.toFixed(1)}</span>
                            <div className={`flex items-center text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                {isUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {Math.abs(trendValue).toFixed(1)}
                            </div>
                        </div>
                    </div>

                    {/* Weakest Point */}
                    <div className="flex flex-col border-r border-gray-100 pr-6 lg:pl-6 last:border-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Critical Bottleneck</span>
                        <div className="mt-2 flex flex-col">
                            <span className="text-xl font-bold text-red-600">{weakestDomain}</span>
                            <span className="text-sm font-medium text-gray-600">{getDomainAction(weakestDomain)}</span>
                        </div>
                    </div>

                    {/* Alert Status */}
                    <div className="flex flex-col border-r border-gray-100 pr-6 lg:pl-6 last:border-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Active Signals</span>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center text-red-600">
                                <AlertCircle className="h-5 w-5 mr-1.5" />
                                <span className="text-lg font-bold">{criticalCount}</span>
                            </div>
                            <div className="flex items-center text-amber-500">
                                <AlertTriangle className="h-5 w-5 mr-1.5" />
                                <span className="text-lg font-bold">{warningCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Performance State */}
                    <div className="flex flex-col lg:pl-6">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">System State</span>
                        <div className="mt-2 flex items-center">
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                                lsiScore >= 70 ? 'bg-emerald-100 text-emerald-700' :
                                lsiScore >= 40 ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {lsiScore >= 70 ? 'Operational' : lsiScore >= 40 ? 'Warning' : 'Critical'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
