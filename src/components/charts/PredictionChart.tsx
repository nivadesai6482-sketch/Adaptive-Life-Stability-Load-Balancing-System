import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { DailyStabilityScore } from '../../store/stabilityStore';

interface PredictionChartProps {
    historicalData: DailyStabilityScore[];
    predictedData: DailyStabilityScore[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData, predictedData }) => {
    const combinedData = useMemo(() => {
        // Prepare historical points
        const history = historicalData.map(d => ({
            date: d.date,
            actual: d.score,
            predicted: null as number | null
        }));

        // Prepare predicted points
        // We ensure a visual bridge by starting the prediction line from the last historical point if it exists
        const lastActual = history.length > 0 ? history[history.length - 1] : null;

        const predictions = predictedData.map(d => ({
            date: d.date,
            actual: null as number | null,
            predicted: d.score
        }));

        // Insert the bridge point for the prediction line
        if (lastActual) {
            predictions.unshift({
                date: lastActual.date,
                actual: null,
                predicted: lastActual.actual
            });
        }

        return [...history, ...predictions];
    }, [historicalData, predictedData]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const isPredicted = data.predicted !== null && data.actual === null;

            return (
                <div className="rounded-lg border border-gray-100 bg-white/95 p-3 shadow-xl backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isPredicted ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                        <p className="text-sm font-black text-gray-900 dark:text-white">
                            Stability: {isPredicted ? data.predicted : data.actual}%
                        </p>
                    </div>
                    {isPredicted && (
                        <p className="mt-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            (Forecasted Value)
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={combinedData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        dy={10}
                    />
                    <YAxis
                        domain={[0, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {/* The Last Known Point Mark */}
                    {historicalData.length > 0 && (
                        <ReferenceLine
                            x={historicalData[historicalScores.length - 1]?.date}
                            stroke="#6366f1"
                            strokeDasharray="3 3"
                            label={{ position: 'top', value: 'Present', fill: '#6366f1', fontSize: 10, fontWeight: 900 }}
                        />
                    )}

                    {/* Actual History Line */}
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#4f46e5"
                        strokeWidth={4}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={1500}
                    />

                    {/* Prediction Line */}
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#10b981"
                        strokeWidth={4}
                        strokeDasharray="8 5"
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        animationDuration={2000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
