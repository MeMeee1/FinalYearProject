'use client';

import { useEffect } from 'react';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { useRouter } from 'next/navigation';

export function VendorRealTimeSync() {
    useRealTimeSync();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleNewOrder = (event: any) => {
            const data = event.detail;
            console.log('[VendorRealTimeSync] New order received, refreshing dashboard...', data);

            // Refresh data on current page (Server Components will re-run)
            router.refresh();

            // We can also use a simple native notification if possible, 
            // but router.refresh() is the most important for "reflecting" the change.
        };

        const handleStockUpdate = (event: any) => {
            console.log('[VendorRealTimeSync] Stock update received, refreshing dashboard...', event.detail);
            router.refresh();
        };

        window.addEventListener('new_order_received', handleNewOrder);
        window.addEventListener('stock_updated_received', handleStockUpdate);

        return () => {
            window.removeEventListener('new_order_received', handleNewOrder);
            window.removeEventListener('stock_updated_received', handleStockUpdate);
        };
    }, [router]);

    return null;
}
