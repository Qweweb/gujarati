import { useState, useEffect } from 'react';
import { ScratchCardModal, MOCK_COUPONS } from './ScratchRewards';

// Pool of daily word puzzles (famous places in Gujarat)
const PUZZLES = [
  { word: "સોમનાથ", characters: ["સો", "મ", "ના", "થ"], hint: "બાર જ્યોતિર્લિંગમાં પ્રથમ સ્થાન ધરાવતું યાત્રાધામ 🛕" },
  { word: "જામનગર", characters: ["જા", "મ", "ન", "ગ", "ર"], hint: "છોટી કાશી અને બાંધણી માટે જાણીતું શહેર 🏢" },
  { word: "ગિરનાર", characters: ["ગિ", "ર", "ના", "ર"], hint: "ગુજરાતનો સૌથી ઊંચો પર્વત જ્યાં દત્ત શિખર આવેલું છે ⛰️" },
  { word: "પાટણ", characters: ["પા", "ટ", "ણ"], hint: "પ્રખ્યાત સહસ્ત્રલિંગ તળાવ અને પટોળાનું ઘર 👗" },
  { word: "સાપુતારા", characters: ["સા", "પુ", "તા", "રા"], hint: "ગુજરાતનું એકમાત્ર સુંદર હિલ સ્ટેશન 🌲" },
  { word: "દ્વારકા", characters: ["દ્વા", "ર", "કા"], hint: "શ્રી કૃષ્ણની સુવર્ણ નગરી અને ચાર ધામ પૈકીનું એક 🚩" },
  { word: "દભોઈ", characters: ["દ", "ભો", "ઈ"], hint: "પ્રખ્યાત મણિભદ્ર વીર જૈન તીર્થ અને ઐતિહાસિક કિલ્લો 🏰" }
];

