const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.jsx', 'utf8');

if (!content.includes('useTheme')) {
  content = content.replace(
    "import { supabase } from '../config/supabase';",
    "import { supabase } from '../config/supabase';\nimport { useTheme } from '../context/ThemeContext';"
  );
}

// Add useTheme inside Profile
if (!content.includes('const { activeTheme, changeTheme, themes } = useTheme();')) {
  content = content.replace(
    "const Profile = () => {",
    "const Profile = () => {\n  const { activeTheme, changeTheme, themes } = useTheme();"
  );
}

// Create the Theme Switcher JSX
const themeSwitcherJSX = `
      {/* ─────────────────────────────────────────────────────────
          THEME SETTINGS
          ───────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 16px', marginTop: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, paddingLeft: 4 }}>
          એપ થીમ સેટિંગ્સ
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
          {Object.values(themes).map(theme => (
            <div 
              key={theme.id}
              onClick={() => changeTheme(theme.id)}
              style={{
                borderRadius: 16,
                padding: 12,
                background: '#fff',
                border: activeTheme.id === theme.id ? \`2px solid \${theme.gradient.split(',')[1].trim()}\` : '1px solid #E8E6E3',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
                boxShadow: activeTheme.id === theme.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.gradient }}></div>
              <span style={{ fontSize: 11, fontWeight: 600, color: activeTheme.id === theme.id ? '#1A1614' : '#78716C', textAlign: 'center' }}>
                {theme.name}
              </span>
            </div>
          ))}
        </div>
      </div>
`;

// Insert the Theme Switcher JSX before the General Settings section
if (!content.includes('THEME SETTINGS')) {
  content = content.replace(
    "{/* ─────────────────────────────────────────────────────────\n          GENERAL SETTINGS",
    themeSwitcherJSX + "\n      {/* ─────────────────────────────────────────────────────────\n          GENERAL SETTINGS"
  );
}

fs.writeFileSync('src/components/Profile.jsx', content);
console.log("Profile updated with theme switcher");
