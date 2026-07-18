import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ActionGamesMenu = () => {
  const navigate = useNavigate();
  const { activeTheme } = useTheme();

  const getCardTheme = (cardName, themeId) => {
    const defaults = {
      khaman:  { bg:'linear-gradient(135deg,#78350F,#B45309)',  border:'1px solid rgba(251,191,36,0.3)',  badge:'linear-gradient(135deg,#FCD34D,#F59E0B)',  badgeText:'#78350F', iconBg:'linear-gradient(135deg,#FCD34D,#F59E0B)',  titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
      traffic: { bg:'linear-gradient(135deg,#14532D,#064E3B)',  border:'1px solid rgba(52,211,153,0.3)',   badge:'linear-gradient(135deg,#FDE047,#EAB308)',  badgeText:'#422006', iconBg:'linear-gradient(135deg,#34D399,#10B981)', titleColor:'#ECFDF5', subtitleColor:'#A7F3D0' },
      farasan: { bg:'linear-gradient(135deg,#7F1D1D,#991B1B)',  border:'1px solid rgba(248,113,113,0.3)', badge:'linear-gradient(135deg,#FCA5A5,#EF4444)',  badgeText:'#450A0A', iconBg:'linear-gradient(135deg,#F87171,#DC2626)', titleColor:'#FEF2F2', subtitleColor:'#FECACA' },
      patang:  { bg:'linear-gradient(135deg,#1E3A8A,#1D4ED8)',  border:'1px solid rgba(96,165,250,0.3)',  badge:'linear-gradient(135deg,#93C5FD,#3B82F6)',  badgeText:'#1E3A8A', iconBg:'linear-gradient(135deg,#60A5FA,#2563EB)', titleColor:'#EFF6FF', subtitleColor:'#BFDBFE' },
      tirandaji: { bg:'linear-gradient(135deg,#D97706,#B45309)', border:'1px solid rgba(251,191,36,0.3)', badge:'linear-gradient(135deg,#FCD34D,#F59E0B)', badgeText:'#78350F', iconBg:'linear-gradient(135deg,#F59E0B,#D97706)', titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
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
        tirandaji: { bg:'linear-gradient(135deg,#D97706,#B45309)', border:'1px solid rgba(251,191,36,0.3)', badge:'linear-gradient(135deg,#FCD34D,#F59E0B)', badgeText:'#78350F', iconBg:'linear-gradient(135deg,#F59E0B,#D97706)', titleColor:'#FEF3C7', subtitleColor:'#FDE68A' },
      },
    };
    return (byTheme[themeId] && byTheme[themeId][cardName]) || defaults[cardName];
  };

  const themeId      = activeTheme?.id || 'default';
  const khamanTheme  = getCardTheme('khaman',  themeId);
  const trafficTheme = getCardTheme('traffic', themeId);
  const farasanTheme = getCardTheme('farasan', themeId);
  const patangTheme  = getCardTheme('patang',  themeId);
  const tirandajiTheme = getCardTheme('tirandaji', themeId);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pb-24 font-gujarati flex flex-col relative"
         style={{ paddingTop: 'calc(env(safe-area-inset-top, 40px) + 20px)' }}>
      {/* Header */}
      <div className="px-6 flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-stone-200/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-black text-stone-800 dark:text-stone-100 flex-1 text-center">મજેદાર ગેમ્સ</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="px-6">
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
              <p className="type-gu-title" style={{ color:khamanTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>ગુજરાતી બ્રિક સ્મેશ</p>
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

          {/* તીરંદાજી (Tap Away) */}
          <Link to="/tirandaji" className="press" style={{
            borderRadius:24, padding:'24px 12px', textDecoration:'none',
            background:tirandajiTheme.bg, border:tirandajiTheme.border,
            boxShadow:'0 8px 24px rgba(0,0,0,0.3)', position:'relative', overflow:'hidden',
            display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14,
          }}>
            <span style={{ position:'absolute', right:'-10px', top:'50%', transform:'translateY(-50%)', fontSize:'90px', opacity:0.1, pointerEvents:'none', zIndex:0 }}>🏹</span>
            <div style={{ position:'absolute', top:10, right:10, background:tirandajiTheme.badge, padding:'4px 10px', borderRadius:12, fontSize:11, fontWeight:800, color:tirandajiTheme.badgeText, boxShadow:'0 2px 6px rgba(0,0,0,0.2)', zIndex:1 }}>NEW ✨</div>
            <div style={{ width:64, height:64, borderRadius:20, background:tirandajiTheme.iconBg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, boxShadow:'0 8px 16px rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', zIndex:1, position:'relative' }}>🏹</div>
            <div style={{ position:'relative', zIndex:1 }}>
              <p className="type-gu-title" style={{ color:tirandajiTheme.titleColor, margin:0, fontSize:'16px', fontWeight:900 }}>તીરંદાજી</p>
              <p className="type-caption" style={{ color:tirandajiTheme.subtitleColor, margin:'4px 0 0', fontWeight:700, fontSize:'11px' }}>માર્ગ ખોલો</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActionGamesMenu;
