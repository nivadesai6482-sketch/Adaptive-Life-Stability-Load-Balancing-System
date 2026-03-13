import React from 'react';
import { Clock, Battery, Brain, HeartPulse, DollarSign } from 'lucide-react';
import { DomainScores } from '../../utils/stabilityCalculator';

interface StabilityHeatmapProps {
    scores: DomainScores;
}

const domainIcons: Record<string, React.ElementType> = {
    Time: Clock,
    Energy: Battery,
    Cognitive: Brain,
    Emotional: HeartPulse,
    Financial: DollarSign,
};

export const StabilityHeatmap: React.FC<StabilityHeatmapProps> = ({ scores }) => {
    const domains = Object.keys(scores) as (keyof DomainScores)[];

    const getStressColor = (score: number) => {
        const stress = 100 - score;
        if (stress < 20) return 'bg-emerald-500 text-emerald-50';
        if (stress < 40) return 'bg-emerald-400 text-emerald-900';
        if (stress < 60) return 'bg-amber-400 text-amber-900';
        if (stress < 80) return 'bg-orange-500 text-orange-50';
        return 'bg-red-600 text-red-50';
    };

    const getStressLabel = (score: number) => {
        const stress = 100 - score;
        if (stress < 20) return 'Negligible Stress';
        if (stress < 40) return 'Low Stress';
        if (stress < 60) return 'Moderate Stress';
        if (stress < 80) return 'High Stress';
        return 'Critical Stress';
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">Stress Heatmap</h3>
                <p className="text-sm text-gray-500">Visualization of stress intensity across life domains.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                {domains.map((domain) => {
                    const score = scores[domain];
                    const Icon = domainIcons[domain];
                    return (
                        <div 
                            key={domain}
                            className={`relative flex flex-col items-center justify-center rounded-lg p-4 transition-all duration-300 hover:scale-105 group cursor-default ${getStressColor(score)}`}
                        >
                            <Icon className="mb-2 h-6 w-6 opacity-80" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90">{domain}</span>
                            <span className="mt-1 text-xl font-black">{100 - score}%</span>
                            
                            {/* Tooltip-like info on hover handled by children positioning or peer classes if needed, 
                                but simple scale and color is usually enough for a heatmap feel. */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100 rounded-lg text-center p-2">
                                {getStressLabel(score)}<br/>
                                Stability: {score}%
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Low Intensity</span>
                <div className="flex h-1.5 flex-1 mx-4 rounded-full overflow-hidden">
                    <div className="h-full w-1/5 bg-emerald-500" />
                    <div className="h-full w-1/5 bg-emerald-400" />
                    <div className="h-full w-1/5 bg-amber-400" />
                    <div className="h-full w-1/5 bg-orange-500" />
                    <div className="h-full w-1/5 bg-red-600" />
                </div>
                <span>High Intensity</span>
            </div>
        </div>
    );
};
