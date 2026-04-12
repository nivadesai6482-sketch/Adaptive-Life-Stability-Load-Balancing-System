import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(({
    title,
    value,
    trend = 'neutral',
    trendValue,
    icon
}) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-gray-800/50 dark:backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/30 group">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <dt className="truncate text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">{title}</dt>
                    {icon && (
                        <div className="text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100/50 dark:border-indigo-800/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            {icon}
                        </div>
                    )}
                </div>
                <dd className="mt-2 flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white">{value}</span>
                        {trendValue && (
                            <span
                                className={`flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                                    trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 
                                    trend === 'down' ? 'text-red-600 dark:text-red-400' :
                                    'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {trend === 'up' && <ArrowUpRight className="mr-0.5 h-3 w-3" />}
                                {trend === 'down' && <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                                {trendValue.split(' ')[0]}
                            </span>
                        )}
                    </div>
                </dd>
                {trendValue && (
                    <div className="mt-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        {trendValue.split(' ').slice(1).join(' ')}
                    </div>
                )}
            </div>
        </div>
    );
});
