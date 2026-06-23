import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RASHI_DATA, NAMES_DATABASE } from '../utils/name_database';

// Helper to convert English digits to Gujarati digits for rich native aesthetic
const toGujaratiDigits = (num) => {
  const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return gujaratiDigits[parseInt(digit, 10)];
    }
    return digit;
  }).join('');
};

const NamkaranTool = () => {
  const navigate = useNavigate();

  // State Management
  const [selectedRashiId, setSelectedRashiId] = useState('mesh');
  const [genderFilter, setGenderFilter] = useState('boy'); // default: boy
  const [styleFilter, setStyleFilter] = useState('all');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Favorites/Shortlist State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sanskari_favorite_names');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favorites", e);
      return [];
    }
  });

  const [showShortlistDrawer, setShowShortlistDrawer] = useState(false);
  const [copiedName, setCopiedName] = useState(null); // tracking temporary copy success
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sanskari_favorite_names', JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }, [favorites]);

  // Find currently selected Rashi object
  const selectedRashi = useMemo(() => {
    return RASHI_DATA.find(r => r.id === selectedRashiId) || RASHI_DATA[0];
  }, [selectedRashiId]);

  // Get raw names list for this Rashi
  const rashiNames = useMemo(() => {
    return NAMES_DATABASE[selectedRashiId] || [];
  }, [selectedRashiId]);

  // Filtering Logic
  const filteredNames = useMemo(() => {
    return rashiNames.filter(item => {
      // 1. Gender Filter
      if (genderFilter !== 'all' && item.gender !== genderFilter) {
        return false;
      }
      
      // 2. Style Filter
      if (styleFilter !== 'all') {
        if (styleFilter === 'short') {
          if (item.length > 3) return false;
        } else if (item.type !== styleFilter) {
          return false;
        }
      }
      
      // 3. Length Filter
      if (lengthFilter !== 'all') {
        if (lengthFilter === '2' && item.length !== 2) return false;
        if (lengthFilter === '3' && item.length !== 3) return false;
        if (lengthFilter === '4+' && item.length < 4) return false;
      }
      
      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        return item.name.toLowerCase().includes(query);
      }
      
      return true;
    });
  }, [rashiNames, genderFilter, styleFilter, lengthFilter, searchQuery]);

  // Add / Remove from Favorites
  const toggleFavorite = (item) => {
    const isFav = favorites.some(f => f.name === item.name && f.gender === item.gender);
    if (isFav) {
      setFavorites(favorites.filter(f => !(f.name === item.name && f.gender === item.gender)));
    } else {
      setFavorites([...favorites, { ...item, rashiId: selectedRashiId, rashiName: selectedRashi.name.split(' (')[0] }]);
    }
  };

  // Check if a name is favorited
  const isNameFavorited = (item) => {
    return favorites.some(f => f.name === item.name && f.gender === item.gender);
  };

  // Copy individual name to clipboard
  const handleCopy = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      setCopiedName(name);
      setShowCopiedToast(true);
      setTimeout(() => {
        setCopiedName(null);
        setShowCopiedToast(false);
      }, 2000);
    });
  };

  // Share individual name via WhatsApp
  const handleWhatsAppShare = (item) => {
    const rashiNameOnly = selectedRashi.name.split(' (')[0];
    const text = `તમારા બાળક માટે સરસ નામ: *${item.name}* (લિંગ: ${item.gender === 'boy' ? 'છોકરો' : 'છોકરી'}, રાશિ: ${rashiNameOnly}). ગુજરાતી એપ પરથી મેળવેલ.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Share the entire shortlist
  const shareEntireShortlist = () => {
    if (favorites.length === 0) return;
    const namesListText = favorites.map(f => `• ${f.name} (${f.gender === 'boy' ? 'છોકરો' : 'છોકરી'} - રાશિ: ${f.rashiName})`).join('\n');
    const text = `*અમારા બાળકના નામ માટે શોર્ટલિસ્ટ કરેલા નામોની યાદી:*\n\n${namesListText}\n\nગુજરાતી એપ પરથી શેર કરેલ.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    if (window.confirm("શું તમે ખરેખર શોર્ટલિસ્ટ કરેલા બધા જ નામો દૂર કરવા માંગો છો?")) {
      setFavorites([]);
    }
  };

  // Name Style Gujarati labels helper
  const getStyleLabel = (type) => {
    switch (type) {
      case 'modern': return 'આધુનિક';
      case 'god': return 'દેવી-દેવતા';
      case 'traditional': return 'પરંપરાગત';
      default: return type;
    }
  };

  return (
    <div className="animate-fade-in space-y-6 pb-20 text-stone-850 dark:text-stone-100">
      
      {/* Toast Notification for copying */}
      {showCopiedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-teal text-white font-gujarati font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>નકલ સફળતાપૂર્વક થઈ ગઈ છે!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="h-10 w-10 bg-white dark:bg-dark-surface rounded-xl shadow-sm flex items-center justify-center text-primary dark:text-dark-accent border border-primary/10 dark:border-dark-accent/10 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="font-gujarati font-black text-2xl text-primary dark:text-dark-accent leading-tight">નામકરણ સંસ્કાર સાધન</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-gujarati">૭૨૦+ લોકપ્રિય અને સુંદર ગુજરાતી નામો</p>
          </div>
        </div>

        {/* Shortlist Floating Badge Button */}
        <button 
          onClick={() => setShowShortlistDrawer(true)}
          className="relative h-11 px-4 bg-gradient-to-r from-teal-600 to-yellow-700 dark:from-dark-accent dark:to-teal-800 text-white rounded-2xl flex items-center gap-2 font-gujarati font-bold text-sm shadow-md active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-white animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <span>શોર્ટલિસ્ટ</span>
          {favorites.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-dark-bg animate-pulse">
              {toGujaratiDigits(favorites.length)}
            </span>
          )}
        </button>
      </div>

      {/* Rashi Selection Carousel/Grid */}
      <section className="bg-white dark:bg-dark-surface rounded-[2rem] p-6 shadow-sm border border-black/5 dark:border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary dark:text-dark-accent">explore</span>
            ૧. તમારી રાશિ પસંદ કરો
          </h3>
          <span className="text-xs bg-primary/10 dark:bg-dark-accent/20 text-primary dark:text-dark-accent font-gujarati font-bold px-3 py-1 rounded-full">
            મૂળાક્ષર: {selectedRashi.letters}
          </span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {RASHI_DATA.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRashiId(r.id);
                setSearchQuery(''); // reset search on rashi change
              }}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                selectedRashiId === r.id 
                  ? 'bg-primary-container/10 border-primary text-primary scale-102 shadow-sm dark:bg-dark-accent/20 dark:border-dark-accent dark:text-dark-accent' 
                  : 'bg-stone-50 dark:bg-stone-900 border-transparent text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80'
              }`}
            >
              <span className="font-gujarati font-bold text-sm text-center leading-tight">
                {r.name.split(' (')[0]}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 font-gujarati mt-0.5">
                {r.letters}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Advanced Filters Section */}
      <section className="bg-gradient-to-br from-primary-container/5 via-white to-primary-container/5 dark:from-dark-surface/40 dark:via-dark-surface dark:to-dark-surface/60 rounded-[2rem] p-6 shadow-sm border border-primary-container/10 dark:border-teal-950/40 space-y-6">
        
        <h3 className="font-gujarati font-black text-lg text-stone-850 dark:text-stone-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary dark:text-dark-accent">tune</span>
          ૨. તમારી પસંદગીને ફિલ્ટર કરો
        </h3>

        {/* 1. Gender Filter */}
        <div className="space-y-2">
          <label className="font-gujarati font-bold text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 uppercase tracking-wider">
            <span className="material-symbols-outlined text-xs">wc</span> બાળકની જાતિ
          </label>
          <div className="flex gap-2">
            {[
              { id: 'boy', label: 'છોકરો (Boy)', icon: 'male', activeClass: 'bg-blue-600 text-white dark:bg-blue-500 shadow-md' },
              { id: 'girl', label: 'છોકરી (Girl)', icon: 'female', activeClass: 'bg-pink-600 text-white dark:bg-pink-500 shadow-md' },
              { id: 'all', label: 'બંને (All)', icon: 'star', activeClass: 'bg-stone-800 text-white dark:bg-stone-700 shadow-md' }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => setGenderFilter(option.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-gujarati font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  genderFilter === option.id 
                    ? option.activeClass 
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 2. Name Style Filter */}
          <div className="space-y-2">
            <label className="font-gujarati font-bold text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">palette</span> નામનો પ્રકાર / શૈલી
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'બધા પ્રકાર' },
                { id: 'modern', label: 'આધુનિક' },
                { id: 'god', label: 'દેવી-દેવતા' },
                { id: 'traditional', label: 'પરંપરાગત' },
                { id: 'short', label: 'ટૂંકા નામ (<= ૩ અક્ષર)' }
              ].map(style => (
                <button
                  key={style.id}
                  onClick={() => setStyleFilter(style.id)}
                  className={`py-2 px-3 rounded-lg font-gujarati font-bold text-xs text-center transition-all ${
                    styleFilter === style.id
                      ? 'bg-primary/10 border border-primary text-primary dark:bg-dark-accent/25 dark:border-dark-accent dark:text-dark-accent font-black'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Name Length Filter */}
          <div className="space-y-2">
            <label className="font-gujarati font-bold text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs">format_size</span> અક્ષરની સંખ્યા
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'ગમે તેટલા અક્ષર' },
                { id: '2', label: '૨ અક્ષર' },
                { id: '3', label: '૩ અક્ષર' },
                { id: '4+', label: '૪ કે તેથી વધુ અક્ષર' }
              ].map(length => (
                <button
                  key={length.id}
                  onClick={() => setLengthFilter(length.id)}
                  className={`py-2.5 px-3 rounded-xl font-gujarati font-bold text-xs text-center transition-all ${
                    lengthFilter === length.id
                      ? 'bg-teal/10 border border-teal text-teal dark:bg-emerald-950/20 dark:border-emerald-500 dark:text-emerald-400 font-black'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {length.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Real-time Search Input */}
        <div className="space-y-2 pt-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
              search
            </span>
            <input
              type="text"
              placeholder="બાળકનું નામ અહિંથી શોધો..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 font-gujarati pl-12 pr-10 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:border-primary dark:focus:border-dark-accent text-sm transition-all focus:ring-4 focus:ring-primary/10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 hover:text-stone-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

      </section>

      {/* Name Options Results Grid */}
      <section className="space-y-4">
        
        {/* Results Counter & Rashi Info */}
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <h4 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-200">
              નામોની સૂચિ
            </h4>
            <span className="bg-primary/10 dark:bg-dark-accent/20 text-primary dark:text-dark-accent text-xs font-gujarati font-black px-2.5 py-1 rounded-full">
              {toGujaratiDigits(filteredNames.length)} મળ્યા
            </span>
          </div>
          
          <span className="text-xs text-stone-500 dark:text-stone-400 font-gujarati">
            રાશિ મૂળાક્ષરો: <span className="font-bold text-primary dark:text-dark-accent">{selectedRashi.letters}</span>
          </span>
        </div>

        {/* Empty State */}
        {filteredNames.length === 0 ? (
          <div className="bg-white dark:bg-dark-surface border border-stone-200/60 dark:border-stone-800/80 rounded-3xl p-12 text-center space-y-3">
            <span className="material-symbols-outlined text-5xl text-stone-300 dark:text-stone-600 animate-pulse">
              search_off
            </span>
            <h5 className="font-gujarati font-bold text-lg text-stone-700 dark:text-stone-300">કોઈ મેળ ખાતા નામ નથી મળ્યા!</h5>
            <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              તમે પસંદ કરેલા ફિલ્ટર અથવા સર્ચ ક્વેરી મુજબ નામ નથી. કૃપા કરીને થોડું સામાન્ય ફિલ્ટર રાખો.
            </p>
            <button 
              onClick={() => {
                setGenderFilter('all');
                setStyleFilter('all');
                setLengthFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 inline-flex items-center gap-2 text-primary dark:text-dark-accent font-gujarati font-bold text-xs hover:underline"
            >
              ફિલ્ટર્સ ક્લિયર કરો
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredNames.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-dark-surface/40 p-4.5 rounded-3xl border border-stone-200/60 dark:border-stone-850 shadow-sm hover:shadow-md hover:border-primary/40 dark:hover:border-dark-accent/40 transition-all duration-300 flex justify-between items-center group relative overflow-hidden"
              >
                {/* Decorative gender colored accent border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.gender === 'boy' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                
                <div className="pl-2 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-gujarati font-black text-xl text-stone-850 dark:text-stone-100">
                      {item.name}
                    </span>
                    <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      item.gender === 'boy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200'
                    }`}>
                      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'wght' 700" }}>
                        {item.gender === 'boy' ? 'male' : 'female'}
                      </span>
                    </span>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <span className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 font-gujarati font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {getStyleLabel(item.type)}
                    </span>
                    <span className="bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 font-gujarati font-bold text-[10px] px-2 py-0.5 rounded-md">
                      {toGujaratiDigits(item.length)} અક્ષર
                    </span>
                  </div>
                </div>

                {/* Individual Action buttons */}
                <div className="flex items-center gap-1.5">
                  {/* Copy to Clipboard */}
                  <button 
                    onClick={() => handleCopy(item.name)}
                    className="h-9 w-9 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 active:scale-90 transition-all flex items-center justify-center"
                    title="નકલ કરો"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {copiedName === item.name ? 'check' : 'content_copy'}
                    </span>
                  </button>

                  {/* Share on WhatsApp */}
                  <button 
                    onClick={() => handleWhatsAppShare(item)}
                    className="h-9 w-9 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 active:scale-90 transition-all flex items-center justify-center"
                    title="વોટ્સએપ પર શેર કરો"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>

                  {/* Favorite Toggle Button */}
                  <button 
                    onClick={() => toggleFavorite(item)}
                    className={`h-9 w-9 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-90 transition-all flex items-center justify-center ${
                      isNameFavorited(item) ? 'text-emerald-500 bg-rose-50 dark:bg-rose-950/30' : 'text-stone-400 hover:text-emerald-600 dark:hover:text-rose-400'
                    }`}
                    title={isNameFavorited(item) ? "શોર્ટલિસ્ટમાંથી દૂર કરો" : "શોર્ટલિસ્ટમાં ઉમેરો"}
                  >
                    <span 
                      className="material-symbols-outlined text-lg" 
                      style={{ fontVariationSettings: isNameFavorited(item) ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shortlist/Favorites Panel (Slide Drawer / Expandable Bottom Sheet) */}
      {showShortlistDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end justify-center">
          {/* Overlay background */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowShortlistDrawer(false)}
          ></div>

          {/* Drawer Content */}
          <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-t-[2.5rem] max-h-[80vh] flex flex-col shadow-2xl border-t border-teal-100/10 z-10 transition-transform duration-300 transform translate-y-0 relative">
            
            {/* Grabber line */}
            <div className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3"></div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h4 className="font-gujarati font-black text-xl text-stone-850 dark:text-stone-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  શોર્ટલિસ્ટ કરેલા નામો
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-gujarati">
                  બાળક માટે પસંદ કરેલા મનપસંદ નામો
                </p>
              </div>
              
              <button 
                onClick={() => setShowShortlistDrawer(false)}
                className="h-8 w-8 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center hover:bg-stone-200"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Favorites Body List */}
            <div className="p-6 overflow-y-auto flex-1 no-scrollbar space-y-4">
              {favorites.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-stone-300 dark:text-stone-700">
                    favorite_border
                  </span>
                  <p className="font-gujarati text-stone-500 dark:text-stone-400 text-sm">કોઈ મનપસંદ નામ હજુ ઉમેર્યા નથી.</p>
                  <p className="font-gujarati text-[10px] text-stone-400 dark:text-stone-500">નામની બાજુના હૃદય (❤️) પર ક્લિક કરીને ઉમેરો.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav, index) => (
                    <div 
                      key={index} 
                      className="bg-stone-50 dark:bg-stone-900/50 p-3.5 rounded-2xl flex justify-between items-center border border-stone-200/40 dark:border-stone-850/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-100">
                          {fav.name}
                        </span>
                        
                        <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          fav.gender === 'boy' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200'
                        }`}>
                          <span className="material-symbols-outlined text-[9px]" style={{ fontVariationSettings: "'wght' 700" }}>
                            {fav.gender === 'boy' ? 'male' : 'female'}
                          </span>
                        </span>

                        <span className="text-[10px] text-stone-400 dark:text-stone-500 font-gujarati">
                          (રાશિ: {fav.rashiName})
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {/* Copy name */}
                        <button 
                          onClick={() => handleCopy(fav.name)}
                          className="h-8 w-8 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-850 text-stone-500 dark:text-stone-400 flex items-center justify-center active:scale-90 transition-transform"
                          title="નકલ કરો"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                        
                        {/* Remove favorite */}
                        <button 
                          onClick={() => toggleFavorite(fav)}
                          className="h-8 w-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-emerald-500 flex items-center justify-center active:scale-90 transition-transform"
                          title="દૂર કરો"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions for Favorites */}
            {favorites.length > 0 && (
              <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200/40 dark:border-stone-850 flex gap-3">
                <button
                  onClick={clearAllFavorites}
                  className="flex-1 py-3 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl font-gujarati font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-300 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                  બધા સાફ કરો
                </button>
                
                <button
                  onClick={shareEntireShortlist}
                  className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-gujarati font-bold text-xs flex items-center justify-center gap-1.5 hover:shadow-md active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  વોટ્સએપ પર યાદી મોકલો
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default NamkaranTool;
