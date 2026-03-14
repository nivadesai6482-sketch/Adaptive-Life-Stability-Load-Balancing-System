import React from 'react';
import { Loader2 } from 'lucide-react';

export const ChartSkeleton = () => {
    return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 rounded-xl">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <span className="text-sm font-medium animate-pulse">Initializing Interface...</span>
        </div>
    );
};
