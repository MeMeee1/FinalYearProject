'use client';

import { XIcon, ShieldCheckIcon, ScrollTextIcon, CheckCircle2Icon } from 'lucide-react';
import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';

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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl sm:rounded-[2rem] border border-border/50 shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-primary/10 border-b border-border/30 p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-primary/20">
                                <ScrollTextIcon size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <Text className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">LiveX Vendor Platform</Text>
                                <Heading className="text-lg sm:text-xl text-foreground font-black tracking-tight">Vendor Terms & Conditions</Heading>
                            </div>
                        </div>
                        <button
                            onClick={onDecline}
                            className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 flex items-center justify-center hover:bg-destructive/20 transition-all active:scale-95"
                        >
                            <XIcon size={20} className="text-foreground" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div
                    className="flex-1 overflow-y-auto p-4 sm:p-6 text-foreground space-y-6"
                    onScroll={handleScroll}
                >
                    <div className="space-y-6">
                        {/* Introduction */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">1. Vendor Agreement</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                Welcome to the LiveX Vendor Platform. By registering as a vendor, you agree to partner with LiveX to sell
                                livestock products through our marketplace. These terms govern your participation and responsibilities
                                as a registered vendor on our platform.
                            </Text>
                        </div>

                        {/* Vendor Responsibilities */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">2. Vendor Responsibilities</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                As a registered vendor, you agree to:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Provide accurate product descriptions, pricing, and availability</li>
                                <li className="text-muted-foreground text-sm">• Maintain high-quality livestock products that meet health standards</li>
                                <li className="text-muted-foreground text-sm">• Fulfill orders promptly and deliver products to designated fulfillment points</li>
                                <li className="text-muted-foreground text-sm">• Comply with all local regulations regarding livestock sales and transport</li>
                                <li className="text-muted-foreground text-sm">• Maintain accurate inventory and stock information</li>
                            </ul>
                        </div>

                        {/* Product Listings */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">3. Product Listings & Quality Standards</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                All products listed on LiveX must meet our quality standards:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Products must match their descriptions and images accurately</li>
                                <li className="text-muted-foreground text-sm">• Livestock must be healthy and meet veterinary requirements</li>
                                <li className="text-muted-foreground text-sm">• Pricing must be fair and competitive</li>
                                <li className="text-muted-foreground text-sm">• Products failing quality inspection will be rejected and refunded</li>
                            </ul>
                        </div>

                        {/* Escrow & Payment */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">4. Escrow Payment System</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX operates an escrow payment system to ensure secure transactions:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Buyer payments are held in escrow until successful product delivery</li>
                                <li className="text-muted-foreground text-sm">• Funds are released to vendors within 24-48 hours after buyer collection</li>
                                <li className="text-muted-foreground text-sm">• A platform commission of 10% is deducted from each transaction</li>
                                <li className="text-muted-foreground text-sm">• Rejected products result in a 70% buyer / 30% vendor refund split</li>
                            </ul>
                        </div>

                        {/* Fulfillment Process */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">5. Fulfillment Process</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                Vendors must follow the designated fulfillment process:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Drop off products at the buyer-selected fulfillment center</li>
                                <li className="text-muted-foreground text-sm">• Ensure products are properly tagged and documented</li>
                                <li className="text-muted-foreground text-sm">• Products must be delivered within the specified logistics window</li>
                                <li className="text-muted-foreground text-sm">• Uncollected products after 48 hours may be returned to vendor</li>
                            </ul>
                        </div>

                        {/* Commission & Fees */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">6. Commission & Fees</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX charges the following fees:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Platform Commission: 10% of each successful transaction</li>
                                <li className="text-muted-foreground text-sm">• Payment Processing: Handled by Paystack (standard fees apply)</li>
                                <li className="text-muted-foreground text-sm">• No monthly subscription or listing fees</li>
                            </ul>
                        </div>

                        {/* Prohibited Items */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">7. Prohibited Items & Activities</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                The following are strictly prohibited on LiveX:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Selling diseased or unhealthy livestock</li>
                                <li className="text-muted-foreground text-sm">• Misrepresenting product quality, breed, or specifications</li>
                                <li className="text-muted-foreground text-sm">• Price manipulation or fraudulent listings</li>
                                <li className="text-muted-foreground text-sm">• Conducting transactions outside the platform to avoid fees</li>
                            </ul>
                        </div>

                        {/* Account Termination */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">8. Account Suspension & Termination</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                LiveX reserves the right to suspend or terminate vendor accounts that:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Violate these terms and conditions</li>
                                <li className="text-muted-foreground text-sm">• Receive multiple quality complaints or product rejections</li>
                                <li className="text-muted-foreground text-sm">• Engage in fraudulent or dishonest practices</li>
                                <li className="text-muted-foreground text-sm">• Fail to fulfill orders repeatedly</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2">
                            <Heading className="text-base text-primary font-black tracking-tight">9. Contact & Support</Heading>
                            <Text className="text-muted-foreground text-sm leading-relaxed">
                                For vendor support and inquiries, please contact:
                            </Text>
                            <ul className="ml-4 space-y-1">
                                <li className="text-muted-foreground text-sm">• Email: vendors@livex.ng</li>
                                <li className="text-muted-foreground text-sm">• Phone: +234 800 LIVEX (54839)</li>
                                <li className="text-muted-foreground text-sm">• WhatsApp Business: +234 900 000 0000</li>
                            </ul>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-xl border border-border/30">
                            <div className="flex items-center gap-2">
                                <ShieldCheckIcon size={16} className="text-primary" />
                                <Text className="text-xs text-muted-foreground">
                                    Last updated: January 2026. These terms may be updated periodically.
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-border/30 p-4 sm:p-6 bg-background/50">
                    <div className="space-y-4">
                        {!hasScrolledToEnd && (
                            <Text className="text-center text-xs text-muted-foreground italic">
                                Please scroll to read all terms before accepting
                            </Text>
                        )}
                        <div className="flex gap-4 w-full">
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
                                <CheckCircle2Icon size={18} className={hasScrolledToEnd ? 'text-black' : 'text-muted-foreground'} />
                                <Text className={`font-bold text-sm uppercase tracking-widest ${hasScrolledToEnd ? 'text-black' : 'text-muted-foreground'}`}>
                                    I Accept
                                </Text>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
