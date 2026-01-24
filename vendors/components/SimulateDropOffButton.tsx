'use client';

import { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { simulateDropOff } from '@/api/orders';
import { Package, CheckCircle2 } from 'lucide-react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

export function SimulateDropOffButton({ orderId, deliveryStatus }: { orderId: number, deliveryStatus: string }) {
    const [isPending, setIsPending] = useState(false);

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

    return (
        <Button
            size="lg"
            className="rounded-2xl bg-primary hover:scale-[1.02] shadow-xl border-0 h-14 transition-all active:scale-[0.98] group relative overflow-hidden"
            onPress={handleDropOff}
            disabled={isPending}
        >
            <HStack space="md" className="items-center relative z-10 px-4">
                <Package size={18} color="black" />
                <ButtonText className="font-black text-black text-xs uppercase tracking-widest">
                    {isPending ? 'Processing Handover...' : 'Simulate Drop-off'}
                </ButtonText>
            </HStack>
        </Button>
    );
}
