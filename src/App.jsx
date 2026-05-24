import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HealthAssistant from './components/HealthAssistant';
import DevotionalHub from './components/DevotionalHub';
import StatusGenerator from './components/StatusGenerator';
import BiodataMaker from './components/BiodataMaker';
import Community from './components/Community';
import Tools from './components/Tools';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import OfflineSettings from './components/OfflineSettings';
import Settings from './components/Settings';
import Panchang from './components/Panchang';
import KundaliGenerator from './components/KundaliGenerator';
import VastuCalculator from './components/VastuCalculator';
import NamkaranTool from './components/NamkaranTool';
import KbcQuiz from './components/KbcQuiz';
import InterestCalculator from './components/InterestCalculator';
import DevotionalCards from './components/DevotionalCards';
import KuldeviGuide from './components/KuldeviGuide';
import AdminDashboard from './components/AdminDashboard';
import DailyChallenge from './components/DailyChallenge';
import GujaratSafari from './components/GujaratSafari';
import GujaratQuiz from './components/GujaratQuiz';
import SwipeCards from './components/SwipeCards';
import MysteryHub from './components/MysteryHub';
import TravelPassport from './components/TravelPassport';
import ScratchRewards from './components/ScratchRewards';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('sanskari_darkMode') === 'true';
  });

  const [hasAgreedConsent, setHasAgreedConsent] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Extremely robust theme applier Header
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

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleAgreeConsent = () => {
    localStorage.setItem('sanskari_consent', 'true');
    setHasAgreedConsent(true);
  };

  const handleLogin = () => {
    localStorage.setItem('sanskari_token', 'true');
    setIsLoggedIn(true);
  };

  if (!hasAgreedConsent) {
    return <Onboarding onAgree={handleAgreeConsent} />;
  }

  if (!isLoggedIn) {
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
          <Route path="/kbc-quiz" element={<KbcQuiz />} />
          <Route path="/interest-calculator" element={<InterestCalculator />} />
          <Route path="/devotional-cards" element={<DevotionalCards />} />
          <Route path="/kuldevi" element={<KuldeviGuide />} />
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
