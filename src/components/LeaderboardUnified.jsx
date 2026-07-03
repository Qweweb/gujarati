import React from 'react';

export const toGujaratiNum = (num) => {
  if (num === undefined || num === null) return '';
  const digits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return num.toString().split('').map(char => {
    if (char >= '0' && char <= '9') return digits[parseInt(char)];
    return char;
  }).join('');
};

/* ── Theme presets ──────────────────────────────────────────────── */
const THEMES = {
  default: null, // uses Tailwind classes (white / dark-stone)
  kathiawar: {
    container:    { background: '#2E1005', border: '3px solid #0C0F19', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 0 #0C0F19' },
    headerBorder: { borderBottom: '1px solid rgba(250,232,215,0.12)', paddingBottom: '14px', marginBottom: '14px' },
    title:        { color: '#FAE8D7', fontFamily: '"Noto Serif Gujarati", serif', fontWeight: 900, fontSize: '17px' },
    iconColor:    '#FF8E1F',
    itemBase:     { background: '#451A03', border: '2px solid rgba(250,232,215,0.08)', borderRadius: '16px', padding: '12px' },
    itemUser:     { background: '#73322B', border: '2px solid #FF8E1F', borderRadius: '16px', padding: '12px' },
    nameColor:    '#FAE8D7',
    scoreColor:   '#FF8E1F',
    labelColor:   'rgba(250,232,215,0.5)',
    cityColor:    '#F08833',
    emptyColor:   'rgba(250,232,215,0.35)',
    avatarBorder: '2px solid rgba(250,232,215,0.15)',
    rankColors:   ['#FF8E1F', '#FAE8D7', '#F08833', 'rgba(250,232,215,0.15)'],
    rankTextColors: ['#2B1814', '#2B1814', '#fff', '#FAE8D7'],
  },
  kite: {
    container:    { background: '#172554', border: '3px solid #0C0F19', borderRadius: '24px', padding: '20px', boxShadow: '0 8px 0 #0C0F19' },
    headerBorder: { borderBottom: '1px solid rgba(241,245,249,0.1)', paddingBottom: '14px', marginBottom: '14px' },
    title:        { color: '#F1F5F9', fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 900, fontSize: '17px' },
    iconColor:    '#38BDF8',
    itemBase:     { background: '#0F172A', border: '2px solid rgba(241,245,249,0.06)', borderRadius: '16px', padding: '12px' },
    itemUser:     { background: '#1E3A8A', border: '2px solid #38BDF8', borderRadius: '16px', padding: '12px' },
    nameColor:    '#F1F5F9',
    scoreColor:   '#38BDF8',
    labelColor:   'rgba(241,245,249,0.45)',
    cityColor:    '#7DD3FC',
    emptyColor:   'rgba(241,245,249,0.3)',
    avatarBorder: '2px solid rgba(241,245,249,0.12)',
    rankColors:   ['#38BDF8', '#CBD5E1', '#0284C7', 'rgba(241,245,249,0.12)'],
    rankTextColors: ['#0F172A', '#0F172A', '#fff', '#F1F5F9'],
  },
};

export default function LeaderboardUnified({ 
  title = "લીડરબોર્ડ", 
  icon = "social_leaderboard", 
  data = [], 
  userRank = null, 
  onUserClick = null,
  scoreLabel = "XP",
  showStreak = true,
  showScore = true,
  theme = "default",
  onClose = null
}) {
  const t = THEMES[theme];

  // Live profile overrides so any user-specific row instantly matches their local settings
  const localProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const liveUserName = localProfile.name || localStorage.getItem('google_name') || "તમે";
  const liveAvatar = localProfile.avatar || localStorage.getItem('google_avatar') || null;
  const liveCity = localProfile.city || null;

  const enrichedData = data.map(user => {
    // Determine if this row represents the active user
    const isMe = user.isUser || 
                 (user.name && (
                   user.name.includes(liveUserName) || 
                   user.name.includes("(તમે)") || 
                   user.name.includes("તમે") ||
                   user.name === "તમે (User)"
                 ));
    if (isMe) {
      return {
        ...user,
        name: liveUserName + " (તમે)",
        avatar: liveAvatar || user.avatar,
        city: liveCity || user.city || "અમદાવાદ",
        isUser: true
      };
    }
    return user;
  });

  /* ── Themed variant (kathiawar / kite) ─────────────────────────── */
  if (t) {
    return (
      <div style={{ ...t.container, display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...t.headerBorder }}>
          <h3 style={{ ...t.title, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: t.iconColor, fontWeight: 700, fontSize: '22px' }}>{icon}</span>
            {title}
          </h3>
          {onClose && (
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.nameColor, cursor: 'pointer', padding: 0
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', fontWeight: 'bold' }}>close</span>
            </button>
          )}
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
          {enrichedData.map((user, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...(user.isUser ? t.itemUser : t.itemBase) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '12px',
                  background: t.rankColors[Math.min(idx, 3)],
                  color: t.rankTextColors[Math.min(idx, 3)],
                }}>
                  {toGujaratiNum(idx + 1)}
                </span>
                <img
                  src={user.avatar || `https://i.pravatar.cc/150?u=${user.name}`}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: t.avatarBorder, objectFit: 'cover' }}
                  alt=""
                />
                <div>
                  <h4 style={{ margin: 0, fontWeight: 900, fontSize: '13px', color: t.nameColor, fontFamily: '"Noto Serif Gujarati", serif' }}>{user.name || 'ખેલાડી'}</h4>
                  {user.city && (
                    <span style={{ fontSize: '10px', color: t.cityColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>location_on</span>
                      {user.city}
                    </span>
                  )}
                  {showStreak && user.streak !== undefined && (
                    <p style={{ margin: 0, fontSize: '10px', color: t.labelColor }}>🔥 {toGujaratiNum(user.streak)} દિવસની સ્ટ્રીક</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {showScore && user.score !== undefined && (
                  <span style={{ fontWeight: 900, fontSize: '14px', color: t.scoreColor, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {toGujaratiNum(user.score)} <span style={{ fontSize: '10px', fontWeight: 400, color: t.labelColor }}>{scoreLabel}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
          {enrichedData.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: t.emptyColor, fontWeight: 700, fontSize: '13px' }}>કોઈ ડેટા મળ્યો નથી.</div>
          )}
        </div>

        {userRank > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: t.labelColor, fontWeight: 700, padding: '10px 4px 0' }}>
            <span>તમારો ક્રમ: #{toGujaratiNum(userRank)}</span>
          </div>
        )}
      </div>
    );
  }

  /* ── Default variant (Tailwind classes — unchanged) ────────────── */
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col h-full max-h-full">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4 mb-4 shrink-0">
        <h3 className="font-gujarati font-black text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-600 font-bold">{icon}</span> 
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {onUserClick && enrichedData.find(u => u.isUser) && (
            <button
              onClick={() => onUserClick(enrichedData.find(u => u.isUser))}
              className="h-9 w-9 bg-primary/10 hover:bg-primary/20 text-primary rounded-full flex items-center justify-center transition active:scale-95"
              title="તમારા આંકડા અને સ્કોર વિગત"
            >
              <span className="material-symbols-outlined text-xl font-bold">info</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="h-9 w-9 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center transition active:scale-95"
            >
              <span className="material-symbols-outlined text-xl font-bold">close</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 font-gujarati overflow-y-auto flex-1 pr-1 pb-2">
        {enrichedData.map((user, idx) => (
          <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${user.isUser ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 shadow-sm' : 'border-stone-100 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-950/20'}`}>
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-stone-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}>
                {toGujaratiNum(idx + 1)}
              </span>
              <img src={user.avatar || `https://i.pravatar.cc/150?u=${user.name || 'default'}`} className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 object-cover" alt="Avatar" />
              <div>
                <h4 className="font-black text-sm text-stone-800 dark:text-stone-100">{user.name || 'ખેલાડી'}</h4>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {user.city && (
                    <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                      {user.city}
                    </span>
                  )}
                  {showStreak && user.streak !== undefined && (
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <span>🔥 {toGujaratiNum(user.streak)} દિવસની સ્ટ્રીક</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {showScore && user.score !== undefined && (
                <span className="font-headline font-black text-sm text-stone-800 dark:text-stone-200">
                  {toGujaratiNum(user.score)} <span className="text-[10px] font-normal text-stone-500">{scoreLabel}</span>
                </span>
              )}
              {onUserClick && (
                <button
                  onClick={() => onUserClick(user)}
                  className="h-7 w-7 rounded-full bg-stone-100 hover:bg-stone-250 dark:bg-stone-800 dark:hover:bg-stone-700 flex items-center justify-center transition shrink-0"
                  title="વિગતવાર અહેવાલ"
                >
                  <span className="material-symbols-outlined text-sm font-bold">info</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {enrichedData.length === 0 && (
          <div className="text-center p-6 text-stone-400 font-bold text-sm">કોઈ ડેટા મળ્યો નથી.</div>
        )}
      </div>

      {userRank > 0 && (
        <div className="flex justify-between items-center text-xs text-stone-500 font-bold px-2 shrink-0 pt-3 mt-1 border-t border-stone-100 dark:border-stone-800">
          <span>તમારો ક્રમ: #{toGujaratiNum(userRank)}</span>
          {onUserClick && enrichedData.find(u => u.isUser) && (
            <button 
              onClick={() => onUserClick(enrichedData.find(u => u.isUser))} 
              className="text-primary font-black hover:underline flex items-center gap-1"
            >
              તમારો સ્કોર વિગત 📊
            </button>
          )}
        </div>
      )}
    </div>
  );
}
