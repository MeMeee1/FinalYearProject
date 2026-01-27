import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { orderItemsTable, ordersTable } from '../../db/ordersSchema.js';
import { productsTable } from '../../db/productsSchema.js';
import { vendorsTable } from '../../db/vendorsSchema.js';
import { fulfillmentPointsTable } from '../../db/fulfillmentPointsSchema.js';
import { eq, and, inArray, sql } from 'drizzle-orm';
import crypto from 'crypto';

function generatePickupCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) result += '-';
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { order, items } = req.cleanBody;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const { fulfillmentPointId } = order || {};

    // Start a transaction to ensure atomic order creation and stock reduction
    const result = await db.transaction(async (tx) => {
      // 1. Fetch products to validate logistics and stock
      const productIds = items.map(i => i.id || i.productId);
      const dbProducts = await tx
        .select({
          id: productsTable.id,
          name: productsTable.name,
          stock: productsTable.stock,
          sellerId: productsTable.sellerId,
          supportsOutsideLgaDelivery: productsTable.supportsOutsideLgaDelivery,
          vendor: {
            assignedVerificationPointId: vendorsTable.assignedVerificationPointId,
            platformCommissionRate: vendorsTable.platformCommissionRate
          }
        })
        .from(productsTable)
        .leftJoin(vendorsTable, eq(productsTable.sellerId, vendorsTable.id))
        .where(inArray(productsTable.id, productIds));

      // 2. Perform Logistics and Stock Validation
      for (const item of items) {
        const p = dbProducts.find(dbP => dbP.id === (item.id || item.productId));
        if (!p) {
          throw new Error(`Product ${item.id || item.productId} not found`);
        }

        // Stock check
        if (p.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${p.name}". Available: ${p.stock}, Requested: ${item.quantity}`);
        }

        // Logistics check
        if (!p.supportsOutsideLgaDelivery) {
          if (!fulfillmentPointId) {
            throw new Error(`Logistics Constraint: Item "${p.name}" requires on-site collection. Please select a fulfillment hub.`);
          }
          if (p.vendor?.assignedVerificationPointId !== Number(fulfillmentPointId)) {
            throw new Error(`Logistics Constraint: Item "${p.name}" can only be picked up from the vendor's assigned verification point.`);
          }
        }
      }

      // 3. Reduce stock for each item and prepare for broadcast
      const stockUpdates = [];
      for (const item of items) {
        const [updatedProduct] = await tx
          .update(productsTable)
          .set({ stock: sql`${productsTable.stock} - ${item.quantity}` })
          .where(eq(productsTable.id, item.id || item.productId))
          .returning({ id: productsTable.id, stock: productsTable.stock });

        stockUpdates.push(updatedProduct);
      }

      // Calculate amounts
      const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

      // Use the commission rate from the vendor profile (default to 10% if not found)
      const commissionRate = dbProducts[0]?.vendor?.platformCommissionRate || 10.0;
      const platformFee = subtotal * (commissionRate / 100);
      const shippingCost = 0;
      const totalAmount = subtotal;
      const sellerAmount = subtotal - platformFee;

      // Get sellerId from the first item
      const orderSellerId = items[0].sellerId || dbProducts[0].sellerId || 1;

      // 4. Create Order
      const [newOrder] = await tx
        .insert(ordersTable)
        .values({
          userId: Number(userId),
          sellerId: Number(orderSellerId),
          totalAmount: Number(totalAmount),
          platformFee: Number(platformFee),
          sellerAmount: Number(sellerAmount),
          shippingCost: Number(shippingCost),
          fulfillmentPointId: fulfillmentPointId ? Number(fulfillmentPointId) : null,
          pickupCode: generatePickupCode(),
          deliveryStatus: 'pending',
          status: 'New'
        })
        .returning();

      // 5. Create Order Items
      const orderItems = items.map((item: any) => ({
        orderId: newOrder.id,
        productId: item.id || item.productId,
        sellerId: item.sellerId || orderSellerId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }));

      const newOrderItems = await tx
        .insert(orderItemsTable)
        .values(orderItems)
        .returning();

      return { newOrder, newOrderItems, stockUpdates, orderSellerId };
    });

    // 6. Broadcast stock updates and new order notification via WebSockets (outside transaction)
    if (req.io) {
      // Notify vendor about the new order
      req.io.to(`vendor_${result.orderSellerId}`).emit('new_order', {
        orderId: result.newOrder.id,
        totalAmount: result.newOrder.totalAmount,
        message: 'New procurement authorization received!'
      });

      result.stockUpdates.forEach(update => {
        req.io.emit('stock_updated', {
          productId: update.id,
          newStock: update.stock
        });
      });
    }

    res.status(201).json({ ...result.newOrder, items: result.newOrderItems });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error while creating order' });
  }
}

export async function markAsDroppedOff(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const [updatedOrder] = await db
      .update(ordersTable)
      .set({
        deliveryStatus: 'dropped_off',
        updatedAt: new Date()
      })
      .where(eq(ordersTable.id, id))
      .returning();

    // Notify User via WebSockets
    if (req.io) {
      req.io.to(`user_${order.userId}`).emit('order_status_update', {
        orderId: id,
        deliveryStatus: 'dropped_off',
        pickupCode: order.pickupCode,
        message: 'Your order has been dropped off at the fulfillment center!'
      });
      // Also broadcast globally if needed, but per-user is better
    }

    res.json(updatedOrder);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update delivery status' });
  }
}

