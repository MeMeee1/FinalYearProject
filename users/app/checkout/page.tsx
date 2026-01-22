
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
                    <Heading size="lg">Checkout</Heading>
                </HStack>
            </Box>

            <Box className="p-4">
                <VStack space="lg">
                    {/* Delivery Address */}
                    <Box className="bg-white p-4 rounded-xl shadow-sm">
                        <Heading size="md" className="mb-3">Delivery Address</Heading>
                        <VStack space="md">
                            <Input>
                                <InputField placeholder="Street Address" />
                            </Input>
                            <Input>
                                <InputField placeholder="City" />
                            </Input>
                            <Input>
                                <InputField placeholder="LGA" defaultValue="Ikeja" />
                            </Input>
                            <Input>
                                <InputField placeholder="Phone Number" keyboardType="phone-pad" />
                            </Input>
                        </VStack>
                    </Box>

                    {/* Order Summary */}
                    <Box className="bg-white p-4 rounded-xl shadow-sm">
                        <Heading size="md" className="mb-3">Order Summary</Heading>
                        <VStack space="sm">
                            <HStack className="justify-between">
                                <Text className="text-gray-500">Items (3)</Text>
                                <Text className="font-semibold">₦23,000</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text className="text-gray-500">Delivery</Text>
                                <Text className="font-semibold">₦2,000</Text>
                            </HStack>
                            <Box className="h-[1px] bg-gray-100 my-2" />
                            <HStack className="justify-between">
                                <Heading size="md">Total</Heading>
                                <Heading size="md" className="text-primary-600">₦25,000</Heading>
                            </HStack>
                        </VStack>
                    </Box>
                </VStack>
            </Box>

            <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
                <Link href="/payment" passHref legacyBehavior>
                    <Button size="lg" className="w-full rounded-xl bg-primary-600 shadow-md">
                        <ButtonText className="font-bold">Proceed to Payment</ButtonText>
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}
