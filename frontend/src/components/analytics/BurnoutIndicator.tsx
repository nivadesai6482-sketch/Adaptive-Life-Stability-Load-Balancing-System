import React from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BurnoutRiskLevel } from '../../utils/burnoutPredictor';

interface BurnoutIndicatorProps {
    risk: BurnoutRiskLevel;
}

export const BurnoutIndicator: React.FC<BurnoutIndicatorProps> = ({ risk }) => {
    const getStyles = () => {
        switch (risk) {
            case 'HIGH':
                return {
                    container: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30',
                    text: 'text-red-700 dark:text-red-400',
                    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
                    icon: <ShieldAlert className="h-5 w-5 text-red-600" />
                };
            case 'MEDIUM':
                return {
                    container: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30',
                    text: 'text-amber-700 dark:text-amber-400',
                    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
                    icon: <AlertCircle className="h-5 w-5 text-amber-600" />
                };
            case 'LOW':
            default:
                return {
                    container: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30',
                    text: 'text-emerald-700 dark:text-emerald-400',
                    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
                    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                };
        }
    };

    const styles = getStyles();

    return (
        <div className={`p-4 rounded-2xl border ${styles.container} transition-all duration-300 shadow-sm`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
                        {styles.icon}
                    </div>
                    <div>
                        <h4 className={`text-sm font-black uppercase tracking-wider ${styles.text}`}>
                            Burnout Risk Check
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Current Forecast:</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${styles.badge}`}>
                                {risk}
                            </span>
                        </div>
                    </div>
                </div>
                {risk === 'HIGH' && (
                    <div className="bg-white dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/30 animate-pulse">
                        <span className="text-xs font-black text-red-600 uppercase">Action Required</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-current opacity-10">
                <p className={`text-xs font-bold leading-relaxed ${styles.text}`}>
                    {risk === 'HIGH'
                        ? 'System detected extreme cognitive load relative to biological recovery. Immediate load-shedding recommended.'
                        : risk === 'MEDIUM'
                            ? 'Warning: Stability buffers are thinning. Monitor energy expenditures closely.'
                            : 'Biometric buffers are healthy. System operating within optimal recovery bounds.'}
                </p>
            </div>
        </div>
    );
};
