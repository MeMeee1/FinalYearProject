'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { XIcon, ShieldCheckIcon, ScrollTextIcon, CheckCircle2Icon } from 'lucide-react-native';
import { useState } from 'react';

interface TermsAndConditionsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export function TermsAndConditionsModal({ isOpen, onAccept, onDecline }: TermsAndConditionsModalProps) {
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

    if (!isOpen) return null;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            setHasScrolledToEnd(true);
        }
    };

    return (
        <Box className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Box className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl sm:rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <Box className="bg-primary/10 border-b border-border/30 p-4 sm:p-6">
                    <HStack className="justify-between items-center">
                        <HStack space="md" className="items-center">
                            <Box className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl items-center justify-center border border-primary/20">
                                <ScrollTextIcon size={20} color="hsl(var(--primary))" />
                            </Box>
                            <VStack space="xs">
                                <Text className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">LiveX Platform</Text>
                                <Heading className="text-lg sm:text-xl text-foreground font-black tracking-tight">Terms & Conditions</Heading>
                            </VStack>
                        </HStack>
                        <button
                            onClick={onDecline}
                            className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-destructive/20 transition-all active:scale-95 flex"
                        >
                            <XIcon size={20} color="hsl(var(--foreground))" />
                        </button>
                    </HStack>
                </Box>

                {/* Scrollable Content */}
                <Box
                    className="flex-1 overflow-y-auto p-4 sm:p-6 text-foreground space-y-6"
                    onScroll={handleScroll}
                >
                    <VStack space="lg">
                        {/* Introduction */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">1. Introduction</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                Welcome to LiveX, a livestock e-commerce platform connecting buyers with verified vendors in Nigeria.
                                By creating an account and using our services, you agree to comply with and be bound by these Terms and Conditions.
                                Please read them carefully before proceeding with registration.
                            </Text>
                        </VStack>

                        {/* User Responsibilities */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">2. User Responsibilities</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                As a registered user of LiveX, you agree to:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Provide accurate and truthful information during registration</Text>
                                <Text className="text-muted-foreground text-sm">• Keep your account credentials secure and confidential</Text>
                                <Text className="text-muted-foreground text-sm">• Not engage in fraudulent activities or misrepresentation</Text>
                                <Text className="text-muted-foreground text-sm">• Comply with all applicable laws and regulations</Text>
                                <Text className="text-muted-foreground text-sm">• Respect the rights and property of vendors and other users</Text>
                            </VStack>
                        </VStack>

                        {/* Escrow Payment System */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">3. Escrow Payment System</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX operates an escrow payment system to protect both buyers and vendors:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Payments are held securely until successful product pickup</Text>
                                <Text className="text-muted-foreground text-sm">• Funds are released to vendors only after buyer confirmation</Text>
                                <Text className="text-muted-foreground text-sm">• A platform fee of 10% is deducted from each transaction</Text>
                                <Text className="text-muted-foreground text-sm">• Refunds are processed according to our refund policy (70% buyer / 30% vendor split for rejected items)</Text>
                            </VStack>
                        </VStack>

                        {/* Fulfillment & Pickup */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">4. Fulfillment & Pickup</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                Orders are fulfilled through designated fulfillment points:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Vendors drop off products at the selected fulfillment center</Text>
                                <Text className="text-muted-foreground text-sm">• Buyers receive a unique pickup code for collection</Text>
                                <Text className="text-muted-foreground text-sm">• Products must be collected within 48 hours of drop-off</Text>
                                <Text className="text-muted-foreground text-sm">• Uncollected products may be returned to vendors</Text>
                            </VStack>
                        </VStack>

                        {/* Product Quality */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">5. Product Quality & Inspection</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                All livestock products are subject to quality inspection at fulfillment centers.
                                Products that do not meet the specified quality standards may be rejected, triggering a refund process.
                                Buyers are encouraged to inspect products upon pickup before confirming collection.
                            </Text>
                        </VStack>

                        {/* Privacy Policy */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">6. Privacy & Data Protection</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                We are committed to protecting your personal information:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Your data is encrypted and stored securely</Text>
                                <Text className="text-muted-foreground text-sm">• We do not sell or share your information with third parties without consent</Text>
                                <Text className="text-muted-foreground text-sm">• Payment information is processed through secure payment gateways (Paystack)</Text>
                                <Text className="text-muted-foreground text-sm">• You may request data deletion by contacting our support team</Text>
                            </VStack>
                        </VStack>

                        {/* Limitation of Liability */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">7. Limitation of Liability</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX acts as a marketplace platform connecting buyers and vendors.
                                While we strive to ensure quality and safety, we are not responsible for:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Direct disputes between buyers and vendors outside our platform</Text>
                                <Text className="text-muted-foreground text-sm">• Product quality issues not reported within our inspection window</Text>
                                <Text className="text-muted-foreground text-sm">• Loss or damage occurring after product collection</Text>
                            </VStack>
                        </VStack>

                        {/* Termination */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">8. Account Termination</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX reserves the right to suspend or terminate accounts that violate these terms,
                                engage in fraudulent activities, or bring harm to our platform community.
                                Users may also request account deletion at any time.
                            </Text>
                        </VStack>

                        {/* Contact */}
                        <VStack space="sm">
                            <Heading size="sm" className="text-primary font-black tracking-tight">9. Contact Information</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                For questions or concerns regarding these Terms and Conditions, please contact us at:
                            </Text>
                            <VStack space="xs" className="ml-4">
                                <Text className="text-muted-foreground text-sm">• Email: support@livex.ng</Text>
                                <Text className="text-muted-foreground text-sm">• Phone: +234 800 LIVEX (54839)</Text>
                            </VStack>
                        </VStack>

                        <Box className="bg-secondary/20 p-4 rounded-xl border border-border/30">
                            <HStack space="sm" className="items-center">
                                <ShieldCheckIcon size={16} color="hsl(var(--primary))" />
                                <Text className="text-xs text-muted-foreground">
                                    Last updated: January 2026. These terms may be updated periodically.
                                </Text>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Footer Actions */}
                <Box className="border-t border-border/30 p-4 sm:p-6 bg-background/50">
                    <VStack space="md">
                        {!hasScrolledToEnd && (
                            <Text className="text-center text-xs text-muted-foreground italic">
                                Please scroll to read all terms before accepting
                            </Text>
                        )}
                        <HStack space="md" className="w-full">
                            <button
                                onClick={onDecline}
                                className="flex-1 rounded-xl sm:rounded-2xl bg-secondary/50 border border-border/40 h-12 sm:h-14 hover:bg-destructive/20 transition-all active:scale-95 flex items-center justify-center"
                            >
                                <Text className="text-foreground font-bold text-sm uppercase tracking-widest">Decline</Text>
                            </button>
                            <button
                                onClick={onAccept}
                                disabled={!hasScrolledToEnd}
                                className={`flex-1 rounded-xl sm:rounded-2xl h-12 sm:h-14 transition-all active:scale-95 flex items-center justify-center gap-2 ${hasScrolledToEnd
                                        ? 'bg-primary shadow-lg shadow-primary/20'
                                        : 'bg-secondary/30 cursor-not-allowed'
                                    }`}
                            >
                                <CheckCircle2Icon size={18} color={hasScrolledToEnd ? 'black' : 'hsl(var(--muted-foreground))'} />
                                <Text className={`font-bold text-sm uppercase tracking-widest ${hasScrolledToEnd ? 'text-black' : 'text-muted-foreground'}`}>
                                    I Accept
                                </Text>
                            </button>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}
