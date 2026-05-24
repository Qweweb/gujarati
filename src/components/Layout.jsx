import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [coins, setCoins] = useState(() => {
    return parseInt(localStorage.getItem('gujarat_coins') || '100', 10);
  });

  useEffect(() => {
    const handleShowToast = (e) => {
      setToastMessage(e.detail.message);
    };
    const handleCoinsUpdate = () => {
      setCoins(parseInt(localStorage.getItem('gujarat_coins') || '100', 10));
    };
    window.addEventListener('show-toast', handleShowToast);
    window.addEventListener('coins-updated', handleCoinsUpdate);
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
      window.removeEventListener('coins-updated', handleCoinsUpdate);
    };
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get('section') || params.get('feature');
    if (sectionId) {
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Adjust scroll alignment beautifully
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearInterval(interval);
        }
        attempts++;
        if (attempts > 20) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [location]);

  const navItems = [
    { path: '/', icon: 'home', label: 'હોમ' },
    { path: '/devotional', icon: 'auto_stories', label: 'ભક્તિ' },
    { path: '/health', icon: 'favorite', label: 'સ્વાસ્થ્ય' },
    { path: '/tools', icon: 'construction', label: 'સાધનો' },
    { path: '/community', icon: 'groups', label: 'બેઠક' },
  ];

  return (
    <div className="bg-background dark:bg-dark-bg text-on-surface dark:text-dark-text font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen pb-32 transition-colors duration-500">
      {/* Top App Bar Header */}
      <header className="fixed top-0 w-full z-30 bg-[#fef8f1]/90 dark:bg-dark-bg/90 backdrop-blur-md shadow-sm border-b border-orange-100/20 dark:border-orange-900/20 transition-colors duration-500">
        <div className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[#994700] dark:text-dark-accent active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined font-bold">menu</span>
          </button>
          
          <Link to="/" className="flex items-center gap-2">
             <div className="h-10 w-10 bg-primary/10 dark:bg-dark-accent/10 rounded-xl flex items-center justify-center transition-all">
                <span className="material-symbols-outlined text-primary dark:text-dark-accent" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
             </div>
             <h1 className="font-headline font-bold text-xl tracking-tight text-[#994700] dark:text-dark-accent">ગુજરાતી એપ</h1>
          </Link>

          <div className="flex items-center gap-3">
            {/* Coins Indicator Header */}
            <Link 
                to="/rewards"
                className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl text-amber-600 dark:text-amber-400 hover:scale-105 active:scale-95 transition-all text-xs font-bold"
                title="મારા સિક્કા અને ઇનામો"
            >
              <span className="material-symbols-outlined text-base text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              <span className="font-headline font-black text-sm">{coins}</span>
            </Link>

            {/* Dark Mode Toggle Header */}
            <button 
                onClick={toggleDarkMode}
                className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/5 dark:bg-dark-accent/10 text-primary dark:text-dark-accent active:scale-90 transition-all border border-primary/10 dark:border-dark-accent/10 shadow-sm"
            >
                <span className="material-symbols-outlined">
                    {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
            </button>
            <Link 
                to="/admin" 
                className="h-10 w-10 rounded-xl flex items-center justify-center bg-primary/5 dark:bg-dark-accent/10 text-primary dark:text-dark-accent active:scale-90 transition-all border border-primary/10 dark:border-dark-accent/10 shadow-sm"
                title="એડમિન કંટ્રોલ"
            >
                <span className="material-symbols-outlined">settings</span>
            </Link>
            
            {/* User Profile Avatar Link */}
            <Link 
                to="/profile" 
                className="h-10 w-10 rounded-xl overflow-hidden border border-primary/20 hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="મારા પ્રોફાઇલ"
            >
                <img src="https://i.pravatar.cc/100?u=dada" className="w-full h-full object-cover" alt="Profile" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Header */}
      <main className="pt-24 px-6 max-w-5xl mx-auto bandhani-pattern">
        {children}
      </main>

      {/* Bottom Navigation Header */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl z-30 rounded-t-[2.5rem] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t border-orange-100/50 dark:border-orange-900/20 transition-colors duration-500">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative ${
              location.pathname === item.path 
                ? 'bg-primary/10 dark:bg-dark-accent/10 text-primary dark:text-dark-accent px-6 rounded-2xl' 
                : 'text-stone-400 dark:text-stone-600 px-4'
            } py-2 active:scale-90`}
          >
            <span 
              className="material-symbols-outlined text-2xl" 
              style={{ fontVariationSettings: location.pathname === item.path ? "'FILL' 1" : "" }}
            >
              {item.icon}
            </span>
            <span className="font-gujarati font-bold text-[10px] mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Global premium glassmorphic toast notification */}
      {toastMessage && (
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in pointer-events-none">
          <div className="bg-stone-900/90 dark:bg-stone-800/90 backdrop-blur-md text-white font-gujarati font-black text-sm px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-500/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 animate-bounce">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          
          {/* Drawer Container */}
          <div className="relative w-80 max-w-full bg-[#fef8f1] dark:bg-[#1a0a00] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-slide-in-left border-r border-orange-100/10">
            <div className="space-y-6">
              
              {/* Header inside Drawer */}
              <div className="flex justify-between items-center pb-4 border-b border-orange-100/10">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>temple_hindu</span>
                  </div>
                  <h3 className="font-headline font-black text-lg text-[#994700] dark:text-dark-accent">ગુજરાતી એપ</h3>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8 rounded-full bg-stone-150 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* User profile summary in Drawer */}
              <Link 
                to="/profile" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900/45 rounded-2xl border border-orange-100/5 shadow-xs"
              >
                <div className="h-12 w-12 rounded-full overflow-hidden border border-primary/20 shrink-0">
                  <img src="https://i.pravatar.cc/100?u=dada" className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div>
                  <h4 className="font-gujarati font-black text-sm text-stone-850 dark:text-stone-100 leading-tight">અનિલભાઈ શાહ</h4>
                  <p className="font-gujarati text-[10px] text-stone-400 font-semibold">દાદાજી (પ્રોફાઇલ) ➔</p>
                </div>
              </Link>

              {/* Menu Links */}
              <div className="space-y-1">
                <p className="font-gujarati text-[9px] text-stone-450 dark:text-stone-500 font-black uppercase tracking-widest pl-2 mb-2">એપ મેનુ</p>
                
                <SidebarLink to="/" icon="home" label="હોમ પેજ" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/devotional" icon="auto_stories" label="ભક્તિ સાહિત્ય" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/health" icon="favorite" label="સ્વાસ્થ્ય સહાયક" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/tools" icon="construction" label="સાધનો અને કેલ્ક્યુલેટર" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/community" icon="groups" label="બેઠક કોમ્યુનિટી" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/settings" icon="settings" label="સેટિંગ્સ" onClick={() => setIsSidebarOpen(false)} />
                
                <div className="h-px bg-orange-100/10 my-3" />
                <p className="font-gujarati text-[9px] text-stone-450 dark:text-stone-500 font-black uppercase tracking-widest pl-2 mb-2">રમતો અને ઇનામ</p>
                
                <SidebarLink to="/rewards" icon="card_giftcard" label="મારા ઇનામો (Rewards)" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/passport" icon="menu_book" label="ટ્રાવελ પાસપોર્ટ (GPS)" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/daily-challenge" icon="psychology" label="શબ્દ રમત (Daily)" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/gujarat-safari" icon="map" label="ગુજરાત સફારી" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/swipe-cards" icon="style" label="જ્ઞાન કાર્ડ્સ" onClick={() => setIsSidebarOpen(false)} />
                <SidebarLink to="/gujarat-quiz" icon="workspace_premium" label="જ્ઞાન ક્વિઝ" onClick={() => setIsSidebarOpen(false)} />
              </div>

            </div>
            
            <div className="pt-4 border-t border-orange-100/5 text-center text-[10px] text-stone-400 font-mono">
              Version 1.0.0 (Beta)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati text-xs font-bold transition-all ${
        isActive 
          ? 'bg-primary/10 text-primary dark:bg-dark-accent/15 dark:text-dark-accent' 
          : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900/40'
      }`}
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Layout;
