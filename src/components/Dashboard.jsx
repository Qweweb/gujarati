import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateChoghadiyas } from '../utils/choghadiya_helper';
import { API_ENDPOINTS } from '../config/api';
import ShareButton from './ShareButton';

const Dashboard = () => {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem('panchang_cache') || localStorage.getItem('panchang_cache_full');
    return cached ? JSON.parse(cached) : {
      user: "મહેમાન",
      tithi: "વૈશાખ સુદ બારસ",
      sunrise: "૦૬:૧૦ AM",
      sunset: "૦૭:૦૮ PM",
      choghadiya: { name: "લાભ", isGood: true, endTime: "૧૧:૪૫ AM" },
      suvichar: "સચ્ચાઈનો જ હંમેશા વિજય થાય છે!",
      healthTip: "બા, આજે સવારે પૂરતું પાણી પીધું?",
      communityAlert: "ખોરજ ગામમાં આવતીકાલે સવારે રસીકરણ કેમ્પ છે."
    };
  });

  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [challengeStreak, setChallengeStreak] = useState(0);
  const [hasPlayedChallenge, setHasPlayedChallenge] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastPlayed = localStorage.getItem('otlo_challenge_last_date');
    const savedStreak = parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10);
    setChallengeStreak(savedStreak);
    setHasPlayedChallenge(lastPlayed === today);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PANCHANG);
      if (!response.ok) throw new Error('API request failed');
      const apiData = await response.json();
      
      const updatedData = {
        ...data,
        tithi: apiData.tithi || data.tithi,
        sunrise: apiData.sunrise || data.sunrise,
        sunset: apiData.sunset || data.sunset,
        choghadiya: apiData.choghadiya || data.choghadiya,
        healthTip: apiData.healthTip || data.healthTip,
        suvichar: apiData.suvichar || data.suvichar,
        communityAlert: apiData.communityAlert || data.communityAlert
      };
      
      setData(updatedData);
      localStorage.setItem('panchang_cache', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Panchang API Error:", error);
      // Fallback to cache if exists
      const cached = localStorage.getItem('panchang_cache');
      if (cached) {
        setData(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Tick every 10 seconds to keep the remaining minutes 100% accurate and ultra-responsive
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    // Live Update: Refresh API data every 5 minutes
    const apiInterval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(apiInterval);
    };
  }, []);

  // Calculate dynamic Choghadiyas reactively on render
  const choghadiyaResult = calculateChoghadiyas(data.sunrise || "૦૬:૧૦ AM", data.sunset || "૦૭:૦૮ PM", currentTime);
  
  // Find current active choghadiya from dayList or nightList
  let activeChoghadiya = data.choghadiya;
  let timeRemainingText = "";
  
  if (choghadiyaResult) {
    const combined = [...choghadiyaResult.dayList, ...choghadiyaResult.nightList];
    const active = combined.find(ch => currentTime >= ch.startTime && currentTime < ch.endTime);
    if (active) {
      const formatTimeGu = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 -> 12
        const pad = (n) => n < 10 ? '0' + n : n;
        const gujaratiNumerals = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
        const toGu = (numStr) => numStr.toString().split('').map(digit => {
          if (digit >= '0' && digit <= '9') {
            return gujaratiNumerals[parseInt(digit, 10)];
          }
          return digit;
        }).join('');
        return `${toGu(pad(hours))}:${toGu(pad(minutes))} ${ampm}`;
      };
      
      activeChoghadiya = {
        name: active.name,
        isGood: active.isGood,
        endTime: formatTimeGu(active.endTime)
      };
      timeRemainingText = choghadiyaResult.current.timeRemaining;
    }
  }

  if (loading && !data.tithi) {
     return (
       <div className="flex items-center justify-center min-h-[50vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
       </div>
     );
  }

  const ServiceIcon = ({ icon, label, path, color, iconColor }) => (
    <Link to={path} className="flex flex-col items-center gap-2 group">
      <div className={`h-16 w-16 ${color} rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 active:scale-95 transition-all`}>
        <span className={`material-symbols-outlined text-3xl ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <span className="font-gujarati font-bold text-xs text-stone-700 dark:text-dark-text">{label}</span>
    </Link>
  );

  const todayDate = new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayVaar = new Date().toLocaleDateString('gu-IN', { weekday: 'long' });

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* 1. Compact Hero Slider (Tithi & Choghadiya) */}
      <section id="hero-slider" className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        <Link to="/panchang" className="flex-shrink-0 w-72 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
          <div className="absolute -right-4 -top-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]">temple_hindu</span>
          </div>
          <p className="font-gujarati font-bold text-xs opacity-80 uppercase tracking-widest">આજની તિથિ</p>
          <h2 className="font-gujarati font-black text-2xl mt-1">{data.tithi}</h2>
          <p className="font-gujarati font-bold text-xs mt-1.5 opacity-90">{todayVaar} • {todayDate}</p>
          <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs">
            <span className="material-symbols-outlined text-sm">event</span>
            <span className="font-gujarati font-bold">વિગતવાર પંચાંગ જુઓ</span>
          </div>
        </Link>

        <Link to="/panchang" className={`flex-shrink-0 w-72 rounded-3xl p-5 shadow-lg relative overflow-hidden border-2 group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ${activeChoghadiya.isGood ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' : 'bg-rose-50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50'}`}>
          <p className={`font-gujarati font-bold text-xs uppercase tracking-widest ${activeChoghadiya.isGood ? 'text-emerald-600 dark:text-emerald-455' : 'text-rose-600 dark:text-rose-455'}`}>અત્યારે ચોઘડિયું</p>
          <h2 className={`font-gujarati font-black text-3xl mt-1 flex items-baseline gap-2 ${activeChoghadiya.isGood ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
            {activeChoghadiya.name}
            {timeRemainingText && (
              <span className={`text-xs font-bold font-gujarati ${activeChoghadiya.isGood ? 'text-emerald-600/80 dark:text-emerald-400/80' : 'text-rose-600/80 dark:text-rose-400/80'}`}>
                ({timeRemainingText} બાકી)
              </span>
            )}
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <span className={`font-gujarati font-bold text-xs ${activeChoghadiya.isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{activeChoghadiya.endTime} સુધી</span>
            <span className={`material-symbols-outlined ${activeChoghadiya.isGood ? 'text-emerald-500' : 'text-rose-500'} animate-pulse`}>
               {activeChoghadiya.isGood ? 'check_circle' : 'warning'}
            </span>
          </div>
        </Link>
      </section>

      {/* 1.5. Daily Challenge Widget */}
      <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-[2.5rem] p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-amber-550 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-3xl font-bold animate-pulse">psychology</span>
          </div>
          <div>
            <h4 className="font-gujarati font-black text-xl leading-tight text-stone-850 dark:text-stone-100">આજની શબ્દ રમત 🧠</h4>
            <p className="font-gujarati text-xs text-stone-605 dark:text-stone-300 mt-1.5">
              {hasPlayedChallenge 
                ? `અદ્ભુત! આજનું રમવાનું પૂર્ણ છે. (સ્ટ્રીક: ${challengeStreak} દિવસ)`
                : `નવા અક્ષરો ગોઠવી વર્ડ પઝલ ઉકેલો અને +૧૫ કોઈન્સ મેળવો!`
              }
            </p>
          </div>
        </div>
        <Link 
          to="/daily-challenge" 
          className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md shrink-0 active:scale-95 transition-transform"
        >
          {hasPlayedChallenge ? "સ્ટેટસ જુઓ ➔" : "હમણાં રમો ➔"}
        </Link>
      </section>

      {/* 2. Services Grid (Quick Discovery) */}
      <section id="services-grid" className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm grid grid-cols-4 gap-y-6">
        <ServiceIcon icon="description" label="બાયોડેટા" path="/biodata" color="bg-blue-50 dark:bg-blue-950/20" iconColor="text-blue-600 dark:text-blue-400" />
        <ServiceIcon icon="auto_stories" label="ભક્તિ" path="/devotional" color="bg-rose-50 dark:bg-rose-950/20" iconColor="text-rose-600 dark:text-rose-400" />
        <ServiceIcon icon="temple_hindu" label="કુળદેવી" path="/kuldevi" color="bg-orange-50 dark:bg-orange-950/20" iconColor="text-orange-600 dark:text-orange-400" />
        <ServiceIcon icon="favorite" label="સ્વાસ્થ્ય" path="/health" color="bg-emerald-50 dark:bg-emerald-950/20" iconColor="text-emerald-600 dark:text-emerald-400" />
        <ServiceIcon icon="calendar_month" label="પંચાંગ" path="/panchang" color="bg-amber-50 dark:bg-amber-950/20" iconColor="text-amber-600 dark:text-amber-400" />
        <ServiceIcon icon="grid_view" label="ચોઘડિયા" path="/panchang" color="bg-purple-50 dark:bg-purple-950/20" iconColor="text-purple-600 dark:text-purple-400" />
        <ServiceIcon icon="stars" label="કુંડળી" path="/kundali" color="bg-indigo-50 dark:bg-indigo-950/20" iconColor="text-indigo-600 dark:text-indigo-400" />
        <ServiceIcon icon="explore" label="વાસ્તુ" path="/vastu" color="bg-teal-50 dark:bg-teal-950/20" iconColor="text-teal-650 dark:text-teal-400" />
        <ServiceIcon icon="auto_fix_high" label="નામકરણ" path="/namkaran" color="bg-pink-50 dark:bg-pink-950/20" iconColor="text-pink-650 dark:text-pink-400" />
        <ServiceIcon icon="calculate" label="વ્યાજ ગણક" path="/interest-calculator" color="bg-cyan-50 dark:bg-cyan-950/20" iconColor="text-cyan-600 dark:text-cyan-400" />
        <ServiceIcon icon="quiz" label="જ્ઞાન ક્વિઝ" path="/kbc-quiz" color="bg-red-50 dark:bg-red-950/20" iconColor="text-red-650 dark:text-red-400" />
        <ServiceIcon icon="settings" label="સેટિંગ્સ" path="/settings" color="bg-stone-50 dark:bg-stone-900/40" iconColor="text-stone-600 dark:text-stone-400" />
      </section>

      {/* 2.5. Gujarat Safari Prominent Card */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 opacity-10 scale-150">
          <span className="material-symbols-outlined text-[120px]">explore</span>
        </div>
        <div className="flex items-center gap-6 z-10">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 text-4xl select-none">
            🦁
          </div>
          <div>
            <h4 className="font-gujarati font-black text-2xl leading-tight">ગુજરાત સફારી (Gujarat Safari) 🗺️</h4>
            <p className="font-gujarati text-xs opacity-90 mt-1.5 max-w-md leading-relaxed">
              બાળકો માટે વિશેષ સંવાદ નકશો! સિંહ 🦁, ડાયનાસોર 🦖 અને મોર 🦚 ના પાત્રો પર ક્લિક કરો અને તેમના જ અવાજમાં રોચક માહિતી સાંભળો.
            </p>
          </div>
        </div>
        <Link 
          to="/gujarat-safari" 
          className="bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl font-gujarati font-black text-sm shadow-lg shrink-0 active:scale-95 transition-all relative z-10"
        >
          સફારી શરૂ કરો 🎧 ➔
        </Link>
      </section>

      {/* 3. Daily Health Tip (Personalized) */}
      <section id="health-tip" className="bg-emerald-600 rounded-[2.5rem] p-6 text-white shadow-xl flex items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <span className="material-symbols-outlined text-[100px]">healing</span>
        </div>
        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-4xl">favorite</span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-gujarati font-black text-xl mb-1">સ્વાસ્થ્ય ટિપ્સ</h4>
            <ShareButton 
              sectionId="health-tip" 
              successMessage="🍀 સ્વાસ્થ્ય ટિપ્સની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" 
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
            />
          </div>
          <p className="font-gujarati font-bold text-sm opacity-90">{data.healthTip}</p>
        </div>
      </section>

      {/* 4. WhatsApp Status Preview (Shareable Suvichar) */}
      <section id="daily-suvichar" className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] shadow-sm space-y-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <h4 className="font-gujarati font-black text-xl">આજનો સુવિચાર</h4>
                <ShareButton sectionId="daily-suvichar" successMessage="✨ આજના સુવિચારની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-gujarati font-bold text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">share</span> Whatsapp
            </span>
        </div>
        <div className="aspect-video bg-gradient-to-br from-[#fef8f1] to-[#f9f3ea] rounded-3xl p-8 flex items-center justify-center text-center relative border-2 border-primary/5">
             <span className="material-symbols-outlined absolute top-4 left-4 text-primary/20 text-4xl">format_quote</span>
             <p className="font-gujarati font-black text-2xl text-stone-800 leading-relaxed italic">"{data.suvichar}"</p>
             <span className="material-symbols-outlined absolute bottom-4 right-4 text-primary/20 text-4xl">format_quote</span>
        </div>
      </section>

      {/* 4.5. Gamification Activities Grid */}
      <section className="space-y-4">
        <h4 className="font-gujarati font-black text-xl px-2">મનોરંજન અને જ્ઞાન સંગાથ 🎮</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <Link to="/passport" className="bg-[#f0f4ff] dark:bg-stone-900 border border-blue-200 dark:border-stone-850 p-6 rounded-[2rem] flex items-center gap-4 hover:border-blue-500/30 transition-all shadow-sm">
            <div className="h-14 w-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">menu_book</span>
            </div>
            <div>
              <h5 className="font-gujarati font-black text-lg text-stone-855 dark:text-stone-100">ટ્રાવેલ પાસપોર્ટ 📖</h5>
              <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 mt-0.5">GPS મુલાકાત વેરિફાય કરી મેળવો કૂપન અને સ્ટેમ્પ્સ</p>
            </div>
          </Link>

          <Link to="/mysteries" className="bg-[#fff0f3] dark:bg-stone-900 border border-rose-200 dark:border-stone-855 p-6 rounded-[2rem] flex items-center gap-4 hover:border-rose-500/30 transition-all shadow-sm">
            <div className="h-14 w-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">search</span>
            </div>
            <div>
              <h5 className="font-gujarati font-black text-lg text-stone-855 dark:text-stone-100">ગુજરાતના રહસ્યો 🕵️‍♂️</h5>
              <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 mt-0.5">કાળો ડુંગર અને દુમસ બીચ પાછળનું વિજ્ઞાન જાણો</p>
            </div>
          </Link>

          <Link to="/swipe-cards" className="bg-[#faf5ff] dark:bg-stone-900 border border-purple-200 dark:border-stone-855 p-6 rounded-[2rem] flex items-center gap-4 hover:border-purple-500/30 transition-all shadow-sm">
            <div className="h-14 w-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">style</span>
            </div>
            <div>
              <h5 className="font-gujarati font-black text-lg text-stone-855 dark:text-stone-100">જ્ઞાન કાર્ડ્સ 🎴</h5>
              <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 mt-0.5">ગુજરાતની કળા અને પેલેસ વિશે સ્વાઇપ કરી શીખો</p>
            </div>
          </Link>

          <Link to="/gujarat-quiz" className="bg-[#fffaf0] dark:bg-stone-900 border border-orange-200 dark:border-stone-855 p-6 rounded-[2rem] flex items-center gap-4 hover:border-orange-500/30 transition-all shadow-sm">
            <div className="h-14 w-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl font-bold">workspace_premium</span>
            </div>
            <div>
              <h5 className="font-gujarati font-black text-lg text-stone-855 dark:text-stone-100">જ્ઞાન ક્વિઝ 🏆</h5>
              <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 mt-0.5">ફોટા સાથેની રોચક સવાલોત્તરી રમી કૂપન જીતો</p>
            </div>
          </Link>

        </div>
      </section>

      {/* 5. Community Alert Section */}
      <section className="bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 p-6 rounded-[2.5rem] flex gap-4">
        <div className="h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">campaign</span>
        </div>
        <div>
          <h4 className="font-gujarati font-black text-lg text-amber-900 dark:text-amber-200">જાહેર ખબર</h4>
          <p className="font-gujarati font-bold text-sm text-amber-800 dark:text-amber-100">{data.communityAlert}</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
