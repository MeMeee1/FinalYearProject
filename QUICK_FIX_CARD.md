# 🚀 Vendors Portal - Quick Start Card

## The Main Issue

Your app is trying to connect to the backend API at `http://localhost:3001` but the API isn't running.

---

## ⚡ Quick Fix (30 seconds)

### Open a NEW Terminal and run:

```bash
cd api
npm run dev
```

Wait for it to say: `Example app listening on port 3001`

Then in your existing Vendors terminal, restart:

```bash
npm run dev
```

That's it! 🎉

---

## 📋 What You Need Running

| What | Where | Port | Command |
|------|-------|------|---------|
| **Backend API** | `api` folder | 3001 | `npm run dev` |
| **Frontend (Vendors)** | `vendors` folder | 3000 | `npm run dev` |

**BOTH must be running!**

---

## ✅ How to Know It's Working

1. Backend Terminal shows:
   ```
   Example app listening on port 3001
   ```

2. Vendors Terminal shows:
   ```
   ✓ Ready in 2.5s
   ```

3. Browser at http://localhost:3000 loads without errors

4. Login works and shows dashboard

---

## 🔧 File Changes Made

To improve error handling, I updated:
- ✅ `config.ts` - Better API URL handling
- ✅ `api/orders.ts` - Better error messages
- ✅ `api/vendors.ts` - Better error messages
- ✅ `api/products.ts` - Better error messages

Now when something fails, you'll see a clear message like:
```
Cannot connect to API server at http://localhost:3001. 
Make sure the backend is running.
```

---

## 📚 For More Help

Read: **VENDORS_TROUBLESHOOTING.md**

It has:
- ✅ Detailed debugging steps
- ✅ Common issues & fixes
- ✅ Port checking commands
- ✅ Environment setup verification
- ✅ Network debugging

---

## 🆘 If It Still Doesn't Work

```bash
# In vendors folder
rm -rf .next

# Restart
npm run dev
```

If still broken:
```bash
# Kill all Node processes
pkill node            # macOS/Linux
taskkill /IM node.exe  # Windows

# Start fresh
# Terminal 1:
cd api && npm run dev

# Terminal 2:
cd vendors && npm run dev
```

---

## 💡 Remember

- **Backend must start FIRST**
- **Both must be running SIMULTANEOUSLY**
- **Use SEPARATE terminals**
- **Check ports 3000 and 3001 are free**

---

Good luck! 🚀
