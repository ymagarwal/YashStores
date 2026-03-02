# SnapShop — Complete Project Documentation

> This file is the single source of truth for the entire SnapShop project.
> It is written so that another AI (or human) can fully understand the codebase, architecture, data flow, every endpoint, every file, and every external service without reading any other file.

---

## 1. What Is SnapShop?

SnapShop is an **AI-powered fashion marketplace** that connects SME (small-medium enterprise) merchants with customers through intelligent matching. It is a project built at **Imperial College Business School, South Kensington, London**.

Currently the project is in **pre-launch / waitlist phase**. The website collects:
- **Customer signups** (name, email, style preference, budget range)
- **Merchant applications** (business name, contact name, email, product category)

There is no actual e-commerce or AI matching engine yet — the site is a landing page + waitlist collection system with an admin dashboard.

---

## 2. Repository & Hosting Overview

| Item | Value |
|------|-------|
| **GitHub repo** | `ymagarwal/YashStores` |
| **Custom domain** | `snapshop4u.com` (bought on **GoDaddy**) |
| **Domain DNS** | Managed on **GoDaddy** — A records point to GitHub Pages IPs (`185.199.108-111.153`) |
| **Frontend hosting** | **GitHub Pages** (serves `index.html` as the static site) |
| **Backend hosting** | **Render.com** (free tier, serves the Express API) |
| **Backend URL** | `https://yashstores.onrender.com` |
| **Database** | **MongoDB Atlas** (cloud-hosted NoSQL) |
| **Email service** | **Gmail SMTP** via Nodemailer |
| **Notification inbox** | `inquiries.snapshop@gmail.com` |
| **License** | MIT |

---

## 3. Complete File Tree

```
/home/user/YashStores/
├── index.html                 # Main website — entire frontend (HTML + CSS + JS in one file)
├── admin.html                 # Admin dashboard — view/delete submissions (HTML + CSS + JS in one file)
├── server.js                  # Entire backend — Express server, Mongoose models, routes, email logic
├── package.json               # npm dependencies & scripts
├── package-lock.json          # Dependency lock file
├── setup.sh                   # Bash setup script (installs deps, creates dirs)
├── .gitignore                 # Ignores: node_modules/, data/, .env
├── README.md                  # General readme
├── QUICKSTART.md              # Quick setup guide
├── PROJECT_STRUCTURE.md       # Older structure doc
├── CLAUDE_PROJECT_CONTEXT.md  # THIS FILE — comprehensive documentation
├── data/                      # Local dev JSON fallback (gitignored in production)
│   ├── customers.json         # Empty array [] — dev only
│   └── merchants.json         # Empty array [] — dev only
├── images/                    # Product images used on the landing page
│   ├── bag-leather.jpeg
│   ├── blazer-cream.jpeg
│   ├── coat-black.jpeg
│   ├── dress-silk.jpeg
│   ├── necklace-gold.jpeg
│   ├── sweater-beige.jpeg
│   └── placeholder.txt
└── node_modules/              # Installed dependencies (gitignored)
```

### Key fact: Only 3 files contain all the application code
1. **`index.html`** (~1393 lines) — The entire public-facing website
2. **`server.js`** (~387 lines) — The entire backend
3. **`admin.html`** (~912 lines) — The entire admin dashboard

---

