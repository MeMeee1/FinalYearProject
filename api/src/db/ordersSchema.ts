import {
  doublePrecision,
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
} from 'drizzle-orm/pg-core';
import { usersTable } from './usersSchema';
import { productsTable } from './productsSchema';
import { vendorsTable } from './vendorsSchema';
import { fulfillmentPointsTable } from './fulfillmentPointsSchema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const ordersTable = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull(),
  sellerId: integer().references(() => vendorsTable.id).default(1),

  // Order Details
  status: varchar({ length: 50 }).notNull().default('New'),
  totalAmount: doublePrecision().notNull(),
  platformFee: doublePrecision().notNull(),
  sellerAmount: doublePrecision().notNull(),

  // Payment
  stripePaymentIntentId: varchar({ length: 255 }),
  paymentStatus: varchar({ length: 50 }).default('pending'),

  // Fulfillment (Pickup)
  fulfillmentPointId: integer().references(() => fulfillmentPointsTable.id),
  pickupCode: varchar({ length: 20 }), // Alphanumeric code for verification (e.g. ABCD-1234)
  deliveryStatus: varchar({ length: 50, enum: ['pending', 'dropped_off', 'collected'] }).default('pending'),

  // Legacy Shipping (Optional fallback)
  shippingAddress: text(),
  shippingMethod: varchar({ length: 100 }),
  shippingCost: doublePrecision().default(0),
  trackingNumber: varchar({ length: 255 }),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});
export const orderItemsTable = pgTable('order_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().references(() => ordersTable.id).notNull(),
  productId: integer().references(() => productsTable.id).notNull(),
  sellerId: integer().references(() => vendorsTable.id).default(1),

  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
  subtotal: doublePrecision().notNull(),//  (price * quantity)
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  totalAmount: true,
  platformFee: true,
  sellerAmount: true,
  pickupCode: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  id: true,
  orderId: true,
  subtotal: true,
});

export const insertOrderWithItemsSchema = z.object({
  order: insertOrderSchema.partial().and(z.object({
    fulfillmentPointId: z.number().optional(),
  })),
  items: z.array(z.object({
    id: z.number(),
    price: z.number(),
    quantity: z.number(),
    sellerId: z.number().optional(),
  })),
});

export const updateOrderSchema = createInsertSchema(ordersTable).pick({
  status: true,
});
