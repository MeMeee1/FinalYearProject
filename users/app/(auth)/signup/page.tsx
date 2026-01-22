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
        <Box className="flex-1 min-h-screen bg-white p-6 justify-center">
            <VStack space="xl" className="max-w-md mx-auto w-full">
                <VStack space="xs">
                    <Heading size="3xl" className="font-bold text-primary-600">
                        {step === 1 ? 'Create Account' : 'Location Details'}
                    </Heading>
                    <Text className="text-gray-500">
                        {step === 1 ? 'Join us and start shopping' : 'Tell us where to deliver'}
                    </Text>
                </VStack>

                {/* Progress Indicator */}
                <HStack space="xs" className="mb-2">
                    <Box className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                    <Box className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </HStack>

                <VStack space="md">
                    {step === 1 && (
                        <>
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText>Full Name</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={UserIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="John Doe" value={name} onChangeText={setName} />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText>Email</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={MailIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="hello@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} />
                                </Input>
                            </FormControl>

                            <FormControl isInvalid={!!error && step === 1}>
                                <FormControlLabel>
                                    <FormControlLabelText>Password</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={LockIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="••••••••" type="password" value={password} onChangeText={setPassword} />
                                </Input>
                                <FormControlError>
                                    <FormControlErrorText>{error}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText>Address</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={HomeIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="123 Street Name" value={address} onChangeText={setAddress} />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText>City</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={MapPinIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="Abuja" value={city} onChangeText={setCity} />
                                </Input>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel>
                                    <FormControlLabelText>LGA</FormControlLabelText>
                                </FormControlLabel>
                                <Select onValueChange={setLga} selectedValue={lga}>
                                    <SelectTrigger variant="outline" size="lg" className="rounded-xl justify-between">
                                        <SelectInput placeholder="Select LGA" />
                                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator />
                                            </SelectDragIndicatorWrapper>
                                            {LGAs.map(item => (
                                                <SelectItem label={item} value={item} key={item} />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>

                            <FormControl isInvalid={!!error && step === 2}>
                                <FormControlLabel>
                                    <FormControlLabelText>Country</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl">
                                    <InputSlot className="pl-3">
                                        <InputIcon as={GlobeIcon} className="text-gray-400" />
                                    </InputSlot>
                                    <InputField placeholder="Nigeria" value={country} onChangeText={setCountry} />
                                </Input>
                                <FormControlError>
                                    <FormControlErrorText>{error}</FormControlErrorText>
                                </FormControlError>
                            </FormControl>
                        </>
                    )}

                    {step === 1 ? (
                        <Button size="lg" className="rounded-xl bg-primary-600 shadow-md mt-4" onPress={nextStep}>
                            <ButtonText className="font-bold">Next Step</ButtonText>
                            <ButtonIcon as={ChevronRightIcon} className="ml-2 text-white" />
                        </Button>
                    ) : (
                        <VStack space="md">
                            <Button size="lg" className="rounded-xl bg-primary-600 shadow-md mt-4" onPress={handleSignup} disabled={loading}>
                                {loading ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold">Create Account</ButtonText>}
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-xl border-gray-300" onPress={prevStep} disabled={loading}>
                                <ButtonIcon as={ChevronLeftIcon} className="mr-2 text-gray-500" />
                                <ButtonText className="text-gray-500 font-bold">Back</ButtonText>
                            </Button>
                        </VStack>
                    )}

                </VStack>

                <HStack className="justify-center mt-4 mb-8">
                    <Text className="text-gray-500">Already have an account? </Text>
                    <Link href="/login">
                        <Text className="text-primary-600 font-bold">Sign In</Text>
                    </Link>
                </HStack>
            </VStack>
        </Box>
    );
}
