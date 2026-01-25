import { integer, pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { lgaEnum } from './fulfillmentPointsSchema.js';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50, enum: ['user', 'admin', 'seller'] }).notNull().default('user'),

  name: varchar({ length: 255 }),
  address: text(), // General address
  city: varchar({ length: 100 }).default('Abuja'),
  country: varchar({ length: 100 }).default('Nigeria'),
  lga: lgaEnum(), // For personalized recommendations
  dateOfBirth: timestamp(),
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
