import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VASTU_DIRECTIONS = [
  {
    id: "north",
    name: "ઉત્તર (North)",
    deity: "કુબેર",
    element: "જળ",
    benefit: "ધન અને સમૃદ્ધિ",
    rooms: "તિજોરી, પ્રવેશદ્વાર, અભ્યાસખંડ",
    color: "આછો વાદળી / લીલો",
    icon: "water_drop"
  },
  {
    id: "northeast",
    name: "ઈશાન (North-East)",
    deity: "શિવ",
    element: "જળ",
    benefit: "પવિત્રતા અને જ્ઞાન",
    rooms: "પૂજાઘર, ધ્યાન કક્ષ",
    color: "પીળો",
    icon: "temple_hindu"
  },
  {
    id: "east",
    name: "પૂર્વ (East)",
    deity: "ઇન્દ્ર / સૂર્ય",
    element: "અગ્નિ",
    benefit: "સ્વાસ્થ્ય અને યશ",
    rooms: "પ્રવેશદ્વાર, સ્નાનાગાર",
    color: "સફેદ",
    icon: "light_mode"
  },
  {
    id: "southeast",
    name: "અગ્નિ (South-East)",
    deity: "અગ્નિ દેવ",
    element: "અગ્નિ",
    benefit: "ઉર્જા અને શક્તિ",
    rooms: "રસોડું (Kitchen), ઇલેક્ટ્રિક મીટર",
    color: "લાલ / નારંગી",
    icon: "local_fire_department"
  },
  {
    id: "south",
    name: "દક્ષિણ (South)",
    deity: "યમ",
    element: "પૃથ્વી",
    benefit: "પ્રગતિ અને સ્થિરતા",
    rooms: "માસ્ટર બેડરૂમ, સ્ટોરરૂમ",
    color: "લાલ",
    icon: "landscape"
  },
  {
    id: "southwest",
    name: "નૈઋત્ય (South-West)",
    deity: "નૈઋતિ",
    element: "પૃથ્વી",
    benefit: "લીડરશીપ અને પ્રભુત્વ",
    rooms: "મુખ્ય શયનખંડ (માસ્ટર બેડરૂમ), સીડી",
    color: "બ્રાઉન / ગ્રે",
    icon: "home"
  },
  {
    id: "west",
    name: "પશ્ચિમ (West)",
    deity: "વરુણ",
    element: "વાયુ",
    benefit: "લાભ અને સફળતા",
    rooms: "ડાઇનિંગ રૂમ, બાથરૂમ",
    color: "વાદળી",
    icon: "air"
  },
  {
    id: "northwest",
    name: "વાયવ્ય (North-West)",
    deity: "વાયુ",
    element: "વાયુ",
    benefit: "સંપર્ક અને વ્યાપાર",
    rooms: "ગેસ્ટ રૂમ, પાર્કિંગ",
    color: "સફેદ",
    icon: "toys"
  }
];

