const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Allowed origins for CORS (your GitHub Pages + localhost for dev)
const ALLOWED_ORIGINS = [
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

const Customer = mongoose.model('Customer', customerSchema);
const Merchant = mongoose.model('Merchant', merchantSchema);

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
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
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

// Serve static files
app.use(express.static('public'));

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

const VALID_STYLES = ['minimalist', 'vintage', 'streetwear', 'formal', 'casual'];
const VALID_BUDGETS = ['0-100', '100-250', '250-500', '500+'];
const VALID_CATEGORIES = ['clothing', 'accessories', 'footwear', 'jewelry'];

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

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ submittedAt: -1 }).lean();
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error.message);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get all merchants
app.get('/api/merchants', async (req, res) => {
    try {
        const merchants = await Merchant.find().sort({ submittedAt: -1 }).lean();
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error.message);
        res.status(500).json({ error: 'Failed to fetch merchants' });
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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

  Endpoints:
    POST /api/submit      (rate limited: 5/15min)
    GET  /api/customers
    GET  /api/merchants
    GET  /api/health
        `);
    });
}

startServer().catch(console.error);

module.exports = app;
