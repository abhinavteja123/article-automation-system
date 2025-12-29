import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'default') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className={cn(
                                "pointer-events-auto flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-lg border backdrop-blur-md",
                                toast.type === 'success' && "bg-green-50/90 border-green-200 text-green-900 dark:bg-green-900/50 dark:border-green-800 dark:text-green-100",
                                toast.type === 'error' && "bg-red-50/90 border-red-200 text-red-900 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100",
                                toast.type === 'default' && "bg-white/90 border-border text-foreground dark:bg-slate-900/90"
                            )}
                        >
                            {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
                            {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                            {toast.type === 'default' && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}

                            <p className="flex-1 text-sm font-medium">{toast.message}</p>

                            <button onClick={() => removeToast(toast.id)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');

    return {
        success: (msg) => context.toast(msg, 'success'),
        error: (msg) => context.toast(msg, 'error'),
        info: (msg) => context.toast(msg, 'default')
    };
}
