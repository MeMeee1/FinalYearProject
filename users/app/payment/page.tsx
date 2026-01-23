'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, CreditCardIcon, ShieldCheckIcon, LockIcon, BanknoteIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Payment() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('card');

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
                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Settlement Gateway</Text>
                        <Heading size="lg" className="text-foreground font-black tracking-tighter">Authorize Payment</Heading>
                    </VStack>
                </HStack>
            </Box>

            <Box className="p-6 max-w-4xl mx-auto">
                <VStack space="xl">
                    {/* Amount Display Card */}
                    <Box className="bg-primary/90 p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(var(--primary-rgb),0.3)] items-center relative overflow-hidden">
                        <Box className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <Text className="text-black/60 mb-4 font-black uppercase tracking-[0.25em] text-[10px]">Net Authorization Value</Text>
                        <Heading className="text-black font-black text-6xl tracking-tighter leading-none mb-2">₦25,000</Heading>
                        <HStack space="xs" className="items-center bg-black/10 px-3 py-1 rounded-full">
                            <LockIcon size={10} color="black" />
                            <Text className="text-black font-bold uppercase tracking-widest text-[8px]">Secure Transaction Loop</Text>
                        </HStack>
                    </Box>

                    <VStack space="md">
                        <Heading className="text-foreground font-black tracking-tight text-xl ml-2 mb-2">Payment Infrastructure</Heading>

                        {/* Card Method */}
                        <Box
                            className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer ${selectedMethod === 'card' ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-border/40 bg-card/40'}`}
                            onPress={() => setSelectedMethod('card')}
                        >
                            <HStack className="items-center justify-between">
                                <HStack space="md" className="items-center">
                                    <Box className={`w-14 h-14 rounded-2xl items-center justify-center ${selectedMethod === 'card' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-secondary/40'}`}>
                                        <CreditCardIcon size={24} color={selectedMethod === 'card' ? 'black' : 'hsl(var(--muted-foreground))'} />
                                    </Box>
                                    <VStack>
                                        <Heading size="sm" className="text-foreground font-black tracking-tight">Financial Card</Heading>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Mastercard, Visa, Verve</Text>
                                    </VStack>
                                </HStack>
                                {selectedMethod === 'card' && <ShieldCheckIcon size={24} color="hsl(var(--primary))" />}
                            </HStack>
                        </Box>

                        {/* USSD Method - Coming Soon */}
                        <Box className="p-6 rounded-[2.5rem] border border-border/20 bg-card/20 opacity-40 grayscale">
                            <HStack className="items-center justify-between">
                                <HStack space="md" className="items-center">
                                    <Box className="w-14 h-14 bg-secondary/40 rounded-2xl items-center justify-center">
                                        <Text className="font-black text-muted-foreground text-xs tracking-tighter">USSD</Text>
                                    </Box>
                                    <VStack>
                                        <Heading size="sm" className="text-muted-foreground font-black tracking-tight">Terminal Code (USSD)</Heading>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Integration Pending</Text>
                                    </VStack>
                                </HStack>
                            </HStack>
                        </Box>

                        {/* Bank Transfer - Coming Soon */}
                        <Box className="p-6 rounded-[2.5rem] border border-border/20 bg-card/20 opacity-40 grayscale">
                            <HStack className="items-center justify-between">
                                <HStack space="md" className="items-center">
                                    <Box className="w-14 h-14 bg-secondary/40 rounded-2xl items-center justify-center">
                                        <BanknoteIcon size={24} color="hsl(var(--muted-foreground))" />
                                    </Box>
                                    <VStack>
                                        <Heading size="sm" className="text-muted-foreground font-black tracking-tight">Direct Ledger Transfer</Heading>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Node Syncing Required</Text>
                                    </VStack>
                                </HStack>
                            </HStack>
                        </Box>
                    </VStack>

                    {/* Trust Indicators */}
                    <HStack space="md" className="bg-secondary/10 border border-border/30 p-6 rounded-[2.5rem] mt-4">
                        <Box className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center">
                            <ShieldCheckIcon size={20} color="rgb(59 130 246)" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">PCI-DSS Compliant</Text>
                            <Text className="text-muted-foreground text-[10px] font-medium leading-relaxed">Your financial data is never stored on our local nodes. All transactions are handled by Tier-1 payment processors.</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>

            {/* Bottom Interaction Deck */}
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-8 border-t border-border/30 pb-12 z-50">
                <Box className="max-w-4xl mx-auto">
                    <Button
                        size="xl"
                        className="w-full rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(var(--primary-rgb),0.3)] border-0 h-24 transition-all active:scale-[0.98] group overflow-hidden relative"
                        onPress={() => alert('Payment initialization simulation.')}
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <LockIcon size={24} color="black" />
                            </Box>
                            <VStack className="items-start">
                                <ButtonText className="font-black text-black text-xl uppercase tracking-[0.25em] leading-none">Execute Authorization</ButtonText>
                                <Text className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-1">Finalize Secure Financial Handshake</Text>
                            </VStack>
                        </HStack>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