/**
 * Mark an order as having a bad drop-off (animal rejected/died)
 * This simulates the scenario where an animal is in bad condition or dies at the fulfillment point
 * Customer gets 70% refund, fulfillment point gets 30% compensation
 */
export async function markAsBadDropOff(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { reason } = req.body;

    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Calculate refund amounts based on the 70/30 rule
    const totalAmount = Number(order.totalAmount);
    const customerRefund = Math.round(totalAmount * 0.70 * 100) / 100;
    const fulfillmentCompensation = Math.round(totalAmount * 0.30 * 100) / 100;

    const [updatedOrder] = await db
      .update(ordersTable)
      .set({
        deliveryStatus: 'rejected',
        status: 'Cancelled',
        notes: reason || 'Animal rejected at fulfillment point - bad condition',
        updatedAt: new Date()
      })
      .where(eq(ordersTable.id, id))
      .returning();

    // Notify User via WebSockets
    if (req.io) {
      req.io.to(`user_${order.userId}`).emit('order_status_update', {
        orderId: id,
        deliveryStatus: 'rejected',
        message: `Order #${id} has been rejected. You will receive a refund of ₦${customerRefund.toLocaleString()}.`,
        refundAmount: customerRefund,
        reason: reason || 'Animal failed health inspection at fulfillment point'
      });

      // Notify vendor about the rejection
      req.io.to(`vendor_${order.sellerId}`).emit('order_status_update', {
        orderId: id,
        deliveryStatus: 'rejected',
        message: `Order #${id} was rejected at the fulfillment point.`,
        reason: reason || 'Animal failed health inspection'
      });
    }

    res.json({
      ...updatedOrder,
      refundDetails: {
        customerRefund,
        fulfillmentCompensation,
        reason: reason || 'Animal rejected at fulfillment point'
      }
    });
  } catch (e) {
    console.error('Failed to process bad drop-off:', e);
    res.status(500).json({ message: 'Failed to process bad drop-off' });
  }
}

export async function verifyPickupCode(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { code } = req.body;

    const [order] = await db
      .select({
        id: ordersTable.id,
        pickupCode: ordersTable.pickupCode,
        deliveryStatus: ordersTable.deliveryStatus,
        userId: ordersTable.userId
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id));

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.pickupCode !== code) {
      return res.status(400).json({ message: 'Invalid pickup code' });
    }

    if (order.deliveryStatus === 'collected') {
      return res.status(400).json({ message: 'Order already collected' });
    }

    const [updatedOrder] = await db
      .update(ordersTable)
      .set({
        deliveryStatus: 'collected',
        status: 'Completed',
        updatedAt: new Date()
      })
      .where(eq(ordersTable.id, id))
      .returning();

    if (req.io) {
      // Notify the user
      req.io.to(`user_${order.userId}`).emit('order_status_update', {
        orderId: id,
        deliveryStatus: 'collected',
        message: 'Order successfully collected!'
      });

      // Notify the vendor/seller
      const [orderWithSeller] = await db
        .select({ sellerId: ordersTable.sellerId })
        .from(ordersTable)
        .where(eq(ordersTable.id, id));

      if (orderWithSeller) {
        req.io.to(`vendor_${orderWithSeller.sellerId}`).emit('order_status_update', {
          orderId: id,
          deliveryStatus: 'collected',
          message: `Order #${id} has been collected by the customer.`
        });
      }
    }

    res.json(updatedOrder);
  } catch (e) {
    res.status(500).json({ message: 'Verification failed' });
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const role = req.role;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const conditions = [];

    // Filtering based on role
    if (role === 'seller') {
      const vendorResult = await db
        .select({ id: vendorsTable.id })
        .from(vendorsTable)
        .where(eq(vendorsTable.userId, Number(userId)));

      if (vendorResult.length > 0) {
        conditions.push(eq(ordersTable.sellerId, vendorResult[0].id));
      } else {
        return res.json({ data: [] });
      }
    } else if (role !== 'admin') {
      conditions.push(eq(ordersTable.userId, Number(userId)));
    }

    const ordersWithPoints = await db
      .select({
        orders: ordersTable,
        fulfillmentPoint: fulfillmentPointsTable
      })
      .from(ordersTable)
      .leftJoin(fulfillmentPointsTable, eq(ordersTable.fulfillmentPointId, fulfillmentPointsTable.id))
      .where(and(...conditions))
      .orderBy(ordersTable.createdAt);

    const result = ordersWithPoints.map(row => ({
      ...row.orders,
      fulfillmentPoint: row.fulfillmentPoint
    }));

    res.json({ data: result });
  } catch (error) {
    console.error('Error listing orders:', error);
    res.status(500).json({ message: 'Internal server error while fetching orders' });
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const orderWithItems = await db
      .select({
        orders: ordersTable,
        order_items: orderItemsTable,
        fulfillmentPoint: fulfillmentPointsTable
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId))
      .leftJoin(fulfillmentPointsTable, eq(ordersTable.fulfillmentPointId, fulfillmentPointsTable.id));

    if (orderWithItems.length === 0) {
      return res.status(404).send('Order not found');
    }

    const mergedOrder = {
      ...orderWithItems[0].orders,
      fulfillmentPoint: orderWithItems[0].fulfillmentPoint,
      items: orderWithItems.map((oi) => oi.order_items),
    };

    res.status(200).json(mergedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function updateOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    const [updatedOrder] = await db
      .update(ordersTable)
      .set(req.body)
      .where(eq(ordersTable.id, id))
      .returning();

    if (!updatedOrder) {
      res.status(404).send('Order not found');
    } else {
      res.status(200).json(updatedOrder);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
