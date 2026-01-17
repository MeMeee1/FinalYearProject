import {
  integer,
  pgTable,
  varchar,
  text,
  doublePrecision,
  timestamp,

} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { vendorsTable } from './vendorsSchema';
import { z } from 'zod';
export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sellerId: integer().references(() => vendorsTable.id).default(1),

  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: text(), // Changed to text to support JSON string of multiple images
  video: text(), // URL to the product video
  price: doublePrecision().notNull(),
  //Tags
  productTags: varchar({ length: 255, enum: ['Chicken', 'Fish', 'Eggs'] }).notNull().default('Chicken'),
  // Inventory
  stock: integer().notNull().default(0),
  sku: varchar({ length: 100 }),

  // Status
  status: varchar({ length: 50, enum: ['active', 'draft', 'out_of_stock'] }).notNull().default('active'),

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  sellerId: true, // Omit sellerId - it's set by the backend from the authenticated vendor
  createdAt: true,
  updatedAt: true,
}).extend({
  images: z.array(z.string()).optional(),
  video: z.string().optional(),
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    images: z.array(z.string()).optional(),
  });
