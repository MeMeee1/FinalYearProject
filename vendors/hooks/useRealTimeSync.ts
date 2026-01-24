import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useVendorStore } from '@/store/vendorStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useRealTimeSync() {
    const { profile } = useVendorStore();

    useEffect(() => {
        if (!profile?.id) return;

        const socket = io(API_URL);

        // Join vendor room
        console.log(`[Socket] Joining room vendor_${profile.id}`);
        socket.emit('join', `vendor_${profile.id}`);

        // Listen for new orders
        socket.on('new_order', (data) => {
            console.log('[Socket] New order received:', data);
            // You could trigger a toast or revalidate data here
            if (typeof window !== 'undefined') {
                // We'll use a custom event that components can listen to
                const event = new CustomEvent('new_order_received', { detail: data });
                window.dispatchEvent(event);
            }
        });

        // Listen for stock updates (if vendor wants to see their own stock changing)
        socket.on('stock_updated', (data) => {
            console.log('[Socket] Stock update received:', data);
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('stock_updated_received', { detail: data });
                window.dispatchEvent(event);
            }
        });

        return () => {
            console.log('[Socket] Disconnecting');
            socket.disconnect();
        };
    }, [profile?.id]);
}
