'use client';

import { useEffect } from 'react';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';
import { useRouter } from 'next/navigation';

export function UserRealTimeSync() {
    const router = useRouter();

    useRealTimeNotifications((data) => {
        console.log('[UserRealTimeSync] Order update received, refreshing...', data);

        // Refresh data on current page (Server Components/Client Components using fetch will need manual re-fetch usually,
        // but router.refresh() triggers RSC re-fetch)
        router.refresh();

        // Dispatch a local event that specific client components can listen to if they need state updates
        const event = new CustomEvent('order_status_changed', { detail: data });
        window.dispatchEvent(event);
    });

    return null;
}
