
'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowLeftIcon, MapPinIcon, CheckCircleIcon } from 'lucide-react-native';
import { useRouter, useParams } from 'next/navigation';

export default function OrderDetails() {
    const router = useRouter();
    const params = useParams();

    // Mock data for specific order
    const order = {
        id: params.id,
        status: 'Ready for Pickup',
        pickupLocation: 'Ikeja City Mall Pickup Center, Shop L45',
        items: [
            { name: 'Local Rice', quantity: 2, price: 15000 },
            { name: 'Palm Oil', quantity: 1, price: 8000 }
        ],
        total: 38000,
        date: new Date().toISOString()
    };

    return (
        <Box className="flex-1 min-h-screen bg-gray-50">
            <Box className="bg-primary-600 p-4 pb-20 rounded-b-[30px] shadow-sm">
                <HStack className="items-center space-x-4 mb-4">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                    </Button>
                    <Heading size="lg" className="text-white">Order Details</Heading>
                </HStack>
                <VStack className="items-center">
                    <Heading size="2xl" className="text-white font-bold">#{order.id}</Heading>
                    <Text className="text-white/80">{order.status}</Text>
                </VStack>
            </Box>

            <Box className="p-4 -mt-16">
                <VStack space="lg">
                    {/* Pickup Info */}
                    <Box className="bg-white p-6 rounded-xl shadow-md">
                        <HStack space="md" className="items-start">
                            <Box className="bg-primary-100 p-2 rounded-full">
                                <MapPinIcon className="text-primary-600" />
                            </Box>
                            <VStack className="flex-1">
                                <Heading size="sm" className="mb-1 text-gray-500">Pickup Location</Heading>
                                <Text className="font-semibold text-lg">{order.pickupLocation}</Text>
                                <Text className="text-sm text-gray-500 mt-2">Bring your ID and Order Number for collection.</Text>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Items */}
                    <Box className="bg-white p-6 rounded-xl shadow-sm">
                        <Heading size="md" className="mb-4">Items</Heading>
                        <VStack space="md">
                            {order.items.map((item, index) => (
                                <HStack key={index} className="justify-between items-center">
                                    <HStack space="sm" className="items-center">
                                        <Text className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{item.quantity}x</Text>
                                        <Text className="font-medium">{item.name}</Text>
                                    </HStack>
                                    <Text className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</Text>
                                </HStack>
                            ))}
                            <Box className="h-[1px] bg-gray-100 my-2" />
                            <HStack className="justify-between">
                                <Heading size="sm">Total Paid</Heading>
                                <Heading size="sm" className="text-primary-600">₦{order.total.toLocaleString()}</Heading>
                            </HStack>
                        </VStack>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}