## 4. Architecture & Request Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│  1. Types snapshop4u.com                                            │
│     │                                                               │
│     ▼                                                               │
│  2. GoDaddy DNS resolves A records → GitHub Pages IPs               │
│     │                                                               │
│     ▼                                                               │
│  3. GitHub Pages serves index.html (static site)                    │
│     │                                                               │
│     │  User fills out customer or merchant form and clicks submit   │
│     ▼                                                               │
│  4. Frontend JS sends POST request to:                              │
│     https://yashstores.onrender.com/api/submit                     │
│     │                                                               │
│     ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              RENDER.COM (Backend Server)                      │   │
│  │                                                              │   │
│  │  5. Express receives request                                 │   │
│  │     → Rate limit check (5 submissions / 15 min per IP)       │   │
│  │     → CORS origin check                                      │   │
│  │     → Input validation & sanitization                        │   │
│  │     → Duplicate email check                                  │   │
│  │     │                                                        │   │
│  │     ▼                                                        │   │
│  │  6. Mongoose saves document to MongoDB Atlas                 │   │
│  │     │                                                        │   │
│  │     ▼                                                        │   │
│  │  7. Nodemailer sends notification email via Gmail SMTP       │   │
│  │     to: inquiries.snapshop@gmail.com                         │   │
│  │     │                                                        │   │
│  │     ▼                                                        │   │
│  │  8. Returns JSON response { success: true, id: "..." }      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│     │                                                               │
│     ▼                                                               │
│  9. Frontend shows success/error message to user                    │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      ADMIN FLOW                                     │
│                                                                     │
│  1. Admin opens admin.html (served from GitHub Pages or locally)    │
│     │                                                               │
│     ▼                                                               │
│  2. Login overlay appears — admin enters password                   │
│     │                                                               │
│     ▼                                                               │
│  3. JS sends POST to /api/admin/login with { password }             │
│     Server checks against ADMIN_PASSWORD env var                    │
│     │                                                               │
│     ▼                                                               │
│  4. On success, password is stored in sessionStorage as token       │
│     All subsequent requests include: Authorization: Bearer <token>  │
│     │                                                               │
│     ▼                                                               │
│  5. Dashboard loads — fetches GET /api/customers + GET /api/merchants│
│     Displays tables with stats, search, tabs, CSV export            │
│     │                                                               │
│     ▼                                                               │
│  6. Admin can delete entries via DELETE /api/customers/:id           │
│     or DELETE /api/merchants/:id (with confirmation dialog)         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Frontend — index.html (Complete Breakdown)

**Location:** `/home/user/YashStores/index.html` (~1393 lines)
**Served by:** GitHub Pages at `snapshop4u.com` (or `ymagarwal.github.io`)

Everything is in a single file — HTML structure, all CSS (in a `<style>` tag), and all JavaScript (in a `<script>` tag). No build tools, no bundler, no framework.

### 5.1 CSS Design System

**Fonts** (loaded from Google Fonts):
- Display/headings: `Cormorant Garamond` (serif) — weights 300-700
- Body text: `Inter` (sans-serif) — weights 300-700

**Color palette** (CSS custom properties on `:root`):
| Variable | Hex | Usage |
|----------|-----|-------|
| `--pure-white` | `#FFFFFF` | Backgrounds |
| `--off-white` | `#FAFAFA` | Subtle backgrounds |
| `--light-gray` | `#F5F5F5` | Section backgrounds |
| `--medium-gray` | `#E8E8E8` | Borders |
| `--warm-gray` | `#D4D0CC` | Footer text |
| `--charcoal` | `#2A2A2A` | Body text |
| `--soft-black` | `#1A1A1A` | Headings, buttons |
| `--soft-sage` | `#E8EFE8` | Feature card 1, success messages |
| `--soft-blush` | `#F5E8E8` | Feature card 2, error messages |
| `--soft-cream` | `#F8F5F0` | Hero gradient, products section |
| `--soft-lavender` | `#EDE8F5` | Feature card 3, contact section |
| `--soft-mint` | `#E8F5F0` | AI section background |
| `--accent-warm` | `#C9A88A` | Match percentage text |
| `--accent-sage` | `#A8B8A8` | Badges |
| `--accent-blush` | `#D4A8A8` | Unused currently |

**Transition:** `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)` used globally.

**Responsive breakpoints:**
- `1024px` — Grid columns collapse to single column
- `768px` — Nav links hidden (no hamburger menu), padding reduced, font sizes adjusted

### 5.2 Page Sections (in order)

