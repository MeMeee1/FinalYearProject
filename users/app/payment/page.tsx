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
        <Box className="flex-1 min-h-screen bg-[#121212] pb-24">
            <Box className="bg-[#121212] p-4 shadow-sm border-b border-gray-800 sticky top-0 z-10">
                <HStack className="items-center space-x-4">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                    </Button>
                    <Heading size="lg" className="text-white font-bold">Payment</Heading>
                </HStack>
            </Box>

            <Box className="p-4">
                <VStack space="lg">
                    <Box className="bg-[#282828] p-6 rounded-2xl shadow-sm text-center py-10 border border-gray-800">
                        <Text className="text-gray-400 mb-2 font-medium uppercase tracking-wider text-xs">Total Amount to Pay</Text>
                        <Heading size="4xl" className="text-[#1DB954] font-extrabold">₦25,000</Heading>
                    </Box>

                    <Heading size="md" className="ml-2 text-white font-bold">Select Payment Method</Heading>

                    <VStack space="md">
                        {/* Active Method */}
                        <Card variant="outline" className="p-4 border-2 border-[#1DB954] bg-[#1DB954]/10 rounded-xl">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-[#1DB954] p-3 rounded-full">
                                    <CreditCardIcon size={24} color="black" />
                                </Box>
                                <VStack>
                                    <Heading size="sm" className="text-white font-bold">Pay with Card</Heading>
                                    <Text className="text-xs text-gray-400">Mastercard, Visa, Verve</Text>
                                </VStack>
                            </HStack>
                        </Card>

                        {/* Inactive Methods */}
                        <Card variant="outline" className="p-4 bg-[#282828] border-gray-800 rounded-xl opacity-60">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-[#383838] p-3 rounded-full w-12 h-12 items-center justify-center">
                                    <Text className="font-bold text-gray-500 text-xs">USSD</Text>
                                </Box>
                                <VStack>
                                    <Heading size="sm" className="text-gray-400">Pay with USSD</Heading>
                                    <Text className="text-xs text-gray-600">Coming soon</Text>
                                </VStack>
                            </HStack>
                        </Card>

                        <Card variant="outline" className="p-4 bg-[#282828] border-gray-800 rounded-xl opacity-60">
                            <HStack className="items-center space-x-4">
                                <Box className="bg-[#383838] p-3 rounded-full w-12 h-12 items-center justify-center">
                                    <Text className="font-bold text-gray-500 text-xs">TF</Text>
                                </Box>
                                <VStack>
                                    <Heading size="sm" className="text-gray-400">Bank Transfer</Heading>
                                    <Text className="text-xs text-gray-600">Coming soon</Text>
                                </VStack>
                            </HStack>
                        </Card>
                    </VStack>
                </VStack>
            </Box>

            <Box className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md p-6 border-t border-gray-800">
                <Button size="xl" className="w-full rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg border-0 h-14">
                    <ButtonText className="font-bold text-black text-lg">Pay Now</ButtonText>
                </Button>
            </Box>
        </Box>
    );
}
