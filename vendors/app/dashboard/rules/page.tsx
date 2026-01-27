'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import {
    Scale,
    Clock,
    ShieldAlert,
    Heart,
    Truck,
    Ban,
    AlertTriangle,
    CheckCircle2,
    FileText,
    BadgeCheck
} from 'lucide-react';

const rules = [
    {
        id: 1,
        icon: BadgeCheck,
        title: 'Verification Requirement',
        description: 'You have 5 working days from account creation to get verified by the veterinary officer assigned to your fulfillment point. Failure to complete verification within this period will result in account suspension.',
        severity: 'critical',
    },
    {
        id: 2,
        icon: Heart,
        title: 'Animal Welfare in Care',
        description: 'If an animal dies while in the care of the fulfillment point before customer pickup, the customer will receive a partial refund (70%) and the fulfillment point will be compensated for care costs (30%).',
        severity: 'critical',
    },
    {
        id: 3,
        icon: Truck,
        title: 'Timely Drop-off',
        description: 'Orders must be dropped off at the designated fulfillment point within 24 hours of order confirmation. Late drop-offs may result in order cancellation and potential penalties.',
        severity: 'warning',
    },
    {
        id: 4,
        icon: ShieldAlert,
        title: 'Animal Health Standards',
        description: 'All livestock must be in good health condition at the time of drop-off. Animals showing signs of illness, injury, or distress will be rejected by the fulfillment point.',
        severity: 'warning',
    },
    {
        id: 5,
        icon: FileText,
        title: 'Accurate Listings',
        description: 'Product listings must accurately represent the livestock being sold, including breed, age, weight, and health status. Misrepresentation may result in refund claims and penalties.',
        severity: 'warning',
    },
    {
        id: 6,
        icon: Ban,
        title: 'Prohibited Activities',
        description: 'Selling sick, stolen, or undocumented livestock is strictly prohibited. Violation will result in immediate account termination and possible legal action.',
        severity: 'critical',
    },
    {
        id: 7,
        icon: Clock,
        title: 'Response Time',
        description: 'Vendors must respond to customer inquiries within 12 hours during business days. Poor response rates may affect your visibility on the platform.',
        severity: 'info',
    },
    {
        id: 8,
        icon: Scale,
        title: 'Dispute Resolution',
        description: 'In case of disputes, the platform will mediate based on evidence provided by both parties. Vendors must cooperate fully with investigation requests within 48 hours.',
        severity: 'info',
    }
];

const getSeverityStyles = (severity: string) => {
    switch (severity) {
        case 'critical':
            return {
                bg: 'bg-red-500/10',
                border: 'border-red-500/30',
                text: 'text-red-500',
                badge: 'bg-red-500 text-white'
            };
        case 'warning':
            return {
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/30',
                text: 'text-orange-500',
                badge: 'bg-orange-500 text-white'
            };
        default:
            return {
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/30',
                text: 'text-blue-500',
                badge: 'bg-blue-500 text-white'
            };
    }
};

export default function RulesPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Scale className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Compliance</p>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">Vendor Guidelines</h1>
                    </div>
                </div>
                <p className="text-muted-foreground text-sm">
                    These rules ensure fair trading, animal welfare, and customer satisfaction. Please read carefully.
                </p>
            </div>

            {/* Summary Pills */}
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500">3 Critical</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-orange-500">3 Important</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-500">2 Best Practices</span>
                </div>
            </div>

            {/* Rules List */}
            <div className="space-y-4">
                {rules.map((rule) => {
                    const styles = getSeverityStyles(rule.severity);
                    const IconComponent = rule.icon;

                    return (
                        <div
                            key={rule.id}
                            className={`p-6 rounded-2xl border ${styles.border} bg-card hover:shadow-md transition-all`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 ${styles.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <IconComponent className={`w-6 h-6 ${styles.text}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3 className="text-base font-black text-foreground">
                                            {rule.title}
                                        </h3>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${styles.badge}`}>
                                            {rule.severity}
                                        </span>
                                    </div>

                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {rule.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-6 rounded-2xl border border-border bg-secondary/20 text-center space-y-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-sm font-black text-foreground">Need Clarification?</h4>
                <p className="text-muted-foreground text-xs max-w-md mx-auto">
                    Contact our vendor support team if you have questions about these guidelines.
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pt-2">
                    Last Updated: January 2026
                </p>
            </div>
        </div>
    );
}
