const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Allowed origins for CORS (your GitHub Pages + localhost for dev)
const ALLOWED_ORIGINS = [
    'https://ymagarwal.github.io',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

// --- Middleware ---

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // disable CSP for static files served from this server
}));

// CORS - restrict to known origins
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Body parsing with size limit (prevent large payload attacks)
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

// --- Data Layer ---

const DATA_DIR = path.join(__dirname, 'data');

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

async function initializeDataFiles() {
    await ensureDataDir();
    const files = ['customers.json', 'merchants.json'];
    for (const file of files) {
        const filePath = path.join(DATA_DIR, file);
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }
    }
}

async function readData(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
        return [];
    }
}

async function writeData(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error.message);
        return false;
    }
}

// --- Validation Helpers ---

function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .replace(/[<>]/g, '') // strip angle brackets to prevent HTML injection
        .slice(0, 200);       // cap length
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

        // Validate form type
        if (!formData.type || !['customer', 'merchant'].includes(formData.type)) {
            return res.status(400).json({ error: 'Invalid form type' });
        }

        // Validate and sanitize based on type
        let sanitizedData;
        if (formData.type === 'customer') {
            const errors = validateCustomer(formData);
            if (errors.length > 0) {
                return res.status(400).json({ error: 'Validation failed', details: errors });
            }
            sanitizedData = {
                id: Date.now().toString(),
                type: 'customer',
                name: sanitizeString(formData.name),
                email: sanitizeString(formData.email).toLowerCase(),
                style: formData.style,
                budget: formData.budget,
                submittedAt: new Date().toISOString()
            };
        } else {
            const errors = validateMerchant(formData);
            if (errors.length > 0) {
                return res.status(400).json({ error: 'Validation failed', details: errors });
            }
            sanitizedData = {
                id: Date.now().toString(),
                type: 'merchant',
                businessName: sanitizeString(formData.businessName),
                contactName: sanitizeString(formData.contactName),
                email: sanitizeString(formData.email).toLowerCase(),
                category: formData.category,
                submittedAt: new Date().toISOString()
            };
        }

        // Check for duplicate email in same collection
        const filename = formData.type === 'customer' ? 'customers.json' : 'merchants.json';
        const existingData = await readData(filename);

        const duplicate = existingData.find(
            entry => entry.email === sanitizedData.email
        );
        if (duplicate) {
            return res.status(409).json({
                error: 'This email has already been registered.',
                message: 'You have already signed up with this email address.'
            });
        }

        existingData.push(sanitizedData);

        const success = await writeData(filename, existingData);
        if (success) {
            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                id: sanitizedData.id
            });
        } else {
            res.status(500).json({ error: 'Failed to save data' });
        }
    } catch (error) {
        console.error('Error processing submission:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await readData('customers.json');
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error.message);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get all merchants
app.get('/api/merchants', async (req, res) => {
    try {
        const merchants = await readData('merchants.json');
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
    await initializeDataFiles();

    app.listen(PORT, () => {
        console.log(`
  SnapShop Backend Server
  ───────────────────────
  Port:   ${PORT}
  Status: Ready
  Data:   ./data

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
