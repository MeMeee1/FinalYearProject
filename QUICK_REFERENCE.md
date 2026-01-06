# Quick Reference: API Routes

## Product Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/products` | No | List products (paginated, optional geo filter) |
| GET | `/products/by-distance` | No | Products sorted by distance |
| GET | `/products/seller/:id` | No | Get vendor's products |
| GET | `/products/:id` | No | Get single product details |
| POST | `/products` | Yes* | Create product |
| PUT | `/products/:id` | Yes* | Update product |
| DELETE | `/products/:id` | Yes* | Delete product |

*Seller/Admin required

## Vendor Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/vendors` | No | List all vendors |
| GET | `/vendors/by-id/:id` | No | Get vendor details |
| GET | `/vendors/profile/me` | Yes | Get my vendor profile |
| GET | `/vendors/stats/me` | Yes | Get my vendor statistics |
| POST | `/vendors` | Yes | Create vendor profile |
| PUT | `/vendors/profile/me` | Yes | Update vendor profile |

## Admin Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/vendors/pending` | Admin | List pending vendors |
| POST | `/admin/vendors/:id/approve` | Admin | Approve vendor |
| POST | `/admin/vendors/:id/reject` | Admin | Reject vendor |
| POST | `/admin/vendors/:id/suspend` | Admin | Suspend vendor |
| GET | `/admin/vendors/:id/analytics` | Admin | Get vendor analytics |
| GET | `/admin/platform/stats` | Admin | Get platform stats |

---

## Query Parameters

### Pagination (All list endpoints)
```
?page=1&limit=10
```

### Geolocation (Product endpoints)
```
?latitude=40.7128&longitude=-74.0060&maxDistance=50
```

### Combined
```
?page=1&limit=10&latitude=40.7128&longitude=-74.0060&maxDistance=50
```

---

## Response Format

### List Endpoints
```json
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasMore": true
  }
}
```

### Single Item
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  ...
}
```

### Distance Response
```json
{
  "data": [
    {
      "id": 1,
      "distance": 2.3,
      ...
    }
  ]
}
```

---

## Key Features

### Pagination
- Default: page=1, limit=10
- Returns `hasMore` flag for infinite scroll
- Returns `totalPages` for pagination controls

### Geolocation
- Uses Haversine formula
- Distance in kilometers
- Filters AND sorts by distance
- Requires: latitude, longitude, maxDistance

### Multi-Vendor
- Each product has `sellerId`
- Sellers manage own products
- Vendor info in product responses
- Vendor storefronts available

### Vendor Approval
- Register as seller → "pending"
- Admin approves → "active"
- Vendor can create products after approval

---

## Error Codes

| Code | Message |
|------|---------|
| 400 | Invalid parameters (page, limit must be > 0) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not vendor/admin) |
| 404 | Not found |
| 500 | Server error |

---

## Testing

### Nearby Products (50km from NYC)
```bash
curl "http://localhost:3000/products/by-distance?latitude=40.7128&longitude=-74.0060&maxDistance=50&page=1&limit=10"
```

### Vendor Products (Paginated)
```bash
curl "http://localhost:3000/products/seller/1?page=1&limit=20"
```

### My Profile
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/vendors/profile/me
```

### Admin: Approve Vendor
```bash
curl -X POST -H "Authorization: Bearer ADMIN_TOKEN" http://localhost:3000/admin/vendors/1/approve
```

---

## Implementation Files

### Controllers
- `api/src/routes/products/productsController.ts` - Updated with pagination & geo
- `api/src/routes/vendors/vendorsController.ts` - Vendor management (228 lines)
- `api/src/routes/admin/vendorManagementController.ts` - Admin vendor mgmt (159 lines)

### Routes
- `api/src/routes/products/index.ts` - Updated product routes
- `api/src/routes/vendors/index.ts` - New vendor routes
- `api/src/routes/admin/index.ts` - New admin routes

### Main API
- `api/src/index.ts` - Registered new route modules

### Documentation
- `API_ENDPOINTS.md` - Full API documentation with examples
- `IMPLEMENTATION_GUIDE.md` - Technical implementation details
- `CHANGES_SUMMARY.md` - Summary of all changes

---

## Database Fields (Required)

**Products:**
- `sellerId`, `latitude`, `longitude`, `productAddress`, `stock`, `sku`, `status`, `createdAt`, `updatedAt`

**Vendors:**
- `userId`, `storeName`, `businessAddress`, `status`, `platformCommissionRate`, `createdAt`, `updatedAt`

**Users:**
- `latitude`, `longitude`, `address`, `role`, `isApproved`

---

## Next: Generate Migrations

After verifying the code:
```bash
cd api
npm run db:generate
npm run db:migrate
```

Then test the endpoints!
