import { useState, useEffect } from 'react';
import { ScratchCardModal, MOCK_COUPONS } from './ScratchRewards';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=600",
    question: "આ વર્લ્ડ હેરિટેજ સાઈટ 'રાણી કી વાવ' કયા શહેરમાં આવેલી છે?",
    options: ["પાટણ", "અમદાવાદ", "જૂનાગઢ", "વડોદરા"],
    answer: "પાટણ"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1566378246598-5b11a0ff7f6c?auto=format&fit=crop&q=80&w=600",
    question: "આ પ્રખ્યાત સોલંકી કાળનું 'સૂર્ય મંદિર' ક્યાં આવેલું છે?",
    options: ["મોઢેરા", "સોમનાથ", "દ્વારકા", "પાલિતાણા"],
    answer: "મોઢેરા"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=600",
    question: "અરબી સમુદ્ર કિનારે આવેલું પ્રથમ જ્યોતિર્લિંગ 'સોમનાથ મંદિર' કયા જિલ્લામાં છે?",
    options: ["ગીર સોમનાથ", "દેવભૂમિ દ્વારકા", "પોરબંદર", "જૂનાગઢ"],
    answer: "ગીર સોમનાથ"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=600",
    question: "સમગ્ર એશિયામાં એકમાત્ર એશિયાટિક સિંહ કયા રાષ્ટ્રીય ઉદ્યાનમાં જોવા મળે છે?",
    options: ["ગીર રાષ્ટ્રીય ઉદ્યાન", "ડાંગ અભયારણ્ય", "બાલારામ અભયારણ્ય", "વેળાવદર બ્લેકબક"],
    answer: "ગીર રાષ્ટ્રીય ઉદ્યાન"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600",
    question: "વિશ્વવિખ્યાત મોજીલું 'સફેદ રણ' (Salt Desert) કયા જિલ્લામાં આવેલું છે?",
    options: ["કચ્છ", "સુરેન્દ્રનગર", "બનાસકાંઠા", "પાટણ"],
    answer: "કચ્છ"
  }
];

