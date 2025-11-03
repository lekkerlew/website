# Elite Energy Solutions - Website Structure

## 📁 File Structure

```
project-root/
│
├── index.html              # Main entry point
├── header.html             # Navigation and hero section
├── main.html               # Main content sections
├── footer.html             # Footer with social links
│
├── css/
│   └── custom.css          # All custom styles
│
├── js/
│   ├── loader.js           # Loads HTML components dynamically
│   ├── navigation.js       # Navbar functionality
│   ├── gallery.js          # Image gallery and lightbox
│   ├── form.js             # Contact form validation
│   ├── cookies.js          # Cookie consent banner
│   └── main.js             # Main app logic and utilities
│
└── assets/
    ├── css/
    │   ├── bootstrap.min.css
    │   ├── paper-kit.css
    │   └── ee.css
    ├── img/
    │   ├── logo/
    │   ├── banners/
    │   ├── divisions/
    │   ├── projects/
    │   ├── memberships/
    │   ├── brands/
    │   └── logs/
    └── ... (other assets)
```

## 🚀 How It Works

### 1. **index.html** (Main Entry Point)
- Contains the `<head>` section with all meta tags and CSS links
- Includes three placeholder divs for dynamic content loading
- Loads all JavaScript files
- Contains structured data for SEO

### 2. **header.html** (Navigation + Hero)
- Responsive navigation bar with logo
- Hero section with banner image
- Automatically loaded into `#header-container`

### 3. **main.html** (Content Sections)
- About section
- Registrations & Memberships
- Divisions showcase
- Projects gallery
- Testimonials carousel
- Letters of recommendation
- Brands slider
- Contact form
- Automatically loaded into `#main-container`

### 4. **footer.html** (Footer)
- Social media links
- Copyright information
- Automatically loaded into `#footer-container`

## 📝 JavaScript Modules

### **loader.js**
- Dynamically loads HTML components using `fetch()`
- Dispatches `componentsLoaded` event when all components are ready
- Registers service worker for offline functionality

### **navigation.js**
- Handles smooth scrolling
- Navbar background change on scroll
- Mobile menu toggle
- Active link highlighting

### **gallery.js**
- Image gallery with lightbox modal
- Keyboard navigation (Arrow keys, Escape)
- Group-based navigation (electrical, solar, BESS, etc.)

### **form.js**
- Contact form validation
- Real-time field validation
- Honeypot spam protection
- Loading state management
- Success/error messages

### **cookies.js**
- Cookie consent banner
- LocalStorage for user preference
- Accept/Reject handlers

### **main.js**
- Performance monitoring (LCP tracking)
- Lazy loading for images
- Scroll spy for navigation
- Error handling
- Utility functions

## 🎨 CSS Organization

All custom styles are in **css/custom.css**:
- Navbar styles
- Animation effects
- Gallery and lightbox
- Logo and brand sliders
- Responsive adjustments
- Form validation styles
- Hover effects
- Mobile optimizations

## 🔧 Setup Instructions

### **Option 1: Dynamic Loading (Requires Local Server)**

1. **Place all files in your project root:**
   ```
   - index.html (root)
   - header.html (root)
   - main.html (root)
   - footer.html (root)
   ```

2. **Create folders and add files:**
   ```
   - css/custom.css
   - js/loader.js
   - js/navigation.js
   - js/gallery.js
   - js/form.js
   - js/cookies.js
   - js/main.js
   ```

3. **Keep existing assets folder structure intact**

4. **Test with a local server:**
   - **VS Code**: Install "Live Server" extension, right-click index.html → "Open with Live Server"
   - **Python**: Run `python -m http.server 8000` in project folder, visit `http://localhost:8000`
   - **Node.js**: Run `npx http-server` in project folder
   - **PHP**: Run `php -S localhost:8000` in project folder

⚠️ **Important**: Do NOT open index.html directly (file://) as dynamic loading won't work due to CORS restrictions.

### **Option 2: Static Include (PHP Required)**

If you're using a PHP server or can use PHP includes:

1. **Use `index_static.html` instead** (rename to index.php)
2. **Create folders and add static JS files:**
   ```
   - css/custom.css
   - js/navigation-static.js
   - js/gallery-static.js
   - js/form-static.js
   - js/cookies.js
   - js/main-static.js
   ```

3. **The PHP includes will work automatically** on any PHP server

### **Option 3: Single File (Fallback)**

If dynamic loading causes issues, you can keep everything in one file:
- Simply use your original `main.html` as is
- Add the custom.css styles in a `<style>` tag in the `<head>`
- Keep all JavaScript inline or in separate files loaded in order

## 🐛 Troubleshooting

### CSS Not Loading / No Formatting

**Problem**: Page loads but has no styling (quirks mode error)

**Solutions**:
1. **Check DOCTYPE**: Ensure `<!DOCTYPE html>` is the VERY FIRST line in index.html
2. **Check Console**: Open browser DevTools (F12) → Console tab → Look for errors
3. **Verify Paths**: Ensure all CSS files exist at the correct paths:
   ```
   ./assets/css/bootstrap.min.css
   ./assets/css/paper-kit.css
   ./assets/css/ee.css
   ./css/custom.css
   ```
4. **Hard Refresh**: Press Ctrl+Shift+R (Cmd+Shift+R on Mac) to clear cache
5. **Check File Encoding**: Save all files as UTF-8 without BOM

### Dynamic Loading Not Working

**Problem**: Content doesn't load or console shows fetch errors

**Solutions**:
1. **Use a Local Server**: Don't open file:// directly - use one of the server options above
2. **Check File Names**: Ensure header.html, main.html, footer.html exist in root
3. **Check Console**: Look for 404 errors or CORS errors
4. **Try Static Version**: Use `index_static.html` with PHP includes instead

### Bootstrap Not Working

**Problem**: Carousel, modals, or other Bootstrap components don't work

**Solutions**:
1. **Check jQuery Load**: Ensure jQuery loads before Bootstrap
2. **Check Script Order**: Scripts must load in this order:
   - jQuery
   - Popper.js
   - Bootstrap
   - Your custom scripts
3. **Wait for DOM**: Ensure scripts wait for `DOMContentLoaded`

### Images Not Loading

**Problem**: Broken image icons or missing images

**Solutions**:
1. **Check Paths**: Ensure `./assets/img/` folder structure matches your HTML
2. **Check Console**: Look for 404 errors for specific images
3. **Verify File Names**: Ensure image filenames match exactly (case-sensitive on Linux servers)

## ⚙️ Configuration

### To customize form submission:
Edit `js/form.js` and replace the setTimeout with your actual API endpoint:

```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
})
```

### To add Google Analytics:
Edit `js/cookies.js` and add your analytics code in the accept handler:

```javascript
cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.style.display = 'none';
    
    // Add your analytics initialization here
    gtag('config', 'YOUR-GA-ID');
});
```

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills if needed)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

All components are fully responsive:
- Mobile: < 576px
- Tablet: 576px - 992px
- Desktop: > 992px

## 🔍 SEO Features

- Semantic HTML5
- Meta tags for social sharing
- Structured data (JSON-LD)
- Lazy loading for images
- Optimized performance

## 🛠️ Future Enhancements

Consider adding:
- Service worker for offline support
- Image optimization/WebP format
- CSS/JS minification for production
- CDN for assets
- Analytics integration
- A/B testing capabilities

## 📞 Support

For issues or questions, contact:
- Email: chris@eliteenergy.co.za
- Phone: +27-083-387-7644

---

**Note:** Make sure to test all functionality after implementing the new structure. The modular approach makes it easier to maintain and update individual components without affecting the entire site.