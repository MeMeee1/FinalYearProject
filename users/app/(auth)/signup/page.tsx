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
            <Box className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
            <Box className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <VStack space="xl" className="max-w-md w-full z-10">
                {/* Branding Section */}
                <VStack space="md" className="items-center mb-2">
                    <Box className="w-16 h-16 bg-primary rounded-2xl items-center justify-center shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] rotate-3">
                        <Heading size="2xl" className="text-black font-black italic">Lx</Heading>
                    </Box>
                    <VStack className="items-center" space="xs">
                        <Heading className="text-foreground font-black tracking-tighter text-3xl leading-none">Register</Heading>
                        <HStack space="xs" className="items-center bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
                            <ShieldCheckIcon size={10} color="hsl(var(--primary))" />
                            <Text className="text-muted-foreground text-[8px] font-black uppercase tracking-widest">Step {step}: {step === 1 ? 'Identity' : 'Logistics'}</Text>
                        </HStack>
                    </VStack>
                </VStack>

                {/* Progress Bar */}
                <HStack space="xs" className="px-10">
                    <Box className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-secondary/40'}`} />
                    <Box className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-secondary/40'}`} />
                </HStack>

                {/* Registration Card */}
                <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden relative">
                    <VStack space="lg">
                        {step === 1 && (
                            <VStack space="lg" className="animate-in slide-in-from-right duration-500">
                                <FormControl>
                                    <FormControlLabel className="mb-1.5 ml-1">
                                        <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Legal Name</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4">
                                        <InputSlot className="mr-3">
                                            <UserIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </InputSlot>
                                        <InputField placeholder="Your full name" value={name} onChangeText={setName} className="text-foreground font-bold" />
                                    </Input>
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-1.5 ml-1">
                                        <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Email Identifier</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4">
                                        <InputSlot className="mr-3">
                                            <MailIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </InputSlot>
                                        <InputField placeholder="hello@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} className="text-foreground font-bold" />
                                    </Input>
                                </FormControl>

                                <FormControl isInvalid={!!error && step === 1}>
                                    <FormControlLabel className="mb-1.5 ml-1">
                                        <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Access Key (Password)</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4">
                                        <InputSlot className="mr-3">
                                            <LockIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </InputSlot>
                                        <InputField placeholder="••••••••" type="password" value={password} onChangeText={setPassword} className="text-foreground font-bold" />
                                    </Input>
                                    <FormControlError>
                                        <FormControlErrorText className="text-red-500 mt-4 text-center font-bold text-[10px] uppercase tracking-widest">{error}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                <Button
                                    size="xl"
                                    className="rounded-2xl bg-primary hover:scale-[1.02] shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] border-0 h-16 mt-4 transition-all active:scale-[0.98] group overflow-hidden relative"
                                    onPress={nextStep}
                                >
                                    <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <HStack space="md" className="items-center relative z-10">
                                        <ButtonText className="font-black text-black text-lg uppercase tracking-[0.2em]">Next</ButtonText>
                                        <ArrowRightIcon size={18} color="black" />
                                    </HStack>
                                </Button>
                            </VStack>
                        )}

                        {step === 2 && (
                            <VStack space="lg" className="animate-in slide-in-from-right duration-500">
                                <FormControl>
                                    <FormControlLabel className="mb-1.5 ml-1">
                                        <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Street Terminal</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4">
                                        <InputSlot className="mr-3">
                                            <HomeIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </InputSlot>
                                        <InputField placeholder="123 Street Name" value={address} onChangeText={setAddress} className="text-foreground font-bold" />
                                    </Input>
                                </FormControl>

                                <Box className="grid grid-cols-2 gap-4">
                                    <FormControl>
                                        <FormControlLabel className="mb-1.5 ml-1">
                                            <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">City</FormControlLabelText>
                                        </FormControlLabel>
                                        <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4">
                                            <InputField placeholder="Abuja" value={city} onChangeText={setCity} className="text-foreground font-bold" />
                                        </Input>
                                    </FormControl>

                                    <FormControl>
                                        <FormControlLabel className="mb-1.5 ml-1">
                                            <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Admin LGA</FormControlLabelText>
                                        </FormControlLabel>
                                        <Select onValueChange={setLga} selectedValue={lga}>
                                            <SelectTrigger variant="outline" size="xl" className="rounded-2xl bg-secondary/20 border-border/30 justify-between h-14 px-4">
                                                <SelectInput placeholder="LGA" className="text-foreground font-bold" />
                                                <SelectIcon className="mr-1 text-muted-foreground" as={ChevronDownIcon} />
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent className="bg-popover border-border rounded-t-[2rem]">
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator className="bg-muted-foreground/30" />
                                                    </SelectDragIndicatorWrapper>
                                                    {LGAs.map(item => (
                                                        <SelectItem label={item} value={item} key={item} className="text-popover-foreground hover:bg-accent font-bold" />
                                                    ))}
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <FormControl isInvalid={!!error && step === 2}>
                                    <FormControlLabel className="mb-1.5 ml-1">
                                        <FormControlLabelText className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Sovereign State</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="xl" className="rounded-2xl bg-secondary/20 border-border/30 h-14 px-4" isReadOnly={true}>
                                        <InputSlot className="mr-3">
                                            <GlobeIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </InputSlot>
                                        <InputField placeholder="Nigeria" value={country} onChangeText={setCountry} className="text-muted-foreground font-bold" />
                                    </Input>
                                    <FormControlError>
                                        <FormControlErrorText className="text-red-500 mt-4 text-center font-bold text-[10px] uppercase tracking-widest">{error}</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>

                                <VStack space="md" className="mt-4">
                                    <Button size="xl" className="rounded-2xl bg-primary hover:scale-[1.02] shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] border-0 h-16 transition-all active:scale-[0.98] group overflow-hidden relative" onPress={handleSignup} disabled={loading}>
                                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <HStack space="md" className="items-center relative z-10">
                                            {loading ? <ButtonSpinner color="black" /> : <ButtonText className="font-black text-black text-lg uppercase tracking-[0.2em]">Submit</ButtonText>}
                                        </HStack>
                                    </Button>
                                    <Button variant="outline" size="xl" className="rounded-2xl border-border/40 hover:bg-secondary/20 h-16" onPress={prevStep} disabled={loading}>
                                        <ArrowLeftIcon size={18} color="hsl(var(--muted-foreground))" className="mr-2" />
                                        <ButtonText className="text-muted-foreground font-black uppercase tracking-widest text-xs">Back</ButtonText>
                                    </Button>
                                </VStack>
                            </VStack>
                        )}
                    </VStack>
                </Box>

                {/* Footer Actions */}
                <VStack space="lg" className="items-center mb-8">
                    <HStack space="xs" className="items-center">
                        <Text className="text-muted-foreground font-medium text-sm">Already a verified user?</Text>
                        <Link href="/login">
                            <Text className="text-foreground font-black text-sm uppercase tracking-widest hover:text-primary transition-colors">Login</Text>
                        </Link>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    );
}
