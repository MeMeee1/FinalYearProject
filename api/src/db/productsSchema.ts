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
export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sellerId: integer().references(() => vendorsTable.id).default(1),
  
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  
  // Inventory
  stock: integer().notNull().default(0), 
  sku: varchar({ length: 100 }), 
  
  // Status
  status: varchar({ length: 50, enum: ['active', 'draft', 'out_of_stock'] }).notNull().default('active'), 
  
  productAddress: text().notNull().default(''), // Location of the product (seller's address)
  longitude: varchar({ length: 50 }).notNull().default(''),
  latitude: varchar({ length: 50 }).notNull().default(''),
  createdAt: timestamp().notNull().defaultNow(), 
  updatedAt: timestamp().notNull().defaultNow(), 
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();
