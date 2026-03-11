import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    status: 'todo' | 'in-progress' | 'completed';
}

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id' | 'status'>) => void;
    deleteTask: (id: string) => void;
}

const initialTasks: Task[] = [
    { id: '1', title: 'Prepare Q3 performance review deck', priority: 'high', deadline: 'Today, 2:00 PM', status: 'in-progress' },
    { id: '2', title: 'Review new API integration doc', priority: 'medium', deadline: 'Tomorrow, 10:00 AM', status: 'todo' },
    { id: '3', title: 'Schedule sync with Design team', priority: 'low', deadline: 'Friday, 3:30 PM', status: 'todo' },
    { id: '4', title: 'Submit expenses for August', priority: 'medium', deadline: 'Aug 31', status: 'completed' },
    { id: '5', title: 'Finalize server architecture', priority: 'high', deadline: 'Today, 5:00 PM', status: 'todo' },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const addTask = (taskData: Omit<Task, 'id' | 'status'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            status: 'todo'
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const deleteTask = (id: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask }}>
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
