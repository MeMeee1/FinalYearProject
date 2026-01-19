DO $$ BEGIN
 CREATE TYPE "public"."lga_enum" AS ENUM('Abaji', 'Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fulfillment_points" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fulfillment_points_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"lga" "lga_enum" NOT NULL,
	"instructions" text,
	"isActive" boolean DEFAULT true,
	"canVerifyVendors" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lga" "lga_enum";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fulfillmentPointId" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "pickupCode" varchar(6);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deliveryStatus" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "lga" "lga_enum";--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "assignedVerificationPointId" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_fulfillmentPointId_fulfillment_points_id_fk" FOREIGN KEY ("fulfillmentPointId") REFERENCES "public"."fulfillment_points"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vendors" ADD CONSTRAINT "vendors_assignedVerificationPointId_fulfillment_points_id_fk" FOREIGN KEY ("assignedVerificationPointId") REFERENCES "public"."fulfillment_points"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "phone";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "country";