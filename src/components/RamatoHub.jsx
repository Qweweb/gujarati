import { useState, useEffect, useRef } from 'react';
import { 
  WORDS_DB, 
  KAHEVAT_DB, 
  TRUE_FALSE_DB, 
  RIDDLES_DB, 
  CRICKET_QUIZ_DB, 
  VISUAL_QUIZ_DB, 
  BHAJAN_DB 
} from '../data/gamesDatabase';
import { playSound } from '../utils/audio';
import EnglishZone from './EnglishZone';
import KbcQuizGame from './KbcQuizGame';

// Load or initialize coins
const getCoins = () => parseInt(localStorage.getItem('sanskar_coins') || '100');
const addCoins = (amount) => {
  const cur = getCoins() + amount;
  localStorage.setItem('sanskar_coins', cur.toString());
  // Dispatch event for UI updates
  window.dispatchEvent(new Event('coins-updated'));
  return cur;
};

const triggerToast = (message) => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
};

const splitGujaratiWord = (word) => {
  if (!word) return [];
  try {
    const segmenter = new Intl.Segmenter('gu', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(word)).map(s => s.segment);
  } catch (e) {
    return word.match(/[\u0A80-\u0AFF][\u0ABE-\u0BCD]*/g) || word.split('');
  }
};

// Streak tracker
const getStreak = () => {
  const streak = parseInt(localStorage.getItem('sanskar_game_streak') || '0');
  const lastPlay = localStorage.getItem('sanskar_last_play_date');
  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  
  if (lastPlay === todayStr) return streak;
  if (lastPlay === yesterdayStr) return streak;
  return 0; // reset if skipped a day
};

const updateStreak = () => {
  const currentStreak = getStreak();
  const todayStr = new Date().toDateString();
  const lastPlay = localStorage.getItem('sanskar_last_play_date');
  
  if (lastPlay !== todayStr) {
    const nextStreak = currentStreak + 1;
    localStorage.setItem('sanskar_game_streak', nextStreak.toString());
    localStorage.setItem('sanskar_last_play_date', todayStr);
    return nextStreak;
  }
  return currentStreak;
};

export default function RamatoHub({ userLocation, onBack }) {
  const [currentMode, setCurrentMode] = useState('gujarati'); // 'gujarati', 'english', or null (landing screen)
  const [activeGame, setActiveGame] = useState(null);
  const [coins, setCoins] = useState(getCoins());
  const [streak, setStreak] = useState(getStreak());
  
  useEffect(() => {
    const handleUpdate = () => setCoins(getCoins());
    window.addEventListener('coins-updated', handleUpdate);
    return () => window.removeEventListener('coins-updated', handleUpdate);
  }, []);

  const ALL_15_GAMES = [
    { id: 'kbc_quiz:daily', name: '🎯 દૈનિક ક્વિઝ', desc: '૧૦ પ્રશ્નો • રોજ નવા', color: 'from-amber-500 to-orange-600' },
    { id: 'kbc_quiz:weekly', name: '🏆 સાપ્તાહિક ક્વિઝ', desc: '૨૫ પ્રશ્નો • લીડરબોર્ડ', color: 'from-blue-500 to-cyan-600' },
    { id: 'kbc_quiz:monthly', name: '🎖️ માસિક ક્વિઝ', desc: '૫૦ પ્રશ્નો • ગ્રાન્ડ બેજ', color: 'from-purple-500 to-fuchsia-600' },
    { id: 'kbc_quiz:challenge', name: '⚔️ મિત્ર ચેલેન્જ', desc: 'મિત્રોને હરાવો', color: 'from-emerald-500 to-teal-600' },
    { id: 'word_connect', name: '🔤 શબ્દ જોડો', desc: 'અક્ષરો જોડીને ગુજરાતી શબ્દ બનાવો', color: 'from-amber-400 to-orange-500' },
    { id: 'visual_quiz', name: '🖼️ ગુજરાત ઓળખો', desc: 'ઝાંખા ચિત્ર પરથી સાચું સ્થળ શોધો', color: 'from-sky-400 to-blue-500' },
    { id: 'math_rush', name: '🧮 ઝડપી ગણિત', desc: 'સમય પૂર્વે ગણિતના જવાબ આપો', color: 'from-emerald-400 to-teal-500' },
    { id: 'farming', name: '🌾 ખેડૂત ની ખેતી', desc: 'પાક વાવો, લણો અને બજારમાં વેચો', color: 'from-lime-500 to-green-600' },
    { id: 'kahevat', name: '🎰 કહેવત પૂર્ણ કરો', desc: 'દેશી કહેવતો પૂરું કરો અને જ્ઞાન મેળવો', color: 'from-rose-400 to-pink-500' },
    { id: 'map_game', name: '🗺️ ગુજરાત નકશો', desc: 'જિલ્લાના સાચા સ્થાન પર પીન મૂકો', color: 'from-indigo-400 to-purple-500' },
    { id: 'rangoli', name: '🎨 રંગોળી પૂરો', desc: 'સુંદર રંગોળીમાં મનગમતા રંગો પૂરો', color: 'from-fuchsia-400 to-pink-600' },
    { id: 'word_search', name: '🔍 શબ્દ શોધ', desc: 'અક્ષરોના ગ્રીડમાંથી છુપા શબ્દો શોધો', color: 'from-cyan-400 to-blue-600' },
    { id: 'cricket', name: '🏏 ક્રિકેટ ક્વિઝ', desc: 'ક્રિકેટ રમતનું જ્ઞાન ચકાસો', color: 'from-orange-500 to-red-600' },
    { id: 'jigsaw', name: '🧩 ગુજરાત Jigsaw', desc: 'મંદિરોના ફોટોના કટકા જોડો', color: 'from-violet-400 to-purple-600' },
    { id: 'bhajan', name: '🎵 ભજન ઓળખો', desc: 'કાવ્ય પંક્તિ કે ભજનના સાચા કવિ શોધો', color: 'from-pink-500 to-rose-600' },
    { id: 'gram_trivia', name: '🏘️ ગ્રામ પ્રશ્નોત્તરી', desc: 'તમારા ગામ અને જિલ્લાની ટેસ્ટ લો', color: 'from-amber-500 to-yellow-600' },
    { id: 'speed_tap', name: '⚡ ઝડપ ટૅપ', desc: 'ફક્ત ફળો અને સાચી ચીજો પર ટૅપ કરો', color: 'from-red-400 to-orange-500' },
    { id: 'true_false', name: '🎪 સાચું કે ખોટું', desc: 'ગુજરાતના તથ્યોને ડાબે કે જમણે સ્વાઇપ કરો', color: 'from-teal-400 to-emerald-600' },
    { id: 'riddle', name: '🌟 દૈનિક ઉખાણાં', desc: 'રમુજી ઉખાણાં ઉકેલો અને જ્ઞાન વધારો', color: 'from-blue-500 to-indigo-600' }
  ];

  if (currentMode === 'english') {
    return null; // Handled outside now
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] dark:bg-[radial-gradient(#78350f_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none rounded-[3rem] z-0 mix-blend-multiply dark:mix-blend-overlay"></div>
      <div className="relative z-10 space-y-6">
      
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 px-4 py-2 rounded-xl font-bold active:scale-95 transition-all w-fit border border-stone-200 dark:border-stone-700 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            પાછા જાવ
          </button>
        )}
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-3xl text-white shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 font-bold text-[120px] select-none translate-y-[-20px] translate-x-[20px]">
          🎮
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="font-gujarati font-black text-2xl">ગુજરાતી ક્વિઝ અને રમતો 🎮</h2>
          <p className="font-gujarati text-xs text-amber-100">રમો, જ્ઞાન મેળવો અને કોઈન્સ કમાઓ!</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/15">
            <p className="text-[10px] text-amber-200 font-bold uppercase tracking-widest">કોઈન્સ</p>
            <h4 className="font-headline font-black text-xl flex items-center justify-center gap-1">🪙 {coins}</h4>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/15">
            <p className="text-[10px] text-amber-200 font-bold uppercase tracking-widest">સ્ટ્રીક</p>
            <h4 className="font-headline font-black text-xl flex items-center justify-center gap-1">🔥 {streak}</h4>
          </div>
        </div>
      </div>
      {/* Grid of All Games */}
      {!activeGame ? (
        <div className="space-y-8">
          {/* Regular Games Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {ALL_15_GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setActiveGame(game.id);
                updateStreak();
                setStreak(getStreak());
              }}
              className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-850 p-4 rounded-[1.5rem] md:rounded-[2rem] hover:border-orange-400 hover:shadow-lg transition-all active:scale-[0.95] text-center flex flex-col gap-3 items-center group relative overflow-hidden"
            >
              <div className={`h-14 w-14 rounded-[1.2rem] bg-gradient-to-br ${game.color} text-white flex items-center justify-center text-2xl shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                {game.name.split(' ')[0]}
              </div>
              <div className="space-y-0.5 w-full">
                <h4 className="font-gujarati font-black text-sm md:text-base text-stone-800 dark:text-stone-100 leading-tight">{game.name.split(' ').slice(1).join(' ')}</h4>
                <p className="font-gujarati text-[9px] md:text-[11px] text-stone-500 dark:text-stone-400 leading-tight line-clamp-2">{game.desc}</p>
              </div>
            </button>
          ))}
        </div>
        </div>
      ) : (
        /* Render Active Game view */
        <GameWrapper gameId={activeGame} onClose={() => setActiveGame(null)} userLocation={userLocation} />
      )}
      </div>
    </div>
  );
}

