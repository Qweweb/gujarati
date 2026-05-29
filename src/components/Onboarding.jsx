import { useState } from 'react';

const Onboarding = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 animate-fade-in overflow-y-auto">
      <div className="max-w-md w-full space-y-8 py-12">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-24 w-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30">
                <span className="material-symbols-outlined text-white text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            </div>
            <h1 className="font-headline font-bold text-xl tracking-tight text-[#994700] dark:text-dark-accent">ગુજરાતી એપ</h1>
        </div>

        {/* Disclaimer Content */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-6">
            <h2 className="font-gujarati font-black text-2xl text-error flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span> અગત્યની સૂચના
            </h2>
            
            <div className="space-y-4 font-gujarati text-lg text-outline leading-relaxed overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                <p className="font-bold text-on-surface">૧. મેડિકલ સલાહ નથી:</p>
                <p>આ એપમાં આપવામાં આવેલી માહિતી અને દાદી-મા દ્વારા અપાતા ઉપચારો માત્ર સામાન્ય જાણકારી માટે છે. આ કોઈ ડોક્ટરની સલાહ કે સારવારનો વિકલ્પ નથી.</p>
                
                <p className="font-bold text-on-surface">૨. જવાબદારી:</p>
                <p>તમારી સ્વાસ્થ્ય સંબંધી કોઈ પણ ગંભીર સમસ્યા માટે નજીકના ડોક્ટરનો સંપર્ક અવશ્ય કરવો. એપ દ્વારા મળેલા ડેટા (BP, Sugar) માત્ર રેકોર્ડ રાખવા માટે છે.</p>

                <p className="font-bold text-on-surface">૩. ડેટા સુરક્ષા:</p>
                <p>અમે તમારા હેલ્થ ડેટાને ગુપ્ત રાખીએ છીએ અને અન્ય કોઈ હેતુ માટે તેનો ઉપયોગ કરતા નથી.</p>

                <p className="font-bold text-on-surface">૪. કમ્યુનિટી નીતિ (UGC Policy):</p>
                <p>ઓટલા (કમ્યુનિટી) સેક્શન પર કોઈ પણ અયોગ્ય, અભદ્ર કે અપમાનજનક લખાણ પોસ્ટ કરવું પ્રતિબંધિત છે. આવી પોસ્ટ તુરંત દૂર કરાશે અને નિયમભંગ બદલ એકાઉન્ટ બ્લોક કરી શકાય છે.</p>
            </div>

            <div className="pt-4 space-y-4">
                <button 
                    onClick={onAgree}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-gujarati font-black text-xl shadow-xl active:scale-95 transition-all"
                >
                    હું સંમત છું (I Agree)
                </button>
                <p className="text-center text-xs text-outline font-gujarati">આગળ વધવા માટે સંમતિ આપવી અનિવાર્ય છે.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
