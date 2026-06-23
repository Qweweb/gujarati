import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { syncUserProfile } from '../utils/otlo_helper';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { activeTheme, changeTheme, themes } = useTheme();
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : {
        name: localStorage.getItem('google_name') || localStorage.getItem('user_full_name') || '',
        mobile: localStorage.getItem('supabase_user_mobile') || '',
        email: localStorage.getItem('google_email') || '',
        avatar: localStorage.getItem('google_avatar') || '',
        gender: '',
        dob: '',
        city: '',
        uniqueId: 'GUR-' + Math.floor(1000 + Math.random() * 9000)
      };
    } catch (e) {
      return { name: '', mobile: '', email: '', avatar: '', gender: '', dob: '', city: '', uniqueId: 'GUR-' + Math.floor(1000 + Math.random() * 9000) };
    }
  });

  const isFirstLogin = localStorage.getItem('profile_completed') !== 'true';

  const [isModalOpen, setIsModalOpen] = useState(isFirstLogin); // Auto-open on first login
  const [name, setName] = useState(profile.name);
  const [mobile, setMobile] = useState(profile.mobile);
  const [gender, setGender] = useState(profile.gender || '');
  const [dob, setDob] = useState(profile.dob || '');
  const [city, setCity] = useState(profile.city || '');
  const [error, setError] = useState('');
  const [googleUser, setGoogleUser] = useState(null);

  useEffect(() => {
    const fetchGoogleUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setGoogleUser(user);
          const meta = user.user_metadata || {};
          const googleName = meta.full_name || meta.name || '';
          const googleEmail = meta.email || user.email || '';
          const googleAvatar = meta.avatar_url || meta.picture || '';

          // Save to localStorage for persistence
          if (googleName) localStorage.setItem('google_name', googleName);
          if (googleEmail) localStorage.setItem('google_email', googleEmail);
          if (googleAvatar) localStorage.setItem('google_avatar', googleAvatar);

          // Pre-fill form fields with Google info if not already set
          if (!name && googleName) setName(googleName);

          // Update profile state with Google info
          setProfile(prev => ({
            ...prev,
            name: prev.name || googleName,
            email: prev.email || googleEmail,
            avatar: prev.avatar || googleAvatar,
          }));

          // Auto-open modal if first login
          if (isFirstLogin) {
            setIsModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Error fetching Google User:", err);
      }
    };
    fetchGoogleUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !gender || !dob || !city.trim()) {
      setError('કૃપા કરી નામ, જાતિ, જન્મ તારીખ અને શહેર ભરો.');
      return;
    }
    
    const updatedProfile = {
      ...profile,
      name: name.trim(),
      mobile: mobile.trim(),
      gender,
      dob,
      city: city.trim(),
      email: profile.email,
      avatar: profile.avatar,
    };
    
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('profile_completed', 'true');
    setProfile(updatedProfile);
    
    // Sync with Supabase
    try {
      await syncUserProfile();
    } catch (err) {
      console.error("Profile sync error:", err);
    }
    
    setIsModalOpen(false);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) { /* ignore */ }
    localStorage.removeItem('sanskari_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('profile_completed');
    localStorage.removeItem('google_name');
    localStorage.removeItem('google_email');
    localStorage.removeItem('google_avatar');
    window.location.reload();
  };

  const settings = [
    { title: "ડિજિટલ બિઝનેસ કાર્ડ (My vCard)", icon: "contact_mail", desc: "તમારું સ્માર્ટ ડિજિટલ કાર્ડ મેનેજ કરો", link: "/card" },
    { title: "મારા ઇનામો (My Rewards)", icon: "card_giftcard", desc: "ક્વિઝ અને પ્રવાસ દ્વારા મેળવેલી કૂપન્સ જુઓ", link: "/rewards" },
    { title: "ગુજરાત ટ્રાવેલ પાસપોર્ટ (Gujarat Travel Passport)", icon: "menu_book", desc: "ગુજરાત સફારી પ્રવાસ બુક અને સ્ટેમ્પ્સ", link: "/passport" },
    { title: "સ્વાસ્થ્ય ડેટા સેટિંગ્સ", icon: "health_and_safety", desc: "BP અને Sugar રેકોર્ડ્સ મેનેજ કરો" },
    { title: "પરિવારની પ્રોફાઇલ", icon: "family_restroom", desc: "સભ્યો ઉમેરો અથવા બદલો" },
    { title: "સેટિંગ્સ (Settings)", icon: "settings", desc: "થીમ બદલો અને નોટિફિકેશન", link: "/settings" },
    { title: "ઓફલાઇન (ડાઉનલોડ)", icon: "download_for_offline", desc: "ઇન્ટરનેટ વગર સાહિત્ય વાંચવા માટે", link: "/offline" },
    { title: "ભાષા (Language)", icon: "language", desc: "ગુજરાતી - ગુજરાતી" },
    { title: "લોગ-આઉટ (Logout)", icon: "logout", desc: "તમારું એકાઉન્ટ સેફ્ટીથી બંધ કરો", isAction: true, isDanger: true, action: handleLogout },
  ];

  const avatarSrc = profile.avatar || `https://i.pravatar.cc/100?u=${profile.name || 'gujarati'}`;
  const displayName = profile.name || profile.email || 'ગુજરાતી યુઝર';
  const genderLabel = profile.gender === 'male' ? 'પુરુષ' : profile.gender === 'female' ? 'સ્ત્રી' : profile.gender === 'other' ? 'અન્ય' : '';

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Profile Header */}
      <section className="bg-white dark:bg-dark-surface rounded-[2.5rem] p-8 shadow-sm border border-primary/5 flex flex-col items-center text-center gap-4 relative overflow-hidden">
        {/* Google avatar */}
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center p-1 border-4 border-white shadow-xl">
            <img 
              src={avatarSrc} 
              className="w-full h-full object-cover rounded-full" 
              alt="Profile"
              onError={(e) => { e.target.src = `https://i.pravatar.cc/100?u=${profile.name}`; }}
            />
        </div>
        <div className="space-y-1">
            <h2 className="font-gujarati font-black text-3xl text-on-surface dark:text-dark-text">
              {displayName}
            </h2>
            {profile.email && (
              <p className="font-label text-sm text-stone-400">
                {profile.email}
              </p>
            )}
            <p className="font-gujarati text-sm text-stone-500 font-bold">
              🆔 યુનિક આઈડી: {profile.uniqueId}
            </p>
            {profile.city && (
              <p className="font-gujarati text-xs text-outline dark:text-dark-text-dim mt-0.5">
                📍 શહેર: {profile.city}{genderLabel ? ` | 👤 ${genderLabel}` : ''}
              </p>
            )}
            {isFirstLogin && (
              <div className="mt-3 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <p className="font-gujarati text-yellow-800 text-xs font-bold">
                  ⚠️ પ્રોફાઇલ પૂર્ણ કરો — નીચે Edit બટન દબાવો
                </p>
              </div>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-3 px-4 py-1.5 bg-teal-700/10 hover:bg-teal-700/20 text-teal-700 rounded-full font-gujarati font-bold text-xs transition-all active:scale-95"
            >
              ✏️ પ્રોફાઇલ એડિટ કરો
            </button>
        </div>
      </section>

      {/* Settings List */}
      <section className="space-y-4">
        <p className="font-gujarati font-bold text-outline text-xs uppercase tracking-widest pl-4">સેટિંગ્સ</p>
        <div className="space-y-3">
            {settings.map((s, idx) => (
              s.isAction ? (
                <button 
                    key={idx} 
                    onClick={s.action} 
                    className="w-full text-left bg-white dark:bg-dark-surface p-6 rounded-[2rem] shadow-sm border border-black/5 dark:border-dark-accent/5 flex items-center gap-6 group hover:border-error/20 transition-all block"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${s.isDanger ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary dark:bg-dark-accent/10 dark:text-dark-text'}`}>
                        <span className="material-symbols-outlined text-3xl font-bold">{s.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                        <h4 className={`font-gujarati font-black text-xl ${s.isDanger ? 'text-error' : 'text-on-surface dark:text-dark-text'}`}>{s.title}</h4>
                        <p className="font-gujarati text-sm text-outline dark:text-dark-text-dim">{s.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                </button>
              ) : (
                <Link 
                    key={idx} 
                    to={s.link || "/"} 
                    className="bg-white dark:bg-dark-surface p-6 rounded-[2rem] shadow-sm border border-black/5 dark:border-dark-accent/5 flex items-center gap-6 group hover:border-primary/20 transition-all block"
                >
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary dark:bg-dark-accent/10 dark:text-dark-text flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl font-bold">{s.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                        <h4 className="font-gujarati font-black text-xl text-on-surface dark:text-dark-text">{s.title}</h4>
                        <p className="font-gujarati text-sm text-outline dark:text-dark-text-dim">{s.desc}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                  </Link>
              )
            ))}
        </div>
      </section>

      {/* Logout */}
      <section className="pt-6">
        <p className="text-center text-outline text-[10px] mt-6 font-label uppercase tracking-widest">Version 1.0.0 (Beta)</p>
      </section>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 max-w-sm w-full space-y-5 shadow-2xl border-t-8 border-teal-700 relative animate-scale-up text-left max-h-[90vh] overflow-y-auto">
            
            {/* Google User Banner */}
            {googleUser && (
              <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-950/20 rounded-2xl">
                <img 
                  src={profile.avatar || `https://i.pravatar.cc/40`}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.target.style.display='none'; }}
                  alt="Google"
                />
                <div>
                  <p className="font-gujarati font-bold text-sm text-teal-700">Google Account થી Login</p>
                  <p className="font-label text-xs text-stone-500">{profile.email}</p>
                </div>
                <svg className="w-5 h-5 ml-auto text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.23 0-5.857-2.627-5.857-5.857s2.627-5.857 5.857-5.857c1.46 0 2.784.537 3.816 1.417l3.056-3.056C18.91 3.23 15.82 2 12.24 2 6.584 2 2 6.584 2 12.24s4.584 10.24 10.24 10.24c5.795 0 10.24-4.15 10.24-10.24 0-.64-.067-1.285-.19-1.955H12.24z"/>
                </svg>
              </div>
            )}

            <div className="text-center">
              <h3 className="font-gujarati font-black text-2xl text-teal-700">
                {isFirstLogin ? '🙏 સ્વાગત છે!' : 'પ્રોફાઇલ વિગતો'}
              </h3>
              <p className="font-gujarati text-sm text-stone-500 mt-1">
                {isFirstLogin 
                  ? 'કૃપા કરી તમારી વિગતો ભરો (1 વખત)'
                  : 'માહિતી અપડેટ કરો'
                }
              </p>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="font-gujarati text-xs font-bold text-outline">પૂરું નામ *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="નામ લખો" 
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/20 dark:bg-dark-bg outline-none focus:border-teal-700 font-gujarati text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              <div className="space-y-1">
                <label className="font-gujarati text-xs font-bold text-outline">મોબાઇલ નંબર (optional)</label>
                <input 
                  type="tel" 
                  maxLength="10"
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} 
                  placeholder="WhatsApp નંબર" 
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/20 dark:bg-dark-bg outline-none focus:border-teal-700 font-gujarati text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-outline">જાતિ *</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/20 dark:bg-dark-bg outline-none focus:border-teal-700 font-gujarati text-sm text-on-surface dark:text-dark-text"
                  >
                    <option value="">પસંદ કરો</option>
                    <option value="male">પુરુષ</option>
                    <option value="female">સ્ત્રી</option>
                    <option value="other">અન્ય</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-gujarati text-xs font-bold text-outline">જન્મ તારીખ *</label>
                  <input 
                    type="date" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/20 dark:bg-dark-bg outline-none focus:border-teal-700 font-gujarati text-sm text-on-surface dark:text-dark-text"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-gujarati text-xs font-bold text-outline">શહેર / ગામ *</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  placeholder="દા.ત. અમદાવાદ, સુરત, રાજકોટ..." 
                  className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/20 dark:bg-dark-bg outline-none focus:border-teal-700 font-gujarati text-sm text-on-surface dark:text-dark-text"
                />
              </div>

              {error && <p className="text-error font-gujarati text-xs font-bold text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                {!isFirstLogin && (
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 border border-stone-200 rounded-xl font-gujarati font-bold text-stone-500 active:scale-95 transition-all text-center"
                  >
                    બંધ કરો
                  </button>
                )}
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-gujarati font-black active:scale-95 transition-all text-center"
                >
                  {isFirstLogin ? '🙏 સ્ટાર્ટ કરો' : 'સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
