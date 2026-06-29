import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOrCreateUserId } from '../utils/otlo_helper';
import LeaderboardUnified from './LeaderboardUnified';

export default function FarasanSlicer() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('PLAYING'); 
  const [finalScore, setFinalScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
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
          const { score } = payload.data;
          setFinalScore(score);
          setGameState('GAMEOVER');
          await saveScoreAndFetchLeaderboard(score);
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
        .from('farasan_scores')
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
        
        let cityMap = {};
        if (userIds.length > 0) {
          const { fetchCitiesForUserIds } = await import('../utils/otlo_helper');
          cityMap = await fetchCitiesForUserIds(userIds);
        }

        const mapped = top10.map((item) => {
          const isUser = item.player_name === userName || item.user_id === uid;
          return {
            name: item.player_name,
            score: item.high_score,
            isUser,
            city: isUser ? (profile.city || cityMap[item.user_id]) : (cityMap[item.user_id] || null)
          };
        });
        setLeaderboard(mapped);
      }
    } catch (err) {
      console.log("Error fetching leaderboard:", err);
    }
  };

  const saveScoreAndFetchLeaderboard = async (score) => {
    const uid = getOrCreateUserId();
    
    try {
      let previousHighScore = 0;
      try {
        const { data: existingData } = await supabase
          .from('farasan_scores')
          .select('high_score')
          .eq('user_id', uid)
          .single();
        if (existingData) {
          previousHighScore = existingData.high_score || 0;
        }
      } catch (e) {}

      const newHighScore = Math.max(score, previousHighScore);

      await supabase.from('farasan_scores').upsert({
        user_id: uid, 
        player_name: userName,
        high_score: newHighScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.log("Error saving score (table might not exist):", err);
    }

    try {
      const { data } = await supabase
        .from('farasan_scores')
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
        
        let cityMap = {};
        if (userIds.length > 0) {
          const { fetchCitiesForUserIds } = await import('../utils/otlo_helper');
          cityMap = await fetchCitiesForUserIds(userIds);
        }

        const mapped = top10.map((item, idx) => {
          const isUser = item.player_name === userName || item.user_id === uid;
          return {
            name: item.player_name,
            score: item.high_score,
            isUser,
            city: isUser ? (profile.city || cityMap[item.user_id]) : (cityMap[item.user_id] || null)
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
    const iframe = document.getElementById('farasan-frame');
    if (iframe) iframe.src = iframe.src;
  };

  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: '#2B1814', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '15px', background: '#73322B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #2B1814', position: 'relative', zIndex: 20 }}>
        <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(250,232,215,0.12)', border: '2px solid rgba(250,232,215,0.2)', borderRadius: 10, cursor: 'pointer', margin: 0, padding: 0, color: '#FAE8D7' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontWeight: 700 }}>arrow_back</span>
        </button>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#FAE8D7', fontFamily: '"Noto Serif Gujarati", serif', fontWeight: 800 }}>ફરસાણ સ્લાઈસર</h2>
        <div style={{ width: '36px' }}></div>
      </div>

      {/* Game Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          id="farasan-frame"
          src="/slicer.html?mode=farasan"
          style={{ width: '100%', height: '100%', border: 'none', display: gameState === 'PLAYING' ? 'block' : 'none' }}
          title="Farasan Slicer Game"
        />

        {/* Custom Game Over Overlay */}
        {gameState === 'GAMEOVER' && (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'radial-gradient(circle at 50% 30%, rgba(115, 50, 43, 0.96) 0%, rgba(43, 24, 20, 0.98) 75%)', 
            backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'flex-start', zIndex: 10, padding: '20px', paddingTop: '50px', boxSizing: 'border-box',
            overflowY: 'auto', WebkitOverflowScrolling: 'touch'
          }}>
            
            {/* Chunky 3D GameOver Card */}
            <div style={{
              background: '#2E1005', border: '4px solid #0C0F19', borderRadius: '24px',
              padding: '28px 20px 24px 24px', boxShadow: '0 8px 0 #0C0F19', width: '100%', maxWidth: '360px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative',
              boxSizing: 'border-box', marginBottom: '20px'
            }}>
              {/* Badge Icon at Top */}
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #0C0F19',
                background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'absolute', top: -32, left: 'calc(50% - 30px)', boxShadow: '0 4px 0 #0C0F19'
              }}>
                <span style={{ fontSize: '30px' }}>💥</span>
              </div>
              
              {/* Ribbon Header */}
              <div style={{
                background: '#73322B', border: '3px solid #0C0F19', borderRadius: '12px',
                padding: '6px 20px', transform: 'rotate(-1.5deg)', boxShadow: '0 4px 0 #0C0F19',
                marginTop: '10px'
              }}>
                <h1 style={{
                  margin: 0, fontSize: '22px', fontWeight: 900, color: '#FFFFFF',
                  textShadow: '1.5px 1.5px 0px #0C0F19', letterSpacing: '1px', textTransform: 'uppercase'
                }}>
                  આઉટ!
                </h1>
              </div>
              
              {/* Score Box */}
              <div style={{
                background: '#451A03', border: '3px solid #0C0F19', borderRadius: '16px',
                width: '100%', padding: '12px', boxSizing: 'border-box', marginTop: '20px',
                boxShadow: 'inset 0 4px 0 rgba(0,0,0,0.25)', textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#FAE8D7', fontSize: '15px', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>તમારો સ્કોર</p>
                <h2 style={{ margin: '5px 0 0 0', color: '#FF8E1F', fontSize: '32px', fontWeight: 900, textShadow: '2px 2px 0px #0C0F19', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                  {finalScore}
                </h2>
              </div>
            </div>

            {/* Leaderboard Wrapper */}
            <div style={{ width: '100%', maxWidth: '400px', marginBottom: '25px', pointerEvents: 'auto', textAlign: 'left' }}>
              <LeaderboardUnified 
                title="ફરસાણ સ્લાઈસર લીડરબોર્ડ"
                icon="social_leaderboard"
                data={leaderboard}
                scoreLabel="સ્કોર"
                showStreak={false}
                theme="kathiawar"
              />
            </div>

            {/* Buttons Stack */}
            <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '360px', justifyContent: 'center' }}>
              <button 
                onClick={restartGame}
                style={{
                  pointerEvents: 'auto', flex: 1, padding: '12px 18px', fontSize: '16px',
                  background: '#00C853', color: '#FFF', border: '4px solid #0C0F19',
                  borderRadius: '18px', cursor: 'pointer', fontWeight: 900,
                  boxShadow: 'inset 0 -6px 0 #009624, 0 6px 0 #0C0F19', textShadow: '1.5px 1.5px 0px #0C0F19',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease', outline: 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(4px)';
                  e.currentTarget.style.boxShadow = 'inset 0 -2px 0 #009624, 0 2px 0 #0C0F19';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'inset 0 -6px 0 #009624, 0 6px 0 #0C0F19';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'inset 0 -6px 0 #009624, 0 6px 0 #0C0F19';
                }}
              >
                ફરી રમો 🔄
              </button>
              <button 
                onClick={() => navigate('/games')}
                style={{
                  pointerEvents: 'auto', flex: 1, padding: '12px 18px', fontSize: '16px',
                  background: '#FAE8D7', color: '#2B1814', border: '4px solid #0C0F19',
                  borderRadius: '18px', cursor: 'pointer', fontWeight: 900,
                  boxShadow: 'inset 0 -6px 0 #D1C0B0, 0 6px 0 #0C0F19', textShadow: 'none',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease', outline: 'none'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(4px)';
                  e.currentTarget.style.boxShadow = 'inset 0 -2px 0 #D1C0B0, 0 2px 0 #0C0F19';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'inset 0 -6px 0 #D1C0B0, 0 6px 0 #0C0F19';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'inset 0 -6px 0 #D1C0B0, 0 6px 0 #0C0F19';
                }}
              >
                બહાર નીકળો 🚪
              </button>
            </div>
          </div>
        )}

        {/* Custom Start Screen Leaderboard Overlay */}
        {gameState === 'LEADERBOARD' && (
          <div style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'radial-gradient(circle at 50% 30%, rgba(115, 50, 43, 0.96) 0%, rgba(43, 24, 20, 0.98) 75%)', 
            backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 'calc(env(safe-area-inset-top, 40px) + 20px) 20px 40px', boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            <div style={{ width: '100%', maxWidth: '400px', flex: 1, pointerEvents: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <LeaderboardUnified 
                title="ફરસાણ સ્લાઇસર લીડરબોર્ડ"
                icon="social_leaderboard"
                data={leaderboard}
                scoreLabel="m"
                showStreak={false}
                theme="kathiawar"
                onClose={() => setGameState('PLAYING')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
