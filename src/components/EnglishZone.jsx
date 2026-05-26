import { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio';
import {
  WORD_EMOJI_PAIRS,
  COMPLETE_SENTENCES,
  TRANSLATION_PAIRS,
  SCRAMBLE_WORDS,
  SPEED_WORDS,
  SENTENCE_BUILDER_DATA,
  DAILY_CONVERSATIONS
} from '../data/englishDatabase';

// Local coins synchronizer
const getCoins = () => parseInt(localStorage.getItem('sanskar_coins') || '100');
const addCoins = (amount) => {
  const cur = getCoins() + amount;
  localStorage.setItem('sanskar_coins', cur.toString());
  window.dispatchEvent(new Event('coins-updated'));
  return cur;
};

// Local toast helper
const triggerToast = (message) => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
};

// XP & Level calculations
const getXP = () => parseInt(localStorage.getItem('sanskar_english_xp') || '0');
const addXP = (amount) => {
  const cur = getXP() + amount;
  localStorage.setItem('sanskar_english_xp', cur.toString());
  window.dispatchEvent(new CustomEvent('xp-updated', { detail: { xp: cur } }));
  return cur;
};

const getLevelInfo = (xp) => {
  if (xp < 500) return { level: 1, name: 'Beginner', title: 'Beginner (નવોદિત) 👶', maxXP: 500, prevXP: 0, badge: '👶' };
  if (xp < 1500) return { level: 2, name: 'Elementary', title: 'Elementary (પ્રાથમિક) 👦', maxXP: 1500, prevXP: 500, badge: '👦' };
  if (xp < 4000) return { level: 3, name: 'Intermediate', title: 'Intermediate (મધ્યમ) 🧑', maxXP: 4000, prevXP: 1500, badge: '🧑' };
  if (xp < 9000) return { level: 4, name: 'Upper-Intermediate', title: 'Upper-Intermediate (ઉચ્ચ-મધ્યમ) 👨', maxXP: 9000, prevXP: 4000, badge: '👨' };
  if (xp < 18000) return { level: 5, name: 'Advanced', title: 'Advanced (ઉચ્ચ) 🎓', maxXP: 18000, prevXP: 9000, badge: '🎓' };
  return { level: 6, name: 'Expert', title: 'Expert (તજજ્ઞ) 👑', maxXP: 100000, prevXP: 18000, badge: '👑' };
};

