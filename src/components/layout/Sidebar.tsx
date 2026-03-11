import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, CheckSquare } from 'lucide-react';

export const Sidebar = () => {
    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-all duration-300 z-20 flex flex-col">
            <div className="flex h-16 items-center justify-center border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider text-blue-400 flex items-center gap-2">
                    <BarChart2 className="h-6 w-6" />
                    ANALYTICS
                </h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1 px-3">
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                            }
                        >
                            <Home className="h-5 w-5" />
                            <span className="font-medium">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/tasks"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                            }
                        >
                            <CheckSquare className="h-5 w-5" />
                            <span className="font-medium">Tasks</span>
                        </NavLink>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                            <Users className="h-5 w-5" />
                            <span className="font-medium">Audience</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                            <Settings className="h-5 w-5" />
                            <span className="font-medium">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-sm">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};
