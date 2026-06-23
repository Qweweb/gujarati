const fs = require('fs');

let content = fs.readFileSync('d:/Antigravity/Gujarati/src/components/Dashboard.jsx', 'utf8');

const regex = /\{\/\* Panchang Hero Row \*\/\}[\s\S]*?(?=\{\/\* Daily Challenge Banner \*\/)/;

const newCard = `{/* Combined Panchang & Choghadiya Hero Card */}
      <Link to="/panchang" className="press" style={{
        display: 'flex', flexDirection: 'column', borderRadius: 24, textDecoration: 'none', position: 'relative', overflow: 'hidden', 
        background: 'linear-gradient(135deg, #2D3748, #0D9488)', color: '#fff', marginBottom: 12, padding: '24px',
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
          {/* Left: Tithi */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              આજની તિથિ
            </p>
            <p className="type-gu-display" style={{ color: '#fff', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {trTithi(data.tithi)}
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
               <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1", color: activeCG.isGood ? '#6EE7B7' : '#FCA5A5' }}>
                 {activeCG.isGood ? 'verified' : 'info'}
               </span>
               <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                 ચાલુ ચોઘડિયું
               </p>
            </div>
            <p className="type-gu-display" style={{ color: activeCG.isGood ? '#6EE7B7' : '#FCA5A5', marginTop: 4, fontSize: 20, lineHeight: 1.2 }}>
              {activeCG.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: 'rgba(255,255,255,0.9)' }}>
              {timeLeft && <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{timeLeft} બાકી</span>}
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>schedule</span>
              <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontSize: 11, fontWeight: 600 }}>{activeCG.endTime} સુધી</span>
            </div>
          </div>
        </div>

        {/* CTA Button at Bottom */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '8px 20px', background: 'rgba(255,255,255,0.15)', borderRadius: 12, fontSize: 12, fontWeight: 700, color: '#fff', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            સંપૂર્ણ પંચાંગ જુઓ <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings:"'wght' 700" }}>arrow_forward</span>
          </div>
        </div>

        {/* Background Decorative Icon */}
        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: 180, color: 'rgba(255,255,255,0.05)', fontVariationSettings: "'FILL' 1", pointerEvents: 'none' }}>
          calendar_month
        </span>
      </Link>
      
      `;

content = content.replace(regex, newCard);

fs.writeFileSync('d:/Antigravity/Gujarati/src/components/Dashboard.jsx', content);
console.log("Combined card injected");
