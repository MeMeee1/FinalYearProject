# Implementation Guide - Multi-Vendor Pagination & Geolocation

## What Was Added

### 1. **Product Controller Enhancements** (`productsController.ts`)

#### Offset Pagination
- `page` and `limit` query parameters
- Returns metadata: `total`, `totalPages`, `hasMore`
- Automatic offset calculation: `offset = (page - 1) * limit`
- Used on all list endpoints

#### Haversine Distance Calculation
```typescript
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number
```
- Calculates great-circle distance between two points
- Returns distance in kilometers
- Based on Earth's radius (6371 km)

#### New Controller Functions
1. **`listProducts()`** - Now supports pagination + optional geolocation filtering
2. **`getProductsBySeller()`** - Get products from specific vendor with pagination
3. **`getProductsByDistance()`** - Get products sorted by proximity (with pagination)
4. **`createProduct()`** - Updated to get vendorId from user's vendor profile
5. **`updateProduct()`** - Updated with seller ownership verification
6. **`deleteProduct()`** - Updated with seller ownership verification

### 2. **New Vendor Routes & Controllers**

#### `/routes/vendors/` (Public & Protected)
- **GET `/vendors`** - List all active vendors with pagination
- **GET `/vendors/by-id/:id`** - Get vendor details
- **GET `/vendors/profile/me`** - Get authenticated user's vendor profile
- **GET `/vendors/stats/me`** - Get vendor statistics (product count, etc)
- **POST `/vendors`** - Create new vendor profile
- **PUT `/vendors/profile/me`** - Update vendor profile

#### Vendor Statistics Include
- Total products count
- Active products count
- Out of stock products count
- Vendor status

### 3. **Admin Routes & Controllers**

#### `/routes/admin/` (Admin Only)
- **GET `/admin/vendors/pending`** - List vendors awaiting approval
- **POST `/admin/vendors/:vendorId/approve`** - Approve vendor
- **POST `/admin/vendors/:vendorId/reject`** - Reject vendor
- **POST `/admin/vendors/:vendorId/suspend`** - Suspend vendor
- **GET `/admin/vendors/:vendorId/analytics`** - Get vendor analytics (orders, revenue)
- **GET `/admin/platform/stats`** - Platform-wide statistics

### 4. **Product Routes Updates**

New route endpoints:
```typescript
router.get('/', listProducts);                    // With pagination & geo
router.get('/by-distance', getProductsByDistance); // Distance-sorted
router.get('/seller/:sellerId', getProductsBySeller); // Vendor products
router.get('/:id', getProductById);               // Single product with vendor info
```

---

## Database Schema Requirements

Ensure these fields exist in your schema:

### Products Table
```typescript
latitude: varchar({ length: 50 })
longitude: varchar({ length: 50 })
productAddress: varchar()
sellerId: integer() // foreign key to vendors
stock: integer()
status: varchar() // enum: 'active', 'draft', 'out_of_stock'
```

### Users Table
```typescript
latitude: varchar({ length: 50 })
longitude: varchar({ length: 50 })
address: text()
role: varchar() // enum: 'user', 'seller', 'admin'
isApproved: boolean()
```

### Vendors Table
```typescript
userId: integer() // foreign key to users
storeName: varchar()
businessAddress: text()
status: varchar() // enum: 'pending', 'active', 'suspended'
platformCommissionRate: doublePrecision()
```

---

## How Pagination Works

### Example Request
```
GET /products?page=2&limit=15
```

### Response Structure
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 2,
    "limit": 15,
    "total": 150,        // Total items in database
    "totalPages": 10,    // 150 / 15
    "hasMore": true      // true if page < totalPages
  }
}
```

### Frontend Implementation Pattern
```typescript
// React example
const [page, setPage] = useState(1);
const { data, pagination } = useQuery(`/products?page=${page}&limit=10`);

return (
  <>
    {data.map(product => <ProductCard key={product.id} product={product} />)}
    <button 
      disabled={!pagination.hasMore}
      onClick={() => setPage(page + 1)}
    >
      Load More
    </button>
  </>
);
```

---

## How Geolocation Search Works

### Haversine Formula Overview
The Haversine formula calculates the shortest distance between two points on Earth's surface.

**Formula:**
```
a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
c = 2 * atan2(√a, √(1−a))
d = R * c
```

Where:
- R = Earth's radius (6371 km)
- Δlat, Δlon = differences in latitude/longitude
- d = distance in kilometers

### Two Ways to Use Geolocation

#### Option 1: Filter in List Products
```
GET /products?page=1&limit=10&latitude=40.7128&longitude=-74.0060&maxDistance=50
```
- Returns all products within 50km
- Doesn't guarantee closest first (uses database limit/offset)
- More efficient for small radius

#### Option 2: Dedicated Distance Endpoint
```
GET /products/by-distance?latitude=40.7128&longitude=-74.0060&maxDistance=50&page=1&limit=10
```
- Fetches ALL products, filters client-side
- Sorts by distance (closest first)
- Includes `distance` field in response
- Less efficient for large datasets, but better sorting

### Response with Distance
```json
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "distance": 2.3,  // km from user
      "vendor": { ... }
    },
    {
      "id": 5,
      "name": "Another Product",
      "distance": 8.7,  // km from user
      "vendor": { ... }
    }
  ],
  "pagination": { ... }
}
```

### Frontend Implementation Pattern
```typescript
// Get user location
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);

