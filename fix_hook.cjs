const fs = require('fs');
const path = require('path');

const layoutPath = 'd:/Antigravity/Gujarati/src/components/Layout.jsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// Insert the hook safely
if (!content.includes('const { activeTheme, changeTheme, themes } = useTheme();')) {
  content = content.replace(
    /const location = useLocation\(\);/,
    "const location = useLocation();\n  const { activeTheme, changeTheme, themes } = useTheme();"
  );
  console.log("Hook inserted.");
} else {
  console.log("Hook already exists.");
}

fs.writeFileSync(layoutPath, content, 'utf8');
