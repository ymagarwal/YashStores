# Project Structure Guide

## How to Organize Your Files

After downloading all files, organize them like this:

```
snapshop/                          ← Create this main folder
│
├── public/                        ← Create this folder
│   └── index.html                 ← Move index.html here
│
├── data/                          ← Auto-created by server
│   ├── customers.json            ← Auto-created
│   └── merchants.json            ← Auto-created
│
├── server.js                      ← Backend server
├── package.json                   ← Dependencies
├── .gitignore                     ← Git rules
├── .env.example                   ← Environment template
├── .env                           ← Created by you (optional)
├── setup.sh                       ← Setup script (Mac/Linux)
├── README.md                      ← Full documentation
├── QUICKSTART.md                  ← Quick setup guide
└── PROJECT_STRUCTURE.md           ← This file
```

## Manual Setup Steps

If you don't use the setup script:

### 1. Create Main Folder
```bash
mkdir snapshop
cd snapshop
```

### 2. Place Downloaded Files
Put all downloaded files in the `snapshop` folder:
- server.js
- package.json
- .gitignore
- .env.example
- setup.sh
- README.md
- QUICKSTART.md
- index.html

### 3. Create Public Folder & Move HTML
```bash
mkdir public
mv index.html public/
```

### 4. Install & Run
```bash
npm install
npm start
```

## File Purposes

| File | Purpose |
|------|---------|
| `public/index.html` | Your website (frontend) |
| `server.js` | Backend server that saves form data |
| `package.json` | Lists required packages |
| `.gitignore` | Files Git should ignore |
| `.env.example` | Environment variable template |
| `setup.sh` | Automated setup script |
| `data/` | Stores form submissions |

## For GitHub

### What to Commit
✅ Commit these:
- `public/index.html`
- `server.js`
- `package.json`
- `.gitignore`
- `.env.example`
- `README.md`
- `setup.sh`

❌ DON'T commit these:
- `node_modules/` (auto-ignored)
- `.env` (auto-ignored)
- `data/` (optional - contains user data)

### If You Want to Track Data
If you want to keep form submissions in Git, edit `.gitignore` and remove the `# data/` line.

**Warning:** Only do this if your data isn't sensitive!

## Development vs Production

### Development (Local)
```
snapshop/
├── public/index.html          (Uses http://localhost:3000)
├── server.js                  (Runs on port 3000)
└── data/                      (Saved locally)
```

### Production (Online)
```
Frontend:                       Backend:
GitHub Pages                    Render/Railway/Heroku
├── index.html                  ├── server.js
(Uses production API URL)       (Uses cloud storage)
```

## Common Issues

### "Module not found"
- Run `npm install` in the main `snapshop` folder

### "Cannot find index.html"
- Make sure it's in the `public/` folder
- Server looks for `public/index.html`

### "Port already in use"
- Change port: `PORT=8080 npm start`
- Or kill process using port 3000

## Next Steps

1. ✅ Organize files as shown above
2. ✅ Run `npm install`
3. ✅ Run `npm start`
4. ✅ Test at `http://localhost:3000`
5. ✅ Deploy when ready!

---

**Need help? Check README.md or QUICKSTART.md**
