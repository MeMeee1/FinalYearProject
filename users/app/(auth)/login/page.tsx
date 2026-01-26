'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* -------------------------
   UI Components
-------------------------- */
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';



/* -------------------------
   Icons
-------------------------- */
import {
    MailIcon,
    LockIcon,
    ArrowRightIcon,
    ShieldCheckIcon,
} from 'lucide-react-native';

/* -------------------------
   API
-------------------------- */
import { login } from '@/lib/api';

export default function Login() {
    const router = useRouter();

    /* -------------------------
       State
    -------------------------- */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    /* -------------------------
       Handlers
    -------------------------- */
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
            {/* ======================
          Ambient Background
      ======================= */}
            <Box className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
            <Box className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />

            <VStack space="2xl" className="max-w-md w-full z-10 p-4">

                {/* ======================
            Branding
        ======================= */}
                <VStack space="md" className="items-center mb-6">
                    <Box className="w-24 h-24 bg-primary rounded-[2rem] items-center justify-center shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] rotate-6 border-4 border-white/5">
                        <Heading size="4xl" className="text-primary-foreground font-black italic tracking-tighter">
                            Lx
                        </Heading>
                    </Box>

                    <VStack className="items-center" space="xs">
                        <Heading className="text-foreground font-black tracking-tighter text-5xl leading-none">
                            LiveX
                        </Heading>

                        <HStack space="xs" className="items-center bg-secondary/80 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                            <ShieldCheckIcon size={14} color="hsl(var(--primary))" />
                            <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                                Livestock Delivery
                            </Text>
                        </HStack>
                    </VStack>
                </VStack>

                {/* ======================
            Authentication Card
        ======================= */}
                <Box className="bg-card/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <VStack space="xl">

                        {/* Email */}
                        <Box>
                            <Text className="mb-3 ml-2 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">
                                Email Identifier
                            </Text>

                            <Box className="relative">
                                <Box className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                                    <MailIcon size={20} color="hsl(var(--muted-foreground))" />
                                </Box>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    autoCapitalize="none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-2xl bg-input border-transparent h-16 pl-14 pr-5 text-foreground font-bold text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </Box>
                        </Box>

                        {/* Password */}
                        <Box>
                            <Text className="mb-3 ml-2 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">
                                Access Key
                            </Text>

                            <Box className="relative">
                                <Box className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                                    <LockIcon size={20} color="hsl(var(--muted-foreground))" />
                                </Box>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl bg-input border-transparent h-16 pl-14 pr-5 text-foreground font-bold text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </Box>

                            {error && (
                                <Text className="text-destructive mt-4 text-center font-bold text-xs uppercase tracking-widest bg-destructive/10 py-2 rounded-lg">
                                    {error}
                                </Text>
                            )}
                        </Box>

                        {/* Submit */}
                        {/* Submit */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full rounded-2xl bg-primary h-16 mt-2 transition-all group relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <HStack space="md" className="items-center justify-center relative z-10 w-full">
                                {loading ? (
                                    <Text className="text-primary-foreground font-black uppercase tracking-[0.2em] animate-pulse">
                                        Loading...
                                    </Text>
                                ) : (
                                    <>
                                        <Text className="font-black text-primary-foreground text-lg uppercase tracking-[0.2em]">
                                            Sign In
                                        </Text>
                                        <ArrowRightIcon
                                            size={20}
                                            color="hsl(var(--primary-foreground))"
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}
                            </HStack>
                        </button>
                    </VStack>
                </Box>

                {/* ======================
            Footer
        ======================= */}
                <VStack className="items-center">
                    <HStack space="xs" className="items-center bg-secondary/50 px-6 py-3 rounded-full backdrop-blur-sm border border-white/5">
                        <Text className="text-muted-foreground font-medium text-sm">
                            New to LiveX?
                        </Text>
                        <Link href="/signup">
                            <Text className="text-primary font-black text-sm uppercase tracking-widest">
                                Create Account
                            </Text>
                        </Link>
                    </HStack>
                </VStack>

            </VStack>
        </Box>
    );
}
