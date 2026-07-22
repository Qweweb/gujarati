import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from './GameBoard';
import LevelSelector from './LevelSelector';
import LevelCompleteModal from './LevelCompleteModal';
import levelsData from './data/levels_pack1.json';

const TrafficJamHome = () => {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(null);
  const [progress, setProgress] = useState({});
  const [moves, setMoves] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem('traffic_jam_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem('traffic_jam_progress', JSON.stringify(newProgress));
  };

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
    setMoves(0);
    setShowWinModal(false);
  };

  const handleWin = () => {
    setShowWinModal(true);
    
    // Calculate stars
    let stars = 1;
    if (moves <= currentLevel.minMoves + 2) stars = 3;
    else if (moves <= currentLevel.minMoves + 6) stars = 2;

    const currentBestStars = progress[currentLevel.id]?.stars || 0;
    
    saveProgress({
      ...progress,
      [currentLevel.id]: {
        completed: true,
        stars: Math.max(stars, currentBestStars),
        bestMoves: Math.min(moves, progress[currentLevel.id]?.bestMoves || Infinity)
      }
    });
  };

  const handleNextLevel = () => {
    const nextIndex = levelsData.findIndex(l => l.id === currentLevel.id) + 1;
    if (nextIndex < levelsData.length) {
      handleSelectLevel(levelsData[nextIndex]);
    } else {
      setCurrentLevel(null); // Back to menu
    }
  };

  const handleRetry = () => {
    // Force re-mount of GameBoard by clearing and setting level
    const level = currentLevel;
    setCurrentLevel(null);
    setTimeout(() => handleSelectLevel(level), 10);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-stone-50 dark:bg-stone-900 relative">
      {/* Header */}
      <header className="flex items-center p-4 bg-white dark:bg-stone-800 shadow-sm z-10">
        <button 
          onClick={() => currentLevel ? setCurrentLevel(null) : navigate('/games')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-700 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-stone-600 dark:text-stone-300">arrow_back</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="font-gujarati font-black text-xl text-stone-800 dark:text-white">
            {currentLevel ? `લેવલ ${currentLevel.id}` : 'ટ્રાફિક જામ'}
          </h1>
          {currentLevel && (
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Moves: {moves}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {currentLevel ? (
          <div className="flex-1 flex flex-col p-4 animate-fade-in">
            <div className="text-center mb-2 font-gujarati text-stone-600 dark:text-stone-300">
              લાલ કાર ને બહાર કાઢો!
            </div>
            
            <GameBoard 
              level={currentLevel} 
              onWin={handleWin}
              onMove={() => setMoves(m => m + 1)}
            />
            
            <div className="mt-auto flex justify-center gap-4 py-4">
              <button 
                onClick={handleRetry}
                className="w-14 h-14 bg-stone-200 dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-all text-stone-600 dark:text-stone-300"
              >
                <span className="material-symbols-outlined text-3xl">refresh</span>
              </button>
            </div>
          </div>
        ) : (
          <LevelSelector 
            levels={levelsData} 
            progress={progress} 
            onSelectLevel={handleSelectLevel}
          />
        )}
      </div>

      {showWinModal && currentLevel && (
        <LevelCompleteModal 
          moves={moves}
          minMoves={currentLevel.minMoves || 15}
          onNext={handleNextLevel}
          onRetry={handleRetry}
          onMenu={() => setCurrentLevel(null)}
        />
      )}
    </div>
  );
};

export default TrafficJamHome;
