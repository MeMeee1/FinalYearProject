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
        <Box className="flex-1 min-h-screen bg-[#121212] pb-32">
            <Box className="bg-[#121212] p-4 shadow-sm border-b border-gray-800 sticky top-0 z-10">
                <HStack className="items-center space-x-4">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                    </Button>
                    <Heading size="lg" className="text-white font-bold">My Cart</Heading>
                </HStack>
            </Box>

            {cartItems.length > 0 ? (
                <Box className="p-4">
                    <VStack space="md">
                        {cartItems.map((item) => (
                            <Box key={item.id} className="bg-[#282828] p-3 rounded-xl shadow-sm flex-row items-center border border-gray-800">
                                <Image
                                    source={{ uri: item.image || '' }}
                                    alt={item.name}
                                    className="w-20 h-20 rounded-lg bg-[#181818]"
                                />
                                <VStack className="flex-1 ml-3 justify-between h-20 py-1">
                                    <Box>
                                        <Heading size="sm" className="font-semibold text-white">{item.name}</Heading>
                                        <Text className="text-[#1DB954] text-sm font-bold">₦{item.price.toLocaleString()}</Text>
                                    </Box>
                                    <HStack className="justify-between items-center">
                                        <Box className="bg-[#383838] rounded-lg px-3 py-1 flex-row items-center space-x-4">
                                            <Text className="font-bold text-lg text-white">-</Text>
                                            <Text className="font-semibold mx-2 text-white">{item.quantity}</Text>
                                            <Text className="font-bold text-lg text-white">+</Text>
                                        </Box>
                                        <Button variant="link" size="sm" className="p-0">
                                            <ButtonIcon as={TrashIcon} className="text-gray-400 hover:text-red-500" />
                                        </Button>
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    </VStack>

                    <Box className="mt-8 bg-[#282828] p-6 rounded-2xl shadow-sm border border-gray-800">
                        <VStack space="sm">
                            <HStack className="justify-between">
                                <Text className="text-gray-400">Subtotal</Text>
                                <Text className="font-semibold text-white">₦{subtotal.toLocaleString()}</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text className="text-gray-400">Delivery</Text>
                                <Text className="font-semibold text-white">₦{delivery.toLocaleString()}</Text>
                            </HStack>
                            <Box className="h-[1px] bg-gray-700 my-4" />
                            <HStack className="justify-between items-center">
                                <Heading size="md" className="text-white">Total</Heading>
                                <Heading size="xl" className="text-[#1DB954] font-bold">₦{total.toLocaleString()}</Heading>
                            </HStack>
                        </VStack>
                    </Box>
                </Box>
            ) : (
                <Box className="flex-1 justify-center items-center">
                    <Text className="text-gray-400">Your cart is empty.</Text>
                </Box>
            )}

            {cartItems.length > 0 && (
                <Box className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md p-6 border-t border-gray-800">
                    <Link href="/checkout" passHref legacyBehavior>
                        <Button size="xl" className="w-full rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg border-0 h-14">
                            <ButtonText className="font-bold text-black text-lg">Proceed to Checkout</ButtonText>
                        </Button>
                    </Link>
                </Box>
            )}
        </Box>
    );
}
