# SnapShop - AI-Powered Fashion Marketplace

Welcome to SnapShop! An intelligent ecommerce platform connecting independent fashion merchants with customers through advanced AI matching algorithms.

## 🎯 Project Overview

SnapShop revolutionizes online fashion shopping by:
- **Instant Product Discovery**: Find what you need in under 3 seconds
- **AI-Powered Matching**: Connect merchants with their ideal customers
- **Smart Filtering**: Search by style, budget, and preferences
- **Seamless Experience**: Minimize manual search, maximize results
- **SME Focus**: Supporting independent fashion merchants

## 🚀 Quick Start - Deploy to GitHub Pages

Follow these steps to get your website live on GitHub Pages:

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in (or create an account)
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Name your repository (e.g., `snapshop-website`)
5. Choose **"Public"** (required for free GitHub Pages)
6. ✅ Check "Add a README file"
7. Click **"Create repository"**

### Step 2: Upload Your Files

You have two options:

#### Option A: Upload via Web Interface (Easiest)

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop these three files:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Scroll down and click **"Commit changes"**

#### Option B: Upload via Git (Command Line)

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# Copy the three files (index.html, styles.css, script.js) into this folder

# Add and commit files
git add .
git commit -m "Initial SnapShop website deployment"
git push origin main
```

### Step 3: Enable GitHub Pages

1. In your repository, click **"Settings"** (top menu)
2. Scroll down and click **"Pages"** in the left sidebar
3. Under "Source", select:
   - Branch: **main** (or **master**)
   - Folder: **/ (root)**
4. Click **"Save"**
5. Wait 2-5 minutes for deployment

### Step 4: Access Your Live Website

Your website will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
```
https://johnsmith.github.io/snapshop-website/
```

**🎉 That's it! Your website is now live!**

## 📁 File Structure

```
snapshop-website/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Interactive functionality
└── README.md           # This file (documentation)
```

## 🎨 Features

### For Customers
- **Smart Product Discovery**: AI-powered search and filtering
- **Style Preferences**: Set your budget and style preferences
- **Instant Matching**: Get matched with products in seconds
- **Similar Products**: Find alternatives automatically
- **AI Shopping Assistant** (Coming Soon): Chat-based product discovery

### For Merchants
- **Zero Manual Search**: Customers find you automatically
- **Intelligent Matching**: Connect with customers who love your style
- **Level Playing Field**: Compete on product quality, not marketing budget
- **Easy Onboarding**: Simple application process

## 🛠️ Customization Guide

### Changing Colors

Edit the CSS variables in `styles.css` (lines 2-20):

```css
:root {
    --cream: #FAF8F5;          /* Background color */
    --sand: #E8E3DC;           /* Secondary background */
    --warm-gray: #B8AFA4;      /* Text secondary */
    --charcoal: #3A3732;       /* Primary text */
    --accent-earth: #9B8878;   /* Accent color */
}
```

### Updating Company Information

In `index.html`, find and update:
- Line 73-76: Hero title and subtitle
- Line 537-547: Footer location and description
- Meta description (line 7)

### Adding/Removing Products

In `script.js` (lines 2-60), modify the `products` array:

```javascript
{
    id: 13,
    name: "Your Product Name",
    merchant: "Merchant Name",
    price: 150,
    category: "outerwear", // or "dresses", "accessories"
    match: "95%",
    badge: "New"
}
```

### Modifying Contact Forms

Edit form fields in `index.html` (lines 357-453)

## 🔧 Troubleshooting

### Website Not Loading?
1. Check that all three files are in the repository root (not in a subfolder)
2. Ensure the repository is set to "Public"
3. Wait 5-10 minutes after enabling GitHub Pages
4. Check Settings → Pages for deployment status

### CSS Not Working?
- Make sure `styles.css` is in the same folder as `index.html`
- Check browser console for errors (F12)

### Forms Not Submitting?
- Forms currently show a success modal but don't send data
- To integrate with a backend, modify the `handleFormSubmission` function in `script.js`

### Products Not Showing?
- Open browser console (F12) and check for JavaScript errors
- Ensure `script.js` is loaded correctly

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1440px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚀 Future Enhancements

### Phase 1 (Current)
- ✅ Landing page with hero section
- ✅ Product showcase with filtering
- ✅ AI assistant preview (frontend only)
- ✅ Contact forms for customers and merchants
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Backend integration for forms
- [ ] Functional AI chatbot
- [ ] Real product database
- [ ] User authentication
- [ ] Merchant dashboard
- [ ] Shopping cart functionality
- [ ] Payment integration

### Phase 3 (Future)
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced recommendation engine
- [ ] Visual search (image-based)
- [ ] Multi-category expansion
- [ ] Merchant analytics dashboard

## 🔗 Custom Domain (Optional)

To use a custom domain like `www.snapshop.com`:

1. Buy a domain from a registrar (Namecheap, GoDaddy, etc.)
2. In repository Settings → Pages, add your custom domain
3. Update DNS records at your domain registrar:
   ```
   CNAME record: www → YOUR-USERNAME.github.io
   ```
4. Wait 24-48 hours for DNS propagation

## 📊 Analytics (Optional)

To track visitors, add Google Analytics:

1. Create a Google Analytics account
2. Get your tracking ID (starts with G- or UA-)
3. Add this before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

## 💡 Tips for Success

1. **Test Locally First**: Open `index.html` in a browser before deploying
2. **Use Browser DevTools**: Press F12 to inspect and debug
3. **Mobile Testing**: Use Chrome DevTools device mode (Ctrl+Shift+M)
4. **Regular Updates**: Keep your product catalog fresh
5. **Monitor Performance**: Use Google PageSpeed Insights

## 🤝 Support & Feedback

If you need help:
1. Check the GitHub Pages documentation: https://docs.github.com/pages
2. Review this README thoroughly
3. Open an issue in your repository for tracking

## 📞 Contact

**SnapShop**  
Imperial College Business School  
South Kensington, London

Built with ❤️ at Imperial College London

## 📄 License

This project is open source and available for use and modification.

---

**Made with Claude AI** | Last Updated: January 2026
