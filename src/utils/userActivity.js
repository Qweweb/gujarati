import { supabase } from '../supabaseClient';
import { getOrCreateUserId } from './otlo_helper';

export const updateLastActive = async (force = false) => {
  const now = new Date().toISOString();
  const todayDateStr = now.split('T')[0];
  
  // Check last updated time in local storage to prevent too many DB writes
  const lastUpdated = localStorage.getItem('last_active_updated');
  
  if (!force && lastUpdated) {
    const diff = new Date(now) - new Date(lastUpdated);
    const minutes = Math.floor((diff / 1000) / 60);
    
    // Throttle to 3 minutes
    if (minutes < 3) return; 
  }

  try {
    let userId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        userId = session.user.id;
      }
    } catch (e) {
      // Ignore auth error
    }

    if (!userId) {
      userId = getOrCreateUserId();
    }

    if (!userId) return;

    const localProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const name = localProfile.name || localStorage.getItem('google_name') || localStorage.getItem('user_full_name') || "અજ્ઞાત સાધક";
    const rawAvatar = localProfile.avatar || localStorage.getItem('google_avatar') || null;
    const photoUrl = (rawAvatar && !rawAvatar.includes('pravatar.cc')) ? rawAvatar : null;
    const city = localProfile.city || null;
    const mobile = localProfile.mobile || localStorage.getItem('supabase_user_mobile') || null;

    const { error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name: name,
        photo_url: photoUrl,
        city: city,
        mobile: mobile,
        last_active_at: now,
        last_active: todayDateStr
      }, { onConflict: 'id' });

    if (!error) {
       localStorage.setItem('last_active_updated', now);
       console.log('User activity timestamp updated for user:', userId);
    } else {
       console.error("Supabase activity update error:", error);
    }
  } catch (error) {
    console.error("Error updating last active:", error);
  }
};

