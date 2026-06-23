const fs = require('fs');
const path = require('path');

const baseDir = 'd:/Antigravity/Gujarati/src';
const dashFile = path.join(baseDir, 'components', 'Dashboard.jsx');
let content = fs.readFileSync(dashFile, 'utf8');

const startMarker = '{/* Date greeting */}';
const endMarker = '{/* Daily Challenge Banner */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `      {/* Combined Panchang Hero Card */}
      <Link to="/panchang" className="press" style={{
        display: 'flex', flexDirection: 'column', borderRadius: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden', 
        background: 'linear-gradient(135deg, #B45309, #F97316)', color: '#fff', marginBottom: 12, padding: '24px',
        boxShadow: '0 10px 25px -5px rgba(180, 83, 9, 0.4)'
      }}>
        {/* Centered Top Greeting */}
        <div style={{ textAlign: 'center', marginBottom: 16, zIndex: 1 }}>
          <h2 style={{ fontFamily: '"Noto Serif Gujarati",serif', fontSize: 22, fontWeight: 900 }}>🙏 જય શ્રી કૃષ્ણ</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          {/* Left: Tithi & Date */}
          <div style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
              આજની તિથિ
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {trTithi(data.tithi)}
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 2, fontSize: 20, lineHeight: 1.2 }}>
              {todayVaar} • {todayDate}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'rgba(255,255,255,0.9)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>wb_sunny</span>
              <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>{data.sunrise} - {data.sunset}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 16px' }}></div>

          {/* Right: Choghadiya */}
          <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
               <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1", color: '#fff' }}>
                 {activeCG.isGood ? 'check_circle' : 'warning'}
               </span>
               <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                 ચાલુ ચોઘડિયું
               </p>
            </div>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {activeCG.name}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 8, color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>{activeCG.endTime} સુધી</span>
              {timeLeft && <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, color: '#fff', marginTop: 2, fontWeight: 500, background: 'rgba(0,0,0,0.15)', padding: '2px 6px', borderRadius: 4 }}>{timeLeft} બાકી</span>}
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <span className="material-symbols-outlined" style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, color: 'rgba(255,255,255,0.05)', fontVariationSettings: "'FILL' 1", zIndex: 0, pointerEvents: 'none' }}>calendar_month</span>
      </Link>

      `;

    content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
    fs.writeFileSync(dashFile, content, 'utf8');
    console.log("Successfully rebuilt the Hero Card!");
} else {
    console.log("Could not find markers.");
}
