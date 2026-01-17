ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "vendors" ADD COLUMN "stripeAccountId" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "isApproved";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "stripeAccountId";--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_userId_unique" UNIQUE("userId");