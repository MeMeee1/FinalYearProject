'use client';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ArrowLeftIcon, CreditCardIcon, ShieldCheckIcon, LockIcon, BanknoteIcon, Loader2Icon } from 'lucide-react-native';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { createOrder, initializePayment, verifyPayment } from '@/lib/api';

export default function Payment() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Text>Loading payment gateway...</Text>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { total, items, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'ready' | 'creating' | 'paying' | 'verifying' | 'success' | 'error'>('ready');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('card');

    const address = searchParams.get('address') || '';
    const city = searchParams.get('city') || '';
    const lga = searchParams.get('lga') || '';
    const phone = searchParams.get('phone') || '';
    const fulfillmentPointId = searchParams.get('fulfillmentPointId') ? Number(searchParams.get('fulfillmentPointId')) : undefined;

    // Check for payment callback
    useEffect(() => {
        const reference = searchParams.get('reference');
        const trxref = searchParams.get('trxref');

        if (reference || trxref) {
            handlePaymentCallback(reference || trxref || '');
        }
    }, [searchParams]);

    const handlePaymentCallback = async (reference: string) => {
        setPaymentStep('verifying');
        try {
            const result = await verifyPayment(reference);
            if (result.success) {
                setPaymentStep('success');
                clearCart();
                setTimeout(() => {
                    router.push('/orders');
                }, 2000);
            } else {
                setPaymentStep('error');
                setErrorMessage(result.message || 'Payment verification failed');
            }
        } catch (error: any) {
            setPaymentStep('error');
            setErrorMessage(error.message || 'Failed to verify payment');
        }
    };

    const handleExecutePayment = async () => {
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // Step 1: Create order
            setPaymentStep('creating');
            const pickupLocation = `${address}, ${city}, ${lga}`.trim();
            const order = await createOrder(items, pickupLocation, fulfillmentPointId);

            // Step 2: Initialize Paystack payment
            setPaymentStep('paying');
            const paymentData = await initializePayment(order.id);

            // Step 3: Redirect to Paystack
            window.location.href = paymentData.authorization_url;

        } catch (err: any) {
            console.error(err);
            setPaymentStep('error');
            setErrorMessage(err.message || 'Payment initialization failed');
            setIsSubmitting(false);
        }
    };

    // Show verification/success/error states
    if (paymentStep === 'verifying') {
        return (
            <Box className="flex-1 min-h-screen bg-background flex items-center justify-center">
                <VStack space="lg" className="items-center p-8">
                    <Loader2Icon size={48} color="hsl(var(--primary))" className="animate-spin" />
                    <Heading className="text-foreground font-black">Verifying Payment...</Heading>
                    <Text className="text-muted-foreground text-center">Please wait while we confirm your transaction</Text>
                </VStack>
            </Box>
        );
    }

    if (paymentStep === 'success') {
        return (
            <Box className="flex-1 min-h-screen bg-background flex items-center justify-center">
                <VStack space="lg" className="items-center p-8">
                    <Box className="w-24 h-24 bg-green-500/20 rounded-full items-center justify-center mb-4">
                        <ShieldCheckIcon size={48} color="#22c55e" />
                    </Box>
                    <Heading className="text-green-500 font-black text-2xl">Payment Successful!</Heading>
                    <Text className="text-muted-foreground text-center">Your funds are held in escrow until order pickup.</Text>
                    <Text className="text-muted-foreground text-sm">Redirecting to orders...</Text>
                </VStack>
            </Box>
        );
    }

    return (
        <Box className="flex-1 min-h-screen bg-background pb-32 sm:pb-40">
            {/* Premium Header */}
            <Box className="bg-background/80 backdrop-blur-3xl px-4 pt-8 pb-4 sm:px-6 sm:pt-12 sm:pb-6 border-b border-border/40 sticky top-0 z-50">
                <HStack space="md" className="items-center">
                    <button
                        className="rounded-xl bg-secondary/50 border border-border/40 w-10 h-10 p-0 items-center justify-center hover:bg-secondary/80 transition-all active:scale-95 flex"
                        onClick={() => router.back()}
                    >
                        <ArrowLeftIcon size={20} color="hsl(var(--foreground))" />
                    </button>
                    <VStack>
                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] leading-none mb-1">Secure Payment</Text>
                        <Heading size="lg" className="text-foreground font-black tracking-tighter">Paystack Checkout</Heading>
                    </VStack>
                </HStack>
            </Box>

            <Box className="p-4 sm:p-6 max-w-4xl mx-auto">
                <VStack space="lg" className="sm:space-y-6">
                    {/* Amount Display Card */}
                    <Box className="bg-primary/90 p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-[2rem] md:rounded-[3rem] shadow-[0_32px_64px_rgba(var(--primary-rgb),0.3)] items-center relative overflow-hidden">
                        <Box className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <Text className="text-black/60 mb-2 sm:mb-4 font-black uppercase tracking-[0.15em] sm:tracking-[0.25em] text-[9px] sm:text-[10px]">Total Amount</Text>
                        <Heading className="text-black font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none mb-2">₦{total.toLocaleString()}</Heading>
                        <HStack space="xs" className="items-center bg-black/10 px-3 py-1 rounded-full">
                            <LockIcon size={10} color="black" />
                            <Text className="text-black font-bold uppercase tracking-widest text-[8px]">Escrowed Until Pickup</Text>
                        </HStack>
                    </Box>

                    {/* Error Message */}
                    {errorMessage && (
                        <Box className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl">
                            <Text className="text-red-500 font-bold text-sm">{errorMessage}</Text>
                        </Box>
                    )}

                    <VStack space="md">
                        <Heading className="text-foreground font-black tracking-tight text-xl ml-2 mb-2">Payment Method</Heading>

                        {/* Card Method */}
                        <button
                            className={`p-4 sm:p-6 h-auto rounded-xl sm:rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all cursor-pointer flex w-full ${selectedMethod === 'card' ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-border/40 bg-card/40'}`}
                            onClick={() => setSelectedMethod('card')}
                        >
                            <HStack className="items-center justify-between w-full">
                                <HStack space="md" className="items-center">
                                    <Box className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl items-center justify-center ${selectedMethod === 'card' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-secondary/40'}`}>
                                        <CreditCardIcon size={24} color={selectedMethod === 'card' ? 'black' : 'hsl(var(--muted-foreground))'} />
                                    </Box>
                                    <VStack className="items-start">
                                        <Heading size="sm" className="text-foreground font-black tracking-tight">Card / Bank Transfer</Heading>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-left">Visa, Mastercard, Verve, Bank</Text>
                                    </VStack>
                                </HStack>
                                {selectedMethod === 'card' && <ShieldCheckIcon size={24} color="hsl(var(--primary))" />}
                            </HStack>
                        </button>

                        {/* USSD Method */}
                        <button
                            className={`p-6 h-auto rounded-[2.5rem] border-2 transition-all cursor-pointer flex w-full ${selectedMethod === 'ussd' ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-border/40 bg-card/40'}`}
                            onClick={() => setSelectedMethod('ussd')}
                        >
                            <HStack className="items-center justify-between w-full">
                                <HStack space="md" className="items-center">
                                    <Box className={`w-14 h-14 rounded-2xl items-center justify-center ${selectedMethod === 'ussd' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-secondary/40'}`}>
                                        <Text className={`font-black text-xs tracking-tighter ${selectedMethod === 'ussd' ? 'text-black' : 'text-muted-foreground'}`}>USSD</Text>
                                    </Box>
                                    <VStack className="items-start">
                                        <Heading size="sm" className="text-foreground font-black tracking-tight">USSD Banking</Heading>
                                        <Text className="text-[10px] text-muted-foreground font-black uppercase tracking-widest text-left">*737#, *919#, *901#</Text>
                                    </VStack>
                                </HStack>
                                {selectedMethod === 'ussd' && <ShieldCheckIcon size={24} color="hsl(var(--primary))" />}
                            </HStack>
                        </button>
                    </VStack>

                    {/* Trust Indicators */}
                    <HStack space="md" className="bg-secondary/10 border border-border/30 p-6 rounded-[2.5rem] mt-4">
                        <Box className="w-10 h-10 bg-blue-500/10 rounded-xl items-center justify-center">
                            <ShieldCheckIcon size={20} color="rgb(59 130 246)" />
                        </Box>
                        <VStack className="flex-1">
                            <Text className="text-foreground font-black text-[10px] uppercase tracking-widest">PCI-DSS Compliant</Text>
                            <Text className="text-muted-foreground text-[10px] font-medium leading-relaxed">Secured by Paystack. Funds held until delivery confirmed.</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </Box>

            {/* Bottom Interaction Deck */}
            <Box className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-3xl p-4 sm:p-6 md:p-8 border-t border-border/30 pb-6 sm:pb-8 md:pb-12 z-50">
                <Box className="max-w-4xl mx-auto">
                    <button
                        className="w-full rounded-xl sm:rounded-2xl md:rounded-[2.5rem] bg-primary hover:scale-[1.02] shadow-[0_24px_48px_rgba(var(--primary-rgb),0.3)] border-0 h-16 sm:h-20 md:h-24 transition-all active:scale-[0.98] group overflow-hidden relative flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleExecutePayment}
                        disabled={isSubmitting}
                    >
                        <Box className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <HStack space="lg" className="items-center relative z-10">
                            <Box className="bg-black/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                {isSubmitting ? (
                                    <Loader2Icon size={24} color="black" className="animate-spin" />
                                ) : (
                                    <LockIcon size={24} color="black" />
                                )}
                            </Box>
                            <VStack className="items-start">
                                {isSubmitting ? (
                                    <Text className="font-black text-black text-xl uppercase tracking-[0.25em] leading-none">
                                        {paymentStep === 'creating' ? 'Creating Order...' : 'Redirecting to Paystack...'}
                                    </Text>
                                ) : (
                                    <>
                                        <Text className="font-black text-black text-xl uppercase tracking-[0.25em] leading-none">Pay ₦{total.toLocaleString()}</Text>
                                        <Text className="text-black/60 text-[10px] font-black uppercase tracking-widest mt-1">Secure Payment via Paystack</Text>
                                    </>
                                )}
                            </VStack>
                        </HStack>
                    </button>
                </Box>
            </Box>
        </Box>
    );
}
