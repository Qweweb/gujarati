import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateChoghadiyas } from '../utils/choghadiya_helper';
import { API_ENDPOINTS } from '../config/api';
import ShareButton from './ShareButton';

/* ─────────────────────────────────────────────────────────────────
   DASHBOARD — Expert Audit Restructure
   Zone 1: Contextual Hero (Panchang + Challenge)
   Zone 2: Category Tabs (All / Spiritual / Utilities / Business / Games)
   Zone 3: Tool Grid (filtered by tab, 72dp icons, 1-line labels)
   Zone 4: Engagement (Suvichar + Alert)
   ───────────────────────────────────────────────────────────────── */

const TABS = [
  { id: 'all',       label: 'બધા'       },
  { id: 'spiritual', label: 'આધ્યાત્મિક' },
  { id: 'utilities', label: 'સાધનો'     },
  { id: 'business',  label: 'બિઝનેસ'   },
  { id: 'games',     label: 'ગેમ્સ'     },
];

const TOOLS = [
  // ── Spiritual ────────────────────────────────────────────────
  { cat:'spiritual', icon:'calendar_month',   label:'પંચાંગ',    path:'/panchang',             bg:'#FFF8EF', iconBg:'#FBBF24', iconClr:'#fff' },
  { cat:'spiritual', icon:'grid_view',        label:'ચોઘડિયા',   path:'/panchang',             bg:'#FFF1F5', iconBg:'#F43F5E', iconClr:'#fff' },
  { cat:'spiritual', icon:'stars',            label:'કુંડળી',    path:'/kundali',              bg:'#F5F3FF', iconBg:'#8B5CF6', iconClr:'#fff' },
  { cat:'spiritual', icon:'auto_stories',     label:'ભક્તિ',     path:'/devotional',           bg:'#FEF2F2', iconBg:'#EF4444', iconClr:'#fff' },
  { cat:'spiritual', icon:'temple_hindu',     label:'કુળદેવી',   path:'/kuldevi',              bg:'#FFF7ED', iconBg:'#F97316', iconClr:'#fff' },
  { cat:'spiritual', icon:'explore',          label:'વાસ્તુ',    path:'/vastu',                bg:'#F0FDFA', iconBg:'#14B8A6', iconClr:'#fff' },
  // ── Utilities ────────────────────────────────────────────────
  { cat:'utilities', icon:'calculate',        label:'વ્યાજ ગણક', path:'/interest-calculator',  bg:'#EFF6FF', iconBg:'#3B82F6', iconClr:'#fff' },
  { cat:'utilities', icon:'auto_fix_high',    label:'નામકરણ',   path:'/namkaran',             bg:'#FDF4FF', iconBg:'#D946EF', iconClr:'#fff' },
  { cat:'utilities', icon:'favorite',         label:'સ્વાસ્થ્ય', path:'/health',               bg:'#F0FDF4', iconBg:'#22C55E', iconClr:'#fff' },
  { cat:'utilities', icon:'construction',     label:'ઓજારો',    path:'/tools',                bg:'#F9FAFB', iconBg:'#6B7280', iconClr:'#fff' },
  // ── Business ─────────────────────────────────────────────────
  { cat:'business',  icon:'badge',            label:'BizCard',  path:'/card',                 bg:'#F0F9FF', iconBg:'#0284C7', iconClr:'#fff' },
  { cat:'business',  icon:'description',      label:'બાયોડેટા', path:'/biodata',              bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },
  { cat:'business',  icon:'frame_person',     label:'કાર્ડ',    path:'/devotional-cards',     bg:'#F5F3FF', iconBg:'#7C3AED', iconClr:'#fff' },
  { cat:'business',  icon:'groups',           label:'કોમ્યુ.',  path:'/community',            bg:'#ECFDF5', iconBg:'#059669', iconClr:'#fff' },
  // ── Games ────────────────────────────────────────────────────
  { cat:'games',     icon:'psychology',       label:'શબ્દ રમત', path:'/daily-challenge',      bg:'#FFF7ED', iconBg:'#EA580C', iconClr:'#fff' },
  { cat:'games',     icon:'workspace_premium',label:'KBC ક્વિઝ', path:'/kbc-quiz',            bg:'#FFFBEB', iconBg:'#D97706', iconClr:'#fff' },
  { cat:'games',     icon:'style',            label:'કાર્ડ્સ',  path:'/swipe-cards',          bg:'#F5F3FF', iconBg:'#7C3AED', iconClr:'#fff' },
  { cat:'games',     icon:'map',              label:'સફારી',    path:'/gujarat-safari',       bg:'#F0FDF4', iconBg:'#16A34A', iconClr:'#fff' },
  { cat:'games',     icon:'menu_book',        label:'પાસપોર્ટ', path:'/passport',             bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },
  { cat:'games',     icon:'search',           label:'રહસ્યો',   path:'/mysteries',            bg:'#FFF1F2', iconBg:'#BE123C', iconClr:'#fff' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [data, setData] = useState(() => {
    const c = localStorage.getItem('panchang_cache');
    return c ? JSON.parse(c) : {
      tithi:'વૈશાખ સુદ બારસ', sunrise:'૦૬:૧૦ AM', sunset:'૦૭:૦૮ PM',
      choghadiya:{ name:'લાભ', isGood:true, endTime:'૧૧:૪૫ AM' },
      suvichar:'સચ્ચાઈનો જ હંમેશા વિજય થાય છે!',
      healthTip:'આજે સવારે પૂરતું પાણી પીધું?',
      communityAlert:'ખોરજ ગામમાં આવતીકાલે રસીકરણ કેમ્પ છે.',
    };
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setChallengeStreak(parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10));
    setHasPlayed(localStorage.getItem('otlo_challenge_last_date') === today);
  }, []);

  const fetchData = async () => {
    try {
      const r = await fetch(API_ENDPOINTS.PANCHANG);
      if (!r.ok) throw new Error();
      const d = await r.json();
      const u = { ...data, ...d };
      setData(u);
      localStorage.setItem('panchang_cache', JSON.stringify(u));
    } catch {
      const c = localStorage.getItem('panchang_cache');
      if (c) setData(JSON.parse(c));
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const t  = setInterval(() => setCurrentTime(new Date()), 10000);
    const ai = setInterval(fetchData, 5 * 60 * 1000);
    return () => { clearInterval(t); clearInterval(ai); };
  }, []);

  // Live choghadiya
  const cgResult = calculateChoghadiyas(data.sunrise || '૦૬:૧૦ AM', data.sunset || '૦૭:૦૮ PM', currentTime);
  let activeCG = data.choghadiya;
  let timeLeft  = '';
  if (cgResult) {
    const combined = [...cgResult.dayList, ...cgResult.nightList];
    const active = combined.find(c => currentTime >= c.startTime && currentTime < c.endTime);
    if (active) {
      const toGu = s => s.toString().replace(/[0-9]/g, d => '૦૧૨૩૪૫૬૭૮૯'[d]);
      const fmt  = d => { let h=d.getHours(), m=d.getMinutes(), ap=h>=12?'PM':'AM'; h=h%12||12; return `${toGu(String(h).padStart(2,'0'))}:${toGu(String(m).padStart(2,'0'))} ${ap}`; };
      activeCG = { name:active.name, isGood:active.isGood, endTime:fmt(active.endTime) };
      timeLeft  = cgResult.current.timeRemaining;
    }
  }

  const tMap = { Ekadasi:'એકાદશી',Ekadashi:'એકાદશી',Prathama:'એકમ',Pratham:'એકમ',Dwitiya:'બીજ',Tritiya:'ત્રીજ',Chaturthi:'ચોથ',Panchami:'પાંચમ',Shasthi:'છઠ',Shashthi:'છઠ',Saptami:'સાતમ',Ashtami:'આઠમ',Navami:'નોમ',Dashami:'દશમ',Dwadashi:'બારસ',Dvadasi:'બારસ',Trayodashi:'તેરસ',Chaturdashi:'ચૌદશ',Purnima:'પૂનમ',Pournami:'પૂનમ',Amavasya:'અમાસ',Amavas:'અમાસ' };
  const trTithi = s => Object.keys(tMap).reduce((r,k) => r.replace(new RegExp(k,'gi'), tMap[k]), s || '');

  const todayDate = new Date().toLocaleDateString('gu-IN', { day:'numeric', month:'long' });
  const todayVaar = new Date().toLocaleDateString('gu-IN', { weekday:'long' });

  const tools = activeTab === 'all' ? TOOLS : TOOLS.filter(t => t.cat === activeTab);

  if (loading && !data.tithi) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #F59E0B', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
        <p className="type-gu-caption" style={{ color:'#A8A29E' }}>લોડ થઈ રહ્યું છે...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingTop:16, paddingBottom:32, display:'flex', flexDirection:'column', gap:16 }} className="animate-fade-in">

      {/* ══════════════════════════════════════════════════════════
          ZONE 1 — CONTEXTUAL HERO
          ══════════════════════════════════════════════════════════ */}

      {/* Date greeting */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 4px' }}>
        <div>
          <p className="type-overline">{todayVaar} • {todayDate}</p>
          <h1 className="type-gu-title" style={{ color:'#1A1614', marginTop:2 }}>
            <span style={{ fontFamily:'"Noto Serif Gujarati",serif' }}>🙏 જય ભગવાન!</span>
          </h1>
        </div>
        <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
          🕉️
        </div>
      </div>

      {/* Panchang Hero Row — horizontal scroll */}
      <div style={{ display:'flex', gap:12, overflowX:'auto', marginLeft:-16, marginRight:-16, padding:'0 16px 4px' }} className="no-scrollbar">

        {/* Tithi Card */}
        <Link to="/panchang" className="press" style={{ flexShrink:0, width:200, borderRadius:20, padding:16, textDecoration:'none', position:'relative', overflow:'hidden', background:'linear-gradient(135deg,#B45309,#F97316)' }}>
          <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgba(255,255,255,0.75)' }}>આજની તિથિ</p>
          <p className="type-gu-display" style={{ color:'#fff', marginTop:4 }}>{trTithi(data.tithi)}</p>
          <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:10, color:'rgba(255,255,255,0.8)' }}>
            <span className="material-symbols-outlined" style={{ fontSize:13 }}>wb_sunny</span>
            <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:500 }}>{data.sunrise} – {data.sunset}</span>
          </div>
          <span className="material-symbols-outlined" style={{ position:'absolute', right:-8, bottom:-8, fontSize:72, color:'rgba(255,255,255,0.08)', fontVariationSettings:"'FILL' 1" }}>calendar_month</span>
        </Link>

        {/* Choghadiya Card */}
        <Link to="/panchang" className="press" style={{
          flexShrink:0, width:180, borderRadius:20, padding:16, textDecoration:'none', position:'relative', overflow:'hidden',
          background: activeCG.isGood ? '#F0FDF4' : '#FFF1F2',
          border:`1.5px solid ${activeCG.isGood ? '#86EFAC' : '#FECDD3'}`,
        }}>
          <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color: activeCG.isGood ? '#16A34A' : '#DC2626' }}>ચોઘડિયું</p>
          <p className="type-gu-display" style={{ color: activeCG.isGood ? '#166534' : '#991B1B', marginTop:4 }}>{activeCG.name}</p>
          <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:10, color: activeCG.isGood ? '#16A34A' : '#DC2626' }}>
            <span className="material-symbols-outlined" style={{ fontSize:14, fontVariationSettings:"'FILL' 1" }}>{activeCG.isGood ? 'check_circle' : 'warning'}</span>
            <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:600 }}>{activeCG.endTime} સુધી</span>
          </div>
          {timeLeft && <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, color: activeCG.isGood ? '#16A34A' : '#DC2626', marginTop:4, fontWeight:500 }}>{timeLeft} બાકી</p>}
        </Link>

        {/* See Full Panchang */}
        <Link to="/panchang" className="press" style={{
          flexShrink:0, width:100, borderRadius:20, padding:16, textDecoration:'none',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
          background:'#FFFFFF', border:'1.5px solid #E8E6E3',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize:28, color:'#B45309', fontVariationSettings:"'FILL' 1" }}>calendar_month</span>
          <p className="type-gu-caption" style={{ textAlign:'center', lineHeight:1.3, color:'#78716C', whiteSpace: 'nowrap' }}>સંપૂર્ણ<br/>પંચાંગ</p>
        </Link>
      </div>

      {/* Daily Challenge Banner */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderRadius:16,
        background:'#FFF8EF', border:'1.5px solid #FDE68A',
      }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#F97316,#B45309)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:24, fontVariationSettings:"'FILL' 1" }}>psychology</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p className="type-gu-body" style={{ fontWeight:700, color:'#1A1614', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {hasPlayed ? `✅ આજ પૂર્ણ · ${challengeStreak} Day Streak` : '🧠 આજની શબ્દ રમત'}
          </p>
          <p className="type-caption" style={{ color:'#78716C', margin:'2px 0 0' }}>
            {hasPlayed ? 'આવતીકાલ ફ્રી.' : '+15 Coins · અત્યારે રમો'}
          </p>
        </div>
        <Link to="/daily-challenge" className="g-btn-primary press" style={{ flexShrink:0, padding:'8px 14px', borderRadius:10, fontSize:13, textDecoration:'none' }}>
          {hasPlayed ? 'જુઓ →' : 'રમો →'}
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 2 — CATEGORY TABS
          ══════════════════════════════════════════════════════════ */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', marginLeft:-16, marginRight:-16, padding:'0 16px' }} className="no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flexShrink:0,
              padding:'8px 14px',
              borderRadius:10,
              border: activeTab === tab.id ? '1.5px solid #F59E0B' : '1.5px solid #E8E6E3',
              background: activeTab === tab.id ? '#FFF8EF' : '#FFFFFF',
              fontFamily:'"Noto Serif Gujarati",serif',
              fontSize:13,
              fontWeight: activeTab === tab.id ? 700 : 600,
              color: activeTab === tab.id ? '#B45309' : '#78716C',
              cursor:'pointer',
              transition:'all 0.15s ease',
              whiteSpace:'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3 — TOOL GRID (72dp icons, 1-line labels)
          ══════════════════════════════════════════════════════════ */}
      <div style={{ background:'#FFFFFF', border:'1px solid #E8E6E3', borderRadius:16, padding:'16px 12px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px 8px' }}>
          {tools.map(({ icon, label, path, bg, iconBg, iconClr }, i) => (
            <Link key={`${path}-${i}`} to={path} className="press"
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, textDecoration:'none' }}>
              {/* 72×72dp icon container */}
              <div style={{
                width:56, height:56, borderRadius:14,
                background: bg,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <div style={{ width:36, height:36, borderRadius:10, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:20, color:iconClr, fontVariationSettings:"'FILL' 1" }}>{icon}</span>
                </div>
              </div>
              {/* Max 1-line label */}
              <p className="type-gu-caption line-clamp-1" style={{ color:'#57534E', textAlign:'center', fontSize:11 }}>{label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          ZONE 3B — BENTO BOX (Games/Entertainment highlight)
          ══════════════════════════════════════════════════════════ */}
      {(activeTab === 'all' || activeTab === 'games') && (
        <div>
          <p className="type-overline" style={{ paddingLeft:4, marginBottom:10 }}>ફ્ચર્ડ</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>

            {/* Big card — Gujarat Safari */}
            <Link to="/gujarat-safari" className="press" style={{
              gridColumn:'1 / -1', borderRadius:16, padding:18, textDecoration:'none', position:'relative', overflow:'hidden',
              background:'linear-gradient(135deg,#064E3B,#065F46)',
              display:'flex', alignItems:'center', gap:14,
            }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>🦁</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p className="g-chip" style={{ background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.9)', marginBottom:6 }}>ઇન્ટ્રેક્ટિવ</p>
                <p className="type-gu-title" style={{ color:'#fff', margin:0 }}>ગુજરાત સફારી 🗺️</p>
                <p className="type-caption" style={{ color:'rgba(255,255,255,0.7)', margin:'4px 0 0', lineHeight:1.4 }}>સિંહ, ડાયનાસોર, મોરના અવાજ સાભળો</p>
              </div>
              <span className="material-symbols-outlined" style={{ color:'rgba(255,255,255,0.25)', fontSize:64, position:'absolute', right:-8, bottom:-8 }}>explore</span>
            </Link>

            {/* Half cards */}
            {[
              { to:'/mysteries', emoji:'🕵️', title:'ગુજરાતના રહસ્યો', sub:'અજ્ઞાત સ્થળો', bg:'#1C1917', textClr:'#F5F5F4', subClr:'rgba(245,245,244,0.6)' },
              { to:'/kbc-quiz',  emoji:'🏆', title:'KBC ક્વિઝ',       sub:'ઇનામ જીતો',   bg:'#78350F', textClr:'#FEF3C7', subClr:'rgba(254,243,199,0.7)' },
            ].map(({ to, emoji, title, sub, bg, textClr, subClr }) => (
              <Link key={to} to={to} className="press" style={{ borderRadius:16, padding:16, textDecoration:'none', background:bg }}>
                <span style={{ fontSize:26 }}>{emoji}</span>
                <p className="type-gu-body" style={{ color:textClr, fontWeight:700, marginTop:8, lineHeight:1.3 }}>{title}</p>
                <p className="type-caption" style={{ color:subClr, marginTop:4 }}>{sub}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ZONE 4 — ENGAGEMENT FEED
          ══════════════════════════════════════════════════════════ */}

      {/* Suvichar */}
      <div id="daily-suvichar" style={{ background:'#FFFFFF', border:'1px solid #E8E6E3', borderRadius:16, padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div>
            <p className="type-overline">આજનો સુવિચાર</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="g-chip" style={{ background:'#F0FDF4', color:'#16A34A', border:'1px solid #86EFAC' }}>
              <span className="material-symbols-outlined" style={{ fontSize:12, fontVariationSettings:"'FILL' 1" }}>share</span>
              WhatsApp
            </span>
            <ShareButton sectionId="daily-suvichar" successMessage="✨ સુવિચાર શેર!" />
          </div>
        </div>
        <div style={{ position:'relative', padding:'8px 16px' }}>
          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:48, lineHeight:1, color:'#F59E0B', opacity:0.25, position:'absolute', top:-4, left:0 }}>"</span>
          <p className="type-gu-body" style={{ color:'#1A1614', fontWeight:700, fontSize:16, lineHeight:1.65 }}>{data.suvichar}</p>
          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:48, lineHeight:1, color:'#F59E0B', opacity:0.25, position:'absolute', bottom:-12, right:0 }}>"</span>
        </div>
      </div>

      {/* Health tip */}
      <div id="health-tip" style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:16, background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC' }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#16A34A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:20, fontVariationSettings:"'FILL' 1" }}>favorite</span>
        </div>
        <div style={{ flex:1 }}>
          <p className="type-overline" style={{ color:'#166534', marginBottom:4 }}>સ્વાસ્થ્ય ટિપ</p>
          <p className="type-gu-body" style={{ color:'#166534', fontWeight:600, margin:0 }}>{data.healthTip}</p>
        </div>
        <ShareButton sectionId="health-tip" successMessage="🍀 ટિપ શેર!" />
      </div>

      {/* Community alert */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:16, background:'#FFFBEB', border:'1px solid #FDE68A' }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#F59E0B', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:20, fontVariationSettings:"'FILL' 1" }}>campaign</span>
        </div>
        <div>
          <p className="type-overline" style={{ color:'#92400E', marginBottom:4 }}>જાહેર ખબર</p>
          <p className="type-gu-body" style={{ color:'#78350F', fontWeight:600, margin:0 }}>{data.communityAlert}</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
