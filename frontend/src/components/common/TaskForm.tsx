import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore, Task } from '../../store/taskStore';

export const TaskForm = () => {
    const { addTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addTask({
            title,
            priority,
            deadline
        });

        // Reset form after submit
        setTitle('');
        setPriority('medium');
        setDeadline('');
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-8">
            <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
                <p className="text-sm text-gray-500">Allocate bandwidth for a new commitment.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                    <div className="md:col-span-6">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Task Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                                placeholder="e.g. Weekly architecture review"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">
                            Priority
                        </label>
                        <div className="mt-2">
                            <select
                                id="priority"
                                name="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pl-3"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <label htmlFor="deadline" className="block text-sm font-medium leading-6 text-gray-900">
                            Deadline
                        </label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="deadline"
                                id="deadline"
                                required
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Task
                    </button>
                </div>
            </form>
        </div>
    );
};
