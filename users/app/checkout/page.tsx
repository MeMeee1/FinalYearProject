'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { ArrowLeftIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Checkout() {
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
                    <Heading size="lg" className="text-white font-bold">Checkout</Heading>
                </HStack>
            </Box>

            <Box className="p-4">
                <VStack space="lg">
                    {/* Delivery Address */}
                    <Box className="bg-[#282828] p-6 rounded-2xl shadow-sm border border-gray-800">
                        <Heading size="md" className="mb-4 text-white">Delivery Address</Heading>
                        <VStack space="md">
                            <Input size="lg" className="rounded-xl bg-[#181818] border-0 h-12">
                                <InputField placeholder="Street Address" className="text-white placeholder:text-gray-600 font-medium" />
                            </Input>
                            <Input size="lg" className="rounded-xl bg-[#181818] border-0 h-12">
                                <InputField placeholder="City" className="text-white placeholder:text-gray-600 font-medium" />
                            </Input>
                            <Input size="lg" className="rounded-xl bg-[#181818] border-0 h-12">
                                <InputField placeholder="LGA" defaultValue="Ikeja" className="text-white placeholder:text-gray-600 font-medium" />
                            </Input>
                            <Input size="lg" className="rounded-xl bg-[#181818] border-0 h-12">
                                <InputField placeholder="Phone Number" keyboardType="phone-pad" className="text-white placeholder:text-gray-600 font-medium" />
                            </Input>
                        </VStack>
                    </Box>

                    {/* Order Summary */}
                    <Box className="bg-[#282828] p-6 rounded-2xl shadow-sm border border-gray-800">
                        <Heading size="md" className="mb-4 text-white">Order Summary</Heading>
                        <VStack space="sm">
                            <HStack className="justify-between">
                                <Text className="text-gray-400">Items (3)</Text>
                                <Text className="font-semibold text-white">₦23,000</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text className="text-gray-400">Delivery</Text>
                                <Text className="font-semibold text-white">₦2,000</Text>
                            </HStack>
                            <Box className="h-[1px] bg-gray-700 my-4" />
                            <HStack className="justify-between items-center">
                                <Heading size="md" className="text-white">Total</Heading>
                                <Heading size="xl" className="text-[#1DB954] font-bold">₦25,000</Heading>
                            </HStack>
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            <Box className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md p-6 border-t border-gray-800">
                <Link href="/payment" passHref legacyBehavior>
                    <Button size="xl" className="w-full rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg border-0 h-14">
                        <ButtonText className="font-bold text-black text-lg">Proceed to Payment</ButtonText>
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
