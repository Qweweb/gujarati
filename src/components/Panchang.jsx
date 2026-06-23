import { useState, useEffect } from 'react';
import { calculateChoghadiyas, calculateMuhurts } from '../utils/choghadiya_helper';
import { getDailyPanchang } from '../utils/panchangEngine';
import { RASHI_DATA, generateDailyRashifal } from '../data/rashifalDatabase';

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
