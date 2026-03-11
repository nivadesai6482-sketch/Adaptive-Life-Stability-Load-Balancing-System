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

interface TrendData {
    week: string;
    stabilityIndex: number;
}

const defaultData: TrendData[] = [
    { week: 'Week 1', stabilityIndex: 65 },
    { week: 'Week 2', stabilityIndex: 68 },
    { week: 'Week 3', stabilityIndex: 59 },
    { week: 'Week 4', stabilityIndex: 72 },
    { week: 'Week 5', stabilityIndex: 78 },
    { week: 'Week 6', stabilityIndex: 74 },
    { week: 'Week 7', stabilityIndex: 82 },
];

export const StabilityTrendChart: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Life Stability Trend</h3>
                <p className="text-sm text-gray-500">Weekly aggregate of overall system stability.</p>
            </div>
            <div className="h-[300px] w-full mt-4 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={defaultData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="week"
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
