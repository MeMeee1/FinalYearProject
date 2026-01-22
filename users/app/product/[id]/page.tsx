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
        <Box className="flex-1 min-h-screen bg-[#121212] pb-24">
            {/* Header */}
            <Box className="absolute top-0 left-0 right-0 z-10 p-4">
                <Button
                    variant="solid"
                    className="rounded-full bg-black/50 backdrop-blur-md shadow-sm w-10 h-10 p-0 items-center justify-center border border-white/10"
                    onPress={() => router.back()}
                >
                    <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                </Button>
            </Box>

            {/* Product Image */}
            <Box className="h-96 w-full bg-[#181818]">
                <Image
                    source={{ uri: product.image || 'https://placehold.co/600' }}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Box>

            {/* Content */}
            <Box className="flex-1 -mt-6 bg-[#121212] rounded-t-[30px] p-6 shadow-2xl h-full border-t border-gray-800">
                <VStack space="md">
                    <HStack className="justify-between items-start">
                        <VStack className="flex-1 pr-4">
                            <Heading size="xl" className="font-extrabold text-white">{product.name}</Heading>
                            <HStack space="xs" className="items-center mt-2">
                                <Icon as={MapPinIcon} size="sm" className="text-[#1DB954]" />
                                <Text className="text-gray-400 text-sm font-medium">{product.vendor?.businessAddress || 'Abuja'}</Text>
                            </HStack>
                        </VStack>
                        <Heading size="xl" className="text-[#1DB954] font-bold">₦{product.price.toLocaleString()}</Heading>
                    </HStack>

                    <Box className="h-[1px] bg-gray-800 my-4" />

                    {/* Vendor Info Link */}
                    {product.vendor && (
                        <Link href={`/vendor/${product.vendor.id}`} passHref legacyBehavior>
                            <Box className="bg-[#181818] p-4 rounded-xl flex-row items-center cursor-pointer active:bg-[#282828] border border-gray-800">
                                <Box className="bg-[#1DB954]/10 p-3 rounded-full mr-4">
                                    <Icon as={StoreIcon} className="text-[#1DB954]" />
                                </Box>
                                <VStack>
                                    <Text className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sold by</Text>
                                    <Heading size="sm" className="text-white font-bold">{product.vendor.storeName}</Heading>
                                </VStack>
                            </Box>
                        </Link>
                    )}

                    <VStack space="xs" className="mt-4">
                        <Heading size="sm" className="text-white mb-2">Description</Heading>
                        <Text className="text-gray-400 leading-6">{product.description}</Text>
                    </VStack>
                </VStack>
            </Box>

            {/* Bottom Action Bar */}
            <Box className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md p-6 border-t border-gray-800 pb-8">
                <Button size="xl" className="w-full rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg border-0 h-14">
                    <ButtonIcon as={ShoppingBagIcon} className="mr-2 text-black" />
                    <ButtonText className="font-bold text-black text-lg">Add to Cart</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}
