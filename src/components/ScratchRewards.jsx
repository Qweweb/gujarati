import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';

// Pre-configured list of mock local discount coupons in Gujarat
export const MOCK_COUPONS = [
  { id: "c_kutch_1", name: "૧૫% છૂટ - ભૂજ પ્રખ્યાત બાંધણી હાઉસ", desc: "બાંધણીની ખરીદી પર ખાસ વળતર 🛍️", code: "KUTCHBANDHANI15" },
  { id: "c_junagadh_1", name: "૧૦% છૂટ - કાઠિયાવાડી ભોજનાલય", desc: "ખાસ કાઠિયાવાડી થાળી પર ડિસ્કાઉન્ટ 🍲", code: "KATHIAWAD10" },
  { id: "c_ahmedabad_1", name: "૧૫% છૂટ - સીદી સૈયદ ખાણી-પીણી બજાર", desc: "સિટી ફૂડ કોર્ટ પર ખાસ ડિસ્કાઉન્ટ 🍔", code: "AMDAVADFOOD" },
  { id: "c_somnath_1", name: "૧૦% છૂટ - સોમનાથ પૂજા ભંડાર", desc: "પૂજા વિધિ સામગ્રીની ખરીદી પર 🕉️", code: "SOMNATHPOOJA" },
  { id: "c_sasan_1", name: "૨૦% છૂટ - ગીર સફારી રિસોર્ટ", desc: "રિસોર્ટ બુકિંગ પર ખાસ વળતર 🏨", code: "GIRSARI20" },
  { id: "c_patan_1", name: "૧૫% છૂટ - પાટણ પટોળા એમ્પોરિયમ", desc: "અસલી પાટણ પટોળા ખરીદી પર 👗", code: "PATANPATOLA15" }
];

export const MOCK_STAGE_COUPONS = {
  10: { id: "m_stage_10", name: "સ્પેશિયલ ૧૦-ડે સ્ટ્રીક ઇનામ! 🎁", desc: "૧૦ દિવસના લોગિન બદલ ખાસ સરપ્રાઇઝ કૂપન", code: "STREAK10BONUS", sponsored_by: "એપ સ્પોન્સર", how_to_redeem: "આ કૂપન કોડ ઓનલાઈન ચેકઆઉટ વખતે ઉપયોગ કરો." },
  20: { id: "m_stage_20", name: "સ્પેશિયલ ૨૦-ડે સ્ટ્રીક ઇનામ! 🎉", desc: "૨૦ દિવસના અદભુત લોગિન બદલ ખાસ ભેટ વાઉચર", code: "STREAK20MEGA", sponsored_by: "એપ સ્પોન્સર", how_to_redeem: "નજીકના સ્ટોર પર જઈ બિલિંગ સમયે આ કોડ બતાવો." },
  30: { id: "m_stage_30", name: "૩૦-ડે મેગા જેકપોટ ઇનામ! 🏆", desc: "સતત ૩૦ દિવસના લોગિન બદલ ખાસ મેગા સરપ્રાઇઝ ગિફ્ટ", code: "STREAK30JACKPOT", sponsored_by: "એપ સ્પોન્સર", how_to_redeem: "મુવી ટિકિટ બુકિંગ વખતે આ કોડ એપ્લાય કરો અથવા સ્ટોર પર બતાવો." }
};

export const saveScratchCoupon = (coupon) => {
  const coupons = JSON.parse(localStorage.getItem('otlo_rewards') || '[]');
  if (!coupons.some(c => c.id === coupon.id)) {
    coupons.push({ ...coupon, unlockedAt: new Date().toISOString() });
    localStorage.setItem('otlo_rewards', JSON.stringify(coupons));
  }
};

export const getScratchCoupons = () => {
  return JSON.parse(localStorage.getItem('otlo_rewards') || '[]');
};

