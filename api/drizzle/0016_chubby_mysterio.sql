ALTER TABLE "orders" ADD COLUMN "paystackReference" varchar(255);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "escrowStatus" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fulfillmentFee" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "notes" text;