import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HealthAssistant from './components/HealthAssistant';
import DevotionalHub from './components/DevotionalHub';
import StatusGenerator from './components/StatusGenerator';
import PostMaker from './components/PostMaker';
import BiodataMaker from './components/BiodataMaker';
import Community from './components/Community';
import Tools from './components/Tools';
import Profile from './components/Profile';
import DigitalCard from './components/DigitalCard';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import OfflineSettings from './components/OfflineSettings';
import Settings from './components/Settings';
import VCardDashboard from './components/vcard/VCardDashboard';
import VCardEditor from './components/vcard/VCardEditor';
import VCardPublic from './components/vcard/VCardPublic';

import Panchang from './components/Panchang';
import KundaliGenerator from './components/KundaliGenerator';
import VastuCalculator from './components/VastuCalculator';
import NamkaranTool from './components/NamkaranTool';
import GunMilan from './components/GunMilan';

const PanotiRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/panchang#panoti', { replace: true });
  }, [navigate]);
  return null;
};

const CommunityRoute = () => {
  return <FeatureGuard featureKey="community"><Community /></FeatureGuard>;
};

import InterestCalculator from './components/InterestCalculator';
import DevotionalCards from './components/DevotionalCards';
import KuldeviGuide from './components/KuldeviGuide';
import GitaHub from './components/GitaHub';
import ShradhanjaliMaker from './components/ShradhanjaliMaker';
import AdminDashboard from './components/AdminDashboard';
import DailyChallenge from './components/DailyChallenge';
import GujaratSafari from './components/GujaratSafari';
import GujaratQuiz from './components/GujaratQuiz';
import MariSociety from './components/MariSociety';
import RamatoHub from './components/RamatoHub';
import EnglishZone from './components/EnglishZone';
import KbcQuizGame from './components/KbcQuizGame';
import KhamanJalebiCrusher from './components/KhamanJalebiCrusher';
import TrafficTod from './components/TrafficTod';
import FarasanSlicer from './components/FarasanSlicer';
import KiteCutter from './components/KiteCutter';
import TrafficJamHome from './components/TrafficJam/TrafficJamHome';
import ActionGamesMenu from './components/ActionGamesMenu';
import TirandajiHome from './components/Tirandaji/TirandajiHome';
import PrivacyPolicy from './components/PrivacyPolicy';
import SwipeCards from './components/SwipeCards';
import MysteryHub from './components/MysteryHub';
import TravelPassport from './components/TravelPassport';
import ScratchRewards from './components/ScratchRewards';
import LandingPage from './components/LandingPage';
import GujaratNewsMap from './components/GujaratNewsMap';
import './App.css';
import { App as CapApp } from '@capacitor/app';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { supabase } from './supabaseClient';
import { Capacitor } from '@capacitor/core';

