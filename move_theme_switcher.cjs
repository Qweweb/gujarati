const fs = require('fs');

// 1. Update Layout.jsx
let layoutContent = fs.readFileSync('src/components/Layout.jsx', 'utf8');

// Add import
if (!layoutContent.includes('useTheme')) {
  layoutContent = layoutContent.replace(
    "import PageTransitionFlash from './PageTransitionFlash';",
    "import PageTransitionFlash from './PageTransitionFlash';\nimport { useTheme } from '../context/ThemeContext';"
  );
}

// Add hook
if (!layoutContent.includes('const { activeTheme, changeTheme, themes } = useTheme();')) {
  layoutContent = layoutContent.replace(
    "const Layout = ({ children, darkMode, toggleDarkMode }) => {",
    "const Layout = ({ children, darkMode, toggleDarkMode }) => {\n  const { activeTheme, changeTheme, themes } = useTheme();"
  );
}

// Replace Logo in Sidebar
const oldLogoRegex = /<div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient\(135deg,#2D3748,#0D9488\)', display:'flex', alignItems:'center', justifyContent:'center' }}>\s*<span className="material-symbols-outlined".*?>temple_hindu<\/span>\s*<\/div>\s*<span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15, color:'#2D3748' }}>ગુજરાતી App<\/span>/g;

const newLogo = `{!darkMode ? (
                  <img src="/logo-dark.png" alt="Gujarati App Logo" style={{ height: '24px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ height: '24px', width: '100px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <img src="/logo-light.png" alt="Gujarati App Logo" style={{ height: '100%', objectFit: 'contain', transform: 'scale(3.5)', transformOrigin: 'left center' }} />
                  </div>
                )}`;

layoutContent = layoutContent.replace(oldLogoRegex, newLogo);

// Add Theme Switcher in Sidebar (e.g., right before the close of the drawer panel)
const themeSwitcherSidebarJSX = `
            {/* Theme Settings in Sidebar */}
            <div style={{ padding: '24px 16px', marginTop: 'auto', borderTop: \`1px solid \${bdr}\` }}>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                એપ થીમ (App Theme)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.values(themes).map(theme => (
                  <div 
                    key={theme.id}
                    onClick={() => changeTheme(theme.id)}
                    style={{
                      borderRadius: 12,
                      padding: '10px 14px',
                      background: activeTheme.id === theme.id ? (darkMode ? '#2D3748' : '#FFF8EF') : 'transparent',
                      border: activeTheme.id === theme.id ? \`1.5px solid \${theme.gradient.split(',')[1].trim()}\` : \`1px solid \${bdr}\`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: theme.gradient }}></div>
                    <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize: 12, fontWeight: 700, color: txt }}>
                      {theme.name}
                    </span>
                    {activeTheme.id === theme.id && (
                      <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: 18, color: theme.gradient.split(',')[1].trim() }}>check_circle</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
`;

// Replace the closing div of the drawer panel to inject the theme switcher right before it
layoutContent = layoutContent.replace(
  /<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\}\s*export default Layout;/g,
  themeSwitcherSidebarJSX + "\n        </div>\n      )}\n    </div>\n  );\n}\n\nexport default Layout;"
);

fs.writeFileSync('src/components/Layout.jsx', layoutContent);

// 2. Remove Theme Switcher from Profile.jsx
let profileContent = fs.readFileSync('src/components/Profile.jsx', 'utf8');

const themeSectionRegex = /\{\/\* ─────────────────────────────────────────────────────────\s*THEME SETTINGS\s*───────────────────────────────────────────────────────── \*\/\}[\s\S]*?(?=\{\/\* ─────────────────────────────────────────────────────────\s*GENERAL SETTINGS)/;

profileContent = profileContent.replace(themeSectionRegex, '');
fs.writeFileSync('src/components/Profile.jsx', profileContent);

console.log("Moved Theme Switcher to Sidebar");
