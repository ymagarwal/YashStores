const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data directory
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Initialize data files
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

// Read data from file
async function readData(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

// Write data to file
async function writeData(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        return false;
    }
}

// API Routes

// Submit form data
app.post('/api/submit', async (req, res) => {
    try {
        const formData = req.body;
        
        // Validate form type
        if (!formData.type || !['customer', 'merchant'].includes(formData.type)) {
            return res.status(400).json({ error: 'Invalid form type' });
        }
        
        // Determine which file to use
        const filename = formData.type === 'customer' ? 'customers.json' : 'merchants.json';
        
        // Read existing data
        const existingData = await readData(filename);
        
        // Add new submission with unique ID
        const newSubmission = {
            id: Date.now().toString(),
            ...formData,
            submittedAt: new Date().toISOString()
        };
        
        existingData.push(newSubmission);
        
        // Save updated data
        const success = await writeData(filename, existingData);
        
        if (success) {
            res.json({ success: true, message: 'Form submitted successfully', id: newSubmission.id });
        } else {
            res.status(500).json({ error: 'Failed to save data' });
        }
    } catch (error) {
        console.error('Error processing submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all customers (for admin/viewing)
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await readData('customers.json');
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get all merchants (for admin/viewing)
app.get('/api/merchants', async (req, res) => {
    try {
        const merchants = await readData('merchants.json');
        res.json(merchants);
    } catch (error) {
        console.error('Error fetching merchants:', error);
        res.status(500).json({ error: 'Failed to fetch merchants' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
async function startServer() {
    await initializeDataFiles();
    
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║   SnapShop Backend Server Running     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  Status: ✓ Ready                      ║
║  Data Directory: ./data                ║
╠════════════════════════════════════════╣
║  Endpoints:                            ║
║  POST /api/submit                      ║
║  GET  /api/customers                   ║
║  GET  /api/merchants                   ║
║  GET  /api/health                      ║
╚════════════════════════════════════════╝
        `);
    });
}

startServer().catch(console.error);

module.exports = app;
