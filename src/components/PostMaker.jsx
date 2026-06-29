import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

// --- Configuration Data ---
const CATEGORIES = [
  { id: 'custom', label: 'નવી ડિઝાઇન', icon: 'star' },
  { id: 'good_morning', label: 'સુપ્રભાત', icon: 'routine' },
  { id: 'devotional', label: 'ભક્તિ', icon: 'temple_hindu' },
  { id: 'motivational', label: 'પ્રેરણાદાયક', icon: 'psychiatry' },
  { id: 'suvichar', label: 'સુવિચાર', icon: 'format_quote' }
];

const TEMPLATES = {
  custom: [
    { bg: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1080&auto=format&fit=crop', text: 'સફળતાનો રસ્તો હંમેશા બાંધકામ હેઠળ હોય છે, પરંતુ મહેનત કરનાર માટે મંઝિલ ક્યારેય દૂર નથી હોતી.' }
  ],
  good_morning: [
    { bg: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1080&auto=format&fit=crop', text: 'સવારનો સૂર્ય નવી આશા લઈને આવે છે. તમારો દિવસ શુભ રહે!' },
    { bg: 'https://images.unsplash.com/photo-1506744626753-1fa44df31c7f?q=80&w=1080&auto=format&fit=crop', text: 'દરેક સવાર એક નવી શરૂઆત છે. સુપ્રભાત!' }
  ],
  devotional: [
    { bg: 'https://images.unsplash.com/photo-1590059536060-65c2765d774d?q=80&w=1080&auto=format&fit=crop', text: 'હે પ્રભુ, સૌનું ભલું કરજો. જય શ્રી કૃષ્ણ!' },
    { bg: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?q=80&w=1080&auto=format&fit=crop', text: 'ૐ નમઃ શિવાય. હર હર મહાદેવ!' }
  ],
  motivational: [
    { bg: 'https://images.unsplash.com/photo-1552508744-1696d4464960?q=80&w=1080&auto=format&fit=crop', text: 'સફળતાનો રસ્તો હંમેશા બાંધકામ હેઠળ હોય છે, પરંતુ મહેનત કરનાર માટે મંઝિલ ક્યારેય દૂર નથી હોતી.' }
  ],
  suvichar: [
    { bg: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=1080&auto=format&fit=crop', text: 'માણસ પોતાના વિચારોથી જ મોટો બને છે. સારો વિચાર એ જ સાચી સંપત્તિ છે.' }
  ]
};

const PostMaker = () => {
  const [activeCategory, setActiveCategory] = useState('good_morning');
  const [templateIndex, setTemplateIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  
  // User Details
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);

  const previewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Auto-fill from digitalCardDraft
  useEffect(() => {
    const saved = localStorage.getItem('digitalCardDraft');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.name) setUserName(d.name);
        if (d.profileImage) setUserPhoto(d.profileImage);
        if (d.businessName) setBusinessName(d.businessName);
      } catch(e) {}
    }
  }, []);

  // Update text when category/template changes
  useEffect(() => {
    const defaultText = TEMPLATES[activeCategory][templateIndex]?.text || '';
    setCustomText(defaultText);
  }, [activeCategory, templateIndex]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // High resolution
        useCORS: true, // Allow external images
        allowTaint: true,
        backgroundColor: null
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Gujarati_Post_${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("ઈમેજ ડાઉનલોડ કરવામાં ભૂલ થઈ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setIsDownloading(false);
    }
  };

  const activeTemplate = TEMPLATES[activeCategory][templateIndex];

  // Render Frame based on Category
  const renderFrame = () => {
    if (activeCategory === 'devotional') {
      return (
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-600 to-orange-500 border-t-4 border-yellow-400 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-20 h-20 rounded-full border-2 border-yellow-200 object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/30 border-2 border-yellow-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-3xl">person</span>
              </div>
            )}
            <div className="text-white">
              <p className="font-gujarati font-bold text-2xl">{userName || 'તમારું નામ'}</p>
              {isBusiness && businessName && <p className="text-yellow-200 text-sm">{businessName}</p>}
            </div>
          </div>
          <div className="text-right opacity-80">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white">Created by</span>
            <p className="font-bold text-sm text-yellow-200">Gujarati App</p>
          </div>
        </div>
      );
    }

    if (activeCategory === 'custom') {
      return (
        <div className="absolute bottom-[5%] left-0 right-0 flex flex-col items-center justify-center">
          {/* Circular Photo */}
          <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-[3px] border-[#FBC02D] shadow-lg relative z-10 bg-white">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-stone-400 text-4xl">person</span>
              </div>
            )}
          </div>
          {/* Name Box */}
          <div className="mt-3 text-center">
            <p className="font-serif text-2xl text-white tracking-wide" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
              {userName || 'તમારું નામ'}
            </p>
            {isBusiness && businessName && (
              <p className="text-[#FBC02D] text-sm font-bold mt-0.5 tracking-wider uppercase">
                {businessName}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (activeCategory === 'good_morning' || activeCategory === 'suvichar') {
      return (
        <div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-white/95 shadow-xl p-4 flex items-center justify-between backdrop-blur-sm border border-white/50">
          <div className="flex items-center gap-3">
            {userPhoto ? (
              <img src={userPhoto} alt="User" className="w-16 h-16 rounded-full border-2 border-primary object-cover shadow-sm" crossOrigin="anonymous" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">person</span>
              </div>
            )}
            <div>
              <p className="font-gujarati font-bold text-xl text-on-surface">{userName || 'તમારું નામ'}</p>
              {isBusiness && businessName && <p className="text-primary text-xs font-bold">{businessName}</p>}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary transform -rotate-90">APP</span>
          </div>
        </div>
      );
    }

    // Default Minimal Frame (Motivational etc.)
    return (
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end text-center">
        {userPhoto && (
          <img src={userPhoto} alt="User" className="w-16 h-16 rounded-full border-2 border-white object-cover mb-3 shadow-lg" crossOrigin="anonymous" />
        )}
        <p className="font-gujarati font-bold text-2xl text-white drop-shadow-md">{userName || 'તમારું નામ'}</p>
        {isBusiness && businessName && <p className="text-white/80 text-sm mt-1">{businessName}</p>}
        <p className="absolute bottom-2 right-4 text-[8px] text-white/40">Created by Gujarati App</p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-1 px-4">
        <h2 className="font-gujarati font-black text-3xl text-primary mt-2">પોસ્ટ મેકર</h2>
        <p className="font-gujarati text-outline text-sm">તમારા નામ અને ફોટા સાથે સુંદર પોસ્ટ બનાવો.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-4 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setTemplateIndex(0);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all font-gujarati font-bold text-sm border ${
              activeCategory === cat.id 
                ? 'bg-primary text-white border-primary shadow-md' 
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Image Preview Area */}
      <div className="px-4">
        <div className="relative w-full aspect-[3/4] bg-stone-100 rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
          
          {/* THE ACTUAL RENDERED CANVAS - We set absolute sizes to ensure HD export */}
          <div 
            ref={previewRef}
            className="absolute top-0 left-0 w-full h-full bg-stone-200 flex flex-col relative overflow-hidden"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Background Image */}
            <img 
              src={activeTemplate?.bg} 
              alt="Background" 
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            
            {/* Dark Overlay for Text */}
            {activeCategory !== 'custom' && <div className="absolute inset-0 bg-black/40"></div>}

            {/* Quote Box (Styling depends on category) */}
            {activeCategory === 'custom' ? (
              <div className="absolute top-[32%] left-[10%] right-[10%] h-[35%] flex flex-col items-center justify-center text-center px-4">
                <p className="text-[#3E2723] font-black text-2xl font-gujarati leading-snug drop-shadow-sm">
                  {customText}
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center pt-12 pb-32">
                <span className="material-symbols-outlined text-4xl text-white/50 mb-4">format_quote</span>
                <p className={`text-white drop-shadow-xl whitespace-pre-wrap ${
                  activeCategory === 'motivational' ? 'font-black text-3xl' : 
                  activeCategory === 'devotional' ? 'font-bold text-3xl text-orange-50' : 
                  'font-bold text-2xl'
                } font-gujarati leading-snug`}>
                  {customText}
                </p>
              </div>
            )}

            {/* Dynamic Footer/Frame */}
            {renderFrame()}
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="px-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {TEMPLATES[activeCategory].map((tpl, idx) => (
          <button 
            key={idx}
            onClick={() => setTemplateIndex(idx)}
            className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${templateIndex === idx ? 'border-primary scale-110 shadow-md' : 'border-transparent opacity-70'}`}
          >
            <img src={tpl.bg} className="w-full h-full object-cover" alt={`Template ${idx}`} crossOrigin="anonymous" />
          </button>
        ))}
      </div>

      {/* Customization Form */}
      <div className="bg-white rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] space-y-5">
        <h3 className="font-gujarati font-black text-lg">વિગતો સેટ કરો</h3>
        
        {/* Toggle Personal/Business */}
        <div className="flex bg-stone-100 p-1 rounded-xl">
          <button onClick={() => setIsBusiness(false)} className={`flex-1 py-2 font-gujarati font-bold text-sm rounded-lg transition-all ${!isBusiness ? 'bg-white shadow text-primary' : 'text-stone-500'}`}>વ્યક્તિગત</button>
          <button onClick={() => setIsBusiness(true)} className={`flex-1 py-2 font-gujarati font-bold text-sm rounded-lg transition-all ${isBusiness ? 'bg-white shadow text-primary' : 'text-stone-500'}`}>બિઝનેસ</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">તમારું નામ</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              placeholder="દા.ત. હાર્દિક પટેલ" 
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all"
            />
          </div>

          {isBusiness && (
            <div>
              <label className="text-xs font-bold text-stone-500 ml-1">બિઝનેસનું નામ</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="દા.ત. શ્રીજી એન્ટરપ્રાઇઝ" 
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">લખાણ / સુવિચાર</label>
            <textarea 
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)}
              rows="3"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-gujarati mt-1 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 ml-1">પ્રોફાઇલ ફોટો</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 mt-2"
            />
          </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full py-4 rounded-2xl font-gujarati font-black text-white text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all ${isDownloading ? 'bg-primary/50' : 'bg-primary active:scale-95'}`}
        >
          {isDownloading ? (
            <><span className="material-symbols-outlined animate-spin">refresh</span> ડાઉનલોડ થાય છે...</>
          ) : (
            <><span className="material-symbols-outlined">download</span> ઈમેજ ડાઉનલોડ કરો</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PostMaker;
