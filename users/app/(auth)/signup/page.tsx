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
import { MailIcon, LockIcon, UserIcon, MapPinIcon, GlobeIcon, HomeIcon, ChevronRightIcon, ChevronLeftIcon, ChevronDownIcon } from 'lucide-react-native';
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

    // Step 1: Personal Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Location Info
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
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!name || !email || !password) {
                setError('Please fill in all fields');
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
        <Box className="flex-1 min-h-screen bg-[#121212] p-6 justify-center">
            <VStack space="xl" className="max-w-md mx-auto w-full">
                <VStack space="xs" className="mb-4">
                    <Heading size="3xl" className="font-extrabold text-[#1DB954]">
                        {step === 1 ? 'Create Account' : 'Location Details'}
                    </Heading>
                    <Text className="text-gray-400">
                        {step === 1 ? 'Join us and start shopping' : 'Tell us where to deliver'}
                    </Text>
                </VStack>

                {/* Progress Indicator */}
                <HStack space="xs" className="mb-6">
                    <Box className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-[#1DB954]' : 'bg-[#282828]'}`} />
                    <Box className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-[#1DB954]' : 'bg-[#282828]'}`} />
                </HStack>

                <VStack space="lg">
                    {step === 1 && (
                        <>
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Full Name</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={UserIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="John Doe" value={name} onChangeText={setName} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Email</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={MailIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="hello@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl isInvalid={!!error && step === 1}>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Password</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={LockIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="••••••••" type="password" value={password} onChangeText={setPassword} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                                <FormControlError>
                                    <FormControlErrorText className="text-red-500 mt-2 text-center">{error}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Address</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={HomeIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="123 Street Name" value={address} onChangeText={setAddress} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">City</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={MapPinIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="Abuja" value={city} onChangeText={setCity} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">LGA</FormControlLabelText>
                                </FormControlLabel>
                                <Select onValueChange={setLga} selectedValue={lga}>
                                    <SelectTrigger variant="outline" size="xl" className="rounded-full bg-[#282828] border-0 justify-between h-14">
                                        <SelectInput placeholder="Select LGA" className="text-white placeholder:text-gray-600 font-medium" />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent className="bg-[#282828] border-gray-700">
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator className="bg-gray-500" />
                                            </SelectDragIndicatorWrapper>
                                            {LGAs.map(item => (
                                                <SelectItem label={item} value={item} key={item} className="text-white hover:bg-[#3E3E3E]" />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>

                            <FormControl isInvalid={!!error && step === 2}>
                                <FormControlLabel>
                                    <FormControlLabelText className="text-gray-400 text-xs uppercase font-bold tracking-wider">Country</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="xl" className="rounded-full bg-[#282828] border-0 h-14">
                                    <InputSlot className="pl-4">
                                        <InputIcon as={GlobeIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="Nigeria" value={country} onChangeText={setCountry} className="text-white placeholder:text-gray-600 font-medium" />
                                </Input>
                                <FormControlError>
                                    <FormControlErrorText className="text-red-500 mt-2 text-center">{error}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        </>
                    )}

                    {step === 1 ? (
                        <Button size="xl" className="rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg mt-6 h-14 border-0" onPress={nextStep}>
                            <ButtonText className="font-bold text-black text-lg">Next Step</ButtonText>
                            <ButtonIcon as={ChevronRightIcon} className="ml-2 text-black" />
                        </Button>
                    ) : (
                        <VStack space="md">
                            <Button size="xl" className="rounded-full bg-[#1DB954] hover:bg-[#1ed760] shadow-lg mt-4 h-14 border-0" onPress={handleSignup} disabled={loading}>
                                {loading ? <ButtonSpinner color="black" /> : <ButtonText className="font-bold text-black text-lg">Create Account</ButtonText>}
                            </Button>
                            <Button variant="outline" size="xl" className="rounded-full border-gray-600 hover:bg-[#282828] h-14" onPress={prevStep} disabled={loading}>
                                <ButtonIcon as={ChevronLeftIcon} className="mr-2 text-gray-400" />
                                <ButtonText className="text-gray-400 font-bold">Back</ButtonText>
                            </Button>
                        </VStack>
                    )}

                </VStack>

                <HStack className="justify-center mt-8 mb-8">
                    <Text className="text-gray-400">Already have an account? </Text>
                    <Link href="/login">
                        <Text className="text-white font-bold hover:underline">Sign In</Text>
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
}