1. **Navigation** (fixed top bar)
   - Logo: "SnapShop"
   - Links: How It Works, AI Assistant, Products, Join Us
   - CTA button: "Get Started" (scrolls to contact section)
   - Nav links hidden on mobile (<768px)

2. **Hero Section** (90vh min-height)
   - Badge: "AI-Powered Discovery"
   - Headline: "Find Your Perfect Style In Seconds"
   - Description paragraph
   - Two buttons: "Start Shopping" + "For Merchants" (both scroll to contact)
   - Stats row: "< 3s" search time, "95%" match accuracy, "1000+" products
   - Visual cards: 3 overlapping product cards with images (coat-black, dress-silk, bag-leather)
   - Background: linear gradient (soft-cream → white → soft-sage)

3. **How It Works** (id: `how-it-works`)
   - 3-column grid of feature cards (sage, blush, lavender backgrounds)
   - Step 1: "Tell Us Your Preferences"
   - Step 2: "AI Matches You Instantly"
   - Step 3: "Discover & Shop"

4. **AI Assistant** (id: `ai-assistant`)
   - Full-width mint background
   - Left side: description + "Coming Soon" badge + feature checklist
   - Right side: Chat demo mockup (static, not interactive)
   - Features listed: Natural language search, Visual similarity detection, Smart budget recommendations, Learns your style over time

5. **Products** (id: `products`)
   - Cream background
   - Filter bar: All Products, Outerwear, Dresses, Accessories
   - 3-column grid of 6 product cards:
     - Structured Linen Blazer (blazer-cream.jpeg) — £185
     - Layered Gold Necklace (necklace-gold.jpeg) — £145
     - Double-Breasted Coat (coat-black.jpeg) — £295
     - Silk Slip Dress (dress-silk.jpeg) — £215
     - Cashmere Crewneck (sweater-beige.jpeg) — £165
     - Leather Tote Bag (bag-leather.jpeg) — £425
   - Filter logic is client-side JS using keyword matching

6. **Contact / Join Us** (id: `contact`)
   - Lavender background
   - Two side-by-side form cards:

   **Customer Form** (id: `customer-form`):
   - Fields: Full Name (text), Email Address (email), Style (select), Budget Range (select)
   - Style options: minimalist, vintage, streetwear, formal, casual, other
   - Budget options: £0-£100, £100-£250, £250-£500, £500+
   - Submit button: "Join Waitlist"

   **Merchant Form** (id: `merchant-form`):
   - Fields: Business Name (text), Contact Name (text), Email Address (email), Product Category (select)
   - Category options: clothing, accessories, footwear, jewelry, other
   - Submit button: "Apply to Sell"

7. **Footer**
   - Dark background (soft-black)
   - Brand description + location (Imperial College Business School, South Kensington, London)
   - Link columns: For Customers, For Merchants, Company
   - Copyright: "© 2026 SnapShop. All rights reserved."
   - Tagline: "Built with AI at Imperial College London"

### 5.3 Frontend JavaScript Logic

**API URL:** `https://yashstores.onrender.com/api/submit`

**Form submission flow** (`handleFormSubmit` function):
1. Disables submit button, shows "Submitting..." text
2. Hides previous success/error messages
3. Collects form data via `FormData` API
4. Builds JSON payload with `type: 'customer'` or `type: 'merchant'`
5. Sends `POST` to API_URL with `Content-Type: application/json`
6. On success (response.ok): shows success message, resets form
7. On server error: shows server's error message (e.g., "This email has already been registered.")
8. On network error: shows "Network error. The server may be starting up — please try again in a moment."
9. Re-enables submit button

**Customer form payload:**
```json
{
  "type": "customer",
  "name": "John Smith",
  "email": "john@example.com",
  "style": "minimalist",
  "budget": "100-250",
  "timestamp": "2026-03-02T12:00:00.000Z"
}
```

