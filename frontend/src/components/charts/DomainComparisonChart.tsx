import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { DomainScores } from '../../utils/stabilityCalculator';

interface DomainComparisonChartProps {
    scores: DomainScores;
}

export const DomainComparisonChart: React.FC<DomainComparisonChartProps> = ({ scores }) => {
    const data = Object.entries(scores).map(([domain, score]) => ({
        domain,
        score,
    }));

    // Sort by score to make the comparison easier (optional, but good for UX)
    data.sort((a, b) => b.score - a.score);

    const getBarColor = (score: number) => {
        if (score > 70) return '#10b981'; // green-500
        if (score >= 40) return '#f59e0b'; // amber-500
        return '#ef4444'; // red-500
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Domain Performance Comparison</h3>
                <p className="text-sm text-gray-500">Cross-domain stability analysis (0-100 scale).</p>
            </div>
            <div className="h-[300px] w-full mt-4 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                            type="number" 
                            domain={[0, 100]} 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                            dataKey="domain" 
                            type="category" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                        />
                        <Bar 
                            dataKey="score" 
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
