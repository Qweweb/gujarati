import sys

try:
    with open('src/components/Dashboard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    suvichar_find = """      <div id="daily-suvichar" style={{
        borderRadius:16, padding:'18px 20px',
        background:'linear-gradient(135deg,#1E1B4B,#312E81)',
        boxShadow:'0 4px 16px rgba(30,27,75,0.3)',
      }}>"""
      
    suvichar_replace = """      <Link to="/post-maker" id="daily-suvichar" className="press" style={{
        borderRadius:16, padding:'18px 20px', textDecoration: 'none', display: 'block',
        background:'linear-gradient(135deg,#1E1B4B,#312E81)',
        boxShadow:'0 4px 16px rgba(30,27,75,0.3)',
      }}>
        <div style={{ position: 'absolute', right: 20, marginTop: -5, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 10, fontSize: 10, color: 'white', fontWeight: 'bold' }}>પોસ્ટ બનાવો</div>"""

    if suvichar_find in content:
        content = content.replace(suvichar_find, suvichar_replace)
        content = content.replace(
            """          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:44, lineHeight:1, color:'#818CF8', opacity:0.4, position:'absolute', bottom:-12, right:0 }}>"</span>
        </div>
      </div>""",
            """          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:44, lineHeight:1, color:'#818CF8', opacity:0.4, position:'absolute', bottom:-12, right:0 }}>"</span>
        </div>
      </Link>"""
        )
        
        with open('src/components/Dashboard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated Dashboard.jsx")
    else:
        print("Could not find the suvichar section in Dashboard.jsx.")
        
except Exception as e:
    print("Error:", e)
