'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { ArrowLeftIcon, CreditCardIcon, MapPinIcon, ShieldCheckIcon, TruckIcon, StoreIcon, ChevronRightIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { getFulfillmentPoints, getUserProfile } from '@/lib/api';

export default function Checkout() {
    const router = useRouter();
    const { total, items, subtotal } = useCart();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [lga, setLga] = useState('FCT');
    const [phone, setPhone] = useState('');
    const [fulfillmentPoints, setFulfillmentPoints] = useState<any[]>([]);
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Logistics Constraint Check
    const logisticsConstraint = useMemo(() => {
        const constrainedItem = items.find(item => item.supportsOutsideLgaDelivery === false);
        if (constrainedItem) {
            return {
                isConstrained: true,
                requiredPointId: constrainedItem.vendor?.assignedVerificationPointId,
                reason: `Product "${constrainedItem.name}" requires on-site collection at vendor warehouse.`
            };
        }
        return { isConstrained: false };
    }, [items]);

    useEffect(() => {
        getFulfillmentPoints().then(points => {
            setFulfillmentPoints(points);

            // If constrained, auto-select the required point
            if (logisticsConstraint.isConstrained && logisticsConstraint.requiredPointId) {
                setSelectedPointId(logisticsConstraint.requiredPointId);
            }
        });

        // Pre-fill user profile info
        getUserProfile().then(user => {
            if (user) {
                if (user.lga) setLga(user.lga);
                if (user.phone) setPhone(user.phone);
                if (user.address) setAddress(user.address);
                if (user.city) setCity(user.city);
            }
        }).catch(e => console.error('Failed to load profile', e));
    }, [logisticsConstraint]);

    return (
        <Box className="flex-1 min-h-screen bg-background pb-40">
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
                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Transaction</Text>
                        <Heading size="lg" className="text-foreground font-black tracking-tighter">Finalize Procurement</Heading>
                    </VStack>
                </HStack>
            </Box>

            <Box className="p-6 max-w-4xl mx-auto">
                <VStack space="xl">
                    {/* Fulfillment Hub Selection (NEW) */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border/50 shadow-xl">
                        <HStack space="sm" className="items-center justify-between mb-6">
                            <HStack space="sm" className="items-center">
                                <Box className="w-8 h-8 bg-primary/20 rounded-xl items-center justify-center">
                                    <StoreIcon size={16} color="hsl(var(--primary))" />
                                </Box>
                                <Heading className="text-foreground font-black tracking-tight text-xl">Collection Hub</Heading>
                            </HStack>
                            {logisticsConstraint.isConstrained && (
                                <Box className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                                    <Text className="text-red-500 text-[8px] font-black uppercase tracking-widest">Fixed Terminal</Text>
                                </Box>
                            )}
                        </HStack>

                        {logisticsConstraint.isConstrained && (
                            <Box className="mb-4 bg-orange-500/5 border border-orange-500/10 p-4 rounded-2xl">
                                <Text className="text-orange-500/80 text-[10px] font-bold leading-relaxed">{logisticsConstraint.reason}</Text>
                            </Box>
                        )}

                        <VStack space="md">
                            {fulfillmentPoints.filter(p => !logisticsConstraint.isConstrained || p.id === logisticsConstraint.requiredPointId).map(point => (
                                <Button
                                    key={point.id}
                                    variant="link"
                                    onPress={() => !logisticsConstraint.isConstrained && setSelectedPointId(point.id)}
                                    className={`p-5 rounded-[2rem] border-2 h-auto text-left flex-row items-center justify-start ${selectedPointId === point.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-secondary/10'}`}
                                >
                                    <HStack space="md" className="items-center w-full">
                                        <Box className={`w-10 h-10 rounded-xl items-center justify-center ${selectedPointId === point.id ? 'bg-primary' : 'bg-background/40'}`}>
                                            <MapPinIcon size={16} color={selectedPointId === point.id ? 'black' : 'hsl(var(--muted-foreground))'} />
                                        </Box>
                                        <VStack className="flex-1">
                                            <Heading size="xs" className="text-foreground font-black tracking-tight">{point.name}</Heading>
                                            <Text className="text-[10px] text-muted-foreground font-medium">{point.address}, {point.city}</Text>
                                        </VStack>
                                        {selectedPointId === point.id && (
                                            <Box className="bg-primary/20 p-2 rounded-full">
                                                <ShieldCheckIcon size={16} color="hsl(var(--primary))" />
                                            </Box>
                                        )}
                                    </HStack>
                                </Button>
                            ))}
                        </VStack>
                    </Box>

                    {/* Delivery Logistics Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border/50 shadow-xl">
                        <HStack space="sm" className="items-center mb-6">
                            <Box className="w-8 h-8 bg-blue-500/20 rounded-xl items-center justify-center">
                                <MapPinIcon size={16} color="rgb(59 130 246)" />
                            </Box>
                            <Heading className="text-foreground font-black tracking-tight text-xl">Collector Identity</Heading>
                        </HStack>

                        <VStack space="lg">
                            <VStack space="xs">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Backup Address (Optional)</Text>
                                <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                    <InputField
                                        placeholder="e.g. 123 Blockchain Ave"
                                        value={address}
                                        onChangeText={setAddress}
                                        className="text-foreground font-bold"
                                    />
                                </Input>
                            </VStack>

                            <Box className="grid grid-cols-2 gap-4">
                                <VStack space="xs">
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Zone / City</Text>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                        <InputField
                                            placeholder="City"
                                            value={city}
                                            onChangeText={setCity}
                                            className="text-foreground font-bold"
                                        />
                                    </Input>
                                </VStack>
                                <VStack space="xs">
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Administrative Area (LGA)</Text>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                        <InputField
                                            placeholder="LGA"
                                            value={lga}
                                            onChangeText={setLga}
                                            className="text-foreground font-bold"
                                        />
                                    </Input>
                                </VStack>
                            </Box>

                            <VStack space="xs">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Communication Channel (Phone)</Text>
                                <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                    <InputField
                                        placeholder="+234 ..."
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                        className="text-foreground font-bold"
                                    />
                                </Input>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Infrastructure Grid */}
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] flex-row items-center space-x-4">
                            <Box className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                                <TruckIcon size={24} color="hsl(var(--primary))" />
                            </Box>
                            <VStack>
                                <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">Delivery Strategy</Text>
                                <Text className="text-muted-foreground text-xs font-medium">Standard Ground (Next Day)</Text>
                            </VStack>
                        </Box>
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] flex-row items-center space-x-4">
                            <Box className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center">
                                <ShieldCheckIcon size={24} color="rgb(59 130 246)" />
                            </Box>
                            <VStack>
                                <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">Transaction Guard</Text>
                                <Text className="text-muted-foreground text-xs font-medium">End-to-End Encryption Enabled</Text>
                            </VStack>
                        </Box>
                    </Box>

                    {/* Valuation Summary Card */}
                    <Box className="bg-card/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border/50 shadow-2xl">
                        <VStack space="lg">
                            <Heading className="text-foreground font-black tracking-tight text-xl mb-2">Valuation Summary</Heading>
                            <VStack space="md">
                                <HStack className="justify-between items-center">
                                    <Text className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Base Procurement Cost</Text>
                                    <Text className="font-black text-foreground">₦{subtotal.toLocaleString()}</Text>
                                </HStack>
                                {/* Network Logistics Fee removed per user request */}
                                <Box className="h-[1px] bg-border/40 my-2" />
                                <HStack className="justify-between items-end">
                                    <VStack>
                                        <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mb-1">Total Authorized Amount</Text>
                                        <Heading size="xl" className="text-primary font-black tracking-tighter leading-none">₦{total.toLocaleString()}</Heading>
                                    </VStack>
                                    <Box className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
                                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest">Final Ledger</Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            {/* Bottom Interaction Deck */}
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-8 border-t border-border/30 pb-12 z-50">
                <Box className="max-w-4xl mx-auto">
                    <Button
                        size="xl"
                        disabled={!address || !city || !phone || !selectedPointId}
                        onPress={() => {
                            const params = new URLSearchParams({
                                address,
                                city,
                                lga,
                                phone,
                                fulfillmentPointId: selectedPointId?.toString() || ''
                            });
                            router.push(`/payment?${params.toString()}`);
                        }}
                        className={`w-full rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(29,185,84,0.3)] border-0 h-24 transition-all active:scale-[0.98] group overflow-hidden relative ${(!address || !city || !phone || !selectedPointId) ? 'opacity-50 grayscale' : ''}`}
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <CreditCardIcon size={24} color="black" />
                            </Box>
                            <VStack className="items-start">
                                <ButtonText className="font-black text-black text-xl uppercase tracking-[0.25em] leading-none">Initialize Ledger Settlement</ButtonText>
                                <Text className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-1">Authorize Transaction Through Secure Payment Gateway</Text>
                            </VStack>
                        </HStack>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
