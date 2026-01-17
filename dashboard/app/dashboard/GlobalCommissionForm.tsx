'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updatePlatformCommission } from '@/api/vendors';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function GlobalCommissionForm() {
    const [rate, setRate] = useState(10);
    const [isPending, startTransition] = useTransition();

    const handleUpdate = () => {
        if (!confirm('Are you sure you want to update the commission rate for ALL vendors? This action cannot be undone.')) {
            return;
        }

        startTransition(async () => {
            try {
                await updatePlatformCommission(rate);
                alert('Platform commission updated for all vendors successfully');
            } catch (error) {
                console.error(error);
                alert('Failed to update platform commission');
            }
        });
    };

    return (
        <Card className="p-4 mt-6">
            <Heading size="md" className="mb-2">Global Platform Settings</Heading>
            <Text className="text-sm text-slate-500 mb-4">
                Update the commission rate for ALL vendors. This will overwrite any custom rates set on individual vendors.
            </Text>

            <div className="flex items-end gap-4 max-w-md">
                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Commission Rate (%)</label>
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
                    isDisabled={isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    {isPending ? 'Updating...' : 'Update All Vendors'}
                </Button>
            </div>
        </Card>
    );
}
