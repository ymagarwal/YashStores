const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Admin & email config from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFICATION_EMAIL = 'inquiries.snapshop@gmail.com';

// Allowed origins for CORS (custom domain + GitHub Pages + localhost for dev)
const ALLOWED_ORIGINS = [
    'https://snapshop4u.com',
    'https://www.snapshop4u.com',
    'https://ymagarwal.github.io',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

// --- Mongoose Models ---

const customerSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    style:       { type: String, required: true },
    budget:      { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const merchantSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    contactName:  { type: String, required: true },
    email:        { type: String, required: true },
    category:     { type: String, required: true },
    submittedAt:  { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // clothing, accessories, footwear, jewelry
    price: { type: Number, required: true },
    merchant: { type: String, required: true },
    images: [String],
    tags: [String],
    stock: { type: Number, default: 10 },
    created_at: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);
const Merchant = mongoose.model('Merchant', merchantSchema);
const Product = mongoose.model('Product', productSchema);

// --- Middleware ---

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
}));

// CORS - restrict to known origins
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));

// Rate limiting - general: 100 requests per 15 min per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', generalLimiter);

// Rate limiting - strict for form submissions: 5 submissions per 15 min per IP
const submitLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many submissions. Please try again in 15 minutes.' }
});

// Rate limiting - chat: 10 requests per 15 min per IP
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many chat requests. Please try again in 15 minutes.' }
});

// Serve static files
app.use(express.static(__dirname));

// --- Validation Helpers ---

function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .replace(/[<>]/g, '')
        .slice(0, 200);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const VALID_STYLES = ['minimalist', 'vintage', 'streetwear', 'formal', 'casual', 'other'];
const VALID_BUDGETS = ['0-100', '100-250', '250-500', '500+'];
const VALID_CATEGORIES = ['clothing', 'accessories', 'footwear', 'jewelry', 'other'];

function validateCustomer(data) {
    const errors = [];
    if (!data.name || sanitizeString(data.name).length < 1) errors.push('Name is required');
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!VALID_STYLES.includes(data.style)) errors.push('Invalid style selection');
    if (!VALID_BUDGETS.includes(data.budget)) errors.push('Invalid budget selection');
    return errors;
}

function validateMerchant(data) {
    const errors = [];
    if (!data.businessName || sanitizeString(data.businessName).length < 1) errors.push('Business name is required');
    if (!data.contactName || sanitizeString(data.contactName).length < 1) errors.push('Contact name is required');
    if (!data.email || !isValidEmail(data.email)) errors.push('Valid email is required');
    if (!VALID_CATEGORIES.includes(data.category)) errors.push('Invalid category selection');
    return errors;
}

// --- Email Notifications ---

let transporter = null;
if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD
        }
    });
}

async function sendNotificationEmail(type, data) {
    if (!transporter) return;

    const subject = type === 'customer'
        ? `New Customer Signup: ${data.name}`
        : `New Merchant Application: ${data.businessName}`;

    const html = type === 'customer'
        ? `<div style="font-family:Arial,sans-serif;max-width:500px;">
             <h2 style="color:#1A1A1A;">New Customer Signup</h2>
             <p><strong>Name:</strong> ${data.name}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Style:</strong> ${data.style}</p>
             <p><strong>Budget:</strong> &pound;${data.budget}</p>
             <hr><p style="color:#999;font-size:12px;">SnapShop Notification</p>
           </div>`
        : `<div style="font-family:Arial,sans-serif;max-width:500px;">
             <h2 style="color:#1A1A1A;">New Merchant Application</h2>
             <p><strong>Business:</strong> ${data.businessName}</p>
             <p><strong>Contact:</strong> ${data.contactName}</p>
             <p><strong>Email:</strong> ${data.email}</p>
             <p><strong>Category:</strong> ${data.category}</p>
             <hr><p style="color:#999;font-size:12px;">SnapShop Notification</p>
           </div>`;

    try {
        await transporter.sendMail({
            from: `"SnapShop" <${GMAIL_USER}>`,
            to: NOTIFICATION_EMAIL,
            subject,
            html
        });
        console.log(`Notification email sent for new ${type}`);
    } catch (err) {
        console.error('Failed to send notification email:', err.message);
    }
}

// --- Admin Authentication Middleware ---

function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!ADMIN_PASSWORD || token !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// --- API Routes ---

