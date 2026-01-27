'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    AlertTriangleIcon,
    CheckCircle2Icon,
    XCircleIcon,
    TruckIcon,
    CreditCardIcon,
    PackageIcon,
    HeartHandshakeIcon,
    ScaleIcon,
    MessageSquareWarningIcon,
    BadgeCheckIcon,
    ClockIcon
} from 'lucide-react-native';
import { useRouter } from 'next/navigation';

interface RuleCardProps {
    icon: React.ReactNode;
    title: string;
    items: string[];
    variant?: 'do' | 'dont' | 'info';
}

function RuleCard({ icon, title, items, variant = 'info' }: RuleCardProps) {
    const colors = {
        do: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-500', bullet: 'bg-green-500' },
        dont: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-500', bullet: 'bg-red-500' },
        info: { bg: 'bg-primary/10', border: 'border-primary/20', icon: 'text-primary', bullet: 'bg-primary' }
    };

    const style = colors[variant];

    return (
        <Box className={`${style.bg} border ${style.border} rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6`}>
            <HStack space="md" className="items-start mb-4">
                <Box className={`w-10 h-10 sm:w-12 sm:h-12 ${style.bg} rounded-xl sm:rounded-2xl items-center justify-center border ${style.border}`}>
                    {icon}
                </Box>
                <VStack className="flex-1">
                    <Heading className="text-foreground font-black text-base sm:text-lg tracking-tight">{title}</Heading>
                </VStack>
            </HStack>
            <VStack space="sm" className="ml-0 sm:ml-2">
                {items.map((item, index) => (
                    <HStack key={index} space="sm" className="items-start">
                        <Box className={`w-1.5 h-1.5 ${style.bullet} rounded-full mt-2 shrink-0`} />
                        <Text className="text-muted-foreground text-sm leading-relaxed flex-1">{item}</Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}

export default function RulesPage() {
    const router = useRouter();

    return (
        <Box className="flex-1 min-h-screen bg-background pb-24 sm:pb-32">
            {/* Premium Header */}
            <Box className="bg-primary/50 pt-10 pb-20 px-4 sm:pt-12 sm:pb-24 sm:px-6 md:pt-16 md:pb-32 md:px-8 rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] shadow-[0_32px_64px_rgba(var(--primary-rgb),0.2)]">
                <HStack className="items-center justify-between mb-6 sm:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-10 h-10 sm:w-12 sm:h-12 p-0 items-center justify-center hover:bg-white/20 transition-all active:scale-95 flex"
                    >
                        <ArrowLeftIcon size={20} color="white" />
                    </button>
                    <Box className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2">
                        <HStack space="sm" className="items-center">
                            <ShieldCheckIcon size={14} color="white" />
                            <Text className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Community Standards</Text>
                        </HStack>
                    </Box>
                </HStack>

                <VStack space="sm" className="items-center text-center">
                    <Box className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-[1.5rem] items-center justify-center border-2 border-white/30 shadow-xl mb-2">
                        <BookOpenIcon size={32} color="white" />
                    </Box>
                    <Text className="text-white/80 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Platform Guidelines</Text>
                    <Heading className="text-white font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter">Rules & Guidelines</Heading>
                    <Text className="text-white/70 text-sm max-w-md mt-2">
                        To ensure a safe and fair marketplace for everyone, please follow these community guidelines.
                    </Text>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box className="px-4 sm:px-6 md:px-8 -mt-10 sm:-mt-12 md:-mt-16 max-w-4xl mx-auto">
                <VStack space="lg" className="mt-4">

                    {/* Introduction Card */}
                    <Box className="bg-card border border-border/50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-xl">
                        <HStack space="md" className="items-center mb-4">
                            <BadgeCheckIcon size={24} color="hsl(var(--primary))" />
                            <VStack>
                                <Text className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Welcome to LiveX</Text>
                                <Heading className="text-foreground font-black text-lg tracking-tight">Our Commitment to You</Heading>
                            </VStack>
                        </HStack>
                        <Text className="text-muted-foreground text-sm leading-relaxed">
                            LiveX is Nigeria's premier livestock marketplace, connecting buyers with verified vendors through our secure escrow system.
                            We're committed to providing a safe, transparent, and efficient platform. These guidelines help maintain trust in our community.
                        </Text>
                    </Box>

                    {/* Do's Section */}
                    <VStack space="sm">
                        <HStack space="sm" className="items-center px-2">
                            <CheckCircle2Icon size={18} color="rgb(34 197 94)" />
                            <Text className="text-green-500 font-black text-xs uppercase tracking-[0.2em]">Best Practices</Text>
                        </HStack>

                        <RuleCard
                            icon={<CheckCircle2Icon size={20} color="rgb(34 197 94)" />}
                            title="Account & Profile"
                            variant="do"
                            items={[
                                "Use accurate personal information for your account",
                                "Keep your login credentials secure and private",
                                "Update your delivery address when needed",
                                "Enable notifications to stay updated on orders"
                            ]}
                        />

                        <RuleCard
                            icon={<PackageIcon size={20} color="rgb(34 197 94)" />}
                            title="Ordering Products"
                            variant="do"
                            items={[
                                "Review product details carefully before purchasing",
                                "Check vendor ratings and reviews",
                                "Select the correct fulfillment point for pickup",
                                "Save your pickup code securely - you'll need it for collection"
                            ]}
                        />

                        <RuleCard
                            icon={<TruckIcon size={20} color="rgb(34 197 94)" />}
                            title="Pickup & Collection"
                            variant="do"
                            items={[
                                "Collect your order within 48 hours of drop-off notification",
                                "Inspect products at the fulfillment center before confirming pickup",
                                "Report any quality issues immediately before leaving",
                                "Bring valid ID and your pickup code for verification"
                            ]}
                        />
                    </VStack>

                    {/* Don'ts Section */}
                    <VStack space="sm">
                        <HStack space="sm" className="items-center px-2">
                            <XCircleIcon size={18} color="rgb(239 68 68)" />
                            <Text className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">Prohibited Activities</Text>
                        </HStack>

                        <RuleCard
                            icon={<AlertTriangleIcon size={20} color="rgb(239 68 68)" />}
                            title="Account Violations"
                            variant="dont"
                            items={[
                                "Do not create multiple accounts to abuse promotions",
                                "Do not share your account with others",
                                "Do not use false information during registration",
                                "Do not attempt to manipulate the rating system"
                            ]}
                        />

                        <RuleCard
                            icon={<MessageSquareWarningIcon size={20} color="rgb(239 68 68)" />}
                            title="Platform Misuse"
                            variant="dont"
                            items={[
                                "Do not engage in fraudulent transactions",
                                "Do not contact vendors to transact outside the platform",
                                "Do not abuse the refund or dispute system",
                                "Do not harass vendors or fulfillment center staff"
                            ]}
                        />
                    </VStack>

                    {/* Important Information */}
                    <VStack space="sm">
                        <HStack space="sm" className="items-center px-2">
                            <ScaleIcon size={18} color="hsl(var(--primary))" />
                            <Text className="text-primary font-black text-xs uppercase tracking-[0.2em]">Important Information</Text>
                        </HStack>

                        <RuleCard
                            icon={<CreditCardIcon size={20} color="hsl(var(--primary))" />}
                            title="Escrow Payment System"
                            variant="info"
                            items={[
                                "All payments are held securely in escrow until you confirm pickup",
                                "Vendors only receive payment after successful product collection",
                                "A 10% platform fee is applied to each transaction",
                                "Rejected products trigger a refund (70% buyer / 30% vendor split)"
                            ]}
                        />

                        <RuleCard
                            icon={<ClockIcon size={20} color="hsl(var(--primary))" />}
                            title="Order Timelines"
                            variant="info"
                            items={[
                                "Vendors have 24-48 hours to drop off products at fulfillment centers",
                                "You have 48 hours to collect your order after drop-off",
                                "Uncollected orders may be returned to the vendor",
                                "Refund processing takes 3-5 business days"
                            ]}
                        />

                        <RuleCard
                            icon={<HeartHandshakeIcon size={20} color="hsl(var(--primary))" />}
                            title="Dispute Resolution"
                            variant="info"
                            items={[
                                "Report quality issues before leaving the fulfillment center",
                                "Contact support within 24 hours for any disputes",
                                "Provide photos/evidence when reporting issues",
                                "Our team will mediate and resolve disputes fairly"
                            ]}
                        />
                    </VStack>

                    {/* Consequences Section */}
                    <Box className="bg-destructive/10 border border-destructive/20 rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6">
                        <HStack space="md" className="items-center mb-4">
                            <AlertTriangleIcon size={24} color="rgb(239 68 68)" />
                            <VStack>
                                <Heading className="text-destructive font-black text-lg tracking-tight">Violation Consequences</Heading>
                            </VStack>
                        </HStack>
                        <Text className="text-muted-foreground text-sm leading-relaxed mb-4">
                            Violating these guidelines may result in:
                        </Text>
                        <VStack space="xs" className="ml-2">
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-1.5 bg-destructive rounded-full" />
                                <Text className="text-muted-foreground text-sm">Warning or temporary account suspension</Text>
                            </HStack>
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-1.5 bg-destructive rounded-full" />
                                <Text className="text-muted-foreground text-sm">Permanent account termination</Text>
                            </HStack>
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-1.5 bg-destructive rounded-full" />
                                <Text className="text-muted-foreground text-sm">Loss of pending refunds or order credits</Text>
                            </HStack>
                            <HStack space="sm" className="items-center">
                                <Box className="w-1.5 h-1.5 bg-destructive rounded-full" />
                                <Text className="text-muted-foreground text-sm">Legal action in cases of fraud</Text>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Contact Section */}
                    <Box className="bg-secondary/30 border border-border/30 rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6">
                        <VStack space="md" className="items-center text-center">
                            <ShieldCheckIcon size={32} color="hsl(var(--primary))" />
                            <VStack space="xs" className="items-center">
                                <Heading className="text-foreground font-black text-lg tracking-tight">Need Help?</Heading>
                                <Text className="text-muted-foreground text-sm">
                                    If you have questions about these guidelines or need to report a violation:
                                </Text>
                            </VStack>
                            <VStack space="xs" className="items-center">
                                <Text className="text-foreground text-sm font-bold">📧 support@livex.ng</Text>
                                <Text className="text-foreground text-sm font-bold">📞 +234 800 LIVEX (54839)</Text>
                            </VStack>
                            <Text className="text-muted-foreground text-xs mt-2">
                                Last updated: January 2026
                            </Text>
                        </VStack>
                    </Box>

                </VStack>
            </Box>
        </Box>
    );
}