export const logScratchEvent = async (coupon) => {
  try {
    if (!coupon || !coupon.id || coupon.id.startsWith('c_')) return;
    const userLoc = JSON.parse(localStorage.getItem('user_location') || 'null');
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    
    await supabase.from('scratch_analytics').insert({
      offer_id: coupon.id,
      gender: profile.gender || 'unknown',
      district: userLoc?.districtId || 'unknown',
      taluka: userLoc?.talukaId || 'unknown',
      city_village: profile.city || userLoc?.villageNameGu || 'unknown'
    });
  } catch (err) {
    console.error("Error logging scratch event to analytics:", err);
  }
};

export const fetchMatchingCoupon = async (userLoc, profile, rewardStage = 0) => {
  try {
    const { data: dbOffers, error } = await supabase
      .from('scratch_offers')
      .select('*')
      .eq('is_active', true)
      .eq('reward_stage', rewardStage);
      
    if (error || !dbOffers || dbOffers.length === 0) {
      if (rewardStage > 0) {
        return MOCK_STAGE_COUPONS[rewardStage] || MOCK_STAGE_COUPONS[10];
      }
      return MOCK_COUPONS[Math.floor(Math.random() * MOCK_COUPONS.length)];
    }
    
    // Filter matching coupons based on targeting
    const matchedOffers = dbOffers.filter(offer => {
      const targetType = offer.target_type;
      if (targetType === 'all_gujarat') {
        return true;
      }
      
      const userDist = userLoc?.districtId;
      const userTal = userLoc?.talukaId;
      const userCity = profile?.city;
      const userVilGu = userLoc?.villageNameGu;
      
      if (targetType === 'district') {
        return userDist && userDist.toLowerCase() === offer.target_district?.toLowerCase();
      }
      
      if (targetType === 'taluka') {
        return userDist && userDist.toLowerCase() === offer.target_district?.toLowerCase() &&
               userTal && userTal.toLowerCase() === offer.target_taluka?.toLowerCase();
      }
      
      if (targetType === 'city_village') {
        const targetVal = offer.target_city_village?.toLowerCase();
        if (!targetVal) return false;
        
        const matchesCity = userCity && userCity.toLowerCase().includes(targetVal);
        const matchesVil = userVilGu && userVilGu.toLowerCase().includes(targetVal);
        return matchesCity || matchesVil;
      }
      
      return false;
    });
    
    if (matchedOffers.length > 0) {
      const chosen = matchedOffers[Math.floor(Math.random() * matchedOffers.length)];
      return {
        id: chosen.id,
        name: chosen.name,
        desc: chosen.desc_text, // Map database column desc_text to desc key expected by app
        code: chosen.code,
        target_type: chosen.target_type,
        target_district: chosen.target_district,
        target_taluka: chosen.target_taluka,
        target_city_village: chosen.target_city_village,
        image_url: chosen.image_url,
        sponsored_by: chosen.sponsored_by,
        sponsor_logo_url: chosen.sponsor_logo_url,
        reward_stage: chosen.reward_stage,
        how_to_redeem: chosen.how_to_redeem
      };
    }
    
    if (rewardStage > 0) {
      return MOCK_STAGE_COUPONS[rewardStage] || MOCK_STAGE_COUPONS[10];
    }
    return MOCK_COUPONS[Math.floor(Math.random() * MOCK_COUPONS.length)];
  } catch (err) {
    console.error("Error fetching matching coupon, using mock fallback:", err);
    if (rewardStage > 0) {
      return MOCK_STAGE_COUPONS[rewardStage] || MOCK_STAGE_COUPONS[10];
    }
    return MOCK_COUPONS[Math.floor(Math.random() * MOCK_COUPONS.length)];
  }
};

