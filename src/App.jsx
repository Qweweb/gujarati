import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HealthAssistant from './components/HealthAssistant';
import DevotionalHub from './components/DevotionalHub';
import StatusGenerator from './components/StatusGenerator';
import BiodataMaker from './components/BiodataMaker';
import Community from './components/Community';
import Tools from './components/Tools';
import Profile from './components/Profile';
import DigitalCard from './components/DigitalCard';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import OfflineSettings from './components/OfflineSettings';
import Settings from './components/Settings';
import Panchang from './components/Panchang';
import KundaliGenerator from './components/KundaliGenerator';
import VastuCalculator from './components/VastuCalculator';
import NamkaranTool from './components/NamkaranTool';

import InterestCalculator from './components/InterestCalculator';
import DevotionalCards from './components/DevotionalCards';
import KuldeviGuide from './components/KuldeviGuide';
import GitaHub from './components/GitaHub';
import ShradhanjaliMaker from './components/ShradhanjaliMaker';
import AdminDashboard from './components/AdminDashboard';
import DailyChallenge from './components/DailyChallenge';
import GujaratSafari from './components/GujaratSafari';
import GujaratQuiz from './components/GujaratQuiz';
import SwipeCards from './components/SwipeCards';
import MysteryHub from './components/MysteryHub';
import TravelPassport from './components/TravelPassport';
import ScratchRewards from './components/ScratchRewards';
import './App.css';
import { App as CapApp } from '@capacitor/app';
import { supabase } from './supabaseClient';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sanskari_darkMode') === 'true';
  });



  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

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
    // 1. Initial check of active session
    supabase.auth.getSession().then(({ data: { session } }) => {
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

    return () => {
      subscription.unsubscribe();
      try {
        CapApp.removeAllListeners();
      } catch (e) {
        // Ignore in browser
      }
    };
  }, []);

  const toggleDarkMode = () => setDarkMode(prev => !prev);



  const handleLogin = () => {
    localStorage.setItem('sanskari_token', 'true');
    setIsLoggedIn(true);
  };

  // Show loading spinner while checking auth
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#F5EEDC] dark:bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-orange-600 text-6xl animate-spin">progress_activity</span>
          <p className="font-gujarati text-orange-600 font-bold">Loading...</p>
        </div>
      </div>
    );
  }



  const currentPath = window.location.pathname;
  const isPublicCardRoute = currentPath === '/c' || currentPath.startsWith('/c/') || (currentPath.startsWith('/card/') && currentPath !== '/card');

  if (!isLoggedIn && !isPublicCardRoute) {
     return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devotional" element={<DevotionalHub />} />
          <Route path="/health" element={<HealthAssistant />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/status" element={<StatusGenerator />} />
          <Route path="/biodata" element={<BiodataMaker />} />
          <Route path="/offline" element={<OfflineSettings />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/panchang" element={<Panchang />} />
          <Route path="/kundali" element={<KundaliGenerator />} />
          <Route path="/vastu" element={<VastuCalculator />} />
          <Route path="/namkaran" element={<NamkaranTool />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/card" element={<DigitalCard />} />
          <Route path="/card/:slug" element={<DigitalCard />} />

          <Route path="/interest-calculator" element={<InterestCalculator />} />
          <Route path="/devotional-cards" element={<DevotionalCards />} />
          <Route path="/kuldevi" element={<KuldeviGuide />} />
          <Route path="/gita" element={<GitaHub />} />
          <Route path="/shradhanjali" element={<ShradhanjaliMaker />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/gujarat-safari" element={<GujaratSafari />} />
          <Route path="/gujarat-quiz" element={<GujaratQuiz />} />
          <Route path="/swipe-cards" element={<SwipeCards />} />
          <Route path="/mysteries" element={<MysteryHub />} />
          <Route path="/passport" element={<TravelPassport />} />
          <Route path="/rewards" element={<ScratchRewards />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
