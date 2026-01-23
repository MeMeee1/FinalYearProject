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
import { useCart } from '@/context/CartContext';

export default function Cart() {
    const router = useRouter();
    const { items, updateQuantity, removeFromCart, subtotal, total } = useCart();
    const delivery = items.length > 0 ? 2000 : 0;

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
                <Box className="p-6 w-full max-w-4xl mx-auto">
                    <VStack space="2xl" className="w-full">
                        {/* Cart Items List */}
                        <VStack space="lg" className="w-full">
                            {items.map((item) => (
                                <Box key={item.id} className="bg-card/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-border/40 group transition-all hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5 w-full">
                                    <HStack space="xl" className="items-center w-full">
                                        <Box className="relative w-32 h-32 rounded-3xl overflow-hidden bg-muted border border-border/40 shadow-inner">
                                            <Image
                                                source={{ uri: item.image || '' }}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </Box>

                                        <VStack className="flex-1 justify-between min-h-[128px] py-1">
                                            <Box>
                                                <HStack className="justify-between items-start w-full">
                                                    <VStack className="flex-1 mr-4">
                                                        <Text className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1">{item.sku || 'N/A'}</Text>
                                                        <Heading size="md" className="font-black text-foreground tracking-tighter leading-tight">{item.name}</Heading>
                                                    </VStack>
                                                    <Button
                                                        variant="link"
                                                        className="p-3 bg-secondary/30 rounded-2xl hover:bg-red-500/10 transition-colors"
                                                        onPress={() => removeFromCart(item.id)}
                                                    >
                                                        <TrashIcon size={18} color="hsl(var(--muted-foreground))" className="group-hover:text-red-500 transition-colors" />
                                                    </Button>
                                                </HStack>
                                                <Text className="text-foreground text-xl font-black mt-2 tracking-tighter">₦{item.price.toLocaleString()}</Text>
                                            </Box>

                                            <HStack className="justify-between items-center mt-4">
                                                <HStack className="bg-background/40 p-1.5 rounded-2xl border border-border/40 items-center">
                                                    <Button
                                                        variant="link"
                                                        className="w-10 h-10 rounded-xl bg-secondary/50 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
                                                        onPress={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <MinusIcon size={12} color="hsl(var(--foreground))" />
                                                    </Button>
                                                    <Box className="w-12 items-center">
                                                        <Text className="text-foreground font-black text-base">{item.quantity}</Text>
                                                    </Box>
                                                    <Button
                                                        variant="link"
                                                        className="w-10 h-10 rounded-xl bg-secondary/50 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95"
                                                        onPress={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <PlusIcon size={12} color="hsl(var(--foreground))" />
                                                    </Button>
                                                </HStack>
                                                <VStack className="items-end">
                                                    <Text className="text-[8px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Item Total</Text>
                                                    <Text className="text-foreground font-black text-lg tracking-tighter">₦{(item.price * item.quantity).toLocaleString()}</Text>
                                                </VStack>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>

                        {/* Summary Card */}
                        <Box className="bg-card/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-border/50 shadow-2xl w-full">
                            <VStack space="xl">
                                <Heading className="text-foreground font-black tracking-tighter text-3xl mb-4">Valuation Summary</Heading>
                                <VStack space="lg">
                                    <HStack className="justify-between items-center">
                                        <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.25em]">Base Valuation</Text>
                                        <Text className="font-black text-foreground text-xl">₦{subtotal.toLocaleString()}</Text>
                                    </HStack>
                                    <HStack className="justify-between items-center">
                                        <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.25em]">Logistics Fee</Text>
                                        <HStack space="md" className="items-center">
                                            <Box className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                                <Text className="text-primary text-[8px] font-black uppercase tracking-widest">Standard</Text>
                                            </Box>
                                            <Text className="font-black text-foreground text-xl">₦{delivery.toLocaleString()}</Text>
                                        </HStack>
                                    </HStack>
                                    <Box className="h-[1px] bg-border/40 my-4" />
                                    <HStack className="justify-between items-center">
                                        <VStack>
                                            <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.4em] mb-2">Total Procurement Cost</Text>
                                            <Heading size="3xl" className="text-primary font-black tracking-tighter leading-none">₦{total.toLocaleString()}</Heading>
                                        </VStack>
                                        <Box className="bg-primary px-4 py-2 rounded-2xl shadow-lg shadow-primary/20">
                                            <Text className="text-black font-black text-[10px] uppercase tracking-widest">VAT Included</Text>
                                        </Box>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* Action Deck (Now in Scroll Area) */}
                        <Box className="mt-4 pb-12">
                            <Link href="/checkout" passHref legacyBehavior>
                                <Button size="xl" className="w-full rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(29,185,84,0.3)] border-0 h-24 transition-all active:scale-[0.98] group overflow-hidden relative">
                                    <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <HStack space="xl" className="items-center relative z-10">
                                        <Box className="bg-black/10 p-4 rounded-2xl group-hover:rotate-12 transition-transform shadow-inner">
                                            <ShoppingBagIcon size={28} color="black" />
                                        </Box>
                                        <VStack className="items-start">
                                            <ButtonText className="font-black text-black text-2xl uppercase tracking-[0.2em] leading-none">Authorize Checkout</ButtonText>
                                            <Text className="text-black/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Proceed to Secure Payment Gateway</Text>
                                        </VStack>
                                    </HStack>
                                </Button>
                            </Link>
                        </Box>
                    </VStack>
                </Box>
            ) : (
                <Box className="flex-1 justify-center items-center py-32">
                    <VStack space="2xl" className="items-center max-w-xs">
                        <Box className="w-40 h-40 bg-secondary/20 rounded-[4rem] items-center justify-center border border-border/30 shadow-inner">
                            <ShoppingBagIcon size={64} color="hsl(var(--muted-foreground))" strokeWidth={1} />
                        </Box>
                        <VStack className="items-center" space="md">
                            <Heading size="xl" className="text-foreground font-black tracking-tighter">Empty Manifest</Heading>
                            <Text className="text-muted-foreground text-center font-medium leading-relaxed">Your procurement list is currently empty. Start exploring the network to add items.</Text>
                        </VStack>
                        <Link href="/" passHref legacyBehavior>
                            <Button size="xl" className="rounded-2xl bg-primary px-10 h-16 shadow-lg shadow-primary/20">
                                <ButtonText className="text-black font-black uppercase tracking-widest text-sm">Explore Products</ButtonText>
                            </Button>
                        </Link>
                    </VStack>
                </Box>
            )}
        </Box>
    );
}
