import React from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';
import { RiskLevel } from '../../utils/stabilityPrediction';

interface CollapseForecastProps {
    collapseWindow: {
        daysUntilCollapse: number | null;
        riskLevel: RiskLevel;
    } | undefined;
}

export const CollapseForecast: React.FC<CollapseForecastProps> = ({ collapseWindow }) => {
    if (!collapseWindow) return null;

    const { daysUntilCollapse, riskLevel } = collapseWindow;

    const config = {
        HIGH: {
            bg: 'bg-red-50 dark:bg-red-950/20',
            border: 'border-red-100 dark:border-red-900/50',
            text: 'text-red-700 dark:text-red-400',
            subtext: 'text-red-600/70 dark:text-red-400/70',
            icon: <ShieldAlert className="h-6 w-6 text-red-600" />,
            badge: 'bg-red-100 text-red-700',
            message: 'Critical stability breach imminent. The system trajectory indicates structural failure within the immediate horizon.',
            title: 'Immediate Collapse Risk'
        },
        MEDIUM: {
            bg: 'bg-amber-50 dark:bg-amber-950/20',
            border: 'border-amber-100 dark:border-amber-900/50',
            text: 'text-amber-800 dark:text-amber-400',
            subtext: 'text-amber-700/70 dark:text-amber-400/70',
            icon: <AlertTriangle className="h-6 w-6 text-amber-600" />,
            badge: 'bg-amber-100 text-amber-800',
            message: 'Downward stability trend detected. Corrective load-balancing protocols should be initiated to avoid threshold breach.',
            title: 'Elevated Risk Window'
        },
        LOW: {
            bg: 'bg-emerald-50 dark:bg-emerald-950/20',
            border: 'border-emerald-100 dark:border-emerald-900/50',
            text: 'text-emerald-800 dark:text-emerald-400',
            subtext: 'text-emerald-700/70 dark:text-emerald-400/70',
            icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
            badge: 'bg-emerald-100 text-emerald-800',
            message: 'All system trajectories remain within the stable operational window for the current forecast period.',
            title: 'Stable Trajectory'
        }
    };

    const current = config[riskLevel];

    return (
        <div className={`rounded-2xl border ${current.border} ${current.bg} p-5 shadow-sm transition-all duration-300 hover:shadow-md backdrop-blur-sm`}>
            <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-900 shadow-sm`}>
                    {current.icon}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-black uppercase tracking-tight ${current.text}`}>
                            {current.title}
                        </h4>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${current.badge}`}>
                            {riskLevel} Risk
                        </span>
                    </div>

                    <p className={`text-sm font-bold leading-relaxed ${current.text}`}>
                        {current.message}
                    </p>

                    {daysUntilCollapse !== null && (
                        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-current/10">
                            <div className="flex items-center gap-1.5">
                                <Clock className={`h-4 w-4 ${current.subtext}`} />
                                <span className={`text-xs font-black uppercase tracking-wider ${current.subtext}`}>
                                    Forecast Window
                                </span>
                            </div>
                            <div className={`px-3 py-1 rounded-lg bg-white/50 dark:bg-black/20 text-sm font-black ${current.text}`}>
                                {daysUntilCollapse} {daysUntilCollapse === 1 ? 'Day' : 'Days'} Remaining
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {riskLevel === 'HIGH' && (
                <div className="mt-4 animate-pulse">
                    <div className="h-1 w-full bg-red-200 dark:bg-red-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 w-3/4 rounded-full" />
                    </div>
                </div>
            )}
        </div>
    );
};
