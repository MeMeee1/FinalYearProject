-- ============================================
-- SEED DATA FOR FULLSTACK ECOMMERCE PLATFORM
-- ============================================
-- This script populates the database with realistic sample data
-- Run this after your migrations are complete

-- ============================================
-- 1. USERS (buyers, sellers, admins)
-- ============================================
-- Password for all users: "password123" (hashed with bcrypt)
-- Hash: $2a$10$YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K

INSERT INTO users (email, password, role, name, address, longitude, latitude, phone, "isApproved", "createdAt") VALUES
-- Admin user
('admin@ecommerce.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'admin', 'Admin User', '123 Admin St, New York, NY 10001', '-73.935242', '40.730610', '+1234567890', true, NOW()),

-- Seller users (will have vendor profiles)
('seller1@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'seller', 'John Vendor', '456 Market St, San Francisco, CA 94102', '-122.419906', '37.774929', '+1234567891', true, NOW()),
('seller2@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'seller', 'Sarah Store', '789 Commerce Ave, Los Angeles, CA 90012', '-118.243683', '34.052235', '+1234567892', true, NOW()),
('seller3@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'seller', 'Mike Merchant', '321 Trade Blvd, Chicago, IL 60601', '-87.629799', '41.878113', '+1234567893', true, NOW()),
('seller4@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'seller', 'Emily Enterprise', '654 Business Park, Austin, TX 78701', '-97.743057', '30.267153', '+1234567894', true, NOW()),
('seller5@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'seller', 'David Dealer', '987 Shop Lane, Miami, FL 33101', '-80.191788', '25.761681', '+1234567895', false, NOW()),

-- Regular users (buyers)
('buyer1@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'user', 'Alice Buyer', '111 Customer St, Seattle, WA 98101', '-122.335167', '47.606209', '+1234567896', false, NOW()),
('buyer2@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'user', 'Bob Customer', '222 Shopper Ave, Boston, MA 02101', '-71.057083', '42.360081', '+1234567897', false, NOW()),
('buyer3@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'user', 'Carol Consumer', '333 Buyer Rd, Denver, CO 80202', '-104.990251', '39.739236', '+1234567898', false, NOW()),
('buyer4@example.com', '$2a$10$rKZYzJQVGZ9YQhF4P6LKZ8QX5xX5xX5xOJ8K8K8K8K8K8K8K8K8K8', 'user', 'Daniel User', '444 Purchase Pl, Portland, OR 97201', '-122.676483', '45.523064', '+1234567899', false, NOW());

-- ============================================
-- 2. VENDORS
-- ============================================
INSERT INTO vendors ("userId", "storeName", "storeDescription", "storeLogo", "storeBanner", "businessName", "businessAddress", "businessEmail", "businessPhone", status, "platformCommissionRate", "createdAt", "updatedAt") VALUES
-- Active vendors
(2, 'TechHub Electronics', 'Your one-stop shop for all electronics and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', 'TechHub LLC', '456 Market St, San Francisco, CA 94102', 'contact@techhub.com', '+1234567891', 'active', 10.0, NOW(), NOW()),

(3, 'Fashion Forward', 'Trendy clothing and accessories for modern lifestyle', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', 'Fashion Forward Inc', '789 Commerce Ave, Los Angeles, CA 90012', 'info@fashionforward.com', '+1234567892', 'active', 10.0, NOW(), NOW()),

(4, 'Home & Garden Paradise', 'Everything you need for your home and garden', 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800', 'Home Garden Co', '321 Trade Blvd, Chicago, IL 60601', 'hello@homegardenparadise.com', '+1234567893', 'active', 10.0, NOW(), NOW()),

(5, 'Gourmet Foods Market', 'Premium quality foods and ingredients', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800', 'Gourmet Foods LLC', '654 Business Park, Austin, TX 78701', 'sales@gourmetfoods.com', '+1234567894', 'active', 10.0, NOW(), NOW()),

-- Pending vendor
(6, 'Sports World', 'Athletic gear and sports equipment for champions', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', 'Sports World Inc', '987 Shop Lane, Miami, FL 33101', 'contact@sportsworld.com', '+1234567895', 'pending', 10.0, NOW(), NOW());

-- ============================================
-- 3. PRODUCTS
-- ============================================
INSERT INTO products ("sellerId", name, description, image, price, stock, sku, status, "productAddress", longitude, latitude, "createdAt", "updatedAt") VALUES
-- TechHub Electronics (Vendor 1) - 15 products
(1, 'iPhone 15 Pro Max', 'Latest flagship smartphone with A17 Pro chip and titanium design', 'https://images.unsplash.com/photo-1592286927505-ae7d6e4f7f1a?w=500', 1199.99, 50, 'TECH-001', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Samsung Galaxy S24 Ultra', '6.8" AMOLED display with S-Pen and 200MP camera', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 1299.99, 35, 'TECH-002', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'MacBook Pro 16"', 'M3 Max chip with 36GB RAM, perfect for professionals', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 2499.99, 20, 'TECH-003', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Sony WH-1000XM5 Headphones', 'Industry-leading noise cancellation with 30-hour battery', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 399.99, 75, 'TECH-004', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'iPad Air M2', '11-inch Liquid Retina display with Apple Pencil support', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 599.99, 60, 'TECH-005', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Apple Watch Series 9', 'Advanced health monitoring with always-on display', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500', 429.99, 45, 'TECH-006', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'AirPods Pro 2nd Gen', 'Active noise cancellation with spatial audio', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500', 249.99, 100, 'TECH-007', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Samsung 55" QLED TV', '4K Smart TV with Quantum HDR and gaming mode', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', 899.99, 25, 'TECH-008', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Canon EOS R6 Mark II', 'Full-frame mirrorless camera with 24.2MP sensor', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', 2499.99, 15, 'TECH-009', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'DJI Mini 4 Pro Drone', 'Lightweight drone with 4K HDR video and obstacle sensing', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500', 759.99, 30, 'TECH-010', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'PlayStation 5 Digital', 'Next-gen gaming console with 1TB SSD', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500', 449.99, 40, 'TECH-011', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Nintendo Switch OLED', 'Handheld gaming with vibrant 7-inch OLED screen', 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500', 349.99, 55, 'TECH-012', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Logitech MX Master 3S', 'Advanced wireless mouse for productivity', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 99.99, 80, 'TECH-013', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Mechanical Keyboard RGB', 'Cherry MX switches with customizable backlighting', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', 149.99, 65, 'TECH-014', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),
(1, 'Webcam 4K Pro', 'Professional streaming with auto-framing and HDR', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 199.99, 50, 'TECH-015', 'active', '456 Market St, San Francisco, CA', '-122.419906', '37.774929', NOW(), NOW()),

-- Fashion Forward (Vendor 2) - 15 products
(2, 'Designer Leather Jacket', 'Premium genuine leather with modern fit', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 299.99, 30, 'FASH-001', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Slim Fit Denim Jeans', 'Comfortable stretch denim in classic blue', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 89.99, 100, 'FASH-002', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Cashmere Blend Sweater', 'Luxuriously soft with ribbed detail', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', 149.99, 45, 'FASH-003', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Summer Floral Dress', 'Light and breezy perfect for warm days', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 79.99, 60, 'FASH-004', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Classic White Sneakers', 'Minimalist design with premium leather', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 119.99, 75, 'FASH-005', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Designer Handbag', 'Italian leather with gold hardware', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', 399.99, 25, 'FASH-006', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Aviator Sunglasses', 'UV protection with polarized lenses', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', 159.99, 85, 'FASH-007', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Wool Blend Coat', 'Elegant double-breasted winter coat', 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500', 249.99, 35, 'FASH-008', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Silk Scarf Collection', 'Hand-rolled edges with artistic patterns', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 69.99, 90, 'FASH-009', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Athletic Joggers', 'Moisture-wicking with tapered fit', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 59.99, 110, 'FASH-010', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Formal Oxford Shoes', 'Full-grain leather dress shoes', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500', 179.99, 50, 'FASH-011', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Cotton T-Shirt 3-Pack', 'Premium comfort fit in classic colors', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 39.99, 150, 'FASH-012', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Yoga Leggings', 'High-waisted with pocket details', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 49.99, 95, 'FASH-013', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Leather Belt', 'Reversible with silver buckle', 'https://images.unsplash.com/photo-1624222247344-550fb60583f2?w=500', 45.99, 120, 'FASH-014', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),
(2, 'Winter Beanie', 'Soft knit with faux fur pom', 'https://images.unsplash.com/photo-1517677129300-07b130802f46?w=500', 24.99, 140, 'FASH-015', 'active', '789 Commerce Ave, Los Angeles, CA', '-118.243683', '34.052235', NOW(), NOW()),

-- Home & Garden Paradise (Vendor 3) - 12 products
(3, 'Robot Vacuum Cleaner', 'Smart mapping with automatic dirt disposal', 'https://images.unsplash.com/photo-1558317374-067fb14fc7cf?w=500', 449.99, 40, 'HOME-001', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Air Purifier HEPA', 'Removes 99.97% of airborne particles', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500', 299.99, 55, 'HOME-002', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Instant Pot 8-Quart', 'Multi-cooker with 15 cooking programs', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 129.99, 70, 'HOME-003', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Dyson Stick Vacuum', 'Cordless with powerful suction', 'https://images.unsplash.com/photo-1558317374-067fb14fc7cf?w=500', 599.99, 30, 'HOME-004', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Smart Thermostat', 'Energy-saving with remote control', 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500', 249.99, 45, 'HOME-005', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Indoor Plant Collection', 'Set of 5 low-maintenance houseplants', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500', 79.99, 60, 'HOME-006', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Kitchen Knife Set', 'German steel with wooden block', 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', 149.99, 50, 'HOME-007', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Memory Foam Mattress', 'Queen size with cooling gel layer', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500', 699.99, 20, 'HOME-008', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'LED Floor Lamp', 'Adjustable brightness with remote', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 89.99, 75, 'HOME-009', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Cordless Power Drill', '20V lithium battery with accessories', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500', 119.99, 40, 'HOME-010', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Garden Hose 100ft', 'Expandable with 9-pattern nozzle', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 49.99, 85, 'HOME-011', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),
(3, 'Outdoor Patio Set', '4-piece wicker furniture with cushions', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500', 899.99, 15, 'HOME-012', 'active', '321 Trade Blvd, Chicago, IL', '-87.629799', '41.878113', NOW(), NOW()),

-- Gourmet Foods Market (Vendor 4) - 10 products
(4, 'Organic Coffee Beans', 'Single-origin Ethiopian arabica 2lb bag', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 24.99, 200, 'FOOD-001', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Extra Virgin Olive Oil', 'Cold-pressed Italian EVOO 750ml', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 34.99, 150, 'FOOD-002', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Artisan Cheese Selection', 'Curated variety pack of 6 cheeses', 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500', 49.99, 80, 'FOOD-003', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Truffle Hot Sauce', 'Gourmet spicy condiment with real truffles', 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=500', 19.99, 120, 'FOOD-004', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Dark Chocolate Collection', 'Assorted 70% cocoa premium bars', 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500', 29.99, 175, 'FOOD-005', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Himalayan Pink Salt', 'Fine ground in glass grinder 8oz', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500', 14.99, 250, 'FOOD-006', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Organic Honey', 'Raw unfiltered wildflower 16oz jar', 'https://images.unsplash.com/photo-1587049352846-4a222e784343?w=500', 18.99, 190, 'FOOD-007', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Pasta Variety Pack', 'Italian bronze-cut artisan pasta', 'https://images.unsplash.com/photo-1551462147-37d48ecb70e2?w=500', 22.99, 140, 'FOOD-008', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Green Tea Matcha', 'Ceremonial grade from Japan 100g', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500', 39.99, 95, 'FOOD-009', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW()),
(4, 'Spice Gift Set', 'Collection of 12 essential spices', 'https://images.unsplash.com/photo-1596040033229-a0b2f7906c9e?w=500', 44.99, 110, 'FOOD-010', 'active', '654 Business Park, Austin, TX', '-97.743057', '30.267153', NOW(), NOW());

-- ============================================
-- 4. ORDERS
-- ============================================
INSERT INTO orders ("userId", "sellerId", status, "totalAmount", "platformFee", "sellerAmount", "shippingAddress", "shippingCost", "paymentStatus", "createdAt", "updatedAt") VALUES
-- Recent orders (last 2 weeks)
(7, 1, 'delivered', 1599.98, 159.998, 1439.982, '111 Customer St, Seattle, WA 98101', 15.00, 'paid', NOW() - INTERVAL '2 days', NOW()),
(8, 2, 'processing', 459.97, 45.997, 413.973, '222 Shopper Ave, Boston, MA 02101', 12.00, 'paid', NOW() - INTERVAL '3 days', NOW()),
(9, 3, 849.98, 84.998, 764.982, '333 Buyer Rd, Denver, CO 80202', 20.00, 'paid', NOW() - INTERVAL '5 days', NOW()),
(10, 1, 'delivered', 2949.98, 294.998, 2654.982, '444 Purchase Pl, Portland, OR 97201', 0.00, 'paid', NOW() - INTERVAL '7 days', NOW()),
(7, 4, 'delivered', 164.95, 16.495, 148.455, '111 Customer St, Seattle, WA 98101', 8.00, 'paid', NOW() - INTERVAL '9 days', NOW()),
(8, 1, 'pending', 549.99, 54.999, 494.991, '222 Shopper Ave, Boston, MA 02101', 15.00, 'pending', NOW() - INTERVAL '1 day', NOW()),
(9, 2, 'processing', 328.97, 32.897, 296.073, '333 Buyer Rd, Denver, CO 80202', 10.00, 'paid', NOW() - INTERVAL '4 days', NOW()),
(10, 3, 'delivered', 729.98, 72.998, 656.982, '444 Purchase Pl, Portland, OR 97201', 18.00, 'paid', NOW() - INTERVAL '11 days', NOW()),

-- Older orders (last month)
(7, 2, 'delivered', 299.99, 29.999, 269.991, '111 Customer St, Seattle, WA 98101', 12.00, 'paid', NOW() - INTERVAL '15 days', NOW()),
(8, 3, 'delivered', 449.99, 44.999, 404.991, '222 Shopper Ave, Boston, MA 02101', 15.00, 'paid', NOW() - INTERVAL '18 days', NOW()),
(9, 1, 'delivered', 1199.99, 119.999, 1079.991, '333 Buyer Rd, Denver, CO 80202', 0.00, 'paid', NOW() - INTERVAL '20 days', NOW()),
(10, 4, 'delivered', 94.96, 9.496, 85.464, '444 Purchase Pl, Portland, OR 97201', 8.00, 'paid', NOW() - INTERVAL '22 days', NOW()),
(7, 1, 'delivered', 649.98, 64.998, 584.982, '111 Customer St, Seattle, WA 98101', 15.00, 'paid', NOW() - INTERVAL '25 days', NOW()),
(8, 2, 'delivered', 189.98, 18.998, 170.982, '222 Shopper Ave, Boston, MA 02101', 10.00, 'paid', NOW() - INTERVAL '28 days', NOW()),
(9, 3, 'delivered', 299.99, 29.999, 269.991, '333 Buyer Rd, Denver, CO 80202', 12.00, 'paid', NOW() - INTERVAL '30 days', NOW());

-- ============================================
-- 5. ORDER ITEMS
-- ============================================
INSERT INTO order_items ("orderId", "productId", "sellerId", quantity, price, subtotal) VALUES
-- Order 1 items
(1, 1, 1, 1, 1199.99, 1199.99),
(1, 7, 1, 1, 249.99, 249.99),
(1, 13, 1, 1, 99.99, 99.99),
(1, 14, 1, 1, 149.99, 149.99),

-- Order 2 items
(2, 16, 2, 1, 299.99, 299.99),
(2, 18, 2, 1, 149.99, 149.99),

-- Order 3 items
(3, 28, 3, 1, 449.99, 449.99),
(3, 29, 3, 1, 299.99, 299.99),
(3, 33, 3, 1, 119.99, 119.99),

-- Order 4 items
(4, 3, 1, 1, 2499.99, 2499.99),
(4, 4, 1, 1, 399.99, 399.99),

-- Order 5 items
(5, 44, 4, 2, 24.99, 49.98),
(5, 45, 4, 1, 34.99, 34.99),
(5, 48, 4, 1, 19.99, 19.99),
(5, 50, 4, 2, 29.99, 59.98),

-- Order 6 items
(6, 8, 1, 1, 899.99, 899.99),

-- Order 7 items
(7, 20, 2, 1, 89.99, 89.99),
(7, 27, 2, 2, 39.99, 79.98),
(7, 22, 2, 1, 119.99, 119.99),

-- Order 8 items
(8, 35, 3, 1, 149.99, 149.99),
(8, 36, 3, 1, 129.99, 129.99),
(8, 38, 3, 1, 699.99, 699.99),

-- Order 9 items
(9, 16, 2, 1, 299.99, 299.99),

-- Order 10 items
(10, 28, 3, 1, 449.99, 449.99),

-- Order 11 items
(11, 1, 1, 1, 1199.99, 1199.99),

-- Order 12 items
(12, 44, 4, 2, 24.99, 49.98),
(12, 46, 4, 1, 49.99, 49.99),

-- Order 13 items
(13, 4, 1, 1, 399.99, 399.99),
(13, 7, 1, 1, 249.99, 249.99),

-- Order 14 items
(14, 27, 2, 3, 39.99, 119.97),
(14, 30, 2, 1, 59.99, 59.99),

-- Order 15 items
(15, 29, 3, 1, 299.99, 299.99);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify data was inserted correctly:

-- SELECT COUNT(*) as total_users FROM users;
-- SELECT COUNT(*) as total_vendors FROM vendors;
-- SELECT COUNT(*) as total_products FROM products;
-- SELECT COUNT(*) as total_orders FROM orders;
-- SELECT COUNT(*) as total_order_items FROM order_items;

-- View platform stats:
-- SELECT 
--   (SELECT COUNT(*) FROM vendors WHERE status = 'active') as active_vendors,
--   (SELECT COUNT(*) FROM vendors WHERE status = 'pending') as pending_vendors,
--   (SELECT COUNT(*) FROM products WHERE status = 'active') as active_products,
--   (SELECT COUNT(*) FROM orders) as total_orders,
--   (SELECT SUM("platformFee") FROM orders) as total_platform_revenue;
