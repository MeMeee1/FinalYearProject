
'use client';

import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { MailIcon, LockIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 min-h-screen bg-white p-6 justify-center">
            <VStack space="xl" className="max-w-md mx-auto w-full">
                <VStack space="xs">
                    <Heading size="3xl" className="font-bold text-primary-600">Welcome Back</Heading>
                    <Text className="text-gray-500">Sign in to continue shopping</Text>
                </VStack>

                <VStack space="lg">
                    <FormControl isInvalid={!!error}>
                        <FormControlLabel>
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="rounded-xl">
                            <InputSlot className="pl-3">
                                <InputIcon as={MailIcon} className="text-gray-400" />
                            </InputSlot>
                            <InputField
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </Input>
                    </FormControl>

                    <FormControl isInvalid={!!error}>
                        <FormControlLabel>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input size="lg" className="rounded-xl">
                            <InputSlot className="pl-3">
                                <InputIcon as={LockIcon} className="text-gray-400" />
                            </InputSlot>
                            <InputField
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </Input>
                        <Link href="#" className="self-end mt-2">
                            <Text className="text-primary-600 text-sm font-semibold">Forgot Password?</Text>
                        </Link>
                        <FormControlError>
                            <FormControlErrorText>{error}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <Button size="lg" className="rounded-xl bg-primary-600 shadow-md mt-4" onPress={handleLogin} disabled={loading}>
                        {loading ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold">Sign In</ButtonText>}
                    </Button>
                </VStack>

                <HStack className="justify-center mt-4">
                    <Text className="text-gray-500">Don't have an account? </Text>
                    <Link href="/signup">
                        <Text className="text-primary-600 font-bold">Sign Up</Text>
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
}