// Submit form data (with stricter rate limit)
app.post('/api/submit', submitLimiter, async (req, res) => {
    try {
        const formData = req.body;

        if (!formData.type || !['customer', 'merchant'].includes(formData.type)) {
            return res.status(400).json({ error: 'Invalid form type' });
        }

        if (formData.type === 'customer') {
            const errors = validateCustomer(formData);
            if (errors.length > 0) {
                return res.status(400).json({ error: 'Validation failed', details: errors });
            }

            const email = sanitizeString(formData.email).toLowerCase();
            const duplicate = await Customer.findOne({ email });
            if (duplicate) {
                return res.status(409).json({
                    error: 'This email has already been registered.',
                    message: 'You have already signed up with this email address.'
                });
            }

            const customer = await Customer.create({
                name: sanitizeString(formData.name),
                email: email,
                style: formData.style,
                budget: formData.budget
            });

            // Send notification email (non-blocking)
            sendNotificationEmail('customer', customer).catch(() => {});

            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                id: customer._id
            });
        } else {
            const errors = validateMerchant(formData);
            if (errors.length > 0) {
                return res.status(400).json({ error: 'Validation failed', details: errors });
            }

            const email = sanitizeString(formData.email).toLowerCase();
            const duplicate = await Merchant.findOne({ email });
            if (duplicate) {
                return res.status(409).json({
                    error: 'This email has already been registered.',
                    message: 'You have already signed up with this email address.'
                });
            }

            const merchant = await Merchant.create({
                businessName: sanitizeString(formData.businessName),
                contactName: sanitizeString(formData.contactName),
                email: email,
                category: formData.category
            });

            // Send notification email (non-blocking)
            sendNotificationEmail('merchant', merchant).catch(() => {});

            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                id: merchant._id
            });
        }
    } catch (error) {
        console.error('Error processing submission:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Chat endpoint with AI product recommendations
app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (message.length > 500) {
            return res.status(400).json({ error: 'Message too long (max 500 characters)' });
        }

        // Fetch all products
        const products = await Product.find().lean();
        
        // Build product index for LLM
        const productIndex = products.map(p => ({
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            merchant: p.merchant,
            tags: p.tags.join(', '),
            in_stock: p.stock > 0
        }));

        // Call Groq
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a fashion shopping assistant for SnapShop. Your job is to recommend products based on user queries.

Product catalog:
${JSON.stringify(productIndex, null, 2)}

Instructions:
- Analyze the user's query for style preferences, budget, category, and any specific requirements
- Match products from the catalog based on tags, description, price, and category
- Return your top 5 recommendations (or fewer if limited matches)
- If no products match well, respond with "NO_RESULTS" and explain why
- Format response as JSON:

For matches:
{
  "has_results": true,
  "message": "brief natural language intro",
  "products": [
    { "name": "...", "reason": "1-sentence why it matches", "price": number }
  ]
}

For no matches:
{
  "has_results": false,
  "message": "explanation of why no matches + what categories you do have"
}

Rules:
- Only recommend products with in_stock: true
- Respect budget if mentioned (e.g., "under £200" means price <= 200)
- Match style tags when mentioned (minimalist, vintage, casual, formal)
- Be concise and helpful`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1000
        });

        const aiResponse = completion.choices[0].message.content;
        
        // Parse JSON response from LLM
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponse);
        } catch (e) {
            // Fallback if LLM doesn't return valid JSON
            parsedResponse = {
                has_results: false,
                message: aiResponse
            };
        }

        res.json(parsedResponse);

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// Admin login - verify password
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    res.json({ success: true });
});

// Get all customers (admin only)
app.get('/api/customers', requireAdmin, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ submittedAt: -1 }).lean();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error.message);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get all merchants (admin only)
app.get('/api/merchants', requireAdmin, async (req, res) => {
    try {
        const merchants = await Merchant.find().sort({ submittedAt: -1 }).lean();
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error.message);
        res.status(500).json({ error: 'Failed to fetch merchants' });
    }
});

// Delete a customer (admin only)
app.delete('/api/customers/:id', requireAdmin, async (req, res) => {
    try {
        const result = await Customer.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Customer not found' });
        res.json({ success: true, message: 'Customer deleted' });
    } catch (error) {
        console.error('Error deleting customer:', error.message);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});

// Delete a merchant (admin only)
app.delete('/api/merchants/:id', requireAdmin, async (req, res) => {
    try {
        const result = await Merchant.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Merchant not found' });
        res.json({ success: true, message: 'Merchant deleted' });
    } catch (error) {
        console.error('Error deleting merchant:', error.message);
        res.status(500).json({ error: 'Failed to delete merchant' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Global error handler ---
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Origin not allowed' });
    }
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// --- Start ---
async function startServer() {
    if (!MONGODB_URI) {
        console.error('MONGODB_URI environment variable is not set.');
        process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    app.listen(PORT, () => {
        console.log(`
  SnapShop Backend Server
  ───────────────────────
  Port:   ${PORT}
  Status: Ready
  DB:     MongoDB Atlas

  Email:  ${transporter ? NOTIFICATION_EMAIL : 'Not configured'}

  Endpoints:
    POST   /api/submit         (rate limited: 5/15min)
    POST   /api/chat           (rate limited: 10/15min) ← NEW
    POST   /api/admin/login    (admin auth)
    GET    /api/customers      (admin only)
    GET    /api/merchants      (admin only)
    DELETE /api/customers/:id  (admin only)
    DELETE /api/merchants/:id  (admin only)
    GET    /api/health
        `);
    });
}

startServer().catch(console.error);

module.exports = app;
