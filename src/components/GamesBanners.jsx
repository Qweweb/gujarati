import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function GamesBanners({ onGujaratiClick }) {
  const { activeTheme } = useTheme();

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

  const gujaratiCardContent = (
    <>
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
    </>
  );

  return (
    <div className="flex flex-col gap-3 w-full mx-auto" style={{ maxWidth: 800 }}>
      {/* 2x2 grid for English / Gujarati */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {/* અંગ્રેજી શીખો */}
        <Link
          to="/english"
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

        {/* ગુજરાતી રમતો */}
        {onGujaratiClick ? (
          <button
            onClick={onGujaratiClick}
            className="press"
            style={{
              borderRadius:20, padding:'20px 14px', textDecoration:'none', position:'relative', overflow:'hidden',
              background:'linear-gradient(135deg,#BE123C,#E11D48)',
              boxShadow:'0 6px 20px rgba(190,18,60,0.35)',
              display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10, border: 'none', cursor: 'pointer'
            }}
          >
            {gujaratiCardContent}
          </button>
        ) : (
          <Link
            to="/games"
            className="press"
            style={{
              borderRadius:20, padding:'20px 14px', textDecoration:'none', position:'relative', overflow:'hidden',
              background:'linear-gradient(135deg,#BE123C,#E11D48)',
              boxShadow:'0 6px 20px rgba(190,18,60,0.35)',
              display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10,
            }}
          >
            {gujaratiCardContent}
          </Link>
        )}
      </div>

      {/* 2x2 grid for Action Games */}
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
    </div>
  );
}
