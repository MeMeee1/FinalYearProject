import { useEffect } from 'react';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useStockSync(onUpdate: (data: { productId: number, newStock: number }) => void) {
    useEffect(() => {
        const socket = io(API_URL);

        socket.on('stock_updated', (data) => {
            console.log('Stock sync update received:', data);
            onUpdate(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [onUpdate]);
}