export default function EnglishZone({ onBack }) {
  const [xp, setXp] = useState(getXP());
  const [coins, setCoins] = useState(getCoins());
  const [activeSubGame, setActiveSubGame] = useState(null);
  const [showCertificate, setShowCertificate] = useState(null); // stores level info for certificate
  const [userName, setUserName] = useState(() => localStorage.getItem('sanskar_username') || '');
  const [dailyCompleted, setDailyCompleted] = useState(() => localStorage.getItem('sanskar_daily_english_completed') === new Date().toDateString());

  useEffect(() => {
    const handleXP = () => setXp(getXP());
    const handleCoins = () => setCoins(getCoins());
    window.addEventListener('xp-updated', handleXP);
    window.addEventListener('coins-updated', handleCoins);
    return () => {
      window.removeEventListener('xp-updated', handleXP);
      window.removeEventListener('coins-updated', handleCoins);
    };
  }, []);

  const levelInfo = getLevelInfo(xp);
  const progressPercent = Math.min(100, Math.max(0, ((xp - levelInfo.prevXP) / (levelInfo.maxXP - levelInfo.prevXP)) * 100));

  const handleBackToHub = () => {
    playSound('click');
    if (activeSubGame) {
      setActiveSubGame(null);
    } else {
      onBack();
    }
  };

  const startDailyChallenge = () => {
    playSound('click');
    if (dailyCompleted) {
      triggerToast("✨ તમે આજનો ડેઇલી ચેલેન્જ પૂર્ણ કરી લીધો છે! આવતીકાલે ફરી આવો.");
      return;
    }
    setActiveSubGame('daily_challenge');
  };

  return (
    <div className="space-y-6">
      {/* English Hub Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 font-bold text-[120px] select-none translate-y-[-10px] translate-x-[20px]">
          📝
        </div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBackToHub}
              className="h-8 px-3 bg-white/10 hover:bg-white/20 dark:bg-stone-800 rounded-lg flex items-center gap-1 font-gujarati text-[10px] font-bold text-white transition shrink-0"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span> પાછા
            </button>
            <h2 className="font-gujarati font-black text-xl">ઇંગ્લિશ શીખો 🎓</h2>
          </div>
          <p className="font-gujarati text-xs text-indigo-200">રમતો રમતા રમતા સરળતાથી ઇંગ્લિશ પાકું કરો!</p>
        </div>

        {/* User Stats Box */}
        <div className="flex gap-3 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 min-w-[70px] text-center">
            <p className="text-[9px] text-indigo-200 font-bold tracking-wider">XP સ્કોર</p>
            <h4 className="font-headline font-black text-lg text-amber-300">🌟 {xp}</h4>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 min-w-[90px] text-center">
            <p className="text-[9px] text-indigo-200 font-bold tracking-wider">લેવલ</p>
            <h4 className="font-gujarati font-black text-xs text-white truncate flex items-center justify-center gap-1">
              <span>{levelInfo.badge}</span> {levelInfo.name}
            </h4>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!activeSubGame && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between text-xs font-bold font-gujarati text-stone-500 mb-1.5">
            <span>લેવલ પ્રગતિ:</span>
            <span>{xp} / {levelInfo.maxXP} XP</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-3.5 rounded-full overflow-hidden border border-stone-200/40 dark:border-stone-700/40">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="font-gujarati text-[10px] text-stone-400 mt-2 text-center">
            અન્ય રમતો રમીને વધુ XP મેળવો અને આગલું લેવલ અને પ્રમાણપત્ર અનલોક કરો!
          </p>
        </div>
      )}

      {/* Main View Router */}
      {!activeSubGame ? (
        <div className="space-y-6">
          {/* Daily Challenge Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 rounded-3xl text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-gujarati font-black text-lg">આજનો ડેઇલી ચેલેન્જ! 🏆</h3>
              <p className="font-gujarati text-xs text-amber-100">૧૦ વિવિધ પ્રશ્નોના જવાબો આપીને બોનસ +૫૦ XP મેળવો!</p>
            </div>
            <button
              onClick={startDailyChallenge}
              disabled={dailyCompleted}
              className={`px-6 py-3.5 rounded-2xl font-gujarati font-bold text-sm shadow-md active:scale-95 transition whitespace-nowrap ${
                dailyCompleted 
                  ? 'bg-amber-700/40 text-amber-200/80 cursor-not-allowed border border-white/5' 
                  : 'bg-white hover:bg-amber-50 text-orange-600 border border-amber-250'
              }`}
            >
              {dailyCompleted ? 'પૂર્ણ થયેલ છે ✓' : 'ચેલેન્જ શરૂ કરો 🚀'}
            </button>
          </div>

          {/* Games Grid */}
          <div className="space-y-3">
            <h3 className="font-gujarati font-black text-base text-stone-700 dark:text-stone-200">અંગ્રેજી રમતો 🎮</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <GameCard 
                id="word_emoji" 
                title="🃏 શબ્દ-ઇમોજી જોડી" 
                desc="ઇમોજી કાર્ડ્સ ફ્લિપ કરીને અંગ્રેજી શબ્દો શોધો" 
                color="from-sky-400 to-blue-500"
                onClick={() => setActiveSubGame('word_emoji')} 
              />
              <GameCard 
                id="complete_sentence" 
                title="✍️ વાક્ય પૂર્ણ કરો" 
                desc="ખાલી જગ્યા પૂરીને અંગ્રેજી વ્યાકરણ શીખો" 
                color="from-emerald-400 to-teal-500"
                onClick={() => setActiveSubGame('complete_sentence')} 
              />
              <GameCard 
                id="translation" 
                title="🌐 અનુવાદ ચેલેન્જ" 
                desc="ગુજરાતીથી અંગ્રેજી અને અંગ્રેજીથી ગુજરાતી કસોટી" 
                color="from-amber-400 to-orange-500"
                onClick={() => setActiveSubGame('translation')} 
              />
              <GameCard 
                id="scramble" 
                title="🔤 શબ્દ સ્ક્રૅમ્બલ" 
                desc="આડાઅવળા અક્ષરો ગોઠવી સાચો શબ્દ બનાવો" 
                color="from-rose-400 to-pink-500"
                onClick={() => setActiveSubGame('scramble')} 
              />
              <GameCard 
                id="speed_vocab" 
                title="⚡ સ્પીડ વોકેબ્યુલરી" 
                desc="ફટાફટ ૨ સેકન્ડમાં સાચો સ્પેલિંગ અર્થ ઓળખો" 
                color="from-indigo-400 to-purple-500"
                onClick={() => setActiveSubGame('speed_vocab')} 
              />
              <GameCard 
                id="sentence_builder" 
                title="🏗️ વાક્ય બનાવો" 
                desc="શબ્દોને ક્રમમાં જોડી સુંદર વાક્ય ગોઠવો" 
                color="from-fuchsia-400 to-pink-600"
                onClick={() => setActiveSubGame('sentence_builder')} 
              />
              <GameCard 
                id="conversation" 
                title="💬 રોજિંદી વાતચીત" 
                desc="ડોક્ટર, દુકાનદાર અને બેંકમાં અંગ્રેજી ચર્ચા પૂરી કરો" 
                color="from-cyan-400 to-blue-600"
                onClick={() => setActiveSubGame('conversation')} 
              />
            </div>
          </div>

          {/* Certificate & Achievements Center */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-gujarati font-black text-sm text-stone-750 dark:text-stone-200">અંગ્રેજી લેવલ અને સર્ટિફિકેટ્સ 🏆</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <LevelBadge lvl={1} title="Beginner" label="નવોદિત 👶" req={0} currentXP={xp} onGetCert={() => setShowCertificate(1)} />
              <LevelBadge lvl={2} title="Elementary" label="પ્રાથમિક 👦" req={500} currentXP={xp} onGetCert={() => setShowCertificate(2)} />
              <LevelBadge lvl={3} title="Intermediate" label="મધ્યમ 🧑" req={1500} currentXP={xp} onGetCert={() => setShowCertificate(3)} />
              <LevelBadge lvl={4} title="Upper-Intermediate" label="ઉચ્ચ-મધ્યમ 👨" req={4000} currentXP={xp} onGetCert={() => setShowCertificate(4)} />
              <LevelBadge lvl={5} title="Advanced" label="ઉચ્ચ 🎓" req={9000} currentXP={xp} onGetCert={() => setShowCertificate(5)} />
              <LevelBadge lvl={6} title="Expert" label="તજજ્ઞ 👑" req={18000} currentXP={xp} onGetCert={() => setShowCertificate(6)} />
            </div>
          </div>
        </div>
      ) : (
        /* Sub Game Renderer Container */
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-xl relative min-h-[400px] flex flex-col justify-center">
          <div className="absolute left-6 top-6 z-20">
            <button 
              onClick={handleBackToHub}
              className="h-9 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg flex items-center gap-1 font-gujarati text-[10px] font-bold text-stone-600 dark:text-stone-300 transition"
            >
              <span className="material-symbols-outlined text-xs">arrow_back</span> પાછા જાઓ
            </button>
          </div>

          <div className="pt-8">
            {activeSubGame === 'word_emoji' && <WordEmojiMatchGame />}
            {activeSubGame === 'complete_sentence' && <CompleteSentenceGame />}
            {activeSubGame === 'translation' && <TranslationChallengeGame />}
            {activeSubGame === 'scramble' && <WordScrambleGame />}
            {activeSubGame === 'speed_vocab' && <SpeedVocabularyGame />}
            {activeSubGame === 'sentence_builder' && <SentenceBuilderGame />}
            {activeSubGame === 'conversation' && <DailyConversationGame />}
            {activeSubGame === 'daily_challenge' && (
              <DailyChallengeGame 
                onFinish={() => {
                  setDailyCompleted(true);
                  localStorage.setItem('sanskar_daily_english_completed', new Date().toDateString());
                  setActiveSubGame(null);
                }} 
              />
            )}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-amber-50 dark:bg-stone-900 border-4 border-amber-400 rounded-3xl p-6 max-w-lg w-full text-center shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowCertificate(null)}
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-650 dark:text-stone-300"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 space-y-4">
              <h2 className="text-amber-600 font-headline font-black text-2xl tracking-widest">ENGLISH ZONE CERTIFICATE</h2>
              <p className="font-gujarati text-xs text-stone-500">ગુજરાતી એપ — ઇંગ્લિશ રમત પ્રવાસી</p>
              
              <div className="text-4xl py-2">🏆</div>
              
              <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300">આથી પ્રમાણિત કરવામાં આવે છે કે</p>
              
              {/* Name Input / Output */}
              <div className="py-2">
                {userName ? (
                  <h3 className="font-gujarati font-black text-xl text-stone-900 dark:text-white underline decoration-amber-500 decoration-2 underline-offset-4">
                    {userName}
                  </h3>
                ) : (
                  <div className="max-w-xs mx-auto space-y-2">
                    <input 
                      type="text" 
                      placeholder="તમારું આખું નામ લખો..." 
                      className="w-full px-3 py-2 border rounded-xl text-center font-gujarati text-xs focus:outline-none focus:border-amber-400"
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserName(val);
                        localStorage.setItem('sanskar_username', val);
                      }}
                    />
                    <p className="font-gujarati text-[9px] text-stone-400">નામ લખો એટલે સર્ટિફિકેટ જનરેટ થઈ જશે</p>
                  </div>
                )}
              </div>

              <p className="font-gujarati text-xs text-stone-650 dark:text-stone-400 px-4 leading-normal">
                એ સફળતાપૂર્વક **English {getLevelInfo(showCertificate === 1 ? 0 : showCertificate === 2 ? 500 : showCertificate === 3 ? 1500 : showCertificate === 4 ? 4000 : showCertificate === 5 ? 9000 : 18000).name}** લેવલ પૂર્ણ કરીને અંગ્રેજી ભાષા શીખવાનો વિજય પ્રાપ્ત કર્યો છે.
              </p>

              <div className="pt-4 flex justify-between items-center text-[10px] text-stone-400 font-gujarati">
                <div>
                  <p className="border-t border-stone-300 pt-1">તારીખ: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-600 font-bold">ENGLISH ZONE</p>
                  <p className="border-t border-stone-300 pt-1">ગુજરાતી એપ કમિટી</p>
                </div>
              </div>
            </div>

            {/* Share to WhatsApp */}
            <button
              onClick={() => {
                playSound('click');
                const text = `🏆 મેં ગુજરાતી એપના English Zone માં English ${getLevelInfo(showCertificate === 1 ? 0 : showCertificate === 2 ? 500 : showCertificate === 3 ? 1500 : showCertificate === 4 ? 4000 : showCertificate === 5 ? 9000 : 18000).name} લેવલનું સર્ટિફિકેટ મેળવ્યું છે! તમે પણ ઇંગ્લિશ રમતો રમીને શીખો.`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
              }}
              disabled={!userName}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-gujarati font-bold text-xs py-3 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>💬</span> વૉટ્સએપ પર શેર કરો
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   SUB COMPONENT: GAME CARD
   ======================================================== */
function GameCard({ title, desc, color, onClick }) {
  return (
    <button
      onClick={() => { playSound('click'); onClick(); }}
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 rounded-[2rem] hover:border-indigo-500/50 hover:shadow-lg transition-all active:scale-[0.98] text-left flex gap-4 items-center group relative overflow-hidden"
    >
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} text-white flex items-center justify-center text-xl shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
        {title.split(' ')[0]}
      </div>
      <div className="space-y-1 pr-6">
        <h4 className="font-gujarati font-black text-sm text-stone-800 dark:text-stone-100">{title.split(' ').slice(1).join(' ')}</h4>
        <p className="font-gujarati text-[11px] text-stone-500 dark:text-stone-400 leading-tight">{desc}</p>
      </div>
      <span className="material-symbols-outlined absolute right-4 text-stone-300 dark:text-stone-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all">chevron_right</span>
    </button>
  );
}

/* ========================================================
   SUB COMPONENT: LEVEL BADGE
   ======================================================== */
