import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';
import { API_ENDPOINTS } from '../config/api';
import { calculateMuhurts, toGujaratiDigits, toEnglishDigits } from '../utils/choghadiya_helper';
import { getDailyPanchang } from '../utils/panchangEngine';

const Tools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const isDev = localStorage.getItem('user_phone') === '9999999999';

  // Calendar states
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Panchang states
  const [panchangData, setPanchangData] = useState(() => {
    const cached = localStorage.getItem('panchang_cache_full') || localStorage.getItem('panchang_cache');
    const initialData = cached ? JSON.parse(cached) : {
      tithi: "અધિક જેઠ સુદ બારસ",
      paksh: "સુદ",
      maas: "અધિક જેઠ",
      rashi: "વૃષભ",
      nakshatra: "રોહિણી",
      sunrise: "૦૫:૫૬ AM",
      sunset: "૦૭:૨૦ PM",
      muhurts: {
        abhijit: "૧૨:૧૧ PM - ૦૧:૦૪ PM",
        rahuKaal: "૦૨:૧૮ PM - ૦૩:૫૬ PM"
      }
    };

    try {
      const p = getDailyPanchang();
      initialData.tithi = `${p.maas} ${p.tithi}`;
      initialData.paksh = p.paksh;
      initialData.maas = p.maas;
      initialData.rashi = p.rashi;
      initialData.nakshatra = p.nakshatra;
    } catch (e) {
      console.error("Local panchang calculation failed on init in Tools", e);
    }
    return initialData;
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    let mathPanchang = {};
    try {
      const p = getDailyPanchang();
      mathPanchang = {
        tithi: `${p.maas} ${p.tithi}`,
        paksh: p.paksh,
        maas: p.maas,
        rashi: p.rashi,
        nakshatra: p.nakshatra
      };
    } catch (e) {
      console.error("Local panchang calculation failed in Tools", e);
    }

    try {
      const response = await fetch(API_ENDPOINTS.PANCHANG);
      if (!response.ok) throw new Error('API request failed');
      const apiData = await response.json();
      
      const updatedData = {
        ...panchangData,
        ...apiData,
        ...mathPanchang,
        loading: false
      };
      
      setPanchangData(updatedData);
      localStorage.setItem('panchang_cache_full', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Tools Panchang API Error:", error);
      setPanchangData(prev => ({
        ...prev,
        ...mathPanchang,
        loading: false
      }));
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

  // Sun Trajectory Arc Calculations
  const parseTime = (timeStr, baseDate) => {
    if (!timeStr) return null;
    const englishTimeStr = toEnglishDigits(timeStr);
    const match = englishTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3];
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const sunriseTime = parseTime(panchangData.sunrise, currentTime);
  const sunsetTime = parseTime(panchangData.sunset, currentTime);
  
  let sunProgress = 0;
  if (sunriseTime && sunsetTime) {
    const totalDayMs = sunsetTime.getTime() - sunriseTime.getTime();
    if (totalDayMs > 0) {
      const elapsedMs = currentTime.getTime() - sunriseTime.getTime();
      sunProgress = Math.min(100, Math.max(0, (elapsedMs / totalDayMs) * 100));
    }
  }
  
  const rad = Math.PI - (sunProgress / 100) * Math.PI;
  const cx = 50 + 45 * Math.cos(rad);
  const cy = 25 - 45 * Math.sin(rad);

  const dynamicMuhurts = (panchangData.sunrise && panchangData.sunset)
    ? calculateMuhurts(panchangData.sunrise, panchangData.sunset, currentTime)
    : null;

  const displayMuhurts = dynamicMuhurts || panchangData.muhurts;

  // Calendar calculations
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
  
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfMonth(calendarYear, calendarMonth);
  
  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ type: 'empty', id: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ type: 'day', day, id: `day-${day}` });
  }

  const categories = [
    { id: 'all', name: 'તમામ સાધનો', icon: 'grid_view' },
    { id: 'spiritual', name: 'ધાર્મિક & જ્યોતિષ', icon: 'temple_hindu' },
    { id: 'business', name: 'વ્યવસાય & બાયોડેટા', icon: 'business_center' },
    { id: 'utility', name: 'ગણતરી & રમતો', icon: 'calculate' }
  ];

  // Quick helper to determine if a tool should show up under active tab
  const shouldShow = (categoryList) => {
    return activeTab === 'all' || categoryList.includes(activeTab);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12 font-gujarati text-on-surface">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-[#2D3748] dark:text-[#0D9488]">ઉપયોગી સાધનો</h2>
        <p className="font-gujarati text-[#0D9488] font-bold text-lg">તમારા દૈનિક જીવનમાં આધ્યાત્મિકતા અને વિજ્ઞાનનો સમન્વય કરો.</p>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer active:scale-95 border ${
              activeTab === cat.id
                ? 'bg-[#2D3748] border-[#2D3748] text-[#F4F4F0] shadow-md'
                : 'bg-[#F4F4F0] dark:bg-[#1E1A18] border-[#0D9488]/30 text-[#2D3748] dark:text-[#0D9488]'
            }`}
          >
            <span className="material-symbols-outlined text-base font-bold">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PRIMARY featured tools sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Muhurt Finder Card */}
        {shouldShow(['spiritual']) && (
          <section id="muhurt-finder" onClick={() => navigate('/panchang')} className="cursor-pointer bg-[#F4F4F0] dark:bg-[#1E1A18] backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm hover:shadow-md border border-[#0D9488]/30 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-[#2D3748] dark:text-[#0D9488]">
                  <div className="h-10 w-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">event_available</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">શુભ મુહૂર્ત શોધક</h3>
                </div>
              </div>
              <p className="font-gujarati text-xs text-[#2D3748]/70 dark:text-[#F4F4F0]/70 leading-relaxed font-bold">નવી ખરીદી, લગ્ન અને મકાન વાસ્તુ માટે શ્રેષ્ઠ ચોઘડિયા અને શુભ દિવસો શોધો.</p>

              <div className="bg-white/50 dark:bg-black/20 rounded-2.5xl p-4 border border-[#0D9488]/20">
                <div className="flex justify-between items-center mb-4 text-[#2D3748] dark:text-[#0D9488]">
                  <span onClick={handlePrevMonth} className="material-symbols-outlined text-xs cursor-pointer select-none">chevron_left</span>
                  <p className="font-gujarati font-black text-sm">{monthNamesGu[calendarMonth]} {toGujaratiDigits(calendarYear)}</p>
                  <span onClick={handleNextMonth} className="material-symbols-outlined text-xs cursor-pointer select-none">chevron_right</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-black text-[#0D9488] uppercase tracking-wider mb-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center font-headline font-bold text-[10px]">
                  {calendarCells.map((cell) => {
                    if (cell.type === 'empty') {
                      return <span key={cell.id} className="h-7 w-7" />;
                    }
                    
                    const isSelected = selectedDate.getDate() === cell.day && 
                                       selectedDate.getMonth() === calendarMonth && 
                                       selectedDate.getFullYear() === calendarYear;
                                       
                    const today = new Date();
                    const isToday = today.getDate() === cell.day && 
                                    today.getMonth() === calendarMonth && 
                                    today.getFullYear() === calendarYear;
                                    
                    return (
                      <span
                        key={cell.id}
                        onClick={() => setSelectedDate(new Date(calendarYear, calendarMonth, cell.day))}
                        className={`h-7 w-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-[#2D3748] text-[#F4F4F0] shadow-sm font-black' 
                            : isToday 
                              ? 'border border-[#0D9488] text-[#2D3748] dark:text-[#0D9488] font-bold' 
                              : 'text-[#2D3748]/80 dark:text-[#F4F4F0]/80 hover:bg-[#0D9488]/10'
                        }`}
                      >
                        {cell.day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/panchang')} className="w-full py-3.5 bg-[#2D3748] text-[#F4F4F0] hover:opacity-90 rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-sm cursor-pointer">
              નવું મુહૂર્ત શોધો
            </button>
          </section>
        )}

        {/* Kundali Generator Card */}
        {shouldShow(['spiritual']) && (
          <section id="kundali-generator" onClick={() => navigate('/kundali')} className="cursor-pointer bg-[#F4F4F0] dark:bg-[#1E1A18] backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm hover:shadow-md border border-[#0D9488]/30 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-[#2D3748] dark:text-[#0D9488]">
                  <div className="h-10 w-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">stars</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">કુંડળી જનરેટર</h3>
                </div>
              </div>
              <p className="font-gujarati text-xs text-[#2D3748]/70 dark:text-[#F4F4F0]/70 leading-relaxed font-bold">તમારી સચોટ જન્મ વિગતો દાખલ કરો અને ગ્રહોના સ્થાન સહિત વિગતવાર કુંડળી મેળવો.</p>
              
              <div className="relative h-32 bg-[#2D3748]/5 dark:bg-black/20 rounded-2.5xl flex items-center justify-center p-3 border border-[#0D9488]/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D9488]/10 via-transparent to-[#2D3748]/10 pointer-events-none"></div>
                <div className="relative w-28 h-28 border border-[#0D9488]/30 flex flex-wrap bg-white/70 dark:bg-stone-900/70 backdrop-blur-xs rounded-xl shadow-xs">
                  <div className="w-1/2 h-1/2 border-r border-b border-[#0D9488]/20 p-1 text-[8px] font-bold text-[#2D3748] dark:text-[#0D9488]">૧૨</div>
                  <div className="w-1/2 h-1/2 border-b border-[#0D9488]/20 p-1 text-right text-[8px] font-bold text-[#2D3748] dark:text-[#0D9488]">૨</div>
                  <div className="w-1/2 h-1/2 border-r border-[#0D9488]/20 p-1 flex items-end text-[8px] font-bold text-[#2D3748] dark:text-[#0D9488]">૧૦</div>
                  <div className="w-1/2 h-1/2 p-1 flex items-end justify-end text-[8px] font-bold text-[#2D3748] dark:text-[#0D9488]">૪</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-gujarati font-black text-[10px] text-[#F4F4F0] bg-[#2D3748] border border-[#0D9488] px-2 py-0.5 rounded shadow-xs">શુભ</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/kundali')} className="w-full py-3.5 bg-[#2D3748] text-[#F4F4F0] hover:opacity-90 rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">stars</span> ફ્રી કુંડળી બનાવો
            </button>
          </section>
        )}


        {/* Biodata Maker Card */}
        {shouldShow(['business']) && (
          <section id="biodata-maker" onClick={() => navigate('/biodata')} className="cursor-pointer bg-[#F4F4F0] dark:bg-[#1E1A18] backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm hover:shadow-md border border-[#0D9488]/30 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-[#2D3748] dark:text-[#0D9488]">
                  <div className="h-10 w-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">description</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">બાયોડેટા મેકર</h3>
                </div>
              </div>
              <p className="font-gujarati text-xs text-[#2D3748]/70 dark:text-[#F4F4F0]/70 leading-relaxed font-bold">લગ્ન અથવા નોકરીની પ્રોફેશનલ રજૂઆત માટે અત્યંત સુંદર બાયોડેટા પત્રિકા બનાવો.</p>
              
              <div className="bg-white/50 dark:bg-black/20 rounded-2.5xl p-4 flex gap-3 border border-[#0D9488]/20 justify-center">
                <div className="p-3 bg-[#F4F4F0] dark:bg-[#1E1A18] rounded-xl shadow-sm border border-[#0D9488]/30 text-center flex-1">
                  <span className="material-symbols-outlined text-xl text-[#2D3748] dark:text-[#0D9488] mb-1">favorite</span>
                  <p className="font-gujarati font-black text-[9px] text-[#2D3748] dark:text-[#F4F4F0]">લગ્ન બાયોડેટા</p>
                </div>
                <div className="p-3 bg-[#F4F4F0] dark:bg-[#1E1A18] rounded-xl shadow-sm border border-[#0D9488]/30 text-center flex-1">
                  <span className="material-symbols-outlined text-xl text-[#2D3748] dark:text-[#0D9488] mb-1">work</span>
                  <p className="font-gujarati font-black text-[9px] text-[#2D3748] dark:text-[#F4F4F0]">પ્રોફેશનલ CV</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/biodata')} className="w-full py-3.5 bg-[#2D3748] text-[#F4F4F0] hover:opacity-90 rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">description</span> બાયોડેટા બનાવો
            </button>
          </section>
        )}

        {/* Digital Business Card & Mini-Website Card */}
        {shouldShow(['business']) && (
          <section id="digital-card" onClick={() => navigate('/card')} className="cursor-pointer bg-[#F4F4F0] dark:bg-[#1E1A18] backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm hover:shadow-md border border-[#0D9488]/30 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-[#2D3748] dark:text-[#0D9488]">
                  <div className="h-10 w-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">badge</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">ડિજિટલ બિઝનેસ કાર્ડ</h3>
                </div>
              </div>
              <p className="font-gujarati text-xs text-[#2D3748]/70 dark:text-[#F4F4F0]/70 leading-relaxed font-bold">તમારા વેપાર કે વ્યવસાય માટે પ્રોડક્ટ કેટલોગ અને UPI પેમેન્ટ સાથેની ૧૫+ થીમ્સ વાળી મફત મિની-વેબસાઇટ બનાવો.</p>
              
              <div className="relative h-20 bg-gradient-to-br from-[#2D3748]/10 via-transparent to-[#0D9488]/10 rounded-2.5xl flex items-center justify-center p-3 border border-[#0D9488]/30">
                <div className="flex gap-2 relative z-10">
                  <span className="bg-[#2D3748] text-[#0D9488] border border-[#0D9488]/50 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">✨ ૧૫+ થીમ્સ</span>
                  <span className="bg-[#2D3748] text-[#0D9488] border border-[#0D9488]/50 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">📦 કેટલોગ</span>
                  <span className="bg-[#2D3748] text-[#0D9488] border border-[#0D9488]/50 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">💰 UPI પે</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/card')} className="w-full py-3.5 bg-[#2D3748] text-[#F4F4F0] hover:opacity-90 rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold font-black">badge</span> કાર્ડ બનાવો (તદ્દન ફ્રી)
            </button>
          </section>
        )}
        
        {/* Shradhanjali Maker Card */}
        {shouldShow(['spiritual']) && (
          <section id="shradhanjali-maker" onClick={() => navigate('/shradhanjali')} className="cursor-pointer bg-[#F4F4F0] dark:bg-[#1E1A18] backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm hover:shadow-md border border-[#0D9488]/30 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-[#0D9488]">
                  <div className="h-10 w-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">local_florist</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">શ્રદ્ધાંજલિ આમંત્રણ પત્રિકા</h3>
                </div>
              </div>
              <p className="font-gujarati text-xs text-[#2D3748]/70 dark:text-[#F4F4F0]/70 leading-relaxed font-bold">સ્વર્ગસ્થ વડીલોની સ્મૃતિમાં બેસણું, ઉઠમણું કે શ્રદ્ધાંજલિ પત્રિકા ૨ મિનિટમાં મોબાઈલથી તૈયાર કરો.</p>
              
              <div className="bg-white/50 dark:bg-black/20 rounded-2.5xl p-4 flex gap-3 border border-[#0D9488]/20 justify-center">
                <div className="p-2.5 bg-[#F4F4F0] dark:bg-[#1E1A18] rounded-xl shadow-sm border border-[#0D9488]/30 text-center flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🪔</span>
                  <p className="font-gujarati font-black text-[9px] text-[#2D3748] dark:text-[#F4F4F0]">બેસણું પત્રિકા</p>
                </div>
                <div className="p-2.5 bg-[#F4F4F0] dark:bg-[#1E1A18] rounded-xl shadow-sm border border-[#0D9488]/30 text-center flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🌸</span>
                  <p className="font-gujarati font-black text-[9px] text-[#2D3748] dark:text-[#F4F4F0]">શ્રદ્ધાંજલિ કાર્ડ</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/shradhanjali')} className="w-full py-3.5 bg-[#0D9488] hover:opacity-90 text-[#2D3748] font-bold rounded-2xl font-gujarati text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">local_florist</span> શ્રદ્ધાંજલિ કાર્ડ બનાવો
            </button>
          </section>
        )}

        {/* Panchang Mini Dashboard */}
        {shouldShow(['spiritual']) && (
          <section id="panchang-mini" className="bg-[#F4F4F0] dark:bg-[#1E1A18] rounded-[2.5rem] p-6 border border-[#0D9488]/30 shadow-sm transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white dark:bg-stone-900 rounded-xl flex items-center justify-center shadow-sm border border-[#0D9488]/30">
                    <span className="material-symbols-outlined text-[#2D3748] dark:text-[#0D9488] text-xl">wb_sunny</span>
                  </div>
                  <div>
                    <h4 className="font-gujarati font-black text-base leading-tight text-[#2D3748] dark:text-[#0D9488]">આજનું પંચાંગ</h4>
                    <p className="font-gujarati text-[10px] text-[#2D3748]/70 dark:text-[#F4F4F0]/70 font-bold">વિક્રમ સંવત {toGujaratiDigits(getVikramSamvat(currentTime))}, {translateTithiToGujarati(panchangData.tithi)}</p>
                  </div>
                </div>
              </div>
              
              {/* Sun Trajectory Arc */}
              <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-2.5xl p-4 border border-[#0D9488]/20 space-y-3">
                <p className="font-gujarati text-[10px] text-[#2D3748]/80 dark:text-[#0D9488]/80 font-bold text-center">દિવસની પ્રગતિ</p>
                <div className="relative h-14 flex items-center justify-center">
                  <span className="absolute bottom-0 left-2 text-[8px] font-bold text-[#2D3748]/60 dark:text-[#F4F4F0]/60">ઉદય {panchangData.sunrise}</span>
                  <p className="font-gujarati font-black text-lg text-[#0D9488]">{formatTimeNaturalGu(currentTime)}</p>
                  <span className="absolute bottom-0 right-2 text-[8px] font-bold text-[#2D3748]/60 dark:text-[#F4F4F0]/60">અસ્ત {panchangData.sunset}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] py-1 border-t border-[#0D9488]/20">
                <div className="bg-white/50 dark:bg-black/20 p-2 rounded-xl">
                  <p className="text-[8px] font-bold text-[#2D3748]/70 dark:text-[#0D9488]/70 tracking-wider">નક્ષત્ર</p>
                  <p className="font-gujarati font-black text-xs text-[#2D3748] dark:text-[#F4F4F0]">{panchangData.nakshatra || "રોહિણી"}</p>
                </div>
                <div className="bg-white/50 dark:bg-black/20 p-2 rounded-xl">
                  <p className="text-[8px] font-bold text-[#2D3748]/70 dark:text-[#0D9488]/70 tracking-wider">રાહુકાળ</p>
                  <p className="font-headline font-black text-xs text-[#2D3748] dark:text-[#0D9488]">{displayMuhurts.rahuKaal || "01:30 - 03:00"}</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/panchang')} className="w-full flex items-center justify-between font-gujarati font-bold bg-white dark:bg-stone-900 p-3 rounded-2xl shadow-sm border border-[#0D9488]/30 text-xs text-[#2D3748] dark:text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors cursor-pointer">
              વિગતવાર પંચાંગ જુઓ <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </section>
        )}
    </div>
      
      {/* HEALTH BANNER */}
      <button 
        onClick={() => navigate('/health')}
        className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-500 rounded-[2rem] p-5 sm:p-6 shadow-lg shadow-teal-500/20 active:scale-95 transition-all text-left flex items-center gap-4 group border border-emerald-400/30"
      >
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <span className="material-symbols-outlined text-[100px]">health_and_safety</span>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-110 transition-transform shadow-inner">
          <span className="material-symbols-outlined text-white text-3xl">favorite</span>
        </div>
        <div className="space-y-1 relative z-10 flex-1">
          <h3 className="font-gujarati font-black text-xl text-white">સ્વાસ્થ્ય અને આયુર્વેદ</h3>
          <p className="font-gujarati text-teal-50 text-[10px] sm:text-xs">દાદીમાના નુસખા અને ડેઇલી હેલ્થ ટિપ્સ</p>
        </div>
        <div className="shrink-0 bg-white/20 p-2 rounded-full backdrop-blur-sm">
          <span className="material-symbols-outlined text-white text-sm">chevron_right</span>
        </div>
      </button>

      {/* COMMUNITY AND CARDS SECTION */}
      <div className="space-y-4 pt-2">
        {/* ROW 1: 2 Cards (Digital Bethak & My Society) */}
        <div className={isDev ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
          {isDev && (
            <section 
              onClick={() => navigate("/community")}
              className="bg-[#2D3748] p-5 rounded-3xl text-center flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform border border-[#0D9488]/30 relative overflow-hidden cursor-pointer min-h-[140px]"
            >
              <div className="absolute right-[-10px] top-[-10px] opacity-10 select-none pointer-events-none text-7xl">
                groups
              </div>
              <div className="h-12 w-12 bg-[#0D9488]/20 rounded-2xl flex items-center justify-center relative z-10 shrink-0">
                <span className="material-symbols-outlined text-[#0D9488] text-2xl font-bold">groups</span>
              </div>
              <div className="relative z-10 mt-1">
                <h2 className="font-gujarati font-black text-base text-[#F4F4F0]">ડિજિટલ બેઠક</h2>
                <p className="font-gujarati text-[10px] text-teal-200 mt-1">ગામના સમાચાર ને ચર્ચા</p>
              </div>
            </section>
          )}

          <section 
            onClick={() => navigate("/society")}
            className="bg-[#F4F4F0] dark:bg-[#1E1A18] p-5 rounded-3xl text-center flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform border border-[#0D9488]/30 relative overflow-hidden cursor-pointer min-h-[140px]"
          >
            <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] dark:opacity-5 select-none pointer-events-none text-7xl">
              holiday_village
            </div>
            <div className="h-12 w-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center relative z-10 shrink-0">
              <span className="material-symbols-outlined text-[#0D9488] text-2xl font-bold">holiday_village</span>
            </div>
            <div className="relative z-10 mt-1">
              <h2 className="font-gujarati font-black text-base text-[#2D3748] dark:text-[#F4F4F0]">મારી સોસાયટી</h2>
              <p className="font-gujarati text-[10px] text-[#0D9488] font-bold mt-1">મેનેજમેન્ટ અને સુવિધા</p>
            </div>
          </section>
        </div>

        {/* ROW 2: 1 Card (Bhakti Cards Maker) */}
        <section 
          id="cards-banner"
          onClick={() => navigate("/devotional-cards")}
          className="bg-[#F4F4F0] dark:bg-[#1E1A18] p-6 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-row items-center justify-between gap-4 border border-[#0D9488]/30 cursor-pointer active:scale-95 transition-transform mt-4"
        >
          <div className="absolute right-0 top-0 opacity-[0.03] dark:opacity-5 select-none pointer-events-none text-8xl translate-x-4 -translate-y-4">
            🕉️
          </div>
          <div className="flex-1 space-y-1 relative z-10 text-left pr-8">
            <span className="bg-[#2D3748]/10 text-[#2D3748] dark:bg-[#0D9488]/10 dark:text-[#0D9488] border border-[#2D3748]/20 dark:border-[#0D9488]/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-block mb-1">
              નવું ફિચર 🌟
            </span>
            <h3 className="font-headline font-black text-2xl text-[#2D3748] dark:text-[#F4F4F0] tracking-wide">
              ભક્તિ Cards મેકર
            </h3>
            <p className="font-gujarati text-[#0D9488] font-bold text-xs max-w-[200px] mt-1">
              તમારું નામ અને ફોટો લગાવી સુંદર ભગવાનના સુવિચાર બનાવો.
            </p>
          </div>
          <div className="h-10 w-10 bg-[#2D3748] rounded-full flex items-center justify-center relative z-10 shrink-0 shadow-md text-[#F4F4F0]">
            <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
          </div>
        </section>
      </div>

      {/* QUICK SHORTCUT LINKS SECTION */}
      {shouldShow(['utility', 'spiritual', 'business']) && (
        <section className="space-y-4 pt-4 border-t border-stone-200/40">
          <h3 className="font-gujarati font-black text-lg text-outline pl-2">શોર્ટકટ્સ (Shortcuts)</h3>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/daily-challenge')} icon="psychology" title="શબ્દ રમત" subtitle="રોજ નવા ગૂઝલ શબ્દો ગોઠવી જ્ઞાન વધારો" color="bg-yellow-50 dark:bg-yellow-950/20" iconColor="text-yellow-700" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/gujarat-safari')} icon="map" title="ગુજરાત સફારી" subtitle="પ્રાણીઓ અને પાત્રોના અવાજમાં શીખો" color="bg-emerald-50 dark:bg-emerald-950/20" iconColor="text-emerald-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/passport')} icon="menu_book" title="ગુજરાત ટ્રાવેલ પાસપોર્ટ" subtitle="પ્રખ્યાત સ્થળોએ GPS ચેક-ઇન કરો" color="bg-blue-50 dark:bg-blue-950/20" iconColor="text-blue-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/mysteries')} icon="search" title="ગુજરાતના રહસ્યો" subtitle="ઐતિહાસિક કોયડા અને રહસ્યો જાણો" color="bg-rose-50 dark:bg-rose-950/20" iconColor="text-emerald-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/swipe-cards')} icon="style" title="જ્ઞાન કાર્ડ્સ" subtitle="સ્વાઇપ કરી ગુજરાતની વાતો જાણો" color="bg-purple-50 dark:bg-purple-950/20" iconColor="text-purple-650" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/gujarat-quiz')} icon="workspace_premium" title="જ્ઞાન ક્વિઝ" subtitle="ફોટો ઓળખી ક્વિઝ રમત રમો" color="bg-teal-50 dark:bg-teal-950/20" iconColor="text-teal-800" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/interest-calculator')} icon="calculate" title="વ્યાજ કેલ્ક્યુલેટર" subtitle="લોન અને હોમ ગોલ્ડ વ્યાજ ગણો" color="bg-yellow-50 dark:bg-yellow-950/20" iconColor="text-yellow-700" />
            )}
            
            {shouldShow(['spiritual']) && (
              <ToolLink onClick={() => navigate('/vastu')} icon="explore" title="વાસ્તુ કેલ્ક્યુલેટર" subtitle="ઘરની દિશાઓ અને ઉર્જા તપાસો" color="bg-rose-50 dark:bg-rose-950/20" iconColor="text-emerald-600" />
            )}
            
            {shouldShow(['spiritual', 'business']) && (
              <ToolLink onClick={() => navigate('/namkaran')} icon="auto_fix_high" title="નામકરણ સાધન" subtitle="રાશિમુજબ શ્રેષ્ઠ નામો શોધો" color="bg-teal-50 dark:bg-teal-950/20" iconColor="text-teal-600" />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const ToolLink = ({ icon, title, subtitle, onClick }) => (
  <div onClick={onClick} className={`bg-[#F4F4F0] dark:bg-[#1E1A18] p-3 sm:p-5 rounded-3xl flex items-center gap-2 sm:gap-4 border border-[#0D9488]/30 group cursor-pointer active:scale-98 hover:shadow-md transition-all duration-300`}>
    <div className={`h-10 w-10 sm:h-12 sm:w-12 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-[#2D3748] dark:text-[#0D9488] group-hover:scale-105 transition-transform border border-[#0D9488]/20`}>
      <span className="material-symbols-outlined text-xl sm:text-2xl font-black">{icon}</span>
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="font-gujarati font-black text-[13px] sm:text-base text-[#2D3748] dark:text-[#F4F4F0] leading-tight truncate">{title}</h4>
      <p className="font-gujarati text-[#0D9488] text-[10px] sm:text-xs truncate mt-0.5 font-bold">{subtitle}</p>
    </div>
  </div>
);

const monthNamesGu = [
  'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
  'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
];

const getVikramSamvat = (date) => {
  const year = date.getFullYear();
  const time = date.getTime();
  if (year === 2025) {
    const diwali2025 = new Date(2025, 9, 21).getTime(); // Oct 21
    return time >= diwali2025 ? 2082 : 2081;
  } else if (year === 2026) {
    const diwali2026 = new Date(2026, 10, 9).getTime(); // Nov 9
    return time >= diwali2026 ? 2083 : 2082;
  } else if (year === 2027) {
    const diwali2027 = new Date(2027, 9, 30).getTime(); // Oct 30
    return time >= diwali2027 ? 2084 : 2083;
  } else {
    return year + 56;
  }
};

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

const formatTimeNaturalGu = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const pad = (n) => n < 10 ? '0' + n : n;
  const timeStr = `${toGujaratiDigits(pad(hours % 12 || 12))}:${toGujaratiDigits(pad(minutes))}`;
  
  if (hours < 12) {
    return `સવારે ${timeStr}`;
  } else if (hours >= 12 && hours < 16) {
    return `બપોરે ${timeStr}`;
  } else if (hours >= 16 && hours < 19) {
    return `સાંજે ${timeStr}`;
  } else {
    return `રાત્રે ${timeStr}`;
  }
};

export default Tools;
