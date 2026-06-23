import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinaryHelper';
import { supabase } from '../supabaseClient';
import { DISTRICTS, TALUKAS, getDistrictName, getTalukaName } from '../utils/location_database';
import { AI_PROVIDERS, getAIConfig, saveAIConfig, testAIConnection } from '../utils/aiService';

const DEFAULT_PIN = "1008";

const MOCK_STATS = {
  dailyUsers: 2450,
  cardsShared: 14820,
  quizPlays: 3890,
  activePremium: 412,
  reportedPosts: 8
};

const MOCK_MATAJI_SUBMISSIONS = [
  { id: 1, name: "શ્રી ખોડિયાર માતાજી", gotra: "પટેલ / કણબી", detail: "ખોડલધામ કાગવડ ઇતિહાસ અને આરતી વિધિની નવી માહિતી.", user: "નરેશ પી.", status: "Pending" },
  { id: 2, name: "શ્રી બહુચરાજી માતાજી", gotra: "બારોટ / ભટ્ટ", detail: "કોકિલા વ્રત અને નાભિ સ્થાન શક્તિપીઠનો મહિમા વિગતવાર.", user: "રાકેશ બી.", status: "Pending" },
  { id: 3, name: "શ્રી મોગલ મા", gotra: "ચારણ / ગઢવી", detail: "કબરાઉ ધામનો ઇતિહાસ અને શ્રદ્ધાળુઓના પરચાઓની વિગત.", user: "હરપાલસિંહ સી.", status: "Pending" }
];

