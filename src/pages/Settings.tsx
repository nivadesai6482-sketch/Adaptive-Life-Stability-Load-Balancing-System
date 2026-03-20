import React from 'react';
import {
    Bell, ShieldAlert, Sliders, Activity, Zap,
    Heart, DollarSign, Brain, Target, Save,
    Settings as SettingsIcon, Info
} from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">

            {/* Header section with icon */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                        <SettingsIcon className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">System Settings</h1>
                        <p className="text-slate-400 font-medium text-sm">Fine-tune your cognitive load balancing and stability parameters.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group">
                    <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* Left Column: Toggles & Inputs */}
                <div className="md:col-span-4 space-y-6">

                    {/* Notifications Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Alert Protocols
                        </h2>

                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-white">Stability Alerts</p>
                                    <p className="text-[10px] text-slate-500">Notify on index drops</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:bg-white"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-white">Burnout Warnings</p>
                                    <p className="text-[10px] text-slate-500">Critical stress triggers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 peer-checked:after:bg-white"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Thresholds Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                        <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4" />
                            Safety Thresholds
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase">Burnout Alert (%)</label>
                                    <span className="text-[10px] bg-slate-800 text-indigo-400 px-1.5 py-0.5 rounded font-bold">85%</span>
                                </div>
                                <input type="number" defaultValue="85" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-bold focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[11px] font-black text-slate-400 uppercase">Collapse Trigger (LSI)</label>
                                    <span className="text-[10px] bg-slate-800 text-rose-400 px-1.5 py-0.5 rounded font-bold">40.0</span>
                                </div>
                                <input type="number" defaultValue="40" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-bold focus:ring-1 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Configuration Sliders */}
                <div className="md:col-span-8 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <h2 className="text-lg font-black text-white flex items-center gap-3">
                                <Sliders className="h-5 w-5 text-indigo-400" />
                                Stability Domain Weighting
                            </h2>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                                <Info className="h-3 w-3" />
                                Balanced Mode
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-10">

                            <div className="group space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                                            <Zap className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-wide">Time Allocation</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">75%</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all" />
                            </div>

                            <div className="group space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                                            <Activity className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-wide">Biological Energy</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">85%</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all" />
                            </div>

                            <div className="group space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                            <Brain className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-wide">Cognitive Bandwidth</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">60%</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all" />
                            </div>

                            <div className="group space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                                            <Heart className="h-4 w-4 text-rose-500" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-wide">Emotional Stability</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">90%</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400 transition-all" />
                            </div>

                            <div className="group space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-600/10 rounded-lg group-hover:bg-emerald-600/20 transition-colors">
                                            <DollarSign className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-wide">Financial Flow</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">45%</span>
                                </div>
                                <input type="range" className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all" />
                            </div>

                        </div>

                        <div className="pt-6 border-t border-slate-800 flex items-center gap-4 bg-indigo-600/5 p-4 rounded-xl border-dashed border-indigo-500/20">
                            <div className="p-2 bg-indigo-600 text-white rounded-lg">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-wider">Adjustment Optimization</p>
                                <p className="text-[10px] text-slate-400 font-medium">Changes to these parameters will immediately recalculate your global Life Stability Index.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
