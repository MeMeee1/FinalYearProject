# Vendors Portal - Setup & Deployment Guide

## Quick Start Guide

### Step 1: Install Dependencies
```bash
cd vendors
npm install
```

### Step 2: Configure Environment
Create `.env.local` in the vendors folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t vendor-dashboard .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.your-domain.com vendor-dashboard
```

---

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.production-domain.com
NODE_ENV=production
```

### Optional
```env
NEXT_PUBLIC_APP_URL=https://vendor.your-domain.com
NEXTAUTH_SECRET=your-secret-key  # if using NextAuth
```

---

## Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Vendors portal implementation"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Choose `vendors` as root directory

### 3. Configure Environment Variables
In Vercel dashboard:
- Set `NEXT_PUBLIC_API_URL` to production API URL

### 4. Deploy
Click "Deploy" and wait for build to complete.

---

## Testing Endpoints

### Local Testing
```bash
# Test the landing page
curl http://localhost:3000

# Test the API (with token)
curl -H "Authorization: your-token" \
  http://localhost:3000/api/vendors/profile/me
```

### API Integration Testing
Make sure your backend API is running:
```bash
# Backend (from api folder)
cd ../api
npm install
npm run dev
```

---

## Troubleshooting

### Issue: "Cannot find module 'next'"
```bash
npm install
npm run dev
```

### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

### Issue: API calls failing
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend API is running
3. Check browser console for errors
4. Verify CORS settings on backend

### Issue: Login not working
1. Make sure role is 'seller', not 'admin'
2. Check token is being saved in cookies
3. Verify backend auth endpoint

### Issue: Styles not loading
1. Clear `.next` folder: `rm -rf .next`
2. Restart development server
3. Check `tailwind.config.ts` is correct

---

## Development Workflow

### Running Development Server
```bash
npm run dev
```

### Linting
```bash
npm run lint
```

### Building
```bash
npm run build
```

### Production
```bash
npm start
```

---

## Git Workflow

### Clone Repository
```bash
git clone your-repo-url
cd FullstackEcommerce/vendors
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature
```

### Commit Changes
```bash
git add .
git commit -m "Description of changes"
```

### Push to Remote
```bash
git push origin feature/your-feature
```

### Create Pull Request
Open PR on GitHub for code review

---

## Performance Optimization

### Image Optimization
Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Description"
  width={400}
  height={300}
  priority
/>
```

### Code Splitting
Automatic with Next.js, but can be optimized:
```tsx
import dynamic from 'next/dynamic';

const AnalyticsComponent = dynamic(
  () => import('@/components/Analytics'),
  { loading: () => <p>Loading...</p> }
);
```

### Caching
```tsx
// Cache data for 60 seconds
const res = await fetch(url, {
  next: { revalidate: 60 }
});

// Revalidate on demand
revalidatePath('/dashboard');
```

---

## Security Best Practices

### Never Commit Secrets
```bash
# Add to .gitignore
.env.local
.env.*.local
```

### Use HTTPS in Production
```env
# Production only
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Validate User Input
```tsx
// Always validate on backend too
const email = validateEmail(userInput);
```

### Protect API Routes
```tsx
// Verify token before processing
if (!token) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

---

## Monitoring & Debugging

### Enable Debug Logging
```tsx
// Add to component
console.log('Debug info:', variable);

// Remove before production
```

### Use React DevTools
1. Install React DevTools browser extension
2. Inspect components in real-time
3. Check props and state

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Check API calls
4. Verify response data

### Check Console Errors
1. Open DevTools Console
2. Fix any JavaScript errors
3. Check for network errors

---

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Vendor Portal

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## Maintenance Tasks

### Weekly
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Review analytics

### Quarterly
- [ ] Major dependency updates
- [ ] Performance optimization
- [ ] Feature planning

---

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clean build
rm -rf .next node_modules
npm install
npm run build

# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Install specific version
npm install package@version
```

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Gluestack UI](https://gluestack.io)
- [React](https://react.dev)

### Learning
- [Next.js Tutorial](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Web.dev](https://web.dev)

### Tools
- [VS Code](https://code.visualstudio.com)
- [Vercel](https://vercel.com)
- [GitHub](https://github.com)

---

## Support

### Getting Help
1. Check documentation files
2. Review error messages
3. Check browser console
4. Review backend logs
5. Ask team members

### Reporting Issues
When reporting bugs:
1. Describe what happened
2. Provide error message
3. Include steps to reproduce
4. Share environment details

---

## Summary

The vendors portal is now ready for:
✅ Development
✅ Testing
✅ Staging
✅ Production Deployment

Follow this guide to successfully deploy and maintain the application!
