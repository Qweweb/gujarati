import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { getOrCreateUserId } from '../utils/otlo_helper';
import LeaderboardUnified from './LeaderboardUnified';

const COLS = 9;
const GAP = 3;
const TRI_DIRS = ['tl', 'tr', 'bl', 'br'];

// ─── Level Config ────────────────────────────────────────────────────────────
// Each level: { rows, baseHp, maxHp, triChance, powerupChance }
function getLevelConfig(level) {
  const rows = 6 + level * 2; // Level 1=8, 2=10, 3=12, 4=14...
  const baseHp = Math.floor(3 + level * 4); // 7,11,15,19,...
  const maxHp = Math.floor(baseHp * 2.5 + level * 3);
  const triChance = Math.min(0.5, 0.25 + level * 0.03);
  const powerupChance = Math.min(0.35, 0.08 + level * 0.025);
  return { rows, baseHp, maxHp, triChance, powerupChance };
}

// ─── Audio ───────────────────────────────────────────────────────────────────
let _ac = null;
const ac = () => { if (!_ac) _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac; };

function playHit(muted, pitch = 1) {
  if (muted) return;
  try {
    const ctx = ac(); if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(150 * pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.15, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.1);
  } catch {}
}
function playPowerup(muted) {
  if (muted) return;
  try {
    const ctx = ac(); if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.25, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.4);
  } catch {}
}
function playItem(muted) {
  if (muted) return;
  try {
    const ctx = ac(); if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.3);
  } catch {}
}
function playVictory(muted) {
  if (muted) return;
  try {
    const ctx = ac(); if (ctx.state === 'suspended') ctx.resume();
    [0, 0.15, 0.3, 0.45, 0.65].forEach((t, i) => {
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime([523, 659, 784, 1047, 1318][i], ctx.currentTime + t);
      g.gain.setValueAtTime(0.2, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.3);
      osc.connect(g); g.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + t + 0.3);
    });
  } catch {}
}

// ─── Colors ──────────────────────────────────────────────────────────────────
function getBrickColor(val, maxHp) {
  let ratio = val / Math.max(1, maxHp);
  if (ratio >= 0.8) return '#7C3AED';
  if (ratio >= 0.6) return '#E11D48';
  if (ratio >= 0.4) return '#F43F5E';
  if (ratio >= 0.25) return '#F59E0B';
  if (ratio >= 0.1) return '#10B981';
  return '#3B82F6';
}

// ═══════════════════ GUJARATI SNACK DISHES FOR CELEBRATIONS ═══════════════════
const SNACK_EMOJIS = ['🥘', '🍛', '🧁', '🍡', '🍪', '🥧', '🍲', '🫓'];
const CELEBRATION_ITEMS = [
  { name: 'ખમણ', emoji: '🥘', color: '#FCD34D' },
  { name: 'ફાફડા', emoji: '🫓', color: '#A78BFA' },
  { name: 'જલેબી', emoji: '🍡', color: '#F59E0B' },
  { name: 'ઢોકળા', emoji: '🧁', color: '#34D399' },
  { name: 'દાબેલી', emoji: '🍛', color: '#FB923C' },
  { name: 'ઊંધિયું', emoji: '🍲', color: '#38BDF8' },
  { name: 'થેપલા', emoji: '🫓', color: '#FBBF24' },
  { name: 'સેવ ઉસળ', emoji: '🥧', color: '#F472B6' },
];

