// Otlo Local Database Manager and Ranking Engine
// Handles feed sorting, likes, comments, location follows, directory listings, and seed generation

import { getDistrictName, getTalukaName, getVillageName } from './location_database';
import { supabase } from '../supabaseClient';

export const syncLiveEnglishStats = async (streakVal, xpVal) => {
  try {
    const userId = getOrCreateUserId();
    if (!userId) return;
    const profile = JSON.parse(localStorage.getItem('sanskari_kbc_profile') || '{}');
    const name = profile.name || JSON.parse(localStorage.getItem('user_profile') || '{}').name || localStorage.getItem('google_name') || localStorage.getItem('user_full_name') || "અજ્ઞાત સાધક";
    const rawAvatar = profile.photo || JSON.parse(localStorage.getItem('user_profile') || '{}').avatar || localStorage.getItem('google_avatar') || null;
    const avatar = (rawAvatar && !rawAvatar.includes('pravatar.cc')) ? rawAvatar : null;
    const localProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const city = localProfile.city || null;
    
    await supabase.from('users').upsert({
      id: userId,
      name: name,
      photo_url: avatar,
      city: city,
      english_xp: xpVal,
      english_streak: streakVal,
      last_active: new Date().toISOString().split('T')[0]
    }, { onConflict: 'id' });
  } catch (e) {
    console.error("Live English stats sync failed:", e);
  }
};


