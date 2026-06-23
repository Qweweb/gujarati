const fs = require('fs');

let layoutContent = fs.readFileSync('src/components/Layout.jsx', 'utf8');

const themeSwitcherSidebarJSX = `

            {/* Theme Settings in Sidebar */}
            <div style={{ padding: '16px', borderTop: \`1px solid \${bdr}\`, marginTop: 'auto' }}>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize: 11, fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                એપ થીમ (Theme)
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
                    <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize: 13, fontWeight: 700, color: activeTheme.id === theme.id ? (darkMode ? '#fff' : '#1A1614') : txt }}>
                      {theme.name}
                    </span>
                    {activeTheme.id === theme.id && (
                      <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: 18, color: theme.gradient.split(',')[1].trim() }}>check_circle</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            `;

if (!layoutContent.includes('એપ થીમ (Theme)')) {
  // Find "Version 1.0.0 Beta" and insert right before it
  layoutContent = layoutContent.replace(
    /<p style=\{\{\s*textAlign:'center',\s*fontSize:11,\s*padding:'12px'/g,
    themeSwitcherSidebarJSX + "\n            <p style={{ textAlign:'center', fontSize:11, padding:'12px'"
  );
}

fs.writeFileSync('src/components/Layout.jsx', layoutContent);
console.log("Safely injected theme switcher into Layout sidebar using regex");
