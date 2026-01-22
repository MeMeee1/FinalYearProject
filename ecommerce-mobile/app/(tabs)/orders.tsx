import { View, FlatList, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { listOrders } from '@/api/orders';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    pending: { color: '#f59e0b', icon: Clock, label: 'Pending' },
    processing: { color: '#3b82f6', icon: Package, label: 'Processing' },
    shipped: { color: '#8b5cf6', icon: Truck, label: 'Shipped' },
    delivered: { color: '#22c55e', icon: CheckCircle, label: 'Delivered' },
    cancelled: { color: '#ef4444', icon: XCircle, label: 'Cancelled' },
};

export default function OrdersScreen() {
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: listOrders,
    });

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-4 text-gray-500">Loading orders...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text className="text-red-500 text-lg">Error loading orders</Text>
                <Text className="text-gray-400 mt-2">Please try again later</Text>
            </View>
        );
    }

    const orders = data?.data || [];

    if (orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Package size={80} color="#d1d5db" />
                <Text className="text-xl font-semibold text-gray-600 mt-6">
                    No orders yet
                </Text>
                <Text className="text-gray-400 mt-2 text-center">
                    Your order history will appear here
                </Text>
            </View>
        );
    }

    return (
        <VStack className="flex-1 bg-gray-50">
            <FlatList
                data={orders}
                contentContainerStyle={styles.listContent}
                renderItem={({ item: order }) => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                        <Pressable
                            onPress={() => router.push(`/orders/${order.id}`)}
                            style={styles.orderCard}
                        >
                            <HStack className="justify-between items-start">
                                <VStack>
                                    <Text className="font-bold text-gray-800">
                                        Order #{order.id}
                                    </Text>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </Text>
                                </VStack>
                                <HStack className="items-center" space="xs">
                                    <StatusIcon size={14} color={status.color} />
                                    <Text style={{ color: status.color, fontWeight: '600', fontSize: 12 }}>
                                        {status.label}
                                    </Text>
                                </HStack>
                            </HStack>

                            <View style={styles.divider} />

                            <HStack className="justify-between items-center">
                                <VStack>
                                    <Text className="text-gray-500 text-sm">Total Amount</Text>
                                    <Text className="font-bold text-indigo-600 text-lg">
                                        ${(order.totalAmount || order.total || 0).toFixed(2)}
                                    </Text>
                                </VStack>
                                <ChevronRight size={20} color="#9ca3af" />
                            </HStack>
                        </Pressable>
                    );
                }}
                keyExtractor={(item) => item.id.toString()}
            />
        </VStack>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 12,
    },
});
