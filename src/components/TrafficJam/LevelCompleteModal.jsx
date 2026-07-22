import React from 'react';

const LevelCompleteModal = ({ moves, minMoves, onNext, onRetry, onMenu }) => {
  // Simple star calculation based on moves
  let stars = 1;
  if (moves <= minMoves + 2) stars = 3;
  else if (moves <= minMoves + 6) stars = 2;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-800 rounded-3xl p-8 max-w-sm w-[90%] shadow-2xl text-center transform transition-all scale-100 animate-bounce-in">
        
        <div className="mb-4">
          <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-gujarati">
            અદભુત!
          </span>
          <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">Level Cleared!</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(star => (
            <span 
              key={star} 
              className={`material-symbols-outlined text-5xl drop-shadow-md transition-all duration-500 ${star <= stars ? 'text-yellow-400 fill-current' : 'text-stone-300 dark:text-stone-600'}`}
              style={{
                fontVariationSettings: "'FILL' 1",
                transform: star <= stars ? 'scale(1.1)' : 'scale(1)',
                animationDelay: `${star * 150}ms`
              }}
            >
              star
            </span>
          ))}
        </div>

        <div className="bg-stone-100 dark:bg-stone-700 rounded-xl p-4 mb-6 text-stone-700 dark:text-stone-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">તમારા મૂવ્સ (Moves):</span>
            <span className="font-black text-xl">{moves}</span>
          </div>
          <div className="flex justify-between items-center text-sm opacity-80">
            <span>શ્રેષ્ઠ (Best):</span>
            <span>{minMoves}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onNext}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="font-gujarati text-lg">આગળ વધો</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onRetry}
              className="flex-1 py-3 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-white font-bold rounded-xl transition-transform active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
            <button 
              onClick={onMenu}
              className="flex-1 py-3 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-white font-bold rounded-xl transition-transform active:scale-95 flex items-center justify-center"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteModal;
