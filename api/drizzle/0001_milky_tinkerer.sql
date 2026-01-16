ALTER TABLE "products" DROP COLUMN IF EXISTS "productAddress";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "longitude";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "latitude";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "address";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "longitude";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "latitude";