ALTER TABLE "products" ADD COLUMN "speciesBreed" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "age" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "weightSize" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "growthStage" varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "healthStatus" varchar(100);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "vaccinationStatus" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "diseaseHistory" text;