**Merchant form payload:**
```json
{
  "type": "merchant",
  "businessName": "My Shop",
  "contactName": "Jane Doe",
  "email": "jane@myshop.com",
  "category": "clothing",
  "timestamp": "2026-03-02T12:00:00.000Z"
}
```

**Product filter logic:**
- Clicking a filter button adds `.active` class, removes from others
- "All Products" shows all cards
- Other filters use a keyword map:
  - "outerwear" → matches product names containing "blazer" or "coat"
  - "dresses" → matches "dress"
  - "accessories" → matches "necklace", "bag", or "tote"
- Matching is done by checking if the `.product-name` text includes any keyword

---

## 6. Backend — server.js (Complete Breakdown)

**Location:** `/home/user/YashStores/server.js` (~387 lines)
**Runtime:** Node.js
**Framework:** Express.js 4.18.2
**Deployed to:** Render.com at `https://yashstores.onrender.com`

### 6.1 Environment Variables (Required on Render)

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port (Render sets this automatically) | `3000` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/snapshop` |
| `ADMIN_PASSWORD` | Password for admin dashboard login & API auth | `mysecretpassword` |
| `GMAIL_USER` | Gmail address for sending notifications | `snapshop.notify@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not regular password) | `abcd efgh ijkl mnop` |

**Important:** The server will `process.exit(1)` if `MONGODB_URI` is not set.

### 6.2 Database Models (Mongoose Schemas)

**Customer Schema:**
```javascript
{
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  style:       { type: String, required: true },
  budget:      { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}
```

**Merchant Schema:**
```javascript
{
  businessName: { type: String, required: true },
  contactName:  { type: String, required: true },
  email:        { type: String, required: true },
  category:     { type: String, required: true },
  submittedAt:  { type: Date, default: Date.now }
}
```

MongoDB collection names (auto-created by Mongoose): `customers`, `merchants`

### 6.3 Middleware Stack (applied in order)

1. **Helmet** — Sets security headers. `crossOriginResourcePolicy: 'cross-origin'`, `contentSecurityPolicy: false`
2. **CORS** — Whitelist-based origin check:
   - `https://snapshop4u.com`
   - `https://www.snapshop4u.com`
   - `https://ymagarwal.github.io`
   - `http://localhost:3000`
   - `http://localhost:5500`
   - `http://127.0.0.1:5500`
   - Requests with no origin (e.g., server-to-server) are allowed
   - Allowed methods: GET, POST, DELETE
   - Allowed headers: Content-Type, Authorization
3. **Body parser** — `express.json({ limit: '10kb' })`
4. **General rate limiter** — on all `/api/` routes: 100 requests per 15 minutes per IP
5. **Static file serving** — `express.static('public')` (serves files from `/public` directory)

### 6.4 Validation & Sanitization

**`sanitizeString(str)`:**
- Returns empty string if not a string type
- Trims whitespace
- Removes `<` and `>` characters (XSS prevention)
- Truncates to 200 characters max

**`isValidEmail(email)`:**
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

**Allowed values:**
- Styles: `minimalist`, `vintage`, `streetwear`, `formal`, `casual`, `other`
- Budgets: `0-100`, `100-250`, `250-500`, `500+`
- Categories: `clothing`, `accessories`, `footwear`, `jewelry`, `other`

### 6.5 API Endpoints (Complete Reference)

#### `POST /api/submit` — Submit a form (public, rate limited)
**Rate limit:** 5 requests per 15 minutes per IP
**Request body:**
```json
{
  "type": "customer" | "merchant",
  // + form fields (see payloads in section 5.3)
}
```
**Flow:**
1. Validates `type` is "customer" or "merchant"
2. Runs field validation (required fields, email format, enum values)
3. Sanitizes all string inputs
4. Lowercases email
5. Checks for duplicate email in the respective collection
6. Creates document in MongoDB
7. Fires off notification email (non-blocking, errors silently caught)
8. Returns response

