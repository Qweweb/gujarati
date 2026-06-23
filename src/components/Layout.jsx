import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../supabaseClient';
import { Capacitor } from '@capacitor/core';

/* ─────────────────────────────────────────────────────────────────
   LAYOUT — Premium shell: 56dp header, bottom nav, sidebar drawer
   ───────────────────────────────────────────────────────────────── */
const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { activeTheme, changeTheme, themes, featureFlags, comingSoonFeature, setComingSoonFeature, PATH_TO_FEATURE_KEY } = useTheme();
  const [toastMessage, setToastMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coins, setCoins] = useState(() =>
    parseInt(localStorage.getItem('gujarat_coins') || '100', 10)
  );

  // Google profile
  const googleAvatar = localStorage.getItem('google_avatar') || '';
  const googleName   = localStorage.getItem('google_name')   || '';

  const handleLogout = async () => {
    setIsSidebarOpen(false);
    try {
      await supabase.auth.signOut();
    } catch(e) {}
    localStorage.removeItem('sanskari_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('profile_completed');
    localStorage.removeItem('google_name');
    localStorage.removeItem('google_email');
    localStorage.removeItem('google_avatar');
    window.location.reload();
  };
  const initials     = googleName ? googleName.charAt(0).toUpperCase() : 'G';

  // Colors
  const bg  = darkMode ? (activeTheme.bgDark || '#141210') : (activeTheme.bgLight || '#F9F9F7');
  const surf = darkMode ? (activeTheme.surfDark || '#1E1A18') : (activeTheme.surfLight || '#FFFFFF');
  const bdr  = darkMode ? (activeTheme.bdrDark || '#2E2825') : (activeTheme.bdrLight || '#E8E6E3');
  const txt  = darkMode ? (activeTheme.txtDark || '#F2F0EE') : (activeTheme.txtLight || '#1A1614');
  const muted = darkMode ? '#A8A29E' : '#78716C';

  const isAndroid = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  const safeTop = isAndroid ? 'env(safe-area-inset-top, 36px)' : 'env(safe-area-inset-top, 0px)';
  const safeBottom = isAndroid ? 'env(safe-area-inset-bottom, 36px)' : 'env(safe-area-inset-bottom, 0px)';

  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listener;
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        // If we are on the home tab, ask to exit
        if (location.pathname === '/' || location.pathname === '/home') {
          setShowExitModal(true);
        } else {
          window.history.back();
        }
      }).then(l => listener = l);
    });
    return () => {
      if (listener) listener.remove();
    };
  }, [location.pathname]);

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

  // Pull to refresh states
  const [pullStart, setPullStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      // Pull to refresh only when scrolled to top
      if (window.scrollY <= 5) {
        setPullStart(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (pullStart === null) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - pullStart;
      
      if (distance > 0) {
        // Apply physics-like resistance
        const newDistance = Math.min(distance * 0.4, 80);
        setPullDistance(newDistance);
        
        // Prevent default browser refresh action if pulling down
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullStart === null) return;
      if (pullDistance > 55) {
        setIsRefreshing(true);
        // Dispatch refreshing state / Reloading
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setPullStart(null);
        setPullDistance(0);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullStart, pullDistance]);

  const navItems = [
    { path: '/',           icon: 'home',         label: 'હોમ'      },
    { path: '/devotional', icon: 'auto_stories',  label: 'ભક્તિ'    },
    { path: '/health',     icon: 'favorite',      label: 'સ્વાસ્થ્ય' },
    { path: '/tools',      icon: 'construction',  label: 'સાધનો'    },
    { path: '/community',  icon: 'groups',        label: 'બેઠક'     },
  ];

  const isCardViewer = location.pathname === '/c' || location.pathname.startsWith('/c/') || (location.pathname.startsWith('/card/') && location.pathname !== '/card');

  const fullScreenRoutes = ['/traffic-tod', '/brick-breaker', '/farasan-slicer', '/kite-cutter', '/kbc-quiz'];
  const isFullScreen = fullScreenRoutes.includes(location.pathname);

  if (isCardViewer || isFullScreen) return <div style={{ background: bg, color: txt, minHeight: '100svh' }}>{children}</div>;

  const pullProgress = Math.min(pullDistance / 55, 1);

  return (
    <div style={{ background: bg, color: txt, minHeight: '100svh' }} className="font-body pb-24 transition-colors duration-300">

      {/* ══ PULL TO REFRESH INDICATOR ══════════════════════════════ */}
      <div
        style={{
          position: 'fixed',
          top: `calc(${safeTop} + 4px)`,
          left: '50%',
          transform: `translateX(-50%) translateY(${Math.max(0, pullDistance - 4)}px)`,
          zIndex: 9998,
          pointerEvents: 'none',
          opacity: pullDistance > 8 || isRefreshing ? 1 : 0,
          transition: isRefreshing ? 'opacity 0.2s ease' : 'none',
        }}
      >
        <div style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: darkMode ? 'rgba(30,26,24,0.95)' : 'rgba(255,255,255,0.95)',
          border: `2px solid ${activeTheme.primaryAccent || '#B45309'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 20px rgba(0,0,0,0.18), 0 0 0 3px ${darkMode ? 'rgba(30,26,24,0.5)' : 'rgba(255,255,255,0.5)'}`,
          backdropFilter: 'blur(12px)',
        }}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: 22,
              color: activeTheme.primaryAccent || '#B45309',
              transform: isRefreshing
                ? 'rotate(0deg)'
                : `rotate(${pullProgress * 360}deg)`,
              animation: isRefreshing ? 'spin 0.7s linear infinite' : 'none',
              transition: isRefreshing ? 'none' : 'transform 0.05s linear',
              fontVariationSettings: "'FILL' 1",
            }}
          >
            {isRefreshing ? 'sync' : 'arrow_downward'}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px) scale(0.92); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>


      {/* ══ TOP HEADER — 56dp ══════════════════════════════════════ */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          height: `calc(56px + ${safeTop})`,
          paddingTop: safeTop,
          paddingLeft: '16px',
          paddingRight: '16px',
          background: darkMode ? 'rgba(20,18,16,0.96)' : 'rgba(249,249,247,0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${bdr}`,
          display: 'flex', alignItems: 'center',
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
        <Link to="/" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
          <img 
            src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
            alt="Gujarati App" 
            style={{ height: '42px', objectFit: 'contain' }} 
          />
        </Link>

        {/* Right actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>

          {/* Coin counter — no dollar sign, uses coin icon */}
          <Link to="/rewards"
            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:10, textDecoration:'none', background: darkMode ? `rgba(${activeTheme.primaryAccentRgb || '180,83,9'},0.18)` : (activeTheme.primaryAccentLight || '#FEF3C7'), color: activeTheme.primaryAccent || '#B45309' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize:16, color: activeTheme.primaryAccent || '#F59E0B', fontVariationSettings:"'FILL' 1" }}>toll</span>
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
              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background: activeTheme.heroGradient || activeTheme.gradient, color:'#fff', fontWeight:800, fontSize:14, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>{initials}</div>
            }
          </Link>
        </div>
      </header>

      {/* ══ MAIN CONTENT ═══════════════════════════════════════════ */}
      <main style={{ paddingTop: `calc(80px + ${safeTop})`, paddingLeft: '16px', paddingRight: '16px', paddingBottom: `calc(76px + ${safeBottom})`, maxWidth: '640px', margin: '0 auto' }}>
        {children}
      </main>

      {/* ══ BOTTOM NAV ═════════════════════════════════════════════ */}
      <nav
        style={{
          position:'fixed', bottom:0, left:0, right:0, zIndex:40,
          background: darkMode ? 'rgba(20,18,16,0.97)' : 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${bdr}`,
          height: `calc(60px + ${safeBottom})`,
          paddingBottom: safeBottom,
          display:'flex', alignItems:'stretch',
        }}
      >
        <div style={{ display:'flex', flex:1, maxWidth:640, margin:'0 auto' }}>
          {navItems.filter(item => {
            const key = PATH_TO_FEATURE_KEY[item.path];
            return !key || featureFlags[key] !== 'off';
          }).map(({ path, icon, label }) => {
            const key = PATH_TO_FEATURE_KEY[path];
            const status = key ? featureFlags[key] : 'live';
            const isActive = location.pathname === path;

            const handleNavClick = (e) => {
              if (status === 'coming_soon') {
                e.preventDefault();
                setComingSoonFeature(label);
              }
            };

            return (
              <Link
                key={path}
                to={status === 'coming_soon' ? '#' : path}
                onClick={handleNavClick}
                style={{
                  flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  gap:2, textDecoration:'none', position:'relative',
                  transition:'all 0.15s ease',
                }}
              >
                {/* Top indicator line */}
                {isActive && (
                  <span style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:2, borderRadius:9999, background: activeTheme.primaryAccent || '#B45309' }} />
                )}
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 24,
                    color: isActive ? (activeTheme.primaryAccent || '#B45309') : muted,
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
                  color: isActive ? (activeTheme.primaryAccent || '#B45309') : muted,
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

      {/* 🚀 TOAST 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 */}
      {toastMessage && (
        <div
          style={{
            position:'fixed', bottom:120, left:'50%', transform:'translateX(-50%)',
            zIndex:9999, pointerEvents:'none', maxWidth:'calc(100% - 32px)', width:'max-content',
          }}
        >
          <div className="animate-slide-up" style={{
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
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
          >
            {/* Drawer header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 16px', borderBottom:`1px solid ${bdr}` }}>
              <div style={{ display:'flex', alignItems:'center' }}>
                <img 
                  src={darkMode ? "/logo-light.png" : "/logo-dark.png"} 
                  alt="Gujarati App" 
                  style={{ height: '42px', objectFit: 'contain' }} 
                />
              </div>
              <button onClick={() => setIsSidebarOpen(false)}
                style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, border:'none', background: darkMode ? '#272220' : '#F4F4F2', color: muted, cursor:'pointer' }}>
                <span className="material-symbols-outlined" style={{ fontSize:16 }}>close</span>
              </button>
            </div>

            {/* User card */}
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}
              style={{ margin:'12px 12px 4px', padding:'12px', borderRadius:14, display:'flex', alignItems:'center', gap:10, textDecoration:'none', background: darkMode ? (activeTheme.surfDark || '#272220') : (activeTheme.primaryAccentLight || '#FFF8EF'), border:`1px solid ${darkMode ? (activeTheme.bdrDark || '#2E2825') : (activeTheme.primaryAccent || '#FDE68A')}` }}>
              <div style={{ width:44, height:44, borderRadius:12, overflow:'hidden', flexShrink:0, border:`2px solid ${darkMode ? (activeTheme.bdrDark || '#2E2825') : (activeTheme.primaryAccent || '#FCD34D')}` }}>
                {googleAvatar
                  ? <img src={googleAvatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background: activeTheme.heroGradient || activeTheme.gradient || 'linear-gradient(135deg,#B45309,#F59E0B)', color:'#fff', fontWeight:800, fontSize:16 }}>{initials}</div>
                }
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontWeight:700, fontSize:14, color: txt, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {googleName || 'ગુજરાતી યુઝર'}
                </p>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:11, color: activeTheme.primaryAccent || '#B45309', margin:0 }}>પ્રોફાઇલ જુઓ →</p>
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

              
              <DrawerSection label="કલર થીમ (Color Theme)" darkMode={darkMode}>
                <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.values(themes).map(t => (
                    <button
                      key={t.id}
                      onClick={() => { changeTheme(t.id); setIsSidebarOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                        borderRadius: '12px', border: activeTheme.id === t.id ? '1.5px solid ' + (t.primaryAccent || '#F59E0B') : '1px solid ' + (darkMode ? '#333' : '#E8E6E3'),
                        background: activeTheme.id === t.id ? (darkMode ? `rgba(${t.primaryAccentRgb || '180,83,9'}, 0.15)` : (t.primaryAccentLight || '#FFF8EF')) : 'transparent',
                        color: darkMode ? '#F2F0EE' : '#1A1614',
                        cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: t.gradient, flexShrink: 0 }} />
                      <span style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: activeTheme.id === t.id ? 800 : 600, fontSize: '13px' }}>
                        {t.name}
                      </span>
                      {activeTheme.id === t.id && (
                        <span className="material-symbols-outlined" style={{ marginLeft: 'auto', fontSize: '18px', color: t.primaryAccent || '#F59E0B' }}>check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </DrawerSection>

              <DrawerSection label="માય પ્રોફાઇલ" darkMode={darkMode}>
                <DrawerLink to="/profile"  icon="person"   label="માય પ્રોફાઇલ"  onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerLink to="/settings" icon="settings" label="સેટિંગ્સ" onClick={() => setIsSidebarOpen(false)} loc={location.pathname} darkMode={darkMode} />
                <DrawerButton icon="logout" label="લોગ-આઉટ" onClick={handleLogout} darkMode={darkMode} />
              </DrawerSection>
            </div>

            <p style={{ textAlign:'center', fontSize:11, padding:'12px', color: muted, fontFamily:'"Plus Jakarta Sans",sans-serif' }}>Version 1.0.0 Beta</p>
          </div>
        </div>
      )}

      {/* ══ EXIT APP MODAL ══════════════════════════════════════════════ */}
      {showExitModal && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          {/* Backdrop */}
          <div 
            onClick={() => setShowExitModal(false)} 
            style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', animation:'fadeIn 0.2s ease' }} 
          />
          
          {/* Modal Content */}
          <div style={{ position:'relative', background: surf, width:'100%', maxWidth:'340px', borderRadius:'32px', padding:'36px 24px', textAlign:'center', boxShadow:'0 24px 48px rgba(0,0,0,0.25)', animation:'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            
            <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, #EF4444, #DC2626)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 12px 24px rgba(239,68,68,0.35)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'40px', color:'#fff', transform:'translateX(2px)' }}>logout</span>
            </div>
            
            <h2 style={{ fontSize:'24px', fontWeight:900, marginBottom:'12px', color: txt, fontFamily:'"Noto Serif Gujarati",serif' }}>એપ બંધ કરવી છે?</h2>
            <p style={{ color: muted, fontSize:'16px', lineHeight:'1.5', marginBottom:'32px', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:500 }}>
              શું તમે ખરેખર ગુજરાતી એપ માંથી બહાર નીકળવા માંગો છો?
            </p>
            
            <div style={{ display:'flex', gap:'16px' }}>
              <button 
                onClick={() => setShowExitModal(false)}
                style={{ flex:1, padding:'16px', borderRadius:'18px', border:`2px solid ${bdr}`, background:'transparent', color: txt, fontSize:'16px', fontWeight:800, fontFamily:'"Noto Serif Gujarati",serif', cursor:'pointer' }}
              >
                ના, ચાલુ રાખો
              </button>
              <button 
                onClick={async () => {
                  const { App: CapApp } = await import('@capacitor/app');
                  CapApp.exitApp();
                }}
                style={{ flex:1, padding:'16px', borderRadius:'18px', border:'none', background:'linear-gradient(135deg, #EF4444, #DC2626)', color:'#fff', fontSize:'16px', fontWeight:800, boxShadow:'0 8px 20px rgba(239,68,68,0.3)', fontFamily:'"Noto Serif Gujarati",serif', cursor:'pointer' }}
              >
                હા, બહાર નીકળો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ COMING SOON MODAL ══════════════════════════════════════════ */}
      {comingSoonFeature && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
          {/* Backdrop */}
          <div 
            onClick={() => setComingSoonFeature(null)} 
            style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', animation:'fadeIn 0.2s ease' }} 
          />
          
          {/* Modal Content */}
          <div style={{ position:'relative', background: surf, width:'100%', maxWidth:'360px', borderRadius:'32px', padding:'36px 24px', textAlign:'center', border:`2px solid ${darkMode ? '#4A3E1A' : '#FDE68A'}`, boxShadow:'0 24px 48px rgba(0,0,0,0.25)', animation:'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            
            {/* Animated Yellow Icon Box */}
            <div style={{ width:'80px', height:'80px', background:'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:'0 12px 24px rgba(245,158,11,0.35)' }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize:'40px' }}>construction</span>
            </div>
            
            <h2 style={{ fontSize:'22px', fontWeight:900, marginBottom:'12px', color: txt, fontFamily:'"Noto Serif Gujarati",serif' }}>ટૂંક સમયમાં આવી રહ્યું છે!</h2>
            <p style={{ color: muted, fontSize:'15px', lineHeight:'1.6', marginBottom:'32px', fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:500 }}>
              <b>{comingSoonFeature}</b> વિભાગ પર હજુ કામ ચાલુ છે. ખૂબ જ નજીકના સમયમાં આ સેવા શરૂ કરવામાં આવશે. કૃપા કરીને થોડી પ્રતીક્ષા કરો. 🙏
            </p>
            
            <button 
              onClick={() => setComingSoonFeature(null)}
              style={{ width:'100%', padding:'16px', borderRadius:'18px', border:'none', background:'linear-gradient(135deg, #F59E0B, #D97706)', color:'#fff', fontSize:'16px', fontWeight:800, boxShadow:'0 8px 20px rgba(245,158,11,0.3)', fontFamily:'"Noto Serif Gujarati",serif', cursor:'pointer' }}
            >
              બરાબર છે
            </button>
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
  const { activeTheme, featureFlags, setComingSoonFeature, PATH_TO_FEATURE_KEY } = useTheme();

  const key = PATH_TO_FEATURE_KEY[to];
  const status = key ? featureFlags[key] : 'live';

  if (status === 'off') return null;

  const handleClick = (e) => {
    if (status === 'coming_soon') {
      e.preventDefault();
      setComingSoonFeature(label);
      onClick(); // close sidebar
      return;
    }
    onClick();
  };

  return (
    <Link to={status === 'coming_soon' ? '#' : to} onClick={handleClick} style={{
      display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
      borderRadius:10, textDecoration:'none',
      background: isActive ? (darkMode ? `rgba(${activeTheme.primaryAccentRgb || '180,83,9'},0.2)` : (activeTheme.primaryAccentLight || '#FFF8EF')) : 'transparent',
      color: isActive ? (activeTheme.primaryAccent || '#B45309') : (darkMode ? '#A8A29E' : '#78716C'),
      fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:13,
      transition:'background 0.15s',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize:20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
      {label}
    </Link>
  );
};

const DrawerButton = ({ icon, label, onClick, darkMode }) => {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
      borderRadius:10, cursor:'pointer', textDecoration:'none',
      background: 'transparent',
      color: darkMode ? '#ef4444' : '#ef4444',
      fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:600, fontSize:13,
      transition:'background 0.15s',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize:18 }}>{icon}</span>
      {label}
    </div>
  );
};

export default Layout;

