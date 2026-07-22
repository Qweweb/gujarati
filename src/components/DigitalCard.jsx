import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LZString from 'lz-string';
import { motion, AnimatePresence } from 'framer-motion';


const gujToEngMap = {
  'અ':'a','આ':'aa','ઇ':'i','ઈ':'ii','ઉ':'u','ઊ':'uu','એ':'e','ઐ':'ai','ઓ':'o','ઔ':'au',
  'ક':'k','ખ':'kh','ગ':'g','ઘ':'gh','ચ':'ch','છ':'chh','જ':'j','ઝ':'z','ટ':'t','ઠ':'th',
  'ડ':'d','ઢ':'dh','ણ':'n','ત':'t','થ':'th','દ':'d','ધ':'dh','ન':'n','પ':'p','ફ':'f',
  'બ':'b','ભ':'bh','મ':'m','ય':'y','ર':'r','લ':'l','વ':'v','શ':'sh','ષ':'sh','સ':'s',
  'હ':'h','ળ':'l','ક્ષ':'ksh','જ્ઞ':'gn',
  'ા':'a','િ':'i','ી':'i','ુ':'u','ૂ':'u','ે':'e','ૈ':'ai','ો':'o','ૌ':'au','ં':'n','ઃ':'h','ૃ':'ru','્':''
};

const transliterateGujarati = (str) => {
  if (!str) return '';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    result += gujToEngMap[char] !== undefined ? gujToEngMap[char] : char;
  }
  return result;
};

// Compressed URL-safe Encoding/Decoding using lz-string

