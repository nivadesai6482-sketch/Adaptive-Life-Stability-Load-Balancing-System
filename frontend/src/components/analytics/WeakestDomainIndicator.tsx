import React from 'react';
import { AlertTriangle, Battery, Brain, Clock, DollarSign, HeartPulse } from 'lucide-react';

interface DomainData {
    domain: string;
    score: number;
    fullMark: number;
}

const mockData: DomainData[] = [
    { domain: 'Time', score: 85, fullMark: 100 },
    { domain: 'Energy', score: 60, fullMark: 100 },
    { domain: 'Cognitive', score: 90, fullMark: 100 },
    { domain: 'Emotional', score: 75, fullMark: 100 },
    { domain: 'Financial', score: 80, fullMark: 100 },
];

const domainIcons: Record<string, React.ElementType> = {
    'Time': Clock,
    'Energy': Battery,
    'Cognitive': Brain,
    'Emotional': HeartPulse,
    'Financial': DollarSign,
};

const domainColors: Record<string, string> = {
    'Time': 'text-purple-600 bg-purple-50 border-purple-200',
    'Energy': 'text-red-600 bg-red-50 border-red-200',
    'Cognitive': 'text-blue-600 bg-blue-50 border-blue-200',
    'Emotional': 'text-pink-600 bg-pink-50 border-pink-200',
    'Financial': 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export const WeakestDomainIndicator = () => {
    // Find the domain with the lowest score
    const weakestDomain = mockData.reduce((prev, current) => 
        (prev.score < current.score) ? prev : current
    );

    const Icon = domainIcons[weakestDomain.domain] || AlertTriangle;
    const colorClasses = domainColors[weakestDomain.domain] || 'text-gray-600 bg-gray-50 border-gray-200';

    return (
        <div className={`rounded-xl border p-5 shadow-sm ${colorClasses}`}>
            <div className="flex items-start gap-4">
                <div className="rounded-full bg-white p-3 shadow-sm">
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">System Bottleneck</h3>
                        <span className="inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-xs font-bold">
                            Score: {weakestDomain.score}/{weakestDomain.fullMark}
                        </span>
                    </div>
                    
                    <h4 className="mt-1 text-2xl font-bold">
                        {weakestDomain.domain}
                    </h4>
                    
                    <p className="mt-2 text-sm opacity-90">
                        This area is currently the primary limiting factor for overall stability. It is highly recommended to redirect resources to support <strong>{weakestDomain.domain.toLowerCase()}</strong> capacity.
                    </p>
                </div>
            </div>
        </div>
    );
};
