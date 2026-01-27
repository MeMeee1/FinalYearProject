'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ShieldCheckIcon, Loader2Icon, XCircleIcon } from 'lucide-react-native';
import { verifyPayment } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function PaymentCallback() {
    return (
        <Suspense fallback={
            <Box className="flex-1 min-h-screen bg-background flex items-center justify-center">
                <VStack space="lg" className="items-center p-8">
                    <Loader2Icon size={48} color="hsl(var(--primary))" className="animate-spin" />
                    <Heading className="text-foreground font-black">Loading...</Heading>
                </VStack>
            </Box>
        }>
            <CallbackContent />
        </Suspense>
    );
}

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref');

        if (!reference) {
            setStatus('error');
            setMessage('No payment reference found');
            return;
        }

        verifyPaymentTransaction(reference);
    }, [searchParams]);

    const verifyPaymentTransaction = async (reference: string) => {
        try {
            const result = await verifyPayment(reference);

            if (result.success) {
                setStatus('success');
                setMessage('Payment successful! Funds are held in escrow until pickup.');
                clearCart();

                // Redirect to orders after 3 seconds
                setTimeout(() => {
                    router.push('/orders');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(result.message || 'Payment verification failed');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage(error.message || 'Failed to verify payment');
        }
    };

    return (
        <Box className="flex-1 min-h-screen bg-background flex items-center justify-center">
            <VStack space="lg" className="items-center p-8 max-w-md">
                {status === 'verifying' && (
                    <>
                        <Loader2Icon size={64} color="hsl(var(--primary))" className="animate-spin" />
                        <Heading className="text-foreground font-black text-2xl text-center">Verifying Payment...</Heading>
                        <Text className="text-muted-foreground text-center">Please wait while we confirm your transaction with Paystack</Text>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <Box className="w-32 h-32 bg-green-500/20 rounded-full items-center justify-center">
                            <ShieldCheckIcon size={64} color="#22c55e" />
                        </Box>
                        <Heading className="text-green-500 font-black text-3xl text-center">Payment Successful!</Heading>
                        <Text className="text-muted-foreground text-center leading-relaxed">{message}</Text>
                        <Text className="text-muted-foreground/60 text-sm mt-4">Redirecting to your orders...</Text>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <Box className="w-32 h-32 bg-red-500/20 rounded-full items-center justify-center">
                            <XCircleIcon size={64} color="#ef4444" />
                        </Box>
                        <Heading className="text-red-500 font-black text-2xl text-center">Payment Failed</Heading>
                        <Text className="text-muted-foreground text-center leading-relaxed">{message}</Text>
                        <button
                            onClick={() => router.push('/cart')}
                            className="mt-6 px-8 py-4 bg-primary rounded-2xl font-black text-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        >
                            Return to Cart
                        </button>
                    </>
                )}
            </VStack>
        </Box>
    );
}
