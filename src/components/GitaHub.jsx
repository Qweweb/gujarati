import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import { GITA_SHLOKAS, GITA_CHAPTERS, GITA_SITUATIONS, GITA_TAGS, KRISHNA_RESPONSES } from '../data/bhagavadGita';

// ─── HELPERS ──────────────────────────────────────────────
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
};

const getDailyShlokaIndex = () => getDayOfYear() % GITA_SHLOKAS.length;

const speakText = (text, lang = 'gu-IN', onEnd = null) => {
  if (!window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.85;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
};

const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

const ls = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── SHARE CARD TEMPLATES ─────────────────────────────────
const CARD_TEMPLATES = [
  { id: 'saffron', bg: 'from-orange-900 to-amber-800', accent: 'border-yellow-400' },
  { id: 'night',   bg: 'from-indigo-950 to-blue-950',  accent: 'border-cyan-400' },
  { id: 'forest',  bg: 'from-emerald-900 to-teal-900', accent: 'border-lime-400' },
];

// ─── MAIN COMPONENT ───────────────────────────────────────
export default function GitaHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const shareCardRef = useRef(null);
  const certificateRef = useRef(null);

  // ── State ──
  const [speaking, setSpeaking] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const val = ls.get('gita_favorites', []);
    return Array.isArray(val) ? val : [];
  });
  const [streak, setStreak] = useState(() => {
    const val = ls.get('gita_streak', 0);
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  });
  const [challengeDay, setChallengeDay] = useState(() => {
    const val = ls.get('gita_challenge_day', 1);
    const num = parseInt(val, 10);
    return isNaN(num) ? 1 : num;
  });
  const [challengeCompleted, setChallengeCompleted] = useState(() => {
    const val = ls.get('gita_challenge_completed', []);
    return Array.isArray(val) ? val : [];
  });
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tagSearch, setTagSearch] = useState('');
  const [meditationMood, setMeditationMood] = useState(null);
  const [meditationPlaying, setMeditationPlaying] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardTemplate, setShareCardTemplate] = useState(0);
  const [shareShloka, setShareShloka] = useState(null);
  const [viewShloka, setViewShloka] = useState(null);
  const [chapterView, setChapterView] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [userName, setUserName] = useState(() => {
    const val = ls.get('gita_username', '');
    return typeof val === 'string' ? val : '';
  });

  // Daily shloka
  const dailyIdx = getDailyShlokaIndex();
  const dailyShloka = GITA_SHLOKAS[dailyIdx];

  // ── Effects ──
  useEffect(() => {
    const today = new Date().toDateString();
    const lastRead = ls.get('gita_last_read', '');
    if (lastRead !== today) {
      ls.set('gita_last_read', today);
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastReadDate = ls.get('gita_last_read_date', '');
      setStreak(prev => {
        const newStreak = lastReadDate === yesterday ? prev + 1 : 1;
        ls.set('gita_streak', newStreak);
        return newStreak;
      });
      ls.set('gita_last_read_date', today);
    }
  }, []);

  // ── Handlers ──
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const current = Array.isArray(prev) ? prev : [];
      const next = current.includes(id) ? current.filter(f => f !== id) : [...current, id];
      ls.set('gita_favorites', next);
      return next;
    });
  };

  const handleSpeak = (shloka) => {
    if (speaking) { stopSpeech(); setSpeaking(false); return; }
    setSpeaking(true);
    const text = `${shloka.transliteration}. ${shloka.gujarati}. ${shloka.modernContext}`;
    speakText(text, 'gu-IN', () => setSpeaking(false));
  };

  const handleOpenShare = (shloka) => {
    setShareShloka(shloka);
    setShowShareCard(true);
  };

  const handleDownloadCard = async () => {
    try {
      const canvas = await html2canvas(shareCardRef.current, { useCORS: true, scale: 2 });
      const link = document.createElement('a');
      link.download = `gita_${shareShloka?.id || 'shlok'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatLoading(true);
    setChatHistory(h => [...h, { role: 'user', text: userMsg }]);

    setTimeout(() => {
      const lowerInput = userMsg.toLowerCase();
      const matched = KRISHNA_RESPONSES.find(r =>
        r.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))
      );
      const shloka = matched ? GITA_SHLOKAS.find(s => s.id === matched.shlokaRef) : null;

      const response = matched
        ? `🙏 **${matched.acknowledgment}**\n\n📖 **શ્રીમદ ભગવદ ગીતા અધ્યાય ${shloka?.chapter}, શ્લોક ${shloka?.verse}:**\n*${shloka?.sanskrit || ''}*\n\n✨ **અર્થ:** ${shloka?.gujarati || ''}\n\n🔮 **અર્જુનનો સંદર્ભ:** ${matched.story}\n\n💡 **આજના જીવનમાં પ્રાસંગિકતા:** ${matched.application}\n\n✅ **આજનો સંકલ્પ:** ${matched.action}`
        : `🙏 હે અર્જુન! \n\nતારી વાતો અને મૂંઝવણ મેં સાંભળી. ભગવદ ગીતાના ૧૮ અધ્યાયોમાં દરેક પરિસ્થિતિનું સચોટ સમાધાન રહેલું છે.\n\n📖 **અધ્યાય ૨, શ્લોક ૪૭:** *कर्मण्येवाधिकारस्ते*\n\nતારો અધિકાર માત્ર કર્મ કરવા પર છે, તેના ફળ પર ક્યારેય નહીં. તેથી ચિંતા છોડીને તારી ફરજ બજાવ. આજના દિવસે તારું કોઈ એક કાર્ય સંપૂર્ણ મન અને લગનથી પૂરું કર. 🌟`;

      setChatHistory(h => [...h, { role: 'krishna', text: response }]);
      setChatLoading(false);
    }, 1200);
  };

  const handleCompleteChapter = (day) => {
    const current = Array.isArray(challengeCompleted) ? challengeCompleted : [];
    if (!current.includes(day)) {
      const next = [...current, day];
      setChallengeCompleted(next);
      ls.set('gita_challenge_completed', next);
    }
    if (day === challengeDay && day < 18) {
      const newDay = day + 1;
      setChallengeDay(newDay);
      ls.set('gita_challenge_day', newDay);
    }
  };

  const handleMeditationPlay = (mood) => {
    setMeditationMood(mood);
    setMeditationPlaying(true);
    const moodShlokas = GITA_SHLOKAS.filter(s => s.situations?.includes(mood.id)).slice(0, 4);
    let idx = 0;
    const playNext = () => {
      if (idx >= moodShlokas.length) { setMeditationPlaying(false); return; }
      const s = moodShlokas[idx++];
      speakText(`${s.gujarati}. ${s.modernContext}`, 'gu-IN', playNext);
    };
    playNext();
  };

  // ── Computed ──
  const filteredShlokas = (() => {
    let list = GITA_SHLOKAS;
    if (selectedTag) list = list.filter(s => s.tags?.includes(selectedTag) || s.situations?.includes(selectedTag));
    if (tagSearch.trim()) {
      const q = tagSearch.toLowerCase();
      list = list.filter(s =>
        s.gujarati?.toLowerCase().includes(q) ||
        s.sanskrit?.toLowerCase().includes(q) ||
        s.modernContext?.toLowerCase().includes(q) ||
        s.chapterName?.toLowerCase().includes(q)
      );
    }
    return list;
  })();

  const situationShlokas = selectedSituation
    ? (selectedSituation.shlokaIds?.map(id => GITA_SHLOKAS.find(s => s.id === id)).filter(Boolean) || [])
    : [];

  // ─── TABS CONFIG ──────────────────────────────────────────
  const TABS = [
    { id: 'daily',     label: 'આજનો સંદેશ',  emoji: '🌅' },
    { id: 'situation', label: 'મારી સ્થિતિ', emoji: '🤔' },
    { id: 'challenge', label: '૧૮ દિવસ ચેલેન્જ', emoji: '🎯' },
    { id: 'browse',    label: 'વિષય પ્રમાણે', emoji: '🏷️' },
    { id: 'meditate',  label: 'ગીતા ધ્યાન',  emoji: '🧘' },
    { id: 'krishna',   label: 'કૃષ્ણ સાથે વાત', emoji: '💬' },
  ];

  const MEDITATION_MOODS = [
    { id: 'stress',   name: 'Stress Relief',    emoji: '😤', duration: '5 min', color: 'from-blue-600 to-indigo-700' },
    { id: 'focus',    name: 'Morning Focus',    emoji: '🌄', duration: '3 min', color: 'from-amber-600 to-orange-700' },
    { id: 'grief',    name: 'Grief & Loss',     emoji: '💙', duration: '7 min', color: 'from-slate-600 to-slate-800' },
    { id: 'anger',    name: 'Anger Calm',       emoji: '🔥', duration: '5 min', color: 'from-red-700 to-rose-800' },
    { id: 'peace',    name: 'Peace & Sleep',    emoji: '🌙', duration: '10 min', color: 'from-purple-700 to-violet-900' },
  ];

  // ─── SHLOKA CARD ──────────────────────────────────────────
  const ShlokaCard = ({ shloka, showFull = false, highlight = false }) => {
    const isFav = favorites.includes(shloka.id);
    return (
      <div className={`bg-white dark:bg-stone-950 rounded-3xl border shadow-sm overflow-hidden transition-all
        ${highlight ? 'border-amber-400 shadow-amber-100 dark:shadow-amber-900/20' : 'border-stone-100 dark:border-stone-800'}`}>
        {/* Chapter badge */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2.5 flex items-center justify-between">
          <span className="text-white text-[11px] font-black tracking-wider font-gujarati">
            અધ્યાય {shloka.chapter} • શ્લોક {shloka.verse} — {shloka.chapterName}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => toggleFavorite(shloka.id)} className="text-white/80 hover:text-yellow-300 transition-colors">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            </button>
            <button onClick={() => handleOpenShare(shloka)} className="text-white/80 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Sanskrit */}
          <div className="text-center bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/30">
            <p className="text-stone-800 dark:text-stone-200 text-base leading-relaxed font-black" style={{ fontFamily: 'serif' }}>
              {shloka.sanskrit}
            </p>
            <p className="text-stone-500 text-xs mt-2 italic">{shloka.transliteration}</p>
          </div>

          {/* Gujarati */}
          <div>
            <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-bold">
              {shloka.gujarati}
            </p>
          </div>

          {/* Modern context */}
          {showFull && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-black text-blue-700 dark:text-blue-400 mb-1 font-gujarati">💡 આજના જીવનમાં પ્રાસંગિકતા:</p>
                <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{shloka.modernContext}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
                <p className="text-xs font-black text-orange-700 dark:text-orange-400 mb-1 font-gujarati">⚔️ અર્જુનનો સંદર્ભ:</p>
                <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{shloka.arjunContext}</p>
              </div>
              {shloka.wordMeaning && (
                <div className="text-xs text-stone-400 dark:text-stone-600 font-gujarati border-t border-stone-100 dark:border-stone-800 pt-3">
                  📝 {shloka.wordMeaning}
                </div>
              )}
            </>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {shloka.tags?.slice(0, 4).map(tag => (
              <span key={tag} className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleSpeak(shloka)}
              className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all
                ${speaking ? 'bg-teal-600 text-white animate-pulse' : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-amber-100 hover:text-amber-800'}`}
            >
              <span className="material-symbols-outlined text-base">{speaking ? 'volume_up' : 'record_voice_over'}</span>
              {speaking ? 'વાચન બંધ કરો' : 'અવાજ સાંભળો'}
            </button>
            {!showFull && (
              <button
                onClick={() => setViewShloka(shloka)}
                className="flex-1 py-2.5 rounded-2xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-700 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
                Full Meaning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER TABS ──────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {

      // ════════════════════════════════════════════════════
      // TAB 1 — DAILY SHLOK
      // ════════════════════════════════════════════════════
      case 'daily': return (
        <div className="space-y-6">
          {/* Streak Banner */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-5 text-white flex items-center justify-between shadow-lg">
            <div>
              <p className="font-gujarati text-xs text-white/70 font-bold">દૈનિક શ્લોક વાચન ક્રમ</p>
              <p className="font-gujarati font-black text-3xl">{streak} 🔥</p>
              <p className="text-white/70 text-xs font-gujarati">સળંગ દિવસો</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs font-gujarati">આજનો શ્લોક</p>
              <p className="font-black text-xl">#{dailyIdx + 1}/108</p>
              <p className="text-white/60 text-xs">{new Date().toLocaleDateString('gu-IN')}</p>
            </div>
          </div>

          {/* Daily Shloka */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 flex-1 bg-amber-200 dark:bg-amber-900 rounded-full">
                <div className="h-1 bg-amber-500 rounded-full" style={{ width: `${((dailyIdx+1)/108)*100}%` }}></div>
              </div>
              <span className="text-xs text-stone-400 font-gujarati">{dailyIdx+1} / 108</span>
            </div>
            <ShlokaCard shloka={dailyShloka} showFull={true} highlight={true} />
          </div>

          {/* Favorites section */}
          {favorites.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                સાચવેલા શ્લોકો ({favorites.length})
              </h3>
              {GITA_SHLOKAS.filter(s => favorites.includes(s.id)).slice(0, 3).map(s => (
                <ShlokaCard key={s.id} shloka={s} />
              ))}
            </div>
          )}
        </div>
      );

      // ════════════════════════════════════════════════════
      // TAB 2 — SITUATION BROWSE
      // ════════════════════════════════════════════════════
      case 'situation': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="font-gujarati font-black text-2xl">🤔 મારી મૂંઝવણ</h2>
            <p className="font-gujarati text-white/70 text-sm mt-1">તમારી જીવનની પરિસ્થિતિ અથવા મૂંઝવણ પસંદ કરો — ગીતાજીમાંથી માર્ગદર્શન મળશે</p>
          </div>

          {!selectedSituation ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GITA_SITUATIONS.map(sit => (
                <button
                  key={sit.id}
                  onClick={() => setSelectedSituation(sit)}
                  className="p-4 bg-white dark:bg-stone-950 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:border-amber-400 hover:shadow-md active:scale-95 transition-all text-left group"
                >
                  <div className="text-3xl mb-2">{sit.emoji}</div>
                  <p className="font-gujarati font-black text-sm text-stone-800 dark:text-stone-200">{sit.name}</p>
                  <p className="font-gujarati text-xs text-stone-400 mt-0.5 leading-tight">{sit.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedSituation(null)} className="h-10 w-10 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <div>
                  <h3 className="font-gujarati font-black text-xl">{selectedSituation.emoji} {selectedSituation.name}</h3>
                  <p className="font-gujarati text-xs text-stone-400">ગીતાજીના મુખ્ય ૩ શ્લોક</p>
                </div>
              </div>
              {situationShlokas.map(s => (
                <ShlokaCard key={s.id} shloka={s} showFull={true} />
              ))}
              {situationShlokas.length === 0 && (
                <div className="text-center py-10 text-stone-400 font-gujarati">
                  <p className="text-4xl mb-2">🙏</p>
                  <p>શ્લોકો લોડ થઈ રહ્યા છે...</p>
                </div>
              )}
            </div>
          )}
        </div>
      );

      // ════════════════════════════════════════════════════
      // TAB 3 — 18 DAYS CHALLENGE
      // ════════════════════════════════════════════════════
      case 'challenge': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="font-gujarati font-black text-2xl">🎯 ૧૮ દિવસ ગીતા પડકાર</h2>
            <p className="font-gujarati text-white/70 text-sm mt-1">૧૮ અધ્યાય = ૧૮ દિવસ = સંપૂર્ણ ગીતા જ્ઞાન</p>
            <div className="mt-4 bg-white/10 rounded-2xl p-3">
              <div className="flex justify-between text-xs text-white/70 font-gujarati mb-1.5">
                <span>પ્રગતિ</span>
                <span>{challengeCompleted.length}/૧૮ દિવસ</span>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${(challengeCompleted.length / 18) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {challengeCompleted.length === 18 && (
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl p-6 text-center text-white shadow-xl">
              <div className="text-6xl mb-3">🏆</div>
              <h3 className="font-gujarati font-black text-2xl">Congratulations!</h3>
              <p className="font-gujarati font-bold text-white/90 mt-1">તમે શ્રીમદ ભગવદ ગીતાના ૧૮ અધ્યાય પૂર્ણ કર્યા છે!</p>
              <button
                onClick={() => setShowCertificate(true)}
                className="mt-4 bg-white text-amber-700 font-gujarati font-black px-6 py-3 rounded-2xl text-sm"
              >
                🎓 Certificate Download
              </button>
            </div>
          )}

          <div className="space-y-3">
            {GITA_CHAPTERS.map(ch => {
              const isCompleted = Array.isArray(challengeCompleted) && challengeCompleted.includes(ch.number);
              const isActive = ch.number === challengeDay;
              const isLocked = ch.number > challengeDay;
              const chShlokas = GITA_SHLOKAS.filter(s => s.chapter === ch.number).slice(0, 2);
              const isExpanded = chapterView === ch.number || (isActive && chapterView === null);

              return (
                <div key={ch.number} className={`rounded-3xl border overflow-hidden transition-all
                  ${isCompleted ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20' :
                    isActive ? 'border-amber-400 shadow-lg bg-white dark:bg-stone-950' :
                    'border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 opacity-70'}`}
                >
                  <div
                    onClick={() => (isActive || isCompleted) && setChapterView(chapterView === ch.number ? null : ch.number)}
                    className={`bg-gradient-to-r ${ch.color || 'from-stone-700 to-stone-900'} p-4 flex items-center justify-between ${(isActive || isCompleted) ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ch.emoji}</span>
                      <div>
                        <p className="text-white font-black font-gujarati text-sm">દિવસ {ch.number}: {ch.name}</p>
                        <p className="text-white/60 text-xs font-gujarati">{ch.totalVerses} શ્લોક</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && <span className="material-symbols-outlined text-emerald-300 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                      {isLocked && <span className="material-symbols-outlined text-white/30 text-2xl">lock</span>}
                      {isActive && <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full">TODAY</span>}
                      {(isActive || isCompleted) && (
                        <span className="material-symbols-outlined text-white/70 text-lg transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          expand_more
                        </span>
                      )}
                    </div>
                  </div>

                  {(isActive || isCompleted) && isExpanded && (
                    <div className="p-5 space-y-4">
                      <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{ch.summary}</p>
                      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-3 border border-amber-100 dark:border-amber-900/30">
                        <p className="text-xs font-black text-amber-700 dark:text-amber-400 font-gujarati">💡 મુખ્ય જ્ઞાન / બોધ:</p>
                        <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 mt-1">{ch.keyLesson}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3 border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-black text-blue-700 dark:text-blue-400 font-gujarati">🌍 જીવનમાં આચરણ:</p>
                        <p className="font-gujarati text-sm text-stone-700 dark:text-stone-300 mt-1">{ch.lifeApplication}</p>
                      </div>

                      {/* Key shlokas */}
                      {chShlokas.map(s => (
                        <div key={s.id} className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4 border border-stone-100 dark:border-stone-800">
                          <p className="text-stone-800 dark:text-stone-200 text-sm font-black text-center" style={{ fontFamily: 'serif' }}>{s.sanskrit?.split('\n')[0]}...</p>
                          <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400 mt-2 text-center">{s.gujarati}</p>
                        </div>
                      ))}

                      {isActive && !isCompleted && (
                        <button
                          onClick={() => handleCompleteChapter(ch.number)}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-gujarati font-black rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          દિવસ {ch.number} પૂર્ણ! આગળનો દિવસ ખોલો →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );

      // ════════════════════════════════════════════════════
      // TAB 4 — THEME BROWSE
      // ════════════════════════════════════════════════════
      case 'browse': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-700 to-pink-700 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="font-gujarati font-black text-2xl">🏷️ વિષય આધારિત જ્ઞાન</h2>
            <p className="font-gujarati text-white/70 text-sm mt-1">કોઈપણ વિષય પસંદ કરો — તે સંબંધિત શ્લોકો દર્શાવવામાં આવશે</p>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
            <input
              value={tagSearch}
              onChange={e => setTagSearch(e.target.value)}
              placeholder="ગુજરાતી અથવા સંસ્કૃતમાં શોધો..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 font-gujarati text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            {tagSearch && (
              <button onClick={() => setTagSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-2">
            {GITA_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border
                  ${selectedTag === tag
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-400'}`}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="space-y-3">
            <p className="font-gujarati text-xs text-stone-400 font-bold">{filteredShlokas.length} શ્લોકો મળ્યા</p>
            {filteredShlokas.slice(0, 15).map(s => (
              <ShlokaCard key={s.id} shloka={s} />
            ))}
          </div>
        </div>
      );

      // ════════════════════════════════════════════════════
      // TAB 5 — MEDITATION MODE
      // ════════════════════════════════════════════════════
      case 'meditate': return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-3xl p-6 text-white shadow-lg">
            <h2 className="font-gujarati font-black text-2xl">🧘 ગીતા ધ્યાન સત્ર</h2>
            <p className="font-gujarati text-white/70 text-sm mt-1">તમારી માનસિક સ્થિતિ પસંદ કરો — શ્લોકો આપમેળે ચાલુ થશે</p>
          </div>

          {!meditationPlaying ? (
            <div className="grid grid-cols-1 gap-3">
              {MEDITATION_MOODS.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => handleMeditationPlay(mood)}
                  className={`bg-gradient-to-r ${mood.color} p-5 rounded-3xl text-white text-left hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{mood.emoji}</span>
                      <div>
                        <p className="font-black text-lg">{mood.name}</p>
                        <p className="text-white/70 text-xs font-gujarati">4 shlokas • {mood.duration}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-3xl text-white/60" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-6 py-6">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-purple-400/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-xl">
                  <span className="text-5xl">{meditationMood?.emoji}</span>
                </div>
              </div>
              <div>
                <h3 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-200">{meditationMood?.name}</h3>
                <p className="font-gujarati text-sm text-stone-400 mt-1 animate-pulse">શ્લોક વાચન ચાલુ છે... 🎵</p>
              </div>
              <div className="text-stone-500 dark:text-stone-400 font-gujarati text-sm space-y-1">
                <p>• આંખો બંધ કરો અને શાંતિનો અનુભવ કરો</p>
                <p>• ઊંડા શ્વાસ લો અને બહાર કાઢો</p>
                <p>• કૃષ્ણના શ્લોકોને ધ્યાનપૂર્વક સાંભળો</p>
              </div>
              <button
                onClick={() => { stopSpeech(); setMeditationPlaying(false); }}
                className="px-8 py-3 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 rounded-2xl font-gujarati font-bold text-sm"
              >
                ધ્યાન બંધ કરો
              </button>
            </div>
          )}
        </div>
      );

      // ════════════════════════════════════════════════════
      // TAB 6 — KRISHNA CHATBOT
      // ════════════════════════════════════════════════════
      case 'krishna': return (
        <div className="space-y-4 flex flex-col" style={{ minHeight: '70vh' }}>
          <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                <span className="text-2xl">🦚</span>
              </div>
              <div>
                <h2 className="font-gujarati font-black text-xl">શ્રી કૃષ્ણ માર્ગદર્શન</h2>
                <p className="font-gujarati text-white/70 text-sm">તમારી મૂંઝવણ કે પ્રશ્ન અહીં લખો — ગીતાજીના આધારે જ્ઞાન મળશે</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-emerald-400 text-xs font-bold">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 space-y-4 overflow-y-auto min-h-[200px]">
            {chatHistory.length === 0 && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🦚</p>
                <p className="font-gujarati text-stone-500 dark:text-stone-400 text-sm">
                  "હે અર્જુન! બોલ, તારી શી મૂંઝવણ છે? હું ગીતાજીના જ્ઞાન દ્વારા તારો માર્ગ મોકળો કરીશ."<br/>
                  <span className="text-xs text-stone-400 font-gujarati">ગુજરાતીમાં લખો અથવા નીચેના સૂચનોમાંથી પસંદ કરો...</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {[
                    { label: "મને ખૂબ ગુસ્સો આવે છે", query: "ગુસ્સો" },
                    { label: "મને નિષ્ફળતાનો ડર લાગે છે", query: "નિષ્ફળતા" },
                    { label: "હું માનસિક તણાવમાં છું", query: "ચિંતા" },
                    { label: "મને ભય લાગે છે", query: "ભય" },
                    { label: "હું કોઈ નિર્ણય લઈ શકતો નથી", query: "નિર્ણય" }
                  ].map(s => (
                    <button key={s.label} onClick={() => setChatInput(s.label)} className="text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full font-gujarati">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm font-gujarati leading-relaxed shadow-sm
                  ${msg.role === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-100 dark:border-stone-800 rounded-tl-none'}`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-stone-900 text-stone-500 rounded-3xl rounded-tl-none px-4 py-3 text-sm font-gujarati flex items-center gap-2 border border-stone-100 dark:border-stone-800">
                  <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-2 w-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex gap-2 pt-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChatSend()}
              placeholder="તમારો પ્રશ્ન અહીં લખો..."
              className="flex-1 px-4 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950 font-gujarati text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              onClick={handleChatSend}
              className="px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      );
    }
  };

  // ─── FULL SHLOKA MODAL ────────────────────────────────────
  const renderShlokaModal = () => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && setViewShloka(null)}>
      <div className="w-full max-w-2xl bg-[#fdfaf6] dark:bg-stone-950 rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[85vh] flex flex-col animate-scale-in">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <span className="text-white font-gujarati font-black">Chapter {viewShloka.chapter}.{viewShloka.verse}</span>
          <button onClick={() => setViewShloka(null)} className="text-white/70 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <ShlokaCard shloka={viewShloka} showFull={true} />
        </div>
      </div>
    </div>
  );

  // ─── SHARE CARD MODAL ─────────────────────────────────────
  const renderShareModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={e => e.target === e.currentTarget && setShowShareCard(false)}>
      <div className="w-full max-w-sm space-y-4 animate-scale-in">
        <div className="flex gap-2 justify-center">
          {CARD_TEMPLATES.map((t, i) => (
            <button key={t.id} onClick={() => setShareCardTemplate(i)}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.bg} border-2 transition-all ${shareCardTemplate === i ? 'border-white scale-125' : 'border-transparent'}`}
            />
          ))}
        </div>

        {/* Share Card Preview */}
        <div ref={shareCardRef} className={`bg-gradient-to-br ${CARD_TEMPLATES[shareCardTemplate].bg} p-6 rounded-3xl border-2 ${CARD_TEMPLATES[shareCardTemplate].accent} text-white shadow-2xl`}>
          <div className="text-center space-y-4">
            <p className="text-yellow-300 text-xs font-black tracking-widest uppercase">🕉️ શ્રીમદ ભગવદ ગીતા — અધ્યાય {shareShloka.chapter}, શ્લોક {shareShloka.verse}</p>
            <p className="text-white font-black text-base leading-relaxed" style={{ fontFamily: 'serif' }}>{shareShloka.sanskrit}</p>
            <div className="h-px bg-white/20"></div>
            <p className="text-white/90 text-sm font-gujarati leading-relaxed">{shareShloka.gujarati}</p>
            <div className="h-px bg-white/20"></div>
            <p className="text-white/50 text-[10px] font-gujarati">ગુજરાતી એપ્લિકેશન • ગીતા જ્ઞાન</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowShareCard(false)} className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-gujarati font-bold text-sm">
            Cancel
          </button>
          <button onClick={handleDownloadCard} className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-gujarati font-bold text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">download</span>
            Download
          </button>
        </div>
      </div>
    </div>
  );

  // ─── CERTIFICATE MODAL ────────────────────────────────────
  const renderCertificateModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={e => e.target === e.currentTarget && setShowCertificate(false)}>
      <div className="w-full max-w-md space-y-4 animate-scale-in">
        {!userName && (
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-850 shadow-xl space-y-3">
            <h3 className="font-gujarati font-black text-sm text-stone-800 dark:text-stone-200 text-center">સર્ટિફિકેટ માટે તમારું નામ લખો:</h3>
            <input
              type="text"
              placeholder="તમારું નામ અહીં લખો..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 font-gujarati text-xs focus:outline-none focus:border-amber-400 text-center"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                ls.set('gita_username', e.target.value);
              }}
            />
          </div>
        )}

        <div ref={certificateRef} className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-stone-900 dark:to-stone-950 p-6 rounded-[2.5rem] border-8 border-double border-amber-400 text-stone-800 dark:text-stone-200 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-5 font-bold text-[180px] select-none pointer-events-none translate-y-[-40px] translate-x-[40px]">🕉️</div>
          <div className="absolute left-0 bottom-0 opacity-5 font-bold text-[180px] select-none pointer-events-none translate-y-[40px] translate-x-[-40px]">🦚</div>

          <div className="border border-amber-250 dark:border-amber-900/60 p-4 rounded-2xl space-y-5 text-center relative z-10">
            <h2 className="text-amber-750 dark:text-amber-450 font-gujarati font-black text-xl tracking-wide">
              શ્રીમદ ભગવદ ગીતા જ્ઞાન પ્રમાણપત્ર
            </h2>
            <p className="font-gujarati text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-black">
              ૧૮ દિવસ ગીતા પડકાર સન્માન પત્ર
            </p>
            
            <div className="text-4xl">🏆</div>

            <p className="font-gujarati text-xs text-stone-500 dark:text-stone-400">
              આથી આદરપૂર્વક પ્રમાણિત કરવામાં આવે છે કે
            </p>

            <h3 className="font-gujarati font-black text-2xl text-stone-900 dark:text-white underline decoration-amber-500 decoration-wavy decoration-2 underline-offset-8 py-1">
              {userName || "[ તમારું નામ ]"}
            </h3>

            <p className="font-gujarati text-xs text-stone-650 dark:text-stone-450 leading-relaxed px-2">
              એ ૧૮ દિવસની શ્રીમદ ભગવદ ગીતા અધ્યાય શૃંખલા સફળતાપૂર્વક પૂર્ણ કરી છે, અને કૃષ્ણના અમૃત વચનોનું દૈનિક જીવનમાં આચરણ કરવાનો સંકલ્પ લીધો છે.
            </p>

            <div className="h-px bg-amber-200 dark:bg-amber-900/50 my-2"></div>

            <div className="flex justify-between items-end text-[10px] text-stone-400 dark:text-stone-500 font-gujarati pt-2">
              <div className="text-left space-y-1">
                <p>તારીખ: {new Date().toLocaleDateString('gu-IN')}</p>
                <p className="border-t border-stone-250 dark:border-stone-800 pt-0.5">અભ્યાસ પૂર્ણ તિથિ</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-amber-700 dark:text-amber-550 font-black">શ્રી કૃષ્ણ આશીર્વાદ</p>
                <p className="border-t border-stone-250 dark:border-stone-800 pt-0.5">ભગવદ ગીતા સેવા મંચ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowCertificate(false)} className="flex-1 py-3 bg-white/10 text-white rounded-2xl font-gujarati font-bold text-sm">
            પાછા જાઓ
          </button>
          <button 
            onClick={async () => {
              try {
                const canvas = await html2canvas(certificateRef.current, { useCORS: true, scale: 2 });
                const link = document.createElement('a');
                link.download = `gita_challenge_certificate.png`;
                link.href = canvas.toDataURL();
                link.click();
              } catch (e) {
                console.error(e);
              }
            }} 
            disabled={!userName}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-2xl font-gujarati font-bold text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">download</span>
            ડાઉનલોડ કરો
          </button>
        </div>
      </div>
    </div>
  );

  // ─── MAIN RENDER ──────────────────────────────────────────
  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#1565c0] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-4 right-4 text-[80px] opacity-10 select-none pointer-events-none">🕉️</div>
        <div className="relative p-6 pt-8">
          <button onClick={() => navigate('/devotional')} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-gujarati mb-4 transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            ભક્તિ સેક્શન પર પાછા જાઓ
          </button>
          <div className="flex items-start gap-4">
            <div className="text-5xl">📖</div>
            <div>
              <h1 className="text-white font-black text-3xl font-gujarati leading-tight">શ્રીમદ ભગવદ ગીતા</h1>
              <p className="text-white/60 text-sm font-gujarati mt-0.5">૭૦૦ શ્લોક • ૧૮ અધ્યાય • સંપૂર્ણ મફત</p>
              <div className="flex gap-3 mt-3">
                <span className="bg-white/10 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">🔥 {streak} દૈનિક શ્લોક વાંચન</span>
                <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-yellow-400/30">
                  ❤️ {favorites.length} સાચવેલા
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 flex overflow-x-auto no-scrollbar px-4 pb-0 gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-t-2xl text-xs font-bold font-gujarati transition-all flex items-center gap-1.5
                ${activeTab === tab.id
                  ? 'bg-[#fdfaf6] dark:bg-stone-950 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {renderTab()}
      </div>

      {/* Modals */}
      {viewShloka && renderShlokaModal()}
      {showShareCard && shareShloka && renderShareModal()}
      {showCertificate && renderCertificateModal()}
    </div>
  );
}
