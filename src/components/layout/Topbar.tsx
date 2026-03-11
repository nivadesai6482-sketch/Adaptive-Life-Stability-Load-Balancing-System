import React from 'react';
import { Bell, Search } from 'lucide-react';

export const Topbar = () => {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            <div className="flex flex-1 items-center">
                <div className="relative w-full max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Search analytics..."
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button type="button" className="relative rounded-full bg-white p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
            </div>
        </header>
    );
};
