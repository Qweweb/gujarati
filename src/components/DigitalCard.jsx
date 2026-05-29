import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Native URL-safe Base64 Encoding/Decoding
const encodeCardData = (data) => {
  try {
    const jsonStr = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

const decodeCardData = (urlSafeBase64) => {
  try {
    let base64 = urlSafeBase64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
    const jsonStr = decodeURIComponent(escape(atob(paddedBase64)));
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Decoding error", e);
    return null;
  }
};

// 15 Elite Premium Themes Configuration
const THEMES = [
  { id: 'classic', name: 'સરળ વ્યવસાયિક (Classic)', bg: 'bg-gradient-to-b from-slate-900 to-slate-950', text: 'text-slate-100', cardBg: 'bg-slate-800/40 border-slate-700/50', accent: 'text-blue-400', buttonBg: 'bg-blue-600 hover:bg-blue-700', badgeBg: 'bg-blue-500/10 text-blue-300' },
  { id: 'rust', name: 'રાતા કસબી (Earthy Rust)', bg: 'bg-gradient-to-b from-[#451a03] to-[#1c0a00]', text: 'text-orange-50', cardBg: 'bg-orange-950/20 border-orange-900/30', accent: 'text-orange-400', buttonBg: 'bg-[#d97706] hover:bg-[#b45309]', badgeBg: 'bg-[#d97706]/10 text-orange-300' },
  { id: 'rose', name: 'ગુલાબી તેજ (Rose Glam)', bg: 'bg-gradient-to-b from-rose-50 to-pink-100', text: 'text-stone-800', cardBg: 'bg-white/70 border-rose-200/50 shadow-sm', accent: 'text-rose-600', buttonBg: 'bg-rose-550 hover:bg-rose-650 text-white', badgeBg: 'bg-rose-500/10 text-rose-700' },
  { id: 'royal', name: 'શાહી સુવર્ણ (Royal Gold)', bg: 'bg-gradient-to-b from-stone-950 to-stone-900', text: 'text-amber-100/90', cardBg: 'bg-stone-900/60 border-amber-500/20', accent: 'text-amber-400', buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-black', badgeBg: 'bg-amber-400/15 text-amber-300' },
  { id: 'forest', name: 'વનરાજી (Forest Green)', bg: 'bg-gradient-to-b from-emerald-950 to-stone-950', text: 'text-emerald-50', cardBg: 'bg-emerald-900/15 border-emerald-800/20', accent: 'text-emerald-400', buttonBg: 'bg-emerald-600 hover:bg-emerald-700', badgeBg: 'bg-emerald-500/10 text-emerald-300' },
  { id: 'neon', name: 'આધુનિક ટેકનો (Cyber Neon)', bg: 'bg-gradient-to-b from-[#0f0c1b] to-[#201c3b]', text: 'text-purple-100', cardBg: 'bg-[#201c3b]/30 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]', accent: 'text-fuchsia-400', buttonBg: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500', badgeBg: 'bg-fuchsia-500/15 text-fuchsia-300' },
  { id: 'carbon', name: 'કાર્બન ક્રાફ્ટ (Industrial)', bg: 'bg-gradient-to-b from-zinc-900 to-black', text: 'text-zinc-100', cardBg: 'bg-zinc-900/80 border-zinc-800', accent: 'text-yellow-450', buttonBg: 'bg-yellow-500 hover:bg-yellow-600 text-black font-black', badgeBg: 'bg-yellow-400/10 text-yellow-300' },
  { id: 'sanskari', name: 'પવિત્ર શાંતિ (Temple Saffron)', bg: 'bg-gradient-to-b from-[#fffbf7] to-amber-50/20', text: 'text-stone-800', cardBg: 'bg-white border-orange-200/50 shadow-sm', accent: 'text-orange-600', buttonBg: 'bg-orange-600 hover:bg-orange-700 text-white', badgeBg: 'bg-orange-500/10 text-orange-700' },
  { id: 'ocean', name: 'સાગર લહેર (Ocean Breeze)', bg: 'bg-gradient-to-b from-[#155e75] to-slate-900', text: 'text-cyan-50', cardBg: 'bg-cyan-900/20 border-cyan-800/30', accent: 'text-cyan-300', buttonBg: 'bg-cyan-600 hover:bg-cyan-700', badgeBg: 'bg-cyan-500/15 text-cyan-350' },
  { id: 'wooden', name: 'ચર્મ અને લાકડું (Warm Timber)', bg: 'bg-gradient-to-b from-[#3d271d] to-[#1f100a]', text: 'text-amber-50', cardBg: 'bg-amber-950/15 border-amber-900/20', accent: 'text-amber-500', buttonBg: 'bg-[#a16207] hover:bg-[#854d0e]', badgeBg: 'bg-amber-500/10 text-amber-300' },
  { id: 'velvet', name: 'જાંબલી ક્રીમ (Plum Velvet)', bg: 'bg-gradient-to-b from-[#3b0764] to-zinc-950', text: 'text-purple-50', cardBg: 'bg-purple-900/10 border-purple-800/20', accent: 'text-purple-300', buttonBg: 'bg-purple-700 hover:bg-purple-800', badgeBg: 'bg-purple-500/15 text-purple-300' },
  { id: 'minimal', name: 'મિનિમલ ગ્રે (Minimal Slate)', bg: 'bg-gradient-to-b from-slate-50 to-slate-100', text: 'text-slate-800', cardBg: 'bg-white border-slate-200 shadow-xs', accent: 'text-slate-900', buttonBg: 'bg-slate-900 hover:bg-black text-white', badgeBg: 'bg-slate-100 text-slate-800' },
  { id: 'lavender', name: 'લવંડર લહેકા (Sweet Lavender)', bg: 'bg-gradient-to-b from-purple-50 to-indigo-100', text: 'text-indigo-950', cardBg: 'bg-white/70 border-indigo-200/50 shadow-sm', accent: 'text-indigo-650', buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white', badgeBg: 'bg-indigo-500/10 text-indigo-750' },
  { id: 'teal', name: 'મોરપીંછ તેજ (Midnight Teal)', bg: 'bg-gradient-to-b from-slate-950 via-[#0b2b2b] to-slate-950', text: 'text-teal-50', cardBg: 'bg-[#0b2b2b]/35 border-teal-850/40', accent: 'text-teal-300', buttonBg: 'bg-teal-600 hover:bg-teal-700', badgeBg: 'bg-teal-500/15 text-teal-300' },
  { id: 'crimson', name: 'સિંદૂરી કલા (Crimson Gold)', bg: 'bg-gradient-to-br from-rose-950 via-[#3b0202] to-black', text: 'text-rose-50', cardBg: 'bg-rose-950/20 border-rose-900/30', accent: 'text-amber-400', buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white', badgeBg: 'bg-rose-500/10 text-rose-300' }
];

// Presets for Product and Gallery items to quickly select
const PRODUCT_PRESETS = [
  { name: "લોખંડના દરવાજા અને જાળી (Fabrication)", price: "૧૫૦/સ્કવેર ફૂટ", desc: "પ્રીમિયમ ક્વોલિટી અને મજબૂત ડિઝાઇન.", img: "🔨" },
  { name: "વાર્ષિક સી.એ. રિટર્ન ફાઈલીંગ (CA Return)", price: "૧૫૦૦", desc: "ઇન્કમટેક્સ અને GST નું પ્રોફેશનલ ફાઇલિંગ.", img: "📊" },
  { name: "પ્રીમિયમ હેર કટિંગ અને ટ્રીમિંગ (Hair Cut)", price: "૧૫૦", desc: "અદ્યતન હેરસ્ટાઇલ અને ફેસ મસાજ પૅકેજ.", img: "💇" },
  { name: "આખા દિવસની કાર ડ્રાઇવિંગ સર્વિસ (Local Trip)", price: "૧૦૦૦/દિવસ", desc: "અનુભવી અને લાયસન્સ ધરાવતા સજ્જન ડ્રાઇવર.", img: "🚗" },
  { name: "ઇલેક્ટ્રિકલ વાયરિંગ અને સ્વિચ બોર્ડ ફિટિંગ", price: "૫૦૦", desc: "નવા ઘરનું સંપૂર્ણ ઇલેક્ટ્રિકલ સેટઅપ કામ.", img: "🔌" }
];

const GALLERY_PRESETS = [
  { icon: "📸", label: "શ્રેષ્ઠ પ્રોજેક્ટ્સ ફોટો" },
  { icon: "🏢", label: "અમારી ઓફિસ / દુકાન" },
  { icon: "🤝", label: "ખુશ ગ્રાહકો સાથે કામ" },
  { icon: "🏆", label: "અવોર્ડ અને સર્ટિફિકેટ્સ" },
  { icon: "⚙️", label: "લાઈવ વર્કિંગ વિડીયો/ફોટો" }
];

const LAYOUT_STYLES = [
  { id: 'classic', name: 'ક્લાસિક સેન્ટર્ડ (Classic)', icon: 'format_align_center', desc: 'પ્રોફાઇલ અને માહિતી બધું વચ્ચે આકર્ષક રીતે સેટ થાય છે.' },
  { id: 'split', name: 'પ્રોફેશનલ સ્પ્લિટ (Left Split)', icon: 'format_align_left', desc: 'ડાબી બાજુ લોગો અને જમણી બાજુ નામ સેટ થાય છે, જે ફોર્મલ લુક આપે છે.' },
  { id: 'glass', name: 'ગ્લાસી કવર (Glass Banner)', icon: 'layers', desc: 'બેકગ્રાઉન્ડ કવર બેનર અને કાચ જેવા સુંદર ફ્લોટિંગ બોક્સ બને છે.' },
  { id: 'shop', name: 'સેવા અને કેટલોગ ગ્રીડ (Shop Grid)', icon: 'grid_view', desc: 'દુકાનદાર માટે પ્રોડક્ટ કેટલોગને આગળ રાખતી આધુનિક ૨-કોલમ ગ્રીડ ડિઝાઇન.' },
  { id: 'minimal', name: 'મિનિમલ બાયો લિન્ક (Minimal Bio)', icon: 'link', desc: 'લિંકટ્રી જેવું સાદું અને સુંદર કાર્ડ જેમાં મોટી બટન પટ્ટીઓ સેટ થાય છે.' }
];

const CardContent = ({ data, activeTheme, isPreview, downloadVcf, navigate }) => {
  const customColor = data.customColor || '#f97316';
  const layout = data.layoutStyle || 'classic';

  // Common quick click buttons
  const quickActions = [
    { icon: 'call', href: `tel:${data.phone}`, label: 'કૉલ', val: data.phone },
    { icon: 'chat', href: `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent('હું આપની મિની-વેબસાઇટ જોઈને પૂછપરછ માટે સંપર્ક કરી રહ્યો છું.')}`, label: 'WhatsApp', val: data.whatsapp },
    { icon: 'pin_drop', href: data.locationLink, label: 'નકશો', val: data.locationLink },
    { icon: 'mail', href: `mailto:${data.email}`, label: 'મેઇલ', val: data.email },
    { icon: 'language', href: data.website, label: 'વેબસાઇટ', val: data.website }
  ].filter(action => action.val && action.val !== '9825XXXXXX' && action.val !== 'sharma.fab@gmail.com');

  // If actions are empty during preview/fallback, show some defaults
  const visibleActions = quickActions.length > 0 ? quickActions : [
    { icon: 'call', href: `tel:${data.phone}`, label: 'કૉલ' },
    { icon: 'chat', href: `https://api.whatsapp.com/send?phone=91${data.whatsapp}`, label: 'WhatsApp' },
    { icon: 'pin_drop', href: data.locationLink || 'https://maps.google.com', label: 'નકશો' },
    { icon: 'mail', href: `mailto:${data.email}`, label: 'મેઇલ' },
    { icon: 'language', href: data.website || 'https://google.com', label: 'વેબસાઇટ' }
  ];

  switch (layout) {
    case 'split':
      return (
        <div className="space-y-5 text-left relative z-10 w-full">
          {/* Split Header */}
          <div className="flex gap-4 items-center bg-white/5 border border-white/10 rounded-2.5xl p-4">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/10 border border-white/20 shrink-0">
              🏬
            </div>
            <div className="space-y-1 min-w-0">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${activeTheme.badgeBg}`}>{data.category}</span>
              <h2 className="font-gujarati font-black text-lg truncate leading-tight mt-0.5">{data.businessName}</h2>
              <p className="font-gujarati text-xs opacity-80 font-bold truncate">{data.name}</p>
            </div>
          </div>
          {data.tagline && (
            <p className="font-gujarati text-xs opacity-70 italic border-l-2 pl-3 leading-relaxed" style={{ borderColor: customColor }}>{data.tagline}</p>
          )}

          {/* Actions in Split layout: horizontal badges */}
          <div className="grid grid-cols-2 gap-2">
            {visibleActions.map((btn, i) => (
              <a 
                key={i} 
                href={isPreview ? undefined : btn.href} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 p-2.5 bg-white/10 dark:bg-black/20 border border-white/10 rounded-xl hover:scale-102 active:scale-98 transition-all"
              >
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/10 shrink-0" style={{ color: customColor }}>
                  <span className="material-symbols-outlined text-sm font-bold">{btn.icon}</span>
                </div>
                <span className="text-[10px] font-gujarati opacity-90 font-bold truncate">{btn.label}</span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-3 rounded-xl font-gujarati font-black text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            કોન્ટેક્ટ સેવ કરો
          </button>

          {/* Catalog */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs uppercase tracking-wider opacity-60">અમારી પ્રોડક્ટ્સ & સેવાઓ</h3>
              <div className="space-y-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex justify-between items-center text-xs gap-3">
                    <div>
                      <h4 className="font-bold font-gujarati">{p.name}</h4>
                      <p className="text-[9px] opacity-70 truncate max-w-[180px]">{p.desc}</p>
                      <h5 className="font-black font-headline text-xs mt-0.5" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(`હું આપના કેટલોગમાંથી આના વિશે જાણવા માંગુ છું: ${p.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-650 hover:bg-emerald-700 text-white h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs uppercase tracking-wider opacity-60">ગેલેરી</h3>
              <div className="space-y-2">
                {data.gallery.map((g, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center gap-3">
                    <span className="text-xl shrink-0">{g.icon}</span>
                    <p className="font-gujarati text-[10px] opacity-80 font-bold truncate">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-xl shrink-0" style={{ color: customColor }}>qr_code_2</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-[10px] font-gujarati truncate">{data.upiName}</h4>
                  <p className="text-[8px] opacity-60 truncate">{data.upiId}</p>
                </div>
              </div>
              <a
                href={isPreview ? undefined : `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.upiName)}`}
                className="px-2.5 py-1 text-[9px] font-black rounded-lg text-white font-gujarati shrink-0"
                style={{ backgroundColor: customColor }}
              >
                Pay UPI
              </a>
            </div>
          )}
        </div>
      );

    case 'glass':
      return (
        <div className="space-y-5 relative z-10 text-center w-full">
          {/* Glass Cover & Banner */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-white/10 to-transparent -mx-6 -mt-6 border-b border-white/5 pointer-events-none rounded-t-[2.5rem]"></div>
          
          <div className="pt-8 space-y-3">
            <div className="h-16 w-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-lg bg-white/20 border-2 border-white/30 backdrop-blur-md relative z-10">
              🏬
            </div>
            <div className="space-y-0.5 bg-black/10 backdrop-blur-md border border-white/15 rounded-2.5xl p-4">
              <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${activeTheme.badgeBg}`}>{data.category}</span>
              <h2 className="font-gujarati font-black text-xl tracking-tight mt-1 leading-tight">{data.businessName}</h2>
              <p className="font-gujarati text-xs opacity-90 font-bold">{data.name}</p>
              {data.tagline && (
                <p className="font-gujarati text-[10px] opacity-60 leading-relaxed max-w-xs mx-auto pt-1">{data.tagline}</p>
              )}
            </div>
          </div>

          {/* Quick Actions circular */}
          <div className="flex justify-center gap-3">
            {visibleActions.map((btn, i) => (
              <a 
                key={i} 
                href={isPreview ? undefined : btn.href} 
                target="_blank" 
                rel="noreferrer" 
                className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all hover:scale-110 active:scale-90 shrink-0" 
                style={{ color: customColor }}
              >
                <span className="material-symbols-outlined text-base font-bold">{btn.icon}</span>
              </a>
            ))}
          </div>

          {/* CTA Glass */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-3 rounded-2xl font-gujarati font-black text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 border border-white/10 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-sm font-bold">person_add</span>
            કોન્ટેક્ટ સેવ કરો (Save)
          </button>

          {/* Catalog Carousel-style grid */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] uppercase tracking-wider opacity-60 text-center">અમારી સેવાઓ</h3>
              <div className="grid grid-cols-1 gap-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15 rounded-2.5xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-gujarati font-bold text-xs truncate">{p.name}</h4>
                      <p className="font-gujarati text-[9px] opacity-60 truncate">{p.desc}</p>
                      <h5 className="font-headline font-black text-xs mt-0.5" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(`હું આપના કેટલોગમાંથી આના વિશે જાણવા માંગુ છું: ${p.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-650 hover:bg-emerald-700 text-white h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {data.gallery.map((g, idx) => (
                  <div key={idx} className="bg-white/10 dark:bg-black/20 border border-white/15 rounded-2xl p-2 text-center space-y-0.5">
                    <span className="text-xl">{g.icon}</span>
                    <p className="font-gujarati text-[8px] opacity-80 truncate font-bold">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPI */}
          {data.upiId && (
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15 rounded-2.5xl p-3 flex items-center justify-between gap-3 text-left">
              <div className="min-w-0 flex-1">
                <h5 className="font-gujarati font-bold text-xs truncate">{data.upiName}</h5>
                <p className="font-headline text-[9px] opacity-60 truncate">{data.upiId}</p>
              </div>
              <a
                href={isPreview ? undefined : `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.upiName)}`}
                className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black active:scale-95 transition-transform"
              >
                Pay UPI
              </a>
            </div>
          )}
        </div>
      );

    case 'shop':
      return (
        <div className="space-y-5 text-left relative z-10 w-full">
          {/* Shopkeeper Fast Catalog Header */}
          <div className="space-y-1">
            <span className="bg-emerald-550/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">{data.category || 'સેવા વિક્રેતા'}</span>
            <h2 className="font-gujarati font-black text-xl tracking-tight leading-none mt-1">{data.businessName}</h2>
            <p className="font-gujarati text-[11px] opacity-75">સેવા પ્રદાતા: {data.name}</p>
          </div>

          {/* Save Contact Card strip */}
          <div className="flex gap-2">
            <button
              onClick={() => downloadVcf(data)}
              className="flex-1 text-center py-2.5 rounded-xl font-gujarati font-black text-[10px] transition-all active:scale-98 shadow-xs flex items-center justify-center gap-1 text-white"
              style={{ backgroundColor: customColor }}
            >
              <span className="material-symbols-outlined text-xs font-bold">person_add</span>
              કોન્ટેક્ટ સેવ
            </button>
            
            {/* Quick Actions (Call, WhatsApp, Maps) */}
            <div className="flex gap-1.5">
              {visibleActions.slice(0, 3).map((btn, i) => (
                <a 
                  key={i} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shrink-0" 
                  style={{ color: customColor }}
                  title={btn.label}
                >
                  <span className="material-symbols-outlined text-sm font-bold">{btn.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Catalog Grid (2 columns) */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs border-b pb-1 opacity-60">કેટલોગ લિસ્ટ</h3>
              <div className="grid grid-cols-2 gap-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between h-28">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-gujarati font-bold text-[10px] leading-tight line-clamp-2">{p.name}</h4>
                        <span className="text-xs shrink-0">{p.img || '🔨'}</span>
                      </div>
                      <p className="font-headline font-black text-[9px] mt-1" style={{ color: customColor }}>{p.price}</p>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(`હું આપના કેટલોગમાંથી આના વિશે જાણવા માંગુ છું: ${p.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-650 hover:bg-emerald-700 text-white py-1 rounded-lg text-[8px] font-black text-center flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[8px]">chat</span> પૂછપરછ
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery list */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-gujarati font-black text-xs opacity-60">ઓફિસ / કામ પ્રદર્શન</h3>
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-hide">
                {data.gallery.map((g, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-1.5 shrink-0">
                    <span>{g.icon}</span>
                    <span className="font-gujarati text-[9px] font-bold opacity-80">{g.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPI Payment Shop card */}
          {data.upiId && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h5 className="font-gujarati font-bold text-[10px] truncate leading-tight">{data.upiName}</h5>
                <p className="font-headline text-[8px] opacity-60 truncate">{data.upiId}</p>
              </div>
              <a
                href={isPreview ? undefined : `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.upiName)}`}
                className="bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[8px] font-black active:scale-95"
              >
                Pay UPI
              </a>
            </div>
          )}
        </div>
      );

    case 'minimal':
      return (
        <div className="space-y-4 text-center relative z-10 w-full">
          {/* Minimal Profile */}
          <div className="space-y-1.5">
            <div className="text-3xl">🏬</div>
            <div className="space-y-0.5">
              <h2 className="font-gujarati font-black text-lg leading-tight">{data.businessName}</h2>
              <p className="font-gujarati text-xs opacity-75 font-bold">{data.name} | {data.category}</p>
              {data.tagline && (
                <p className="font-gujarati text-[10px] opacity-60 leading-relaxed">{data.tagline}</p>
              )}
            </div>
          </div>

          {/* Full-width Stack of actions */}
          <div className="space-y-1.5">
            {visibleActions.map((btn, i) => (
              <a 
                key={i} 
                href={isPreview ? undefined : btn.href} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left active:scale-99 transition-all text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm font-bold" style={{ color: customColor }}>{btn.icon}</span>
                  <span className="font-gujarati font-bold opacity-80">{btn.label}</span>
                </div>
                <span className="material-symbols-outlined text-[10px] opacity-40">arrow_forward</span>
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full py-2.5 rounded-xl font-gujarati font-black text-[10px] border active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor, borderColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            કોન્ટેક્ટ સેવ કરો
          </button>

          {/* Catalog simple list */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-b pb-0.5 uppercase tracking-wider opacity-55">સેવા અને કિંમત</h3>
              <div className="space-y-1.5">
                {data.products.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] py-1 border-b border-white/5">
                    <div className="min-w-0 flex-1">
                      <span className="font-gujarati font-bold opacity-80">{idx + 1}. {p.name}</span>
                      <p className="text-[8px] opacity-50 truncate">{p.desc}</p>
                    </div>
                    <span className="font-headline font-black shrink-0" style={{ color: customColor }}>{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPI Minimal strip */}
          {data.upiId && (
            <div className="text-center bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-center gap-1 text-[9px] font-gujarati">
              <span>UPI:</span>
              <span className="font-bold opacity-85">{data.upiId}</span>
            </div>
          )}
        </div>
      );

    default: // classic
      return (
        <div className="space-y-5 text-center relative z-10 w-full">
          {/* Header Info */}
          <div className="space-y-3 pt-2">
            <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/10 border border-white/20">
              🏬
            </div>
            <div className="space-y-0.5">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${activeTheme.badgeBg}`}>{data.category}</span>
              <h2 className="font-gujarati font-black text-xl tracking-tight leading-tight mt-1">{data.businessName}</h2>
              <p className="font-gujarati text-xs opacity-80 font-bold">{data.name}</p>
              <p className="font-gujarati text-[10px] opacity-60 leading-relaxed max-w-xs mx-auto pt-0.5 truncate">{data.tagline}</p>
            </div>
          </div>

          {/* Quick Click Icons */}
          <div className="grid grid-cols-5 gap-2">
            {visibleActions.map((btn, i) => (
              <a 
                key={i} 
                href={isPreview ? undefined : btn.href} 
                target="_blank" 
                rel="noreferrer" 
                className="flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all"
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shadow-xs" style={{ color: customColor }}>
                  <span className="material-symbols-outlined text-base font-bold">{btn.icon}</span>
                </div>
                <span className="text-[8px] font-gujarati opacity-75 font-semibold">{btn.label}</span>
              </a>
            ))}
          </div>

          {/* Save Contact CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-2.5 rounded-xl font-gujarati font-black text-[10px] transition-all active:scale-98 shadow-xs flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            કોન્ટેક્ટ સેવ કરો (Save Contact)
          </button>

          {/* Product Catalog */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>અમારી સેવાઓ / કેટલોગ</h3>
              <div className="space-y-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 text-[11px]">
                    <div className="space-y-0.5">
                      <h4 className="font-gujarati font-bold text-xs truncate max-w-[170px]">{p.name}</h4>
                      <p className="font-gujarati text-[9px] opacity-60 truncate max-w-[170px]">{p.desc}</p>
                      <h5 className="font-headline font-black text-[10px]" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(`હું આપના ડિજિટલ કેટલોગમાંથી આના વિશે વિગત જાણવા માંગુ છું: ${p.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-650 hover:bg-emerald-700 text-white h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xs">chat</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slider Gallery */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2 text-left" style={{ borderColor: customColor }}>ફોટો ગેલેરી</h3>
              <div className="grid grid-cols-2 gap-2">
                {data.gallery.map((g, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center space-y-0.5">
                    <span className="text-xl">{g.icon}</span>
                    <p className="font-gujarati text-[8px] opacity-80 truncate">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPI Payment Section */}
          {data.upiId && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>ઝડપી ચૂકવણી</h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5 overflow-hidden">
                  <h5 className="font-gujarati font-bold text-xs truncate">{data.upiName}</h5>
                  <p className="font-headline text-[9px] opacity-70 truncate">{data.upiId}</p>
                </div>
                <a
                  href={isPreview ? undefined : `upi://pay?pa=${data.upiId}&pn=${encodeURIComponent(data.upiName)}`}
                  className="bg-amber-600 text-white px-2.5 py-1.5 rounded-lg text-[9px] font-black active:scale-95 transition-transform"
                >
                  Pay UPI
                </a>
              </div>
            </div>
          )}
        </div>
      );
  }
};

// =========================================================================
// PREMIUM CREATOR HELPERS
// =========================================================================

const FormInput = ({ label, value, onChange, placeholder, type = 'text', helpText, icon }) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-bold text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
          {icon && <span className="material-symbols-outlined text-sm text-primary/70">{icon}</span>}
          {label}
        </label>
      </div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full bg-stone-50 dark:bg-stone-900/40 border border-stone-250 dark:border-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 dark:focus:border-amber-500 transition-all text-on-surface dark:text-stone-100" 
      />
      {helpText && <p className="text-[10px] text-stone-400 dark:text-stone-500 pl-1">{helpText}</p>}
    </div>
  );
};

const FormTextArea = ({ label, value, onChange, placeholder, rows = 2, helpText, icon }) => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="font-bold text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
          {icon && <span className="material-symbols-outlined text-sm text-primary/70">{icon}</span>}
          {label}
        </label>
      </div>
      <textarea 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-stone-50 dark:bg-stone-900/40 border border-stone-250 dark:border-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 dark:focus:border-amber-500 transition-all text-on-surface dark:text-stone-100 resize-none" 
      />
      {helpText && <p className="text-[10px] text-stone-400 dark:text-stone-500 pl-1">{helpText}</p>}
    </div>
  );
};

const LayoutPreview = ({ type }) => {
  switch (type) {
    case 'classic':
      return (
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col items-center justify-center p-1.5 gap-1 shrink-0">
          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
          <div className="h-1 w-6 bg-stone-350 dark:bg-stone-700 rounded-full"></div>
          <div className="h-1 w-4 bg-stone-205 dark:bg-stone-800 rounded-full"></div>
          <div className="flex gap-1 w-full justify-center mt-0.5">
            <div className="h-1 w-2 bg-stone-300 dark:bg-stone-700 rounded-xs"></div>
            <div className="h-1 w-2 bg-stone-300 dark:bg-stone-700 rounded-xs"></div>
            <div className="h-1 w-2 bg-stone-300 dark:bg-stone-700 rounded-xs"></div>
          </div>
        </div>
      );
    case 'split':
      return (
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col justify-center p-1.5 gap-1.5 shrink-0">
          <div className="flex gap-1.5 items-center">
            <div className="h-4 w-4 rounded-md bg-amber-500 shrink-0"></div>
            <div className="space-y-0.5 w-full">
              <div className="h-1 w-6 bg-stone-355 dark:bg-stone-700 rounded-full"></div>
              <div className="h-0.5 w-4 bg-stone-205 dark:bg-stone-800 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 w-full">
            <div className="h-1 w-full bg-stone-300 dark:bg-stone-750 rounded-xs"></div>
            <div className="h-1 w-full bg-stone-300 dark:bg-stone-750 rounded-xs"></div>
          </div>
        </div>
      );
    case 'glass':
      return (
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl relative overflow-hidden flex flex-col justify-end p-1.5 gap-1 shrink-0">
          <div className="absolute top-0 left-0 right-0 h-4 bg-amber-500/25"></div>
          <div className="bg-white/70 dark:bg-stone-950/70 border border-stone-200/30 backdrop-blur-xs rounded-md p-1 space-y-0.5 relative z-10 shadow-xs">
            <div className="h-1 w-4 bg-stone-355 dark:bg-stone-700 rounded-full mx-auto"></div>
            <div className="h-0.5 w-2 bg-stone-205 dark:bg-stone-800 rounded-full mx-auto"></div>
          </div>
          <div className="h-1.5 w-full bg-amber-500 rounded-xs relative z-10"></div>
        </div>
      );
    case 'shop':
      return (
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col justify-between p-1.5 shrink-0">
          <div className="h-1 w-6 bg-stone-355 dark:bg-stone-700 rounded-full"></div>
          <div className="grid grid-cols-2 gap-1 w-full mt-0.5">
            <div className="bg-stone-200 dark:bg-stone-800 rounded-xs p-0.5 space-y-0.5">
              <div className="h-1 w-1 bg-amber-500 rounded-xs"></div>
              <div className="h-0.5 w-3 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
            </div>
            <div className="bg-stone-200 dark:bg-stone-800 rounded-xs p-0.5 space-y-0.5">
              <div className="h-1 w-1 bg-amber-500 rounded-xs"></div>
              <div className="h-0.5 w-3 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
            </div>
          </div>
        </div>
      );
    case 'minimal':
      return (
        <div className="w-14 h-14 bg-stone-100 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl flex flex-col items-center justify-center p-1.5 gap-1 shrink-0">
          <div className="h-1.5 w-4 bg-stone-355 dark:bg-stone-700 rounded-full"></div>
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-xs"></div>
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-xs"></div>
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-xs"></div>
        </div>
      );
    default:
      return null;
  }
};

const AccordionItem = ({ id, activeId, setActiveId, title, num, icon, children }) => {
  const isOpen = activeId === id;
  return (
    <div className="bg-white dark:bg-dark-surface rounded-[2rem] border border-primary/10 dark:border-primary/5 overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
      <button
        onClick={() => setActiveId(isOpen ? null : id)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${isOpen ? 'bg-primary text-white' : 'bg-primary/15 text-primary'}`}>
            {num}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-lg shrink-0">{icon}</span>
            <h3 className="font-gujarati font-black text-base text-primary dark:text-amber-450 truncate">{title}</h3>
          </div>
        </div>
        <span className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-primary/10 dark:border-primary/5 space-y-5 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

const DigitalCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route modes check
  const isViewer = location.pathname === '/c' || location.pathname.startsWith('/c/');

  // Viewer State (loaded from URL)
  const [viewerData, setViewerData] = useState(null);

  // Card Creator Form States
  const [name, setName] = useState('રમેશભાઈ શર્મા');
  const [businessName, setBusinessName] = useState('શર્મા આયર્ન ફેબ્રિકેશન');
  const [category, setCategory] = useState('લોખંડ ફેબ્રિકેશન કામ');
  const [tagline, setTagline] = useState('સો ટકા ગુણવત્તાવાળું અને મજબૂત ફેબ્રિકેશન કામ.');
  const [phone, setPhone] = useState('9825XXXXXX');
  const [whatsapp, setWhatsapp] = useState('9825XXXXXX');
  const [email, setEmail] = useState('sharma.fab@gmail.com');
  const [address, setAddress] = useState('દુકાન નં. ૪, સહજાનંદ કોમ્પ્લેક્સ, નિકોલ રોડ, અમદાવાદ');
  const [locationLink, setLocationLink] = useState('https://maps.google.com');
  const [website, setWebsite] = useState('https://sharmadevelopers.in');
  const [upiId, setUpiId] = useState('sharmafab@oksbi');
  const [upiName, setUpiName] = useState('Ramesh Sharma');
  
  const [themeId, setThemeId] = useState('rust');
  const [customColor, setCustomColor] = useState('#f97316'); // Custom Accent
  const [layoutStyle, setLayoutStyle] = useState('classic'); // Layout Style State
  const [activeAccordion, setActiveAccordion] = useState('details'); // Creator Accordion State
  
  // Catalog items list
  const [products, setProducts] = useState([
    { id: 1, name: 'ડીઝાઈનર લોખંડનો ગેટ', price: '₹ ૧૨,૦૦૦ થી શરૂ', desc: 'ગ્લાસ કટ અને લેસર કટિંગની સુંદર ડિઝાઇન.', img: '🔨' },
    { id: 2, name: 'બાલ્કની સેફ્ટી જાળી', price: '₹ ૧૫૦/સ્કવેર ફૂટ', desc: 'ભારે પાયા અને ડબલ કોટેડ કાટ-પ્રતિરોધક પેઇન્ટ સાથે.', img: '🛡️' }
  ]);

  // Gallery items list
  const [gallery, setGallery] = useState([
    { id: 1, icon: '📸', label: 'નિકોલ બંગલો ગેટ કામ' },
    { id: 2, icon: '🏢', label: 'અમારી નિકોલ વર્કશોપ' },
    { id: 3, icon: '🏆', label: 'એસોસિયેશન સન્માન પત્ર' }
  ]);

  // Temporary Form additions
  const [tempProdName, setTempProdName] = useState('');
  const [tempProdPrice, setTempProdPrice] = useState('');
  const [tempProdDesc, setTempProdDesc] = useState('');
  const [tempProdImg, setTempProdImg] = useState('🔨');

  const [tempGallLabel, setTempGallLabel] = useState('');
  const [tempGallIcon, setTempGallIcon] = useState('📸');

  const [toastText, setToastText] = useState('');

  const triggerLocalToast = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(''), 3000);
  };

  // On mount: If Viewer Mode, read URL hash parameters and load
  useEffect(() => {
    if (isViewer) {
      const hash = location.hash;
      if (hash && hash.startsWith('#d=')) {
        const base64Data = hash.substring(3);
        const cardData = decodeCardData(base64Data);
        if (cardData) {
          setViewerData(cardData);
        } else {
          triggerLocalToast("❌ાર્ડ ડેટા લોડ કરવામાં ભૂલ થઈ!");
        }
      } else {
        // Fallback demo data
        setViewerData({
          name: 'શ્યામ સુંદર લિમિટેડ',
          businessName: 'શ્યામ ફેબ્રિકેશન એન્ડ ગ્રીલ્સ',
          category: 'પ્રોફેશનલ ફેબ્રિકેટર',
          tagline: 'તમારા સપનાના ઘરને લોખંડની કલાત્મક કડીઓથી સજાવો.',
          phone: '9988776655',
          whatsapp: '9988776655',
          email: 'shyam.fab@gmail.com',
          address: 'જીઆઈડીસી ફેઝ ૨, નરોડા, અમદાવાદ',
          locationLink: 'https://maps.google.com',
          website: 'https://shyamfabrication.in',
          upiId: 'shyamfab@okaxis',
          upiName: 'Shyam Sunder',
          themeId: 'rust',
          customColor: '#ea580c',
          products: [
            { id: 1, name: 'સ્માર્ટ સ્લાઇડિંગ ગેટ', price: '₹ ૨૫,૦૦૦', desc: 'ઓટોમેશન સેન્સર સાથે ચાલે તેવો પ્રીમિયમ ગેટ.', img: '🔨' },
            { id: 2, name: 'કલાત્મક વિન્ડો સેફ્ટી ગ્રીલ્સ', price: '₹ ૧૨૦/ફૂટ', desc: 'ડિઝાઈનર સેફ્ટી જાળી.', img: '🛡️' }
          ],
          gallery: [
            { id: 1, icon: '📸', label: 'અમદાવાદ સાઇટ ડેમો' },
            { id: 2, icon: '🏆', label: 'શ્રેષ્ઠ આર્કિટેક્ટ પુરસ્કાર ૨૦૨૫' }
          ]
        });
      }
    }
  }, [location, isViewer]);

  // VCF vCard File Generator & Downloader
  const downloadVcf = (cData) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${cData.name};;;;
FN:${cData.name}
ORG:${cData.businessName}
TITLE:${cData.category}
TEL;TYPE=CELL:${cData.phone}
EMAIL;TYPE=INTERNET:${cData.email}
URL:${cData.website}
ADR;TYPE=WORK:;;${cData.address};;;;
NOTE:Gujarati App (ગુજરાતી એપ) દ્વારા સેવ કરેલ
END:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${cData.name.replace(/\s+/g, '_')}_contact.vcf`;
    link.click();
    triggerLocalToast("📞 કોન્ટેક્ટ ફાઇલ ડાઉનલોડ થઈ ગઈ છે!");
  };

  // Compile full data representation to build URL link
  const generateShareLink = () => {
    const cardData = {
      name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, products, gallery, layoutStyle
    };
    const b64 = encodeCardData(cardData);
    return `${window.location.origin}/c#d=${b64}`;
  };

  const copyShareLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link).then(() => {
      triggerLocalToast("🔗 લિંક ક્લિપબોર્ડમાં કોપી થઈ ગઈ છે!");
    }).catch(err => {
      console.error(err);
      triggerLocalToast("❌ કોપી કરવામાં ભૂલ થઈ!");
    });
  };

  const shareOnWhatsApp = () => {
    const link = generateShareLink();
    const text = encodeURIComponent(`🚩 નમસ્તે! આ મારું ડિજિટલ બિઝનેસ કાર્ડ અને મિની-વેબસાઇટ છે. બ્રાઉઝરમાં ઓપન કરીને મારી પ્રોડક્ટ્સ અને કોન્ટેક્ટ સેવ કરી શકો છો:\n\n${link}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`);
  };

  // Add items handler
  const handleAddProduct = () => {
    if (!tempProdName) return;
    const np = {
      id: Date.now(),
      name: tempProdName,
      price: tempProdPrice || '₹ ૧૦૦',
      desc: tempProdDesc,
      img: tempProdImg
    };
    setProducts([...products, np]);
    setTempProdName('');
    setTempProdPrice('');
    setTempProdDesc('');
    triggerLocalToast("➕ નવી પ્રોડક્ટ ઉમેરાઈ ગઈ!");
  };

  const handleAddGallery = () => {
    if (!tempGallLabel) return;
    const ng = {
      id: Date.now(),
      label: tempGallLabel,
      icon: tempGallIcon
    };
    setGallery([...gallery, ng]);
    setTempGallLabel('');
    triggerLocalToast("📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!");
  };

  // Theme configuration locator
  const activeTheme = THEMES.find(t => t.id === (isViewer ? viewerData?.themeId : themeId)) || THEMES[0];
  const renderedData = isViewer ? viewerData : {
    name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, products, gallery, layoutStyle
  };

  // =========================================================================
  // VIEW MODE RENDER
  // =========================================================================
  if (isViewer) {
    if (!viewerData) {
      return (
        <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center font-gujarati">
          <div className="text-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"></div>
            <p>કાર્ડ ડેટા લોડ થઈ રહ્યો છે...</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-700 py-8 px-4 flex flex-col items-center justify-between`}>
        {toastText && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md text-white font-gujarati text-xs px-5 py-3 rounded-2xl shadow-xl border border-amber-500/20">
            {toastText}
          </div>
        )}

        {/* Card Body Mockup Frame */}
        <div className="max-w-md w-full bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden">
          {/* Accent Glow Circle */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full blur-[60px] opacity-20 pointer-events-none" style={{ backgroundColor: renderedData.customColor }}></div>
          
          <CardContent data={renderedData} activeTheme={activeTheme} isPreview={false} downloadVcf={downloadVcf} navigate={navigate} />
        </div>

        {/* Viral Growth Footer Link */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] opacity-75">
            Powered by: <a href="https://gujaratiapp.in" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-500 transition-colors">gujaratiapp.in</a>
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-gujarati font-black px-4 py-2 rounded-full transition-all active:scale-95"
          >
            મફત ડિજિટલ બિઝનેસ કાર્ડ બનાવો ➔
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CREATOR / BUILDER MODE RENDER
  // =========================================================================
  return (
    <div className="animate-fade-in space-y-6 pb-12 font-gujarati text-on-surface">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/tools')}
          className="h-10 w-10 bg-white dark:bg-stone-800 rounded-xl shadow-xs flex items-center justify-center text-primary border border-primary/10 active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div className="space-y-0.5">
          <h2 className="font-gujarati font-black text-2xl text-primary md:text-3xl">ડિજિટલ બિઝનેસ કાર્ડ</h2>
          <p className="font-gujarati text-outline text-sm">તમારા ધંધા કે વ્યવસાય માટે મફત મિની-વેબસાઇટ બનાવો અને કસ્ટમર્સ સાથે લિંક શેર કરો.</p>
        </div>
      </div>

      {toastText && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md text-white font-gujarati text-xs px-5 py-3 rounded-2xl shadow-xl border border-amber-500/20">
          {toastText}
        </div>
      )}

      {/* Main Grid: Config Form + Live Preview Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Config Form (Accordions) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Section 1: Details */}
          <AccordionItem 
            id="details" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="વેપારી અને ધંધાની વિગતો (Owner & Business Details)" 
            num="૧" 
            icon="store"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="માલિકનું નામ *" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="દા.ત. રમેશભાઈ શર્મા"
                icon="person"
              />
              <FormInput 
                label="ધંધાનું નામ (બિઝનેસ) *" 
                value={businessName} 
                onChange={e => setBusinessName(e.target.value)} 
                placeholder="દા.ત. શર્મા આયર્ન ફેબ્રિકેશન"
                icon="storefront"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="હોદ્દો / કેટેગરી *" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                placeholder="દા.ત. પ્લમ્બર, સીએ, ડ્રાઇવર, ડોક્ટર..."
                icon="category"
              />
              <FormInput 
                label="સ્લોગન / ટેગલાઇન" 
                value={tagline} 
                onChange={e => setTagline(e.target.value)} 
                placeholder="ધંધાનું સ્લોગન કે સૂત્ર"
                icon="campaign"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="કૉલ ફોન નંબર *" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="૧૦ આંકડાનો મોબાઈલ નંબર"
                type="tel"
                icon="call"
              />
              <FormInput 
                label="WhatsApp ફોન નંબર *" 
                value={whatsapp} 
                onChange={e => setWhatsapp(e.target.value)} 
                placeholder="૧૦ આંકડાનો WhatsApp નંબર"
                type="tel"
                icon="chat"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="ઈમેઇલ એડ્રેસ" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="example@mail.com"
                type="email"
                icon="mail"
              />
              <FormInput 
                label="ઓફિસ/દુકાન વેબસાઇટ" 
                value={website} 
                onChange={e => setWebsite(e.target.value)} 
                placeholder="https://mywebsite.com"
                type="url"
                icon="language"
              />
            </div>

            <FormTextArea 
              label="દુકાનનું સરનામું (Address) *" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="સરનામું દાખલ કરો..."
              rows={2}
              icon="pin_drop"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput 
                label="ગૂગલ મેપ લોકેશન લિંક (Google Maps)" 
                value={locationLink} 
                onChange={e => setLocationLink(e.target.value)} 
                placeholder="https://maps.google.com/..."
                type="url"
                icon="map"
              />
              <FormInput 
                label="UPI ચૂકવણી આઈડી (UPI ID)" 
                value={upiId} 
                onChange={e => setUpiId(e.target.value)} 
                placeholder="name@oksbi"
                icon="qr_code_2"
              />
            </div>
            {upiId && (
              <FormInput 
                label="UPI પ્રાપ્તકર્તાનું નામ (UPI Name)" 
                value={upiName} 
                onChange={e => setUpiName(e.target.value)} 
                placeholder="દા.ત. Ramesh Sharma"
                icon="account_circle"
                helpText="ચૂકવણી કરતી વખતે ગ્રાહકને આ નામ દેખાશે."
              />
            )}
          </AccordionItem>

          {/* Section 2: Layout Style */}
          <AccordionItem 
            id="layout" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="લેઆઉટ સ્ટાઇલ પસંદ કરો (Template Layout)" 
            num="૨" 
            icon="dashboard"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {LAYOUT_STYLES.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLayoutStyle(l.id)}
                  className={`p-4 rounded-[2rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex gap-4 items-center ${
                    layoutStyle === l.id 
                      ? 'border-primary bg-primary/5 text-primary shadow-xs' 
                      : 'border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900/50'
                  }`}
                >
                  <LayoutPreview type={l.id} />
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-gujarati font-black text-sm text-on-surface dark:text-stone-100">{l.name}</h4>
                    <p className="font-gujarati text-[10px] text-stone-555 dark:text-stone-400 leading-tight">{l.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </AccordionItem>

          {/* Section 3: Themes */}
          <AccordionItem 
            id="themes" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="થીમ અને બ્રાન્ડ કલર્સ (Themes & Accent Colors)" 
            num="૩" 
            icon="palette"
          >
            <div className="space-y-4">
              <p className="text-xs text-stone-555 dark:text-stone-450">કાર્ડને વ્યાવસાયિક લુક આપવા માટે તૈયાર ૧૫ પ્રીમિયમ થીમ્સમાંથી કોઈપણ એક પસંદ કરો:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {THEMES.map(t => {
                  const isActive = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`relative p-3.5 rounded-2.5xl border-2 text-left transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex flex-col justify-between h-24 overflow-hidden ${t.bg} ${t.text} ${
                        isActive ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/10 dark:border-black/25'
                      }`}
                    >
                      <div className="w-full flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold truncate max-w-[80%] font-gujarati">{t.name.split(' (')[0]}</span>
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 bg-current ${t.accent}`}></div>
                      </div>
                      
                      <div className="w-full space-y-1">
                        <div className="h-1 w-full bg-white/20 rounded-full"></div>
                        <div className="h-1 w-2/3 bg-white/10 rounded-full"></div>
                      </div>
                      
                      <div className="w-full flex items-center justify-between mt-1 text-[8px] opacity-75">
                        <span className="font-label">Theme</span>
                        {isActive && (
                          <span className="material-symbols-outlined text-xs text-amber-400 font-bold">check_circle</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-850">
                <div className="space-y-0.5">
                  <label className="font-bold text-xs text-stone-600 dark:text-stone-300">મુખ્ય કલર સેટ કરો (Accent Brand Color)</label>
                  <p className="text-[10px] text-stone-400 dark:text-stone-500">બટન અને હાઇલાઇટ્સ માટે તમારો કસ્ટમ બ્રાન્ડ કલર સેટ કરો.</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className="h-9 w-16 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer p-1 bg-stone-50 dark:bg-stone-900"
                  />
                  <span className="font-headline font-bold text-xs bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-on-surface dark:text-stone-200">{customColor}</span>
                </div>
              </div>
            </div>
          </AccordionItem>

          {/* Section 4: Catalog */}
          <AccordionItem 
            id="products" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="કેટલોગ / પ્રોડક્ટ્સ અને સેવાઓ (Catalog & Services)" 
            num="૪" 
            icon="shopping_bag"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-stone-555 dark:text-stone-450">તમારા વ્યવસાયની સેવાઓ કે પ્રોડક્ટ્સની કિંમત સાથે વિગત લખો (મહત્તમ ૫):</p>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{products.length} / ૫ ઉમેરેલ</span>
              </div>

              <div className="space-y-3">
                {products.map((p, idx) => (
                  <div key={p.id} className="bg-stone-50 dark:bg-stone-900/30 border border-stone-150 dark:border-stone-850 rounded-2xl p-4 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm shrink-0">{p.img || '🔨'}</span>
                        <p className="font-black text-on-surface dark:text-stone-200">{idx + 1}. {p.name}</p>
                      </div>
                      <p className="text-[10px] text-stone-450 dark:text-stone-500 pl-6 leading-tight">{p.desc}</p>
                      <p className="font-black text-primary dark:text-amber-450 pl-6">{p.price}</p>
                    </div>
                    <button 
                      onClick={() => setProducts(products.filter(item => item.id !== p.id))} 
                      className="h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>

              {products.length < 5 && (
                <div className="bg-stone-50 dark:bg-stone-900/20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-5 space-y-4">
                  <h4 className="font-gujarati font-black text-xs text-primary dark:text-amber-450 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm font-bold">add_box</span>
                    નવી પ્રોડક્ટ / સેવા ઉમેરો
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <FormInput 
                        label="પ્રોડક્ટનું નામ *" 
                        value={tempProdName} 
                        onChange={e => setTempProdName(e.target.value)} 
                        placeholder="પ્રોડક્ટનું નામ"
                      />
                    </div>
                    <div>
                      <FormInput 
                        label="કિંમત (દા.ત. ₹૧૫૦/સ્કવેર ફૂટ)" 
                        value={tempProdPrice} 
                        onChange={e => setTempProdPrice(e.target.value)} 
                        placeholder="કિંમત"
                      />
                    </div>
                  </div>

                  <FormInput 
                    label="ટૂંકું ડિસ્ક્રિપ્શન" 
                    value={tempProdDesc} 
                    onChange={e => setTempProdDesc(e.target.value)} 
                    placeholder="દા.ત. ગ્લાસ કટ અને લેસર કટિંગની સુંદર ડિઝાઇન."
                  />

                  <div className="flex flex-col gap-3.5">
                    <div className="space-y-1.5">
                      <label className="font-bold text-xs text-stone-500 dark:text-stone-400">ઝડપી સેમ્પલ પસંદ કરો (Presets):</label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRODUCT_PRESETS.map(preset => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setTempProdName(preset.name);
                              setTempProdPrice(preset.price);
                              setTempProdDesc(preset.desc);
                              setTempProdImg(preset.img);
                            }}
                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 hover:border-primary/30 rounded-xl px-3 py-1.5 text-[10px] text-on-surface dark:text-stone-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/10 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-gujarati"
                          >
                            <span>{preset.img}</span>
                            <span className="truncate max-w-[80px]">{preset.name.split(' (')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-200/50 dark:border-stone-850/50">
                      <div className="flex items-center gap-2">
                        <label className="font-bold text-xs text-stone-500 dark:text-stone-400">આઇકોન:</label>
                        <select 
                          value={tempProdImg} 
                          onChange={e => setTempProdImg(e.target.value)}
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1 text-xs focus:outline-none"
                        >
                          <option value="🔨">🔨 હથોડી (Craft)</option>
                          <option value="🛡️">🛡️ રક્ષણ (Shield)</option>
                          <option value="💈">💈 સલૂન (Salon)</option>
                          <option value="🚗">🚗 કાર (Auto)</option>
                          <option value="💇">💇 હેરકટ (Barber)</option>
                          <option value="🔌">🔌 વાયરિંગ (Electric)</option>
                          <option value="📊">📊 ગ્રોથ (Chart)</option>
                          <option value="💼">💼 વ્યવસાય (Bag)</option>
                          <option value="🍲">🍲 રસોઈ (Food)</option>
                          <option value="🩺">🩺 ડોક્ટર (Medical)</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleAddProduct} 
                        className="bg-primary text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer active:scale-95 hover:bg-primary/95 transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AccordionItem>

          {/* Section 5: Gallery */}
          <AccordionItem 
            id="gallery" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="ફોટો અને પ્રદર્શન ગેલેરી (Photo Gallery)" 
            num="૫" 
            icon="photo_library"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-stone-555 dark:text-stone-450">તમારા ઉત્તમ કામના ફોટા કે આલ્બમ પ્રદર્શન વિગત લખો (મહત્તમ ૬):</p>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{gallery.length} / ૬ ઉમેરેલ</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((g, idx) => (
                  <div key={g.id} className="bg-stone-55 bg-opacity-40 dark:bg-stone-900/30 border border-stone-150 dark:border-stone-850 rounded-2xl p-3.5 text-center relative flex flex-col items-center justify-center min-h-18">
                    <span className="text-2xl">{g.icon}</span>
                    <p className="text-[10px] text-stone-600 dark:text-stone-350 font-black mt-1.5 truncate w-full font-gujarati">{g.label}</p>
                    <button 
                      onClick={() => setGallery(gallery.filter(item => item.id !== g.id))} 
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>
                  </div>
                ))}
              </div>

              {gallery.length < 6 && (
                <div className="bg-stone-55 bg-opacity-10 dark:bg-stone-900/20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-5 space-y-4">
                  <h4 className="font-gujarati font-black text-xs text-primary dark:text-amber-450 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm font-bold">add_photo_alternate</span>
                    નવી ગેલેરી આઇટમ ઉમેરો
                  </h4>
                  
                  <FormInput 
                    label="ગેલેરી ફોટો લેબલ *" 
                    value={tempGallLabel} 
                    onChange={e => setTempGallLabel(e.target.value)} 
                    placeholder="દા.ત. નિકોલ સાઇટ પર કામગીરી"
                  />

                  <div className="space-y-2">
                    <label className="font-bold text-xs text-stone-500 dark:text-stone-400">ઝડપી સેટિંગ્સ:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {GALLERY_PRESETS.map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setTempGallLabel(preset.label);
                            setTempGallIcon(preset.icon);
                          }}
                          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 hover:border-primary/30 rounded-xl px-3 py-1.5 text-[10px] text-on-surface dark:text-stone-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/10 active:scale-95 transition-all flex items-center gap-1 cursor-pointer font-gujarati"
                        >
                          <span>{preset.icon}</span>
                          <span>{preset.label.substring(0, 5)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-stone-200/50 dark:border-stone-850/50">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-xs text-stone-500 dark:text-stone-400">આઇકોન:</label>
                      <select 
                        value={tempGallIcon} 
                        onChange={e => setTempGallIcon(e.target.value)}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1 text-xs focus:outline-none"
                      >
                        <option value="📸">📸 કેમેરા (Photo)</option>
                        <option value="🏢">🏢 બિલ્ડિંગ (Office)</option>
                        <option value="🤝">🤝 વિશ્વાસ (Handshake)</option>
                        <option value="🏆">🏆 પુરસ્કાર (Award)</option>
                        <option value="⚙️">⚙️ મશીનરી (Work)</option>
                        <option value="🌟">🌟 રેટિંગ (Star)</option>
                        <option value="🏠">🏠 ઘર (Home)</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleAddGallery} 
                      className="bg-primary text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer active:scale-95 hover:bg-primary/95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો
                    </button>
                  </div>
                </div>
              )}
            </div>
          </AccordionItem>

          {/* Section 6: Publish */}
          <AccordionItem 
            id="share" 
            activeId={activeAccordion} 
            setActiveId={setActiveAccordion} 
            title="પબ્લિશ કરો અને શેર કરો (Publish & Share Links)" 
            num="૬" 
            icon="rocket_launch"
          >
            <div className="space-y-4">
              <p className="text-xs text-stone-600 dark:text-stone-450 leading-relaxed font-gujarati">
                આ લિંક તદ્દન મફત છે! નીચેના બટનથી લિંક કોપી કરી તમારા ગ્રાહકો, WhatsApp Status, કે વ્યવસાયિક ગ્રુપોમાં સહેલાઈથી મોકલી શકો છો.
              </p>
              
              <div className="bg-gradient-to-br from-[#1c0a00] to-[#3b1a00] text-stone-100 rounded-2.5xl p-5 border border-amber-500/20 space-y-4">
                <div className="flex items-center gap-2 text-amber-300">
                  <span className="material-symbols-outlined font-bold">info</span>
                  <span className="font-gujarati font-black text-xs uppercase tracking-wider">ઝીરો સ્ટોરેજ કોસ્ટ મોડેલ</span>
                </div>
                <p className="text-[11px] text-amber-100/70 leading-relaxed font-gujarati">
                  તમારો ડેટા લિંકની અંદર જ સુરક્ષિત રીતે સેવ થઈ જાય છે, જેથી ભવિષ્યમાં પણ લિંક ક્યારેય બંધ નહીં થાય અને લાઈફ-ટાઈમ ફ્રી ચાલુ રહેશે!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={copyShareLink}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">content_copy</span>
                  લિંક કોપી કરો (Copy URL)
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">share</span>
                  WhatsApp પર શેર કરો
                </button>
              </div>
            </div>
          </AccordionItem>
          
        </div>

        {/* Right Side Live Preview Mockup */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-gujarati font-black text-sm text-stone-500 uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold">phone_iphone</span>
                લાઇવ પ્રીવ્યૂ (Live View)
              </h4>
              <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase animate-pulse">✓ Live Mockup</span>
            </div>

            {/* Mobile View Mockup Box */}
            <div className={`w-full max-w-sm mx-auto border-8 border-stone-850 dark:border-stone-800 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[580px] ${activeTheme.bg} ${activeTheme.text} transition-colors duration-700 p-4`}>
              
              {/* Camera Notch simulation */}
              <div className="h-4 w-28 bg-stone-850 dark:bg-stone-800 rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-20"></div>

              {/* Accent Glow Circle inside Preview */}
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full blur-[50px] opacity-25 pointer-events-none" style={{ backgroundColor: customColor }}></div>

              {/* Inner content scroll area */}
              <div className="w-full flex-1 overflow-y-auto space-y-5 pt-6 pb-4 px-1 scrollbar-hide">
                <CardContent data={renderedData} activeTheme={activeTheme} isPreview={true} downloadVcf={downloadVcf} navigate={navigate} />
              </div>

              {/* Mockup Powered Footer */}
              <div className="w-full border-t border-white/5 pt-2 text-center text-[8px] opacity-60">
                Powered by: <a href="https://gujaratiapp.in" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-400">gujaratiapp.in</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalCard;
