import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    trend = 'neutral',
    trendValue,
    icon
}) => {
    return (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-inset ring-gray-200">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                    {icon && <div className="text-gray-400">{icon}</div>}
                </div>
                <dd className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-gray-900">{value}</span>

                    {trend !== 'neutral' && trendValue && (
                        <span
                            className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {trend === 'up' ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            {trendValue}
                        </span>
                    )}
                    {trend === 'neutral' && trendValue && (
                        <span className="text-sm font-medium text-gray-500">
                            {trendValue}
                        </span>
                    )}
                </dd>
            </div>
        </div>
    );
};
