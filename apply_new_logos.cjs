const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/alpha/.gemini/antigravity/brain/bd05df68-4313-4672-b3cc-6b9d4c71685c';
const destDir = 'd:/Antigravity/Gujarati/public';

// The images were uploaded in order: light-cream (for dark mode), then dark-green (for light mode)
// The timestamps usually match the upload order.
// Let's copy the files
fs.copyFileSync(path.join(srcDir, 'media__1780410364018.png'), path.join(destDir, 'logo-light.png'));
fs.copyFileSync(path.join(srcDir, 'media__1780410364022.png'), path.join(destDir, 'logo-dark.png'));
console.log("Images copied.");

const layoutPath = 'd:/Antigravity/Gujarati/src/components/Layout.jsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// Revert scale transform for header
content = content.replace(
  "style={{ height: '40px', objectFit: 'contain', transform: 'scale(2)', transformOrigin: 'center' }}",
  "style={{ height: '36px', objectFit: 'contain' }}"
);

// Revert scale transform for sidebar
content = content.replace(
  "style={{ height: '36px', objectFit: 'contain', transform: 'scale(2.2)', transformOrigin: 'left center' }}",
  "style={{ height: '36px', objectFit: 'contain' }}"
);

fs.writeFileSync(layoutPath, content, 'utf8');
console.log("Layout.jsx reverted.");
