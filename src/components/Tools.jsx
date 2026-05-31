import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';
import { API_ENDPOINTS } from '../config/api';
import { calculateMuhurts, toGujaratiDigits, toEnglishDigits } from '../utils/choghadiya_helper';

const Tools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Calendar states
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Panchang states
  const [panchangData, setPanchangData] = useState(() => {
    const cached = localStorage.getItem('panchang_cache_full') || localStorage.getItem('panchang_cache');
    return cached ? JSON.parse(cached) : {
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
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PANCHANG);
      if (!response.ok) throw new Error('API request failed');
      const apiData = await response.json();
      
      const updatedData = {
        ...panchangData,
        ...apiData,
        loading: false
      };
      
      setPanchangData(updatedData);
      localStorage.setItem('panchang_cache_full', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Tools Panchang API Error:", error);
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
        <h2 className="font-gujarati font-black text-4xl text-primary">ઉપયોગી સાધનો</h2>
        <p className="font-gujarati text-outline text-lg">તમારા દૈનિક જીવનમાં આધ્યાત્મિકતા અને વિજ્ઞાનનો સમન્વય કરો.</p>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer active:scale-95 border ${
              activeTab === cat.id
                ? 'bg-orange-600 border-orange-600 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-850 hover:bg-stone-50 text-stone-600 dark:text-stone-300'
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
          <section id="muhurt-finder" onClick={() => navigate('/panchang')} className="cursor-pointer bg-white dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xs hover:shadow-md border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">event_available</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">શુભ મુહૂર્ત શોધક</h3>
                </div>
                <ShareButton sectionId="muhurt-finder" successMessage="📅 શુભ મુહૂર્ત શોધકની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              <p className="font-gujarati text-xs text-outline leading-relaxed">નવી ખરીદી, લગ્ન અને મકાન વાસ્તુ માટે શ્રેષ્ઠ ચોઘડિયા અને શુભ દિવસો શોધો.</p>

              <div className="bg-stone-50 dark:bg-stone-850/50 rounded-2.5xl p-4 border border-stone-100 dark:border-stone-800">
                <div className="flex justify-between items-center mb-4">
                  <span onClick={handlePrevMonth} className="material-symbols-outlined text-xs text-outline cursor-pointer hover:text-primary select-none">chevron_left</span>
                  <p className="font-gujarati font-black text-sm">{monthNamesGu[calendarMonth]} {toGujaratiDigits(calendarYear)}</p>
                  <span onClick={handleNextMonth} className="material-symbols-outlined text-xs text-outline cursor-pointer hover:text-primary select-none">chevron_right</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-bold text-outline uppercase tracking-wider mb-2">
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
                            ? 'bg-primary text-white shadow-sm font-black' 
                            : isToday 
                              ? 'border border-primary/40 text-primary font-bold' 
                              : 'text-on-surface hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        {cell.day}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/panchang')} className="w-full py-3.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer">
              નવું મુહૂર્ત શોધો
            </button>
          </section>
        )}

        {/* Kundali Generator Card */}
        {shouldShow(['spiritual']) && (
          <section id="kundali-generator" onClick={() => navigate('/kundali')} className="cursor-pointer bg-white dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xs hover:shadow-md border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">stars</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">કુંડળી જનરેટર</h3>
                </div>
                <ShareButton sectionId="kundali-generator" successMessage="✨ કુંડળી જનરેટરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              <p className="font-gujarati text-xs text-outline leading-relaxed">તમારી સચોટ જન્મ વિગતો દાખલ કરો અને ગ્રહોના સ્થાન સહિત વિગતવાર કુંડળી મેળવો.</p>
              
              <div className="relative h-32 bg-stone-50 dark:bg-stone-850/50 rounded-2.5xl flex items-center justify-center p-3 border border-stone-100 dark:border-stone-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-primary/5 pointer-events-none"></div>
                <div className="relative w-28 h-28 border border-primary/20 flex flex-wrap bg-white/70 dark:bg-stone-900/70 backdrop-blur-xs rounded-xl shadow-xs">
                  <div className="w-1/2 h-1/2 border-r border-b border-primary/10 p-1 text-[8px] font-bold text-primary">૧૨</div>
                  <div className="w-1/2 h-1/2 border-b border-primary/10 p-1 text-right text-[8px] font-bold text-primary">૨</div>
                  <div className="w-1/2 h-1/2 border-r border-primary/10 p-1 flex items-end text-[8px] font-bold text-primary">૧૦</div>
                  <div className="w-1/2 h-1/2 p-1 flex items-end justify-end text-[8px] font-bold text-primary">૪</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-gujarati font-black text-[10px] text-primary bg-white/90 dark:bg-stone-800/90 border border-primary/20 px-2 py-0.5 rounded shadow-xs">શુભ</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/kundali')} className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">stars</span> ફ્રી કુંડળી બનાવો
            </button>
          </section>
        )}

        {/* Biodata Maker Card */}
        {shouldShow(['business']) && (
          <section id="biodata-maker" onClick={() => navigate('/biodata')} className="cursor-pointer bg-white dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xs hover:shadow-md border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">description</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">બાયોડેટા મેકર</h3>
                </div>
                <ShareButton sectionId="biodata-maker" successMessage="📄 બાયોડેટા મેકરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              <p className="font-gujarati text-xs text-outline leading-relaxed">લગ્ન અથવા નોકરીની પ્રોફેશનલ રજૂઆત માટે અત્યંત સુંદર બાયોડેટા પત્રિકા બનાવો.</p>
              
              <div className="bg-stone-50 dark:bg-stone-850/50 rounded-2.5xl p-4 flex gap-3 border border-stone-100 dark:border-stone-800 justify-center">
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl shadow-xs border border-stone-150 dark:border-stone-800 text-center flex-1">
                  <span className="material-symbols-outlined text-xl text-primary mb-1">favorite</span>
                  <p className="font-gujarati font-black text-[9px] text-stone-800 dark:text-stone-200">લગ્ન બાયોડેટા</p>
                </div>
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl shadow-xs border border-stone-150 dark:border-stone-800 text-center flex-1">
                  <span className="material-symbols-outlined text-xl text-primary mb-1">work</span>
                  <p className="font-gujarati font-black text-[9px] text-stone-800 dark:text-stone-200">પ્રોફેશનલ CV</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/biodata')} className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">description</span> બાયોડેટા બનાવો
            </button>
          </section>
        )}

        {/* Digital Business Card & Mini-Website Card */}
        {shouldShow(['business']) && (
          <section id="digital-card" onClick={() => navigate('/card')} className="cursor-pointer bg-white dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xs hover:shadow-md border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-primary">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">badge</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">ડિજિટલ બિઝનેસ કાર્ડ</h3>
                </div>
                <ShareButton sectionId="digital-card" successMessage="🔗 બિઝનેસ કાર્ડ મેકરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              <p className="font-gujarati text-xs text-outline leading-relaxed">તમારા વેપાર કે વ્યવસાય માટે પ્રોડક્ટ કેટલોગ અને UPI પેમેન્ટ સાથેની ૧૫+ થીમ્સ વાળી મફત મિની-વેબસાઇટ બનાવો.</p>
              
              <div className="relative h-20 bg-gradient-to-br from-amber-500/10 via-transparent to-primary/10 dark:from-amber-500/5 dark:to-primary/5 rounded-2.5xl flex items-center justify-center p-3 border border-amber-500/10">
                <div className="flex gap-2 relative z-10">
                  <span className="bg-white/90 dark:bg-stone-850/90 text-stone-800 dark:text-stone-200 border border-stone-200/55 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">✨ ૧૫+ થીમ્સ</span>
                  <span className="bg-white/90 dark:bg-stone-850/90 text-stone-800 dark:text-stone-200 border border-stone-200/55 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">📦 કેટલોગ</span>
                  <span className="bg-white/90 dark:bg-stone-850/90 text-stone-800 dark:text-stone-200 border border-stone-200/55 rounded-lg px-2.5 py-1 text-[8px] font-black shadow-xs">💰 UPI પે</span>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/card')} className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold font-black">badge</span> કાર્ડ બનાવો (તદ્દન ફ્રી)
            </button>
          </section>
        )}
        
        {/* Shradhanjali Maker Card */}
        {shouldShow(['spiritual']) && (
          <section id="shradhanjali-maker" onClick={() => navigate('/shradhanjali')} className="cursor-pointer bg-white dark:bg-stone-900/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-xs hover:shadow-md border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-amber-700">
                  <div className="h-10 w-10 rounded-xl bg-amber-750/10 flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">local_florist</span>
                  </div>
                  <h3 className="font-gujarati font-black text-xl">શ્રદ્ધાંજલિ આમંત્રણ પત્રિકા</h3>
                </div>
                <ShareButton sectionId="shradhanjali-maker" successMessage="🌸 શ્રદ્ધાંજલિ કાર્ડ મેકરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              <p className="font-gujarati text-xs text-outline leading-relaxed">સ્વર્ગસ્થ વડીલોની સ્મૃતિમાં બેસણું, ઉઠમણું કે શ્રદ્ધાંજલિ પત્રિકા ૨ મિનિટમાં મોબાઈલથી તૈયાર કરો.</p>
              
              <div className="bg-stone-50 dark:bg-stone-850/50 rounded-2.5xl p-4 flex gap-3 border border-stone-100 dark:border-stone-800 justify-center">
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl shadow-xs border border-stone-150 dark:border-stone-800 text-center flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🪔</span>
                  <p className="font-gujarati font-black text-[9px] text-stone-800 dark:text-stone-200">બેસણું પત્રિકા</p>
                </div>
                <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl shadow-xs border border-stone-150 dark:border-stone-800 text-center flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🌸</span>
                  <p className="font-gujarati font-black text-[9px] text-stone-800 dark:text-stone-200">શ્રદ્ધાંજલિ કાર્ડ</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/shradhanjali')} className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white rounded-2xl font-gujarati font-black text-sm transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm font-bold">local_florist</span> શ્રદ્ધાંજલિ કાર્ડ બનાવો
            </button>
          </section>
        )}

        {/* Panchang Mini Dashboard */}
        {shouldShow(['spiritual']) && (
          <section id="panchang-mini" className="bg-gradient-to-br from-amber-500/5 to-primary/5 dark:from-stone-900/60 dark:to-stone-950/60 rounded-[2.5rem] p-6 border border-primary/5 hover:border-primary/10 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white dark:bg-stone-850 rounded-xl flex items-center justify-center shadow-xs border border-stone-150 dark:border-stone-800">
                    <span className="material-symbols-outlined text-primary text-xl">wb_sunny</span>
                  </div>
                  <div>
                    <h4 className="font-gujarati font-black text-base leading-tight">આજનું પંચાંગ</h4>
                    <p className="font-gujarati text-[10px] text-outline">વિક્રમ સંવત {toGujaratiDigits(getVikramSamvat(currentTime))}, {translateTithiToGujarati(panchangData.tithi)}</p>
                  </div>
                </div>
                <ShareButton sectionId="panchang-mini" successMessage="☀️ આજના પંચાંગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
              </div>
              
              {/* Sun Trajectory Arc */}
              <div className="bg-white/80 dark:bg-stone-900/60 backdrop-blur-md rounded-2.5xl p-4 border border-stone-150 dark:border-stone-800 space-y-3">
                <p className="font-gujarati text-[10px] text-outline font-bold text-center">દિવસની પ્રગતિ (Sun Arc trajectory)</p>
                <div className="relative h-14 flex items-center justify-center">
                  <svg className="w-56 h-14 overflow-visible" viewBox="0 0 100 25">
                    <path d="M 5 25 A 45 45 0 0 1 95 25" fill="none" stroke="url(#arcGrad)" strokeWidth="1.5" strokeDasharray="2,2" />
                    <defs>
                      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#ea580c" stopOpacity="1" />
                        <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <circle cx={cx} cy={cy} r="2.5" className="fill-amber-500 animate-pulse" />
                    <text x="50" y="18" className="fill-amber-600 dark:fill-amber-400 font-bold text-[5px] text-center" textAnchor="middle">{formatTimeNaturalGu(currentTime)}</text>
                  </svg>
                  <span className="absolute bottom-0 left-2 text-[8px] font-bold text-stone-400">ઉદય {panchangData.sunrise}</span>
                  <span className="absolute bottom-0 right-2 text-[8px] font-bold text-stone-400">અસ્ત {panchangData.sunset}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[10px] py-1 border-t border-black/5 dark:border-white/5">
                <div className="bg-stone-50 dark:bg-stone-850 p-2 rounded-xl">
                  <p className="text-[8px] font-bold text-outline tracking-wider">નક્ષત્ર</p>
                  <p className="font-gujarati font-black text-xs">{panchangData.nakshatra || "રોહિણી"}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-850 p-2 rounded-xl">
                  <p className="text-[8px] font-bold text-outline tracking-wider">રાહુકાળ</p>
                  <p className="font-headline font-black text-xs text-rose-500">{displayMuhurts.rahuKaal || "01:30 - 03:00"}</p>
                </div>
              </div>
            </div>

            <button onClick={() => navigate('/panchang')} className="w-full flex items-center justify-between font-gujarati font-bold bg-white dark:bg-stone-850 p-3 rounded-2xl shadow-xs border border-stone-150 dark:border-stone-800 text-xs hover:bg-stone-50 transition-colors cursor-pointer">
              વિગતવાર પંચાંગ જુઓ <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </section>
        )}
      </div>

      {/* QUICK SHORTCUT LINKS SECTION */}
      {shouldShow(['utility', 'spiritual', 'business']) && (
        <section className="space-y-4 pt-4 border-t border-stone-200/40">
          <h3 className="font-gujarati font-black text-lg text-outline pl-2">શોર્ટકટ્સ (Shortcuts)</h3>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/daily-challenge')} icon="psychology" title="શબ્દ રમત" subtitle="રોજ નવા ગૂઝલ શબ્દો ગોઠવી જ્ઞાન વધારો" color="bg-amber-50 dark:bg-amber-950/20" iconColor="text-amber-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/gujarat-safari')} icon="map" title="ગુજરાત સફારી" subtitle="પ્રાણીઓ અને પાત્રોના અવાજમાં શીખો" color="bg-emerald-50 dark:bg-emerald-950/20" iconColor="text-emerald-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/passport')} icon="menu_book" title="ગુજરાત ટ્રાવેલ પાસપોર્ટ" subtitle="પ્રખ્યાત સ્થળોએ GPS ચેક-ઇન કરો" color="bg-blue-50 dark:bg-blue-950/20" iconColor="text-blue-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/mysteries')} icon="search" title="ગુજરાતના રહસ્યો" subtitle="ઐતિહાસિક કોયડા અને રહસ્યો જાણો" color="bg-rose-50 dark:bg-rose-950/20" iconColor="text-rose-600" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/swipe-cards')} icon="style" title="જ્ઞાન કાર્ડ્સ" subtitle="સ્વાઇપ કરી ગુજરાતની વાતો જાણો" color="bg-purple-50 dark:bg-purple-950/20" iconColor="text-purple-650" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/gujarat-quiz')} icon="workspace_premium" title="જ્ઞાન ક્વિઝ" subtitle="ફોટો ઓળખી ક્વિઝ રમત રમો" color="bg-orange-50 dark:bg-orange-950/20" iconColor="text-orange-650" />
            )}
            
            {shouldShow(['utility']) && (
              <ToolLink onClick={() => navigate('/interest-calculator')} icon="calculate" title="વ્યાજ કેલ્ક્યુલેટર" subtitle="લોન અને હોમ ગોલ્ડ વ્યાજ ગણો" color="bg-amber-50 dark:bg-amber-950/20" iconColor="text-amber-600" />
            )}
            
            {shouldShow(['spiritual']) && (
              <ToolLink onClick={() => navigate('/vastu')} icon="explore" title="વાસ્તુ કેલ્ક્યુલેટર" subtitle="ઘરની દિશાઓ અને ઉર્જા તપાસો" color="bg-rose-50 dark:bg-rose-950/20" iconColor="text-rose-600" />
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

const ToolLink = ({ icon, title, subtitle, color, iconColor, onClick }) => (
  <div onClick={onClick} className={`${color} p-3 sm:p-5 rounded-3xl flex items-center gap-2 sm:gap-4 border border-black/5 dark:border-white/5 group cursor-pointer active:scale-98 hover:shadow-xs transition-all duration-300`}>
    <div className={`h-10 w-10 sm:h-12 sm:w-12 bg-white dark:bg-stone-850 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${iconColor} group-hover:scale-105 transition-transform border border-stone-100 dark:border-stone-800`}>
      <span className="material-symbols-outlined text-xl sm:text-2xl font-black">{icon}</span>
    </div>
    <div className="min-w-0 flex-1">
      <h4 className="font-gujarati font-black text-[13px] sm:text-base text-stone-800 dark:text-stone-150 leading-tight truncate">{title}</h4>
      <p className="font-gujarati text-outline text-[10px] sm:text-xs truncate mt-0.5">{subtitle}</p>
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
