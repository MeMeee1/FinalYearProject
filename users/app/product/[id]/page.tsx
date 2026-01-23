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
import { useCart } from '@/context/CartContext';
import { useStockSync } from '@/hooks/useStockSync';
import { useCallback } from 'react';
import {
    HeartIcon,
    Share2Icon,
    MinusIcon,
    PlusIcon,
    TruckIcon,
    ShieldCheckIcon,
    RotateCcwIcon,
    StarIcon
} from 'lucide-react-native';
export default function ProductDetails() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    const handleSyncUpdate = useCallback((data: { productId: number, newStock: number }) => {
        if (product && data.productId === product.id) {
            setProduct(prev => prev ? { ...prev, stock: data.newStock } : null);
        }
    }, [product?.id]);

    useStockSync(handleSyncUpdate);

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
            <Box className="flex-1 justify-center items-center bg-background">
                <ButtonSpinner color="#1DB954" size="large" />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box className="flex-1 justify-center items-center bg-background">
                <Text className="text-white mb-4">Product not found.</Text>
                <Link href="/">
                    <Button className="bg-[#1DB954]"><ButtonText className="text-black font-bold">Go Home</ButtonText></Button>
                </Link>
            </Box>
        );
    }


    return (
        <Box className="flex-1 min-h-screen bg-background pb-40">
            {/* Header / Navigation Rail */}
            <Box className="fixed top-8 left-8 right-8 z-[100] flex-row justify-between items-center pointer-events-none">
                <Button
                    variant="solid"
                    className="rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90 pointer-events-auto"
                    onPress={() => router.back()}
                >
                    <ArrowLeftIcon size={24} color="hsl(var(--foreground))" />
                </Button>

                <HStack space="md" className="pointer-events-auto">
                    <Button
                        variant="solid"
                        className="rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90"
                        onPress={() => setIsWishlisted(!isWishlisted)}
                    >
                        <HeartIcon size={20} color={isWishlisted ? "hsl(var(--primary))" : "hsl(var(--foreground))"} fill={isWishlisted ? "hsl(var(--primary))" : "transparent"} />
                    </Button>
                    <Button
                        variant="solid"
                        className="rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90"
                    >
                        <Share2Icon size={20} color="hsl(var(--foreground))" />
                    </Button>
                </HStack>
            </Box>

            {/* Immersive Gallery / Hero */}
            <Box className="h-[65vh] w-full relative overflow-hidden bg-secondary/20">
                <Image
                    source={{ uri: product.image || 'https://placehold.co/1200x800' }}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <Box className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Visual Status Badges */}
                <HStack space="sm" className="absolute bottom-32 left-8">
                    <Box className="bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                        <Text className="text-black text-[10px] font-black uppercase tracking-widest">In Stock ({product.stock})</Text>
                    </Box>
                    <Box className="bg-background/40 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full">
                        <Text className="text-foreground text-[10px] font-black uppercase tracking-widest">{product.productTags || 'Quality Assured'}</Text>
                    </Box>
                </HStack>
            </Box>

            {/* Unified Product Card Container */}
            <Box className="px-6 -mt-24 relative z-10 max-w-4xl mx-auto">
                <VStack space="xl">
                    {/* Primary Commercial Card */}
                    <Box className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden">
                        <Box className="p-10">
                            <VStack space="xl">
                                <VStack space="xs">
                                    <HStack className="items-center space-x-2 opacity-60">
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">Node ID: {product.sku || 'N/A'}</Text>
                                    </HStack>
                                    <Heading className="text-6xl font-black text-foreground tracking-tighter leading-[0.85] mb-2">{product.name}</Heading>
                                    {/* <HStack space="xs" className="items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <StarIcon key={s} size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
                                        ))}
                                        <Text className="text-muted-foreground text-xs font-bold ml-2">5.0 (Vetting Approved)</Text>
                                    </HStack> */}
                                </VStack>

                                <HStack className="justify-between items-end border-t border-border/30 pt-8 mt-4">
                                    <VStack>
                                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-2">Procurement Value</Text>
                                        <Text className="text-primary font-black text-5xl tracking-tighter leading-none">₦{product.price.toLocaleString()}</Text>
                                    </VStack>

                                    {/* Advanced Quantity Selector */}
                                    <HStack className="bg-secondary/40 p-1.5 rounded-2xl border border-border/50 items-center">
                                        <Button
                                            variant="link"
                                            className="w-10 h-10 rounded-xl bg-background/40 items-center justify-center hover:bg-background/60"
                                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <MinusIcon size={16} color="hsl(var(--foreground))" />
                                        </Button>
                                        <Box className="w-12 items-center">
                                            <Text className="text-foreground font-black text-lg">{quantity}</Text>
                                        </Box>
                                        <Button
                                            variant="link"
                                            className="w-10 h-10 rounded-xl bg-background/40 items-center justify-center hover:bg-background/60"
                                            onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        >
                                            <PlusIcon size={16} color="hsl(var(--foreground))" />
                                        </Button>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>

                    {/* Infrastructure & Trusts Grid */}
                    <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] items-center text-center">
                            <Box className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mb-4">
                                <TruckIcon size={24} color="hsl(var(--primary))" />
                            </Box>
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest mb-1">Logistics</Text>
                            <Text className="text-muted-foreground text-xs font-medium">Standard 24h delivery within Central Abuja</Text>
                        </Box>
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] items-center text-center">
                            <Box className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center mb-4">
                                <ShieldCheckIcon size={24} color="rgb(59 130 246)" />
                            </Box>
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest mb-1">Integrity</Text>
                            <Text className="text-muted-foreground text-xs font-medium">100% Organic & Authenticity Verified</Text>
                        </Box>
                        <Box className="bg-secondary/10 border border-border/30 p-6 rounded-[2rem] items-center text-center">
                            <Box className="w-12 h-12 bg-purple-500/10 rounded-2xl items-center justify-center mb-4">
                                <RotateCcwIcon size={24} color="rgb(168 85 247)" />
                            </Box>
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest mb-1">Return</Text>
                            <Text className="text-muted-foreground text-xs font-medium">Seal-intact returns accepted within 2h</Text>
                        </Box>
                    </Box>

                    {/* Operational Narratives */}
                    <VStack space="lg" className="px-4">
                        <VStack space="md">
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-4 bg-primary rounded-full shadow-lg shadow-primary/30" />
                                <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Specifications Detail</Heading>
                            </HStack>
                            <Box className="bg-card/30 border border-border/30 p-8 rounded-[2.5rem]">
                                <Text className="text-muted-foreground font-medium text-lg leading-relaxed">{product.description || 'No detailed specifications provided for this listing.'}</Text>
                            </Box>
                        </VStack>

                        {/* Vendor Identity */}
                        {product.vendor && (
                            <VStack space="md">
                                <HStack space="sm" className="items-center">
                                    <Box className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                    <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Origin Node</Heading>
                                </HStack>
                                <Link href={`/vendor/${product.vendor.id}`} passHref legacyBehavior>
                                    <Box className="bg-secondary/20 hover:bg-secondary/40 border border-border/50 p-6 rounded-[2.5rem] flex-row items-center cursor-pointer transition-all active:scale-[0.98] group overflow-hidden relative">
                                        <Box className="w-20 h-20 bg-card rounded-3xl flex items-center justify-center border border-border/50 group-hover:scale-105 transition-all overflow-hidden relative shadow-xl">
                                            <StoreIcon size={28} color="hsl(var(--primary))" />
                                        </Box>
                                        <VStack className="ml-6 flex-1">
                                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.25em] mb-1">Licensed Producer</Text>
                                            <Heading size="lg" className="text-foreground font-black tracking-tight leading-tight">{product.vendor.storeName}</Heading>
                                            <HStack space="xs" className="items-center mt-1 opacity-60">
                                                <MapPinIcon size={12} color="hsl(var(--foreground))" />
                                                <Text className="text-foreground text-[10px] font-bold">{product.vendor.businessAddress || 'Location Confirmed'}</Text>
                                            </HStack>
                                        </VStack>
                                        <Box className="w-12 h-12 bg-background/40 items-center justify-center rounded-2xl border border-border/50 group-hover:translate-x-1 transition-all">
                                            <ChevronRightIcon color="hsl(var(--primary))" />
                                        </Box>
                                    </Box>
                                </Link>
                            </VStack>
                        )}
                    </VStack>
                </VStack>
            </Box>

            {/* Procurement Interaction Deck */}
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-8 border-t border-border/30 pb-12 z-[200]">
                <Box className="max-w-4xl mx-auto flex-row gap-6 items-center">
                    <VStack className="hidden md:flex">
                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Total Valuation</Text>
                        <Text className="text-foreground font-black text-2xl tracking-tighter">₦{(product.price * quantity).toLocaleString()}</Text>
                    </VStack>

                    <Button
                        size="xl"
                        onPress={() => {
                            if (product) {
                                addToCart(product, quantity);
                                router.push('/cart');
                            }
                        }}
                        className="flex-1 rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(var(--primary),0.3)] border-0 h-24 transition-all active:scale-[0.98] group overflow-hidden relative"
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <ShoppingBagIcon size={24} color="black" />
                            </Box>
                            <VStack className="items-start">
                                <ButtonText className="font-black text-black text-xl uppercase tracking-[0.25em] leading-none">Add To Cart</ButtonText>
                                <Text className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-1">Get a product!</Text>
                            </VStack>
                        </HStack>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
