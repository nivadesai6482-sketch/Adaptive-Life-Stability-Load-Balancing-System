import { Task } from '../store/taskStore';
import { BurnoutRiskLevel } from './burnoutPredictor';

/**
 * Optimizes a task list based on current user load, energy metrics, and burnout risk.
 * 
 * @param tasks Current list of tasks
 * @param cognitiveLoad Current calculated cognitive load (0-100+)
 * @param energyScore Current energy score (0-100)
 * @param burnoutRisk Current predicted burnout risk level
 * @returns Optimized task list with deferred items or injected recovery
 */
export const optimizeTaskList = (
    tasks: Task[],
    cognitiveLoad: number,
    energyScore: number,
    burnoutRisk: BurnoutRiskLevel = 'LOW'
): Task[] => {
    let optimized = [...tasks];

    // 1. BURNOUT PROTOCOL (Critical Priority)
    // If burnout risk is HIGH, we initiate aggressive load shedding.
    if (burnoutRisk === 'HIGH') {
        const recoveryTask: Task = {
            _id: 'auto-gen-burnout-recovery-' + Date.now(),
            title: '🛌 CRITICAL RECOVERY: 30-min Deep Decompression',
            priority: 'high',
            deadline: new Date().toISOString(),
            status: 'todo'
        };

        // Filter out all but the most high priority tasks for immediate focus
        let highPriorityCount = 0;
        optimized = optimized.filter(task => {
            if (task.priority === 'high' && task.status === 'todo') {
                highPriorityCount++;
                return highPriorityCount <= 2; // Only allow 2 high priority tasks
            }
            return false; // Defer/Drop everything else
        });

        // Add deep recovery at the start
        optimized.unshift(recoveryTask);
        return optimized; // Exit early for high burnout
    }

    // 2. RECOVERY INJECTION
    // (Standard logic for non-burning out users)
    if (energyScore < 40) {
        const recoveryTask: Task = {
            _id: 'auto-gen-recovery-' + Date.now(),
            title: '🛑 MANDATORY RECOVERY: 15-min Decompression',
            priority: 'high',
            deadline: new Date().toISOString(),
            status: 'todo'
        };
        // Add to the very beginning
        optimized.unshift(recoveryTask);
    }

    // 2. LOAD SHEDDING (Priority 2)
    // If cognitive load is extreme, move low priority tasks to tomorrow.
    if (cognitiveLoad > 85) {
        optimized = optimized.map(task => {
            if (task.priority === 'low' && task.status !== 'completed') {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                return {
                    ...task,
                    title: `[DEFERRED] ${task.title}`,
                    deadline: tomorrow.toISOString().split('T')[0]
                };
            }
            return task;
        });
    }

    // 3. CAPACITY CAPPING
    // If load is high, we limit the number of active 'todo' tasks shown to reduce psychological pressure.
    if (cognitiveLoad > 70) {
        let activeTodoCount = 0;
        optimized = optimized.filter(task => {
            if (task.status === 'todo') {
                activeTodoCount++;
                // Only allow top 5 tasks to stay in 'todo', others are hidden/deferred in this view
                return activeTodoCount <= 5 || task.priority === 'high';
            }
            return true;
        });
    }

    return optimized;
};