export default function DailyChallenge() {
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [selectedChars, setSelectedChars] = useState([]);
  const [shuffledChars, setShuffledChars] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [activeCoupon, setActiveCoupon] = useState(null);

  useEffect(() => {
    // Check if played today
    const today = new Date().toLocaleDateString();
    const lastPlayed = localStorage.getItem('otlo_challenge_last_date');
    const savedStreak = parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10);
    setStreak(savedStreak);

    if (lastPlayed === today) {
      setAlreadyPlayed(true);
    }

    // Select puzzle based on current day of the week
    const dayIndex = new Date().getDay() % PUZZLES.length;
    const puzzle = PUZZLES[dayIndex];
    setCurrentPuzzle(puzzle);

    // Shuffle characters (ensure it is not in the correct order initially)
    let shuffled = [...puzzle.characters];
    while (shuffled.join('') === puzzle.word) {
      shuffled.sort(() => Math.random() - 0.5);
    }
    setShuffledChars(shuffled);
  }, []);

  const handleCharClick = (char, index) => {
    if (isCorrect || alreadyPlayed) return;
    
    // Add to selected characters
    const newSelected = [...selectedChars, { char, origIndex: index }];
    setSelectedChars(newSelected);
    
    // Remove from shuffled characters list (by marking it as used/null)
    const newShuffled = [...shuffledChars];
    newShuffled[index] = null;
    setShuffledChars(newShuffled);

    // Check if word is completed and correct
    if (newSelected.length === currentPuzzle.characters.length) {
      const constructedWord = newSelected.map(item => item.char).join('');
      if (constructedWord === currentPuzzle.word) {
        setIsCorrect(true);
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        // Save today's completion and streak in localStorage
        const today = new Date().toLocaleDateString();
        localStorage.setItem('otlo_challenge_last_date', today);
        localStorage.setItem('otlo_challenge_streak', newStreak.toString());
        
        // Award Coins
        const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
        localStorage.setItem('gujarat_coins', (coins + 15).toString());
        window.dispatchEvent(new Event('coins-updated'));

        // Unlock scratch reward
        setTimeout(() => {
          const randomCoupon = MOCK_COUPONS[Math.floor(Math.random() * MOCK_COUPONS.length)];
          setActiveCoupon(randomCoupon);
        }, 1200);
      } else {
        // Play error vibrate / toast
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "❌ ખોટો ક્રમ! કૃપા કરીને ફરી પ્રયત્ન કરો." } }));
        // Reset selections automatically after 1 second
        setTimeout(() => {
          resetPuzzle();
        }, 1000);
      }
    }
  };

  const handleRemoveChar = (selItem, selIndex) => {
    if (isCorrect || alreadyPlayed) return;
    
    // Remove from selections
    const newSelected = selectedChars.filter((_, idx) => idx !== selIndex);
    setSelectedChars(newSelected);

    // Put back into shuffled list at original index
    const newShuffled = [...shuffledChars];
    newShuffled[selItem.origIndex] = selItem.char;
    setShuffledChars(newShuffled);
  };

  const resetPuzzle = () => {
    setSelectedChars([]);
    // Reshuffle original puzzle characters
    let shuffled = [...currentPuzzle.characters];
    shuffled.sort(() => Math.random() - 0.5);
    setShuffledChars(shuffled);
  };

  if (!currentPuzzle) return null;

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">શબ્દ રમત (Daily Word Scramble) 🧠</h2>
        <p className="font-gujarati text-outline text-lg">રોજ આ પઝલ ઉકેલીને કોઈન્સ અને કૂપન રિવોર્ડ્સ મેળવો.</p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 rounded-3xl text-center shadow-sm">
          <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest">આજની ગેમ સ્ટેટસ</p>
          <h4 className="font-gujarati font-black text-xl mt-1 text-on-surface">
            {alreadyPlayed || isCorrect ? "✅ પૂર્ણ થયેલ" : "🎮 રમવા માટે બાકી"}
          </h4>
        </div>
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 rounded-3xl text-center shadow-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-amber-500 animate-pulse text-3xl">local_fire_department</span>
          <div className="text-left">
            <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest">ડેઇલી સ્ટ્રીક</p>
            <h4 className="font-headline font-black text-xl text-on-surface">{streak} દિવસ</h4>
          </div>
        </div>
      </div>

      {/* Main Game Container Container */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden">
        
        {/* Hint Section */}
        <div className="space-y-2 max-w-sm">
          <span className="bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block">
            આજની હિંટ / ઈશારો 💡
          </span>
          <p className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {currentPuzzle.hint}
          </p>
        </div>

        {/* Word Display Slots */}
        <div className="flex gap-3 justify-center min-h-[64px] items-center">
          {currentPuzzle.characters.map((_, idx) => {
            const selectedItem = selectedChars[idx];
            return (
              <button
                key={idx}
                onClick={() => selectedItem && handleRemoveChar(selectedItem, idx)}
                disabled={isCorrect || alreadyPlayed}
                className={`h-16 w-16 rounded-2xl flex items-center justify-center font-gujarati font-black text-2xl border-2 transition-all active:scale-90 ${selectedItem ? 'bg-primary text-white border-primary shadow-lg' : 'bg-[#fef8f1] dark:bg-stone-950 border-stone-200 dark:border-stone-800 border-dashed text-transparent'}`}
              >
                {selectedItem ? selectedItem.char : ""}
              </button>
            );
          })}
        </div>

        {/* Shuffled Character Bubbles to Tap Tap */}
        {!isCorrect && !alreadyPlayed ? (
          <div className="space-y-4 w-full">
            <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest">સાચો ક્રમ ગોઠવવા અક્ષરો પર ટેપ કરો:</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {shuffledChars.map((char, idx) => {
                if (char === null) {
                  return <div key={idx} className="h-16 w-16 bg-stone-100 dark:bg-stone-950 border-2 border-stone-200/20 dark:border-stone-850 border-dashed rounded-2xl shrink-0" />;
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleCharClick(char, idx)}
                    className="h-16 w-16 bg-white dark:bg-stone-950 border-2 border-primary/20 hover:border-primary text-primary hover:text-white hover:bg-primary rounded-2xl font-gujarati font-black text-2xl shadow-sm transition-all active:scale-90 flex items-center justify-center"
                  >
                    {char}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={resetPuzzle}
              className="text-xs text-primary font-gujarati font-black hover:underline flex items-center gap-1 mx-auto mt-2"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              ફરીથી ગોઠવો (Reset)
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20 px-8 py-6 rounded-3xl flex flex-col items-center gap-2 max-w-sm w-full animate-fade-in shadow-sm">
            <span className="material-symbols-outlined text-4xl animate-bounce">check_circle</span>
            <h4 className="font-gujarati font-black text-lg">અદ્ભુત વિજય! 🎉</h4>
            <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 leading-normal">
              તમે સાચો શબ્દ **{currentPuzzle.word}** શોધી લીધો છે. તમને મળ્યા છે **+૧૫ ગુજરાત સિક્કા**!
            </p>
          </div>
        )}
      </section>

      {/* Rewards Scratch Card popup trigger */}
      {activeCoupon && (
        <ScratchCardModal 
          coupon={activeCoupon}
          onClose={() => {
            setActiveCoupon(null);
            setAlreadyPlayed(true);
          }}
        />
      )}
    </div>
  );
}
