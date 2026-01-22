ALTER TABLE "users" ADD COLUMN "city" varchar(100) DEFAULT 'Abuja';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(100) DEFAULT 'Nigeria';--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN IF EXISTS "city";--> statement-breakpoint
ALTER TABLE "vendors" DROP COLUMN IF EXISTS "country";