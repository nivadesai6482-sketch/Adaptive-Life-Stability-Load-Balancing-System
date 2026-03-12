import React from 'react';
import { ShieldCheck, AlertCircle, Skull } from 'lucide-react';

interface CollapseRiskIndicatorProps {
    lsi: number;
}

export const CollapseRiskIndicator: React.FC<CollapseRiskIndicatorProps> = ({ lsi }) => {
    let status: 'Stable' | 'Warning' | 'Critical';
    let color: string;
    let bgColor: string;
    let borderColor: string;
    let Icon: React.ElementType;
    let description: string;

    if (lsi > 70) {
        status = 'Stable';
        color = 'text-green-700';
        bgColor = 'bg-green-50';
        borderColor = 'border-green-200';
        Icon = ShieldCheck;
        description = 'Your life stability is currently within a safe range. System load is well-distributed.';
    } else if (lsi >= 40) {
        status = 'Warning';
        color = 'text-amber-700';
        bgColor = 'bg-amber-50';
        borderColor = 'border-amber-200';
        Icon = AlertCircle;
        description = 'Multiple domains are showing signs of strain. Immediate load balancing is recommended to prevent further degradation.';
    } else {
        status = 'Critical';
        color = 'text-red-700';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-200';
        Icon = Skull;
        description = 'System is at high risk of collapse. Immediate intervention in multiple domains is required to maintain functional stability.';
    }

    return (
        <div className={`rounded-xl border p-5 shadow-sm transition-all duration-300 ${bgColor} ${borderColor}`}>
            <div className="flex items-start gap-4">
                <div className={`rounded-full bg-white p-3 shadow-sm ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80">Collapse Risk Level</h3>
                        <span className={`inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-xs font-bold ${color}`}>
                            {status}
                        </span>
                    </div>
                    
                    <div className="mt-1 flex items-baseline gap-2">
                        <h4 className={`text-2xl font-bold ${color}`}>
                            {status}
                        </h4>
                        <span className="text-xs text-gray-400 font-medium">LSI: {lsi.toFixed(1)}</span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>

                    <div className="mt-4 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${lsi > 70 ? 'bg-green-500' : lsi >= 40 ? 'bg-amber-500' : 'bg-red-600'}`}
                            style={{ width: `${lsi}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
