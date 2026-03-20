import { Task } from '../store/taskStore';

/**
 * Optimizes a task list based on current user load and energy metrics.
 * 
 * @param tasks Current list of tasks
 * @param cognitiveLoad Current calculated cognitive load (0-100+)
 * @param energyScore Current energy score (0-100)
 * @returns Optimized task list with deferred items or injected recovery
 */
export const optimizeTaskList = (
    tasks: Task[],
    cognitiveLoad: number,
    energyScore: number
): Task[] => {
    let optimized = [...tasks];

    // 1. RECOVERY INJECTION (Priority 1)
    // If energy is critically low, we must insert a recovery block at the beginning.
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
