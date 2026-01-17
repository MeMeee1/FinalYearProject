import { integer, pgTable, varchar, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from './usersSchema';
export const vendorsTable = pgTable('vendors', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull().unique(),
  stripeAccountId: varchar({ length: 255 }), // For Stripe Connect payouts
  // Store Information
  storeName: varchar({ length: 255 }).notNull(),
  storeDescription: text(),
  storeLogo: varchar({ length: 500 }),
  storeBanner: varchar({ length: 500 }),

  // Business Details
  businessName: varchar({ length: 255 }),
  businessAddress: text(),
  city: varchar({ length: 100 }),
  country: varchar({ length: 100 }),

  // Contact
  businessEmail: varchar({ length: 255 }),
  businessPhone: varchar({ length: 50 }),
  businessAccountNumber: varchar({ length: 20 }).default('0000000000'),
  businessBankName: varchar({ length: 255 }),

  // Status
  status: varchar({ length: 50, enum: ['pending', 'active', 'suspended'] }).notNull().default('pending'), // pending, active, suspended

  // Commission
  platformCommissionRate: doublePrecision().default(10.0), // Platform takes 10%

  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),

});
export const createVendorSchema = createInsertSchema(vendorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
export const updateVendorSchema = createInsertSchema(vendorsTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();