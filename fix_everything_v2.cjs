const fs = require('fs');
const path = require('path');

const layoutPath = 'd:/Antigravity/Gujarati/src/components/Layout.jsx';
let content = fs.readFileSync(layoutPath, 'utf8');

// 1. Add Theme Hook Imports
if (!content.includes('import { useTheme } from')) {
  content = content.replace(
    /import \{ Link, useLocation \} from 'react-router-dom';/,
    "import { Link, useLocation } from 'react-router-dom';\nimport { useTheme } from '../context/ThemeContext';"
  );
}

if (!content.includes('const { activeTheme, changeTheme, themes } = useTheme();')) {
  content = content.replace(
    /const location = useLocation\(\);/,
    "const location = useLocation();\n  const { activeTheme, changeTheme, themes } = useTheme();"
  );
}

// 2. Add Theme Selector to Sidebar
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

if (!content.includes('કલર થીમ (Color Theme)')) {
  content = content.replace(
    /<DrawerSection label="એકાઉન્ટ" darkMode=\{darkMode\}>/,
    `${themeUI}\n              <DrawerSection label="એકાઉન્ટ" darkMode={darkMode}>`
  );
}

// 3. Replace Header Logo
content = content.replace(
  /<Link to="\/" style=\{\{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, textDecoration:'none' \}\}>[\s\S]*?<\/Link>/m,
  `<Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
          <img 
            src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
            alt="Gujarati App" 
            style={{ height: '36px', objectFit: 'contain' }} 
          />
        </Link>`
);

// 4. Replace Sidebar Logo
content = content.replace(
  /<div style=\{\{ display:'flex', alignItems:'center', gap:8 \}\}>\s*<div style=\{\{ width:28[\s\S]*?ગુજરાતી App<\/span>\s*<\/div>/m,
  `<div style={{ display:'flex', alignItems:'center' }}>
                <img 
                  src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="Gujarati App" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
              </div>`
);

fs.writeFileSync(layoutPath, content, 'utf8');
console.log("All fixes applied successfully.");
