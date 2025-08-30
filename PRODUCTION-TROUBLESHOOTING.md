# 🚨 PRODUCTION DEPLOYMENT TROUBLESHOOTING GUIDE

# ================================================

## COMMON INNGEST EMAIL ERRORS IN PRODUCTION:

### 1. ENVIRONMENT VARIABLES MISSING

❌ Error: "Cannot read properties of undefined"
❌ Error: "Invalid API key"
❌ Error: "NEXT_PUBLIC_CONVEX_URL is undefined"

✅ FIX: Add all environment variables to your production platform:

```
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
RESEND_API_KEY=re_your_actual_key
GEMINI_API_KEY=AIzaSy_your_actual_key
CLERK_SECRET_KEY=sk_your_actual_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_your_actual_key
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain
```

### 2. INNGEST ENDPOINT NOT ACCESSIBLE

❌ Error: "Function registration failed"
❌ Error: "Inngest endpoint 404"

✅ FIX: Ensure your deployment platform supports:

- API routes
- Serverless functions
- External HTTP calls

### 3. CONVEX DEPLOYMENT MISMATCH

❌ Error: "Invalid Convex deployment"
❌ Error: "Function not found"

✅ FIX:

- Use PRODUCTION Convex URL (not dev)
- Deploy Convex functions: `npx convex deploy`
- Update CONVEX_DEPLOYMENT to production

### 4. RESEND DOMAIN VERIFICATION

❌ Error: "Domain not verified"
❌ Error: "From address not allowed"

✅ FIX:

- Verify your domain in Resend dashboard
- Use verified domain in 'from' field
- Or use sandbox domain for testing

### 5. CRON JOBS NOT WORKING

❌ Error: "Scheduled function not triggered"

✅ FIX:

- Ensure platform supports cron/scheduled functions
- Check timezone settings
- Verify Inngest is properly configured for production

## PLATFORM-SPECIFIC FIXES:

### VERCEL:

1. Add env vars in Vercel dashboard
2. Ensure no edge runtime conflicts
3. Check function timeout limits (10s default)

### NETLIFY:

1. Add env vars in site settings
2. Configure function redirects
3. Check build settings

### RAILWAY/RENDER:

1. Set NODE_ENV=production
2. Configure port settings
3. Add environment variables

## DEBUGGING STEPS:

1. Check production logs
2. Test API endpoints directly
3. Verify database connections
4. Test email delivery manually
5. Check Inngest dashboard (if available)

## QUICK PRODUCTION TEST:

curl -X POST https://your-domain.com/api/test-email