const VastuCalculator = () => {
  const navigate = useNavigate();
  const [selectedDir, setSelectedDir] = useState(VASTU_DIRECTIONS[1]); // Default Ishan
  const [heading, setHeading] = useState(null);
  
  // Simulation and Permission States
  const [isSimulated, setIsSimulated] = useState(() => {
    // Detect desktop browser
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return isDesktop;
    }
    return true;
  });

  const [permissionState, setPermissionState] = useState(() => {
    if (typeof window === 'undefined') return 'unsupported';
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      return 'prompt'; // iOS device requiring permission
    }
    if (window.DeviceOrientationEvent) {
      return 'granted'; // Android/Desktop auto-granted, we verify with fallback timer
    }
    return 'unsupported';
  });

  const [simulatedHeading, setSimulatedHeading] = useState(0);
  const [autoTrack, setAutoTrack] = useState(true);

  // iOS Permission Requester
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
          setIsSimulated(true); // Fallback to manual simulation
        }
      } catch (err) {
        console.error("Error requesting compass permission:", err);
        setPermissionState('denied');
        setIsSimulated(true);
      }
    }
  };

  // Compass Sensor Logic
  useEffect(() => {
    if (isSimulated) return;

    const handleOrientation = (e) => {
      let compassHeading = null;
      if (e.webkitCompassHeading !== undefined) {
        compassHeading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Correct mathematical mapping from alpha (CCW 0-360) to heading (CW 0-360)
        compassHeading = (360 - e.alpha) % 360;
      }
      
      if (compassHeading !== null) {
        setHeading(Math.round(compassHeading));
      }
    };

    const hasPermissionRequest = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';

    if (hasPermissionRequest) {
      if (permissionState === 'granted') {
        window.addEventListener("deviceorientation", handleOrientation, true);
        return () => window.removeEventListener("deviceorientation", handleOrientation, true);
      }
    } else if (window.DeviceOrientationEvent) {
      // Android / Desktop with event support
      // Some Android Chrome versions require 'deviceorientationabsolute' for absolute heading
      const useAbsolute = 'ondeviceorientationabsolute' in window;
      const eventName = useAbsolute ? "deviceorientationabsolute" : "deviceorientation";
      window.addEventListener(eventName, handleOrientation, true);
      
      // Fallback: If no orientation event fires within 1.5s (like on desktop), switch to simulated mode
      const timer = setTimeout(() => {
        setHeading((currentHeading) => {
          if (currentHeading === null) {
            setIsSimulated(true);
          }
          return currentHeading;
        });
      }, 1500);

      return () => {
        window.removeEventListener(eventName, handleOrientation, true);
        clearTimeout(timer);
      };
    } else {
      setIsSimulated(true);
    }
  }, [permissionState, isSimulated]);

  // Map Heading to 8 Directions
  const getDirectionIndex = (deg) => {
    if (deg === null || deg === undefined) return -1;
    const d = (deg % 360 + 360) % 360;
    // Offset by 22.5 to align center angles correctly
    return Math.floor(((d + 22.5) % 360) / 45);
  };

  const activeHeading = isSimulated ? simulatedHeading : heading;
  const currentFacingIndex = getDirectionIndex(activeHeading);
  const currentFacingDir = currentFacingIndex !== -1 ? VASTU_DIRECTIONS[currentFacingIndex] : null;

  // Auto-track selection to matches current facing direction
  useEffect(() => {
    if (autoTrack && currentFacingDir) {
      setSelectedDir(currentFacingDir);
    }
  }, [currentFacingDir, autoTrack]);

  const selectDirectionManually = (dir) => {
    setSelectedDir(dir);
    setAutoTrack(false);
  };

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-primary/10 active:scale-95 transition-transform">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="font-gujarati font-black text-2xl text-primary">વાસ્તુ કેલ્ક્યુલેટર</h2>
      </div>

      <section className="bg-gradient-to-br from-error/10 via-white to-error/5 rounded-[2.5rem] p-6 shadow-sm border border-error/20">
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="font-gujarati text-error text-sm font-bold uppercase">ડિજિટલ કંપાસ</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="font-headline font-black text-3xl text-error-container">
                        {activeHeading !== null ? `${activeHeading}°` : '---°'}
                    </h3>
                    {currentFacingDir && (
                        <span className="font-gujarati text-xs font-bold text-error/85 bg-error/10 px-2.5 py-0.5 rounded-full border border-error/10">
                            {currentFacingDir.name.split(' ')[0]}
                        </span>
                    )}
                </div>
            </div>
            <span className="material-symbols-outlined text-5xl text-error/30 animate-spin-slow animate-pulse">explore</span>
        </div>
        
        {/* Simple Compass Visualization */}
        <div className="relative w-48 h-48 mx-auto mb-6 bg-white rounded-full shadow-inner border-4 border-error/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.05)_100%)]"></div>
            
            {/* Compass Needle */}
            <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out" style={{ transform: `rotate(${activeHeading !== null ? -activeHeading : 0}deg)` }}>
                {/* North Pointer */}
                <div className="absolute top-4 flex flex-col items-center">
                    <span className="font-headline font-black text-error text-xs">N</span>
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[40px] border-l-transparent border-r-transparent border-b-error mt-1"></div>
                </div>
                {/* South Pointer */}
                <div className="absolute bottom-4 flex flex-col items-center rotate-180">
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[40px] border-l-transparent border-r-transparent border-b-stone-300 mb-1"></div>
                    <span className="font-headline font-black text-stone-400 text-xs">S</span>
                </div>
                {/* East Pointer */}
                <div className="absolute right-4 flex flex-col items-center rotate-90">
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[20px] border-l-transparent border-r-transparent border-b-stone-300 mb-1"></div>
                    <span className="font-headline font-black text-stone-400 text-xs -rotate-90">E</span>
                </div>
                {/* West Pointer */}
                <div className="absolute left-4 flex flex-col items-center -rotate-90">
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[20px] border-l-transparent border-r-transparent border-b-stone-300 mb-1"></div>
                    <span className="font-headline font-black text-stone-400 text-xs rotate-90">W</span>
                </div>
            </div>
            
            <div className="absolute w-4 h-4 bg-error rounded-full border-2 border-white shadow-md z-10"></div>
        </div>

        {/* Dynamic Controls based on State */}
        {permissionState === 'prompt' && !isSimulated && (
          <div className="text-center space-y-3 mt-4 bg-white/50 p-4 rounded-3xl border border-error/10">
            <p className="font-gujarati text-stone-600 text-xs px-2 leading-relaxed">
              આઇફોન (iOS) પર હોકાયંત્રનો ઉપયોગ કરવા માટે કંપાસ સેન્સર સક્રિય કરવાની મંજૂરી જરૂરી છે.
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={requestPermission}
                className="bg-error hover:bg-error/90 text-white font-gujarati font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">explore</span>
                પરવાનગી આપો
              </button>
              <button 
                onClick={() => setIsSimulated(true)}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-gujarati font-bold text-xs py-2.5 px-4 rounded-xl transition-all active:scale-95 cursor-pointer border border-stone-200"
              >
                મેન્યુઅલ મોડ
              </button>
            </div>
          </div>
        )}

        {isSimulated && (
          <div className="mt-4 px-2 space-y-3 bg-white/60 p-4 rounded-3xl border border-error/5">
            <div className="flex justify-between text-[10px] font-bold text-stone-400 tracking-wider font-label">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="359" 
              value={simulatedHeading} 
              onChange={(e) => setSimulatedHeading(parseInt(e.target.value))}
              className="w-full accent-error h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-center font-gujarati text-stone-500 text-[11px] leading-relaxed">
              💡 <b>ડેસ્કટોપ મોડ:</b> તમારા ઉપકરણમાં કંપાસ સેન્સર ઉપલબ્ધ નથી, તેથી કંપાસને ફેરવવા માટે સ્લાઇડરનો ઉપયોગ કરો.
            </p>
          </div>
        )}

        {!isSimulated && permissionState === 'granted' && (
          <p className="text-center font-gujarati text-stone-500 text-xs mt-4">
              {heading !== null ? '✔️ ફોન સીધો રાખીને સાચી દિશા જાણો.' : '⏳ સેન્સર કનેક્ટ થઈ રહ્યું છે...'}
          </p>
        )}

        {!isSimulated && permissionState === 'denied' && (
          <div className="text-center space-y-2 mt-4 bg-red-50 p-4 rounded-3xl border border-red-100">
            <p className="font-gujarati text-emerald-700 text-xs font-bold">
              ❌ કંપાસ સેન્સરનો ઉપયોગ કરવાની પરવાનગી અસ્વીકાર થઈ છે.
            </p>
            <button 
              onClick={() => setIsSimulated(true)}
              className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-gujarati font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
            >
              મેન્યુઅલ સિમ્યુલેશન ચાલુ કરો
            </button>
          </div>
        )}
      </section>

      {/* Vastu Directions Reference */}
      <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-black/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-gujarati font-black text-xl text-stone-800">૮ દિશાઓ અને વાસ્તુ</h3>
          {currentFacingDir && (
            <span className="font-gujarati text-[11px] font-bold text-error bg-error/15 px-2.5 py-1 rounded-full animate-pulse border border-error/10 flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-error rounded-full inline-block"></span>
              લાઇવ: {currentFacingDir.name.split(' ')[0]}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            {VASTU_DIRECTIONS.map((dir) => {
                const isSelected = selectedDir.id === dir.id;
                const isFacing = currentFacingDir && currentFacingDir.id === dir.id;
                
                return (
                    <button
                        key={dir.id}
                        onClick={() => selectDirectionManually(dir)}
                        className={`relative p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2 text-center cursor-pointer ${
                          isSelected 
                            ? 'bg-error/10 border-error text-error scale-105 shadow-sm z-10 font-bold' 
                            : isFacing
                              ? 'bg-stone-50 border-error/40 text-stone-800 ring-2 ring-error/20 ring-offset-1 font-bold'
                              : 'bg-stone-50 border-transparent text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        {isFacing && (
                          <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                          </span>
                        )}
                        <span className="material-symbols-outlined text-2xl">{dir.icon}</span>
                        <span className="font-gujarati font-bold text-xs leading-tight">
                          {dir.name}
                        </span>
                        {isFacing && (
                          <span className="font-gujarati text-[9px] font-bold text-error bg-error/10 px-1 rounded-sm mt-0.5 tracking-wider">
                            હાલની દિશા
                          </span>
                        )}
                    </button>
                );
            })}
        </div>

        {/* Selected Direction Details */}
        <div className="mt-6 bg-stone-50 p-5 rounded-3xl space-y-4 border border-stone-100 transition-all duration-300">
            <div className="flex justify-between items-center border-b border-stone-200/60 pb-3">
                <h4 className="font-gujarati font-black text-2xl text-primary">{selectedDir.name}</h4>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-stone-200/40 text-stone-600">{selectedDir.element} તત્વ</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">સ્વામી / દેવ</p>
                    <p className="font-gujarati font-black text-stone-800">{selectedDir.deity}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">શુભ રંગ</p>
                    <p className="font-gujarati font-black text-stone-800">{selectedDir.color}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">મુખ્ય લાભ</p>
                    <p className="font-gujarati font-bold text-stone-800 bg-green-50 text-green-700 py-1.5 px-3 rounded-xl inline-block border border-green-100 text-sm">{selectedDir.benefit}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">આ દિશામાં શું બનાવવું?</p>
                    <p className="font-gujarati text-sm font-bold text-stone-700 bg-white p-3 rounded-xl border border-stone-200">{selectedDir.rooms}</p>
                </div>
            </div>

            {!autoTrack && currentFacingDir && (
              <button 
                onClick={() => setAutoTrack(true)} 
                className="w-full bg-error text-white hover:bg-error/90 py-2.5 px-4 rounded-xl text-xs font-gujarati font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer mt-4"
              >
                <span className="material-symbols-outlined text-sm">sync</span>
                લાઇવ દિશા ટ્રેકિંગ શરૂ કરો ({currentFacingDir.name.split(' ')[0]})
              </button>
            )}
        </div>
      </section>
    </div>
  );
};

export default VastuCalculator;
