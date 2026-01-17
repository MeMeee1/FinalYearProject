'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateVendorCommission } from '@/api/vendors';

export default function CommissionForm({ vendorId, currentRate }: { vendorId: number | string, currentRate: number }) {
    const [rate, setRate] = useState(currentRate);
    const [isPending, startTransition] = useTransition();

    const handleUpdate = () => {
        startTransition(async () => {
            try {
                await updateVendorCommission(vendorId, rate);
                alert('Commission rate updated successfully');
            } catch (error) {
                console.error(error);
                alert('Failed to update commission rate');
            }
        });
    };

    return (
        <div className="flex items-end gap-4 mt-2">
            <div className="flex-1">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <Button
                onPress={handleUpdate}
                isDisabled={isPending || rate === currentRate}
                className="bg-blue-600 text-white"
            >
                {isPending ? 'Updating...' : 'Update'}
            </Button>
        </div>
    );
}
