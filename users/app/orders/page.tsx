'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowLeftIcon, PackageIcon, ChevronRightIcon, ClockIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserOrders, Order } from '@/lib/api';

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserOrders().then(setOrders).finally(() => setLoading(false));
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
            case 'completed':
                return {
                    bg: 'bg-primary/20',
                    text: 'text-primary',
                    icon: <CheckCircle2Icon size={12} color="hsl(var(--primary))" />,
                    label: 'Finalized'
                };
            case 'pending':
            case 'processing':
                return {
                    bg: 'bg-yellow-500/20',
                    text: 'text-yellow-500',
                    icon: <ClockIcon size={12} color="rgb(234 179 8)" />,
                    label: 'In Transit'
                };
            default:
                return {
                    bg: 'bg-blue-500/20',
                    text: 'text-blue-500',
                    icon: <AlertCircleIcon size={12} color="rgb(59 130 246)" />,
                    label: status
                };
        }
    };

    return (
        <Box className="flex-1 min-h-screen bg-background pb-24">
            {/* Premium Header */}
            <Box className="bg-background/80 backdrop-blur-3xl px-6 pt-12 pb-6 border-b border-border/40 sticky top-0 z-50">
                <HStack space="md" className="items-center">
                    <Button
                        variant="solid"
                        className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
                        onPress={() => router.back()}
                    >
                        <ArrowLeftIcon size={20} color="hsl(var(--foreground))" />
                    </Button>
                    <VStack>
                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Infrastructure Records</Text>
                        <Heading size="lg" className="text-foreground font-black tracking-tighter">Procurement Manifests</Heading>
                    </VStack>
                </HStack>
            </Box>

            <Box className="p-6 max-w-4xl mx-auto">
                {loading ? (
                    <VStack space="xl" className="items-center justify-center pt-20">
                        <Box className="w-12 h-12 bg-secondary/20 rounded-full items-center justify-center animate-pulse">
                            <ClockIcon size={24} color="hsl(var(--muted-foreground))" />
                        </Box>
                        <Text className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">Retrieving Records...</Text>
                    </VStack>
                ) : orders.length > 0 ? (
                    <VStack space="md">
                        {orders.map((order) => {
                            const status = getStatusStyle(order.status);
                            return (
                                <Link href={`/orders/${order.id}`} key={order.id} passHref legacyBehavior>
                                    <Box className="bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-border/40 group transition-all hover:bg-card/60 cursor-pointer active:scale-[0.98]">
                                        <HStack className="justify-between items-start mb-6">
                                            <VStack space="xs">
                                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Transaction ID</Text>
                                                <Heading size="md" className="text-foreground font-black tracking-tight">#{order.id.toString().padStart(6, '0')}</Heading>
                                            </VStack>
                                            <HStack space="xs" className={`${status.bg} px-3 py-1.5 rounded-full items-center border border-${status.text}/20`}>
                                                {status.icon}
                                                <Text className={`${status.text} text-[10px] font-black uppercase tracking-widest`}>{status.label}</Text>
                                            </HStack>
                                        </HStack>

                                        <HStack className="justify-between items-end border-t border-border/20 pt-4">
                                            <VStack space="xs">
                                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Logged On</Text>
                                                <HStack space="xs" className="items-center">
                                                    <ClockIcon size={12} color="hsl(var(--muted-foreground))" />
                                                    <Text className="text-foreground text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                                                </HStack>
                                            </VStack>
                                            <VStack className="items-end" space="xs">
                                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-right">Settled Value</Text>
                                                <Text className="text-primary font-black text-xl tracking-tighter">₦{order.total.toLocaleString()}</Text>
                                            </VStack>
                                        </HStack>

                                        {/* Hover Indicator */}
                                        <Box className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                            <ChevronRightIcon size={24} color="hsl(var(--primary))" />
                                        </Box>
                                    </Box>
                                </Link>
                            );
                        })}
                    </VStack>
                ) : (
                    <Box className="items-center justify-center pt-20">
                        <VStack space="xl" className="items-center">
                            <Box className="w-24 h-24 bg-secondary/20 rounded-[2.5rem] items-center justify-center border border-border/30">
                                <PackageIcon size={40} color="hsl(var(--muted-foreground))" strokeWidth={1} />
                            </Box>
                            <VStack className="items-center" space="xs">
                                <Heading className="text-foreground font-black tracking-tight">No Manifests Found</Heading>
                                <Text className="text-muted-foreground text-center font-medium">You haven't initialized any procurement requests yet.</Text>
                            </VStack>
                            <Link href="/" passHref legacyBehavior>
                                <Button size="lg" className="rounded-2xl bg-primary px-8">
                                    <ButtonText className="text-black font-black uppercase tracking-widest">Start Procurement</ButtonText>
                                </Button>
                            </Link>
                        </VStack>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
