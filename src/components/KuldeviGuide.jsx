import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MATAJI_DETAILS, CASTE_MAPPING } from '../utils/kuldevi_database';

// Dynamic extraction and deduplication of Mataji names from CASTE_MAPPING
const ALL_MATAJIS = (() => {
  const list = [...MATAJI_DETAILS];
  const uniqueNamesMap = new Map();
  
  CASTE_MAPPING.forEach(item => {
    if (!item.kuldevi) return;
    
    // Split by '/' to get individual Kuldevis
    const parts = item.kuldevi.split('/');
    parts.forEach(part => {
      const trimmed = part.trim();
      if (!trimmed) return;
      
      const hasMatch = list.some(m => {
        const mName = m.name.toLowerCase();
        const target = trimmed.toLowerCase();
        
        return mName.includes(target) || target.includes(mName) ||
               (target.includes("આશાપુરા") && m.id === "ashapura") ||
               (target.includes("ખોડિયાર") && m.id === "khodiyar") ||
               (target.includes("ઉમિયા") && m.id === "umiya") ||
               (target.includes("મેલડી") && m.id === "meldi") ||
               (target.includes("સિખોતર") && m.id === "sikotar") ||
               (target.includes("સિકોતરા") && m.id === "sikotar") ||
               (target.includes("ચેહર") && m.id === "chehar") ||
               (target.includes("જહુ") && m.id === "jahu") ||
               (target.includes("મોમાઈ") && m.id === "momai") ||
               (target.includes("શક્તિ") && m.id === "shakti") ||
               (target.includes("હરસિદ્ધિ") && m.id === "harasiddhi") ||
               (target.includes("મોઢેશ્વરી") && m.id === "modheshwari") ||
               (target.includes("ચામુંડા") && m.id === "chamunda") ||
               (target.includes("મહાલક્ષ્મી") && m.id === "mahalakshmi") ||
               (target.includes("બહુચર") && m.id === "bahucharaji") ||
               (target.includes("બુટ") && m.id === "butbhavani") ||
               (target.includes("વાઘેશ્વરી") && m.id === "vagheshwari");
      });
      
      if (!hasMatch) {
        if (!uniqueNamesMap.has(trimmed)) {
          uniqueNamesMap.set(trimmed, {
            temple: item.temple || "ગુજરાતના વિવિધ ધામ"
          });
        }
      }
    });
  });
  
  uniqueNamesMap.forEach((metaData, name) => {
    const cleanId = name.replace(/[^a-zA-Z0-9\u0A80-\u0AFF]/g, '').slice(0, 16) + "_" + Math.random().toString(36).substring(2, 6);
    list.push({
      id: cleanId,
      name: name,
      location: metaData.temple,
      hasNoDetails: true,
      image: "https://images.unsplash.com/photo-1590059536060-65c2765d774d?auto=format&fit=crop&q=80&w=600",
      history: "",
      puja: "",
      naivedya: "",
      vrat: ""
    });
  });
  
  return list;
})();

