'use client';

import { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { simulateDropOff, simulateBadDropOff } from '@/api/orders';
import { Package, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

export function SimulateDropOffButton({ orderId, deliveryStatus }: { orderId: number, deliveryStatus: string }) {
    const [isPending, setIsPending] = useState(false);
    const [isBadPending, setIsBadPending] = useState(false);

    // Already handled statuses
    if (deliveryStatus === 'dropped_off' || deliveryStatus === 'collected') {
        return (
            <Box className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                <HStack space="sm" className="items-center">
                    <CheckCircle2 size={16} color="#22c55e" />
                    <VStack>
                        <Text className="text-green-500 font-black uppercase tracking-widest text-[10px]">Handover Complete</Text>
                        <Text className="text-green-500/70 text-[10px] font-medium">Successfully dropped off at fulfillment center.</Text>
                    </VStack>
                </HStack>
            </Box>
        );
    }

    // Rejected status
    if (deliveryStatus === 'rejected') {
        return (
            <Box className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                <HStack space="sm" className="items-center">
                    <XCircle size={16} color="#ef4444" />
                    <VStack>
                        <Text className="text-red-500 font-black uppercase tracking-widest text-[10px]">Order Rejected</Text>
                        <Text className="text-red-500/70 text-[10px] font-medium">Animal failed inspection. Refund initiated.</Text>
                    </VStack>
                </HStack>
            </Box>
        );
    }

    const handleDropOff = async () => {
        setIsPending(true);
        try {
            await simulateDropOff(orderId);
            alert('Order successfully marked as dropped off!');
        } catch (error: any) {
            alert(error.message || 'Failed to simulate drop-off');
        } finally {
            setIsPending(false);
        }
    };

    const handleBadDropOff = async () => {
        const confirmed = confirm(
            '⚠️ SIMULATE BAD DROP-OFF\n\n' +
            'This will simulate an animal being rejected at the fulfillment point.\n\n' +
            '• Customer will receive 70% refund\n' +
            '• Fulfillment point gets 30% compensation\n' +
            '• Order will be marked as Cancelled\n\n' +
            'Continue?'
        );

        if (!confirmed) return;

        setIsBadPending(true);
        try {
            const result = await simulateBadDropOff(orderId, 'Animal failed health inspection at fulfillment point');
            alert(
                `Order rejected!\n\n` +
                `Customer Refund: ₦${result.refundDetails.customerRefund.toLocaleString()}\n` +
                `Fulfillment Compensation: ₦${result.refundDetails.fulfillmentCompensation.toLocaleString()}`
            );
        } catch (error: any) {
            alert(error.message || 'Failed to simulate bad drop-off');
        } finally {
            setIsBadPending(false);
        }
    };

    return (
        <VStack space="sm">
            {/* Good Drop-off Button */}
            <Button
                size="lg"
                className="rounded-2xl bg-primary hover:scale-[1.02] shadow-xl border-0 h-14 transition-all active:scale-[0.98] group relative overflow-hidden w-full"
                onPress={handleDropOff}
                disabled={isPending || isBadPending}
            >
                <HStack space="md" className="items-center relative z-10 px-4">
                    <Package size={18} color="black" />
                    <ButtonText className="font-black text-black text-xs uppercase tracking-widest">
                        {isPending ? 'Processing...' : 'Simulate Good Drop-off'}
                    </ButtonText>
                </HStack>
            </Button>

            {/* Bad Drop-off Button */}
            <Button
                size="lg"
                className="rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 h-12 transition-all active:scale-[0.98] w-full"
                onPress={handleBadDropOff}
                disabled={isPending || isBadPending}
            >
                <HStack space="md" className="items-center px-4">
                    <AlertTriangle size={16} color="#ef4444" />
                    <ButtonText className="font-black text-red-500 text-[10px] uppercase tracking-widest">
                        {isBadPending ? 'Processing...' : 'Simulate Bad Drop-off'}
                    </ButtonText>
                </HStack>
            </Button>

            <Text className="text-muted-foreground text-[9px] text-center font-medium px-2">
                Bad drop-off simulates animal rejection (70% refund to customer)
            </Text>
        </VStack>
    );
}