// 1. Post categories and visibilities
export const POST_TYPES = [
  { id: "news", name: "સ્થાનિક સમાચાર", icon: "📰", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "event", name: "કાર્યક્રમ/ઇવેન્ટ", icon: "📅", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "alert", name: "ફરિયાદ/Alert", icon: "⚠️", color: "bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/30" },
  { id: "religious", name: "ધાર્મિક", icon: "🕉️", color: "bg-teal-50 text-teal-800 border-teal-200" },
  { id: "job", name: "નોકરી/વ્યવસાય", icon: "💼", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "health", name: "આરોગ્ય camp", icon: "🏥", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { id: "help", name: "Help/સહાય", icon: "🤝", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  { id: "ad", name: "જાહેરાત", icon: "📢", color: "bg-stone-50 text-stone-700 border-stone-200" }
];

export const VISIBILITIES = [
  { id: "village", label: "ફક્ત મારું ગામ" },
  { id: "taluka", label: "મારો તાલુકો" },
  { id: "district", label: "મારો જિલ્લો" },
  { id: "state", label: "સમગ્ર ગુજરાત" }
];

// Helper to get relative time string
export const getRelativeTimeString = (dateInput) => {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now - date;
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "હમણાં જ";
  if (diffMins < 60) return `${diffMins} મિનિટ પહેલા`;
  if (diffHours < 24) return `${diffHours} કલાક પહેલા`;
  return `${diffDays} દિવસ પહેલા`;
};

// Initial Seed Data Generator based on user's location
const generateSeedPosts = (userLoc) => {
  const vName = userLoc.villageNameGu || getVillageName(userLoc.talukaId, userLoc.villageId);
  const tName = getTalukaName(userLoc.districtId, userLoc.talukaId);
  const dName = getDistrictName(userLoc.districtId);
  
  const now = new Date();
  
  return [
    {
      id: "post_1",
      userName: "રમેશભાઈ ચૌધરી",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
      postType: "alert",
      content: `${vName} માં આજે સાંજે ગટર લાઇન રિપેરિંગને કારણે પાણી પુરવઠો બંધ રહેશે. કૃપા કરીને વહેલા પાણીનો સંગ્રહ કરી લેવા વિનંતી.`,
      visibilityLevel: "village",
      villageId: userLoc.villageId,
      talukaId: userLoc.talukaId,
      districtId: userLoc.districtId,
      locationLabel: vName,
      mediaUrl: "",
      likes: 18,
      comments: [
        { id: "c1", userName: "કિરીટ શાહ", content: "માહિતી આપવા બદલ આભાર રમેશભાઈ.", createdAt: new Date(now - 30 * 60000).toISOString() },
        { id: "c2", userName: "અશોક પટેલ", content: "કયા સમય સુધી બંધ રહેશે કોઈ આઈડિયા?", createdAt: new Date(now - 15 * 60000).toISOString() }
      ],
      shares: 3,
      isPinned: false,
      isRep: true,
      repLevel: "village",
      createdAt: new Date(now - 45 * 60000).toISOString() // 45 mins ago
    },
    {
      id: "post_2",
      userName: "ડો. વ્યાસ સાહેબ",
      avatarUrl: "https://i.pravatar.cc/150?img=12",
      postType: "health",
      content: `${tName} હોસ્પિટલ ખાતે આવતીકાલે સવારે ૯ થી બપોરે ૧ વાગ્યા સુધી ફ્રી ડાયાબિટીસ અને બ્લડ પ્રેશર ચેકઅપ કેમ્પનું આયોજન કરવામાં આવ્યું છે. જરૂરિયાતમંદ લોકો લાભ લે.`,
      visibilityLevel: "taluka",
      villageId: "",
      talukaId: userLoc.talukaId,
      districtId: userLoc.districtId,
      locationLabel: tName,
      mediaUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      likes: 34,
      comments: [],
      shares: 8,
      isPinned: false,
      isRep: false,
      repLevel: "",
      createdAt: new Date(now - 3 * 3600000).toISOString() // 3 hours ago
    },
    {
      id: "post_3",
      userName: "નરેન્દ્ર મોદી ફેન ક્લબ",
      avatarUrl: "https://i.pravatar.cc/150?img=13",
      postType: "religious",
      content: `${dName} જિલ્લાના સુપ્રસિદ્ધ મંદિરમાં આવતીકાલે અધિક માસ નિમિત્તે ૫૦૫ દીવાની મહાઆરતીનું સુંદર આયોજન કરવામાં આવ્યું છે. દર્શનનો લાભ અચૂક લેજો. 🙏`,
      visibilityLevel: "district",
      villageId: "",
      talukaId: "",
      districtId: userLoc.districtId,
      locationLabel: dName,
      mediaUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=800",
      likes: 124,
      comments: [
        { id: "c3", userName: "અરવિંદ ગોહિલ", content: "હર હર મહાદેવ!", createdAt: new Date(now - 2 * 3600000).toISOString() }
      ],
      shares: 19,
      isPinned: false,
      isRep: true,
      repLevel: "district",
      createdAt: new Date(now - 6 * 3600000).toISOString() // 6 hours ago
    },
    {
      id: "post_4",
      userName: "ગુજરાતી એપ સમાચાર",
      avatarUrl: "https://i.pravatar.cc/150?img=14",
      postType: "news",
      content: `મુખ્યમંત્રીશ્રી દ્વારા ગુજરાતના તમામ સરકારી પ્રકલ્પોમાં ટેકનોલોજીના ઉપયોગને પ્રાધાન્ય આપવા માટે નવીન ડિજિટલ મિશનની જાહેરાત કરવામાં આવી છે. આનાથી ગ્રામીણ કક્ષાએ ઝડપી નિકાલ થશે.`,
      visibilityLevel: "state",
      villageId: "",
      talukaId: "",
      districtId: "",
      locationLabel: "ગુજરાત",
      mediaUrl: "",
      likes: 85,
      comments: [],
      shares: 11,
      isPinned: false,
      isRep: false,
      repLevel: "",
      createdAt: new Date(now - 12 * 3600000).toISOString() // 12 hours ago
    },
    {
      id: "post_5",
      userName: "સહાય હેલ્પલાઇન",
      avatarUrl: "https://i.pravatar.cc/150?img=15",
      postType: "help",
      content: `${vName} માં ગાય ખોવાઈ ગઈ છે. કાબરચીતરો લાલ રંગ છે અને સીંગડા કપાયેલા છે. જો કોઈને મળે તો તાત્કાલિક સંપર્ક કરવા નમ્ર વિનંતી. ફોટો નીચે મુજબ છે.`,
      visibilityLevel: "village",
      villageId: userLoc.villageId,
      talukaId: userLoc.talukaId,
      districtId: userLoc.districtId,
      locationLabel: vName,
      mediaUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800",
      likes: 9,
      comments: [
        { id: "c4", userName: "દિનેશ ચૌહાણ", content: "મેં સવારે તળાવ પાસે એક ગાય જોઈ હતી.", createdAt: new Date(now - 1 * 3600000).toISOString() }
      ],
      shares: 5,
      isPinned: false,
      isRep: false,
      repLevel: "",
      createdAt: new Date(now - 18 * 3600000).toISOString() // 18 hours ago
    },
    {
      id: "post_6",
      userName: "પટેલ ઓટો ગૅરેજ",
      avatarUrl: "https://i.pravatar.cc/150?img=16",
      postType: "job",
      content: `${tName} માં પટેલ ઓટો ગેરેજમાં અનુભવી ટુ-વ્હીલર મિકેનિકની તાત્કાલિક જરૂર છે. સારો પગાર અને સુવિધા આપવામાં આવશે. રસ ધરાવતા લોકો 9876543210 પર કોલ કરે.`,
      visibilityLevel: "taluka",
      villageId: "",
      talukaId: userLoc.talukaId,
      districtId: userLoc.districtId,
      locationLabel: tName,
      mediaUrl: "",
      likes: 12,
      comments: [],
      shares: 2,
      isPinned: false,
      isRep: false,
      repLevel: "",
      createdAt: new Date(now - 24 * 3600000).toISOString() // 1 day ago
    }
  ];
};

// 2. Main functions
export const getOtloLocation = () => {
  const loc = localStorage.getItem('user_location');
  return loc ? JSON.parse(loc) : null;
};

export const saveOtloLocation = (location) => {
  localStorage.setItem('user_location', JSON.stringify(location));
  // Initialize posts for this location if empty
  initializePosts(location);
};

export const deleteOtloLocation = () => {
  localStorage.removeItem('user_location');
  localStorage.removeItem('otlo_posts');
};

export const initializePosts = (userLoc, force = false) => {
  if (force || !localStorage.getItem('otlo_posts')) {
    const seeds = generateSeedPosts(userLoc);
    localStorage.setItem('otlo_posts', JSON.stringify(seeds));
  }
};

// Ranking Algorithm implementation
const calculatePostScore = (post, userLoc) => {
  const now = new Date();
  const ageHours = (now - new Date(post.createdAt)) / 3600000;
  
  // A. Recency Score (Exponential decay)
  const recency = Math.exp(-ageHours / 24) * 100; // decays over 24 hours
  
  // B. Engagement Score
  const engagement = (post.likes * 2 + post.comments.length * 5 + post.shares * 3);
  
  // C. Location Relevance
  let locationRelevance = 0;
  if (post.villageId === userLoc.villageId) locationRelevance = 100; // Same village
  else if (post.talukaId === userLoc.talukaId) locationRelevance = 70; // Same taluka
  else if (post.districtId === userLoc.districtId) locationRelevance = 40; // Same district
  else locationRelevance = 20; // State-wide / followed location
  
  // D. Representative Bonus
  const repBonus = post.isRep ? 50 : 0;
  
  // Final Weighted score
  return (recency * 0.4) + (engagement * 0.3) + (locationRelevance * 0.2) + (repBonus * 0.1);
};

// Helper to convert string IDs to standard database integers
export const stringToHash = (str) => {
  if (!str) return null;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 2147483647);
};

// Persistent User Supabase ID manager
export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('supabase_user_id');
  if (!userId) {
    // Generate simple UUID
    userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('supabase_user_id', userId);
  }
  return userId;
};

