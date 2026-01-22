
'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeftIcon, CreditCardIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';

export default function Payment() {
    const router = useRouter();

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
                    <Heading size="lg">Payment</Heading>
                </HStack>
            </Box>

            <Box className="p-4">
                <VStack space="lg">
                    <Box className="bg-white p-6 rounded-xl shadow-sm text-center py-10">
                        <Text className="text-gray-500 mb-2">Total Amount to Pay</Text>
                        <Heading size="3xl" className="text-primary-600 font-bold">₦25,000</Heading>
                    </Box>

                    <Heading size="md" className="ml-2">Select Payment Method</Heading>

                    <VStack space="md">
                        <Card variant="outline" className="p-4 border-2 border-primary-500 bg-primary-50">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-white p-2 rounded-full">
                                    <CreditCardIcon size={24} color="black" />
                                </Box>
                                <VStack>
                                    <Heading size="sm">Pay with Card</Heading>
                                    <Text className="text-xs text-gray-500">Mastercard, Visa, Verve</Text>
                                </VStack>
                            </HStack>
                        </Card>

                        <Card variant="outline" className="p-4 bg-white opacity-50">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-gray-100 p-2 rounded-full">
                                    <Text className="font-bold">USSD</Text>
                                </Box>
                                <VStack>
                                    <Heading size="sm">Pay with USSD</Heading>
                                    <Text className="text-xs text-gray-500">Coming soon</Text>
                                </VStack>
                            </HStack>
                        </Card>

                        <Card variant="outline" className="p-4 bg-white opacity-50">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-gray-100 p-2 rounded-full">
                                    <Text className="font-bold">Transfer</Text>
                                </Box>
                                <VStack>
                                    <Heading size="sm">Bank Transfer</Heading>
                                    <Text className="text-xs text-gray-500">Coming soon</Text>
                                </VStack>
                            </HStack>
                        </Card>
                    </VStack>
                </VStack>
            </Box>

            <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                <Button size="lg" className="w-full rounded-xl bg-primary-600 shadow-md">
                    <ButtonText className="font-bold">Pay Now</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}
