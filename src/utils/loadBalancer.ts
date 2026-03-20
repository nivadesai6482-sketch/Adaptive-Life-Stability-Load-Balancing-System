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

    // 3. OBJECTIVE OPTIMIZATION
    // Use the mathematical model to refine the rest of the schedule
    return optimizeSchedule(optimized, cognitiveLoad, energyScore);
};

/**
 * Advanced optimization function using a weighted risk scoring model.
 * Goal: Minimize Collapse Risk while respecting task priority.
 */
export const optimizeSchedule = (
    tasks: Task[],
    cognitiveLoad: number,
    energyScore: number
): Task[] => {
    let currentSchedule = [...tasks];

    // Risk Scoring Model: Higher is worse
    const calculateRisk = (t: Task[], load: number, energy: number) => {
        const loadFactor = load > 80 ? (load - 80) * 2 : 0;
        const energyFactor = energy < 30 ? (30 - energy) * 3 : 0;
        // Only count active todo tasks that ARE NOT deferred
        const activeTodoCount = t.filter(x => x.status === 'todo' && !x.title.startsWith('[OPTIMIZED DEFER]')).length;
        const taskFactor = activeTodoCount * 5;
        return loadFactor + energyFactor + taskFactor;
    };

    let riskScore = calculateRisk(currentSchedule, cognitiveLoad, energyScore);
    const TARGET_RISK = 40; // Slightly lower target for better stability

    // Optimization Loop: Defer tasks until risk is acceptable
    if (riskScore > TARGET_RISK) {
        // Sort by priority (low first) to defer least important tasks first
        const todoTasks = [...currentSchedule]
            .filter(t => t.status === 'todo' && !t.title.includes('RECOVERY') && !t.title.includes('[OPTIMIZED DEFER]'))
            .sort((a, b) => {
                const pMap = { low: 0, medium: 1, high: 2 };
                return pMap[a.priority] - pMap[b.priority];
            });

        for (const taskToDefer of todoTasks) {
            if (riskScore <= TARGET_RISK) break;

            // Defer the task
            currentSchedule = currentSchedule.map(t => {
                if (t._id === taskToDefer._id) {
                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + 1);
                    return {
                        ...t,
                        title: `[OPTIMIZED DEFER] ${t.title}`,
                        deadline: nextDate.toISOString().split('T')[0]
                    };
                }
                return t;
            });

            // Recalculate load (removing deferred task from current load)
            const weights = { high: 25, medium: 15, low: 5 };
            cognitiveLoad -= weights[taskToDefer.priority];
            riskScore = calculateRisk(currentSchedule, cognitiveLoad, energyScore);
        }
    }

    return currentSchedule;
};
