import { integer, pgTable, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255, enum: ['user', 'admin', 'seller'] }).notNull().default('user'),

  name: varchar({ length: 255 }),
  phone: varchar({ length: 13 }),
  address: text(),
  city: varchar({ length: 255 }).default('Abuja'),
  country: varchar({ length: 255 }).default('Nigeria'),

  createdAt: timestamp().notNull().defaultNow(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  role: true,
  createdAt: true,
});

export const loginSchema = createInsertSchema(usersTable).pick({
  email: true,
  password: true,
});
