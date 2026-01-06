# Multi-Vendor API Endpoints Documentation

## Product Routes

### Public Product Endpoints

#### List Products with Pagination & Geolocation
**GET** `/products`
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- latitude?: number (user's latitude for distance filtering)
- longitude?: number (user's longitude for distance filtering)
- maxDistance?: number (in km, only used if lat/lon provided)

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 99.99,
      "stock": 10,
      "distance": 5.2, // in km (only if user coordinates provided)
      "vendor": {
        "id": 1,
        "storeName": "Store Name",
        "storeDescription": "...",
        "businessAddress": "..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasMore": true
  }
}
```

Example:
```
GET /products?page=1&limit=10&latitude=40.7128&longitude=-74.0060&maxDistance=50
```

#### Get Product by Distance (Sorted by Closest)
**GET** `/products/by-distance`
```
Query Parameters:
- latitude: number (required, user's latitude)
- longitude: number (required, user's longitude)
- maxDistance: number (required, in km)
- page?: number (default: 1)
- limit?: number (default: 10)

Response: Same as listProducts (sorted by distance ascending)
```

Example:
```
GET /products/by-distance?latitude=40.7128&longitude=-74.0060&maxDistance=50&page=1&limit=10
```

#### Get Products by Seller (Vendor Storefront)
**GET** `/products/seller/:sellerId`
```
Path Parameters:
- sellerId: number

Query Parameters:
- page?: number (default: 1)
- limit?: number (default: 10)

Response: Products from specific vendor with pagination
```

Example:
```
GET /products/seller/5?page=1&limit=20
```

#### Get Single Product Details
**GET** `/products/:id`
```
Path Parameters:
- id: number

Response:
{
  "id": 1,
  "name": "Product Name",
  "description": "...",
  "price": 99.99,
  "stock": 10,
  "sku": "SKU123",
  "status": "active",
  "productAddress": "123 Main St",
  "latitude": "40.7128",
  "longitude": "-74.0060",
  "vendor": {
    "id": 1,
    "storeName": "Store Name",
    "businessAddress": "...",
    "businessPhone": "...",
    "businessEmail": "..."
  }
}
```

### Protected Product Endpoints (Seller/Admin)

#### Create Product
**POST** `/products`
```
Headers:
- Authorization: Bearer <token>

Body:
{
  "name": "Product Name",
  "description": "...",
  "image": "https://...",
  "price": 99.99,
  "stock": 10,
  "sku": "SKU123",
  "status": "active",
  "productAddress": "123 Main St",
  "latitude": "40.7128",
  "longitude": "-74.0060"
}

Response: Created product object with 201 status
```

#### Update Product
**PUT** `/products/:id`
```
Headers:
- Authorization: Bearer <token>

Body: (all fields optional)
{
  "name": "Updated Name",
  "price": 89.99,
  "stock": 5,
  "status": "draft",
  ...
}

Response: Updated product object
```

#### Delete Product
**DELETE** `/products/:id`
```
Headers:
- Authorization: Bearer <token>

Response: 204 No Content
```

---

## Vendor Routes

### Public Vendor Endpoints

#### List All Active Vendors
**GET** `/vendors`
```
Query Parameters:
- page?: number (default: 1)
- limit?: number (default: 10)

Response:
{
  "data": [
    {
      "id": 1,
      "storeName": "Store Name",
      "storeDescription": "...",
      "storeLogo": "https://...",
      "storeBanner": "https://...",
      "businessAddress": "...",
      "businessEmail": "...",
      "businessPhone": "...",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### Get Vendor Details
**GET** `/vendors/by-id/:id`
```
Path Parameters:
- id: number

Response: Single vendor object with detailed info
```

### Protected Vendor Endpoints (Seller/Admin)

#### Get My Vendor Profile
**GET** `/vendors/profile/me`
```
Headers:
- Authorization: Bearer <token>

Response: Current user's vendor profile
```

#### Get My Vendor Statistics
**GET** `/vendors/stats/me`
```
Headers:
- Authorization: Bearer <token>

Response:
{
  "vendorId": 1,
  "storeName": "Store Name",
  "totalProducts": 25,
  "activeProducts": 20,
  "outOfStockProducts": 2,
  "status": "active"
}
```

#### Create Vendor Profile
**POST** `/vendors`
```
Headers:
- Authorization: Bearer <token>

Body:
{
  "storeName": "My Store",
  "storeDescription": "...",
  "storeLogo": "https://...",
  "storeBanner": "https://...",
  "businessName": "Business Legal Name",
  "businessAddress": "123 Main St",
  "businessEmail": "business@example.com",
  "businessPhone": "+1234567890"
}

Response: Created vendor object with 201 status
```

#### Update Vendor Profile
**PUT** `/vendors/profile/me`
```
Headers:
- Authorization: Bearer <token>

Body: (all fields optional)
{
  "storeName": "Updated Store Name",
  "storeDescription": "...",
  "businessPhone": "...",
  ...
}

Response: Updated vendor profile
```

---

## Admin Routes

All admin routes require:
- Authorization header with valid token
- User role must be 'admin'

### Vendor Management

#### List Pending Vendor Approvals
**GET** `/admin/vendors/pending`
```
Headers:
- Authorization: Bearer <admin_token>

Query Parameters:
- page?: number (default: 1)
- limit?: number (default: 10)

Response: List of vendors with 'pending' status
```

#### Approve Vendor
**POST** `/admin/vendors/:vendorId/approve`
```
Headers:
- Authorization: Bearer <admin_token>

Path Parameters:
- vendorId: number

Response:
{
  "message": "Vendor approved successfully",
  "vendor": { ... }
}
```

#### Reject Vendor
**POST** `/admin/vendors/:vendorId/reject`
```
Headers:
- Authorization: Bearer <admin_token>

Path Parameters:
- vendorId: number

Body:
{
  "reason": "Business details don't match requirements"
}

Response:
{
  "message": "Vendor rejected successfully",
  "vendor": { ... }
}
```

#### Suspend Vendor
**POST** `/admin/vendors/:vendorId/suspend`
```
Headers:
- Authorization: Bearer <admin_token>

Path Parameters:
- vendorId: number

Body:
{
  "reason": "Violation of terms of service"
}

Response:
{
  "message": "Vendor suspended successfully",
  "vendor": { ... }
}
```

#### Get Vendor Analytics
**GET** `/admin/vendors/:vendorId/analytics`
```
Headers:
- Authorization: Bearer <admin_token>

Path Parameters:
- vendorId: number

Response:
{
  "vendorId": 1,
  "storeName": "Store Name",
  "status": "active",
  "totalProducts": 25,
  "totalOrders": 150,
  "totalRevenue": 15000.00,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get Platform Statistics
**GET** `/admin/platform/stats`
```
Headers:
- Authorization: Bearer <admin_token>

Response:
{
  "totalVendors": 45,
  "activeVendors": 42,
  "pendingVendors": 3,
  "totalOrders": 5000,
  "totalPlatformRevenue": 500000.00
}
```

---

## Key Features

### 1. Pagination
All list endpoints support offset-based pagination:
- `page`: Current page number (1-based)
- `limit`: Items per page
- Response includes `totalPages` and `hasMore` for easy UI implementation

### 2. Geolocation Search (Haversine Formula)
Products can be filtered by proximity to user location:
- Uses standard Haversine distance calculation
- Results sorted by distance (closest first)
- Distance returned in kilometers

**Example Flow:**
```
1. Get user's latitude/longitude (from GPS/address)
2. Call GET /products with lat, lon, and maxDistance
3. Products are filtered and sorted by distance
4. Response includes calculated distance for each product
```

### 3. Multi-Vendor Support
- Each product belongs to a vendor (sellerId)
- Vendors manage their own products
- Vendor information included in product details
- Vendor storefront accessible via `/products/seller/:vendorId`

### 4. Vendor Approval Workflow
1. User registers as seller (POST /auth/register/seller)
2. Vendor profile created with "pending" status
3. Admin approves vendor (POST /admin/vendors/:id/approve)
4. Vendor status changes to "active"
5. Vendor can now create/manage products

### 5. Vendor Statistics
- Track total products, active products, out-of-stock count
- Total orders and revenue per vendor
- Platform-wide statistics for admins

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Page and limit must be positive numbers"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to update this product"
}
```

### 404 Not Found
```json
{
  "message": "Product not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error details"
}
```

---

## Testing Examples

### Get Products Near User Location (50km radius)
```bash
curl "http://localhost:3000/products/by-distance?latitude=40.7128&longitude=-74.0060&maxDistance=50&page=1&limit=10"
```

### Get Products with Optional Distance Filter
```bash
curl "http://localhost:3000/products?page=1&limit=10&latitude=40.7128&longitude=-74.0060&maxDistance=50"
```

### Get All Products from Vendor 1
```bash
curl "http://localhost:3000/products/seller/1?page=1&limit=20"
```

### Get Vendor Profile (Authenticated)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/vendors/profile/me
```

### Create Product (Authenticated)
```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Great product",
    "price": 99.99,
    "stock": 10,
    "latitude": "40.7128",
    "longitude": "-74.0060",
    "productAddress": "123 Main St"
  }'
```

### Admin: List Pending Vendors
```bash
curl -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:3000/admin/vendors/pending
```

### Admin: Approve Vendor
```bash
curl -X POST http://localhost:3000/admin/vendors/5/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
