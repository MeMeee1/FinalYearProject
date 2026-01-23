'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ArrowLeftIcon, TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/lib/types';
import { useState } from 'react';

export default function Cart() {
    const router = useRouter();
    // Mock Cart Data (in a real app, this would come from a global state or API)
    const [items, setItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Local Rice',
            price: 15000,
            quantity: 2,
            image: 'https://placehold.co/400x400/png?text=Rice',
            description: 'Premium locally sourced rice from the northern regions.', stock: 10, sku: 'RICE-001', status: 'Available', createdAt: '', updatedAt: '', sellerId: 1, video: null
        },
        {
            id: 2,
            name: 'Palm Oil',
            price: 8000,
            quantity: 1,
            image: 'https://placehold.co/400x400/png?text=Oil',
            description: 'Pure, unadulterated palm oil for all your cooking needs.', stock: 10, sku: 'OIL-002', status: 'Available', createdAt: '', updatedAt: '', sellerId: 1, video: null
        }
    ]);

    const updateQuantity = (id: number, delta: number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const delivery = items.length > 0 ? 2000 : 0;
    const total = subtotal + delivery;

    return (
        <Box className="flex-1 min-h-screen bg-background pb-40">
            {/* Premium Header */}
            <Box className="bg-background/80 backdrop-blur-3xl px-6 pt-12 pb-6 border-b border-border/40 sticky top-0 z-50">
                <HStack className="items-center justify-between">
                    <HStack space="md" className="items-center">
                        <Button
                            variant="solid"
                            className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
                            onPress={() => router.back()}
                        >
                            <ArrowLeftIcon size={20} color="hsl(var(--foreground))" />
                        </Button>
                        <VStack>
                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Logistics Hub</Text>
                            <Heading size="lg" className="text-foreground font-black tracking-tighter">My Procurement</Heading>
                        </VStack>
                    </HStack>
                    <Box className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest">{items.length} Items</Text>
                    </Box>
                </HStack>
            </Box>

            {items.length > 0 ? (
                <Box className="p-6 max-w-4xl mx-auto">
                    <VStack space="xl">
                        {/* Cart Items List */}
                        <VStack space="md">
                            {items.map((item) => (
                                <Box key={item.id} className="bg-card/40 backdrop-blur-md p-4 rounded-[2rem] border border-border/40 group transition-all hover:bg-card/60">
                                    <HStack space="md" className="items-center">
                                        <Box className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted border border-border/40">
                                            <Image
                                                source={{ uri: item.image || '' }}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Box>

                                        <VStack className="flex-1 justify-between h-24 py-1">
                                            <Box>
                                                <HStack className="justify-between items-start">
                                                    <VStack>
                                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">{item.sku || 'N/A'}</Text>
                                                        <Heading size="sm" className="font-black text-foreground tracking-tight">{item.name}</Heading>
                                                    </VStack>
                                                    <Button variant="link" size="sm" className="p-0 h-8 w-8 rounded-lg hover:bg-red-500/10" onPress={() => removeItem(item.id)}>
                                                        <TrashIcon size={16} color="hsl(var(--muted-foreground))" className="group-hover:text-red-500 transition-colors" />
                                                    </Button>
                                                </HStack>
                                                <Text className="text-primary text-sm font-black mt-1">₦{item.price.toLocaleString()}</Text>
                                            </Box>

                                            <HStack className="justify-between items-center">
                                                <HStack className="bg-secondary/40 p-1 rounded-xl border border-border/40 items-center">
                                                    <Button
                                                        variant="link"
                                                        className="w-8 h-8 rounded-lg bg-background/40 items-center justify-center hover:bg-background/60"
                                                        onPress={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <MinusIcon size={12} color="hsl(var(--foreground))" />
                                                    </Button>
                                                    <Box className="w-10 items-center">
                                                        <Text className="text-foreground font-black text-sm">{item.quantity}</Text>
                                                    </Box>
                                                    <Button
                                                        variant="link"
                                                        className="w-8 h-8 rounded-lg bg-background/40 items-center justify-center hover:bg-background/60"
                                                        onPress={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <PlusIcon size={12} color="hsl(var(--foreground))" />
                                                    </Button>
                                                </HStack>
                                                <Text className="text-foreground font-black text-sm">₦{(item.price * item.quantity).toLocaleString()}</Text>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>

                        {/* Summary Card */}
                        <Box className="bg-card/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-border/50 shadow-2xl">
                            <VStack space="lg">
                                <Heading className="text-foreground font-black tracking-tight text-xl mb-2">Valuation Summary</Heading>
                                <VStack space="md">
                                    <HStack className="justify-between items-center">
                                        <Text className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Base Valuation</Text>
                                        <Text className="font-black text-foreground">₦{subtotal.toLocaleString()}</Text>
                                    </HStack>
                                    <HStack className="justify-between items-center">
                                        <Text className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Logistics Fee</Text>
                                        <HStack space="xs" className="items-center">
                                            <Box className="bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                                <Text className="text-blue-400 text-[8px] font-black uppercase">Standard</Text>
                                            </Box>
                                            <Text className="font-black text-foreground">₦{delivery.toLocaleString()}</Text>
                                        </HStack>
                                    </HStack>
                                    <Box className="h-[1px] bg-border/40 my-2" />
                                    <HStack className="justify-between items-end">
                                        <VStack>
                                            <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mb-1">Total Procurement Cost</Text>
                                            <Heading size="xl" className="text-primary font-black tracking-tighter leading-none">₦{total.toLocaleString()}</Heading>
                                        </VStack>
                                        <Box className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
                                            <Text className="text-primary font-black text-[10px] uppercase tracking-widest">VAT Included</Text>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            ) : (
                <Box className="flex-1 justify-center items-center p-8">
                    <VStack space="xl" className="items-center">
                        <Box className="w-32 h-32 bg-secondary/20 rounded-[3rem] items-center justify-center border border-border/30">
                            <ShoppingBagIcon size={48} color="hsl(var(--muted-foreground))" strokeWidth={1} />
                        </Box>
                        <VStack className="items-center" space="xs">
                            <Heading className="text-foreground font-black tracking-tight">Empty Manifest</Heading>
                            <Text className="text-muted-foreground text-center font-medium">Your procurement list is currently empty. Start exploring the network to add items.</Text>
                        </VStack>
                        <Link href="/" passHref legacyBehavior>
                            <Button size="xl" className="rounded-2xl bg-primary px-8">
                                <ButtonText className="text-black font-black uppercase tracking-widest">Explore Network</ButtonText>
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            )}

            {/* Bottom Action Bar */}
            {items.length > 0 && (
                <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-8 border-t border-border/30 pb-12 z-50">
                    <Box className="max-w-4xl mx-auto">
                        <Link href="/checkout" passHref legacyBehavior>
                            <Button size="xl" className="w-full rounded-[2rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(var(--primary),0.3)] border-0 h-20 transition-all active:scale-[0.98] group overflow-hidden relative">
                                <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                <HStack space="md" className="items-center relative z-10">
                                    <Box className="bg-black/10 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                        <ShoppingBagIcon size={20} color="black" />
                                    </Box>
                                    <VStack className="items-start">
                                        <ButtonText className="font-black text-black text-lg uppercase tracking-[0.2em] leading-none">Authorize Checkout</ButtonText>
                                        <Text className="text-black/60 text-[8px] font-black uppercase tracking-widest mt-1">Proceed to Secure Payment Gateway</Text>
                                    </VStack>
                                </HStack>
                            </Button>
                        </Link>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
