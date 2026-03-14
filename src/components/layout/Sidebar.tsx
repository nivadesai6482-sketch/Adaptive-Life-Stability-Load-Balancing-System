import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, CheckSquare, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-all duration-300 z-20 flex flex-col">
            <div className="flex h-16 items-center justify-center border-b border-gray-800">
                <h1 className="text-xl font-bold tracking-wider text-blue-400 flex items-center gap-2">
                    <BarChart2 className="h-6 w-6" />
                    ALS-LBS
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
                        <NavLink
                            to="/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
                            }
                        >
                            <Settings className="h-5 w-5" />
                            <span className="font-medium">Settings</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="border-t border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-sm">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400">Authenticated</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
