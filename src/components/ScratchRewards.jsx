import { useState, useEffect, useRef } from 'react';

// Pre-configured list of mock local discount coupons in Gujarat
export const MOCK_COUPONS = [
  { id: "c_kutch_1", name: "૧૫% છૂટ - ભૂજ પ્રખ્યાત બાંધણી હાઉસ", desc: "બાંધણીની ખરીદી પર ખાસ વળતર 🛍️", code: "KUTCHBANDHANI15" },
  { id: "c_junagadh_1", name: "૧૦% છૂટ - કાઠિયાવાડી ભોજનાલય", desc: "ખાસ કાઠિયાવાડી થાળી પર ડિસ્કાઉન્ટ 🍲", code: "KATHIAWAD10" },
  { id: "c_ahmedabad_1", name: "૧૫% છૂટ - સીદી સૈયદ ખાણી-પીણી બજાર", desc: "સિટી ફૂડ કોર્ટ પર ખાસ ડિસ્કાઉન્ટ 🍔", code: "AMDAVADFOOD" },
  { id: "c_somnath_1", name: "૧૦% છૂટ - સોમનાથ પૂજા ભંડાર", desc: "પૂજા વિધિ સામગ્રીની ખરીદી પર 🕉️", code: "SOMNATHPOOJA" },
  { id: "c_sasan_1", name: "૨૦% છૂટ - ગીર સફારી રિસોર્ટ", desc: "રિસોર્ટ બુકિંગ પર ખાસ વળતર 🏨", code: "GIRSARI20" },
  { id: "c_patan_1", name: "૧૫% છૂટ - પાટણ પટોળા એમ્પોરિયમ", desc: "અસલી પાટણ પટોળા ખરીદી પર 👗", code: "PATANPATOLA15" }
];

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
    grad.addColorStop(0, '#f97316'); // Orange-500
    grad.addColorStop(0.5, '#f59e0b'); // Amber-500
    grad.addColorStop(1, '#ea580c'); // Orange-600
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
    
    // Check if touch event or mouse event
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
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
      if (onScratched) onScratched();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl border-4 border-amber-500/20 text-center relative space-y-6">
        <h3 className="font-gujarati font-black text-2xl text-on-surface">✨ નવું સરપ્રાઇઝ ઇનામ! ✨</h3>
        <p className="font-gujarati text-xs text-stone-500">નીચેના કાર્ડને આંગળીથી ઘસીને ઇનામ મેળવો</p>
        
        {/* Scratch Container */}
        <div className="relative w-[300px] h-[180px] mx-auto rounded-2xl overflow-hidden shadow-inner border border-stone-200 dark:border-stone-800 bg-[#fef8f1] dark:bg-stone-950 flex flex-col items-center justify-center p-4">
          
          {/* Coupon Reveal Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 space-y-3 animate-pulse">
            <span className="material-symbols-outlined text-4xl text-amber-500 animate-bounce">card_giftcard</span>
            <div className="space-y-1">
              <h4 className="font-gujarati font-black text-lg text-primary">{coupon.name}</h4>
              <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 font-bold">{coupon.desc}</p>
            </div>
            <div className="bg-white dark:bg-stone-800 border-2 border-dashed border-amber-500 rounded-xl px-4 py-2 font-mono text-sm tracking-widest font-black text-amber-600 dark:text-amber-400">
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

        {/* Buttons */}
        <div className="space-y-2">
          {scratched ? (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-sm active:scale-95 transition-transform"
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
    </div>
  );
};

// 2. Main cabinet view of unlocked rewards
export default function ScratchRewards() {
  const [unlockedCoupons, setUnlockedCoupons] = useState([]);

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
          {unlockedCoupons.map((coupon, idx) => (
            <div key={idx} className="bg-white dark:bg-stone-900 border-2 border-dashed border-amber-500/30 dark:border-amber-500/20 p-6 rounded-[2rem] shadow-sm flex gap-4 items-center justify-between group hover:border-amber-500/50 transition-colors">
              <div className="h-16 w-16 bg-amber-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl text-amber-500 animate-pulse">local_activity</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-gujarati font-black text-base text-stone-800 dark:text-stone-100 truncate">{coupon.name}</h4>
                <p className="font-gujarati text-xs text-stone-500 mb-2 truncate">{coupon.desc}</p>
                <div className="w-fit bg-amber-500/10 dark:bg-stone-800 px-3 py-1 rounded-xl text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                  {coupon.code}
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "✂️ કૂપન કોડ કોપી થઈ ગયો છે!" } }));
                }}
                className="h-10 w-10 bg-amber-500 hover:bg-amber-400 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shrink-0"
                title="કોપી કોડ"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
