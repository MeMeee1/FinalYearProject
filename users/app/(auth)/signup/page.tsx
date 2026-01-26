'use client';

import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
// import { Heading } from '@/components/ui/heading';

import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { MailIcon, LockIcon, UserIcon, MapPinIcon, GlobeIcon, HomeIcon, ArrowRightIcon, ArrowLeftIcon, ChevronDownIcon, ShieldCheckIcon } from 'lucide-react-native';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api';

const LGAs = [
    'Abaji',
    'Abuja Municipal',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Kwali'
];

export default function Signup() {
    const router = useRouter();
    const [step, setStep] = useState(1);

    // Step 1: Identity Payload
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Logistics Coordinates
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('Abuja');
    const [country, setCountry] = useState('Nigeria');
    const [lga, setLga] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async () => {
        setLoading(true);
        setError('');
        try {
            await signup(email, password, name, lga, address, city, country);
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Network error or invalid input data.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!name || !email || !password) {
                setError('Identity fields must be complete.');
                return;
            }
            setError('');
            setStep(2);
        }
    };

    const prevStep = () => {
        setError('');
        setStep(1);
    };

    return (
        <Box className="flex-1 min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
            {/* Ambient Background Elements */}
            <Box className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
            <Box className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />

            <VStack space="xl" className="max-w-md w-full z-10 p-4">
                {/* Branding Section */}
                <VStack space="md" className="items-center mb-2">
                    <Box className="w-20 h-20 bg-primary rounded-[2rem] items-center justify-center shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] rotate-3 border-4 border-white/5">
                        <Heading size="3xl" className="text-primary-foreground font-black italic tracking-tighter">Lx</Heading>
                    </Box>
                    <VStack className="items-center" space="xs">
                        <Heading className="text-foreground font-black tracking-tighter text-4xl leading-none">Register</Heading>
                        <HStack space="xs" className="items-center bg-secondary/80 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                            <ShieldCheckIcon size={12} color="hsl(var(--primary))" />
                            <Text className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{step === 1 ? 'Identity Protocol' : 'Logistics Coordinates'}</Text>
                        </HStack>
                    </VStack>
                </VStack>

                {/* Progress Bar */}
                <HStack space="xs" className="px-8 mb-2">
                    <Box className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]' : 'bg-muted'}`} />
                    <Box className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]' : 'bg-muted'}`} />
                </HStack>

                {/* Registration Card */}
                <Box className="bg-card/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative min-h-[450px]">
                    <VStack space="lg">
                        {step === 1 && (
                            <VStack space="lg" className="animate-in slide-in-from-right duration-500 fade-in zoom-in-95">
                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Legal Name</Text>
                                    <Box className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <UserIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <input
                                            type="text"
                                            placeholder="Your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-2xl bg-input border-transparent h-14 pl-12 pr-4 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Email Identifier</Text>
                                    <Box className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <MailIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoCapitalize="none"
                                            className="w-full rounded-2xl bg-input border-transparent h-14 pl-12 pr-4 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </Box>
                                </Box>

                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Access Key</Text>
                                    <Box className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <LockIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <input
                                            type="password"
                                            placeholder="••••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full rounded-2xl bg-input border-transparent h-14 pl-12 pr-4 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </Box>
                                    {error && step === 1 && (
                                        <Text className="text-destructive mt-4 text-center font-bold text-[10px] uppercase tracking-widest bg-destructive/10 py-2 rounded-lg">{error}</Text>
                                    )}
                                </Box>

                                <button
                                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.4)] border-0 h-16 mt-4 transition-all active:scale-[0.98] group overflow-hidden relative flex items-center justify-center"
                                    onClick={nextStep}
                                >
                                    <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <HStack space="md" className="items-center relative z-10 justify-center w-full">
                                        <Text className="font-black text-primary-foreground text-lg uppercase tracking-[0.2em]">Next Step</Text>
                                        <ArrowRightIcon size={18} color="hsl(var(--primary-foreground))" className="group-hover:translate-x-1 transition-transform" />
                                    </HStack>
                                </button>
                            </VStack>
                        )}

                        {step === 2 && (
                            <VStack space="lg" className="animate-in slide-in-from-right duration-500 fade-in zoom-in-95">
                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Street Terminal</Text>
                                    <Box className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <HomeIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <input
                                            type="text"
                                            placeholder="123 Street Name"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full rounded-2xl bg-input border-transparent h-14 pl-12 pr-4 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </Box>
                                </Box>

                                <Box className="grid grid-cols-2 gap-4">
                                    <Box>
                                        <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">City</Text>
                                        <input
                                            type="text"
                                            placeholder="Abuja"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full rounded-2xl bg-input border-transparent h-14 px-4 text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                                        />
                                    </Box>

                                    <Box>
                                        <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Admin LGA</Text>
                                        <Select onValueChange={setLga} selectedValue={lga}>
                                            <SelectTrigger variant="outline" size="xl" className="rounded-2xl bg-input border-transparent justify-between h-14 px-4 hover:bg-input/80 transition-all items-center">
                                                <SelectInput placeholder="Select Area" className="text-foreground font-bold placeholder:text-muted-foreground/50" />
                                                <SelectIcon className="mr-1 text-muted-foreground" as={ChevronDownIcon} />
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent className="bg-popover border-white/5 rounded-t-[2rem] border-t">
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator className="bg-muted-foreground/20 w-12 h-1.5" />
                                                    </SelectDragIndicatorWrapper>
                                                    {LGAs.map(item => (
                                                        <SelectItem label={item} value={item} key={item} className="text-foreground hover:bg-secondary font-bold py-3 uppercase tracking-wider text-xs" />
                                                    ))}
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    </Box>
                                </Box>

                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Sovereign State</Text>
                                    <Box className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <GlobeIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <input
                                            type="text"
                                            placeholder="Nigeria"
                                            value={country}
                                            readOnly
                                            className="w-full rounded-2xl bg-input border-transparent h-14 pl-12 pr-4 text-muted-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none opacity-70 cursor-not-allowed"
                                        />
                                    </Box>
                                    {error && step === 2 && (
                                        <Text className="text-destructive mt-4 text-center font-bold text-[10px] uppercase tracking-widest bg-destructive/10 py-2 rounded-lg">{error}</Text>
                                    )}
                                </Box>

                                <VStack space="md" className="mt-4">
                                    <button
                                        className="w-full rounded-2xl bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.4)] border-0 h-16 transition-all active:scale-[0.98] group overflow-hidden relative flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handleSignup}
                                        disabled={loading}
                                    >
                                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <HStack space="md" className="items-center relative z-10 justify-center w-full">
                                            {loading ? <Text className="text-primary-foreground font-black uppercase tracking-[0.2em] animate-pulse">Loading...</Text> : <Text className="font-black text-primary-foreground text-lg uppercase tracking-[0.2em]">Complete Registration</Text>}
                                        </HStack>
                                    </button>
                                    <button
                                        className="w-full rounded-2xl border-2 border-white/5 hover:bg-white/5 h-16 flex items-center justify-center transition-all bg-transparent"
                                        onClick={prevStep}
                                        disabled={loading}
                                    >
                                        <ArrowLeftIcon size={18} color="hsl(var(--muted-foreground))" className="mr-2" />
                                        <Text className="text-muted-foreground/80 font-black uppercase tracking-widest text-xs">Return</Text>
                                    </button>
                                </VStack>
                            </VStack>
                        )}
                    </VStack>
                </Box>

                {/* Footer Actions */}
                <VStack space="lg" className="items-center mb-8">
                    <HStack space="xs" className="items-center bg-secondary/50 px-6 py-3 rounded-full backdrop-blur-sm border border-white/5">
                        <Text className="text-muted-foreground font-medium text-sm">Already a verified user?</Text>
                        <Link href="/login">
                            <Text className="text-primary font-black text-sm uppercase tracking-widest hover:text-primary/80 transition-colors">Access Portal</Text>
                        </Link>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    );
}
