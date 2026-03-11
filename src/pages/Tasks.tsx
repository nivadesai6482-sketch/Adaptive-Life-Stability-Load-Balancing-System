import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    deadline: string;
    status: 'todo' | 'in-progress' | 'completed';
}

const mockTasks: Task[] = [
    { id: '1', title: 'Prepare Q3 performance review deck', priority: 'high', deadline: 'Today, 2:00 PM', status: 'in-progress' },
    { id: '2', title: 'Review new API integration doc', priority: 'medium', deadline: 'Tomorrow, 10:00 AM', status: 'todo' },
    { id: '3', title: 'Schedule sync with Design team', priority: 'low', deadline: 'Friday, 3:30 PM', status: 'todo' },
    { id: '4', title: 'Submit expenses for August', priority: 'medium', deadline: 'Aug 31', status: 'completed' },
    { id: '5', title: 'Finalize server architecture', priority: 'high', deadline: 'Today, 5:00 PM', status: 'todo' },
];

const priorityConfig = {
    high: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    medium: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    low: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' }
};

const statusConfig = {
    'todo': { icon: Circle, color: 'text-gray-400', label: 'To Do' },
    'in-progress': { icon: Clock, color: 'text-blue-500', label: 'In Progress' },
    'completed': { icon: CheckCircle2, color: 'text-green-500', label: 'Completed' }
};

export const Tasks = () => {
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
                <div className="flex">
                    <button type="button" className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
                        Add New Task
                    </button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Task Title
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Priority
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockTasks.map((task) => {
                                const PriorityIcon = priorityConfig[task.priority].icon;
                                const StatusIcon = statusConfig[task.status].icon;

                                return (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded ${priorityConfig[task.priority].bg}`}>
                                                    <PriorityIcon className={`h-4 w-4 ${priorityConfig[task.priority].color}`} />
                                                </div>
                                                <span className="text-sm text-gray-700 capitalize">{task.priority}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{task.deadline}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <StatusIcon className={`h-4 w-4 ${statusConfig[task.status].color}`} />
                                                <span className="text-sm text-gray-700">{statusConfig[task.status].label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
