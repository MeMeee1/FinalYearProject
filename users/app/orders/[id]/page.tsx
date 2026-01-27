'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';

import { ArrowLeftIcon, MapPinIcon, CheckCircle2Icon, PackageIcon, ClockIcon, ShieldCheckIcon, CopyIcon, KeyIcon } from 'lucide-react-native';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getOrder, verifyPickup } from '@/lib/api';
import { Order } from '@/lib/types';
import { useRealTimeNotifications } from '@/hooks/useRealTimeNotifications';

export default function OrderDetails() {
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [pickupCode, setPickupCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const fetchOrderDetails = useCallback(async () => {
        try {
            const data = await getOrder(params.id as string);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchOrderDetails();
        }
    }, [params.id, fetchOrderDetails]);

    // Setup real-time notifications
    const handleOrderNotification = useCallback((data: any) => {
        if (data.orderId === Number(params.id)) {
            console.log('Refreshing order details due to socket update');
            fetchOrderDetails();
        }
    }, [params.id, fetchOrderDetails]);

    useRealTimeNotifications(handleOrderNotification);

    const handleVerifyPickup = async () => {
        if (!order || !pickupCode) return;
        setIsVerifying(true);
        try {
            await verifyPickup(order.id, pickupCode);
            // Local update of order is handled by fetchOrderDetails which is called by the hook
            await fetchOrderDetails();
            alert('Order successfully collected! Simulation complete.');
        } catch (error: any) {
            alert(error.message || 'Verification failed. Please check the code.');
        } finally {
            setIsVerifying(false);
        }
    };

    if (loading) {
        return (
            <Box className="flex-1 items-center justify-center bg-background">
                <Text className="text-muted-foreground font-black uppercase tracking-widest text-xs">Accessing Manifest...</Text>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box className="flex-1 items-center justify-center bg-background">
                <Heading className="text-foreground">Manifest Not Found</Heading>
                <Button onPress={() => router.back()} className="mt-4 bg-primary rounded-xl">
                    <ButtonText className="text-black font-bold">Return to Hub</ButtonText>
                </Button>
            </Box>
        );
    }

    const isCollected = order.deliveryStatus === 'collected';
    const isReadyForPickup = order.deliveryStatus === 'dropped_off';
    const isRefunded = (order as any).escrowStatus === 'refunded' || order.deliveryStatus === 'rejected';

    return (
        <Box className="flex-1 min-h-screen bg-background">
            {/* Immersive Header Section */}
            <Box className={`pt-16 pb-32 px-6 rounded-b-[4rem] shadow-2xl transition-colors duration-700 ${isRefunded ? 'bg-red-500' : isCollected ? 'bg-green-500' : isReadyForPickup ? 'bg-primary' : 'bg-secondary'}`}>
                <HStack className="items-center justify-between mb-8">
                    <Button
                        variant="solid"
                        className="rounded-2xl bg-black/10 border border-black/10 w-12 h-12 p-0 items-center justify-center hover:bg-black/20 transition-all active:scale-95"
                        onPress={() => router.back()}
                    >
                        <ArrowLeftIcon size={24} color="black" />
                    </Button>
                    <VStack className="items-end">
                        <Text className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em]">Transaction Log</Text>
                        <Text className="text-black font-black text-xs">{new Date(order.createdAt).toLocaleDateString()}</Text>
                    </VStack>
                </HStack>

                <VStack className="items-center" space="xs">
                    <Box className="bg-black/10 px-4 py-1.5 rounded-full border border-black/5 mb-2">
                        <Text className="text-black font-black text-[10px] uppercase tracking-[0.3em] font-mono">#{order.id.toString().padStart(6, '0')}</Text>
                    </Box>
                    <Heading size="3xl" className="text-black font-black tracking-tighter text-center leading-none">
                        {isRefunded ? 'Order Refunded' : isCollected ? 'Fulfillment Verified' : isReadyForPickup ? 'Awaiting Retrieval' : 'Manifest Authorized'}
                    </Heading>
                    <HStack space="xs" className="items-center bg-white/20 px-4 py-2 rounded-2xl mt-4">
                        <CheckCircle2Icon size={16} color="black" />
                        <Text className="text-black font-bold uppercase tracking-widest text-[10px]">{order.status}</Text>
                    </HStack>
                </VStack>
            </Box>

            <Box className="px-6 -mt-16 max-w-4xl mx-auto pb-40">
                <VStack space="xl">
                    {/* Pickup Verification Section (New Simulation Feature) */}
                    {isReadyForPickup && (
                        <Box className="bg-card p-8 rounded-[3rem] border-2 border-primary shadow-2xl overflow-hidden relative">
                            <Box className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                            <VStack space="lg">
                                <HStack space="md" className="items-center">
                                    <Box className="bg-primary/20 p-3 rounded-xl">
                                        <KeyIcon size={20} color="hsl(var(--primary))" />
                                    </Box>
                                    <VStack>
                                        <Text className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Simulation Node</Text>
                                        <Heading size="md" className="text-foreground font-black tracking-tight">Complete Retrieval</Heading>
                                    </VStack>
                                </HStack>

                                <VStack space="md">
                                    <Text className="text-muted-foreground text-xs font-medium leading-relaxed">
                                        Your order has been dropped off! Enter your pickup code below to simulate the final collection.
                                    </Text>

                                    <HStack space="md" className="bg-secondary/20 p-4 rounded-2xl border border-border/30 justify-between items-center">
                                        <VStack>
                                            <Text className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-1">Generated Secret</Text>
                                            <Text className="text-foreground font-black text-xl tracking-[0.2em] font-mono">{order.pickupCode}</Text>
                                        </VStack>
                                        <Button variant="link" className="bg-primary/20 p-2 rounded-xl" onPress={() => setPickupCode(order.pickupCode || '')}>
                                            <CopyIcon size={14} color="hsl(var(--primary))" />
                                        </Button>
                                    </HStack>

                                    <input
                                        placeholder="Enter Code to Simulate Pickup"
                                        value={pickupCode}
                                        onChange={(e) => setPickupCode(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-primary/30 h-16 text-foreground font-black tracking-[0.3em] uppercase text-center focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
                                    />

                                    <Button
                                        isDisabled={!pickupCode || isVerifying}
                                        onPress={handleVerifyPickup}
                                        className="h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                    >
                                        <ButtonText className="text-black font-black uppercase tracking-widest text-xs">Verify & Collect</ButtonText>
                                    </Button>
                                </VStack>
                            </VStack>
                        </Box>
                    )}

                    {isCollected && (
                        <Box className="bg-green-500/10 p-8 rounded-[3rem] border border-green-500/20 shadow-xl overflow-hidden relative">
                            <HStack space="md" className="items-center">
                                <Box className="bg-green-500/20 p-3 rounded-xl">
                                    <CheckCircle2Icon size={20} color="#22c55e" />
                                </Box>
                                <VStack>
                                    <Text className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Manifest Finalized</Text>
                                    <Text className="text-foreground font-black tracking-tight">Items Successfully Retrieved</Text>
                                </VStack>
                            </HStack>
                        </Box>
                    )}

                    {/* Refund Notification Card */}
                    {isRefunded && (
                        <Box className="bg-red-500/10 p-8 rounded-[3rem] border border-red-500/20 shadow-xl overflow-hidden relative">
                            <Box className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />
                            <VStack space="lg">
                                <HStack space="md" className="items-center">
                                    <Box className="bg-red-500/20 p-3 rounded-xl">
                                        <CheckCircle2Icon size={20} color="#ef4444" />
                                    </Box>
                                    <VStack>
                                        <Text className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Order Cancelled</Text>
                                        <Text className="text-foreground font-black tracking-tight">Refund Processed</Text>
                                    </VStack>
                                </HStack>

                                <Text className="text-muted-foreground text-xs font-medium leading-relaxed">
                                    This order was rejected at the fulfillment point due to quality or quantity issues.
                                    A partial refund has been processed to your account.
                                </Text>

                                <VStack space="sm" className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                                    <HStack className="justify-between">
                                        <Text className="text-muted-foreground text-xs">Original Amount</Text>
                                        <Text className="text-foreground text-xs font-bold line-through">₦{order.totalAmount.toLocaleString()}</Text>
                                    </HStack>
                                    <HStack className="justify-between">
                                        <Text className="text-muted-foreground text-xs">Refund Rate</Text>
                                        <Text className="text-red-500 text-xs font-bold">70%</Text>
                                    </HStack>
                                    <Box className="h-px bg-red-500/20 my-2" />
                                    <HStack className="justify-between items-end">
                                        <Text className="text-red-500 font-black text-xs uppercase tracking-widest">Your Refund</Text>
                                        <Text className="text-red-500 font-black text-2xl">₦{Math.round(order.totalAmount * 0.70).toLocaleString()}</Text>
                                    </HStack>
                                </VStack>

                                {(order as any).notes && (
                                    <Box className="bg-secondary/10 p-4 rounded-2xl border border-border/30">
                                        <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Rejection Reason</Text>
                                        <Text className="text-foreground text-sm font-medium">{(order as any).notes}</Text>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    )}
                    {/* Escrow Status Card */}
                    {(order as any).escrowStatus && (
                        <Box className={`p-6 rounded-[2.5rem] border shadow-xl overflow-hidden ${(order as any).escrowStatus === 'held' ? 'bg-blue-500/10 border-blue-500/20' :
                            (order as any).escrowStatus === 'released' ? 'bg-green-500/10 border-green-500/20' :
                                (order as any).escrowStatus === 'refunded' ? 'bg-orange-500/10 border-orange-500/20' :
                                    'bg-secondary/10 border-border/30'
                            }`}>
                            <HStack space="md" className="items-center justify-between">
                                <HStack space="md" className="items-center">
                                    <Box className={`p-3 rounded-xl ${(order as any).escrowStatus === 'held' ? 'bg-blue-500/20' :
                                        (order as any).escrowStatus === 'released' ? 'bg-green-500/20' :
                                            (order as any).escrowStatus === 'refunded' ? 'bg-orange-500/20' :
                                                'bg-secondary/20'
                                        }`}>
                                        <ShieldCheckIcon size={18} color={
                                            (order as any).escrowStatus === 'held' ? 'rgb(59 130 246)' :
                                                (order as any).escrowStatus === 'released' ? '#22c55e' :
                                                    (order as any).escrowStatus === 'refunded' ? '#f97316' :
                                                        'hsl(var(--muted-foreground))'
                                        } />
                                    </Box>
                                    <VStack>
                                        <Text className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Escrow Status</Text>
                                        <Text className={`font-black tracking-tight ${(order as any).escrowStatus === 'held' ? 'text-blue-500' :
                                            (order as any).escrowStatus === 'released' ? 'text-green-500' :
                                                (order as any).escrowStatus === 'refunded' ? 'text-orange-500' :
                                                    'text-muted-foreground'
                                            }`}>
                                            {(order as any).escrowStatus === 'held' ? 'Funds Held in Escrow' :
                                                (order as any).escrowStatus === 'released' ? 'Funds Released to Vendor' :
                                                    (order as any).escrowStatus === 'refunded' ? 'Funds Refunded' :
                                                        'Pending Payment'}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <Box className={`px-3 py-1.5 rounded-full ${(order as any).escrowStatus === 'held' ? 'bg-blue-500/20' :
                                    (order as any).escrowStatus === 'released' ? 'bg-green-500/20' :
                                        (order as any).escrowStatus === 'refunded' ? 'bg-orange-500/20' :
                                            'bg-secondary/20'
                                    }`}>
                                    <Text className={`text-[8px] font-black uppercase tracking-widest ${(order as any).escrowStatus === 'held' ? 'text-blue-500' :
                                        (order as any).escrowStatus === 'released' ? 'text-green-500' :
                                            (order as any).escrowStatus === 'refunded' ? 'text-orange-500' :
                                                'text-muted-foreground'
                                        }`}>
                                        {(order as any).escrowStatus?.toUpperCase()}
                                    </Text>
                                </Box>
                            </HStack>
                        </Box>
                    )}

                    {/* Pickup Node Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-2xl">
                        <HStack space="md" className="items-start">
                            <Box className="w-14 h-14 bg-primary/20 rounded-[1.25rem] items-center justify-center border border-primary/20">
                                <MapPinIcon size={24} color="hsl(var(--primary))" />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Retrieval Node</Text>
                                <Heading size="md" className="text-foreground font-black tracking-tight mb-2">
                                    {order.fulfillmentPoint ? order.fulfillmentPoint.name : (order as any).pickupLocation || 'Pickup Terminal'}
                                </Heading>
                                <Box className="bg-secondary/20 p-4 rounded-2xl border border-border/30">
                                    <HStack space="sm" className="items-center">
                                        <ShieldCheckIcon size={14} color="hsl(var(--muted-foreground))" />
                                        <Text className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                                            {order.fulfillmentPoint
                                                ? `${order.fulfillmentPoint.address}, ${order.fulfillmentPoint.city}`
                                                : 'Present Transaction ID & Valid Identification for clearance.'}
                                        </Text>
                                    </HStack>
                                </Box>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Fulfillment Point Map */}
                    {order.fulfillmentPoint && (
                        <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden">
                            <HStack space="md" className="items-center mb-6">
                                <Box className="w-10 h-10 bg-blue-500/20 rounded-xl items-center justify-center">
                                    <MapPinIcon size={20} color="rgb(59 130 246)" />
                                </Box>
                                <VStack>
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Location Intelligence</Text>
                                    <Heading size="sm" className="text-foreground font-black tracking-tight">Pickup Point Map</Heading>
                                </VStack>
                            </HStack>
                            <div className="w-full h-64 bg-secondary/20 rounded-2xl overflow-hidden border border-border/30">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    title="Fulfillment Point Location"
                                    loading="lazy"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(order.fulfillmentPoint.address + ', ' + order.fulfillmentPoint.city)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                />
                            </div>
                            <Text className="text-muted-foreground text-[10px] font-medium mt-4 text-center uppercase tracking-wider">
                                {order.fulfillmentPoint.address}, {order.fulfillmentPoint.city}
                            </Text>
                        </Box>
                    )}

                    {/* Itemization Detail */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-xl overflow-hidden">
                        <HStack className="items-center justify-between mb-8">
                            <Heading size="md" className="text-foreground font-black tracking-tight">Manifest Itemization</Heading>
                            <Box className="bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
                                <Text className="text-foreground/70 font-black text-[8px] uppercase tracking-widest">{order.items?.length || 0} Units</Text>
                            </Box>
                        </HStack>

                        <VStack space="lg">
                            {order.items?.map((item: any, index: number) => (
                                <HStack key={index} className="justify-between items-center group">
                                    <HStack space="md" className="items-center">
                                        <Box className="bg-secondary/40 w-10 h-10 rounded-xl items-center justify-center border border-border/30 group-hover:bg-primary/10 transition-colors">
                                            <PackageIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <VStack>
                                            <Text className="text-foreground font-black tracking-tight">Product #{item.productId}</Text>
                                            <Text className="text-muted-foreground text-[10px] font-bold uppercase">Quantity: {item.quantity}</Text>
                                        </VStack>
                                    </HStack>
                                    <Text className="text-foreground font-black">₦{(item.price * item.quantity).toLocaleString()}</Text>
                                </HStack>
                            ))}

                            <Box className="h-[1px] bg-border/20 my-4" />

                            <VStack space="sm">
                                <HStack className="justify-between items-center">
                                    <Text className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Authorized Valuation</Text>
                                    <Heading size="xl" className="text-primary font-black tracking-tighter leading-none">₦{order.totalAmount.toLocaleString()}</Heading>
                                </HStack>
                                <HStack className="justify-end mt-4">
                                    <Box className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
                                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest">Settled via Escrow</Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Operational Support */}
                    <HStack space="md" className="justify-center">
                        <Button variant="link" size="sm" className="opacity-60 hover:opacity-100">
                            <ClockIcon size={14} color="hsl(var(--muted-foreground))" className="mr-2" />
                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Request Support</Text>
                        </Button>
                        <Box className="w-1 h-1 bg-border/40 rounded-full self-center" />
                        <Button variant="link" size="sm" className="opacity-60 hover:opacity-100">
                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Export Receipt</Text>
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
}