const MOCK_REPORTED_POSTS = [
  { id: 1, author: "વિજય આર.", content: "આ ખોટી માહિતી ફેલાવી રહ્યું છે, પંચાંગ ચોઘડિયામાં સમય સાચો નથી.", reports: 4, timestamp: "૨ કલાક પહેલાં" },
  { id: 2, author: "સુરેશ એમ.", content: "જાહેરાત: ભક્તિ પ્રમોશન માટે કોન્ટેક્ટ કરો 9898xxxxxx", reports: 2, timestamp: "૫ કલાક પહેલાં" },
  { id: 3, author: "ગીતા પી.", content: "કોઈપણ અપશબ્દો વાળી વાત કે પોસ્ટ", reports: 5, timestamp: "૧ દિવસ પહેલાં" }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // App Section Control States
  const [adminFeatureFlags, setAdminFeatureFlags] = useState({});
  const [isFlagsLoading, setIsFlagsLoading] = useState(true);
  const [flagsSavingKey, setFlagsSavingKey] = useState(null);

  // Feed Publisher State
  const [pubCategory, setPubCategory] = useState("suvichar");
  const [pubMediaType, setPubMediaType] = useState("text");
  const [pubText, setPubText] = useState("");
  const [pubUrl, setPubUrl] = useState("");
  const [pubLinkTitle, setPubLinkTitle] = useState("");
  const [pubLinkDomain, setPubLinkDomain] = useState("");
  const [pubImageFile, setPubImageFile] = useState(null);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [editPostId, setEditPostId] = useState(null);
  const [customPosts, setCustomPosts] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Local storage backed state
  const [stats, setStats] = useState(MOCK_STATS);
  const [matajiSubmissions, setMatajiSubmissions] = useState(MOCK_MATAJI_SUBMISSIONS);
  const [reportedPosts, setReportedPosts] = useState(MOCK_REPORTED_POSTS);
  
  // AI Settings State
  const [aiConfig, setAiConfig] = useState(() => getAIConfig());
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [aiSaved, setAiSaved] = useState(false);
  const selectedProvider = AI_PROVIDERS.find(p => p.id === aiConfig.provider) || null;
  
  // Custom Quotes State
  const [customQuotes, setCustomQuotes] = useState(() => {
    const saved = localStorage.getItem('sanskari_custom_quotes');
    return saved ? JSON.parse(saved) : {
      bhakti: [], morning: [], night: [], festival: [], prerna: [], health: [], jyotish: [], sahitya: []
    };
  });

  const [newQuoteText, setNewQuoteText] = useState("");
  const [newQuoteSource, setNewQuoteSource] = useState("");
  const [newQuoteCategory, setNewQuoteCategory] = useState("bhakti");

  // Premium Management
  const [promoCodes, setPromoCodes] = useState([
    { code: "JAYSHREEKRISHNA", discount: "50%", type: "Festival Special", status: "Active" },
    { code: "KULDEVIPRASAD", discount: "100%", type: "Free Trial", status: "Active" },
  ]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("50%");

  // ========================================================
  // MARKETING OFFERS STATE & LOGIC
  // ========================================================
  const [offers, setOffers] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [dbError, setDbError] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offerForm, setOfferForm] = useState({
    name: "",
    desc_text: "",
    code: "",
    target_type: "all_gujarat",
    target_district: "",
    target_taluka: "",
    target_city_village: "",
    sponsored_by: "",
    reward_stage: 0,
    how_to_redeem: ""
  });
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerImageFile, setOfferImageFile] = useState(null);
  const [sponsorLogoFile, setSponsorLogoFile] = useState(null);
  const [selectedAnalyticsOffer, setSelectedAnalyticsOffer] = useState("all");
  const [analyticsPeriod, setAnalyticsPeriod] = useState("daily");
  
  const [communityAlertText, setCommunityAlertText] = useState("");
  const [isAlertSaving, setIsAlertSaving] = useState(false);
  const [isAlertLoading, setIsAlertLoading] = useState(false);

  // User Management State
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [userCityFilter, setUserCityFilter] = useState("");
  const [isSavingUser, setIsSavingUser] = useState(null);

  const fetchOffersAndAnalytics = async () => {
    setLoadingOffers(true);
    setDbError(false);
    try {
      const { data: dbOffers, error: offersError } = await supabase
        .from('scratch_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (offersError) throw offersError;

      const { data: dbAnalytics, error: analyticsError } = await supabase
        .from('scratch_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (analyticsError) throw analyticsError;

      setOffers(dbOffers || []);
      setAnalytics(dbAnalytics || []);
    } catch (err) {
      console.error("Failed to load marketing offers and analytics from Supabase:", err);
      setDbError(true);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'marketing_offers') {
      fetchOffersAndAnalytics();
    }
  }, [activeTab]);

  const handleAddOffer = async (e) => {
    e.preventDefault();
    if (!offerForm.name || !offerForm.desc_text || !offerForm.code) {
      alert("કૃપા કરી નામ, વર્ણન અને કૂપન કોડ ભરો.");
      return;
    }
    setSubmittingOffer(true);
    try {
      let finalImageUrl = null;
      if (offerImageFile) {
        finalImageUrl = await uploadToCloudinary(offerImageFile);
      }

      let finalSponsorLogoUrl = null;
      if (sponsorLogoFile) {
        finalSponsorLogoUrl = await uploadToCloudinary(sponsorLogoFile);
      }

      const { error } = await supabase
        .from('scratch_offers')
        .insert([{
          name: offerForm.name.trim(),
          desc_text: offerForm.desc_text.trim(),
          code: offerForm.code.trim().toUpperCase(),
          target_type: offerForm.target_type,
          target_district: offerForm.target_type !== 'all_gujarat' ? (offerForm.target_district || null) : null,
          target_taluka: offerForm.target_type === 'taluka' ? (offerForm.target_taluka || null) : null,
          target_city_village: offerForm.target_type === 'city_village' ? (offerForm.target_city_village.trim() || null) : null,
          image_url: finalImageUrl,
          sponsored_by: offerForm.sponsored_by.trim() || null,
          sponsor_logo_url: finalSponsorLogoUrl,
          reward_stage: Number(offerForm.reward_stage) || 0,
          how_to_redeem: offerForm.how_to_redeem.trim() || null,
          is_active: true
        }]);

      if (error) throw error;
      alert("✅ નવી ઓફર સફળતાપૂર્વક ઉમેરવામાં આવી!");
      setOfferForm({
        name: "",
        desc_text: "",
        code: "",
        target_type: "all_gujarat",
        target_district: "",
        target_taluka: "",
        target_city_village: "",
        sponsored_by: "",
        reward_stage: 0,
        how_to_redeem: ""
      });
      setOfferImageFile(null);
      setSponsorLogoFile(null);
      fetchOffersAndAnalytics();
    } catch (err) {
      console.error("Error creating offer:", err);
      alert("ભૂલ: ઓફર ઉમેરી શકાઈ નથી.");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm("શું તમે આ ઓફર ડીલીટ કરવા માંગો છો? આનાથી તેના તમામ એનાલિટિક્સ ડેટા પણ ડીલીટ થઇ જશે.")) return;
    try {
      const { error } = await supabase
        .from('scratch_offers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchOffersAndAnalytics();
    } catch (err) {
      console.error("Error deleting offer:", err);
      alert("ભૂલ: ઓફર ડીલીટ કરી શકાઈ નથી.");
    }
  };

  const handleToggleOfferActive = async (id, currentVal) => {
    try {
      const { error } = await supabase
        .from('scratch_offers')
        .update({ is_active: !currentVal })
        .eq('id', id);
      if (error) throw error;
      fetchOffersAndAnalytics();
    } catch (err) {
      console.error("Error toggling offer state:", err);
    }
  };

  const getPeriodStats = () => {
    const filtered = analytics.filter(a => selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer);
    const groups = {};
    
    filtered.forEach(a => {
      const date = new Date(a.created_at);
      let key = "";
      if (analyticsPeriod === 'daily') {
        key = date.toLocaleDateString('gu-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      } else if (analyticsPeriod === 'weekly') {
        const day = date.getDay();
        const diff = date.getDate() - day;
        const startOfWeek = new Date(date.setDate(diff));
        key = `અઠવાડિયું શરૂ: ` + startOfWeek.toLocaleDateString('gu-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      } else if (analyticsPeriod === 'monthly') {
        key = date.toLocaleDateString('gu-IN', { year: 'numeric', month: 'long' });
      } else {
        key = `વર્ષ: ` + date.getFullYear().toString().replace(/[0-9]/g, d => '૦૧૨૩૪૫૬૭૮૯'[d]);
      }
      
      if (!groups[key]) {
        groups[key] = { key, total: 0, male: 0, female: 0, locations: {} };
      }
      
      const g = groups[key];
      g.total++;
      if (a.gender === 'male') g.male++;
      else if (a.gender === 'female') g.female++;
      
      const locName = a.city_village && a.city_village !== 'unknown' ? a.city_village : (getDistrictName(a.district) || 'ગુજરાત');
      g.locations[locName] = (g.locations[locName] || 0) + 1;
    });
    
    return Object.values(groups).map(g => {
      let topLoc = "—";
      let maxCount = 0;
      Object.entries(g.locations).forEach(([loc, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topLoc = loc;
        }
      });
      return {
        period: g.key,
        total: g.total,
        male: g.male,
        female: g.female,
        topLoc: topLoc
      };
    });
  };

  // Load actual application stats
  useEffect(() => {
    // Generate some randomized live-looking numbers based on local storage activity
    const cardsGenerated = parseInt(localStorage.getItem('sanskari_cards_generated_count') || "430");
    setStats(prev => ({
      ...prev,
      cardsShared: prev.cardsShared + cardsGenerated
    }));
  }, []);

  const handlePinSubmit = (val) => {
    const currentPin = val || pin;
    if (currentPin === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 800);
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        handlePinSubmit(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  // Add Custom Quote
  const handleAddQuote = (e) => {
    e.preventDefault();
    if (!newQuoteText || !newQuoteSource) return;

    const newQuote = {
      text: newQuoteText,
      source: newQuoteSource
    };

    const updated = {
      ...customQuotes,
      [newQuoteCategory]: [...(customQuotes[newQuoteCategory] || []), newQuote]
    };

    setCustomQuotes(updated);
    localStorage.setItem('sanskari_custom_quotes', JSON.stringify(updated));
    
    // Clear Form
    setNewQuoteText("");
    setNewQuoteSource("");
    alert("સુવિચાર સફળતાપૂર્વક ઉમેરાઈ ગયો!");
  };

  // Delete Custom Quote
  const handleDeleteQuote = (category, index) => {
    const updatedCategoryList = [...customQuotes[category]];
    updatedCategoryList.splice(index, 1);
    
    const updated = {
      ...customQuotes,
      [category]: updatedCategoryList
    };

    setCustomQuotes(updated);
    localStorage.setItem('sanskari_custom_quotes', JSON.stringify(updated));
  };

  // Community post action
  const handleResolveReport = (id, action) => {
    setReportedPosts(prev => prev.filter(post => post.id !== id));
    if (action === 'delete') {
      alert("પોસ્ટ કમ્યુનિટીમાંથી સફળતાપૂર્વક દૂર કરવામાં આવી.");
    } else {
      alert("પોસ્ટને ક્લીન ચીટ આપીને રિપોર્ટ રદ કરાયો.");
    }
  };

  // Mataji Form approve
  const handleApproveMataji = (id) => {
    setMatajiSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: "Approved" } : sub));
    alert("માહિતી અપ્રુવ કરવામાં આવી. આ વિગતો એપના 'માતાજી ઇતિહાસ' સેક્શનમાં એડ થઈ જશે.");
  };

  const handleDeclineMataji = (id) => {
    setMatajiSubmissions(prev => prev.filter(sub => sub.id !== id));
    alert("સબમિશન અસ્વીકાર કરવામાં આવ્યું.");
  };

  // Add Promo Code
  const handleAddPromo = (e) => {
    e.preventDefault();
    if (!newPromoCode) return;
    setPromoCodes([...promoCodes, {
      code: newPromoCode.toUpperCase(),
      discount: newPromoDiscount,
      type: "Custom Code",
      status: "Active"
    }]);
    setNewPromoCode("");
  };

  // Community Alert (Jaher Khabar) Actions
  const fetchCommunityAlert = async () => {
    setIsAlertLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'community_alert')
        .single();
      if (!error && data) {
        setCommunityAlertText(data.value);
      }
    } catch (e) {
      console.error("Failed to load community alert:", e);
    } finally {
      setIsAlertLoading(false);
    }
  };

  const saveCommunityAlert = async () => {
    setIsAlertSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'community_alert',
          value: communityAlertText
        }, { onConflict: 'key' });
      if (!error) {
        alert("જાહેર ખબર સફળતાપૂર્વક અપડેટ થઈ ગઈ!");
      } else {
        alert("સેવ કરવામાં ભૂલ આવી: " + error.message);
      }
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setIsAlertSaving(false);
    }
  };

  // App Section Control Actions
  const fetchAdminFeatureFlags = async () => {
    setIsFlagsLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'feature_control')
        .single();
      if (!error && data) {
        setAdminFeatureFlags(JSON.parse(data.value));
      } else {
        const defaults = {
          devotional: 'live', health: 'live', community: 'live', tools: 'live',
          panchang: 'live', kundali: 'live', kuldevi: 'live', vastu: 'live',
          interest_calculator: 'live', namkaran: 'live', card: 'live',
          biodata: 'live', shradhanjali: 'live', devotional_cards: 'live',
          swipe_cards: 'live', gujarat_safari: 'live', passport: 'live',
          mysteries: 'live', rewards: 'live', society: 'live', english: 'live',
          games: 'live', daily_challenge: 'live'
        };
        setAdminFeatureFlags(defaults);
      }
    } catch (e) {
      console.error("Failed to load feature flags:", e);
    } finally {
      setIsFlagsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    } catch (e) {
      console.error("Exception in fetchUsers:", e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const toggleUserVerification = async (userId, currentVerified) => {
    setIsSavingUser(userId);
    const newStatus = !currentVerified;
    try {
      const { error } = await supabase
        .from('users')
        .update({ verified_badge: newStatus })
        .eq('id', userId);

      if (error) {
        alert("વેરિફિકેશન અપડેટ કરવામાં ભૂલ: " + error.message);
      } else {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified_badge: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingUser(null);
    }
  };

  const toggleUserRepresentative = async (userId, currentRepStatus) => {
    setIsSavingUser(userId);
    const newStatus = !currentRepStatus;
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_representative: newStatus })
        .eq('id', userId);

      if (error) {
        alert("પ્રતિનિધિ સ્ટેટસ અપડેટ કરવામાં ભૂલ: " + error.message);
      } else {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_representative: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingUser(null);
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const query = usersSearch.toLowerCase().trim();
      const nameMatch = user.name?.toLowerCase().includes(query);
      const mobileMatch = user.mobile?.includes(query);
      const emailMatch = user.email?.toLowerCase().includes(query);
      const cityMatch = user.city?.toLowerCase().includes(query);
      const searchOk = !query || nameMatch || mobileMatch || emailMatch || cityMatch;

      let statusOk = true;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (userFilter === "active") {
        statusOk = user.last_active && new Date(user.last_active) >= thirtyDaysAgo;
      } else if (userFilter === "inactive") {
        statusOk = !user.last_active || new Date(user.last_active) < thirtyDaysAgo;
      } else if (userFilter === "verified") {
        statusOk = !!user.verified_badge;
      }

      const cityQuery = userCityFilter.toLowerCase().trim();
      const cityFilterOk = !cityQuery || user.city?.toLowerCase().includes(cityQuery);

      return searchOk && statusOk && cityFilterOk;
    });
  };

  useEffect(() => {
    if (activeTab === 'users_management') {
      fetchUsers();
    }
    if (activeTab === 'section_control') {
      fetchAdminFeatureFlags();
    }
    if (activeTab === 'publisher') {
      fetchCommunityAlert();
    }
  }, [activeTab]);

  const updateFeatureFlag = async (featureKey, newState) => {
    setFlagsSavingKey(featureKey);
    const updatedFlags = { ...adminFeatureFlags, [featureKey]: newState };
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'feature_control',
          value: JSON.stringify(updatedFlags)
        }, { onConflict: 'key' });
      if (!error) {
        setAdminFeatureFlags(updatedFlags);
        window.dispatchEvent(new Event('refetch-feature-flags'));
      } else {
        alert("સેવ કરવામાં ભૂલ આવી: " + error.message);
      }
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setFlagsSavingKey(null);
    }
  };

  // Feed Publisher Actions
  const loadCustomPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          post_reactions (
            reaction_type
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(p => {
          const mediaUrl = p.media_urls?.[0] || null;
          let mediaType = 'text';
          if (mediaUrl) {
            mediaType = (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) ? 'video' : 'image';
          }
          
          const rxCount = p.post_reactions ? p.post_reactions.length : 0;

          return {
            id: p.id,
            categoryId: p.post_type,
            timestamp: new Date(p.created_at).toLocaleDateString('gu-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            content: {
              text: p.content,
              mediaType: mediaType,
              mediaUrl: mediaUrl,
              linkDetails: null
            },
            likesCount: rxCount,
            sharesCount: p.shares || 0,
            views: p.views || 0,
            reports: p.reports || 0
          };
        });
        setCustomPosts(mapped);
      } else if (error) {
        console.error("Supabase select error:", error);
      }
    } catch (e) {
      console.error("Failed to load posts from Supabase:", e);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadCustomPosts();
  }, []);

  const handleEditPost = (post) => {
    setEditPostId(post.id);
    setPubCategory(post.categoryId);
    setPubMediaType(post.content.mediaType);
    
    let text = post.content.text;
    if (text?.startsWith("POLL::")) {
      try {
        const pollObj = JSON.parse(text.replace("POLL::", ""));
        setPubText(pollObj.question);
        setPollOptions(pollObj.options.map(o => o.text));
      } catch (e) {
        setPubText(text);
        setPollOptions(["", ""]);
      }
    } else {
      setPubText(text);
      setPollOptions(["", ""]);
    }
    
    setPubUrl(post.content.mediaUrl || (post.content.linkDetails?.url) || "");
    setPubLinkTitle(post.content.linkDetails?.title || "");
    setPubLinkDomain(post.content.linkDetails?.domain || "");
    setPubImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (id) => {
    if (confirm("શું તમે ખરેખર આ પોસ્ટ ડિલીટ કરવા માંગો છો?")) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        alert("પોસ્ટ સફળતાપૂર્વક ડિલીટ થઈ ગઈ!");
        loadCustomPosts();
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("Failed to delete post from Supabase:", err);
        alert("ડીલીટ કરવામાં ભૂલ આવી: " + err.message);
      }
    }
  };

  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!pubText) return alert("લખાણ લખવું જરૂરી છે!");
    
    // Validation for image/video requirements
    if (pubMediaType === "image" && !pubImageFile && !pubUrl) {
      return alert("કૃપા કરીને ફોટો અપલોડ કરો અથવા ફોટો લિંક લખો!");
    }
    if (pubMediaType === "video" && !pubImageFile && !pubUrl) {
      return alert("કૃપા કરીને વિડીયો અપલોડ કરો અથવા યૂટ્યૂબ લિંક લખો!");
    }
    
    setPublishing(true);
    try {
      let finalImageUrl = pubUrl;
      if ((pubMediaType === "image" || pubMediaType === "video") && pubImageFile) {
        finalImageUrl = await uploadToCloudinary(pubImageFile);
      }

      let postTextToSave = pubText;
      if (pubCategory === "poll") {
        const activeOptions = pollOptions.map(o => o.trim()).filter(Boolean);
        if (activeOptions.length < 2) {
          setPublishing(false);
          return alert("પોલ માટે ઓછામાં ઓછા બે વિકલ્પો લખવા જરૂરી છે!");
        }
        postTextToSave = "POLL::" + JSON.stringify({
          question: pubText,
          options: activeOptions.map(opt => ({ text: opt }))
        });
      }

      let userId = localStorage.getItem('supabase_user_id');
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user ? user.id : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        localStorage.setItem('supabase_user_id', userId);
      }

      const postData = {
        user_id: userId,
        content: postTextToSave,
        post_type: pubCategory,
        visibility: 'state',
        media_urls: finalImageUrl ? [finalImageUrl] : []
      };

      if (editPostId) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editPostId);

        if (error) throw error;
        alert("પોસ્ટ સફળતાપૂર્વક અપડેટ થઈ ગઈ!");
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([postData]);

        if (error) throw error;
        alert("નવી પોસ્ટ સફળતાપૂર્વક પબ્લિશ થઈ ગઈ!");
      }

      setPubText("");
      setPubUrl("");
      setPubLinkTitle("");
      setPubLinkDomain("");
      setPubImageFile(null);
      setPollOptions(["", ""]);
      setEditPostId(null);
      loadCustomPosts();
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Error publishing post:", err);
      alert("પોસ્ટ પબ્લિશ કરવામાં ભૂલ આવી: " + err.message);
    } finally {
      setPublishing(false);
    }
  };

  // PIN PROTECTION SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-[#fef8f1] dark:bg-[#1a0a00] flex flex-col items-center justify-center p-4 font-body transition-colors">
        <div className={`w-full max-w-sm bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-amber-200/50 dark:border-stone-800 shadow-xl text-center transition-all ${pinError ? 'animate-shake' : ''}`}>
          
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/20">
            <img src="/logo.jpg" alt="Gujarati App Logo" className="w-full h-full object-cover" />
          </div>

          <h2 className="font-headline font-black text-2xl tracking-tight text-stone-900 dark:text-stone-100">એડમિન લોગિન</h2>
          <p className="text-stone-500 dark:text-stone-400 font-gujarati text-xs mt-2 mb-6">
            એપ મેનેજમેન્ટ કરવા માટે ૪-અંકનો સિક્રેટ પિન એન્ટર કરો.
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pinError 
                    ? 'bg-rose-500 border-rose-500 scale-110' 
                    : i < pin.length 
                      ? 'bg-amber-500 border-amber-500 scale-110' 
                      : 'border-stone-300 dark:border-stone-700 bg-transparent'
                }`}
              />
            ))}
          </div>

          {/* Custom Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button 
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-stone-800 font-headline font-bold text-lg rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-800 dark:text-stone-200 border border-stone-100 dark:border-stone-800"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={() => navigate('/')}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 font-gujarati font-bold text-xs rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-500 border border-stone-100 dark:border-stone-800"
            >
              બહાર જાઓ
            </button>
            <button 
              onClick={() => handleKeyPress("0")}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-stone-800 font-headline font-bold text-lg rounded-2xl flex items-center justify-center active:scale-95 transition-all text-stone-800 dark:text-stone-200 border border-stone-100 dark:border-stone-800"
            >
              0
            </button>
            <button 
              onClick={handleBackspace}
              className="h-14 bg-stone-50 dark:bg-stone-800/50 hover:bg-rose-50 dark:hover:bg-stone-800 text-rose-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all border border-stone-100 dark:border-stone-800"
            >
              <span className="material-symbols-outlined text-xl">backspace</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD SCREEN
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-body min-h-[85vh] text-stone-800 dark:text-stone-200 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="font-headline font-black text-2xl tracking-tight flex items-center gap-2">
              ગુજરાતી એપ એડમિન કંટ્રોલર
            </h1>
            <p className="text-stone-500 dark:text-stone-400 font-gujarati text-xs mt-1">
              એપ્લિકેશનના લાઇવ કન્ટેન્ટ, રિપોર્ટ્સ અને યુઝર્સને મેનેજ કરો.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-xl font-gujarati font-bold text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-50 transition active:scale-95 shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">lock</span> લોક આઉટ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white dark:bg-stone-950 p-4 rounded-[2rem] border border-stone-200/50 dark:border-stone-900 shadow-sm space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "overview" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">monitoring</span>
              મેનેજમેન્ટ ડેશબોર્ડ
            </button>
            <button 
              onClick={() => setActiveTab("publisher")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "publisher" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">post_add</span>
              પોસ્ટ પબ્લિશ કરો
            </button>
            <button 
              onClick={() => setActiveTab("users_management")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "users_management" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">group</span>
              👤 યુઝર મેનેજમેન્ટ
            </button>
            <button 
              onClick={() => setActiveTab("mataji")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "mataji" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              માતાજી વિગતો સ્વીકૃતિ
              {matajiSubmissions.filter(s => s.status === 'Pending').length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-headline font-bold">
                  {matajiSubmissions.filter(s => s.status === 'Pending').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("quotes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "quotes" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">rate_review</span>
              સુવિચાર કસ્ટમાઇઝેશન
            </button>
            <button 
              onClick={() => setActiveTab("moderator")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "moderator" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">gavel</span>
              કમ્યુનિટી મોડરેટર
              {reportedPosts.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-headline font-bold">
                  {reportedPosts.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("premium")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "premium" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">card_membership</span>
              પ્રીમિયમ અને પ્રોમો કોડ
            </button>
            <button 
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "ai" 
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">smart_toy</span>
              🤖 AI સેટિંગ
              {aiConfig.enabled && aiConfig.provider && (
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("marketing_offers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "marketing_offers" 
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">card_giftcard</span>
              🎁 સરપ્રાઇઝ ઇનામો
            </button>
            <button 
              onClick={() => setActiveTab("section_control")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all ${
                activeTab === "section_control" 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-lg">app_settings_alt</span>
              📱 એપ સેક્શન કંટ્રોલ
            </button>
          </div>
        </div>

        {/* Tab Contents Panel */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">દૈનિક યુઝર્સ (Live)</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.dailyUsers}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૧૪% વધારો</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">કુલ જનરેટ કરેલ કાર્ડ્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.cardsShared}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૨૫% સોશિયલ શેર</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">રમાયેલ ક્વિઝ ગેમ્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.quizPlays}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">↑ ૮% રીટેન્શન વધ્યું</span>
                </div>
                <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                  <span className="text-stone-400 font-gujarati text-xs">એક્ટિવ પ્રીમિયમ યુઝર્સ</span>
                  <span className="font-headline font-black text-3xl text-amber-500 mt-2">{stats.activePremium}</span>
                  <span className="text-[10px] text-emerald-500 font-bold mt-1">આજે ૨ અપગ્રેડ થયાં</span>
                </div>
              </div>

              {/* Graphic Stats Chart Visualizer */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 mb-6">છેલ્લા ૭ દિવસની એપ એક્ટિવિટી</h3>
                <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2">
                  {[
                    { day: "સોમ", val: 40 },
                    { day: "મંગળ", val: 55 },
                    { day: "બુધ", val: 48 },
                    { day: "ગુરૂ", val: 70 },
                    { day: "શુક્ર", val: 65 },
                    { day: "શનિ", val: 85 },
                    { day: "રવિ", val: 95 }
                  ].map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full relative bg-amber-500/10 dark:bg-stone-800 rounded-t-lg overflow-hidden h-36 flex items-end">
                        <div 
                          style={{ height: `${item.val}%` }}
                          className="w-full bg-gradient-to-t from-amber-600 to-amber-400 group-hover:brightness-110 transition-all rounded-t-sm"
                        />
                      </div>
                      <span className="font-gujarati text-[10px] text-stone-500 dark:text-stone-400">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-6">
                <h4 className="font-gujarati font-bold text-xs text-amber-700 dark:text-amber-550 uppercase tracking-wider mb-3">એડમિન ક્વિક એક્શન ટાસ્ક લિસ્ટ</h4>
                <ul className="space-y-2 font-gujarati text-xs text-stone-600 dark:text-stone-400">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-rose-500 animate-pulse">info</span>
                    માતાજી વિગતો સેક્શનમાં મળેલા નવા ૩ સબમિશન્સ રીવ્યુ કરો.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-500">warning</span>
                    કમ્યુનિટી પોસ્ટમાં ફ્લેગ કરેલી ૩ વિવાદિત કોમેન્ટ્સ પર મોડરેટર એક્શન લો.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                    આજનો પંચાંગ અને શુભ સમય ચોઘડિયા પ્રોટોકોલ બરાબર સિંક થઈ ગયો છે.
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 2: MATAJI GUIDE SUBMISSIONS */}
          {activeTab === "mataji" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">માતાજી અને કુળદેવી કલેક્શન સબમિશન્સ</h3>
                <span className="font-gujarati text-xs text-stone-500">યુઝર્સ તરફથી મળેલ ગૂગલ ફોર્મ સબમિશન્સ લિસ્ટ</span>
              </div>

              {matajiSubmissions.length === 0 ? (
                <div className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] p-12 text-center border border-stone-200/50 dark:border-stone-850">
                  <span className="material-symbols-outlined text-stone-400 text-5xl mb-3">inbox</span>
                  <p className="font-gujarati font-bold text-stone-500">હાલમાં કોઈ નવું સબમિશન નથી.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {matajiSubmissions.map(sub => (
                    <div 
                      key={sub.id} 
                      className={`bg-white dark:bg-stone-900 p-6 rounded-[2rem] border shadow-sm transition-all ${
                        sub.status === 'Approved' 
                          ? 'border-emerald-200 bg-emerald-500/5 dark:border-emerald-950 dark:bg-emerald-950/10' 
                          : 'border-stone-200 dark:border-stone-850'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-gujarati font-bold">{sub.gotra} કુળ માટે</span>
                          <h4 className="font-gujarati font-bold text-base mt-1 text-stone-800 dark:text-stone-200">{sub.name}</h4>
                        </div>
                        <span className={`text-[10px] font-gujarati font-bold px-2 py-1 rounded-full ${
                          sub.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>{sub.status}</span>
                      </div>
                      
                      <p className="font-gujarati text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4 p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-100 dark:border-stone-900">
                        {sub.detail}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 font-gujarati">યુઝર: {sub.user} દ્વારા સબમિટ કરેલ</span>
                        
                        {sub.status === 'Pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDeclineMataji(sub.id)}
                              className="px-3 py-1.5 border border-stone-200 dark:border-stone-800 hover:bg-rose-50 text-rose-500 rounded-lg text-xs font-gujarati font-bold transition active:scale-95"
                            >
                              નકારો
                            </button>
                            <button 
                              onClick={() => handleApproveMataji(sub.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-gujarati font-bold transition active:scale-95"
                            >
                              અપ્રુવ અને પબ્લિશ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOM QUOTES */}
          {activeTab === "quotes" && (
            <div className="space-y-8">
              
              {/* Add Quote Form */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૧. નવો સુવિચાર ઉમેરો</h3>
                <form onSubmit={handleAddQuote} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સુવિચાર કેટેગરી</label>
                      <select 
                        value={newQuoteCategory}
                        onChange={(e) => setNewQuoteCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                      >
                        <option value="bhakti">ભક્તિ (Devotional)</option>
                        <option value="morning">સવાર (Morning)</option>
                        <option value="night">રાત (Night)</option>
                        <option value="festival">તહેવાર (Festival)</option>
                        <option value="prerna">પ્રેરણા (Inspirational)</option>
                        <option value="health">આરોગ્ય (Health)</option>
                        <option value="jyotish">જ્યોતિષ (Astrology)</option>
                        <option value="sahitya">સાહિત્ય (Literature)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સંદર્ભ (Source)</label>
                      <input 
                        type="text"
                        placeholder="દા.ત. શ્રીમદ્ ભગવદ્ ગીતા, કબીરજી કે લેખક"
                        value={newQuoteSource}
                        onChange={(e) => setNewQuoteSource(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">સુવિચાર વિગત (Gujarati Text)</label>
                    <textarea 
                      rows="3"
                      placeholder="અહીં ગુજરાતીમાં સુવિચાર ટાઈપ કરો..."
                      value={newQuoteText}
                      onChange={(e) => setNewQuoteText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-sm px-6 py-2.5 rounded-xl transition active:scale-95 shadow-md shadow-amber-500/10"
                    >
                      સુવિચાર સેવ કરો
                    </button>
                  </div>
                </form>
              </div>

              {/* View Custom Quotes List */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૨. તમારા ઉમેરેલા કસ્ટમ સુવિચારો</h3>
                
                {Object.values(customQuotes).every(arr => arr.length === 0) ? (
                  <p className="text-stone-400 font-gujarati text-xs text-center py-6">હજુ સુધી કોઈ કસ્ટમ સુવિચાર ઉમેરેલ નથી.</p>
                ) : (
                  <div className="space-y-6">
                    {Object.keys(customQuotes).map(catKey => {
                      const list = customQuotes[catKey] || [];
                      if (list.length === 0) return null;
                      return (
                        <div key={catKey} className="border-b border-stone-100 dark:border-stone-800 pb-4 last:border-0 last:pb-0">
                          <h4 className="font-gujarati font-bold text-xs text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-3">{catKey} કેટેગરી</h4>
                          <div className="space-y-3">
                            {list.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-4 bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-100 dark:border-stone-900">
                                <div className="font-gujarati text-xs">
                                  <p className="font-bold text-stone-800 dark:text-stone-200">"{item.text}"</p>
                                  <p className="text-stone-400 mt-1">— {item.source}</p>
                                </div>
                                <button 
                                  onClick={() => handleDeleteQuote(catKey, idx)}
                                  className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition active:scale-95"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 4: COMMUNITY MODERATION */}
          {activeTab === "moderator" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">કમ્યુનિટી પોસ્ટ અને રિપોર્ટ્સ કંટ્રોલ</h3>
                <span className="font-gujarati text-xs text-stone-500">યુઝર્સે ફ્લેગ કરેલી શંકાસ્પદ પોસ્ટ્સ</span>
              </div>

              {reportedPosts.length === 0 ? (
                <div className="bg-stone-50 dark:bg-stone-900 rounded-[2rem] p-12 text-center border border-stone-200/50 dark:border-stone-850">
                  <span className="material-symbols-outlined text-emerald-500 text-5xl mb-3">verified</span>
                  <p className="font-gujarati font-bold text-emerald-600">બધી પોસ્ટ્સ ક્લીન છે! કોઈ સક્રિય રિપોર્ટ નથી.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportedPosts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-950/20 shadow-sm">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-200">લેખક: {post.author}</h4>
                          <span className="text-[10px] text-stone-400 font-gujarati">{post.timestamp}</span>
                        </div>
                        <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full text-[10px] font-gujarati font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">report</span>
                          {post.reports} યુઝર્સે રિપોર્ટ કર્યો
                        </span>
                      </div>
                      
                      <p className="font-gujarati text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4 p-3 bg-stone-50 dark:bg-stone-950 rounded-xl">
                        {post.content}
                      </p>

                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleResolveReport(post.id, 'keep')}
                          className="px-4 py-2 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 rounded-xl text-xs font-gujarati font-bold transition active:scale-95"
                        >
                          રિપોર્ટ રદ કરો
                        </button>
                        <button 
                          onClick={() => handleResolveReport(post.id, 'delete')}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-gujarati font-bold transition active:scale-95 shadow-md shadow-rose-500/10"
                        >
                          પોસ્ટ ડીલીટ કરો
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PREMIUM SETTINGS & PROMO CODES */}
          {activeTab === "premium" && (
            <div className="space-y-8">
              
              {/* Add Promo Code Form */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૧. નવો પ્રોમો કોડ જનરેટ કરો</h3>
                <form onSubmit={handleAddPromo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">પ્રોમો કોડ (Promo Code Name)</label>
                      <input 
                        type="text"
                        placeholder="દા.ત. FESIV100"
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 font-gujarati text-sm uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">ડિસ્કાઉન્ટ ટકાવારી</label>
                      <select 
                        value={newPromoDiscount}
                        onChange={(e) => setNewPromoDiscount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-955 font-gujarati text-sm"
                      >
                        <option value="૧૦%">10% Discount</option>
                        <option value="૨૫%">25% Discount</option>
                        <option value="૫૦%">50% Discount</option>
                        <option value="૧૦૦% (FREE)">100% (FREE TRIAL)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold text-sm px-6 py-2.5 rounded-xl transition active:scale-95 shadow-md"
                    >
                      પ્રોમો કોડ એક્ટિવ કરો
                    </button>
                  </div>
                </form>
              </div>

              {/* Promo Code list */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">૨. એક્ટિવ પ્રોમો કોડ લિસ્ટ</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-gujarati text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400">
                        <th className="py-2 pb-3">કોડ</th>
                        <th className="py-2 pb-3">ડિસ્કાઉન્ટ</th>
                        <th className="py-2 pb-3">પ્રકાર</th>
                        <th className="py-2 pb-3">સ્ટેટસ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo, idx) => (
                        <tr key={idx} className="border-b border-stone-100 dark:border-stone-900 last:border-0">
                          <td className="py-3 font-bold text-amber-600">{promo.code}</td>
                          <td className="py-3">{promo.discount}</td>
                          <td className="py-3 text-stone-400">{promo.type}</td>
                          <td className="py-3">
                            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                              {promo.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB: FEED PUBLISHER */}
          {activeTab === "publisher" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">📢 પોસ્ટ પબ્લિશ કરો</h3>
                  <p className="font-gujarati text-xs text-stone-500 mt-1">લાઈવ બેઠક (ફીડ) માં નવી પોસ્ટ ઉમેરો</p>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <form onSubmit={handlePublishPost} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">પોસ્ટ કેટેગરી</label>
                      <select 
                        value={pubCategory}
                        onChange={(e) => setPubCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                      >
                        <option value="suvichar">સુવિચાર (Suvichar)</option>
                        <option value="bhakti">ભક્તિ (Bhakti)</option>
                        <option value="news">સમાચાર (News)</option>
                        <option value="janva_jevu">જાણવા જેવું (Facts)</option>
                        <option value="gk">સામાન્ય જ્ઞાન (GK)</option>
                        <option value="poll">પોલ (Poll)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">મીડિયા પ્રકાર</label>
                      <select 
                        value={pubMediaType}
                        onChange={(e) => setPubMediaType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                      >
                        <option value="text">ફક્ત લખાણ (Text Only)</option>
                        <option value="image">ફોટો લિંક (Image URL)</option>
                        <option value="video">યૂટ્યૂબ વિડીયો લિંક (YouTube Video)</option>
                        <option value="link">વેબ લિંક / PDF લિંક (Web Link)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">
                      {pubCategory === "poll" ? "પોલ પ્રશ્ન (Poll Question)" : "ગુજરાતી લખાણ (Gujarati Text)"}
                    </label>
                    <textarea 
                      rows="4"
                      required
                      placeholder="ગુજરાતીમાં પોસ્ટનું લખાણ અહીં ટાઇપ કરો..."
                      value={pubText}
                      onChange={(e) => setPubText(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>

                  {pubCategory === "poll" && (
                    <div className="space-y-3 animate-fade-in p-4 bg-[#fef8f1] dark:bg-stone-950 rounded-2xl border border-amber-100 dark:border-stone-850">
                      <label className="block text-xs font-gujarati font-bold text-amber-700 dark:text-amber-500 mb-1">પોલ વિકલ્પો (Poll Options)</label>
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input 
                            type="text"
                            required={index < 2}
                            placeholder={`વિકલ્પ ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const updated = [...pollOptions];
                              updated[index] = e.target.value;
                              setPollOptions(updated);
                            }}
                            className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                          />
                          {pollOptions.length > 2 && (
                            <button 
                              type="button" 
                              onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== index))}
                              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          )}
                        </div>
                      ))}
                      {pollOptions.length < 5 && (
                        <button 
                          type="button"
                          onClick={() => setPollOptions([...pollOptions, ""])}
                          className="text-xs font-gujarati font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span> વિકલ્પ ઉમેરો
                        </button>
                      )}
                    </div>
                  )}

                  {pubMediaType === "image" && (
                    <div className="space-y-4 animate-fade-in p-4 bg-[#fef8f1] dark:bg-stone-950 rounded-2xl border border-amber-100 dark:border-stone-850">
                      <label className="block text-xs font-gujarati font-bold text-amber-700 dark:text-amber-500 mb-1">
                        ફોટો અપલોડ કરો અથવા લિંક પેસ્ટ કરો
                      </label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setPubImageFile(e.target.files[0]);
                          } else {
                            setPubImageFile(null);
                          }
                        }}
                        className="w-full text-xs font-gujarati text-stone-600 dark:text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 cursor-pointer"
                      />
                      <div className="text-center font-gujarati text-[10px] text-stone-400 font-bold">અથવા (OR)</div>
                      <input 
                        type="url"
                        placeholder="લિંક અહીં પેસ્ટ કરો (https://...)"
                        value={pubUrl}
                        onChange={(e) => setPubUrl(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 font-sans text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {pubMediaType === "video" && (
                    <div className="space-y-4 animate-fade-in p-4 bg-[#fef8f1] dark:bg-stone-950 rounded-2xl border border-amber-100 dark:border-stone-850">
                      <label className="block text-xs font-gujarati font-bold text-amber-700 dark:text-amber-500 mb-1">
                        વિડીયો ફાઇલ અપલોડ કરો અથવા લિંક પેસ્ટ કરો
                      </label>
                      <input 
                        type="file"
                        accept="video/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setPubImageFile(e.target.files[0]);
                          } else {
                            setPubImageFile(null);
                          }
                        }}
                        className="w-full text-xs font-gujarati text-stone-600 dark:text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 cursor-pointer"
                      />
                      <div className="text-center font-gujarati text-[10px] text-stone-400 font-bold">અથવા (OR)</div>
                      <input 
                        type="url"
                        placeholder="યૂટ્યૂબ વિડીયો લિંક અહીં પેસ્ટ કરો (https://...)"
                        value={pubUrl}
                        onChange={(e) => setPubUrl(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 font-sans text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {pubMediaType === "link" && (
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">
                        વેબસાઈટ/PDF લિંક (URL)
                      </label>
                      <input 
                        type="url"
                        required
                        placeholder="https://..."
                        value={pubUrl}
                        onChange={(e) => setPubUrl(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-sans text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {pubMediaType === "link" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">લિંક ટાઇટલ (Link Title)</label>
                        <input 
                          type="text"
                          placeholder="દા.ત. વધુ વિગતવાર વાંચો"
                          value={pubLinkTitle}
                          onChange={(e) => setPubLinkTitle(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">ડોમેન નામ (Domain Name)</label>
                        <input 
                          type="text"
                          placeholder="દા.ત. gujarat.gov.in"
                          value={pubLinkDomain}
                          onChange={(e) => setPubLinkDomain(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-sans text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2 gap-3">
                    {editPostId && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditPostId(null);
                          setPubText("");
                          setPubUrl("");
                          setPubLinkTitle("");
                          setPubLinkDomain("");
                          setPubImageFile(null);
                          setPollOptions(["", ""]);
                        }}
                        className="px-6 py-2.5 border border-stone-300 rounded-xl font-gujarati font-bold text-sm hover:bg-stone-50 transition active:scale-95"
                      >
                        કેન્સલ
                      </button>
                    )}
                    <button 
                      type="submit"
                      disabled={publishing}
                      className="bg-[#ff9800] hover:bg-[#e68a00] disabled:bg-stone-400 text-white font-gujarati font-bold px-8 py-3 rounded-xl transition active:scale-95 shadow-md shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">{publishing ? "sync" : editPostId ? "save" : "send"}</span>
                      {publishing ? "પબ્લિશ થઈ રહ્યું છે..." : editPostId ? "પોસ્ટ અપડેટ કરો (Update)" : "પોસ્ટ પબ્લિશ કરો"}
                    </button>
                  </div>
                </form>
              </div>

              {/* COMMUNITY ALERT (JAHER KHABAR) MANAGEMENT */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm mt-6">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100 mb-2">📢 લાઈવ જાહેર ખબર (Community Alert)</h3>
                <p className="font-gujarati text-xs text-stone-500 mb-4">એપના હોમ પેજ પર નીચે દેખાતી પીળી પટ્ટી વાળી જાહેર ખબર અહીંથી બદલો</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">જાહેર ખબર લખાણ (Alert Text)</label>
                    <textarea 
                      rows="3"
                      placeholder="ગામમાં થનારા ફેરફાર, રસીકરણ કેમ્પ કે રક્તદાન કેમ્પની વિગત અહીં લખો..."
                      value={communityAlertText}
                      onChange={(e) => setCommunityAlertText(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-955 font-gujarati text-sm text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={saveCommunityAlert}
                      disabled={isAlertSaving}
                      className="bg-amber-500 hover:bg-amber-600 disabled:bg-stone-400 text-white font-gujarati font-bold px-6 py-2.5 rounded-xl transition active:scale-95 shadow-md shadow-orange-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">{isAlertSaving ? "sync" : "save"}</span>
                      {isAlertSaving ? "સેવ થઈ રહ્યું છે..." : "જાહેર ખબર સેવ કરો"}
                    </button>
                  </div>
                </div>
              </div>

              {/* POST LIST */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-gujarati font-black text-base text-stone-900 dark:text-stone-100">તમારી પબ્લિશ કરેલી પોસ્ટ્સ ({customPosts.length})</h3>
                  {loadingPosts && (
                    <span className="material-symbols-outlined text-amber-500 animate-spin">sync</span>
                  )}
                </div>

                {loadingPosts && customPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-stone-400 font-gujarati text-xs">
                    <span className="material-symbols-outlined text-amber-500 animate-spin text-3xl mb-2">sync</span>
                    <span>પોસ્ટ્સ લોડ થઈ રહી છે...</span>
                  </div>
                ) : customPosts.length === 0 ? (
                  <p className="text-stone-400 font-gujarati text-xs text-center py-6">હજુ સુધી કોઈ કસ્ટમ પોસ્ટ પબ્લિશ કરાઈ નથી.</p>
                ) : (
                  <div className="space-y-4">
                    {customPosts.map(post => {
                      let isPollPost = false;
                      let postDisplayContent = post.content.text;
                      if (postDisplayContent?.startsWith("POLL::")) {
                        isPollPost = true;
                        try {
                          postDisplayContent = JSON.parse(postDisplayContent.replace("POLL::", "")).question;
                        } catch (e) {}
                      }
                      
                      return (
                        <div key={post.id} className="bg-[#fef8f1]/50 dark:bg-stone-950 p-6 rounded-[2rem] border border-stone-150 dark:border-stone-900 flex flex-col md:flex-row gap-4 justify-between items-center text-center md:text-left">
                          <div className="flex-1 flex flex-col items-center md:items-start space-y-2 w-full">
                            <div className="flex gap-2">
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                {isPollPost ? "POLL" : post.categoryId}
                              </span>
                              <span className="bg-[#0d9488]/10 text-[#0d9488] dark:bg-[#0d9488]/20 dark:text-teal-400 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
                                {post.content.mediaType}
                              </span>
                            </div>
                            <p className="font-gujarati text-xs md:text-sm text-stone-800 dark:text-stone-200 font-bold leading-relaxed max-w-2xl">
                              {postDisplayContent}
                            </p>

                            {/* Analytics Section */}
                            <div className="flex flex-wrap gap-4 text-[11px] text-stone-500 dark:text-stone-400 font-gujarati mt-2 pt-2 border-t border-stone-200/40 dark:border-stone-800/40 w-full justify-center md:justify-start">
                              <span className="flex items-center gap-1 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
                                <span className="material-symbols-outlined text-[15px] text-stone-400">visibility</span>
                                <span>{post.views} વ્યુઝ</span>
                              </span>
                              <span className="flex items-center gap-1 hover:text-rose-600 transition-colors">
                                <span className="material-symbols-outlined text-[15px] text-rose-500">favorite</span>
                                <span>{post.likesCount} લાઇક્સ</span>
                              </span>
                              <span className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                <span className="material-symbols-outlined text-[15px] text-emerald-500">share</span>
                                <span>{post.sharesCount} શેર</span>
                              </span>
                              {post.reports > 0 && (
                                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold animate-pulse">
                                  <span className="material-symbols-outlined text-[15px]">report</span>
                                  <span>{post.reports} રિપોર્ટ્સ</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={() => handleEditPost(post)} 
                              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-gujarati font-bold transition active:scale-95 shadow-sm"
                            >
                              સુધારો
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)} 
                              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-gujarati font-bold transition active:scale-95 shadow-sm"
                            >
                              ડીલીટ
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: USER MANAGEMENT & ANALYTICS */}
          {activeTab === "users_management" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">👤 વપરાશકર્તા વ્યવસ્થાપન અને વિશ્લેષણ (User Management)</h3>
                  <p className="font-gujarati text-xs text-stone-500 mt-1">બધા સક્રિય અને નિષ્ક્રિય યુઝર્સની યાદી અને મૂળભૂત વિગતો</p>
                </div>
                <button 
                  onClick={fetchUsers}
                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 py-2 rounded-xl text-xs font-gujarati font-bold transition-all border border-stone-200/50 dark:border-stone-800"
                >
                  <span className="material-symbols-outlined text-xs">refresh</span>
                  રીફ્રેશ કરો
                </button>
              </div>

              {/* Loader */}
              {isLoadingUsers ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-gujarati text-xs text-stone-500">યુઝર્સ લોડ થઈ રહ્યા છે...</span>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-stone-905 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                      <span className="text-stone-400 font-gujarati text-xs">કુલ ઇન્સ્ટોલ (Total Installs)</span>
                      <span className="font-headline font-black text-2xl text-amber-500 mt-2">{users.length}</span>
                      <span className="text-[10px] text-stone-500 font-bold mt-1">નોંધાયેલા ઉપકરણો</span>
                    </div>
                    <div className="bg-white dark:bg-stone-905 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                      <span className="text-stone-400 font-gujarati text-xs">આજે એક્ટિવ યુઝર્સ</span>
                      <span className="font-headline font-black text-2xl text-emerald-600 mt-2">
                        {users.filter(u => u.last_active === new Date().toISOString().split('T')[0]).length}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold mt-1">છેલ્લા ૨૪ કલાકમાં</span>
                    </div>
                    <div className="bg-white dark:bg-stone-905 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                      <span className="text-stone-400 font-gujarati text-xs">નવા યુઝર્સ (છેલ્લા ૭ દિવસ)</span>
                      <span className="font-headline font-black text-2xl text-blue-600 mt-2">
                        {users.filter(u => {
                          const sevenDaysAgo = new Date();
                          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                          return new Date(u.created_at) >= sevenDaysAgo;
                        }).length}
                      </span>
                      <span className="text-[10px] text-blue-500 font-bold mt-1">નવા ઇન્સ્ટોલેશન્સ</span>
                    </div>
                    <div className="bg-white dark:bg-stone-905 p-5 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm flex flex-col justify-between">
                      <span className="text-stone-400 font-gujarati text-xs">નિષ્ક્રિય / અનઇન્સ્ટોલ (Est.)</span>
                      <span className="font-headline font-black text-2xl text-rose-500 mt-2">
                        {users.filter(u => {
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return !u.last_active || new Date(u.last_active) < thirtyDaysAgo;
                        }).length}
                      </span>
                      <span className="text-[10px] text-rose-500 font-bold mt-1">૩૦+ દિવસથી નિષ્ક્રિય</span>
                    </div>
                  </div>

                  {/* Filters Grid */}
                  <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200/50 dark:border-stone-850 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Field */}
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                      <input 
                        type="text" 
                        placeholder="નામ, મોબાઈલ, ઈમેલ અથવા શહેર શોધો..." 
                        value={usersSearch}
                        onChange={(e) => setUsersSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-gujarati outline-none focus:border-amber-500 transition-all text-stone-800 dark:text-stone-200"
                      />
                    </div>
                    
                    {/* City filter */}
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">location_city</span>
                      <input 
                        type="text" 
                        placeholder="શહેર/ગામ દ્વારા ફિલ્ટર..." 
                        value={userCityFilter}
                        onChange={(e) => setUserCityFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-gujarati outline-none focus:border-amber-500 transition-all text-stone-800 dark:text-stone-200"
                      />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                      <select 
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-gujarati outline-none focus:border-amber-500 transition-all text-stone-800 dark:text-stone-200"
                      >
                        <option value="all">બધા યુઝર્સ દર્શાવો</option>
                        <option value="active">સક્રિય યુઝર્સ (છેલ્લા ૩૦ દિવસમાં)</option>
                        <option value="inactive">નિષ્ક્રિય યુઝર્સ (૩૦+ દિવસથી)</option>
                        <option value="verified">ફક્ત વેરિફાઈડ (બ્લુ ટીક)</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/50 dark:border-stone-850 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="bg-stone-50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-900 text-stone-500 font-gujarati text-[10px] uppercase font-bold tracking-wider">
                            <th className="px-6 py-4">યુઝર</th>
                            <th className="px-6 py-4">સંપર્ક (Mobile/Email)</th>
                            <th className="px-6 py-4">પ્રોફાઇલ (જાતિ/જન્મ/શહેર)</th>
                            <th className="px-6 py-4 text-center">ગેમ્સ XP & Streak</th>
                            <th className="px-6 py-4">એક્ટિવિટી</th>
                            <th className="px-6 py-4 text-right">એક્શન</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-900 font-gujarati text-xs">
                          {getFilteredUsers().length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-12 text-stone-500 font-gujarati">
                                કોઈ યુઝર મળ્યા નથી.
                              </td>
                            </tr>
                          ) : (
                            getFilteredUsers().map((user) => {
                              const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : "યુ";
                              const isTodayActive = user.last_active === new Date().toISOString().split('T')[0];
                              const isVerified = !!user.verified_badge;
                              const isRepresentative = !!user.is_representative;
                              const regDate = user.created_at ? new Date(user.created_at).toLocaleDateString('gu-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : "નથી ઉપલબ્ધ";

                              return (
                                <tr key={user.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                                  {/* Avatar and Name */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                      {user.photo_url ? (
                                        <img 
                                          src={user.photo_url} 
                                          alt={user.name} 
                                          className="w-8 h-8 rounded-full object-cover border border-stone-200 dark:border-stone-850"
                                          onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                                          {initials}
                                        </div>
                                      )}
                                      <div>
                                        <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                                          {user.name || "અજ્ઞાત સાધક"}
                                          {isVerified && (
                                            <span className="material-symbols-outlined text-[14px] text-blue-500 font-bold fill-current">check_circle</span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-stone-400">ID: {user.id.slice(0, 8)}...</div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Contact */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-0.5 text-stone-700 dark:text-stone-300">
                                      <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-stone-400">call</span>
                                        {user.mobile || "મોબાઇલ નથી"}
                                      </div>
                                      <div className="flex items-center gap-1 text-[10px] text-stone-400">
                                        <span className="material-symbols-outlined text-[10px]">mail</span>
                                        {user.email || "ઈમેલ નથી"}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Profile Details */}
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-0.5 text-stone-600 dark:text-stone-400">
                                      <div>
                                        <span className="font-bold">જાતિ:</span> {user.gender === 'male' ? 'પુરુષ' : user.gender === 'female' ? 'સ્ત્રી' : user.gender || "નથી ભરેલ"}
                                      </div>
                                      <div className="text-[10px]">
                                        <span className="font-bold">જન્મ તારીખ:</span> {user.dob || "નથી ભરેલ"}
                                      </div>
                                      <div className="text-[10px] flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">location_on</span>
                                        {user.city || "શહેર નથી"}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Gamification Stats */}
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="inline-block text-left bg-stone-50 dark:bg-stone-950 p-2 rounded-xl border border-stone-100 dark:border-stone-900">
                                      <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                        🎮 English XP: <span className="font-bold text-amber-600">{user.english_xp || 0}</span>
                                      </div>
                                      <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                        🔥 English Streak: <span className="font-bold text-amber-600">{user.english_streak || 0}</span>
                                      </div>
                                      <div className="text-[10px] text-stone-600 dark:text-stone-400">
                                        📅 Challenge Streak: <span className="font-bold text-emerald-600">{user.streak_count || user.challenge_streak || 0}</span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Activity Times */}
                                  <td className="px-6 py-4 whitespace-nowrap text-stone-600 dark:text-stone-400">
                                    <div className="space-y-0.5">
                                      <div className="text-[10px]">
                                        <span className="font-bold">જોડાણ તારીખ:</span> {regDate}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isTodayActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300 dark:bg-stone-700'}`}></span>
                                        <span className="text-[10px]">
                                          <span className="font-bold">છેલ્લે સક્રિય:</span> {user.last_active || "નિષ્ક્રિય"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Actions */}
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex justify-end items-center gap-2">
                                      {/* Verified badge toggle */}
                                      <button 
                                        onClick={() => toggleUserVerification(user.id, isVerified)}
                                        disabled={isSavingUser === user.id}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-gujarati font-bold transition-all ${
                                          isVerified 
                                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' 
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200/50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[12px]">{isVerified ? 'verified' : 'new_releases'}</span>
                                        {isVerified ? 'વેરિફાઈડ દૂર કરો' : 'વેરિફાય કરો'}
                                      </button>

                                      {/* Representative toggle */}
                                      <button 
                                        onClick={() => toggleUserRepresentative(user.id, isRepresentative)}
                                        disabled={isSavingUser === user.id}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-gujarati font-bold transition-all ${
                                          isRepresentative 
                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200' 
                                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200/50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-[12px]">shield_person</span>
                                        {isRepresentative ? 'પ્રતિનિધિ હટાવો' : 'પ્રતિનિધિ બનાવો'}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: APP SECTION CONTROL */}
          {activeTab === "section_control" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">📱 એપ સેક્શન કંટ્રોલ (Dynamic Feature Flags)</h3>
                  <p className="font-gujarati text-xs text-stone-500 mt-1">લાઈવ યુઝર એપ અપડેટ કર્યા વગર સેક્શન કંટ્રોલ કરો</p>
                </div>
                <button 
                  onClick={fetchAdminFeatureFlags}
                  disabled={isFlagsLoading}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 rounded-xl text-xs font-gujarati font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm ${isFlagsLoading ? 'animate-spin' : ''}`}>sync</span> રીફ્રેશ કરો
                </button>
              </div>

              {isFlagsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200/50 dark:border-stone-850">
                  <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
                  <p className="font-gujarati text-sm text-stone-500">ડેટાબેઝમાંથી ફીચર કંટ્રોલ લોડ થઈ રહ્યું છે...</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm space-y-6">
                  
                  <div className="grid grid-cols-1 gap-4 divide-y divide-stone-100 dark:divide-stone-850">
                    {[
                      { key: 'panchang', label: 'પંચાંગ', desc: 'હોમપેજ કાળ ચોઘડિયા તથા મેનુ લિંક' },
                      { key: 'kundali', label: 'કુંડળી', desc: 'જન્મકુંડળી તથા ગ્રહ વિગતો' },
                      { key: 'kuldevi', label: 'કુળદેવી', desc: 'કુળદેવી સર્ચ તથા ઇતિહાસ' },
                      { key: 'vastu', label: 'વાસ્તુ', desc: 'વાસ્તુ શાસ્ત્ર ટિપ્સ અને કેલ્ક્યુલેટર' },
                      { key: 'interest_calculator', label: 'વ્યાજ ગણક', desc: 'ગણતરી ટૂલ્સ' },
                      { key: 'namkaran', label: 'નામકરણ', desc: 'બાળકના નામ શોધવા માટેનું ટૂલ' },
                      { key: 'health', label: 'સ્વાસ્થ્ય', desc: 'ડેઇલી હેલ્થ ટિપ્સ અને આસિસ્ટન્ટ' },
                      { key: 'tools', label: 'ટૂલ્સ લિસ્ટ', desc: 'ટૂલ્સ સેક્શનનું ડેશબોર્ડ લિસ્ટ' },
                      { key: 'card', label: 'BizCard', desc: 'બિઝનેસ કાર્ડ જનરેટર' },
                      { key: 'biodata', label: 'બાયોડેટા મેકર', desc: 'લગ્ન માટે બાયોડેટા બનાવવાનું ટૂલ' },
                      { key: 'devotional_cards', label: 'કાર્ડ (Devotional)', desc: 'તહેવાર/જન્મદિવસ શુભકામના કાર્ડ' },
                      { key: 'community', label: 'કોમ્યુનિટી ફીડ', desc: 'સ્થાનિક ઓટલો (પોસ્ટ અને ચેટ)' },
                      { key: 'swipe_cards', label: 'કાર્ડ્સ ગેમ', desc: 'ભક્તિ ક્વિઝ/સ્વાઇપ ગેમ' },
                      { key: 'gujarat_safari', label: 'ગુજરાત સફારી', desc: 'ગુજરાત ક્વિઝ અને પ્રવાસન' },
                      { key: 'passport', label: 'ટ્રાવελ પાસપોર્ટ', desc: 'મંદિરોનો પાસપોર્ટ' },
                      { key: 'mysteries', label: 'રહસ્યો', desc: 'મંદિરોના રહસ્યો' },
                      { key: 'devotional', label: 'ભક્તિ હબ', desc: 'આરતી, ચાલીસા અને ધૂન સંગ્રહ' },
                      { key: 'shradhanjali', label: 'શ્રદ્ધાંજલિ કાર્ડ', desc: 'શ્રદ્ધાંજલિ બેસણું કાર્ડ જનરેટર' },
                      { key: 'daily_challenge', label: 'ડેઇલી ચેલેન્જ', desc: 'શબ્દ રમત' },
                      { key: 'rewards', label: 'સરપ્રાઇઝ ઇનામો', desc: 'સ્ક્રેચ કાર્ડ્સ' },
                      { key: 'society', label: 'મારી સોસાયટી', desc: 'ડિરેક્ટરી' },
                      { key: 'games', label: 'રમતો (Games)', desc: 'રમતો' },
                      { key: 'english', label: 'ઇંગ્લિશ ઝોન', desc: 'અંગ્રેજી શીખો' }
                    ].map(feat => {
                      const currentStatus = adminFeatureFlags[feat.key] || 'live';
                      return (
                        <div key={feat.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-gujarati font-bold text-sm text-stone-850 dark:text-stone-150">{feat.label}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                currentStatus === 'live' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                  : currentStatus === 'coming_soon' 
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
                              }`}>
                                {currentStatus === 'live' ? 'લાઇવ' : currentStatus === 'coming_soon' ? 'Coming Soon' : 'બંધ'}
                              </span>
                            </div>
                            <p className="font-gujarati text-[11px] text-stone-400 mt-1">{feat.desc}</p>
                          </div>

                          <div className="flex items-center gap-1.5 self-start sm:self-auto">
                            {[
                              { status: 'live', label: 'લાઇવ', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
                              { status: 'coming_soon', label: 'Coming Soon', activeColor: 'bg-amber-500 text-white border-amber-500' },
                              { status: 'off', label: 'બંધ કરો', activeColor: 'bg-rose-600 text-white border-rose-600' }
                            ].map(btn => {
                              const isActive = currentStatus === btn.status;
                              const isSaving = flagsSavingKey === feat.key;
                              return (
                                <button
                                  key={btn.status}
                                  onClick={() => updateFeatureFlag(feat.key, btn.status)}
                                  disabled={isSaving}
                                  className={`px-3 py-1.5 border rounded-xl text-xs font-gujarati font-bold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 ${
                                    isActive ? btn.activeColor : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                                  }`}
                                >
                                  {isSaving && isActive ? 'સેવિંગ...' : btn.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* TAB 6: AI SETTINGS */}
      {/* TAB: MARKETING SCRATCH OFFERS */}
      {activeTab === "marketing_offers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
                🎁 સરપ્રાઇઝ ઇનામો અને લોકલ માર્કેટિંગ ઓફર્સ
              </h3>
              <p className="font-gujarati text-xs text-stone-500 mt-1">
                નવા સ્ક્રેચ કાર્ડ રિવોર્ડ્સ ઉમેરો અને જુઓ કે કયા લોકેશન પર કેટલા લોકો સ્ક્રેચ કરે છે.
              </p>
            </div>
            <button
              onClick={fetchOffersAndAnalytics}
              className="flex items-center gap-2 px-4 py-2 border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 rounded-xl font-gujarati text-xs font-bold"
            >
              <span className="material-symbols-outlined text-sm">refresh</span> રીફ્રેશ કરો
            </button>
          </div>

          {dbError ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] p-8 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 text-amber-500">
                <span className="material-symbols-outlined text-4xl">warning</span>
                <h2 className="font-gujarati font-black text-2xl">ડેટાબેઝ ટેબલ મળ્યા નથી!</h2>
              </div>
              <p className="font-gujarati text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                લોકલ માર્કેટિંગ ઓફર્સ અને સ્ક્રેચ કાર્ડ એનાલિટિક્સ શરૂ કરવા માટે તમારા Supabase કન્સોલના <strong>SQL Editor</strong> માં નીચેનો SQL કોડ રન કરો. કોડ રન કર્યા બાદ આ પેજને રીફ્રેશ કરો:
              </p>
              <div className="relative">
                <pre className="bg-stone-100 dark:bg-stone-950 p-6 rounded-2xl overflow-x-auto text-xs font-mono text-stone-800 dark:text-stone-200 select-all border border-stone-200 dark:border-stone-800">
{`-- 1. Create scratch_offers table
CREATE TABLE IF NOT EXISTS scratch_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  desc_text TEXT NOT NULL,
  code TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'all_gujarat', 'district', 'taluka', 'city_village'
  target_district TEXT,
  target_taluka TEXT,
  target_city_village TEXT,
  image_url TEXT,            -- optional marketing banner image URL
  sponsored_by TEXT,         -- Brand sponsor name
  sponsor_logo_url TEXT,     -- optional brand sponsor logo image URL
  reward_stage INT DEFAULT 0, -- 0: Normal, 10: 10-day, 20: 20-day, 30: 30-day
  how_to_redeem TEXT,        -- instructions on how to claim the reward
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create scratch_analytics table
CREATE TABLE IF NOT EXISTS scratch_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES scratch_offers(id) ON DELETE CASCADE,
  gender TEXT,
  district TEXT,
  taluka TEXT,
  city_village TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS Policies
ALTER TABLE scratch_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratch_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read scratch_offers" ON scratch_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public insert scratch_analytics" ON scratch_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all scratch_offers" ON scratch_offers FOR ALL USING (true);
CREATE POLICY "Allow admin all scratch_analytics" ON scratch_analytics FOR ALL USING (true);

-- 3. Migration Alter Queries (for existing tables)
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS sponsored_by TEXT DEFAULT NULL;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS reward_stage INT DEFAULT 0;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS how_to_redeem TEXT DEFAULT NULL;
ALTER TABLE scratch_offers ADD COLUMN IF NOT EXISTS sponsor_logo_url TEXT DEFAULT NULL;`}
                </pre>
              </div>
              <button 
                onClick={fetchOffersAndAnalytics}
                className="bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold px-6 py-3 rounded-xl transition active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">refresh</span> ફરીથી ચકાસો
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Quick stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 bg-amber-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-amber-500">
                    <span className="material-symbols-outlined text-2xl">card_giftcard</span>
                  </div>
                  <div>
                    <p className="font-gujarati text-[10px] text-stone-400">કુલ સક્રિય ઓફર્સ</p>
                    <h4 className="font-headline font-bold text-xl text-stone-900 dark:text-stone-100">{offers.filter(o => o.is_active).length} Campaigns</h4>
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 bg-teal-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-teal-500">
                    <span className="material-symbols-outlined text-2xl">ads_click</span>
                  </div>
                  <div>
                    <p className="font-gujarati text-[10px] text-stone-400">કુલ વખત સ્ક્રૅચ થયું (Impressions)</p>
                    <h4 className="font-headline font-bold text-xl text-stone-900 dark:text-stone-100">{analytics.length} Scratches</h4>
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-blue-500">
                    <span className="material-symbols-outlined text-2xl">travel_explore</span>
                  </div>
                  <div>
                    <p className="font-gujarati text-[10px] text-stone-400">ટાર્ગેટિંગ લોકેશન સ્કોપ</p>
                    <h4 className="font-headline font-bold text-xl text-stone-900 dark:text-stone-100">Jilla, Taluka, Gam</h4>
                  </div>
                </div>
              </div>

              {/* CRUD Offers List and Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form to Add Offer */}
                <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm space-y-4">
                  <h4 className="font-gujarati font-black text-lg text-stone-900 dark:text-stone-100">🆕 નવી લોકલ ઓફર ઉમેરો</h4>
                  <form onSubmit={handleAddOffer} className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">બિઝનેસ/ઓફર નામ *</label>
                      <input
                        type="text"
                        placeholder="દા.ત. ૨૦% છૂટ - ગીર સફારી રિસોર્ટ"
                        value={offerForm.name}
                        onChange={e => setOfferForm({ ...offerForm, name: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">ટૂંકું વર્ણન (Description) *</label>
                      <input
                        type="text"
                        placeholder="દા.ત. રિસોર્ટ બુકિંગ પર ખાસ વળતર 🏨"
                        value={offerForm.desc_text}
                        onChange={e => setOfferForm({ ...offerForm, desc_text: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">કૂપન કોડ (Coupon Code) *</label>
                      <input
                        type="text"
                        placeholder="દા.ત. GIRSARI20"
                        value={offerForm.code}
                        onChange={e => setOfferForm({ ...offerForm, code: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-mono text-sm tracking-widest uppercase font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">ઓફર બેનર / ફોટો (વૈકલ્પિક - Optional)</label>
                      <input
                        key={offerImageFile ? 'active' : 'empty'}
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setOfferImageFile(e.target.files[0]);
                          } else {
                            setOfferImageFile(null);
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-xs text-stone-800 dark:text-stone-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">સ્પોન્સર બ્રાન્ડનું નામ (Sponsored By - વૈકલ્પિક)</label>
                      <input
                        type="text"
                        placeholder="દા.ત. Cafe Honest, PVR Cinemas..."
                        value={offerForm.sponsored_by}
                        onChange={e => setOfferForm({ ...offerForm, sponsored_by: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">સ્પોન્સર બ્રાન્ડ લોગો (Sponsored Logo - વૈકલ્પિક)</label>
                      <input
                        key={sponsorLogoFile ? 'active' : 'empty'}
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setSponsorLogoFile(e.target.files[0]);
                          } else {
                            setSponsorLogoFile(null);
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-xs text-stone-800 dark:text-stone-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 dark:file:bg-amber-950/40 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">કેવી રીતે રિડીમ કરવું? (Redeem Instructions)</label>
                      <textarea
                        placeholder="દા.ત. તમારા નજીકના Cafe Honest આઉટલેટ પર બિલિંગ સમયે આ સ્ક્રીન અને કૂપન કોડ બતાવો."
                        value={offerForm.how_to_redeem}
                        onChange={e => setOfferForm({ ...offerForm, how_to_redeem: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm h-20 resize-none"
                      />
                    </div>

                    {/* Streak Stage selection hidden to keep rewards random and risk-free */}

                    <div className="space-y-1">
                      <label className="font-gujarati text-xs font-bold text-stone-500">ટાર્ગેટ સ્કોપ (Scope) *</label>
                      <select
                        value={offerForm.target_type}
                        onChange={e => setOfferForm({ ...offerForm, target_type: e.target.value, target_district: "", target_taluka: "", target_city_village: "" })}
                        className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                      >
                        <option value="all_gujarat">સમગ્ર ગુજરાત (All Gujarat)</option>
                        <option value="district">ચોક્કસ જિલ્લો (Jilla Specific)</option>
                        <option value="taluka">ચોક્કસ તાલુકો (Taluka Specific)</option>
                        <option value="city_village">ચોક્કસ શહેર / ગામ (City/Gam Specific)</option>
                      </select>
                    </div>

                    {/* District Selector (if district or taluka chosen) */}
                    {(offerForm.target_type === 'district' || offerForm.target_type === 'taluka') && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="font-gujarati text-xs font-bold text-stone-500">જિલ્લો પસંદ કરો *</label>
                        <select
                          value={offerForm.target_district}
                          onChange={e => setOfferForm({ ...offerForm, target_district: e.target.value, target_taluka: "" })}
                          className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                          required
                        >
                          <option value="">જિલ્લો પસંદ કરો</option>
                          {DISTRICTS.map(d => (
                            <option key={d.id} value={d.id}>{d.name_gu} ({d.name_en})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Taluka Selector (if taluka chosen) */}
                    {offerForm.target_type === 'taluka' && offerForm.target_district && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="font-gujarati text-xs font-bold text-stone-500">તાલુકો પસંદ કરો *</label>
                        <select
                          value={offerForm.target_taluka}
                          onChange={e => setOfferForm({ ...offerForm, target_taluka: e.target.value })}
                          className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                          required
                        >
                          <option value="">તાલુકો પસંદ કરો</option>
                          {(TALUKAS[offerForm.target_district] || []).map(t => (
                            <option key={t.id} value={t.id}>{t.name_gu} ({t.name_en})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* City/Village Input (if city_village chosen) */}
                    {offerForm.target_type === 'city_village' && (
                      <div className="space-y-1 animate-fade-in">
                        <label className="font-gujarati text-xs font-bold text-stone-500">શહેર / ગામનું નામ (ગુજરાતીમાં) *</label>
                        <input
                          type="text"
                          placeholder="દા.ત. જામનગર, પાટણ, ખોરજ..."
                          value={offerForm.target_city_village}
                          onChange={e => setOfferForm({ ...offerForm, target_city_village: e.target.value })}
                          className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none focus:border-amber-500 font-gujarati text-sm"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submittingOffer}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-gujarati font-bold p-3.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
                    >
                      {submittingOffer ? "ઉમેરાઈ રહ્યું છે..." : "💾 ઓફર ઉમેરો"}
                    </button>
                  </form>
                </div>

                {/* List of Offers */}
                <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm space-y-4">
                  <h4 className="font-gujarati font-black text-lg text-stone-900 dark:text-stone-100">📋 હાલની માર્કેટિંગ કેમ્પેઈન યાદી</h4>
                  
                  {loadingOffers ? (
                    <p className="font-gujarati text-sm text-stone-400 py-12 text-center">ઓફર્સ લોડ થઈ રહી છે...</p>
                  ) : offers.length === 0 ? (
                    <div className="text-center py-16 text-stone-400 space-y-2">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                      <p className="font-gujarati text-sm">કોઈ ઓફર મળી નથી. નવી લોન્ચ કરો!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-gujarati text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 text-[10px] uppercase tracking-wider">
                            <th className="pb-3 font-bold">ઓફર નામ અને કૂપન</th>
                            <th className="pb-3 font-bold">ટાર્ગેટિંગ Scope</th>
                            <th className="pb-3 font-bold text-center">સ્ટેટસ</th>
                            <th className="pb-3 font-bold text-center">ઍક્શન</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 dark:divide-stone-900">
                          {offers.map(off => {
                            let targetLabel = "સમગ્ર ગુજરાત";
                            if (off.target_type === 'district') {
                              targetLabel = `📍 જિલ્લો: ${getDistrictName(off.target_district) || off.target_district}`;
                            } else if (off.target_type === 'taluka') {
                              targetLabel = `📍 તાલ: ${getTalukaName(off.target_district, off.target_taluka) || off.target_taluka} (${getDistrictName(off.target_district) || off.target_district})`;
                            } else if (off.target_type === 'city_village') {
                              targetLabel = `📍 ગામ: ${off.target_city_village}`;
                            }

                            return (
                              <tr key={off.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/10">
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    {off.image_url && (
                                      <img 
                                        src={off.image_url} 
                                        alt={off.name} 
                                        className="h-10 w-10 object-contain rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 shrink-0" 
                                      />
                                    )}
                                    <div>
                                      <p className="font-bold text-stone-850 dark:text-stone-200">
                                        {off.name}
                                        {off.reward_stage > 0 && (
                                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold text-[9px] inline-flex items-center gap-0.5">
                                            🏆 {off.reward_stage}-ડે સ્ટ્રીક
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[10px] text-stone-400 mt-0.5 font-mono tracking-wider flex items-center gap-1.5 flex-wrap">
                                        <span>CODE: <span className="text-amber-600 font-bold">{off.code}</span></span>
                                        {off.sponsored_by && (
                                          <span className="text-stone-500 font-bold inline-flex items-center gap-1">
                                            🤝 સ્પોન્સર: 
                                            {off.sponsor_logo_url && (
                                              <img src={off.sponsor_logo_url} alt="sponsor logo" className="h-4 w-4 rounded-full object-contain bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shrink-0" />
                                            )}
                                            {off.sponsored_by}
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 text-stone-600 dark:text-stone-400">
                                  {targetLabel}
                                </td>
                                <td className="py-4 text-center">
                                  <button
                                    onClick={() => handleToggleOfferActive(off.id, off.is_active)}
                                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] active:scale-90 transition ${
                                      off.is_active 
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                                        : 'bg-rose-500/10 text-rose-500 dark:bg-rose-950/20 dark:text-rose-400'
                                    }`}
                                  >
                                    {off.is_active ? "ચાલુ" : "બંધ"}
                                  </button>
                                </td>
                                <td className="py-4 text-center">
                                  <button
                                    onClick={() => handleDeleteOffer(off.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition active:scale-90"
                                    title="ડીલીટ"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Analytics Report Dashboard */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-850 pb-4">
                  <div>
                    <h4 className="font-gujarati font-black text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 font-bold">insights</span> 📊 સ્ક્રૅચ કાર્ડ વિગતવાર એનાલિટિક્સ રીપોર્ટ
                    </h4>
                    <p className="font-gujarati text-[11px] text-stone-400 mt-1">
                      યુઝર્સની વસ્તીવિષયક (Demographics) અને લોકેશન પ્રવૃત્તિ ટ્રેક કરો.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedAnalyticsOffer}
                      onChange={e => setSelectedAnalyticsOffer(e.target.value)}
                      className="p-2 border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none rounded-xl font-gujarati text-xs"
                    >
                      <option value="all">બધા કેમ્પેઈન (All Offers)</option>
                      {offers.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>

                    <select
                      value={analyticsPeriod}
                      onChange={e => setAnalyticsPeriod(e.target.value)}
                      className="p-2 border border-stone-200 dark:border-stone-800 bg-[#F5EEDC]/10 dark:bg-stone-950 outline-none rounded-xl font-gujarati text-xs"
                    >
                      <option value="daily">દૈનિક (Daily)</option>
                      <option value="weekly">સાપ્તાહિક (Weekly)</option>
                      <option value="monthly">માસિક (Monthly)</option>
                      <option value="yearly">વાર્ષિક (Yearly)</option>
                    </select>
                  </div>
                </div>

                {/* Dashboard Metrics Charts */}
                {analytics.length === 0 ? (
                  <div className="text-center py-20 text-stone-400 space-y-2">
                    <span className="material-symbols-outlined text-5xl">analytics</span>
                    <p className="font-gujarati text-sm">હજુ સુધી કોઈ એનાલિટિક્સ ડેટા ઉપલબ્ધ નથી.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Gender & Time Demographics */}
                    <div className="space-y-6">
                      {/* Gender Breakdown */}
                      <div className="bg-stone-50 dark:bg-stone-950/20 p-5 rounded-2xl space-y-4">
                        <h5 className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">person</span> સ્ત્રી / પુરુષ વર્ગીકરણ (Gender Demographic)
                        </h5>
                        {(() => {
                          const total = analytics.filter(a => selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer).length;
                          const male = analytics.filter(a => (selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer) && a.gender === 'male').length;
                          const female = analytics.filter(a => (selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer) && a.gender === 'female').length;
                          const other = total - male - female;
                          
                          const malePct = total > 0 ? Math.round((male / total) * 100) : 0;
                          const femalePct = total > 0 ? Math.round((female / total) * 100) : 0;
                          const otherPct = total > 0 ? Math.round((other / total) * 100) : 0;

                          return (
                            <div className="space-y-3 font-gujarati text-xs">
                              {/* Progress Bars */}
                              <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-600 dark:text-stone-400">
                                  <span>પુરુષ (Male)</span>
                                  <span>{male} scratches ({malePct}%)</span>
                                </div>
                                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${malePct}%` }}></div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-600 dark:text-stone-400">
                                  <span>સ્ત્રી (Female)</span>
                                  <span>{female} scratches ({femalePct}%)</span>
                                </div>
                                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${femalePct}%` }}></div>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between font-bold text-stone-600 dark:text-stone-400">
                                  <span>અન્ય (Other/Anonymous)</span>
                                  <span>{other} scratches ({otherPct}%)</span>
                                </div>
                                <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${otherPct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Time-of-Day analysis */}
                      <div className="bg-stone-50 dark:bg-stone-950/20 p-5 rounded-2xl space-y-4">
                        <h5 className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span> દૈનિક સક્રિય સમયગાળો (Peak Hours of Day)
                        </h5>
                        {(() => {
                          const active = analytics.filter(a => selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer);
                          const total = active.length;
                          const morning = active.filter(a => { const h = new Date(a.created_at).getHours(); return h >= 6 && h < 12; }).length;
                          const afternoon = active.filter(a => { const h = new Date(a.created_at).getHours(); return h >= 12 && h < 17; }).length;
                          const evening = active.filter(a => { const h = new Date(a.created_at).getHours(); return h >= 17 && h < 21; }).length;
                          const night = total - morning - afternoon - evening;

                          const mPct = total > 0 ? Math.round((morning / total) * 100) : 0;
                          const aPct = total > 0 ? Math.round((afternoon / total) * 100) : 0;
                          const ePct = total > 0 ? Math.round((evening / total) * 100) : 0;
                          const nPct = total > 0 ? Math.round((night / total) * 100) : 0;

                          return (
                            <div className="grid grid-cols-2 gap-4 font-gujarati text-xs">
                              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-850">
                                <p className="text-stone-400">🌅 સવાર (6 AM - 12 PM)</p>
                                <p className="text-base font-headline font-black mt-1 text-amber-500">{morning} ({mPct}%)</p>
                              </div>
                              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-850">
                                <p className="text-stone-400">☀️ બપોર (12 PM - 5 PM)</p>
                                <p className="text-base font-headline font-black mt-1 text-teal-600">{afternoon} ({aPct}%)</p>
                              </div>
                              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-850">
                                <p className="text-stone-400">🌆 સાંજ (5 PM - 9 PM)</p>
                                <p className="text-base font-headline font-black mt-1 text-indigo-500">{evening} ({ePct}%)</p>
                              </div>
                              <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-850">
                                <p className="text-stone-400">🌃 રાત્રિ (9 PM - 6 AM)</p>
                                <p className="text-base font-headline font-black mt-1 text-purple-600">{night} ({nPct}%)</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Column 2: Location Demographics & Reports */}
                    <div className="space-y-6">
                      {/* Top Locations Rankings */}
                      <div className="bg-stone-50 dark:bg-stone-950/20 p-5 rounded-2xl space-y-4">
                        <h5 className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">location_on</span> ટોપ સક્રિય લોકેશન્સ (Top Scratch Locations)
                        </h5>
                        {(() => {
                          const active = analytics.filter(a => selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer);
                          const districtCounts = {};
                          const cityCounts = {};
                          
                          active.forEach(a => {
                            if (a.district) {
                              const name = getDistrictName(a.district) || a.district;
                              districtCounts[name] = (districtCounts[name] || 0) + 1;
                            }
                            if (a.city_village && a.city_village !== 'unknown') {
                              cityCounts[a.city_village] = (cityCounts[a.city_village] || 0) + 1;
                            }
                          });

                          const sortedDist = Object.entries(districtCounts).sort((a,b) => b[1] - a[1]).slice(0, 3);
                          const sortedCity = Object.entries(cityCounts).sort((a,b) => b[1] - a[1]).slice(0, 3);

                          return (
                            <div className="grid grid-cols-2 gap-4 font-gujarati text-xs">
                              {/* District Column */}
                              <div className="space-y-2">
                                <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">જિલ્લાઓ (Districts)</p>
                                {sortedDist.length === 0 ? (
                                  <p className="text-stone-400 italic text-[11px]">ડેટા નથી</p>
                                ) : (
                                  <ol className="space-y-1.5 list-decimal list-inside font-bold text-stone-750 dark:text-stone-300">
                                    {sortedDist.map(([dName, count], idx) => (
                                      <li key={idx} className="truncate">{dName} <span className="text-[10px] text-teal-600 font-normal">({count} scratches)</span></li>
                                    ))}
                                  </ol>
                                )}
                              </div>

                              {/* City/Village Column */}
                              <div className="space-y-2">
                                <p className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">ગામ/શહેર (Cities/Gams)</p>
                                {sortedCity.length === 0 ? (
                                  <p className="text-stone-400 italic text-[11px]">ડેટા નથી</p>
                                ) : (
                                  <ol className="space-y-1.5 list-decimal list-inside font-bold text-stone-750 dark:text-stone-300">
                                    {sortedCity.map(([cName, count], idx) => (
                                      <li key={idx} className="truncate">{cName} <span className="text-[10px] text-teal-600 font-normal">({count} scratches)</span></li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Day of Week Breakdown */}
                      <div className="bg-stone-50 dark:bg-stone-950/20 p-5 rounded-2xl space-y-4">
                        <h5 className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_view_week</span> અઠવાડિયાના દિવસોનું એનાલિસિસ (Peak Days of Week)
                        </h5>
                        {(() => {
                          const active = analytics.filter(a => selectedAnalyticsOffer === 'all' || a.offer_id === selectedAnalyticsOffer);
                          const dayMap = ["રવિ", "સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ"];
                          const daysCount = [0, 0, 0, 0, 0, 0, 0];
                          active.forEach(a => {
                            const d = new Date(a.created_at).getDay();
                            daysCount[d]++;
                          });
                          const maxDay = Math.max(...daysCount);

                          return (
                            <div className="flex items-end justify-between gap-1 pt-4 h-24">
                              {daysCount.map((count, idx) => {
                                const hPct = maxDay > 0 ? (count / maxDay) * 80 : 0;
                                return (
                                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    <div className="bg-amber-400 dark:bg-amber-600 hover:bg-amber-500 w-full rounded-t transition-all duration-300" style={{ height: `${hPct + 4}px` }}>
                                      {/* Tooltip */}
                                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-stone-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none font-bold">
                                        {count} Scratches
                                      </span>
                                    </div>
                                    <span className="font-gujarati text-[9px] text-stone-500 font-bold mt-1">{dayMap[idx]}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reporting Log Table */}
                {analytics.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-850">
                    <h5 className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300">
                      📊 સેગમેન્ટેડ રિપોર્ટ ડેટા
                    </h5>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-gujarati text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 text-[10px] uppercase">
                            <th className="pb-3 font-bold">સમયગાળો (Period)</th>
                            <th className="pb-3 font-bold text-center">કુલ સ્ક્રેચ</th>
                            <th className="pb-3 font-bold text-center">પુરુષ</th>
                            <th className="pb-3 font-bold text-center">સ્ત્રી</th>
                            <th className="pb-3 font-bold">મુખ્ય પ્રવૃત્તિ વિસ્તાર</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50 dark:divide-stone-900">
                          {getPeriodStats().map((row, idx) => (
                            <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/10">
                              <td className="py-3 font-bold text-stone-850 dark:text-stone-200">{row.period}</td>
                              <td className="py-3 text-center font-headline font-bold">{row.total}</td>
                              <td className="py-3 text-center text-blue-600 font-bold">{row.male}</td>
                              <td className="py-3 text-center text-pink-500 font-bold">{row.female}</td>
                              <td className="py-3 text-stone-600 dark:text-stone-400 font-semibold">{row.topLoc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "ai" && (
        <div className="space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                🤖 AI Model Configuration
              </h3>
              <p className="font-gujarati text-xs text-stone-500 mt-1">દાદી-મા Chatbot માટે AI Provider અને API Key સેટ કરો.</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-gujarati font-bold ${
              aiConfig.enabled && aiConfig.provider
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-500'
            }`}>
              <span className={`h-2 w-2 rounded-full ${aiConfig.enabled && aiConfig.provider ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`}></span>
              {aiConfig.enabled && aiConfig.provider ? '🟢 Active' : '🔴 Not Configured'}
            </div>
          </div>

          {/* Provider Cards Grid */}
          <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
            <h4 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 mb-4">1. AI Provider પસંદ કરો</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {AI_PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => setAiConfig(prev => ({ ...prev, provider: provider.id, model: provider.models[0].id, baseUrl: provider.baseUrl || '' }))}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    aiConfig.provider === provider.id
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{provider.emoji}</div>
                  <p className="font-headline font-bold text-xs text-stone-800 dark:text-stone-200 leading-tight">{provider.name}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded font-gujarati ${
                    provider.tagColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                    provider.tagColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                    provider.tagColor === 'orange' ? 'bg-orange-100 text-orange-700' :
                    provider.tagColor === 'purple' ? 'bg-purple-100 text-purple-700' :
                    'bg-stone-100 text-stone-600'
                  }`}>{provider.tag}</span>
                  <p className="font-gujarati text-[10px] text-stone-400 mt-1">{provider.costNote}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model + Config */}
          {selectedProvider && (
            <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm space-y-4">
              <h4 className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300">2. Model અને Configuration</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model Selector */}
                <div>
                  <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">AI Model</label>
                  <select
                    value={aiConfig.model}
                    onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                  >
                    {selectedProvider.models.map(m => (
                      <option key={m.id} value={m.id}>{m.name}{m.recommended ? ' ⭐' : ''}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Model ID (for custom provider) */}
                {aiConfig.provider === 'custom' && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">Custom Model ID</label>
                    <input
                      type="text"
                      value={aiConfig.model}
                      onChange={e => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                      placeholder="e.g. llama3, gpt-4o-mini"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm"
                    />
                  </div>
                )}

                {/* API Key */}
                {selectedProvider.requiresApiKey && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1 flex items-center justify-between">
                      API Key
                      {selectedProvider.apiKeyUrl && (
                        <a href={selectedProvider.apiKeyUrl} target="_blank" rel="noreferrer" className="text-violet-500 hover:underline">
                          ← Key મળો
                        </a>
                      )}
                    </label>
                    <input
                      type="password"
                      value={aiConfig.apiKey || ''}
                      onChange={e => setAiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Paste your API key here..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm font-mono"
                    />
                  </div>
                )}

                {/* Base URL (Ollama / Custom) */}
                {(aiConfig.provider === 'ollama' || aiConfig.provider === 'custom') && (
                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">Base URL</label>
                    <input
                      type="text"
                      value={aiConfig.baseUrl || ''}
                      onChange={e => setAiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder={aiConfig.provider === 'ollama' ? 'http://localhost:11434' : 'https://your-api.com/v1'}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 font-gujarati text-sm font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                <div>
                  <p className="font-gujarati font-bold text-sm text-stone-800 dark:text-stone-200">AI Fallback ચાલુ/બંધ</p>
                  <p className="font-gujarati text-xs text-stone-400">Local DB માં ન મળ્યો તો AI ને call કરે</p>
                </div>
                <button
                  onClick={() => setAiConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    aiConfig.enabled ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <span className={`absolute top-1 h-5 w-5 bg-white rounded-full shadow transition-all ${
                    aiConfig.enabled ? 'right-1' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* Test + Save Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={async () => {
                    setAiTesting(true);
                    setAiTestResult(null);
                    const result = await testAIConnection(aiConfig);
                    setAiTestResult(result);
                    setAiTesting(false);
                  }}
                  disabled={aiTesting}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-violet-500 text-violet-600 dark:text-violet-400 font-gujarati font-bold text-sm rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20 transition active:scale-95 disabled:opacity-50"
                >
                  {aiTesting ? (
                    <><span className="animate-spin material-symbols-outlined text-sm">sync</span> ટેસ્ટ ચાલુ...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">wifi</span> Connection ટેસ્ટ કરો</>
                  )}
                </button>

                <button
                  onClick={() => {
                    saveAIConfig(aiConfig);
                    setAiSaved(true);
                    setTimeout(() => setAiSaved(false), 3000);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-gujarati font-bold text-sm rounded-xl shadow-md shadow-violet-500/20 transition active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {aiSaved ? '✅ સેવ થઈ ગયું!' : 'સેટિંગ સેવ કરો'}
                </button>
              </div>

              {/* Test Result */}
              {aiTestResult && (
                <div className={`p-4 rounded-2xl border font-gujarati text-sm ${
                  aiTestResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-700'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-700'
                }`}>
                  {aiTestResult.success ? (
                    <div>
                      <p className="font-bold">✅ Connection Successful! AI ready.</p>
                      <p className="text-xs mt-1 opacity-80">Response: {aiTestResult.response?.slice(0, 120)}...</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold">❌ Connection Failed</p>
                      <p className="text-xs mt-1 font-mono opacity-80">{aiTestResult.error}</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-emerald-700">⚡ Free Options</p>
              <p className="font-gujarati text-xs text-emerald-600 mt-1">Gemini Flash, Groq, OpenRouter free models — zero cost AI!</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-blue-700">🏠 Ollama (Local)</p>
              <p className="font-gujarati text-xs text-blue-600 mt-1">PC પર install કરો — 100% free, private, no internet needed!</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-2xl">
              <p className="font-headline font-bold text-sm text-amber-700">📚 Hybrid Mode</p>
              <p className="font-gujarati text-xs text-amber-600 mt-1">200+ DB answers = free. AI only for unknown questions = minimal cost!</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
