import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVCardByUserId, getVCardAnalytics } from '../../utils/vcard_helper';
import { supabase } from '../../supabaseClient';

const VCardDashboard = () => {
  const [vcard, setVcard] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        navigate('/');
        return;
      }
      setUser(authUser.user);

      const card = await getVCardByUserId(authUser.user.id);
      if (card) {
        setVcard(card);
        const analytics = await getVCardAnalytics(card.id);
        if (analytics.success) {
          setStats(analytics.stats);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    const url = `https://gujaratiapp.in/vcard/${vcard.slug}`;
    navigator.clipboard.writeText(url);
    alert('કાર્ડની લિંક કોપી થઈ ગઈ છે!');
  };

  const handleShare = async () => {
    const url = `https://gujaratiapp.in/vcard/${vcard.slug}`;
    const shareData = {
      title: `${vcard.name} - Digital Business Card`,
      text: 'મારું ડિજિટલ બિઝનેસ કાર્ડ જુઓ:',
      url: url,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        copyToClipboard();
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex items-center justify-between px-4 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-stone-800 shadow-sm border border-stone-200 dark:border-stone-700 active:scale-95 transition-transform text-stone-700 dark:text-stone-300">
          <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
        </button>
        <h1 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100 flex-1 text-center">ડિજિટલ બિઝનેસ કાર્ડ</h1>
        <div className="w-10"></div>
      </div>

      {!vcard ? (
        <div className="px-4 mt-8 flex flex-col items-center text-center space-y-6">
          <div className="w-48 h-48 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center border-4 border-teal-100 dark:border-teal-800/30">
            <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-6xl">contact_mail</span>
          </div>
          <div>
            <h2 className="font-gujarati font-black text-2xl text-stone-800 dark:text-stone-100 mb-2">તમારું નવું ડિજિટલ કાર્ડ બનાવો</h2>
            <p className="font-gujarati text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
              હવે કાગળના વિઝિટીંગ કાર્ડને ભૂલી જાવ. મફતમાં તમારું સ્માર્ટ અને પ્રીમિયમ ડિજિટલ બિઝનેસ કાર્ડ બનાવો અને ગમે ત્યાં શેર કરો.
            </p>
          </div>
          <Link to="/vcard-editor" className="w-full max-w-xs py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-gujarati font-bold shadow-lg shadow-teal-600/30 active:scale-95 transition-all text-center">
            નવું કાર્ડ બનાવો
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-6">
          {/* Card Overview */}
          <div className="bg-white dark:bg-[#1E1A18] rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vcard.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {vcard.status ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200 dark:border-stone-700 flex-shrink-0 flex items-center justify-center">
                {vcard.profile_image ? (
                  <img src={vcard.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-stone-400 text-3xl">person</span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h2 className="font-gujarati font-black text-xl text-stone-800 dark:text-stone-100 truncate">{vcard.name}</h2>
                <p className="font-gujarati text-sm text-stone-500 truncate">{vcard.job_title} @ {vcard.company}</p>
                <a href={`/vcard/${vcard.slug}`} target="_blank" rel="noreferrer" className="text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline truncate block mt-1">
                  gujaratiapp.in/vcard/{vcard.slug}
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/vcard-editor" className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl font-gujarati font-bold text-sm transition-all text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                એડિટ કરો
              </Link>
              <button onClick={handleShare} className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-gujarati font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">share</span>
                શેર કરો
              </button>
            </div>
          </div>

          {/* Analytics Dashboard */}
          {stats && (
            <div className="space-y-4">
              <h3 className="font-gujarati font-black text-lg text-stone-800 dark:text-stone-200 pl-2">એનાલિટિક્સ (Analytics)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#1E1A18] rounded-3xl p-5 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">visibility</span>
                  </div>
                  <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{stats.totalViews}</span>
                  <span className="font-gujarati text-xs text-stone-500 mt-1">કુલ વ્યૂઝ</span>
                </div>
                
                <div className="bg-white dark:bg-[#1E1A18] rounded-3xl p-5 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center group">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">touch_app</span>
                  </div>
                  <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{stats.totalClicks}</span>
                  <span className="font-gujarati text-xs text-stone-500 mt-1">લિંક ક્લિક્સ</span>
                </div>

                <div className="bg-white dark:bg-[#1E1A18] rounded-3xl p-5 shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center text-center group col-span-2">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">person_add</span>
                  </div>
                  <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{stats.totalDownloads}</span>
                  <span className="font-gujarati text-xs text-stone-500 mt-1">કોન્ટેક્ટમાં સેવ (VCF)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VCardDashboard;
