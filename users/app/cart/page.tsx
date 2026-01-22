
'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ArrowLeftIcon, TrashIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/lib/types';

export default function Cart() {
    const router = useRouter();
    // Mock Cart Data
    const cartItems: CartItem[] = [
        {
            id: 1,
            name: 'Local Rice',
            price: 15000,
            quantity: 2,
            image: 'https://placehold.co/400x400/png?text=Rice',
            description: '', stock: 10, sku: '', status: '', createdAt: '', updatedAt: '', sellerId: 1, video: null
        },
        {
            id: 2,
            name: 'Palm Oil',
            price: 8000,
            quantity: 1,
            image: 'https://placehold.co/400x400/png?text=Oil',
            description: '', stock: 10, sku: '', status: '', createdAt: '', updatedAt: '', sellerId: 1, video: null
        }
    ];

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const delivery = 2000;
    const total = subtotal + delivery;

    return (
        <Box className="flex-1 min-h-screen bg-gray-50 pb-24">
            <Box className="bg-white p-4 shadow-sm">
                <HStack className="items-center space-x-4">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-black" />
                    </Button>
                    <Heading size="lg">My Cart</Heading>
                </HStack>
            </Box>

            {cartItems.length > 0 ? (
                <Box className="p-4">
                    <VStack space="md">
                        {cartItems.map((item) => (
                            <Box key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex-row items-center">
                                <Image
                                    source={{ uri: item.image || '' }}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-lg bg-gray-200"
                                />
                                <VStack className="flex-1 ml-3 justify-between h-20 py-1">
                                    <Box>
                                        <Heading size="sm" className="font-semibold">{item.name}</Heading>
                                        <Text className="text-gray-500 text-xs">₦{item.price.toLocaleString()}</Text>
                                    </Box>
                                    <HStack className="justify-between items-center">
                                        <Box className="bg-gray-100 rounded-lg px-2 py-1 flex-row items-center space-x-3">
                                            <Text className="font-bold text-lg">-</Text>
                                            <Text className="font-semibold mx-2">{item.quantity}</Text>
                                            <Text className="font-bold text-lg">+</Text>
                                        </Box>
                                        <Button variant="link" size="sm" className="p-0">
                                            <ButtonIcon as={TrashIcon} className="text-red-500" />
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </VStack>

                    <Box className="mt-8 bg-white p-4 rounded-xl shadow-sm">
                        <VStack space="sm">
                            <HStack className="justify-between">
                                <Text className="text-gray-500">Subtotal</Text>
                                <Text className="font-semibold">₦{subtotal.toLocaleString()}</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text className="text-gray-500">Delivery</Text>
                                <Text className="font-semibold">₦{delivery.toLocaleString()}</Text>
                            </HStack>
                            <Box className="h-[1px] bg-gray-100 my-2" />
                            <HStack className="justify-between">
                                <Heading size="md">Total</Heading>
                                <Heading size="md" className="text-primary-600">₦{total.toLocaleString()}</Heading>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            ) : (
                <Box className="flex-1 justify-center items-center">
                    <Text>Your cart is empty.</Text>
                </Box>
            )}

            {cartItems.length > 0 && (
                <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                    <Link href="/checkout" passHref legacyBehavior>
                        <Button size="lg" className="w-full rounded-xl bg-primary-600 shadow-md">
                            <ButtonText className="font-bold">Proceed to Checkout</ButtonText>
                        </Button>
                    </Link>
                </Box>
            )}
        </Box>
    );
}
