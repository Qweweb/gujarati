const fs = require('fs');
const path = require('path');

const layoutPath = 'd:/Antigravity/Gujarati/src/components/Layout.jsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Add import
if (content.includes("import { Link, useLocation } from 'react-router-dom';")) {
  content = content.replace(
    "import { Link, useLocation } from 'react-router-dom';",
    "import { Link, useLocation } from 'react-router-dom';\nimport { useTheme } from '../context/ThemeContext';"
  );
  console.log("Replaced import");
} else {
  console.log("Failed to find import");
}

// 2. Add useTheme hook inside Layout
const targetHook = "const Layout = ({ children, darkMode, toggleDarkMode }) => {\n  const location = useLocation();";
if (content.includes(targetHook)) {
  content = content.replace(
    targetHook,
    "const Layout = ({ children, darkMode, toggleDarkMode }) => {\n  const location = useLocation();\n  const { activeTheme, changeTheme, themes } = useTheme();"
  );
  console.log("Replaced hook inside Layout");
} else {
  console.log("Failed to find Layout definition hook point");
}

// 3. Add Theme selection UI in Sidebar
const themeUI = `
              <DrawerSection label="કલર થીમ (Color Theme)" darkMode={darkMode}>
                <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.values(themes).map(t => (
                    <button
                      key={t.id}
                      onClick={() => { changeTheme(t.id); setIsSidebarOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                        borderRadius: '12px', border: activeTheme.id === t.id ? '1.5px solid #F59E0B' : '1px solid ' + (darkMode ? '#333' : '#E8E6E3'),
                        background: activeTheme.id === t.id ? (darkMode ? '#3D2514' : '#FFF8EF') : 'transparent',
                        color: darkMode ? '#F2F0EE' : '#1A1614',
                        cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.gradient, flexShrink: 0 }} />
                      <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: activeTheme.id === t.id ? 800 : 600, fontSize: '13px' }}>
                        {t.name}
                      </span>
                      {activeTheme.id === t.id && (
                        <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '18px', color: '#F59E0B' }}>check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </DrawerSection>
`;

if (content.includes('<DrawerSection label="એકાઉન્ટ" darkMode={darkMode}>')) {
  content = content.replace(
    '<DrawerSection label="એકાઉન્ટ" darkMode={darkMode}>',
    `${themeUI}\n              <DrawerSection label="એકાઉન્ટ" darkMode={darkMode}>`
  );
  console.log("Replaced DrawerSection");
} else {
  console.log("Failed to find DrawerSection");
}

fs.writeFileSync(layoutPath, content, 'utf8');
console.log("All done");