// 1. Reusable Scratch Card Modal
export const ScratchCardModal = ({ coupon, onClose, onScratched }) => {
  const canvasRef = useRef(null);
  const [scratched, setScratched] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set size matching container
    canvas.width = 300;
    canvas.height = 180;
    
    // Draw canvas overlay (scratch surface)
    // Saffron gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 300, 180);
    grad.addColorStop(0, '#0D9488'); // Orange-500
    grad.addColorStop(0.5, '#0D9488'); // Amber-500
    grad.addColorStop(1, '#2D3748'); // Orange-600
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 180);
    
    // Add text onto the scratch surface
    ctx.font = 'bold 16px "Inter", "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('સ્ક્રૅચ કરો 🎁', 150, 70);
    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('આંગળી ફેરવી ઇનામ મેળવો!', 150, 100);

    // Bandhani dots style decoration on scratch surface
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let x = 10; x < 300; x += 25) {
      for (let y = 10; y < 180; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Check if touch event or mouse event
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const draw = (e) => {
    if (!isDrawing || scratched) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    // Set composite mode to source-out to erase
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    calculateScratchedPercent();
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const calculateScratchedPercent = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparent++;
      }
    }
    
    const pct = Math.round((transparent / (pixels.length / 16)) * 100);
    setPercent(pct);
    
    if (pct > 45 && !scratched) {
      setScratched(true);
      saveScratchCoupon(coupon);
      logScratchEvent(coupon);
      if (onScratched) onScratched();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl border-4 border-yellow-600/20 text-center relative space-y-6">
        <h3 className="font-gujarati font-black text-2xl text-on-surface">✨ નવું સરપ્રાઇઝ ઇનામ! ✨</h3>
        <p className="font-gujarati text-xs text-stone-500">નીચેના કાર્ડને આંગળીથી ઘસીને ઇનામ મેળવો</p>
        
        {coupon.sponsored_by && (
          <div className="text-[11px] font-gujarati bg-amber-500/10 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 px-3 py-1.5 rounded-full font-bold w-fit mx-auto flex items-center gap-1.5 animate-pulse">
            {coupon.sponsor_logo_url ? (
              <img src={coupon.sponsor_logo_url} alt="sponsor logo" className="h-4 w-4 rounded-full object-contain bg-white dark:bg-stone-900 border border-amber-500/20 shrink-0" />
            ) : (
              <span>🤝</span>
            )}
            <span>Sponsored by {coupon.sponsored_by}</span>
          </div>
        )}

        {/* Scratch Container */}
        <div className="relative w-full max-w-[300px] aspect-[5/3] mx-auto rounded-2xl overflow-hidden shadow-inner border border-stone-200 dark:border-stone-800 bg-[#F8FAFC] dark:bg-stone-950 flex flex-col items-center justify-center p-4">
          
          {/* Coupon Reveal Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-2">
            {coupon.image_url ? (
              <img src={coupon.image_url} alt="offer logo" className="h-14 w-auto object-contain rounded-lg shadow-sm" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-yellow-600 animate-bounce">card_giftcard</span>
            )}
            <div className="space-y-1">
              <h4 className="font-gujarati font-black text-lg text-primary">{coupon.name}</h4>
              <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 font-bold">{coupon.desc}</p>
            </div>
            <div className="bg-white dark:bg-stone-800 border-2 border-dashed border-yellow-600 rounded-xl px-4 py-2 font-mono text-sm tracking-widest font-black text-yellow-700 dark:text-yellow-400">
              {coupon.code}
            </div>
          </div>

          {/* HTML5 Canvas overlay */}
          {!scratched && (
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 cursor-pointer touch-none select-none z-10"
            />
          )}
        </div>

        {scratched && coupon.how_to_redeem && (
          <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 p-3 rounded-2xl text-left space-y-1 animate-fade-in max-h-[100px] overflow-y-auto">
            <span className="font-gujarati text-[10px] font-bold text-stone-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span> કેવી રીતે મેળવવું (How to Redeem):
            </span>
            <p className="font-gujarati text-[11px] text-stone-600 dark:text-stone-300 leading-normal font-bold">{coupon.how_to_redeem}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          {scratched ? (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-yellow-600 to-teal-600 hover:from-yellow-400 hover:to-teal-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-sm active:scale-95 transition-transform"
            >
              ખૂબ સરસ, બંધ કરો! ✓
            </button>
          ) : (
            <p className="font-gujarati text-[10px] text-stone-400 animate-pulse">
              સ્ક્રૅચિંગ પ્રગતિ: {percent}% (કાર્ડ ખોલવા ૪૫% સ્ક્રૅચ કરો)
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// 2. Main cabinet view of unlocked rewards
export default function ScratchRewards() {
  const [unlockedCoupons, setUnlockedCoupons] = useState([]);
  const [expandedRedeem, setExpandedRedeem] = useState({});

  useEffect(() => {
    setUnlockedCoupons(getScratchCoupons());
  }, []);

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">મારા ઇનામો 🎁</h2>
        <p className="font-gujarati text-outline text-lg">ક્વિઝ, ગૂઝલ શબ્દો અને મુસાફરી દ્વારા મેળવેલી ખાસ કૂપન્સ.</p>
      </div>

      {unlockedCoupons.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-12 rounded-[2.5rem] text-center flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-6xl text-stone-300 animate-pulse">card_giftcard</span>
          <h4 className="font-gujarati font-black text-lg text-on-surface">હજી સુધી કોઈ ઇનામ મળ્યું નથી!</h4>
          <p className="font-gujarati text-xs text-stone-400 max-w-xs leading-relaxed">
            એપમાં રોજની "શબ્દ રમત" રમો, ક્વિઝમાં વિજયી બનો અથવા નવી જગ્યાઓ એક્સપ્લોર કરી સ્ટેમ્પ મેળવો!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unlockedCoupons.map((coupon, idx) => {
            const isExpanded = !!expandedRedeem[coupon.id || idx];
            return (
              <div key={idx} className="bg-white dark:bg-stone-900 border-2 border-dashed border-yellow-600/30 dark:border-yellow-600/20 p-5 rounded-[2rem] shadow-sm flex flex-col gap-3 group hover:border-yellow-600/50 transition-colors">
                <div className="flex gap-4 items-center justify-between">
                  <div className="h-16 w-16 bg-yellow-50 dark:bg-stone-855 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    {coupon.image_url ? (
                      <img src={coupon.image_url} alt="coupon logo" className="h-full w-full object-contain" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-yellow-600 animate-pulse">local_activity</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-100 truncate">{coupon.name}</h4>
                    <p className="font-gujarati text-xs text-stone-500 mb-1 truncate flex items-center gap-1 flex-wrap">
                      <span>{coupon.desc}</span>
                      {coupon.sponsored_by && (
                        <span className="text-amber-600 font-bold inline-flex items-center gap-0.5">
                          • By 
                          {coupon.sponsor_logo_url && (
                            <img src={coupon.sponsor_logo_url} alt="sponsor logo" className="h-3.5 w-3.5 rounded-full object-contain bg-white dark:bg-stone-900 border border-amber-500/20 shrink-0" />
                          )}
                          {coupon.sponsored_by}
                        </span>
                      )}
                    </p>
                    <div className="w-fit bg-yellow-600/10 dark:bg-stone-800 px-3 py-1 rounded-xl text-xs font-mono font-black text-yellow-700 dark:text-yellow-400">
                      {coupon.code}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "✂️ કૂપન કોડ કોપી થઈ ગયો છે!" } }));
                      }}
                      className="h-9 w-9 bg-yellow-600 hover:bg-yellow-400 text-white rounded-xl flex items-center justify-center transition-all active:scale-90"
                      title="કોપી કોડ"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                    {coupon.how_to_redeem && (
                      <button 
                        onClick={() => setExpandedRedeem(prev => ({ ...prev, [coupon.id || idx]: !prev[coupon.id || idx] }))}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                          isExpanded 
                            ? 'bg-amber-105 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' 
                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'
                        }`}
                        title="રેડેમ્શન સૂચનાઓ"
                      >
                        <span className="material-symbols-outlined text-base">info</span>
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && coupon.how_to_redeem && (
                  <div className="bg-stone-50 dark:bg-stone-950 border border-stone-150 dark:border-stone-850 p-3 rounded-2xl text-left space-y-1 animate-fade-in text-[11px] text-stone-600 dark:text-stone-300">
                    <span className="font-bold text-stone-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">info</span> કેવી રીતે મેળવવું (How to Redeem):
                    </span>
                    <p className="font-bold leading-normal">{coupon.how_to_redeem}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
