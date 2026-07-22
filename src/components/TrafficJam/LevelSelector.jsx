import React from 'react';

const LevelSelector = ({ levels, progress, onSelectLevel }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 w-full">
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-w-2xl mx-auto pb-20">
        {levels.map((level, index) => {
          const levelProgress = progress[level.id];
          const isUnlocked = index === 0 || progress[levels[index - 1]?.id]?.completed;
          const stars = levelProgress?.stars || 0;

          return (
            <button
              key={level.id}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`
                relative aspect-square rounded-2xl flex flex-col items-center justify-center shadow-sm transition-all
                ${isUnlocked 
                  ? 'bg-white dark:bg-stone-800 hover:scale-105 active:scale-95 cursor-pointer border border-stone-200 dark:border-stone-700 shadow-orange-500/20' 
                  : 'bg-stone-200 dark:bg-stone-800/50 opacity-60 cursor-not-allowed border border-transparent'}
                ${levelProgress?.completed ? 'border-orange-500 dark:border-orange-500' : ''}
              `}
            >
              <span className={`text-2xl font-black ${isUnlocked ? 'text-stone-800 dark:text-white' : 'text-stone-400 dark:text-stone-600'}`}>
                {level.id}
              </span>
              
              {isUnlocked && (
                <div className="absolute bottom-2 flex gap-0.5">
                  {[1, 2, 3].map(star => (
                    <span 
                      key={star} 
                      className={`material-symbols-outlined text-[10px] ${star <= stars ? 'text-yellow-400 fill-current' : 'text-stone-300 dark:text-stone-600'}`}
                      style={star <= stars ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      star
                    </span>
                  ))}
                </div>
              )}

              {!isUnlocked && (
                <span className="material-symbols-outlined absolute text-stone-400/50 text-4xl">
                  lock
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
