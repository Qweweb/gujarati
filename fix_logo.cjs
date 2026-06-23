const fs = require('fs');
const path = require('path');

const file = path.join('d:/Antigravity/Gujarati/src/components', 'Layout.jsx');
let content = fs.readFileSync(file, 'utf8');

const t1 = `<Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, textDecoration:'none' }}>`;
const t2 = `<span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:16, color:'#B45309', letterSpacing:'-0.02em' }}>ગુજરાતી App</span>`;
const t3 = `</Link>`;

const r1 = `<Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
          <img 
             src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
             alt="Gujarati App" 
             style={{ height: '40px', objectFit: 'contain' }} 
          />
        </Link>`;

let idx1 = content.indexOf(t1);
if (idx1 !== -1) {
    let endIdx1 = content.indexOf(t3, idx1);
    if (endIdx1 !== -1) {
        content = content.slice(0, idx1) + r1 + content.slice(endIdx1 + t3.length);
        console.log("Replaced header logo.");
    }
}

const t4 = `<div style={{ display:'flex', alignItems:'center', gap:8 }}>`;
const t5 = `<span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15, color:'#B45309' }}>ગુજરાતી App</span>`;
const t6 = `</div>`;

const r2 = `<div style={{ display:'flex', alignItems:'center' }}>
                <img 
                  src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="Gujarati App" 
                  style={{ height: '36px', objectFit: 'contain' }} 
                />
              </div>`;

let idx2 = content.indexOf(t4);
if (idx2 !== -1) {
    // Find the second </div> after idx2.
    let endIdx2 = content.indexOf(t5, idx2);
    if (endIdx2 !== -1) {
         let endDiv = content.indexOf(t6, endIdx2);
         content = content.slice(0, idx2) + r2 + content.slice(endDiv + t6.length);
         console.log("Replaced sidebar logo.");
    }
}

fs.writeFileSync(file, content, 'utf8');
