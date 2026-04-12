import React, { useMemo } from 'react';
import { AlertTriangle, AlertCircle, Info, Brain, Battery, ShieldCheck } from 'lucide-react';

type Severity = 'critical' | 'warning' | 'info';

export interface NotificationProps {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    icon?: React.ReactNode;
    timestamp: string;
}

import { BurnoutRiskLevel } from '../../utils/burnoutPredictor';

interface NotificationPanelProps {
    lsiScore: number;
    domainScores: {
        Energy: number;
        Cognitive: number;
        [key: string]: number;
    };
    burnoutRisk?: BurnoutRiskLevel;
}

const severityConfig = {
    critical: {
        bg: 'bg-red-50 text-red-700 ring-red-600/10',
        iconColor: 'text-red-600',
        defaultIcon: <AlertCircle className="h-5 w-5" />
    },
    warning: {
        bg: 'bg-amber-50 text-amber-800 ring-amber-600/20',
        iconColor: 'text-amber-600',
        defaultIcon: <AlertTriangle className="h-5 w-5" />
    },
    info: {
        bg: 'bg-blue-50 text-blue-700 ring-blue-700/10',
        iconColor: 'text-blue-600',
        defaultIcon: <Info className="h-5 w-5" />
    }
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ lsiScore, domainScores, burnoutRisk }) => {

    // Dynamically generate alerts based on live metrics
    const notifications = useMemo(() => {
        const alerts: NotificationProps[] = [];

        if (burnoutRisk === 'HIGH') {
            alerts.push({
                id: 'burnout-high-risk',
                title: "It's time for a real break 🌿",
                description: "You've been pushing yourself so hard lately, and I'm worried you're at your limit. Please, take some time just for yourself right now.",
                severity: 'critical',
                icon: <AlertCircle className="h-5 w-5" />,
                timestamp: 'Just now'
            });
        }

        if (lsiScore < 60) {
            alerts.push({
                id: 'sys-stability-critical',
                title: 'Things feel a bit heavy right now',
                description: "Life feels a little off-balance at the moment. It might be a good time to slow down and focus on what really matters to you.",
                severity: 'critical',
                icon: <AlertCircle className="h-5 w-5" />,
                timestamp: 'Just now'
            });
        }

        if (domainScores.Cognitive < 50) {
            alerts.push({
                id: 'cog-load-warning',
                title: "Your mind needs a little rest 🧠",
                description: "You've been juggling a lot of thoughts. How about closing a few tabs—both on your screen and in your mind—for a while?",
                severity: 'warning',
                icon: <Brain className="h-5 w-5" />,
                timestamp: 'Just now'
            });
        }

        if (domainScores.Energy < 50) {
            alerts.push({
                id: 'energy-reserve-warning',
                title: "Feeling a bit drained? 🔋",
                description: "Your energy is dipping. Maybe a quick walk or a glass of water could help you feel a bit more like yourself?",
                severity: 'warning',
                icon: <Battery className="h-5 w-5" />,
                timestamp: 'Just now'
            });
        }

        return alerts;
    }, [lsiScore, domainScores, burnoutRisk]);

    const criticalCount = notifications.filter(n => n.severity === 'critical').length;
    const warningCount = notifications.filter(n => n.severity === 'warning').length;

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Supportive Observations</h3>
                    <p className="text-sm text-gray-500">Gently keeping an eye on how you're feeling.</p>
                </div>

                {/* Dynamic Badge */}
                {notifications.length > 0 && (
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${criticalCount > 0
                        ? 'bg-red-50 text-red-700 ring-red-600/10'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/10'
                        }`}>
                        {criticalCount > 0
                            ? `${criticalCount} Critical`
                            : `${warningCount} Warning`}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    // Empty Stable State
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                            <ShieldCheck className="h-6 w-6 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">Everything is calm</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                            You seem to be in a good place right now. I'm here if anything changes.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => {
                            const config = severityConfig[notification.severity];
                            return (
                                <div
                                    key={notification.id}
                                    className="relative flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md animate-fade-in"
                                >
                                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}>
                                        <span className={config.iconColor}>
                                            {notification.icon || config.defaultIcon}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notification.timestamp}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                            {notification.description}
                                        </p>

                                        <div className="mt-3 flex gap-2">
                                            {notification.severity === 'critical' && (
                                                <button className="text-xs font-bold text-red-600 hover:text-red-500 bg-red-50 px-2 py-1 rounded">
                                                    Initiate Protocol
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