const KuldeviGuide = () => {
  const navigate = useNavigate();
  
  // Tab states: 'search' or 'directory'
  const [activeSection, setActiveSection] = useState('search');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [casteFilter, setCasteFilter] = useState('All');

  // Mataji directory search
  const [matajiQuery, setMatajiQuery] = useState('');
  
  // Accordion state for Matajis
  const [expandedMataji, setExpandedMataji] = useState(null);
  
  // Sub-tabs for expanded Mataji details: 'history' | 'puja' | 'naivedya' | 'vrat'
  const [activeSubTab, setActiveSubTab] = useState('history');

  const findMatajiIdByName = (kuldeviName) => {
    if (!kuldeviName) return null;
    const target = kuldeviName.toLowerCase();
    
    // First, try exact or substring matches in ALL_MATAJIS
    const match = ALL_MATAJIS.find(m => {
      const mName = m.name.toLowerCase();
      return mName.includes(target) || target.includes(mName);
    });
    if (match) return match.id;

    // Fallback checks for common Kuldevis
    if (target.includes("આશાપુરા")) return "ashapura";
    if (target.includes("ખોડિયાર") || target.includes("ખોડલ")) return "khodiyar";
    if (target.includes("ઉમિયા")) return "umiya";
    if (target.includes("મેલડી")) return "meldi";
    if (target.includes("સિખોતર") || target.includes("સિકોતરા")) return "sikotar";
    if (target.includes("ચેહર")) return "chehar";
    if (target.includes("જહુ")) return "jahu";
    if (target.includes("મોમાઈ")) return "momai";
    if (target.includes("શક્તિ")) return "shakti";
    if (target.includes("હરસિદ્ધિ")) return "harasiddhi";
    if (target.includes("મોઢેશ્વરી")) return "modheshwari";
    if (target.includes("ચામુંડા")) return "chamunda";
    if (target.includes("મહાલક્ષ્મી")) return "mahalakshmi";
    if (target.includes("બહુચર")) return "bahucharaji";
    if (target.includes("બુટ")) return "butbhavani";
    if (target.includes("વાઘેશ્વરી")) return "vagheshwari";
    
    return null;
  };

  const handleKuldeviClick = (kuldeviName) => {
    const matajiId = findMatajiIdByName(kuldeviName);
    if (matajiId) {
      setActiveSection('directory');
      setExpandedMataji(matajiId);
      setMatajiQuery(''); // Clear directory search so it's not filtered out!
      setTimeout(() => {
        const el = document.getElementById(`mataji-${matajiId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  };

  const renderKuldeviLinks = (kuldeviStr) => {
    if (!kuldeviStr) return null;
    const parts = kuldeviStr.split('/');
    return (
      <div className="flex flex-wrap gap-1 items-center">
        {parts.map((part, idx) => {
          const trimmed = part.trim();
          const matajiId = findMatajiIdByName(trimmed);
          if (matajiId) {
            return (
              <span key={idx} className="inline-flex items-center">
                <button
                  onClick={() => handleKuldeviClick(trimmed)}
                  className="text-primary font-black hover:underline cursor-pointer flex items-center gap-0.5 hover:text-orange-600 transition-colors text-left"
                >
                  <span>{trimmed}</span>
                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                </button>
                {idx < parts.length - 1 && <span className="mx-1 text-stone-400">/</span>}
              </span>
            );
          } else {
            return (
              <span key={idx} className="text-primary font-black">
                {trimmed}
                {idx < parts.length - 1 && <span className="mx-1 text-stone-400">/</span>}
              </span>
            );
          }
        })}
      </div>
    );
  };

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    nameCaste: '',
    surname: '',
    kuldeviName: '',
    changeType: 'ઇતિહાસ',
    details: '',
    templeLocation: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [localFeedbackList, setLocalFeedbackList] = useState(() => {
    return JSON.parse(localStorage.getItem('kuldevi_feedback_history') || '[]');
  });

  // Handle feedback submit
  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const newFeedback = {
      ...feedbackForm,
      id: Date.now(),
      date: new Date().toLocaleDateString('gu-IN')
    };
    
    const updatedList = [newFeedback, ...localFeedbackList];
    setLocalFeedbackList(updatedList);
    localStorage.setItem('kuldevi_feedback_history', JSON.stringify(updatedList));
    
    setFeedbackSubmitted(true);
    // Reset form after submission
    setFeedbackForm({
      nameCaste: '',
      surname: '',
      kuldeviName: '',
      changeType: 'ઇતિહાસ',
      details: '',
      templeLocation: ''
    });
  };

  const openFeedbackForMataji = (matajiName) => {
    setFeedbackForm({
      nameCaste: '',
      surname: '',
      kuldeviName: matajiName,
      changeType: 'અન્ય વિગત',
      details: '',
      templeLocation: ''
    });
    setFeedbackSubmitted(false);
    setShowFeedbackModal(true);
  };

  // Filter caste mappings
  const filteredMappings = CASTE_MAPPING.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      item.caste.toLowerCase().includes(query) || 
      item.surname.toLowerCase().includes(query) || 
      item.kuldevi.toLowerCase().includes(query) || 
      item.temple.toLowerCase().includes(query);
      
    if (casteFilter === 'All') return matchesSearch;
    return matchesSearch && item.caste.includes(casteFilter);
  });

  // Filter all Matajis
  const filteredMatajis = ALL_MATAJIS.filter(item => {
    const query = matajiQuery.toLowerCase().trim();
    return item.name.toLowerCase().includes(query) || 
           item.history.toLowerCase().includes(query) ||
           item.location.toLowerCase().includes(query);
  });

  // Copy details to clipboard
  const handleCopyToClipboard = (text, message = 'માહિતી સફળતાપૂર્વક કોપી થઈ ગઈ છે!') => {
    navigator.clipboard.writeText(text);
    alert(message);
  };

  // Share Mataji detail on WhatsApp
  const handleShareMataji = (mataji) => {
    const text = `🔱 *${mataji.name}* 🔱\n📍 *મુખ્ય ધામ:* ${mataji.location}\n🐾 *વાહન:* ${mataji.vehicle}\n\n📖 *ઇતિહાસ:* ${mataji.history}\n\n🙏 *પૂજા વિધિ:* ${mataji.puja}\n\n🍪 *નૈવેદ્ય (પ્રસાદ):* ${mataji.naivedya}\n\n🕉️ *મંત્ર:* ${mataji.mantra}\n\nશુભ કામો અને વિગતો માટે ડાઉનલોડ કરો "ગુજરાતી એપ" 🚩`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  const casteCategories = [
    { label: 'બધા', value: 'All' },
    { label: 'રાજપૂત / ક્ષત્રિય', value: 'રાજપૂત' },
    { label: 'પાટીદાર', value: 'પાટીદાર' },
    { label: 'બ્રાહ્મણ', value: 'બ્રાહ્મણ' },
    { label: 'વાણિયા / વણિક', value: 'વાણિયા' },
    { label: 'રબારી', value: 'રબારી' },
    { label: 'ભરવાડ', value: 'ભરવાડ' }
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-24 text-stone-850 dark:text-stone-150">
      
      {/* 1. Header with back button */}
      <div className="flex items-center gap-4 pb-4 border-b border-orange-100/30 dark:border-orange-900/30">
        <button 
          onClick={() => navigate('/devotional')} 
          className="h-11 w-11 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="font-gujarati font-black text-3xl text-primary tracking-tight">કુળદેવી માર્ગદર્શિકા</h1>
          <p className="text-stone-500 dark:text-stone-400 font-gujarati text-sm mt-0.5">
            જ્ઞાતિ-અટક મુજબ કુળદેવી અને ૧૬ મુખ્ય માતાજીનો પવિત્ર ઇતિહાસ
          </p>
        </div>
      </div>

      {/* 2. Sensitive Disclaimer Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-955/10 dark:to-orange-955/5 p-6 rounded-[2rem] border border-amber-250/60 dark:border-amber-900/40 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[80px]">warning</span>
        </div>
        <div className="flex gap-4 items-start">
          <span className="material-symbols-outlined text-3xl text-amber-600 dark:text-amber-500 shrink-0 mt-0.5 animate-pulse">info</span>
          <div className="space-y-3">
            <h4 className="font-gujarati font-black text-amber-950 dark:text-amber-300 text-base">⚠️ મહત્વની નોંધ (Disclaimer)</h4>
            <p className="font-gujarati text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-bold">
              અહીં દર્શાવવામાં આવેલી માહિતી ઇન્ટરનેટ, લોકવાયકાઓ અને ઉપલબ્ધ ધાર્મિક ગ્રંથોમાંથી એકત્રિત કરવામાં આવી છે. અમારો હેતુ માત્ર આપણી સંસ્કૃતિની માહિતી લોકો સુધી પહોંચાડવાનો છે, કોઈ પણ જ્ઞાતિ, સમાજ કે સમુદાયની ધાર્મિક લાગણીઓને દુભાવવાનો નથી. દરેક પરિવારમાં પૂજા પદ્ધતિ અને પરંપરાઓ અલગ હોઈ શકે છે. જો આ માહિતીમાં કોઈ ભૂલ જણાય અથવા તમે કોઈ સુધારો/વધારો કરવા માંગતા હોવ, તો નીચે આપેલા બટન પર ક્લિક કરીને ફોર્મ ભરો. અમે યોગ્ય ચકાસણી કરીને સાચી માહિતી ચોક્કસ અપડેટ કરીશું.
            </p>
            
            {/* Google Form Link and Feedback CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => { setShowFeedbackModal(true); setFeedbackSubmitted(false); }}
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-gujarati font-black py-2.5 px-5 rounded-xl shadow-sm hover:shadow active:scale-95 text-xs flex items-center gap-1.5 transition-all border-b-2 border-orange-800"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                માહિતી સુધારો / ફોર્મ ભરો
              </button>
              <a 
                href="https://forms.gle/om-gujarati-feedback" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-gujarati font-black py-2.5 px-5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 active:scale-95 text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">link</span>
                🔗 Google Form લિંક
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Navigation Toggle */}
      <div className="flex bg-stone-100 dark:bg-stone-900 p-1.5 rounded-3xl max-w-md mx-auto shadow-inner border border-stone-200/50 dark:border-stone-800">
        <button 
          onClick={() => setActiveSection('search')} 
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-gujarati font-black transition-all flex items-center justify-center gap-2 ${activeSection === 'search' ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
        >
          <span className="material-symbols-outlined text-lg">search</span>
          🔍 અટક અને જ્ઞાતિ સર્ચ
        </button>
        <button 
          onClick={() => setActiveSection('directory')} 
          className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-gujarati font-black transition-all flex items-center justify-center gap-2 ${activeSection === 'directory' ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
        >
          <span className="material-symbols-outlined text-lg">menu_book</span>
          🕉️ માતાજીની માહિતી
        </button>
      </div>

      {/* 4. SECTION A: CASTE / SURNAME SEARCH ENGINE */}
      {activeSection === 'search' && (
        <section className="space-y-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm border border-orange-50/50 dark:border-stone-800 space-y-6">
            
            {/* Search inputs and Filters */}
            <div className="space-y-4">
              <h3 className="font-gujarati font-black text-xl text-teal">તમારા કુળદેવી શોધો</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">search</span>
                <input
                  type="text"
                  placeholder="તમારી અટક (જેમ કે: જાડેજા, પટેલ, ત્રિવેદી...) અથવા જ્ઞાતિ લખો..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-gujarati text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                )}
              </div>

              {/* Caste Pills Filter */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {casteCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCasteFilter(cat.value)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-gujarati font-black transition-all border ${casteFilter === cat.value ? 'bg-teal text-white border-teal shadow-sm' : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-850'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Output */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-gujarati font-bold text-stone-450 px-1">
                <span>શોધ પરિણામો: {filteredMappings.length} મેળ ખાતા સ્થાનકો</span>
                {casteFilter !== 'All' && <span>ફિલ્ટર: {casteFilter}</span>}
              </div>

              {filteredMappings.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-hidden border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm">
                    <table className="w-full text-left font-gujarati text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-black">
                          <th className="py-4 px-5">જ્ઞાતિ (Caste)</th>
                          <th className="py-4 px-5">અટક / શાખ (Surname / Clan)</th>
                          <th className="py-4 px-5 text-primary">કુળદેવી (Kuldevi)</th>
                          <th className="py-4 px-5">મુખ્ય સ્થાનક / ધામ</th>
                          <th className="py-4 px-5 text-center">ક્રિયાઓ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-bold text-stone-700 dark:text-stone-300">
                        {filteredMappings.map((row, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                            <td className="py-4 px-5">
                              <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-850 rounded-lg text-[10px] text-stone-600 dark:text-stone-400">{row.caste}</span>
                            </td>
                            <td className="py-4 px-5 text-sm">{row.surname}</td>
                            <td className="py-4 px-5 text-sm">{renderKuldeviLinks(row.kuldevi)}</td>
                            <td className="py-4 px-5 text-sm flex items-center gap-1.5 mt-0.5">
                              <span className="material-symbols-outlined text-base text-red-500">location_on</span>
                              {row.temple}
                            </td>
                            <td className="py-4 px-5 text-center">
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => handleCopyToClipboard(`${row.surname} ના કુળદેવી: ${row.kuldevi} (${row.temple})`)}
                                  className="h-8 w-8 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-400 transition"
                                  title="માહિતી કોપી કરો"
                                >
                                  <span className="material-symbols-outlined text-base">content_copy</span>
                                </button>
                                <a 
                                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚩 *અટક મુજબ કુળદેવી વિગત* 🚩\n\nજ્ઞાતિ: ${row.caste}\nઅટક/શાખ: ${row.surname}\nકુળદેવી: ${row.kuldevi}\nમુખ્ય ધામ: ${row.temple}\n\nવધુ વિગતો માટે ડાઉનલોડ કરો "ગુજરાતી એપ" 🙏`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition"
                                  title="વોટ્સએપ શેર"
                                >
                                  <span className="material-symbols-outlined text-base font-black">share</span>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredMappings.map((row, idx) => (
                      <div key={idx} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-4 rounded-3xl shadow-sm space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-850 rounded-lg text-[10px] text-stone-600 dark:text-stone-400">{row.caste}</span>
                          <span className="font-gujarati font-black text-sm text-stone-800 dark:text-stone-200">{row.surname}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-stone-450 uppercase block font-bold">કુળદેવી</span>
                            <div className="font-gujarati text-sm mt-0.5 block">{renderKuldeviLinks(row.kuldevi)}</div>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-450 uppercase block font-bold">મુખ્ય ધામ</span>
                            <span className="font-gujarati font-bold text-stone-700 dark:text-stone-300 text-xs mt-0.5 flex items-center gap-1 leading-snug">
                              <span className="material-symbols-outlined text-xs text-red-500 shrink-0">location_on</span>
                              {row.temple}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                          <button 
                            onClick={() => handleCopyToClipboard(`${row.surname} ના કુળદેવી: ${row.kuldevi} (${row.temple})`)}
                            className="h-8 w-8 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-400 transition"
                            title="માહિતી કોપી કરો"
                          >
                            <span className="material-symbols-outlined text-base">content_copy</span>
                          </button>
                          <a 
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚩 *અટક મુજબ કુળદેવી વિગત* 🚩\n\nજ્ઞાતિ: ${row.caste}\nઅટક/શાખ: ${row.surname}\nકુળદેવી: ${row.kuldevi}\nમુખ્ય ધામ: ${row.temple}\n\nવધુ વિગતો માટે ડાઉનલોડ કરો "ગુજરાતી એપ" 🙏`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-8 w-8 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition"
                            title="વોટ્સએપ શેર"
                          >
                            <span className="material-symbols-outlined text-base font-black">share</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-stone-50 dark:bg-stone-900/30 rounded-3xl border border-dashed border-stone-250 dark:border-stone-800 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-stone-400">search_off</span>
                  <p className="font-gujarati font-black text-stone-600 dark:text-stone-400">કોઈ મેળ ખાતી અટક કે જ્ઞાતિ મળી નથી.</p>
                  <p className="font-gujarati text-xs text-stone-500">સ્પેલિંગ અથવા ગુજરાતી લખાણ ચકાસી જુઓ, અથવા ઉપર આપેલા બટન પર ક્લિક કરીને નવી માહિતી ઉમેરો!</p>
                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* 5. SECTION B: MATAJI DIRECTORY */}
      {activeSection === 'directory' && (
        <section className="space-y-6">
          
          {/* Mataji Search Bar */}
          <div className="relative max-w-md mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">search</span>
            <input
              type="text"
              placeholder="માતાજીનું નામ લખીને શોધો..."
              value={matajiQuery}
              onChange={(e) => setMatajiQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-900 font-gujarati text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
            />
          </div>

          <div className="space-y-4">
            {filteredMatajis.length > 0 ? (
              filteredMatajis.map((mataji) => {
                const isExpanded = expandedMataji === mataji.id;
                return (
                  <div 
                    key={mataji.id} 
                    id={`mataji-${mataji.id}`}
                    className={`bg-white dark:bg-dark-surface rounded-[2.5rem] overflow-hidden border shadow-sm transition-all duration-300 ${isExpanded ? 'border-primary dark:border-primary/60 ring-2 ring-primary/10 dark:ring-primary/20' : 'border-stone-150 dark:border-stone-800'}`}
                  >
                    {/* Header Clickable Bar */}
                    <button
                      onClick={() => {
                        setExpandedMataji(isExpanded ? null : mataji.id);
                        setActiveSubTab('history');
                      }}
                      className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700 shrink-0">
                          <img src={mataji.image} className="w-full h-full object-cover" alt={mataji.name} />
                        </div>
                        <div>
                          <h3 className="font-gujarati font-black text-lg sm:text-xl text-stone-850 dark:text-stone-150 flex items-center gap-2">
                            {mataji.name}
                            {mataji.hasNoDetails && (
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-md text-[10px] font-bold">
                                માહિતી જરૂરી
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-455 font-gujarati flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-xs text-red-500 shrink-0">location_on</span>
                            {mataji.location}
                          </p>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/40 dark:bg-stone-950/20 p-5 sm:p-6 space-y-6 animate-slide-up">
                        {mataji.hasNoDetails ? (
                          <div className="space-y-4 font-gujarati">
                            <div className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 text-stone-750 dark:text-stone-300">
                              <p className="text-sm font-bold leading-relaxed">
                                ⚠️ આ માતાજી વિશેનો ઇતિહાસ, પૂજા વિધિ અથવા નૈવેદ્યની વિગતવાર માહિતી હાલ ઉપલબ્ધ નથી. જો આપની પાસે આ માહિતી હોય, તો કૃપા કરીને નીચે આપેલા બટન પર ક્લિક કરી ફોર્મ ભરી અમારી સાથે શેર કરો.
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <button 
                                onClick={() => openFeedbackForMataji(mataji.name)}
                                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-gujarati font-black py-2.5 px-5 rounded-xl shadow-sm hover:shadow active:scale-95 text-xs flex items-center gap-1.5 transition-all border-b-2 border-orange-800"
                              >
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                માહિતી મોકલો / ફોર્મ ભરો
                              </button>
                              <a 
                                href="https://forms.gle/om-gujarati-feedback" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-gujarati font-black py-2.5 px-5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-850 active:scale-95 text-xs flex items-center gap-1.5 transition-all shadow-sm"
                              >
                                <span className="material-symbols-outlined text-sm">link</span>
                                🔗 Google Form લિંક
                              </a>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Mataji Banner Detail info */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                              <div className="md:col-span-4 rounded-3xl overflow-hidden shadow-md max-h-48 md:max-h-none aspect-video md:aspect-square">
                                <img src={mataji.image} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt={mataji.name} />
                              </div>

                              <div className="md:col-span-8 space-y-3 font-gujarati text-xs sm:text-sm">
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-3 py-1 bg-orange-100/50 dark:bg-orange-950/30 text-primary rounded-xl font-bold">
                                    🔱 દેવ ધામ: {mataji.location}
                                  </span>
                                  {mataji.vehicle && (
                                    <span className="px-3 py-1 bg-teal/10 text-teal rounded-xl font-bold">
                                      🐆 પવિત્ર વાહન: {mataji.vehicle}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Mantra Callout inside card */}
                                <div className="p-3.5 bg-gradient-to-r from-orange-600/10 to-amber-500/10 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl border border-orange-200/40 dark:border-orange-900/30">
                                  <p className="text-[10px] text-orange-600/70 font-sans font-black uppercase tracking-wider">પવિત્ર મંત્ર</p>
                                  <p className="font-sans font-black text-sm sm:text-base text-orange-955 dark:text-orange-200 mt-0.5 leading-relaxed">
                                    {mataji.mantra}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Internal Subtabs Navigation */}
                            <div className="flex border-b border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar gap-4 pb-0.5">
                              {[
                                { id: 'history', label: '📖 ઇતિહાસ' },
                                { id: 'puja', label: '🪔 પૂજા વિધિ' },
                                { id: 'naivedya', label: '🍪 નૈવેદ્ય' },
                                { id: 'vrat', label: '📅 વ્રત / ઉત્સવ' }
                              ].map((subTab) => (
                                <button
                                  key={subTab.id}
                                  onClick={() => setActiveSubTab(subTab.id)}
                                  className={`pb-3 font-gujarati font-black text-xs sm:text-sm border-b-2 transition-all whitespace-nowrap px-1 ${activeSubTab === subTab.id ? 'border-primary text-primary dark:border-amber-400 dark:text-amber-400 font-black' : 'border-transparent text-stone-500 dark:text-stone-450 hover:text-stone-800 dark:hover:text-stone-200'}`}
                                >
                                  {subTab.label}
                                </button>
                              ))}
                            </div>

                            {/* Subtab content output */}
                            <div className="bg-white dark:bg-dark-surface p-5 rounded-3xl border border-stone-150 dark:border-stone-800 font-gujarati text-sm sm:text-base leading-relaxed text-stone-750 dark:text-stone-300">
                              {activeSubTab === 'history' && (
                                <div className="space-y-2">
                                  <h4 className="font-black text-teal text-sm">ઇતિહાસ અને મહાત્મય</h4>
                                  <p>{mataji.history}</p>
                                </div>
                              )}
                              
                              {activeSubTab === 'puja' && (
                                <div className="space-y-2">
                                  <h4 className="font-black text-teal text-sm">નિયમિત પવિત્ર પૂજા વિધિ</h4>
                                  <p>{mataji.puja}</p>
                                </div>
                              )}
                              
                              {activeSubTab === 'naivedya' && (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-black text-teal text-sm">નૈવેદ્ય (પ્રસાદનો ભોગ)</h4>
                                    <button
                                      onClick={() => handleCopyToClipboard(`નૈવેદ્ય (પ્રસાદ): ${mataji.naivedya}`, 'પ્રસાદ વિગત કોપી કરી લીધી છે!')
                                      }
                                      className="text-xs text-primary dark:text-amber-400 bg-primary/10 dark:bg-amber-400/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 transition"
                                    >
                                      <span className="material-symbols-outlined text-xs">content_copy</span> કોપી કરો
                                    </button>
                                  </div>
                                  <p className="font-black text-base text-stone-850 dark:text-stone-150 bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-100 dark:border-stone-800/80">
                                    🥣 {mataji.naivedya}
                                  </p>
                                </div>
                              )}
                              
                              {activeSubTab === 'vrat' && (
                                <div className="space-y-2">
                                  <h4 className="font-black text-teal text-sm">મુખ્ય ઉત્સવો, મેળા અને વ્રત કથા</h4>
                                  <p>{mataji.vrat || 'આ માતાજીના ઉત્સવોની વિશેષ માહિતી ટૂંક સમયમાં ઉમેરવામાં આવશે. આપની પાસે કોઈ સચોટ માહિતી હોય તો ફોર્મ દ્વારા મોકલી શકો છો.'}</p>
                                </div>
                              )}
                            </div>

                            {/* Action buttons at card footer */}
                            <div className="flex gap-3 justify-end pt-2">
                              <button
                                onClick={() => handleShareMataji(mataji)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-gujarati font-black text-xs py-3 px-5 rounded-2xl flex items-center gap-2 transition shadow active:scale-95 border-b-2 border-emerald-850"
                              >
                                <span className="material-symbols-outlined text-sm font-black">share</span>
                                વોટ્સએપ શેર કરો
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-white dark:bg-dark-surface rounded-[2.5rem] border border-dashed border-stone-250 dark:border-stone-800">
                <p className="font-gujarati font-black text-stone-600 dark:text-stone-400">કોઈ મેળ ખાતી માહિતી મળી નથી.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. INTERACTIVE FEEDBACK FORM MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border-2 border-orange-200/50 dark:border-orange-900/50 shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative animate-scale-up">
            
            {/* Close button */}
            <button 
              onClick={() => setShowFeedbackModal(false)}
              className="absolute right-6 top-6 h-10 w-10 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-500 dark:text-stone-400 rounded-full flex items-center justify-center transition active:scale-90"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            {!feedbackSubmitted ? (
              <>
                <div className="space-y-1">
                  <h3 className="font-gujarati font-black text-2xl text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-primary">edit_note</span>
                    નવી માહિતી / સુધારો મોકલો
                  </h3>
                  <p className="text-xs text-stone-500 font-gujarati leading-relaxed">
                    અહીં દાખલ કરેલી વિગતો અમારા સંપાદકો ચકાસીને એપમાં સાચી માહિતી ચોક્કસ અપડેટ કરશે.
                  </p>
                </div>

                <div className="h-[2px] bg-stone-100 dark:bg-stone-800"></div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 font-gujarati text-xs sm:text-sm">
                  
                  {/* Name and Caste */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૧. તમારું નામ અને જ્ઞાતિ *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ઉદા. રમેશભાઈ પટેલ (કડવા પાટીદાર)"
                      value={feedbackForm.nameCaste}
                      onChange={(e) => setFeedbackForm({...feedbackForm, nameCaste: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    />
                  </div>

                  {/* Surname */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૨. તમારી અટક (Surname / શાખ) *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ઉદા. ભાદાણી / ગોહિલ / ત્રિવેદી..."
                      value={feedbackForm.surname}
                      onChange={(e) => setFeedbackForm({...feedbackForm, surname: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    />
                  </div>

                  {/* Kuldevi Name */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૩. તમારા કુળદેવીનું નામ *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ઉદા. ખોડિયાર માતાજી"
                      value={feedbackForm.kuldeviName}
                      onChange={(e) => setFeedbackForm({...feedbackForm, kuldeviName: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    />
                  </div>

                  {/* Dropdown change type */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૪. કઈ વિગતમાં સુધારો કરવાનો છે?</label>
                    <select
                      value={feedbackForm.changeType}
                      onChange={(e) => setFeedbackForm({...feedbackForm, changeType: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-black focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    >
                      <option value="ઇતિહાસ">માતાજીનો ઇતિહાસ</option>
                      <option value="પૂજા વિધિ">પૂજા વિધિ પદ્ધતિ</option>
                      <option value="પ્રસાદ">નૈવેદ્ય (પ્રસાદ)</option>
                      <option value="અટક મેપિંગ">અટક/જ્ઞાતિનું મેપિંગ</option>
                      <option value="અન્ય વિગત">અન્ય કોઈ નવો ઉમેરો</option>
                    </select>
                  </div>

                  {/* Correction Details */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૫. સુધારો અથવા નવી વિગત જણાવો *</label>
                    <textarea 
                      rows="3"
                      required
                      placeholder="સાચી માહિતી અથવા સુધારો વિગતવાર અહીં લખો..."
                      value={feedbackForm.details}
                      onChange={(e) => setFeedbackForm({...feedbackForm, details: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    />
                  </div>

                  {/* Main Temple Location */}
                  <div className="space-y-1">
                    <label className="font-black text-stone-700 dark:text-stone-300">૬. મુખ્ય મંદિરનું ગામ/શહેર *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="ઉદા. કાગવડ, ઊંઝા, ચોટીલા..."
                      value={feedbackForm.templeLocation}
                      onChange={(e) => setFeedbackForm({...feedbackForm, templeLocation: e.target.value})}
                      className="w-full p-3.5 rounded-xl border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-stone-850 dark:text-stone-150"
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-2 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 py-4 rounded-xl font-black transition active:scale-95"
                    >
                      રદ કરો
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white py-4 rounded-xl font-black transition active:scale-95 shadow border-b-4 border-orange-800"
                    >
                      વિગતો સબમિટ કરો
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // SUBMITTED SUCCESS SCREEN
              <div className="text-center py-6 space-y-6">
                <span className="material-symbols-outlined text-6xl text-emerald-650 animate-bounce">check_circle</span>
                <div className="space-y-2">
                  <h3 className="font-gujarati font-black text-2xl text-stone-850 dark:text-stone-100">ખૂબ ખૂબ આભાર! 🙏</h3>
                  <p className="font-gujarati text-sm text-stone-600 dark:text-stone-450 leading-relaxed px-4">
                    તમે મોકલેલી વિગતો અમારા સિસ્ટમ ડેટાબેઝમાં નોંધાઈ ગઈ છે. યોગ્ય પડતાલ અને ચકાસણી કરીને ટૂંક સમયમાં સાચી માહિતી એપમાં અપડેટ કરવામાં આવશે.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border border-stone-150 dark:border-stone-800 text-left space-y-1 max-w-sm mx-auto text-xs font-gujarati">
                  <p className="text-stone-500 font-bold">નોંધાયેલી માહિતી:</p>
                  <p className="font-black text-stone-800 dark:text-stone-200">અટક: {feedbackForm.surname || '-'}</p>
                  <p className="font-black text-stone-800 dark:text-stone-200">કુળદેવી: {feedbackForm.kuldeviName || '-'}</p>
                  <p className="font-black text-stone-800 dark:text-stone-200">કેટેગરી: {feedbackForm.changeType || '-'}</p>
                </div>

                <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                  <a 
                    href="https://forms.gle/om-gujarati-feedback" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-primary hover:bg-primary-container text-white py-3.5 px-4 rounded-xl font-gujarati font-black text-sm flex items-center justify-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-base">link</span>
                    ગૂગલ ફોર્મ દ્વારા પણ મોકલો
                  </a>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 py-3 px-4 rounded-xl font-gujarati font-black text-xs"
                  >
                    બંધ કરો
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default KuldeviGuide;
