import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng, toBlob } from 'html-to-image';
import { downloadFile } from '../utils/downloadHelper';

// --- DATA ---
const THEMES = [
  { id: 'purple', name: 'ભક્તિ', bg: '#1a0a2e', text: '#e9d5ff', accent: '#a855f7' },
  { id: 'green', name: 'શાંતિ', bg: '#0a2e1a', text: '#dcfce7', accent: '#22c55e' },
  { id: 'saffron', name: 'ઊર્જા', bg: '#2e1500', text: '#ffedd5', accent: '#0D9488' },
  { id: 'white', name: 'સ્વચ્છ', bg: '#ffffff', text: '#1c1917', accent: '#d6d3d1' },
];

const CATEGORIES = [
  { id: 'bhakti', name: 'ભક્તિ', icon: 'volunteer_activism' },
  { id: 'morning', name: 'સવાર', icon: 'light_mode' },
  { id: 'night', name: 'રાત', icon: 'dark_mode' },
  { id: 'festival', name: 'તહેવાર', icon: 'celebration' },
  { id: 'prerna', name: 'પ્રેરણા', icon: 'psychology' },
  { id: 'health', name: 'આરોગ્ય', icon: 'local_florist' },
  { id: 'jyotish', name: 'જ્યોતિષ', icon: 'stars' },
  { id: 'sahitya', name: 'સાહિત્ય', icon: 'menu_book' },
];

