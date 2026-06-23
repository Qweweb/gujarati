const fs = require('fs');

let content = fs.readFileSync('d:/Antigravity/Gujarati/src/components/Dashboard.jsx', 'utf8');

const replacements = [
  // 1. Jay Bhagavan
  ['<h1 className="type-gu-title" style={{ color:\'#1A1614\', marginTop:2 }}>',
   '<h1 className="type-gu-title text-[#1A1614] dark:text-stone-100" style={{ marginTop:2 }}>'],
   
  // 2. Choghadiya Card
  ['background: \'#F8FAFC\',',
   '/* background */'],
  ['className="press" style={{\\n          flex: 0.9',
   'className="press bg-[#F8FAFC] dark:bg-[#1C1A19]" style={{flex: 0.9'],
  ['color: activeCG.isGood ? \'#2D3748\' : \'#78716C\' }}>ચોઘડિયું</p>',
   'color: activeCG.isGood ? \'#2D3748\' : \'#78716C\' }} className="dark:!text-stone-300">ચોઘડિયું</p>'],
  ['color: activeCG.isGood ? \'#0D9488\' : \'#1A1614\', marginTop:4 }}>{activeCG.name}</p>',
   'color: activeCG.isGood ? \'#0D9488\' : \'#1A1614\', marginTop:4 }} className="type-gu-display dark:!text-stone-100">{activeCG.name}</p>'],

  // 3. Daily Challenge Banner
  ['background:\'#F8FAFC\', border:\'1.5px solid #0D9488\',',
   '/* bg */ border:\'1.5px solid #0D9488\','],
  ['<div style={{\\n        display:\'flex\', alignItems:\'center\', gap:12, padding:\'14px 16px\', borderRadius:16,',
   '<div className="bg-[#F8FAFC] dark:bg-[#1C1A19]" style={{ display:\'flex\', alignItems:\'center\', gap:12, padding:\'14px 16px\', borderRadius:16,'],
  ['className="type-gu-body" style={{ fontWeight:700, color:\'#1A1614\', margin:0, whiteSpace:\'nowrap\', overflow:\'hidden\', textOverflow:\'ellipsis\' }}>',
   'className="type-gu-body text-[#1A1614] dark:text-stone-100" style={{ fontWeight:700, margin:0, whiteSpace:\'nowrap\', overflow:\'hidden\', textOverflow:\'ellipsis\' }}>'],

  // 4. Tabs
  ['background: activeTab === tab.id ? \'#F8FAFC\' : \'#FFFFFF\',',
   'background: activeTab === tab.id ? \'var(--bg-active, #F8FAFC)\' : \'var(--bg-inactive, #FFFFFF)\','],
  ['color: activeTab === tab.id ? \'#2D3748\' : \'#78716C\',',
   'color: activeTab === tab.id ? \'var(--text-active, #2D3748)\' : \'var(--text-inactive, #78716C)\','],

  // 5. Tools Grid Background
  ['<div style={{ background:\'#FFFFFF\', border:\'1px solid #E8E6E3\', borderRadius:16, padding:\'16px 12px\' }}>',
   '<div className="bg-[#FFFFFF] dark:bg-[#1C1A19] dark:border-stone-800" style={{ border:\'1px solid #E8E6E3\', borderRadius:16, padding:\'16px 12px\' }}>'],
  
  // Tools Grid items label text (using global replace to catch all map iterations if needed, though it's inside a map)
];

for (let [search, replace] of replacements) {
  content = content.replace(search, replace);
}

// Global replace for tool grid label
content = content.replace(/<p className="type-gu-caption line-clamp-1" style={{ color:'#1A1614', textAlign:'center', fontSize:11, fontWeight: 600 }}>{label}<\/p>/g,
  '<p className="type-gu-caption line-clamp-1 text-[#1A1614] dark:text-stone-200" style={{ textAlign:\'center\', fontSize:11, fontWeight: 600 }}>{label}</p>');

// And let's fix the inline styles for tabs using a style tag or something so they work in dark mode.
// Actually, it's easier to just add dark: classes to the buttons and remove the inline background/color if possible.
// Wait, the activeTab colors are inline. I'll just change the inline vars:
content = content.replace(/<div style={{ display:'flex', gap:6, overflowX:'auto', marginLeft:-16, marginRight:-16, padding:'0 16px' }} className="no-scrollbar">/g,
  `<style>
        .dark {
          --bg-active: #2D3748;
          --bg-inactive: #1C1A19;
          --text-active: #fff;
          --text-inactive: #A8A29E;
        }
      </style>
      <div style={{ display:'flex', gap:6, overflowX:'auto', marginLeft:-16, marginRight:-16, padding:'0 16px' }} className="no-scrollbar">`);

fs.writeFileSync('d:/Antigravity/Gujarati/src/components/Dashboard.jsx', content, 'utf8');
console.log('Dashboard text replacements done!');
