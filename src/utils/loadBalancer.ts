import { Task } from '../store/taskStore';

export interface BalancedTask extends Task {
    suggestedAction: 'focus' | 'defer' | 'drop';
    reason: string;
}

/**
 * The core Load Balancing engine.
 * Takes the current active tasks and the user's latest cognitive stability score,
 * and determines which tasks should be actioned vs. delayed to prevent collapse.
 */
export const balanceLoad = (
    activeTasks: Task[],
    cognitiveScore: number
): BalancedTask[] => {
    // 1. Establish the "Max Daily Weight" based on cognitive score
    // These thresholds mirror our established LSI bands
    let maxCapacity = 0;
    if (cognitiveScore >= 75) {
        maxCapacity = 12; // High capacity (e.g., 4 High Priority or 12 Low Priority)
    } else if (cognitiveScore >= 50) {
        maxCapacity = 7; // Warning capacity
    } else {
        maxCapacity = 3;  // Critical, survival mode (e.g., exactly 1 High Priority)
    }

    // 2. Map raw tasks to their inherent "weight"
    const getTaskWeight = (priority: string): number => {
        switch (priority) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
            default: return 1;
        }
    };

    // 3. Sort tasks: Highest priority first, then closest deadline
    const sortedTasks = [...activeTasks].sort((a, b) => {
        const weightDiff = getTaskWeight(b.priority) - getTaskWeight(a.priority);
        if (weightDiff !== 0) return weightDiff;
        
        // If priorities are equal, sort by deadline (closest first)
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return dateA - dateB;
    });

    let currentLoad = 0;
    
    // 4. Redistribute: Apply the max capacity threshold against the sorted sequence
    const balancedSet: BalancedTask[] = sortedTasks.map((task) => {
        const weight = getTaskWeight(task.priority);
        const taskDeadline = new Date(task.deadline);
        const today = new Date();
        
        // Normalize time comparison to midnight
        taskDeadline.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const isOverdueOrToday = taskDeadline <= today;

        // If we still have capacity to absorb this task
        if (currentLoad + weight <= maxCapacity) {
            currentLoad += weight;
            return {
                ...task,
                suggestedAction: 'focus',
                reason: 'Within current cognitive capacity'
            };
        } 
        
        // OVER CAPACITY LOGIC

        // High priority or immediate deadlines MUST be focused, even if we are over capacity.
        // The load balancer can't cancel a due high-priority task, it just warns.
        if (task.priority === 'high' && isOverdueOrToday) {
            currentLoad += weight;
            return {
                ...task,
                suggestedAction: 'focus',
                reason: 'Critical task overrides low cognitive capacity'
            };
        }

        // If we are over capacity, evaluate if it can be deferred or dropped
        if (task.priority === 'low') {
            return {
                ...task,
                suggestedAction: 'drop',
                reason: 'Cognitive load exceeded. Low priority task should be canceled/delegated'
            };
        }

        // Medium or deferred-High priority tasks get pushed to 'defer'
        return {
            ...task,
            suggestedAction: 'defer',
            reason: 'Cognitive load exceeded. Defer to future date'
        };
    });

    return balancedSet;
};