const DEITIES = [
  { id: 'ganesh', name: 'શ્રી ગણેશ', img: '/gods/ganesh.png' },
  { id: 'krishna', name: 'શ્રી કૃષ્ણ', img: '/gods/vishnu-krishna.webp' },
  { id: 'shiv', name: 'શ્રી શિવ', img: '/gods/shiv.avif' },
  { id: 'ram', name: 'શ્રી રામ', img: '/gods/shri-raam.jpg' },
  { id: 'durga', name: 'મા દુર્ગા', img: '/gods/aadishakti-devi.webp' },
  { id: 'hanuman', name: 'હનુમાનજી', img: '/gods/hanuman.jpg' },
  { id: 'lakshmi', name: 'મા લક્ષ્મી', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Raja_Ravi_Varma%2C_Goddess_Lakshmi%2C_1896.jpg' },
  { id: 'saraswati', name: 'મા સરસ્વતી', img: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Saraswati.jpg' },
  { id: 'saibaba', name: 'સાંઈ બાબા', img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Shirdi_Sai_Baba_3.jpg' },
  { id: 'jalaram', name: 'જલારામ બાપા', img: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Jalaram_Bapa_Idol.JPG' },
  { id: 'swaminarayan', name: 'સ્વામિનારાયણ', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Lord_Swaminarayan_writing_the_Shikshapatri.jpg' },
  { id: 'nathji', name: 'શ્રી નાથજી', img: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Nathdwara_srinathji.jpg' },
];

const CATEGORY_QUOTES = {
  bhakti: [
    { text: "કર્મ કરો, ફળ ની ચિંતા ન કરો.", source: "શ્રીમદ્ ભગવદ્ ગીતા" },
    { text: "કાળ પણ તેનો શું બગાડી શકે, જે મહાકાલ નો ભક્ત હોય.", source: "શિવ પુરાણ" },
    { text: "રઘુકુલ રીતિ સદા ચલી આઈ, પ્રાણ જાય પર વચન ન જાઈ.", source: "રામાયણ" },
    { text: "યા દેવી સર્વભૂતેષુ શક્તિ-રૂપેણ સંસ્થિતા, નમસ્તસ્યૈ નમસ્તસ્યૈ નમસ્તસ્યૈ નમો નમઃ.", source: "માર્કંડેય પુરાણ" },
    { text: "વિઘ્નોને દૂર કરનાર, મંગળ મૂર્તિ ગજાનન, તમારા ચરણોમાં શત શત વંદન.", source: "શ્રી ગણેશ સ્તોત્ર" },
    { text: "ભૂત પિશાચ નિકટ નહિ આવૈ, મહાવીર જબ નામ સુનાવૈ.", source: "હનુમાન ચાલીસા" },
  ],
  morning: [
    { text: "સૂર્યોદય સાથે નવી આશાઓ પણ જાગે છે. તમારો દિવસ મંગલમય રહે.", source: "સુપ્રભાત" },
    { text: "દરેક સવાર એક નવી શરૂઆત છે, હસતા રહો અને આગળ વધતા રહો.", source: "શુભ સવાર" },
    { text: "ઈશ્વરની કૃપાથી આજનો દિવસ તમારા માટે આનંદ અને સફળતા લઈને આવે.", source: "સુ-પ્રભાત" },
  ],
  night: [
    { text: "દિવસભરના થાકને ભૂલી જાઓ અને મીઠી નીંદરમાં ખોવાઈ જાઓ.", source: "શુભ રાત્રિ" },
    { text: "ઈશ્વર તમને શાંતિપૂર્ણ ઊંઘ અને સુંદર સપના આપે.", source: "શુભ રાત્રિ" },
    { text: "રાતનો અંધકાર નવી સવારની રોશની માટેની તૈયારી છે.", source: "શુભ રાત્રિ" },
  ],
  festival: [
    { text: "દિવાળીનો પ્રકાશ તમારા જીવનમાં સુખ, શાંતિ અને સમૃદ્ધિ લાવે.", source: "શુભ દિવાળી" },
    { text: "નવરાત્રીના પાવન પર્વ પર મા અંબે તમારી બધી મનોકામના પૂર્ણ કરે.", source: "શુભ નવરાત્રી" },
    { text: "ઉત્તરાયણનો પતંગ તમારી સફળતાની ઊંચાઈઓને આંબે તેવી શુભેચ્છાઓ.", source: "શુભ ઉત્તરાયણ" },
  ],
  prerna: [
    { text: "તમે જેવું વિચારો છો, તેવા જ તમે બનો છો.", source: "સ્વામી વિવેકાનંદ" },
    { text: "મારું જીવન એ જ મારો સંદેશ છે.", source: "મહાત્મા ગાંધી" },
    { text: "લોખંડી મનોબળ આગળ પહાડ પણ માથું ઝુકાવે છે.", source: "સરદાર વલ્લભભાઈ પટેલ" },
    { text: "ઉઠો, જાગો અને ધ્યેય પ્રાપ્તિ સુધી મંડ્યા રહો.", source: "સ્વામી વિવેકાનંદ" },
  ],
  health: [
    { text: "પહેલું સુખ તે જાતે નર્યા.", source: "આયુર્વેદ" },
    { text: "સ્વસ્થ શરીર એ જ સાચી સંપત્તિ છે.", source: "સ્વાસ્થ્ય વિચાર" },
    { text: "યોગ અને આયુર્વેદ અપનાવો, જીવનને નિરોગી બનાવો.", source: "આરોગ્ય" },
  ],
  jyotish: [
    { text: "જેના પર ઈશ્વરની કૃપા હોય, તેના ગ્રહો પણ શુભ ફળ આપે છે.", source: "જ્યોતિષ શાસ્ત્ર" },
    { text: "કર્મ સારા હોય તો નસીબ આપોઆપ બદલાઈ જાય છે.", source: "રાશિફળ" },
  ],
  sahitya: [
    { text: "જ્યાં જ્યાં વસે એક ગુજરાતી, ત્યાં ત્યાં સદાકાળ ગુજરાત.", source: "કવિ ખબરદાર" },
    { text: "નિશાન ચૂક માફ, નહીં માફ નીચું નિશાન.", source: "કવિ કલાપી" },
    { text: "યાહોમ કરીને પડો, ફતેહ છે આગે.", source: "કવિ નર્મદ" },
  ]
};

const DevotionalCards = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // User Settings State
  const [profile, setProfile] = useState({
    name: "રાહુલ મ.",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    showName: true,
    showPhoto: true,
    showWatermark: true,
  });

  // Card Builder State
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeDeity, setActiveDeity] = useState(DEITIES[1]); // Default Krishna
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [base64Img, setBase64Img] = useState(activeDeity.img);
  const [base64Avatar, setBase64Avatar] = useState("");

  // Custom Quotes from LocalStorage
  const [customQuotes, setCustomQuotes] = useState(() => {
    const saved = localStorage.getItem('sanskari_custom_quotes');
    return saved ? JSON.parse(saved) : {
      bhakti: [], morning: [], night: [], festival: [], prerna: [], health: [], jyotish: [], sahitya: []
    };
  });

  // Load User Profile from localstorage if available
  useEffect(() => {
    const saved = localStorage.getItem('sanskari_kbc_profile'); // Using existing profile data if any
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setProfile(prev => ({
          ...prev,
          name: p.name || prev.name,
          photoUrl: p.photoUrl || prev.photoUrl
        }));
      } catch (e) { }
    }
  }, []);

  // Convert external images to base64 to prevent html2canvas CORS / Tainted Canvas issues
  useEffect(() => {
    const fetchBase64 = async (url, setter) => {
      if (!url) return;
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { mode: 'cors', cache: 'no-cache' });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result);
        reader.readAsDataURL(blob);
      } catch (e) {
        console.warn("Base64 fetch failed, using original url", e);
        setter(url); // fallback
      }
    };
    
    fetchBase64(activeDeity.img, setBase64Img);
  }, [activeDeity]);

  useEffect(() => {
    const fetchBase64 = async (url, setter) => {
      if (!url) return;
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl, { mode: 'cors', cache: 'no-cache' });
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => setter(reader.result);
        reader.readAsDataURL(blob);
      } catch (e) {
        console.warn("Base64 fetch failed, using original url", e);
        setter(url); // fallback
      }
    };
    
    fetchBase64(profile.photoUrl, setBase64Avatar);
  }, [profile.photoUrl]);

  const defaultQuotes = CATEGORY_QUOTES[activeCategory.id] || CATEGORY_QUOTES['bhakti'];
  const userQuotes = customQuotes[activeCategory.id] || [];
  const quotesForCategory = [...defaultQuotes, ...userQuotes];
  const currentQuote = quotesForCategory.length > 0
    ? quotesForCategory[quoteIndex % quotesForCategory.length]
    : { text: "કોઈ સુવિચાર નથી", source: "એડમિન" };

  const changeQuote = () => {
    setQuoteIndex(prev => prev + 1);
  };

  const selectCategory = (cat) => {
    setActiveCategory(cat);
    setQuoteIndex(0);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure any fonts/images are fully rendered
      await new Promise(r => setTimeout(r, 500));
      
      const image = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        style: { background: activeTheme.bg },
      });

      const filename = `GujaratiApp_Card_${Date.now()}.png`;
      await downloadFile(image, filename);

      // Track telemetry
      const count = parseInt(localStorage.getItem('sanskari_cards_generated_count') || "0");
      localStorage.setItem('sanskari_cards_generated_count', (count + 1).toString());
    } catch (err) {
      console.error("Card generation failed:", err);
      alert("Error generating card: " + (err.message || err.toString()));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      const blob = await toBlob(cardRef.current, { 
        pixelRatio: 2, 
        cacheBust: true,
        style: { background: activeTheme.bg } 
      });
      
      if (!blob) throw new Error("Image blob is empty");
      
      const file = new File([blob], `card_${Date.now()}.png`, { type: 'image/png' });
      const shareData = {
        title: 'Gujarati App - Devotional Card',
        text: `🙏 ${currentQuote.text}\n— ${currentQuote.source}\n\nGujarati App પર રોજ નવા cards મેળવો!`,
        files: [file]
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share(shareData);
          // Track telemetry
          const count = parseInt(localStorage.getItem('sanskari_cards_generated_count') || "0");
          localStorage.setItem('sanskari_cards_generated_count', (count + 1).toString());
        } else {
          // Fallback if Web Share API not supported
          alert("તમારું બ્રાઉઝર ડાયરેક્ટ શેરિંગ સપોર્ટ કરતું નથી. ડાઉનલોડ બટન નો ઉપયોગ કરો.");
        }
    } catch (err) {
      console.error("Share failed:", err);
      alert("શેર કરવામાં ભૂલ આવી.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-body min-h-[85vh] animate-fade-in text-stone-800">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-stone-200/50 mb-8">
        <button onClick={() => navigate('/community')} className="h-10 w-10 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-50 transition active:scale-95 shadow-sm">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline font-black text-3xl tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">collections_bookmark</span>
            ભક્તિ Cards મેકર
          </h1>
          <p className="text-stone-500 font-gujarati text-sm mt-1">
            તમારા નામ અને ફોટો સાથે સુંદર સુવિચાર કાર્ડ બનાવો અને શેર કરો.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls (Settings, Themes, Deities) */}
        <div className="lg:col-span-7 space-y-8">

          {/* User Settings Controls */}
          <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-200/50 shadow-sm">
            <h3 className="font-gujarati font-bold text-xs text-stone-500 uppercase tracking-widest mb-4">૧. સેટિંગ્સ (તમારો ફોટો અને નામ)</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-stone-400">badge</span>
                  <span className="font-gujarati text-sm font-bold">મારું નામ Card પર બતાવો</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={profile.showName} onChange={(e) => setProfile({...profile, showName: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-stone-400">face</span>
                  <span className="font-gujarati text-sm font-bold">મારો ફોટો Card પર બતાવો</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={profile.showPhoto} onChange={(e) => setProfile({...profile, showPhoto: e.target.checked})} className="sr-only peer" />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-200/50 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-gujarati font-bold text-xs text-stone-500 uppercase tracking-widest">૨. કેટેગરી અને સુવિચાર</h3>
              <button onClick={changeQuote} className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-primary/20 transition-all">
                <span className="material-symbols-outlined text-[14px]">refresh</span> નવો સુવિચાર
              </button>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${activeCategory.id === cat.id ? 'bg-primary text-white shadow-md border-primary' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'}`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span className="font-gujarati font-bold text-sm">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-200/50 shadow-sm">
            <h3 className="font-gujarati font-bold text-xs text-stone-500 uppercase tracking-widest mb-4">૪. કલર થીમ પસંદ કરો</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  style={{ backgroundColor: theme.bg, color: theme.text, borderColor: activeTheme.id === theme.id ? theme.accent : 'transparent' }}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-4 transition-transform active:scale-95 ${activeTheme.id === theme.id ? 'scale-105 shadow-md' : 'shadow-sm opacity-80 hover:opacity-100'}`}
                >
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                  <span className="font-gujarati font-bold text-xs">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deity Selector */}
          <div className="bg-stone-50 rounded-[2rem] p-6 border border-stone-200/50 shadow-sm">
            <h3 className="font-gujarati font-bold text-xs text-stone-500 uppercase tracking-widest mb-4">૫. ભગવાન / ફોટો પસંદ કરો</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {DEITIES.map(deity => (
                <button
                  key={deity.id}
                  onClick={() => setActiveDeity(deity)}
                  className={`flex flex-col items-center gap-2 transition-transform active:scale-95 p-2 rounded-2xl border-2 ${activeDeity.id === deity.id ? 'border-primary bg-primary/5 scale-105' : 'border-transparent hover:bg-stone-100'}`}
                >
                  <img src={deity.img} alt={deity.name} className="w-14 h-14 rounded-full object-cover shadow-sm" crossOrigin="anonymous" />
                  <span className="font-gujarati text-[10px] font-bold text-stone-600 whitespace-nowrap">{deity.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Canvas Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full flex justify-between items-center mb-4 px-2">
            <span className="font-gujarati font-bold text-stone-500 text-sm">લાઈવ પ્રિવ્યૂ (Instagram Post Size)</span>
          </div>

          {/* CARD CANVAS CONTAINER */}
          <div 
            className={`transition-all duration-500 shadow-2xl rounded-3xl overflow-hidden relative flex flex-col items-center justify-between`}
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              aspectRatio: '1080/1350',
              backgroundColor: activeTheme.bg,
              color: activeTheme.text
            }}
          >
            {/* THIS DIV IS WHAT WILL BE RENDERED TO IMAGE */}
            <div 
              ref={cardRef} 
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-between p-8"
              style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
            >
              {/* Top Pattern / Om */}
              <div className="w-full flex justify-center pt-2">
                <span className="font-gujarati text-2xl" style={{ color: activeTheme.accent }}>ૐ</span>
              </div>

              {/* Deity Image */}
              <div className={`mt-4 mb-6 rounded-full overflow-hidden border-4 shadow-xl w-48 h-48`} style={{ borderColor: activeTheme.accent }}>
                <img 
                  src={base64Img || activeDeity.img} 
                  alt={activeDeity.name} 
                  className="w-full h-full object-cover" 
                  crossOrigin={base64Img?.startsWith('data:') ? undefined : "anonymous"} 
                />
              </div>

              {/* Quote Area */}
              <div className="text-center px-4 flex-1 flex flex-col justify-center">
                <p className={`font-gujarati font-black leading-relaxed text-2xl`} style={{ color: activeTheme.text }}>
                  "{currentQuote.text}"
                </p>
                <p className="font-gujarati text-sm mt-4 opacity-80" style={{ color: activeTheme.accent }}>
                  — {currentQuote.source}
                </p>
              </div>

              {/* Bottom Divider */}
              <div className="w-16 h-1 rounded-full my-6 opacity-30" style={{ backgroundColor: activeTheme.accent }}></div>

              {/* Footer: User + App */}
              <div className="w-full flex items-center justify-between mt-auto pt-4 pb-2">
                <div className="flex items-center gap-3">
                  {profile.showPhoto && (
                    <img 
                      src={base64Avatar || profile.photoUrl} 
                      alt="User" 
                      className="w-8 h-8 rounded-full border border-white/20" 
                      crossOrigin={base64Avatar?.startsWith('data:') ? undefined : "anonymous"} 
                    />
                  )}
                  {profile.showName && (
                    <span className="font-gujarati font-bold text-sm tracking-wide">{profile.name}</span>
                  )}
                </div>
                
                {profile.showWatermark && (
                  <div className="flex flex-col items-end opacity-70">
                    <span className="font-gujarati font-black text-xs">Gujarati App</span>
                    <span className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: activeTheme.accent }}>Devotional Cards</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* END CARD CANVAS */}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 w-full max-w-[400px]">
            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-4 rounded-2xl font-gujarati font-bold text-lg flex items-center justify-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined">{isGenerating ? 'hourglass_empty' : 'download'}</span>
              ડાઉનલોડ
            </button>
            <button 
              onClick={handleShare}
              disabled={isGenerating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-gujarati font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span className="material-symbols-outlined">{isGenerating ? 'hourglass_empty' : 'share'}</span>
              શેર કરો
            </button>
          </div>
          <p className="text-center font-gujarati text-xs text-stone-400 mt-4">
            નોંધ: શેર બટન દબાવવાથી સીધું WhatsApp, Facebook કે Instagram માં મોકલી શકાશે.
          </p>

        </div>

      </div>
    </div>
  );
};

export default DevotionalCards;
