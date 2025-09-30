'use client';

import React from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationSnackbar() {
    const { notifications, removeNotification } = useNotifications();

    const handleClose = (id: string) => (): void => {
        removeNotification(id);
    };

    if (notifications.length === 0) {
        return <></>;
    }

    const latestNotification = notifications[notifications.length - 1];
    if (!latestNotification) {
        return <></>;
    }

    return (
        <Snackbar
            open={notifications.length > 0}
            autoHideDuration={5000}
            onClose={handleClose(latestNotification.id)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                severity={latestNotification.type}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleClose(latestNotification.id)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                sx={{ width: '100%' }}
            >
                <AlertTitle>
                    {latestNotification.type === 'success' && 'Success'}
                    {latestNotification.type === 'error' && 'Error'}
                    {latestNotification.type === 'warning' && 'Warning'}
                    {latestNotification.type === 'info' && 'Information'}
                </AlertTitle>
                {latestNotification.message}
            </Alert>
        </Snackbar>
    );
}

type TNotificationList = {
    maxVisible?: number;
}

export function NotificationList({ maxVisible = 3 }: TNotificationList) {
    const { notifications, removeNotification } = useNotifications();

    const visibleNotifications = notifications.slice(-maxVisible);

    if (visibleNotifications.length === 0) {
        return <></>;
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                maxWidth: 400,
            }}
        >
            {visibleNotifications.map((notification) => (
                <Alert
                    key={notification.id}
                    severity={notification.type}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => removeNotification(notification.id)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                    sx={{ width: '100%' }}
                >
                    <AlertTitle>
                        {notification.type === 'success' && 'Success'}
                        {notification.type === 'error' && 'Error'}
                        {notification.type === 'warning' && 'Warning'}
                        {notification.type === 'info' && 'Information'}
                    </AlertTitle>
                    {notification.message}
                </Alert>
            ))}
        </Box>
    );
}
