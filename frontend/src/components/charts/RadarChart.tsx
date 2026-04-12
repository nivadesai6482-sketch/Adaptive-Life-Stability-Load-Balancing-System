import React from 'react';
import {
    Radar,
    RadarChart as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface DomainData {
    domain: string;
    score: number;
    fullMark: number;
}

interface RadarChartProps {
    data?: DomainData[];
}

const defaultData: DomainData[] = [
    { domain: 'Time', score: 85, fullMark: 100 },
    { domain: 'Energy', score: 60, fullMark: 100 },
    { domain: 'Cognitive', score: 90, fullMark: 100 },
    { domain: 'Emotional', score: 75, fullMark: 100 },
    { domain: 'Financial', score: 80, fullMark: 100 },
];

export const RadarChart: React.FC<RadarChartProps> = ({ data = defaultData }) => {
    return (
        <div className="h-full w-full flex flex-col justify-between">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Stability Domains</h3>
                <p className="text-sm text-gray-500">Current relative capacity across core areas.</p>
            </div>
            <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="domain"
                            tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            tickCount={6}
                        />
                        <Radar
                            name="Current Capacity"
                            dataKey="score"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                            itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                        />
                    </RechartsRadar>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