**Success response** (201):
```json
{ "success": true, "message": "Form submitted successfully", "id": "mongo_object_id" }
```
**Validation error** (400):
```json
{ "error": "Validation failed", "details": ["Name is required", "Valid email is required"] }
```
**Duplicate email** (409):
```json
{ "error": "This email has already been registered.", "message": "You have already signed up with this email address." }
```
**Invalid type** (400):
```json
{ "error": "Invalid form type" }
```
**Rate limited** (429):
```json
{ "error": "Too many submissions. Please try again in 15 minutes." }
```
**Server error** (500):
```json
{ "error": "Internal server error" }
```

---

#### `POST /api/admin/login` — Admin authentication
**Request body:**
```json
{ "password": "the_admin_password" }
```
**Success** (200): `{ "success": true }`
**Failure** (401): `{ "error": "Invalid password" }`

**Note:** The password is compared directly (plain text comparison) against `ADMIN_PASSWORD` env var. No hashing, no JWT, no sessions on the server side.

---

#### `GET /api/customers` — List all customers (admin only)
**Headers required:** `Authorization: Bearer <ADMIN_PASSWORD>`
**Response** (200): Array of customer documents, sorted by `submittedAt` descending (newest first)
```json
[
  {
    "_id": "...",
    "name": "John Smith",
    "email": "john@example.com",
    "style": "minimalist",
    "budget": "100-250",
    "submittedAt": "2026-03-02T12:00:00.000Z"
  }
]
```
**Unauthorized** (401): `{ "error": "Unauthorized" }`

---

#### `GET /api/merchants` — List all merchants (admin only)
**Headers required:** `Authorization: Bearer <ADMIN_PASSWORD>`
**Response** (200): Array of merchant documents, sorted by `submittedAt` descending
```json
[
  {
    "_id": "...",
    "businessName": "My Shop",
    "contactName": "Jane Doe",
    "email": "jane@myshop.com",
    "category": "clothing",
    "submittedAt": "2026-03-02T12:00:00.000Z"
  }
]
```

---

#### `DELETE /api/customers/:id` — Delete a customer (admin only)
**Headers required:** `Authorization: Bearer <ADMIN_PASSWORD>`
**Success** (200): `{ "success": true, "message": "Customer deleted" }`
**Not found** (404): `{ "error": "Customer not found" }`

---

#### `DELETE /api/merchants/:id` — Delete a merchant (admin only)
**Headers required:** `Authorization: Bearer <ADMIN_PASSWORD>`
**Success** (200): `{ "success": true, "message": "Merchant deleted" }`
**Not found** (404): `{ "error": "Merchant not found" }`

---

#### `GET /api/health` — Health check (public)
**Response** (200):
```json
{
  "status": "ok",
  "db": "connected" | "disconnected",
  "timestamp": "2026-03-02T12:00:00.000Z",
  "uptime": 12345.678
}
```

---

#### `GET /` — Serve main page
Serves `public/index.html` via `res.sendFile`.

**Note:** In the current repo layout, `index.html` is in the project root, not in `/public`. The `setup.sh` script moves it to `public/` during setup. On GitHub Pages, `index.html` is served directly from root.

---

### 6.6 Email Notification System

**Transport:** Gmail SMTP via Nodemailer
**Sender:** `"SnapShop" <${GMAIL_USER}>`
**Recipient:** `inquiries.snapshop@gmail.com` (hardcoded)

**Triggered on:** Every successful form submission (both customer and merchant)
**Behavior:** Non-blocking — `sendNotificationEmail().catch(() => {})` — email failures don't affect the API response.

**Email content** (HTML formatted):
- Customer signup: Shows name, email, style, budget (with £ symbol)
- Merchant application: Shows business name, contact, email, category

If `GMAIL_USER` or `GMAIL_APP_PASSWORD` are not set, the transporter is `null` and no emails are sent (silent no-op).

