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
        <Box className="flex-1 min-h-screen bg-[#121212] p-6 justify-center">
            <VStack space="xl" className="max-w-md mx-auto w-full">
                <VStack space="xs" className="items-center mb-8">
                    <Box className="w-16 h-16 bg-[#1DB954] rounded-full items-center justify-center mb-4">
                        <Heading size="2xl" className="text-black font-extrabold">S</Heading>
                    </Box>
                    <Heading size="3xl" className="font-extrabold text-white">Welcome Back</Heading>
                    <Text className="text-gray-400">Sign in to continue shopping</Text>
                </VStack>

                <VStack space="lg">
                    <FormControl isInvalid={!!error}>
                        <FormControlLabel>
                            <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Email</FormControlLabelText>
                        </FormControlLabel>
                        <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                            <InputSlot className="pl-4">
                                <InputIcon as={MailIcon} className="text-gray-400" />
                            </InputSlot>
                            <InputField
                                placeholder="hello@example.com"
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                className="text-white placeholder:text-gray-600 font-medium"
                            />
                        </Input>
                    </FormControl>

                    <FormControl isInvalid={!!error}>
                        <FormControlLabel>
                            <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Password</FormControlLabelText>
                        </FormControlLabel>
                        <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                            <InputSlot className="pl-4">
                                <InputIcon as={LockIcon} className="text-gray-400" />
                            </InputSlot>
                            <InputField
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChangeText={setPassword}
                                className="text-white placeholder:text-gray-600 font-medium"
                            />
                        </Input>
                        <Link href="#" className="self-end mt-3">
                            <Text className="text-[#1DB954] text-sm font-bold hover:text-[#1ed760]">Forgot Password?</Text>
                        </Link>
                        <FormControlError>
                            <FormControlErrorText className="text-red-500 mt-2 text-center">{error}</FormControlErrorText>
                        </FormControlError>
                    </FormControl>

                    <Button size="xl" className="rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg mt-6 h-14 border-0" onPress={handleLogin} disabled={loading}>
                        {loading ? <ButtonSpinner color="black" /> : <ButtonText className="font-bold text-black text-lg">Sign In</ButtonText>}
                    </Button>
                </VStack>

                <HStack className="justify-center mt-8">
                    <Text className="text-gray-400">Don't have an account? </Text>
                    <Link href="/signup">
                        <Text className="text-white font-bold hover:underline">Sign Up</Text>
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
}
