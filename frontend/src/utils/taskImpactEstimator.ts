import { Task } from '../store/taskStore';
import { COGNITIVE_LOAD_WEIGHTS } from './taskLoadAnalyzer';

export interface TaskImpact {
    cognitiveLoadContribution: number;
    stabilityImpact: number; // Percentage points of LSI reduction
    recoveryCost: number; // Hours of recovery time added
}

/**
 * Estimates the projected impact of a single task on system stability.
 * 
 * @param task The task object to analyze
 * @returns A TaskImpact object containing projected costs
 */
export const estimateTaskImpact = (task: Task): TaskImpact => {
    const cognitiveLoad = COGNITIVE_LOAD_WEIGHTS[task.priority] || 0;
    
    let stabilityImpact = 0;
    let recoveryCost = 0;

    switch (task.priority) {
        case 'high':
            stabilityImpact = 5.0;
            recoveryCost = 2.0;
            break;
        case 'medium':
            stabilityImpact = 2.0;
            recoveryCost = 1.0;
            break;
        case 'low':
            stabilityImpact = 0.5;
            recoveryCost = 0.25;
            break;
    }

    return {
        cognitiveLoadContribution: cognitiveLoad,
        stabilityImpact,
        recoveryCost
    };
};

/**
 * Calculates the total projected impact of a set of active tasks.
 * 
 * @param tasks Array of tasks to analyze
 * @returns Aggregated TaskImpact for all active tasks
 */
export const calculateTotalProjectedImpact = (tasks: Task[]): TaskImpact => {
    const activeTasks = tasks.filter(task => task.status !== 'completed');
    
    return activeTasks.reduce((acc, task) => {
        const impact = estimateTaskImpact(task);
        return {
            cognitiveLoadContribution: acc.cognitiveLoadContribution + impact.cognitiveLoadContribution,
            stabilityImpact: acc.stabilityImpact + impact.stabilityImpact,
            recoveryCost: acc.recoveryCost + impact.recoveryCost
        };
    }, { cognitiveLoadContribution: 0, stabilityImpact: 0, recoveryCost: 0 });
};