function LevelBadge({ lvl, title, label, req, currentXP, onGetCert }) {
  const isUnlocked = currentXP >= req;
  return (
    <div className={`border p-3.5 rounded-2xl text-center space-y-2 relative flex flex-col justify-between ${
      isUnlocked 
        ? 'bg-amber-50/50 border-amber-250 dark:bg-stone-950/40 dark:border-amber-900/40' 
        : 'bg-stone-50/50 border-stone-200 dark:bg-stone-950/10 dark:border-stone-850 opacity-60'
    }`}>
      <div>
        <p className="font-gujarati text-[10px] font-bold text-stone-500">Lvl {lvl}</p>
        <h4 className="font-headline font-black text-sm text-stone-800 dark:text-stone-200 mt-0.5">{title}</h4>
        <p className="font-gujarati text-[10px] text-stone-550 dark:text-stone-400 mt-1">{label}</p>
      </div>
      
      {isUnlocked ? (
        <button
          onClick={onGetCert}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-gujarati text-[9px] font-bold py-1.5 rounded-lg transition active:scale-95 shadow-xs"
        >
          સર્ટિફિકેટ 🏆
        </button>
      ) : (
        <div className="text-[9px] font-gujarati text-stone-400 bg-stone-100 dark:bg-stone-800 py-1 rounded-lg">
          🔒 {req} XP
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 1: WORD-EMOJI MATCH (MEMORY GAME)
   ======================================================== */
function WordEmojiMatchGame() {
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(null); // 'easy' (6 pairs), 'medium' (8 pairs), 'hard' (10 pairs)
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIndices, setMatchedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const timerRef = useRef(null);

  const CATEGORIES = [
    { id: 'animals', name: 'પ્રાણીઓ 🦁' },
    { id: 'fruits', name: 'ફળો 🥭' },
    { id: 'vegetables', name: 'શાકભાજી 🧅' },
    { id: 'colors', name: 'રંગો 🔴' },
    { id: 'body', name: 'શરીરના અંગો 👁️' },
    { id: 'home', name: 'ઘરની વસ્તુઓ 🚪' },
    { id: 'school', name: 'શાળા/ઓફિસ 📚' }
  ];

  const startNewGame = (selectedCat, selectedDiff) => {
    playSound('click');
    setCategory(selectedCat);
    setDifficulty(selectedDiff);
    
    // Filter database items
    const filtered = WORD_EMOJI_PAIRS.filter(item => item.category === selectedCat);
    const shuffledDb = [...filtered].sort(() => Math.random() - 0.5);
    
    let pairCount = 6;
    let initialTimer = 0;
    
    if (selectedDiff === 'easy') {
      pairCount = 6;
      initialTimer = 0; // no timer
    } else if (selectedDiff === 'medium') {
      pairCount = 8;
      initialTimer = 60;
    } else if (selectedDiff === 'hard') {
      pairCount = 10;
      initialTimer = 45;
    }

    const selectedPairs = shuffledDb.slice(0, pairCount);
    
    // Create card structures
    // For each pair, card A is English word + emoji, card B is also English word + emoji
    // (Or we can make card A have just emoji and card B have just word to make it a true match)
    // The request: "CAT 🐱" ↔ "CAT 🐱". So they show the same.
    const deck = [];
    selectedPairs.forEach((item, idx) => {
      deck.push({ id: `a-${idx}`, label: `${item.english} ${item.emoji}`, translation: item.gujarati, pairId: idx });
      deck.push({ id: `b-${idx}`, label: `${item.english} ${item.emoji}`, translation: item.gujarati, pairId: idx });
    });

    const shuffledDeck = deck.sort(() => Math.random() - 0.5);
    setCards(shuffledDeck);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setGameOver(false);
    setScore(0);
    setTimer(initialTimer);

    if (initialTimer > 0) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            playSound('wrong');
            setGameOver(true);
            return 0;
          }
          if (prev <= 6) playSound('tick');
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleCardClick = (index) => {
    if (flippedIndices.includes(index) || matchedIndices.includes(index) || gameOver) return;
    playSound('click');

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const card1 = cards[nextFlipped[0]];
      const card2 = cards[nextFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // Match!
        playSound('correct');
        const nextMatched = [...matchedIndices, nextFlipped[0], nextFlipped[1]];
        setMatchedIndices(nextMatched);
        setFlippedIndices([]);
        setScore(prev => prev + 10);
        addXP(2);

        if (nextMatched.length === cards.length) {
          // Completed!
          clearInterval(timerRef.current);
          playSound('correct');
          addCoins(10);
          addXP(15);
          setGameOver(true);
        }
      } else {
        // Miss match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  // Step 1: Select Category & Difficulty
  if (!category || !difficulty) {
    return (
      <div className="space-y-6 max-w-md mx-auto py-2 text-center">
        <h3 className="font-gujarati font-black text-lg">શબ્દ-ઇમોજી જોડી 🃏</h3>
        <p className="font-gujarati text-xs text-stone-500">અંગ્રેજી શબ્દો અને ચિત્રો ઓળખી કાર્ડ્સની જોડી બનાવો:</p>
        
        <div className="space-y-3 pt-2 text-left">
          <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">૧. કેટેગરી પસંદ કરો:</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`py-3.5 border rounded-2xl text-center font-gujarati text-xs font-black transition ${
                  category === cat.id 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-850 text-stone-700 dark:text-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {category && (
          <div className="space-y-3 pt-4 text-left animate-fade-in">
            <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">૨. મુશ્કેલી પસંદ કરો:</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => startNewGame(category, 'easy')}
                className="py-3 bg-emerald-600 text-white rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
              >
                સરળ (૬ જોડી)
              </button>
              <button 
                onClick={() => startNewGame(category, 'medium')}
                className="py-3 bg-amber-500 text-white rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
              >
                મધ્યમ (૬૦સે)
              </button>
              <button 
                onClick={() => startNewGame(category, 'hard')}
                className="py-3 bg-rose-600 text-white rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
              >
                કઠિન (૪૫સે)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const isWin = matchedIndices.length === cards.length && cards.length > 0;

  return (
    <div className="space-y-6 max-w-md mx-auto py-2 text-center">
      <div className="flex justify-between items-center px-2 font-gujarati text-xs text-stone-500">
        <span>મુશ્કેલી: {difficulty === 'easy' ? 'સરળ' : difficulty === 'medium' ? 'મધ્યમ' : 'કઠિન'}</span>
        {difficulty !== 'easy' && (
          <span className={`font-black ${timer <= 5 ? 'text-rose-500 animate-pulse' : 'text-stone-600'}`}>
            સમય: {toGujaratiNum(timer)} સેકન્ડ
          </span>
        )}
      </div>

      {!gameOver ? (
        <div className={`grid gap-2.5 ${difficulty === 'hard' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedIndices.includes(idx);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl font-gujarati transition-all duration-300 transform active:scale-95 border flex flex-col justify-center items-center p-1.5 ${
                  isFlipped 
                    ? 'bg-indigo-600 border-indigo-700 text-white rotate-y-180' 
                    : 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-stone-850 dark:to-stone-900 border-stone-250 dark:border-stone-800 text-transparent'
                }`}
              >
                {isFlipped ? (
                  <>
                    <span className="font-headline font-black text-xs md:text-sm leading-normal">{card.label.split(' ')[0]}</span>
                    <span className="text-xl md:text-2xl mt-1">{card.label.split(' ')[1]}</span>
                    <span className="text-[8px] opacity-80 mt-1">{card.translation}</span>
                  </>
                ) : (
                  <span className="text-2xl opacity-60 text-indigo-700 dark:text-indigo-300 font-bold">❓</span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {isWin ? (
            <>
              <p className="text-4xl">🏆</p>
              <h4 className="font-gujarati font-black text-lg text-emerald-600">અભિનંદન! તમે બધી જ જોડી શોધી લીધી છે.</h4>
              <p className="font-gujarati text-xs text-stone-500">મેળવેલા કોઈન્સ: +૧૦ | બોનસ: +૧૫ XP 🌟</p>
            </>
          ) : (
            <>
              <p className="text-4xl">⏰</p>
              <h4 className="font-gujarati font-black text-lg text-rose-500">સમય પૂરો થઈ ગયો!</h4>
              <p className="font-gujarati text-xs text-stone-500">ફરીથી પ્રયાસ કરો અને લેવલ પૂર્ણ કરો.</p>
            </>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => { setCategory(null); setDifficulty(null); }}
              className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-gujarati text-stone-650 dark:text-stone-300 py-3 rounded-2xl text-xs font-bold transition"
            >
              મુખ્ય મેનુ 🏠
            </button>
            <button
              onClick={() => startNewGame(category, difficulty)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-gujarati py-3 rounded-2xl text-xs font-bold transition shadow-md"
            >
              ફરીથી રમો 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 2: COMPLETE THE SENTENCE
   ======================================================== */
function CompleteSentenceGame() {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    // Pick 5 random complete sentence questions
    const shuffled = [...COMPLETE_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setQIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setGameFinished(false);
  }, []);

  const handleSelect = (option) => {
    if (selectedOpt) return;
    playSound('click');
    setSelectedOpt(option);
    setShowExplanation(true);
    
    const correct = option === questions[qIdx].blankWord;
    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
      addXP(5);
    } else {
      playSound('wrong');
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      // Finished
      playSound('correct');
      addCoins(5);
      addXP(15);
      setGameFinished(true);
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (questions.length === 0) return null;
  const current = questions[qIdx];

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">વાક્ય પૂર્ણ કરો ✍️</h3>
      
      {!gameFinished ? (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center text-xs font-gujarati text-stone-500">
            <span>પ્રશ્ન: {toGujaratiNum(qIdx + 1)} / {toGujaratiNum(questions.length)}</span>
            <span>સાચા: {toGujaratiNum(score)}</span>
          </div>

          {/* Question Sentence */}
          <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 shadow-md">
            <h4 className="text-lg font-headline font-black text-stone-850 dark:text-stone-100 leading-normal tracking-wide">
              {current.sentence}
            </h4>
            <p className="font-gujarati text-xs text-stone-400 mt-2">ગુજરાતી સંકેત: "{current.gujaratiHint}"</p>
          </div>

          {/* Options list */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                disabled={selectedOpt !== null}
                className={`py-3.5 px-4 rounded-2xl border text-center font-headline font-black text-sm transition active:scale-95 ${
                  selectedOpt === null 
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                    : opt === current.blankWord 
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                      : opt === selectedOpt 
                        ? 'bg-rose-500 border-rose-600 text-white' 
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-450 border-stone-200 dark:border-stone-850'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Explanation in Gujarati */}
          {showExplanation && (
            <div className="bg-indigo-50 dark:bg-stone-850/40 border border-indigo-100 dark:border-stone-800 p-4 rounded-2xl space-y-3 animate-fade-in">
              <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-300 leading-normal">
                **સ્પષ્ટીકરણ:** {current.explanation}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-gujarati text-[10px] font-bold text-emerald-600">
                  {selectedOpt === current.blankWord ? '🎉 સાચો જવાબ! +૫ XP' : '❌ ઉત્તર ખોટો છે'}
                </span>
                <button
                  onClick={nextQuestion}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
                >
                  આગળ વધો ➡️
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🎉</p>
          <h4 className="font-gujarati font-black text-lg text-emerald-600">રમત પૂર્ણ થઈ!</h4>
          <p className="font-gujarati text-xs text-stone-500">સાચા જવાબો: {toGujaratiNum(score)} / {toGujaratiNum(questions.length)}</p>
          <p className="font-gujarati text-xs text-stone-500">મળેલા કોઈન્સ: +૫ | બોનસ: +૧૫ XP 🌟</p>
          
          <button
            onClick={() => {
              const shuffled = [...COMPLETE_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 5);
              setQuestions(shuffled);
              setQIdx(0);
              setSelectedOpt(null);
              setShowExplanation(false);
              setScore(0);
              setGameFinished(false);
            }}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            ફરીથી રમો 🔄
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 3: TRANSLATION CHALLENGE
   ======================================================== */
function TranslationChallengeGame() {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    // Pick 5 random translation challenge questions
    const shuffled = [...TRANSLATION_PAIRS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setQIdx(0);
    setSelectedOpt(null);
    setShowFeedback(false);
    setScore(0);
    setGameFinished(false);
  }, []);

  const handleSelect = (option) => {
    if (selectedOpt) return;
    playSound('click');
    setSelectedOpt(option);
    setShowFeedback(true);
    
    const target = questions[qIdx].direction === 'gu-en' ? questions[qIdx].english : questions[qIdx].gujarati;
    const correct = option === target;
    
    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
      addXP(5);
    } else {
      playSound('wrong');
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowFeedback(false);
    } else {
      playSound('correct');
      addCoins(5);
      addXP(10);
      setGameFinished(true);
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (questions.length === 0) return null;
  const current = questions[qIdx];
  const target = current.direction === 'gu-en' ? current.english : current.gujarati;

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">અનુવાદ ચેલેન્જ 🌐</h3>
      
      {!gameFinished ? (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center text-xs font-gujarati text-stone-500">
            <span>પ્રશ્ન: {toGujaratiNum(qIdx + 1)} / {toGujaratiNum(questions.length)}</span>
            <span>સાચા: {toGujaratiNum(score)}</span>
          </div>

          {/* Question box */}
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
            <p className="font-gujarati text-xs opacity-75">
              {current.direction === 'gu-en' ? 'આ ગુજરાતી શબ્દનો સાચો અંગ્રેજી શબ્દ કયો છે?' : 'આ અંગ્રેજી શબ્દનો સાચો ગુજરાતી અર્થ કયો છે?'}
            </p>
            <h4 className={`font-black text-3xl mt-2 tracking-wide ${current.direction === 'gu-en' ? 'font-gujarati' : 'font-headline'}`}>
              {current.direction === 'gu-en' ? current.gujarati : current.english}
            </h4>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                disabled={selectedOpt !== null}
                className={`py-3.5 px-4 rounded-2xl border text-center transition active:scale-95 text-sm ${
                  current.direction === 'gu-en' ? 'font-headline font-black' : 'font-gujarati font-bold'
                } ${
                  selectedOpt === null 
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                    : opt === target 
                      ? 'bg-emerald-500 border-emerald-600 text-white' 
                      : opt === selectedOpt 
                        ? 'bg-rose-500 border-rose-600 text-white' 
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-450 border-stone-200 dark:border-stone-850'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="bg-stone-50 dark:bg-stone-850/40 border border-stone-100 dark:border-stone-800 p-4 rounded-2xl flex justify-between items-center animate-fade-in">
              <span className="font-gujarati text-[10px] font-bold text-emerald-600">
                {selectedOpt === target ? `🎉 સાચો જવાબ! +૫ XP` : `❌ ખોટો જવાબ. સાચો ઉત્તર: ${target}`}
              </span>
              <button
                onClick={nextQuestion}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
              >
                આગળ વધો ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🏆</p>
          <h4 className="font-gujarati font-black text-lg text-emerald-600">અનુવાદ ચેલેન્જ પૂરો!</h4>
          <p className="font-gujarati text-xs text-stone-500">સાચા જવાબો: {toGujaratiNum(score)} / {toGujaratiNum(questions.length)}</p>
          <p className="font-gujarati text-xs text-stone-500">મળેલા કોઈન્સ: +૫ | બોનસ: +૧૦ XP 🌟</p>
          
          <button
            onClick={() => {
              const shuffled = [...TRANSLATION_PAIRS].sort(() => Math.random() - 0.5).slice(0, 5);
              setQuestions(shuffled);
              setQIdx(0);
              setSelectedOpt(null);
              setShowFeedback(false);
              setScore(0);
              setGameFinished(false);
            }}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            ફરીથી રમો 🔄
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 4: WORD SCRAMBLE
   ======================================================== */
function WordScrambleGame() {
  const [activeItem, setActiveItem] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [slots, setSlots] = useState([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const timerRef = useRef(null);

  const selectWord = () => {
    const rWord = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
    setActiveItem(rWord);
    
    // Jumble letters
    const letters = rWord.word.split('');
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    while (shuffled.join('') === rWord.word) {
      shuffled = [...letters].sort(() => Math.random() - 0.5);
    }
    
    setTiles(shuffled.map((letter, idx) => ({ id: idx, letter, used: false })));
    setSlots([]);
    setTimer(30);
    setHintUsed(false);
    setGameOver(false);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          playSound('wrong');
          setGameOver(true);
          return 0;
        }
        if (prev <= 6) playSound('tick');
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    selectWord();
    return () => clearInterval(timerRef.current);
  }, []);

  const handleTileClick = (tileId, letter) => {
    if (gameOver) return;
    playSound('click');
    
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setSlots(prev => [...prev, { tileId, letter }]);
  };

  const handleSlotClick = (slotIdx, tileId) => {
    if (gameOver) return;
    playSound('click');
    
    setSlots(prev => prev.filter((_, idx) => idx !== slotIdx));
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: false } : t));
  };

  const checkAnswer = () => {
    const userWord = slots.map(s => s.letter).join('');
    if (userWord.toLowerCase().trim() === activeItem.word.toLowerCase().trim()) {
      clearInterval(timerRef.current);
      playSound('correct');
      setScore(prev => prev + 1);
      addCoins(5);
      addXP(15);
      setGameOver(true);
    } else {
      playSound('wrong');
      triggerToast("❌ જવાબ ખોટો છે! અક્ષરો સાફ કરીને ફરી પ્રયત્ન કરો.");
    }
  };

  const useHint = () => {
    if (hintUsed || xp < 5) return;
    playSound('click');
    addXP(-5);
    setHintUsed(true);
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (!activeItem) return null;
  const wordMatch = slots.map(s => s.letter).join('') === activeItem.word;

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">શબ્દ સ્ક્રૅમ્બલ 🔤</h3>
      
      {!gameOver ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2 font-gujarati text-xs text-stone-500">
            <span>સ્કોર: {toGujaratiNum(score)}</span>
            <span className={`font-black ${timer <= 5 ? 'text-rose-500 animate-pulse' : 'text-stone-600'}`}>
              સમય: {toGujaratiNum(timer)} સેકન્ડ
            </span>
          </div>

          {/* Hint Cards */}
          <div className="bg-stone-50 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-850 rounded-2xl text-left space-y-1.5 shadow-xs">
            <p className="font-gujarati text-xs text-stone-650 dark:text-stone-300">
              ગુજરાતી અર્થ: <span className="font-bold text-indigo-650 dark:text-indigo-400">"{activeItem.gujarati}"</span> {activeItem.emoji}
            </p>
            {hintUsed ? (
              <p className="font-headline text-xs font-black text-emerald-600">
                પ્રથમ અક્ષર: "{activeItem.word.substring(0, 2)}"
              </p>
            ) : (
              <button 
                onClick={useHint} 
                className="text-[9px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-md font-gujarati font-bold transition"
              >
                સંકેત મેળવો 💡 (કિંમત ૫ XP)
              </button>
            )}
          </div>

          {/* Letter Slots */}
          <div className="flex justify-center gap-1.5 min-h-[48px] py-2 border-b border-stone-100 dark:border-stone-850">
            {activeItem.word.split('').map((_, i) => (
              <button
                key={i}
                onClick={() => slots[i] && handleSlotClick(i, slots[i].tileId)}
                className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center font-headline font-black text-sm transition ${
                  slots[i] 
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm' 
                    : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950 animate-pulse'
                }`}
              >
                {slots[i] ? slots[i].letter : ''}
              </button>
            ))}
          </div>

          {/* Jumbled Letter Tiles */}
          <div className="flex flex-wrap justify-center gap-2">
            {tiles.map(tile => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id, tile.letter)}
                disabled={tile.used}
                className={`w-12 h-12 rounded-xl font-headline font-black text-sm border flex items-center justify-center transition active:scale-95 ${
                  tile.used
                    ? 'bg-stone-100 border-stone-200 text-stone-300 dark:bg-stone-950 dark:border-stone-900 dark:text-stone-700'
                    : 'bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-stone-900 dark:border-stone-800 dark:text-white shadow-sm'
                }`}
              >
                {tile.letter}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                playSound('click');
                setSlots([]);
                setTiles(prev => prev.map(t => ({ ...t, used: false })));
              }}
              className="flex-1 border border-stone-200 font-gujarati text-stone-650 dark:text-stone-300 text-xs py-3 rounded-2xl font-bold hover:bg-stone-50 transition"
            >
              સાફ કરો ❌
            </button>
            <button
              onClick={checkAnswer}
              disabled={slots.length < activeItem.word.length}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-gujarati py-3 rounded-2xl text-xs font-bold transition shadow-md active:scale-95"
            >
              તપાસો 🚀
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {wordMatch ? (
            <>
              <p className="text-4xl">🎉</p>
              <h4 className="font-gujarati font-black text-lg text-emerald-600">શાબાશ! ઉત્તર બિલકુલ સાચો છે.</h4>
              <p className="font-headline font-black text-xl text-indigo-600">{activeItem.word} {activeItem.emoji}</p>
              <p className="font-gujarati text-xs text-stone-500">મળેલા કોઈન્સ: +૫ | બોનસ: +૧૫ XP 🌟</p>
            </>
          ) : (
            <>
              <p className="text-4xl">⏰</p>
              <h4 className="font-gujarati font-black text-lg text-rose-500">ખેલ પૂરો! સમય પૂરો થયો.</h4>
              <p className="font-gujarati text-xs text-stone-500">સાચો જવાબ: "{activeItem.word}" {activeItem.emoji}</p>
            </>
          )}
          
          <button
            onClick={selectWord}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            બીજો પૂછો ➡️
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 5: SPEED VOCABULARY
   ======================================================== */
function SpeedVocabularyGame() {
  const [activeItem, setActiveItem] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const wordTimerRef = useRef(null);

  const selectNewWord = () => {
    if (lives <= 0) {
      setGameOver(true);
      return;
    }
    const rWord = SPEED_WORDS[Math.floor(Math.random() * SPEED_WORDS.length)];
    setActiveItem(rWord);
    setShowOptions(false);
    setSelectedOpt(null);

    // Show word for exactly 2 seconds
    clearTimeout(wordTimerRef.current);
    wordTimerRef.current = setTimeout(() => {
      setShowOptions(true);
    }, 2000);
  };

  useEffect(() => {
    selectNewWord();
    return () => clearTimeout(wordTimerRef.current);
  }, [lives]);

  const handleSelect = (option) => {
    if (selectedOpt) return;
    playSound('click');
    setSelectedOpt(option);

    const correct = option === activeItem.meaning;
    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
      addCoins(1);
      addXP(2);
      setTimeout(() => {
        selectNewWord();
      }, 1200);
    } else {
      playSound('wrong');
      setLives(prev => prev - 1);
      setTimeout(() => {
        if (lives - 1 > 0) {
          selectNewWord();
        } else {
          setGameOver(true);
        }
      }, 1200);
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (!activeItem) return null;

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">સ્પીડ વોકેબ્યુલરી ⚡</h3>
      
      {!gameOver ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2 font-gujarati text-xs text-stone-500">
            <span>સ્કોર: {toGujaratiNum(score)}</span>
            <span className="text-rose-500 font-bold tracking-wider">જીવન: {'❤️'.repeat(lives)}</span>
          </div>

          {/* Word Flasher Container */}
          <div className="bg-stone-50 dark:bg-stone-950 rounded-[2rem] border border-stone-200 dark:border-stone-850 p-8 h-40 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
            {!showOptions ? (
              <div className="animate-pulse space-y-1">
                <h4 className="font-headline font-black text-3xl text-indigo-600 dark:text-indigo-400 tracking-widest">{activeItem.word}</h4>
                <p className="font-gujarati text-[9px] text-stone-400">યાદ રાખો (૨ સેકન્ડ)...</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <h4 className="font-headline font-black text-lg text-stone-300 line-through tracking-wider">{activeItem.word}</h4>
                <p className="font-gujarati text-xs text-stone-500">આ શબ્દનો ગુજરાતીમાં અર્થ શું થાય?</p>
              </div>
            )}
          </div>

          {/* Options Grid */}
          {showOptions && (
            <div className="grid grid-cols-2 gap-3 pt-2 animate-fade-in">
              {activeItem.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={selectedOpt !== null}
                  className={`py-3 px-4 rounded-2xl border text-center font-gujarati text-xs font-black transition active:scale-95 ${
                    selectedOpt === null 
                      ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                      : opt === activeItem.meaning 
                        ? 'bg-emerald-500 border-emerald-600 text-white' 
                        : opt === selectedOpt 
                          ? 'bg-rose-500 border-rose-600 text-white' 
                          : 'bg-stone-50 dark:bg-stone-950 text-stone-450 border-stone-200 dark:border-stone-850'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🏁</p>
          <h4 className="font-gujarati font-black text-lg text-rose-500">જીવન પૂરા થયા! ખેલ સમાપ્ત.</h4>
          <p className="font-gujarati text-xs text-stone-500">તમારો સ્કોર: {toGujaratiNum(score)}</p>
          
          <button
            onClick={() => {
              setLives(3);
              setScore(0);
              setGameOver(false);
              selectNewWord();
            }}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            ફરીથી રમો 🔄
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 6: SENTENCE BUILDER
   ======================================================== */
function SentenceBuilderGame() {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [success, setSuccess] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const initQuestion = (list, index) => {
    const current = list[index];
    const shuf = [...current.jumbled].sort(() => Math.random() - 0.5);
    setTiles(shuf.map((word, idx) => ({ id: idx, word, used: false })));
    setSelectedWords([]);
    setSuccess(false);
  };

  useEffect(() => {
    const shufList = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, 3);
    setQuestions(shufList);
    setQIdx(0);
    setGameFinished(false);
    if (shufList.length > 0) {
      initQuestion(shufList, 0);
    }
  }, []);

  const handleTileClick = (tileId, word) => {
    if (success) return;
    playSound('click');

    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setSelectedWords(prev => [...prev, { tileId, word }]);
  };

  const handleSelectedClick = (wordIdx, tileId) => {
    if (success) return;
    playSound('click');

    setSelectedWords(prev => prev.filter((_, idx) => idx !== wordIdx));
    setTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: false } : t));
  };

  const verifySentence = () => {
    const current = questions[qIdx];
    const sentence = selectedWords.map(s => s.word).join(' ').trim();
    
    const cleanUser = sentence.toLowerCase().replace(/\s+/g, ' ');
    const cleanCorrect = current.correct.toLowerCase().replace(/\s+/g, ' ');

    if (cleanUser === cleanCorrect) {
      playSound('correct');
      setSuccess(true);
      addCoins(5);
      addXP(15);
    } else {
      playSound('wrong');
      triggerToast("❌ વાક્ય ખોટું છે! પદોને ફરી ગોઠવો.");
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      initQuestion(questions, qIdx + 1);
    } else {
      playSound('correct');
      setGameFinished(true);
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (questions.length === 0) return null;
  const current = questions[qIdx];

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">વાક્ય બનાવો 🏗️</h3>
      
      {!gameFinished ? (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center text-xs font-gujarati text-stone-500">
            <span>વાક્ય: {toGujaratiNum(qIdx + 1)} / {toGujaratiNum(questions.length)}</span>
            <span>અનુવાદ સંકેત: "{current.gujaratiMeaning}"</span>
          </div>

          {/* Selected Slots Board */}
          <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-[2rem] border border-stone-200 dark:border-stone-850 min-h-[90px] flex flex-wrap gap-2 items-center">
            {selectedWords.length === 0 ? (
              <span className="font-gujarati text-xs text-stone-400 dark:text-stone-600">નીચેના શબ્દો પર લાઈનસર ક્લિક કરીને વાક્ય ગોઠવો...</span>
            ) : (
              selectedWords.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectedClick(idx, item.tileId)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-xl font-headline font-black text-xs shadow-sm hover:bg-indigo-700 transition"
                >
                  {item.word}
                </button>
              ))
            )}
          </div>

          {/* Jumbled Words Tiles */}
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {tiles.map(tile => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id, tile.word)}
                disabled={tile.used}
                className={`px-4 py-2 border rounded-xl font-headline font-black text-xs transition active:scale-95 ${
                  tile.used 
                    ? 'bg-stone-100 border-stone-200 text-stone-300 dark:bg-stone-950 dark:border-stone-900 dark:text-stone-700' 
                    : 'bg-white hover:bg-stone-50 border-stone-200 dark:bg-stone-900 dark:border-stone-800 dark:text-white shadow-xs'
                }`}
              >
                {tile.word}
              </button>
            ))}
          </div>

          {/* Controls */}
          {!success ? (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  playSound('click');
                  setSelectedWords([]);
                  setTiles(prev => prev.map(t => ({ ...t, used: false })));
                }}
                className="flex-1 border border-stone-200 font-gujarati text-stone-650 dark:text-stone-300 text-xs py-3 rounded-2xl font-bold transition hover:bg-stone-50"
              >
                સાફ કરો ❌
              </button>
              <button
                onClick={verifySentence}
                disabled={selectedWords.length < tiles.length}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 text-white font-gujarati py-3 rounded-2xl text-xs font-bold transition shadow-md active:scale-95"
              >
                તપાસો 🚀
              </button>
            </div>
          ) : (
            <div className="bg-indigo-50 dark:bg-stone-850/40 border border-indigo-100 dark:border-stone-800 p-4 rounded-2xl space-y-3 animate-fade-in">
              <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-300 leading-normal">
                **વ્યાકરણ સંકેત:** {current.grammarTip}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="font-gujarati text-[10px] font-bold text-emerald-600">
                  🎉 વાક્ય સાચું છે! +૧૫ XP
                </span>
                <button
                  onClick={nextQuestion}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
                >
                  આગળ વધો ➡️
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🏆</p>
          <h4 className="font-gujarati font-black text-lg text-emerald-600">રમત પૂર્ણ થઈ ગઈ છે!</h4>
          <p className="font-gujarati text-xs text-stone-500">તમે બધા વાક્યો બિલકુલ સાચા ગોઠવ્યા છે.</p>
          
          <button
            onClick={() => {
              const shufList = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, 3);
              setQuestions(shufList);
              setQIdx(0);
              setGameFinished(false);
              if (shufList.length > 0) {
                initQuestion(shufList, 0);
              }
            }}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            ફરીથી રમો 🔄
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME 7: DAILY CONVERSATION
   ======================================================== */
function DailyConversationGame() {
  const [conversations, setConversations] = useState([]);
  const [cIdx, setCIdx] = useState(0);
  const [dIdx, setDIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedChats, setCompletedChats] = useState([]);
  const [score, setScore] = useState(0);
  const [situationFinished, setSituationFinished] = useState(false);

  useEffect(() => {
    const list = [...DAILY_CONVERSATIONS].sort(() => Math.random() - 0.5);
    setConversations(list);
    setCIdx(0);
    setDIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setCompletedChats([]);
    setScore(0);
    setSituationFinished(false);
  }, []);

  if (conversations.length === 0) return null;
  const currentSituation = conversations[cIdx];
  const currentDialogue = currentSituation.dialogues[dIdx];

  const handleSelect = (option) => {
    if (selectedOpt) return;
    playSound('click');
    setSelectedOpt(option);
    setShowExplanation(true);

    const correct = option === currentDialogue.blankWord;
    if (correct) {
      playSound('correct');
      setScore(prev => prev + 1);
      addXP(5);
    } else {
      playSound('wrong');
    }
  };

  const advanceDialogue = () => {
    playSound('click');
    // Save to chat log
    const speakerLabel = currentDialogue.speaker;
    const completedText = currentDialogue.text;
    setCompletedChats(prev => [...prev, { speaker: speakerLabel, text: completedText }]);

    if (dIdx + 1 < currentSituation.dialogues.length) {
      setDIdx(prev => prev + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      // Completed all dialogues in this situation
      playSound('correct');
      addCoins(10);
      addXP(20);
      setSituationFinished(true);
    }
  };

  const nextSituation = () => {
    playSound('click');
    if (cIdx + 1 < conversations.length) {
      setCIdx(prev => prev + 1);
      setDIdx(0);
      setSelectedOpt(null);
      setShowExplanation(false);
      setCompletedChats([]);
      setSituationFinished(false);
    } else {
      triggerToast("✨ તમે બધા પરિદ્રશ્યો પૂર્ણ કર્યા છે!");
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">રોજિંદી વાતચીત 💬</h3>
      <p className="font-gujarati text-xs text-stone-500 font-bold bg-amber-50 dark:bg-stone-950 px-4 py-1.5 rounded-full inline-block">
        પરિસ્થિતિ: {currentSituation.situation}
      </p>

      {!situationFinished ? (
        <div className="space-y-6 text-left">
          {/* Conversational Feed */}
          <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-3xl border border-stone-200 dark:border-stone-850 space-y-3 max-h-[160px] overflow-y-auto no-scrollbar shadow-inner">
            {completedChats.map((chat, idx) => (
              <div key={idx} className={`flex flex-col ${chat.speaker === 'Doctor' || chat.speaker === 'Shopkeeper' ? 'items-start' : 'items-end'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                  chat.speaker === 'Doctor' || chat.speaker === 'Shopkeeper'
                    ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-900 dark:text-white rounded-tl-none'
                    : 'bg-emerald-600 text-white rounded-tr-none font-bold'
                }`}>
                  <p className="font-headline tracking-wide">{chat.text}</p>
                </div>
              </div>
            ))}

            {/* Current Active Bubble */}
            <div className={`flex flex-col ${currentDialogue.speaker === 'Doctor' || currentDialogue.speaker === 'Shopkeeper' ? 'items-start' : 'items-end'}`}>
              <div className={`p-3 rounded-2xl text-xs max-w-[80%] border border-dashed ${
                currentDialogue.speaker === 'Doctor' || currentDialogue.speaker === 'Shopkeeper'
                  ? 'bg-white border-indigo-300 dark:bg-stone-900 dark:border-indigo-800 text-stone-800 dark:text-stone-200 rounded-tl-none'
                  : 'bg-white border-emerald-300 dark:bg-stone-900 dark:border-emerald-800 text-stone-800 dark:text-stone-200 rounded-tr-none'
              }`}>
                <p className="font-headline tracking-wide font-bold italic">{currentDialogue.prompt}</p>
                <p className="font-gujarati text-[9px] text-stone-400 mt-1">સંકેત: {currentDialogue.gujaratiHint}</p>
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentDialogue.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                disabled={selectedOpt !== null}
                className={`py-3 px-4 rounded-2xl border text-center font-headline font-black text-xs transition active:scale-95 ${
                  selectedOpt === null 
                    ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                    : opt === currentDialogue.blankWord 
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                      : opt === selectedOpt 
                        ? 'bg-rose-500 border-rose-600 text-white' 
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-450 border-stone-200 dark:border-stone-850'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="bg-indigo-50 dark:bg-stone-850/40 border border-indigo-100 dark:border-stone-800 p-4 rounded-2xl space-y-3 animate-fade-in">
              <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-300 leading-normal">
                **વધારે માહિતી:** {currentDialogue.explanation}
              </p>
              <div className="flex justify-between items-center pt-1">
                <span className="font-gujarati text-[10px] font-bold text-emerald-600">
                  {selectedOpt === currentDialogue.blankWord ? '🎉 સાચું! +૫ XP' : '❌ ઉત્તર ખોટો છે'}
                </span>
                <button
                  onClick={advanceDialogue}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
                >
                  આગળ વધો ➡️
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">💬</p>
          <h4 className="font-gujarati font-black text-lg text-emerald-600">વાતચીત પૂર્ણ થઈ!</h4>
          <p className="font-gujarati text-xs text-stone-500">તમે આખો ચર્ચા સંવાદ બિલકુલ સાચો પૂરો કર્યો છે.</p>
          <p className="font-gujarati text-xs text-stone-500">મળેલા કોઈન્સ: +૧૦ | બોનસ: +૨૦ XP 🌟</p>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                const list = [...DAILY_CONVERSATIONS].sort(() => Math.random() - 0.5);
                setConversations(list);
                setCIdx(0);
                setDIdx(0);
                setSelectedOpt(null);
                setShowExplanation(false);
                setCompletedChats([]);
                setScore(0);
                setSituationFinished(false);
              }}
              className="flex-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 text-stone-700 py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
            >
              ફરીથી રમો 🔄
            </button>
            {cIdx + 1 < conversations.length && (
              <button
                onClick={nextSituation}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
              >
                બીજી પરિસ્થિતિ ➡️
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   DAILY CHALLENGE MODE
   ======================================================== */
function DailyChallengeGame({ onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [scrambleSlots, setScrambleSlots] = useState([]);
  const [scrambleTiles, setScrambleTiles] = useState([]);
  const [scrambleWordData, setScrambleWordData] = useState(null);
  const [sentenceSlots, setSentenceSlots] = useState([]);
  const [sentenceTiles, setSentenceTiles] = useState([]);
  const [sentenceData, setSentenceData] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Generate 5 random questions of mix types:
    // 2 complete sentences
    // 1 translation
    // 1 scramble
    // 1 sentence builder
    const mix = [];
    const cs = [...COMPLETE_SENTENCES].sort(() => Math.random() - 0.5).slice(0, 2);
    const tr = [...TRANSLATION_PAIRS].sort(() => Math.random() - 0.5).slice(0, 1);
    const sc = [...SCRAMBLE_WORDS].sort(() => Math.random() - 0.5).slice(0, 1);
    const sb = [...SENTENCE_BUILDER_DATA].sort(() => Math.random() - 0.5).slice(0, 1);

    cs.forEach(q => mix.push({ type: 'complete', data: q }));
    tr.forEach(q => mix.push({ type: 'translate', data: q }));
    sc.forEach(q => mix.push({ type: 'scramble', data: q }));
    sb.forEach(q => mix.push({ type: 'builder', data: q }));

    // Shuffle questions
    const finalShuf = mix.sort(() => Math.random() - 0.5);
    setQuestions(finalShuf);
    setQIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  }, []);

  const loadQuestionState = (index) => {
    if (index >= questions.length) return;
    const q = questions[index];
    setSelectedOpt(null);
    setShowExplanation(false);

    if (q.type === 'scramble') {
      const letters = q.data.word.split('');
      const shuf = [...letters].sort(() => Math.random() - 0.5);
      setScrambleWordData(q.data);
      setScrambleTiles(shuf.map((letter, idx) => ({ id: idx, letter, used: false })));
      setScrambleSlots([]);
    } else if (q.type === 'builder') {
      const shuf = [...q.data.jumbled].sort(() => Math.random() - 0.5);
      setSentenceData(q.data);
      setSentenceTiles(shuf.map((word, idx) => ({ id: idx, word, used: false })));
      setSentenceSlots([]);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      loadQuestionState(0);
    }
  }, [questions]);

  const handleSelectMCQ = (option, correctWord) => {
    if (selectedOpt) return;
    playSound('click');
    setSelectedOpt(option);
    setShowExplanation(true);
    
    if (option === correctWord) {
      playSound('correct');
      setScore(prev => prev + 1);
    } else {
      playSound('wrong');
    }
  };

  // Scramble Handlers
  const handleScrambleTile = (tileId, letter) => {
    playSound('click');
    setScrambleTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setScrambleSlots(prev => [...prev, { tileId, letter }]);
  };

  const handleScrambleSlot = (slotIdx, tileId) => {
    playSound('click');
    setScrambleSlots(prev => prev.filter((_, idx) => idx !== slotIdx));
    setScrambleTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: false } : t));
  };

  const checkScramble = () => {
    const userWord = scrambleSlots.map(s => s.letter).join('');
    if (userWord.toLowerCase().trim() === scrambleWordData.word.toLowerCase().trim()) {
      playSound('correct');
      setScore(prev => prev + 1);
      setShowExplanation(true);
    } else {
      playSound('wrong');
      triggerToast("❌ જવાબ ખોટો છે! અક્ષરો સાફ કરીને ફરી પ્રયત્ન કરો.");
    }
  };

  // Builder Handlers
  const handleBuilderTile = (tileId, word) => {
    playSound('click');
    setSentenceTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: true } : t));
    setSentenceSlots(prev => [...prev, { tileId, word }]);
  };

  const handleBuilderSlot = (slotIdx, tileId) => {
    playSound('click');
    setSentenceSlots(prev => prev.filter((_, idx) => idx !== slotIdx));
    setSentenceTiles(prev => prev.map(t => t.id === tileId ? { ...t, used: false } : t));
  };

  const checkBuilder = () => {
    const sentence = sentenceSlots.map(s => s.word).join(' ').trim();
    
    const cleanUser = sentence.toLowerCase().replace(/\s+/g, ' ');
    const cleanCorrect = sentenceData.correct.toLowerCase().replace(/\s+/g, ' ');

    if (cleanUser === cleanCorrect) {
      playSound('correct');
      setScore(prev => prev + 1);
      setShowExplanation(true);
    } else {
      playSound('wrong');
      triggerToast("❌ વાક્ય ખોટું છે! પદોને ફરી ગોઠવો.");
    }
  };

  const nextQuestion = () => {
    playSound('click');
    if (qIdx + 1 < questions.length) {
      setQIdx(prev => prev + 1);
      loadQuestionState(qIdx + 1);
    } else {
      // Completed!
      playSound('correct');
      addCoins(20);
      addXP(50);
      setFinished(true);
    }
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  if (questions.length === 0) return null;
  const current = questions[qIdx];

  return (
    <div className="space-y-6 max-w-sm mx-auto py-2 text-center">
      <h3 className="font-gujarati font-black text-xl">ડેઇલી ચેલેન્જ 🏆</h3>
      
      {!finished ? (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center text-xs font-gujarati text-stone-500">
            <span>પ્રશ્ન: {toGujaratiNum(qIdx + 1)} / {toGujaratiNum(questions.length)}</span>
            <span>સાચા: {toGujaratiNum(score)}</span>
          </div>

          {/* MCQ COMPLETE THE SENTENCE */}
          {current.type === 'complete' && (
            <div className="space-y-4">
              <div className="bg-stone-50 dark:bg-stone-950 p-6 rounded-3xl border border-stone-200 dark:border-stone-850 shadow-md">
                <h4 className="text-lg font-headline font-black text-stone-850 dark:text-stone-100 leading-normal tracking-wide">
                  {current.data.sentence}
                </h4>
                <p className="font-gujarati text-xs text-stone-400 mt-2">ગુજરાતી સંકેત: "{current.data.gujaratiHint}"</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {current.data.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectMCQ(opt, current.data.blankWord)}
                    disabled={selectedOpt !== null}
                    className={`py-3 px-4 rounded-2xl border text-center font-headline font-black text-sm transition active:scale-95 ${
                      selectedOpt === null 
                        ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                        : opt === current.data.blankWord 
                          ? 'bg-emerald-500 border-emerald-600 text-white' 
                          : opt === selectedOpt 
                            ? 'bg-rose-500 border-rose-600 text-white' 
                            : 'bg-stone-50 dark:bg-stone-950 text-stone-450 border-stone-200 dark:border-stone-850'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MCQ TRANSLATE CHALLENGE */}
          {current.type === 'translate' && (
            <div className="space-y-4">
              <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-md">
                <p className="font-gujarati text-xs opacity-75">
                  {current.data.direction === 'gu-en' ? 'આ ગુજરાતી શબ્દનો અંગ્રેજી શબ્દ શોધો:' : 'આ અંગ્રેજી શબ્દનો ગુજરાતી અર્થ શોધો:'}
                </p>
                <h4 className={`font-black text-3xl mt-2 tracking-wide ${current.data.direction === 'gu-en' ? 'font-gujarati' : 'font-headline'}`}>
                  {current.data.direction === 'gu-en' ? current.data.gujarati : current.data.english}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {current.data.options.map((opt, idx) => {
                  const targetWord = current.data.direction === 'gu-en' ? current.data.english : current.data.gujarati;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectMCQ(opt, targetWord)}
                      disabled={selectedOpt !== null}
                      className={`py-3 px-4 rounded-2xl border text-center transition active:scale-95 text-xs ${
                        current.data.direction === 'gu-en' ? 'font-headline font-black' : 'font-gujarati font-bold'
                      } ${
                        selectedOpt === null 
                          ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150 hover:border-indigo-500' 
                          : opt === targetWord 
                            ? 'bg-emerald-500 border-emerald-600 text-white' 
                            : opt === selectedOpt 
                              ? 'bg-rose-500 border-rose-600 text-white' 
                              : 'bg-stone-50 dark:bg-stone-950 text-stone-455 border-stone-200 dark:border-stone-850'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SCRAMBLE CHALLENGE */}
          {current.type === 'scramble' && scrambleWordData && (
            <div className="space-y-4">
              <div className="bg-stone-50 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-850 rounded-2xl">
                <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300">
                  ગુજરાતી અર્થ: <span className="font-bold text-indigo-650 dark:text-indigo-400">"{scrambleWordData.gujarati}"</span> {scrambleWordData.emoji}
                </p>
              </div>

              <div className="flex justify-center gap-1.5 min-h-[48px] py-2 border-b">
                {scrambleWordData.word.split('').map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrambleSlots[i] && handleScrambleSlot(i, scrambleSlots[i].tileId)}
                    disabled={showExplanation}
                    className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center font-headline font-black text-sm ${
                      scrambleSlots[i] 
                        ? 'bg-indigo-600 border-indigo-700 text-white' 
                        : 'border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950'
                    }`}
                  >
                    {scrambleSlots[i] ? scrambleSlots[i].letter : ''}
                  </button>
                ))}
              </div>

              {!showExplanation ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {scrambleTiles.map(tile => (
                    <button
                      key={tile.id}
                      onClick={() => handleScrambleTile(tile.id, tile.letter)}
                      disabled={tile.used}
                      className={`w-11 h-11 rounded-xl font-headline font-black text-sm border flex items-center justify-center ${
                        tile.used
                          ? 'bg-stone-100 text-stone-300 dark:bg-stone-950 dark:text-stone-700'
                          : 'bg-white hover:bg-indigo-50 border-indigo-200 text-indigo-850 dark:bg-stone-900 dark:border-stone-800'
                      }`}
                    >
                      {tile.letter}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-headline font-black text-xl text-center text-emerald-600 py-2">
                  {scrambleWordData.word} {scrambleWordData.emoji}
                </p>
              )}

              {!showExplanation && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSound('click');
                      setScrambleSlots([]);
                      setScrambleTiles(prev => prev.map(t => ({ ...t, used: false })));
                    }}
                    className="flex-1 border text-stone-600 font-gujarati py-2 rounded-xl text-xs font-bold"
                  >
                    સાફ કરો ❌
                  </button>
                  <button
                    onClick={checkScramble}
                    disabled={scrambleSlots.length < scrambleWordData.word.length}
                    className="flex-1 bg-emerald-600 text-white font-gujarati py-2 rounded-xl text-xs font-bold shadow-md"
                  >
                    તપાસો 🚀
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BUILDER CHALLENGE */}
          {current.type === 'builder' && sentenceData && (
            <div className="space-y-4">
              <p className="font-gujarati text-xs text-stone-500 font-bold">અનુવાદ: "{sentenceData.gujaratiMeaning}"</p>

              <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200 min-h-[80px] flex flex-wrap gap-2 items-center">
                {sentenceSlots.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => !showExplanation && handleBuilderSlot(idx, item.tileId)}
                    disabled={showExplanation}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-headline font-black text-xs"
                  >
                    {item.word}
                  </button>
                ))}
              </div>

              {!showExplanation ? (
                <div className="flex flex-wrap gap-2 justify-center py-2">
                  {sentenceTiles.map(tile => (
                    <button
                      key={tile.id}
                      onClick={() => handleBuilderTile(tile.id, tile.word)}
                      disabled={tile.used}
                      className={`px-3 py-1.5 border rounded-xl font-headline font-black text-xs ${
                        tile.used 
                          ? 'bg-stone-100 text-stone-300 dark:bg-stone-950 dark:text-stone-700' 
                          : 'bg-white dark:bg-stone-900 border-stone-200'
                      }`}
                    >
                      {tile.word}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-headline font-black text-sm text-center text-emerald-600 py-2">
                  {sentenceData.correct}
                </p>
              )}

              {!showExplanation && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playSound('click');
                      setSentenceSlots([]);
                      setSentenceTiles(prev => prev.map(t => ({ ...t, used: false })));
                    }}
                    className="flex-1 border text-stone-600 font-gujarati py-2 rounded-xl text-xs font-bold"
                  >
                    સાફ કરો ❌
                  </button>
                  <button
                    onClick={checkBuilder}
                    disabled={sentenceSlots.length < sentenceTiles.length}
                    className="flex-1 bg-indigo-600 text-white font-gujarati py-2 rounded-xl text-xs font-bold shadow-md"
                  >
                    તપાસો 🚀
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Next Button Overlay */}
          {showExplanation && (
            <div className="bg-stone-50 dark:bg-stone-900 border p-4 rounded-2xl flex justify-between items-center animate-fade-in mt-4">
              <span className="font-gujarati text-[10px] font-bold text-emerald-600">
                પ્રશ્ન પૂરો થયો. આગળ વધો!
              </span>
              <button
                onClick={nextQuestion}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
              >
                આગળ પ્રશ્ન ➡️
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🏆</p>
          <h4 className="font-gujarati font-black text-lg text-emerald-600">ડેઇલી ચેલેન્જ સફળતાપૂર્વક પૂર્ણ!</h4>
          <p className="font-gujarati text-xs text-stone-500">સાચા જવાબો: {toGujaratiNum(score)} / {toGujaratiNum(questions.length)}</p>
          <p className="font-gujarati text-xs text-stone-500 font-black">મેળવેલા બોનસ કોઈન્સ: +૨૦ | બોનસ XP: +૫૦ 🌟</p>
          
          <button
            onClick={onFinish}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-gujarati font-bold text-xs shadow-md hover:bg-emerald-700 transition active:scale-95"
          >
            મેનુ પર પાછા જાઓ 🏠
          </button>
        </div>
      )}
    </div>
  );
}