// Sync local user profile to Supabase database
export const syncUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user ? user.id : getOrCreateUserId();
  const userLoc = getOtloLocation();
  
  const localProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const name = localProfile.name || user?.user_metadata?.full_name || localStorage.getItem('user_full_name') || "અજ્ઞાત સાધક";
  let userMobile = user?.phone || localStorage.getItem('supabase_user_mobile');
  if (!userMobile) {
    userMobile = '99' + Math.floor(10000000 + Math.random() * 90000000);
    localStorage.setItem('supabase_user_mobile', userMobile);
  }

  if (user) {
    localStorage.setItem('supabase_user_id', user.id);
    if (user.user_metadata?.full_name) {
      localStorage.setItem('user_full_name', user.user_metadata.full_name);
    }
  }

  const district_id = userLoc ? stringToHash(userLoc.districtId) : null;
  const taluka_id = userLoc ? stringToHash(userLoc.talukaId) : null;
  const village_id = userLoc ? stringToHash(userLoc.villageId) : null;
  const ward = userLoc ? userLoc.ward : null;

  const city = localProfile.city || (userLoc ? userLoc.villageNameGu : null);
  const challengeStreak = parseInt(localStorage.getItem('otlo_challenge_streak') || '0', 10);

  const { error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      name: name,
      mobile: userMobile,
      district_id: district_id,
      taluka_id: taluka_id,
      village_id: village_id,
      ward: ward,
      city: city,
      challenge_streak: challengeStreak,
      last_active: new Date().toISOString().split('T')[0]
    }, { onConflict: 'id' });

  if (error) {
    console.error("Error syncing user profile to Supabase:", error);
  }
  return userId;
};

