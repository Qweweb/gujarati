import { Link } from 'react-router-dom';

const Profile = () => {
  const settings = [
    { title: "મારા ઇનામો (My Rewards)", icon: "card_giftcard", desc: "ક્વિઝ અને પ્રવાસ દ્વારા મેળવેલી કૂપન્સ જુઓ", link: "/rewards" },
    { title: "ટ્રાવેલ પાસપોર્ટ (Travel Passport)", icon: "menu_book", desc: "ગુજરાત સફારી પ્રવાસ બુક અને સ્ટેમ્પ્સ", link: "/passport" },
    { title: "સ્વાસ્થ્ય ડેટા સેટિંગ્સ", icon: "health_and_safety", desc: "BP અને Sugar રેકોર્ડ્સ મેનેજ કરો" },
    { title: "પરિવારની પ્રોફાઇલ", icon: "family_restroom", desc: "સભ્યો ઉમેરો અથવા બદલો" },
    { title: "સામાન્ય સેટિંગ્સ", icon: "settings", desc: "નોટિફિકેશન અને એપ કંટ્રોલ", link: "/settings" },
    { title: "ડાઉનલોડ્સ (ઓફલાઇન)", icon: "download_for_offline", desc: "વાર્તા અને પંચાંગ ડાઉનલોડ કરો", link: "/offline" },
    { title: "ભાષા (Language)", icon: "language", desc: "ગુજરાતી - ગુજરાતી" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sanskari_token');
    window.location.reload();
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Profile Header Header */}
      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-primary/5 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center p-1 border-4 border-white shadow-xl">
            <img src="https://i.pravatar.cc/100?u=dada" className="w-full h-full object-cover rounded-full" alt="Profile" />
        </div>
        <div className="space-y-1">
            <h2 className="font-gujarati font-black text-3xl text-on-surface">અનિલભાઈ શાહ</h2>
            <p className="font-gujarati text-lg text-outline">પ્રોફાઇલ: દાદાજી</p>
        </div>
      </section>

      {/* Settings List Header */}
      <section className="space-y-4">
        <p className="font-gujarati font-bold text-outline text-xs uppercase tracking-widest pl-4">સેટિંગ્સ</p>
        <div className="space-y-3">
            {settings.map((s, idx) => (
                <Link 
                    key={idx} 
                    to={s.link || "/"} 
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 flex items-center gap-6 group hover:border-primary/20 transition-all block"
                >
                    <div className="h-14 w-14 bg-surface-container rounded-2xl flex items-center justify-center text-outline group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-3xl font-bold">{s.icon}</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-gujarati font-black text-xl">{s.title}</h4>
                        <p className="font-gujarati text-sm text-outline">{s.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                </Link>
            ))}
        </div>
      </section>

      {/* Logout / Other Actions Header */}
      <section className="pt-6">
        <button 
            onClick={handleLogout}
            className="w-full py-5 bg-error/5 text-error rounded-2xl font-gujarati font-black text-xl border border-error/10 active:scale-95 transition-all text-center"
        >
            લોગ-આઉટ કરો
        </button>
        <p className="text-center text-outline text-[10px] mt-6 font-label uppercase tracking-widest">Version 1.0.0 (Beta)</p>
      </section>
    </div>
  );
};

export default Profile;
