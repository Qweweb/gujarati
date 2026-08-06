import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateDynamicSaturnPanoti } from '../utils/astroEngine';

const RASHIS = [
  { id: "મેષ", num: 1, name: "મેષ (Aries)", symbol: "♈", english: "Mesha" },
  { id: "વૃષભ", num: 2, name: "વૃષભ (Taurus)", symbol: "♉", english: "Vrishabha" },
  { id: "મિથુન", num: 3, name: "મિથુન (Gemini)", symbol: "♊", english: "Mithuna" },
  { id: "કર્ક", num: 4, name: "કર્ક (Cancer)", symbol: "♋", english: "Karka" },
  { id: "સિંહ", num: 5, name: "સિંહ (Leo)", symbol: "♌", english: "Simha" },
  { id: "કન્યા", num: 6, name: "કન્યા (Virgo)", symbol: "♍", english: "Kanya" },
  { id: "તુલા", num: 7, name: "તુલા (Libra)", symbol: "♎", english: "Tula" },
  { id: "વૃશ્ચિક", num: 8, name: "વૃશ્ચિક (Scorpio)", symbol: "♏", english: "Vrishchika" },
  { id: "ધન", num: 9, name: "ધન (Sagittarius)", symbol: "♐", english: "Dhanu" },
  { id: "મકર", num: 10, name: "મકર (Capricorn)", symbol: "♑", english: "Makar" },
  { id: "કુંભ", num: 11, name: "કુંભ (Aquarius)", symbol: "♒", english: "Kumbh" },
  { id: "મીન", num: 12, name: "મીન (Pisces)", symbol: "♓", english: "Meen" }
];

const PanotiChecker = () => {
  const navigate = useNavigate();
  const [selectedRashi, setSelectedRashi] = useState(null);
  const [result, setResult] = useState(null);

  const checkPanoti = (rashi) => {
    setSelectedRashi(rashi);
    const res = calculateDynamicSaturnPanoti(rashi.num, new Date());
    setResult(res);
  };


  const triggerWhatsAppShare = () => {
    if (!selectedRashi || !result) return;
    const text = `🕉️ *શનિની સાડાસાતી અને ઢય્યા અહેવાલ* 🕉️\n\n🔮 *રાશિ:* ${selectedRashi.name} ${selectedRashi.symbol}\n📊 *શનિ સ્થિતિ:* *${result.status}*\n🔱 *તબક્કો:* ${result.phase}\n\n👉 આપની સચોટ કુંડળી અને શનિ પનૌતી અહેવાલ મેળવવા માટે આજે જ ડાઉનલોડ કરો *ગુજરાતી એપ*.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20 select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/10 pb-4">
        <div className="space-y-1">
          <h2 className="font-gujarati font-black text-4xl text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl text-[#1e1b4b] dark:text-[#a5b4fc] animate-pulse">dark_mode</span>
            શનિ પનૌતી ચેકર (સાડાસાતી / ઢય્યા)
          </h2>
          <p className="font-gujarati text-outline text-lg">શનિ મહારાજના ગોચર ભ્રમણના આધારે તમારી રાશિ પર પનૌતી કે સાડાસાતી ચેક કરો.</p>
        </div>
        <button 
          onClick={() => navigate('/tools')}
          className="h-12 w-12 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center border border-black/5 hover:bg-stone-50 active:scale-95 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-300">close</span>
        </button>
      </div>

      {/* RASHI SELECTION GRID */}
      <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] p-6 sm:p-10 border border-primary/5 shadow-xl space-y-6">
        <h3 className="font-gujarati font-black text-lg text-[#1e1b4b] dark:text-indigo-400 text-center">તમારી જન્મ રાશિ પસંદ કરો (Select Moon Sign)</h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {RASHIS.map((r) => (
            <div
              key={r.id}
              onClick={() => checkPanoti(r)}
              className={`p-4 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${selectedRashi?.id === r.id ? 'bg-[#1e1b4b] text-white border-[#1e1b4b] shadow-lg' : 'bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 hover:border-[#1e1b4b]/35 border-black/5 dark:text-white'}`}
            >
              <span className="text-3xl">{r.symbol}</span>
              <span className="font-gujarati font-black text-xs truncate max-w-full">{r.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Main result block */}
          <div className="bg-gradient-to-br from-[#1e1b4b]/5 to-[#312e81]/10 dark:from-stone-900 dark:to-stone-850 p-6 sm:p-10 rounded-[2.5rem] border border-indigo-200/50 shadow-xl space-y-6">
            
            <div className="text-center space-y-2">
              <span className="text-5xl">{selectedRashi.symbol}</span>
              <h3 className="font-gujarati font-black text-2xl text-stone-850 dark:text-white">{selectedRashi.name} રાશિ અહેવાલ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl border border-black/5 text-center">
                <span className="font-bold text-outline text-[10px] font-gujarati uppercase block">શનિ દેવ સ્થિતિ</span>
                <span className={`font-gujarati font-black text-sm block mt-1 ${result.severity === 'danger' ? 'text-red-600' : result.severity === 'warning' ? 'text-amber-600' : 'text-green-600'}`}>{result.status}</span>
              </div>
              <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl border border-black/5 text-center">
                <span className="font-bold text-outline text-[10px] font-gujarati uppercase block">વર્તમાન ચરણ</span>
                <span className="font-gujarati font-black text-sm block mt-1 text-[#1e1b4b] dark:text-indigo-400">{result.phase}</span>
              </div>
              <div className="p-4 bg-white dark:bg-stone-800 rounded-2xl border border-black/5 text-center">
                <span className="font-bold text-outline text-[10px] font-gujarati uppercase block">ગોચર સ્થિતિ</span>
                <span className="font-gujarati font-black text-sm block mt-1 text-emerald-600">શનિ કુંભ ભ્રમણ</span>
              </div>
            </div>

            <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-black/5 space-y-2">
              <h4 className="font-gujarati font-black text-sm text-[#1e1b4b] dark:text-indigo-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined">analytics</span>
                જ્યોતિષીય વિશ્લેષણ (Analysis)
              </h4>
              <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{result.description}</p>
            </div>

            {/* Remedies panel */}
            <div className="bg-amber-50/60 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/50 space-y-4">
              <h4 className="font-gujarati font-black text-sm text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600">temple_hindu</span>
                નિવારણ અને કલ્યાણકારી ઉપાયો (Remedies)
              </h4>
              
              <ul className="space-y-3">
                {result.remedies.map((rem, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-gujarati">
                    <span className="h-5 w-5 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center font-bold text-amber-700 text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                    <span>{rem}</span>
                  </li>
                ))}
              </ul>

              {/* Shani beej mantra copy block */}
              {selectedRashi.id !== "અન્ય" && (
                <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-200/40 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-outline uppercase font-gujarati">શનિ પ્રભાવશાળી બીજ મંત્ર</span>
                    <p className="font-gujarati font-black text-xs text-amber-950 dark:text-amber-400">ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः</p>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः");
                      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "મંત્ર કોપી થઈ ગયો છે! 🙏" } }));
                    }}
                    className="h-8 px-3 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-400 hover:bg-amber-200 text-[10px] font-gujarati font-bold active:scale-95 transition-all"
                  >
                    કોપી કરો
                  </button>
                </div>
              )}
            </div>

            {/* Footer Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button 
                onClick={triggerWhatsAppShare}
                className="bg-[#1e1b4b] hover:bg-[#312e81] text-white font-gujarati font-black py-3.5 px-6 rounded-2xl shadow-lg flex items-center gap-2 active:scale-95 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                અહેવાલ શેર કરો 🙏
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default PanotiChecker;