export default function GujaratQuiz() {
  const [gameState, setGameState] = useState('start'); // start | play | end
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [selectedAns, setSelectedAns] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Timer countdown hook
  useEffect(() => {
    if (gameState !== 'play' || selectedAns !== null) return;
    
    if (timer === 0) {
      handleNextQuestion(false);
      return;
    }

    const interval = setTimeout(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearTimeout(interval);
  }, [timer, gameState, selectedAns]);

  // Load Leaderboard on mount/end
  useEffect(() => {
    const userCoins = parseInt(localStorage.getItem('gujarat_coins') || '120', 10);
    const mockCompetitors = [
      { name: "ભાવેશ રાઠોડ", score: 280, rank: 1 },
      { name: "નિરવ વાઘેલા", score: 220, rank: 2 },
      { name: "તમે (અનિલભાઈ)", score: userCoins, rank: 3 },
      { name: "જયેશ મેવાડા", score: 180, rank: 4 },
      { name: "પ્રીતિ ચૌહાણ", score: 140, rank: 5 }
    ];
    setLeaderboard(mockCompetitors.sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 })));
  }, [gameState]);

  const handleStartGame = () => {
    setGameState('play');
    setCurrentIdx(0);
    setScore(0);
    setTimer(15);
    setSelectedAns(null);
  };

  const handleAnswerClick = (option) => {
    if (selectedAns !== null) return;
    setSelectedAns(option);
    
    const isCorrect = option === QUIZ_QUESTIONS[currentIdx].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      // Award Coins instantly per correct answer
      const coins = parseInt(localStorage.getItem('gujarat_coins') || '0', 10);
      localStorage.setItem('gujarat_coins', (coins + 5).toString());
      window.dispatchEvent(new Event('coins-updated'));
    }

    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 1200);
  };

  const handleNextQuestion = (lastWasCorrect) => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTimer(15);
      setSelectedAns(null);
    } else {
      setGameState('end');
      // If perfect score, unlock coupon!
      if (score + (lastWasCorrect ? 1 : 0) === QUIZ_QUESTIONS.length) {
        // Trigger Scratch Reward Modal
        const randomCoupon = MOCK_COUPONS[Math.floor(Math.random() * MOCK_COUPONS.length)];
        setTimeout(() => {
          setActiveCoupon(randomCoupon);
        }, 800);
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">ગુજરાત ક્વિઝ અને કોઈન્સ 🏆</h2>
        <p className="font-gujarati text-outline text-lg">સાચા જવાબો આપો, સિક્કા જીતો અને લીડરબોર્ડમાં પ્રથમ ક્રમ મેળવો.</p>
      </div>

      {gameState === 'start' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 rounded-[2.5rem] shadow-sm text-center flex flex-col items-center justify-center gap-6">
          <span className="material-symbols-outlined text-6xl text-amber-500 animate-bounce">emoji_events</span>
          <h3 className="font-gujarati font-black text-2xl text-on-surface">ક્વિઝ શરૂ કરવા તૈયાર છો?</h3>
          <p className="font-gujarati text-xs text-stone-500 max-w-sm leading-relaxed">
            દરેક પ્રશ્ન માટે ૧૫ સેકન્ડનો સમય મળશે. સાચા જવાબ પર **+૫ સિક્કા** અને ૫ માંથી ૫ સાચા પડે તો **સરપ્રાઇઝ સ્ક્રૅચ કૂપન** મળશે!
          </p>
          <button
            onClick={handleStartGame}
            className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-gujarati font-black text-base shadow-xl active:scale-95 transition-all"
          >
            રમત શરૂ કરો 🚀
          </button>
        </div>
      )}

      {gameState === 'play' && (
        <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm flex flex-col gap-6 max-w-xl mx-auto">
          {/* Progress Bar & Timer */}
          <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
            <span className="font-gujarati font-bold text-xs text-stone-400">
              પ્રશ્ન {currentIdx + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className={`h-8 w-16 rounded-full flex items-center justify-center font-mono font-black text-sm text-white ${timer < 5 ? 'bg-red-500 animate-pulse' : 'bg-primary'}`}>
              00:{timer < 10 ? `0${timer}` : timer}
            </span>
          </div>

          {/* Photo */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-md relative">
            <img src={QUIZ_QUESTIONS[currentIdx].image} className="w-full h-full object-cover" alt="Quiz Landmark" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Question Text */}
          <h4 className="font-gujarati font-black text-lg text-on-surface leading-normal text-center">
            {QUIZ_QUESTIONS[currentIdx].question}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUIZ_QUESTIONS[currentIdx].options.map((option, idx) => {
              const isSelected = selectedAns === option;
              const isCorrectAns = option === QUIZ_QUESTIONS[currentIdx].answer;
              
              let btnClass = "border-stone-200 dark:border-stone-800 hover:border-primary text-stone-700 dark:text-stone-300";
              if (selectedAns !== null) {
                if (isCorrectAns) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-lg";
                else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-lg";
                else btnClass = "opacity-50 border-stone-100 dark:border-stone-850 text-stone-400";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(option)}
                  disabled={selectedAns !== null}
                  className={`border-2 p-4 rounded-2xl font-gujarati font-bold text-sm text-center transition-all duration-300 active:scale-95 ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {gameState === 'end' && (
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          
          {/* Result Panel */}
          <div className="flex-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 rounded-[2.5rem] shadow-sm text-center flex flex-col items-center justify-center gap-6">
            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">check_circle</span>
            <h3 className="font-gujarati font-black text-2xl text-on-surface">ક્વિઝ સમાપ્ત! 🏁</h3>
            <div className="bg-[#fef8f1] dark:bg-stone-950 p-5 rounded-2xl border border-primary/10 max-w-xs w-full text-center">
              <p className="font-gujarati text-xs text-stone-400 font-bold uppercase tracking-widest">તમારો સ્કોર</p>
              <h4 className="font-headline font-black text-4xl mt-1 text-primary">{score} / {QUIZ_QUESTIONS.length}</h4>
              <p className="font-gujarati text-[10px] text-stone-500 mt-2">જીતેલા કોઈન્સ: +{score * 5} 🪙</p>
            </div>

            {score === QUIZ_QUESTIONS.length && (
              <p className="font-gujarati text-xs text-emerald-600 font-bold animate-bounce">
                🎉 અભિનંદન! ૧૦૦% સાચા જવાબો બદલ સરપ્રાઇઝ કૂપન અનલોક થઈ છે!
              </p>
            )}

            <button
              onClick={handleStartGame}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-gujarati font-black text-base shadow-md active:scale-95 transition-all"
            >
              ફરીથી રમો 🔄
            </button>
          </div>

          {/* Leaderboard Panel */}
          <div className="w-full md:w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm space-y-4">
            <h4 className="font-gujarati font-black text-xl text-on-surface">ગુજરાત લીડરબોર્ડ 🏆</h4>
            <div className="space-y-3">
              {leaderboard.map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.name.includes("તમે") ? 'bg-primary/10 border-primary/20 scale-[1.02]' : 'border-stone-100 dark:border-stone-800'}`}>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white ${item.rank === 1 ? 'bg-yellow-400' : item.rank === 2 ? 'bg-stone-400' : item.rank === 3 ? 'bg-orange-400' : 'bg-stone-200 text-stone-600'}`}>
                    {item.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-100 truncate">{item.name}</h5>
                    <p className="font-gujarati text-[9px] text-stone-400">મુખ્ય કોઈન્સ સ્કોર</p>
                  </div>
                  <span className="font-headline font-black text-sm text-primary">{item.score} 🪙</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Rewards Scratch Card popup trigger */}
      {activeCoupon && (
        <ScratchCardModal 
          coupon={activeCoupon}
          onClose={() => setActiveCoupon(null)}
        />
      )}
    </div>
  );
}
