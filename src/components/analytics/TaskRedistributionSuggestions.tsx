import React, { useMemo } from 'react';
import { AlertCircle, ArrowRightCircle, XCircle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useStabilityStore } from '../../store/stabilityStore';
import { balanceLoad, BalancedTask } from '../../utils/loadBalancer';

export const TaskRedistributionSuggestions = React.memo(() => {
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
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6 shadow-sm mb-8 animate-fade-in transition-all duration-300">
            <div className="flex items-start mb-6 border-b border-red-100/50 dark:border-red-900/30 pb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4 text-red-600 dark:text-red-500 shadow-sm">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-red-900 dark:text-red-400 tracking-tight">System Overload Warning</h3>
                    <p className="text-xs font-bold text-red-700/80 dark:text-red-300/80 mt-0.5 uppercase tracking-wider">
                        Stability Index: <span className="text-red-600 dark:text-red-400">{latestScore}</span> — Immediate action recommended
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {sortedSuggestions.map((task: BalancedTask) => (
                    <div 
                        key={task._id} 
                        className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-red-100/50 dark:border-gray-700/50 flex items-start justify-between shadow-sm transition-all duration-300 hover:shadow-md hover:border-red-200 dark:hover:border-red-500/30 group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                {/* Action specific iconography */}
                                {task.suggestedAction === 'drop' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-red-600 text-white dark:bg-red-900/80 dark:text-red-200 shadow-sm uppercase tracking-wider">
                                        <XCircle className="h-3 w-3" /> DROP
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500 text-white dark:bg-amber-900/80 dark:text-amber-200 shadow-sm uppercase tracking-wider">
                                        <ArrowRightCircle className="h-3 w-3" /> DEFER
                                    </span>
                                )}
                                
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border shadow-sm uppercase tracking-wider ${
                                    task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' :
                                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                                    'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                }`}>
                                    {task.priority}
                                </span>
                            </div>
                            
                            <h4 className="font-black text-gray-900 dark:text-white mt-3 text-sm tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {task.title}
                            </h4>
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 max-w-2xl italic">
                                "{task.reason}"
                            </p>
                        </div>

                        <div className="text-right ml-4 shrink-0">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 whitespace-nowrap bg-gray-50/50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700/50 block shadow-inner">
                                DUE: {task.deadline}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
