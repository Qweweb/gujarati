import { useEffect } from 'react';

export default function LandingPage() {
  // Set page title and meta description dynamically
  useEffect(() => {
    document.title = "ગુજરાતી એપ — પંચાંગ, ચોઘડિયા, ગીતા અને શબ્દ રમત";
    
    // Check if meta description exists, otherwise create it
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "ગુજરાતની નંબર ૧ એપ્લિકેશન. મેળવો દૈનિક પંચાંગ, ચોઘડિયા, ભગવદ્ ગીતા, વાસ્તુશાસ્ત્ર, કુંડલી, શબ્દ રમત અને વ્યાપારી ડિજિટલ કાર્ડ બિલકુલ મફત.";
  }, []);

  const playStoreUrl = "https://play.google.com/store/apps/details?id=in.gujaratiapp";

  return (
    <div className="min-h-screen bg-[#fef8f1] dark:bg-[#120600] text-stone-850 dark:text-stone-100 font-sans transition-colors duration-300">
      
      {/* Header */}
      <header className="border-b border-amber-100/50 dark:border-stone-850 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Gujarati App Logo" 
              className="w-10 h-10 rounded-2xl shadow-md border border-amber-500/20"
              onError={(e) => { e.target.src = 'https://gujaratiapp.in/logo.jpg'; }}
            />
            <span className="font-gujarati font-black text-xl bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              ગુજરાતી એપ
            </span>
          </div>
          <a 
            href={playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-2xl font-gujarati font-bold text-sm shadow-md shadow-orange-500/10 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            એપ ડાઉનલોડ કરો
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 dark:bg-orange-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="md:col-span-7 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200/50 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 rounded-full text-xs font-gujarati font-black tracking-wide uppercase">
              ✨ ૧૦૦% સુરક્ષિત અને સ્વદેશી એપ
            </span>
            <h1 className="font-gujarati font-black text-4xl sm:text-5xl lg:text-6xl text-stone-900 dark:text-white leading-tight">
              ગુજરાતની પોતાની ઓલ-ઇન-વન <br />
              <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                એપ્લિકેશન
              </span>
            </h1>
            <p className="font-gujarati text-stone-600 dark:text-stone-300 text-base sm:text-lg max-w-xl mx-auto md:mx-0 leading-relaxed">
              રોજ રમો મગજને કસરત આપતી <span className="font-bold text-orange-600">શબ્દ રમત</span>, મેળવો સાચું અને સચોટ <span className="font-bold text-orange-600">પંચાંગ, ચોઘડિયા</span>, ભગવદ્ ગીતા, જ્યોતિષ ગાઈડ અને તમારા વ્યવસાય માટે ડિજિટલ બિઝનેસ કાર્ડ.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a 
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  className="h-7"
                />
              </a>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500">
                  <span className="material-symbols-outlined fill-current">star</span>
                  <span className="material-symbols-outlined fill-current">star</span>
                  <span className="material-symbols-outlined fill-current">star</span>
                  <span className="material-symbols-outlined fill-current">star</span>
                  <span className="material-symbols-outlined fill-current">star</span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-gujarati">
                  ગુજરાતીઓનો પ્રિય અને વિશ્વસનીય એપ રેટિંગ
                </p>
              </div>
            </div>
          </div>

          {/* Hero Right Mockup */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-[550px] bg-stone-950 rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800">
              {/* Speaker & Sensor */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-stone-950 rounded-b-2xl z-20 flex justify-center items-center">
                <div className="w-12 h-1 bg-stone-800 rounded-full" />
              </div>
              
              {/* Internal Screen View */}
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-[#fef8f1] relative flex flex-col">
                <div className="bg-gradient-to-b from-orange-600 to-amber-500 p-6 pt-10 text-white text-center">
                  <img 
                    src="/logo.jpg" 
                    alt="Logo" 
                    className="w-16 h-16 rounded-3xl mx-auto mb-3 shadow-md border border-white/20"
                    onError={(e) => { e.target.src = 'https://gujaratiapp.in/logo.jpg'; }}
                  />
                  <h3 className="font-gujarati font-black text-xl">ગુજરાતી એપ</h3>
                  <p className="text-[10px] opacity-90 mt-1">તમામ ગુજરાતી સેવાઓ એક જ જગ્યાએ</p>
                </div>
                
                {/* Mock contents */}
                <div className="p-4 flex-1 space-y-3 overflow-hidden">
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-amber-100/50 flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <div className="text-left">
                      <p className="font-gujarati text-[10px] text-stone-400 font-bold">ડેઇલી ચેલેન્જ</p>
                      <h4 className="font-gujarati font-bold text-xs text-stone-850">રોજ નવી શબ્દ રમત રમો</h4>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-amber-100/50 flex items-center gap-3">
                    <span className="text-2xl">🛕</span>
                    <div className="text-left">
                      <p className="font-gujarati text-[10px] text-stone-400 font-bold">ધાર્મિક સાહિત્ય</p>
                      <h4 className="font-gujarati font-bold text-xs text-stone-850">સંપૂર્ણ ભગવદ્ ગીતા અને આરતી</h4>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-amber-100/50 flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div className="text-left">
                      <p className="font-gujarati text-[10px] text-stone-400 font-bold">જ્યોતિષ & જ્ઞાન</p>
                      <h4 className="font-gujarati font-bold text-xs text-stone-850">ચોઘડિયા અને પંચાંગ કેલ્ક્યુલેટર</h4>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border-t border-amber-100/50 text-center">
                  <span className="inline-block px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-gujarati font-bold">
                    રમવા માટે ડાઉનલોડ કરો
                  </span>
                </div>
              </div>
            </div>
            
            {/* Soft decorative shadow/glow behind mock */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[560px] bg-gradient-to-tr from-orange-500 to-amber-500 opacity-20 blur-2xl -z-10 rounded-[3.5rem]" />
          </div>

        </div>
      </section>

      {/* App Features Grid */}
      <section className="bg-white dark:bg-stone-900 py-20 px-6 border-y border-amber-100/50 dark:border-stone-850">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-gujarati font-black text-3xl sm:text-4xl text-stone-900 dark:text-white">
              એપ્લિકેશનની મુખ્ય વિશેષતાઓ
            </h2>
            <p className="font-gujarati text-stone-500 dark:text-stone-400 text-sm">
              ગુજરાતી સંસ્કૃતિ, જ્ઞાન, રમત અને રોજબરોજના ઉપયોગી સાધનોનો અદ્ભુત સંગ્રહ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                🧠
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                શબ્દ રમત (Word Scramble)
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                આખા વર્ષના ૩૬૫ દિવસ માટે દરરોજ નવો પ્રશ્ન અને કોયડો. શબ્દો ગોઠવીને રમો અને મગજ તેજ કરો.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                🛕
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                ભગવદ્ ગીતા અને ભક્તિ હબ
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                ગીતાજીના ૧૮ અધ્યાય, શ્લોકોનું ગુજરાતી અર્થઘટન, દેવી-દેવતાઓની આરતી અને સ્તુતિઓનું પવિત્ર હબ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                📅
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                સાચું પંચાંગ અને ચોઘડિયા
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                ચાલુ દિવસના સચોટ ચોઘડિયા, તિથિ, નક્ષત્ર અને દિવસ-રાત્રિના શુભ સમયની સચોટ માહિતી.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                🔮
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                જ્યોતિષ, કુંડલી & વાસ્તુ ગાઈડ
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                તમારી કુંડલી જનરેજ કરો અને વાસ્તુશાસ્ત્ર ગાઈડની મદદથી તમારા ઘર અને ઓફિસની દિશાઓ ચેક કરો.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                🪪
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                બિઝનેસ ડિજિટલ કાર્ડ & બાયોડેટા
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                લગ્ન માટે બાયોડેટા અને વ્યાપારના પ્રમોશન માટે સુંદર અને શેર કરવા લાયક ડિજિટલ બિઝનેસ કાર્ડ.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-6 rounded-3xl border border-amber-100/50 dark:border-stone-850 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-2xl mb-4">
                🎮
              </div>
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white mb-2">
                ગુજરાતી ગેમ્સ હબ
              </h3>
              <p className="font-gujarati text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                ખમણ જલેબી ક્રશર, પતંગ કટર અને ટ્રાફિક ગેમ્સ રમો, કોઈન્સ જીતો અને સ્ક્રૅચ કાર્ડ્સ ઇનામો મેળવો.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#fef8f1] to-orange-50 dark:from-[#120600] dark:to-[#1a0a00]">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-gujarati font-black text-3xl sm:text-4xl text-stone-900 dark:text-white leading-tight">
            મોબાઈલ વેબ બ્રાઉઝરમાં એપ્લિકેશન સપોર્ટેડ નથી
          </h2>
          <p className="font-gujarati text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            સારા અનુભવ અને અદ્ભુત ગેમિંગ પર્ફોર્મન્સ માટે, આ સુવિધાઓનો ઉપયોગ માત્ર એન્ડ્રોઇડ મોબાઈલ એપ્લિકેશનમાં જ થઈ શકે છે. પ્લે સ્ટોર પરથી સત્તાવાર એપ ડાઉનલોડ કરો.
          </p>
          <div className="pt-4 flex justify-center">
            <a 
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-gujarati font-bold text-md shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined">download</span>
              પ્લે સ્ટોર પરથી ડાઉનલોડ કરો
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-100/50 dark:border-stone-850 py-10 px-6 text-center text-stone-500 dark:text-stone-400 text-xs">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="font-gujarati">
            © {new Date().getFullYear()} ગુજરાતી એપ. સર્વાધિકાર સુરક્ષિત.
          </p>
          <div className="flex justify-center gap-6 font-gujarati">
            <a href="/privacy-policy" className="hover:text-orange-600 transition-colors">
              પ્રાઇવસી પોલિસી (Privacy Policy)
            </a>
            <span className="text-stone-300 dark:text-stone-800">|</span>
            <span className="font-sans">support@gujaratiapp.in</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
