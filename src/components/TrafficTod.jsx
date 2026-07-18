import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOrCreateUserId } from '../utils/otlo_helper';
import LeaderboardUnified from './LeaderboardUnified';

export default function TrafficTod() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING or GAMEOVER
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name
    const name = JSON.parse(localStorage.getItem('user_profile') || '{}').name ||
      localStorage.getItem('google_name') ||
      localStorage.getItem('user_full_name') ||
      (() => { try { return JSON.parse(localStorage.getItem('sanskari_kbc_profile') || '{}').name || ''; } catch { return ''; } })() ||
      'ખેલાડી';
    setUserName(name);
  }, []);

  useEffect(() => {
    const handleMessage = async (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'GAME_OVER') {
          const { score, coins, level } = payload.data;
          setFinalScore(score);
          setFinalCoins(coins);
          setGameState('GAMEOVER');
          
          await saveScoreAndFetchLeaderboard(score, coins, level);
        } else if (payload.event === 'SHOW_LEADERBOARD') {
          setGameState('LEADERBOARD');
          await fetchLeaderboardOnly();
        }
      } catch (e) {
        // ignore other messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [userName]);

  const fetchLeaderboardOnly = async () => {
    try {
      const { data } = await supabase
        .from('traffic_tod_scores')
        .select('user_id, player_name, high_score')
        .order('high_score', { ascending: false })
        .limit(100);
        
      if (data) {
        const uid = getOrCreateUserId();
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        
        // Filter to unique users to keep only their highest score
        const unique = [];
        const seen = new Set();
        for (const item of data) {
          const key = item.user_id ? `id:${item.user_id}` : `name:${item.player_name}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
        const top10 = unique.slice(0, 10);
        
        const userIds = top10.map(x => x.user_id).filter(Boolean);
        
        let profileMap = {};
        if (userIds.length > 0) {
          const { fetchProfilesForUserIds } = await import('../utils/otlo_helper');
          profileMap = await fetchProfilesForUserIds(userIds);
        }

        const mapped = top10.map((item) => {
          const isUser = item.player_name === userName || item.user_id === uid;
          const uProf = profileMap[item.user_id] || {};
          return {
            name: item.player_name,
            score: item.high_score,
            isUser,
            city: isUser ? (profile.city || uProf.city) : (uProf.city || null),
            avatar: isUser ? (profile.avatar || uProf.photo_url) : (uProf.photo_url || null)
          };
        });
        setLeaderboard(mapped);
      }
    } catch (err) {
      console.log("Error fetching leaderboard:", err);
    }
  };

  const saveScoreAndFetchLeaderboard = async (score, coins, level) => {
    const uid = getOrCreateUserId();
    
    // Save to table
    try {
      let previousHighScore = 0;
      try {
        const { data: existingData } = await supabase
          .from('traffic_tod_scores')
          .select('high_score')
          .eq('user_id', uid)
          .single();
        if (existingData) {
          previousHighScore = existingData.high_score || 0;
        }
      } catch (e) {}

      const newHighScore = Math.max(score, previousHighScore);

      await supabase.from('traffic_tod_scores').upsert({
        user_id: uid, 
        player_name: userName,
        high_score: newHighScore,
        total_coins: coins,
        level_reached: level,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.log("Error saving score (table might not exist yet):", err);
    }

    // Fetch Leaderboard
    try {
      const { data } = await supabase
        .from('traffic_tod_scores')
        .select('user_id, player_name, high_score')
        .order('high_score', { ascending: false })
        .limit(100);
        
      if (data) {
        const uid = getOrCreateUserId();
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        
        // Filter to unique users to keep only their highest score
        const unique = [];
        const seen = new Set();
        for (const item of data) {
          const key = item.user_id ? `id:${item.user_id}` : `name:${item.player_name}`;
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
        const top10 = unique.slice(0, 10);
        
        const userIds = top10.map(x => x.user_id).filter(Boolean);
        
        let profileMap = {};
        if (userIds.length > 0) {
          const { fetchProfilesForUserIds } = await import('../utils/otlo_helper');
          profileMap = await fetchProfilesForUserIds(userIds);
        }

        const mapped = top10.map((item, idx) => {
          const isUser = item.player_name === userName || item.user_id === uid;
          const uProf = profileMap[item.user_id] || {};
          return {
            name: item.player_name,
            score: item.high_score,
            isUser,
            city: isUser ? (profile.city || uProf.city) : (uProf.city || null),
            avatar: isUser ? (profile.avatar || uProf.photo_url) : (uProf.photo_url || null)
          };
        });
        setLeaderboard(mapped);
      }
    } catch (err) {
      console.log("Error fetching leaderboard:", err);
    }
  };

  const restartGame = () => {
    setGameState('PLAYING');
    // Reload the iframe to restart the game
    const iframe = document.getElementById('traffic-tod-frame');
    if (iframe) iframe.src = iframe.src;
  };

  return (
    <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', background: '#222', position: 'relative' }}>
      
      {/* Universal Back Button */}
      <div 
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: 15, left: 15, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', color: 'white',
          padding: '8px 12px', borderRadius: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 5,
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <span className="material-symbols-outlined">arrow_back</span>
        પાછા જાઓ
      </div>
      
      {/* The Game Iframe */}
      <iframe 
        id="traffic-tod-frame"
        src="/traffic-tod.html" 
        style={{ 
          width: '100%', height: '100%', border: 'none', display: 'block',
          opacity: gameState === 'PLAYING' ? 1 : 0, 
          pointerEvents: gameState === 'PLAYING' ? 'auto' : 'none',
          transition: 'opacity 0.3s'
        }}
        title="Traffic Tod"
      />

      {/* React Native Leaderboard UI (Shows on GAME_OVER) */}
      {gameState === 'GAMEOVER' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.95)', color: 'white', zIndex: 1000,
          padding: '40px 15px 15px 15px', boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#FF4444', fontSize: '2rem', margin: '0 0 10px 0', textAlign: 'center', textShadow: '2px 2px 0 #000' }}>લોચો વાગ્યો!</h1>
          
          <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ margin: 0, color: '#ccc', fontSize: '12px' }}>DISTANCE</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{finalScore}m</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ margin: 0, color: '#ccc', fontSize: '12px' }}>BHAADA</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>₹ {finalCoins}</p>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="w-full max-w-md px-2 pointer-events-auto text-left" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <LeaderboardUnified 
              title="ટ્રાફિક તોડ લીડરબોર્ડ"
              icon="social_leaderboard"
              data={leaderboard}
              scoreLabel="m"
              showStreak={false}
            />
          </div>

          <button 
            onClick={restartGame}
            style={{
              padding: '12px 30px', fontSize: '18px', fontWeight: 'bold', pointerEvents: 'auto',
              background: 'linear-gradient(135deg, #00FF44, #00CC00)', color: 'white',
              border: 'none', borderRadius: '30px', marginTop: '15px', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 255, 68, 0.4)', textTransform: 'uppercase', flexShrink: 0
            }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Main Screen Leaderboard View */}
      {gameState === 'LEADERBOARD' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.95)', color: 'white', zIndex: 10000,
          padding: 'calc(env(safe-area-inset-top, 40px) + 20px) 20px 40px', boxSizing: 'border-box', backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}>
          <div className="w-full max-w-md px-4 pointer-events-auto text-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <LeaderboardUnified 
              title="ટ્રાફિક તોડ લીડરબોર્ડ"
              icon="social_leaderboard"
              data={leaderboard}
              scoreLabel="m"
              showStreak={false}
              onClose={() => setGameState('PLAYING')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
