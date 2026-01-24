ALTER TABLE "orders" ALTER COLUMN "pickupCode" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "supportsOutsideLgaDelivery" boolean DEFAULT true;