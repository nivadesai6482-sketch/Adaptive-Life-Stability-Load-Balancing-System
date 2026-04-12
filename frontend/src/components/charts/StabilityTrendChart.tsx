import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useStabilityStore } from '../../store/stabilityStore';

export const StabilityTrendChart: React.FC = () => {
    const { historicalScores } = useStabilityStore();

    const chartData = historicalScores
        .filter(score => score.date && !isNaN(new Date(score.date).getTime()))
        .map(score => ({
            date: new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            stabilityIndex: score.score
        }));

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Life Stability Trend</h3>
                <p className="text-sm text-gray-500">Daily aggregate of overall system stability.</p>
            </div>
            <div className="h-[300px] w-full mt-4 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                            itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line
                            type="monotone"
                            name="Stability Index"
                            dataKey="stabilityIndex"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
