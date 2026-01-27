'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';


import { ArrowLeftIcon, CreditCardIcon, MapPinIcon, ShieldCheckIcon, StoreIcon, ChevronRightIcon } from 'lucide-react-native';
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
        <Box className="flex-1 min-h-screen bg-background pb-32 sm:pb-40">
            {/* Premium Header */}
            <Box className="bg-background/80 backdrop-blur-3xl px-4 pt-8 pb-4 sm:px-6 sm:pt-12 sm:pb-6 border-b border-border/40 sticky top-0 z-50">
                <HStack space="md" className="items-center">
                    <button
                        className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95 flex"
                        onClick={() => router.back()}
                    >
                        <ArrowLeftIcon size={20} color="hsl(var(--foreground))" />
                    </button>
                    <VStack>
                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Transaction</Text>
                        <Heading size="lg" className="text-foreground font-black tracking-tighter">Finalize Procurement</Heading>
                    </VStack>
                </HStack>
            </Box>

            <Box className="p-4 sm:p-6 max-w-4xl mx-auto">
                <VStack space="lg" className="sm:space-y-6 md:space-y-8">
                    {/* Fulfillment Hub Selection (NEW) */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-xl">
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
                                <button
                                    key={point.id}
                                    onClick={() => !logisticsConstraint.isConstrained && setSelectedPointId(point.id)}
                                    className={`p-5 rounded-[2rem] border-2 h-auto text-left flex flex-row items-center justify-start w-full ${selectedPointId === point.id ? 'border-primary bg-primary/5' : 'border-border/30 bg-secondary/10'}`}
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
                                </button>
                            ))}
                        </VStack>

                        {/* Map Preview for Selected Point */}
                        {selectedPointId && (() => {
                            const selectedPoint = fulfillmentPoints.find(p => p.id === selectedPointId);
                            if (!selectedPoint) return null;

                            const lat = selectedPoint.latitude || 9.0765;
                            const lng = selectedPoint.longitude || 7.3986;

                            return (
                                <Box className="mt-6">
                                    <HStack space="sm" className="items-center mb-4">
                                        <Box className="w-6 h-6 bg-blue-500/20 rounded-lg items-center justify-center">
                                            <MapPinIcon size={12} color="rgb(59 130 246)" />
                                        </Box>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Location Preview</Text>
                                    </HStack>

                                    <div className="w-full h-40 sm:h-48 bg-secondary/20 rounded-xl sm:rounded-2xl overflow-hidden border border-border/30 mb-3">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            title="Selected Pickup Point"
                                            loading="lazy"
                                            style={{ border: 0 }}
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008},${lat - 0.008},${lng + 0.008},${lat + 0.008}&layer=mapnik&marker=${lat},${lng}`}
                                        />
                                    </div>

                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPoint.address + ', ' + selectedPoint.city)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500/20 active:scale-[0.98] transition-all"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                        </svg>
                                        View on Google Maps
                                    </a>
                                </Box>
                            );
                        })()}
                    </Box>

                    {/* Delivery Logistics Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-xl">
                        <HStack space="sm" className="items-center mb-6">
                            <Box className="w-8 h-8 bg-blue-500/20 rounded-xl items-center justify-center">
                                <MapPinIcon size={16} color="rgb(59 130 246)" />
                            </Box>
                            <Heading className="text-foreground font-black tracking-tight text-xl">Collector Identity</Heading>
                        </HStack>

                        <VStack space="lg">
                            <VStack space="xs">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Backup Address (Optional)</Text>
                                <Box className="relative">
                                    <input
                                        placeholder="e.g. 123 Blockchain Ave"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full rounded-xl sm:rounded-2xl bg-secondary/20 border border-border/30 h-12 sm:h-14 md:h-16 px-3 sm:px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base"
                                    />
                                </Box>
                            </VStack>

                            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <VStack space="xs">
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Zone / City</Text>
                                    <input
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full rounded-xl sm:rounded-2xl bg-secondary/20 border border-border/30 h-12 sm:h-14 md:h-16 px-3 sm:px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base"
                                    />
                                </VStack>
                                <VStack space="xs">
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Administrative Area (LGA)</Text>
                                    <input
                                        placeholder="LGA"
                                        value={lga}
                                        onChange={(e) => setLga(e.target.value)}
                                        className="w-full rounded-xl sm:rounded-2xl bg-secondary/20 border border-border/30 h-12 sm:h-14 md:h-16 px-3 sm:px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base"
                                    />
                                </VStack>
                            </Box>

                            <VStack space="xs">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1 mb-1">Communication Channel (Phone)</Text>
                                <input
                                    placeholder="+234 ..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="tel"
                                    className="w-full rounded-xl sm:rounded-2xl bg-secondary/20 border border-border/30 h-12 sm:h-14 md:h-16 px-3 sm:px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 text-sm sm:text-base"
                                />
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Infrastructure Grid */}
                    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] flex-row items-center space-x-4">
                            <Box className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center">
                                <ShieldCheckIcon size={24} color="rgb(59 130 246)" />
                            </Box>
                            <VStack>
                                <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">Transaction Guard</Text>
                                <Text className="text-muted-foreground text-xs font-medium">End-to-End Encryption Enabled</Text>
                            </VStack>
                        </Box>
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] flex-row items-center space-x-4">
                            <Box className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                                <StoreIcon size={24} color="hsl(var(--primary))" />
                            </Box>
                            <VStack>
                                <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">Fulfillment Pickup</Text>
                                <Text className="text-muted-foreground text-xs font-medium">Collect at your selected point</Text>
                            </VStack>
                        </Box>
                    </Box>

                    {/* Valuation Summary Card */}
                    <Box className="bg-card/60 backdrop-blur-3xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-2xl">
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
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-4 sm:p-6 md:p-8 border-t border-border/30 pb-6 sm:pb-8 md:pb-12 z-50">
                <Box className="max-w-4xl mx-auto">
                    <button
                        disabled={!address || !city || !phone || !selectedPointId}
                        onClick={() => {
                            const params = new URLSearchParams({
                                address,
                                city,
                                lga,
                                phone,
                                fulfillmentPointId: selectedPointId?.toString() || ''
                            });
                            router.push(`/payment?${params.toString()}`);
                        }}
                        className={`w-full rounded-xl sm:rounded-2xl md:rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(29,185,84,0.3)] border-0 h-14 sm:h-16 md:h-20 lg:h-24 transition-all active:scale-[0.98] group overflow-hidden relative flex items-center justify-center ${(!address || !city || !phone || !selectedPointId) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <CreditCardIcon size={24} color="black" />
                            </Box>
                            <VStack className="items-start">
                                <Text className="font-black text-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] leading-none">Initialize Ledger Settlement</Text>
                                <Text className="text-black/60 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-1 hidden sm:block">Authorize Transaction Through Secure Payment Gateway</Text>
                            </VStack>
                        </HStack>
                    </button>
                </Box>
            </Box>
        </Box>
    );
}
