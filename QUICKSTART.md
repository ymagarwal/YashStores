# Quick Start Guide - 5 Minutes Setup

## What You'll Need
- A computer
- Internet connection
- That's it! (We'll install everything else)

## Step-by-Step Setup

### 1. Install Node.js (if you don't have it)
- Go to: https://nodejs.org/
- Download the "LTS" version
- Install it (just click Next/Continue)
- Verify: Open terminal/command prompt and type: `node --version`

### 2. Download Your Files
- Download all the SnapShop files to a folder
- Or clone from GitHub: `git clone <your-repo>`

### 3. Quick Setup

**On Mac/Linux:**
```bash
# Navigate to your folder
cd snapshop

# Run the setup script (makes everything easy!)
chmod +x setup.sh
./setup.sh

# Start the server
npm start
```

**On Windows:**
```bash
# Navigate to your folder
cd snapshop

# Create folders
mkdir public
move index.html public\

# Install dependencies
npm install

# Start server
npm start
```

### 4. Open Your Website
- Open browser
- Go to: `http://localhost:3000`
- Done! 🎉

## Testing the Forms

1. Fill out the customer or merchant form
2. Submit it
3. Check `data/customers.json` or `data/merchants.json`
4. Your data is there!

## Deploying to the Internet

### Quick Deploy (Recommended)

**Frontend (GitHub Pages) - FREE:**
1. Create GitHub account (if needed)
2. Create new repository
3. Upload files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
4. Settings > Pages > Enable from `/public` folder
5. Your site is live!

**Backend (Render) - FREE:**
1. Sign up at https://render.com
2. "New Web Service"
3. Connect GitHub
4. It auto-deploys!
5. Copy the URL

**Update Frontend:**
- In `public/index.html`, find `http://localhost:3000`
- Replace with your Render URL
- Push to GitHub again

## Need Help?

**Server won't start?**
- Is something using port 3000? Try: `PORT=8080 npm start`
- Did npm install work? Run it again: `npm install`

**Forms not working?**
- Is the server running? Check: `http://localhost:3000/api/health`
- Check browser console (F12 > Console tab)

**Want to change colors?**
- Open `public/index.html`
- Find `:root {` in the CSS
- Change the color values (hex codes)

## Pro Tips

- Use `npm run dev` for auto-restart during development
- Data is saved in `data/` folder - back it up!
- For production, use a real database (Firebase, MongoDB, etc.)

---

**That's it! You're ready to go! 🚀**