// ═══════════════════ MAIN COMPONENT ══════════════════════════════════════════
export default function SwipeBrickBreaker() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const G = useRef(null);
  const rafRef = useRef(null);
  const screenRef = useRef('start');
  const mutedRef = useRef(false);

  const [screen, setScreen] = useState('start');
  const [uiScore, setUiScore] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);
  const [uiRowsLeft, setUiRowsLeft] = useState(0);
  const [uiTimer, setUiTimer] = useState('0:00');
  const [muted, setMuted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userName, setUserName] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [savedLevel, setSavedLevel] = useState(1);

  // Level complete popup
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelStars, setLevelStars] = useState(0);
  const [completedLevel, setCompletedLevel] = useState(1);
  const [levelTime, setLevelTime] = useState(0);
  const [celebrationParticles, setCelebrationParticles] = useState([]);

  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Live timer - ticks every second during gameplay
  useEffect(() => {
    if (screen !== 'playing') return;
    const iv = setInterval(() => {
      const g = G.current;
      if (!g || !g.levelStartTime) return;
      const sec = Math.floor((performance.now() - g.levelStartTime) / 1000);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      setUiTimer(m + ':' + String(s).padStart(2, '0'));
    }, 1000);
    return () => clearInterval(iv);
  }, [screen]);

  const userNameRef = useRef('');
  const highScoreRef = useRef(0);

  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('user_profile') || '{}').name ||
      localStorage.getItem('google_name') ||
      localStorage.getItem('user_full_name') ||
      (() => { try { return JSON.parse(localStorage.getItem('sanskari_kbc_profile') || '{}').name || ''; } catch { return ''; } })() ||
      'ખેલાડી';
    setUserName(name);
    userNameRef.current = name;

    const uid = getOrCreateUserId();
    (async () => {
      try {
        const { data } = await supabase.from('game_progress').select('current_level,high_score,player_name').eq('user_id', uid).single();
        if (data) {
          setSavedLevel(data.current_level || 1);
          setHighScore(data.high_score || 0);
          highScoreRef.current = data.high_score || 0;
          setUiLevel(data.current_level || 1);
          
          if (data.player_name !== name) {
            await supabase.from('game_progress').update({ player_name: name }).eq('user_id', uid);
          }
        }
      } catch {}
    })();
    loadBoard();
  }, []);

  const loadBoard = async () => {
    try {
      const { data } = await supabase.from('game_progress').select('user_id,player_name,high_score,current_level').order('high_score', { ascending: false }).limit(100);
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
        
        // Sort numerically descending to ensure correct order regardless of DB type
        unique.sort((a, b) => Number(b.high_score || 0) - Number(a.high_score || 0));
        
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
            name: item.player_name || (isUser ? userName : 'ખેલાડી'),
            score: item.high_score,
            isUser,
            city: isUser ? (profile.city || uProf.city) : (uProf.city || null),
            avatar: isUser ? (profile.avatar || uProf.photo_url) : (uProf.photo_url || null)
          };
        });
        setLeaderboard(mapped);
      }
    } catch {}
  };

  const saveProgress = async (sc, lv) => {
    const uid = getOrCreateUserId();
    const hs = Math.max(sc, highScoreRef.current);
    setHighScore(hs);
    highScoreRef.current = hs;
    try {
      await supabase.from('game_progress').upsert({
        user_id: uid, player_name: userNameRef.current,
        current_level: lv, high_score: hs, total_score: sc,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch {}
  };

  // ─── Generate Row ──────────────────────────────────────────────────────────
  const generateRow = (g) => {
    const cfg = getLevelConfig(g.gameLevel);

    // Check for boss spawn (every 5 waves)
    if (g.rowsCleared > 0 && g.rowsCleared % 5 === 0 && g.bricks.filter(b => b.type === 'boss').length === 0) {
      const bossHp = Math.floor(cfg.maxHp * 8);
      g.bricks.push({
        x: g.W / 2 - g.bW * 1.5,
        y: g.brickOffY,
        w: g.bW * 3,
        h: g.bH * 3,
        val: bossHp,
        type: 'boss',
        hitScale: 1.0, hitShake: 0, hitGlow: 0
      });
      return;
    }

    const bossNearTop = g.bricks.some(b => b.type === 'boss' && Math.abs(b.y - g.brickOffY) < (g.bH + GAP) * 2.5);
    if (bossNearTop) return;

    const allCols = Array.from({ length: COLS }, (_, i) => i).sort(() => Math.random() - 0.5);

    // 1-2 item orbs per row
    const numItems = Math.random() < 0.6 ? 1 : 2;
    const itemCols = new Set(allCols.slice(0, numItems));

    // 0-1 empty cells for variety
    const numEmpty = Math.random() < 0.25 ? 1 : 0;
    const emptyCols = new Set(allCols.slice(numItems, numItems + numEmpty));

    // Triangles in this row?
    const rowHasTri = Math.random() < cfg.triChance;
    const rowTriDir = TRI_DIRS[Math.floor(Math.random() * TRI_DIRS.length)];
    let triCols = new Set();
    if (rowHasTri) {
      const triCount = Math.floor(Math.random() * 3) + 2;
      const remaining = allCols.filter(c => !itemCols.has(c) && !emptyCols.has(c));
      remaining.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(triCount, remaining.length); i++) triCols.add(remaining[i]);
    }

    // Powerup?
    let powerupType = Math.random() < cfg.powerupChance
      ? (Math.random() < 0.5 ? 'khaman' : 'fafda') : null;
    let powerupPlaced = false;

    for (let c = 0; c < COLS; c++) {
      if (emptyCols.has(c)) continue;
      const x = c * (g.bW + GAP) + GAP;
      const y = g.brickOffY;

      if (itemCols.has(c)) {
        g.items.push({ x: x + g.bW / 2, y: y + g.bH / 2, r: g.bH * 0.22, rot: Math.random() * Math.PI * 2 });
      } else if (!powerupPlaced && powerupType && Math.random() < 0.35) {
        const hp = Math.floor(cfg.baseHp * 2 + Math.random() * cfg.maxHp * 0.5);
        g.bricks.push({ x, y, w: g.bW, h: g.bH, val: hp, type: powerupType, animPulse: 0 });
        powerupPlaced = true;
      } else {
        // Wildly varied HP
        const roll = Math.random();
        let hp;
        if (roll < 0.2)       hp = Math.max(1, Math.floor(cfg.baseHp * 0.3 + Math.random() * 5));
        else if (roll < 0.5)  hp = Math.floor(cfg.baseHp * 0.6 + Math.random() * cfg.baseHp * 0.6);
        else if (roll < 0.8)  hp = Math.floor(cfg.baseHp + Math.random() * cfg.maxHp * 0.4);
        else                  hp = Math.floor(cfg.maxHp * 0.6 + Math.random() * cfg.maxHp * 0.5);
        hp = Math.max(1, hp);

        const isMoving = Math.random() < 0.15 && !emptyCols.has(c);
        const brickType = triCols.has(c) ? 'triangle' : (isMoving ? 'moving' : 'normal');
        g.bricks.push({ x, y, w: g.bW, h: g.bH, val: hp, type: brickType, dir: brickType === 'triangle' ? rowTriDir : null, moveDir: isMoving ? (Math.random() > 0.5 ? 1 : -1) : 0, startX: x });
      }
    }
  };

  // ─── Canvas Size ───────────────────────────────────────────────────────────
  const sizeCanvas = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return null;
    const dpr = window.devicePixelRatio || 1;
    const r = cv.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return null;
    cv.width = Math.floor(r.width * dpr);
    cv.height = Math.floor(r.height * dpr);
    if (G.current) {
      G.current.W = r.width; G.current.H = r.height;
      G.current.dpr = dpr; G.current.playerY = r.height - 90;
      for (let b of G.current.balls) { if (!b.active) b.y = G.current.playerY; }
    }
    return { w: r.width, h: r.height, dpr };
  }, []);

  useEffect(() => { window.addEventListener('resize', sizeCanvas); return () => window.removeEventListener('resize', sizeCanvas); }, [sizeCanvas]);

  // ─── Init Game ─────────────────────────────────────────────────────────────
  const initGame = useCallback((gameLevel) => {
    const dims = sizeCanvas();
    if (!dims || dims.h < 10) { setTimeout(() => initGame(gameLevel), 50); return; }
    const { w: W, h: H, dpr } = dims;
    const bW = Math.floor((W - GAP * (COLS + 1)) / COLS);
    const bH = bW;

    const cfg = getLevelConfig(gameLevel);
    const topPad = 60;
    const startRows = Math.min(Math.floor((H * 0.45) / (bH + GAP)), 5);

    const stateObj = {
      W, H, dpr, bW, bH,
      state: 'aiming',
      gameLevel,
      score: 0,
      ballCount: 10 + gameLevel * 3,
      balls: [],
      playerX: W / 2,
      playerY: H - 90,
      bricks: [], items: [], particles: [],
      brickOffY: topPad,
      firstReturnX: null,
      BALL_RAD: Math.max(3, Math.min(W, H) * 0.012),
      spd: Math.max(6.8, H * 0.021),
      turnBricksBroken: 0, ballsGained: 0,
      // Level progress
      rowsCleared: 0,
      rowsTarget: cfg.rows,
      levelStartTime: performance.now(),
      wave: 0,
    };

    for (let r = 0; r < startRows; r++) {
      generateRow(stateObj);
      if (r < startRows - 1) {
        for (let br of stateObj.bricks) br.y += bH + GAP;
        for (let it of stateObj.items) it.y += bH + GAP;
      }
    }

    G.current = stateObj;
    setUiRowsLeft(cfg.rows);
    setUiLevel(gameLevel);
    setUiScore(0);
  }, [sizeCanvas]);

  const startGame = useCallback((lv = 1) => {
    setShowLevelComplete(false);
    setScreen('playing');
    setUiTimer('0:00');
    setTimeout(() => initGame(lv), 10);
  }, [initGame]);

  // ─── Level Complete handler ───────────────────────────────────────────────
  const handleLevelComplete = (g) => {
    const elapsed = (performance.now() - g.levelStartTime) / 1000;
    const cfg = getLevelConfig(g.gameLevel);

    // Star rating: based on time and rows target
    // Fast = 3 stars, Medium = 2, Slow = 1
    const expectedTime = cfg.rows * 8; // ~8 sec per wave expected
    let stars;
    if (elapsed < expectedTime * 0.6) stars = 3;
    else if (elapsed < expectedTime * 1.0) stars = 2;
    else stars = 1;

    setCompletedLevel(g.gameLevel);
    setLevelStars(stars);
    setLevelTime(Math.floor(elapsed));
    setUiScore(g.score);

    // Save and advance
    const nextLevel = g.gameLevel + 1;
    setSavedLevel(nextLevel);
    saveProgress(g.score, nextLevel);

    playVictory(mutedRef.current);

    // Celebration particles
    const parts = [];
    for (let i = 0; i < 40; i++) {
      parts.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: SNACK_EMOJIS[Math.floor(Math.random() * SNACK_EMOJIS.length)],
        delay: Math.random() * 2,
        dur: 2 + Math.random() * 3,
        size: 18 + Math.random() * 20,
      });
    }
    setCelebrationParticles(parts);
    setShowLevelComplete(true);
    setScreen('level_complete');
  };

  // ─── Explosion helpers ────────────────────────────────────────────────────
  const triggerKhaman = (g, brick) => {
    playPowerup(mutedRef.current);
    let cx = brick.x + brick.w / 2, cy = brick.y + brick.h / 2;
    for (let p = 0; p < 20; p++) {
      let angle = (p / 20) * Math.PI * 2;
      g.particles.push({ type: 'dot', x: cx, y: cy, vx: Math.cos(angle) * (5 + Math.random() * 8), vy: Math.sin(angle) * (5 + Math.random() * 8), life: 1.5, c: '#FBBF24', big: true });
    }
    g.particles.push({ type: 'text', text: '💣 જોરદાર!', x: cx, y: cy - 20, vx: 0, vy: -2, life: 2, c: '#FCD34D' });
    let range = brick.w * 1.6;
    for (let j = g.bricks.length - 1; j >= 0; j--) {
      let b = g.bricks[j];
      if (Math.abs((b.x + b.w / 2) - cx) <= range && Math.abs((b.y + b.h / 2) - cy) <= range) {
        g.score += b.val;
        for (let p = 0; p < 4; p++) g.particles.push({ type: 'dot', x: b.x + b.w / 2, y: b.y + b.h / 2, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, life: 1, c: '#FBBF24' });
        g.bricks.splice(j, 1);
      }
    }
  };

  const triggerFafda = (g, brick) => {
    playPowerup(mutedRef.current);
    let cx = brick.x + brick.w / 2, cy = brick.y + brick.h / 2;
    for (let x = 0; x < g.W; x += 15) {
      g.particles.push({ type: 'laser', x, y: cy, life: 0.8 });
      g.particles.push({ type: 'laser', x: cx, y: x, life: 0.8 });
    }
    g.particles.push({ type: 'text', text: '⚡ વાહ!', x: cx, y: cy - 20, vx: 0, vy: -2, life: 2, c: '#A78BFA' });
    for (let j = g.bricks.length - 1; j >= 0; j--) {
      let b = g.bricks[j];
      let sameRow = Math.abs((b.y + b.h / 2) - cy) < brick.h * 0.8;
      let sameCol = Math.abs((b.x + b.w / 2) - cx) < brick.w * 0.8;
      if (sameRow || sameCol) {
        g.score += b.val;
        for (let p = 0; p < 3; p++) g.particles.push({ type: 'dot', x: b.x + b.w / 2, y: b.y + b.h / 2, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, life: 0.8, c: '#818CF8' });
        g.bricks.splice(j, 1);
      }
    }
  };

  // ═══════════════════ GAME LOOP ═════════════════════════════════════════════
  useEffect(() => {
    let lastTime = performance.now();
    const loop = (time) => {
      rafRef.current = requestAnimationFrame(loop);
      if (screenRef.current !== 'playing') return;
      const g = G.current; if (!g) return;
      const cv = canvasRef.current; if (!cv) return;
      const ctx = cv.getContext('2d');
      const dpr = g.dpr;
      const dt = Math.min((time - lastTime) / 16.66, 2);
      lastTime = time;

      // ── Shoot balls ──
      if (g.state === 'shooting') {
        if (g.shotsFired < g.ballCount) {
          if (time - g.lastShotTime > 50) {
            g.balls.push({ x: g.playerX, y: g.playerY, vx: g.aim.dx * g.spd, vy: g.aim.dy * g.spd, active: true });
            g.shotsFired++; g.lastShotTime = time;
          }
        } else g.state = 'playing';
      } else if (g.state === 'aiming') g.turnBricksBroken = 0;

      // Moving blocks update
      if (g.state === 'playing' || g.state === 'shooting') {
        for (let br of g.bricks) {
          if (br.type === 'moving') {
            br.x += br.moveDir * 1.5 * dt;
            if (br.x < 0 || br.x + br.w > g.W || Math.abs(br.x - br.startX) > g.bW * 1.5) {
              br.moveDir *= -1;
              br.x += br.moveDir * 1.5 * dt;
            }
          }
        }
      }

      let allReturned = true;
      for (let i = 0; i < g.balls.length; i++) {
        let b = g.balls[i];
        if (!b.active) {
          if (g.firstReturnX !== null && Math.abs(b.x - g.firstReturnX) > 1) b.x += (g.firstReturnX - b.x) * 0.2 * dt;
          continue;
        }
        allReturned = false;

        let bricksToExplode = [];

        // Sub-stepping for physics update
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const maxStep = Math.max(1, g.BALL_RAD * 0.5);
        const totalDist = speed * dt;
        const steps = Math.max(1, Math.ceil(totalDist / maxStep));
        const subDt = dt / steps;

        for (let step = 0; step < steps; step++) {
          b.x += b.vx * subDt;
          b.y += b.vy * subDt;

          // Boundary checks
          if (b.x < g.BALL_RAD) { b.x = g.BALL_RAD; b.vx *= -1; }
          if (b.x > g.W - g.BALL_RAD) { b.x = g.W - g.BALL_RAD; b.vx *= -1; }
          if (b.y < g.BALL_RAD) { b.y = g.BALL_RAD; b.vy *= -1; }
          if (b.y > g.playerY) {
            b.y = g.playerY;
            b.active = false;
            if (g.firstReturnX === null) {
              g.firstReturnX = b.x;
              g.playerX = b.x;
            }
            break; // Exit sub-steps loop
          }

          // Find closest colliding brick
          let closestBrick = null;
          let minDistanceSq = Infinity;
          let closestJ = -1;
          let closestDx = 0;
          let closestDy = 0;

          for (let j = g.bricks.length - 1; j >= 0; j--) {
            let br = g.bricks[j];
            let closestX = Math.max(br.x, Math.min(b.x, br.x + br.w));
            let closestY = Math.max(br.y, Math.min(b.y, br.y + br.h));
            let dx = b.x - closestX;
            let dy = b.y - closestY;
            let distSq = dx * dx + dy * dy;
            if (distSq < g.BALL_RAD * g.BALL_RAD) {
              if (distSq < minDistanceSq) {
                minDistanceSq = distSq;
                closestBrick = br;
                closestJ = j;
                closestDx = dx;
                closestDy = dy;
              }
            }
          }

          if (closestBrick) {
            closestBrick.val--;
            closestBrick.hitScale = 0.88;
            closestBrick.hitShake = 4.0;
            closestBrick.hitGlow = 1.0;

            if (closestBrick.val <= 0) {
              let destroyed = { ...closestBrick };
              g.bricks.splice(closestJ, 1);
              g.turnBricksBroken = (g.turnBricksBroken || 0) + 1;
              let pitch = 1.0 + Math.min(g.turnBricksBroken * 0.05, 1.0);
              playHit(mutedRef.current, pitch + (Math.random() - 0.5) * 0.2);
              
              const pColor = getBrickColor(1, 10);
              for (let p = 0; p < 8; p++) {
                g.particles.push({
                  type: 'crumb',
                  x: destroyed.x + destroyed.w / 2,
                  y: destroyed.y + destroyed.h / 2,
                  vx: (Math.random() - 0.5) * 12,
                  vy: (Math.random() - 0.5) * 12,
                  life: 1.2,
                  c: pColor,
                  rot: Math.random() * Math.PI * 2,
                  vrot: (Math.random() - 0.5) * 0.4,
                  shape: Math.random() > 0.5 ? 'rect' : 'tri'
                });
              }
              if (g.turnBricksBroken >= 3 && g.turnBricksBroken % 3 === 0) {
                const texts = ['વાહ!', 'જોરદાર!', 'મોજ આવી ગઈ!', 'ખુબ સરસ!', 'ગજબ!'];
                g.particles.push({
                  type: 'text',
                  text: texts[(g.turnBricksBroken / 3 - 1) % texts.length],
                  x: destroyed.x + destroyed.w / 2,
                  y: destroyed.y,
                  vx: 0,
                  vy: -1.5,
                  life: 1.5,
                  c: '#FCD34D'
                });
              }
              if (destroyed.type === 'khaman' || destroyed.type === 'fafda') {
                bricksToExplode.push(destroyed);
              } else {
                g.score++;
              }
            }

            // Normal-based positional correction and reflection
            let nx = 0, ny = 0;
            let dist = Math.sqrt(minDistanceSq);
            if (dist > 0) {
              let overlap = g.BALL_RAD - dist;
              nx = closestDx / dist;
              ny = closestDy / dist;
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else {
              // Ball center is exactly inside the brick. Push it out to the closest edge.
              let distL = b.x - closestBrick.x;
              let distR = (closestBrick.x + closestBrick.w) - b.x;
              let distT = b.y - closestBrick.y;
              let distB = (closestBrick.y + closestBrick.h) - b.y;
              let minDist = Math.min(distL, distR, distT, distB);
              if (minDist === distL) {
                b.x = closestBrick.x - g.BALL_RAD;
                nx = -1; ny = 0;
              } else if (minDist === distR) {
                b.x = closestBrick.x + closestBrick.w + g.BALL_RAD;
                nx = 1; ny = 0;
              } else if (minDist === distT) {
                b.y = closestBrick.y - g.BALL_RAD;
                nx = 0; ny = -1;
              } else {
                b.y = closestBrick.y + closestBrick.h + g.BALL_RAD;
                nx = 0; ny = 1;
              }
            }

            // Reflect velocity based on normal vector: v_new = v - 2 * (v . n) * n
            // Only reflect if moving towards the surface
            let dot = b.vx * nx + b.vy * ny;
            if (dot < 0) {
              b.vx = b.vx - 2 * dot * nx;
              b.vy = b.vy - 2 * dot * ny;
            }
          }
        }

        // Trigger explosions for destroyed special bricks
        for (let exp of bricksToExplode) {
          if (exp.type === 'khaman') triggerKhaman(g, exp);
          else triggerFafda(g, exp);
        }

        // Check item collection
        for (let j = g.items.length - 1; j >= 0; j--) {
          let item = g.items[j];
          let dx = b.x - item.x, dy = b.y - item.y;
          if (dx * dx + dy * dy < (g.BALL_RAD + item.r) * (g.BALL_RAD + item.r)) {
            g.ballsGained++;
            g.items.splice(j, 1);
            playItem(mutedRef.current);
          }
        }
      }

      // ── End of Wave ──
      if ((g.state === 'playing' || g.state === 'shooting') && allReturned && g.shotsFired === g.ballCount) {
        g.balls = [];
        g.ballCount += g.ballsGained;
        g.wave++;
        g.rowsCleared++;
        g.playerX = g.firstReturnX !== null ? g.firstReturnX : g.W / 2;

        // Check level complete
        if (g.rowsCleared >= g.rowsTarget && g.bricks.length === 0) {
          handleLevelComplete(g);
          return;
        }

        let gameOver = false;
        for (let br of g.bricks) { br.y += g.bH + GAP; if (br.y + g.bH > g.playerY - g.BALL_RAD * 2) gameOver = true; }
        for (let it of g.items) it.y += g.bH + GAP;

        if (gameOver) {
          g.state = 'game_over'; setUiScore(g.score); saveProgress(g.score, g.gameLevel); setScreen('game_over'); return;
        }

        if (g.rowsCleared < g.rowsTarget) {
          generateRow(g);
          // Keep min 4 rows
          const getRowCount = () => new Set(g.bricks.map(br => Math.round(br.y / (g.bH + GAP)))).size;
          while (getRowCount() < 4 && getRowCount() < 8) {
            for (let br of g.bricks) br.y += g.bH + GAP;
            for (let it of g.items) it.y += g.bH + GAP;
            generateRow(g);
          }
        }

        g.state = 'aiming'; g.firstReturnX = null; g.ballsGained = 0;
        setUiLevel(g.gameLevel);
        setUiScore(g.score);
        setUiRowsLeft(Math.max(0, g.rowsTarget - g.rowsCleared));
      }

      // ═════════════ RENDER ═════════════════════════════════════════════
      ctx.save(); ctx.scale(dpr, dpr);
      if (g.screenShake > 0.05) {
        let sx = (Math.random() - 0.5) * g.screenShake;
        let sy = (Math.random() - 0.5) * g.screenShake;
        ctx.translate(sx, sy);
        g.screenShake += (0 - g.screenShake) * 0.15 * dt;

        // Draw mild neon glow borders (Teal and Pink chromatic offset effect)
        ctx.strokeStyle = `rgba(20, 184, 166, ${Math.min(0.4, g.screenShake * 0.1)})`;
        ctx.lineWidth = 3 + g.screenShake;
        ctx.strokeRect(0, 0, g.W, g.H);

        ctx.strokeStyle = `rgba(236, 72, 153, ${Math.min(0.3, g.screenShake * 0.08)})`;
        ctx.lineWidth = 1 + g.screenShake * 0.5;
        ctx.strokeRect(2, 2, g.W - 4, g.H - 4);
      } else {
        g.screenShake = 0;
      }
      ctx.fillStyle = '#0F172A'; ctx.fillRect(0, 0, g.W, g.H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1; ctx.beginPath();
      for (let i = 0; i < g.W; i += g.bW + GAP) { ctx.moveTo(i, 0); ctx.lineTo(i, g.H); }
      for (let i = 0; i < g.H; i += g.bH + GAP) { ctx.moveTo(0, i); ctx.lineTo(g.W, i); }
      ctx.stroke();

      // Ground
      ctx.strokeStyle = 'rgba(20,184,166,0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, g.playerY + g.BALL_RAD); ctx.lineTo(g.W, g.playerY + g.BALL_RAD); ctx.stroke();

      // Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        let p = g.particles[i]; p.x += p.vx || 0; p.y += p.vy || 0;
        if (p.type === 'dot') { p.vy = (p.vy || 0) + 0.3; p.life -= 0.04; if (p.life <= 0) { g.particles.splice(i, 1); continue; } ctx.fillStyle = p.c || '#fff'; ctx.globalAlpha = Math.max(0, p.life); ctx.beginPath(); ctx.arc(p.x, p.y, p.big ? 4 : 2, 0, Math.PI * 2); ctx.fill(); }
        else if (p.type === 'laser') { p.life -= 0.08; if (p.life <= 0) { g.particles.splice(i, 1); continue; } ctx.globalAlpha = Math.max(0, p.life * 0.7); ctx.fillStyle = '#A78BFA'; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); }
        else if (p.type === 'crumb') {
          p.vy = (p.vy || 0) + 0.3; p.rot += p.vrot; p.life -= 0.03;
          if (p.life <= 0) { g.particles.splice(i, 1); continue; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c;
          ctx.beginPath();
          if (p.shape === 'rect') ctx.rect(-3, -3, 6, 6);
          else { ctx.moveTo(0, -4); ctx.lineTo(4, 3); ctx.lineTo(-4, 3); }
          ctx.fill(); ctx.restore();
        } else if (p.type === 'star') {
          p.rot += p.vrot; p.life -= 0.05;
          if (p.life <= 0) { g.particles.splice(i, 1); continue; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = '#FDE047';
          ctx.shadowColor = '#F59E0B'; ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(0, -3); ctx.lineTo(1, -1); ctx.lineTo(3, 0); ctx.lineTo(1, 1);
          ctx.lineTo(0, 3); ctx.lineTo(-1, 1); ctx.lineTo(-3, 0); ctx.lineTo(-1, -1);
          ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
        } else if (p.type === 'text') { p.life -= 0.02; if (p.life <= 0) { g.particles.splice(i, 1); continue; } ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2)); ctx.fillStyle = p.c; ctx.shadowColor = '#F59E0B'; ctx.shadowBlur = 12; ctx.font = '800 18px "Noto Serif Gujarati", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(p.text, p.x, p.y); ctx.shadowBlur = 0; }
      }
      ctx.globalAlpha = 1;

      // Items (Jalebi spirals)
      for (let it of g.items) {
        it.rot = (it.rot || 0) + 0.03;
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.rot);
        ctx.shadowColor = '#F59E0B'; ctx.shadowBlur = 8; ctx.strokeStyle = '#FCD34D'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) { let rad = (a / (Math.PI * 4)) * it.r; let jx = Math.cos(a) * rad, jy = Math.sin(a) * rad; if (a < 0.01) ctx.moveTo(jx, jy); else ctx.lineTo(jx, jy); }
        ctx.stroke(); ctx.restore();
        ctx.fillStyle = '#10B981'; ctx.font = '800 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('+1', it.x, it.y - it.r - 3 + Math.sin(time * 0.01) * 3);
      }

      // ── Bricks ──
      const cfg = getLevelConfig(g.gameLevel);
      for (let br of g.bricks) {
        br.hitScale = br.hitScale !== undefined ? br.hitScale : 1.0;
        br.hitScale += (1.0 - br.hitScale) * 0.18 * dt;
        br.hitShake = br.hitShake !== undefined ? br.hitShake : 0;
        br.hitShake += (0 - br.hitShake) * 0.18 * dt;
        br.hitGlow = br.hitGlow !== undefined ? br.hitGlow : 0;
        br.hitGlow += (0 - br.hitGlow) * 0.12 * dt;

        ctx.save();
        let cx = br.x + br.w / 2;
        let cy = br.y + br.h / 2;
        ctx.translate(cx, cy);
        ctx.scale(br.hitScale, br.hitScale);
        if (br.hitShake > 0.05) {
          let sx = (Math.random() - 0.5) * br.hitShake;
          let sy = (Math.random() - 0.5) * br.hitShake;
          ctx.translate(sx, sy);
        }
        ctx.translate(-cx, -cy);

        if (br.type === 'khaman') {
          br.animPulse = (br.animPulse || 0) + 0.06;
          let pulse = Math.sin(br.animPulse) * 0.15 + 0.85;
          ctx.shadowColor = '#FCD34D'; ctx.shadowBlur = 14 * pulse + br.hitGlow * 20; ctx.fillStyle = '#78350F';
          ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, br.h, 6); ctx.fill(); ctx.shadowBlur = 0;
          ctx.fillStyle = '#4ADE80'; ctx.fillRect(br.x + 3, br.y + 3, br.w - 6, 2);
          ctx.fillStyle = '#FDE68A'; ctx.font = `bold ${Math.max(7, br.h * 0.24)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(br.val, br.x + br.w / 2, br.y + br.h / 2 + 3);
          ctx.font = `${Math.max(7, br.h * 0.20)}px sans-serif`;
          ctx.fillText('💣', br.x + br.w / 2, br.y + br.h * 0.24);

        } else if (br.type === 'fafda') {
          br.animPulse = (br.animPulse || 0) + 0.08;
          let pulse = Math.sin(br.animPulse) * 0.15 + 0.85;
          ctx.shadowColor = '#A78BFA'; ctx.shadowBlur = 14 * pulse + br.hitGlow * 20; ctx.fillStyle = '#3B0764';
          ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, br.h, 6); ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(167,139,250,0.4)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
          for (let fy = br.y + 6; fy < br.y + br.h - 3; fy += 6) {
            ctx.beginPath();
            for (let fx = br.x + 2; fx < br.x + br.w - 2; fx += 3) { let w = Math.sin((fx - br.x) * 0.4 + br.animPulse) * 2; if (fx === br.x + 2) ctx.moveTo(fx, fy + w); else ctx.lineTo(fx, fy + w); }
            ctx.stroke();
          }
          ctx.fillStyle = '#DDD6FE'; ctx.font = `bold ${Math.max(7, br.h * 0.24)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(br.val, br.x + br.w / 2, br.y + br.h / 2 + 3);
          ctx.font = `${Math.max(7, br.h * 0.20)}px sans-serif`;
          ctx.fillText('⚡', br.x + br.w / 2, br.y + br.h * 0.24);

        } else if (br.type === 'triangle') {
          const color = getBrickColor(br.val, cfg.maxHp);
          const { x, y, w, h, dir } = br;
          ctx.beginPath();
          if (dir === 'tl')      { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x, y + h); }
          else if (dir === 'tr') { ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h); }
          else if (dir === 'bl') { ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); }
          else                   { ctx.moveTo(x + w, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); }
          ctx.closePath();
          ctx.shadowColor = color; ctx.shadowBlur = 6 + br.hitGlow * 20; ctx.fillStyle = color; ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();
          let tx, ty;
          if (dir === 'tl')      { tx = x + w * 0.3;  ty = y + h * 0.3; }
          else if (dir === 'tr') { tx = x + w * 0.7;  ty = y + h * 0.3; }
          else if (dir === 'bl') { tx = x + w * 0.3;  ty = y + h * 0.7; }
          else                   { tx = x + w * 0.7;  ty = y + h * 0.7; }
          ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.max(7, h * 0.24)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(br.val, tx, ty);

        } else if (br.type === 'boss') {
          br.animPulse = (br.animPulse || 0) + 0.05;
          let pulse = Math.sin(br.animPulse) * 0.1 + 0.9;
          const color = '#BE123C';
          ctx.shadowColor = color; ctx.shadowBlur = 15 * pulse + br.hitGlow * 30; ctx.fillStyle = color;
          ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, br.h, 12); ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = '#FDA4AF'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.roundRect(br.x + 6, br.y + 6, br.w - 12, br.h - 12, 6); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = `900 ${Math.max(16, br.h * 0.5)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(br.val, br.x + br.w / 2, br.y + br.h / 2);
          ctx.font = `bold ${Math.max(12, br.h * 0.2)}px sans-serif`;
          ctx.fillText('👹 BOSS', br.x + br.w / 2, br.y + br.h * 0.2);

        } else {
          const color = getBrickColor(br.val, cfg.maxHp);
          ctx.shadowColor = color; ctx.shadowBlur = 6 + br.hitGlow * 20; ctx.fillStyle = color;
          ctx.beginPath(); ctx.roundRect(br.x, br.y, br.w, br.h, 6); ctx.fill(); ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath(); ctx.roundRect(br.x + 3, br.y + 3, br.w - 6, br.h - 6, 3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = `800 ${Math.max(8, br.h * 0.28)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(br.val, br.x + br.w / 2, br.y + br.h / 2 + 1);
        }
        ctx.restore();
      }

      // Aim trajectory
      if (g.state === 'aiming' && g.dragCurrent) {
        let dx = g.dragCurrent.x - g.playerX, dy = g.dragCurrent.y - g.playerY;
        if (dx * dx + dy * dy > 400 && dy < 0) {
          let angle = Math.atan2(dy, dx);
          if (angle > -0.1) angle = -0.1; if (angle < -Math.PI + 0.1) angle = -Math.PI + 0.1;
          let aimDx = Math.cos(angle), aimDy = Math.sin(angle);
          
          let rx = g.playerX, ry = g.playerY;
          let maxSteps = 45;
          let timeOffset = (time * 0.005) % 1;
          
          for (let step = 0; step < maxSteps; step++) {
            rx += aimDx * 14; ry += aimDy * 14; 
            if (rx < g.BALL_RAD || rx > g.W - g.BALL_RAD) aimDx *= -1; 
            if (ry < g.BALL_RAD) aimDy *= -1; 
            
            let progress = step / maxSteps;
            let alpha = Math.max(0, 1 - progress);
            let radius = Math.max(1, 4 - (progress * 3));
            
            let pulse = Math.sin((progress - timeOffset) * Math.PI * 8) * 0.5 + 0.5;
            let currentRadius = radius + (pulse * 1.5);
            let currentAlpha = alpha * (0.5 + pulse * 0.5);

            ctx.beginPath(); 
            ctx.arc(rx, ry, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${currentAlpha})`;
            ctx.shadowColor = '#34D399'; ctx.shadowBlur = currentRadius * 2;
            ctx.fill(); ctx.shadowBlur = 0;
          }
        }
      }

      // Player base
      if (g.state === 'aiming' || g.state === 'shooting') {
        let ballsLeft = g.state === 'aiming' ? g.ballCount : g.ballCount - g.shotsFired;
        if (ballsLeft > 0) {
          ctx.shadowColor = '#14B8A6'; ctx.shadowBlur = 12; ctx.fillStyle = '#14B8A6';
          ctx.beginPath(); ctx.arc(g.playerX, g.playerY, g.BALL_RAD * 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(g.playerX, g.playerY, g.BALL_RAD * 3, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('x' + ballsLeft, g.playerX, g.playerY + 22);
          if (g.state === 'aiming' && !g.dragCurrent && g.wave === 0) {
            ctx.globalAlpha = 0.5 + Math.sin(time * 0.005) * 0.5; ctx.font = '600 11px sans-serif';
            ctx.fillText('← ખેંચો અને છોડો →', g.playerX, g.playerY - 35); ctx.globalAlpha = 1;
          }
        }
      }

      // Balls
      for (let b of g.balls) {
        if (b.active) {
          let speed = Math.hypot(b.vx, b.vy);
          if (speed > 0.1) {
             let trailLen = Math.min(speed * 0.08, 40);
             let nx = b.vx / speed, ny = b.vy / speed;
             let grad = ctx.createLinearGradient(b.x, b.y, b.x - nx * trailLen, b.y - ny * trailLen);
             grad.addColorStop(0, 'rgba(253, 224, 71, 0.95)');
             grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
             
             ctx.beginPath();
             ctx.moveTo(b.x + ny * g.BALL_RAD*0.8, b.y - nx * g.BALL_RAD*0.8);
             ctx.lineTo(b.x - nx * trailLen, b.y - ny * trailLen);
             ctx.lineTo(b.x - ny * g.BALL_RAD*0.8, b.y + nx * g.BALL_RAD*0.8);
             ctx.closePath();
             ctx.fillStyle = grad;
             ctx.fill();
             
             if (Math.random() < 0.25) {
               g.particles.push({
                 type: 'star',
                 x: b.x, y: b.y,
                 vx: -nx * 2 + (Math.random()-0.5)*2,
                 vy: -ny * 2 + (Math.random()-0.5)*2,
                 life: 0.8 + Math.random()*0.5,
                 rot: Math.random() * Math.PI,
                 vrot: 0.1
               });
             }
          }
          ctx.beginPath(); ctx.arc(b.x, b.y, g.BALL_RAD, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#FCD34D'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
          ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1; ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(20,184,166,0.3)';
          ctx.beginPath(); ctx.arc(b.x, b.y, g.BALL_RAD, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Legend
      if (g.state === 'aiming') {
        ctx.globalAlpha = 0.45; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = '#FDE68A'; ctx.fillText('💣 બોમ્બ=3×3', 6, 6);
        ctx.fillStyle = '#DDD6FE'; ctx.fillText('⚡ લેસર=Row+Col', 6, 18);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── Pointer ───────────────────────────────────────────────────────────────
  const handlePointerDown = useCallback((e) => {
    if (screen !== 'playing') return;
    const g = G.current; if (!g || g.state !== 'aiming') return;
    const rect = canvasRef.current.getBoundingClientRect();
    g.dragCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [screen]);

  const handlePointerMove = useCallback((e) => {
    const g = G.current; if (!g || !g.dragCurrent || g.state !== 'aiming') return;
    const rect = canvasRef.current.getBoundingClientRect();
    g.dragCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handlePointerUp = useCallback(() => {
    const g = G.current; if (!g || !g.dragCurrent || g.state !== 'aiming') return;
    let dx = g.dragCurrent.x - g.playerX, dy = g.dragCurrent.y - g.playerY;
    g.dragCurrent = null;
    if (dx * dx + dy * dy < 400 || dy >= 0) return;
    let angle = Math.atan2(dy, dx);
    if (angle > -0.1) angle = -0.1; if (angle < -Math.PI + 0.1) angle = -Math.PI + 0.1;
    g.aim = { dx: Math.cos(angle), dy: Math.sin(angle) };
    g.state = 'shooting'; g.shotsFired = 0; g.lastShotTime = 0; g.ballsGained = 0; g.firstReturnX = null;
  }, []);

  const recallBalls = () => { const g = G.current; if (!g || (g.state !== 'shooting' && g.state !== 'playing')) return; g.shotsFired = g.ballCount; for (let b of g.balls) b.active = false; };

  const hudBtn = { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 };
  const ts = (c, s) => ({ margin: 0, color: c, fontFamily: '"Noto Serif Gujarati",serif', fontSize: s, fontWeight: 900, textAlign: 'center' });

  // ═══════════════════ RENDER ════════════════════════════════════════════════
  return (
    <div style={{ width: '100%', height: '100dvh', background: '#090D16', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '480px', height: '100%', maxHeight: '850px', background: '#0F172A', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', borderLeft: '1px solid rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* HUD */}
        <div style={{ flexShrink: 0, height: 48, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 3, background: 'rgba(0,0,0,0.55)', borderBottom: '1px solid rgba(255,150,0,0.18)' }}>
        <button onClick={() => { cancelAnimationFrame(rafRef.current); navigate(-1); }} style={hudBtn}><span style={{ fontSize: 14 }}>←</span></button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 0 }}>
          {[['LVL', uiLevel, '#FCD34D'], ['ROWS', uiRowsLeft, '#14B8A6'], ['⏱️', uiTimer, '#38BDF8'], ['SCORE', uiScore.toLocaleString(), '#fff']].map(([lbl, val, clr]) => (
            <div key={lbl} style={{ textAlign: 'center', padding: '0 7px', borderRight: lbl !== 'SCORE' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.35)', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: 1 }}>{lbl}</p>
              <p style={{ margin: 0, fontSize: 13, color: clr, fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 900 }}>{val}</p>
            </div>
          ))}
        </div>
        <button onClick={recallBalls} style={hudBtn} title="Recall">⬇️</button>
        <button onClick={() => setMuted(m => !m)} style={hudBtn}>{muted ? '🔇' : '🔊'}</button>
      </div>

      {/* Canvas */}
      <div style={{ flex: '1 1 0', position: 'relative', overflow: 'hidden' }}>
        <canvas ref={canvasRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }} />

        {/* RECALL BUTTON */}
        {screen === 'playing' && (
          <button 
            onClick={recallBalls} 
            style={{ 
              position: 'absolute', 
              bottom: 25, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              width: 100, 
              height: 48, 
              borderRadius: 8, 
              background: 'rgba(0, 0, 0, 0.4)', 
              border: '2px solid #EF4444', 
              color: '#EF4444', 
              fontSize: 24, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.3)'
            }}
          >
            ⏬
          </button>
        )}

        {/* ── START ── */}
        {screen === 'start' && (
          <Overlay>
            <p style={{ fontSize: 48, margin: 0 }}>🥘⚡</p>
            <p style={ts('#14B8A6', 24)}>ગુજરાતી બ્રિક સ્મેશ</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'sans-serif', margin: 0, textAlign: 'center' }}>💣 બોમ્બ = 3×3 ધડાકો • ⚡ લેસર = Row+Col</p>
            {userName ? <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'sans-serif', margin: 0 }}>આવો, {userName}! Best: {highScore.toLocaleString()}</p> : null}
            {savedLevel > 1 && <Btn onClick={() => startGame(savedLevel)} c1="#F59E0B" c2="#78350F">▶ Level {savedLevel} Resume</Btn>}
            <Btn onClick={() => startGame(1)} c1="#14B8A6" c2="#042F2E">🎮 New Game</Btn>
            <Btn onClick={() => { loadBoard(); setScreen('leaderboard'); }} c1="#7C3AED" c2="#2E1065">🏆 Leaderboard</Btn>
          </Overlay>
        )}

        {/* ── GAME OVER ── */}
        {screen === 'game_over' && (
          <Overlay>
            <p style={{ fontSize: 46, margin: 0 }}>💥</p>
            <p style={ts('#EF4444', 24)}>રમત પૂરી!</p>
            <p style={{ color: '#fff', margin: 0, fontSize: 16, fontWeight: 700 }}>Score: {uiScore.toLocaleString()}</p>
            <Btn onClick={() => startGame(1)} c1="#14B8A6" c2="#042F2E">🔄 ફરીથી રમો</Btn>
            <Btn onClick={() => { loadBoard(); setScreen('leaderboard'); }} c1="#F59E0B" c2="#78350F">🏆 Leaderboard</Btn>
          </Overlay>
        )}

        {/* ── LEVEL COMPLETE ── */}
        {screen === 'level_complete' && showLevelComplete && (
          <LevelCompletePopup
            level={completedLevel}
            stars={levelStars}
            time={levelTime}
            score={uiScore}
            particles={celebrationParticles}
            onNext={() => startGame(completedLevel + 1)}
            onHome={() => setScreen('start')}
            ts={ts}
          />
        )}

        {/* ── LEADERBOARD ── */}
        {screen === 'leaderboard' && (
          <Overlay justify="center">
            <div className="w-full max-w-sm pointer-events-auto" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <LeaderboardUnified 
                title="ગુજરાતી બ્રિક સ્મેશ લીડરબોર્ડ"
                icon="social_leaderboard"
                data={leaderboard}
                scoreLabel="સ્કોર"
                showStreak={false}
                onClose={() => setScreen('start')}
              />
            </div>
            <div style={{ marginBottom: '40px' }}></div>
          </Overlay>
        )}
      </div>
      </div>
    </div>
  );
}

// ── Fireworks Canvas Component ────────────────────────────────────────────────
function FireworksCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const rockets = [];
    const particles = [];

    const spawnRocket = () => {
      const rx = 80 + Math.random() * (canvas.width - 160);
      const ry = canvas.height;
      const targetY = 80 + Math.random() * (canvas.height * 0.45);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.15;
      const speed = 11 + Math.random() * 4;
      
      rockets.push({
        x: rx,
        y: ry,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        targetY: targetY,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`,
        history: []
      });
    };

    // Initial spawning delay
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnRocket, i * 500);
    }

    const spawnInterval = setInterval(spawnRocket, 700);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        
        r.history.push({ x: r.x, y: r.y });
        if (r.history.length > 6) r.history.shift();

        r.x += r.vx;
        r.y += r.vy;

        // Draw trail
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 8;
        for (let idx = 0; idx < r.history.length; idx++) {
          const pt = r.history[idx];
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();

        // Draw sparkler head
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Explode
        if (r.y <= r.targetY || r.vy >= 0) {
          const count = 55 + Math.floor(Math.random() * 25);
          const baseHue = Math.floor(Math.random() * 360);
          
          for (let p = 0; p < count; p++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 5;
            const hue = (baseHue + (Math.random() - 0.5) * 45) % 360;
            
            particles.push({
              x: r.x,
              y: r.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1.0,
              color: `hsl(${hue}, 100%, 65%)`,
              gravity: 0.1,
              friction: 0.965,
              history: []
            });
          }
          rockets.splice(i, 1);
        }
      }

      // Burst Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 5) p.history.shift();

        p.vx *= p.friction;
        p.vy = p.vy * p.friction + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.016;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.alpha * 2.8;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let idx = 0; idx < p.history.length; idx++) {
          const pt = p.history[idx];
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />;
}

