import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { getUserProfile } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useRealTimeNotifications(onOrderUpdate?: (data: any) => void) {
    useEffect(() => {
        let socket: any;

        const setupSocket = async () => {
            try {
                const profile = await getUserProfile();
                if (!profile?.id) return;

                socket = io(API_URL);

                console.log(`[Socket] Joining room user_${profile.id}`);
                socket.emit('join', `user_${profile.id}`);

                socket.on('order_status_update', (data: any) => {
                    console.log('[Socket] Order status update received:', data);
                    if (onOrderUpdate) {
                        onOrderUpdate(data);
                    }
                    // Optional: Dispatch a global custom event
                    const event = new CustomEvent('order_updated', { detail: data });
                    window.dispatchEvent(event);
                });

                socket.on('message', (data: any) => {
                    console.log('[Socket] Message received:', data);
                    // Standard notification handling
                    if (typeof window !== 'undefined') {
                        alert(`${data.title || 'Notification'}: ${data.body || data.message}`);
                    }
                });

            } catch (error) {
                console.error('Failed to setup socket notifications:', error);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                console.log('[Socket] Disconnecting');
                socket.disconnect();
            }
        };
    }, [onOrderUpdate]);
}
