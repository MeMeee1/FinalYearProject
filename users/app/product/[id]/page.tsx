'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';


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
                <Text className="text-primary font-black uppercase tracking-widest">Loading Node...</Text>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box className="flex-1 justify-center items-center bg-background">
                <Text className="text-white mb-4">Product not found.</Text>
                <Link href="/">
                    <button className="bg-[#1DB954] px-6 py-3 rounded-xl font-bold text-black transition-transform hover:scale-105">Go Home</button>
                </Link>
            </Box>
        );
    }


    return (
        <Box className="flex-1 min-h-screen bg-background pb-28 sm:pb-32 md:pb-40">
            {/* Header / Navigation Rail */}
            <Box className="fixed top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 z-[100] flex-row justify-between items-center pointer-events-none">
                <button
                    className="rounded-xl sm:rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-10 h-10 sm:w-14 sm:h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90 pointer-events-auto flex"
                    onClick={() => router.back()}
                >
                    <ArrowLeftIcon size={24} color="hsl(var(--foreground))" />
                </button>

                <HStack space="md" className="pointer-events-auto">
                    <button
                        className="rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90 flex"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                        <HeartIcon size={20} color={isWishlisted ? "hsl(var(--primary))" : "hsl(var(--foreground))"} fill={isWishlisted ? "hsl(var(--primary))" : "transparent"} />
                    </button>
                    <button
                        className="rounded-2xl bg-background/60 backdrop-blur-3xl border border-border/40 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/80 transition-all active:scale-90 flex"
                    >
                        <Share2Icon size={20} color="hsl(var(--foreground))" />
                    </button>
                </HStack>
            </Box>

            {/* Immersive Gallery / Hero */}
            <Box className="h-[45vh] sm:h-[55vh] md:h-[65vh] w-full relative overflow-hidden bg-secondary/20">
                <img
                    src={product.image
                        ? product.image.startsWith('http')
                            ? product.image
                            : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')}${product.image.startsWith('/') ? '' : '/'}${product.image}`
                        : 'https://placehold.co/1200x800'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800';
                    }}
                />
                <Box className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-background via-background/40 to-transparent" />

                {/* Visual Status Badges */}
                <HStack space="sm" className="absolute bottom-16 sm:bottom-24 md:bottom-32 left-4 sm:left-6 md:left-8 flex-wrap gap-2">
                    <Box className="bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                        <Text className="text-black text-[10px] font-black uppercase tracking-widest">In Stock ({product.stock})</Text>
                    </Box>
                    <Box className="bg-background/40 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full">
                        <Text className="text-foreground text-[10px] font-black uppercase tracking-widest">{product.productTags || 'Quality Assured'}</Text>
                    </Box>
                </HStack>
            </Box>

            {/* Unified Product Card Container */}
            <Box className="px-4 sm:px-6 -mt-12 sm:-mt-16 md:-mt-24 relative z-10 max-w-4xl mx-auto">
                <VStack space="lg" className="sm:space-y-6 md:space-y-8">
                    {/* Primary Commercial Card */}
                    <Box className="bg-card/60 backdrop-blur-3xl border border-border/50 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden">
                        <Box className="p-4 sm:p-6 md:p-8 lg:p-10">
                            <VStack space="xl">
                                <VStack space="xs">
                                    <HStack className="items-center space-x-2 opacity-60">
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">Node ID: {product.sku || 'N/A'}</Text>
                                    </HStack>
                                    <Heading className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-foreground tracking-tighter leading-[0.85] mb-2">{product.name}</Heading>
                                    {/* <HStack space="xs" className="items-center">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <StarIcon key={s} size={14} color="hsl(var(--primary))" fill="hsl(var(--primary))" />
                                        ))}
                                        <Text className="text-muted-foreground text-xs font-bold ml-2">5.0 (Vetting Approved)</Text>
                                    </HStack> */}
                                </VStack>

                                <HStack className="justify-between items-end border-t border-border/30 pt-4 sm:pt-6 md:pt-8 mt-4 flex-wrap gap-4">
                                    <VStack>
                                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-2">Procurement Value</Text>
                                        <Text className="text-primary font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tighter leading-none">₦{product.price.toLocaleString()}</Text>
                                    </VStack>

                                    {/* Advanced Quantity Selector */}
                                    <HStack className="bg-secondary/40 p-1.5 rounded-2xl border border-border/50 items-center">
                                        <button
                                            className="w-10 h-10 rounded-xl bg-background/40 items-center justify-center hover:bg-background/60 flex"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <MinusIcon size={16} color="hsl(var(--foreground))" />
                                        </button>
                                        <Box className="w-12 items-center">
                                            <Text className="text-foreground font-black text-lg">{quantity}</Text>
                                        </Box>
                                        <button
                                            className="w-10 h-10 rounded-xl bg-background/40 items-center justify-center hover:bg-background/60 flex"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        >
                                            <PlusIcon size={16} color="hsl(var(--foreground))" />
                                        </button>
                                    </HStack>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>

                    {/* Infrastructure & Trusts Grid */}
                    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                                <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Product Overview</Heading>
                            </HStack>
                            <Box className="bg-card/30 border border-border/30 p-8 rounded-[2.5rem]">
                                <Text className="text-muted-foreground font-medium text-lg leading-relaxed">{product.description || 'No detailed specifications provided for this listing.'}</Text>
                            </Box>
                        </VStack>

                        {/* Agricultural Specifications */}
                        <VStack space="md">
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-4 bg-orange-500 rounded-full" />
                                <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Technical Specifications</Heading>
                            </HStack>
                            <Box className="bg-card/30 border border-border/30 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-y-6 sm:gap-x-8 md:gap-x-12">
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Species / Breed</Text>
                                        <Text className="text-foreground font-bold">{product.speciesBreed || 'N/A'}</Text>
                                    </VStack>
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Growth Stage</Text>
                                        <Text className="text-foreground font-bold capitalize">{product.growthStage || 'N/A'}</Text>
                                    </VStack>
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Age</Text>
                                        <Text className="text-foreground font-bold">{product.age || 'N/A'}</Text>
                                    </VStack>
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Avg. Weight / Size</Text>
                                        <Text className="text-foreground font-bold">{product.weightSize || 'N/A'}</Text>
                                    </VStack>
                                </div>
                            </Box>
                        </VStack>

                        {/* Health & Quality Section */}
                        <VStack space="md">
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-4 bg-green-500 rounded-full" />
                                <Heading size="xs" className="font-black text-foreground uppercase tracking-[0.2em] text-[10px]">Health & Quality</Heading>
                            </HStack>
                            <Box className="bg-card/30 border border-border/30 p-8 rounded-[2.5rem] space-y-6">
                                <VStack>
                                    <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Health Status</Text>
                                    <Text className="text-foreground font-bold">{product.healthStatus || 'Verified Healthy'}</Text>
                                </VStack>
                                {product.vaccinationStatus && (
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Vaccination History</Text>
                                        <Text className="text-muted-foreground text-sm font-medium">{product.vaccinationStatus}</Text>
                                    </VStack>
                                )}
                                {product.diseaseHistory && (
                                    <VStack>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Medical Record</Text>
                                        <Text className="text-muted-foreground text-sm font-medium">{product.diseaseHistory}</Text>
                                    </VStack>
                                )}
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
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-4 sm:p-6 md:p-8 border-t border-border/30 pb-6 sm:pb-8 md:pb-12 z-[200]">
                <Box className="max-w-4xl mx-auto flex-row gap-4 sm:gap-6 items-center">
                    <VStack className="hidden md:flex">
                        <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">Total Valuation</Text>
                        <Text className="text-foreground font-black text-2xl tracking-tighter">₦{(product.price * quantity).toLocaleString()}</Text>
                    </VStack>

                    <button
                        onClick={() => {
                            if (product) {
                                addToCart(product, quantity);
                                router.push('/cart');
                            }
                        }}
                        className="flex-1 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(var(--primary),0.3)] border-0 h-14 sm:h-16 md:h-20 lg:h-24 transition-all active:scale-[0.98] group overflow-hidden relative flex items-center justify-center"
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <ShoppingBagIcon size={24} color="black" />
                            </Box>
                            <VStack className="items-start">
                                <Text className="font-black text-black text-base sm:text-lg md:text-xl uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] leading-none">Add To Cart</Text>
                                <Text className="text-black/60 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mt-1 hidden sm:block">Get a product!</Text>
                            </VStack>
                        </HStack>
                    </button>
                </Box>
            </Box>
        </Box>
    );
}
