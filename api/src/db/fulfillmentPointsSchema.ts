
import { pgTable, text, boolean, integer, timestamp, pgEnum, doublePrecision } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Define the LGA Enum
export const lgaEnum = pgEnum('lga_enum', [
    'Abaji',
    'Abuja Municipal',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Kwali'
]);

export const fulfillmentPointsTable = pgTable('fulfillment_points', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(), // e.g., "Wuse Vet Clinic"
    address: text().notNull(),
    city: text().notNull(),
    lga: lgaEnum().notNull(),

    instructions: text(), // e.g., "Enter through the side gate"

    isActive: boolean().default(true),
    canVerifyVendors: boolean().default(false), // TRUE for Vets

    platformCommissionRate: doublePrecision().default(5.0), // Platform cut for processing orders at this point

    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

export const insertFulfillmentPointSchema = createInsertSchema(fulfillmentPointsTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const updateFulfillmentPointSchema = createInsertSchema(fulfillmentPointsTable)
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .partial();
