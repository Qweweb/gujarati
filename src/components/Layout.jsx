import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────
   LAYOUT — Premium shell: 56dp header, bottom nav, sidebar drawer
   ───────────────────────────────────────────────────────────────── */
const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coins, setCoins] = useState(() =>
    parseInt(localStorage.getItem('gujarat_coins') || '100', 10)
  );

  // Google profile
  const googleAvatar = localStorage.getItem('google_avatar') || '';
  const googleName   = localStorage.getItem('google_name')   || '';
  const initials     = googleName ? googleName.charAt(0).toUpperCase() : 'G';

  // Colors
  const bg  = darkMode ? '#141210' : '#F9F9F7';
  const surf = darkMode ? '#1E1A18' : '#FFFFFF';
  const bdr  = darkMode ? '#2E2825' : '#E8E6E3';
  const txt  = darkMode ? '#F2F0EE' : '#1A1614';
  const muted = darkMode ? '#A8A29E' : '#78716C';

  useEffect(() => {
    const onToast = (e) => setToastMessage(e.detail.message);
    const onCoins = () => setCoins(parseInt(localStorage.getItem('gujarat_coins') || '100', 10));
    window.addEventListener('show-toast', onToast);
    window.addEventListener('coins-updated', onCoins);
    return () => { window.removeEventListener('show-toast', onToast); window.removeEventListener('coins-updated', onCoins); };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(''), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('section') || params.get('feature');
    if (!id) return;
    let n = 0;
    const iv = setInterval(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); clearInterval(iv); }
      if (++n > 20) clearInterval(iv);
    }, 100);
    return () => clearInterval(iv);
  }, [location]);

  const navItems = [
    { path: '/',           icon: 'home',         label: 'હોમ'      },
    { path: '/devotional', icon: 'auto_stories',  label: 'ભક્તિ'    },
    { path: '/health',     icon: 'favorite',      label: 'સ્વાસ્થ્ય' },
    { path: '/tools',      icon: 'construction',  label: 'સાધનો'    },
    { path: '/community',  icon: 'groups',        label: 'બેઠક'     },
  ];

  const isCardViewer = location.pathname === '/c' || location.pathname.startsWith('/c/') || (location.pathname.startsWith('/card/') && location.pathname !== '/card');
  if (isCardViewer) return <div style={{ background: bg, color: txt, minHeight: '100svh' }}>{children}</div>;

  return (
    <div style={{ background: bg, color: txt, minHeight: '100svh' }} className="font-body pb-24 transition-colors duration-300">

      {/* ══ TOP HEADER — 56dp ══════════════════════════════════════ */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          height: '56px',
          background: darkMode ? 'rgba(20,18,16,0.96)' : 'rgba(249,249,247,0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${bdr}`,
          display: 'flex', alignItems: 'center',
          padding: '0 16px',
          gap: '12px',
        }}
      >
        {/* Hamburger or Back Button */}
        {!['/', '/devotional', '/health', '/tools', '/community'].includes(location.pathname) ? (
          <button
            onClick={() => window.history.back()}
            style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, color: muted, border:'none', background:'transparent', cursor:'pointer' }}
            aria-label="Back"
          >
            <span className="material-symbols-outlined" style={{ fontSize:24, fontWeight: 700 }}>arrow_back</span>
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, color: muted, border:'none', background:'transparent', cursor:'pointer' }}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize:22 }}>menu</span>
          </button>
        )}

        {/* Logo — centered */}
        <Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, textDecoration:'none' }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#B45309,#F59E0B)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:16, fontVariationSettings:"'FILL' 1" }}>temple_hindu</span>
          </div>
          <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:16, color:'#B45309', letterSpacing:'-0.02em' }}>ગુજરાતી App</span>
        </Link>

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>

          {/* Coin counter — no dollar sign, uses coin icon */}
          <Link to="/rewards"
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:10, textDecoration:'none', background: darkMode ? 'rgba(217,119,6,0.18)' : '#FEF3C7', color:'#B45309' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize:16, color:'#F59E0B', fontVariationSettings:"'FILL' 1" }}>toll</span>
            <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:13 }}>{coins}</span>
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10, color: muted, border:'none', background:'transparent', cursor:'pointer' }}
            aria-label={darkMode ? 'Light mode' : 'Dark mode'}
          >
            <span className="material-symbols-outlined" style={{ fontSize:20 }}>{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>

          {/* Avatar */}
          <Link to="/profile" style={{ width:34, height:34, borderRadius:10, overflow:'hidden', border:`2px solid ${bdr}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none' }}>
            {googleAvatar
              ? <img src={googleAvatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#B45309,#F59E0B)', color:'#fff', fontWeight:800, fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{initials}</div>
            }
          </Link>
        </div>
      </header>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════ */}
      <main style={{ paddingTop:'56px', maxWidth:'640px', margin:'0 auto', padding:'56px 16px 0' }}>
        {children}
      </main>

      {/* ══ BOTTOM NAV ═════════════════════════════════════════════ */}
      <nav
        style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:40,
          background: darkMode ? 'rgba(20,18,16,0.97)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${bdr}`,
          height:'60px',
          display:'flex', alignItems:'stretch',
        }}
      >
        <div style={{ display:'flex', flex:1, maxWidth:640, margin:'0 auto' }}>
          {navItems.map(({ path, icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                style={{
                  flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  gap:2, textDecoration:'none', position:'relative',
                  transition:'all 0.15s ease',
                }}
              >
                {/* Top indicator line */}
                {isActive && (
                  <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:2, borderRadius:9999, background:'#B45309' }} />
                )}
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 24,
                    color: isActive ? '#B45309' : muted,
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    transition: 'all 0.15s ease',
                  }}
                >
                  {icon}
                </span>
                <span style={{
                  fontFamily: '"Noto Serif Gujarati",serif',
                  fontSize: 10,
                  fontWeight: 700,
                  color: isActive ? '#B45309' : muted,
                  lineHeight: 1,
                  transition: 'color 0.15s ease',
                }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ══ TOAST ═══════════════════════════════════════════════════ */}
      {toastMessage && (
        <div
          className="animate-slide-up"
          style={{
            position:'fixed', bottom:72, left:'50%', transform:'translateX(-50%)',
            zIndex:9999, pointerEvents:'none', maxWidth:'calc(100% - 32px)', width:'max-content',
          }}
        >
          <div style={{
            background: darkMode ? '#F2F0EE' : '#1A1614',
            color: darkMode ? '#1A1614' : '#F2F0EE',
            fontFamily:'"Noto Serif Gujarati",serif',
            fontWeight:700,
            fontSize:13,
            padding:'10px 18px',
            borderRadius:14,
            boxShadow:'0 8px 24px rgba(0,0,0,0.18)',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize:18, color:'#F59E0B', fontVariationSettings:"'FILL' 1" }}>check_circle</span>
            <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:260 }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ══ SIDEBAR DRAWER ══════════════════════════════════════════ */}
      {isSidebarOpen && (
        <div className="animate-fade-in" style={{ position:'fixed', inset:0, zIndex:100, display:'flex' }}>
          {/* Backdrop */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }}
          />

          {/* Drawer panel */}
          <div
            className="animate-slide-up"
            style={{
              position:'relative', width:288, height:'100%', zIndex:10,
              background: surf, borderRight:`1px solid ${bdr}`,
              display:'flex', flexDirection:'column', overflowY:'auto',
            }}
          >
            {/* Drawer header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 16px', borderBottom:`1px solid ${bdr}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#B45309,#F59E0B)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:15, fontVariationSettings:"'FILL' 1" }}>temple_hindu</span>
                </div>
                <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:15, color:'#B45309' }}>ગુજરાતી App</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)}
                style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, border:'none', background: darkMode ? '#272220' : '#F4F4F2', color: muted, cursor:'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
              </button>
            </div>

            {/* User card */}
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}
              style={{ margin:'12px 12px 4px', padding:'12px', borderRadius:14, display:'flex', alignItems:'center', gap:10, textDecoration:'none', background: darkMode ? '#272220' : '#FFF8EF', border:`1px solid ${darkMode ? '#2E2825' : '#FDE68A'}` }}>
              <div style={{ width:44, height:44, borderRadius:12, overflow:'hidden', flexShrink:0, border:`2px solid ${darkMode ? '#2E2825' : '#FCD34D'}` }}>
                {googleAvatar
                  ? <img src={googleAvatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#B45309,#F59E0B)', color:'#fff', fontWeight:800, fontSize:16 }}>{initials}</div>
                }
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontWeight:700, fontSize:14, color: txt, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {googleName || 'ગુજરાતી યુઝર'}
                </p>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:11, color:'#B45309', margin:0 }}>પ્રોફાઇલ જુઓ →</p>
              </div>
            </Link>

            {/* Nav links */}
            <div style={{ padding:'8px 12px', flex:1 }}>
              <DrawerSection label="મુખ્ય" darkMode={darkMode}>
                <DrawerLink to="/"            icon="home"            label="હોમ"                   onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/devotional"  icon="auto_stories"    label="ભક્તિ સાહિત્ય"         onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/health"      icon="favorite"        label="સ્વાસ્થ્ય"             onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/tools"       icon="construction"    label="સાધનો"                 onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/community"   icon="groups"          label="ડિજિટલ બેઠક"           onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
              </DrawerSection>

              <DrawerSection label="ઇનામ અને રમતો" darkMode={darkMode}>
                <DrawerLink to="/rewards"         icon="card_giftcard"     label="મારા ઇનામો"          onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/daily-challenge" icon="psychology"        label="આજની શબ્દ રમત"      onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/gujarat-safari"  icon="map"               label="ગુજરાત સફારી"        onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/swipe-cards"     icon="style"             label="જ્ઞાન કાર્ડ્સ"      onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />

              </DrawerSection>

              <DrawerSection label="એકાઉન્ટ" darkMode={darkMode}>
                <DrawerLink to="/profile"  icon="person"   label="પ્રોફાઇલ"  onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/settings" icon="settings" label="સેટિંગ્સ" onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
              </DrawerSection>
            </div>

            <p style={{ textAlign:'center', fontSize:11, padding:'12px', color: muted, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Version 1.0.0 Beta</p>
          </div>
        </div>
      )}
    </div>
  );
};

const DrawerSection = ({ label, children, darkMode }) => (
  <div style={{ marginTop:16 }}>
    <p className="type-overline" style={{ padding:'0 8px', marginBottom:6, color: darkMode ? '#57534E' : '#A8A29E' }}>{label}</p>
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>{children}</div>
  </div>
);

const DrawerLink = ({ to, icon, label, onClick, loc, darkMode }) => {
  const isActive = loc === to;
  return (
    <Link to={to} onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
      borderRadius:10, textDecoration:'none',
      background: isActive ? (darkMode ? 'rgba(180,83,9,0.2)' : '#FFF8EF') : 'transparent',
      color: isActive ? '#B45309' : (darkMode ? '#A8A29E' : '#78716C'),
      fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:13,
      transition:'background 0.15s',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize:20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      {label}
    </Link>
  );
};

export default Layout;
