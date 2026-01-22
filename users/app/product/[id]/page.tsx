
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
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
            <Box className="flex-1 justify-center items-center bg-background-0">
                <Text>Loading...</Text>
            </Box>
        );
    }

    if (!product) {
        return (
            <Box className="flex-1 justify-center items-center bg-background-0">
                <Text>Product not found.</Text>
                <Link href="/">
                    <Button className="mt-4"><ButtonText>Go Home</ButtonText></Button>
                </Link>
            </Box>
        );
    }

    return (
        <Box className="flex-1 min-h-screen bg-background-0 pb-20">
            {/* Header */}
            <Box className="absolute top-0 left-0 right-0 z-10 p-4">
                <Button
                    variant="solid"
                    className="rounded-full bg-white/80 shadow-sm w-10 h-10 p-0 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <ButtonIcon as={ArrowLeftIcon} className="text-black" />
                </Button>
            </Box>

            {/* Product Image */}
            <Box className="h-96 w-full bg-gray-100">
                <Image
                    source={{ uri: product.image || 'https://placehold.co/600' }}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Box>

            {/* Content */}
            <Box className="flex-1 -mt-6 bg-white rounded-t-[30px] p-6 shadow-lg h-full">
                <VStack space="md">
                    <HStack className="justify-between items-start">
                        <VStack className="flex-1 pr-4">
                            <Heading size="xl" className="font-bold text-typography-900">{product.name}</Heading>
                            <HStack space="xs" className="items-center mt-1">
                                <Icon as={MapPinIcon} size="sm" className="text-gray-400" />
                                <Text className="text-gray-500 text-sm">{product.vendor?.businessAddress || 'Lagos'}</Text>
                            </HStack>
                        </VStack>
                        <Heading size="lg" className="text-primary-600 font-bold">₦{product.price.toLocaleString()}</Heading>
                    </HStack>

                    <Box className="h-[1px] bg-gray-100 my-2" />

                    {/* Vendor Info Link */}
                    {product.vendor && (
                        <Link href={`/vendor/${product.vendor.id}`} passHref legacyBehavior>
                            <Box className="bg-gray-50 p-3 rounded-lg flex-row items-center cursor-pointer active:bg-gray-100">
                                <Box className="bg-primary-100 p-2 rounded-full mr-3">
                                    <Icon as={StoreIcon} className="text-primary-600" />
                                </Box>
                                <VStack>
                                    <Text className="text-xs text-gray-500">Sold by</Text>
                                    <Heading size="sm" className="text-typography-800">{product.vendor.storeName}</Heading>
                                </VStack>
                            </Box>
                        </Link>
                    )}

                    <VStack space="xs" className="mt-2">
                        <Heading size="sm" className="text-typography-800">Description</Heading>
                        <Text className="text-gray-600 leading-6">{product.description}</Text>
                    </VStack>
                </VStack>
            </Box>

            {/* Bottom Action Bar */}
            <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                <Button size="lg" className="w-full rounded-xl bg-primary-600 shadow-md">
                    <ButtonIcon as={ShoppingBagIcon} className="mr-2 text-white" />
                    <ButtonText className="font-bold">Add to Cart</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}
