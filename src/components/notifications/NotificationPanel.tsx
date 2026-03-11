import React from 'react';
import { AlertTriangle, AlertCircle, Info, Brain, Battery, HeartPulse } from 'lucide-react';

type Severity = 'critical' | 'warning' | 'info';

interface NotificationProps {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    icon?: React.ReactNode;
    timestamp: string;
}

const notifications: NotificationProps[] = [
    {
        id: '1',
        title: 'High Cognitive Load Detected',
        description: 'Context switching has exceeded optimal thresholds. Consider restructuring your next 2 hours for deep work.',
        severity: 'critical',
        icon: <Brain className="h-5 w-5" />,
        timestamp: '10 mins ago'
    },
    {
        id: '2',
        title: 'Low Energy Reserve Warning',
        description: 'Physical energy metrics are trending downward faster than usual. A 15-minute recovery break is recommended.',
        severity: 'warning',
        icon: <Battery className="h-5 w-5" />,
        timestamp: '45 mins ago'
    },
    {
        id: '3',
        title: 'Emotional Instability Alert',
        description: 'Slight elevation in stress markers detected during the last meeting block. Monitor emotional bandwidth closely.',
        severity: 'warning',
        icon: <HeartPulse className="h-5 w-5" />,
        timestamp: '2 hours ago'
    },
    {
        id: '4',
        title: 'System Rebalanced',
        description: 'Afternoon tasks have been successfully micro-segmented to match your current capacity.',
        severity: 'info',
        icon: <Info className="h-5 w-5" />,
        timestamp: '3 hours ago'
    }
];

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

export const NotificationPanel: React.FC = () => {
    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">System Alerts</h3>
                    <p className="text-sm text-gray-500">Real-time load balancing adjustments.</p>
                </div>
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    1 Critical
                </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const config = severityConfig[notification.severity];
                        return (
                            <div
                                key={notification.id}
                                className="relative flex gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
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
                                        <button className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                            View details
                                        </button>
                                        <span className="text-gray-300">•</span>
                                        <button className="text-xs font-medium text-gray-500 hover:text-gray-700">
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
