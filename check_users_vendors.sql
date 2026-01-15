-- Run this in Drizzle Studio SQL tab to see user-vendor relationships

SELECT 
    u.id as user_id,
    u.email,
    u.role,
    v.id as vendor_id,
    v."storeName",
    v.status as vendor_status
FROM users u
LEFT JOIN vendors v ON v."userId" = u.id
WHERE u.role = 'seller'
ORDER BY u.id;
