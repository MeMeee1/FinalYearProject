import { integer, pgTable, varchar, text ,boolean,timestamp} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255, enum: ['user', 'admin','seller'] }).notNull().default('user'),

  name: varchar({ length: 255 }),
  address: text().notNull().default(''),
  longitude: varchar({ length: 50 }).notNull().default(''),
  latitude: varchar({ length: 50 }).notNull().default(''),
  phone: varchar({ length: 13 }),

  isApproved: boolean().default(false), // Admin must approve sellers
  stripeAccountId: varchar({ length: 255 }), // For Stripe Connect payouts
  
  createdAt: timestamp().notNull().defaultNow(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  role: true,
  createdAt: true,
  longitude: true,
  latitude: true,
});

export const loginSchema = createInsertSchema(usersTable).pick({
  email: true,
  password: true,
});
