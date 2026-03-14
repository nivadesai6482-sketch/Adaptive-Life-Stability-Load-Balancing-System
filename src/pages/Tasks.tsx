import React, { useEffect } from 'react';
import { TaskForm } from '../components/common/TaskForm';
import { TaskList } from '../components/common/TaskList';
import { useTaskStore } from '../store/taskStore';

export const Tasks = () => {
    const { fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Task Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Current active commitments prioritized by system load.
                    </p>
                </div>
            </div>

            <TaskForm />
            <TaskList />
        </div>
    );
};
