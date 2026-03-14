import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, CheckSquare, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../common/ThemeToggle';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Backdrop Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-gray-900/80 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 text-white transition-transform duration-300 z-30 flex flex-col ${
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800 shrink-0">
                    <h1 className="text-xl font-bold tracking-wider text-blue-400 flex items-center gap-2">
                        <BarChart2 className="h-6 w-6" />
                        ALS-LBS
                    </h1>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-1 -mr-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-1 px-3">
                        <li>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setIsOpen(false)}
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
                                onClick={() => setIsOpen(false)}
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
                                onClick={() => setIsOpen(false)}
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
                <div className="border-t border-gray-800 p-4 space-y-4 shrink-0">
                    <div className="px-1">
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center font-semibold text-sm shrink-0">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-400">Authenticated</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors shrink-0"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};
