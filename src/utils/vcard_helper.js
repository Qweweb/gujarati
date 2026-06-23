import { supabase } from '../supabaseClient';

/**
 * Fetch a vCard by its public slug
 */
export const getVCardBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('vcards')
      .select('*')
      .eq('slug', slug)
      .eq('status', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching vCard by slug:", error);
    return null;
  }
};

/**
 * Fetch a vCard by user ID
 */
export const getVCardByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('vcards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data;
  } catch (error) {
    console.error("Error fetching vCard by user ID:", error);
    return null;
  }
};

/**
 * Create or Update a vCard
 */
export const saveVCard = async (vcardData) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("User not authenticated");

    const payload = {
      ...vcardData,
      user_id: user.user.id,
      updated_at: new Date().toISOString()
    };

    // Since we set UNIQUE(user_id) at DB level, upsert will update if user_id matches
    const { data, error } = await supabase
      .from('vcards')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving vCard:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if slug is available
 */
export const isSlugAvailable = async (slug, currentVCardId = null) => {
  try {
    let query = supabase.from('vcards').select('id').eq('slug', slug);
    if (currentVCardId) {
      query = query.neq('id', currentVCardId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data.length === 0;
  } catch (error) {
    console.error("Error checking slug:", error);
    return false;
  }
};

/**
 * Log Analytics Event
 */
export const logVCardEvent = async (vcardId, eventType, targetData = null) => {
  try {
    // Basic session fingerprint (we can use localStorage or sessionStorage)
    let sessionId = sessionStorage.getItem('vcard_visitor_id');
    if (!sessionId) {
      sessionId = 'v_sess_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('vcard_visitor_id', sessionId);
    }

    const { error } = await supabase
      .from('vcard_analytics')
      .insert([
        {
          vcard_id: vcardId,
          event_type: eventType,
          target_data: targetData,
          visitor_session: sessionId
        }
      ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error logging vcard event:", error);
  }
};

/**
 * Get Analytics for Dashboard
 */
export const getVCardAnalytics = async (vcardId) => {
  try {
    const { data, error } = await supabase
      .from('vcard_analytics')
      .select('event_type, created_at')
      .eq('vcard_id', vcardId);

    if (error) throw error;

    // Process data into useful metrics
    const stats = {
      totalViews: 0,
      totalClicks: 0,
      totalDownloads: 0,
      recentEvents: data.slice(0, 10) // Can sort by created_at desc later
    };

    data.forEach(item => {
      if (item.event_type === 'view') stats.totalViews++;
      else if (item.event_type === 'download_vcf') stats.totalDownloads++;
      else if (item.event_type.startsWith('click_')) stats.totalClicks++;
    });

    return { success: true, stats };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate and Download VCF
 */
export const generateVCF = (vcard) => {
  if (!vcard) return;

  const sanitize = (text) => text ? text.replace(/[\n\r]/g, '\\n') : '';

  let vcfContent = "BEGIN:VCARD\r\n";
  vcfContent += "VERSION:3.0\r\n";
  vcfContent += `FN:${sanitize(vcard.name)}\r\n`;
  vcfContent += `N:;${sanitize(vcard.name)};;;\r\n`;
  
  if (vcard.job_title) vcfContent += `TITLE:${sanitize(vcard.job_title)}\r\n`;
  if (vcard.company) vcfContent += `ORG:${sanitize(vcard.company)}\r\n`;

  // Parse contact details
  if (vcard.contact_details && Array.isArray(vcard.contact_details)) {
    vcard.contact_details.forEach(contact => {
      if (contact.type === 'phone' || contact.type === 'whatsapp') {
        vcfContent += `TEL;TYPE=CELL:${sanitize(contact.value)}\r\n`;
      } else if (contact.type === 'email') {
        vcfContent += `EMAIL;TYPE=WORK,INTERNET:${sanitize(contact.value)}\r\n`;
      } else if (contact.type === 'location') {
        vcfContent += `ADR;TYPE=WORK:;;${sanitize(contact.value)};;;;\r\n`;
      }
    });
  }

  // Parse social links (Some VCF parsers support URL)
  if (vcard.social_links && Array.isArray(vcard.social_links)) {
    vcard.social_links.forEach(link => {
      vcfContent += `URL:${sanitize(link.url)}\r\n`;
    });
  }

  if (vcard.profile_image) {
    vcfContent += `PHOTO;VALUE=uri:${sanitize(vcard.profile_image)}\r\n`;
  }

  if (vcard.bio) vcfContent += `NOTE:${sanitize(vcard.bio)}\r\n`;

  vcfContent += "END:VCARD\r\n";

  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${vcard.name ? vcard.name.replace(/\s+/g, '_') : 'contact'}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
