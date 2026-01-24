'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

import { ArrowLeftIcon, PackageIcon, ChevronRightIcon, ClockIcon, CheckCircle2Icon, AlertCircleIcon, MapPinIcon, QrCodeIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserOrders, Order, getUserProfile } from '@/lib/api';
import { io } from 'socket.io-client';

import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshOrders = useCallback(() => {
        setLoading(true);
        getUserOrders().then(setOrders).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refreshOrders();

        getUserProfile().then(user => {
            if (user && user.id) {
                const socket = io(API_URL);
                const room = `user_${user.id}`;
                socket.emit('join', room);

                socket.on('order_status_update', (data) => {
                    console.log('Real-time order update:', data);
                    refreshOrders();
                });

                return () => {
                    socket.disconnect();
                };
            }
        });
    }, [refreshOrders]);

    const getStatusStyle = (order: Order) => {
        const dStatus = order.deliveryStatus;
        if (dStatus === 'collected') {
            return {
                bg: 'bg-primary/20',
                text: 'text-primary',
                icon: <CheckCircle2Icon size={12} color="hsl(var(--primary))" />,
                label: 'Collected'
            };
        }
        if (dStatus === 'dropped_off') {
            return {
                bg: 'bg-blue-500/20',
                text: 'text-blue-500',
                icon: <PackageIcon size={12} color="rgb(59 130 246)" />,
                label: 'Ready for Pickup'
            };
        }
        return {
            bg: 'bg-yellow-500/20',
            text: 'text-yellow-500',
            icon: <ClockIcon size={12} color="rgb(234 179 8)" />,
            label: 'In Transit'
        };
    };

    // Simulation Handlers
    const simulateDropOff = async (id: number) => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}/drop-off`, {
                method: 'PATCH',
                headers: { Authorization: localStorage.getItem('token') || '' }
            });
            if (res.ok) refreshOrders();
        } catch (e) { console.error(e); }
    };

    const simulatePickup = async (id: number, code: string) => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}/verify-pickup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ code })
            });
            if (res.ok) refreshOrders();
            else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (e) { console.error(e); }
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
                            const status = getStatusStyle(order);
                            return (
                                <Box key={order.id} className="bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-border/40 group transition-all hover:bg-card/60 relative">
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

                                    {/* Pickup Info Section */}
                                    {order.fulfillmentPoint && (
                                        <VStack space="sm" className="mb-6 bg-secondary/20 p-4 rounded-2xl border border-border/30">
                                            <HStack space="sm" className="items-center">
                                                <MapPinIcon size={14} color="hsl(var(--primary))" />
                                                <Text className="text-[10px] text-foreground font-black uppercase tracking-widest">Collection Point</Text>
                                            </HStack>
                                            <VStack>
                                                <Text className="text-xs font-bold text-foreground">{order.fulfillmentPoint.name}</Text>
                                                <Text className="text-[10px] text-muted-foreground">{order.fulfillmentPoint.address}, {order.fulfillmentPoint.city}</Text>
                                            </VStack>
                                        </VStack>
                                    )}

                                    {/* Pickup Code Display */}
                                    {order.deliveryStatus === 'dropped_off' && order.pickupCode && (
                                        <Box className="mb-6 bg-primary p-6 rounded-2xl items-center shadow-lg shadow-primary/20">
                                            <Text className="text-black/60 text-[8px] font-black uppercase tracking-[0.3em] mb-2 text-center">Authentication Cipher</Text>
                                            <HStack space="md" className="items-center justify-center">
                                                <QrCodeIcon size={24} color="black" />
                                                <Heading size="xl" className="text-black font-black tracking-[0.5em] text-center">{order.pickupCode}</Heading>
                                            </HStack>
                                            <Text className="text-black/60 text-[8px] font-black uppercase tracking-widest mt-2 text-center">Present at Terminal for Collection</Text>
                                        </Box>
                                    )}

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
                                            <Text className="text-primary font-black text-xl tracking-tighter">₦{(order.totalAmount || 0).toLocaleString()}</Text>
                                        </VStack>
                                    </HStack>

                                    {/* Simulation Controls (Horizontal Deck) */}
                                    <HStack space="md" className="mt-6 pt-4 border-t border-border/10">
                                        {order.deliveryStatus === 'pending' && (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                className="rounded-xl border-dashed border-blue-500/50 hover:bg-blue-500/10 flex-1"
                                                onPress={() => simulateDropOff(order.id)}
                                            >
                                                <ButtonText className="text-blue-500 text-[8px] font-black uppercase tracking-widest">Simulate Drop-off (Vendor)</ButtonText>
                                            </Button>
                                        )}
                                        {order.deliveryStatus === 'dropped_off' && (
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                className="rounded-xl border-dashed border-primary/50 hover:bg-primary/10 flex-1"
                                                onPress={() => simulatePickup(order.id, order.pickupCode!)}
                                            >
                                                <ButtonText className="text-primary text-[8px] font-black uppercase tracking-widest">Verify Pick-up (Staff)</ButtonText>
                                            </Button>
                                        )}
                                    </HStack>
                                </Box>
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
