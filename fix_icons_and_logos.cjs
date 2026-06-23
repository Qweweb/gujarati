const fs = require('fs');
const path = require('path');

const layoutPath = 'd:/Antigravity/Gujarati/src/components/Layout.jsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');

// Replace header logo
layoutContent = layoutContent.replace(
  /<Link to="\/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, textDecoration:'none' }}>[\s\S]*?<\/Link>/m,
  `<Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
          <img 
            src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
            alt="Gujarati App" 
            style={{ height: '36px', objectFit: 'contain' }} 
          />
        </Link>`
);

// Replace sidebar logo
layoutContent = layoutContent.replace(
  /<div style={{ display:'flex', alignItems:'center', gap:8 }}>\s*<div style={{ width:28[\s\S]*?<\/span>\s*<\/div>/m,
  `<div style={{ display:'flex', alignItems:'center' }}>
                <img 
                  src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="Gujarati App" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
              </div>`
);

fs.writeFileSync(layoutPath, layoutContent, 'utf8');
console.log("Layout.jsx logos restored.");

// Now ThemeContext
const themePath = 'd:/Antigravity/Gujarati/src/context/ThemeContext.jsx';
let themeContent = fs.readFileSync(themePath, 'utf8');

const labelsToRemove = ["'ચોઘડિયા'", "'ભક્તિ'", "'શબ્દ રમત'", "'સ્પેશિયલ ક્વિઝ'"];
const lines = themeContent.split('\n');
const newLines = lines.filter(line => {
  if (line.includes("cat:") && labelsToRemove.some(label => line.includes(`label:${label}`))) {
    return false;
  }
  return true;
});

fs.writeFileSync(themePath, newLines.join('\n'), 'utf8');
console.log("ThemeContext tools filtered.");
