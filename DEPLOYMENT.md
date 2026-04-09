# SnapShop AI Chat - Deployment Guide

## Overview
This update adds a functional AI chat assistant to SnapShop using Groq's free LLM API. The chat replaces the "Coming Soon" section and can recommend products from your MongoDB database.

## What Changed

### New Files
- `seed-products.js` - Populates MongoDB with 20 mock products
- Updated `server.js` - Added Product schema + `/api/chat` endpoint
- Updated `package.json` - Added `groq-sdk` dependency + seed script
- Updated `index.html` - Replaced mock chat with functional UI

### New Dependencies
- `groq-sdk` (v0.8.0) - For AI product recommendations

---

## Step 1: Get Groq API Key (FREE)

1. Go to https://console.groq.com/keys
2. Sign up/login (free account)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_...`)

---

## Step 2: Update Environment Variables

### Local Development (.env file)
Create `.env` in project root:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_admin_password
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
GROQ_API_KEY=gsk_your_groq_key_here
```

### Render.com Production
1. Go to Render dashboard
2. Select your `yashstores` service
3. Environment → Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_your_groq_key_here`
4. Save changes (this will trigger redeploy)

---

## Step 3: Seed Database with Products

You only need to do this **once** to populate your database with 20 mock products.

### Option A: Seed from Local Machine

```bash
# Install dependencies
npm install

# Seed database (make sure MONGODB_URI is in .env)
npm run seed

# You should see:
# ✓ Connected to MongoDB
# ✓ Cleared existing products
# ✓ Inserted 20 products
# ✓ Seed complete!
```

### Option B: Seed from Render

1. In Render dashboard, go to your service
2. Shell → Open Shell
3. Run:
```bash
node seed-products.js
```

---

## Step 4: Deploy Updated Code

### Push to GitHub

```bash
git add .
git commit -m "Add AI chat functionality with Groq integration"
git push origin main
```

### Auto-Deploy on Render
- Render automatically detects the push
- Rebuilds with new dependencies (`groq-sdk`)
- Restarts the server
- Wait ~2-3 minutes for deployment

### Verify Deployment
Check: https://yashstores.onrender.com/api/health

Should show:
```json
{
  "status": "ok",
  "db": "connected",
  ...
}
```

---

## Step 5: Test the Chat

1. Go to https://snapshop4u.com
2. Scroll to "Your Personal AI Shopping Assistant" section
3. Try these test queries:

**Test 1: Budget filter**
```
minimalist coat under £200
```
Expected: Shows Double-Breasted Coat (£295) and other items under £200

**Test 2: Style matching**
```
gold jewelry for casual wear
```
Expected: Shows Layered Gold Necklace, Gold Hoop Earrings

**Test 3: Category search**
```
leather bags
```
Expected: Shows Leather Tote Bag, Crossbody Bag

**Test 4: No results**
```
neon yellow sneakers
```
Expected: "I couldn't find any products matching that description..."

---

## Step 6: Monitor Usage

### Groq Free Tier Limits
- 14,400 requests/day
- 6,000 tokens/minute
- Rate limit in code: 10 requests per 15 min per IP

### Check Groq Usage
https://console.groq.com/usage

---

## Troubleshooting

### Chat not responding
**Check 1:** Browser console (F12) for errors
**Check 2:** Render logs for Groq API errors
**Check 3:** Verify GROQ_API_KEY is set in Render environment

### "No products found" for all queries
**Problem:** Database not seeded
**Fix:** Run `npm run seed` (Step 3)

### Server cold start (30s delay)
**Normal:** Render free tier spins down after 15min idle
**Fix:** Wait for first request to wake server

### CORS errors
**Problem:** Frontend URL not whitelisted in server.js
**Fix:** Verify ALLOWED_ORIGINS includes your domain

---

## Architecture Flow

```
User types query in chat
    ↓
Frontend: POST /api/chat with { message: "..." }
    ↓
Backend: Fetch all products from MongoDB
    ↓
Backend: Build product index (name, desc, price, tags, stock)
    ↓
Backend: Call Groq API with system prompt + product index + user query
    ↓
Groq: Returns JSON with matches or no_results
    ↓
Frontend: Displays product cards or "no results" message
```

---

## Cost & Limits

| Service | Tier | Limit | Cost |
|---------|------|-------|------|
| Groq API | Free | 14,400 req/day | $0 |
| MongoDB Atlas | Free | 512MB storage | $0 |
| Render.com | Free | Sleeps after 15min | $0 |
| GitHub Pages | Free | Unlimited | $0 |

**Total monthly cost: $0**

---

## Next Steps (Optional Improvements)

1. **Add product images to chat responses**
   - Update frontend to show thumbnails
   - Fetch image URLs from Product.images array

2. **Implement conversation history**
   - Store last 5 messages in frontend state
   - Send context to Groq for better recommendations

3. **Add "View Product" links**
   - Create product detail pages
   - Link from chat recommendations to full product view

4. **Upgrade to semantic search**
   - Generate embeddings for all products
   - Use vector similarity instead of keyword matching
   - Better quality but requires embedding API (OpenAI, Cohere)

---

## Files Modified Summary

```
server.js           +80 lines   (Product schema + /api/chat endpoint)
package.json        +1 line     (groq-sdk dependency)
index.html          ~50 lines   (Chat UI + JS handlers)
seed-products.js    NEW         (Database seeding)
DEPLOYMENT.md       NEW         (This file)
```

---

## Support

If you encounter issues:

1. Check Render logs: Dashboard → Logs
2. Check browser console: F12 → Console
3. Verify environment variables are set
4. Ensure database is seeded with products

All code is ready to deploy. Follow steps 1-5 in order.
