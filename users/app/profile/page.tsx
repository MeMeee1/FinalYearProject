'use client';

import { useState, useEffect, useRef } from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';


import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { ArrowLeftIcon, ChevronDownIcon, LogOutIcon, CameraIcon, UserIcon, MapPinIcon, ShieldCheckIcon, CalendarIcon } from 'lucide-react-native';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile, logout, uploadImage, getLgas } from '@/lib/api';
import { ActivityIndicator } from 'react-native';

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
    const [lgas, setLgas] = useState<string[]>([]);

    useEffect(() => {
        // Fetch LGAs from the backend
        getLgas()
            .then(setLgas)
            .catch((err) => console.error('Failed to fetch LGAs:', err));

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
        return <Box className="flex-1 justify-center items-center bg-background"><Text className="text-primary font-black uppercase tracking-widest">Loading Profile...</Text></Box>;
    }

    if (!user) {
        return null;
    }

    return (
        <Box className="flex-1 min-h-screen bg-background/30 pb-24 sm:pb-32">
            {/* Premium Immersive Header */}
            <Box className="bg-primary/50 pt-10 pb-20 px-4 sm:pt-12 sm:pb-24 sm:px-6 md:pt-16 md:pb-32 md:px-8 rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] shadow-[0_32px_64px_rgba(var(--primary-rgb),0.2)]">
                <HStack className="items-center justify-between mb-6 sm:mb-8">
                    <button
                        className="rounded-2xl bg-black/10 border border-black/10 w-12 h-12 p-0 items-center justify-center hover:bg-black/20 transition-all active:scale-95 flex"
                        onClick={() => router.back()}
                    >
                        <ArrowLeftIcon size={24} color="white" />
                    </button>
                    <button
                        className="rounded-2xl bg-black/10 border border-black/10 w-12 h-12 p-0 items-center justify-center hover:bg-red-500/20 transition-all active:scale-95 group flex"
                        onClick={handleLogout}
                    >
                        <LogOutIcon size={18} color="white" className="group-hover:text-red-600 transition-colors" />
                    </button>
                </HStack>

                <VStack className="items-center" space="md">
                    <Box className="relative">
                        <Box className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] items-center justify-center border-4 border-black/5 overflow-hidden shadow-2xl">
                            {image ? (
                                <img
                                    src={
                                        image.startsWith('http')
                                            ? image
                                            : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')}${image.startsWith('/') ? '' : '/'}${image}`
                                    }
                                    className="w-full h-full object-cover"
                                    alt="Profile Image"
                                />
                            ) : (
                                <Text className="text-5xl text-black font-black">{name.charAt(0) || 'U'}</Text>
                            )}
                        </Box>
                        <button
                            className="absolute -bottom-2 -right-2 bg-black rounded-2xl p-2 w-10 h-10 items-center justify-center border-2 border-primary shadow-xl hover:scale-110 transition-transform active:scale-90 flex"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <CameraIcon size={18} color="hsl(var(--primary))" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </Box>
                    <VStack className="items-center" space="xs">
                        <Heading className="text-xl sm:text-2xl text-black font-black tracking-tighter leading-none text-center">{user?.name || 'Authorized User'}</Heading>
                        <Box className="bg-black/10 px-3 py-1 rounded-full border border-black/5">
                            <Text className="text-black font-bold text-[10px] uppercase tracking-widest">{user?.email}</Text>
                        </Box>
                    </VStack>
                </VStack>
            </Box>

            <Box className="px-4 sm:px-6 -mt-10 sm:-mt-12 md:-mt-16 max-w-4xl mx-auto">
                <VStack space="lg" className="sm:space-y-6">
                    {/* Identity Data Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-2xl">
                        <HStack space="sm" className="items-center mb-8">
                            <Box className="w-8 h-8 bg-primary/20 rounded-xl items-center justify-center">
                                <UserIcon size={16} color="hsl(var(--primary))" />
                            </Box>
                            <Heading className="text-foreground font-black tracking-tight text-xl">Identity Payload</Heading>
                        </HStack>

                        <VStack space="lg">
                            <Box>
                                <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Legal Name</Text>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter name"
                                    className="w-full rounded-2xl bg-secondary/20 border border-border/30 h-16 px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </Box>

                            <Box>
                                <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Primary Coordinates (Address)</Text>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                    className="w-full rounded-2xl bg-secondary/20 border border-border/30 h-16 px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </Box>

                            <Box className="grid grid-cols-2 gap-4">
                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">City</Text>
                                    <input
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="City"
                                        className="w-full rounded-2xl bg-secondary/20 border border-border/30 h-16 px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </Box>

                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Admin LGA</Text>
                                    <Select onValueChange={setLga} selectedValue={lga}>
                                        <SelectTrigger variant="outline" size="xl" className="rounded-2xl bg-secondary/20 border-border/30 justify-between h-16 px-4">
                                            <SelectInput placeholder="Select LGA" className="text-foreground font-bold" />
                                            <SelectIcon className="mr-3 text-muted-foreground" as={ChevronDownIcon} />
                                        </SelectTrigger>
                                        <SelectPortal>
                                            <SelectBackdrop />
                                            <SelectContent className="bg-popover border-border rounded-t-[2rem]">
                                                <SelectDragIndicatorWrapper>
                                                    <SelectDragIndicator className="bg-muted-foreground/30" />
                                                </SelectDragIndicatorWrapper>
                                                {lgas.map(item => (
                                                    <SelectItem label={item} value={item} key={item} className="text-popover-foreground hover:bg-accent font-bold" />
                                                ))}
                                            </SelectContent>
                                        </SelectPortal>
                                    </Select>
                                </Box>
                            </Box>

                            <Box className="grid grid-cols-2 gap-4">
                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Sovereign State</Text>
                                    <input
                                        value={country}
                                        readOnly
                                        placeholder="Nigeria"
                                        className="w-full rounded-2xl bg-secondary/10 border border-border/20 h-16 px-4 text-muted-foreground font-bold focus:outline-none cursor-not-allowed"
                                    />
                                </Box>

                                <Box>
                                    <Text className="mb-2 ml-1 text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em]">Origin (DOB)</Text>
                                    <input
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        placeholder="YYYY-MM-DD"
                                        className="w-full rounded-2xl bg-secondary/20 border border-border/30 h-16 px-4 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    />
                                </Box>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Operational Guard Card */}
                    {/* <Box className="bg-secondary/10 border border-border/30 p-8 rounded-[2rem] flex-row items-center space-x-4">
                        <Box className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center">
                            <ShieldCheckIcon size={24} color="rgb(59 130 246)" />
                        </Box>
                        {/* <VStack className="flex-1">
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">Trust Protocol</Text>
                            <Text className="text-muted-foreground text-xs font-medium">Data is secured</Text>
                        </VStack> *
                    </Box> */}

                    {error ? (
                        <Box className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                            <Text className="text-red-500 text-center font-bold text-xs uppercase tracking-widest">{error}</Text>
                        </Box>
                    ) : null}

                    <Box className="mt-4 pb-12">
                        <button
                            className="rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(29,185,84,0.3)] border-0 h-20 transition-all active:scale-[0.98] group overflow-hidden relative w-full flex items-center justify-center"
                            onClick={handleUpdate}
                            disabled={saving}
                        >
                            <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <HStack space="md" className="items-center relative z-10">
                                {saving ? (
                                    <Text className="text-black font-black text-lg uppercase tracking-[0.2em]">Saving...</Text>
                                ) : (
                                    <>
                                        <Box className="bg-black/10 p-2 rounded-xl">
                                            <ShieldCheckIcon size={20} color="white" />
                                        </Box>
                                        <Text className="font-black text-white text-lg uppercase tracking-[0.2em]">Synchronize Profile</Text>
                                    </>
                                )}
                            </HStack>
                        </button>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}
