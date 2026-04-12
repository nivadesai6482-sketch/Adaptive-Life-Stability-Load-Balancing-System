import { Task } from '../store/taskStore';

/**
 * Unit weights for each task priority level.
 * These reflect the estimated cognitive burden of a single task.
 */
export const COGNITIVE_LOAD_WEIGHTS = {
    high: 30,
    medium: 15,
    low: 5,
};

/**
 * Estimates the total cognitive load based on active tasks.
 * 
 * @param tasks Array of tasks from the taskStore
 * @returns A number between 0 and 100 representing the estimated load.
 */
export const calculateCognitiveLoad = (tasks: Task[]): number => {
    // Only calculate load for tasks that are not completed
    const activeTasks = tasks.filter(task => task.status !== 'completed');
    
    const totalLoad = activeTasks.reduce((sum, task) => {
        return sum + (COGNITIVE_LOAD_WEIGHTS[task.priority] || 0);
    }, 0);

    // Clamp the load between 0 and 100
    return Math.min(100, Math.max(0, totalLoad));
};

/**
 * Returns a descriptive status for the calculated cognitive load.
 * 
 * @param load The numerical load value (0-100)
 * @returns A string status level
 */
export const getLoadStatus = (load: number): 'Optimal' | 'Moderate' | 'High' | 'Overloaded' => {
    if (load <= 30) return 'Optimal';
    if (load <= 60) return 'Moderate';
    if (load <= 90) return 'High';
    return 'Overloaded';
};
