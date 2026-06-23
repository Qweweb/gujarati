import { useState, useEffect } from 'react';
import { ScratchCardModal, fetchMatchingCoupon } from './ScratchRewards';
import { TRAVEL_DATABASE } from '../utils/travel_database';

// 5 Theme Collections for Master Badges (including the new Hidden Gem Hunter)
const THEME_COLLECTIONS = [
  {
    id: "t_shakti",
    name_gu: "શક્તિ ઉપાસક 🔱",
    name_en: "Shakti Upasak",
    desc: "અંબાજી, પાવાગઢ અને બહુચરાજીના પવિત્ર દર્શન કરી ભક્તિ બેજ મેળવો.",
    required: ["s_ambaji", "s_pavagadh", "s_bahucharaji"],
    icon: "🔱",
    color: "from-emerald-600 to-pink-650"
  },
  {
    id: "t_gandhi",
    name_gu: "ગાંધીવાદી પથિક 🕊️",
    name_en: "Gandhian Path",
    desc: "સાબરમતી આશ્રમ અને દાંડી મેમોરિયલ જઈ રાષ્ટ્રપિતાના સત્ય પથને જાણો.",
    required: ["s_sabarmati", "s_dandi"],
    icon: "🕊️",
    color: "from-stone-600 to-stone-800"
  },
  {
    id: "t_wildlife",
    name_gu: "વન્યજીવ પ્રેમી 🦁",
    name_en: "Wildlife Explorer",
    desc: "સાસણ ગીર સફારી, વેળાવદર બ્લેકબક પાર્ક અને રાયોલીના પ્રાણીઓ જાણો.",
    required: ["s_gir", "s_velavadar", "s_raiyoli"],
    icon: "🦁",
    color: "from-emerald-500 to-teal-650"
  },
  {
    id: "t_coastal",
    name_gu: "દરિયાઈ સાહસિક 🌊",
    name_en: "Coastal Explorer",
    desc: "માંડવી પેલેસ, શિવરાજપુર બીચ અને તિથલ બીચના સ્ટેમ્પ્સ મેળવો.",
    required: ["s_mandvi", "s_shivrajpur", "s_tithal"],
    icon: "🌊",
    color: "from-blue-500 to-cyan-650"
  },
  {
    id: "t_hiddengem",
    name_gu: "રત્ન શોધક 🔍",
    name_en: "Hidden Gem Hunter",
    desc: "કાળો ડુંગર, રાયોલી ડાયનાસોર પાર્ક અને ગિરા ધોધના પ્રખ્યાત ઓફબીટ રત્નો મેળવો.",
    required: ["s_kalo_dungar", "s_raiyoli", "s_gira_waterfall"],
    icon: "🔍",
    color: "from-purple-500 to-teal-650"
  }
];

// List of all 33 Districts for dropdown selection
const GUJARAT_DISTRICTS = [
  { key: "ahmedabad", name_gu: "અમદાવાદ", name_en: "Ahmedabad" },
  { key: "amreli", name_gu: "અમરેલી", name_en: "Amreli" },
  { key: "anand", name_gu: "આણંદ", name_en: "Anand" },
  { key: "aravalli", name_gu: "અરવલ્લી", name_en: "Aravalli" },
  { key: "banaskantha", name_gu: "બનાસકાંઠા", name_en: "Banaskantha" },
  { key: "bharuch", name_gu: "ભરૂચ", name_en: "Bharuch" },
  { key: "bhavnagar", name_gu: "ભાવનગર", name_en: "Bhavnagar" },
  { key: "botad", name_gu: "બોટાદ", name_en: "Botad" },
  { key: "chhotaudepur", name_gu: "છોટા ઉદેપુર", name_en: "Chhotaudepur" },
  { key: "dahod", name_gu: "દાહોદ", name_en: "Dahod" },
  { key: "dang", name_gu: "ડાંગ", name_en: "Dang" },
  { key: "dwarka", name_gu: "દેવભૂમિ દ્વારકા", name_en: "Devbhumi Dwarka" },
  { key: "gandhinagar", name_gu: "ગાંધીનગર", name_en: "Gandhinagar" },
  { key: "gir_somnath", name_gu: "ગીર સોમનાથ", name_en: "Gir Somnath" },
  { key: "jamnagar", name_gu: "જામનગર", name_en: "Jamnagar" },
  { key: "junagadh", name_gu: "જૂનાગઢ", name_en: "Junagadh" },
  { key: "kheda", name_gu: "ખેડા", name_en: "Kheda" },
  { key: "kutch", name_gu: "કચ્છ", name_en: "Kutch" },
  { key: "mahisagar", name_gu: "મહીસાગર", name_en: "Mahisagar" },
  { key: "mehsana", name_gu: "મહેસાણા", name_en: "Mehsana" },
  { key: "morbi", name_gu: "મોરબી", name_en: "Morbi" },
  { key: "narmada", name_gu: "નર્મદા", name_en: "Narmada" },
  { key: "navsari", name_gu: "નવસારી", name_en: "Navsari" },
  { key: "panchmahal", name_gu: "પંચમહાલ", name_en: "Panchmahal" },
  { key: "patan", name_gu: "પાટણ", name_en: "Patan" },
  { key: "porbandar", name_gu: "પોરબંદર", name_en: "Porbandar" },
  { key: "rajkot", name_gu: "રાજકોટ", name_en: "Rajkot" },
  { key: "sabarkantha", name_gu: "સાબરકાંઠા", name_en: "Sabarkantha" },
  { key: "surat", name_gu: "સુરત", name_en: "Surat" },
  { key: "surendranagar", name_gu: "સુરેન્દ્રનગર", name_en: "Surendranagar" },
  { key: "tapi", name_gu: "તાપી", name_en: "Tapi" },
  { key: "vadodara", name_gu: "વડોદરા", name_en: "Vadodara" },
  { key: "valsad", name_gu: "વલસાડ", name_en: "Valsad" }
];

const getPassportStamps = () => {
  return JSON.parse(localStorage.getItem('otlo_passport_stamps') || '{}');
};

const savePassportStamp = (stampId) => {
  const stamps = getPassportStamps();
  if (!stamps[stampId]) {
    stamps[stampId] = new Date().toLocaleDateString('gu-IN');
    localStorage.setItem('otlo_passport_stamps', JSON.stringify(stamps));
    
    // Reward Coins
    const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
    localStorage.setItem('gujarat_coins', (coins + 50).toString());
    
    // Dispatch events
    window.dispatchEvent(new Event('coins-updated'));
    return true;
  }
  return false;
};

// Haversine distance formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock coordinates for simulated locations
const MOCK_COORDINATES = {
  ahmedabad: { lat: 23.0225, lon: 72.5714 },
  rajkot: { lat: 22.3039, lon: 70.8022 },
  surat: { lat: 21.1702, lon: 72.8311 },
  dwarka: { lat: 22.2442, lon: 68.9686 }
};

