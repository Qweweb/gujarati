import { useState } from 'react';
import { deleteUserAccount } from '../utils/otlo_helper';
import { scheduleDailyQuizNotifications, cancelQuizNotifications, sendTestQuizNotification } from '../utils/quizNotificationScheduler';

const Settings = ({ darkMode, toggleDarkMode }) => {
    const [quizNotifEnabled, setQuizNotifEnabled] = useState(() => {
        return localStorage.getItem('daily_quiz_notification_enabled') !== 'false';
    });
    const [testNotifMsg, setTestNotifMsg] = useState('');

    const toggleQuizNotif = async () => {
        const nextState = !quizNotifEnabled;
        setQuizNotifEnabled(nextState);
        localStorage.setItem('daily_quiz_notification_enabled', nextState ? 'true' : 'false');
        if (nextState) {
            await scheduleDailyQuizNotifications();
            setTestNotifMsg('✅ 9 AM ડેઇલી ક્વિઝ નોટિફિકેશન સેટ થયું.');
        } else {
            await cancelQuizNotifications();
            setTestNotifMsg('🛑 ડેઇલી ક્વિઝ નોટિફિકેશન બંધ કર્યું.');
        }
        setTimeout(() => setTestNotifMsg(''), 4000);
    };

    const handleTestNotification = async () => {
        setTestNotifMsg('⏳ 5 સેકન્ડમાં ટેસ્ટ નોટિફિકેશન આવી રહ્યું છે...');
        const res = await sendTestQuizNotification();
        if (res.success) {
            setTimeout(() => setTestNotifMsg(''), 7000);
        } else {
            setTestNotifMsg('❌ નોટિફિકેશન મોકલવામાં નિષ્ફળ.');
        }
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm(
            "શું તમે ખરેખર તમારું એકાઉન્ટ ડીલીટ કરવા માંગો છો? આનાથી તમારા તમામ લોકેશન ડેટા, કમ્યુનિટી પોસ્ટ્સ અને કોઈન્સ હંમેશ માટે દૂર થઈ જશે. આ ક્રિયા પાછી મેળવી શકાશે નહીં."
        );
        if (confirmDelete) {
            deleteUserAccount();
        }
    };

    const categories = [
      { 
          title: "એપ સેટિંગ્સ", 
          items: [
              { 
                label: "ડેઇલી ક્વિઝ નોટિફિકેશન (9 AM)", 
                icon: "notifications_active", 
                isQuizToggle: true, 
                value: quizNotifEnabled ? "ચાલુ" : "બંધ" 
              },
              { 
                label: darkMode ? "લાઈટ મોડ" : "ડાર્ક મોડ", 
                icon: darkMode ? "light_mode" : "dark_mode", 
                isThemeToggle: true 
              },
              { label: "ભાષા (ગુજરાતી)", icon: "translate", value: "બદલો" }
          ]
      },
      { 
          title: "સુરક્ષા", 
          items: [
              { label: "PIN સેટ કરો", icon: "lock", value: "લોક" },
              { label: "મેડિકલ ડિસ્ક્લેમર", icon: "policy", value: "વાંચો" },
              { label: "એકાઉન્ટ ડીલીટ કરો", icon: "delete_forever", isDeleteAccount: true, value: "ડીલીટ" }
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
  
        {testNotifMsg && (
          <div className="bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-amber-700 p-4 rounded-2xl text-center font-gujarati text-sm font-bold text-amber-700 dark:text-amber-400 animate-fade-in">
            {testNotifMsg}
          </div>
        )}

        <div className="space-y-8">
          {categories.map((cat, idx) => (
            <section key={idx} className="space-y-4">
              <h3 className="font-gujarati font-bold text-outline dark:text-dark-text-dim text-xs uppercase tracking-widest pl-4">{cat.title}</h3>
              <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] shadow-sm border border-black/5 dark:border-dark-accent/5 overflow-hidden">
                {cat.items.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={item.isQuizToggle ? toggleQuizNotif : (item.isThemeToggle ? toggleDarkMode : (item.isDeleteAccount ? handleDeleteAccount : undefined))}
                    className="flex items-center justify-between p-6 border-b border-black/5 last:border-none group active:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 ${item.isThemeToggle ? 'bg-primary dark:bg-dark-accent text-white' : (item.isDeleteAccount ? 'bg-error/10 text-error' : 'bg-surface-container dark:bg-dark-bg text-outline dark:text-dark-text-dim')} rounded-xl flex items-center justify-center transition-all`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>
                        <span className={`font-gujarati font-black text-xl ${item.isDeleteAccount ? 'text-error font-extrabold' : 'text-on-surface dark:text-dark-text'}`}>{item.label}</span>
                    </div>
                    
                    {item.isThemeToggle ? (
                        <div className={`h-7 w-12 ${darkMode ? 'bg-dark-accent' : 'bg-primary/20'} rounded-full relative p-1 transition-colors`}>
                            <div className={`h-5 w-5 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    ) : item.isQuizToggle ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestNotification();
                            }}
                            className="px-3 py-1 bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300 hover:bg-amber-200 text-xs font-gujarati font-bold rounded-lg transition-all"
                          >
                            🧪 ટેસ્ટ (5s)
                          </button>
                          <div className={`h-7 w-12 ${quizNotifEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'} rounded-full relative p-1 transition-colors`}>
                              <div className={`h-5 w-5 bg-white rounded-full shadow-sm transition-transform ${quizNotifEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className={`font-gujarati text-sm ${item.isDeleteAccount ? 'text-error font-bold' : 'text-outline dark:text-dark-text-dim'}`}>{item.value}</span>
                            <span className={`material-symbols-outlined text-sm ${item.isDeleteAccount ? 'text-error' : 'text-outline'}`}>chevron_right</span>
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
