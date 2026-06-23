const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// Add import
if (!content.includes('ThemeContext')) {
  content = content.replace(
    "import { API_ENDPOINTS } from '../config/api';",
    "import { API_ENDPOINTS } from '../config/api';\nimport { useTheme } from '../context/ThemeContext';"
  );
}

// Remove static TOOLS definition if exists
const toolsRegex = /const TOOLS = \[[\s\S]*?\];\n\n/;
content = content.replace(toolsRegex, '');

// Inside Dashboard component, add useTheme
const useThemeHook = `const Dashboard = () => {
  const { activeTheme } = useTheme();
  const toolsList = activeTheme.tools;
`;
content = content.replace("const Dashboard = () => {", useThemeHook);

// Replace TOOLS.filter with toolsList.filter
content = content.replace(/TOOLS === 'all' \? TOOLS : TOOLS\.filter/g, "activeTab === 'all' ? toolsList : toolsList.filter");
content = content.replace(/const tools = activeTab === 'all' \? TOOLS : TOOLS\.filter/g, "const tools = activeTab === 'all' ? toolsList : toolsList.filter");

// Replace background: 'linear-gradient(135deg, #2D3748, #0D9488)' with background: activeTheme.gradient
content = content.replace(/background: 'linear-gradient\(135deg, #2D3748, #0D9488\)'/g, "background: activeTheme.gradient");

// Replace boxShadow: '0 8px 24px rgba(13, 148, 136, 0.2)' with boxShadow: activeTheme.cardShadow
content = content.replace(/boxShadow: '0 8px 24px rgba\(13, 148, 136, 0.2\)'/g, "boxShadow: activeTheme.cardShadow");

// Replace activeTab styles
content = content.replace(/border: activeTab === tab\.id \? '1\.5px solid #0D9488' : '1\.5px solid #E8E6E3'/g, "border: activeTab === tab.id ? activeTheme.tabActiveBorder : '1.5px solid #E8E6E3'");
content = content.replace(/background: activeTab === tab\.id \? 'var\(--bg-active, #F8FAFC\)' : 'var\(--bg-inactive, #FFFFFF\)'/g, "background: activeTab === tab.id ? activeTheme.tabActiveBg : 'var(--bg-inactive, #FFFFFF)'");
content = content.replace(/color: activeTab === tab\.id \? 'var\(--text-active, #2D3748\)' : 'var\(--text-inactive, #78716C\)'/g, "color: activeTab === tab.id ? activeTheme.tabActiveText : 'var(--text-inactive, #78716C)'");

// also fix the other instance of activeTab styles if any (e.g. #F59E0B)
content = content.replace(/border: activeTab === tab\.id \? '1\.5px solid #F59E0B' : '1\.5px solid #E8E6E3'/g, "border: activeTab === tab.id ? activeTheme.tabActiveBorder : '1.5px solid #E8E6E3'");
content = content.replace(/background: activeTab === tab\.id \? '#FFF8EF' : '#FFFFFF'/g, "background: activeTab === tab.id ? activeTheme.tabActiveBg : 'var(--bg-inactive, #FFFFFF)'");
content = content.replace(/color: activeTab === tab\.id \? '#B45309' : '#78716C'/g, "color: activeTab === tab.id ? activeTheme.tabActiveText : 'var(--text-inactive, #78716C)'");

fs.writeFileSync('src/components/Dashboard.jsx', content);
console.log("Dashboard updated with useTheme");
