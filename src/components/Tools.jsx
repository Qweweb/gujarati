import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';

const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">ઉપયોગી સાધનો</h2>
        <p className="font-gujarati text-outline text-lg">તામારા દૈનિક જીવનમાં આધ્યાત્મિકતા અને વિજ્ઞાનનો સમન્વય કરો.</p>
      </div>

      {/* Muhurt Finder Card */}
      <section id="muhurt-finder" className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-6">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-primary-container">
                <span className="material-symbols-outlined font-black">event_available</span>
                <h3 className="font-gujarati font-black text-2xl">શુભ મુહૂર્ત શોધક</h3>
            </div>
            <ShareButton sectionId="muhurt-finder" successMessage="📅 શુભ મુહૂર્ત શોધકની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
        </div>
        
        <div className="bg-surface-container-low rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
                <span className="material-symbols-outlined text-outline">chevron_left</span>
                <p className="font-gujarati font-black text-xl">નવેમ્બર ૨૦૨૪</p>
                <span className="material-symbols-outlined text-outline">chevron_right</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-outline-variant mb-4 uppercase tracking-widest">
                <span>Ravi</span><span>Som</span><span>Mangal</span><span>Budh</span><span>Guru</span><span>Shukra</span><span>Shani</span>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center font-headline font-bold">
                {[...Array(30)].map((_, i) => (
                    <span key={i} className={`h-10 w-10 flex items-center justify-center rounded-xl ${i + 1 === 10 ? 'bg-primary text-white shadow-lg' : i + 1 === 1 ? 'border border-primary-container/30 text-primary' : 'text-on-surface'}`}>
                        {i + 1}
                    </span>
                ))}
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-outline">
                    <span className="h-2 w-2 bg-orange-500 rounded-full"></span> આજે લાભ પંચમી
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-outline">
                    <span className="h-2 w-2 bg-red-500 rounded-full"></span> તેવઠિયુ અમૃત (શુભ)
                </div>
            </div>
        </div>

        <button onClick={() => navigate('/panchang')} className="w-full py-5 bg-primary-container text-white rounded-2xl font-gujarati font-black text-2xl shadow-lg active:scale-95 transition-all">
            નવું મુહૂર્ત શોધો
        </button>
      </section>

      {/* Kundali Generator Card */}
      <section id="kundali-generator" className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-6 overflow-hidden">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined font-black">stars</span>
                <h3 className="font-gujarati font-black text-2xl">કુંડળી જનરેટર</h3>
            </div>
            <ShareButton sectionId="kundali-generator" successMessage="✨ કુંડળી જનરેટરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
        </div>
        <p className="font-gujarati text-outline">તમારી જન્મ વિગતો દાખલ કરો અને વિગતવાર કુંડળી મેળવો.</p>
        
        <div className="relative h-64 bg-surface-container-low rounded-3xl flex items-center justify-center p-4">
            <img src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=400" className="opacity-10 absolute inset-0 w-full h-full object-cover" alt="Kundali Graph" />
            <div className="relative w-48 h-48 border-2 border-primary/20 flex flex-wrap shadow-inner bg-white/50 backdrop-blur-sm rounded-xl">
                <div className="w-1/2 h-1/2 border-r border-b border-primary/10 p-2 text-[10px] font-bold text-primary">૧૨</div>
                <div className="w-1/2 h-1/2 border-b border-primary/10 p-2 text-right text-[10px] font-bold text-primary">૨</div>
                <div className="w-1/2 h-1/2 border-r border-primary/10 p-2 flex items-end text-[10px] font-bold text-primary">૧૦</div>
                <div className="w-1/2 h-1/2 p-2 flex items-end justify-end text-[10px] font-bold text-primary">૪</div>
                <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                    <span className="font-gujarati font-black text-primary bg-white px-2 py-1 rounded">શુભ</span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <button onClick={() => navigate('/kundali')} className="w-full py-4 bg-primary text-white rounded-2xl font-gujarati font-black text-lg active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">stars</span> તમારી ફ્રી કુંડળી બનાવો
            </button>
        </div>
      </section>

      {/* Biodata Maker Card */}
      <section id="biodata-maker" className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 space-y-6 overflow-hidden">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-primary">
                <span className="material-symbols-outlined font-black">description</span>
                <h3 className="font-gujarati font-black text-2xl">બાયોડેટા મેકર</h3>
            </div>
            <ShareButton sectionId="biodata-maker" successMessage="📄 બાયોડેટા મેકરની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
        </div>
        <p className="font-gujarati text-outline">લગ્ન અથવા નોકરી (Resume) માટે સુંદર અને આકર્ષક બાયોડેટા બનાવો.</p>
        
        <div className="relative h-48 bg-surface-container-low rounded-3xl flex items-center justify-center p-4">
            <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400" className="opacity-10 absolute inset-0 w-full h-full object-cover" alt="Biodata Maker Graph" />
            <div className="relative flex gap-4">
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5 text-center">
                    <span className="material-symbols-outlined text-3xl text-primary mb-1">favorite</span>
                    <p className="font-gujarati font-black text-xs text-stone-850">લગ્ન બાયોડેટા</p>
                </div>
                <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-black/5 text-center">
                    <span className="material-symbols-outlined text-3xl text-primary mb-1">work</span>
                    <p className="font-gujarati font-black text-xs text-stone-850">Resume Maker</p>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <button onClick={() => navigate('/biodata')} className="w-full py-4 bg-primary text-white rounded-2xl font-gujarati font-black text-lg active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">description</span> તમારો બાયોડેટા બનાવો
            </button>
        </div>
      </section>

      {/* Panchang Mini Dashboard */}
      <section id="panchang-mini" className="bg-surface-container rounded-[2.5rem] p-8 space-y-6 border border-primary/5">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl">wb_sunny</span>
                </div>
                <div>
                    <h4 className="font-gujarati font-black text-xl leading-tight">આજનું પંચાંગ</h4>
                    <p className="font-gujarati text-sm text-outline">વિક્રમ સંવત ૨૦૮૧, કારતક સુદ પાંચમ</p>
                </div>
            </div>
            <ShareButton sectionId="panchang-mini" successMessage="☀️ આજના પજનાંંગની ડાયરેક્ટ લિંક કોપી થઈ ગઈ છે!" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 border-y border-black/5 py-4">
            <div className="text-center">
                <p className="text-[10px] font-bold text-outline-variant mb-1 uppercase tracking-wider">સૂર્યોદય</p>
                <p className="font-headline font-black text-sm">06:45 AM</p>
            </div>
            <div className="text-center border-x border-black/5">
                <p className="text-[10px] font-bold text-outline-variant mb-1 uppercase tracking-wider">સૂર્યાસ્ત</p>
                <p className="font-headline font-black text-sm">06:12 PM</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] font-bold text-outline-variant mb-1 uppercase tracking-wider">નક્ષત્ર</p>
                <p className="font-gujarati font-black text-sm">રોહિણી</p>
            </div>
        </div>

        <button onClick={() => navigate('/panchang')} className="w-full flex items-center justify-between font-gujarati font-bold bg-white p-4 rounded-2xl shadow-sm cursor-pointer hover:bg-white/80 transition-colors">
            વિગતવાર જુઓ <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>

      {/* Quick Tool Links */}
      <section className="space-y-4">
        <ToolLink onClick={() => navigate('/daily-challenge')} icon="psychology" title="શબ્દ રમત" subtitle="રોજ નવા ગૂઝલ શબ્દો ગોઠવી જ્ઞાન વધારો" color="bg-amber-50" iconColor="text-amber-600" />
        <ToolLink onClick={() => navigate('/gujarat-safari')} icon="map" title="ગુજરાત સફારી" subtitle="નકશામાં પ્રાણીઓ અને પાત્રોના અવાજમાં શીખો" color="bg-emerald-50" iconColor="text-emerald-600" />
        <ToolLink onClick={() => navigate('/passport')} icon="menu_book" title="ટ્રાવેલ પાસપોર્ટ" subtitle="પ્રખ્યાત સ્થળોએ GPS ચેક-ઇન કરી સિક્કા મેળવો" color="bg-blue-50" iconColor="text-blue-600" />
        <ToolLink onClick={() => navigate('/mysteries')} icon="search" title="ગુજરાતના રહસ્યો" subtitle="ઐતિહાસિક કોયડા ઉકેલો અને સત્ય જાણો" color="bg-rose-50" iconColor="text-rose-600" />
        <ToolLink onClick={() => navigate('/swipe-cards')} icon="style" title="જ્ઞાન કાર્ડ્સ" subtitle="સ્વાઇપ કરી ગુજરાતની રોચક વાતો જાણો" color="bg-purple-50" iconColor="text-purple-650" />
        <ToolLink onClick={() => navigate('/gujarat-quiz')} icon="workspace_premium" title="જ્ઞાન ક્વિઝ" subtitle="સ્થળોના ફોટો ઓળખી રસપ્રદ પ્રશ્નોત્તરી રમો" color="bg-orange-50" iconColor="text-orange-650" />
        <ToolLink onClick={() => navigate('/interest-calculator')} icon="calculate" title="વ્યાજ કેલ્ક્યુલેટર" subtitle="ગોલ્ડ, હોમ, પર્સનલ અને કાર લોનનું વ્યાજ ગણો" color="bg-amber-50" iconColor="text-amber-600" />
        <ToolLink onClick={() => navigate('/vastu')} icon="explore" title="વાસ્તુ કેલ્ક્યુલેટર" subtitle="ઘરની દિશાઓ અને ઉર્જા તપાસો" color="bg-error/5" iconColor="text-error" />
        <ToolLink onClick={() => navigate('/namkaran')} icon="auto_fix_high" title="નામકરણ સાધન" subtitle="રાશિમુજબ શ્રેષ્ઠ નામો શોધો" color="bg-primary-container/10" iconColor="text-primary-container" />
      </section>
    </div>
  );
};

const ToolLink = ({ icon, title, subtitle, color, iconColor, onClick }) => (
  <div onClick={onClick} className={`${color} p-6 rounded-[2rem] flex items-center gap-6 border border-black/5 group cursor-pointer active:scale-95 transition-transform`}>
    <div className={`h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm ${iconColor} group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-4xl font-black">{icon}</span>
    </div>
    <div className="flex-1">
        <h4 className="font-gujarati font-black text-2xl">{title}</h4>
        <p className="font-gujarati text-outline text-lg">{subtitle}</p>
    </div>
  </div>
);

export default Tools;
