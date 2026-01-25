
import { pgTable, integer, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { usersTable } from './usersSchema.js';
import { productsTable } from './productsSchema.js';

export const reviewsTable = pgTable('reviews', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id).notNull(),
    productId: integer().references(() => productsTable.id).notNull(),

    rating: integer().notNull(), // 1-5
    comment: text(),

    vendorReply: text(), // Vendor's response
    replyDate: timestamp(),

    isVerifiedPurchase: boolean().default(false),

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    isVerifiedPurchase: true,
    vendorReply: true,
    replyDate: true
});

export const updateReviewSchema = createInsertSchema(reviewsTable).pick({
    comment: true,
    rating: true,
});

export const replyReviewSchema = createInsertSchema(reviewsTable).pick({
    vendorReply: true,
});
