import React, { useState } from 'react';
import { SlidersHorizontal, Bell, Shield, Save } from 'lucide-react';

export const Settings = () => {
    // Local state for UI demonstration
    const [thresholds, setThresholds] = useState({
        optimal: 75,
        warning: 50,
        critical: 40
    });

    const [weights, setWeights] = useState({
        time: 1.0,
        energy: 1.2,
        cognitive: 1.5,
        emotional: 1.0,
        financial: 0.8
    });

    const [notifications, setNotifications] = useState({
        pushEnabled: true,
        emailDailySummary: false,
        muteLowPriority: false,
        alertSystemCollapse: true
    });

    const handleSave = () => {
        // In a real implementation, this would sync with a backend UserPreferences store
        console.log('Saving settings:', { thresholds, weights, notifications });
        alert('Settings saved successfully. Load balancer algorithms updated.');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Fine-tune the mathematical parameters of your Load Balancing System.
                </p>
            </div>

            {/* Threshold Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center">
                    <Shield className="h-5 w-5 text-indigo-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Stability Thresholds</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">Optimal Boundary (LSI)</label>
                            <span className="text-sm text-gray-500">{thresholds.optimal}</span>
                        </div>
                        <input 
                            type="range" 
                            min="60" max="100" 
                            value={thresholds.optimal} 
                            onChange={(e) => setThresholds({...thresholds, optimal: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                        />
                        <p className="text-xs text-gray-500 mt-2">Scores above this line indicate safe, sustainable load capacity.</p>
                    </div>
                    
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">Warning Boundary (LSI)</label>
                            <span className="text-sm text-gray-500">{thresholds.warning}</span>
                        </div>
                        <input 
                            type="range" 
                            min="41" max="74" 
                            value={thresholds.warning} 
                            onChange={(e) => setThresholds({...thresholds, warning: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                        />
                         <p className="text-xs text-gray-500 mt-2">Scores dropping below this line will trigger "Defer" suggestions for medium-priority tasks.</p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">Critical Boundary (LSI)</label>
                            <span className="text-sm text-gray-500">{thresholds.critical}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" max="50" 
                            value={thresholds.critical} 
                            onChange={(e) => setThresholds({...thresholds, critical: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" 
                        />
                        <p className="text-xs text-gray-500 mt-2">The Absolute failure baseline. Triggers immediate component lockdown and "Drop" commands.</p>
                    </div>
                </div>
            </div>

            {/* Algorithm Weights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center">
                    <SlidersHorizontal className="h-5 w-5 text-blue-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Domain Sensitivity (Algorithm Weights)</h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-6 font-medium">
                        Adjust horizontal multipliers. Domains with weights &gt; 1.0 will impact your overall LSI more aggressively.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(weights).map(([domain, weight]) => (
                            <div key={domain} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-bold text-gray-700 capitalize">{domain} Load</label>
                                    <span className="text-sm font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-700 shadow-sm">{weight.toFixed(1)}x</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.1" max="3.0" step="0.1"
                                    value={weight} 
                                    onChange={(e) => setWeights({...weights, [domain]: parseFloat(e.target.value)})}
                                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center">
                    <Bell className="h-5 w-5 text-amber-500 mr-3" />
                    <h3 className="font-semibold text-gray-900">Notification & Alert Preferences</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                            <p className="font-medium text-gray-900">Enable Dashboard Push UI</p>
                            <p className="text-sm text-gray-500">Allow visual alerts to spawn dynamically on the dashboard.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.pushEnabled}
                                onChange={() => setNotifications({...notifications, pushEnabled: !notifications.pushEnabled})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                            <p className="font-medium text-gray-900">System Collapse Overrides</p>
                            <p className="text-sm text-gray-500">Allow the Load Balancer to force "Drop" commands regardless of task priority.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.alertSystemCollapse}
                                onChange={() => setNotifications({...notifications, alertSystemCollapse: !notifications.alertSystemCollapse})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                            <p className="font-medium text-gray-900">Mute Routine Notifications</p>
                            <p className="text-sm text-gray-500">Only alert me when thresholds cross the 'Critical' line. Hide warnings.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={notifications.muteLowPriority}
                                onChange={() => setNotifications({...notifications, muteLowPriority: !notifications.muteLowPriority})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    className="flex items-center bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
                >
                    <Save className="h-5 w-5 mr-2" />
                    Save Configuration
                </button>
            </div>
        </div>
    );
};
