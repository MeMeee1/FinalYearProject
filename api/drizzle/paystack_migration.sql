-- Paystack Payment Integration Migration
-- Run this SQL directly in your Neon database console or using psql

-- Add new columns to orders table for Paystack integration
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paystack_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS escrow_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS fulfillment_fee DOUBLE PRECISION DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update the delivery_status enum to include 'rejected'
-- Note: If the column is a varchar with enum, the check constraint needs updating
-- If using actual PG enum, you'd need: ALTER TYPE delivery_status_enum ADD VALUE 'rejected';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('paystack_reference', 'escrow_status', 'fulfillment_fee', 'notes');
