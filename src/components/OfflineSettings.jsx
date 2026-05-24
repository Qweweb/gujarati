const OfflineSettings = () => {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="space-y-2 text-center">
        <h2 className="font-gujarati font-black text-4xl text-primary">ઓફલાઇન સેટિંગ્સ</h2>
        <p className="font-gujarati text-lg text-outline">ઇન્ટરનેટ વગર પણ એપનો ઉપયોગ કરો.</p>
      </div>

      {/* Connection Status Header */}
      <section className="bg-yellow-100/50 p-6 rounded-3xl border border-yellow-200 flex items-center gap-4">
        <div className="h-12 w-12 bg-yellow-500 text-white rounded-2xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">wifi_off</span>
        </div>
        <div className="space-y-1">
            <h4 className="font-gujarati font-black text-lg text-yellow-800">ઇન્ટરનેટની જરૂર નથી</h4>
            <p className="font-gujarati text-sm text-yellow-700">તમે નીચેના ડેટા ડાઉનલોડ કરીને નેટ વગર પણ વાંચી શકો છો.</p>
        </div>
      </section>

      {/* Download Management Header */}
      <section className="space-y-4">
        <h3 className="font-gujarati font-black text-2xl text-on-surface">ડાઉનલોડ મેનેજર</h3>
        
        <DownloadItem title="આજનું પંચાંગ" size="૨.૫ MB" icon="calendar_today" downloaded={true} />
        <DownloadItem title="બાલ સૃષ્ટિ વાર્તાઓ" size="૧૫.૮ MB" icon="auto_stories" />
        <DownloadItem title="ભજન અને સ્તોત્ર" size="૪૫.૦ MB" icon="music_note" premium={true} />
      </section>

      {/* Storage Info Header */}
      <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/5 space-y-6">
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="font-gujarati font-bold text-outline">ફોન સ્ટોરેજ</span>
                <span className="font-label font-bold text-primary text-sm">૬૩.૩ MB વપરાયેલ</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[15%] rounded-full shadow-lg"></div>
            </div>
        </div>
        
        <button className="w-full py-4 border-2 border-error/20 text-error rounded-2xl font-gujarati font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">delete_sweep</span> બધું જ ડિલીટ કરો
        </button>
      </section>

      {/* Premium Tip Card Header */}
      <section className="bg-primary/5 p-8 rounded-[2rem] border-2 border-dashed border-primary/20 flex items-center gap-6">
        <div className="h-20 w-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl">download_done</span>
        </div>
        <div>
            <h4 className="font-gujarati font-black text-xl text-primary leading-tight">ઓટોમેટીક ડાઉનલોડ</h4>
            <p className="font-gujarati text-outline text-sm">જયારે Wi-Fi હોય ત્યારે દરરોજ નવું કન્ટેન્ટ ડાઉનલોડ થઈ જશે.</p>
        </div>
      </section>
    </div>
  );
};

const DownloadItem = ({ title, size, icon, downloaded, premium }) => (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 flex items-center gap-6 group hover:border-primary/20 transition-all">
        <div className="h-14 w-14 bg-surface-container rounded-2xl flex items-center justify-center text-outline group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <span className="material-symbols-outlined text-3xl font-bold">{icon}</span>
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <h4 className="font-gujarati font-black text-2xl">{title}</h4>
                {premium && <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">Plus</span>}
            </div>
            <p className="font-label text-xs text-outline">{size}</p>
        </div>
        <button className={`h-12 w-12 rounded-2xl flex items-center justify-center active:scale-90 transition-all ${downloaded ? 'bg-green-100 text-green-600' : 'bg-primary text-white shadow-lg'}`}>
            <span className="material-symbols-outlined font-black">
                {downloaded ? 'check' : 'download'}
            </span>
        </button>
    </div>
);

export default OfflineSettings;
