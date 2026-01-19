import { integer, pgTable, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { lgaEnum } from './fulfillmentPointsSchema';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50, enum: ['user', 'admin', 'seller'] }).notNull().default('user'),

  name: varchar({ length: 255 }),
  address: text(), // General address
  lga: lgaEnum(), // For personalized recommendations
  image: text(),

  updatedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = createInsertSchema(usersTable).pick({
  email: true,
  password: true,
});
