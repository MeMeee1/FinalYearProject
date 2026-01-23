'use client';

import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { MailIcon, LockIcon, ArrowRightIcon, ShieldCheckIcon } from 'lucide-react-native';
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
            setError(err.message || 'Authentication failed. Please verify credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
            {/* Ambient Background Elements */}
            <Box className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            <Box className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <VStack space="2xl" className="max-w-md w-full z-10">
                {/* Branding Section */}
                <VStack space="md" className="items-center mb-4">
                    <Box className="w-20 h-20 bg-primary rounded-[2rem] items-center justify-center shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] rotate-3">
                        <Heading size="3xl" className="text-black font-black italic">Lx</Heading>
                    </Box>
                    <VStack className="items-center" space="xs">
                        <Heading className="text-foreground font-black tracking-tighter text-4xl leading-none">LiveX</Heading>
                        <HStack space="xs" className="items-center bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
                            <ShieldCheckIcon size={12} color="hsl(var(--primary))" />
                            <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Livestock Delivery</Text>
                        </HStack>
                    </VStack>
                </VStack>

                {/* Authentication Card */}
                <Box className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-border/50 shadow-2xl">
                    <VStack space="xl">
                        <FormControl isInvalid={!!error}>
                            <FormControlLabel className="mb-2 ml-1">
                                <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                <InputSlot className="mr-3">
                                    <MailIcon size={20} color="hsl(var(--muted-foreground))" />
                                </InputSlot>
                                <InputField
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="text-foreground font-bold"
                                />
                            </Input>
                        </FormControl>

                        <FormControl isInvalid={!!error}>
                            <FormControlLabel className="mb-2 ml-1">
                                <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-16 px-4">
                                <InputSlot className="mr-3">
                                    <LockIcon size={20} color="hsl(var(--muted-foreground))" />
                                </InputSlot>
                                <InputField
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChangeText={setPassword}
                                    className="text-foreground font-bold"
                                />
                            </Input>
                            {/* <Link href="#" className="self-end mt-4">
                                <Text className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Reset Key?</Text>
                            </Link> */}
                            <FormControlError>
                                <FormControlErrorText className="text-red-500 mt-4 text-center font-bold text-xs uppercase tracking-widest">{error}</FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <Button
                            size="xl"
                            className="rounded-2xl bg-primary hover:scale-[1.02] shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] border-0 h-16 mt-4 transition-all active:scale-[0.98] group overflow-hidden relative"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <HStack space="md" className="items-center relative z-10">
                                {loading ? (
                                    <ButtonSpinner color="black" />
                                ) : (
                                    <>
                                        <ButtonText className="font-black text-black text-lg uppercase tracking-[0.2em]">Sign In</ButtonText>
                                        <ArrowRightIcon size={20} color="black" />
                                    </>
                                )}
                            </HStack>
                        </Button>
                    </VStack>
                </Box>

                {/* Footer Actions */}
                <VStack space="lg" className="items-center">
                    <HStack space="xs" className="items-center">
                        <Text className="text-muted-foreground font-medium text-sm">Don't have an account?</Text>
                        <Link href="/signup">
                            <Text className="text-foreground font-black text-sm uppercase tracking-widest hover:text-primary transition-colors">Sign Up</Text>
                        </Link>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    );
}
