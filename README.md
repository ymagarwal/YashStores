# SnapShop - AI-Powered Fashion Discovery

A modern, minimalist landing page for SnapShop with a simple backend to collect customer and merchant form submissions.

## 🎨 Features

- **Beautiful Design**: Soft, aesthetic color palette with refined typography
- **Responsive Layout**: Works perfectly on all devices
- **Form Collection**: Separate forms for customers and merchants
- **Free Backend**: Simple Node.js/Express backend with JSON file storage
- **Easy Deployment**: Ready to deploy to GitHub Pages (frontend) or any Node.js hosting

## 📁 Project Structure

```
snapshop/
├── public/
│   └── index.html          # Main website file
├── data/                   # Form submissions (auto-created)
│   ├── customers.json      # Customer form data
│   └── merchants.json      # Merchant form data
├── server.js               # Backend server
├── package.json            # Dependencies
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Step 1: Clone or Download

If using Git:
```bash
git clone <your-repo-url>
cd snapshop
```

Or simply download the files to a folder called `snapshop`.

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Handle cross-origin requests
- `nodemon` - Auto-restart during development (dev only)

### Step 3: Set Up File Structure

Create a `public` folder and move `index.html` into it:

```bash
mkdir public
mv index.html public/
```

Your structure should now look like:
```
snapshop/
├── public/
│   └── index.html
├── server.js
├── package.json
└── .gitignore
```

### Step 4: Start the Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   SnapShop Backend Server Running     ║
╠════════════════════════════════════════╣
║  Port: 3000                           ║
║  Status: ✓ Ready                      ║
║  Data Directory: ./data                ║
╚════════════════════════════════════════╝
```

### Step 5: Open in Browser

Navigate to: `http://localhost:3000`

## 📋 API Endpoints

### POST `/api/submit`
Submit a form (customer or merchant)

**Request Body:**
```json
{
  "type": "customer",
  "name": "John Smith",
  "email": "john@example.com",
  "style": "minimalist",
  "budget": "100-250"
}
```

### GET `/api/customers`
Get all customer submissions

### GET `/api/merchants`
Get all merchant submissions

### GET `/api/health`
Check server status

## 📦 Viewing Form Submissions

Form submissions are saved in the `data/` folder:

1. **Customer submissions**: `data/customers.json`
2. **Merchant submissions**: `data/merchants.json`

You can:
- Open these files directly in any text editor
- Use the API endpoints to fetch data
- Build an admin panel to view submissions

Example viewing customers via API:
```bash
curl http://localhost:3000/api/customers
```

## 🌐 Deploying to Production

### Option 1: Deploy Frontend to GitHub Pages

1. **Create a new repository** on GitHub
2. **Initialize git** in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. **Push to GitHub**:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```
4. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Source: Deploy from branch
   - Branch: main, folder: `/public`
   - Save

5. **Update form URLs** in `index.html`:
   - Change `http://localhost:3000` to your backend URL
   - Deploy backend separately (see below)

### Option 2: Deploy Backend (Free Options)

#### Render (Recommended - Free Tier)
1. Sign up at [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Free tier available
5. Get your URL and update frontend

#### Railway (Free Tier)
1. Sign up at [railway.app](https://railway.app)
2. "New Project" > "Deploy from GitHub"
3. Select your repo
4. It auto-detects Node.js
5. Get your URL

#### Heroku (Free with limits)
1. Install Heroku CLI
2. Create app:
   ```bash
   heroku create snapshop-backend
   git push heroku main
   ```

### Option 3: Full Stack Deployment

**Vercel** (Frontend + Backend):
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. It handles both frontend and backend
4. Free tier available

## 🔧 Customization

### Changing Colors

Edit the CSS variables in `public/index.html`:

```css
:root {
    --soft-sage: #E8EFE8;
    --soft-blush: #F5E8E8;
    --soft-cream: #F8F5F0;
    /* Add your custom colors */
}
```

### Adding More Form Fields

1. Update the HTML form in `index.html`
2. Update the form submission JavaScript
3. No changes needed to backend (it saves whatever you send)

### Changing Port

Set environment variable:
```bash
PORT=8080 npm start
```

Or edit `server.js`:
```javascript
const PORT = process.env.PORT || 8080;
```

## 🔒 Security Notes

**For Production:**

1. **Add Authentication**: Protect the `/api/customers` and `/api/merchants` endpoints
2. **Rate Limiting**: Prevent spam submissions
3. **Input Validation**: Add server-side validation
4. **Environment Variables**: Use `.env` file for sensitive config
5. **HTTPS**: Always use HTTPS in production
6. **Database**: Consider moving to a proper database for scale

Example adding rate limiting:
```bash
npm install express-rate-limit
```

## 📊 Data Management

### Exporting Data to CSV

You can convert the JSON files to CSV using online tools or this quick script:

```javascript
// export-csv.js
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/customers.json'));
const csv = data.map(row => Object.values(row).join(',')).join('\n');
fs.writeFileSync('./customers.csv', csv);
```

Run: `node export-csv.js`

### Backing Up Data

Regularly backup the `data/` folder:
```bash
cp -r data/ data-backup-$(date +%Y%m%d)/
```

## 🐛 Troubleshooting

### Forms not submitting?
1. Check server is running: `http://localhost:3000/api/health`
2. Check browser console for errors (F12)
3. Verify CORS is enabled
4. Check network tab in browser devtools

### Server won't start?
1. Check if port 3000 is already in use
2. Try different port: `PORT=8080 npm start`
3. Check Node.js version: `node --version` (needs v14+)

### Can't see submissions?
1. Check `data/` folder exists
2. Check file permissions
3. Look for errors in server console

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for Imperial College London**
