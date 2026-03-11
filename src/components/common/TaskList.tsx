import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

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

export const TaskList = () => {
    const { tasks, deleteTask } = useTaskStore();

    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-sm font-medium text-gray-900">No active tasks</h3>
                <p className="mt-1 text-sm text-gray-500">Your schedule is currently clear.</p>
            </div>
        );
    }

    return (
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
                        {tasks.map((task) => {
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
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="inline-flex items-center justify-center rounded-md p-2 text-red-400 hover:bg-red-50 hover:text-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                                            title="Delete Task"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
