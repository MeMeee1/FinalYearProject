
'use client';

import { useState, useEffect, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { ArrowLeftIcon, ChevronDownIcon, LogOutIcon, CameraIcon, MapPinIcon, HomeIcon, GlobeIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile, logout, uploadImage } from '@/lib/api';
import { Image } from '@/components/ui/image';

const LGAs = [
    'Abaji',
    'Abuja Municipal',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Kwali'
];

export default function Profile() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [lga, setLga] = useState('');
    const [country, setCountry] = useState('');
    const [dob, setDob] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getUserProfile()
            .then((data) => {
                setUser(data);
                setName(data.name || '');
                setAddress(data.address || '');
                setCity(data.city || 'Abuja');
                setLga(data.lga || '');
                setCountry(data.country || 'Nigeria');
                setDob(data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '');
                setImage(data.image || '');
            })
            .catch((err) => {
                console.error(err);
                router.push('/login');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Optimistic update or show loading state if needed
            const url = await uploadImage(file);
            setImage(url);
        } catch (err: any) {
            setError('Failed to upload image: ' + err.message);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        setError('');
        try {
            await updateUserProfile({
                name,
                address,
                city,
                lga,
                country,
                dateOfBirth: dob,
                image
            });
            alert('Profile updated successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (loading) {
        return <Box className="flex-1 justify-center items-center"><ButtonSpinner color="black" /></Box>;
    }

    if (!user) {
        return null;
    }

    return (
        <Box className="flex-1 min-h-screen bg-white">
            <Box className="bg-primary-600 p-6 pb-20 rounded-b-[30px] shadow-md">
                <HStack className="items-center justify-between">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-white" />
                    </Button>
                    <Heading size="xl" className="text-white font-bold">My Profile</Heading>
                    <Box className="w-6" />
                </HStack>
                <Box className="items-center mt-6">
                    <Box className="relative">
                        <Box className="w-24 h-24 bg-white/20 rounded-full items-center justify-center border-4 border-white overflow-hidden">
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    className="w-full h-full object-cover"
                                    alt="Profile Image"
                                />
                            ) : (
                                <Text className="text-4xl text-white font-bold">{name.charAt(0) || 'U'}</Text>
                            )}
                        </Box>
                        <Button
                            className="absolute bottom-0 right-0 bg-white rounded-full p-2 w-8 h-8 items-center justify-center border border-gray-200"
                            onPress={() => fileInputRef.current?.click()}
                        >
                            <ButtonIcon as={CameraIcon} className="text-primary-600 w-4 h-4" />
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Box>
                    <Text className="text-white mt-3 font-medium text-lg">{user?.email}</Text>
                </Box>
            </Box>

            <Box className="p-6 -mt-10 flex-1">
                <Box className="bg-white rounded-xl shadow-lg p-6 flex-1">
                    <VStack space="xl">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Full Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-gray-50 border-gray-200">
                                <InputField value={name} onChangeText={setName} placeholder="Enter your name" />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Address</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-gray-50 border-gray-200">
                                <InputField value={address} onChangeText={setAddress} placeholder="Enter your address" />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>City</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-gray-50 border-gray-200">
                                <InputField value={city} onChangeText={setCity} placeholder="Enter your city" />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>LGA</FormControlLabelText>
                            </FormControlLabel>
                            <Select onValueChange={setLga} selectedValue={lga}>
                                <SelectTrigger variant="outline" size="lg" className="rounded-xl bg-gray-50 border-gray-200 justify-between">
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

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Country</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-gray-100 border-gray-200" isReadOnly={true}>
                                <InputField value={country} placeholder="Nigeria" className="text-gray-500" />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText>Date of Birth</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-gray-50 border-gray-200">
                                {/* Using text input for simplicity, expecting YYYY-MM-DD */}
                                <InputField value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" type="text" />
                            </Input>
                        </FormControl>

                        {error ? <Text className="text-red-500">{error}</Text> : null}

                        <Button size="lg" className="rounded-xl bg-primary-600 shadow-md mt-4" onPress={handleUpdate} disabled={saving}>
                            {saving ? <ButtonSpinner color="white" /> : <ButtonText className="font-bold">Update Profile</ButtonText>}
                        </Button>

                        <Button variant="outline" size="lg" className="rounded-xl border-red-500 mt-2" onPress={handleLogout}>
                            <ButtonText className="text-red-500 font-bold">Log Out</ButtonText>
                            <ButtonIcon as={LogOutIcon} className="ml-2 text-red-500" />
                        </Button>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}
