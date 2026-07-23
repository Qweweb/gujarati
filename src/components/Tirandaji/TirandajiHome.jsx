import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateLevel, canShapeMove } from './GameEngine';
import GameBoard from './GameBoard';
import LeaderboardUnified, { toGujaratiNum } from '../LeaderboardUnified';
import { supabase } from '../../supabaseClient';
import Confetti from 'react-confetti';

export default function TirandajiHome() {
  const navigate = useNavigate();
  
  const [levelIndex, setLevelIndex] = useState(0);
  const [levelData, setLevelData] = useState(null);
  const [activeShapes, setActiveShapes] = useState([]);
  const [movesLeft, setMovesLeft] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'won', 'lost', 'streak'
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [floatingText, setFloatingText] = useState(null);
  
  const [windPowerAvailable, setWindPowerAvailable] = useState(true);
  const [isTornadoActive, setIsTornadoActive] = useState(false);
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [streakData, setStreakData] = useState({ count: 0, days: [] });
  const [showStreakModal, setShowStreakModal] = useState(false);
  
  const [showChallengePopup, setShowChallengePopup] = useState(false);
  const [challengePercent, setChallengePercent] = useState(0);
  
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Init Level
  useEffect(() => {
    loadLevel(levelIndex, gameState === 'menu');
    fetchLeaderboard();
    loadStreakData();
    
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [levelIndex]);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);

        // Handle Bomb Countdowns
        setActiveShapes(shapes => {
           let timeoutOccurred = false;
           const updated = shapes.map(s => {
              if (s.isBomb && s.bombTime > 0) {
                 const newTime = s.bombTime - 1;
                 if (newTime === 0) {
                    timeoutOccurred = true;
                    return { ...s, isBomb: false, bombTime: 0 }; // Convert to normal arrow
                 }
                 return { ...s, bombTime: newTime };
              }
              return s;
           });
           
           if (timeoutOccurred) {
              window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "સમય પૂરો! બ્લુ તીર સામાન્ય થઈ ગયું." } }));
           }
           return updated;
        });

      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [gameState, levelData]);

  const loadStreakData = () => {
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const lastPlayed = localStorage.getItem('tirandaji_last_played');
    let count = parseInt(localStorage.getItem('tirandaji_streak_count') || '0', 10);
    
    if (lastPlayed) {
      const lastDate = new Date(lastPlayed);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays > 1) {
        count = 0; // Missed a day, reset streak
      }
    }
    
    // Generate days array for UI (last 7 days ending today)
    const days = [];
    for(let i = 6; i >= 0; i--) {
      const d = new Date(new Date(today).setDate(new Date(today).getDate() - i));
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      // If the streak covers this day, it's checked
      const isChecked = i < (count + (lastPlayed === today ? 0 : 1)); 
      days.push({ name: dayName, checked: isChecked });
    }
    setStreakData({ count, days });
  };

  const updateStreak = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const lastPlayed = localStorage.getItem('tirandaji_last_played');
    let count = parseInt(localStorage.getItem('tirandaji_streak_count') || '0', 10);

    if (lastPlayed !== today) {
       count += 1;
       localStorage.setItem('tirandaji_streak_count', count.toString());
       localStorage.setItem('tirandaji_last_played', today);
       loadStreakData();
       return true; // Streak was updated just now
    }
    return false; // Already played today
  };

  const loadLevel = (idx, isInit = false) => {
    const newLevel = generateLevel(idx);
    setLevelData(newLevel);
    setActiveShapes(newLevel.shapes);
    setMovesLeft(newLevel.moves);
    setHearts(3); // Reset hearts on new level
    setTimeElapsed(0);
    setLastMoveTime(0);
    setComboCount(0);
    setFloatingText(null);
    setWindPowerAvailable(true);
    setIsTornadoActive(false);
    if (!isInit) setGameState('playing');
    
    // Show challenge popup occasionally for levels > 1
    if (idx > 0 && Math.random() > 0.3) {
      // Formula to decrease percentage as level increases
      const percent = Math.max((85 * Math.exp(-idx * 0.08)).toFixed(2), 0.01);
      setChallengePercent(percent);
      setShowChallengePopup(true);
      setTimeout(() => setShowChallengePopup(false), 3000);
    } else {
      setShowChallengePopup(false);
    }
  };

  const getOrCreateUserId = () => {
    let phone = localStorage.getItem('user_phone');
    if (phone) return phone;
    
    let uid = localStorage.getItem('tirandaji_uid');
    if (!uid) {
      uid = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('tirandaji_uid', uid);
    }
    return uid;
  };

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('tirandaji_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(20);
      
      if (!error && data) {
        const uid = getOrCreateUserId();
        const enriched = data.map(d => ({
           ...d,
           isUser: d.mobile === uid
        }));
        setLeaderboardData(enriched);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateLeaderboard = async (finalScore) => {
    try {
      const uid = getOrCreateUserId();
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      const name = profile.name || localStorage.getItem('google_name') || 'અજાણ્યો ખેલાડી';
      const avatar = profile.avatar || localStorage.getItem('google_avatar') || null;

      let previousHighScore = 0;
      try {
        const { data: existingData } = await supabase
          .from('tirandaji_scores')
          .select('score')
          .eq('mobile', uid)
          .single();
        if (existingData) {
          previousHighScore = existingData.score || 0;
        }
      } catch (e) {}

      const newHighScore = Math.max(finalScore, previousHighScore);

      await supabase.from('tirandaji_scores').upsert({
        mobile: uid,
        name: name,
        avatar: avatar,
        score: newHighScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'mobile' });
      
      fetchLeaderboard();
    } catch (e) {
      console.error("Leaderboard error:", e);
    }
  };

  const handleTryMove = (shape) => {
    if (gameState !== 'playing' || !levelData) return false;

    const canMove = canShapeMove(shape, activeShapes, levelData.size);

    if (canMove) {
      let shapesToRemove = [shape.id];
      
      // Bonus: If releasing a bomb arrow successfully
      if (shape.isBomb) {
         const otherShapes = activeShapes.filter(s => s.id !== shape.id);
         if (otherShapes.length > 0) {
            const randomOther = otherShapes[Math.floor(Math.random() * otherShapes.length)];
            shapesToRemove.push(randomOther.id);
            window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "🎯 એક્સ્ટ્રા તીર ફ્રીમાં છૂટ્યું!" } }));
         }
      }

      setActiveShapes(shapes => shapes.filter(s => !shapesToRemove.includes(s.id)));
      // Success Combo Logic
      const now = Date.now();
      if (now - lastMoveTime < 2000) {
        setComboCount(c => {
           const nc = c + 1;
           if (nc >= 3) {
             setFloatingText({ text: "સચોટ નિશાન! 🔥", id: Date.now() });
             setScore(s => s + 20);
           }
           return nc;
        });
      } else {
        setComboCount(1);
      }
      setLastMoveTime(now);

      const remaining = activeShapes.filter(s => s.id !== shape.id);
      setActiveShapes(remaining);
      setScore(s => s + 10);
      setMovesLeft(m => m - 1);

      if (remaining.length === 0) {
        handleWin();
      } else if (movesLeft - 1 <= 0) {
        handleLoss();
      }
      return true;
    } else {
      // Failure
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0 || movesLeft <= 0) {
        handleLoss();
      }
      return false;
    }
  };

  const handleWin = () => {
    const levelBonus = (levelIndex + 1) * 50;
    const finalScore = score + levelBonus;
    setScore(finalScore);
    updateLeaderboard(finalScore);
    
    const isNewStreak = updateStreak();
    if (isNewStreak) {
      setGameState('streak');
    } else {
      setGameState('won');
    }
  };

  const handleLoss = () => {
    setGameState('lost');
    updateLeaderboard(score);
  };

  const nextLevel = () => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Mock Interstitial Ad Shown" } }));
    setLevelIndex(prev => prev + 1);
  };

  const retryLevel = () => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Mock Interstitial Ad Shown" } }));
    loadLevel(levelIndex);
  };

  const watchAdForLives = () => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "3 એનર્જી પાછી મળી!" } }));
      setHearts(3);
      setGameState('playing');
    }, 1000);
  };

  const watchAdForWind = () => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Mock Ad Shown" } }));
    setTimeout(() => {
       setWindPowerAvailable(false);
       setFloatingText({ text: "🌪️ વાવાઝોડું!", id: Date.now() });
       
       setIsTornadoActive(true);
       
       setTimeout(() => {
           setIsTornadoActive(false);
           setActiveShapes(shapes => {
             const shuffled = [...shapes].sort(() => 0.5 - Math.random());
             const toRemove = shuffled.slice(0, Math.min(3, shapes.length));
             const removeIds = new Set(toRemove.map(s => s.id));
             return shapes.filter(s => !removeIds.has(s.id));
           });
       }, 1500); // Wait for tornado animation to finish
       
    }, 1000);
  };

  const availableHeight = windowSize.height - 250; // Account for header, footer, ad banner
  const boardWidth = Math.max(200, Math.min(windowSize.width - 32, availableHeight, 400));

  return (
    <div className="h-[100dvh] w-full font-gujarati flex flex-col relative overflow-hidden" style={{ backgroundColor: '#F3EFE0' }}>
      
      {/* Menu Screen */}
      <AnimatePresence>
        {gameState === 'menu' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F3EFE0] p-6"
          >
            <div className="absolute top-4 left-4">
              <button onClick={() => navigate(-1)} className="p-2 bg-transparent text-stone-700 active:scale-95">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
            
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center w-full max-w-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-[#34D399] to-[#10B981] rounded-3xl flex items-center justify-center text-5xl shadow-xl shadow-[#10B981]/40 mb-6 border-4 border-white">
                🏹
              </div>
              <h1 className="text-4xl font-black text-stone-800 mb-2 font-sans tracking-wide">તીરંદાજી</h1>
              <p className="text-stone-500 font-bold mb-8 text-center text-sm leading-relaxed">
                🏹 તીરને ગૂંચવણમાંથી બહાર કાઢો<br/>⚡ કોઈને અડ્યા વગર રસ્તો બનાવો
              </p>
              
              <button 
                onClick={() => setGameState('playing')}
                className="w-full py-4 bg-gradient-to-r from-[#14532D] to-[#064E3B] text-[#ECFDF5] rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95 mb-4 border border-[#34D399]/30"
              >
                🎮 New Game
              </button>
              <button 
                onClick={() => setShowLeaderboard(true)}
                className="w-full py-4 bg-stone-200 text-stone-700 rounded-2xl font-bold text-xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-stone-300"
              >
                <span className="material-symbols-outlined">leaderboard</span> Leaderboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar matching reference */}
      <div className="flex items-center justify-between p-4 z-10 w-full max-w-md mx-auto">
        <button onClick={() => navigate(-1)} className="p-2 bg-transparent text-stone-700 active:scale-95">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        <h2 className="text-xl font-bold text-stone-800">
          Level {levelIndex + 1}
        </h2>

        <div className="flex gap-2">
          <button onClick={() => setShowLeaderboard(true)} className="p-2 bg-transparent text-stone-700 active:scale-95">
            <span className="material-symbols-outlined">leaderboard</span>
          </button>
        </div>
      </div>

      {/* Hearts Bar */}
      <div className="flex items-center justify-between px-6 py-2 z-10 w-full max-w-md mx-auto">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-[24px] ${i < hearts ? 'text-amber-500' : 'text-stone-300'}`}>
              bolt
            </span>
          ))}
        </div>
        
        {windPowerAvailable && (
           <button onClick={watchAdForWind} className="flex items-center gap-1 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-bold active:scale-95 shadow-sm border border-blue-200">
             <span className="material-symbols-outlined text-[18px]">storm</span>
             વાવાઝોડું (Ad)
           </button>
        )}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center relative w-full px-2">
        <AnimatePresence>
          {showChallengePopup && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-40 bg-[#C88448] text-white px-6 py-4 rounded-2xl shadow-2xl text-center font-bold w-4/5 max-w-sm border-2 border-[#EAA767]"
            >
              આ લેવલ પાર કરો અને <br/> <span className="text-3xl text-[#FDE047] drop-shadow-md">{challengePercent}%</span> <br/> ખેલાડીઓ કરતા આગળ વધો!
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {floatingText && (
            <motion.div 
              key={floatingText.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1.2 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              onAnimationComplete={() => setFloatingText(null)}
              className="absolute z-50 text-amber-500 font-black text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pointer-events-none"
              style={{ top: '30%' }}
            >
              {floatingText.text}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTornadoActive && (
            <motion.div
              initial={{ left: '-20%', scale: 1, rotate: -30, opacity: 0 }}
              animate={{ left: '120%', scale: 4, rotate: 30, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute z-50 text-[100px] pointer-events-none drop-shadow-2xl"
              style={{ top: '30%' }}
            >
              🌪️
            </motion.div>
          )}
        </AnimatePresence>

        {levelData && activeShapes.length > 0 && (
          <GameBoard 
            shapes={activeShapes} 
            onTryMove={handleTryMove} 
            disabled={gameState !== 'playing' || isTornadoActive}
            width={boardWidth}
            boardSize={levelData.size}
          />
        )}
      </div>

      {/* Footer Text */}
      <div className="py-2 text-center z-10 shrink-0">
        <h1 className="text-2xl font-black text-stone-900 tracking-wider font-sans">
          UNLOCK ARROWS
        </h1>
        <p className="text-stone-500 font-bold text-xs mt-1">તીરંદાજી</p>
      </div>

      {/* Bottom Ad Banner Mock */}
      <div className="h-14 shrink-0 bg-white/50 flex items-center justify-center text-stone-400 text-[10px] tracking-widest uppercase border-t border-white/20 z-10">
        Ad Banner Placeholder
      </div>

      {/* Modals & Popups */}
      <AnimatePresence>
        {gameState === 'streak' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-stone-100/95 backdrop-blur-sm p-6"
          >
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={150} colors={['#FCD34D', '#F59E0B', '#38BDF8']} />
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#F3EFE0] rounded-[2rem] p-8 max-w-sm w-full text-center shadow-xl border border-stone-200"
            >
              <div className="mx-auto w-24 h-24 mb-2 relative">
                {/* Hexagon Badge Mock */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <polygon points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25" fill="#38BDF8" stroke="#FDE047" strokeWidth="4" />
                  <path d="M 50 25 Q 70 55 50 80 Q 30 55 50 25" fill="#BAE6FD" />
                </svg>
              </div>
              <h1 className="text-6xl font-black text-[#B47B44] mb-2">{streakData.count}</h1>
              <h2 className="text-2xl font-bold text-[#B47B44] mb-6">Daily Streak</h2>
              
              <div className="flex justify-between items-center bg-white/50 rounded-2xl p-4 mb-6">
                {streakData.days.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-stone-500">{day.name}</span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${day.checked ? 'bg-orange-400 text-white' : 'bg-stone-300'}`}>
                      {day.checked && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[#B47B44] font-bold mb-8 px-4">Your mind is getting sharper with every puzzle.</p>
              
              <button 
                onClick={() => setGameState('won')}
                className="w-full py-4 bg-[#D4B895] hover:bg-[#C2A37F] text-white rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'won' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
          >
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300} colors={['#FCD34D', '#F59E0B', '#FBBF24']} />
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#F8F5EB] rounded-[2rem] p-6 max-w-sm w-full shadow-2xl relative mt-16"
            >
              {/* Floating Stars */}
              <div className="absolute -top-16 left-0 right-0 flex justify-center items-end gap-2">
                <motion.div initial={{ y: 20, rotate: -20 }} animate={{ y: 0, rotate: -15 }} transition={{ delay: 0.1 }} className="text-5xl drop-shadow-lg">⭐</motion.div>
                <motion.div initial={{ y: 20 }} animate={{ y: -10 }} transition={{ delay: 0.2 }} className="text-6xl drop-shadow-lg z-10">⭐</motion.div>
                <motion.div initial={{ y: 20, rotate: 20 }} animate={{ y: 0, rotate: 15 }} transition={{ delay: 0.3 }} className="text-5xl drop-shadow-lg">⭐</motion.div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-3xl font-black text-[#5C4033] mb-1">Flawless!</h2>
                <p className="text-[#B47B44] mb-6 font-bold">Challenge Cleared. +{Math.floor(score/10)} IQ earned!</p>
                
                <div className="bg-white/60 rounded-2xl p-4 space-y-3 mb-8">
                  <div className="flex justify-between items-center text-[#5C4033] font-bold">
                    <span className="text-stone-500">Difficulty</span>
                    <span>{levelIndex > 10 ? 'Super Hard' : levelIndex > 5 ? 'Hard' : 'Normal'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#5C4033] font-bold">
                    <span className="text-stone-500">Time</span>
                    <span>{Math.floor(timeElapsed / 60).toString().padStart(2, '0')}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#5C4033] font-bold">
                    <span className="text-stone-500">Score</span>
                    <span>{score}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#5C4033] font-bold">
                    <span className="text-stone-500">Today's Levels</span>
                    <span>{levelIndex + 1}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={nextLevel}
                  className="w-full py-4 bg-[#B47B44] hover:bg-[#9B6A3A] text-white rounded-2xl font-bold text-xl shadow-lg transition-all active:scale-95"
                >
                  Next Level
                </button>
                <button 
                  onClick={() => navigate(-1)}
                  className="w-full py-4 bg-[#E6DCC5] hover:bg-[#D5C9AE] text-[#8C6036] rounded-2xl font-bold text-xl transition-all active:scale-95"
                >
                  Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {gameState === 'lost' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-red-500 text-4xl">heart_broken</span>
              </div>
              <h2 className="text-2xl font-black text-stone-800 mb-2">રમત પૂરી!</h2>
              <p className="text-stone-500 mb-8 font-bold">તમારી એનર્જી પૂરી થઈ ગઈ.</p>
              
              <button 
                onClick={watchAdForLives}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">play_circle</span>
                3 એનર્જી પાછી મેળવો
              </button>
              
              <button 
                onClick={retryLevel}
                className="w-full py-4 bg-stone-100 text-stone-700 rounded-xl font-bold text-lg hover:bg-stone-200 transition-all active:scale-95"
              >
                ફરી શરૂ કરો
              </button>
            </motion.div>
          </motion.div>
        )}

        {showLeaderboard && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="absolute inset-0 z-50 bg-stone-900/95 overflow-y-auto flex flex-col justify-center"
          >
            <div className="p-4 max-w-lg mx-auto w-full max-h-screen pb-10">
              <LeaderboardUnified 
                title="તીરંદાજી લીડરબોર્ડ"
                icon="target"
                data={leaderboardData}
                scoreLabel="સ્કોર"
                theme="default"
                onClose={() => setShowLeaderboard(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
