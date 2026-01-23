'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowLeftIcon, MapPinIcon, CheckCircle2Icon, PackageIcon, ClockIcon, ShieldCheckIcon } from 'lucide-react-native';
import { useRouter, useParams } from 'next/navigation';

export default function OrderDetails() {
    const router = useRouter();
    const params = useParams();

    // Mock data for specific order
    const order = {
        id: params.id,
        status: 'Ready for Pickup',
        pickupLocation: 'Ikeja City Mall Pickup Center, Shop L45',
        items: [
            { name: 'Local Rice', quantity: 2, price: 15000 },
            { name: 'Palm Oil', quantity: 1, price: 8000 }
        ],
        total: 38000,
        date: new Date().toISOString()
    };

    return (
        <Box className="flex-1 min-h-screen bg-background">
            {/* Immersive Header Section */}
            <Box className="bg-primary/90 pt-16 pb-32 px-6 rounded-b-[4rem] shadow-[0_32px_64px_rgba(var(--primary-rgb),0.2)]">
                <HStack className="items-center justify-between mb-8">
                    <Button
                        variant="solid"
                        className="rounded-2xl bg-black/10 border border-black/10 w-12 h-12 p-0 items-center justify-center hover:bg-black/20 transition-all active:scale-95"
                        onPress={() => router.back()}
                    >
                        <ArrowLeftIcon size={24} color="black" />
                    </Button>
                    <VStack className="items-end">
                        <Text className="text-black/60 text-[10px] font-black uppercase tracking-[0.2em]">Transaction Log</Text>
                        <Text className="text-black font-black text-xs">{new Date(order.date).toLocaleDateString()}</Text>
                    </VStack>
                </HStack>

                <VStack className="items-center" space="xs">
                    <Box className="bg-black/10 px-4 py-1.5 rounded-full border border-black/5 mb-2">
                        <Text className="text-black font-black text-[10px] uppercase tracking-[0.3em]">#{order.id.toString().padStart(6, '0')}</Text>
                    </Box>
                    <Heading size="3xl" className="text-black font-black tracking-tighter text-center leading-none">Manifest Authorized</Heading>
                    <HStack space="xs" className="items-center bg-white/20 px-4 py-2 rounded-2xl mt-4">
                        <CheckCircle2Icon size={16} color="black" />
                        <Text className="text-black font-bold uppercase tracking-widest text-[10px]">{order.status}</Text>
                    </HStack>
                </VStack>
            </Box>

            <Box className="px-6 -mt-16 max-w-4xl mx-auto">
                <VStack space="xl">
                    {/* Pickup Node Card */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-2xl">
                        <HStack space="md" className="items-start">
                            <Box className="w-14 h-14 bg-primary/20 rounded-[1.25rem] items-center justify-center border border-primary/20">
                                <MapPinIcon size={24} color="hsl(var(--primary))" />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Retrieval Node</Text>
                                <Heading size="md" className="text-foreground font-black tracking-tight mb-2">{order.pickupLocation}</Heading>
                                <Box className="bg-secondary/20 p-4 rounded-2xl border border-border/30">
                                    <HStack space="sm" className="items-center">
                                        <ShieldCheckIcon size={14} color="hsl(var(--muted-foreground))" />
                                        <Text className="text-muted-foreground text-[10px] font-bold leading-relaxed uppercase tracking-wider">Present Transaction ID & Valid Identification for clearance.</Text>
                                    </HStack>
                                </Box>
                            </VStack>
                        </HStack>
                    </Box>

                    {/* Itemization Detail */}
                    <Box className="bg-card/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-border/50 shadow-xl overflow-hidden">
                        <HStack className="items-center justify-between mb-8">
                            <Heading size="md" className="text-foreground font-black tracking-tight">Manifest Itemization</Heading>
                            <Box className="bg-secondary/40 px-3 py-1 rounded-full border border-border/40">
                                <Text className="text-foreground/70 font-black text-[8px] uppercase tracking-widest">{order.items.length} Units</Text>
                            </Box>
                        </HStack>

                        <VStack space="lg">
                            {order.items.map((item, index) => (
                                <HStack key={index} className="justify-between items-center group">
                                    <HStack space="md" className="items-center">
                                        <Box className="bg-secondary/40 w-10 h-10 rounded-xl items-center justify-center border border-border/30 group-hover:bg-primary/10 transition-colors">
                                            <PackageIcon size={18} color="hsl(var(--muted-foreground))" />
                                        </Box>
                                        <VStack>
                                            <Text className="text-foreground font-black tracking-tight">{item.name}</Text>
                                            <Text className="text-muted-foreground text-[10px] font-bold uppercase">Quantity: {item.quantity}</Text>
                                        </VStack>
                                    </HStack>
                                    <Text className="text-foreground font-black">₦{(item.price * item.quantity).toLocaleString()}</Text>
                                </HStack>
                            ))}

                            <Box className="h-[1px] bg-border/20 my-4" />

                            <VStack space="sm">
                                <HStack className="justify-between items-center">
                                    <Text className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Base Valuation</Text>
                                    <Text className="text-foreground font-bold">₦{(order.total - 2000).toLocaleString()}</Text>
                                </HStack>
                                <HStack className="justify-between items-center">
                                    <Text className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Network Fee</Text>
                                    <Text className="text-foreground font-bold">₦2,000</Text>
                                </HStack>
                                <HStack className="justify-between items-end mt-4 pt-4 border-t border-border/20">
                                    <VStack>
                                        <Text className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.3em] mb-1">Total Authorized</Text>
                                        <Heading size="xl" className="text-primary font-black tracking-tighter leading-none">₦{order.total.toLocaleString()}</Heading>
                                    </VStack>
                                    <Box className="bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30">
                                        <Text className="text-primary font-black text-[10px] uppercase tracking-widest">Settled</Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Operational Support */}
                    <HStack space="md" className="justify-center pb-12">
                        <Button variant="link" size="sm" className="opacity-60 hover:opacity-100">
                            <ClockIcon size={14} color="hsl(var(--muted-foreground))" className="mr-2" />
                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Request Support</Text>
                        </Button>
                        <Box className="w-1 h-1 bg-border/40 rounded-full self-center" />
                        <Button variant="link" size="sm" className="opacity-60 hover:opacity-100">
                            <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Export Receipt</Text>
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
}
