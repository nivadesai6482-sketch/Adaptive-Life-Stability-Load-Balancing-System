import React from 'react';
import { useStabilityStore } from '../../store/stabilityStore';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

export const WeeklyReport: React.FC = () => {
    const { historicalScores } = useStabilityStore();

    // Get scores for the last 7 days
    const last7Days = [...historicalScores]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);

    if (last7Days.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Insufficient data for weekly report.</p>
            </div>
        );
    }

    const scores = last7Days.map(s => s.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const peak = Math.max(...scores);
    const trough = Math.min(...scores);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Weekly Stability Digest</h3>
                    <p className="text-sm text-gray-500">Performance summary for the last 7 active days.</p>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Average Stability</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{average.toFixed(1)}</span>
                        <Activity className="h-4 w-4 text-indigo-500" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Peak Performance</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-600">{peak.toFixed(1)}</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Maximum Strain</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">{trough.toFixed(1)}</span>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                    Over the past week, your stability {average >= 70 ? 'remained strong' : 'showed signs of volatility'}. 
                    {peak - trough > 15 
                        ? ' Significant fluctuation detected; consider investigating the causes of high-stress incidents.' 
                        : ' Consistent performance maintains a baseline for recovery.'}
                </p>
            </div>
        </div>
    );
};