// ═══════════════════ LEVEL COMPLETE POPUP ═════════════════════════════════════
function LevelCompletePopup({ level, stars, time, score, particles, onNext, onHome, ts }) {
  const snack = CELEBRATION_ITEMS[(level - 1) % CELEBRATION_ITEMS.length];
  const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'radial-gradient(circle at 50% 40%, rgba(251,191,36,0.15) 0%, rgba(15,23,42,0.97) 70%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, padding: '0 24px', overflow: 'hidden',
    }}>
      {/* Real Canvas-based Fireworks */}
      <FireworksCanvas />

      {/* Glow ring */}
      <div style={{
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${snack.color}33 0%, transparent 70%)`,
        border: `3px solid ${snack.color}88`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 40px ${snack.color}44, 0 0 80px ${snack.color}22`,
        animation: 'pulseGlow 2s ease-in-out infinite',
        zIndex: 2,
      }}>
        <span style={{ fontSize: 56 }}>{snack.emoji}</span>
      </div>

      {/* Title */}
      <p style={{ ...ts('#FCD34D', 22), textShadow: '0 0 20px rgba(251,191,36,0.5)', zIndex: 2 }}>
        🎉 લેવલ {level} પૂર્ણ!
      </p>

      {/* Stars */}
      <div style={{ fontSize: 36, letterSpacing: 8, textShadow: '0 0 15px rgba(251,191,36,0.6)', zIndex: 2 }}>
        {starStr}
      </div>

      {/* Snack name */}
      <p style={{ margin: 0, color: snack.color, fontSize: 16, fontWeight: 800, fontFamily: '"Noto Serif Gujarati", serif', zIndex: 2 }}>
        {snack.name} ની મજા!
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 20, marginTop: 4, zIndex: 2 }}>
        {[['⏱️', `${time}s`, 'સમય'], ['🎯', score.toLocaleString(), 'સ્કોર']].map(([icon, val, lbl]) => (
          <div key={lbl} style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 18 }}>{icon}</p>
            <p style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 800 }}>{val}</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{lbl}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, width: '100%', maxWidth: 220, zIndex: 2 }}>
        <Btn onClick={onNext} c1="#14B8A6" c2="#042F2E">▶ Level {level + 1} →</Btn>
        <Btn onClick={onHome} c1="#6366F1" c2="#312E81">🏠 Home</Btn>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 40px ${CELEBRATION_ITEMS[(level - 1) % CELEBRATION_ITEMS.length].color}44, 0 0 80px ${CELEBRATION_ITEMS[(level - 1) % CELEBRATION_ITEMS.length].color}22; transform: scale(1); }
          50% { box-shadow: 0 0 60px ${CELEBRATION_ITEMS[(level - 1) % CELEBRATION_ITEMS.length].color}66, 0 0 120px ${CELEBRATION_ITEMS[(level - 1) % CELEBRATION_ITEMS.length].color}33; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

function Overlay({ children, justify = 'center' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: justify, gap: 12, padding: 'calc(env(safe-area-inset-top, 40px) + 20px) 24px 40px', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, c1, c2 }) {
  return (
    <button onClick={onClick} style={{ width: '100%', maxWidth: 240, padding: '12px 18px', borderRadius: 14, background: `linear-gradient(135deg, ${c1}, ${c2})`, color: '#fff', border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 15px ${c2}80` }}>
      {children}
    </button>
  );
}