/* ========================================================
   GAME PLAYING CONTAINER WRAPPER
   ======================================================== */
function GameWrapper({ gameId, onClose, userLocation }) {
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem('sanskar_sound_enabled') !== 'false');

  const toggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    localStorage.setItem('sanskar_sound_enabled', nextVal ? 'true' : 'false');
    playSound('click');
  };

  return (
    <div className={`bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-6 shadow-xl relative min-h-[450px] flex flex-col ${gameId.startsWith('kbc_quiz') ? 'bg-gradient-to-br from-amber-50 to-white dark:from-stone-900 dark:to-stone-950' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-4 mb-4">
        <button 
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="h-10 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl flex items-center gap-1.5 font-gujarati text-xs font-bold text-stone-600 dark:text-stone-300 transition"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> પાછા જાઓ
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="h-10 w-10 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 transition"
            title={soundOn ? "અવાજ બંધ કરો" : "અવાજ ચાલુ કરો"}
          >
            <span className="material-symbols-outlined text-lg">
              {soundOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>
          <span className="font-gujarati font-black text-sm text-orange-500 uppercase tracking-widest">રમત ચાલુ છે</span>
        </div>
      </div>

      {/* Game Content Renderers */}
      <div className="flex-1 flex flex-col justify-center">
        {gameId === 'word_connect' && <WordConnectGame />}
        {gameId === 'visual_quiz' && <VisualQuizGame />}
        {gameId === 'math_rush' && <MathRushGame />}
        {gameId === 'farming' && <FarmingGame />}
        {gameId === 'kahevat' && <KahevatGame />}
        {gameId === 'map_game' && <MapGame />}
        {gameId === 'rangoli' && <RangoliGame />}
        {gameId === 'word_search' && <WordSearchGame />}
        {gameId === 'cricket' && <CricketQuizGame />}
        {gameId === 'jigsaw' && <JigsawGame />}
        {gameId === 'bhajan' && <BhajanGame />}
        {gameId === 'gram_trivia' && <GramTriviaGame userLocation={userLocation} />}
        {gameId === 'speed_tap' && <SpeedTapGame />}
        {gameId === 'true_false' && <TrueFalseGame />}
        {gameId === 'riddle' && <RiddleGame />}
        {gameId.startsWith('kbc_quiz') && <KbcQuizGame initialMode={gameId.split(':')[1]} onBack={onClose} />}
      </div>
    </div>
  );
}

/* ========================================================
   NON-REPEAT UTILITY CONTROLLER
   ======================================================== */
const playedController = {
  getUnplayed: (key, array) => {
    const played = JSON.parse(localStorage.getItem(`played_${key}`) || '[]');
    const unplayed = array.filter(item => !played.includes(item.id));
    if (unplayed.length === 0) {
      // Loop reset
      localStorage.setItem(`played_${key}`, JSON.stringify([]));
      return array[Math.floor(Math.random() * array.length)];
    }
    return unplayed[Math.floor(Math.random() * unplayed.length)];
  },
  markPlayed: (key, id) => {
    const played = JSON.parse(localStorage.getItem(`played_${key}`) || '[]');
    if (!played.includes(id)) {
      played.push(id);
      localStorage.setItem(`played_${key}`, JSON.stringify(played));
    }
  }
};

/* ========================================================
   GAME A: WORD CONNECT (શબ્દ જોડો)
   ======================================================== */
function WordConnectGame() {
  const [currentWord, setCurrentWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [success, setSuccess] = useState(false);
  
  // Choose a random word of length 4 to 6 (minimum 4 syllables)
  const pool = WORDS_DB.filter(w => {
    const syllables = splitGujaratiWord(w);
    return syllables.length >= 4 && syllables.length <= 6;
  });
  const [wordData, setWordData] = useState(() => pool[Math.floor(Math.random() * pool.length)]);
  
  // Shuffled letters
  const [letters, setLetters] = useState([]);
  
  useEffect(() => {
    if (wordData) {
      const original = splitGujaratiWord(wordData);
      let arr = [...original];
      
      // Shuffle until the order is different from the original word
      let attempts = 0;
      while (attempts < 100) {
        arr.sort(() => Math.random() - 0.5);
        const isSame = arr.every((val, index) => val === original[index]);
        if (!isSame) break;
        attempts++;
      }
      
      setLetters(arr);
      setSelectedLetters([]);
      setCurrentWord('');
      setSuccess(false);
    }
  }, [wordData]);

  const handleLetterClick = (letter, index) => {
    if (selectedLetters.includes(index)) return;
    playSound('click');
    const nextSel = [...selectedLetters, index];
    setSelectedLetters(nextSel);
    const nextWord = currentWord + letter;
    setCurrentWord(nextWord);

    if (nextWord === wordData) {
      playSound('correct');
      setSuccess(true);
      addCoins(15);
      setScore(prev => prev + 1);
    } else if (nextSel.length >= letters.length) {
      playSound('wrong');
      // Incorrect
      setTimeout(() => {
        setSelectedLetters([]);
        setCurrentWord('');
      }, 500);
    }
  };

  const nextLevel = () => {
    playSound('click');
    setWordData(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div className="text-center space-y-6 py-4">
      <h3 className="font-gujarati font-black text-xl text-stone-850 dark:text-stone-100">શબ્દ જોડો 🔤</h3>
      <p className="font-gujarati text-xs text-stone-500">સાચો શબ્દ બનાવવા અક્ષરોને લાઈનસર ટૅપ કરો:</p>
      
      {/* Target slots */}
      <div className="flex justify-center gap-2.5 my-6">
        {splitGujaratiWord(wordData).map((_, i) => (
          <div 
            key={i} 
            className="w-12 h-12 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl flex items-center justify-center text-lg font-bold font-gujarati text-orange-500 bg-stone-50 dark:bg-stone-950 animate-pulse"
          >
            {selectedLetters[i] !== undefined ? letters[selectedLetters[i]] : ''}
          </div>
        ))}
      </div>

      {/* Selected word text preview */}
      <div className="h-6 font-gujarati font-black text-base text-stone-600 dark:text-stone-300">
        {currentWord}
      </div>

      {/* Circle of letters */}
      <div className="flex justify-center gap-3 py-6">
        {letters.map((l, idx) => (
          <button
            key={idx}
            onClick={() => handleLetterClick(l, idx)}
            disabled={selectedLetters.includes(idx) || success}
            className={`w-14 h-14 rounded-full border-2 font-gujarati font-black text-lg transition shadow-md active:scale-95 ${
              selectedLetters.includes(idx)
                ? 'bg-orange-500 border-orange-600 text-white opacity-60'
                : 'bg-white hover:bg-orange-50 border-orange-200 dark:bg-stone-950 dark:border-stone-800 text-stone-700 dark:text-stone-100'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {success && (
        <div className="space-y-3 animate-fade-in">
          <p className="font-gujarati font-bold text-sm text-emerald-600">🎉 ખુબ સરસ! +૧૫ કોઈન્સ મળ્યા!</p>
          <button 
            onClick={nextLevel}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-gujarati font-bold text-xs hover:bg-emerald-700 transition"
          >
            બીજો પૂછો ➡️
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME B: GUJARAT VISUAL (ગુજરાત ઓળખો)
   ======================================================= */
function VisualQuizGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('visual_quiz', VISUAL_QUIZ_DB));
  const [blurAmount, setBlurAmount] = useState(24);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (activeItem) {
      // Pick random false locations
      const otherPlaces = VISUAL_QUIZ_DB.filter(x => x.name !== activeItem.name).map(x => x.name);
      const chosenOthers = [];
      while(chosenOthers.length < 3 && otherPlaces.length > 0) {
        const r = otherPlaces.splice(Math.floor(Math.random() * otherPlaces.length), 1)[0];
        chosenOthers.push(r);
      }
      const all = [activeItem.name, ...chosenOthers];
      all.sort(() => Math.random() - 0.5);
      setOptions(all);
      setSelectedOption(null);
      setBlurAmount(24);
      setShowExplanation(false);
    }
  }, [activeItem]);

  const handleSelect = (option) => {
    if (selectedOption) return;
    playSound('click');
    setSelectedOption(option);
    setBlurAmount(0); // clear blur
    setShowExplanation(true);
    if (option === activeItem.name) {
      playSound('correct');
      addCoins(10);
      playedController.markPlayed('visual_quiz', activeItem.id);
    } else {
      playSound('wrong');
    }
  };

  const nextItem = () => {
    playSound('click');
    setActiveItem(playedController.getUnplayed('visual_quiz', VISUAL_QUIZ_DB));
  };

  return (
    <div className="space-y-4 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">ગુજરાત ઓળખો 🖼️</h3>
      
      {/* Blurred visual representer card */}
      <div className="relative h-44 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-850 flex items-center justify-center bg-stone-100 dark:bg-stone-950">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          🏛️
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-b from-sky-400 to-indigo-600 opacity-20"
          style={{ filter: `blur(${blurAmount}px)` }}
        />
        <div className="absolute bottom-2 right-2 bg-black/40 text-[9px] px-2 py-1 text-white rounded-md font-gujarati">
          જિલ્લો: {activeItem.location}
        </div>
      </div>

      {/* Blur slider */}
      {!selectedOption && (
        <div className="space-y-1">
          <label className="font-gujarati text-[10px] text-stone-400 flex justify-between">
            <span>ચિત્ર સ્પષ્ટ કરો (ખર્ચ ૧ કોઈન):</span>
            <span>બગાડ: {blurAmount}px</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="30" 
            value={blurAmount} 
            onChange={(e) => {
              setBlurAmount(parseInt(e.target.value));
              if(coins > 1) addCoins(-1);
            }} 
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>
      )}

      {/* Choices Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`p-3 rounded-xl border text-center font-gujarati text-xs font-bold transition ${
              selectedOption === null 
                ? 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 hover:border-sky-500' 
                : opt === activeItem.name 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : opt === selectedOption 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-400 border-stone-200 dark:border-stone-850'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-950/40 p-4 rounded-2xl space-y-3 text-left animate-fade-in">
          <p className="font-gujarati text-xs text-sky-800 dark:text-sky-300 font-bold">{activeItem.name}</p>
          <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-400 leading-normal">{activeItem.description}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {selectedOption === activeItem.name ? '🎉 ઉત્તમ સાચો જવાબ! +૧૦ કોઈન્સ' : '❌ ખોટો જવાબ'}
            </span>
            <button
              onClick={nextItem}
              className="bg-sky-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-gujarati font-bold hover:bg-sky-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME C: MATH RUSH (ઝડપી ગણિત)
   ======================================================= */
function MathRushGame() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [op, setOp] = useState('+');
  const [ans, setAns] = useState(0);
  const [options, setOptions] = useState([]);
  const [timer, setTimer] = useState(12);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  const generateQuestion = () => {
    const ops = ['+', '-', '*'];
    const chosenOp = ops[Math.floor(Math.random() * ops.length)];
    let n1 = 0, n2 = 0, answer = 0;
    
    if (chosenOp === '+') {
      n1 = Math.floor(Math.random() * 80) + 10;
      n2 = Math.floor(Math.random() * 80) + 10;
      answer = n1 + n2;
    } else if (chosenOp === '-') {
      n1 = Math.floor(Math.random() * 80) + 20;
      n2 = Math.floor(Math.random() * (n1 - 5)) + 5;
      answer = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
      answer = n1 * n2;
    }

    setNum1(n1);
    setNum2(n2);
    setOp(chosenOp);
    setAns(answer);
    
    // Make fake answers
    const fakes = new Set();
    while(fakes.size < 3) {
      const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = answer + offset;
      if (val !== answer && val > 0) fakes.add(val);
    }
    const all = [answer, ...fakes];
    all.sort(() => Math.random() - 0.5);
    setOptions(all);
    setTimer(12);
  };

  useEffect(() => {
    generateQuestion();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (gameOver) {
      clearInterval(timerRef.current);
      return;
    }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          playSound('wrong');
          setGameOver(true);
          return 0;
        }
        playSound('tick');
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [num1, num2, gameOver]);

  const handleChoice = (val) => {
    playSound('click');
    if (val === ans) {
      playSound('correct');
      setScore(prev => prev + 1);
      addCoins(2);
      generateQuestion();
    } else {
      playSound('wrong');
      setGameOver(true);
    }
  };

  const restartGame = () => {
    playSound('click');
    setScore(0);
    setGameOver(false);
    generateQuestion();
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-4">
      <h3 className="font-gujarati font-black text-xl">ઝડપી ગણિત 🧮</h3>
      
      {!gameOver ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center px-4">
            <span className="font-gujarati text-xs text-stone-500">સ્કોર: {toGujaratiNum(score)}</span>
            <div className="h-10 w-10 rounded-full border-2 border-orange-500 flex items-center justify-center text-sm font-bold text-orange-500 animate-pulse">
              {toGujaratiNum(timer)}
            </div>
          </div>
          
          <div className="text-4xl font-black text-primary tracking-widest flex items-center justify-center gap-3">
            <span>{toGujaratiNum(num1)}</span>
            <span>{op === '*' ? '×' : op}</span>
            <span>{toGujaratiNum(num2)}</span>
            <span>=</span>
            <span>?</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoice(opt)}
                className="py-3 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-emerald-500 rounded-2xl font-headline font-black text-lg transition active:scale-95 text-stone-750 dark:text-stone-100"
              >
                {toGujaratiNum(opt)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <p className="text-4xl">🏁</p>
          <h4 className="font-gujarati font-black text-lg text-rose-500">ખેલ પૂરો!</h4>
          <p className="font-gujarati text-sm text-stone-500">તમારો સ્કોર: {toGujaratiNum(score)}</p>
          <button
            onClick={restartGame}
            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-gujarati font-bold text-sm shadow-md hover:bg-emerald-700 transition"
          >
            ફરીથી રમો 🔄
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME D: FARMING SIMULATOR (ખેડૂત ની ખેતી)
   ======================================================= */
function FarmingGame() {
  const CROPS = [
    { id: 'wheat', name: 'ઘઉં 🌾', growTime: 5, seedPrice: 10, minPrice: 15, maxPrice: 28 },
    { id: 'cotton', name: 'કપાસ ☁️', growTime: 8, seedPrice: 20, minPrice: 35, maxPrice: 65 },
    { id: 'peanut', name: 'મગફળી 🥜', growTime: 10, seedPrice: 25, minPrice: 40, maxPrice: 85 },
    { id: 'onion', name: 'ડુંગળી 🧅', growTime: 6, seedPrice: 15, minPrice: 22, maxPrice: 42 }
  ];

  const [plots, setPlots] = useState([
    { id: 1, crop: null, stage: 'empty', water: false, timeRemaining: 0 },
    { id: 2, crop: null, stage: 'empty', water: false, timeRemaining: 0 },
    { id: 3, crop: null, stage: 'empty', water: false, timeRemaining: 0 },
    { id: 4, crop: null, stage: 'empty', water: false, timeRemaining: 0 }
  ]);

  const [marketPrices, setMarketPrices] = useState({
    wheat: 18, cotton: 42, peanut: 50, onion: 25
  });

  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);

  // Market price fluctuation loop
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setMarketPrices(prev => {
        const next = { ...prev };
        CROPS.forEach(c => {
          const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
          next[c.id] = Math.max(c.minPrice, Math.min(c.maxPrice, prev[c.id] + delta));
        });
        return next;
      });
    }, 8000);
    return () => clearInterval(priceInterval);
  }, []);

  // Farming simulation ticks
  useEffect(() => {
    const tick = setInterval(() => {
      setPlots(prevPlots => {
        return prevPlots.map(plot => {
          if (plot.stage === 'growing') {
            if (plot.timeRemaining <= 1) {
              return { ...plot, stage: 'ready', timeRemaining: 0 };
            }
            return { ...plot, timeRemaining: plot.timeRemaining - 1 };
          }
          return plot;
        });
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const plantPlot = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    if (plot.stage !== 'empty') return;
    if (getCoins() < selectedCrop.seedPrice) {
      alert('પૂરતા કોઈન્સ નથી!');
      return;
    }
    addCoins(-selectedCrop.seedPrice);
    setPlots(prev => prev.map(p => p.id === plotId ? {
      ...p,
      crop: selectedCrop,
      stage: 'growing',
      water: false,
      timeRemaining: selectedCrop.growTime
    } : p));
  };

  const waterPlot = (plotId) => {
    setPlots(prev => prev.map(p => p.id === plotId && p.stage === 'growing' ? {
      ...p,
      water: true,
      timeRemaining: Math.max(1, Math.floor(p.timeRemaining / 2)) // halves grow time
    } : p));
  };

  const harvestPlot = (plotId) => {
    const plot = plots.find(p => p.id === plotId);
    if (plot.stage !== 'ready') return;
    const cropId = plot.crop.id;
    const sellPrice = marketPrices[cropId];
    addCoins(sellPrice);
    setPlots(prev => prev.map(p => p.id === plotId ? {
      ...p, crop: null, stage: 'empty', water: false, timeRemaining: 0
    } : p));
  };

  return (
    <div className="space-y-4 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">ખેડૂત ની ખેતી 🌾</h3>
      
      {/* Real APMC Market Prices widget */}
      <div className="bg-stone-50 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-850 rounded-2xl">
        <h4 className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2">APMC બજાર ભાવો (નિયમિત બદલાય છે):</h4>
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-gujarati font-black text-stone-700 dark:text-stone-300">
          {CROPS.map(c => (
            <div key={c.id} className="bg-white dark:bg-stone-900 border border-stone-150 p-2 rounded-xl">
              <p>{c.name.split(' ')[0]}</p>
              <p className="text-emerald-600 text-sm mt-0.5">🪙 {marketPrices[c.id]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crop Selector */}
      <div className="flex gap-2 justify-center">
        {CROPS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c)}
            className={`px-3 py-2 rounded-xl text-xs font-gujarati font-bold border transition ${
              selectedCrop.id === c.id 
                ? 'bg-lime-600 text-white border-lime-700' 
                : 'bg-white border-stone-200 text-stone-500 dark:bg-stone-950 dark:border-stone-800'
            }`}
          >
            {c.name} (બીજ: {c.seedPrice})
          </button>
        ))}
      </div>

      {/* Grid of 4 plots */}
      <div className="grid grid-cols-2 gap-4">
        {plots.map(p => (
          <div 
            key={p.id}
            className="aspect-square border border-amber-200/40 bg-amber-500/5 p-4 rounded-3xl flex flex-col justify-between text-center relative overflow-hidden"
          >
            {p.stage === 'empty' && (
              <button 
                onClick={() => plantPlot(p.id)}
                className="m-auto bg-amber-600 text-white text-[10px] font-gujarati font-bold px-3 py-2 rounded-lg"
              >
                વાવો 🌱
              </button>
            )}
            
            {p.stage === 'growing' && (
              <div className="m-auto space-y-2">
                <p className="font-gujarati text-xs">{p.crop.name}</p>
                <p className="font-gujarati text-[9px] text-stone-400">વધે છે: {p.timeRemaining}s</p>
                {!p.water ? (
                  <button 
                    onClick={() => waterPlot(p.id)}
                    className="bg-sky-500 text-white text-[9px] font-gujarati font-bold px-2 py-1 rounded-md"
                  >
                    પાણી પાવો 💧
                  </button>
                ) : (
                  <span className="text-[10px] bg-sky-50 border border-sky-100 text-sky-600 px-2 py-1 rounded-md font-bold">સીંચીત 💧</span>
                )}
              </div>
            )}

            {p.stage === 'ready' && (
              <button 
                onClick={() => harvestPlot(p.id)}
                className="m-auto bg-green-600 hover:bg-green-700 text-white text-[10px] font-gujarati font-bold px-3 py-2 rounded-xl shadow-lg animate-bounce"
              >
                લણો 🌾
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================
   GAME E: COMPLETE KAHEVAT (કહેવત પૂર્ણ કરો)
   ======================================================= */
function KahevatGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('kahevat', KAHEVAT_DB));
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === activeItem.answer) {
      addCoins(10);
      playedController.markPlayed('kahevat', activeItem.id);
    }
  };

  const nextItem = () => {
    setActiveItem(playedController.getUnplayed('kahevat', KAHEVAT_DB));
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">કહેવત પૂર્ણ કરો 🎰</h3>
      
      <div className="bg-amber-500/10 border border-amber-500/25 p-6 rounded-3xl text-center text-xl font-gujarati font-black text-[#5c3e21]">
        "{activeItem.question}"
      </div>

      <div className="grid grid-cols-2 gap-3">
        {activeItem.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`p-3.5 rounded-2xl border text-center font-gujarati text-xs font-bold transition active:scale-95 ${
              selectedOption === null 
                ? 'bg-white hover:bg-amber-50 border-stone-200 text-stone-700 dark:bg-stone-950 dark:border-stone-800 dark:text-stone-100' 
                : opt === activeItem.answer 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : opt === selectedOption 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-stone-50 dark:bg-stone-950 text-stone-400 border-stone-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-950/30 p-4 rounded-2xl text-left space-y-3 animate-fade-in">
          <p className="font-gujarati text-xs text-amber-900 dark:text-amber-300 font-bold">સાચો જવાબ: {activeItem.answer}</p>
          <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-400 leading-relaxed">{activeItem.explanation}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {selectedOption === activeItem.answer ? '🎉 સરસ! +૧૦ કોઈન્સ' : '❌ ઉત્તર ખોટો છે'}
            </span>
            <button
              onClick={nextItem}
              className="bg-amber-600 text-white px-5 py-2 rounded-xl text-xs font-gujarati font-bold hover:bg-amber-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME F: GUJARAT MAP (ગુજરાત નકશો)
   ======================================================= */
function MapGame() {
  const MAP_QUESTIONS = [
    { id: 1, name: 'કચ્છ જિલ્લો', location: 'ઉત્તર-પશ્ચિમ સરહદ', correctDir: 'North' },
    { id: 2, name: 'વલસાડ જિલ્લો', location: 'દક્ષિણ સરહદ', correctDir: 'South' },
    { id: 3, name: 'દાહમોદ જિલ્લો', location: 'પૂર્વ સરહદ', correctDir: 'East' },
    { id: 4, name: 'દ્વારકા જિલ્લો', location: 'પશ્ચિમ સરહદ', correctDir: 'West' }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedDir, setSelectedDir] = useState(null);
  const [score, setScore] = useState(0);
  
  const activeItem = MAP_QUESTIONS[activeIdx];

  const handleDir = (dir) => {
    setSelectedDir(dir);
    if (dir === activeItem.correctDir) {
      addCoins(10);
      setScore(prev => prev + 1);
    }
  };

  const nextLevel = () => {
    const nextIdx = activeIdx + 1;
    if (nextIdx < MAP_QUESTIONS.length) {
      setActiveIdx(nextIdx);
      setSelectedDir(null);
    } else {
      alert('અભિનંદન! નકશાની રમત પૂરી થઈ!');
      setActiveIdx(0);
      setSelectedDir(null);
      setScore(0);
    }
  };

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-4">
      <h3 className="font-gujarati font-black text-xl">ગુજરાત નકશો 🗺️</h3>
      <p className="font-gujarati text-xs text-stone-500">નીચેના જિલ્લાને નકશાના સાચા ખૂણા કે દિશામાં મૂકો:</p>
      
      <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl font-gujarati font-black text-lg">
        {activeItem.name}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div/>
        <button onClick={() => handleDir('North')} className={`p-3 rounded-xl border text-xs font-bold font-gujarati ${selectedDir === 'North' ? 'bg-orange-500 text-white' : 'bg-white'}`}>ઉત્તર 🔼</button>
        <div/>
        <button onClick={() => handleDir('West')} className={`p-3 rounded-xl border text-xs font-bold font-gujarati ${selectedDir === 'West' ? 'bg-orange-500 text-white' : 'bg-white'}`}>પશ્ચિમ ◀️</button>
        <div className="flex items-center justify-center font-bold text-xs">દિશા</div>
        <button onClick={() => handleDir('East')} className={`p-3 rounded-xl border text-xs font-bold font-gujarati ${selectedDir === 'East' ? 'bg-orange-500 text-white' : 'bg-white'}`}>પૂર્વ ▶️</button>
        <div/>
        <button onClick={() => handleDir('South')} className={`p-3 rounded-xl border text-xs font-bold font-gujarati ${selectedDir === 'South' ? 'bg-orange-500 text-white' : 'bg-white'}`}>દક્ષિણ 🔽</button>
        <div/>
      </div>

      {selectedDir && (
        <div className="space-y-3">
          <p className="font-gujarati text-xs font-bold text-emerald-600">
            {selectedDir === activeItem.correctDir ? '🎉 સાચું સ્થાન! +૧૦ કોઈન્સ' : '❌ ખોટી દિશા!'}
          </p>
          <button onClick={nextLevel} className="px-5 py-2 bg-orange-500 text-white text-xs font-gujarati font-bold rounded-lg">આગળ ➡️</button>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME G: COLOR RANGOLI (રંગોળી પૂરો)
   ======================================================= */
function RangoliGame() {
  const TEMPLATES = {
    rangoli: [
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0
    ],
    house: [
      0,0,0,1,1,0,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,
      0,1,1,1,1,1,1,0,
      0,1,0,1,1,0,1,0,
      0,1,1,1,1,1,1,0,
      0,1,1,0,0,1,1,0
    ],
    car: [
      0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,
      0,0,0,1,1,1,0,0,
      0,0,1,1,1,1,1,0,
      0,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      0,1,0,0,0,0,1,0,
      0,0,0,0,0,0,0,0
    ],
    diya: [
      0,0,0,1,1,0,0,0,
      0,0,0,1,1,0,0,0,
      0,0,1,1,1,1,0,0,
      0,0,0,1,1,0,0,0,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0
    ],
    animal: [
      0,0,0,0,0,0,0,0,
      0,1,1,1,1,0,0,0,
      0,1,1,1,1,1,1,0,
      1,1,1,1,1,1,1,1,
      0,0,1,1,1,1,1,0,
      0,0,1,1,1,1,1,0,
      0,0,1,0,0,0,1,0,
      0,0,1,0,0,0,1,0
    ]
  };

  const [selectedTemplate, setSelectedTemplate] = useState('rangoli');
  const [grid, setGrid] = useState(() => Array(64).fill('#ffffff'));
  const [activeColor, setActiveColor] = useState('#f59e0b');

  const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#06b6d4', '#eab308'];

  useEffect(() => {
    setGrid(Array(64).fill('#ffffff'));
  }, [selectedTemplate]);

  const clickCell = (idx) => {
    setGrid(prev => prev.map((c, i) => i === idx ? activeColor : c));
  };

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-2">
      <h3 className="font-gujarati font-black text-xl">રંગોળી પૂરો 🎨</h3>
      <p className="font-gujarati text-xs text-stone-500">કેનવાસ પસંદ કરી, રંગ લો અને ખાનાઓમાં રંગ પૂરો:</p>

      {/* Template selector */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {[
          { id: 'rangoli', name: 'રંગોળી 🌸' },
          { id: 'house', name: 'ઘર 🏠' },
          { id: 'car', name: 'ગાડી 🚗' },
          { id: 'diya', name: 'દીવો 🪔' },
          { id: 'animal', name: 'ગાય 🐂' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-gujarati font-black border transition active:scale-95 ${
              selectedTemplate === t.id
                ? 'bg-amber-600 border-amber-700 text-white shadow-sm'
                : 'bg-white border-stone-200 text-stone-600 dark:bg-stone-950 dark:border-stone-850 dark:text-stone-300'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Rangoli palette */}
      <div className="flex justify-center flex-wrap gap-2 max-w-[280px] mx-auto">
        {colors.map(col => (
          <button
            key={col}
            onClick={() => setActiveColor(col)}
            className={`w-7 h-7 rounded-full border-2 transition ${activeColor === col ? 'border-stone-800 scale-110 shadow-md' : 'border-transparent'}`}
            style={{ backgroundColor: col }}
          />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 gap-1 max-w-[260px] mx-auto bg-stone-50 dark:bg-stone-950 p-3 rounded-[2rem] border border-stone-200 dark:border-stone-850">
        {grid.map((col, idx) => {
          const isOutline = TEMPLATES[selectedTemplate][idx] === 1;
          const isColored = col !== '#ffffff';
          return (
            <button
              key={idx}
              onClick={() => clickCell(idx)}
              className={`aspect-square rounded-md transition active:scale-95 border ${
                isColored 
                  ? 'border-black/5' 
                  : isOutline 
                    ? 'bg-stone-100 dark:bg-stone-800 border-2 border-dashed border-stone-300 dark:border-stone-700' 
                    : 'bg-white dark:bg-stone-900 border-stone-150 dark:border-stone-850'
              }`}
              style={isColored ? { backgroundColor: col } : {}}
            />
          );
        })}
      </div>
      
      <button 
        onClick={() => { setGrid(Array(64).fill('#ffffff')); addCoins(5); triggerToast("🎨 કલર સબમિટ થયો! +૫ કોઈન્સ મળ્યા!"); }}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md transition active:scale-95"
      >
        સાફ કરો અને સબમિટ (કોઈન સંગ્રહ) 🪙
      </button>
    </div>
  );
}

/* ========================================================
   GAME H: WORD SEARCH (શબ્દ શોધ)
   ======================================================= */
// Filtered Gujarati Word Pool (5000+ Gujarati words of length 2-5 graphemes)
const WORD_POOL = WORDS_DB.filter(word => {
  const graphemes = splitGujaratiWord(word);
  return graphemes.length >= 2 && graphemes.length <= 5 && /^[\u0A80-\u0AFF\u200D]+$/.test(word);
});

const getPlayedWords = () => {
  try {
    return JSON.parse(localStorage.getItem('sanskar_wordsearch_played_words') || '[]');
  } catch (e) {
    return [];
  }
};

const markWordsPlayed = (words) => {
  try {
    const played = getPlayedWords();
    const updated = Array.from(new Set([...played, ...words]));
    if (updated.length > 4000) {
      localStorage.setItem('sanskar_wordsearch_played_words', JSON.stringify(updated.slice(2000)));
    } else {
      localStorage.setItem('sanskar_wordsearch_played_words', JSON.stringify(updated));
    }
  } catch (e) {}
};

const pickTargetWords = () => {
  const played = getPlayedWords();
  let available = WORD_POOL.filter(w => !played.includes(w));
  if (available.length < 50) {
    localStorage.removeItem('sanskar_wordsearch_played_words');
    available = WORD_POOL;
  }
  
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  const selected = [];
  for (const word of shuffled) {
    const len = splitGujaratiWord(word).length;
    if (len >= 2 && len <= 5) {
      selected.push(word);
      if (selected.length === 5) break;
    }
  }
  
  if (selected.length < 3) {
    return ['કમળ', 'ગામડા', 'ખેતી', 'ગાય', 'દવા', 'જય', 'પવન', 'સરસ'].slice(0, 5);
  }
  return selected;
};

const createGrid = (words) => {
  const size = 5;
  let attempts = 0;
  
  while (attempts < 200) {
    attempts++;
    const tempGrid = Array(size).fill(null).map(() => Array(size).fill(''));
    let success = true;
    
    for (const word of words) {
      const graphemes = splitGujaratiWord(word);
      const len = graphemes.length;
      let placed = false;
      let wordAttempts = 0;
      
      while (wordAttempts < 100) {
        wordAttempts++;
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);
        const dir = Math.random() > 0.5 ? 'H' : 'V';
        
        if (dir === 'H' && c + len <= size) {
          let ok = true;
          for (let i = 0; i < len; i++) {
            const current = tempGrid[r][c + i];
            if (current !== '' && current !== graphemes[i]) {
              ok = false;
              break;
            }
          }
          if (ok) {
            for (let i = 0; i < len; i++) {
              tempGrid[r][c + i] = graphemes[i];
            }
            placed = true;
            break;
          }
        } else if (dir === 'V' && r + len <= size) {
          let ok = true;
          for (let i = 0; i < len; i++) {
            const current = tempGrid[r + i][c];
            if (current !== '' && current !== graphemes[i]) {
              ok = false;
              break;
            }
          }
          if (ok) {
            for (let i = 0; i < len; i++) {
              tempGrid[r + i][c] = graphemes[i];
            }
            placed = true;
            break;
          }
        }
      }
      
      if (!placed) {
        success = false;
        break;
      }
    }
    
    if (success) {
      const allGraphemes = words.flatMap(w => splitGujaratiWord(w));
      const fallbackLetters = ['ક', 'મ', 'ળ', 'ર', 'સ', 'પ', 'વ', 'ન', 'દ', 'વા', 'જ', 'ય', 'ખે', 'તી', 'ગા', 'ડા'];
      const fillPool = allGraphemes.concat(fallbackLetters);
      
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (tempGrid[r][c] === '') {
            tempGrid[r][c] = fillPool[Math.floor(Math.random() * fillPool.length)];
          }
        }
      }
      return tempGrid;
    }
  }
  
  return [
    ['ક',  'મ',  'ળ',  'ખે', 'તી'],
    ['ગા', 'મ',  'ડા', 'દ',  'વા'],
    ['ગા', 'ય',  'જ',  'ય',  'ન' ],
    ['પ',  'વ',  'ન',  'મ',  'ન' ],
    ['સ',  'ર',  'સ',  'ફ',  'ળ' ]
  ];
};

function WordSearchGame() {
  const [gameData, setGameData] = useState(() => {
    const words = pickTargetWords();
    const initialGrid = createGrid(words);
    return { words, grid: initialGrid };
  });
  
  const targetWords = gameData.words;
  const grid = gameData.grid;
  
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  const currentSelectionString = selectedCells.map(cell => grid[cell.r][cell.c]).join('');

  const handleCellClick = (r, c) => {
    if (foundWords.length === targetWords.length) return;
    playSound('click');
    
    const exists = selectedCells.some(cell => cell.r === r && cell.c === c);
    let nextSel;
    
    if (exists) {
      // Undo up to the clicked cell
      const idx = selectedCells.findIndex(cell => cell.r === r && cell.c === c);
      nextSel = selectedCells.slice(0, idx);
    } else {
      nextSel = [...selectedCells, { r, c }];
    }
    
    setSelectedCells(nextSel);

    const currentString = nextSel.map(cell => grid[cell.r][cell.c]).join('');
    const match = targetWords.find(word => word === currentString);
    
    if (match && !foundWords.includes(match)) {
      playSound('correct');
      const nextFound = [...foundWords, match];
      setFoundWords(nextFound);
      setSelectedCells([]); // Reset on match
      addCoins(10);
      triggerToast(`🎉 તમે "${match}" શબ્દ શોધ્યો! +૧૦ કોઈન્સ`);

      if (nextFound.length === targetWords.length) {
        playSound('win');
        markWordsPlayed(targetWords);
        addCoins(50); // Completion bonus: +50 coins
        setGameCompleted(true);
      }
    }
  };

  const handleNextGame = () => {
    playSound('click');
    setGameCompleted(false);
    setFoundWords([]);
    setSelectedCells([]);
    
    const nextWords = pickTargetWords();
    const nextGrid = createGrid(nextWords);
    setGameData({ words: nextWords, grid: nextGrid });
  };

  if (gameCompleted) {
    return (
      <div className="text-center space-y-6 max-w-sm mx-auto py-12 px-6 animate-fade-in font-gujarati bg-white dark:bg-stone-900 rounded-[2.5rem] shadow-xl border border-emerald-500/20">
        <div className="space-y-4">
          <div className="text-7xl animate-bounce">🏆</div>
          <h3 className="font-headline font-black text-2xl text-stone-900 dark:text-white">ખૂબ ખૂબ અભિનંદન! 🎉</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">
            તમે ગ્રીડમાંથી બધા જ શબ્દો સફળતાપૂર્વક શોધી લીધા છે!
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-250 dark:border-emerald-900/40 p-4 rounded-2xl inline-block shadow-sm">
            <span className="text-emerald-700 dark:text-emerald-450 font-black text-sm flex items-center justify-center gap-1.5">
              <span>💰 પૂર્ણ કરવા બદલ બોનસ:</span>
              <span className="text-base text-emerald-600 dark:text-emerald-400">+૫૦ કોઈન્સ</span>
            </span>
          </div>
        </div>

        <button 
          onClick={handleNextGame}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-500/25 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <span>આગળ રમો ➡️</span>
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 max-w-sm mx-auto py-2">
      <h3 className="font-gujarati font-black text-xl">શબ્દ શોધ 🔍</h3>
      <p className="font-gujarati text-xs text-stone-500">ગ્રીડમાંથી અક્ષરો વારાફરતી દબાવીને નીચે આપેલ શબ્દો શોધો:</p>

      {/* Selection Preview */}
      <div className="bg-amber-500/10 border border-amber-500/20 py-2.5 px-4 rounded-xl font-gujarati font-black text-sm text-primary flex items-center justify-between">
        <span>પસંદ કરેલ: <span className="underline decoration-2 decoration-primary">{currentSelectionString || "..."}</span></span>
        {selectedCells.length > 0 && (
          <button 
            onClick={() => {
              playSound('click');
              setSelectedCells([]);
            }}
            className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-md font-bold hover:bg-primary/30 transition active:scale-95"
          >
            સાફ કરો ❌
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-[2rem] grid grid-cols-5 gap-2 max-w-[240px] mx-auto border border-stone-250 dark:border-stone-850">
        {grid.map((row, r) => 
          row.map((letter, c) => {
            const isSelected = selectedCells.some(cell => cell.r === r && cell.c === c);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-gujarati font-black text-sm transition active:scale-90 border select-none ${
                  isSelected 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-orange-500 text-white shadow-md' 
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-100 hover:border-amber-400'
                }`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {/* Targets list */}
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {targetWords.map(word => (
          <div
            key={word}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-gujarati font-bold border transition ${
              foundWords.includes(word) 
                ? 'bg-emerald-100 border-emerald-250 text-emerald-700 line-through dark:bg-emerald-950/20 dark:border-emerald-900/40' 
                : 'bg-white border-stone-200 text-stone-500 dark:bg-stone-900 dark:border-stone-850'
            }`}
          >
            {word} {foundWords.includes(word) && '✓'}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================
   GAME I: CRICKET QUIZ (ક્રિકેટ ક્વિઝ)
   ======================================================= */
function CricketQuizGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('cricket', CRICKET_QUIZ_DB));
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === activeItem.answer) {
      addCoins(10);
      playedController.markPlayed('cricket', activeItem.id);
    }
  };

  const nextItem = () => {
    setActiveItem(playedController.getUnplayed('cricket', CRICKET_QUIZ_DB));
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">ક્રિકેટ ક્વિઝ 🏏</h3>
      
      <div className="bg-orange-50 border border-orange-100 p-5 rounded-2xl text-center text-sm font-gujarati font-black text-stone-700">
        {activeItem.question}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {activeItem.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`p-3 rounded-xl border text-center font-gujarati text-xs font-bold transition ${
              selectedOption === null 
                ? 'bg-white hover:bg-orange-50 border-stone-200 text-stone-700 dark:bg-stone-950 dark:border-stone-850' 
                : opt === activeItem.answer 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : opt === selectedOption 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-2xl text-left space-y-2 animate-fade-in">
          <p className="font-gujarati text-[10px] text-stone-500 leading-normal">{activeItem.fact}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {selectedOption === activeItem.answer ? '🎉 સાચો જવાબ! +૧૦ કોઈન્સ' : '❌ ખોટો જવાબ'}
            </span>
            <button
              onClick={nextItem}
              className="bg-orange-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-gujarati font-bold hover:bg-orange-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME J: JIGSAW PUZZLE (ગુજરાત Jigsaw)
   ======================================================= */
function JigsawGame() {
  const [tiles, setTiles] = useState([2, 3, 1, 4, 0, 5, 8, 6, 7]);
  const [solved, setSolved] = useState(false);

  const swapTiles = (idx) => {
    if (solved) return;
    const blankIdx = tiles.indexOf(0);
    // Only swap if adjacent
    const isAdjacent = [1, -1, 3, -3].some(offset => {
      const target = idx + offset;
      if (target === blankIdx) {
        // Prevent wrapping rows
        if (Math.abs(offset) === 1 && Math.floor(idx / 3) !== Math.floor(blankIdx / 3)) return false;
        return true;
      }
      return false;
    });

    if (isAdjacent) {
      const next = [...tiles];
      next[blankIdx] = tiles[idx];
      next[idx] = 0;
      setTiles(next);

      // Check solve
      if (next.join(',') === '1,2,3,4,5,6,7,8,0') {
        setSolved(true);
        addCoins(30);
      }
    }
  };

  return (
    <div className="text-center space-y-4 max-w-sm mx-auto py-2">
      <h3 className="font-gujarati font-black text-xl">ગુજરાત Jigsaw 🧩</h3>
      <p className="font-gujarati text-xs text-stone-500">ખાલી ખાના બાજુ ટાઇલ્સ ખસેડીને ગોઠવો:</p>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto bg-stone-150 p-2 rounded-2xl">
        {tiles.map((t, idx) => (
          <button
            key={idx}
            onClick={() => swapTiles(idx)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition active:scale-95 ${
              t === 0 
                ? 'bg-transparent border border-dashed border-stone-300 dark:border-stone-850' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600 border border-violet-650 text-white shadow-md'
            }`}
          >
            {t !== 0 ? t : ''}
          </button>
        ))}
      </div>

      {solved && (
        <p className="font-gujarati text-xs font-bold text-emerald-600 animate-pulse">🎉 અદભુત! જિગ્સૉ ઉકેલાઈ ગઈ છે! +૩૦ કોઈન્સ!</p>
      )}
    </div>
  );
}

/* ========================================================
   GAME K: BHAJAN GAME (ભજન ઓળખો)
   ======================================================= */
function BhajanGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('bhajan', BHAJAN_DB));
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (activeItem) {
      const otherKavis = BHAJAN_DB.filter(x => x.author !== activeItem.author).map(x => x.author);
      const chosenOthers = [];
      while(chosenOthers.length < 3 && otherKavis.length > 0) {
        const r = otherKavis.splice(Math.floor(Math.random() * otherKavis.length), 1)[0];
        if(!chosenOthers.includes(r)) chosenOthers.push(r);
      }
      const all = [activeItem.author, ...chosenOthers];
      all.sort(() => Math.random() - 0.5);
      setOptions(all);
    }
  }, [activeItem]);

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === activeItem.author) {
      addCoins(10);
      playedController.markPlayed('bhajan', activeItem.id);
    }
  };

  const nextItem = () => {
    setActiveItem(playedController.getUnplayed('bhajan', BHAJAN_DB));
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">ભજન ઓળખો 🎵</h3>
      
      <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl text-center text-sm font-gujarati font-black text-[#5c213e]">
        ભજન પંક્તિ: "{activeItem.title}"
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`p-3 rounded-xl border text-center font-gujarati text-xs font-bold transition ${
              selectedOption === null 
                ? 'bg-white hover:bg-rose-50 border-stone-200 text-stone-700 dark:bg-stone-950 dark:border-stone-850' 
                : opt === activeItem.author 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : opt === selectedOption 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-left space-y-2 animate-fade-in">
          <p className="font-gujarati text-[10px] text-stone-500 leading-normal">{activeItem.description}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {selectedOption === activeItem.author ? '🎉 સાચો જવાબ! +૧૦ કોઈન્સ' : '❌ ખોટો જવાબ'}
            </span>
            <button
              onClick={nextItem}
              className="bg-rose-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-gujarati font-bold hover:bg-rose-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME L: VILLAGE TRIVIA (ગ્રામ પ્રશ્નોત્તરી)
   ======================================================= */
function GramTriviaGame({ userLocation }) {
  const defaultLocation = { district: 'અમદાવાદ', taluka: 'દસ્ક્રોઈ', village: 'મોટેરા' };
  const loc = userLocation || defaultLocation;

  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const trivia = [
    { q: `તમારું નોંધાયેલું ગામ કયું છે?`, correct: loc.village, choices: [loc.village, 'દસ્ક્રોઈ', 'કચ્છ', 'ગાંધીનગર'] },
    { q: `${loc.village} ગામ કયા તાલુકામાં આવેલું છે?`, correct: loc.taluka, choices: [loc.taluka, 'દસ્ક્રોઈ', 'કલોલ', 'સિદ્ધપુર'] },
    { q: `${loc.village} ગામનો જિલ્લો કયો છે?`, correct: loc.district, choices: [loc.district, 'રાજકોટ', 'ભુજ', 'સુરેન્દ્રનગર'] }
  ];

  const current = trivia[qIndex];

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt === current.correct) {
      addCoins(10);
      setScore(prev => prev + 1);
    }
  };

  const next = () => {
    if (qIndex < trivia.length - 1) {
      setQIndex(prev => prev + 1);
      setSelectedOpt(null);
    } else {
      alert(`ખેલો પૂરો થયો! તમારો સ્કોર: ${score}/${trivia.length}`);
    }
  };

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-4">
      <h3 className="font-gujarati font-black text-xl">ગ્રામ પ્રશ્નોત્તરી 🏘️</h3>
      
      <div className="bg-amber-50 p-5 rounded-2xl font-gujarati font-bold text-sm text-stone-700 border">
        {current.q}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOpt !== null}
            className={`p-3 rounded-xl border text-xs font-bold font-gujarati ${
              selectedOpt === null 
                ? 'bg-white hover:bg-amber-50 border-stone-200' 
                : opt === current.correct 
                  ? 'bg-emerald-500 text-white border-emerald-650' 
                  : opt === selectedOpt 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {selectedOpt && (
        <button onClick={next} className="px-5 py-2 bg-amber-600 text-white rounded-lg text-xs font-gujarati font-bold">
          આગળ ➡️
        </button>
      )}
    </div>
  );
}

/* ========================================================
   GAME M: SPEED TAP (ઝડપ ટૅપ)
   ======================================================= */
function SpeedTapGame() {
  const FRUITS = [
    'સફરજન 🍎', 'કેળા 🍌', 'કેરી 🥭', 'દ્રાક્ષ 🍇', 'પપૈયું 🍍', 
    'સંતરા 🍊', 'તડબૂચ 🍉', 'સીતાફળ 🍈', 'જામફળ 🍐', 'દાડમ 🍎', 
    'શક્કરટેટી 🍈', 'જાંબુ 🍇'
  ];
  const VEGGIES = [
    'દૂધી 🥬', 'બટાકા 🥔', 'ટામેટા 🍅', 'ડુંગળી 🧅', 'લસણ 🧄', 
    'ગાજર 🥕', 'ભીંડા 🥒', 'રીંગણ 🍆', 'મરચા 🌶️', 'કોબીજ 🥬', 
    'ફુલાવર 🥦', 'આદુ 🫚'
  ];

  const generateRoundItems = () => {
    const selectedFruits = [...FRUITS].sort(() => Math.random() - 0.5).slice(0, 2);
    const selectedVeggies = [...VEGGIES].sort(() => Math.random() - 0.5).slice(0, 2);

    const pool = [
      ...selectedFruits.map((label, idx) => ({ id: `f-${idx}-${Math.random()}`, label, isTarget: true, tapped: false })),
      ...selectedVeggies.map((label, idx) => ({ id: `v-${idx}-${Math.random()}`, label, isTarget: false, tapped: false }))
    ];

    return pool.sort(() => Math.random() - 0.5);
  };

  const [items, setItems] = useState(() => generateRoundItems());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState('');

  const tap = (id) => {
    playSound('click');
    const item = items.find(i => i.id === id);
    if (item.tapped) return;

    setItems(prev => prev.map(i => i.id === id ? { ...i, tapped: true } : i));

    if (item.isTarget) {
      playSound('correct');
      setScore(prev => prev + 1);
      addCoins(2);
      
      const updatedItems = items.map(i => i.id === id ? { ...i, tapped: true } : i);
      const allTargetsTapped = updatedItems.filter(i => i.isTarget).every(i => i.tapped);
      if (allTargetsTapped) {
        setMessage('શાબાશ! તમે બધા જ ફળો શોધી લીધા છે. આગળ વધવા માટે નીચેના બટન પર ક્લિક કરો. 🎉');
      }
    } else {
      playSound('wrong');
      setMessage('ચૂકી ગયા! તે ફળ નથી, શાકભાજી છે. લાલ બોક્સ દર્શાવે છે કે તે ખોટું છે. ❌');
    }
  };

  const nextRound = () => {
    playSound('click');
    setItems(generateRoundItems());
    setRound(prev => prev + 1);
    setMessage('');
  };

  const toGujaratiNum = (num) => {
    const map = { '0':'૦', '1':'૧', '2':'૨', '3':'૩', '4':'૪', '5':'૫', '6':'૬', '7':'૭', '8':'૮', '9':'૯' };
    return num.toString().split('').map(char => map[char] || char).join('');
  };

  const allTargetsTapped = items.filter(i => i.isTarget).every(i => i.tapped);

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-4 animate-fade-in">
      <h3 className="font-gujarati font-black text-xl">ઝડપ ટૅપ ⚡</h3>
      
      <div className="flex justify-between items-center px-4">
        <span className="font-gujarati text-xs text-stone-500">સ્કોર: {toGujaratiNum(score)}</span>
        <span className="font-gujarati text-xs text-stone-500 font-bold bg-amber-100 dark:bg-stone-850 px-3 py-1 rounded-full text-amber-800 dark:text-amber-300">રાઉન્ડ: {toGujaratiNum(round)}</span>
      </div>

      <p className="font-gujarati text-xs text-stone-500">ગ્રીડમાંથી ફક્ત ફળો (ફળ 🍎, 🍌, 🍇...) પર જ ટૅપ કરો:</p>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => tap(item.id)}
            disabled={item.tapped}
            className={`p-6 rounded-[2rem] border font-gujarati font-black text-sm transition active:scale-95 shadow-md min-h-[80px] flex items-center justify-center ${
              item.tapped 
                ? item.isTarget 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : 'bg-rose-500 border-rose-600 text-white' 
                : 'bg-white dark:bg-stone-950 hover:bg-stone-50 dark:hover:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-750 dark:text-stone-150'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && (
        <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 px-4 leading-normal mt-2">
          {message}
        </p>
      )}

      {allTargetsTapped && (
        <button
          onClick={nextRound}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-gujarati font-bold text-sm shadow-md active:scale-95 transition"
        >
          આગળ વધો ➡️
        </button>
      )}
    </div>
  );
}

/* ========================================================
   GAME N: TRUE / FALSE SWIPE (સાચું કે ખોટું)
   ======================================================= */
function TrueFalseGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('true_false', TRUE_FALSE_DB));
  const [checked, setChecked] = useState(null);

  const cleanStatement = (str) => {
    if (!str) return '';
    return str
      .replace(/ગુજરાત પ્રદેશ સંબંધિત પ્રશ્ન ક્રમાંક\s*[\d૦-૯]+:\s*/gi, '')
      .replace(/^"|"$|^“|”$/g, '')
      .trim();
  };

  const handleChoice = (choice) => {
    if (checked !== null) return;
    playSound('click');
    setChecked(choice);
    if (choice === activeItem.answer) {
      playSound('correct');
      addCoins(10);
      playedController.markPlayed('true_false', activeItem.id);
    } else {
      playSound('wrong');
    }
  };

  const next = () => {
    playSound('click');
    setActiveItem(playedController.getUnplayed('true_false', TRUE_FALSE_DB));
    setChecked(null);
  };

  return (
    <div className="text-center space-y-6 max-w-sm mx-auto py-2">
      <h3 className="font-gujarati font-black text-xl">સાચું કે ખોટું 🎪</h3>
      
      <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-center min-h-[160px] animate-fade-in">
        <p className="font-gujarati font-black text-sm text-stone-700 dark:text-stone-200 leading-normal">
          "{cleanStatement(activeItem.statement)}"
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleChoice(false)}
          disabled={checked !== null}
          className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
        >
          ખોટું ❌
        </button>
        <button
          onClick={() => handleChoice(true)}
          disabled={checked !== null}
          className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-gujarati font-bold text-xs shadow-md active:scale-95 transition"
        >
          સાચું ✅
        </button>
      </div>

      {checked !== null && (
        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-2xl text-left space-y-3 animate-fade-in">
          <p className="font-gujarati text-[10px] text-stone-600 dark:text-stone-300 leading-normal">{activeItem.fact}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {checked === activeItem.answer ? '🎉 સાચું! +૧૦ કોઈન્સ' : '❌ ઉત્તર ખોટો છે'}
            </span>
            <button
              onClick={next}
              className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-gujarati font-bold hover:bg-emerald-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================
   GAME O: DAILY RIDDLE (દૈનિક ઉખાણાં)
   ======================================================= */
function RiddleGame() {
  const [activeItem, setActiveItem] = useState(() => playedController.getUnplayed('riddle', RIDDLES_DB));
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === activeItem.answer) {
      addCoins(10);
      playedController.markPlayed('riddle', activeItem.id);
    }
  };

  const nextItem = () => {
    setActiveItem(playedController.getUnplayed('riddle', RIDDLES_DB));
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-2">
      <h3 className="font-gujarati font-black text-center text-lg">દૈનિક ઉખાણાં 🌟</h3>
      
      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl text-center text-sm font-gujarati font-black text-[#21275c]">
        ઉખાણું: "{activeItem.question}"
      </div>

      <div className="grid grid-cols-2 gap-3">
        {activeItem.choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`p-3 rounded-xl border text-center font-gujarati text-xs font-bold transition ${
              selectedOption === null 
                ? 'bg-white hover:bg-indigo-50 border-stone-200 text-stone-700 dark:bg-stone-950 dark:border-stone-850' 
                : opt === activeItem.answer 
                  ? 'bg-emerald-500 border-emerald-600 text-white' 
                  : opt === selectedOption 
                    ? 'bg-rose-500 border-rose-600 text-white' 
                    : 'bg-stone-50 text-stone-400 border-stone-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-left space-y-2 animate-fade-in">
          <p className="font-gujarati text-[10px] text-stone-500 leading-normal">{activeItem.fact}</p>
          <div className="flex justify-between items-center pt-2">
            <span className="font-gujarati text-[10px] font-bold text-emerald-600">
              {selectedOption === activeItem.answer ? '🎉 સરસ! +૧૦ કોઈન્સ' : '❌ ખોટો ઉત્તર'}
            </span>
            <button
              onClick={nextItem}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-gujarati font-bold hover:bg-indigo-700 transition"
            >
              આગળ ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
