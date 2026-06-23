import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVCardBySlug, logVCardEvent } from '../../utils/vcard_helper';
import VCardPreview from './VCardPreview';

const VCardPublic = () => {
  const { slug } = useParams();
  const [vcard, setVcard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVCard();
  }, [slug]);

  const fetchVCard = async () => {
    setLoading(true);
    try {
      const data = await getVCardBySlug(slug);
      if (data) {
        setVcard(data);
        // Log the view event
        logVCardEvent(data.id, 'view');
      } else {
        setError('કાર્ડ મળ્યું નથી. (Card not found)');
      }
    } catch (err) {
      console.error(err);
      setError('એરર આવી છે.');
    }
    setLoading(false);
  };

  const handleTrackEvent = (type, targetData) => {
    if (vcard) {
      logVCardEvent(vcard.id, type, targetData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error || !vcard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-50 dark:bg-stone-950 px-4 text-center">
        <span className="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 mb-4">error_outline</span>
        <h1 className="text-xl font-bold font-gujarati text-stone-800 dark:text-stone-200 mb-2">{error}</h1>
        <p className="text-sm font-gujarati text-stone-500 mb-6">લિંક કદાચ ખોટી છે અથવા યુઝરે કાર્ડ ડિલીટ કરી દીધું છે.</p>
        <Link to="/" className="px-6 py-2 bg-teal-600 text-white rounded-full font-gujarati font-bold">હોમ પેજ પર જાઓ</Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-auto no-scrollbar bg-black m-0 p-0">
      {/* 
        We wrap it in a max-w-md div so it looks like a mobile app even on desktop.
        If viewed on a phone, it takes full width.
      */}
      <div className="max-w-md mx-auto min-h-full bg-stone-50 dark:bg-stone-950 shadow-2xl relative">
        <VCardPreview vcard={vcard} isPreview={false} onTrackEvent={handleTrackEvent} />
        
        {/* Floating Create Your Own Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Link to="/vcard-dashboard" className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl drop-shadow-md">add_card</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VCardPublic;
