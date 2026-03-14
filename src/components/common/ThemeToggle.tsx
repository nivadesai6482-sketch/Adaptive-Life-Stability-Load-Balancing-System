import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../store/themeStore';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
        >
            {theme === 'dark' ? (
                <>
                    <Sun className="h-5 w-5" />
                    <span className="font-medium text-sm">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="h-5 w-5" />
                    <span className="font-medium text-sm">Dark Mode</span>
                </>
            )}
        </button>
    );
};
