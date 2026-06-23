const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Antigravity/Gujarati/src';
const dashFile = path.join(baseDir, 'components', 'Dashboard.jsx');
let content = fs.readFileSync(dashFile, 'utf8');

const targetStr = `      {/* Date greeting */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 4px' }}>
        <div>
          <p className="type-overline">{todayVaar} • {todayDate}</p>
          <h1 className="type-gu-title text-[#1A1614] dark:text-stone-100" style={{ marginTop:2 }}>
            <span style={{ fontFamily:'"Noto Serif Gujarati",serif' }}>🙏 જય ભગવાન!</span>
          </h1>
        </div>
        <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
          🕉️
        </div>
      </div>

      {/* Combined Panchang & Choghadiya Hero Card */}
      <Link to="/panchang" className="press" style={{
        display: 'flex', flexDirection: 'column', borderRadius: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden', 
        background: activeTheme.gradient, color: '#fff', marginBottom: 12, padding: '24px',
        boxShadow: activeTheme.cardShadow
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          {/* Left: Tithi */}
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              આજની તિથિ
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {trTithi(data.tithi)}
            </p>`;

const replaceStr = `      {/* Combined Panchang & Choghadiya Hero Card */}
      <Link to="/panchang" className="press" style={{
        display: 'flex', flexDirection: 'column', borderRadius: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden', 
        background: activeTheme.gradient, color: '#fff', marginBottom: 12, padding: '24px',
        boxShadow: activeTheme.cardShadow
      }}>
        {/* Centered Top Greeting */}
        <div style={{ textAlign: 'center', marginBottom: 16, zIndex: 1 }}>
          <h2 style={{ fontFamily: '"Noto Serif Gujarati",serif', fontSize: 22, fontWeight: 900 }}>🙏 જય શ્રી કૃષ્ણ</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          {/* Left: Tithi */}
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              આજની તિથિ
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {trTithi(data.tithi)}
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 2, fontSize: 20, lineHeight: 1.2 }}>
              {todayVaar} • {todayDate}
            </p>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replaceStr);
    fs.writeFileSync(dashFile, content, 'utf8');
    console.log("Successfully updated Dashboard UI.");
} else {
    console.log("Could not find the target string in Dashboard.jsx.");
}
