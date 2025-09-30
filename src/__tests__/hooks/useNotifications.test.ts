import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

describe('useNotifications', () => {
    it('should initialize with empty notifications', () => {
        const { result } = renderHook(() => useNotifications());

        expect(result.current.notifications).toEqual([]);
    });

    it('should add success notification', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addSuccessNotification('Success message');
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0]).toMatchObject({
            type: 'success',
            message: 'Success message',
        });
    });

    it('should add error notification', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addErrorNotification('Error message');
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0]).toMatchObject({
            type: 'error',
            message: 'Error message',
        });
    });

    it('should add warning notification', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addWarningNotification('Warning message');
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0]).toMatchObject({
            type: 'warning',
            message: 'Warning message',
        });
    });

    it('should add info notification', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addInfoNotification('Info message');
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0]).toMatchObject({
            type: 'info',
            message: 'Info message',
        });
    });

    it('should remove notification', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addSuccessNotification('Test message');
        });

        const notificationId = result.current.notifications[0].id;

        act(() => {
            result.current.removeNotification(notificationId);
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should clear all notifications', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            result.current.addSuccessNotification('Message 1');
            result.current.addErrorNotification('Message 2');
        });

        expect(result.current.notifications).toHaveLength(2);

        act(() => {
            result.current.clearNotifications();
        });

        expect(result.current.notifications).toHaveLength(0);
    });

    it('should limit notifications to 5', () => {
        const { result } = renderHook(() => useNotifications());

        act(() => {
            for (let i = 0; i < 7; i++) {
                result.current.addSuccessNotification(`Message ${i}`);
            }
        });

        expect(result.current.notifications).toHaveLength(5);
    });
});
