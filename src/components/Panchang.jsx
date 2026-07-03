import { useState, useEffect } from 'react';
import { calculateChoghadiyas, calculateMuhurts } from '../utils/choghadiya_helper';
import { getDailyPanchang } from '../utils/panchangEngine';
import { RASHI_DATA, generateDailyRashifal } from '../data/rashifalDatabase';

const calculateAstroForMilan = (dob, tob, noTime, coords) => {
  const finalTob = noTime ? "12:00" : tob;
  const [year, month, day] = dob.split("-").map(Number);
  const [hours, minutes] = finalTob.split(":").map(Number);

  const lat = coords ? parseFloat(coords.lat) : 23.0225; // default Ahmedabad
  const lon = coords ? parseFloat(coords.lon) : 72.5714; // default Ahmedabad

  const timezoneOffset = 5.5; // IST
  let utcHours = hours - timezoneOffset;
  let utcDay = day;
  let utcMonth = month;
  let utcYear = year;

  if (utcHours < 0) {
    utcHours += 24;
    utcDay -= 1;
    if (utcDay < 1) {
      utcMonth -= 1;
      if (utcMonth < 1) {
        utcMonth = 12;
        utcYear -= 1;
      }
      const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
      utcDay = daysInMonth;
    }
  }

  const Y = utcMonth <= 2 ? utcYear - 1 : utcYear;
  const M = utcMonth <= 2 ? utcMonth + 12 : utcMonth;
  const D = utcDay + (utcHours + minutes / 60) / 24;

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  const t = jd - 2451545.0;

  const ayanamsa = 23.85 + (t / 365.25) * 0.0139696;

  let gmst = (280.46061837 + 360.98564736629 * t) % 360;
  if (gmst < 0) gmst += 360;
  let lst = (gmst + lon) % 360;
  if (lst < 0) lst += 360;

  const obliquity = 23.4393 - (t / 365.25) * 0.000013;
  const lstRad = (lst * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const oblRad = (obliquity * Math.PI) / 180;

  const yVal = -Math.cos(lstRad);
  const xVal = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

  let tropicalAsc = Math.atan2(yVal, xVal) * (180 / Math.PI);
  if (tropicalAsc < 0) tropicalAsc += 360;

  let siderealAsc = (tropicalAsc - ayanamsa) % 360;
  if (siderealAsc < 0) siderealAsc += 360;

  const lagnaSignNum = Math.floor(siderealAsc / 30) + 1;

  const orbitalParams = {
    "સૂ": { L0: 280.466, n: 0.98564736 },
    "ચ": { L0: 218.316, n: 13.17639648 },
    "મં": { L0: 355.453, n: 0.52402078 },
    "બુ": { L0: 252.251, n: 4.092334436 },
    "ગુ": { L0: 34.404,  n: 0.0830853 },
    "શુ": { L0: 181.979, n: 1.60213022 },
    "શનિ": { L0: 50.077,  n: 0.03345963 },
    "રા": { L0: 125.122, n: -0.05295376 },
  };

  const Mm = (134.963 + 13.064993 * t) * Math.PI / 180;
  const Ms = (357.529 + 0.9856 * t) * Math.PI / 180;
  const moonPerturbation = 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * Mm - Ms) + 0.658 * Math.sin(2 * Ms);
  let moonLong = orbitalParams["ચ"].L0 + orbitalParams["ચ"].n * t + moonPerturbation;

  const planetSiderealLongs = {};
  Object.keys(orbitalParams).forEach(p => {
    let long = orbitalParams[p].L0 + orbitalParams[p].n * t;
    if (p === "ચ") long = moonLong;
    let sidReal = (long - ayanamsa) % 360;
    if (sidReal < 0) sidReal += 360;
    planetSiderealLongs[p] = sidReal;
  });

  const planetsInHouses = {};
  Object.keys(planetSiderealLongs).forEach(p => {
    const long = planetSiderealLongs[p];
    const rashiNum = Math.floor(long / 30) + 1;
    planetsInHouses[p] = (rashiNum - lagnaSignNum + 12) % 12 + 1;
  });

  const moonDeg = planetSiderealLongs["ચ"];
  const nakshatraIdx = Math.floor(moonDeg / 13.33333) % 27;
  const moonRashiNum = Math.floor(moonDeg / 30) % 12 + 1;

  const marsHouse = planetsInHouses["મં"];
  const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

  return {
    rashiId: moonRashiNum,
    nakshatraIdx,
    isManglik: isManglik ? "yes" : "no"
  };
};

