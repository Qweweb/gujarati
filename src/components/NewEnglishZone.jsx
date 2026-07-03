import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { playSound } from '../utils/audio';
import { supabase } from '../supabaseClient';
import { syncLiveEnglishStats, getOrCreateUserId, syncLiveEnglishProgress, syncAndFetchEnglishProgress, findUnitOfLesson, getCurrentMonday, syncLiveLeagueXP, checkAndJoinWeeklyLeague, getDaysLeftInLeague } from '../utils/otlo_helper';
import LeaderboardUnified, { toGujaratiNum } from './LeaderboardUnified';
import {
  WORD_EMOJI_PAIRS,
  COMPLETE_SENTENCES,
  TRANSLATION_PAIRS,
  SCRAMBLE_WORDS,
  SPEED_WORDS,
  SENTENCE_BUILDER_DATA,
  DAILY_CONVERSATIONS
} from '../data/englishDatabase';

// Default fallback avatar for leaderboard
const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a8a29e"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z"/></svg>`;

// The 5 units forming the path mapping
const PATH_UNITS = [
  {
    id: 1,
    title: "Unit 1: Basic Greetings & Everyday Words",
    subtitle: "મૂળભૂત સંવાદો અને સામાન્ય નામ",
    color: "from-teal-600 to-emerald-500",
    shadow: "shadow-teal-500/20",
    lessons: [
      { id: "u1_l1", name: "Greetings & Basics", type: "mixed", categories: ["colors"], xpReward: 15, coinReward: 5, sessions: 1 },
      { id: "u1_l2", name: "Animals & Nature", type: "mixed", categories: ["animals"], xpReward: 15, coinReward: 5, sessions: 2 },
      { id: "u1_l3", name: "Fruits & Vegetables", type: "mixed", categories: ["fruits", "vegetables"], xpReward: 20, coinReward: 5, sessions: 2 }
    ]
  },
  {
    id: 2,
    title: "Unit 2: Simple Sentence Building",
    subtitle: "સરળ વાક્ય રચના અને સંભાષણ",
    color: "from-blue-600 to-indigo-500",
    shadow: "shadow-blue-500/20",
    lessons: [
      { id: "u2_l1", name: "Grammar Fill In Blanks", type: "complete", xpReward: 20, coinReward: 6, sessions: 2 },
      { id: "u2_l2", name: "Translating Basic Words", type: "translation", xpReward: 20, coinReward: 6, sessions: 2 },
      { id: "u2_l3", name: "Scrambled English Words", type: "scramble", xpReward: 25, coinReward: 6, sessions: 2 }
    ]
  },
  {
    id: 3,
    title: "Unit 3: Conversational English Dialogues",
    subtitle: "વાતચીત અને વ્યવહારિક અંગ્રેજી",
    color: "from-purple-600 to-pink-500",
    shadow: "shadow-purple-500/20",
    lessons: [
      { id: "u3_l1", name: "Everyday Dialogues", type: "conversation", xpReward: 25, coinReward: 8, sessions: 3 },
      { id: "u3_l2", name: "Sentence Builder Master", type: "builder", xpReward: 30, coinReward: 8, sessions: 3 }
    ]
  },
  {
    id: 4,
    title: "Unit 4: Pronunciation & Speech Practice",
    subtitle: "સાચો ઉચ્ચાર અને મૌખિક અભ્યાસ",
    color: "from-amber-600 to-orange-500",
    shadow: "shadow-amber-500/20",
    lessons: [
      { id: "u4_l1", name: "Pronounce Everyday Words", type: "speaking", xpReward: 30, coinReward: 10, sessions: 3 },
      { id: "u4_l2", name: "Speak Full Sentences", type: "speaking_sentences", xpReward: 35, coinReward: 10, sessions: 3 }
    ]
  },
  {
    id: 5,
    title: "Unit 5: Grammar Master & Speed Check",
    subtitle: "વ્યાકરણ અને સ્પીડ પરીક્ષણ",
    color: "from-rose-600 to-red-500",
    shadow: "shadow-rose-500/20",
    lessons: [
      { id: "u5_l1", name: "Speed Word Vocabulary", type: "speed", xpReward: 30, coinReward: 10, sessions: 3 },
      { id: "u5_l2", name: "Ultimate Translation Master", type: "mixed_hard", xpReward: 50, coinReward: 15, sessions: 3 }
    ]
  },
  {
    id: 6,
    title: "Unit 6: Office & Work Conversations",
    subtitle: "ઓફિસ મીટિંગ્સ અને વ્યવસાયિક અંગ્રેજી",
    color: "from-cyan-600 to-blue-500",
    shadow: "shadow-cyan-500/20",
    lessons: [
      { id: "u6_l1", name: "Professional Dialogues", type: "conversation", xpReward: 35, coinReward: 10, sessions: 3 },
      { id: "u6_l2", name: "Grammar in Office Context", type: "complete", xpReward: 35, coinReward: 10, sessions: 3 },
      { id: "u6_l3", name: "Business Translation Master", type: "mixed_hard", xpReward: 40, coinReward: 12, sessions: 3 }
    ]
  },
  {
    id: 7,
    title: "Unit 7: Travel, Airport & Hotel Booking",
    subtitle: "મુસાફરી, ટિકિટ અને હોટેલ દરમિયાન વાતચીત",
    color: "from-emerald-600 to-teal-500",
    shadow: "shadow-emerald-500/20",
    lessons: [
      { id: "u7_l1", name: "At the Airport & Booking", type: "conversation", xpReward: 40, coinReward: 12, sessions: 3 },
      { id: "u7_l2", name: "Asking for Directions", type: "builder", xpReward: 40, coinReward: 12, sessions: 3 },
      { id: "u7_l3", name: "Travel Word Scramble", type: "scramble", xpReward: 40, coinReward: 12, sessions: 3 }
    ]
  },
  {
    id: 8,
    title: "Unit 8: Shopping & Restaurant English",
    subtitle: "ખરીદી, ભાવતાલ અને હોટેલમાં વાતચીત",
    color: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/20",
    lessons: [
      { id: "u8_l1", name: "Ordering Food & Cafe", type: "conversation", xpReward: 40, coinReward: 12, sessions: 3 },
      { id: "u8_l2", name: "At the Shopping Mall", type: "translation", xpReward: 45, coinReward: 12, sessions: 3 },
      { id: "u8_l3", name: "Speak Out Loud: At Dinners", type: "speaking_sentences", xpReward: 45, coinReward: 12, sessions: 3 }
    ]
  },
  {
    id: 9,
    title: "Unit 9: Advanced Grammar & Tenses Master",
    subtitle: "જટિલ વ્યાકરણ, કાળ અને એરર ચેકિંગ",
    color: "from-fuchsia-600 to-pink-500",
    shadow: "shadow-fuchsia-500/20",
    lessons: [
      { id: "u9_l1", name: "Complex Blank Fillers", type: "complete", xpReward: 45, coinReward: 15, sessions: 3 },
      { id: "u9_l2", name: "Tense Master Translation", type: "mixed_hard", xpReward: 50, coinReward: 15, sessions: 3 }
    ]
  },
  {
    id: 10,
    title: "Unit 10: Idioms, Phrases & Native Dialogues",
    subtitle: "રૂઢિપ્રયોગો, કહેવતો અને નેટિવ સંભાષણ",
    color: "from-violet-600 to-purple-500",
    shadow: "shadow-violet-500/20",
    lessons: [
      { id: "u10_l1", name: "Common Idioms & Phrases", type: "translation", xpReward: 50, coinReward: 15, sessions: 3 },
      { id: "u10_l2", name: "Speak Like a Native", type: "speaking_sentences", xpReward: 60, coinReward: 20, sessions: 3 },
      { id: "u10_l3", name: "Ultimate Speed Quiz", type: "speed", xpReward: 60, coinReward: 20, sessions: 3 }
    ]
  }
];

// Helper functions for persistent state
const getCoins = () => parseInt(localStorage.getItem('sanskar_coins') || '100', 10);
const addCoins = (amount) => {
  const cur = getCoins() + amount;
  localStorage.setItem('sanskar_coins', cur.toString());
  window.dispatchEvent(new Event('coins-updated'));
  return cur;
};

const getXP = () => parseInt(localStorage.getItem('sanskar_english_xp') || '0', 10);
const addXP = (amount) => {
  const cur = getXP() + amount;
  localStorage.setItem('sanskar_english_xp', cur.toString());
  window.dispatchEvent(new CustomEvent('xp-updated', { detail: { xp: cur } }));
  return cur;
};

const getActiveEnglishStreak = () => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastPlay = localStorage.getItem('sanskar_english_last_play') || '';
  const savedStreak = parseInt(localStorage.getItem('sanskar_english_streak') || '0', 10);

  if (lastPlay === today || lastPlay === yesterday) {
    return savedStreak;
  }
  return 0; // broken
};

const updateEnglishStreak = () => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastPlay = localStorage.getItem('sanskar_english_last_play') || '';
  let currentStreak = parseInt(localStorage.getItem('sanskar_english_streak') || '0', 10);

  if (lastPlay === today) {
    return currentStreak;
  }

  if (lastPlay === yesterday) {
    currentStreak += 1;
  } else {
    // Check if user has streak freeze
    const freezes = parseInt(localStorage.getItem('sanskar_streak_freezes') || '0', 10);
    if (freezes > 0) {
      localStorage.setItem('sanskar_streak_freezes', (freezes - 1).toString());
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "❄️ સ્ટ્રીક ફ્રીઝનો ઉપયોગ થયો! તમારી સ્ટ્રીક બચી ગઈ." } }));
      // Keep existing streak, just update last play to today
    } else {
      currentStreak = 1;
    }
  }

  localStorage.setItem('sanskar_english_streak', currentStreak.toString());
  localStorage.setItem('sanskar_english_last_play', today);

  let dates = [];
  try {
    dates = JSON.parse(localStorage.getItem('sanskar_english_played_dates') || '[]');
  } catch (e) {
    dates = [];
  }
  if (!dates.includes(today)) {
    dates.push(today);
    localStorage.setItem('sanskar_english_played_dates', JSON.stringify(dates));
  }

  window.dispatchEvent(new CustomEvent('english-streak-updated', { detail: { streak: currentStreak } }));
  return currentStreak;
};

// Level definitions
const getLevelInfo = (xp, streak = 0) => {
  if (xp < 500 || streak < 3) return { level: 1, name: 'Beginner', title: 'Beginner (નવોદિત) 👶', maxXP: 500, prevXP: 0, badge: '👶', reqStreak: 3 };
  if (xp < 1500 || streak < 5) return { level: 2, name: 'Elementary', title: 'Elementary (પ્રાથમિક) 👦', maxXP: 1500, prevXP: 500, badge: '👦', reqStreak: 5 };
  if (xp < 4000 || streak < 7) return { level: 3, name: 'Intermediate', title: 'Intermediate (મધ્યમ) 🧑', maxXP: 4000, prevXP: 1500, badge: '🧑', reqStreak: 7 };
  if (xp < 9000 || streak < 10) return { level: 4, name: 'Upper-Intermediate', title: 'Upper-Intermediate (ઉચ્ચ-મધ્યમ) 👨', maxXP: 9000, prevXP: 4000, badge: '👨', reqStreak: 10 };
  if (xp < 18000 || streak < 15) return { level: 5, name: 'Advanced', title: 'Advanced (ઉચ્ચ) 🎓', maxXP: 18000, prevXP: 9000, badge: '🎓', reqStreak: 15 };
  return { level: 6, name: 'Expert', title: 'Expert (તજજ્ઞ) 👑', maxXP: 100000, prevXP: 18000, badge: '👑', reqStreak: 15 };
};

/* ========================================================
   GAJU BHAI - LION MASCOT (SVG) Component
   ======================================================== */
function GajuMascot({ state = "idle", outfit = "turban", size = 100 }) {
  // SVG drawings
  const getOutfitElement = () => {
    switch (outfit) {
      case "turban": // traditional Gujarati saffron turban
        return (
          <g id="turban" transform="translate(0, 5)">
            <path d="M 28 15 C 22 -3, 78 -3, 72 15 C 78 8, 68 -2, 50 8 C 32 -2, 22 8, 28 15 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
            <path d="M 36 10 C 45 1, 55 1, 64 10" stroke="#FDBA74" strokeWidth="2" fill="none" />
            <circle cx="50" cy="5" r="3.5" fill="#EF4444" />
            <path d="M 50 1 L 50 -5" stroke="#FEF08A" strokeWidth="1.2" />
          </g>
        );
      case "glasses": // scholar glasses
        return (
          <g id="glasses" transform="translate(0, 8)">
            <circle cx="38" cy="22" r="9" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <circle cx="62" cy="22" r="9" fill="none" stroke="#D97706" strokeWidth="2.5" />
            <line x1="47" y1="22" x2="53" y2="22" stroke="#D97706" strokeWidth="3" />
            <line x1="29" y1="20" x2="23" y2="22" stroke="#D97706" strokeWidth="2" />
            <line x1="71" y1="20" x2="77" y2="22" stroke="#D97706" strokeWidth="2" />
          </g>
        );
      case "crown": // royal golden crown
        return (
          <g id="crown" transform="translate(0, -3)">
            <path d="M 32 20 L 26 3 L 41 12 L 50 0 L 59 12 L 74 3 L 68 20 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="26" cy="3" r="2.5" fill="#EF4444" />
            <circle cx="50" cy="0" r="2.5" fill="#3B82F6" />
            <circle cx="74" cy="3" r="2.5" fill="#EF4444" />
            <circle cx="50" cy="13" r="3" fill="#10B981" />
          </g>
        );
      case "sherlock": // detective hat
        return (
          <g id="sherlock" transform="translate(0, 2)">
            <path d="M 26 20 C 26 5, 74 5, 74 20 C 79 20, 79 23, 74 23 L 26 23 C 21 23, 21 20, 26 20 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
            <path d="M 33 18 C 33 2, 67 2, 67 18 Z" fill="#92400E" />
            <path d="M 33 12 L 67 12" stroke="#F59E0B" strokeWidth="2" />
          </g>
        );
      default:
        return null;
    }
  };

  // Eyes according to state
  const getEyes = () => {
    switch (state) {
      case "correct":
        return (
          <g id="eyes-happy">
            <path d="M 32 30 Q 38 23 44 30" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 56 30 Q 62 25 68 30" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case "wrong":
        return (
          <g id="eyes-sad">
            <path d="M 34 27 L 42 35 M 42 27 L 34 35" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            <path d="M 58 27 L 66 35 M 66 27 L 58 35" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case "thinking":
        return (
          <g id="eyes-thinking">
            <ellipse cx="38" cy="30" rx="5" ry="6.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="38" cy="28.5" r="2" fill="#1E293B" />
            <ellipse cx="62" cy="30" rx="5" ry="4.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="61.5" cy="29.5" r="1.5" fill="#1E293B" />
            <path d="M 31 20 Q 38 16 45 22" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M 55 22 Q 62 16 69 20" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      case "idle":
      default:
        return (
          <g id="eyes-idle">
            <ellipse cx="38" cy="30" rx="5.5" ry="7.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="38" cy="30" r="3" fill="#1E293B" />
            <circle cx="40" cy="28" r="1" fill="#FFFFFF" />
            <ellipse cx="62" cy="30" rx="5.5" ry="7.5" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <circle cx="62" cy="30" r="3" fill="#1E293B" />
            <circle cx="64" cy="28" r="1" fill="#FFFFFF" />
            <path d="M 32 20 C 36 18, 41 18, 45 21" fill="none" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 55 21 C 59 18, 64 18, 68 20" fill="none" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );
    }
  };

  const getMuzzleAndNose = () => {
    return (
      <g id="muzzle">
        {/* Whiskers pads */}
        <path d="M 40 40 L 60 40 C 64 40, 64 49, 58 51 C 54 52, 46 52, 42 51 C 36 49, 36 40, 40 40 Z" fill="#FFF3C7" stroke="#D97706" strokeWidth="1" />
        
        {/* Little whisker dots */}
        <circle cx="44" cy="45" r="0.6" fill="#1E293B" />
        <circle cx="46" cy="47" r="0.6" fill="#1E293B" />
        <circle cx="54" cy="47" r="0.6" fill="#1E293B" />
        <circle cx="56" cy="45" r="0.6" fill="#1E293B" />

        {/* Nose */}
        <polygon points="50,38 45,33 55,33" fill="#1E293B" />
        <line x1="50" y1="36" x2="50" y2="43" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Whisker lines */}
        <line x1="38" y1="44" x2="28" y2="42" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
        <line x1="38" y1="47" x2="26" y2="47" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
        <line x1="62" y1="44" x2="72" y2="42" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
        <line x1="62" y1="47" x2="74" y2="47" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
        
        {/* Open mouth / Tongue */}
        <path d="M 46 45 Q 50 52 54 45 Z" fill="#7F1D1D" stroke="#D97706" strokeWidth="0.8" />
        <path d="M 48 48 Q 50 51 52 48 Z" fill="#EF4444" />
      </g>
    );
  };

  const getMane = () => {
    return (
      <path 
        d="M 50 2 L 58 14 L 68 6 L 68 20 L 78 17 L 74 30 L 84 32 L 76 43 L 84 48 L 74 55 L 78 68 L 67 63 L 67 76 L 58 68 L 50 78 L 42 68 L 33 76 L 33 63 L 22 68 L 26 55 L 16 48 L 24 43 L 16 32 L 26 30 L 22 17 L 32 20 L 32 6 L 42 14 Z" 
        fill="#8B4513" 
        stroke="#5C2D0C" 
        strokeWidth="2.5" 
      />
    );
  };

  const getCheeks = () => {
    if (state === "correct") {
      return (
        <g id="blushing">
          <ellipse cx="30" cy="37" rx="3.5" ry="1.8" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="70" cy="37" rx="3.5" ry="1.8" fill="#FDA4AF" opacity="0.85" />
        </g>
      );
    }
    return null;
  };

  const getBodyAndPaws = () => {
    return (
      <g id="body">
        {/* Tail */}
        <path d="M 35 75 C 20 75, 12 70, 15 55 C 16 48, 10 44, 8 42" fill="none" stroke="#F59E0B" strokeWidth="5.5" strokeLinecap="round" />
        {/* Tail Tuft */}
        <path d="M 8 42 C 4 39, 6 32, 2 30 C 9 32, 12 38, 8 42 Z" fill="#8B4513" stroke="#5C2D0C" strokeWidth="1.2" />

        {/* Back Legs (sitting) */}
        <path d="M 28 85 C 20 85, 20 70, 28 70 C 35 70, 36 85, 28 85 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <path d="M 72 85 C 65 85, 64 70, 72 70 C 80 70, 80 85, 72 85 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        
        {/* Hind Paws */}
        <ellipse cx="24" cy="85" rx="8" ry="5.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="76" cy="85" rx="8" ry="5.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />

        {/* Main Torso */}
        <path d="M 36 50 L 36 80 Q 36 86, 42 86 L 58 86 Q 64 86, 64 80 L 64 50 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        {/* Light colored belly */}
        <path d="M 40 50 C 40 70, 60 70, 60 50 Z" fill="#FFF3C7" />

        {/* Front Legs */}
        <rect x="39" y="70" width="9" height="17" rx="4.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        <rect x="52" y="70" width="9" height="17" rx="4.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
        
        {/* Paw toe lines */}
        <line x1="43.5" y1="80" x2="43.5" y2="87" stroke="#D97706" strokeWidth="1.5" />
        <line x1="56.5" y1="80" x2="56.5" y2="87" stroke="#D97706" strokeWidth="1.5" />
      </g>
    );
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md select-none transition-all duration-300">
      {/* Shadow */}
      <ellipse cx="50" cy="94" rx="30" ry="5" fill="#E2E8F0" className="dark:hidden" />
      <ellipse cx="50" cy="94" rx="30" ry="5" fill="#1E293B" className="hidden dark:block" />

      {/* Mane (behind head/body) */}
      {getMane()}

      {/* Body & legs */}
      {getBodyAndPaws()}

      {/* Ears */}
      <circle cx="32" cy="22" r="9" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      <circle cx="32" cy="22" r="5.5" fill="#FEE2E2" />
      
      <circle cx="68" cy="22" r="9" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      <circle cx="68" cy="22" r="5.5" fill="#FEE2E2" />

      {/* Head Circle */}
      <circle cx="50" cy="40" r="22" fill="#F59E0B" stroke="#D97706" strokeWidth="2.2" />

      {/* Face details */}
      {getCheeks()}
      {getEyes()}
      {getMuzzleAndNose()}

      {/* Equipped Turban/Hat/Crown */}
      {getOutfitElement()}
    </svg>
  );
}

export default function NewEnglishZone({ onBack }) {
  const navigate = useNavigate();

  // General App Statistics Persistent States
  const [xp, setXp] = useState(getXP());
  const [coins, setCoins] = useState(getCoins());
  const [streak, setStreak] = useState(getActiveEnglishStreak());
  const [playedDates, setPlayedDates] = useState([]);
  const [liveLeaderboard, setLiveLeaderboard] = useState([]);
  
  // Navigation Tabs: "path" (learning tree), "leaderboard", "quests", "shop"
  const [activeTab, setActiveTab] = useState("path");

  // League States
  const [leagueData, setLeagueData] = useState(null);
  const [loadingLeague, setLoadingLeague] = useState(false);

  // Lesson Execution States
  const [activeLesson, setActiveLesson] = useState(null); // stores active lesson object if playing
  const [lessonQuestions, setLessonQuestions] = useState([]); // 10 questions of current lesson
  const [currentQIndex, setCurrentQIndex] = useState(0); // 0 to 9
  const [hearts, setHearts] = useState(5); // 5 hearts
  const [selectedOptions, setSelectedOptions] = useState([]); // current answers picked
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); // has user tapped "Check"
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // is current answer correct
  const [mascotState, setMascotState] = useState("idle"); // idle, correct, wrong, thinking
  const [lessonXPAccumulated, setLessonXPAccumulated] = useState(0);
  const [doubleXPActive, setDoubleXPActive] = useState(false);
  const [doubleXPUntil, setDoubleXPUntil] = useState(0);
  const [doubleXPMinsLeft, setDoubleXPMinsLeft] = useState(0);

  // Shop States
  const [streakFreezes, setStreakFreezes] = useState(() => parseInt(localStorage.getItem('sanskar_streak_freezes') || '0', 10));
  const [purchasedOutfits, setPurchasedOutfits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanskar_purchased_outfits') || '["turban"]');
    } catch (e) {
      return ["turban"];
    }
  });
  const [equippedOutfit, setEquippedOutfit] = useState(() => localStorage.getItem('sanskar_equipped_outfit') || 'turban');

  // Progression States
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanskar_english_completed_lessons') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [lessonProgress, setLessonProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanskar_english_lesson_progress') || '{}');
    } catch (e) {
      return {};
    }
  });

  // Modal / Feedback Popup States
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showOutofHearts, setShowOutofHearts] = useState(false);
  const [showLessonSummary, setShowLessonSummary] = useState(false);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  
  // Custom Matching Game Session states (inside lesson)
  const [matchingPairs, setMatchingPairs] = useState([]); // {id, text, pairId, type: 'en'|'gu'}
  const [selectedPairIds, setSelectedPairIds] = useState([]); // index/ids of selected cards
  const [matchedPairIds, setMatchedPairIds] = useState([]); // indices already matched

  // Speech Practice states
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const recognitionRef = useRef(null);

  // Auto-updating streak / sync
  useEffect(() => {
    syncLiveEnglishStats(streak, xp);
  }, [streak, xp]);

  // Sync and fetch progress from Supabase on mount (one-time migration / conflict resolution / offline sync)
  useEffect(() => {
    const initSync = async () => {
      const merged = await syncAndFetchEnglishProgress();
      if (merged) {
        setCompletedLessons(merged.completedLessons);
        setLessonProgress(merged.lessonProgress);
      }
    };
    initSync();
  }, []);

  // Load and check weekly league when tab changes to "league"
  useEffect(() => {
    if (activeTab === "league") {
      const loadLeague = async () => {
        setLoadingLeague(true);
        const data = await checkAndJoinWeeklyLeague();
        if (data) {
          setLeagueData(data);
        }
        setLoadingLeague(false);
      };
      loadLeague();
    }
  }, [activeTab]);

  // Sync double XP timer
  useEffect(() => {
    const doubleXPEnd = parseInt(localStorage.getItem('sanskar_double_xp_until') || '0', 10);
    if (doubleXPEnd > Date.now()) {
      setDoubleXPActive(true);
      setDoubleXPUntil(doubleXPEnd);
    }

    const interval = setInterval(() => {
      const curEnd = parseInt(localStorage.getItem('sanskar_double_xp_until') || '0', 10);
      if (curEnd > Date.now()) {
        setDoubleXPActive(true);
        setDoubleXPMinsLeft(Math.ceil((curEnd - Date.now()) / 60000));
      } else {
        setDoubleXPActive(false);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync state values globally
  useEffect(() => {
    const handleXP = () => setXp(getXP());
    const handleCoins = () => setCoins(getCoins());
    const handleStreak = () => setStreak(getActiveEnglishStreak());
    window.addEventListener('xp-updated', handleXP);
    window.addEventListener('coins-updated', handleCoins);
    window.addEventListener('english-streak-updated', handleStreak);
    return () => {
      window.removeEventListener('xp-updated', handleXP);
      window.removeEventListener('coins-updated', handleCoins);
      window.removeEventListener('english-streak-updated', handleStreak);
    };
  }, []);

  // Load calendar dates
  useEffect(() => {
    let dates = [];
    try {
      dates = JSON.parse(localStorage.getItem('sanskar_english_played_dates') || '[]');
    } catch (e) {
      dates = [];
    }
    setPlayedDates(dates);
  }, [streak]);

  // Query live leaderboard
  useEffect(() => {
    const fetchLiveLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, photo_url, english_xp, english_streak, city')
          .order('english_xp', { ascending: false })
          .limit(100);

        if (error) {
          console.error("Leaderboard query error:", error);
          return;
        }

        if (data && data.length > 0) {
          const uid = getOrCreateUserId();
          const unique = [];
          const seen = new Set();

          const userItem = data.find(x => String(x.id) === String(uid));
          if (userItem) {
            seen.add(userItem.name || "અજ્ઞાત સાધક");
            unique.push(userItem);
          }

          for (const item of data) {
            const name = item.name || "અજ્ઞાત સાધક";
            if (!seen.has(name)) {
              seen.add(name);
              unique.push(item);
            }
          }

          unique.sort((a, b) => (b.english_xp || 0) - (a.english_xp || 0));
          const top10 = unique.slice(0, 10);

          const mapped = top10.map((item, idx) => {
            const hasRealPhoto = item.photo_url && !item.photo_url.includes('pravatar.cc');
            const isUser = String(item.id) === String(uid);
            return {
              name: item.name || "અજ્ઞાત સાધક",
              streak: item.english_streak || 1,
              coins: Math.round((item.english_xp || 0) * 0.1) || 100,
              score: item.english_xp || 0,
              avatar: hasRealPhoto ? item.photo_url : defaultAvatar,
              isUser,
              city: isUser ? (item.city || JSON.parse(localStorage.getItem('user_profile') || '{}').city) : item.city
            };
          });
          setLiveLeaderboard(mapped);
        }
      } catch (e) {
        console.warn("Failed to fetch live leaderboard:", e);
      }
    };
    fetchLiveLeaderboard();
  }, [streak, xp]);

  // Web Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setSpokenText("");
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSpokenText(text);
        // Automatically check spoken text
        const q = lessonQuestions[currentQIndex];
        const cleanSpoken = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
        const cleanTarget = q.target.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

        if (cleanSpoken === cleanTarget) {
          playSound('correct');
          setIsAnswerCorrect(true);
          setMascotState("correct");
          let earned = 10;
          if (doubleXPActive) earned *= 2;
          setLessonXPAccumulated(p => p + earned);
        } else {
          playSound('wrong');
          setIsAnswerCorrect(false);
          setMascotState("wrong");
          setHearts(h => {
            const nextH = h - 1;
            if (nextH <= 0) setShowOutofHearts(true);
            return nextH;
          });
        }
        setIsAnswerChecked(true);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error:", e);
        setIsRecording(false);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "🎙️ માઇક્રોફોન મંજૂરી નથી અથવા અવાજ સાફ નથી." } }));
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [lessonQuestions, currentQIndex, doubleXPActive]);

  // Audio Text to Speech helper
  const speakEnglishText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      
      // Try to find a nice English voice
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
      if (enVoice) utterance.voice = enVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  /* ========================================================
     QUESTION GENERATOR (Generates 8-10 items of unified format)
     ======================================================== */
  const startLesson = (lesson) => {
    playSound('click');
    setHearts(5);
    setCurrentQIndex(0);
    setLessonXPAccumulated(0);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(false);
    setSelectedOptions([]);
    setMascotState("idle");
    setMatchingPairs([]);
    setSelectedPairIds([]);
    setMatchedPairIds([]);
    setSpokenText("");

    // Generate questions based on lesson type
    let questions = [];
    const count = 7; // questions per lesson for swift gameplay

    if (lesson.type === "mixed") {
      // Pull words from WORD_EMOJI_PAIRS based on categories
      const filtered = WORD_EMOJI_PAIRS.filter(p => lesson.categories.includes(p.category));
      const shufWords = [...filtered].sort(() => Math.random() - 0.5).slice(0, count);
      
      shufWords.forEach((wordObj, index) => {
        if (index % 3 === 0 && filtered.length >= 4) {
          // Type 1: Pair matching game inside lesson
          // We embed the pair matching as a subquestion
          const batch = shufWords.slice(index, index + 4);
          questions.push({
            type: "pair_match",
            prompt: "જોડકાં જોડો (Match the pairs)",
            target: "complete",
            data: batch.map(b => ({ english: b.english, gujarati: b.gujarati, emoji: b.emoji })),
            explanation: "સાચી જોડ બનાવવા માટે ઇંગ્લિશ અને ગુજરાતી શબ્દો પર વારાફરતી ક્લિક કરો."
          });
        } else {
          // Type 2: Simple translation MCQ
          const wrongAnswers = WORD_EMOJI_PAIRS.filter(w => w.english !== wordObj.english)
            .map(w => w.gujarati)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          const options = [wordObj.gujarati, ...wrongAnswers].sort(() => Math.random() - 0.5);

          questions.push({
            type: "mcq",
            prompt: `Translate "${wordObj.english}" ${wordObj.emoji}`,
            target: wordObj.gujarati,
            options,
            explanation: `"${wordObj.english}" નો ગુજરાતી અર્થ "${wordObj.gujarati}" થાય છે.`
          });
        }
      });
    } else if (lesson.type === "complete") {
      const shuf = [...COMPLETE_SENTENCES].sort(() => Math.random() - 0.5).slice(0, count);
      questions = shuf.map(item => ({
        type: "mcq",
        prompt: `${item.sentence} (Hint: ${item.gujaratiHint})`,
        target: item.blankWord,
        options: item.options,
        explanation: item.explanation
      }));
    } else if (lesson.type === "translation") {
      const shuf = [...TRANSLATION_PAIRS].sort(() => Math.random() - 0.5).slice(0, count);
      questions = shuf.map(item => {
        const isGuToEn = item.direction === 'gu-en';
        const target = isGuToEn ? item.english : item.gujarati;
        return {
          type: "mcq",
          prompt: isGuToEn ? `Translate "${item.gujarati}"` : `Translate "${item.english}"`,
          target,
          options: item.options,
          explanation: `સાચું ભાષાંતર: ${target}`
        };
      });
    } else if (lesson.type === "scramble") {
      const shuf = [...SCRAMBLE_WORDS].sort(() => Math.random() - 0.5).slice(0, count);
      questions = shuf.map(item => ({
        type: "scramble",
        prompt: `Arrange letters for: "${item.gujarati}" ${item.emoji}`,
        target: item.word,
        data: item.word.split(''),
        explanation: `સાચો શબ્દ: ${item.word}`
      }));
    } else if (lesson.type === "conversation") {
      const shuf = [...DAILY_CONVERSATIONS].sort(() => Math.random() - 0.5).slice(0, 2);
      // We will flatten dialogues of 2 conversations
      shuf.forEach(conv => {
        conv.dialogues.slice(0, 3).forEach(dial => {
          questions.push({
            type: "mcq",
            prompt: `[${conv.situation}] ${dial.speaker}: ${dial.prompt} (Hint: ${dial.gujaratiHint})`,
            target: dial.blankWord,
            options: dial.options,
            explanation: dial.explanation
          });
        });
      });
    } else if (lesson.type === "builder") {
      const shuf = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, count - 2);
      questions = shuf.map(item => ({
        type: "builder",
        prompt: `Translate: "${item.gujaratiMeaning}"`,
        target: item.correct,
        data: item.jumbled,
        explanation: item.grammarTip
      }));
    } else if (lesson.type === "speaking") {
      const shuf = [...WORD_EMOJI_PAIRS].sort(() => Math.random() - 0.5).slice(0, count);
      questions = shuf.map(item => ({
        type: "speaking",
        prompt: `બોલો (Speak out loud): "${item.english}"`,
        target: item.english,
        explanation: `ઉચ્ચાર: "${item.english}" (${item.gujarati})`,
        audioText: item.english
      }));
    } else if (lesson.type === "speaking_sentences") {
      const shuf = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, count - 2);
      questions = shuf.map(item => ({
        type: "speaking",
        prompt: `મોટેથી વાંચો (Speak this sentence):`,
        target: item.correct,
        explanation: `અર્થ: "${item.gujaratiMeaning}"`,
        audioText: item.correct
      }));
    } else if (lesson.type === "listening") {
      const shuf = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, count - 2);
      questions = shuf.map(item => ({
        type: "listening",
        prompt: "સાંભળો અને લખો (Listen and assemble):",
        target: item.correct,
        data: item.jumbled,
        audioText: item.correct,
        explanation: `વાક્ય: "${item.correct}"`
      }));
    } else if (lesson.type === "speed") {
      const shuf = [...SPEED_WORDS].sort(() => Math.random() - 0.5).slice(0, count);
      questions = shuf.map(item => ({
        type: "mcq",
        prompt: `Speed translation: "${item.word}"`,
        target: item.meaning,
        options: item.options,
        explanation: `"${item.word}" એટલે "${item.meaning}"`
      }));
    } else { // mixed_hard / fallback
      const shuf = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, count - 3);
      questions = shuf.map(item => ({
        type: "builder",
        prompt: `Translate (અનુવાદ કરો): "${item.gujaratiMeaning}"`,
        target: item.correct,
        data: item.jumbled,
        explanation: item.grammarTip
      }));
    }

    setLessonQuestions(questions.slice(0, count));
    setActiveLesson(lesson);
    setShowLessonSummary(false);

    // If first question requires TTS, autoplay sound
    if (questions[0] && (questions[0].type === "listening" || questions[0].type === "speaking")) {
      setTimeout(() => speakEnglishText(questions[0].audioText), 1000);
    }
  };

  // Generate pair matching states when question loads
  useEffect(() => {
    if (activeLesson && lessonQuestions[currentQIndex]) {
      const q = lessonQuestions[currentQIndex];
      if (q.type === "pair_match") {
        const guDeck = q.data.map((item, idx) => ({ id: `gu-${idx}`, text: item.gujarati, pairId: idx, type: 'gu' }));
        const enDeck = q.data.map((item, idx) => ({ id: `en-${idx}`, text: `${item.english} ${item.emoji}`, pairId: idx, type: 'en' }));
        const deck = [...guDeck, ...enDeck].sort(() => Math.random() - 0.5);
        setMatchingPairs(deck);
        setSelectedPairIds([]);
        setMatchedPairIds([]);
      }
    }
  }, [activeLesson, lessonQuestions, currentQIndex]);

  /* ========================================================
     INTERACTIVE TAP HANDLERS FOR LESSON gameplay
     ======================================================== */
  const handleSelectMCQOption = (opt) => {
    if (isAnswerChecked) return;
    playSound('click');
    setSelectedOptions([opt]);
    setMascotState("thinking");
  };

  const handleScrambleTileTap = (tileIndex, letter) => {
    if (isAnswerChecked) return;
    playSound('click');
    setSelectedOptions(prev => [...prev, { tileIndex, letter }]);
  };

  const handleScrambleSlotTap = (slotIndex) => {
    if (isAnswerChecked) return;
    playSound('click');
    setSelectedOptions(prev => prev.filter((_, idx) => idx !== slotIndex));
  };

  const handlePairCardTap = (cardId, pairId) => {
    if (isAnswerChecked || matchedPairIds.includes(cardId)) return;
    playSound('click');

    const curSelected = [...selectedPairIds];
    if (curSelected.includes(cardId)) {
      setSelectedPairIds(curSelected.filter(id => id !== cardId));
      return;
    }

    const nextSelected = [...curSelected, cardId];
    setSelectedPairIds(nextSelected);

    if (nextSelected.length === 2) {
      const card1 = matchingPairs.find(c => c.id === nextSelected[0]);
      const card2 = matchingPairs.find(c => c.id === nextSelected[1]);

      if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Correct pair match!
        playSound('correct');
        const nextMatched = [...matchedPairIds, card1.id, card2.id];
        setMatchedPairIds(nextMatched);
        setSelectedPairIds([]);

        if (nextMatched.length === matchingPairs.length) {
          // All matched
          setIsAnswerCorrect(true);
          setIsAnswerChecked(true);
          setMascotState("correct");
          let earned = 15;
          if (doubleXPActive) earned *= 2;
          setLessonXPAccumulated(p => p + earned);
        }
      } else {
        // Wrong match
        playSound('wrong');
        setHearts(h => {
          const nextH = h - 1;
          if (nextH <= 0) setShowOutofHearts(true);
          return nextH;
        });
        setTimeout(() => setSelectedPairIds([]), 800);
      }
    }
  };

  // Speaks out spoken audio
  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "🎙️ આ બ્રાઉઝરમાં વોઈસ રેકોગ્નિશન ઉપલબ્ધ નથી." } }));
    }
  };

  // Submits/Checks the current answer
  const checkCurrentAnswer = () => {
    const q = lessonQuestions[currentQIndex];
    let correct = false;

    if (q.type === "mcq") {
      correct = selectedOptions[0] === q.target;
    } else if (q.type === "scramble") {
      const word = selectedOptions.map(s => s.letter).join('');
      correct = word.toLowerCase().trim() === q.target.toLowerCase().trim();
    } else if (q.type === "builder" || q.type === "listening") {
      const sentence = selectedOptions.map(s => s.word).join(' ').trim();
      const cleanUser = sentence.toLowerCase().replace(/\s+/g, ' ');
      const cleanCorrect = q.target.toLowerCase().replace(/\s+/g, ' ');
      correct = cleanUser === cleanCorrect;
    }

    if (correct) {
      playSound('correct');
      setIsAnswerCorrect(true);
      setMascotState("correct");
      let earned = 10;
      if (doubleXPActive) earned *= 2;
      setLessonXPAccumulated(p => p + earned);
    } else {
      playSound('wrong');
      setIsAnswerCorrect(false);
      setMascotState("wrong");
      setHearts(h => {
        const nextH = h - 1;
        if (nextH <= 0) {
          setShowOutofHearts(true);
        }
        return nextH;
      });
    }

    setIsAnswerChecked(true);
  };

  // Navigates to next question
  const advanceToNextQuestion = () => {
    playSound('click');
    if (currentQIndex + 1 < lessonQuestions.length) {
      setCurrentQIndex(currentQIndex + 1);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(false);
      setSelectedOptions([]);
      setMascotState("idle");
      setSpokenText("");

      const nextQ = lessonQuestions[currentQIndex + 1];
      if (nextQ && (nextQ.type === "listening" || nextQ.type === "speaking")) {
        setTimeout(() => speakEnglishText(nextQ.audioText), 800);
      }
    } else {
      // Completed lesson!
      completeLessonSuccess();
    }
  };

  // Save successful lesson progress
  const completeLessonSuccess = () => {
    playSound('correct');
    
    // Add XP & Coins rewards
    let finalXP = activeLesson.xpReward;
    if (doubleXPActive) finalXP *= 2;
    addXP(finalXP);
    addCoins(activeLesson.coinReward);

    // Update local weekly XP cache
    const curWeek = getCurrentMonday();
    const savedWeek = localStorage.getItem('sanskar_weekly_xp_week') || '';
    let curWeeklyXP = 0;
    if (savedWeek === curWeek) {
      curWeeklyXP = parseInt(localStorage.getItem('sanskar_weekly_xp') || '0', 10);
    }
    const nextWeeklyXP = curWeeklyXP + finalXP;
    localStorage.setItem('sanskar_weekly_xp_week', curWeek);
    localStorage.setItem('sanskar_weekly_xp', nextWeeklyXP.toString());

    // Sync weekly XP to Supabase league
    syncLiveLeagueXP(nextWeeklyXP);

    // Update played streak date
    updateEnglishStreak();

    // Lesson unlocked node calculations
    const progress = { ...lessonProgress };
    const currentSessions = progress[activeLesson.id] || 0;
    const nextSessions = currentSessions + 1;
    progress[activeLesson.id] = nextSessions;
    localStorage.setItem('sanskar_english_lesson_progress', JSON.stringify(progress));
    setLessonProgress(progress);

    let isCompleted = false;
    let nextCompleted = [...completedLessons];
    if (nextSessions >= activeLesson.sessions) {
      // Completed entire lesson circle
      if (!completedLessons.includes(activeLesson.id)) {
        nextCompleted = [...completedLessons, activeLesson.id];
        localStorage.setItem('sanskar_english_completed_lessons', JSON.stringify(nextCompleted));
        setCompletedLessons(nextCompleted);
        isCompleted = true;
      }
    }

    // Sync progress to Supabase
    const status = isCompleted || nextCompleted.includes(activeLesson.id) ? 'completed' : 'unlocked';
    const unitId = findUnitOfLesson(activeLesson.id);
    syncLiveEnglishProgress(activeLesson.id, status, nextSessions, unitId);

    setShowLessonSummary(true);
  };

  // Skip chest rewards
  const claimPathChest = (unitId) => {
    playSound('correct');
    addCoins(15);
    localStorage.setItem(`sanskar_chest_claimed_${unitId}`, 'true');
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "🎁 બોનસ તિજોરી ખુલી! +૧૫ સિક્કા મળ્યા." } }));
    setCoins(getCoins());

    // Sync chest claim to Supabase
    syncLiveEnglishProgress(`chest_${unitId}`, 'completed', 1, unitId);
  };

  /* ========================================================
     SHOP OPERATIONS
     ======================================================== */
  const buyShopItem = (itemType, cost) => {
    playSound('click');
    const curCoins = getCoins();
    if (curCoins < cost) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "❌ ખરીદી માટે પૂરતા સિક્કા નથી!" } }));
      return;
    }

    addCoins(-cost);
    setCoins(getCoins());

    if (itemType === "streak_freeze") {
      const nextFreezes = streakFreezes + 1;
      localStorage.setItem('sanskar_streak_freezes', nextFreezes.toString());
      setStreakFreezes(nextFreezes);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "❄️ સ્ટ્રીક ફ્રીઝ ખરીદાયો! જરૂરિયાત વખતે આપોઆપ વપરાઈ જશે." } }));
    } else if (itemType === "refill_hearts") {
      setHearts(5);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "❤️ બધા દિલો રિફિલ થઈ ગયા છે!" } }));
    } else if (itemType === "double_xp") {
      const until = Date.now() + 5 * 60 * 1000; // 5 mins double XP
      localStorage.setItem('sanskar_double_xp_until', until.toString());
      setDoubleXPActive(true);
      setDoubleXPUntil(until);
      setDoubleXPMinsLeft(5);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "⚡ ડબલ XP પોશન સક્રિય થયો (૫ મિનિટ માટે)!" } }));
    } else {
      // Mascot outfit
      const nextOutfits = [...purchasedOutfits, itemType];
      localStorage.setItem('sanskar_purchased_outfits', JSON.stringify(nextOutfits));
      setPurchasedOutfits(nextOutfits);
      // Automatically equip
      localStorage.setItem('sanskar_equipped_outfit', itemType);
      setEquippedOutfit(itemType);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "👔 ગજુભાઈએ નવો પોશાક પહેરી લીધો છે!" } }));
    }
  };

  const equipMascotOutfit = (outfitName) => {
    playSound('click');
    localStorage.setItem('sanskar_equipped_outfit', outfitName);
    setEquippedOutfit(outfitName);
  };

  const handleBackToHub = () => {
    playSound('click');
    if (activeLesson) {
      setShowExitConfirm(true);
    } else {
      if (onBack) onBack(); else navigate('/community');
    }
  };

  const quitLessonSession = () => {
    playSound('click');
    setActiveLesson(null);
    setShowExitConfirm(false);
    setShowOutofHearts(false);
    setShowLessonSummary(false);
    setMascotState("idle");
  };

  const levelInfo = getLevelInfo(xp, streak);
  const progressPercent = Math.min(100, Math.max(0, ((xp - levelInfo.prevXP) / (levelInfo.maxXP - levelInfo.prevXP)) * 100));

  // Determine if a lesson is unlocked
  const isLessonUnlocked = (lessonId) => {
    // Find unit and index of lesson
    let allLessons = [];
    PATH_UNITS.forEach(unit => {
      allLessons = [...allLessons, ...unit.lessons];
    });

    const index = allLessons.findIndex(l => l.id === lessonId);
    if (index === 0) return true; // first lesson always unlocked
    const previousLesson = allLessons[index - 1];
    return completedLessons.includes(previousLesson.id);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative min-h-screen font-body select-none">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none rounded-[3rem] z-0"></div>

      {/* ========================================================
         LESSON ACTIVE GAMEPLAY MODE
         ======================================================== */}
      {activeLesson && lessonQuestions.length > 0 ? (
        <div className="relative z-10 max-w-lg mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-[2.5rem] shadow-2xl p-6 min-h-[580px] flex flex-col justify-between">
          
          {/* Header Panel */}
          <div>
            <div className="flex justify-between items-center gap-4">
              <button 
                onClick={handleBackToHub}
                className="h-9 w-9 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 flex items-center justify-center text-stone-650 dark:text-stone-300 transition"
              >
                <span className="material-symbols-outlined text-lg font-bold">close</span>
              </button>
              
              {/* Progress Bar */}
              <div className="flex-1 bg-stone-100 dark:bg-stone-850 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQIndex) / lessonQuestions.length) * 100}%` }}
                />
              </div>

              {/* Hearts Count */}
              <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-900/40 shrink-0">
                <span className="text-sm">❤️</span>
                <span className="font-bold text-xs text-rose-600">{hearts}</span>
              </div>
            </div>

            {/* Double XP Boost Badge */}
            {doubleXPActive && (
              <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 py-1 rounded-xl">
                <span>⚡ Double XP Active! ({doubleXPMinsLeft} min left)</span>
              </div>
            )}
          </div>

          {/* Question / Exercise Content Area */}
          <div className="my-6 flex-1 flex flex-col justify-center">
            {(() => {
              const q = lessonQuestions[currentQIndex];
              if (!q) return null;

              return (
                <div className="space-y-5">
                  
                  {/* Mascot Speech Bubble Panel */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 scale-100 origin-top">
                      <GajuMascot state={mascotState} outfit={equippedOutfit} size={85} />
                    </div>
                    
                    {/* Speak Bubble */}
                    <div className="flex-1 bg-teal-50 dark:bg-stone-850 p-4 rounded-2xl rounded-tl-none border border-teal-100 dark:border-stone-800 relative">
                      <p className="font-gujarati text-[10px] text-teal-600 dark:text-teal-400 font-black mb-1.5">ગજુભાઈ કહે છે:</p>
                      
                      <h4 className="font-headline font-black text-sm text-stone-800 dark:text-white leading-relaxed">
                        {q.prompt}
                      </h4>
                      {q.audioText && (
                        <button 
                          onClick={() => speakEnglishText(q.audioText)}
                          className="mt-2 h-7 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-1 text-[10px] font-bold shadow-xs active:scale-95 transition"
                        >
                          <span className="material-symbols-outlined text-xs">volume_up</span> બોલો
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Question Renderers */}
                  <div className="mt-4">
                    
                    {/* TYPE 1: MCQ Options */}
                    {q.type === "mcq" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, idx) => {
                          const isSelected = selectedOptions.includes(opt);
                          return (
                            <button
                              key={idx}
                              onClick={() => handleSelectMCQOption(opt)}
                              disabled={isAnswerChecked}
                              className={`w-full py-4 px-4 text-left rounded-2xl border-2 transition active:scale-98 font-bold text-xs ${
                                isSelected
                                  ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-650 text-teal-800 dark:text-teal-300'
                                  : 'bg-white dark:bg-stone-950 hover:bg-stone-50 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-200'
                              }`}
                            >
                              <span className="inline-block w-5 h-5 bg-stone-100 dark:bg-stone-850 border border-stone-300 text-center rounded-lg text-[10px] font-bold text-stone-500 mr-2.5">{idx + 1}</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 2: Pair match board */}
                    {q.type === "pair_match" && matchingPairs.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {matchingPairs.map((card, idx) => {
                          const isSelected = selectedPairIds.includes(card.id);
                          const isMatched = matchedPairIds.includes(card.id);

                          return (
                            <button
                              key={card.id}
                              onClick={() => handlePairCardTap(card.id, card.pairId)}
                              disabled={isMatched || isAnswerChecked}
                              className={`aspect-square rounded-2xl border-2 p-2 flex flex-col justify-center items-center text-center transition ${
                                isMatched
                                  ? 'bg-stone-100 border-stone-200 text-stone-300 opacity-40'
                                  : isSelected
                                    ? 'bg-teal-50 border-teal-650 text-teal-800 dark:bg-teal-950/30'
                                    : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 hover:border-teal-400 text-stone-850 dark:text-white'
                              }`}
                            >
                              <span className={`text-[11px] font-bold ${card.type === 'en' ? 'font-headline' : 'font-gujarati'}`}>
                                {card.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* TYPE 3: Word Scramble */}
                    {q.type === "scramble" && (
                      <div className="space-y-4">
                        {/* Selected Slots */}
                        <div className="flex flex-wrap justify-center gap-1.5 min-h-[48px] py-2 border-b border-stone-200 dark:border-stone-800">
                          {q.target.split('').map((_, i) => (
                            <button
                              key={i}
                              onClick={() => selectedOptions[i] && handleScrambleSlotTap(i)}
                              disabled={isAnswerChecked}
                              className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center font-headline font-black text-sm ${
                                selectedOptions[i]
                                  ? 'bg-teal-600 border-teal-700 text-white shadow-sm'
                                  : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950'
                              }`}
                            >
                              {selectedOptions[i] ? selectedOptions[i].letter : ''}
                            </button>
                          ))}
                        </div>

                        {/* Letter Tiles */}
                        <div className="flex flex-wrap justify-center gap-2">
                          {q.data.map((letter, idx) => {
                            const isUsed = selectedOptions.some(s => s.tileIndex === idx);
                            return (
                              <button
                                key={idx}
                                onClick={() => handleScrambleTileTap(idx, letter)}
                                disabled={isUsed || isAnswerChecked}
                                className={`w-11 h-11 rounded-xl font-headline font-black text-sm border flex items-center justify-center transition active:scale-95 ${
                                  isUsed
                                    ? 'bg-stone-100 text-stone-300 border-stone-200 dark:bg-stone-950 dark:text-stone-700'
                                    : 'bg-white hover:bg-teal-50 border-teal-200 text-teal-850 dark:bg-stone-900 dark:border-stone-800 shadow-sm'
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE 4: Sentence Builder & Listening */}
                    {(q.type === "builder" || q.type === "listening") && (
                      <div className="space-y-4">
                        {/* Word bank slots */}
                        <div className="bg-stone-50 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-800 rounded-3xl min-h-[90px] flex flex-wrap gap-2 items-center">
                          {selectedOptions.length === 0 ? (
                            <span className="font-gujarati text-xs text-stone-400">નીચેના શબ્દો પર ક્રમશઃ ક્લિક કરીને સાચું અંગ્રેજી વાક્ય બનાવો...</span>
                          ) : (
                            selectedOptions.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleScrambleSlotTap(idx)}
                                disabled={isAnswerChecked}
                                className="px-3.5 py-2 bg-teal-600 text-white rounded-xl font-headline font-bold text-xs shadow-sm hover:bg-teal-700 transition"
                              >
                                {item.word}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Jumbled word pills */}
                        <div className="flex flex-wrap gap-2 justify-center py-2">
                          {q.data.map((word, idx) => {
                            const isUsed = selectedOptions.some(s => s.tileIndex === idx);
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (isAnswerChecked) return;
                                  playSound('click');
                                  setSelectedOptions(p => [...p, { tileIndex: idx, word }]);
                                }}
                                disabled={isUsed || isAnswerChecked}
                                className={`px-4 py-2 border rounded-xl font-headline font-bold text-xs transition active:scale-95 ${
                                  isUsed
                                    ? 'bg-stone-100 border-stone-200 text-stone-300 dark:bg-stone-950'
                                    : 'bg-white hover:bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800 dark:text-white shadow-xs'
                                }`}
                              >
                                {word}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* TYPE 5: Speaking Practice */}
                    {q.type === "speaking" && (
                      <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <button
                          onClick={startRecording}
                          disabled={isRecording || isAnswerChecked}
                          className={`h-20 w-20 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-all ${
                            isRecording
                              ? 'bg-red-500 animate-ping'
                              : 'bg-teal-600 hover:bg-teal-700'
                          }`}
                        >
                          <span className="material-symbols-outlined text-4xl">mic</span>
                        </button>
                        
                        <p className="font-gujarati text-xs text-stone-500 font-bold">
                          {isRecording ? "🎤 સાંભળી રહ્યા છીએ... અંગ્રેજીમાં બોલો" : "🎙️ બટન દબાવીને મોટેથી બોલો"}
                        </p>

                        {spokenText && (
                          <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-3 rounded-2xl text-center">
                            <p className="text-[10px] text-stone-400">તમે બોલ્યા:</p>
                            <h5 className="font-headline font-bold text-sm text-stone-800 dark:text-stone-200 italic mt-0.5">"{spokenText}"</h5>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })()}
          </div>

          {/* Bottom Interactive Drawer & Action Button */}
          <div className="shrink-0 border-t border-stone-150 dark:border-stone-800 pt-4 mt-2">
            {!isAnswerChecked ? (
              <button
                onClick={checkCurrentAnswer}
                disabled={selectedOptions.length === 0 && lessonQuestions[currentQIndex]?.type !== "pair_match" && lessonQuestions[currentQIndex]?.type !== "speaking"}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-stone-300 text-white font-gujarati font-bold rounded-2xl shadow-md transition active:scale-98"
              >
                સાચો ઉત્તર તપાસો 🚀
              </button>
            ) : (
              <div className={`p-4 rounded-2xl animate-fade-in ${
                isAnswerCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/20 border border-rose-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined font-black ${isAnswerCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isAnswerCorrect ? 'check_circle' : 'cancel'}
                  </span>
                  <h4 className={`font-gujarati font-black text-sm ${isAnswerCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isAnswerCorrect ? '🎉 સરસ કામગીરી!' : '❌ ઉત્તર ખોટો છે'}
                  </h4>
                </div>

                <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                  {lessonQuestions[currentQIndex]?.explanation}
                </p>

                <button
                  onClick={advanceToNextQuestion}
                  className={`w-full py-3.5 text-white font-gujarati font-bold rounded-2xl shadow-sm transition active:scale-98 ${
                    isAnswerCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  આગળ વધો ➡️
                </button>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* ========================================================
           MAIN VIEW LAYOUT: TABS NAVIGATION
           ======================================================== */
        <div className="relative z-10 space-y-6">
          
          {/* Header Dashboard Banner */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-gradient-to-r from-teal-900 via-purple-900 to-teal-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 font-bold text-[120px] select-none translate-y-[-10px] translate-x-[20px]">
              📚
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleBackToHub}
                  className="h-8 px-3 bg-white/10 hover:bg-white/20 dark:bg-stone-850 rounded-lg flex items-center gap-1 font-gujarati text-[10px] font-bold text-white transition shrink-0"
                >
                  <span className="material-symbols-outlined text-xs">arrow_back</span> પાછા
                </button>
                <h2 className="font-gujarati font-black text-xl">ઇંગ્લિશ પાઠશાળા 🎓</h2>
              </div>
              <p className="font-gujarati text-xs text-teal-200">ડ્યુઓલિંગો શૈલીમાં રમત રમીને ગુજરાતીથી અંગ્રેજી શીખો!</p>
            </div>

            {/* User Stats Box */}
            <div className="flex flex-wrap gap-2.5 relative z-10 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 min-w-[65px] text-center">
                <p className="text-[9px] text-teal-200 font-bold tracking-wider">🌟 XP સ્કોર</p>
                <h4 className="font-headline font-black text-sm text-yellow-300">{xp}</h4>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 min-w-[65px] text-center">
                <p className="text-[9px] text-teal-200 font-bold tracking-wider">🔥 સ્ટ્રીક</p>
                <h4 className="font-headline font-black text-sm text-orange-400">{streak}</h4>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 min-w-[65px] text-center">
                <p className="text-[9px] text-teal-200 font-bold tracking-wider">🪙 સિક્કા</p>
                <h4 className="font-headline font-black text-sm text-amber-300">{coins}</h4>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Menu */}
          <div className="flex bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-1.5 rounded-2xl shadow-sm gap-1">
            {[
              { id: "path", label: "શીખવાનો માર્ગ 🗺️" },
              { id: "league", label: "લીગ 🏆" },
              { id: "leaderboard", label: "લીડરબોર્ડ 🌐" },
              { id: "shop", label: "દુકાન 🪙" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playSound('click'); setActiveTab(tab.id); }}
                className={`flex-1 py-3 text-center rounded-xl font-gujarati text-xs font-black transition ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================
             TAB 1: SEQUENTIAL LEARNING PATHWAY
             ======================================================== */
             activeTab === "path" && (
               <div className="space-y-12">
                 
                 {/* Progress Info Header */}
                 <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl shadow-sm">
                   <div className="flex justify-between text-xs font-bold font-gujarati text-stone-500 mb-1.5">
                     <span>પ્રગતિ સ્તર: {levelInfo.badge} {levelInfo.name}</span>
                     <span>{xp} / {levelInfo.maxXP} XP</span>
                   </div>
                   <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden border border-stone-250/20">
                     <div 
                       className="bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                       style={{ width: `${progressPercent}%` }}
                     />
                   </div>
                 </div>

                 {/* Learning Winding Path Tree */}
                 <div className="flex flex-col items-center py-6 space-y-16">
                   {PATH_UNITS.map((unit) => {
                     const isUnitChestClaimed = localStorage.getItem(`sanskar_chest_claimed_${unit.id}`) === 'true';
                     
                     return (
                       <div key={unit.id} className="w-full max-w-sm flex flex-col items-center space-y-6">
                         
                         {/* Unit Title Banner */}
                         <div className={`w-full bg-gradient-to-r ${unit.color} text-white p-5 rounded-3xl shadow-md ${unit.shadow} text-center space-y-1 relative`}>
                           <span className="absolute -top-3.5 left-6 bg-yellow-400 text-teal-950 font-black text-[9px] px-2.5 py-1 rounded-full border-2 border-white uppercase tracking-wider">Unit {unit.id}</span>
                           <h3 className="font-gujarati font-black text-sm">{unit.title}</h3>
                           <p className="font-gujarati text-[10px] text-white/85">{unit.subtitle}</p>
                         </div>

                         {/* Serpentine Lessons Alignment */}
                         <div className="w-full flex flex-col items-center py-4 relative">
                           
                           {/* Connector Line decoration */}
                           <div className="absolute top-8 bottom-8 w-1 bg-stone-200 dark:bg-stone-800 rounded-full left-1/2 -translate-x-1/2"></div>

                           <div className="flex flex-col items-center gap-14 relative z-10 w-full">
                             {unit.lessons.map((lesson, idx) => {
                               const unlocked = isLessonUnlocked(lesson.id);
                               const sessionsDone = lessonProgress[lesson.id] || 0;
                               const completed = sessionsDone >= lesson.sessions;
                               
                               // Serpentine horizontal offset
                               const offset = idx % 3 === 0 ? "translate-x-0" : idx % 3 === 1 ? "translate-x-8" : "-translate-x-8";

                               return (
                                 <div key={lesson.id} className={`flex flex-col items-center ${offset} transition-all duration-300`}>
                                   
                                   {/* Circular Node Button */}
                                   <button
                                     onClick={() => unlocked && startLesson(lesson)}
                                     disabled={!unlocked}
                                     className={`h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-md relative group ${
                                       completed
                                         ? 'bg-yellow-450 border-4 border-yellow-550 scale-105 active:scale-95'
                                         : unlocked
                                           ? 'bg-emerald-500 border-4 border-emerald-600 scale-100 hover:scale-105 active:scale-95 animate-bounce'
                                           : 'bg-stone-200 border-4 border-stone-300 dark:bg-stone-850 dark:border-stone-800 cursor-not-allowed opacity-60'
                                     }`}
                                     title={lesson.name}
                                   >
                                     <span className={`material-symbols-outlined text-xl font-bold ${completed ? 'text-teal-950' : unlocked ? 'text-white' : 'text-stone-400'}`}>
                                       {completed ? 'workspace_premium' : unlocked ? 'school' : 'lock'}
                                     </span>

                                     {/* Progress Session count badge */}
                                     {unlocked && !completed && (
                                       <span className="absolute -bottom-2 bg-purple-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full border border-white">
                                         {sessionsDone}/{lesson.sessions}
                                       </span>
                                     )}
                                   </button>

                                   {/* Lesson Name */}
                                   <span className={`font-gujarati text-[10px] font-bold mt-2 px-3 py-1 rounded-full text-center ${
                                     unlocked
                                       ? 'text-stone-800 dark:text-stone-200'
                                       : 'text-stone-400'
                                   }`}>
                                     {lesson.name}
                                   </span>
                                 </div>
                               );
                             })}
                           </div>

                         </div>

                         {/* Claimable Chest at unit boundary */}
                         <div className="pt-2 flex flex-col items-center">
                           {!isUnitChestClaimed ? (
                             <button
                               onClick={() => claimPathChest(unit.id)}
                               className="h-12 px-4 bg-amber-50 hover:bg-amber-100 dark:bg-stone-900 border border-amber-300 dark:border-stone-800 rounded-2xl flex items-center gap-2 shadow-xs transition active:scale-95 group"
                             >
                               <span className="text-xl group-hover:scale-110 transition-transform">🎁</span>
                               <span className="font-gujarati text-[10px] font-black text-amber-800 dark:text-amber-400">બોનસ તિજોરી ખોલો</span>
                             </button>
                           ) : (
                             <span className="font-gujarati text-[10px] text-stone-400 font-bold">🎁 તિજોરી ખોલેલ છે</span>
                           )}
                         </div>

                       </div>
                     );
                   })}
                 </div>

               </div>
             )
           }

          {/* ========================================================
             TAB: WEEKLY LEAGUE VIEW
             ======================================================== */}
          {activeTab === "league" && (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
              {/* League Header banner */}
              <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-2xl p-5 text-white flex justify-between items-center relative overflow-hidden">
                <div className="space-y-1 z-10">
                  <span className="text-xs font-bold font-gujarati text-purple-200">સાપ્તાહિક મુકાબલો</span>
                  <h3 className="font-gujarati font-black text-lg flex items-center gap-1.5">
                    {leagueData?.tier === 'Bronze' && "🥉 Bronze League"}
                    {leagueData?.tier === 'Silver' && "🥈 Silver League"}
                    {leagueData?.tier === 'Gold' && "🥇 Gold League"}
                    {leagueData?.tier === 'Diamond' && "💎 Diamond League"}
                    {!leagueData && "🏆 Weekly League"}
                  </h3>
                  <p className="font-gujarati text-[10px] text-purple-200/90">દર અઠવાડિયે ૨૦-૩૦ યુઝર્સ વચ્ચે જંગ!</p>
                </div>
                <div className="text-right z-10 shrink-0">
                  <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold font-gujarati flex items-center gap-1 border border-white/20">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {getDaysLeftInLeague()}
                  </div>
                </div>
                <span className="absolute -right-4 -bottom-6 text-[80px] opacity-15 select-none rotate-12">🏆</span>
              </div>

              {/* Promotion rules notice */}
              <div className="bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-2xl p-3 text-center">
                <p className="font-gujarati text-[10px] text-teal-800 dark:text-teal-400 font-bold leading-normal">
                  🚀 **ટોપ ૭ પ્રમોશન ઝોન**: આવતા અઠવાડિયે ઉચ્ચ લીગમાં પ્રમોટ થશે!
                  <br />
                  🔻 **બોટમ ૫ ડિમોશન ઝોન**: નીચેની લીગમાં જશે (સિવાય કે કાંસ્ય લીગમાં હોય).
                </p>
              </div>

              {/* Members Rank List */}
              {loadingLeague ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="font-gujarati text-xs text-stone-500">લીગમાં ગ્રુપ શોધી રહ્યા છીએ...</p>
                </div>
              ) : leagueData && leagueData.members ? (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {leagueData.members.map((member) => {
                    const isPromoted = member.rank <= 7;
                    const isDemoted = leagueData.members.length >= 10 && member.rank > leagueData.members.length - 5;
                    const isPaused = member.weeklyXP === 0;

                    return (
                      <div 
                        key={member.userId} 
                        className={`flex items-center justify-between py-3.5 px-3 transition rounded-2xl ${
                          member.isCurrentUser 
                            ? 'bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-900 shadow-xs' 
                            : 'hover:bg-stone-50 dark:hover:bg-stone-950/40'
                        }`}
                      >
                        {/* Left: Rank, arrow, photo, name */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank indicator & status indicator */}
                          <div className="flex flex-col items-center min-w-[24px]">
                            <span className="font-headline font-black text-sm text-stone-700 dark:text-stone-300">
                              {member.rank}
                            </span>
                            {/* Up/Down promotion arrows */}
                            {isPaused ? (
                              <span className="text-[7px] text-stone-450 font-bold leading-none scale-90">PAUSED</span>
                            ) : isPromoted ? (
                              <span className="material-symbols-outlined text-emerald-500 text-xs font-bold leading-none select-none">arrow_upward</span>
                            ) : isDemoted && leagueData.tier !== 'Bronze' ? (
                              <span className="material-symbols-outlined text-rose-500 text-xs font-bold leading-none select-none">arrow_downward</span>
                            ) : (
                              <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-stone-200 dark:border-stone-850 bg-stone-100 dark:bg-stone-850 shrink-0 relative">
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-stone-450">
                                <span className="material-symbols-outlined text-xl">person</span>
                              </div>
                            )}
                          </div>

                          {/* Name & Details */}
                          <div className="min-w-0">
                            <h4 className="font-gujarati font-black text-xs text-stone-900 dark:text-stone-100 truncate flex items-center gap-1.5">
                              {member.name}
                              {member.isCurrentUser && <span className="bg-amber-400 text-teal-950 text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">તમે</span>}
                            </h4>
                            <p className="font-gujarati text-[9px] text-stone-450">
                              {isPaused ? "સાધના હજુ શરૂ નથી કરી" : `સાપ્તાહિક સ્કોર`}
                            </p>
                          </div>
                        </div>

                        {/* Right: XP Score */}
                        <div className="text-right shrink-0">
                          <span className={`font-headline font-black text-sm ${isPaused ? 'text-stone-400' : 'text-teal-600 dark:text-teal-400'}`}>
                            {member.weeklyXP} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 font-gujarati text-stone-500 text-xs">
                  કોઈ લીગ ગ્રુપ મળ્યું નથી.
                </div>
              )}
            </div>
          )}

          {/* ========================================================
             TAB 2: LEADERBOARD VIEW
             ======================================================== */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              <LeaderboardUnified 
                title="અંગ્રેજી લીડરબોર્ડ" 
                icon="social_leaderboard"
                data={liveLeaderboard}
                userRank={liveLeaderboard.findIndex(u => u.isUser) + 1}
                scoreLabel="XP"
                onUserClick={(user) => setSelectedUserStats(user)}
              />
            </div>
          )}

          {/* ========================================================
             TAB 3: THE SHOP (દુકાન)
             ======================================================== */
             activeTab === "shop" && (
               <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-6">
                 
                 <div className="flex justify-between items-center pb-3 border-b border-stone-100 dark:border-stone-800">
                   <h3 className="font-gujarati font-black text-sm text-stone-750 dark:text-white flex items-center gap-1.5">
                     <span>🪙</span> અંગ્રેજી પાઠશાળા દુકાન
                   </h3>
                   <span className="font-headline font-black text-sm text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full border border-amber-200/50">
                     🪙 {coins} સિક્કા
                   </span>
                 </div>

                 {/* Shop Items Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   
                   {/* Streak Freeze */}
                   <div className="border border-stone-150 dark:border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                     <div className="space-y-1 flex-1">
                       <h4 className="font-gujarati font-black text-xs text-stone-800 dark:text-white">સ્ટ્રીક ફ્રીઝ (Streak Freeze)</h4>
                       <p className="font-gujarati text-[9px] text-stone-500">ભૂલથી એક દિવસ રમાય નહીં તો સ્ટ્રીક તૂટતી બચાવે છે.</p>
                       <span className="inline-block text-[9px] font-bold text-teal-650 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-md">હાલની બચત: {streakFreezes}</span>
                     </div>
                     <button
                       onClick={() => buyShopItem("streak_freeze", 50)}
                       className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-[10px] rounded-xl shrink-0 transition active:scale-95"
                     >
                       ૫૦ 🪙
                     </button>
                   </div>

                   {/* Heart Refill */}
                   <div className="border border-stone-150 dark:border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                     <div className="space-y-1 flex-1">
                       <h4 className="font-gujarati font-black text-xs text-stone-800 dark:text-white">દિલો રિફિલ કરો (Heart Refill)</h4>
                       <p className="font-gujarati text-[9px] text-stone-500">તમારા ૫ દિલો (Hearts) તાત્કાલિક પૂર્ણ રિફિલ કરો.</p>
                     </div>
                     <button
                       onClick={() => buyShopItem("refill_hearts", 20)}
                       className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-[10px] rounded-xl shrink-0 transition active:scale-95"
                     >
                       ૨૦ 🪙
                     </button>
                   </div>

                   {/* Double XP Boost */}
                   <div className="border border-stone-150 dark:border-stone-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                     <div className="space-y-1 flex-1">
                       <h4 className="font-gujarati font-black text-xs text-stone-800 dark:text-white">ડબલ XP પોશન (Double XP Potion)</h4>
                       <p className="font-gujarati text-[9px] text-stone-500">૫ મિનિટ માટે ભણતી વખતે દરેક સાચા જવાબમાં બમણા XP મેળવો.</p>
                     </div>
                     <button
                       onClick={() => buyShopItem("double_xp", 35)}
                       className="h-10 px-4 bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-[10px] rounded-xl shrink-0 transition active:scale-95"
                     >
                       ૩૫ 🪙
                     </button>
                   </div>

                 </div>

                 {/* Outfits segment for Gaju Bhai */}
                 <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                   <h4 className="font-gujarati font-black text-xs text-stone-750 dark:text-white flex items-center gap-1.5">
                     👔 ગજુભાઈના કપડાં (Mascot Outfits)
                   </h4>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                     {[
                       { id: "turban", label: "કેસરી પાઘડી", cost: 0, preview: "turban" },
                       { id: "glasses", label: "વિદ્વાન ચશ્મા", cost: 50, preview: "glasses" },
                       { id: "crown", label: "શાહી મુગટ", cost: 120, preview: "crown" },
                       { id: "sherlock", label: "ડિટેક્ટિવ હેટ", cost: 90, preview: "sherlock" }
                     ].map(item => {
                       const purchased = purchasedOutfits.includes(item.id);
                       const equipped = equippedOutfit === item.id;

                       return (
                         <div key={item.id} className="border border-stone-150 dark:border-stone-850 p-3 rounded-2xl flex flex-col items-center text-center space-y-3">
                           <GajuMascot state="idle" outfit={item.id} size={55} />
                           
                           <div>
                             <h5 className="font-gujarati font-bold text-[10px] text-stone-800 dark:text-white">{item.label}</h5>
                           </div>

                           {equipped ? (
                             <span className="text-[9px] font-gujarati text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">Equipped</span>
                           ) : purchased ? (
                             <button
                               onClick={() => equipMascotOutfit(item.id)}
                               className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-650 dark:text-stone-300 font-gujarati text-[9px] py-1 rounded-lg transition"
                             >
                               Equip
                             </button>
                           ) : (
                             <button
                               onClick={() => buyShopItem(item.id, item.cost)}
                               className="w-full bg-amber-500 hover:bg-amber-600 text-white font-gujarati text-[9px] py-1 rounded-lg transition"
                             >
                               {item.cost} 🪙
                             </button>
                           )}
                         </div>
                       );
                     })}
                   </div>
                 </div>

               </div>
             )
          }

        </div>
      )}

      {/* ========================================================
         MODALS AND CONFIRMATIONS
         ======================================================== */}
      
      {/* 1. Confirm Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5">
            <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white">ભણવાનું વચ્ચેથી છોડવું છે?</h3>
            <p className="font-gujarati text-xs text-stone-500 leading-relaxed">
              જો તમે બહાર જશો તો આજની ચાલુ રમતનું બધું પ્રોગ્રેસ નષ્ટ થશે!
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-255 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-650 dark:text-stone-350 py-3.5 rounded-2xl text-xs font-bold transition active:scale-95"
              >
                ચાલુ રાખો ✏️
              </button>
              <button
                onClick={quitLessonSession}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-2xl text-xs font-bold transition active:scale-95 shadow-sm"
              >
                બહાર જાવ 🚪
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Out of Hearts (No Lives Left) Modal */}
      {showOutofHearts && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-5">
            <p className="text-4xl">💔</p>
            <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white">તમારી પાસે દિલો (Hearts) પતી ગયા!</h3>
            <p className="font-gujarati text-xs text-stone-500 leading-relaxed">
              ગભરાશો નહીં! તમે ૨૦ સિક્કા આપીને તમારા બધા દિલો તરત જ રિફિલ કરી શકો છો અને તમારી રમત ચાલુ રાખી શકો છો.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => buyShopItem("refill_hearts", 20) || setShowOutofHearts(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-xs font-bold transition active:scale-95 shadow-md"
              >
                ૨૦ 🪙 વડે રિફિલ કરો ❤️
              </button>
              <button
                onClick={quitLessonSession}
                className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-650 dark:text-stone-300 py-3 rounded-2xl text-xs font-bold transition active:scale-95"
              >
                લેસન છોડો 🚪
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Completed Lesson Success Summary Modal */}
      {showLessonSummary && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border-4 border-emerald-500 rounded-[2.5rem] p-6 max-w-sm w-full text-center shadow-2xl space-y-6">
            <p className="text-5xl">🏆</p>
            <h3 className="font-gujarati font-black text-xl text-stone-900 dark:text-white">ખૂબ સુંદર ભાઈ! લેસન પૂર્ણ!</h3>
            
            <div className="bg-stone-50 dark:bg-stone-955 p-4 rounded-2xl border border-stone-200 dark:border-stone-850 grid grid-cols-2 gap-4">
              <div>
                <p className="font-gujarati text-[9px] text-stone-400">XP મેળવેલા સ્કોર</p>
                <h4 className="font-headline font-black text-base text-yellow-500 mt-1">🌟 +{activeLesson?.xpReward * (doubleXPActive ? 2 : 1)}</h4>
              </div>
              <div>
                <p className="font-gujarati text-[9px] text-stone-400">નવા સિક્કા (Coins)</p>
                <h4 className="font-headline font-black text-base text-amber-500 mt-1">🪙 +{activeLesson?.coinReward}</h4>
              </div>
            </div>

            <button
              onClick={quitLessonSession}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-gujarati font-bold py-4 rounded-2xl shadow-md transition active:scale-95"
            >
              મુખ્ય પેજ પર પાછા જાઓ 🏠
            </button>
          </div>
        </div>
      )}

      {/* 4. Leaderboard Detail Stats Modal */}
      {selectedUserStats && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-800 rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl relative space-y-5">
            <button 
              onClick={() => setSelectedUserStats(null)}
              className="absolute right-5 top-5 h-9 w-9 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-650 dark:text-stone-300"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="text-center space-y-4">
              <h3 className="font-gujarati font-black text-lg text-stone-900 dark:text-white">
                👤 સ્પર્ધક વિગતો
              </h3>
              
              <div className="flex justify-center">
                <img src={selectedUserStats.avatar} className="h-16 w-16 rounded-full border-2 border-teal-500 shadow-md" alt="" />
              </div>
              
              <div>
                <h4 className="font-headline font-black text-base text-stone-800 dark:text-stone-200">
                  {selectedUserStats.name}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">{selectedUserStats.isUser ? "તમે પોતે" : "અંગ્રેજી પાઠશાળા સાધક"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-gujarati text-center">
              <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-850">
                <p className="text-[10px] text-stone-500 font-bold">સાધના સ્ટ્રીક</p>
                <span className="font-headline font-black text-sm text-teal-600 mt-1 block">🔥 {toGujaratiNum(selectedUserStats.streak)} દિવસ</span>
              </div>
              <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-850">
                <p className="text-[10px] text-stone-500 font-bold">કુલ સ્કોર</p>
                <span className="font-headline font-black text-sm text-yellow-500 mt-1 block">🌟 {toGujaratiNum(selectedUserStats.score)} XP</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserStats(null)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-gujarati font-bold text-xs py-3.5 rounded-2xl shadow-sm transition active:scale-95"
            >
              Scale Out ✖
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