export default function TravelPassport() {
  const [stamps, setStamps] = useState({});
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [activeZone, setActiveZone] = useState("Mega"); // 'Mega', 'North', 'Saurashtra', 'Central', 'South', 'Badges'
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  // Sharing & Collected Filter States
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareName, setShareName] = useState("અનિલભાઈ શાહ");
  const [showCollectedOnly, setShowCollectedOnly] = useState(false);

  // Advanced Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [seasonFilter, setSeasonFilter] = useState("All");
  const [accessibilityFilter, setAccessibilityFilter] = useState("All");
  
  // Radius Search States
  const [radiusFilter, setRadiusFilter] = useState("All"); // 'All', '50', '100'
  const [simulatedLocation, setSimulatedLocation] = useState("real"); // 'real', 'ahmedabad', 'rajkot', 'surat', 'dwarka'
  const [currentCoords, setCurrentCoords] = useState(null);

  // Expanding Detail Panel State
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("gems"); // 'gems', 'route', 'taste', 'artisan', 'diary'

  // Scrapbook / Diary States
  const [diary, setDiary] = useState({});
  const [diaryNote, setDiaryNote] = useState("");
  const [diarySticker, setDiarySticker] = useState("📸");

  // Crowdsourcing Modal State
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [suggestNameGu, setSuggestNameGu] = useState("");
  const [suggestNameEn, setSuggestNameEn] = useState("");
  const [suggestDistrict, setSuggestDistrict] = useState("ahmedabad");
  const [suggestTaluka, setSuggestTaluka] = useState("");
  const [suggestCategory, setSuggestCategory] = useState("nature");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);

  useEffect(() => {
    const loadedStamps = getPassportStamps();
    setStamps(loadedStamps);
    checkAndUnlockBadges(loadedStamps);

    // Load diary entries
    const loadedDiary = JSON.parse(localStorage.getItem('otlo_passport_diary') || '{}');
    setDiary(loadedDiary);

    // Load suggested places
    const loadedSuggestions = JSON.parse(localStorage.getItem('otlo_suggested_places') || '[]');
    setSuggestedPlaces(loadedSuggestions);
  }, []);

  const checkAndUnlockBadges = (currentStamps) => {
    const unlocked = [];
    const savedUnlocked = JSON.parse(localStorage.getItem('otlo_unlocked_badges') || '[]');
    
    THEME_COLLECTIONS.forEach(theme => {
      const hasAll = theme.required.every(reqId => !!currentStamps[reqId]);
      if (hasAll) {
        unlocked.push(theme.id);
        if (!savedUnlocked.includes(theme.id)) {
          savedUnlocked.push(theme.id);
          localStorage.setItem('otlo_unlocked_badges', JSON.stringify(savedUnlocked));
          
          // Reward extra +100 coins
          const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
          localStorage.setItem('gujarat_coins', (coins + 100).toString());
          window.dispatchEvent(new Event('coins-updated'));
          
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('show-toast', { 
              detail: { message: `🏆 અદ્ભુત! તમે "${theme.name_gu}" માસ્ટર બેજ જીત્યો! (+૧૦૦ બોનસ કોઈન્સ)` } 
            }));
          }, 1000);
        }
      }
    });
    setUnlockedBadges(savedUnlocked);
  };

  const handleVerifyCheckIn = (landmark) => {
    if (!navigator.geolocation) {
      alert("તમારા બ્રાઉઝરમાં જીપીએસની સુવિધા નથી.");
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const targetLat = landmark.lat;
        const targetLon = landmark.lon;
        const distance = calculateDistance(latitude, longitude, targetLat, targetLon);
        
        setLoading(false);
        if (distance < 5.0) { // Unlocks if within 5 km
          const unlocked = savePassportStamp(landmark.id);
          if (unlocked) {
            if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
            const updated = getPassportStamps();
            setStamps(updated);
            checkAndUnlockBadges(updated);
            
            const userLoc = JSON.parse(localStorage.getItem('user_location') || 'null');
            const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
            fetchMatchingCoupon(userLoc, profile).then(coupon => {
              setActiveCoupon(coupon);
            });
            window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `🎖️ સફળ ચેક-ઇન! ${landmark.name_gu} સ્ટેમ્પ અનલોક થયો! (+૫૦ સિક્કા)` } }));
          } else {
            alert("આ સ્ટેમ્પ પહેલેથી જ અનલોક થયેલો છે.");
          }
        } else {
          alert(`❌ તમે હજી આ સ્થાનથી આશરે ${distance.toFixed(1)} કિમી દૂર છો. વેરિફાઇ કરવા માટે આ ઐતિહાસિક સ્થળથી ૫ કિમીની નજીક હોવા જોઈએ!`);
        }
      },
      (error) => {
        setLoading(false);
        console.error("GPS Check-in error:", error);
        alert("GPS પરમિશન મળી નથી. કૃપા કરીને ફોનનું લોકેશન ચાલુ કરો.");
      },
      { timeout: 10000 }
    );
  };

  const handleSimulateCheckIn = (landmark) => {
    const unlocked = savePassportStamp(landmark.id);
    if (unlocked) {
      if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
      const updated = getPassportStamps();
      setStamps(updated);
      checkAndUnlockBadges(updated);
      
      const userLoc = JSON.parse(localStorage.getItem('user_location') || 'null');
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      fetchMatchingCoupon(userLoc, profile).then(coupon => {
        setActiveCoupon(coupon);
      });
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `🎖️ સિમ્યુલેટેડ ચેક-ઇન સફળ! ${landmark.name_gu} સ્ટેમ્પ અનલોક થયો! (+૫૦ સિક્કા)` } }));
    } else {
      alert("આ સ્ટેમ્પ પહેલેથી જ અનલોક થયેલો છે.");
    }
  };

  // Simulated GPS positioning
  const handleRadiusChange = (val) => {
    setRadiusFilter(val);
    if (val === "All") {
      setCurrentCoords(null);
      return;
    }

    if (simulatedLocation !== "real") {
      setCurrentCoords(MOCK_COORDINATES[simulatedLocation]);
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { message: `📍 લોકેશન સિમ્યુલેશન: ${simulatedLocation.toUpperCase()} ના આધારે ફિલ્ટર કર્યું.` } 
      }));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        setCurrentCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        setLoading(false);
        setRadiusFilter("All");
        console.error("GPS error:", error);
        alert("GPS લોકેશન મેળવી શકાયું નથી. કૃપા કરીને સિમ્યુલેટેડ લોકેશન સિલેક્ટ કરો.");
      }
    );
  };

  // Local Artisan simulated contact toast
  const handleContactArtisan = (landmark) => {
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: `📞 સંપર્ક સિમ્યુલેટ થયો: ${landmark.district_gu} ગ્રામોદ્યોગ કમિશન સાથે જોડાણ કરાયું!` } 
    }));
  };

  // Save diary entry
  const handleSaveDiary = (landmarkId) => {
    const updatedDiary = {
      ...diary,
      [landmarkId]: {
        note: diaryNote,
        sticker: diarySticker,
        date: stamps[landmarkId] || new Date().toLocaleDateString('gu-IN')
      }
    };
    setDiary(updatedDiary);
    localStorage.setItem('otlo_passport_diary', JSON.stringify(updatedDiary));
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `📖 પ્રવાસ ડાયરી યાદો સફળતાપૂર્વક સાચવી લેવામાં આવી છે!` } }));
  };

  // Suggest a place logic
  const handleSuggestPlace = (e) => {
    e.preventDefault();
    if (!suggestNameGu || !suggestNameEn || !suggestDesc) {
      alert("કૃપા કરીને બધી વિગતો ભરો.");
      return;
    }

    const newPlace = {
      id: `custom_${Date.now()}`,
      name_gu: suggestNameGu,
      name_en: suggestNameEn,
      district_gu: GUJARAT_DISTRICTS.find(d => d.key === suggestDistrict)?.name_gu || suggestDistrict,
      district_en: suggestDistrict,
      taluka_gu: suggestTaluka,
      category: suggestCategory,
      description: suggestDesc,
      dateAdded: new Date().toLocaleDateString('gu-IN')
    };

    const updatedList = [...suggestedPlaces, newPlace];
    setSuggestedPlaces(updatedList);
    localStorage.setItem('otlo_suggested_places', JSON.stringify(updatedList));

    // Reward +50 coins
    const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
    localStorage.setItem('gujarat_coins', (coins + 50).toString());
    window.dispatchEvent(new Event('coins-updated'));

    // Reset Form
    setSuggestNameGu("");
    setSuggestNameEn("");
    setSuggestTaluka("");
    setSuggestDesc("");
    setSuggestModalOpen(false);

    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: `🎉 સૂચન માટે આભાર! નવી ઓફબીટ જગ્યા સબમિટ થઈ. (+૫૦ સિક્કા)` } 
    }));
  };

  // Filtering landmarks list
  const filteredLandmarks = TRAVEL_DATABASE.filter(landmark => {
    // 1. Zone filter
    if (activeZone !== "All" && activeZone !== "Badges") {
      if (landmark.zone !== activeZone) return false;
    }

    // 2. Search query filter (matches name, district, details)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = landmark.name_gu.toLowerCase().includes(q) || landmark.name_en.toLowerCase().includes(q);
      const matchDistrict = landmark.district_gu.toLowerCase().includes(q) || landmark.district_en.toLowerCase().includes(q);
      const matchTitle = landmark.title.toLowerCase().includes(q);
      if (!matchName && !matchDistrict && !matchTitle) return false;
    }

    // 3. District dropdown filter
    if (selectedDistrict !== "All") {
      if (landmark.district_en.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    }

    // 4. Category filter
    if (categoryFilter !== "All") {
      if (landmark.filters.type !== categoryFilter) return false;
    }

    // 5. Season filter
    if (seasonFilter !== "All") {
      if (landmark.filters.best_time !== seasonFilter && landmark.filters.best_time !== "all") return false;
    }

    // 6. Accessibility filter
    if (accessibilityFilter !== "All") {
      if (landmark.filters.accessibility !== accessibilityFilter) return false;
    }

    // 7. Geolocation Radius filter
    if (radiusFilter !== "All" && currentCoords) {
      const dist = calculateDistance(currentCoords.lat, currentCoords.lon, landmark.lat, landmark.lon);
      if (dist > parseInt(radiusFilter, 10)) return false;
    }

    // 8. Filter collected only
    if (showCollectedOnly) {
      if (!stamps[landmark.id]) return false;
    }

    return true;
  });

  const totalStampsCount = Object.keys(stamps).length;

  if (!isCoverOpen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-fade-in">
        <div 
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate([100]);
            setIsCoverOpen(true);
          }}
          className="w-full max-w-sm aspect-[3/4] bg-[#5c2400] dark:bg-stone-900 rounded-[2.5rem] shadow-2xl border-8 border-yellow-700/40 p-8 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-500 hover:scale-[1.03] active:scale-95 hover:shadow-yellow-600/10 hover:shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle gold lines / patterns */}
          <div className="absolute inset-4 border border-yellow-600/25 rounded-[1.8rem] pointer-events-none"></div>
          <div className="absolute inset-5 border-2 border-double border-yellow-600/20 rounded-[1.5rem] pointer-events-none"></div>
          
          <div className="space-y-2 mt-4 z-10">
            <span className="text-yellow-400 font-bold uppercase tracking-widest text-[10px] bg-amber-550/10 px-3 py-1 rounded-full border border-yellow-600/20">
              ગુજરાત પ્રવાસન વિભાગ 🛡️
            </span>
            <h1 className="font-gujarati font-black text-3xl text-yellow-100 tracking-wide mt-3 drop-shadow-md">
              ગુજરાત પ્રવાસ પાસપોર્ટ
            </h1>
            <p className="font-gujarati text-yellow-200/50 text-[10px] tracking-widest uppercase font-bold">
              Gujarat Travel Passport
            </p>
          </div>

          <div className="my-8 z-10 relative">
            <div className="h-32 w-32 rounded-full border-4 border-double border-yellow-600/35 flex items-center justify-center bg-yellow-600/5 group-hover:scale-105 transition-transform duration-500">
              <span className="material-symbols-outlined text-6xl text-yellow-300 filter drop-shadow-[0_2px_5px_rgba(245,158,11,0.3)] animate-pulse">temple_hindu</span>
            </div>
            <div className="absolute -right-4 -bottom-2 h-12 w-12 rounded-full bg-emerald-700/80 border-2 border-dashed border-red-400 text-white text-[9px] font-gujarati font-bold flex items-center justify-center rotate-12 uppercase select-none shadow-md">
              કલ્ચરલ 🚩
            </div>
          </div>

          <div className="space-y-4 mb-4 z-10 w-full">
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent w-full"></div>
            <button
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-amber-450 hover:to-amber-550 text-stone-950 font-gujarati font-black text-xs px-8 py-3.5 rounded-2xl shadow-lg transition-all w-full flex items-center justify-center gap-2 transform active:scale-95 group-hover:animate-bounce-slow"
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              પાસપોર્ટ બુક ખોલો ➔
            </button>
            <p className="font-gujarati text-[10px] text-yellow-200/40">
              *ક્લિક કરો અથવા બુક ઓપન કરો
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-gujarati font-black text-4xl text-primary dark:text-dark-accent">ડિજિટલ ગુજરાત પ્રવાસ પાસપોર્ટ 📖</h2>
          <p className="font-gujarati text-stone-550 dark:text-stone-400 text-lg">ગુજરાતના ૩૩ જિલ્લાના પ્રખ્યાત અને ઓફબીટ સ્થળો પર ચેક-ઇન કરી કલ્ચરલ ડાયરી બનાવો.</p>
        </div>
        <button
          onClick={() => setSuggestModalOpen(true)}
          className="bg-gradient-to-r from-yellow-600 to-primary text-white px-5 py-3 rounded-2xl font-gujarati font-black text-xs shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-1 shrink-0 self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-sm">add_location_alt</span>
          નવી છુપી જગ્યા સજેસ્ટ કરો ✍️
        </button>
      </div>

      {/* Book Cover Stat Box */}
      <section className="bg-[#2b1400] dark:bg-stone-950 text-yellow-100 rounded-[2.5rem] p-8 shadow-xl border-4 border-yellow-700/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-700/20 via-[#2b1400]/50 to-stone-950/95 pointer-events-none"></div>
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className="bg-yellow-600/20 text-yellow-300 border border-yellow-600/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-1">
            ગુજરાત પ્રવાસન ડાયરી 🛡️
          </span>
          <h3 className="font-gujarati font-black text-3xl">ગુજરાત પ્રવાસ પાસપોર્ટ બુક (૧૦૦% ઓફલાઇન)</h3>
          <p className="font-gujarati text-xs text-yellow-200/70 max-w-xl leading-relaxed">
            તમારો ગુજરાત જીપીએસ પાસપોર્ટ. નજીક જઈ વેરિફાય કરો અથવા ટેસ્ટ કરવા સિમ્યુલેટ કરો. દરેક વિશિષ્ટ જગ્યા પર ક્લિક કરતાં તેના **છુપા રત્નો**, **રૂટ પ્લાન**, **સ્થાનિક ખાણી-પીણી** અને **સ્થાનિક કારીગરો** ની વિગતો ખુલશે!
          </p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto relative z-10">
          <div className="text-center bg-yellow-600/10 border border-yellow-600/25 px-6 py-4 rounded-3xl flex gap-6 items-center justify-center w-full">
            <div>
              <p className="font-gujarati text-[9px] text-yellow-300 uppercase tracking-widest font-bold">અનલોક સ્ટેમ્પ્સ</p>
              <h4 className="font-headline font-black text-3xl mt-1 text-white">{totalStampsCount} / {TRAVEL_DATABASE.length}</h4>
            </div>
            <div className="w-px h-10 bg-yellow-600/20" />
            <div>
              <p className="font-gujarati text-[9px] text-yellow-300 uppercase tracking-widest font-bold">થીમ બેજીસ</p>
              <h4 className="font-headline font-black text-3xl mt-1 text-white">{unlockedBadges.length} / {THEME_COLLECTIONS.length}</h4>
            </div>
          </div>
          <button
            onClick={() => {
              try {
                const profile = localStorage.getItem('user_profile');
                if (profile) {
                  const data = JSON.parse(profile);
                  if (data.name) setShareName(data.name);
                }
              } catch (e) {}
              setShowShareModal(true);
            }}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-stone-900 py-2.5 rounded-2xl font-gujarati font-black text-xs transition-all transform hover:scale-[1.02] flex items-center justify-center gap-1 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            પાસપોર્ટ શેર કરો (Share Card)
          </button>
        </div>
      </section>

      {/* Zonal Tabs */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-stone-200 dark:border-stone-800">
        {[
          { key: "Mega", label: "🏆 ગોલ્ડન સ્ટેમ્પ્સ" },
          { key: "All", label: "🗺️ બધા ૮૫ સ્થળો" },
          { key: "North", label: "🧭 ઉત્તર ગુજરાત" },
          { key: "Saurashtra", label: "🐪 સૌરાષ્ટ્ર અને કચ્છ" },
          { key: "Central", label: "🏢 મધ્ય ગુજરાત" },
          { key: "South", label: "🌊 દક્ષિણ ગુજરાત" },
          { key: "Badges", label: "🎖️ થીમ બેજીસ" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveZone(tab.key)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-gujarati font-bold text-xs border-2 transition-all ${
              activeZone === tab.key 
                ? 'bg-yellow-600 text-white border-yellow-600 shadow-md' 
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-550 dark:text-stone-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* Filter and Search Dashboard */}
      {activeZone !== "Badges" && (
        <section className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="space-y-1">
              <label className="font-gujarati text-xs font-bold text-stone-500">સ્થળ અથવા કીવર્ડ શોધો</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="નામ, જિલ્લો કે વિશેષતા..."
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-3 pl-10 pr-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                />
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-stone-400 text-base">search</span>
              </div>
            </div>

            {/* District dropdown */}
            <div className="space-y-1">
              <label className="font-gujarati text-xs font-bold text-stone-500">જિલ્લા વાઇઝ ફિલ્ટર</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
              >
                <option value="All">બધા ૩૩ જિલ્લા (All Districts)</option>
                {GUJARAT_DISTRICTS.map((dist) => (
                  <option key={dist.key} value={dist.name_en}>{dist.name_gu} ({dist.name_en})</option>
                ))}
              </select>
            </div>

            {/* GPS Radius Filter */}
            <div className="space-y-1">
              <label className="font-gujarati text-xs font-bold text-stone-500">કરન્ટ લોકેશન ત્રિજ્યા (Radius)</label>
              <div className="flex gap-2">
                <select
                  value={radiusFilter}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                >
                  <option value="All">સર્વત્ર (All)</option>
                  <option value="50">મારાથી ૫૦ કિમી નજીક</option>
                  <option value="100">મારાથી ૧૦૦ કિમી નજીક</option>
                </select>

                {/* Simulated Geolocation selection for testing */}
                <select
                  value={simulatedLocation}
                  onChange={(e) => {
                    setSimulatedLocation(e.target.value);
                    if (radiusFilter !== "All") {
                      // Trigger coordinates update
                      if (e.target.value === "real") {
                        setCurrentCoords(null);
                      } else {
                        setCurrentCoords(MOCK_COORDINATES[e.target.value]);
                      }
                    }
                  }}
                  className="bg-yellow-600/10 border border-yellow-600/20 text-primary dark:text-dark-accent rounded-2xl py-3 px-2 text-[10px] font-gujarati focus:outline-none"
                  title="ટેસ્ટ માટે જીપીએસ લોકેશન સિમ્યુલેટ કરો"
                >
                  <option value="real">Real GPS 📍</option>
                  <option value="ahmedabad">અમદાવાદ (Test)</option>
                  <option value="rajkot">રાજકોટ (Test)</option>
                  <option value="surat">સુરત (Test)</option>
                  <option value="dwarka">દ્વારકા (Test)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Context Filtering Tags (Category, Season, Accessibility) */}
          <div className="h-px bg-stone-100 dark:bg-stone-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category Tags */}
            <div className="space-y-2">
              <h5 className="font-gujarati text-[11px] font-black uppercase tracking-wider text-stone-400">સ્થળનો પ્રકાર</h5>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "All", label: "બધા" },
                  { key: "religious", label: "🛕 ધાર્મિક" },
                  { key: "nature", label: "🌳 પ્રકૃતિ" },
                  { key: "adventure", label: "🧗 ટ્રેકિંગ" },
                  { key: "historical", label: "🏛️ ઐતિહાસિક" },
                  { key: "picnic", label: "🧺 પિકનિક" }
                ].map((tag) => (
                  <button
                    key={tag.key}
                    onClick={() => setCategoryFilter(tag.key)}
                    className={`px-3 py-1.5 rounded-xl font-gujarati text-[10px] font-black transition-all ${
                      categoryFilter === tag.key
                        ? 'bg-yellow-700 text-white shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Season Tags */}
            <div className="space-y-2">
              <h5 className="font-gujarati text-[11px] font-black uppercase tracking-wider text-stone-400">શ્રેષ્ઠ મુલાકાત સમય</h5>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "All", label: "બધા" },
                  { key: "monsoon", label: "🌧️ ચોમાસુ સ્પેશિયલ" },
                  { key: "winter", label: "❄️ શિયાળો" },
                  { key: "night", label: "🌃 નાઇટ વિઝિટ" }
                ].map((tag) => (
                  <button
                    key={tag.key}
                    onClick={() => setSeasonFilter(tag.key)}
                    className={`px-3 py-1.5 rounded-xl font-gujarati text-[10px] font-black transition-all ${
                      seasonFilter === tag.key
                        ? 'bg-yellow-700 text-white shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility Tags */}
            <div className="space-y-2">
              <h5 className="font-gujarati text-[11px] font-black uppercase tracking-wider text-stone-400">સગવડ અને અનુકૂળતા</h5>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "All", label: "બધા" },
                  { key: "elderly", label: "👴 વડીલો માટે સરળ" },
                  { key: "child", label: "👶 બાળકો માટે" },
                  { key: "wheelchair", label: "♿ વ્હીલચેર સુવિધા" },
                  { key: "strenuous", label: "🥾 ટ્રેકિંગ ચઢાણ" }
                ].map((tag) => (
                  <button
                    key={tag.key}
                    onClick={() => setAccessibilityFilter(tag.key)}
                    className={`px-3 py-1.5 rounded-xl font-gujarati text-[10px] font-black transition-all ${
                      accessibilityFilter === tag.key
                        ? 'bg-yellow-700 text-white shadow-sm'
                        : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Grid display area */}
      {activeZone !== "Badges" ? (
        <>
          {filteredLandmarks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredLandmarks.map((landmark) => {
                const isUnlocked = !!stamps[landmark.id];
                const unlockDate = stamps[landmark.id];
                
                return (
                  <div key={landmark.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center justify-between gap-4 group hover:shadow-md transition-all animate-fade-in relative">
                    
                    {/* Zonal Tag indicator on card */}
                    <span className="absolute top-4 left-6 bg-stone-100 dark:bg-stone-950 px-2.5 py-0.5 rounded-full text-[9px] font-gujarati font-bold text-stone-400 border border-black/5">
                      {landmark.zone === "Mega" ? "👑 Golden" : landmark.district_gu}
                    </span>

                    {/* Stamp Circle overlay */}
                    <div className={`h-28 w-28 rounded-full flex flex-col items-center justify-center border-4 border-dashed relative overflow-hidden mt-2 transition-all duration-500 ${isUnlocked ? `bg-gradient-to-br ${landmark.color} scale-105 rotate-3 shadow-md` : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-800'}`}>
                      {isUnlocked ? (
                        <>
                          <span className="text-4xl filter drop-shadow-sm mb-1">{landmark.icon}</span>
                          <span className="font-gujarati font-black text-[9px] uppercase tracking-wider bg-white/50 px-2 py-0.5 rounded-full border border-black/5 leading-none">
                            {landmark.title}
                          </span>
                          <span className="absolute bottom-1 font-gujarati text-[8px] opacity-75">{unlockDate}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-4xl">lock</span>
                          <span className="font-gujarati text-[9px] mt-1 font-bold">લોક થયેલ</span>
                        </>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-100">{landmark.name_gu}</h4>
                      <p className="font-gujarati text-[10px] text-stone-400 font-bold">{landmark.name_en}</p>
                      <p className="font-gujarati text-[11px] text-primary/80 dark:text-dark-accent/80 font-black mt-1">
                        {landmark.district_gu} ({landmark.district_en})
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-2 mt-2">
                      {!isUnlocked ? (
                        <>
                          <button
                            onClick={() => handleVerifyCheckIn(landmark)}
                            disabled={loading}
                            className="w-full bg-[#F8FAFC] hover:bg-teal-50 dark:bg-stone-950 dark:hover:bg-stone-800 text-primary dark:text-dark-accent border border-primary/20 hover:border-primary/50 py-2.5 rounded-2xl font-gujarati font-black text-xs transition-colors flex items-center justify-center gap-1 active:scale-95 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-sm">my_location</span>
                            GPS વેરિફાય કરો 📍
                          </button>
                          <button
                            onClick={() => handleSimulateCheckIn(landmark)}
                            className="w-full text-stone-400 hover:text-stone-650 dark:text-stone-600 dark:hover:text-stone-400 py-1 rounded-lg font-gujarati text-[10px] hover:underline"
                          >
                            સિમ્યુલેટેડ ચેક-ઇન (ડેમો) ⚙️
                          </button>
                        </>
                      ) : (
                        <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20 py-2.5 rounded-2xl font-gujarati font-black text-xs flex items-center justify-center gap-1 select-none">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          મુલાકાત લીધેલ છે ✓
                        </div>
                      )}

                      {/* Hyper-local Info button */}
                      <button
                        onClick={() => {
                          setSelectedLandmark(landmark);
                          setDiaryNote(diary[landmark.id]?.note || "");
                          setDiarySticker(diary[landmark.id]?.sticker || "📸");
                          setActiveDetailTab("gems");
                        }}
                        className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 py-2 rounded-2xl font-gujarati text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">explore</span>
                        સ્થાનિક ગાઈડ & ડાયરી 💎
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 p-12 text-center rounded-[2.5rem] shadow-sm">
              <span className="material-symbols-outlined text-5xl text-stone-300 mb-2">search_off</span>
              <p className="font-gujarati text-stone-550 dark:text-stone-400 font-bold">તમારા ફિલ્ટર અથવા શોધ સાથે મેળ ખાતું કોઈ સ્થળ મળ્યું નથી.</p>
            </div>
          )}
        </>
      ) : (
        // Theme Badges Section
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
          {THEME_COLLECTIONS.map((theme) => {
            const isUnlocked = unlockedBadges.includes(theme.id);
            const collectedCount = theme.required.filter(reqId => !!stamps[reqId]).length;

            return (
              <div 
                key={theme.id}
                className={`bg-white dark:bg-stone-900 border p-6 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all ${
                  isUnlocked ? 'border-purple-500/35 bg-gradient-to-br from-white to-purple-500/5 dark:from-stone-900 dark:to-purple-950/10' : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className={`h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-md shrink-0 border-4 ${
                  isUnlocked 
                    ? `bg-gradient-to-br ${theme.color} text-white border-white/20 animate-bounce-slow` 
                    : 'bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-300 dark:text-stone-800'
                }`}>
                  {isUnlocked ? theme.icon : "🔒"}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h4 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100">{theme.name_gu}</h4>
                    {isUnlocked && (
                      <span className="bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 px-2 py-0.5 rounded-full font-gujarati text-[9px] font-black uppercase tracking-wider">
                        અનલોક ✓ (+૧૦૦)
                      </span>
                    )}
                  </div>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400 leading-relaxed">
                    {theme.desc}
                  </p>
                  
                  {/* Progress tracker */}
                  <div className="space-y-1 pt-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-stone-400">
                      <span className="font-gujarati">પ્રગતિ:</span>
                      <span className="font-headline">{collectedCount} / {theme.required.length}</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-950 h-2 rounded-full overflow-hidden border border-black/5">
                      <div 
                        className={`h-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-teal-500`}
                        style={{ width: `${(collectedCount / theme.required.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggested Places section by Users */}
      {suggestedPlaces.length > 0 && activeZone === "All" && (
        <section className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-white">તમે સજેસ્ટ કરેલી નવી છુપી જગ્યાઓ 🌟</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {suggestedPlaces.map((place) => (
              <div key={place.id} className="bg-white dark:bg-stone-900 border border-yellow-600/20 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4">
                <span className="bg-yellow-600/10 text-primary dark:text-dark-accent border border-yellow-600/20 px-3 py-1 rounded-full text-[9px] font-gujarati font-black uppercase tracking-widest inline-block self-start">
                  {place.category.toUpperCase()} • {place.district_gu}
                </span>
                <div>
                  <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-100">{place.name_gu}</h4>
                  <p className="font-gujarati text-[10px] text-stone-400 font-bold mb-2">{place.name_en}</p>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400 leading-relaxed line-clamp-3">{place.description}</p>
                </div>
                <div className="bg-yellow-600/5 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-600/10 py-2 rounded-2xl font-gujarati font-black text-[10px] text-center select-none">
                  🎉 સબમિટ કર્યું: {place.dateAdded}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Expanding Hyper-local Details Sliding Panel / Modal */}
      {selectedLandmark && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-primary text-white p-6 relative">
              <button 
                onClick={() => setSelectedLandmark(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 h-8 w-8 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
              <span className="bg-white/20 text-white border border-white/30 px-3 py-0.5 rounded-full text-[9px] font-gujarati font-bold uppercase tracking-wider inline-block mb-1">
                {selectedLandmark.district_gu} ({selectedLandmark.district_en})
              </span>
              <h3 className="font-gujarati font-black text-2xl flex items-center gap-1">
                <span>{selectedLandmark.icon}</span>
                <span>{selectedLandmark.name_gu}</span>
              </h3>
              <p className="font-gujarati text-white/80 text-xs mt-0.5">{selectedLandmark.name_en} • {selectedLandmark.title}</p>
            </div>

            {/* Modal Detail Tabs */}
            <div className="flex border-b border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar shrink-0 bg-stone-50 dark:bg-stone-950">
              {[
                { key: "gems", label: "💎 છુપા રત્નો" },
                { key: "route", label: "📍 સ્માર્ટ રૂટ" },
                { key: "taste", label: "🍲 લોકલ સ્વાદ" },
                { key: "artisan", label: "🪚 કારીગરો" },
                { key: "diary", label: "📖 પ્રવાસ ડાયરી" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveDetailTab(tab.key)}
                  className={`px-5 py-3.5 font-gujarati font-bold text-xs border-b-2 transition-all shrink-0 ${
                    activeDetailTab === tab.key
                      ? 'border-yellow-600 text-yellow-700 dark:text-dark-accent bg-white dark:bg-stone-900 font-black'
                      : 'border-transparent text-stone-550 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0 text-stone-800 dark:text-white">
              
              {/* Gems Tab */}
              {activeDetailTab === "gems" && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-gujarati font-black text-lg text-primary dark:text-dark-accent">તાલુકાના છુપા રત્નો (Hidden Gems)</h4>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400">મુખ્ય પ્રવાસન સ્પોટની આસપાસની અજાણી અને જોવાલાયક ગુપ્ત જગ્યાઓ:</p>
                  <div className="space-y-3">
                    {selectedLandmark.hidden_gems?.map((gem, idx) => (
                      <div key={idx} className="bg-stone-50 dark:bg-stone-950 border border-stone-200/50 dark:border-stone-800 p-4 rounded-2xl flex gap-3 items-start">
                        <span className="text-xl">💎</span>
                        <div className="space-y-0.5">
                          <p className="font-gujarati text-sm font-black">{gem.split(' - ')[0]}</p>
                          <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400 leading-relaxed">{gem.split(' - ')[1] || "શાંત, સુંદર અને વન-ડે પિકનિક માટે શ્રેષ્ઠ ગુપ્ત સ્થળ."}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Route Tab */}
              {activeDetailTab === "route" && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-gujarati font-black text-lg text-primary dark:text-dark-accent">૧-દિવસ સ્માર્ટ રૂટ પ્લાનર (Route Planner)</h4>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400">મુસાફરીનો સમય અને ઇંધણ બચાવવા માટે ક્રમબદ્ધ પ્રવાસ માર્ગ નકશો:</p>
                  <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-yellow-600/30">
                    {selectedLandmark.route_planner?.map((route, idx) => {
                      const points = route.split(' ➔ ');
                      return points.map((p, pIdx) => (
                        <div key={pIdx} className="relative space-y-1">
                          <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-yellow-600 border-2 border-white dark:border-stone-900 shadow-sm" />
                          <h5 className="font-gujarati text-sm font-black text-stone-800 dark:text-stone-100">{p}</h5>
                          <p className="font-gujarati text-[10px] text-stone-450 font-bold">
                            {pIdx === 0 ? "🏁 પ્રસ્થાન બિંદુ" : pIdx === points.length - 1 ? "🔚 સમાપન લક્ષ્ય" : `📍 સ્ટોપ ક્રમ ${pIdx}`}
                          </p>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}

              {/* Taste Tab */}
              {activeDetailTab === "taste" && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-gujarati font-black text-lg text-primary dark:text-dark-accent">સ્થાનિક સ્વાદ અને શોપિંગ (Local Taste & Products)</h4>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400">અહીં મુલાકાત લો ત્યારે ખાવા જેવી પ્રખ્યાત ચીજો અને પરંપરાગત શોપિંગ લિસ્ટ:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedLandmark.local_taste?.map((taste, idx) => (
                      <div key={idx} className="bg-[#F8FAFC] dark:bg-stone-950 border border-primary/10 p-4 rounded-2xl flex gap-3 items-center">
                        <span className="text-2xl">{idx === 0 ? "🍲" : "🛍️"}</span>
                        <div>
                          <p className="font-gujarati text-xs font-bold text-stone-450">{idx === 0 ? "આઈકોનિક સ્વાદ" : "સ્થાનિક ખરીદી"}</p>
                          <p className="font-gujarati text-sm font-black text-stone-800 dark:text-stone-100">{taste}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artisan Tab */}
              {activeDetailTab === "artisan" && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="font-gujarati font-black text-lg text-primary dark:text-dark-accent">સ્થાનિક કારીગરો (Artisan Connect)</h4>
                  <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400">હસ્તકળા અને પરંપરા બચાવવા માટે સ્થાનિક કારીગરોને સપોર્ટ કરો:</p>
                  <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-5 rounded-2xl space-y-4">
                    <div className="flex gap-3 items-start">
                      <span className="text-2xl">🪚</span>
                      <p className="font-gujarati text-xs text-stone-650 dark:text-stone-300 leading-relaxed">
                        {selectedLandmark.artisan_info || "અહીંના પરંપરાગત કલાના કુશળ કારીગરો હાથે સજાવટની વિવિધ વસ્તુઓ બનાવે છે."}
                      </p>
                    </div>
                    <button
                      onClick={() => handleContactArtisan(selectedLandmark)}
                      className="bg-primary hover:bg-yellow-700 text-white px-4 py-2.5 rounded-xl font-gujarati text-xs font-black transition-colors flex items-center gap-1 active:scale-95 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">phone</span>
                      કારીગર સેન્ટર કનેક્ટ કરો
                    </button>
                  </div>
                </div>
              )}

              {/* Diary Tab */}
              {activeDetailTab === "diary" && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="font-gujarati font-black text-lg text-primary dark:text-dark-accent">પ્રવાસ ડાયરી અને યાદો (Travel Scrapbook & Diary)</h4>
                  
                  {/* Input form if unlocked */}
                  {stamps[selectedLandmark.id] ? (
                    <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl space-y-4">
                      <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400">આ જગ્યા વિશે તમારો અનુભવ, મુલાકાત લીધાની ડાયરી નોંધ ટાઇપ કરો:</p>
                      
                      <div className="space-y-2">
                        <textarea
                          value={diaryNote}
                          onChange={(e) => setDiaryNote(e.target.value)}
                          placeholder="અહીં લખો (દા.ત. અહીંનો સૂર્યાસ્ત અદભુત હતો અને અમે જામનગરી કચોરી ખાધી...)"
                          rows={3}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Sticker Selection */}
                        <div className="flex items-center gap-2">
                          <span className="font-gujarati text-xs text-stone-500">સ્ટીકર:</span>
                          <div className="flex gap-1.5">
                            {["📸", "🌅", "🛕", "🦁", "🏖️", "🥾", "💖", "🌿"].map(sticker => (
                              <button
                                key={sticker}
                                onClick={() => setDiarySticker(sticker)}
                                className={`text-xl p-1 rounded-lg transition-transform ${diarySticker === sticker ? 'bg-yellow-100 dark:bg-stone-800 scale-125 border border-yellow-400' : 'hover:scale-110'}`}
                              >
                                {sticker}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSaveDiary(selectedLandmark.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-gujarati text-xs font-black transition-colors shadow-sm"
                        >
                          યાદ સાચવો 💾
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-600/5 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400 border border-yellow-600/20 p-5 rounded-2xl text-center font-gujarati text-xs leading-relaxed">
                      🔒 તમે આ સ્ટેમ્પ અનલોક કર્યા પછી જ આ સ્પોટ વિશે પ્રવાસ ડાયરી અને ફોટો યાદો નોંધી શકશો!
                    </div>
                  )}

                  {/* Polaroid Memory display */}
                  {diary[selectedLandmark.id] && (
                    <div className="flex justify-center pt-2">
                      <div className="bg-white text-stone-900 border border-stone-200 p-4 pb-8 rounded-md shadow-lg transform rotate-[-2deg] max-w-sm w-full space-y-4 font-body select-none">
                        
                        {/* Polaroid image frame simulator */}
                        <div className="bg-stone-150 h-48 w-full rounded relative flex items-center justify-center overflow-hidden border border-black/5">
                          {/* Radial colors inside frame */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/10 to-teal-500/15" />
                          <span className="text-6xl drop-shadow-md z-10">{diary[selectedLandmark.id].sticker}</span>
                          <span className="absolute top-2 right-2 text-stone-400 text-[10px] font-bold">otlo_cam_v1</span>
                          <div className="absolute bottom-2 left-2 bg-white/70 px-2 py-0.5 rounded text-[8px] text-stone-700 font-gujarati">
                            📍 {selectedLandmark.name_gu}
                          </div>
                        </div>

                        {/* Polaroid caption area */}
                        <div className="space-y-1 text-center">
                          <p className="font-gujarati text-xs text-stone-700 leading-relaxed italic px-2">
                            "{diary[selectedLandmark.id].note || "અમે અદ્ભુત યાદો બનાવી!"}"
                          </p>
                          <div className="h-px bg-stone-100 w-3/4 mx-auto my-1" />
                          <p className="font-gujarati text-[9px] text-stone-400 uppercase tracking-widest">
                            તારીખ: {diary[selectedLandmark.id].date}
                          </p>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Suggest a Place Form Modal */}
      {suggestModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form 
            onSubmit={handleSuggestPlace}
            className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-[3rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 space-y-6 animate-scale-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-2xl text-primary dark:text-dark-accent">નવી છુપી જગ્યા જણાવો ✍️</h3>
              <button 
                type="button"
                onClick={() => setSuggestModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-800 h-8 w-8 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400 leading-relaxed">
              તમારા તાલુકાની ઓછી જાણીતી જગ્યાઓ, કિલ્લાઓ, નદીઓ, પર્વતો કે પ્રાચીન મંદિરો વિશે વિગતો આપો. આ ડેટા કમ્યુનિટી રિવ્યુ માટે જશે. સબમિશન બદલ તમને **+૫૦ કોઈન્સ** મળશે!
            </p>

            <div className="space-y-4">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-stone-500">જગ્યાનું નામ (ગુજરાતી)</label>
                  <input
                    type="text"
                    required
                    value={suggestNameGu}
                    onChange={(e) => setSuggestNameGu(e.target.value)}
                    placeholder="દા.ત. બાવકા શિવ મંદિર"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-stone-500">Place Name (English)</label>
                  <input
                    type="text"
                    required
                    value={suggestNameEn}
                    onChange={(e) => setSuggestNameEn(e.target.value)}
                    placeholder="e.g. Bawka Temple"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                  />
                </div>
              </div>

              {/* District & Taluka */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-stone-500">જિલ્લો</label>
                  <select
                    value={suggestDistrict}
                    onChange={(e) => setSuggestDistrict(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                  >
                    {GUJARAT_DISTRICTS.map((d) => (
                      <option key={d.key} value={d.key}>{d.name_gu} ({d.name_en})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-stone-500">તાલુકો</label>
                  <input
                    type="text"
                    value={suggestTaluka}
                    onChange={(e) => setSuggestTaluka(e.target.value)}
                    placeholder="દા.ત. દાહોદ"
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="font-gujarati text-xs font-bold text-stone-500">સ્થળનો પ્રકાર (Category)</label>
                <select
                  value={suggestCategory}
                  onChange={(e) => setSuggestCategory(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                >
                  <option value="nature">🌳 પ્રકૃતિ / વનરાજી</option>
                  <option value="religious">🛕 ધાર્મિક / મંદિર</option>
                  <option value="historical">🏛️ ઐતિહાસિક સ્મારક</option>
                  <option value="adventure">🧗 ટ્રેકિંગ / એડવેન્ચર</option>
                  <option value="picnic">🧺 પિકનિક સ્પોટ</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-gujarati text-xs font-bold text-stone-500">સ્થળ વિશે ટૂંકી વિગત</label>
                <textarea
                  required
                  value={suggestDesc}
                  onChange={(e) => setSuggestDesc(e.target.value)}
                  placeholder="અહીં રસ્તા અને વિશેષતા લખો..."
                  rows={4}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-yellow-700 text-white py-3.5 rounded-2xl font-gujarati font-black text-sm transition-colors shadow-md"
            >
              સબમિટ કરો 🚀
            </button>
          </form>
        </div>
      )}

      {/* Rewards Scratch Card Modal Popup */}
      {activeCoupon && (
        <ScratchCardModal 
          coupon={activeCoupon}
          onClose={() => setActiveCoupon(null)}
        />
      )}

      {/* 9. Share Certificate Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[3rem] shadow-2xl w-full max-w-lg p-8 relative flex flex-col gap-6 animate-scale-in text-stone-800 dark:text-white">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-2xl text-primary dark:text-dark-accent">મારો પ્રવાસ સંગ્રહ 🏆</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-stone-400 hover:text-stone-600 bg-stone-100 dark:bg-stone-800 h-8 w-8 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Custom Name Input */}
            <div className="space-y-1">
              <label className="font-gujarati text-xs font-bold text-stone-500">સર્ટિફિકેટ માટે તમારું નામ લખો:</label>
              <input
                type="text"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl py-2.5 px-4 text-xs font-gujarati text-stone-800 dark:text-white focus:outline-none focus:border-yellow-600"
              />
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-[#fdfbf7] dark:bg-stone-950 border-4 border-yellow-700/30 p-6 rounded-3xl text-center space-y-4 shadow-sm relative overflow-hidden select-none border-double">
              <div className="absolute top-2 right-2 text-4xl opacity-10">🏛️</div>
              <span className="bg-yellow-600/10 text-primary dark:text-dark-accent border border-yellow-600/20 px-3 py-1 rounded-full text-[9px] font-gujarati font-black uppercase tracking-widest inline-block">
                ગુજરાત પ્રવાસ સન્માન પત્ર 📜
              </span>
              
              <div className="space-y-1">
                <h4 className="font-gujarati font-black text-2xl text-stone-800 dark:text-stone-100">{shareName}</h4>
                <p className="font-gujarati text-[10px] text-stone-400">એ ગુજરાત પ્રવાસ પાસપોર્ટમાં ગૌરવપૂર્ણ સિદ્ધિ મેળવી છે.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-black/5">
                <div>
                  <p className="font-gujarati text-[9px] text-stone-400 font-bold uppercase">એકઠા કરેલ સ્ટેમ્પ્સ</p>
                  <h5 className="font-headline font-black text-2xl text-primary dark:text-dark-accent mt-0.5">{totalStampsCount} / {TRAVEL_DATABASE.length}</h5>
                </div>
                <div>
                  <p className="font-gujarati text-[9px] text-stone-400 font-bold uppercase">અનલોક થીમ બેજીસ</p>
                  <h5 className="font-headline font-black text-2xl text-primary dark:text-dark-accent mt-0.5">{unlockedBadges.length} / {THEME_COLLECTIONS.length}</h5>
                </div>
              </div>

              {/* Unlocked stamps icons list preview */}
              {totalStampsCount > 0 ? (
                <div className="space-y-2">
                  <p className="font-gujarati text-[9px] text-stone-400 font-bold">તાજેતરમાં અનલોક કરેલા સ્થાનો (મહત્તમ ૫):</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(() => {
                      const collected = TRAVEL_DATABASE.filter(l => !!stamps[l.id]);
                      const parseGuDate = (dateStr) => {
                        if (!dateStr) return 0;
                        const parts = dateStr.split('/');
                        if (parts.length === 3) {
                          return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
                        }
                        return 0;
                      };
                      const sortedCollected = [...collected].sort((a, b) => {
                        return parseGuDate(stamps[b.id]) - parseGuDate(a.id);
                      });
                      const latest5 = sortedCollected.slice(0, 5);
                      return latest5.map(l => (
                        <div key={l.id} className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-yellow-700/60 bg-yellow-600/5 dark:bg-yellow-600/10 p-1.5 relative rotate-[-2deg] hover:rotate-0 transition-transform">
                          <span className="text-2xl leading-none">{l.icon}</span>
                          <span className="font-gujarati text-[8px] font-black text-center leading-tight px-0.5 text-yellow-900 dark:text-yellow-200 truncate w-full mt-0.5">
                            {l.name_gu}
                          </span>
                          <span className="text-[7px] text-stone-400 dark:text-stone-500 leading-none mt-0.5">
                            {stamps[l.id]}
                          </span>
                        </div>
                      ));
                    })()}
                    {totalStampsCount > 5 && (
                      <span className="text-[10px] font-bold bg-yellow-600/10 text-primary dark:text-dark-accent border border-yellow-600/20 px-2.5 py-1 rounded-full flex items-center justify-center font-gujarati">
                        +{totalStampsCount - 5} વધુ
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="font-gujarati text-[10px] text-emerald-500 font-bold">હજુ કોઈ સ્ટેમ્પ અનલોક કરેલ નથી. યાત્રા શરૂ કરો!</p>
              )}
            </div>

            {/* Sharing Actions */}
            <div className="space-y-2">
              <p className="font-gujarati text-xs text-stone-500">સોશિયલ મીડિયા પર શેર કરો:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const text = `🚩 મેં ગુજરતી એપ ગુજરાત ટ્રાવેલ પાસપોર્ટમાં ${totalStampsCount}/${TRAVEL_DATABASE.length} સ્ટેમ્પ્સ એકઠા કર્યા છે! તમે પણ તમારા જિલ્લાના છુપા પ્રવાસન સ્થળો જાણો. #GujaratTourism #GujaratiApp`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-gujarati text-xs font-black flex items-center justify-center gap-1 active:scale-95 shadow-sm transition-all"
                >
                  WhatsApp 🟢
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = `🚩 મેં ગુજરતી એપ ગુજરાત ટ્રાવેલ પાસપોર્ટમાં ${totalStampsCount}/${TRAVEL_DATABASE.length} સ્ટેમ્પ્સ એકઠા કર્યા છે! #GujaratTourism #GujaratiApp`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
                  }}
                  className="bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-2xl font-gujarati text-xs font-black flex items-center justify-center gap-1 active:scale-95 shadow-sm transition-all"
                >
                  Twitter 🔵
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const text = `🚩 મેં ગુજરતી એપ ગુજરાત ટ્રાવેલ પાસપોર્ટમાં ${totalStampsCount}/${TRAVEL_DATABASE.length} સ્ટેમ્પ્સ એકઠા કર્યા છે! તમે પણ તમારા જિલ્લાના છુપા પ્રવાસન સ્થળો જાણો. #GujaratTourism #GujaratiApp`;
                  navigator.clipboard.writeText(text);
                  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `📋 શેર મેસેજ ક્લિપબોર્ડ પર કોપી થઈ ગયો છે!` } }));
                }}
                className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 py-3 rounded-2xl font-gujarati text-xs font-bold transition-all active:scale-95 text-center mt-2 border border-black/5"
              >
                મેસેજ કોપી કરો (Copy Message) 📋
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
