import React from 'react';
import { Activity, Heart, Moon, RefreshCw, Smartphone } from 'lucide-react';
import { HealthData } from '../../services/health/fitbitService';
import { EnergyLevel, StressLevel } from '../../services/health/healthAnalyzer';

interface HealthTelemetryCardProps {
    data: HealthData;
    energy?: EnergyLevel;
    stress?: StressLevel;
    isSyncing?: boolean;
    onRefresh?: () => void;
}

export const HealthTelemetryCard: React.FC<HealthTelemetryCardProps> = ({ data, energy, stress, isSyncing, onRefresh }) => {
    return (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                        <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Telemetry</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Google Fit Connected</p>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isSyncing}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Heart className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Heart Rate</span>
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{data.heartRate} <span className="text-xs font-normal text-gray-400">BPM</span></div>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Moon className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Sleep</span>
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{data.sleepHours} <span className="text-xs font-normal text-gray-400">Hrs</span></div>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Activity</span>
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white capitalize">{data.activityLevel}</div>
                </div>

                <div className="flex flex-col p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Daily Steps</span>
                    </div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{data.steps.toLocaleString()}</div>
                </div>
            </div>

            {/* Analysis Row */}
            {(energy || stress) && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {energy && (
                        <div className="flex flex-col p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Energy Score</span>
                            <div className="text-sm font-black text-emerald-900 dark:text-emerald-300 uppercase tracking-tight">{energy} level</div>
                        </div>
                    )}
                    {stress && (
                        <div className={`flex flex-col p-3 rounded-xl border ${stress === 'high'
                            ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100/50 dark:border-red-900/20'
                            : 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100/50 dark:border-blue-900/20'
                            }`}>
                            <span className={`text-[10px] font-bold uppercase mb-1 ${stress === 'high' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                                }`}>Stress Level</span>
                            <div className={`text-sm font-black uppercase tracking-tight ${stress === 'high' ? 'text-red-900 dark:text-red-300' : 'text-blue-900 dark:text-blue-300'
                                }`}>{stress}</div>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span>BIO-TELEMETRY FEED</span>
                    <span>LAST SYNC: {new Date(data.lastSync).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
};