const encodeCardData = (data) => {
  try {
    // 1. Strip all empty fields to save space
    const cleanData = {};
    for (const key in data) {
      const v = data[key];
      if (v !== null && v !== "" && v !== undefined) {
        if (Array.isArray(v) && v.length === 0) continue;
        // Check for empty products inside array
        if (key === 'products' && Array.isArray(v)) {
            const validP = v.filter(p => p.name || p.price);
            if (validP.length > 0) cleanData[key] = validP;
            continue;
        }
        if (key === 'gallery' && Array.isArray(v)) {
            const validG = v.filter(g => g.label);
            if (validG.length > 0) cleanData[key] = validG;
            continue;
        }
        cleanData[key] = v;
      }
    }
    const jsonStr = JSON.stringify(cleanData);
    // compressToEncodedURIComponent generates a highly compressed URL-safe string
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

const decodeCardData = (encodedData) => {
  try {
    // Attempt LZString decompression first
    let jsonStr = LZString.decompressFromEncodedURIComponent(encodedData);
    
    // Fallback if it's the old uncompressed base64 format
    if (!jsonStr) {
      let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
      jsonStr = decodeURIComponent(escape(atob(paddedBase64)));
    }
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Decoding error", e);
    return null;
  }
};

// 15 Elite Premium Themes Configuration

const PATTERNS = [
  { id: 'none', label: 'કોઈ નહીં (None)', bg: 'none' },
  { 
    id: 'mandala', 
    label: 'મંડલા (Mandala)', 
    bg: 'url("data:image/svg+xml,%3Csvg width=\'300\' height=\'300\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'100\' cy=\'0\' r=\'80\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-dasharray=\'4 4\' stroke-opacity=\'0.1\'/%3E%3Ccircle cx=\'100\' cy=\'0\' r=\'60\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.1\'/%3E%3Ccircle cx=\'100\' cy=\'0\' r=\'40\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'4\' stroke-opacity=\'0.05\'/%3E%3Cpath d=\'M100,0 Q80,20 60,0 Z\' fill=\'%23ffffff\' fill-opacity=\'0.08\'/%3E%3Cpath d=\'M100,0 Q60,20 100,20 Z\' fill=\'%23ffffff\' fill-opacity=\'0.08\'/%3E%3C/svg%3E")', 
    size: '300px',
    position: 'top right',
    repeat: 'no-repeat'
  },
  { 
    id: 'keri', 
    label: 'કેરી (Keri)', 
    bg: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M50,90 C20,90 10,60 10,40 C10,15 35,10 50,20 C65,30 80,10 90,30 C100,50 80,90 50,90 Z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'3\' stroke-opacity=\'0.07\'/%3E%3Cpath d=\'M50,80 C30,80 25,55 25,40 C25,25 40,20 50,30 C60,40 70,25 75,35 C80,45 70,80 50,80 Z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.1\' stroke-dasharray=\'4 4\'/%3E%3Ccircle cx=\'50\' cy=\'60\' r=\'8\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")', 
    size: '150px',
    position: 'bottom -20px right -20px',
    repeat: 'no-repeat'
  },
  { 
    id: 'bandhani', 
    label: 'બાંધણી (Bandhani)', 
    bg: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'100%25\' viewBox=\'0 0 80 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1.5\' stroke-opacity=\'0.1\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'4\'/%3E%3Ccircle cx=\'20\' cy=\'60\' r=\'4\'/%3E%3Ccircle cx=\'20\' cy=\'100\' r=\'4\'/%3E%3Ccircle cx=\'20\' cy=\'140\' r=\'4\'/%3E%3Ccircle cx=\'20\' cy=\'180\' r=\'4\'/%3E%3C/g%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'60\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'100\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'140\' r=\'1.5\'/%3E%3Ccircle cx=\'20\' cy=\'180\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")', 
    size: '80px 100%',
    position: 'left top',
    repeat: 'repeat-y'
  },
  { 
    id: 'toran', 
    label: 'તોરણ (Toran)', 
    bg: 'url("data:image/svg+xml,%3Csvg width=\'120\' height=\'40\' viewBox=\'0 0 120 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,0 L20,30 L40,0 L60,30 L80,0 L100,30 L120,0 Z\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'1\' stroke-opacity=\'0.15\'/%3E%3Ccircle cx=\'20\' cy=\'35\' r=\'2.5\' fill=\'%23ffffff\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'60\' cy=\'35\' r=\'2.5\' fill=\'%23ffffff\' fill-opacity=\'0.2\'/%3E%3Ccircle cx=\'100\' cy=\'35\' r=\'2.5\' fill=\'%23ffffff\' fill-opacity=\'0.2\'/%3E%3C/svg%3E")', 
    size: '120px 40px',
    position: 'top left',
    repeat: 'repeat-x'
  }
];

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

// Business type presets — auto-set layout + theme + category/tagline
const BUSINESS_PRESETS = [
  {
    id: 'restaurant',
    emoji: '🍽️',
    label: 'રેસ્ટોરન્ટ / કેફે',
    labelEn: 'Restaurant / Cafe',
    layout: 'shop',
    theme: 'wooden',
    category: 'રેસ્ટોરન્ટ અને ફૂડ સર્વિસ',
    tagline: 'સ્વાદ, સ્નેહ અને સ્વાસ્થ્ય — અમારી દરેક ડીશમાં.',
    color: '#a16207',
  },
  {
    id: 'realestate',
    emoji: '🏠',
    label: 'રિયલ એસ્ટેટ',
    labelEn: 'Real Estate',
    layout: 'split',
    theme: 'royal',
    category: 'રિયલ એસ્ટેટ કન્સલ્ટન્ટ',
    tagline: 'ઘર ખરીદી અને વેચાણ — ઝડપ, વિશ્વાસ, ઉત્તમ ભાવ.',
    color: '#b45309',
  },
  {
    id: 'astrology',
    emoji: '🔮',
    label: 'જ્યોતિષ / વાસ્તુ',
    labelEn: 'Astrologer / Vastu',
    layout: 'classic',
    theme: 'crimson',
    category: 'જ્યોતિષ અને વાસ્તુ સલાહકાર',
    tagline: 'ગ્રહ-નક્ષત્ર અને ઘરની ઊર્જા — જ્ઞાન, ઉકેલ, શ્રદ્ધા.',
    color: '#be185d',
  },
  {
    id: 'doctor',
    emoji: '🩺',
    label: 'ડૉક્ટર / ક્લિનિક',
    labelEn: 'Doctor / Clinic',
    layout: 'split',
    theme: 'ocean',
    category: 'મેડિકલ પ્રોફેશનલ',
    tagline: 'આરોગ્ય, સ્વાસ્થ્ય અને સ્નેહ — અમારી પ્રાથમિકતા.',
    color: '#0891b2',
  },
  {
    id: 'ca_lawyer',
    emoji: '⚖️',
    label: 'CA / વકીલ',
    labelEn: 'CA / Lawyer',
    layout: 'split',
    theme: 'carbon',
    category: 'ચાર્ટર્ડ એકાઉન્ટન્ટ / એડ્વોકેટ',
    tagline: 'કર, કાયદો, અને ન્યાય — ચોક્કસ, ઝડપ, ભરોસો.',
    color: '#1c1917',
  },
  {
    id: 'shop',
    emoji: '🛒',
    label: 'દુકાન / ફેક્ટરી',
    labelEn: 'Shop / Factory',
    layout: 'shop',
    theme: 'forest',
    category: 'રિટેઇલ અને મેન્યુફૅક્ચરિંગ',
    tagline: 'ગુણવત્તા, ભાવ, અને સેવા — ૧ ક્લિકે ઓર્ડર કરો.',
    color: '#166534',
  },
  {
    id: 'beauty',
    emoji: '💄',
    label: 'બ્યૂટી / સૅલૂન',
    labelEn: 'Beauty / Salon',
    layout: 'glass',
    theme: 'rose',
    category: 'બ્યૂટી અને ગ્રૂમિંગ સ્ટુડિઓ',
    tagline: 'સૌંદર્ય, ક્રિએટિવ સ્ટાઇલ અને ગ્લૅમ — ફક્ત તમારા માટે.',
    color: '#e11d48',
  },
  {
    id: 'transport',
    emoji: '🚛',
    label: 'ટ્રાન્સપોર્ટ / ટ્રૅવેલ',
    labelEn: 'Transport / Travel',
    layout: 'classic',
    theme: 'teal',
    category: 'ટ્રાન્સપોર્ટ અને ટ્રૅવેલ સર્વિસ',
    tagline: 'સુરક્ષિત, ઝડપ, સસ્તા ભાવ — ૨૪/૭ ઉપલબ્ધ.',
    color: '#0d9488',
  },
  {
    id: 'ayurveda',
    emoji: '🌿',
    label: 'આયુર્વેદ / ઓર્ગેનિક',
    labelEn: 'Ayurveda / Organic',
    layout: 'classic',
    theme: 'sanskari',
    category: 'આયુર્વેદ પ્રૅક્ટિશ્નર',
    tagline: 'પ્રકૃતિ, આરોગ્ય અને ઔષધ — પ્રાકૃતિક ઉકેલ.',
    color: '#16a34a',
  },
  {
    id: 'architect',
    emoji: '🏗️',
    label: 'ઇન્ટ...ડિઝાઇન / Civil',
    labelEn: 'Interior / Civil Engineer',
    layout: 'glass',
    theme: 'minimal',
    category: 'ઇન્ટિરિઅર ડિઝાઇનર અને Civil Engineer',
    tagline: 'ઘર, ઑફિસ, ફ્લૅટ — ડ્રીમ ડિઝાઇન અમારા હાથમાં.',
    color: '#374151',
  },
  {
    id: 'it',
    emoji: '💻',
    label: 'IT / ડિઝિટલ સર્વિસ',
    labelEn: 'IT / Digital Services',
    layout: 'split',
    theme: 'neon',
    category: 'IT સોલ્યુશન અને ડિઝિટલ સર્વિસ',
    tagline: 'વેબ, ઍપ, SEO — ટ‍ેક્નૉલૉજી વડે ઝડપ.',
    color: '#7c3aed',
  },
  {
    id: 'farmer',
    emoji: '🌾',
    label: 'ખેડૂત / ઍગ્રો',
    labelEn: 'Farmer / Agro',
    layout: 'shop',
    theme: 'forest',
    category: 'ખેડૂત અને ઍગ્રો બિઝનેસ',
    tagline: 'સ્વચ્છ ઉત્પાદન, ઉચ્ચ ગુણ — ખેતરથી ઘર સુધી.',
    color: '#15803d',
  },
];

const LAYOUT_STYLES = [
  { id: 'classic', name: 'ક્લાસિક સેન્ટર્ડ (Classic)', icon: 'format_align_center', desc: 'પ્રોફાઇલ અને માહિતી બધું વચ્ચે આકર્ષક રીતે સેટ થાય છે.' },
  { id: 'split', name: 'પ્રોફેશનલ સ્પ્લિટ (Left Split)', icon: 'format_align_left', desc: 'ડાબી બાજુ લોગો અને જમણી બાજુ નામ સેટ થાય છે, જે ફોર્મલ લુક આપે છે.' },
  { id: 'glass', name: 'ગ્લાસી કવર (Glass Banner)', icon: 'layers', desc: 'બેકગ્રાઉન્ડ કવર બેનર અને કાચ જેવા સુંદર ફ્લોટિંગ બોક્સ બને છે.' },
  { id: 'shop', name: 'સેવા અને કેટલોગ ગ્રીડ (Shop Grid)', icon: 'grid_view', desc: 'દુકાનદાર માટે પ્રોડક્ટ કેટલોગને આગળ રાખતી આધુનિક ૨-કોલમ ગ્રીડ ડિઝાઇન.' },
  { id: 'minimal', name: 'મિનિમલ બાયો લિન્ક (Minimal Bio)', icon: 'link', desc: 'લિંકટ્રી જેવું સાદું અને સુંદર કાર્ડ જેમાં મોટી બટન પટ્ટીઓ સેટ થાય છે.' }
];

const CARD_LANG = {
  gu: {
    serviceProvider: "સેવા પ્રદાતા",
    serviceVendor: "સેવા વિક્રેતા",
    saveContact: "કોન્ટેક્ટ સેવ",
    saveContactLong: "કોન્ટેક્ટ સેવ કરો",
    saveContactWithSave: "કોન્ટેક્ટ સેવ કરો (Save)",
    saveContactWithSaveLong: "કોન્ટેક્ટ સેવ કરો (Save Contact)",
    ourProductsServices: "અમારી પ્રોડક્ટ્સ & સેવાઓ",
    catalogList: "કેટલોગ લિસ્ટ",
    gallery: "ગેલેરી",
    photoGallery: "ફોટો ગેલેરી",
    officeWorkGallery: "ઓફિસ / કામ પ્રદર્શન",
    servicePrice: "સેવા અને કિંમત",
    ourServicesCatalog: "અમારી સેવાઓ / કેટલોગ",
    ourServices: "અમારી સેવાઓ",
    quickPayment: "ઝડપી ચૂકવણી",
    inquiry: "પૂછપરછ",
    call: "કૉલ",
    location: "લોકેશન",
    mail: "મેઇલ",
    website: "વેબસાઇટ",
    whatsappText: "હું આપની મિની-વેબસાઇટ જોઈને પૂછપરછ માટે સંપર્ક કરી રહ્યો છું.",
    whatsappCatalogText: "હું આપના ડિજિટલ કેટલોગમાંથી આના વિશે વિગત જાણવા માંગુ છું: "
  },
  en: {
    serviceProvider: "Service Provider",
    serviceVendor: "Service Provider",
    saveContact: "Save Contact",
    saveContactLong: "Save Contact",
    saveContactWithSave: "Save Contact",
    saveContactWithSaveLong: "Save Contact",
    ourProductsServices: "Our Products & Services",
    catalogList: "Catalog List",
    gallery: "Gallery",
    photoGallery: "Photo Gallery",
    officeWorkGallery: "Office / Work Showcase",
    servicePrice: "Service & Pricing",
    ourServicesCatalog: "Our Services / Catalog",
    ourServices: "Our Services",
    quickPayment: "Quick Payment",
    inquiry: "Inquire",
    call: "Call",
    location: "Location",
    mail: "Mail",
    website: "Website",
    whatsappText: "Hi, I am contacting you after viewing your digital business card.",
    whatsappCatalogText: "Hi, I am interested in this product/service from your catalog: "
  }
};

const CardContent = ({ data, activeTheme, isPreview, downloadVcf, navigate, onLangChange }) => {
  const [lang, setLangState] = useState(() => {
    const hasEnglish = /[a-zA-Z]/.test(data.businessName || data.name || '');
    const initial = hasEnglish ? 'en' : 'gu';
    if (onLangChange) onLangChange(initial);
    return initial;
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    if (onLangChange) onLangChange(newLang);
  };

  const customColor = data.customColor || '#f97316';
  const layout = data.layoutStyle || 'classic';

  const labels = CARD_LANG[lang];

  // If actions are empty during preview/fallback, show some defaults
  const SOCIAL_ICONS = {
    facebook: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14-2.936 0-4.643 1.76-4.643 4.88v3.62H7.5v4h2.5v9h4v-9z"/></svg>,
    instagram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.169a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    linkedin: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    twitter: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    youtube: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    whatsapp: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.79 9.79 0 00-6.977-2.889C6.2 1.15 1.776 5.52 1.772 10.951c0 1.708.455 3.378 1.32 4.858L1.92 20.73l5.064-1.317zM17.66 14.86c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.16-.72.16-.22.32-.84 1.04-1.03 1.25-.19.22-.39.24-.71.08-3.13-1.56-4.37-2.85-5.15-4.2-.21-.36-.02-.55.14-.71.15-.14.32-.37.48-.56.16-.18.21-.3.32-.51.11-.22.05-.41-.03-.57-.08-.16-.72-1.73-.99-2.38-.26-.63-.53-.55-.72-.56l-.62-.01c-.2 0-.53.07-.8.37-.28.3-1.07 1.05-1.07 2.56s1.09 2.97 1.24 3.17c.15.2 2.15 3.28 5.21 4.6 2.55 1.1 3.07.88 3.63.83.56-.05 1.81-.74 2.06-1.45.25-.72.25-1.33.18-1.45-.08-.12-.3-.22-.62-.38z"/></svg>
  };

  // Common quick click buttons
  const quickActions = [
    { icon: 'call', href: `tel:${data.phone}`, label: labels.call, val: data.phone },
    { icon: 'chat', svg: SOCIAL_ICONS.whatsapp, href: `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(labels.whatsappText)}`, label: 'WhatsApp', val: data.whatsapp },
    { icon: 'pin_drop', href: data.locationLink, label: labels.location, val: data.locationLink },
    { icon: 'mail', href: `mailto:${data.email}`, label: labels.mail, val: data.email },
    { icon: 'language', href: data.website, label: labels.website, val: data.website }
  ].filter(action => action.val && action.val !== '9825XXXXXX' && action.val !== 'sharma.fab@gmail.com');

  const socialActions = [
    { svg: SOCIAL_ICONS.facebook, href: data.facebook, label: 'Facebook', val: data.facebook },
    { svg: SOCIAL_ICONS.instagram, href: data.instagram, label: 'Instagram', val: data.instagram },
    { svg: SOCIAL_ICONS.linkedin, href: data.linkedin, label: 'LinkedIn', val: data.linkedin },
    { svg: SOCIAL_ICONS.twitter, href: data.twitter, label: 'X.com', val: data.twitter },
    { svg: SOCIAL_ICONS.youtube, href: data.youtube, label: 'YouTube', val: data.youtube }
  ].filter(action => action.val && !action.val.includes('.com/example') && !action.val.includes('.com/@example') && !action.val.includes('.com/in/example'));

  const visibleActions = quickActions.length > 0 ? quickActions : [
    { icon: 'call', href: `tel:${data.phone}`, label: labels.call },
    { icon: 'chat', svg: SOCIAL_ICONS.whatsapp, href: `https://api.whatsapp.com/send?phone=91${data.whatsapp}`, label: 'WhatsApp' },
    { icon: 'pin_drop', href: data.locationLink || 'https://maps.google.com', label: labels.location },
    { icon: 'mail', href: `mailto:${data.email}`, label: labels.mail },
    { icon: 'language', href: data.website || 'https://google.com', label: labels.website }
  ];
  const langToggle = (
    <div className="absolute right-0 -top-2 z-40 flex items-center bg-black/10 dark:bg-white/10 backdrop-blur-md rounded-full p-0.5 border border-stone-250/20 dark:border-white/10 shadow-xs">
      <button
        onClick={(e) => { e.stopPropagation(); setLang('gu'); }}
        className={`px-2.5 py-0.5 rounded-full text-[9px] font-gujarati font-black transition-all cursor-pointer ${lang === 'gu' ? 'text-white' : 'opacity-60 text-current'}`}
        style={lang === 'gu' ? { backgroundColor: customColor } : {}}
      >
        ગુજ
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setLang('en'); }}
        className={`px-2.5 py-0.5 rounded-full text-[9px] font-gujarati font-black transition-all cursor-pointer ${lang === 'en' ? 'text-white' : 'opacity-60 text-current'}`}
        style={lang === 'en' ? { backgroundColor: customColor } : {}}
      >
        EN
      </button>
    </div>
  );

  switch (layout) {
    case 'split':
      return (
        <div className="space-y-5 text-left relative z-10 w-full">
          {langToggle}
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
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-white/10 shrink-0 p-1.5" style={{ color: customColor }}>
                  {btn.svg ? btn.svg : <span className="material-symbols-outlined text-sm font-bold">{btn.icon}</span>}
                </div>
                <span className="text-[10px] font-gujarati opacity-90 font-bold truncate">{btn.label}</span>
              </a>
            ))}
          </div>

          {/* Social Icons in Split */}
          {socialActions.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {socialActions.map((btn, i) => (
                <a 
                  key={`soc-split-${i}`} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center p-2 bg-white/10 dark:bg-black/20 border border-white/10 rounded-xl hover:scale-105 active:scale-95 transition-all"
                  style={{ color: customColor }}
                >
                  <div className="w-5 h-5">{btn.svg}</div>
                </a>
              ))}
            </div>
          )}


          {/* Address Display */}
          {data.address && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 text-left items-center mt-2">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: customColor }}>location_on</span>
              <div className="w-full min-w-0">
                <p className="font-gujarati text-[9px] opacity-80 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-3 rounded-xl font-gujarati font-black text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            {labels.saveContactLong}
          </button>

          {/* Catalog */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs uppercase tracking-wider opacity-60">{labels.ourProductsServices}</h3>
              <div className="space-y-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex justify-between items-center text-xs gap-3">
                    <div>
                      <h4 className="font-bold font-gujarati">{p.name}</h4>
                      <p className="text-[9px] opacity-70 truncate max-w-[180px]">{p.desc}</p>
                      <h5 className="font-black font-headline text-xs mt-0.5" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(labels.whatsappCatalogText + p.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-650 hover:bg-emerald-700 text-white h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm p-2"
                    >
                      {SOCIAL_ICONS.whatsapp}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs uppercase tracking-wider opacity-60">{labels.gallery}</h3>
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

          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

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
          {langToggle}
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
                className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all hover:scale-110 active:scale-90 shrink-0 p-2.5" 
                style={{ color: customColor }}
              >
                {btn.svg ? btn.svg : <span className="material-symbols-outlined text-base font-bold">{btn.icon}</span>}
              </a>
            ))}
          </div>

          {/* Social Actions in Glass */}
          {socialActions.length > 0 && (
            <div className="flex justify-center gap-3 mt-3">
              {socialActions.map((btn, i) => (
                <a 
                  key={`soc-glass-${i}`} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="h-10 w-10 p-2.5 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all hover:scale-110 active:scale-90 shrink-0" 
                  style={{ color: customColor }}
                >
                  {btn.svg}
                </a>
              ))}
            </div>
          )}


          {/* Address Display */}
          {data.address && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 text-left items-center mt-2">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: customColor }}>location_on</span>
              <div className="w-full min-w-0">
                <p className="font-gujarati text-[9px] opacity-80 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}

          {/* CTA Glass */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-3 rounded-2xl font-gujarati font-black text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 border border-white/10 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-sm font-bold">person_add</span>
            {labels.saveContactWithSave}
          </button>

          {/* Catalog Carousel-style grid */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] uppercase tracking-wider opacity-60 text-center">{labels.ourServices}</h3>
              <div className="grid grid-cols-1 gap-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/15 rounded-2.5xl p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-gujarati font-bold text-xs truncate">{p.name}</h4>
                      <p className="font-gujarati text-[9px] opacity-60 truncate">{p.desc}</p>
                      <h5 className="font-headline font-black text-xs mt-0.5" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(labels.whatsappCatalogText + p.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-650 hover:bg-emerald-700 text-white h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform p-2"
                    >
                      {SOCIAL_ICONS.whatsapp}
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

          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

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
          {langToggle}
          {/* Shopkeeper Fast Catalog Header */}
          <div className="space-y-1">
            <span className="bg-emerald-550/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">{data.category || labels.serviceVendor}</span>
            <h2 className="font-gujarati font-black text-xl tracking-tight leading-none mt-1">{data.businessName}</h2>
            <p className="font-gujarati text-[11px] opacity-75">{labels.serviceProvider}: {data.name}</p>
          </div>

          {/* Save Contact Card strip */}
          <div className="flex gap-2">
            <button
              onClick={() => downloadVcf(data)}
              className="flex-1 text-center py-2.5 rounded-xl font-gujarati font-black text-[10px] transition-all active:scale-98 shadow-xs flex items-center justify-center gap-1 text-white"
              style={{ backgroundColor: customColor }}
            >
              <span className="material-symbols-outlined text-xs font-bold">person_add</span>
              {labels.saveContact}
            </button>
            
            {/* Quick Actions (Call, WhatsApp, Maps) */}
            <div className="flex gap-1.5">
              {visibleActions.slice(0, 3).map((btn, i) => (
                <a 
                  key={i} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shrink-0 p-2" 
                  style={{ color: customColor }}
                  title={btn.label}
                >
                  {btn.svg ? btn.svg : <span className="material-symbols-outlined text-sm font-bold">{btn.icon}</span>}
                </a>
              ))}
            </div>
          </div>


          {/* Address Display */}
          {data.address && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 text-left items-center mt-2">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: customColor }}>location_on</span>
              <div className="w-full min-w-0">
                <p className="font-gujarati text-[9px] opacity-80 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}
          {/* Social Icons in Shop */}
          {socialActions.length > 0 && (
            <div className="grid grid-cols-5 gap-2 pt-1">
              {socialActions.map((btn, i) => (
                <a 
                  key={`soc-shop-${i}`} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center p-2 bg-white/10 border border-white/10 rounded-xl hover:scale-105 active:scale-95 transition-all"
                  style={{ color: customColor }}
                >
                  <div className="w-5 h-5">{btn.svg}</div>
                </a>
              ))}
            </div>
          )}

          {/* Product Catalog Grid (2 columns) */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-xs border-b pb-1 opacity-60">{labels.catalogList}</h3>
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
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(labels.whatsappCatalogText + p.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-650 hover:bg-emerald-700 text-white py-1 rounded-lg text-[8px] font-black text-center flex items-center justify-center gap-1 active:scale-95 p-1"
                    >
                      <div className="h-2.5 w-2.5 shrink-0 fill-current">{SOCIAL_ICONS.whatsapp}</div> {labels.inquiry}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery list */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-gujarati font-black text-xs opacity-60">{labels.officeWorkGallery}</h3>
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

          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

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
          {langToggle}
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
                  {btn.svg ? (
                    <div className="h-4 w-4 shrink-0" style={{ color: customColor }}>{btn.svg}</div>
                  ) : (
                    <span className="material-symbols-outlined text-sm font-bold" style={{ color: customColor }}>{btn.icon}</span>
                  )}
                  <span className="font-gujarati font-bold opacity-80">{btn.label}</span>
                </div>
                <span className="material-symbols-outlined text-[10px] opacity-40">arrow_forward</span>
              </a>
            ))}
          </div>


          {/* Address Display */}
          {data.address && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 text-left items-center mt-2">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: customColor }}>location_on</span>
              <div className="w-full min-w-0">
                <p className="font-gujarati text-[9px] opacity-80 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full py-2.5 rounded-xl font-gujarati font-black text-[10px] border active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor, borderColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            {labels.saveContactLong}
          </button>

          {/* Address Display Minimal */}
          {data.address && (
            <div className="flex gap-2 text-left items-start px-1 py-1">
              <span className="material-symbols-outlined text-xs shrink-0 mt-0.5" style={{ color: customColor }}>location_on</span>
              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="font-gujarati text-[8.5px] opacity-75 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}

          {/* Catalog simple list */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-b pb-0.5 uppercase tracking-wider opacity-55">{labels.servicePrice}</h3>
              <div className="space-y-1.5">
                {data.products.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] py-2 border-b border-white/5 gap-2">
                    {p.image && <img src={p.image} alt={p.name} className="h-8 w-8 rounded-md object-cover shrink-0" />}
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
          {langToggle}
          {/* Header Info */}
          <div className="space-y-3 pt-2">
            <div className="h-16 w-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-white/10 border border-white/20 overflow-hidden">
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                '🏬'
              )}
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
                <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shadow-xs p-2" style={{ color: customColor }}>
                  {btn.svg ? btn.svg : <span className="material-symbols-outlined text-base font-bold">{btn.icon}</span>}
                </div>
                <span className="text-[8px] font-gujarati opacity-75 font-semibold">{btn.label}</span>
              </a>
            ))}
          </div>
          {/* Social Icons */}
          {socialActions.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {socialActions.map((btn, i) => (
                <a 
                  key={`soc-${i}`} 
                  href={isPreview ? undefined : btn.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex flex-col items-center gap-1 hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shadow-xs p-2" style={{ color: customColor }}>
                    {btn.svg}
                  </div>
                  <span className="text-[8px] font-gujarati opacity-75 font-semibold">{btn.label}</span>
                </a>
              ))}
            </div>
          )}


          {/* Address Display */}
          {data.address && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2.5 text-left items-center mt-2">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: customColor }}>location_on</span>
              <div className="w-full min-w-0">
                <p className="font-gujarati text-[9px] opacity-80 leading-relaxed break-words">{data.address}</p>
              </div>
            </div>
          )}

          {/* Save Contact CTA */}
          <button
            onClick={() => downloadVcf(data)}
            className="w-full text-center py-2.5 rounded-xl font-gujarati font-black text-[10px] transition-all active:scale-98 shadow-xs flex items-center justify-center gap-1.5 text-white"
            style={{ backgroundColor: customColor }}
          >
            <span className="material-symbols-outlined text-xs font-bold">person_add</span>
            {labels.saveContactWithSaveLong}
          </button>



          {/* Product Catalog */}
          {data.products && data.products.length > 0 && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>{labels.ourServicesCatalog}</h3>
              <div className="grid grid-cols-2 gap-2">
                {data.products.map((p, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col gap-2 relative h-full">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-16 rounded-md object-cover" />}
                    <div className="flex flex-col flex-1 min-w-0 pb-6">
                      <h4 className="font-gujarati font-bold text-xs line-clamp-1">{p.name}</h4>
                      <p className="font-gujarati text-[9px] opacity-60 line-clamp-2 mt-0.5 leading-tight">{p.desc}</p>
                      <h5 className="font-headline font-black text-[10px] mt-1" style={{ color: customColor }}>{p.price}</h5>
                    </div>
                    <a
                      href={isPreview ? undefined : `https://api.whatsapp.com/send?phone=91${data.whatsapp}&text=${encodeURIComponent(labels.whatsappCatalogText + p.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2.5 right-2.5 bg-emerald-650 hover:bg-emerald-700 text-white h-6 w-6 rounded-md flex items-center justify-center shadow-xs transition-transform active:scale-90 z-10 p-1.5"
                    >
                      {SOCIAL_ICONS.whatsapp}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slider Gallery */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2 text-left" style={{ borderColor: customColor }}>{labels.photoGallery}</h3>
              <div className="grid grid-cols-2 gap-2">
                {data.gallery.map((g, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center space-y-1">
                    {g.image ? (
                      <img src={g.image} alt={g.label} className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <span className="text-xl">{g.icon}</span>
                    )}
                    <p className="font-gujarati text-[8px] opacity-80 truncate">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube Videos */}
          <YouTubeCarousel links={data.youtubeLinks} customColor={customColor} />

          {/* UPI Payment Section */}
          {data.upiId && (
            <div className="space-y-2 text-left">
              <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2" style={{ borderColor: customColor }}>{labels.quickPayment}</h3>
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


// Extract YouTube video ID from any YouTube URL
const getYouTubeId = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v') || null;
  } catch { return null; }
};

// YouTube Video Carousel for card viewer
const YouTubeCarousel = ({ links, customColor }) => {
  const validLinks = (links || []).filter(l => l && getYouTubeId(l));
  if (validLinks.length === 0) return null;
  return (
    <div className="space-y-2 w-full">
      <h3 className="font-gujarati font-black text-[10px] border-l-2 pl-2 text-left" style={{ borderColor: customColor }}>YouTube Videos</h3>
      <div
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {validLinks.map((link, idx) => {
          const vidId = getYouTubeId(link);
          return (
            <div
              key={idx}
              className="shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 shadow-lg"
              style={{ width: 'calc(100% - 2rem)', maxWidth: '280px' }}
            >
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${vidId}?rel=0&modestbranding=1`}
                  title={`YouTube video ${idx + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {validLinks.length > 1 && (
        <div className="flex justify-center gap-1 pt-1">
          {validLinks.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      )}
    </div>
  );
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

const DigitalCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // Route modes check
  const isViewer = Boolean(slug) || location.pathname === '/c' || location.pathname.startsWith('/c/');

  // Viewer State (loaded from URL)
  const [viewerData, setViewerData] = useState(null);
  const [currentLang, setCurrentLang] = useState('gu');

  // Card Creator Form States
  const [customSlug, setCustomSlug] = useState('');
  const [name, setName] = useState('આર્યન દેસાઈ');
  const [businessName, setBusinessName] = useState('એક્સેલન્સ ગ્લોબલ કન્સલ્ટન્સી');
  const [category, setCategory] = useState('બિઝનેસ સ્ટ્રેટેજિસ્ટ & ઇન્વેસ્ટર');
  const [tagline, setTagline] = useState('વૈશ્વિક કક્ષાનું માર્ગદર્શન અને એક્સક્લુઝિવ ગ્રોથ સ્ટ્રેટેજી.');
  const [phone, setPhone] = useState('9825XXXXXX');
  const [whatsapp, setWhatsapp] = useState('9825XXXXXX');
  const [email, setEmail] = useState('contact@excellenceglobal.in');
  const [address, setAddress] = useState('પ્રાઇડ કોર્પોરેટ પાર્ક, એસ.જી. હાઇવે, અમદાવાદ');
  const [locationLink, setLocationLink] = useState('https://maps.google.com');
  const [website, setWebsite] = useState('https://excellenceglobal.in');
  const [upiId, setUpiId] = useState('aryandesai@okaxis');
  const [upiName, setUpiName] = useState('Aryan Desai');
  const [facebook, setFacebook] = useState('facebook.com/example');
  const [instagram, setInstagram] = useState('instagram.com/example');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/example');
  const [twitter, setTwitter] = useState('x.com/example');
  const [youtubeLinks, setYoutubeLinks] = useState(['']);
  const [activeSocialTab, setActiveSocialTab] = useState('facebook');
  
  const [themeId, setThemeId] = useState('rust');
  const [customColor, setCustomColor] = useState('#f97316'); // Custom Accent
  const [bgPattern, setBgPattern] = useState('none');
  const [layoutStyle, setLayoutStyle] = useState('classic');
  const [profileImage, setProfileImage] = useState(null); // Layout Style State
  const [selectedPreset, setSelectedPreset] = useState(null); // Business preset
  const [currentStep, setCurrentStep] = useState(1);
  const [activeSheet, setActiveSheet] = useState(null); // Creator Wizard State

  const applyBusinessPreset = (preset) => {
    setSelectedPreset(preset.id);
    setLayoutStyle(preset.layout);
    setThemeId(preset.theme);
    setCategory(preset.category);
    setTagline(preset.tagline);
  };
  
  // Catalog items list
  const [products, setProducts] = useState([
    { id: 1, name: 'કોર્પોરેટ એડવાઇઝરી', price: 'કન્સલ્ટેશન દીઠ', desc: 'મોટા ઉદ્યોગો અને કંપનીઓ માટે સ્ટ્રેટેજિક પ્લાનિંગ.', image: null },
    { id: 2, name: 'વેલ્થ મેનેજમેન્ટ', price: 'એક્સક્લુઝિવ', desc: 'હાઈ નેટવર્થ ઇન્ડિવિડ્યુઅલ્સ માટે પ્રીમિયમ ઇન્વેસ્ટમેન્ટ પ્લાન.', image: null }
  ]);

  // Gallery items list
  const [gallery, setGallery] = useState([
    { id: 1, icon: '📸', label: 'ઇન્ટરનેશનલ બિઝનેસ સમિટ' },
    { id: 2, icon: '🏢', label: 'ગ્લોબલ એવોર્ડ સન્માન' },
    { id: 3, icon: '🏆', label: 'ફોર્બ્સ મેગેઝીન કવર' }
  ]);

  // Temporary Form additions
  const [tempProdName, setTempProdName] = useState('');
  const [tempProdPrice, setTempProdPrice] = useState('');
  const [tempProdDesc, setTempProdDesc] = useState('');
  const [tempProdImg, setTempProdImg] = useState(null);

  const [tempGallLabel, setTempGallLabel] = useState('');
  const [tempGallIcon, setTempGallIcon] = useState('📸');
  const [tempGallImg, setTempGallImg] = useState(null);

  const [editProductId, setEditProductId] = useState(null);
  const [editGalleryId, setEditGalleryId] = useState(null);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.6));
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      triggerLocalToast('📤 ગૅલેરી ફોટો અપલોડ...');
      const url = await uploadToCloudinary(file);
      setTempGallImg(url);
    } catch (err) {
      triggerLocalToast('❌ ફોટો અપલોડ નિષ્ફળ!');
    }
  };

  const handleProductFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      triggerLocalToast('📤 પ્રોડક્ટ ફોટો અપલોડ...');
      const url = await uploadToCloudinary(file);
      setTempProdImg(url);
    } catch (err) {
      triggerLocalToast('❌ ફોટો અપલોડ નિષ્ફળ!');
    }
  };

    const handleGetLocation = () => {
    if (navigator.geolocation) {
      triggerLocalToast("📍 લોકેશન મેળવાઈ રહ્યું છે...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationLink(`https://maps.google.com/?q=${latitude},${longitude}`);
          triggerLocalToast("✅ લોકેશન લિંક સેટ થઈ ગઈ!");
        },
        (error) => {
          triggerLocalToast("❌ લોકેશન મેળવવામાં નિષ્ફળ! કૃપા કરીને લોકેશન પરમિશન આપો.");
        }
      );
    } else {
      triggerLocalToast("❌ તમારું બ્રાઉઝર લોકેશન સપોર્ટ કરતું નથી.");
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      triggerLocalToast('📤 પ્રોફાઇલ ફોટો અપલોડ...');
      const url = await uploadToCloudinary(file);
      setProfileImage(url);
    } catch (err) {
      triggerLocalToast('❌ ફોટો અપલોડ નિષ્ફળ!');
    }
  };

  const [toastText, setToastText] = useState('');

  const triggerLocalToast = (msg) => {
    setToastText(msg);
    setTimeout(() => setToastText(''), 3000);
  };


  const hasLoadedDraft = useRef(false);

  // Auto-save logic
  useEffect(() => {
    if (!isViewer) {
      const saved = localStorage.getItem('digitalCardDraft');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.name) setName(d.name);
          if (d.businessName) setBusinessName(d.businessName);
          if (d.category) setCategory(d.category);
          if (d.tagline) setTagline(d.tagline);
          if (d.phone) setPhone(d.phone);
          if (d.whatsapp) setWhatsapp(d.whatsapp);
          if (d.email) setEmail(d.email);
          if (d.address) setAddress(d.address);
          if (d.locationLink) setLocationLink(d.locationLink);
          if (d.website) setWebsite(d.website);
          if (d.upiId) setUpiId(d.upiId);
          if (d.upiName) setUpiName(d.upiName);
          if (d.facebook) setFacebook(d.facebook);
          if (d.instagram) setInstagram(d.instagram);
          if (d.linkedin) setLinkedin(d.linkedin);
          if (d.twitter) setTwitter(d.twitter);
          if (d.youtubeLinks) setYoutubeLinks(d.youtubeLinks);
          else if (d.youtube && d.youtube !== 'youtube.com/@example') setYoutubeLinks([d.youtube]);
          if (d.themeId) setThemeId(d.themeId);
          if (d.customColor) setCustomColor(d.customColor);
          if (d.bgPattern) setBgPattern(d.bgPattern);
          if (d.products) setProducts(d.products);
          if (d.gallery) setGallery(d.gallery);
          if (d.layoutStyle) setLayoutStyle(d.layoutStyle);
          if (d.profileImage) setProfileImage(d.profileImage);
          if (d.currentStep) setCurrentStep(d.currentStep);
        } catch(e) {}
      }
      // Give state updates a moment to queue before allowing auto-saves
      setTimeout(() => {
        hasLoadedDraft.current = true;
      }, 500);
    }
  }, [isViewer]);

  useEffect(() => {
    if (!isViewer && hasLoadedDraft.current) {
      const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug, currentStep };
      localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    }
  }, [name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug, currentStep, isViewer]);

  const saveDraft = async () => {
    const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug };
    localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    
    triggerLocalToast("⏳ સેવ થઈ રહ્યું છે...");
    
    let currentSlug = localStorage.getItem('digitalCardSlug');
    // Clear old default slugs so they get a fresh generated one with the new logic
    // We won't clear 'card-xyz' anymore because that is our random slug pattern. Just clear 'card' and '-'
    if (currentSlug === 'card' || currentSlug === '-') {
      localStorage.removeItem('digitalCardSlug');
      currentSlug = null;
    }
    
    if (currentSlug) {
      // Update existing
      const { error } = await supabase.from('digital_cards').update({ data }).eq('slug', currentSlug);
      if (!error) {
        triggerLocalToast("💾 ડેટા સફળતાપૂર્વક અપડેટ થઈ ગયો છે!");
        return;
      }
    }
    
    // Create new
    let baseSlug = 'card';
    if (customSlug && customSlug.trim() !== '') {
      baseSlug = customSlug.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9\-]+/g, '').replace(/(^-|-$)+/g, '') || 'card';
    } else {
      baseSlug = 'card-' + Math.random().toString(36).substring(2, 8);
    }
    let finalSlug = baseSlug;
    let counter = 1;
    let isAvailable = false;
    
    while (!isAvailable) {
       const { data: existing } = await supabase.from('digital_cards').select('slug').eq('slug', finalSlug).maybeSingle();
       if (!existing) {
         isAvailable = true;
       } else {
         finalSlug = `${baseSlug}-${counter}`;
         counter++;
       }
    }
    
    const { data: inserted, error } = await supabase.from('digital_cards').insert([
       { slug: finalSlug, data: data }
    ]).select('slug').single();
    
    if (!error && inserted) {
       localStorage.setItem('digitalCardSlug', inserted.slug);
       triggerLocalToast("🚀 કાર્ડ સફળતાપૂર્વક પબ્લિશ થઈ ગયું છે!");
    } else {
       triggerLocalToast("❌ પબ્લિશ કરવામાં ભૂલ થઈ!");
       console.error(error);
    }
  };

  // Add items handler
  const handleAddProduct = () => {
    if (!tempProdName) return;
    const np = {
      id: editProductId || Date.now(),
      name: tempProdName,
      price: tempProdPrice || '₹ ૧૦૦',
      desc: tempProdDesc,
      image: tempProdImg
    };
    
    if (editProductId) {
      setProducts(products.map(p => p.id === editProductId ? np : p));
      triggerLocalToast("✅ પ્રોડક્ટ અપડેટ થઈ ગઈ!");
      setEditProductId(null);
    } else {
      setProducts([...products, np]);
      triggerLocalToast("➕ નવી પ્રોડક્ટ ઉમેરાઈ ગઈ!");
    }
    
    setTempProdName('');
    setTempProdPrice('');
    setTempProdDesc('');
    setTempProdImg(null);
  };

  const handleEditProduct = (p) => {
    setEditProductId(p.id);
    setTempProdName(p.name);
    setTempProdPrice(p.price === '₹ ૧૦૦' ? '' : p.price);
    setTempProdDesc(p.desc || '');
    setTempProdImg(p.image || null);
  };

  const handleAddGallery = () => {
    if (!tempGallLabel && !tempGallImg) return;
    const ng = {
      id: editGalleryId || Date.now(),
      label: tempGallLabel,
      image: tempGallImg,
      icon: tempGallIcon
    };
    
    if (editGalleryId) {
      setGallery(gallery.map(g => g.id === editGalleryId ? ng : g));
      triggerLocalToast("✅ ગેલેરી અપડેટ થઈ ગઈ!");
      setEditGalleryId(null);
    } else {
      setGallery([...gallery, ng]);
      triggerLocalToast("📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!");
    }
    
    setTempGallLabel('');
    setTempGallImg(null);
  };

  const handleEditGallery = (g) => {
    setEditGalleryId(g.id);
    setTempGallLabel(g.label);
    setTempGallImg(g.image || null);
    if(g.icon) setTempGallIcon(g.icon);
  };

  // On mount: If Viewer Mode, read URL hash parameters and load
  useEffect(() => {
    if (isViewer) {
      if (slug) {
        const fetchCard = async () => {
          const searchSlug = slug.replace(/[\s_]+/g, '-').toLowerCase();
          const { data, error } = await supabase.from('digital_cards').select('data').eq('slug', searchSlug).single();
          if (data && data.data) {
            const cardObj = data.data;
            const viewedSessionKey = `viewed_card_${searchSlug}`;
            const isNewView = !sessionStorage.getItem(viewedSessionKey);
            
            const updatedViews = (cardObj.views || 0) + (isNewView ? 1 : 0);
            const newCardObj = { ...cardObj, views: updatedViews };
            setViewerData(newCardObj);
            
            if (isNewView) {
              sessionStorage.setItem(viewedSessionKey, 'true');
              supabase.from('digital_cards').update({ data: newCardObj }).eq('slug', searchSlug).then(() => {});
            }
          } else {
            triggerLocalToast("❌ કાર્ડ મળ્યું નથી!");
            setViewerData({ name: 'Error', tagline: 'Card Not Found' });
          }
        };
        fetchCard();
      } else {
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
          name: 'આર્યન દેસાઈ',
          businessName: 'એક્સેલન્સ ગ્લોબલ કન્સલ્ટન્સી',
          category: 'બિઝનેસ સ્ટ્રેટેજિસ્ટ & ઇન્વેસ્ટર',
          tagline: 'વૈશ્વિક કક્ષાનું માર્ગદર્શન અને એક્સક્લુઝિવ ગ્રોથ સ્ટ્રેટેજી.',
          phone: '9988776655',
          whatsapp: '9988776655',
          email: 'contact@excellenceglobal.in',
          address: 'પ્રાઇડ કોર્પોરેટ પાર્ક, એસ.જી. હાઇવે, અમદાવાદ',
          locationLink: 'https://maps.google.com',
          website: 'https://excellenceglobal.in',
          upiId: 'aryandesai@okaxis',
          upiName: 'Aryan Desai',
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://x.com',
          youtube: 'https://youtube.com',
          themeId: 'rust',
          customColor: '#ea580c',
          bgPattern: 'none',
          products: [
            { id: 1, name: 'કોર્પોરેટ એડવાઇઝરી', price: 'કન્સલ્ટેશન દીઠ', desc: 'મોટા ઉદ્યોગો અને કંપનીઓ માટે સ્ટ્રેટેજિક પ્લાનિંગ.', image: null },
            { id: 2, name: 'વેલ્થ મેનેજમેન્ટ', price: 'એક્સક્લુઝિવ', desc: 'હાઈ નેટવર્થ ઇન્ડિવિડ્યુઅલ્સ માટે પ્રીમિયમ ઇન્વેસ્ટમેન્ટ પ્લાન.', image: null }
          ],
          gallery: [
            { id: 1, icon: '📸', label: 'ઇન્ટરનેશનલ બિઝનેસ સમિટ' },
            { id: 2, icon: '🏆', label: 'ગ્લોબલ એવોર્ડ સન્માન' }
          ],
          profileImage: null
        });
      }
    }
    }
  }, [isViewer, slug, location.hash]);

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
    const slug = localStorage.getItem('digitalCardSlug');
    if (slug) {
      return `https://gujaratiapp.in/card/${slug}`;
    }
    
    const cardData = {
      name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtubeLinks
    };
    const b64 = encodeCardData(cardData);
    return `https://gujaratiapp.in/c#d=${b64}`;
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


  // Theme configuration locator
  const activeTheme = THEMES.find(t => t.id === (isViewer ? viewerData?.themeId : themeId)) || THEMES[0];
  const activePattern = PATTERNS.find(p => p.id === (isViewer ? viewerData?.bgPattern : bgPattern)) || PATTERNS[0];
  const renderedData = isViewer ? viewerData : {
    name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, facebook, instagram, linkedin, twitter, youtubeLinks
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
      <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.text} transition-colors duration-700 py-8 px-4 flex flex-col items-center justify-between relative overflow-hidden`}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: activePattern?.bg !== 'none' ? activePattern?.bg : 'none', backgroundSize: activePattern?.size || 'auto', backgroundRepeat: activePattern?.repeat || 'no-repeat', backgroundPosition: activePattern?.position || 'center' }}></div>
        <div className="relative z-10 w-full flex flex-col items-center justify-between min-h-screen">
        {toastText && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md text-white font-gujarati text-xs px-5 py-3 rounded-2xl shadow-xl border border-amber-500/20">
            {toastText}
          </div>
        )}

        {/* Total Views Pill */}
        <div className="mb-4 bg-white/10 dark:bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-xs">visibility</span>
          <span>
            {currentLang === 'en' ? 'Total Views:' : 'કુલ વિઝિટર:'} {viewerData?.views || 0}
          </span>
        </div>

        {/* Card Body Mockup Frame */}
        <div className="max-w-md w-full bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden">
          {/* Pattern Background overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none rounded-[3rem] overflow-hidden opacity-50 mix-blend-overlay" style={{ backgroundImage: activePattern?.bg !== 'none' ? activePattern?.bg : 'none', backgroundSize: activePattern?.size || 'auto', backgroundRepeat: activePattern?.repeat || 'no-repeat', backgroundPosition: activePattern?.position || 'center' }}></div>

          {/* Accent Glow Circle */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full blur-[60px] opacity-20 pointer-events-none" style={{ backgroundColor: renderedData.customColor }}></div>
          
          <CardContent data={renderedData} activeTheme={activeTheme} isPreview={false} downloadVcf={downloadVcf} navigate={navigate} onLangChange={setCurrentLang} />
        </div>

        {/* Viral Growth Footer Link */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[10px] opacity-75">
            Powered by: <a href="https://gujaratiapp.in" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-500 transition-colors">gujaratiapp.in</a>
          </p>
          <button
            onClick={() => window.open('https://play.google.com/store/apps/details?id=in.gujaratiapp', '_blank')}
            className="bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-gujarati font-black px-4 py-2 rounded-full transition-all active:scale-95 cursor-pointer"
          >
            {currentLang === 'en' ? 'Create Free Digital Business Card ➔' : 'મફત ડિજિટલ બિઝનેસ કાર્ડ બનાવો ➔'}
          </button>
        </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CREATOR / BUILDER MODE RENDER
  // =========================================================================
  return (
    <div className="fixed inset-0 bg-stone-950 font-gujarati overflow-hidden flex flex-col z-[100]">
      {toastText && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-stone-900/90 backdrop-blur-md text-white font-gujarati text-xs px-5 py-3 rounded-2xl shadow-xl border border-amber-500/20">
          {toastText}
        </div>
      )}

      {/* Main Full-Screen Preview Area */}
      <div 
        className={`flex-1 overflow-y-auto overflow-x-hidden relative ${activeTheme.bg} ${activeTheme.text} transition-colors duration-700 pb-24`}
        onClick={() => setActiveSheet(null)}
      >
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: activePattern?.bg !== 'none' ? activePattern?.bg : 'none', backgroundSize: activePattern?.size || 'auto', backgroundRepeat: activePattern?.repeat || 'no-repeat', backgroundPosition: activePattern?.position || 'center' }}></div>
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full blur-[80px] opacity-25 pointer-events-none" style={{ backgroundColor: customColor }}></div>
        
        {/* Back Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/tools'); }}
          className="absolute top-4 left-4 z-40 h-10 w-10 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 active:scale-95"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>

        <div className="w-full max-w-lg mx-auto min-h-[90vh] pt-20 px-4 relative z-10"
             onClick={(e) => { 
                e.stopPropagation(); 
                if (!activeSheet) setActiveSheet('design'); 
             }}>
          <div className="pointer-events-none" style={{pointerEvents: 'auto'}}>
            <CardContent 
               data={renderedData} 
               activeTheme={activeTheme} 
               isPreview={true} 
               downloadVcf={downloadVcf} 
               navigate={navigate}
            />
          </div>
        </div>
        
        {/* Powered By Footer in Preview */}
        <div className="w-full border-t border-white/5 pt-4 pb-20 mt-10 text-center text-[10px] opacity-60">
            Powered by: <a href="https://gujaratiapp.in" target="_blank" rel="noreferrer" className="underline font-bold hover:text-amber-400">gujaratiapp.in</a>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/10 dark:bg-stone-900/90 backdrop-blur-xl border-t border-white/10 p-3 pb-safe-4 flex justify-between items-center px-6 text-white max-w-lg mx-auto rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <button onClick={() => setActiveSheet(activeSheet === 'design' ? null : 'design')} className={`flex flex-col items-center gap-1 transition-all ${activeSheet==='design'?'text-amber-400 scale-110':'text-white/70 hover:text-white'}`}>
           <span className="material-symbols-outlined text-2xl">palette</span>
           <span className="text-[10px] font-bold">ડિઝાઇન</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet === 'profile' ? null : 'profile')} className={`flex flex-col items-center gap-1 transition-all ${activeSheet==='profile'?'text-amber-400 scale-110':'text-white/70 hover:text-white'}`}>
           <span className="material-symbols-outlined text-2xl">person</span>
           <span className="text-[10px] font-bold">પ્રોફાઇલ</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet === 'catalog' ? null : 'catalog')} className={`flex flex-col items-center gap-1 transition-all ${activeSheet==='catalog'?'text-amber-400 scale-110':'text-white/70 hover:text-white'}`}>
           <span className="material-symbols-outlined text-2xl">storefront</span>
           <span className="text-[10px] font-bold">કેટલોગ</span>
        </button>
        <button onClick={() => setActiveSheet(activeSheet === 'publish' ? null : 'publish')} className={`flex flex-col items-center gap-1 transition-all ${activeSheet==='publish'?'text-amber-400 scale-110':'text-white/70 hover:text-white'}`}>
           <span className="material-symbols-outlined text-2xl">rocket_launch</span>
           <span className="text-[10px] font-bold">પબ્લિશ</span>
        </button>
      </div>

      {/* Bottom Sheets */}
      <AnimatePresence>
        {activeSheet && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-[76px] left-0 right-0 z-30 bg-white dark:bg-stone-900 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-stone-200 dark:border-stone-800 max-h-[75vh] min-h-[40vh] flex flex-col max-w-lg mx-auto overflow-hidden"
          >
            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-4 mb-2 shrink-0 cursor-pointer hover:bg-stone-400 transition-colors" onClick={() => setActiveSheet(null)}></div>
            
            <div className="overflow-y-auto px-5 py-2 pb-10 flex-1 hide-scrollbar">
              {activeSheet === 'design' && (
                <div className="text-stone-900 dark:text-stone-100">
                  <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">palette</span> ડિઝાઇન અને લેઆઉટ
              </h3>
              
{/* ── Business Type Quick Presets ── */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#78716c', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
                ⚡ ધંધો / વ્યવસાય પ્રમાણે Ready Design
              </p>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
                {BUSINESS_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyBusinessPreset(p)}
                    style={{
                      flexShrink: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      padding: '10px 14px',
                      borderRadius: 16,
                      border: selectedPreset === p.id ? `2px solid ${p.color}` : '2px solid #e7e5e4',
                      background: selectedPreset === p.id ? p.color + '15' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      minWidth: 72,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{p.emoji}</span>
                    <span style={{
                      fontSize: 9.5, fontWeight: 800, fontFamily: '"Noto Serif Gujarati",serif',
                      color: selectedPreset === p.id ? p.color : '#57534e',
                      textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap'
                    }}>{p.label}</span>
                    {selectedPreset === p.id && (
                      <span style={{ fontSize: 10, color: p.color, fontWeight: 900 }}>✓ સેટ</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedPreset && (
                <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 8, fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
                  ✅ {BUSINESS_PRESETS.find(p => p.id === selectedPreset)?.labelEn} — Layout + Theme + Category auto-set!
                </p>
              )}
            </div>

            {/* ── Manual Layout Style ── */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#78716c', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"Plus Jakarta Sans",sans-serif' }}>
              🎨 અથવા Manual Layout પસંદ કરો
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {LAYOUT_STYLES.map(l => (
                <button
                  key={l.id}
                  onClick={() => { setLayoutStyle(l.id); setSelectedPreset(null); }}
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

              <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-800 my-6"></div>
              
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
            <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-850 space-y-4">
              <div className="space-y-0.5">
                <label className="font-bold text-xs text-stone-600 dark:text-stone-300">બેકગ્રાઉન્ડ પેટર્ન (Background Pattern)</label>
                <p className="text-[10px] text-stone-400 dark:text-stone-500">કાર્ડના બેકગ્રાઉન્ડ માટે દેશી પેટર્ન પસંદ કરો.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setBgPattern(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${bgPattern === p.id ? 'bg-primary text-white shadow-md' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            </div>
                </div>
              )}
              {activeSheet === 'profile' && (
                <div className="text-stone-900 dark:text-stone-100">
                  <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">person</span> પ્રોફાઇલ અને સંપર્ક
              </h3>
              
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
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary/70">map</span>
                    ગૂગલ મેપ લોકેશન (Google Maps)
                  </label>
                  <button 
                    onClick={handleGetLocation} 
                    className="text-[9px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-colors flex items-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[10px]">my_location</span>
                    કરંટ લોકેશન મેળવો
                  </button>
                </div>
                <input
                  type="url"
                  value={locationLink}
                  onChange={e => setLocationLink(e.target.value)}
                  placeholder="અથવા અહીં લિંક પેસ્ટ કરો..."
                  className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-on-surface dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-stone-400"
                />
              </div>
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
                      <div className="space-y-1.5 w-full pt-2 border-t border-stone-100 dark:border-stone-850 mt-2">
              <label className="font-bold text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary/70">add_a_photo</span>
                લોગો અથવા પ્રોફાઇલ ફોટો (Logo / Profile Photo)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleProfileImageChange}
                className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
              {profileImage && (
                <div className="relative inline-block mt-2">
                  <img src={profileImage} className="h-16 w-16 rounded-xl object-cover border border-stone-200 shadow-sm" alt="Profile" />
                  <button onClick={() => setProfileImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] shadow-md hover:bg-rose-600 transition-colors">
                    <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                  </button>
                </div>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-850 space-y-4">
              <h4 className="font-bold text-xs text-stone-700 dark:text-stone-300">સોશિયલ મીડિયા લિંક્સ (Social Media Links)</h4>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'facebook', label: 'FB' },
                  { id: 'instagram', label: 'Insta' },
                  { id: 'linkedin', label: 'Linked' },
                  { id: 'twitter', label: 'X.com' },
                  { id: 'youtube', label: 'YouTube' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSocialTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSocialTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-100 dark:border-stone-850 mt-2">
                {activeSocialTab === 'facebook' && (
                  <FormInput label="Facebook Link" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..." type="url" />
                )}
                {activeSocialTab === 'instagram' && (
                  <FormInput label="Instagram Link" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." type="url" />
                )}
                {activeSocialTab === 'linkedin' && (
                  <FormInput label="LinkedIn Link" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/..." type="url" />
                )}
                {activeSocialTab === 'twitter' && (
                  <FormInput label="X.com (Twitter) Link" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://x.com/..." type="url" />
                )}
                {activeSocialTab === 'youtube' && (
                  <div className="space-y-2">
                    <label className="font-bold text-xs text-stone-600 dark:text-stone-300">YouTube Videos (મહત્તમ 5)</label>
                    {youtubeLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={link}
                          onChange={e => { const a = [...youtubeLinks]; a[idx] = e.target.value; setYoutubeLinks(a); }}
                          placeholder={`YouTube Link ${idx + 1}`}
                          className="w-full bg-stone-50 dark:bg-stone-900/40 border border-stone-250 dark:border-stone-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all text-on-surface dark:text-stone-100"
                        />
                        {youtubeLinks.length > 1 && (
                          <button onClick={() => setYoutubeLinks(youtubeLinks.filter((_, i) => i !== idx))} className="shrink-0 w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                    {youtubeLinks.length < 5 && (
                      <button onClick={() => setYoutubeLinks([...youtubeLinks, ''])} className="w-full py-2.5 rounded-xl border border-dashed border-amber-500/40 text-amber-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/5 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span> વધુ Video ઉમેરો
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            </div>
                </div>
              )}
              {activeSheet === 'catalog' && (
                <div className="text-stone-900 dark:text-stone-100">
                  <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">storefront</span> કેટલોગ અને ગેલેરી
              </h3>
              
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
                        {p.image && <img src={p.image} className="h-6 w-6 rounded-md object-cover shrink-0" alt="product" />}
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
                    <div className="space-y-2">
                      <label className="font-bold text-xs text-stone-500 dark:text-stone-400">પ્રોડક્ટનો ફોટો (Local Photo - વૈકલ્પિક):</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProductFileChange}
                        className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                      />
                      {tempProdImg && (
                        <img src={tempProdImg} className="h-16 rounded-lg object-cover mt-2 border border-stone-200" alt="Preview" />
                      )}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-stone-200/50 dark:border-stone-850/50">
                      <button 
                        onClick={handleAddProduct} 
                        className="bg-primary text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer active:scale-95 hover:bg-primary/95 transition-all flex items-center gap-1"
                      >
                        {editProductId ? <><span className="material-symbols-outlined text-sm font-bold">save</span> અપડેટ</> : <>{editGalleryId ? <><span className="material-symbols-outlined text-sm font-bold">save</span> અપડેટ</> : <><span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો</>}</>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

              <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-800 my-6"></div>
              
<div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-stone-555 dark:text-stone-450">તમારા ઉત્તમ કામના ફોટા કે આલ્બમ પ્રદર્શન વિગત લખો (મહત્તમ ૧૦):</p>
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{gallery.length} / ૧૦ ઉમેરેલ</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {gallery.map((g, idx) => (
                  <div key={g.id} className="bg-stone-55 bg-opacity-40 dark:bg-stone-900/30 border border-stone-150 dark:border-stone-850 rounded-2xl p-3.5 text-center relative flex flex-col items-center justify-center min-h-18">
                    {g.image ? (
                      <img src={g.image} alt={g.label} className="w-full h-20 object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">{g.icon}</span>
                    )}
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

              {gallery.length < 10 && (
                <div className="bg-stone-55 bg-opacity-10 dark:bg-stone-900/20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-5 space-y-4">
                  <h4 className="font-gujarati font-black text-xs text-primary dark:text-amber-450 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm font-bold">add_photo_alternate</span>
                    નવી ગેલેરી આઇટમ ઉમેરો
                  </h4>
                  
                  <FormInput 
                    label="ફોટો વિશે લખો (Optional)" 
                    value={tempGallLabel} 
                    onChange={e => setTempGallLabel(e.target.value)} 
                    placeholder="દા.ત. નિકોલ સાઇટ પર કામગીરી"
                  />

                                    <div className="space-y-2">
                    <label className="font-bold text-xs text-stone-500 dark:text-stone-400">સ્થાનિક ફોટો પસંદ કરો (Local Photo):</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                    {tempGallImg && (
                      <img src={tempGallImg} className="h-16 rounded-lg object-cover mt-2 border border-stone-200" alt="Preview" />
                    )}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-stone-200/50 dark:border-stone-850/50">
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

            </div>
                </div>
              )}
              {activeSheet === 'publish' && (
                <div className="text-stone-900 dark:text-stone-100">
                  <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">rocket_launch</span> પબ્લિશ કરો
              </h3>
              
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

              <div className="space-y-1 mt-6">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">કસ્ટમ લિંક (Custom URL) <span className="text-stone-400 font-normal lowercase">- અંગ્રેજીમાં લખો</span></label>
                <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500">
                  <span className="pl-4 pr-1 text-stone-400 text-sm">gujaratiapp.in/card/</span>
                  <input type="text" className="w-full bg-transparent px-2 py-3 text-sm text-stone-800 dark:text-stone-200 focus:outline-none" placeholder="excellence-global" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
                </div>
                <p className="text-[10px] text-stone-400">જો તમે આ ખાલી રાખશો, તો સિસ્ટમ જાતે જ રેન્ડમ લિંક (random url) બનાવી લેશે.</p>
              </div>

              <button
                onClick={saveDraft}
                className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span className="material-symbols-outlined text-sm font-bold">save</span>
                ડેટા સેવ કરો (Save Progress)
              </button>

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

            </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default DigitalCard;
