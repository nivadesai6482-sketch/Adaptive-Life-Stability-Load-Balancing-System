import React from 'react';
import { Bell, ShieldAlert, Sliders, Activity, Zap, Heart, DollarSign, Brain, Target } from 'lucide-react';

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <h1 className="text-white text-2xl font-bold bg-indigo-600 p-4 rounded-xl text-center">Settings Page Loaded</h1>

            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
                <p className="text-slate-400 font-medium">Configure your life stability system and notification thresholds.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* SECTION 1: Notification Settings */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                        <Bell className="h-5 w-5 text-indigo-400" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Notification Settings</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                            <div>
                                <p className="font-bold text-white">System Alerts</p>
                                <p className="text-xs text-slate-400">Receive notifications for stability drops or capacity changes.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
                            <div>
                                <p className="font-bold text-white">Burnout Warnings</p>
                                <p className="text-xs text-slate-400">Enable high-priority triggers when biological stress signals are critical.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Stability Configuration */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                        <Sliders className="h-5 w-5 text-emerald-400" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Stability Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-300 font-bold"><Zap className="h-4 w-4 text-amber-400" /> Time Stability</span>
                                <span className="text-white font-black bg-slate-800 px-2 py-1 rounded">75%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-300 font-bold"><Activity className="h-4 w-4 text-emerald-400" /> Energy Reserves</span>
                                <span className="text-white font-black bg-slate-800 px-2 py-1 rounded">85%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-300 font-bold"><Brain className="h-4 w-4 text-indigo-400" /> Cognitive Load</span>
                                <span className="text-white font-black bg-slate-800 px-2 py-1 rounded">60%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-300 font-bold"><Heart className="h-4 w-4 text-rose-400" /> Emotional Baseline</span>
                                <span className="text-white font-black bg-slate-800 px-2 py-1 rounded">90%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="flex items-center gap-2 text-slate-300 font-bold"><DollarSign className="h-4 w-4 text-emerald-500" /> Financial Liquidity</span>
                                <span className="text-white font-black bg-slate-800 px-2 py-1 rounded">45%</span>
                            </div>
                            <input type="range" className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                        </div>
                    </div>
                </section>

                {/* SECTION 3: Threshold Settings */}
                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-lg">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                        <ShieldAlert className="h-5 w-5 text-rose-400" />
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider text-sm">Threshold Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Target className="h-4 w-4 text-rose-500" />
                                Burnout Trigger (%)
                            </label>
                            <input
                                type="number"
                                defaultValue="85"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                            <p className="text-[10px] text-slate-500">System initiates aggressive shedding above this value.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Target className="h-4 w-4 text-amber-500" />
                                Collapse Trigger (LSI)
                            </label>
                            <input
                                type="number"
                                defaultValue="40"
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            />
                            <p className="text-[10px] text-slate-500">System signals structural vulnerability below this index.</p>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                        Save Global System Parameters
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
