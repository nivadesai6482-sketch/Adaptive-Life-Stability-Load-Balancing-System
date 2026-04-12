import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Clock, ListRestart, PlayCircle, PlusCircle, AlertCircle } from 'lucide-react';
import { Task } from '../../store/taskStore';
import { optimizeTaskList } from '../../utils/loadBalancer';
import { BurnoutRiskLevel } from '../../utils/burnoutPredictor';

interface TaskOptimizerProps {
    tasks: Task[];
    cognitiveLoad: number;
    energyScore: number;
    burnoutRisk?: BurnoutRiskLevel;
}

export const TaskOptimizer: React.FC<TaskOptimizerProps> = ({ tasks, cognitiveLoad, energyScore, burnoutRisk }) => {
    const optimizedTasks = useMemo(() => {
        return optimizeTaskList(tasks.filter(t => t.status !== 'completed'), cognitiveLoad, energyScore, burnoutRisk);
    }, [tasks, cognitiveLoad, energyScore, burnoutRisk]);

    // Check if any changes were made
    const isBurnoutCorrection = burnoutRisk === 'HIGH';
    const hasChanges = isBurnoutCorrection ||
        optimizedTasks.length !== tasks.filter(t => t.status !== 'completed').length ||
        optimizedTasks.some(t => t.title.startsWith('[DEFERRED]'));

    if (!hasChanges) return null;

    return (
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-gray-800/40 p-6 shadow-sm transition-all duration-300 hover:shadow-md backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <ListRestart className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">AI Task Optimization</h3>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Load balancing & capacity alignment</p>
                    </div>
                </div>
                {cognitiveLoad > 80 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
                        <AlertCircle className="h-3 w-3 text-red-600" />
                        <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase">High Load Correction Active</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Visual Connector for MD+ screens */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
                        <ArrowRight className="h-5 w-5 text-indigo-500" />
                    </div>
                </div>

                {/* Original View */}
                <div className="space-y-3 opacity-60 grayscale-[0.3]">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Original Context</h4>
                    {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
                        <div key={task._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 line-clamp-1">{task.title}</span>
                        </div>
                    ))}
                    {tasks.filter(t => t.status !== 'completed').length > 5 && (
                        <p className="text-[10px] text-center text-gray-400 italic">+{tasks.filter(t => t.status !== 'completed').length - 5} more items scheduled</p>
                    )}
                </div>

                {/* Optimized View */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-2">Optimized Trajectory</h4>
                    {optimizedTasks.map((task) => {
                        const isNew = task._id.startsWith('auto-gen');
                        const isDeferred = task.title.startsWith('[DEFERRED]');

                        return (
                            <div
                                key={task._id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${isNew ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 shadow-sm border-l-4 border-l-emerald-500' :
                                    isDeferred ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 border-l-4 border-l-amber-500' :
                                        'bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-500 group'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isNew ? <PlusCircle className="h-4 w-4 text-emerald-600" /> :
                                        isDeferred ? <Clock className="h-4 w-4 text-amber-600" /> :
                                            <CheckCircle2 className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" />}

                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black tracking-tight ${isNew ? 'text-emerald-900 dark:text-emerald-400' :
                                            isDeferred ? 'text-amber-900 dark:text-amber-400' :
                                                'text-gray-900 dark:text-white'
                                            }`}>
                                            {task.title}
                                        </span>
                                        {isDeferred && (
                                            <span className="text-[10px] font-bold text-amber-600/70 uppercase">Deferred to {task.deadline}</span>
                                        )}
                                        {isNew && (
                                            <span className="text-[10px] font-bold text-emerald-600/70 uppercase">Injected for Energy Recovery</span>
                                        )}
                                    </div>
                                </div>

                                <div className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${task.priority === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                    }`}>
                                    {task.priority}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <p className="text-[10px] font-medium text-gray-500 max-w-md">
                    Optimization based on <span className="font-black text-gray-700 dark:text-gray-300">{cognitiveLoad.toFixed(1)}% Cognitive Load</span> and <span className="font-black text-gray-700 dark:text-gray-300">{energyScore}% Energy Capacity</span>.
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                    Commit Changes
                </button>
            </div>
        </div>
    );
};
