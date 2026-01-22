
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

    if (loading) return <Box className="p-4"><Text>Loading...</Text></Box>;
    if (!vendor) return <Box className="p-4"><Text>Vendor not found</Text></Box>;

    return (
        <Box className="flex-1 min-h-screen bg-background-0">
            <Box className="bg-primary-600 h-40 w-full absolute top-0" />

            <Box className="p-4 pt-10">
                <Button
                    variant="solid"
                    className="rounded-full bg-white/20 w-10 h-10 p-0 items-center justify-center mb-6"
                    onPress={() => router.back()}
                >
                    <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                </Button>

                <VStack space="lg" className="items-center mt-4">
                    <Avatar size="2xl" className="border-4 border-white bg-secondary-400">
                        <AvatarFallbackText>{vendor.storeName}</AvatarFallbackText>
                    </Avatar>
                    <VStack className="items-center">
                        <Heading size="xl" className="font-bold text-typography-900">{vendor.storeName}</Heading>
                        <Text className="text-gray-500 text-center px-8">{vendor.description}</Text>
                    </VStack>
                </VStack>

                <Box className="mt-8">
                    <Heading size="md" className="mb-4 text-typography-800">Products</Heading>
                    {/* Using same grid as Home for consistency */}
                    <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {/* Mock products for vendor using empty array if undefined */}
                        {(vendor.products || []).map((product: Product) => (
                            <Link href={`/product/${product.id}`} key={product.id} passHref legacyBehavior>
                                <Box className="cursor-pointer group">
                                    <Card size="md" variant="elevated" className="p-0 overflow-hidden h-full border-0 shadow-sm bg-white rounded-xl">
                                        <Box className="h-32 w-full bg-gray-100">
                                            <Image
                                                source={{ uri: product.image || 'https://placehold.co/400' }}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Box>
                                        <VStack className="p-3" space="xs">
                                            <Heading size="sm" className="font-semibold line-clamp-1">{product.name}</Heading>
                                            <Text className="text-secondary-600 font-bold">₦{product.price.toLocaleString()}</Text>
                                        </VStack>
                                    </Card>
                                </Box>
                            </Link>
                        ))}
                        {(!vendor.products || vendor.products.length === 0) && (
                            <Text className="col-span-2 text-gray-400">No products found for this vendor.</Text>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
