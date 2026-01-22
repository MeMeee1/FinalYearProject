
'use client';

import { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowLeftIcon, PackageIcon, ChevronRightIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserOrders, Order } from '@/lib/api';

export default function Orders() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserOrders().then(setOrders).finally(() => setLoading(false));
    }, []);

    return (
        <Box className="flex-1 min-h-screen bg-gray-50">
            <Box className="bg-white p-4 shadow-sm">
                <HStack className="items-center space-x-4">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-black" />
                    </Button>
                    <Heading size="lg">My Orders</Heading>
                </HStack>
            </Box>

            <Box className="p-4">
                {loading ? (
                    <Text>Loading orders...</Text>
                ) : (
                    <VStack space="md">
                        {orders.map((order) => (
                            <Link href={`/orders/${order.id}`} key={order.id} passHref legacyBehavior>
                                <Box className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                                    <HStack className="justify-between items-center mb-2">
                                        <HStack space="xs" className="items-center">
                                            <PackageIcon size={16} className="text-primary-600" />
                                            <Text className="font-bold text-gray-800">Order #{order.id}</Text>
                                        </HStack>
                                        <Text className={`text-xs px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </Text>
                                    </HStack>
                                    <HStack className="justify-between items-end">
                                        <VStack>
                                            <Text className="text-xs text-gray-500">Date</Text>
                                            <Text className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</Text>
                                        </VStack>
                                        <VStack className="items-end">
                                            <Text className="text-xs text-gray-500">Total</Text>
                                            <Text className="font-bold text-primary-600">₦{order.total.toLocaleString()}</Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Link>
                        ))}
                    </VStack>
                )}
            </Box>
        </Box>
    );
}
