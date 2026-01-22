import { FlatList, View, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { useCart } from '@/store/cartStore';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { createPaymentIntent } from '@/api/stripe';
import { useStripe } from '@stripe/stripe-react-native';

export default function CartScreen() {
    const items = useCart((state) => state.items);
    const removeProduct = useCart((state) => state.removeProduct);
    const updateQuantity = useCart((state) => state.updateQuantity);
    const clearCart = useCart((state) => state.clearCart);
    const resetCart = useCart((state) => state.resetCart);
    const router = useRouter();

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const totalPrice = items.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
    );

    const paymentIntentMutation = useMutation({
        mutationFn: createPaymentIntent,
        onSuccess: async (data) => {
            const { customer, ephemeralKey, paymentIntent } = data;

            const { error } = await initPaymentSheet({
                merchantDisplayName: 'Ecommerce Store',
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
                defaultBillingDetails: {
                    name: 'Customer',
                },
            });

            if (error) {
                Alert.alert('Error', error.message);
                console.log(error);
                return;
            }

            openPaymentSheet();
        },
        onError: (error) => {
            console.log('Payment intent error:', error);
            Alert.alert('Error', 'Failed to initialize payment');
        },
    });

    const createOrderMutation = useMutation({
        mutationFn: () =>
            createOrder(
                items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                }))
            ),
        onSuccess: (data) => {
            paymentIntentMutation.mutate({ orderId: data.id });
        },
        onError: (error) => {
            console.log('Order creation error:', error);
            Alert.alert('Error', 'Failed to create order');
        },
    });

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            resetCart();
            router.replace('/(tabs)/orders');
        }
    };

    const onCheckout = async () => {
        createOrderMutation.mutateAsync();
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <ShoppingBag size={80} color="#d1d5db" />
                <Text className="text-xl font-semibold text-gray-600 mt-6">
                    Your cart is empty
                </Text>
                <Text className="text-gray-400 mt-2 text-center">
                    Start shopping to add items to your cart
                </Text>
                <Button
                    className="mt-6 bg-indigo-500"
                    onPress={() => router.push('/(tabs)')}
                >
                    <ButtonText>Browse Products</ButtonText>
                </Button>
            </View>
        );
    }

    const isProcessing = createOrderMutation.isPending || paymentIntentMutation.isPending;

    return (
        <VStack className="flex-1 bg-gray-50">
            <FlatList
                data={items}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image
                            source={{ uri: item.product.image || 'https://via.placeholder.com/80' }}
                            style={styles.productImage}
                        />
                        <VStack className="flex-1 ml-3">
                            <Text className="font-semibold text-gray-800" numberOfLines={2}>
                                {item.product.name}
                            </Text>
                            <Text className="text-indigo-600 font-bold mt-1">
                                ${(item.product.price || 0).toFixed(2)}
                            </Text>
                            <HStack className="items-center mt-2" space="sm">
                                <Pressable
                                    onPress={() =>
                                        updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                                    }
                                    style={styles.quantityButton}
                                >
                                    <Minus size={16} color="#6366f1" />
                                </Pressable>
                                <Text className="font-semibold text-gray-800 w-8 text-center">
                                    {item.quantity}
                                </Text>
                                <Pressable
                                    onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    <Plus size={16} color="#6366f1" />
                                </Pressable>
                            </HStack>
                        </VStack>
                        <Pressable
                            onPress={() => removeProduct(item.product.id)}
                            style={styles.deleteButton}
                        >
                            <Trash2 size={20} color="#ef4444" />
                        </Pressable>
                    </View>
                )}
                keyExtractor={(item) => item.product.id.toString()}
            />

            {/* Bottom Summary */}
            <View style={styles.summaryContainer}>
                <HStack className="justify-between items-center mb-4">
                    <Text className="text-gray-600">Subtotal</Text>
                    <Text className="text-xl font-bold text-gray-800">
                        ${totalPrice.toFixed(2)}
                    </Text>
                </HStack>
                <Button
                    className="bg-indigo-500 rounded-xl"
                    size="lg"
                    onPress={onCheckout}
                    disabled={isProcessing}
                >
                    <ButtonText>
                        {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                    </ButtonText>
                </Button>
                <Pressable onPress={clearCart} style={styles.clearCartButton}>
                    <Text className="text-red-500 text-center">Clear Cart</Text>
                </Pressable>
            </View>
        </VStack>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    listContent: {
        padding: 16,
        paddingBottom: 200,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        padding: 8,
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    clearCartButton: {
        marginTop: 12,
        padding: 8,
    },
});
