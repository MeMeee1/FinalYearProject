
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { ArrowLeftIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getVendor, Product } from '@/lib/api';

import { ProductCard } from '@/components/ProductCard';
import { CameraIcon, MapPinIcon, InfoIcon, ShieldCheckIcon } from 'lucide-react-native';

export default function VendorDetails() {
    const params = useParams();
    const router = useRouter();
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            setLoading(true);
            getVendor(Number(params.id))
                .then(setVendor)
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-background">
                <Text className="text-primary animate-pulse font-black uppercase tracking-widest">Accessing Node Data...</Text>
            </Box>
        );
    }

    if (!vendor) return <Box className="p-4 bg-background h-full"><Text className="text-foreground">Vendor not found</Text></Box>;

    return (
        <Box className="flex-1 min-h-screen bg-background pb-32">
            {/* Dynamic Banner Header */}
            <Box className="h-64 w-full relative overflow-hidden">
                <Image
                    source={{ uri: vendor.storeBanner || 'https://placehold.co/1200x400' }}
                    className="w-full h-full object-cover opacity-60"
                    alt="banner"
                />
                <Box className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />

                {/* Back Button */}
                <Box className="absolute top-8 left-8 z-50">
                    <Button
                        variant="solid"
                        className="rounded-2xl bg-background/40 backdrop-blur-2xl border border-border/20 shadow-2xl w-14 h-14 p-0 items-center justify-center hover:bg-background/60 transition-all active:scale-95"
                        onPress={() => router.back()}
                    >
                        <ArrowLeftIcon size={24} color="hsl(var(--foreground))" />
                    </Button>
                </Box>
            </Box>

            {/* Profile Content */}
            <Box className="px-8 -mt-20 relative z-10">
                <VStack space="xl">
                    {/* Identity Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl border border-border/50 p-8 rounded-[2.5rem] shadow-2xl">
                        <HStack space="lg" className="items-center">
                            <Box className="w-24 h-24 rounded-3xl bg-secondary p-1 border border-border/50 shadow-xl relative">
                                <Image
                                    source={{ uri: vendor.storeLogo || 'https://placehold.co/200' }}
                                    className="w-full h-full rounded-[1.25rem] object-cover"
                                    alt="logo"
                                />
                                <Box className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 border-4 border-card shadow-lg">
                                    <ShieldCheckIcon size={12} color="black" />
                                </Box>
                            </Box>
                            <VStack className="flex-1">
                                <HStack className="items-center space-x-2 mb-1">
                                    <Box className="px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                                        <Text className="text-primary text-[8px] font-black uppercase tracking-widest">Verified Vendor</Text>
                                    </Box>
                                </HStack>
                                <Heading className="text-4xl font-black text-foreground tracking-tighter leading-none">{vendor.storeName}</Heading>
                                <HStack space="xs" className="items-center mt-2">
                                    <MapPinIcon size={12} color="hsl(var(--muted-foreground))" />
                                    <Text className="text-muted-foreground text-xs font-medium">{vendor.businessAddress || 'Location unverified'}</Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* About Section */}
                    <Box className="bg-secondary/20 border border-border/30 p-8 rounded-[2.5rem]">
                        <HStack space="sm" className="items-center mb-4">
                            <InfoIcon size={14} color="hsl(var(--primary))" />
                            <Text className="text-[10px] text-foreground font-black uppercase tracking-[0.2em]">Operational Narrative</Text>
                        </HStack>
                        <Text className="text-muted-foreground font-medium text-lg leading-relaxed">{vendor.storeDescription || 'This vendor has not updated their brand story yet.'}</Text>
                    </Box>

                    {/* Inventory Grid */}
                    <Box className="mt-8">
                        <HStack className="justify-between items-center mb-8 px-2">
                            <VStack space="xs">
                                <Text className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Commercial Inventory</Text>
                                <Heading size="2xl" className="text-foreground font-black tracking-tighter">Current Catalog</Heading>
                            </VStack>
                            <Box className="bg-secondary/50 px-4 py-2 rounded-xl border border-border/50">
                                <Text className="text-foreground font-black text-xs uppercase">{(vendor.products || []).length} Listings</Text>
                            </Box>
                        </HStack>

                        <Box className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {(vendor.products || []).map((product: Product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </Box>

                        {(localStorage.getItem('userType') === 'vendor' && !vendor.products?.length) && (
                            <Box className="bg-card/50 border-2 border-dashed border-border/50 rounded-[2.5rem] p-20 items-center justify-center">
                                <VStack space="md" className="items-center">
                                    <Box className="w-16 h-16 bg-secondary rounded-full items-center justify-center">
                                        <CameraIcon size={32} color="hsl(var(--muted-foreground))" />
                                    </Box>
                                    <Text className="text-muted-foreground font-black text-center uppercase tracking-widest text-xs">No active listings in the network</Text>
                                </VStack>
                            </Box>
                        )}
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}