// Route guard component to check feature flags
const FeatureGuard = ({ children, featureKey, fallbackPath = "/" }) => {
  const { featureFlags } = useTheme();
  const status = featureFlags[featureKey] || 'live';
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'off') {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "આ વિભાગ હાલ પૂરતો બંધ છે." } }));
      navigate(fallbackPath);
    }
  }, [status, navigate, fallbackPath]);

  if (status === 'off') {
    return null;
  }

  if (status === 'coming_soon') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-bounce mb-6">
           <span className="material-symbols-outlined text-white text-4xl">construction</span>
        </div>
        <h2 className="font-gujarati font-black text-2xl text-amber-800 dark:text-amber-500 mb-3">
          ટૂંક સમયમાં આવી રહ્યું છે!
        </h2>
        <p className="font-gujarati text-stone-600 dark:text-stone-300 text-sm max-w-xs mx-auto leading-relaxed mb-6">
          આ સેક્શન પર હજુ કામ ચાલુ છે. ખૂબ જ નજીકના સમયમાં આ સેવા શરૂ કરવામાં આવશે. કૃપા કરીને થોડી પ્રતીક્ષા કરો. 🙏
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-gujarati font-bold shadow-md transition-all cursor-pointer">
          મુખ્ય પેજ પર પાછા જાઓ
        </button>
      </div>
    );
  }

  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sanskari_darkMode') === 'true';
  });



  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState("");

  // Initialize Speech Synthesis Voices globally
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // For Windows/Chrome, calling getVoices() once triggers the background load
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Extremely robust theme applier
  useEffect(() => {
    const applyTheme = (isDark) => {
      const root = window.document.documentElement;
      const body = window.document.body;
      
      if (isDark) {
        root.classList.add('dark');
        body.classList.add('dark');
        root.style.backgroundColor = "#1a0a00";
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
        root.style.backgroundColor = "#fef8f1";
      }
    };

    applyTheme(darkMode);
    localStorage.setItem('sanskari_darkMode', darkMode);
  }, [darkMode]);

  // Supabase Auth and Deep Linking handler
  useEffect(() => {
    // 1. Initial check of active session with timeout for poor connections
    const authTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("ઇન્ટરનેટ કનેક્શન તપાસો.")), 8000)
    );

    Promise.race([supabase.auth.getSession(), authTimeout])
      .then(({ data: { session } }) => {
        if (session) {
          setIsLoggedIn(true);
          localStorage.setItem('sanskari_token', 'true');
          // Save Google user info to localStorage for Profile page
          if (session.user) {
            const meta = session.user.user_metadata || {};
            if (meta.full_name) localStorage.setItem('google_name', meta.full_name);
            if (meta.email || session.user.email) localStorage.setItem('google_email', meta.email || session.user.email);
            if (meta.avatar_url) localStorage.setItem('google_avatar', meta.avatar_url);
          }
        }
        setIsLoadingAuth(false);
      })
      .catch((err) => {
        console.error("Auth initialization error:", err);
        setAuthError(err.message || "ઇન્ટરનેટ કનેક્શન ધીમું છે અથવા બંધ છે.");
        setIsLoadingAuth(false);
      });

    // 2. Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth event:', _event, session?.user?.email);
      if (session) {
        setIsLoggedIn(true);
        localStorage.setItem('sanskari_token', 'true');
        // Save Google user info for Profile page
        if (session.user) {
          const meta = session.user.user_metadata || {};
          if (meta.full_name) localStorage.setItem('google_name', meta.full_name);
          if (meta.email || session.user.email) localStorage.setItem('google_email', meta.email || session.user.email);
          if (meta.avatar_url) localStorage.setItem('google_avatar', meta.avatar_url);
        }
        // If first time, redirect to profile to fill details
        if (_event === 'SIGNED_IN' && localStorage.getItem('profile_completed') !== 'true') {
          setTimeout(() => {
            window.location.hash = '#/profile';
          }, 500);
        }
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('sanskari_token');
      }
    });

    // 3. Capacitor App URL Deep Link Listener (for Android)
    const setupDeepLink = async () => {
      try {
        await CapApp.addListener('appUrlOpen', async (event) => {
          try {
            const urlStr = event.url;
            console.log("Deep link opened app:", urlStr);
            
            // Handle hash-based tokens: gujaratiapp://login#access_token=...&refresh_token=...
            if (urlStr.includes('#')) {
              const hash = urlStr.split('#')[1];
              const params = new URLSearchParams(hash);
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');
              
              if (accessToken && refreshToken) {
                console.log("Setting session from deep link tokens...");
                const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                if (error) {
                  console.error("setSession error:", error);
                  throw error;
                }
                console.log("Session set successfully via deep link!");
              }
            }
            
            // Handle query-param based code (PKCE fallback): gujaratiapp://login?code=...
            if (urlStr.includes('?code=') || urlStr.includes('&code=')) {
              console.log("PKCE code detected in deep link, exchanging...");
              // Supabase will detect this automatically if we give it the full URL
              // Just trigger a session refresh
              await supabase.auth.getSession();
            }
          } catch (err) {
            console.error("Deep link auth error:", err);
          }
        });
      } catch (e) {
        console.warn("CapApp.addListener not supported in browser environment:", e);
      }
    };

    setupDeepLink();

    // Hardware Back Button Listener handled in Layout.jsx

    return () => {
      subscription.unsubscribe();
      try {
        CapApp.removeAllListeners();
      } catch (e) {
        // Ignore in browser
      }
    };
  }, []);

  
    // Push Notifications Setup
    useEffect(() => {
      let isMounted = true;
      const setupPush = async () => {
        try {
          // Check if it's native platform (PushNotifications don't work on web easily without service workers setup)
          const isPushAvailable = !!PushNotifications.requestPermissions;
          if (!isPushAvailable) return;
          
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }
          if (permStatus.receive !== 'granted') {
            console.log('Push notification permission denied');
            return;
          }
          
          await PushNotifications.addListener('registration', (token) => {
            console.log('Push registration success, token: ' + token.value);
            // Subscribe to FCM topic for global push notifications
            FCM.subscribeTo({ topic: 'all_users' })
              .then(() => console.log('Subscribed to all_users topic successfully'))
              .catch((err) => console.error('FCM topic subscription failed:', err));
          });
          
          await PushNotifications.addListener('registrationError', (error) => {
            console.error('Push registration error: ', JSON.stringify(error));
          });
          
          await PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Push received: ', JSON.stringify(notification));
          });
          
          await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            console.log('Push action performed: ', JSON.stringify(action));
            const data = action.notification.data;
            if (data && data.url) {
              if (data.url.startsWith('http')) {
                window.open(data.url, '_system');
              } else {
                window.location.href = data.url;
              }
            }
          });

          await PushNotifications.register();
        } catch(e) {
          console.warn('Push setup failed (might be running in web):', e);
        }
      };
      
      setupPush();
      
      return () => {
        isMounted = false;
        try { PushNotifications.removeAllListeners(); } catch(e) {}
      }
    }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);



  const handleLogin = (phoneNum) => {
    localStorage.setItem('sanskari_token', 'true');
    if (phoneNum) {
      localStorage.setItem('user_phone', phoneNum);
      localStorage.setItem('supabase_user_mobile', phoneNum);
      // Also update the profile object if empty
      const existingProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      if (!existingProfile.mobile) {
        existingProfile.mobile = phoneNum;
        localStorage.setItem('user_profile', JSON.stringify(existingProfile));
      }
    }
    setIsLoggedIn(true);
  };

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F5EEDC] dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-14 w-14 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="font-gujarati text-orange-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Show network error if auth check fails/times out
  if (authError) {
    return (
      <div className="min-h-screen bg-[#F5EEDC] dark:bg-stone-900 flex items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-stone-800 rounded-3xl p-8 shadow-xl max-w-sm w-full border border-stone-100 dark:border-stone-700">
          <div className="w-20 h-20 mx-auto bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-red-500 text-4xl">wifi_off</span>
          </div>
          <h2 className="font-gujarati font-black text-2xl text-stone-800 dark:text-stone-100 mb-2">ઇન્ટરનેટ કનેક્શન નથી</h2>
          <p className="font-gujarati text-stone-600 dark:text-stone-400 mb-8">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-4 rounded-xl font-gujarati font-bold text-lg text-white bg-gradient-to-r from-orange-500 to-red-500 shadow-md hover:-translate-y-0.5 transition-all">
            ફરી પ્રયાસ કરો (Retry)
          </button>
        </div>
      </div>
    );
  }



  const currentPath = window.location.pathname;

  // Handle secret testing path for developers/admins to bypass browser landing page
  if (currentPath === '/gjapp' || currentPath.startsWith('/gjapp/')) {
    localStorage.setItem('sanskari_web_bypass', 'true');
    window.location.href = '/';
    return null;
  }

  const isPublicCardRoute = currentPath === '/c' || currentPath.startsWith('/c/') || (currentPath.startsWith('/card/') && currentPath !== '/card') || currentPath.startsWith('/vcard/');
  const isAdminRoute = currentPath.startsWith('/gujarati-admin');

  // Detect if accessing from a standard web browser (non-native platform)
  const isBrowser = !Capacitor.isNativePlatform();
  const hasBypass = localStorage.getItem('sanskari_web_bypass') === 'true';
  const isPrivacyRoute = currentPath.startsWith('/privacy-policy') || currentPath.startsWith('/privacypolicy');
  const isAllowedWebRoute = isAdminRoute || isPublicCardRoute || isPrivacyRoute || hasBypass;

  if (isBrowser && !isAllowedWebRoute) {
    return (
      <ThemeProvider>
        <LandingPage />
      </ThemeProvider>
    );
  }

  if (!isLoggedIn && !isPublicCardRoute && !isAdminRoute && !isPrivacyRoute) {
     return (
       <ThemeProvider>
         <Login onLogin={handleLogin} />
       </ThemeProvider>
     );
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Standalone Admin Route (No App Layout) */}
          <Route path="/gujarati-admin/*" element={<AdminDashboard />} />
          
          {/* Standalone Public vCard Route */}
          <Route path="/vcard/:slug" element={<VCardPublic />} />
          
          {/* Main App Routes (Wrapped in Layout) */}
          <Route path="*" element={
            <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devotional" element={<FeatureGuard featureKey="devotional"><DevotionalHub /></FeatureGuard>} />
                <Route path="/health" element={<FeatureGuard featureKey="health"><HealthAssistant /></FeatureGuard>} />
                <Route path="/community" element={<CommunityRoute />} />
                <Route path="/tools" element={<FeatureGuard featureKey="tools"><Tools /></FeatureGuard>} />
                <Route path="/status" element={<StatusGenerator />} />
                <Route path="/post-maker" element={<FeatureGuard featureKey="post_maker"><PostMaker /></FeatureGuard>} />
                <Route path="/biodata" element={<FeatureGuard featureKey="biodata"><BiodataMaker /></FeatureGuard>} />
                <Route path="/offline" element={<OfflineSettings />} />
                <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/panchang" element={<FeatureGuard featureKey="panchang"><Panchang /></FeatureGuard>} />
                <Route path="/kundali" element={<FeatureGuard featureKey="kundali"><KundaliGenerator /></FeatureGuard>} />
                <Route path="/gun-milan" element={<FeatureGuard featureKey="kundali"><KundaliGenerator defaultTab="milan" /></FeatureGuard>} />
                <Route path="/panoti-checker" element={<PanotiRedirect />} />
                <Route path="/vastu" element={<FeatureGuard featureKey="vastu"><VastuCalculator /></FeatureGuard>} />
                <Route path="/namkaran" element={<FeatureGuard featureKey="namkaran"><NamkaranTool /></FeatureGuard>} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/card" element={<FeatureGuard featureKey="card"><DigitalCard /></FeatureGuard>} />
                <Route path="/card/:slug" element={<FeatureGuard featureKey="card"><DigitalCard /></FeatureGuard>} />
                
                <Route path="/vcard-dashboard" element={<VCardDashboard />} />
                <Route path="/vcard-editor" element={<VCardEditor />} />

                <Route path="/interest-calculator" element={<FeatureGuard featureKey="interest_calculator"><InterestCalculator /></FeatureGuard>} />
                <Route path="/devotional-cards" element={<FeatureGuard featureKey="devotional_cards"><DevotionalCards /></FeatureGuard>} />
                <Route path="/kuldevi" element={<FeatureGuard featureKey="kuldevi"><KuldeviGuide /></FeatureGuard>} />
                <Route path="/gita" element={<FeatureGuard featureKey="gita"><GitaHub /></FeatureGuard>} />
                <Route path="/shradhanjali" element={<FeatureGuard featureKey="shradhanjali"><ShradhanjaliMaker /></FeatureGuard>} />
                <Route path="/daily-challenge" element={<FeatureGuard featureKey="daily_challenge"><DailyChallenge /></FeatureGuard>} />
                <Route path="/gujarat-safari" element={<FeatureGuard featureKey="gujarat_safari"><GujaratSafari /></FeatureGuard>} />
                <Route path="/gujarat-quiz" element={<FeatureGuard featureKey="gujarat_safari"><GujaratQuiz /></FeatureGuard>} />
                <Route path="/swipe-cards" element={<FeatureGuard featureKey="swipe_cards"><SwipeCards /></FeatureGuard>} />
                <Route path="/mysteries" element={<FeatureGuard featureKey="mysteries"><MysteryHub /></FeatureGuard>} />
                <Route path="/passport" element={<FeatureGuard featureKey="passport"><TravelPassport /></FeatureGuard>} />
                <Route path="/rewards" element={<FeatureGuard featureKey="rewards"><ScratchRewards /></FeatureGuard>} />
                
                <Route path="/society" element={<FeatureGuard featureKey="society"><MariSociety /></FeatureGuard>} />
                <Route path="/games" element={<FeatureGuard featureKey="games"><RamatoHub /></FeatureGuard>} />
                <Route path="/gujarati-games" element={<FeatureGuard featureKey="games"><RamatoHub defaultMode="gujarati" /></FeatureGuard>} />
                <Route path="/english" element={<FeatureGuard featureKey="english"><EnglishZone /></FeatureGuard>} />
                <Route path="/kbc-quiz" element={<FeatureGuard featureKey="games"><KbcQuizGame /></FeatureGuard>} />
                <Route path="/brick-breaker" element={<FeatureGuard featureKey="games"><KhamanJalebiCrusher /></FeatureGuard>} />
                <Route path="/traffic-tod" element={<FeatureGuard featureKey="games"><TrafficTod /></FeatureGuard>} />
                <Route path="/traffic-jam" element={<FeatureGuard featureKey="games"><TrafficJamHome /></FeatureGuard>} />
                <Route path="/farasan-slicer" element={<FeatureGuard featureKey="games"><FarasanSlicer /></FeatureGuard>} />
                <Route path="/kite-cutter" element={<FeatureGuard featureKey="games"><KiteCutter /></FeatureGuard>} />
                <Route path="/tirandaji" element={<FeatureGuard featureKey="games"><TirandajiHome /></FeatureGuard>} />
                <Route path="/action-games" element={<FeatureGuard featureKey="games"><ActionGamesMenu /></FeatureGuard>} />
                <Route path="/gujarati-news" element={<GujaratNewsMap />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
