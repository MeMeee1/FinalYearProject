import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: [
    './src/db/productsSchema.ts',
    './src/db/usersSchema.ts',
    './src/db/ordersSchema.ts',
    './src/db/vendorsSchema.ts',
    './src/db/reviewsSchema.ts',
    './src/db/fulfillmentPointsSchema.ts',
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
