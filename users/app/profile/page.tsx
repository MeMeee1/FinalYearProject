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
        return <Box className="flex-1 justify-center items-center bg-background"><ButtonSpinner color="hsl(var(--primary))" /></Box>;
    }

    if (!user) {
        return null;
    }

    return (
        <Box className="flex-1 min-h-screen bg-background">
            {/* Header Section */}
            <Box className="bg-background border-b border-border p-6 pb-12">
                <HStack className="items-center justify-between mb-6">
                    <Button
                        variant="link"
                        className="p-0"
                        onPress={() => router.back()}
                    >
                        <ButtonIcon as={ArrowLeftIcon} className="text-foreground" />
                    </Button>
                    <Heading size="xl" className="text-foreground font-bold">My Profile</Heading>
                    <Box className="w-6" />
                </HStack>
                <Box className="items-center mt-2">
                    <Box className="relative">
                        <Box className="w-28 h-28 bg-secondary rounded-full items-center justify-center border-4 border-primary overflow-hidden shadow-lg shadow-primary/20">
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    className="w-full h-full object-cover"
                                    alt="Profile Image"
                                />
                            ) : (
                                <Text className="text-4xl text-primary font-bold">{name.charAt(0) || 'U'}</Text>
                            )}
                        </Box>
                        <Button
                            className="absolute bottom-0 right-0 bg-primary rounded-full p-2 w-9 h-9 items-center justify-center border border-background shadow-md"
                            onPress={() => fileInputRef.current?.click()}
                        >
                            <ButtonIcon as={CameraIcon} className="text-primary-foreground w-5 h-5" />
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Box>
                    <Text className="text-foreground mt-4 font-bold text-xl">{user?.name || 'User'}</Text>
                    <Text className="text-muted-foreground text-sm">{user?.email}</Text>
                </Box>
            </Box>

            <Box className="p-6 flex-1 bg-background">
                <Box className="flex-1">
                    <VStack space="xl">
                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Full Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-secondary border-0 h-12">
                                <InputField value={name} onChangeText={setName} placeholder="Enter your name" className="text-foreground placeholder:text-muted-foreground font-medium" />
                            </Input>
                        </FormControl>

                        <FormControl>
                            <FormControlLabel>
                                <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Address</FormControlLabelText>
                            </FormControlLabel>
                            <Input size="lg" className="rounded-xl bg-secondary border-0 h-12">
                                <InputField value={address} onChangeText={setAddress} placeholder="Enter your address" className="text-foreground placeholder:text-muted-foreground font-medium" />
                            </Input>
                        </FormControl>

                        <HStack space="md">
                            <FormControl className="flex-1">
                                <FormControlLabel>
                                    <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">City</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl bg-secondary border-0 h-12">
                                    <InputField value={city} onChangeText={setCity} placeholder="Enter your city" className="text-foreground placeholder:text-muted-foreground font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl className="flex-1">
                                <FormControlLabel>
                                    <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">LGA</FormControlLabelText>
                                </FormControlLabel>
                                <Select onValueChange={setLga} selectedValue={lga}>
                                    <SelectTrigger variant="outline" size="lg" className="rounded-xl bg-secondary border-0 justify-between h-12">
                                        <SelectInput placeholder="Select LGA" className="text-foreground placeholder:text-muted-foreground font-medium" />
                                        <SelectIcon className="mr-3 text-muted-foreground" as={ChevronDownIcon} />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent className="bg-popover border-border">
                                            <SelectDragIndicatorWrapper>
                                                <SelectDragIndicator className="bg-muted-foreground/30" />
                                            </SelectDragIndicatorWrapper>
                                            {LGAs.map(item => (
                                                <SelectItem label={item} value={item} key={item} className="text-popover-foreground hover:bg-accent" />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space="md">
                            <FormControl className="flex-1">
                                <FormControlLabel>
                                    <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Country</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl bg-muted/50 border-0 h-12" isReadOnly={true}>
                                    <InputField value={country} placeholder="Nigeria" className="text-muted-foreground font-medium" />
                                </Input>
                            </FormControl>

                            <FormControl className="flex-1">
                                <FormControlLabel>
                                    <FormControlLabelText className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Date of Birth</FormControlLabelText>
                                </FormControlLabel>
                                <Input size="lg" className="rounded-xl bg-secondary border-0 h-12">
                                    <InputField value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" type="text" className="text-foreground placeholder:text-muted-foreground font-medium" />
                                </Input>
                            </FormControl>
                        </HStack>

                        {error ? <Text className="text-destructive text-center">{error}</Text> : null}

                        <Box className="mt-4">
                            <Button size="xl" className="rounded-full bg-primary hover:bg-primary/90 h-14 border-0" onPress={handleUpdate} disabled={saving}>
                                {saving ? <ButtonSpinner color="hsl(var(--primary-foreground))" /> : <ButtonText className="font-bold text-primary-foreground text-lg">Save Changes</ButtonText>}
                            </Button>

                            <Button variant="link" size="lg" className="mt-4" onPress={handleLogout}>
                                <ButtonText className="text-muted-foreground hover:text-foreground font-medium">Log Out</ButtonText>
                            </Button>
                        </Box>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}
