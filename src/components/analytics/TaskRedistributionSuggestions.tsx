import React, { useMemo } from 'react';
import { AlertCircle, ArrowRightCircle, XCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useStabilityStore } from '../../store/stabilityStore';
import { balanceLoad, BalancedTask } from '../../utils/loadBalancer';

export const TaskRedistributionSuggestions = () => {
    const { tasks } = useTaskStore();
    const { historicalScores } = useStabilityStore();

    // Calculate current load balancing recommendations
    const { 
        suggestions, 
        isOverloaded,
        latestScore 
    } = useMemo(() => {
        // Find latest score; default to 100 (optimal) if no data
        const currentScore = historicalScores.length > 0 
            ? historicalScores[historicalScores.length - 1].score 
            : 100;

        // Only process tasks that are currently active
        const activeTasks = tasks.filter(t => t.status !== 'completed');

        // Run through the engine
        const balancedTasks = balanceLoad(activeTasks, currentScore);

        // Filter for tasks that the engine explicitly flags to defer or drop
        const actionableSuggestions = balancedTasks.filter(
            t => t.suggestedAction === 'defer' || t.suggestedAction === 'drop'
        );

        return {
            suggestions: actionableSuggestions,
            isOverloaded: actionableSuggestions.length > 0,
            latestScore: currentScore
        };
    }, [tasks, historicalScores]);

    // If the user's capacity is high enough to handle all tasks, hide this component entirely
    if (!isOverloaded) {
        return null;
    }

    // Sort drops first (most critical actions), then defers
    const sortedSuggestions = [...suggestions].sort((a, b) => {
        if (a.suggestedAction === 'drop' && b.suggestedAction === 'defer') return -1;
        if (a.suggestedAction === 'defer' && b.suggestedAction === 'drop') return 1;
        return 0;
    });

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm mb-6 animate-fade-in">
            <div className="flex items-start mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-3 shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-lg font-bold text-red-900">System Overload Warning</h3>
                    <p className="text-sm text-red-700 mt-1">
                        Your Life Stability Index is currently at <strong>{latestScore}</strong>. 
                        To prevent structural collapse, the Load Balancer strongly recommends shedding the following active commitments immediately:
                    </p>
                </div>
            </div>

            <div className="space-y-3 mt-4 ml-9">
                {sortedSuggestions.map((task: BalancedTask) => (
                    <div 
                        key={task._id} 
                        className="bg-white rounded-lg p-4 border border-red-100 flex items-start justify-between shadow-sm"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {/* Action specific iconography */}
                                {task.suggestedAction === 'drop' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                        <XCircle className="h-3.5 w-3.5" /> DROP
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                                        <ArrowRightCircle className="h-3.5 w-3.5" /> DEFER
                                    </span>
                                )}
                                
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                                    task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                    {task.priority.toUpperCase()}
                                </span>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mt-2 text-sm md:text-base">
                                {task.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {task.reason}
                            </p>
                        </div>

                        <div className="text-right ml-4 shrink-0">
                            <span className="text-xs font-medium text-gray-500 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                Due: {task.deadline}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
