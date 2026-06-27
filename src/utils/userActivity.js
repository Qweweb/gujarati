import { supabase } from '../supabaseClient';

export const updateLastActive = async () => {
  const now = new Date().toISOString();
  
  // Check last updated time in local storage to prevent too many DB writes
  const lastUpdated = localStorage.getItem('last_active_updated');
  
  if (lastUpdated) {
    const diff = new Date(now) - new Date(lastUpdated);
    const minutes = Math.floor((diff / 1000) / 60);
    
    // Throttle to 5 minutes
    if (minutes < 5) return; 
  }

  try {
    // Fetch current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return;
    
    const userId = session.user.id;

    const { error } = await supabase
      .from('users')
      .update({ last_active_at: now })
      .eq('id', userId);

    if (!error) {
       localStorage.setItem('last_active_updated', now);
       console.log('User activity timestamp updated.');
    } else {
       console.error("Supabase update error:", error);
    }
  } catch (error) {
    console.error("Error updating last active:", error);
  }
};