const Panchang = () => {
  const [panchangData, setPanchangData] = useState(() => {
    const cached = localStorage.getItem('panchang_cache_full');
    const initialData = cached ? JSON.parse(cached) : {
      tithi: "અધિક જેઠ સુદ બીજ",
      paksh: "સુદ",
      maas: "અધિક જેઠ",
      rashi: "વૃષભ",
      rashiLetters: "બ, વ, ઉ",
      nakshatra: "રોહિણી",
      choghadiya: {
        name: "લાભ",
        isGood: true,
        timeRemaining: "૪૫ મિનિટ"
      },
      choghadiyaList: [
        { name: "લાભ", time: "૦૬:૧૦ - ૦૭:૪૫", isGood: true },
        { name: "અમૃત", time: "૦૭:૪૫ - ૦૯:૨૦", isGood: true },
        { name: "કાળ", time: "૦૯:૨૦ - ૧૦:૫૫", isGood: false },
        { name: "શુભ", time: "૧૦:૫૫ - ૧૨:૩૦", isGood: true },
        { name: "રોગ", time: "૧૨:૩૦ - ૧૪:૦૫", isGood: false },
        { name: "ઉદ્વેગ", time: "૧૪:૦૫ - ૧૫:૪૦", isGood: false },
        { name: "ચલ", time: "૧૫:૪૦ - ૧૭:૧૫", isGood: true },
        { name: "લાભ", time: "૧૭:૧૫ - ૧૮:૫૦", isGood: true }
      ],
      muhurts: {
        abhijit: "૧૨:૧૫ PM - ૦૧:૦૨ PM",
        rahuKaal: "૦૨:૦૦ PM - ૦૩:૩૦ PM"
      },
      sunrise: "૦૫:૫૮ AM",
      sunset: "૦૭:૧૫ PM",
      loading: true
    };
    initialData.date = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    initialData.vaar = new Date().toLocaleDateString('gu-IN', { weekday: 'long' });
    return initialData;
  });

  const fetchData = async () => {
    try {
      // 1. Get deterministic math-based Panchang
      const mathPanchang = getDailyPanchang();
      
      // 2. Fetch Live Sunrise/Sunset for Ahmedabad
      let sunrise = panchangData.sunrise || "06:00 AM";
      let sunset = panchangData.sunset || "07:00 PM";
      try {
        const response = await fetch("https://api.sunrisesunset.io/json?lat=23.0225&lng=72.5714");
        if (response.ok) {
          const apiData = await response.json();
          const formatTime = (timeStr) => {
            if(!timeStr) return timeStr;
            const parts = timeStr.split(' ');
            const hms = parts[0].split(':');
            let h = hms[0];
            let m = hms[1];
            if (h.length === 1) h = '0' + h;
            return `${h}:${m} ${parts[1]}`;
          };
          sunrise = formatTime(apiData.results.sunrise);
          sunset = formatTime(apiData.results.sunset);
        }
      } catch(e) {
        console.error("Sunrise API failed, using defaults", e);
      }
      
      const updatedData = {
        ...panchangData,
        ...mathPanchang,
        sunrise,
        sunset,
        date: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        vaar: new Date().toLocaleDateString('gu-IN', { weekday: 'long' }),
        loading: false
      };
      
      setPanchangData(updatedData);
      localStorage.setItem('panchang_cache_full', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Panchang Engine Error:", error);
      setPanchangData(prev => ({ ...prev, loading: false }));
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRashifalId, setSelectedRashifalId] = useState('mesh');

  // --- SHANI PANOTI CHECKER STATES ---
  const [panotiMode, setPanotiMode] = useState(true); // true = direct rashi, false = birth details
  const [panotiSelectedRashi, setPanotiSelectedRashi] = useState(null);
  const [panotiResult, setPanotiResult] = useState(null);

  // Birth Details States
  const [panotiName, setPanotiName] = useState("");
  const [panotiDob, setPanotiDob] = useState("");
  const [panotiTob, setPanotiTob] = useState("");
  const [panotiNoTime, setPanotiNoTime] = useState(false);
  const [panotiBirthPlace, setPanotiBirthPlace] = useState("");
  const [panotiSuggestions, setPanotiSuggestions] = useState([]);
  const [panotiSelectedCoords, setPanotiSelectedCoords] = useState(null);
  const [panotiLoadingCoords, setPanotiLoadingCoords] = useState(false);

  // Suggestions search effect for Panoti
  useEffect(() => {
    if (panotiBirthPlace.trim().length < 3) {
      setPanotiSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setPanotiLoadingCoords(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(panotiBirthPlace)}&limit=4`);
        const data = await res.json();
        setPanotiSuggestions(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setPanotiLoadingCoords(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [panotiBirthPlace]);

  // Scroll to panoti-section if hash matches
  useEffect(() => {
    if (window.location.hash === '#panoti') {
      setTimeout(() => {
        const el = document.getElementById('panoti-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  const handleCheckPanoti = (rashiId) => {
    const matchedRashi = RASHI_DATA.find(r => r.id === rashiId) || RASHI_DATA[0];
    setPanotiSelectedRashi(matchedRashi);

    let status = "";
    let severity = ""; // success, warning, danger
    let phase = "";
    let description = "";
    let remedies = [];

    // Makar, Kumbh, Meen, Kark, Vrischika
    if (matchedRashi.id === "makar") {
      status = "સાડાસાતી (Sade Sati) - અંતિમ તબક્કો";
      severity = "warning";
      phase = "ત્રીજું ચરણ (Setting Phase)";
      description = "તમારી રાશિ પર શનિની સાડાસાતીનો છેલ્લો અઢી વર્ષનો તબક્કો ચાલી રહ્યો છે. માનસિક ચિંતાઓમાં ધીરે ધીરે રાહત મળશે અને પ્રગતિના નવા દ્વાર ખુલશે. નાણાકીય રોકાણોમાં સાવધાની રાખવી.";
      remedies = [
        "શનિવારે પીપળાના વૃક્ષ નીચે સરસિયાના તેલનો દીવો કરવો.",
        "પીડિતો અથવા સફાઈ કામદારોને કાળા કપડા કે અડદનું દાન કરવું.",
        "દરરોજ સૂર્યાસ્ત પછી 'ॐ शं शनैश्चराय नमः' મંત્રના ૧૦૮ જાપ કરવા."
      ];
    } else if (matchedRashi.id === "kumbh") {
      status = "સાડાસાતી (Sade Sati) - શિખર તબક્કો";
      severity = "danger";
      phase = "બીજું ચરણ (Peak Phase)";
      description = "તમારી રાશિ પર શનિની સાડાસાતીનો સૌથી પ્રભાવશાળી બીજો તબક્કો ચાલી રહ્યો છે. માનસિક તણાવ, વાહન ચલાવતી વખતે સાવધાની અને વાદ-વિવાદથી બચવું જરૂરી છે. ધીરજ અને સદાચારથી શનિદેવ પ્રસન્ન થાય છે.";
      remedies = [
        "શનિવારે હનુમાનજીના મંદિરે જઈ હનુમાન ચાલીસા અથવા સુંદરકાંડના પાઠ કરવા.",
        "શનિ મહારાજને વાદળી અથવા કાળા રંગના પુષ્પો અને કાળા તલ અર્પણ કરવા.",
        "શનિ બીજ મંત્ર: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' નો જાપ કરવો."
      ];
    } else if (matchedRashi.id === "meen") {
      status = "સાડાસાતી (Sade Sati) - પ્રારંભિક તબક્કો";
      severity = "warning";
      phase = "પ્રથમ ચરણ (Rising Phase)";
      description = "તમારી રાશિ પર શનિની સાડાસાતીનો પ્રથમ અઢી વર્ષનો પ્રારંભિક તબક્કો ચાલી રહ્યો છે. આ સમયગાળામાં ખર્ચ વધવાની સંભાવના છે અને વિદેશ મુસાફરી અથવા કાર્યક્ષેત્રમાં ફેરબદલ આવી શકે છે. કાયદાકીય કામોમાં સાવધાની રાખો.";
      remedies = [
        "ગરીબ લોકોને ભોજન કરાવવું અને કાળા શ્વાન (ડોગ) ને તેલવાળી રોટલી ખવડાવવી.",
        "શનિવારે તાંબાના લોટામાં પાણી ભરી કાળા તલ નાખી સૂર્ય અને શનિદેવને અર્ધ્ય આપવું.",
        "શનિ સ્તોત્ર અથવા શનિ ચાલીસાના પાઠ કરવા."
      ];
    } else if (matchedRashi.id === "karka") {
      status = "શનિની ઢય્યા (Ashtama Dhayya)";
      severity = "danger";
      phase = "અષ્ટમ શનિ (૮મી ઢય્યા)";
      description = "તમારી રાશિ પર શનિની અષ્ટમ ઢય્યા ચાલી રહી છે. આ અઢી વર્ષના સમયગાળા દરમિયાન શારીરિક સ્વાસ્થ્યનું વિશેષ ધ્યાન રાખવું. નકામી વાતોમાં સમય ન બગાડવો અને નોકરી/વ્યવસાયમાં મહેનત વધારવી.";
      remedies = [
        "શનિવારે તેલ દાન (તામ્રપાત્રમાં તેલ ભરી તમારો ચહેરો જોઈને દાન કરવું - છાયા દાન).",
        "હનુમાન મંદિરમાં કાળા ચણા અને ગોળનો પ્રસાદ ચડાવવો.",
        "પશુ-પક્ષીઓ અને કીડીઓને દાણા નાખવા."
      ];
    } else if (matchedRashi.id === "vrischika") {
      status = "શનિની ઢય્યા (Kantaka Dhayya)";
      severity = "warning";
      phase = "ચતુર્થ શનિ (૪થી ઢય્યા)";
      description = "તમારી રાશિ પર શનિની ચતુર્થ ઢય્યા ચાલી રહી છે. કૌટુંબિક બાબતો અને મિલકત સંબંધિત નિર્ણયોમાં ધીરજ રાખવી. આ સમયે વ્યવસાયિક ભાગીદારીમાં સાવધાની રાખવી. તમારા કામમાં ઈમાનદારી રાખવાથી શનિદેવ શુભ ફળ આપશે.";
      remedies = [
        "શનિવારે શનિ મંદિરમાં સરસિયાના તેલનો દીવો કરી લોખંડની વસ્તુનું દાન કરવું.",
        "દરરોજ સવારે શનિ ચાલીસાના પાઠ કરવા.",
        "શનિ ગાયત્રી મંત્ર: 'ॐ भगभवाय વિદ્મહે મૃગરૂપાય ધીમહિ તન્નો શનિઃ પ્રચોદયાત।' નો જાપ કરવો."
      ];
    } else {
      status = "શનિ પનૌતી મુક્ત (શુભ સમય)";
      severity = "success";
      phase = "કોઈ સાડાસાતી કે ઢય્યા નથી";
      description = "ખૂબ સરસ! અત્યારે તમારી રાશિ પર શનિદેવની કોઈ સાડાસાતી કે ઢય્યા ચાલુ નથી. શનિ મહારાજની આપના પર શુભ દ્રષ્ટિ છે. સત્કર્મ કરતા રહો અને ઈશ્વર ભક્તિમાં લીન રહો.";
      remedies = [
        "શનિવારે કીડીઓને ગળ્યું અન્ન (લોટ અને ખાંડ) નાખવું.",
        "હનુમાન ચાલીસાના પાઠ કરવા અને જરૂરિયાતમંદોને મદદ કરવી."
      ];
    }

    setPanotiResult({ status, severity, phase, description, remedies });
  };

  const handleBirthPanotiSubmit = (e) => {
    e.preventDefault();
    if (!panotiDob) {
      alert("કૃપા કરી જન્મ તારીખ દાખલ કરો 🙏");
      return;
    }

    try {
      const astro = calculateAstroForMilan(
        panotiDob,
        panotiNoTime ? "12:00" : panotiTob || "12:00",
        panotiNoTime,
        panotiSelectedCoords
      );
      
      const rashiMap = ["mesh", "vrishabh", "mithun", "karka", "simha", "kanya", "tula", "vrischika", "dhanu", "makar", "kumbh", "meen"];
      const rashiId = rashiMap[astro.rashiId - 1];
      
      handleCheckPanoti(rashiId);
    } catch (err) {
      alert("ગણતરી કરવામાં ભૂલ આવી, કૃપા કરી વિગતો ચકાસો.");
    }
  };

  // Set default rashi based on panchang transit rashi
  useEffect(() => {
    if (panchangData.rashi) {
      const matched = RASHI_DATA.find(r => r.name === panchangData.rashi.trim());
      if (matched) {
        setSelectedRashifalId(matched.id);
      }
    }
  }, [panchangData.rashi]);

  useEffect(() => {
    fetchData();
    
    // Tick every 10 seconds to keep the remaining minutes 100% accurate and ultra-responsive
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState('day');

  // Calculate dynamic Choghadiyas reactively on render (100% accurate and eliminates stale closure bugs)
  const choghadiyaResult = (panchangData.sunrise && panchangData.sunset)
    ? calculateChoghadiyas(panchangData.sunrise, panchangData.sunset, currentTime)
    : null;

  const activeChoghadiya = choghadiyaResult?.current || panchangData.choghadiya;
  const dayList = choghadiyaResult?.dayList || panchangData.choghadiyaList;
  const nightList = choghadiyaResult?.nightList || [];

  const dynamicMuhurts = (panchangData.sunrise && panchangData.sunset)
    ? calculateMuhurts(panchangData.sunrise, panchangData.sunset, currentTime)
    : null;

  const displayMuhurts = dynamicMuhurts || panchangData.muhurts;

  // Automatically switch tab on load based on whether it is daytime or nighttime right now
  useEffect(() => {
    if (choghadiyaResult) {
      const isNightTime = choghadiyaResult.nightList.some(ch => 
        currentTime >= ch.startTime && currentTime < ch.endTime
      );
      setActiveTab(isNightTime ? 'night' : 'day');
    }
  }, [panchangData.sunrise, panchangData.sunset]);

  const MirrorIcon = ({ color = "border-primary/20" }) => (
    <div className={`h-4 w-4 rounded-full bg-white shadow-inner flex items-center justify-center border ${color}`}>
      <div className="h-2 w-2 rounded-full bg-gradient-to-tr from-stone-200 to-white"></div>
    </div>
  );

  const translateTithiToGujarati = (tithiStr) => {
    if (!tithiStr) return "";
    let res = tithiStr;
    const translations = {
      "Ekadasi": "એકાદશી",
      "Ekadashi": "એકાદશી",
      "Prathama": "એકમ",
      "Pratham": "એકમ",
      "Dwitiya": "બીજ",
      "Tritiya": "ત્રીજ",
      "Chaturthi": "ચોથ",
      "Panchami": "પાંચમ",
      "Shasthi": "છઠ",
      "Shashthi": "છઠ",
      "Saptami": "સાતમ",
      "Ashtami": "આઠમ",
      "Navami": "નોમ",
      "Dashami": "દશમ",
      "Dwadashi": "બારસ",
      "Dwadoshi": "બારસ",
      "Dvadasi": "બારસ",
      "Trayodashi": "તેરસ",
      "Trayodasi": "તેરસ",
      "Chaturdashi": "ચૌદશ",
      "Chaturdasi": "ચૌદશ",
      "Purnima": "પૂનમ",
      "Pournami": "પૂનમ",
      "Amavasya": "અમાસ",
      "Amavas": "અમાસ"
    };
    Object.keys(translations).forEach(eng => {
      const regex = new RegExp(eng, "gi");
      res = res.replace(regex, translations[eng]);
    });
    return res;
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Choghadiya Header - Visual Status (Redesigned with Premium Responsive Layout) */}
      <div className={`rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 shadow-sm transition-all border border-[#E8E6E3] ${activeChoghadiya.isGood ? 'bg-[#F4F4F0]' : 'bg-[#F4F4F0]'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl flex items-center justify-center border ${activeChoghadiya.isGood ? 'bg-[#2D3748] border-[#2D3748]' : 'bg-[#FFFFFF] border-[#0D9488]/50'}`}>
                    <span className={`material-symbols-outlined text-2xl sm:text-4xl animate-pulse ${activeChoghadiya.isGood ? 'text-[#0D9488]' : 'text-[#0D9488]'}`}>
                        {activeChoghadiya.isGood ? 'verified' : 'info'}
                    </span>
                </div>
                <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                   <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl sm:text-2xl md:text-3xl text-[#2D3748] leading-tight">અત્યારે {activeChoghadiya.name} ચોઘડિયું છે</h3>
                   <p className={`font-gujarati font-bold text-xs sm:text-sm md:text-base flex items-center gap-1.5 text-[#0D9488]`}>
                       <span className="material-symbols-outlined text-sm">{activeChoghadiya.isGood ? 'check_circle' : 'warning'}</span>
                       <span>{activeChoghadiya.isGood ? 'અત્યારે શુભ કાર્ય કરી શકાય છે' : 'અત્યારે નવું કામ શરૂ ન કરવું'}</span>
                   </p>
                </div>
            </div>
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#E8E6E3] pt-3 md:pt-0 mt-1 md:mt-0 flex-shrink-0">
                <p className="font-gujarati text-[10px] sm:text-xs opacity-60 uppercase md:mb-1 text-[#1A1614]">બાકી સમય</p>
                <p className="font-headline font-black text-lg sm:text-2xl text-[#2D3748] bg-[#FFFFFF] px-3 py-1 rounded-xl shadow-sm border border-[#E8E6E3] md:bg-transparent md:p-0 md:shadow-none md:border-none">{activeChoghadiya.timeRemaining}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Main Panchang & Astro Card */}
        <div className="bg-white dark:bg-dark-surface rounded-[3rem] p-8 shadow-2xl relative border-t-8 border-primary">
            <div className="absolute top-4 right-8 flex gap-2">
                <MirrorIcon />
                <MirrorIcon />
            </div>

            <div className="space-y-6">
                <div className="text-center">
                    <p className="font-gujarati font-bold text-primary tracking-widest uppercase">{panchangData.maas} માસ • {panchangData.paksh} પક્ષ</p>
                    <h2 className="font-gujarati font-black text-4xl sm:text-5xl my-2">{translateTithiToGujarati(panchangData.tithi)}</h2>
                    {panchangData.tithiEnd && (
                      <p className="font-gujarati text-sm text-[#0D9488] font-bold mb-2">બદલાવ સમય: {panchangData.tithiEnd} સુધી</p>
                    )}
                    <p className="font-gujarati font-black text-2xl text-stone-600 dark:text-stone-300 my-2">{panchangData.vaar || new Date().toLocaleDateString('gu-IN', { weekday: 'long' })}</p>
                    <p className="font-headline font-black text-xl opacity-40">{panchangData.date}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4 bg-stone-50 dark:bg-dark-bg p-6 rounded-[2rem]">
                    <div className="text-center border-r border-stone-200">
                        <span className="material-symbols-outlined text-teal-500 mb-1">brightness_3</span>
                        <p className="font-gujarati text-xs opacity-60">આજની રાશિ</p>
                        <p className="font-gujarati font-black text-2xl">{panchangData.rashi}</p>
                    </div>
                    <div className="text-center">
                        <span className="material-symbols-outlined text-teal-500 mb-1">auto_awesome</span>
                        <p className="font-gujarati text-xs opacity-60">આજનું નક્ષત્ર</p>
                        <p className="font-gujarati font-black text-2xl">{panchangData.nakshatra}</p>
                        {panchangData.nakshatraEnd && (
                          <p className="font-gujarati text-[11px] text-[#0D9488] font-bold mt-1">{panchangData.nakshatraEnd} સુધી</p>
                        )}
                    </div>
                    <div className="text-center border-r border-stone-200 pt-4 border-t border-stone-200">
                        <span className="material-symbols-outlined text-purple-500 mb-1">join_inner</span>
                        <p className="font-gujarati text-xs opacity-60">આજનો યોગ</p>
                        <p className="font-gujarati font-black text-2xl">{panchangData.yoga}</p>
                        {panchangData.yogaEnd && (
                          <p className="font-gujarati text-[11px] text-purple-600 font-bold mt-1">{panchangData.yogaEnd} સુધી</p>
                        )}
                    </div>
                    <div className="text-center pt-4 border-t border-stone-200">
                        <span className="material-symbols-outlined text-amber-500 mb-1">hive</span>
                        <p className="font-gujarati text-xs opacity-60">આજનું કરણ</p>
                        <p className="font-gujarati font-black text-xl" style={{ fontSize: '1.2rem' }}>{panchangData.karana}</p>
                        {panchangData.karanaEnd && (
                          <p className="font-gujarati text-[11px] text-amber-600 font-bold mt-1">{panchangData.karanaEnd} સુધી</p>
                        )}
                    </div>
                </div>

                {/* 3. Baby Names Section */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl border border-yellow-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-yellow-700">child_care</span>
                        <div>
                            <p className="font-gujarati text-sm font-black text-yellow-900 dark:text-yellow-200">આજે જન્મેલા બાળકો માટે અક્ષર</p>
                            <p className="font-gujarati font-bold text-2xl text-yellow-900 dark:text-yellow-100">{panchangData.rashiLetters}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-surface h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-yellow-700">info</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. Muhurts & Sun Timing */}
        <div className="space-y-6">
            <div className="bg-[#FFFFFF] dark:bg-dark-surface rounded-[2.5rem] p-6 shadow-sm border border-[#E8E6E3] space-y-4">
                <h4 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl flex items-center gap-2 text-[#2D3748]">
                    <span className="material-symbols-outlined text-[#0D9488]">schedule</span>
                    આજના ખાસ મુહૂર્ત
                </h4>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-[#F4F4F0] dark:bg-emerald-900/20 rounded-2xl border border-[#0D9488]/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#2D3748] text-[#0D9488] rounded-xl flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined">stars</span>
                            </div>
                            <span className="font-gujarati font-bold text-[#2D3748]">અભિજીત મુહૂર્ત</span>
                        </div>
                        <span className="font-headline font-black text-[#2D3748]">{displayMuhurts.abhijit}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#F4F4F0] dark:bg-emerald-900/20 rounded-2xl border border-[#E8E6E3]">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#FFFFFF] text-[#0D9488] border border-[#E8E6E3] rounded-xl flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined">dangerous</span>
                            </div>
                            <span className="font-gujarati font-bold text-[#1A1614]">રાહુ કાળ</span>
                        </div>
                        <span className="font-headline font-black text-[#1A1614]">{displayMuhurts.rahuKaal}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F4F4F0] border border-[#E8E6E3] rounded-[2rem] p-6 text-[#2D3748] shadow-sm">
                    <span className="material-symbols-outlined text-4xl mb-2 text-[#0D9488]">wb_sunny</span>
                    <p className="font-gujarati font-bold opacity-80">સૂર્યોદય (નવકારશી)</p>
                    <p className="font-headline font-black text-2xl">{panchangData.sunrise}</p>
                </div>
                <div className="bg-[#2D3748] border border-[#2D3748] rounded-[2rem] p-6 text-[#F4F4F0] shadow-sm">
                    <span className="material-symbols-outlined text-4xl mb-2 text-yellow-400">wb_twilight</span>
                    <p className="font-gujarati font-bold opacity-80 text-[#F4F4F0]">સૂર્યાસ્ત (ચોવિહાર)</p>
                    <p className="font-headline font-black text-2xl text-[#F4F4F0]">{panchangData.sunset}</p>
                </div>
            </div>
        </div>
      </div>

      {/* 5. Full Choghadiya List (Segmented Day/Night Tabs inspired by Drik Panchang) */}
      <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-gujarati font-black text-2xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500">grid_view</span>
                  આજના ચોઘડિયા
              </h3>
              
              {/* Premium Day/Night Segmented Toggle */}
              <div className="flex bg-stone-100 dark:bg-dark-bg p-1 rounded-2xl w-full sm:w-fit flex-shrink-0">
                  <button 
                    onClick={() => setActiveTab('day')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-gujarati font-bold transition-all ${activeTab === 'day' ? 'bg-white dark:bg-dark-surface text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    <span className="material-symbols-outlined text-sm text-teal-600">light_mode</span>
                    દિવસ
                  </button>
                  <button 
                    onClick={() => setActiveTab('night')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-gujarati font-bold transition-all ${activeTab === 'night' ? 'bg-white dark:bg-dark-surface text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    <span className="material-symbols-outlined text-sm text-teal-500">dark_mode</span>
                    રાત્રિ
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(activeTab === 'day' ? dayList : nightList).map((ch, idx) => {
                  const isActive = currentTime >= ch.startTime && currentTime < ch.endTime;
                  return (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-[1.75rem] border transition-all flex flex-col items-center justify-between text-center relative ${
                          isActive 
                            ? 'bg-[#2D3748] border-[#2D3748] text-[#F4F4F0] shadow-md scale-105 z-10' 
                            : ch.isGood 
                              ? 'bg-[#FFFFFF] border-[#E8E6E3] text-[#2D3748] hover:border-[#0D9488]/50' 
                              : 'bg-[#F4F4F0] border-[#E8E6E3] text-[#1A1614] hover:border-[#0D9488]/30'
                        }`}
                      >
                          {/* Glowing Active Badge */}
                          {isActive && (
                              <span className="absolute -top-2.5 px-3 py-0.5 bg-[#0D9488] text-[#FFFFFF] font-gujarati text-[9px] font-black rounded-full shadow-sm uppercase tracking-wider">
                                અત્યારે ચાલુ
                              </span>
                          )}
                          <div className="flex flex-col items-center">
                              <span className={`material-symbols-outlined mb-1 text-xl ${isActive ? 'text-teal-400' : ch.isGood ? 'text-[#2D3748]' : 'text-[#78716C]'}`}>
                                  {isActive ? 'bolt' : ch.isGood ? 'check_circle' : 'info'}
                              </span>
                              <p className={`font-gujarati font-black text-lg ${isActive ? 'text-[#F4F4F0]' : ''}`}>{ch.name}</p>
                          </div>
                          <p className="font-headline font-black text-[10px] opacity-60 mt-2">{ch.time}</p>
                       </div>
                   );
               })}
          </div>
      </div>

      {/* 6. Rashifal (Today's Horoscope) Section */}
      <div className="bg-[#FFFFFF] dark:bg-dark-surface rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6 border border-[#E8E6E3]">
          <div className="flex items-center gap-2 text-[#2D3748]">
              <span className="material-symbols-outlined text-[#0D9488] text-3xl font-black">stars</span>
              <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-2xl">આજનું રાશિફળ (Daily Horoscope)</h3>
          </div>
          <p className="font-gujarati text-xs text-[#78716C]">તમારા દૈનિક વ્યવહાર, આરોગ્ય અને પારિવારિક જીવનનું જ્યોતિષ માર્ગદર્શન.</p>
          
          {/* Scrollable Rashi Selector Carousel */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 border-b border-[#E8E6E3] dark:border-stone-850">
              {RASHI_DATA.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRashifalId(r.id)}
                    className={`px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[75px] border transition-all active:scale-95
                      ${selectedRashifalId === r.id 
                        ? 'bg-[#2D3748] border-[#2D3748] text-[#F4F4F0] shadow-md font-black scale-105' 
                        : 'bg-[#F4F4F0] dark:bg-stone-850 border-[#E8E6E3] text-[#1A1614] hover:bg-[#FFFFFF]'}`}
                  >
                      <span className="text-2xl mb-1">{r.emoji}</span>
                      <span className="font-gujarati text-sm font-black">{r.name}</span>
                      <span className="text-[10px] opacity-60 font-medium font-sans">{r.nameEn}</span>
                  </button>
              ))}
          </div>

          {/* Selected Rashi's Prediction Content */}
          {(() => {
              const rashiObj = RASHI_DATA.find(r => r.id === selectedRashifalId) || RASHI_DATA[0];
              const rashifal = generateDailyRashifal(rashiObj.id);
              
              return (
                  <div className="space-y-6">
                      {/* Rashi Header Info Banner */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F4F4F0] p-5 rounded-3xl border border-[#0D9488]/20">
                          <div className="flex items-center gap-3">
                              <span className="text-4xl">{rashiObj.emoji}</span>
                              <div>
                                  <h4 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl text-[#2D3748]">{rashiObj.name} રાશિ</h4>
                                  <p className="font-gujarati text-xs text-[#1A1614] font-bold mt-1">નામ અક્ષરો: <span className="font-sans font-black">{rashiObj.letters}</span></p>
                              </div>
                          </div>
                          
                          {/* Lucky indicators */}
                          <div className="flex gap-4 w-full sm:w-auto">
                              <div className="bg-[#FFFFFF] dark:bg-stone-900 px-4 py-2 rounded-2xl border border-[#E8E6E3] shadow-sm text-center flex-1 sm:flex-initial min-w-[80px]">
                                  <p className="font-gujarati text-[9px] font-black text-[#78716C]">શુભ અંક</p>
                                  <p className="font-headline font-black text-lg text-[#2D3748]">{rashifal.luckyNumber}</p>
                              </div>
                              <div className="bg-[#FFFFFF] dark:bg-stone-900 px-4 py-2 rounded-2xl border border-[#E8E6E3] shadow-sm text-center flex-1 sm:flex-initial min-w-[80px]">
                                  <p className="font-gujarati text-[9px] font-black text-[#78716C]">શુભ રંગ</p>
                                  <p className="font-gujarati font-black text-sm text-[#2D3748] mt-1">{rashifal.luckyColor}</p>
                              </div>
                          </div>
                      </div>

                      {/* Main Rashifal Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Career */}
                          <PredictionCard 
                            icon="work" 
                            title="નૌકરી અને વ્યવસાય" 
                            desc={rashifal.career} 
                            color="border-[#E8E6E3] bg-[#FFFFFF]" 
                            iconColor="bg-[#F4F4F0] text-[#2D3748] border border-[#0D9488]/30" 
                          />
                          {/* Finance */}
                          <PredictionCard 
                            icon="payments" 
                            title="આર્થિક સ્થિતિ" 
                            desc={rashifal.finance} 
                            color="border-[#E8E6E3] bg-[#FFFFFF]" 
                            iconColor="bg-[#F4F4F0] text-[#2D3748] border border-[#0D9488]/30" 
                          />
                          {/* Family */}
                          <PredictionCard 
                            icon="family_history" 
                            title="કૌટુંબિક જીવન" 
                            desc={rashifal.family} 
                            color="border-[#E8E6E3] bg-[#FFFFFF]" 
                            iconColor="bg-[#F4F4F0] text-[#2D3748] border border-[#0D9488]/30" 
                          />
                          {/* Health */}
                          <PredictionCard 
                            icon="favorite" 
                            title="આરોગ્ય અને સ્વાસ્થ્ય" 
                            desc={rashifal.health} 
                            color="border-[#E8E6E3] bg-[#FFFFFF]" 
                            iconColor="bg-[#F4F4F0] text-[#2D3748] border border-[#0D9488]/30" 
                          />
                      </div>

                      {/* Daily Remedy Card */}
                      <div className="p-5 bg-[#2D3748] rounded-3xl border border-[#2D3748] flex gap-4 items-start shadow-sm">
                          <div className="h-10 w-10 bg-[#0D9488] text-[#FFFFFF] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#0D9488]">
                              <span className="material-symbols-outlined">auto_awesome</span>
                          </div>
                          <div>
                              <h5 className="font-gujarati font-black text-base text-[#0D9488]">આજનો વિશેષ ઉપાય (Remedy)</h5>
                              <p className="font-gujarati text-sm text-[#F4F4F0] leading-relaxed mt-1">{rashifal.remedy}</p>
                          </div>
                      </div>
                  </div>
              );
          })()}
      </div>

      {/* 7. Shani Panoti (Sade Sati & Dhayya) Checker Section */}
      <div id="panoti-section" className="bg-[#FFFFFF] dark:bg-dark-surface rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6 border border-[#E8E6E3]">
          <div className="flex items-center gap-2 text-[#2D3748]">
              <span className="material-symbols-outlined text-[#0D9488] text-3xl font-black">dark_mode</span>
              <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-2xl">શનિ પનૌતી ચેકર (સાડાસાતી / ઢય્યા)</h3>
          </div>
          <p className="font-gujarati text-xs text-[#78716C]">શનિ મહારાજના વર્તમાન ગોચર ભ્રમણના આધારે તમારી રાશિ પર પનૌતી ચેક કરો.</p>

          {/* Selector Tabs */}
          <div className="flex justify-center border-b border-black/5 pb-4">
            <div className="flex bg-stone-100 dark:bg-stone-850 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { setPanotiMode(true); setPanotiResult(null); }}
                className={`px-4 py-2 rounded-lg font-gujarati text-xs font-bold transition-all ${panotiMode ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                📝 રાશિ પસંદ કરો (જનરલ)
              </button>
              <button
                type="button"
                onClick={() => { setPanotiMode(false); setPanotiResult(null); }}
                className={`px-4 py-2 rounded-lg font-gujarati text-xs font-bold transition-all ${!panotiMode ? 'bg-white dark:bg-stone-700 text-primary shadow-xs' : 'text-stone-500'}`}
              >
                🕉️ જન્મ વિગતોથી ચેક કરો (પર્સનલ)
              </button>
            </div>
          </div>

          {panotiMode ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {RASHI_DATA.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleCheckPanoti(r.id)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95
                    ${panotiSelectedRashi?.id === r.id 
                      ? 'bg-[#2D3748] border-[#2D3748] text-white shadow-md font-black scale-105' 
                      : 'bg-[#F4F4F0] dark:bg-stone-850 border-[#E8E6E3] text-[#1A1614] dark:text-white hover:bg-[#FFFFFF]'}`}
                >
                  <span className="text-3xl">{r.emoji}</span>
                  <span className="font-gujarati font-black text-xs truncate max-w-full">{r.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleBirthPanotiSubmit} className="max-w-md mx-auto space-y-4 bg-[#F4F4F0] dark:bg-stone-850 p-6 rounded-3xl border border-[#0D9488]/20">
              <div className="space-y-1">
                <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300">જન્મ તારીખ</label>
                <input 
                  type="date"
                  value={panotiDob}
                  onChange={(e) => setPanotiDob(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/10 focus:border-[#0D9488] focus:outline-none bg-white dark:bg-stone-900 dark:text-white font-sans text-sm"
                  required
                />
              </div>

              <div className="space-y-1 relative">
                <div className="flex justify-between items-center">
                  <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300">જન્મ સમય</label>
                  <label className="flex items-center gap-1 cursor-pointer text-[10px] font-gujarati text-outline">
                    <input type="checkbox" checked={panotiNoTime} onChange={(e) => setPanotiNoTime(e.target.checked)} />
                    સમય ખબર નથી
                  </label>
                </div>
                <input 
                  type="time"
                  value={panotiTob}
                  disabled={panotiNoTime}
                  onChange={(e) => setPanotiTob(e.target.value)}
                  className="w-full p-3 rounded-xl border border-black/10 focus:border-[#0D9488] focus:outline-none bg-white dark:bg-stone-900 dark:text-white font-sans text-sm disabled:opacity-40"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="font-gujarati font-bold text-xs text-stone-600 dark:text-stone-300">જન્મ સ્થળ</label>
                <input 
                  type="text"
                  value={panotiBirthPlace}
                  onChange={(e) => setPanotiBirthPlace(e.target.value)}
                  placeholder="શહેર/ગામનું નામ..."
                  className="w-full p-3 rounded-xl border border-black/10 focus:border-[#0D9488] focus:outline-none bg-white dark:bg-stone-900 dark:text-white font-gujarati text-sm"
                />
                {panotiLoadingCoords && <span className="absolute right-3 bottom-3 text-xs text-stone-400 animate-spin">sync</span>}
                
                {panotiSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full bg-white dark:bg-stone-850 border border-black/5 rounded-xl shadow-xl z-55 max-h-40 overflow-y-auto divide-y divide-black/5">
                    {panotiSuggestions.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setPanotiBirthPlace(s.display_name.split(',')[0]);
                          setPanotiSelectedCoords({ lat: s.lat, lon: s.lon });
                          setPanotiSuggestions([]);
                        }}
                        className="p-3 text-xs font-gujarati cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950 truncate dark:text-white"
                      >
                        {s.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2D3748] hover:bg-[#1A1614] text-white font-gujarati font-black py-3 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs"
              >
                <span className="material-symbols-outlined text-sm font-black">dark_mode</span>
                શનિ પનૌતી ગણતરી કરો
              </button>
            </form>
          )}

          {/* Results Area */}
          {panotiResult && panotiSelectedRashi && (
            <div className="bg-gradient-to-br from-indigo-50/40 to-indigo-100/10 dark:from-stone-900 dark:to-stone-850 p-5 rounded-3xl border border-indigo-200/50 space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-4xl">{panotiSelectedRashi.emoji}</span>
                <h4 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl text-stone-850 dark:text-white">{panotiSelectedRashi.name} રાશિ શનિ પનૌતી અહેવાલ</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-black/5 text-center">
                  <span className="text-[10px] font-bold text-outline font-gujarati uppercase block">શનિ સ્થિતિ</span>
                  <span className={`font-gujarati font-black text-sm block mt-1 ${panotiResult.severity === 'danger' ? 'text-red-600' : panotiResult.severity === 'warning' ? 'text-amber-600' : 'text-green-600'}`}>{panotiResult.status}</span>
                </div>
                <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-black/5 text-center">
                  <span className="text-[10px] font-bold text-outline font-gujarati uppercase block">તબક્કો (Phase)</span>
                  <span className="font-gujarati font-black text-sm block mt-1 text-[#2D3748] dark:text-indigo-400">{panotiResult.phase}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-black/5 space-y-1.5">
                <h5 className="font-gujarati font-black text-xs text-[#2D3748] dark:text-indigo-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  જ્યોતિષીય વિશ્લેષણ
                </h5>
                <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{panotiResult.description}</p>
              </div>

              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/50 space-y-3">
                <h5 className="font-gujarati font-black text-xs text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-600">temple_hindu</span>
                  નિવારણ ઉપાયો (Remedies)
                </h5>
                <ul className="space-y-2">
                  {panotiResult.remedies.map((rem, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-stone-800 dark:text-stone-200 font-gujarati leading-relaxed">
                      <span className="h-4 w-4 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center font-bold text-amber-700 text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{rem}</span>
                    </li>
                  ))}
                </ul>

                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-200/40 flex justify-between items-center text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-outline font-gujarati">શનિ બીજ મંત્ર</span>
                    <p className="font-gujarati font-black text-xs text-amber-950 dark:text-amber-400">ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः");
                      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "મંત્ર કોપી થઈ ગયો છે! 🙏" } }));
                    }}
                    className="h-8 px-3 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-950 dark:text-amber-400 hover:bg-amber-200 text-[10px] font-gujarati font-bold active:scale-95 transition-all shrink-0"
                  >
                    કોપી
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

const PredictionCard = ({ icon, title, desc, color, iconColor }) => (
  <div className={`p-4 rounded-3xl border ${color} flex gap-3.5 items-start`}>
    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconColor}`}>
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="space-y-1 mt-1">
      <h5 className="font-gujarati font-bold text-sm text-[#2D3748] dark:text-[#F4F4F0]">{title}</h5>
      <p className="font-gujarati text-xs text-[#78716C] dark:text-[#A8A29E] leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Panchang;
