# 🔧 Vendors Portal - Troubleshooting Guide

## Issue: "fetch failed" Error

### Symptoms
```
Error: fetch failed
api\orders.ts (42:20)
```

### Root Causes
1. **Backend API is not running** ← Most common
2. `NEXT_PUBLIC_API_URL` is not set correctly
3. API server is on a different port
4. Network/firewall issues

---

## ✅ Solution Steps

### Step 1: Start the Backend API

The backend API must be running on port 3001. Open a **new terminal**:

```bash
cd ../api
npm install
npm run dev
```

You should see:
```
Example app listening on port 3001
```

### Step 2: Verify Environment Variables

Check that `vendors/.env` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Restart the Vendors Portal

In the vendors terminal:
```bash
# Clear cache
rm -rf .next

# Restart dev server
npm run dev
```

### Step 4: Test the Connection

In your browser, visit:
- Landing page: `http://localhost:3000`
- If it works, proceed to login
- If still failing, check backend logs

---

## 🔍 Debugging Checklist

### Is Backend Running?
```bash
# Check if port 3001 is listening
lsof -i :3001              # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

Should show something like:
```
node    12345  user   ...  localhost:3001  LISTEN
```

### Is Frontend Running?
```bash
# Check if port 3000 is listening
lsof -i :3000              # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Check Environment Variables
In browser DevTools Console:
```javascript
// This should NOT be undefined
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log('API URL:', apiUrl);
```

If undefined, environment variables aren't loaded.

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Look for requests to `/orders`
4. Click on failed request
5. Check Response tab for details

---

## 🚀 Complete Setup from Scratch

### Terminal 1: Backend
```bash
cd api
npm install
npm run dev

# Should see: "Example app listening on port 3001"
```

### Terminal 2: Frontend (Vendors)
```bash
cd vendors
npm install
npm run dev

# Should see: "ready - started server on 0.0.0.0:3000"
```

### Terminal 3: Database (if needed)
```bash
# Check if you need to run migrations
cd api
npm run db:migrate
```

---

## ❌ Common Issues & Fixes

### Issue 1: "Cannot connect to API server at http://localhost:3001"

**Cause:** Backend not running

**Fix:**
```bash
# Terminal 1
cd api
npm run dev

# Terminal 2 (keep open)
cd vendors
npm run dev
```

---

### Issue 2: "NEXT_PUBLIC_API_URL not set"

**Cause:** `.env` file not found or not loaded

**Fix:**
1. Check `.env` file exists in vendors folder
2. It should contain: `NEXT_PUBLIC_API_URL=http://localhost:3001`
3. Restart development server: `npm run dev`

---

### Issue 3: "Port 3000/3001 already in use"

**Fix:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9       # macOS/Linux
taskkill /PID <PID> /F              # Windows

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9       # macOS/Linux
taskkill /PID <PID> /F              # Windows

# Then restart
npm run dev
```

---

### Issue 4: "Vendor profile not found"

**Cause:** Token is invalid or user isn't a vendor

**Fix:**
1. Make sure you're logged in as a vendor (role = 'seller')
2. Try logging out and logging back in
3. Check backend logs for errors

---

### Issue 5: ".next folder issues"

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart
npm run dev
```

---

## 📋 Pre-flight Checklist

Before reporting issues, verify:

- [ ] Backend API running on port 3001?
- [ ] Frontend running on port 3000?
- [ ] `.env` file in vendors folder?
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env`?
- [ ] Both projects have `node_modules` installed?
- [ ] Using Node.js 18+?
- [ ] No port conflicts?
- [ ] No firewall blocking localhost?

---

## 🆘 Advanced Debugging

### Check Backend Logs

Open the backend terminal and look for:
```
❌ Error messages
⚠️ Warnings
✅ Successful requests
```

### Check Frontend Logs

Open browser DevTools Console (F12) and look for:
```javascript
❌ Red error messages
⚠️ Yellow warnings (usually okay)
✅ Blue info messages
```

### Monitor Network Activity

In DevTools Network tab:
1. Filter by XHR/Fetch
2. Look for `/orders`, `/vendors`, `/products` requests
3. Check Response and Headers tabs
4. Status code should be 200

---

## 💾 Database Issues

### If Database Connection Fails

```bash
cd api

# Check database connection
npm run db:studio

# Run migrations if needed
npm run db:migrate

# Generate database
npm run db:generate
```

---

## 🔗 Port Reference

| Service | Port | Process |
|---------|------|---------|
| Frontend (Vendors) | 3000 | npm run dev |
| Backend API | 3001 | npm run dev |
| Database Studio | 5555 | npm run db:studio |

---

## 📊 Expected Output

### Backend Should Show:
```
> ecommerce-api@1.0.0 dev
> node --import=tsx --watch --env-file=.env src/index.ts

Example app listening on port 3001
```

### Frontend Should Show:
```
> vendor-dashboard@1.0.0 dev
> next dev

  ▲ Next.js 14.2.15
  - Local:        http://localhost:3000
  - Environments: .env

✓ Ready in 2.5s
```

---

## ✅ Verification Steps

### 1. Backend Connection Test
Open terminal and run:
```bash
curl http://localhost:3001/ping/test
```

Should return: `"pong"`

### 2. Frontend Load Test
Visit in browser:
```
http://localhost:3000
```

Should load the landing page without errors

### 3. Login Test
1. Go to login page
2. Use vendor credentials
3. Should redirect to dashboard
4. Dashboard should load data

---

## 📞 If All Else Fails

1. **Restart everything:**
   - Close all terminals (Ctrl+C)
   - Close all browser tabs
   - Clear browser cache (Ctrl+Shift+Delete)
   - Start backend first, then frontend

2. **Clean install:**
   ```bash
   # In both api and vendors folders
   rm -rf node_modules package-lock.json .next .open-next
   npm install
   npm run dev
   ```

3. **Check Node version:**
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

4. **Check npm version:**
   ```bash
   npm --version
   # Should be 9.0.0 or higher
   ```

---

## 📝 Detailed Error Messages

### Error: "Cannot GET /orders"
- **Cause:** API doesn't have `/orders` endpoint
- **Fix:** Check API routes are implemented

### Error: "401 Unauthorized"
- **Cause:** Token is missing or invalid
- **Fix:** Login again, check token in cookies

### Error: "Network Error"
- **Cause:** API unreachable
- **Fix:** Check backend is running, check firewall

### Error: "Unexpected token"
- **Cause:** API returned invalid JSON
- **Fix:** Check API response, check backend logs

---

**The most common issue is the backend not running. Make sure to start it first!**

If you need more help, check the console output for specific error messages.
