import { useState, useEffect } from 'react';
import { calculateChoghadiyas, calculateMuhurts } from '../utils/choghadiya_helper';
import { API_ENDPOINTS } from '../config/api';

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
      const response = await fetch(API_ENDPOINTS.PANCHANG);
      if (!response.ok) throw new Error('API request failed');
      const apiData = await response.json();
      
      const updatedData = {
        ...panchangData,
        ...apiData,
        date: new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        vaar: new Date().toLocaleDateString('gu-IN', { weekday: 'long' }),
        loading: false
      };
      
      setPanchangData(updatedData);
      localStorage.setItem('panchang_cache_full', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Panchang Details API Error:", error);
      setPanchangData(prev => ({ ...prev, loading: false }));
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="space-y-6">
      {/* 1. Live Choghadiya Header - Visual Status (Redesigned with Premium Responsive Layout) */}
      <div className={`rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 shadow-xl transition-all border-b-8 ${activeChoghadiya.isGood ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0 ${activeChoghadiya.isGood ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                    <span className="material-symbols-outlined text-white text-2xl sm:text-4xl animate-pulse">
                        {activeChoghadiya.isGood ? 'check_circle' : 'warning'}
                    </span>
                </div>
                <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                   <h3 className="font-gujarati font-black text-xl sm:text-2xl md:text-3xl text-stone-800 leading-tight">અત્યારે {activeChoghadiya.name} ચોઘડિયું છે</h3>
                   <p className={`font-gujarati font-bold text-xs sm:text-sm md:text-base flex items-center gap-1.5 ${activeChoghadiya.isGood ? 'text-emerald-700' : 'text-rose-700'}`}>
                       <span>{activeChoghadiya.isGood ? '✅' : '❌'}</span>
                       <span>{activeChoghadiya.isGood ? 'અત્યારે શુભ કાર્ય કરી શકાય છે' : 'અત્યારે નવું કામ શરૂ ન કરવું'}</span>
                   </p>
                </div>
            </div>
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-stone-200/50 pt-3 md:pt-0 mt-1 md:mt-0 flex-shrink-0">
                <p className="font-gujarati text-[10px] sm:text-xs opacity-60 uppercase md:mb-1">બાકી સમય</p>
                <p className="font-headline font-black text-lg sm:text-2xl text-stone-800 bg-white/60 dark:bg-dark-surface/40 px-3 py-1 rounded-xl shadow-sm border border-stone-200/20 md:bg-transparent md:p-0 md:shadow-none md:border-none">{activeChoghadiya.timeRemaining}</p>
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
                    <h2 className="font-gujarati font-black text-4xl sm:text-5xl my-2">{panchangData.tithi}</h2>
                    <p className="font-gujarati font-black text-2xl text-stone-600 dark:text-stone-300 my-2">{panchangData.vaar || new Date().toLocaleDateString('gu-IN', { weekday: 'long' })}</p>
                    <p className="font-headline font-black text-xl opacity-40">{panchangData.date}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-dark-bg p-6 rounded-[2rem]">
                    <div className="text-center border-r border-stone-200">
                        <span className="material-symbols-outlined text-indigo-500 mb-1">brightness_3</span>
                        <p className="font-gujarati text-xs opacity-60">આજની રાશિ</p>
                        <p className="font-gujarati font-black text-2xl">{panchangData.rashi}</p>
                    </div>
                    <div className="text-center">
                        <span className="material-symbols-outlined text-teal-500 mb-1">auto_awesome</span>
                        <p className="font-gujarati text-xs opacity-60">આજનું નક્ષત્ર</p>
                        <p className="font-gujarati font-black text-2xl">{panchangData.nakshatra}</p>
                    </div>
                </div>

                {/* 3. Baby Names Section */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-amber-600">child_care</span>
                        <div>
                            <p className="font-gujarati text-sm font-black text-amber-800 dark:text-amber-200">આજે જન્મેલા બાળકો માટે અક્ષર</p>
                            <p className="font-gujarati font-bold text-2xl text-amber-900 dark:text-amber-100">{panchangData.rashiLetters}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-surface h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-amber-600">info</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 4. Muhurts & Sun Timing */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-6 shadow-xl space-y-4">
                <h4 className="font-gujarati font-black text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">schedule</span>
                    આજના ખાસ મુહૂર્ત
                </h4>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined">stars</span>
                            </div>
                            <span className="font-gujarati font-bold text-emerald-900 dark:text-emerald-100">અભિજીત મુહૂર્ત</span>
                        </div>
                        <span className="font-headline font-black text-emerald-700 dark:text-emerald-200">{displayMuhurts.abhijit}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined">dangerous</span>
                            </div>
                            <span className="font-gujarati font-bold text-rose-900 dark:text-rose-100">રાહુ કાળ</span>
                        </div>
                        <span className="font-headline font-black text-rose-700 dark:text-rose-200">{displayMuhurts.rahuKaal}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-6 text-white shadow-xl">
                    <span className="material-symbols-outlined text-4xl mb-2">wb_sunny</span>
                    <p className="font-gujarati font-bold opacity-80">સૂર્યોદય (નવકારશી)</p>
                    <p className="font-headline font-black text-2xl">{panchangData.sunrise}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2rem] p-6 text-white shadow-xl">
                    <span className="material-symbols-outlined text-4xl mb-2">wb_twilight</span>
                    <p className="font-gujarati font-bold opacity-80">સૂર્યાસ્ત (ચોવિહાર)</p>
                    <p className="font-headline font-black text-2xl">{panchangData.sunset}</p>
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
                    <span className="material-symbols-outlined text-sm text-orange-500">light_mode</span>
                    દિવસ
                  </button>
                  <button 
                    onClick={() => setActiveTab('night')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-gujarati font-bold transition-all ${activeTab === 'night' ? 'bg-white dark:bg-dark-surface text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    <span className="material-symbols-outlined text-sm text-indigo-500">dark_mode</span>
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
                        className={`p-4 rounded-[1.75rem] border-2 transition-all flex flex-col items-center justify-between text-center relative ${
                          isActive 
                            ? 'bg-gradient-to-b from-amber-50 to-orange-50/30 border-orange-400 text-orange-950 shadow-lg scale-105 z-10' 
                            : ch.isGood 
                              ? 'bg-emerald-50/50 border-emerald-100/70 text-emerald-900 hover:border-emerald-200' 
                              : 'bg-rose-50/50 border-rose-100/70 text-rose-900 hover:border-rose-200'
                        }`}
                      >
                          {/* Glowing Active Badge */}
                          {isActive && (
                              <span className="absolute -top-2.5 px-3 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-gujarati text-[9px] font-black rounded-full shadow-md animate-bounce uppercase tracking-wider">
                                અત્યારે ચાલુ
                              </span>
                          )}
                          <div className="flex flex-col items-center">
                              <span className={`material-symbols-outlined mb-1 text-xl ${isActive ? 'text-orange-500' : ch.isGood ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {isActive ? 'bolt' : ch.isGood ? 'check_circle' : 'block'}
                              </span>
                              <p className={`font-gujarati font-black text-lg ${isActive ? 'text-orange-950' : ''}`}>{ch.name}</p>
                          </div>
                          <p className="font-headline font-black text-[10px] opacity-60 mt-2">{ch.time}</p>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export default Panchang;