// Get ranked and filtered posts from Supabase
export const getOtloPosts = async (filterLevel = 'all', followedLocationIds = []) => {
  const userLoc = getOtloLocation();
  
  let postsData = [];
  // Try to query with comments and reactions
  let { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (
        name,
        photo_url,
        is_representative,
        rep_level
      ),
      post_comments (
        id,
        user_name,
        content,
        created_at
      ),
      post_reactions (
        reaction_type,
        user_phone
      )
    `)
    .eq('status', 'active');

  if (error) {
    console.warn("Could not fetch comments/reactions from Supabase, attempting to fetch posts only:", error);
    // Fallback: Query posts only
    const fallbackResult = await supabase
      .from('posts')
      .select(`
        *,
        users (
          name,
          photo_url,
          is_representative,
          rep_level
        )
      `)
      .eq('status', 'active');
    
    if (fallbackResult.error) {
      console.error("Error fetching posts from Supabase:", fallbackResult.error);
      return [];
    }
    postsData = fallbackResult.data || [];
  } else {
    postsData = data || [];
  }

  // Map to UI representation
  const posts = postsData.map(post => {
    const commentsList = (post.post_comments || []).map(c => ({
      id: c.id,
      userName: c.user_name,
      content: c.content,
      createdAt: c.created_at
    }));
    
    const reactionsData = post.post_reactions || [];
    const reactionCounts = {};
    reactionsData.forEach(r => {
      reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
    });

    let locationLabel = "ગુજરાત";
    if (post.visibility === 'village' && userLoc) {
      locationLabel = userLoc.villageNameGu || getVillageName(userLoc.talukaId, userLoc.villageId);
    } else if (post.visibility === 'taluka' && userLoc) {
      locationLabel = getTalukaName(userLoc.districtId, userLoc.talukaId);
    } else if (post.visibility === 'district' && userLoc) {
      locationLabel = getDistrictName(userLoc.districtId);
    }

    return {
      id: post.id,
      userName: post.users?.name || "અજ્ઞાત યુઝર",
      userId: post.user_id,
      avatarUrl: post.users?.photo_url || "https://i.pravatar.cc/150?img=68",
      postType: post.post_type,
      content: post.content,
      visibilityLevel: post.visibility,
      villageId: post.village_id,
      talukaId: post.taluka_id,
      districtId: post.district_id,
      locationLabel: locationLabel,
      mediaUrl: post.media_urls?.[0] || "",
      likes: post.likes || 0,
      comments: commentsList,
      shares: post.shares || 0,
      views: post.views || 0,
      reactionCounts: reactionCounts,
      userReaction: reactionsData.find(r => r.user_phone === (localStorage.getItem('supabase_user_mobile') || localStorage.getItem('user_phone') || ''))?.reaction_type || null,
      isPinned: post.is_pinned || false,
      isRep: post.users?.is_representative || false,
      repLevel: post.users?.rep_level || "",
      createdAt: post.created_at
    };
  });

  // Filter posts - Filter out blocked users and reported posts for Google Play UGC compliance
  const blockedUsers = JSON.parse(localStorage.getItem('otlo_blocked_users') || '[]');
  const reportedPosts = JSON.parse(localStorage.getItem('otlo_reported_posts') || '[]');
  let filteredPosts = posts.filter(post => 
    !blockedUsers.includes(post.userId) && !reportedPosts.includes(post.id)
  );

  // Sort posts by date (latest first), with pinned posts on top
  return filteredPosts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

// Create a new post in Supabase
export const createOtloPost = async (postContent, type, visibility, mediaUrl = "") => {
  const userId = await syncUserProfile();
  const userLoc = getOtloLocation();

  const village_id = (visibility === 'village' && userLoc) ? stringToHash(userLoc.villageId) : null;
  const taluka_id = ((visibility === 'village' || visibility === 'taluka') && userLoc) ? stringToHash(userLoc.talukaId) : null;
  const district_id = ((visibility === 'village' || visibility === 'taluka' || visibility === 'district') && userLoc) ? stringToHash(userLoc.districtId) : null;

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      content: postContent,
      post_type: type,
      visibility: visibility,
      village_id: village_id,
      taluka_id: taluka_id,
      district_id: district_id,
      media_urls: mediaUrl ? [mediaUrl] : []
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating post on Supabase:", error);
    return null;
  }

  let locationLabel = "ગુજરાત";
  if (visibility === 'village' && userLoc) {
    locationLabel = userLoc.villageNameGu || getVillageName(userLoc.talukaId, userLoc.villageId);
  } else if (visibility === 'taluka' && userLoc) {
    locationLabel = getTalukaName(userLoc.districtId, userLoc.talukaId);
  } else if (visibility === 'district' && userLoc) {
    locationLabel = getDistrictName(userLoc.districtId);
  }

  updateRepScore(1);

  return {
    id: data.id,
    userName: "નરેન્દ્રભાઈ પટેલ (તમે)",
    userId: userId,
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    postType: data.post_type,
    content: data.content,
    visibilityLevel: data.visibility,
    villageId: data.village_id,
    talukaId: data.taluka_id,
    districtId: data.district_id,
    locationLabel: locationLabel,
    mediaUrl: data.media_urls?.[0] || "",
    likes: data.likes || 0,
    comments: [],
    shares: data.shares || 0,
    isPinned: data.is_pinned || false,
    isRep: false,
    repLevel: "",
    createdAt: data.created_at
  };
};

// Like a post on Supabase
export const likeOtloPost = async (postId) => {
  const { data, error } = await supabase
    .from('posts')
    .select('likes')
    .eq('id', postId)
    .single();

  if (!error && data) {
    const newLikes = (data.likes || 0) + 1;
    await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', postId);
  }
};

// Update an existing post in Supabase
export const updateOtloPost = async (postId, postContent, type, visibility, mediaUrl = "") => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      content: postContent,
      post_type: type,
      visibility: visibility,
      media_urls: mediaUrl ? [mediaUrl] : []
    })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error("Error updating post in Supabase:", error);
    return null;
  }
  return data;
};

// Delete a post on Supabase
export const deleteOtloPost = async (postId) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  if (error) {
    console.error("Error deleting post from Supabase:", error);
    return false;
  }
  return true;
};

// Toggle a reaction on a post
export const togglePostReaction = async (postId, reactionType) => {
  const userPhone = localStorage.getItem('supabase_user_mobile') || localStorage.getItem('user_phone');
  if (!userPhone) return false;

  // First check if reaction exists, getting an array to avoid .single() error if duplicates exist
  const { data: existingArray } = await supabase
    .from('post_reactions')
    .select('reaction_type')
    .eq('post_id', postId)
    .eq('user_phone', userPhone);

  const existing = existingArray && existingArray.length > 0 ? existingArray[0] : null;

  if (existing) {
    // If same reaction, remove it (delete all for this user to clean duplicates)
    if (existing.reaction_type === reactionType) {
      await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_phone', userPhone);
      return { action: 'removed' };
    } else {
      // If different reaction, safely delete existing ones and insert new
      await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', postId)
        .eq('user_phone', userPhone);

      await supabase
        .from('post_reactions')
        .insert({
          post_id: postId,
          user_phone: userPhone,
          reaction_type: reactionType
        });
      return { action: 'updated', previous: existing.reaction_type };
    }
  } else {
    // Insert new reaction
    await supabase
      .from('post_reactions')
      .insert({
        post_id: postId,
        user_phone: userPhone,
        reaction_type: reactionType
      });
    return { action: 'added' };
  }
};

// Increment post view safely
export const incrementPostView = async (postId) => {
  // Use RPC call to safely increment views
  const { error } = await supabase.rpc('increment_post_view', { post_id: postId });
  if (error) {
    console.error("Error incrementing post view:", error);
    return false;
  }
  return true;
};

// Add a comment to a post on Supabase
export const addOtloComment = async (postId, commentText) => {
  if (!commentText.trim()) return null;

  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_name: "નરેન્દ્રભાઈ પટેલ",
      content: commentText
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding comment to Supabase:", error);
    return null;
  }

  return {
    id: data.id,
    userName: data.user_name,
    content: data.content,
    createdAt: data.created_at
  };
};

// Location Follow/Unfollow system
export const getFollowedLocations = () => {
  const list = localStorage.getItem('otlo_followed_locations');
  return list ? JSON.parse(list) : [];
};

export const followLocation = (locationObj) => {
  const list = getFollowedLocations();
  if (!list.some(item => item.id === locationObj.id)) {
    list.push(locationObj);
    localStorage.setItem('otlo_followed_locations', JSON.stringify(list));
  }
};

export const unfollowLocation = (locationId) => {
  const list = getFollowedLocations();
  const updated = list.filter(item => item.id !== locationId);
  localStorage.setItem('otlo_followed_locations', JSON.stringify(updated));
};

// Representative score and user referrals
const updateRepScore = (points) => {
  const currentScore = parseInt(localStorage.getItem('user_rep_score') || '0', 10);
  localStorage.setItem('user_rep_score', (currentScore + points).toString());
};

export const getUserRepData = () => {
  return {
    referrals: parseInt(localStorage.getItem('user_referrals') || '3', 10),
    followers: 18,
    postsCount: JSON.parse(localStorage.getItem('otlo_posts') || '[]').filter(p => p.userName.includes('(તમે)')).length,
    score: parseInt(localStorage.getItem('user_rep_score') || '45', 10)
  };
};

export const addReferral = () => {
  const currentReferrals = parseInt(localStorage.getItem('user_referrals') || '3', 10);
  localStorage.setItem('user_referrals', (currentReferrals + 1).toString());
  updateRepScore(10); // 1 referral = 10 points
};

// Mock Leaderboard
export const getLeaderboard = () => {
  const userLoc = getOtloLocation();
  const vName = userLoc ? (userLoc.villageNameGu || getVillageName(userLoc.talukaId, userLoc.villageId)) : "દભોઈ";
  
  return [
    { rank: 1, name: "દિનેશ પટેલ", village: vName, score: 320, isRep: true, repLevel: "village" },
    { rank: 2, name: "ગૌરાંગ ચૌધરી", village: vName, score: 280 },
    { rank: 3, name: "નરેન્દ્રભાઈ પટેલ (તમે)", village: vName, score: parseInt(localStorage.getItem('user_rep_score') || '45', 10) },
    { rank: 4, name: "હિતેશ અમીન", village: vName, score: 195 },
    { rank: 5, name: "કલ્પેશ મહેતા", village: vName, score: 140 }
  ].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }));
};

// Mock Yellow Pages Directory (grāma directory)
export const getDirectoryListings = () => {
  const listings = localStorage.getItem('otlo_directory');
  if (listings) return JSON.parse(listings);
  
  const defaultListings = [
    { id: "d1", name: "ગણેશ મિકેનિક", category: "ગૅરેજ", phone: "98765 43211", address: "તળાવ પાસે, બજાર માર્ગ" },
    { id: "d2", name: "શિવ સેવા મેડિકલ સ્ટોર", category: "આરોગ્ય / દવાની દુકાન", phone: "98765 43212", address: "બસ સ્ટેન્ડ સામે" },
    { id: "d3", name: "શ્રી હરિ પ્રોવિઝન સ્ટોર", category: "કરિયાણું", phone: "98765 43213", address: "પંચાયત ચોક" }
  ];
  localStorage.setItem('otlo_directory', JSON.stringify(defaultListings));
  return defaultListings;
};

export const createDirectoryListing = (name, category, phone, address) => {
  const listings = getDirectoryListings();
  const newListing = {
    id: `d_${Date.now()}`,
    name,
    category,
    phone,
    address
  };
  listings.unshift(newListing);
  localStorage.setItem('otlo_directory', JSON.stringify(listings));
  return newListing;
};

// Report a post on Supabase and locally
export const reportOtloPost = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('reports')
      .eq('id', postId)
      .single();

    if (!error && data) {
      const newReports = (data.reports || 0) + 1;
      await supabase
        .from('posts')
        .update({ reports: newReports })
        .eq('id', postId);
    }
  } catch (err) {
    console.error("Error reporting post:", err);
  }

  // Track locally to hide reported posts immediately (Google Play UGC requirement)
  const reported = JSON.parse(localStorage.getItem('otlo_reported_posts') || '[]');
  if (!reported.includes(postId)) {
    reported.push(postId);
    localStorage.setItem('otlo_reported_posts', JSON.stringify(reported));
  }
};

// Block a user locally (Google Play UGC requirement)
export const blockOtloUser = (blockedUserId) => {
  if (!blockedUserId) return;
  const blocked = JSON.parse(localStorage.getItem('otlo_blocked_users') || '[]');
  if (!blocked.includes(blockedUserId)) {
    blocked.push(blockedUserId);
    localStorage.setItem('otlo_blocked_users', JSON.stringify(blocked));
  }
};

// Get blocked users
export const getBlockedOtloUsers = () => {
  return JSON.parse(localStorage.getItem('otlo_blocked_users') || '[]');
};

// Get reported posts
export const getReportedOtloPosts = () => {
  return JSON.parse(localStorage.getItem('otlo_reported_posts') || '[]');
};

// Delete User Account from database and local storage (Google Play Console Policy requirement)
export const deleteUserAccount = async () => {
  const userId = localStorage.getItem('supabase_user_id');
  if (userId) {
    try {
      // 1. Delete user from Supabase 'users' table
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("Error deleting user from Supabase:", error);
      }
    } catch (err) {
      console.error("Exception during Supabase account deletion:", err);
    }
  }

  try {
    // Sign out from Supabase auth session
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Error signing out from Supabase Auth during deletion:", err);
  }

  // 2. Clear all local storage keys
  localStorage.removeItem('sanskari_token');
  localStorage.removeItem('sanskari_consent');
  localStorage.removeItem('user_profile');
  localStorage.removeItem('supabase_user_id');
  localStorage.removeItem('supabase_user_mobile');
  localStorage.removeItem('user_full_name');
  localStorage.removeItem('user_location');
  localStorage.removeItem('otlo_posts');
  localStorage.removeItem('otlo_followed_locations');
  localStorage.removeItem('otlo_blocked_users');
  localStorage.removeItem('otlo_reported_posts');
  localStorage.removeItem('gujarat_coins');
  localStorage.removeItem('otlo_passport_stamps');
  localStorage.removeItem('otlo_passport_diary');
  localStorage.removeItem('otlo_suggested_places');

  // 3. Reload window to direct back to onboarding / login
  window.location.reload();
};

// Helper to fetch cities for user IDs
export const fetchCitiesForUserIds = async (userIds) => {
  if (!userIds || userIds.length === 0) return {};
  const cityMap = {};
  try {
    const { data } = await supabase
      .from('users')
      .select('id, city')
      .in('id', userIds);
    
    if (data) {
      data.forEach(u => {
        if (u.city) cityMap[u.id] = u.city;
      });
    }
  } catch (e) {
    console.error("Error fetching cities for user IDs:", e);
  }
  return cityMap;
};


