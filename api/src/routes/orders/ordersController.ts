import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { orderItemsTable, ordersTable } from '../../db/ordersSchema.js';
import { eq } from 'drizzle-orm';

export async function createOrder(req: Request, res: Response) {
  try {
    const { items } = req.cleanBody;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Calculate amounts
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const platformFee = subtotal * 0.1; // 10% platform fee
    const shippingCost = 2000; // Fixed shipping for now
    const totalAmount = subtotal + shippingCost;
    const sellerAmount = subtotal - platformFee;

    const [newOrder] = await db
      .insert(ordersTable)
      .values({
        userId: Number(userId),
        totalAmount: Number(totalAmount),
        platformFee: Number(platformFee),
        sellerAmount: Number(sellerAmount),
        shippingCost: Number(shippingCost),
        status: 'New'
      })
      .returning();

    const orderItems = items.map((item: any) => ({
      orderId: newOrder.id,
      productId: item.id || item.productId,
      sellerId: item.sellerId || 1,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));

    const newOrderItems = await db
      .insert(orderItemsTable)
      .values(orderItems)
      .returning();

    res.status(201).json({ ...newOrder, items: newOrderItems });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Internal server error while creating order' });
  }
}

// if req.role is admin, return all orders
// if req.role is seller, return orders by sellerId
// else, return only orders filtered by req.userId
export async function listOrders(req: Request, res: Response) {
  try {
    const orders = await db.select().from(ordersTable);
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function getOrder(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);

    // TODO: required to setup the relationship
    // const result = await db.query.ordersTable.findFirst({
    //   where: eq(ordersTable.id, id),
    //   with: {
    //     items: true,
    //   },
    // });

    const orderWithItems = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

    if (orderWithItems.length === 0) {
      res.status(404).send('Order not found');
    }

    const mergedOrder = {
      ...orderWithItems[0].orders,
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
