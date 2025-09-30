import { useCallback, useState } from 'react';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
}

interface UseNotificationsReturn {
    addSuccessNotification: (message: string) => void;
    addErrorNotification: (message: string) => void;
    addWarningNotification: (message: string) => void;
    addInfoNotification: (message: string) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    notifications: Notification[];
}

export function useNotifications(): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
        const notification: Notification = {
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            message,
            timestamp: Date.now(),
        };

        setNotifications(prev => {
            const newNotifications = [...prev, notification];
            return newNotifications.length > 5 ? newNotifications.slice(-5) : newNotifications;
        });

        setTimeout(() => {
            removeNotification(notification.id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const addSuccessNotification = useCallback((message: string) => {
        addNotification('success', message);
    }, [addNotification]);

    const addErrorNotification = useCallback((message: string) => {
        addNotification('error', message);
    }, [addNotification]);

    const addWarningNotification = useCallback((message: string) => {
        addNotification('warning', message);
    }, [addNotification]);

    const addInfoNotification = useCallback((message: string) => {
        addNotification('info', message);
    }, [addNotification]);

    return {
        addSuccessNotification,
        addErrorNotification,
        addWarningNotification,
        addInfoNotification,
        removeNotification,
        clearNotifications,
        notifications,
    };
}