import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useToast, Toast } from '../../store/toastStore';

export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast: Toast) => {
                const isError = toast.type === 'error';
                const isSuccess = toast.type === 'success';

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex w-full items-start overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 animate-slide-up transition-all ${
                            isError ? 'border-l-4 border-red-500' : isSuccess ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
                        }`}
                    >
                        <div className="p-4 flex-1 flex items-start">
                            <div className="flex-shrink-0">
                                {isError ? (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                ) : isSuccess ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Info className="h-5 w-5 text-blue-500" />
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5 text-sm">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {isError ? 'System Error' : isSuccess ? 'Success' : 'Notification'}
                                </p>
                                <p className="mt-1 text-gray-500 dark:text-gray-400">{toast.message}</p>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    className="inline-flex rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => removeToast(toast.id)}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
