import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from './toastStore';
import { API_ENDPOINTS } from '../config/apiConfig';

export interface Task {
    _id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    status: 'todo' | 'in-progress' | 'completed';
}

interface TaskContextType {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    addTask: (task: Omit<Task, '_id' | 'status'>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { addToast } = useToast();

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.TASKS.BASE, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data);
            } else {
                addToast(data.message || 'Failed to fetch active tasks.', 'error');
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
            addToast('Network error while pulling tasks from the server.', 'error');
        }
    };

    const addTask = async (taskData: Omit<Task, '_id' | 'status'>) => {
        try {
            const token = localStorage.getItem('token');
            const payload = { ...taskData, status: 'todo' };
            const res = await fetch(API_ENDPOINTS.TASKS.BASE, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(prevTasks => [data, ...prevTasks]);
                addToast('Task successfully orchestrated.', 'success');
            } else {
                addToast(data.message || 'Failed to submit new task.', 'error');
            }
        } catch (error) {
            console.error('Failed to add task', error);
            addToast('Network drop while dispatching task.', 'error');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_ENDPOINTS.TASKS.BY_ID(id), { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                } 
            });
            if (res.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
                addToast('Task effectively purged.', 'info');
            } else {
                const data = await res.json();
                addToast(data.message || 'Deletion command rejected by server.', 'error');
            }
        } catch (error) {
            console.error('Failed to delete task', error);
            addToast('Server unreachable during deletion signal.', 'error');
        }
    };

    // Note: We leave immediate fetching out of this effect so the components can decide
    // or we could fetch automatically on mount. We'll do it manually inside Layout or Dashboard.

    return (
        <TaskContext.Provider value={{ tasks, fetchTasks, addTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTaskStore = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskStore must be used within a TaskProvider');
    }
    return context;
};