### 6.7 Admin Authentication Middleware

```javascript
function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!ADMIN_PASSWORD || token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}
```
- Extracts token from `Authorization: Bearer <token>` header
- Compares directly to `ADMIN_PASSWORD` env var
- Returns 401 if no match or if `ADMIN_PASSWORD` is not set

### 6.8 Global Error Handler

Catches unhandled errors in the Express pipeline:
- CORS errors → 403 `{ "error": "Origin not allowed" }`
- All other errors → 500 `{ "error": "Internal server error" }`

### 6.9 Server Startup

```javascript
async function startServer() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI environment variable is not set.');
        process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => { /* startup banner */ });
}
```
- Exits immediately if no MongoDB URI
- Connects to MongoDB Atlas first, then starts listening
- Logs a formatted startup banner with port, DB status, email config, and endpoint list

---

## 7. Admin Dashboard — admin.html (Complete Breakdown)

**Location:** `/home/user/YashStores/admin.html` (~912 lines)
**Accessed at:** `snapshop4u.com/admin.html` or locally

### 7.1 Design

- Font: Inter (Google Fonts)
- Clean white/gray dashboard aesthetic
- Responsive (mobile-friendly at 768px breakpoint)

### 7.2 UI Components

1. **Login overlay** — Full-screen overlay with password input, "Sign In" button, error message
2. **Dashboard header** — "SnapShop Admin" title, Refresh + Sign Out buttons
3. **Stats cards** — 3 cards showing: Customers count, Merchants count, Total Submissions
4. **Toolbar** — Search input (filters by name/email/category), Export CSV buttons (one per tab)
5. **Tabs** — "Customers" and "Merchants" (toggle between tables)
6. **Data tables** — Sortable by submission date (newest first), with Delete button per row
7. **Confirmation dialog** — Modal overlay for delete confirmation
8. **Toast notifications** — Bottom-right popup for success/error feedback
9. **Loading spinners** — Shown while data is being fetched

### 7.3 JavaScript Logic

**API Base:** `https://yashstores.onrender.com/api`

**Authentication flow:**
1. On page load, checks `sessionStorage` for `admin_token`
2. If found, skips login and loads dashboard
3. On login: sends POST to `/api/admin/login` with `{ password }`
4. On success: stores password in `sessionStorage.admin_token`, shows dashboard, calls `refreshData()`
5. All API calls include header: `Authorization: Bearer <sessionStorage.admin_token>`
6. On 401 response from any API call: auto-logout (clears sessionStorage, reloads page)

**Data loading:**
- `refreshData()` calls `loadCustomers()` and `loadMerchants()` in parallel via `Promise.all`
- Each function fetches from `/api/customers` or `/api/merchants`
- Data stored in `customersData` and `merchantsData` arrays
- Stats cards updated with `.length` counts

**Search:**
- Client-side filtering on the currently loaded data
- Searches across all visible fields (name, email, style/category, budget)
- Triggers on every keystroke (`oninput`)

**Delete flow:**
1. Click Delete button → shows confirmation overlay with entry name
2. Click "Delete" in overlay → sends `DELETE /api/{type}/{id}`
3. On success → shows toast "Entry deleted", refreshes data
4. On failure → shows error toast

**CSV Export:**
- Builds CSV string in-memory from loaded data
- Creates a Blob URL, triggers download via dynamically created `<a>` element
- Filename format: `snapshop-{customers|merchants}-{YYYY-MM-DD}.csv`
- Customer CSV columns: name, email, style, budget, submittedAt
- Merchant CSV columns: businessName, contactName, email, category, submittedAt

---

## 8. Dependencies

### Production Dependencies (package.json)

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | Web framework — routing, middleware, static file serving |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| `helmet` | ^8.1.0 | Security HTTP headers |
| `express-rate-limit` | ^8.2.1 | Request rate limiting per IP |
| `mongoose` | ^9.2.1 | MongoDB ODM — schemas, validation, queries |
| `nodemailer` | ^8.0.1 | Email sending via Gmail SMTP |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.0.1 | Auto-restart server on file changes during development |