useEffect(() => {
  navigator.geolocation.getCurrentPosition(position => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  });
}, []);

// Fetch nearby products
const { data } = useQuery(
  `/products/by-distance?latitude=${latitude}&longitude=${longitude}&maxDistance=50&page=1&limit=10`,
  { enabled: !!latitude && !!longitude }
);
```

---

## Vendor-Specific Features

### Vendor Profile Management
When a user registers as "seller", they must create a vendor profile:

1. **Register as Seller**
```typescript
POST /auth/register/seller
{
  "email": "seller@example.com",
  "password": "...",
  "name": "John Seller",
  "address": "123 Business St"
}
```
Response: user with status='pending', isApproved=false

2. **Create Vendor Profile**
```typescript
POST /vendors (requires auth)
{
  "storeName": "My Amazing Store",
  "storeDescription": "We sell great products",
  "businessEmail": "business@example.com",
  "businessPhone": "555-1234",
  "businessAddress": "123 Business St"
}
```
Response: vendor with status='pending'

3. **Admin Approves Vendor**
```typescript
POST /admin/vendors/1/approve (admin only)
```
Response: vendor with status='active'

4. **Now Can Create Products**
```typescript
POST /products (requires auth + seller role)
{
  "name": "Product",
  "price": 99.99,
  "stock": 10,
  "latitude": "40.7128",
  "longitude": "-74.0060",
  "productAddress": "123 Main St"
}
```

### Vendor Statistics
```typescript
GET /vendors/stats/me (authenticated)

Response:
{
  "vendorId": 1,
  "storeName": "My Store",
  "totalProducts": 25,
  "activeProducts": 20,
  "outOfStockProducts": 2,
  "status": "active"
}
```

---

## Database Optimization Tips

### Indexes to Add (for performance)
```sql
-- For pagination queries
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_seller_id ON products(seller_id);

-- For vendor lookup
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_status ON vendors(status);

-- For geolocation (if using PostGIS)
CREATE INDEX idx_products_geom ON products USING GIST (
  ST_GeomFromText('POINT(' || longitude || ' ' || latitude || ')')
);
```

### PostGIS Alternative (More Efficient)
If you want to use PostgreSQL's PostGIS extension for better geospatial queries:

```sql
-- Add geometry column
ALTER TABLE products ADD COLUMN geom GEOMETRY(Point, 4326);

-- Update geometries
UPDATE products SET geom = ST_MakePoint(longitude::float, latitude::float);

-- Query nearby products
SELECT * FROM products 
WHERE ST_Distance(geom, ST_MakePoint(-74.0060, 40.7128)::geography) < 50000; -- 50km in meters
```

But the Haversine implementation provided works fine for most use cases.

---

## Testing Checklist

- [ ] Pagination works on `/products` (page 1, page 2, etc)
- [ ] Pagination shows correct `totalPages` and `hasMore`
- [ ] Geolocation filter returns only products within maxDistance
- [ ] Products sorted by distance on `/by-distance` endpoint
- [ ] Distance field included in response
- [ ] Vendor products endpoint filters correctly
- [ ] Seller can create/update/delete only their products
- [ ] Admin can manage all products
- [ ] Vendor approval workflow works (pending → active)
- [ ] Vendor statistics calculate correctly
- [ ] Admin platform stats aggregate correctly

---

## Troubleshooting

### Q: Products not filtering by distance
**A:** Check that products have valid `latitude` and `longitude` fields (not empty strings)

### Q: Pagination returning wrong count
**A:** Verify query includes `status = 'active'` filter. If counting all products, that might not match filtered results.

### Q: Vendor products endpoint slow
**A:** Add index on `products.seller_id` column

### Q: Admin routes returning 403
**A:** Verify user has `role = 'admin'` in JWT token

### Q: Distance calculation seems wrong
**A:** Ensure coordinates are in decimal degrees format (e.g., 40.7128, -74.0060), not degrees/minutes/seconds
