const Settings = ({ darkMode, toggleDarkMode }) => {
    const categories = [
      { 
          title: "એપ સેટિંગ્સ", 
          items: [
              { label: "નોટિફિકેશન", icon: "notifications", toggle: false, value: "ચાલુ" },
              { label: darkMode ? "લાઈટ મોડ" : "ડાર્ક મોડ", icon: darkMode ? "light_mode" : "dark_mode", isThemeToggle: true },
              { label: "ભાષા (ગુજરાતી)", icon: "translate", value: "બદલો" }
          ]
      },
      { 
          title: "સુરક્ષા", 
          items: [
              { label: "PIN સેટ કરો", icon: "lock", value: "લોક" },
              { label: "મેડિકલ ડિસ્ક્લેમર", icon: "policy", value: "વાંચો" }
          ]
      },
      { 
          title: "મદદ અને સપોર્ટ", 
          items: [
              { label: "અમારા વિષે", icon: "info", value: "" },
              { label: "હેલ્પ સેન્ટર", icon: "help", value: "" },
              { label: "નિયમો અને શરતો", icon: "gavel", value: "" }
          ]
      }
    ];
  
    return (
      <div className="animate-fade-in space-y-10 pb-12">
        <h2 className="font-gujarati font-black text-4xl text-primary dark:text-dark-accent text-center">સેટિંગ્સ</h2>
  
        <div className="space-y-8">
          {categories.map((cat, idx) => (
            <section key={idx} className="space-y-4">
              <h3 className="font-gujarati font-bold text-outline dark:text-dark-text-dim text-xs uppercase tracking-widest pl-4">{cat.title}</h3>
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] shadow-sm border border-black/5 dark:border-dark-accent/5 overflow-hidden">
                {cat.items.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={item.isThemeToggle ? toggleDarkMode : undefined}
                    className="flex items-center justify-between p-6 border-b border-black/5 last:border-none group active:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 ${item.isThemeToggle ? 'bg-primary dark:bg-dark-accent text-white' : 'bg-surface-container dark:bg-dark-bg text-outline dark:text-dark-text-dim'} rounded-xl flex items-center justify-center transition-all`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <span className="font-gujarati font-black text-xl text-on-surface dark:text-dark-text">{item.label}</span>
                    </div>
                    
                    {item.isThemeToggle ? (
                        <div className={`h-7 w-12 ${darkMode ? 'bg-dark-accent' : 'bg-primary/20'} rounded-full relative p-1 transition-colors`}>
                            <div className={`h-5 w-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="font-gujarati text-sm text-outline dark:text-dark-text-dim">{item.value}</span>
                            <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
  
        <div className="text-center space-y-2 opacity-30">
            <h1 className="font-headline font-black text-xl text-primary dark:text-dark-accent">Gujarati App</h1>
            <p className="font-label text-xs">વધારે ઊંડાઈ સાથે ગુજરાતી પરંપરા</p>
        </div>
      </div>
    );
  };
  
  export default Settings;