### npm Scripts

| Script | Command | Usage |
|--------|---------|-------|
| `start` | `node server.js` | Production start (used by Render) |
| `dev` | `nodemon server.js` | Development with auto-restart |

---

## 9. External Services Configuration

### 9.1 GitHub Pages (Frontend Hosting)

- Repository: `ymagarwal/YashStores`
- GitHub Pages serves the repo root as a static site
- `index.html` in the root is the entry point
- `admin.html` is accessible at `/admin.html`
- Images served from `/images/` directory

### 9.2 GoDaddy (Domain DNS)

- Domain: `snapshop4u.com`
- DNS A records should point to GitHub Pages:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- A CNAME file may be needed in the repo root for GitHub Pages custom domain

### 9.3 Render.com (Backend Hosting)

- Service name: likely "yashstores"
- URL: `https://yashstores.onrender.com`
- Build command: `npm install`
- Start command: `node server.js` (or `npm start`)
- Environment variables configured in Render dashboard (MONGODB_URI, ADMIN_PASSWORD, GMAIL_USER, GMAIL_APP_PASSWORD)
- **Free tier note:** Render free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30-50 seconds (cold start). This is why the frontend shows "The server may be starting up" on network errors.

### 9.4 MongoDB Atlas (Database)

- Cloud-hosted MongoDB cluster
- Connection via `MONGODB_URI` env var (SRV format)
- Database name: determined by the URI (likely `snapshop` or similar)
- Collections: `customers`, `merchants` (auto-created by Mongoose)
- No indexes defined explicitly (MongoDB auto-creates `_id` index)

### 9.5 Gmail SMTP (Email Notifications)

- Uses Gmail's SMTP service via Nodemailer
- Requires a Gmail "App Password" (not the account password)
- App Passwords are generated at: Google Account → Security → 2-Step Verification → App Passwords
- Sender address: whatever `GMAIL_USER` is set to
- Recipient: `inquiries.snapshop@gmail.com` (hardcoded in server.js line 19)

---

## 10. Security Measures

| Measure | Implementation | Location |
|---------|---------------|----------|
| **CORS** | Whitelist of allowed origins | server.js lines 22-29, 61-71 |
| **Helmet** | Security headers (XSS, clickjack, etc.) | server.js lines 55-58 |
| **Rate limiting (general)** | 100 req / 15 min per IP on all /api/ routes | server.js lines 77-84 |
| **Rate limiting (forms)** | 5 submissions / 15 min per IP on /api/submit | server.js lines 87-93 |
| **Input sanitization** | Strips `<>`, trims, truncates to 200 chars | server.js lines 100-106 |
| **Email validation** | Regex check | server.js lines 108-110 |
| **Enum validation** | Style/budget/category checked against allowed lists | server.js lines 112-132 |
| **Duplicate prevention** | Email uniqueness check per collection | server.js lines 213, 244 |
| **Body size limit** | 10kb max JSON body | server.js line 74 |
| **Admin auth** | Bearer token (plain text password comparison) | server.js lines 187-193 |
| **XSS in admin** | `escapeHTML()` function on all rendered data | admin.html lines 636-641 |

### Known Security Limitations
- Admin password is compared in plain text (no hashing)
- No CSRF protection (stateless API, but admin.html is same-origin)
- Admin token stored in `sessionStorage` (cleared on tab close, but accessible to XSS)
- No HTTPS enforcement in code (relies on hosting providers)

---

## 11. Images

All images are in `/images/` directory and are JPEG format:

| Filename | Used For | Where Used |
|----------|----------|------------|
| `bag-leather.jpeg` | Leather Tote product | Hero visual card, Products grid |
| `blazer-cream.jpeg` | Linen Blazer product | Products grid |
| `coat-black.jpeg` | Wool Overcoat / Double-Breasted Coat | Hero visual card, Products grid |
| `dress-silk.jpeg` | Silk Midi/Slip Dress | Hero visual card, Products grid |
| `necklace-gold.jpeg` | Layered Gold Necklace | Products grid |
| `sweater-beige.jpeg` | Cashmere Crewneck | Products grid |
| `placeholder.txt` | Placeholder file | Not used in code |

---

## 12. Setup & Development

### Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/ymagarwal/YashStores.git
cd YashStores

# 2. Install dependencies
npm install

# 3. Create .env file with required variables
# MONGODB_URI=mongodb+srv://...
# ADMIN_PASSWORD=your_password
# GMAIL_USER=your_gmail@gmail.com
# GMAIL_APP_PASSWORD=your_app_password

# 4. Start development server
npm run dev
# Server runs on http://localhost:3000

# 5. For frontend development, open index.html directly
# or use VS Code Live Server (port 5500) — already in CORS whitelist
```

### setup.sh Script
- Checks Node.js is installed
- Creates `public/` directory
- Moves `index.html` into `public/` (for Express static serving)
- Runs `npm install`
- Creates `data/` directory
- Copies `.env.example` to `.env` if it exists

---

## 13. Known Quirks & Notes

1. **index.html location discrepancy:** The file lives in the repo root (for GitHub Pages), but `server.js` serves from `public/index.html` via `express.static('public')` and `res.sendFile`. The `setup.sh` script moves it. This means the backend on Render may need index.html in `/public` while GitHub Pages needs it in root.

2. **Render cold starts:** Free tier sleeps after 15 min idle. First request takes 30-50s. The frontend gracefully handles this with the "server may be starting up" message.

3. **No CNAME file:** There's no `CNAME` file in the repo root for GitHub Pages custom domain. This may need to be added for `snapshop4u.com` to work properly with GitHub Pages.

4. **data/ directory:** Contains `customers.json` and `merchants.json` (both empty arrays). These appear to be leftover from an older version that used file-based storage. The current server.js only uses MongoDB — these files are not read or written by any code.

5. **Currency:** All prices shown in British Pounds (£). Budget ranges in £. Email templates use `&pound;`.

6. **The `timestamp` field in form payloads:** The frontend sends a `timestamp` field in the POST body, but the server ignores it — it uses Mongoose's `submittedAt: { default: Date.now }` instead.

7. **Product filter buttons:** Only "All Products" actually works correctly for showing all. The other filters (Outerwear, Dresses, Accessories) are keyword-based and depend on product names containing specific substrings.

8. **No 404 page:** Unmatched routes fall through to Express's default handler.

---

## 14. Deployment Checklist

To deploy changes:

**Frontend (GitHub Pages):**
1. Edit `index.html` or `admin.html`
2. Commit and push to the branch GitHub Pages is configured to serve from
3. Changes go live within ~1-2 minutes

**Backend (Render):**
1. Edit `server.js` or `package.json`
2. Commit and push to the branch Render is configured to auto-deploy from
3. Render detects the push, runs `npm install`, then `npm start`
4. Deployment takes ~2-5 minutes

**Environment variables:** Changed directly in Render's dashboard (Settings → Environment).

---

## 15. Quick Reference — All URLs

| What | URL |
|------|-----|
| Live website | `https://snapshop4u.com` |
| GitHub Pages URL | `https://ymagarwal.github.io/YashStores` |
| Backend API base | `https://yashstores.onrender.com` |
| Submit endpoint | `https://yashstores.onrender.com/api/submit` |
| Health check | `https://yashstores.onrender.com/api/health` |
| Admin login | `https://yashstores.onrender.com/api/admin/login` |
| Admin dashboard | `https://snapshop4u.com/admin.html` |
| GitHub repo | `https://github.com/ymagarwal/YashStores` |
