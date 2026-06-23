import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateChoghadiyas } from '../utils/choghadiya_helper';
import { API_ENDPOINTS } from '../config/api';
import ShareButton from './ShareButton';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../supabaseClient';
import { SUVICHARS } from '../data/suvichars';
import { HEALTH_TIPS } from '../data/healthTips';

/* Daily rotation — changes automatically every day */
const getDailyItem = (arr) => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return arr[dayOfYear % arr.length];
};

const TOOLS = [
  { icon:'calendar_month',   label:'પંચાંગ',      path:'/panchang',            bg:'#FFF8EF', iconBg:'#FBBF24', iconClr:'#fff' },
  { icon:'stars',            label:'કુંડળી',      path:'/kundali',             bg:'#F5F3FF', iconBg:'#8B5CF6', iconClr:'#fff' },
  { icon:'temple_hindu',     label:'કુળદેવી',     path:'/kuldevi',             bg:'#FFF7ED', iconBg:'#F97316', iconClr:'#fff' },
  { icon:'explore',          label:'વાસ્તુ',      path:'/vastu',               bg:'#F0FDFA', iconBg:'#14B8A6', iconClr:'#fff' },
  { icon:'calculate',        label:'વ્યાજ ગણક',   path:'/interest-calculator', bg:'#EFF6FF', iconBg:'#3B82F6', iconClr:'#fff' },
  { icon:'auto_fix_high',    label:'નામકરણ',      path:'/namkaran',            bg:'#FDF4FF', iconBg:'#D946EF', iconClr:'#fff' },
  { icon:'favorite',         label:'સ્વાસ્થ્ય',   path:'/health',              bg:'#F0FDF4', iconBg:'#22C55E', iconClr:'#fff' },
  { icon:'construction',     label:'ટૂલ્સ',       path:'/tools',               bg:'#F9FAFB', iconBg:'#6B7280', iconClr:'#fff' },
  { icon:'badge',            label:'BizCard',     path:'/card',                bg:'#F0F9FF', iconBg:'#0284C7', iconClr:'#fff' },
  { icon:'description',      label:'બાયોડેટા',    path:'/biodata',             bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },
  { icon:'frame_person',     label:'કાર્ડ',       path:'/devotional-cards',    bg:'#F5F3FF', iconBg:'#7C3AED', iconClr:'#fff' },
  { icon:'groups',           label:'કોમ્યુ.',     path:'/community',           bg:'#ECFDF5', iconBg:'#059669', iconClr:'#fff' },
  { icon:'style',            label:'કાર્ડ્સ',     path:'/swipe-cards',         bg:'#F5F3FF', iconBg:'#7C3AED', iconClr:'#fff' },
  { icon:'map',              label:'સફારી',       path:'/gujarat-safari',      bg:'#F0FDF4', iconBg:'#16A34A', iconClr:'#fff' },
  { icon:'menu_book',        label:'પાસપોર્ટ',    path:'/passport',            bg:'#EFF6FF', iconBg:'#2563EB', iconClr:'#fff' },
  { icon:'search',           label:'રહસ્યો',      path:'/mysteries',           bg:'#FFF1F2', iconBg:'#BE123C', iconClr:'#fff' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [dbCommunityAlert, setDbCommunityAlert] = useState('');
  const [hasCard, setHasCard] = useState(() => {
    try {
      const draft = localStorage.getItem('digitalCardDraft');
      if (!draft) return false;
      const parsed = JSON.parse(draft);
      return !!(parsed.name || parsed.businessName);
    } catch { return false; }
  });
  const [data, setData] = useState(() => {
    const c = localStorage.getItem('panchang_cache');
    const cached = c ? JSON.parse(c) : null;
    return {
      tithi:          cached?.tithi          || 'વૈશાખ સુદ બારસ',
      sunrise:        cached?.sunrise        || '૦૬:૧૦ AM',
      sunset:         cached?.sunset         || '૦૭:૦૮ PM',
      choghadiya:     cached?.choghadiya     || { name:'લાભ', isGood:true, endTime:'૧૧:૪૫ AM' },
      suvichar:       getDailyItem(SUVICHARS),
      healthTip:      getDailyItem(HEALTH_TIPS),
      communityAlert: cached?.communityAlert || 'ખોરજ ગામમાં આવતીકાલે રસીકરણ કેમ્પ છે.',
    };
  });
  const [loading, setLoading]               = useState(true);
  const [currentTime, setCurrentTime]       = useState(new Date());
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [hasPlayed, setHasPlayed]           = useState(false);

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
      const u = { ...data, ...d, suvichar: getDailyItem(SUVICHARS), healthTip: getDailyItem(HEALTH_TIPS) };
      setData(u);
      localStorage.setItem('panchang_cache', JSON.stringify(u));
    } catch {
      const c = localStorage.getItem('panchang_cache');
      if (c) {
        const cached = JSON.parse(c);
        setData({ ...cached, suvichar: getDailyItem(SUVICHARS), healthTip: getDailyItem(HEALTH_TIPS) });
      }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const fetchAlert = async () => {
      try {
        const { data: alertData, error } = await supabase
          .from('app_settings').select('value').eq('key','community_alert').single();
        if (!error && alertData) setDbCommunityAlert(alertData.value);
      } catch (err) { console.error('Failed to fetch community alert', err); }
    };
    fetchAlert();
    const t  = setInterval(() => setCurrentTime(new Date()), 10000);
    const ai = setInterval(fetchData, 5 * 60 * 1000);
    return () => { clearInterval(t); clearInterval(ai); };
  }, []);

  /* Live choghadiya */
  const cgResult = calculateChoghadiyas(data.sunrise || '૦૬:૧૦ AM', data.sunset || '૦૭:૦૮ PM', currentTime);
  let activeCG = data.choghadiya;
  let timeLeft  = '';
  if (cgResult) {
    const combined = [...cgResult.dayList, ...cgResult.nightList];
    const active = combined.find(c => currentTime >= c.startTime && currentTime < c.endTime);
    if (active) {
      const toGu = s => s.toString().replace(/[0-9]/g, d => '૦૧૨૩૪૫૬૭૮૯'[d]);
      const fmt  = d => { let h=d.getHours(), m=d.getMinutes(), ap=h>=12?'PM':'AM'; h=h%12||12; return `${toGu(String(h).padStart(2,'0'))}:${toGu(String(m).padStart(2,'0'))} ${ap}`; };
      activeCG  = { name:active.name, isGood:active.isGood, endTime:fmt(active.endTime) };
      timeLeft  = cgResult.current.timeRemaining;
    }
  }

  const tMap = { Ekadasi:'એકાદશી',Ekadashi:'એકાદશી',Prathama:'એકમ',Pratham:'એકમ',Dwitiya:'બીજ',Tritiya:'ત્રીજ',Chaturthi:'ચોથ',Panchami:'પાંચમ',Shasthi:'છઠ',Shashthi:'છઠ',Saptami:'સાતમ',Ashtami:'આઠમ',Navami:'નોમ',Dashami:'દશમ',Dwadashi:'બારસ',Dvadasi:'બારસ',Trayodashi:'તેરસ',Chaturdashi:'ચૌદશ',Purnima:'પૂનમ',Pournami:'પૂનમ',Amavasya:'અમાસ',Amavas:'અમાસ' };
  const trTithi = s => Object.keys(tMap).reduce((r,k) => r.replace(new RegExp(k,'gi'), tMap[k]), s || '');

  const todayDate = new Date().toLocaleDateString('gu-IN', { day:'numeric', month:'long' });
  const todayVaar = new Date().toLocaleDateString('gu-IN', { weekday:'long' });

  const { featureFlags, setComingSoonFeature, PATH_TO_FEATURE_KEY, activeTheme } = useTheme();
  const getFeatureState = (path) => {
    const key = PATH_TO_FEATURE_KEY[path];
    return key ? (featureFlags[key] || 'live') : 'live';
  };
  const handleFeatureClick = (path, label, e) => {
    if (getFeatureState(path) === 'coming_soon') { e.preventDefault(); setComingSoonFeature(label); }
  };

  /* Game card themes */
  const getCardTheme = (cardName, themeId) => {
    const defaults = {
      khaman:  { bg:'linear-gradient(135deg,#78350F,#B45309)',  border:'1px solid rgba(251,191,36,0.3)',  badge:'linear-gradient(135deg,#FCD34D,#F59E0B)',  badgeText:'#78350F', iconBg:'linear-gradient(135deg,#FCD34D,#F59E0B)',  titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
      traffic: { bg:'linear-gradient(135deg,#14532D,#064E3B)',  border:'1px solid rgba(52,211,153,0.3)',   badge:'linear-gradient(135deg,#FDE047,#EAB308)',  badgeText:'#422006', iconBg:'linear-gradient(135deg,#34D399,#10B981)', titleColor:'#ECFDF5', subtitleColor:'#A7F3D0' },
      farasan: { bg:'linear-gradient(135deg,#7F1D1D,#991B1B)',  border:'1px solid rgba(248,113,113,0.3)', badge:'linear-gradient(135deg,#FCA5A5,#EF4444)',  badgeText:'#450A0A', iconBg:'linear-gradient(135deg,#F87171,#DC2626)', titleColor:'#FEF2F2', subtitleColor:'#FECACA' },
      patang:  { bg:'linear-gradient(135deg,#1E3A8A,#1D4ED8)',  border:'1px solid rgba(96,165,250,0.3)',  badge:'linear-gradient(135deg,#93C5FD,#3B82F6)',  badgeText:'#1E3A8A', iconBg:'linear-gradient(135deg,#60A5FA,#2563EB)', titleColor:'#EFF6FF', subtitleColor:'#BFDBFE' },
    };
    const byTheme = {
      theme1: {
        khaman:  { bg:'linear-gradient(135deg,#0F766E,#115E59)', border:'1px solid rgba(45,212,191,0.3)',  badge:'linear-gradient(135deg,#99F6E4,#0D9488)', badgeText:'#115E59', iconBg:'linear-gradient(135deg,#2DD4BF,#0D9488)', titleColor:'#CCFBF1', subtitleColor:'#99F6E4' },
        traffic: { bg:'linear-gradient(135deg,#0D7377,#004D40)', border:'1px solid rgba(45,212,191,0.3)',  badge:'linear-gradient(135deg,#99F6E4,#0F766E)', badgeText:'#0D7377', iconBg:'linear-gradient(135deg,#14BDBD,#0D9488)', titleColor:'#CCFBF1', subtitleColor:'#99F6E4' },
        farasan: { bg:'linear-gradient(135deg,#115E59,#042F2E)', border:'1px solid rgba(45,212,191,0.3)',  badge:'linear-gradient(135deg,#2DD4BF,#0D9488)', badgeText:'#042F2E', iconBg:'linear-gradient(135deg,#2DD4BF,#0F766E)', titleColor:'#CCFBF1', subtitleColor:'#99F6E4' },
        patang:  { bg:'linear-gradient(135deg,#1E293B,#0F172A)', border:'1px solid rgba(148,163,184,0.3)', badge:'linear-gradient(135deg,#94A3B8,#475569)', badgeText:'#0F172A', iconBg:'linear-gradient(135deg,#64748B,#475569)', titleColor:'#F1F5F9', subtitleColor:'#CBD5E1' },
      },
      theme2: {
        khaman:  { bg:'linear-gradient(135deg,#6D28D9,#4C1D95)', border:'1px solid rgba(196,181,253,0.3)', badge:'linear-gradient(135deg,#DDD6FE,#7C3AED)', badgeText:'#4C1D95', iconBg:'linear-gradient(135deg,#A78BFA,#7C3AED)', titleColor:'#F5F3FF', subtitleColor:'#DDD6FE' },
        traffic: { bg:'linear-gradient(135deg,#5B21B6,#2E1065)', border:'1px solid rgba(196,181,253,0.3)', badge:'linear-gradient(135deg,#C084FC,#7C3AED)', badgeText:'#2E1065', iconBg:'linear-gradient(135deg,#C084FC,#6D28D9)', titleColor:'#F5F3FF', subtitleColor:'#E9D5FF' },
        farasan: { bg:'linear-gradient(135deg,#4C1D95,#1E1B4B)', border:'1px solid rgba(196,181,253,0.3)', badge:'linear-gradient(135deg,#DDD6FE,#7C3AED)', badgeText:'#1E1B4B', iconBg:'linear-gradient(135deg,#A78BFA,#6D28D9)', titleColor:'#F5F3FF', subtitleColor:'#DDD6FE' },
        patang:  { bg:'linear-gradient(135deg,#7C3AED,#4C1D95)', border:'1px solid rgba(196,181,253,0.3)', badge:'linear-gradient(135deg,#C084FC,#7C3AED)', badgeText:'#4C1D95', iconBg:'linear-gradient(135deg,#C084FC,#6D28D9)', titleColor:'#F5F3FF', subtitleColor:'#E9D5FF' },
      },
      theme3: {
        khaman:  { bg:'linear-gradient(135deg,#7F4D27,#2B1814)', border:'1px solid rgba(240,136,51,0.3)',  badge:'linear-gradient(135deg,#FF8E1F,#F08833)', badgeText:'#2B1814', iconBg:'linear-gradient(135deg,#FF8E1F,#F08833)', titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
        traffic: { bg:'linear-gradient(135deg,#F08833,#73322B)', border:'1px solid rgba(255,142,31,0.3)',  badge:'linear-gradient(135deg,#FF8E1F,#F08833)', badgeText:'#2B1814', iconBg:'linear-gradient(135deg,#FF8E1F,#F08833)', titleColor:'#FFEFEF', subtitleColor:'#FFD1C9' },
        farasan: { bg:'linear-gradient(135deg,#73322B,#2B1814)', border:'1px solid rgba(240,136,51,0.3)',  badge:'linear-gradient(135deg,#FF8E1F,#F08833)', badgeText:'#2B1814', iconBg:'linear-gradient(135deg,#FF8E1F,#F08833)', titleColor:'#FFEFEF', subtitleColor:'#FFD1C9' },
        patang:  { bg:'linear-gradient(135deg,#FF8E1F,#73322B)', border:'1px solid rgba(240,136,51,0.3)',  badge:'linear-gradient(135deg,#FF8E1F,#F08833)', badgeText:'#2B1814', iconBg:'linear-gradient(135deg,#FF8E1F,#F08833)', titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
      },
    };
    return (byTheme[themeId] && byTheme[themeId][cardName]) || defaults[cardName];
  };

  const themeId      = activeTheme?.id || 'default';
  const khamanTheme  = getCardTheme('khaman',  themeId);
  const trafficTheme = getCardTheme('traffic', themeId);
  const farasanTheme = getCardTheme('farasan', themeId);
  const patangTheme  = getCardTheme('patang',  themeId);

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
          1. PANCHANG HERO — Big orange single card
          ══════════════════════════════════════════════════════════ */}
      {getFeatureState('/panchang') !== 'off' && (
        <Link
          to={getFeatureState('/panchang') === 'coming_soon' ? '#' : '/panchang'}
          onClick={(e) => handleFeatureClick('/panchang', 'પંચાંગ', e)}
          className="press"
          style={{
            display:'block', textDecoration:'none', borderRadius:20, overflow:'hidden',
            background:'linear-gradient(135deg,#E65100,#F97316,#FB923C)',
            boxShadow:'0 8px 24px rgba(230,81,0,0.35)',
            padding:'20px 20px 18px',
          }}
        >
          {/* Header */}
          <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.85)', marginBottom:8 }}>
            🙏 જય શ્રી કૃષ્ણ
          </p>

          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            {/* Left — Tithi + Date */}
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', marginBottom:2 }}>
                આજની તિથિ
              </p>
              <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, margin:0 }}>
                {trTithi(data.tithi)}
              </p>
              <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.85)', margin:'6px 0 0' }}>
                {todayVaar} • {todayDate}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:10, color:'rgba(255,255,255,0.8)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:13 }}>wb_sunny</span>
                <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:500 }}>
                  {data.sunrise} – {data.sunset}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width:1, alignSelf:'stretch', background:'rgba(255,255,255,0.2)', borderRadius:1 }} />

            {/* Right — Choghadiya */}
            <div style={{ minWidth:110 }}>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', marginBottom:2 }}>
                ✅ ચાલુ ચોઘડિયું
              </p>
              <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.2, margin:0 }}>
                {activeCG.name}
              </p>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.85)', margin:'6px 0 0' }}>
                {activeCG.endTime} સુધી
              </p>
              {timeLeft && (
                <div style={{ marginTop:6, background:'rgba(0,0,0,0.2)', borderRadius:8, padding:'4px 8px', display:'inline-block' }}>
                  <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:700, color:'#fff', margin:0 }}>
                    {timeLeft} બાકી
                  </p>
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* ══════════════════════════════════════════════════════════
          2. SUVICHAR — Dark navy card
          ══════════════════════════════════════════════════════════ */}
      <div id="daily-suvichar" style={{
        borderRadius:16, padding:'18px 20px',
        background:'linear-gradient(135deg,#1E1B4B,#312E81)',
        boxShadow:'0 4px 16px rgba(30,27,75,0.3)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(199,210,254,0.8)', margin:0 }}>
            🔔 આજનો સુવિચાર
          </p>
          <ShareButton sectionId="daily-suvichar" successMessage="✨ સુવિચાર શેર!" />
        </div>
        <div style={{ position:'relative', padding:'4px 16px' }}>
          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:44, lineHeight:1, color:'#818CF8', opacity:0.4, position:'absolute', top:-4, left:0 }}>"</span>
          <p className="type-gu-body" style={{ color:'#E0E7FF', fontWeight:700, fontSize:16, lineHeight:1.7, margin:0 }}>
            {data.suvichar}
          </p>
          <span style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:44, lineHeight:1, color:'#818CF8', opacity:0.4, position:'absolute', bottom:-12, right:0 }}>"</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. MINI GAME CARDS — 2 column
          ══════════════════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

        {/* અંગ્રેજી શીખો */}
        {getFeatureState('/english') !== 'off' && (
          <Link
            to={getFeatureState('/english') === 'coming_soon' ? '#' : '/english'}
            onClick={(e) => handleFeatureClick('/english', 'અંગ્રેજી શીખો', e)}
            className="press"
            style={{
              borderRadius:20, padding:'20px 14px', textDecoration:'none', position:'relative', overflow:'hidden',
              background:'linear-gradient(135deg,#0D7377,#14BDBD)',
              boxShadow:'0 6px 20px rgba(13,115,119,0.35)',
              display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10,
            }}
          >
            <div style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,0.25)', padding:'3px 8px', borderRadius:10, fontSize:10, fontWeight:800, color:'#fff' }}>
              નવું
            </div>
            <div style={{ width:52, height:52, borderRadius:16, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
              📚
            </div>
            <div>
              <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:14, fontWeight:900, color:'#fff', margin:0 }}>અંગ્રેજી શીખો</p>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.8)', margin:'3px 0 0' }}>સરળતાથી શીખો</p>
            </div>
          </Link>
        )}

        {/* ગુજરાતી રમતો */}
        {getFeatureState('/community') !== 'off' && (
          <Link
            to={getFeatureState('/community') === 'coming_soon' ? '#' : '/community'}
            onClick={(e) => handleFeatureClick('/community', 'ગુજરાતી રમતો', e)}
            className="press"
            style={{
              borderRadius:20, padding:'20px 14px', textDecoration:'none', position:'relative', overflow:'hidden',
              background:'linear-gradient(135deg,#BE123C,#E11D48)',
              boxShadow:'0 6px 20px rgba(190,18,60,0.35)',
              display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10,
            }}
          >
            <div style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,0.25)', padding:'3px 8px', borderRadius:10, fontSize:10, fontWeight:800, color:'#fff' }}>
              હોટ
            </div>
            <div style={{ width:52, height:52, borderRadius:16, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>
              🎲
            </div>
            <div>
              <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:14, fontWeight:900, color:'#fff', margin:0 }}>ગુજરાતી રમતો</p>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.8)', margin:'3px 0 0' }}>રમો અને શીખો</p>
            </div>
          </Link>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. DAILY CHALLENGE BANNER
          ══════════════════════════════════════════════════════════ */}
      {getFeatureState('/daily-challenge') !== 'off' && (
        <div style={{
          display:'flex', flexDirection:'column', gap:12, padding:'16px', borderRadius:16,
          background:'#FFF8EF', border:'1.5px solid #FDE68A',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
            <Link
              to={getFeatureState('/daily-challenge') === 'coming_soon' ? '#' : '/daily-challenge'}
              onClick={(e) => handleFeatureClick('/daily-challenge', 'ડેઇલી ચેલેન્જ', e)}
              className="g-btn-primary press"
              style={{ flexShrink:0, padding:'8px 14px', borderRadius:10, fontSize:13, textDecoration:'none' }}
            >
              {hasPlayed ? 'જુઓ →' : 'રમો →'}
            </Link>
          </div>

          {/* Daily Login Streak Progress Bar */}
          <div style={{ padding: '8px 12px 12px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="font-gujarati text-[10px] font-bold text-stone-500 uppercase tracking-wide">ડેઇલી ચેલેન્જ સ્ટ્રીક</span>
              <span className="font-sans text-[10px] font-black text-amber-600">{challengeStreak} / 30 Days</span>
            </div>
            
            {/* Progress Track */}
            <div style={{ position: 'relative', height: '6px', background: '#E2E8F0', borderRadius: '3px', margin: '0 8px' }}>
              {/* Fill */}
              <div style={{ 
                position: 'absolute', left: 0, top: 0, bottom: 0, 
                width: `${Math.min(100, (challengeStreak / 30) * 100)}%`, 
                background: 'linear-gradient(90deg, #F59E0B, #EF4444)', 
                borderRadius: '3px',
                transition: 'width 1s ease-out'
              }} />

              {/* Milestone 1: 10 Days */}
              <div style={{
                position: 'absolute', left: '33.33%', top: '50%', transform: 'translate(-50%, -50%)',
                width: '18px', height: '18px', borderRadius: '50%',
                background: challengeStreak >= 10 ? '#F59E0B' : '#CBD5E1',
                border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }} title="10 Days Milestone">
                <span className="font-sans text-[8px] font-black text-white">10</span>
              </div>
              <span className="font-gujarati text-[9px] font-bold text-amber-600" style={{ position: 'absolute', left: '33.33%', top: '16px', transform: 'translateX(-50%)' }}>૧૦ દિવસ</span>

              {/* Milestone 2: 20 Days */}
              <div style={{
                position: 'absolute', left: '66.66%', top: '50%', transform: 'translate(-50%, -50%)',
                width: '18px', height: '18px', borderRadius: '50%',
                background: challengeStreak >= 20 ? '#F97316' : '#CBD5E1',
                border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }} title="20 Days Milestone">
                <span className="font-sans text-[8px] font-black text-white">20</span>
              </div>
              <span className="font-gujarati text-[9px] font-bold text-amber-600" style={{ position: 'absolute', left: '66.66%', top: '16px', transform: 'translateX(-50%)' }}>૨૦ દિવસ</span>

              {/* Milestone 3: 30 Days */}
              <div style={{
                position: 'absolute', left: '100%', top: '50%', transform: 'translate(-50%, -50%)',
                width: '18px', height: '18px', borderRadius: '50%',
                background: challengeStreak >= 30 ? '#EF4444' : '#CBD5E1',
                border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }} title="30 Days Milestone">
                <span className="font-sans text-[8px] font-black text-white">30</span>
              </div>
              <span className="font-gujarati text-[9px] font-bold text-amber-600" style={{ position: 'absolute', left: '100%', top: '16px', transform: 'translateX(-50%)' }}>૩૦ દિવસ</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          5. TOOL GRID — 16 tools, 4 columns
          ══════════════════════════════════════════════════════════ */}
      <div style={{ background:'#FFFFFF', border:'1px solid #E8E6E3', borderRadius:16, padding:'16px 12px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px 8px' }}>
          {TOOLS.filter(t => getFeatureState(t.path) !== 'off').map(({ icon, label, path, bg, iconBg, iconClr }, i) => {
            const state = getFeatureState(path);
            return (
              <Link key={`${path}-${i}`} to={state === 'coming_soon' ? '#' : path} className="press"
                onClick={(e) => { if (state === 'coming_soon') { e.preventDefault(); setComingSoonFeature(label); } }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, textDecoration:'none' }}
              >
                <div style={{ width:56, height:56, borderRadius:14, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:20, color:iconClr, fontVariationSettings:"'FILL' 1" }}>{icon}</span>
                  </div>
                </div>
                <p className="type-gu-caption line-clamp-1" style={{ color:'#57534E', textAlign:'center', fontSize:11 }}>{label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          6. DIGITAL BUSINESS CARD BANNER
          ══════════════════════════════════════════════════════════ */}
      {getFeatureState('/card') !== 'off' && (
        <Link
          to={getFeatureState('/card') === 'coming_soon' ? '#' : '/card'}
          onClick={(e) => handleFeatureClick('/card', 'ડિજિટલ BizCard', e)}
          className="press"
          style={{
            display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:16,
            background:'linear-gradient(135deg,#1E40AF,#2563EB,#3B82F6)',
            boxShadow:'0 6px 20px rgba(30,64,175,0.35)', textDecoration:'none',
          }}
        >
          <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:26, fontVariationSettings:"'FILL' 1" }}>badge</span>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontFamily:'"Noto Serif Gujarati",serif', fontSize:15, fontWeight:800, color:'#fff', margin:0 }}>
              {hasCard ? '✅ તમારું ડિજિટલ બિઝનેસ કાર્ડ' : '🆕 ડિજિટલ બિઝનેસ કાર્ડ બનાવો'}
            </p>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:11, fontWeight:500, color:'rgba(255,255,255,0.8)', margin:'4px 0 0' }}>
              {hasCard ? 'જુઓ અને શેરો →' : 'ફ્રી • હમણાં બનાવો →'}
            </p>
          </div>
          <span className="material-symbols-outlined" style={{ color:'rgba(255,255,255,0.5)', fontSize:20 }}>chevron_right</span>
        </Link>
      )}

      {/* ══════════════════════════════════════════════════════════
          7. 4 GAME CARDS — 2×2 grid
          ══════════════════════════════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>

        {/* ખમણ-જલેબી */}
        <Link to="/brick-breaker" className="press" style={{
          borderRadius:24, padding:'24px 12px', textDecoration:'none',
          background:khamanTheme.bg, border:khamanTheme.border,
          boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14,
        }}>
          <span style={{ position:'absolute', right:'-10px', top:'50%', transform:'translateY(-50%)', fontSize:'90px', opacity:0.1, pointerEvents:'none', zIndex:0 }}>🍡</span>
          <div style={{ position:'absolute', top:10, right:10, background:khamanTheme.badge, padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:800, color:khamanTheme.badgeText, boxShadow:'0 2px 6px rgba(0,0,0,0.2)', zIndex:1 }}>NEW 🎮</div>
          <div style={{ width:64, height:64, borderRadius:20, background:khamanTheme.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, boxShadow:'0 8px 16px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', zIndex:1, position:'relative' }}>🍡</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p className="type-gu-title" style={{ color:khamanTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>ખમણ-જલેબી</p>
            <p className="type-caption" style={{ color:khamanTheme.subtitleColor, margin:'4px 0 0', fontWeight:700, fontSize:'11px' }}>બ્રિક્સ તોડો</p>
          </div>
        </Link>

        {/* ટ્રાફિક તોડ */}
        <Link to="/traffic-tod" className="press" style={{
          borderRadius:24, padding:'24px 12px', textDecoration:'none',
          background:trafficTheme.bg, border:trafficTheme.border,
          boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14,
        }}>
          <span style={{ position:'absolute', right:'-10px', top:'50%', transform:'translateY(-50%)', fontSize:'90px', opacity:0.05, pointerEvents:'none', zIndex:0 }}>🛺</span>
          <div style={{ position:'absolute', top:10, right:10, background:trafficTheme.badge, padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:800, color:trafficTheme.badgeText, boxShadow:'0 2px 6px rgba(0,0,0,0.2)', zIndex:1 }}>NEW 🛺</div>
          <div style={{ width:64, height:64, borderRadius:20, background:trafficTheme.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, boxShadow:'0 8px 16px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', zIndex:1, position:'relative' }}>🛺</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p className="type-gu-title" style={{ color:trafficTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>ટ્રાફિક તોડ</p>
            <p className="type-caption" style={{ color:trafficTheme.subtitleColor, margin:'4px 0 0', fontWeight:700, fontSize:'11px' }}>રિક્ષા રનર</p>
          </div>
        </Link>

        {/* ફરસાણ સ્લાઈસર */}
        <Link to="/farasan-slicer" className="press" style={{
          borderRadius:24, padding:'24px 12px', textDecoration:'none',
          background:farasanTheme.bg, border:farasanTheme.border,
          boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14,
        }}>
          <span style={{ position:'absolute', right:'-10px', top:'50%', transform:'translateY(-50%)', fontSize:'90px', opacity:0.05, pointerEvents:'none', zIndex:0 }}>🍔</span>
          <div style={{ position:'absolute', top:10, right:10, background:farasanTheme.badge, padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:800, color:farasanTheme.badgeText, boxShadow:'0 2px 6px rgba(0,0,0,0.2)', zIndex:1 }}>HOT 🔥</div>
          <div style={{ width:64, height:64, borderRadius:20, background:farasanTheme.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, boxShadow:'0 8px 16px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', zIndex:1, position:'relative' }}>🍔</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p className="type-gu-title" style={{ color:farasanTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>ફરસાણ સ્લાઈસર</p>
            <p className="type-caption" style={{ color:farasanTheme.subtitleColor, margin:'4px 0 0', fontWeight:700, fontSize:'11px' }}>કાપા-કાપી</p>
          </div>
        </Link>

        {/* પતંગ કાપો */}
        <Link to="/kite-cutter" className="press" style={{
          borderRadius:24, padding:'24px 12px', textDecoration:'none',
          background:patangTheme.bg, border:patangTheme.border,
          boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14,
        }}>
          <span style={{ position:'absolute', right:'-10px', top:'50%', transform:'translateY(-50%)', fontSize:'90px', opacity:0.05, pointerEvents:'none', zIndex:0 }}>🪁</span>
          <div style={{ position:'absolute', top:10, right:10, background:patangTheme.badge, padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:800, color:patangTheme.badgeText, boxShadow:'0 2px 6px rgba(0,0,0,0.2)', zIndex:1 }}>HOT 🔥</div>
          <div style={{ width:64, height:64, borderRadius:20, background:patangTheme.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, boxShadow:'0 8px 16px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', zIndex:1, position:'relative' }}>🪁</div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p className="type-gu-title" style={{ color:patangTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>પતંગ કાપો</p>
            <p className="type-caption" style={{ color:patangTheme.subtitleColor, margin:'4px 0 0', fontWeight:700, fontSize:'11px' }}>કાઈ પો છે</p>
          </div>
        </Link>

      </div>

      {/* ══════════════════════════════════════════════════════════
          8. HEALTH TIP
          ══════════════════════════════════════════════════════════ */}
      {getFeatureState('/health') !== 'off' && (
        <div id="health-tip" style={{
          display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:16,
          background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC',
        }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'#16A34A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:20, fontVariationSettings:"'FILL' 1" }}>favorite</span>
          </div>
          <div style={{ flex:1 }}>
            <p className="type-overline" style={{ color:'#166534', marginBottom:4 }}>સ્વાસ્થ્ય ટિપ</p>
            <p className="type-gu-body" style={{ color:'#166534', fontWeight:600, margin:0 }}>{data.healthTip}</p>
          </div>
          <ShareButton sectionId="health-tip" successMessage="🍀 ટિપ શેર!" />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          9. COMMUNITY ALERT
          ══════════════════════════════════════════════════════════ */}
      <div style={{
        display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderRadius:16,
        background:'#FFFBEB', border:'1px solid #FDE68A',
      }}>
        <div style={{ width:40, height:40, borderRadius:12, background:'#F59E0B', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <span className="material-symbols-outlined" style={{ color:'#fff', fontSize:20, fontVariationSettings:"'FILL' 1" }}>campaign</span>
        </div>
        <div>
          <p className="type-overline" style={{ color:'#92400E', marginBottom:4 }}>જાહેર ખબર</p>
          <p className="type-gu-body" style={{ color:'#78350F', fontWeight:600, margin:0 }}>
            {dbCommunityAlert || localStorage.getItem('admin_community_alert') || data.communityAlert}
          </p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
