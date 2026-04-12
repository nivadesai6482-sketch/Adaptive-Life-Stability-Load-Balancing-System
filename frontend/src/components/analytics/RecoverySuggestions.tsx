import React from 'react';
import { Coffee, Calendar, XCircle, ArrowRightCircle, LifeBuoy } from 'lucide-react';

interface RecoverySuggestionsProps {
    lsi: number;
}

interface Suggestion {
    id: string;
    text: string;
    icon: React.ElementType;
    priority: 'high' | 'medium';
}

export const RecoverySuggestions: React.FC<RecoverySuggestionsProps> = ({ lsi }) => {
    // Hidden if stability is high
    if (lsi >= 70) return null;

    const isCritical = lsi < 40;
    
    const suggestions: Suggestion[] = isCritical ? [
        { 
            id: 'emergency-rest', 
            text: 'Immediate emergency rest: Disconnect for at least 4 hours.', 
            icon: Coffee,
            priority: 'high'
        },
        { 
            id: 'cancel-non-essential', 
            text: 'Cancel all non-essential meetings and commitments for the next 48 hours.', 
            icon: XCircle,
            priority: 'high'
        },
        { 
            id: 'seek-support', 
            text: 'Seek external support or delegate urgent tasks to a trusted contact.', 
            icon: LifeBuoy,
            priority: 'high'
        }
    ] : [
        { 
            id: 'reduce-workload', 
            text: 'Reduce workload: Cap active tasks to maximum 3 for today.', 
            icon: ArrowRightCircle,
            priority: 'medium'
        },
        { 
            id: 'schedule-rest', 
            text: 'Schedule intentional rest: 20-minute break every 90 minutes.', 
            icon: Coffee,
            priority: 'medium'
        },
        { 
            id: 'postpone-tasks', 
            text: 'Postpone non-urgent tasks to next week to clear cognitive space.', 
            icon: Calendar,
            priority: 'medium'
        }
    ];

    return (
        <div className={`rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm`}>
            <div className="flex items-center gap-2 mb-4">
                <LifeBuoy className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-800 opacity-80">
                    Recovery Protocol
                </h3>
            </div>

            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-start gap-3 group">
                        <div className={`mt-0.5 rounded-lg p-1.5 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            <suggestion.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 leading-snug">
                                {suggestion.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-blue-100">
                <p className="text-xs text-blue-600 font-medium italic">
                    {isCritical 
                        ? "Critical Protocol Active: Prioritize biological recovery over system performance." 
                        : "Warning Protocol: Moderate load reduction required to stabilize index."}
                </p>
            </div>
        </div>
    );
};
