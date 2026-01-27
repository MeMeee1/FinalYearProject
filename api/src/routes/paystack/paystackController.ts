import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { ordersTable, orderItemsTable } from '../../db/ordersSchema.js';
import { usersTable } from '../../db/usersSchema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || '';

/**
 * Get Paystack public key for frontend
 */
export async function getKeys(req: Request, res: Response) {
    res.json({ publicKey: PAYSTACK_PUBLIC_KEY });
}

/**
 * Initialize a Paystack transaction
 * Creates the transaction and returns authorization URL
 */
export async function initializeTransaction(req: Request, res: Response) {
    try {
        const { orderId, email, callbackUrl } = req.body;
        const userId = req.userId;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        // Get order details
        const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.id, orderId));

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the order belongs to the user
        if (order.userId !== Number(userId)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Check if already paid
        if (order.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Order already paid' });
        }

        // Get user email if not provided
        let customerEmail = email;
        if (!customerEmail) {
            const [user] = await db
                .select({ email: usersTable.email })
                .from(usersTable)
                .where(eq(usersTable.id, Number(userId)));
            customerEmail = user?.email;
        }

        if (!customerEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Amount in kobo (lowest denomination)
        const amountInKobo = Math.round(Number(order.totalAmount) * 100);
        const reference = `ORDER_${orderId}_${Date.now()}`;

        // Call Paystack API to initialize transaction
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: customerEmail,
                amount: amountInKobo,
                reference,
                callback_url: callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:3002'}/payment/callback`,
                metadata: {
                    orderId,
                    userId,
                },
            }),
        });

        const data = await response.json();

        if (!data.status) {
            console.error('Paystack initialization failed:', data);
            return res.status(400).json({ message: data.message || 'Failed to initialize payment' });
        }

        // Update order with Paystack reference
        await db
            .update(ordersTable)
            .set({
                paystackReference: reference,
                paymentStatus: 'pending',
                escrowStatus: 'pending'
            })
            .where(eq(ordersTable.id, orderId));

        res.json({
            authorization_url: data.data.authorization_url,
            access_code: data.data.access_code,
            reference: data.data.reference,
        });
    } catch (error) {
        console.error('Error initializing Paystack transaction:', error);
        res.status(500).json({ message: 'Failed to initialize payment' });
    }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyTransaction(req: Request, res: Response) {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ message: 'Reference is required' });
        }

        // Call Paystack API to verify transaction
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data.status) {
            return res.status(400).json({ message: data.message || 'Verification failed' });
        }

        const { status: txStatus, amount, metadata } = data.data;
        const orderId = metadata?.orderId;

        if (txStatus === 'success') {
            // Get order
            const [order] = await db
                .select()
                .from(ordersTable)
                .where(eq(ordersTable.id, orderId));

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Verify amount matches
            const expectedAmountKobo = Math.round(Number(order.totalAmount) * 100);
            if (amount !== expectedAmountKobo) {
                console.error(`Amount mismatch: expected ${expectedAmountKobo}, got ${amount}`);
                return res.status(400).json({ message: 'Amount mismatch' });
            }

            // Calculate fulfillment fee (5% of total, from platform commission)
            const fulfillmentFee = Math.round(Number(order.totalAmount) * 0.05 * 100) / 100;

            // Update order status - funds now in escrow
            await db
                .update(ordersTable)
                .set({
                    paymentStatus: 'paid',
                    escrowStatus: 'held',
                    fulfillmentFee,
                    status: 'Processing',
                    updatedAt: new Date(),
                })
                .where(eq(ordersTable.id, orderId));

            // Notify via WebSocket
            if (req.io) {
                req.io.to(`user_${order.userId}`).emit('payment_success', {
                    orderId,
                    message: 'Payment successful! Funds are held in escrow until pickup.',
                });

                req.io.to(`vendor_${order.sellerId}`).emit('new_paid_order', {
                    orderId,
                    totalAmount: order.totalAmount,
                    message: 'New paid order received!',
                });
            }

            return res.json({
                success: true,
                message: 'Payment verified successfully',
                order: {
                    id: orderId,
                    paymentStatus: 'paid',
                    escrowStatus: 'held',
                },
            });
        } else {
            // Payment failed
            await db
                .update(ordersTable)
                .set({
                    paymentStatus: 'failed',
                    updatedAt: new Date(),
                })
                .where(eq(ordersTable.id, orderId));

            return res.json({
                success: false,
                message: 'Payment not successful',
                status: txStatus,
            });
        }
    } catch (error) {
        console.error('Error verifying Paystack transaction:', error);
        res.status(500).json({ message: 'Failed to verify payment' });
    }
}

/**
 * Handle Paystack webhooks
 */
export async function handleWebhook(req: Request, res: Response) {
    try {
        // Verify webhook signature
        const hash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = req.body;

        switch (event.event) {
            case 'charge.success': {
                const { reference, metadata, amount } = event.data;
                const orderId = metadata?.orderId;

                if (orderId) {
                    const [order] = await db
                        .select()
                        .from(ordersTable)
                        .where(eq(ordersTable.id, orderId));

                    if (order && order.paymentStatus !== 'paid') {
                        // Calculate fulfillment fee
                        const fulfillmentFee = Math.round(Number(order.totalAmount) * 0.05 * 100) / 100;

                        await db
                            .update(ordersTable)
                            .set({
                                paymentStatus: 'paid',
                                escrowStatus: 'held',
                                fulfillmentFee,
                                status: 'Processing',
                                updatedAt: new Date(),
                            })
                            .where(eq(ordersTable.id, orderId));

                        // Notify via WebSocket
                        if (req.io) {
                            req.io.to(`user_${order.userId}`).emit('payment_success', {
                                orderId,
                                message: 'Payment successful!',
                            });
                        }
                    }
                }
                break;
            }

            case 'charge.failed': {
                const { metadata } = event.data;
                const orderId = metadata?.orderId;

                if (orderId) {
                    await db
                        .update(ordersTable)
                        .set({
                            paymentStatus: 'failed',
                            updatedAt: new Date(),
                        })
                        .where(eq(ordersTable.id, orderId));
                }
                break;
            }

            default:
                console.log(`Unhandled webhook event: ${event.event}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error handling Paystack webhook:', error);
        res.status(500).json({ message: 'Webhook processing failed' });
    }
}

/**
 * Get escrow status for an order (for display purposes)
 */
export async function getEscrowStatus(req: Request, res: Response) {
    try {
        const orderId = Number(req.params.id);

        const [order] = await db
            .select({
                id: ordersTable.id,
                totalAmount: ordersTable.totalAmount,
                platformFee: ordersTable.platformFee,
                sellerAmount: ordersTable.sellerAmount,
                fulfillmentFee: ordersTable.fulfillmentFee,
                escrowStatus: ordersTable.escrowStatus,
                paymentStatus: ordersTable.paymentStatus,
            })
            .from(ordersTable)
            .where(eq(ordersTable.id, orderId));

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Calculate disbursement breakdown
        const vendorPayout = Number(order.sellerAmount) - Number(order.fulfillmentFee || 0);

        res.json({
            ...order,
            disbursement: {
                total: order.totalAmount,
                platformFee: order.platformFee,
                fulfillmentFee: order.fulfillmentFee || 0,
                vendorPayout,
                escrowStatus: order.escrowStatus,
            },
        });
    } catch (error) {
        console.error('Error getting escrow status:', error);
        res.status(500).json({ message: 'Failed to get escrow status' });
    }
}
