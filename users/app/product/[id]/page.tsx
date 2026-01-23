'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon, ButtonSpinner } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { ArrowLeftIcon, ShoppingBagIcon, MapPinIcon, StoreIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, Product } from '@/lib/api';
import { ChevronRightIcon } from '@/components/ui/icon';
export default function ProductDetails() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            setLoading(true);
            getProduct(Number(params.id))
                .then(setProduct)
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-[#121212]">
                <ButtonSpinner color="#1DB954" size="large" />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box className="flex-1 justify-center items-center bg-[#121212]">
                <Text className="text-white mb-4">Product not found.</Text>
                <Link href="/">
                    <Button className="bg-[#1DB954]"><ButtonText className="text-black font-bold">Go Home</ButtonText></Button>
                </Link>
            </Box>
        );
    }

    return (
        <Box className="flex-1 min-h-screen bg-background pb-32">
            {/* Action Header */}
            <Box className="absolute top-8 left-8 right-8 z-50 flex-row justify-between items-center">
                <Button
                    variant="solid"
                    className="rounded-2xl bg-background/40 backdrop-blur-2xl border border-border/20 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/60 transition-all active:scale-95"
                    onPress={() => router.back()}
                >
                    <ArrowLeftIcon size={24} color="hsl(var(--foreground))" />
                </Button>

                <Box className="bg-background/40 backdrop-blur-2xl border border-border/20 shadow-2xl px-6 py-3 rounded-2xl">
                    <Text className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">{product.productTags || 'Local Choice'}</Text>
                </Box>
            </Box>

            {/* Product Hero Section */}
            <Box className="h-[50vh] w-full relative">
                <Image
                    source={{ uri: product.image || 'https://placehold.co/600' }}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <Box className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
            </Box>

            {/* Content Container */}
            <Box className="px-8 -mt-20 relative z-10">
                <VStack space="xl">
                    {/* Main Info Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl border border-border/50 p-8 rounded-[2.5rem] shadow-2xl">
                        <VStack space="lg">
                            <VStack space="xs">
                                <HStack className="items-center space-x-2">
                                    <Box className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Institutional Grade</Text>
                                </HStack>
                                <Heading className="text-4xl font-black text-foreground tracking-tighter leading-none">{product.name}</Heading>
                            </VStack>

                            <HStack className="justify-between items-end border-t border-border/30 pt-6">
                                <VStack>
                                    <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Unit Quotation</Text>
                                    <Text className="text-primary font-black text-4xl tracking-tighter">₦{product.price.toLocaleString()}</Text>
                                </VStack>

                                <HStack className="items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                                    <MapPinIcon size={14} color="hsl(var(--primary))" />
                                    <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">{product.vendor?.city || 'Abuja'}</Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Logistics / Vendor Card */}
                    {product.vendor && (
                        <Link href={`/vendor/${product.vendor.id}`} passHref legacyBehavior>
                            <Box className="bg-secondary/20 hover:bg-secondary/40 border border-border/30 p-6 rounded-[2rem] flex-row items-center cursor-pointer transition-all active:scale-[0.98] group">
                                <Box className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform overflow-hidden">
                                    {product.vendor.storeLogo ? (
                                        <Image source={{ uri: product.vendor.storeLogo }} className="w-full h-full" alt="logo" />
                                    ) : (
                                        <StoreIcon size={24} color="hsl(var(--primary))" />
                                    )}
                                </Box>
                                <VStack className="ml-5 flex-1">
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Authenticated Vendor</Text>
                                    <Heading size="md" className="text-foreground font-black tracking-tight">{product.vendor.storeName}</Heading>
                                </VStack>
                                <ChevronRightIcon size={20} color="hsl(var(--muted-foreground))" className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </Box>
                        </Link>
                    )}

                    {/* Specifications */}
                    <Box className="px-4">
                        <HStack space="sm" className="items-center mb-4">
                            <Box className="w-1.5 h-4 bg-primary rounded-full" />
                            <Text className="text-[10px] text-foreground font-black uppercase tracking-[0.2em]">Product Specifications</Text>
                        </HStack>
                        <Text className="text-muted-foreground font-medium text-lg leading-relaxed">{product.description || 'No detailed specifications provided for this listing.'}</Text>
                    </Box>
                </VStack>
            </Box>

            {/* Global Interaction Rail */}
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-2xl p-8 border-t border-border/30 pb-12 z-[100]">
                <Button size="xl" className="w-full rounded-[2rem] bg-primary hover:scale-[1.02] shadow-[0_20px_40px_rgba(var(--primary),0.3)] border-0 h-20 transition-all active:scale-[0.98] group overflow-hidden relative">
                    <Box className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <HStack space="md" className="items-center relative z-10">
                        <ShoppingBagIcon size={24} color="black" />
                        <ButtonText className="font-black text-black text-xl uppercase tracking-[0.25em]">Initialize Procurement</ButtonText>
                    </HStack>
                </Button>
            </Box>
        </Box>
    );
}
