import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareButton from './ShareButton';
import { 
  DISTRICTS, 
  TALUKAS, 
  setDynamicVillages,
  getDistrictName, 
  getTalukaName, 
  getVillageName 
} from '../utils/location_database';
import {
  POST_TYPES,
  VISIBILITIES,
  getOtloLocation,
  saveOtloLocation,
  deleteOtloLocation,
  getOtloPosts,
  createOtloPost,
  likeOtloPost,
  addOtloComment,
  getFollowedLocations,
  followLocation,
  unfollowLocation,
  getUserRepData,
  getLeaderboard,
  getDirectoryListings,
  createDirectoryListing,
  getRelativeTimeString,
  addReferral
} from '../utils/otlo_helper';

const SIMULATED_IMAGES = [
  "https://images.unsplash.com/photo-1566378246598-5b11a0ff7f6c?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1532186651327-6ac23687d189?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800"
];

const Community = () => {
  const navigate = useNavigate();
  
  // Dynamic villages database state
  const [allVillages, setAllVillages] = useState(null);
  const [villagesLoading, setVillagesLoading] = useState(true);
  
  // Location setup state
  const [userLocation, setUserLocation] = useState(() => getOtloLocation());
  const [districtId, setDistrictId] = useState("");
  const [talukaId, setTalukaId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [ward, setWard] = useState("");
  const [isCustomVillage, setIsCustomVillage] = useState(false);

  // Load villages.json asynchronously on mount
  useEffect(() => {
    fetch('/villages.json')
      .then(res => res.json())
      .then(data => {
        setAllVillages(data);
        setDynamicVillages(data); // Provide data to synchronous helpers
        setVillagesLoading(false);
      })
      .catch(err => {
        console.error("Error loading villages list:", err);
        setVillagesLoading(false);
      });
  }, []);
  const [customVillageName, setCustomVillageName] = useState("");
  
  // GPS State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState("feed");
  const [feedFilter, setFeedFilter] = useState("all");
  const [followedLocations, setFollowedLocations] = useState(() => getFollowedLocations());
  
  // DB States
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [directoryListings, setDirectoryListings] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [repData, setRepData] = useState({});
  
  // Modal / Sheet States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCommentsPostId, setShowCommentsPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  
  // Post Creation States
  const [newPostText, setNewPostText] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("news");
  const [newPostVisibility, setNewPostVisibility] = useState("village");
  const [newPostMediaUrl, setNewPostMediaUrl] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  
  // Directory States
  const [directorySearch, setDirectorySearch] = useState("");
  const [showAddListing, setShowAddListing] = useState(false);
  const [newListingName, setNewListingName] = useState("");
  const [newListingCategory, setNewListingCategory] = useState("કરિયાણું");
  const [newListingPhone, setNewListingPhone] = useState("");
  const [newListingAddress, setNewListingAddress] = useState("");

  // Load data on state updates
  useEffect(() => {
    const loadData = async () => {
      if (userLocation) {
        try {
          const postsData = await getOtloPosts(feedFilter);
          setPosts(postsData);
        } catch (err) {
          console.error("Error loading posts from Supabase:", err);
        }
        setDirectoryListings(getDirectoryListings());
        setLeaderboard(getLeaderboard());
        setRepData(getUserRepData());
      }
    };
    loadData();
  }, [userLocation, feedFilter]);

  const reloadFollowed = () => {
    setFollowedLocations(getFollowedLocations());
  };
  
  const triggerToast = (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
  };

  // Handle manual saving user location
  const handleSaveLocation = (e) => {
    e?.preventDefault();
    if (!districtId || !talukaId || (!villageId && !isCustomVillage) || (isCustomVillage && !customVillageName.trim())) {
      alert("કૃપા કરીને બધી જ તારાંકિત (*) વિગતો ભરો.");
      return;
    }
    
    const finalVillageId = isCustomVillage ? customVillageName.trim() : villageId;
    
    let villageNameGu = finalVillageId;
    let villageNameEn = finalVillageId;
    
    if (talukaId === "district_city") {
      const dNameGu = getDistrictName(districtId);
      const dNameEn = DISTRICTS.find(d => d.id === districtId)?.name_en || "";
      villageNameGu = `${dNameGu} સિટી`;
      villageNameEn = `${dNameEn} City`;
    } else if (villageId === "taluka_city") {
      const tNameGu = getTalukaName(districtId, talukaId);
      const tNameEn = (TALUKAS[districtId] || []).find(t => t.id === talukaId)?.name_en || "";
      villageNameGu = `${tNameGu} ટાઉન`;
      villageNameEn = `${tNameEn} Town`;
    } else if (!isCustomVillage && allVillages && allVillages[talukaId]) {
      const matchedVil = allVillages[talukaId].find(v => v.id === villageId);
      if (matchedVil) {
        villageNameGu = matchedVil.name_gu;
        villageNameEn = matchedVil.name_en;
      }
    }
    
    const locObj = {
      districtId,
      talukaId,
      villageId: finalVillageId,
      villageNameGu,
      villageNameEn,
      ward: ward.trim()
    };
    
    saveOtloLocation(locObj);
    setUserLocation(locObj);
    triggerToast("🏘️ તમારી બેઠક સફળતાપૂર્વક સેટ થઈ ગઈ છે!");
  };

  // Reset/Change location
  const handleResetLocation = () => {
    if (window.confirm("શું તમે તમારું લોકેશન બદલવા માંગો છો? આનાથી તમારી ચર્ચાઓ પણ રિસેટ થઈ શકે છે.")) {
      deleteOtloLocation();
      setUserLocation(null);
      setDistrictId("");
      setTalukaId("");
      setVillageId("");
      setWard("");
      setIsCustomVillage(false);
      setCustomVillageName("");
      setFeedFilter("all");
    }
  };

  // Confirm GPS location
  const handleConfirmGps = () => {
    if (!detectedLocation) return;
    
    const dist = detectedLocation.district;
    const tal = detectedLocation.taluka;
    const vil = detectedLocation.village;
    
    if (dist) setDistrictId(dist.id);
    if (tal) setTalukaId(tal.id);
    
    if (vil) {
      if (vil.id === 'custom') {
        setIsCustomVillage(true);
        setCustomVillageName(vil.name_gu);
      } else {
        setIsCustomVillage(false);
        setVillageId(vil.id);
      }
    }
    
    setDetectedLocation(null);
    triggerToast("📍 GPS લોકેશન ફોર્મમાં ભરાઈ ગયું છે!");
  };

  // GPS Auto-detect coordinates reverse geocoded by Nominatim API
  const handleGPSAutoDetect = () => {
    if (!navigator.geolocation) {
      alert("તમારા બ્રાઉઝરમાં જીપીએસની સુવિધા નથી.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=gu,en`
          );
          if (!response.ok) throw new Error("Nominatim geocoding error");
          const data = await response.json();
          const address = data.address || {};
          
          const detectedDistrictStr = address.state_district || address.district || address.city || "";
          const detectedTalukaStr = address.county || address.suburb || "";
          const detectedVillageStr = address.village || address.town || address.suburb || address.neighbourhood || address.hamlet || "";
          
          let matchedDistrict = null;
          let matchedTaluka = null;
          let matchedVillage = null;
          
          // Match district
          for (const dist of DISTRICTS) {
            if (
              detectedDistrictStr.toLowerCase().includes(dist.id.toLowerCase()) ||
              detectedDistrictStr.toLowerCase().includes(dist.name_en.toLowerCase()) ||
              detectedDistrictStr.includes(dist.name_gu)
            ) {
              matchedDistrict = dist;
              break;
            }
          }
          
          // Match taluka
          if (matchedDistrict) {
            const talukas = TALUKAS[matchedDistrict.id] || [];
            for (const tal of talukas) {
              if (
                detectedTalukaStr.toLowerCase().includes(tal.id.toLowerCase()) ||
                detectedTalukaStr.toLowerCase().includes(tal.name_en.toLowerCase()) ||
                detectedTalukaStr.includes(tal.name_gu) ||
                detectedVillageStr.toLowerCase().includes(tal.id.toLowerCase()) ||
                detectedVillageStr.toLowerCase().includes(tal.name_en.toLowerCase()) ||
                detectedVillageStr.includes(tal.name_gu)
              ) {
                matchedTaluka = tal;
                break;
              }
            }
            
            // Match village
            if (matchedTaluka && allVillages) {
              const villages = allVillages[matchedTaluka.id] || [];
              for (const vil of villages) {
                if (
                  detectedVillageStr.toLowerCase().includes(vil.name_en.toLowerCase()) ||
                  detectedVillageStr.includes(vil.name_gu)
                ) {
                  matchedVillage = vil;
                  break;
                }
              }
            }
          }
          
          setDetectedLocation({
            district: matchedDistrict,
            taluka: matchedTaluka,
            village: matchedVillage || (detectedVillageStr ? { id: 'custom', name_gu: detectedVillageStr } : null)
          });
          setGpsLoading(false);
        } catch (err) {
          console.error(err);
          setGpsLoading(false);
          alert("લોકેશન ડિટેક્ટ કરવામાં ભૂલ આવી. કૃપા કરીને મેન્યુઅલ સેટ કરો.");
        }
      },
      (error) => {
        console.error(error);
        setGpsLoading(false);
        alert("GPS પરમિશન મળી નથી અથવા નબળું સિગ્નલ છે. કૃપા કરીને મેન્યુઅલ લોકેશન પસંદ કરો.");
      },
      { timeout: 10000 }
    );
  };

  // Location Cascading selections
  const handleDistrictChange = (distId) => {
    setDistrictId(distId);
    setTalukaId("");
    setVillageId("");
    setIsCustomVillage(false);
    setCustomVillageName("");
  };

  const handleTalukaChange = (talId) => {
    setTalukaId(talId);
    if (talId === "district_city") {
      setVillageId("district_city");
      setIsCustomVillage(false);
      setCustomVillageName("");
    } else {
      setVillageId("");
      setIsCustomVillage(false);
      setCustomVillageName("");
    }
  };

  // Feed Posting Action
  const handleCreatePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    
    if (newPostText.trim().length > 500) {
      alert("પોસ્ટ ૫૦૦ અક્ષરોથી વધુ લાંબી હોવી જોઈએ નહીં.");
      return;
    }
    
    await createOtloPost(newPostText.trim(), newPostCategory, newPostVisibility, newPostMediaUrl);
    setNewPostText("");
    setNewPostCategory("news");
    setNewPostVisibility("village");
    setNewPostMediaUrl("");
    setSelectedImageIndex(-1);
    setShowCreatePost(false);
    
    // Reload state
    const updatedPosts = await getOtloPosts(feedFilter);
    setPosts(updatedPosts);
    setRepData(getUserRepData());
    setLeaderboard(getLeaderboard());
    triggerToast("🚀 તમારી નવી ચર્ચા સફળતાપૂર્વક શેર કરવામાં આવી છે!");
  };

  // Like Action
  const handleLikePost = async (postId) => {
    if (likedPosts[postId]) return;
    await likeOtloPost(postId);
    setLikedPosts(prev => ({ ...prev, [postId]: true }));
    const updatedPosts = await getOtloPosts(feedFilter);
    setPosts(updatedPosts);
    triggerToast("❤️ પોસ્ટ લાઈક થઈ ગઈ છે!");
  };

  // Comment Actions
  const handleOpenComments = (postId) => {
    setShowCommentsPostId(postId);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !showCommentsPostId) return;
    
    await addOtloComment(showCommentsPostId, newCommentText.trim());
    setNewCommentText("");
    const updatedPosts = await getOtloPosts(feedFilter);
    setPosts(updatedPosts);
    triggerToast("💬 તમારી ટિપ્પણી ઉમેરાઈ ગઈ છે!");
  };

  // Location search in database
  const handleLocationSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setLocationSearchResults([]);
      return;
    }
    
    const results = [];
    const q = query.toLowerCase();
    
    // Search Districts
    DISTRICTS.forEach(d => {
      if (d.name_en.toLowerCase().includes(q) || d.name_gu.includes(q)) {
        results.push({
          id: d.id,
          name: d.name_gu,
          type: 'district',
          label: `${d.name_gu} જિલ્લો`,
          parentLabel: 'ગુજરાત'
        });
      }
    });
    
    // Search Talukas
    Object.keys(TALUKAS).forEach(distId => {
      const distName = getDistrictName(distId);
      TALUKAS[distId].forEach(t => {
        if (t.name_en.toLowerCase().includes(q) || t.name_gu.includes(q)) {
          results.push({
            id: t.id,
            name: t.name_gu,
            type: 'taluka',
            label: `${t.name_gu} તાલુકો`,
            parentLabel: `${distName} જિલ્લો`,
            districtId: distId
          });
        }
      });
    });
    
    // Search Villages
    if (allVillages) {
      Object.keys(allVillages).forEach(talukaId => {
        let parentDistId = "";
        let parentDistName = "";
        for (const distId of Object.keys(TALUKAS)) {
          if (TALUKAS[distId].some(t => t.id === talukaId)) {
            parentDistId = distId;
            parentDistName = getDistrictName(distId);
            break;
          }
        }
        const talukaName = getTalukaName(parentDistId, talukaId);
        
        allVillages[talukaId].forEach(v => {
          if (v.name_en.toLowerCase().includes(q) || v.name_gu.includes(q)) {
            results.push({
              id: v.id,
              name: v.name_gu,
              type: 'village',
              label: `${v.name_gu} (${v.name_en}) ગામ`,
              parentLabel: `${talukaName} તાલુકો, ${parentDistName}`,
              talukaId: talukaId,
              districtId: parentDistId
            });
          }
        });
      });
    }
    
    setLocationSearchResults(results.slice(0, 10));
  };

  // Follow Actions
  const handleFollowLocation = (loc) => {
    followLocation({
      id: loc.id,
      name: loc.name,
      type: loc.type,
      label: loc.label
    });
    reloadFollowed();
    triggerToast(`📌 તમે ${loc.name} ની બેઠકને ફોલો કરી છે!`);
  };

  const handleUnfollowLocation = (locId) => {
    unfollowLocation(locId);
    reloadFollowed();
    if (feedFilter === locId) setFeedFilter("all");
    triggerToast("📌 બેઠક અનફોલો કરવામાં આવી છે.");
  };

  // Invite referrals
  const handleInviteReferral = () => {
    const inviteUrl = `${window.location.origin}/community?ref=user_${Date.now()}`;
    navigator.clipboard.writeText(inviteUrl)
      .then(() => {
        addReferral();
        setRepData(getUserRepData());
        setLeaderboard(getLeaderboard());
        triggerToast("🤝 આમંત્રણ લિંક કોપી થઈ ગઈ! લીડરબોર્ડમાં +૧૦ પોઈન્ટ ઉમેરાયા!");
      })
      .catch(() => {
        triggerToast("આમંત્રણ કોપી કરી શકાયું નહીં.");
      });
  };

  // Directory actions
  const handleAddListingSubmit = (e) => {
    e.preventDefault();
    if (!newListingName.trim() || !newListingPhone.trim() || !newListingAddress.trim()) {
      alert("કૃપા કરીને બધી વિગતો ભરો.");
      return;
    }
    createDirectoryListing(
      newListingName.trim(),
      newListingCategory,
      newListingPhone.trim(),
      newListingAddress.trim()
    );
    setNewListingName("");
    setNewListingCategory("કરિયાણું");
    setNewListingPhone("");
    setNewListingAddress("");
    setShowAddListing(false);
    
    setDirectoryListings(getDirectoryListings());
    triggerToast("✨ તમારો વ્યવસાય ગામ ડિરેક્ટરીમાં સફળતાપૂર્વક ઉમેરાયો!");
  };

  // Media attachment simulated
  const handleSimulatedImage = () => {
    const nextIndex = (selectedImageIndex + 1) % SIMULATED_IMAGES.length;
    setSelectedImageIndex(nextIndex);
    setNewPostMediaUrl(SIMULATED_IMAGES[nextIndex]);
  };

  const handleRemoveImage = () => {
    setSelectedImageIndex(-1);
    setNewPostMediaUrl("");
  };

  // Active Post for comments view
  const activePost = posts.find(p => p.id === showCommentsPostId);
  const commentsList = activePost ? activePost.comments : [];

  // 1. ONE-TIME LOCATION SETUP SCREEN
  if (!userLocation) {
    return (
      <div className="animate-fade-in max-w-md mx-auto space-y-8 pb-12">
        <section className="bg-white dark:bg-dark-surface p-8 rounded-[2.5rem] shadow-xl border border-primary/5 space-y-6 relative overflow-hidden">
          <div className="absolute right-[-15px] top-[-15px] opacity-5 select-none pointer-events-none text-9xl">
            🏘️
          </div>
          
          <div className="space-y-2 text-center">
            <h2 className="font-gujarati font-black text-3xl text-primary dark:text-dark-accent">
              તમારી બેઠક સેટ કરો 🏘️
            </h2>
            <p className="font-gujarati text-sm text-stone-500 leading-relaxed">
              તમારા ગામ/શહેરની તમામ અપડેટ્સ અને ચર્ચાઓ ઓટોમેટિકલી મેળવવા માટે તમારું સરનામું પસંદ કરો.
            </p>
          </div>

          {/* GPS Auto Detect */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleGPSAutoDetect}
              disabled={gpsLoading}
              className="bg-[#fef8f1] dark:bg-dark-bg border-2 border-primary/20 hover:border-primary/50 text-[#994700] dark:text-dark-accent px-6 py-4 rounded-2xl font-gujarati font-black text-sm active:scale-95 transition-transform flex items-center justify-center gap-2 w-full shadow-sm"
            >
              <span className="material-symbols-outlined text-xl animate-pulse">location_on</span>
              <span>{gpsLoading ? "લોકેશન શોધી રહ્યા છીએ..." : "મારું GPS લોકેશન વાપરો 📍"}</span>
            </button>
            <p className="font-gujarati text-[10px] text-stone-400 mt-2 text-center leading-normal">
              તમારું exact location સેવ થતું નથી - ફક્ત ગામ/શહેરનું નામ જ સેવ થશે 🔒
            </p>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
            <span className="flex-shrink mx-4 text-stone-400 text-xs font-gujarati font-bold">અથવા મેન્યુઅલ પસંદ કરો</span>
            <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
          </div>

          {/* Cascading Dropdowns */}
          <form onSubmit={handleSaveLocation} className="space-y-4">
            <div className="space-y-1">
              <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">જિલ્લો *</label>
              <select
                value={districtId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3.5 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="">જિલ્લો પસંદ કરો</option>
                {DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name_gu} ({d.name_en})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">તાલુકો *</label>
              <select
                value={talukaId}
                onChange={(e) => handleTalukaChange(e.target.value)}
                disabled={!districtId}
                className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3.5 font-gujarati text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:bg-stone-100/50 text-on-surface"
              >
                <option value="">તાલુકો પસંદ કરો</option>
                {districtId && (
                  <option value="district_city" className="text-primary font-bold">🏢 ફક્ત મુખ્ય શહેર / જિલ્લા મથક ({getDistrictName(districtId)} City)</option>
                )}
                {districtId && (TALUKAS[districtId] || []).map(t => (
                  <option key={t.id} value={t.id}>{t.name_gu} ({t.name_en})</option>
                ))}
              </select>
            </div>

            {talukaId === "district_city" && (
              <div className="bg-amber-50 dark:bg-stone-800/40 p-4 rounded-2xl border border-amber-200/50 dark:border-stone-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">info</span>
                <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 leading-normal">
                  મુખ્ય શહેરી વિસ્તાર (સિટી) હોવાથી ગામડાંની પસંદગી જરૂરી નથી. તમે વૈકલ્પિક રીતે નીચે તમારો વૉર્ડ કે સોસાયટી વિસ્તાર લખી શકો છો.
                </p>
              </div>
            )}

            {talukaId && talukaId !== "district_city" && (
              <div className="space-y-1">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">ગામ / શહેર *</label>
                {!isCustomVillage ? (
                  <select
                    value={villageId}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomVillage(true);
                        setVillageId("");
                      } else {
                        setVillageId(e.target.value);
                      }
                    }}
                    disabled={!talukaId || villagesLoading}
                    className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3.5 font-gujarati text-sm focus:outline-none focus:border-primary disabled:opacity-50 disabled:bg-stone-100/50 text-on-surface"
                  >
                    <option value="">{villagesLoading ? "ગામો લોડ થઈ રહ્યા છે..." : "ગામ પસંદ કરો"}</option>
                    {talukaId && (
                      <option value="taluka_city" className="text-primary font-bold">🏢 ફક્ત આ તાલુકા મથક / ટાઉન ({getTalukaName(districtId, talukaId)} Town)</option>
                    )}
                    {talukaId && allVillages && (allVillages[talukaId] || []).map(v => (
                      <option key={v.id} value={v.id}>{v.name_gu} ({v.name_en})</option>
                    ))}
                    <option value="custom" className="text-primary font-bold">➕ મારું ગામ આ લિસ્ટમાં નથી...</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customVillageName}
                      onChange={(e) => setCustomVillageName(e.target.value)}
                      placeholder="તમારા ગામ/શહેરનું નામ લખો"
                      className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3.5 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface"
                    />
                    <button
                      type="button"
                      onClick={() => { setIsCustomVillage(false); setCustomVillageName(""); }}
                      className="text-xs text-primary font-gujarati hover:underline flex items-center gap-1"
                    >
                      ← લિસ્ટમાંથી પસંદ કરો
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">સોસાયટી / વૉર્ડ / વિસ્તાર (વૈકલ્પિક)</label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="દા.ત. નડિયાદ ગેટ પાસે, વૉર્ડ ૧"
                className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3.5 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-4 rounded-2xl font-gujarati font-black text-base shadow-xl active:scale-95 transition-transform mt-4"
            >
              બેઠક શરૂ કરો 🚀
            </button>
          </form>
        </section>

        {/* GPS Confirmation Dialog */}
        {detectedLocation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
            <div className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-primary/10 p-8 max-w-sm w-full shadow-2xl space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <span className="material-symbols-outlined text-5xl text-primary dark:text-dark-accent animate-bounce">location_on</span>
                <h3 className="font-gujarati font-black text-xl text-on-surface">GPS લોકેશન મળ્યું 📍</h3>
                <p className="font-gujarati text-xs text-stone-400 leading-relaxed">
                  અમે તમારું લોકેશન ઓટો-ડિટેક્ટ કર્યું છે. શું આ વિગતો બરાબર છે?
                </p>
              </div>
              
              <div className="bg-[#fef8f1] dark:bg-dark-bg p-5 rounded-2xl border border-primary/10 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                  <span className="font-gujarati font-bold text-stone-400">જિલ્લો:</span>
                  <span className="font-gujarati font-black text-on-surface">
                    {detectedLocation.district ? detectedLocation.district.name_gu : "શોધી શકાયો નથી"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-primary/5 pb-2">
                  <span className="font-gujarati font-bold text-stone-400">તાલુકો:</span>
                  <span className="font-gujarati font-black text-on-surface">
                    {detectedLocation.taluka ? detectedLocation.taluka.name_gu : "શોધી શકાયો નથી"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-gujarati font-bold text-stone-400">ગામ/શહેર:</span>
                  <span className="font-gujarati font-black text-on-surface text-right">
                    {detectedLocation.village ? detectedLocation.village.name_gu : "શોધી શકાયું નથી"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleConfirmGps}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-sm shadow-lg active:scale-95 transition-transform"
                >
                  હા, આ જ છે! ✓
                </button>
                <button 
                  onClick={() => setDetectedLocation(null)}
                  className="w-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 py-3.5 rounded-2xl font-gujarati font-black text-sm active:scale-95 transition-transform"
                >
                  મેન્યુઅલ પસંદ કરો ✍️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. MAIN FEED SCREEN (WHEN USER LOCATION IS CONFIGURED)
  return (
    <div className="animate-fade-in space-y-6 pb-16">
      {/* Top Banner Card */}
      <section className="bg-gradient-to-br from-amber-600 to-orange-700 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 select-none pointer-events-none text-9xl">
          groups
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="bg-white/20 border border-white/20 text-white/95 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                હાઈપર-લોકલ સોશિયલ કમ્યુનિટી 🏘️
              </span>
              <h2 className="font-gujarati font-black text-3xl">ડિજિટલ ઓટલો</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLocationSearchOpen(true)}
                className="h-10 w-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm"
                title="બીજા ઓટલા શોધો"
              >
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
              <button
                onClick={handleResetLocation}
                className="h-10 w-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-sm"
                title="ઓટલો બદલો"
              >
                <span className="material-symbols-outlined text-xl">settings</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-yellow-300">location_on</span>
            <div className="flex-1 min-w-0">
              <p className="font-gujarati text-[10px] text-orange-200">ચાલુ સ્થાનિક બેઠક:</p>
              <p className="font-gujarati font-bold text-sm truncate">
                {userLocation.talukaId === "district_city" ? (
                  `${userLocation.villageNameGu || getVillageName(userLocation.talukaId, userLocation.villageId)}, ${getDistrictName(userLocation.districtId)}`
                ) : userLocation.villageId === "taluka_city" ? (
                  `${userLocation.villageNameGu || getVillageName(userLocation.talukaId, userLocation.villageId)}, ${getDistrictName(userLocation.districtId)}`
                ) : (
                  `${getVillageName(userLocation.talukaId, userLocation.villageId)}, ${getTalukaName(userLocation.districtId, userLocation.talukaId)}, ${getDistrictName(userLocation.districtId)}`
                )}
                {userLocation.ward ? ` (${userLocation.ward})` : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz GUJARATI FEATURE BANNER */}
      <section id="quiz-banner" className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-amber-500/30">
        <div className="absolute right-0 top-0 opacity-10 select-none pointer-events-none text-9xl -translate-y-10 translate-x-10">
          👑
        </div>
        <div className="space-y-2 z-10 text-center md:text-left flex-1">
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-1">
            નવી ક્વિઝ ગેમ ⚡
          </span>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h3 className="font-headline font-black text-3xl md:text-4xl text-amber-100 tracking-wide">
              ગુજરાતી ક્વિઝ
            </h3>
            <ShareButton 
              sectionId="quiz-banner" 
              successMessage="✨ ગુજરાતી ક્વિઝની લિંક કોપી થઈ ગઈ છે!" 
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
            />
          </div>
          <p className="font-gujarati text-amber-200/90 text-sm md:text-base max-w-xl mt-2">
            તમારી ઉંમર મુજબના પ્રશ્નો રમો, 50-50 લાઈફલાઈન વાપરો, મિત્રોને પડકારો અને સર્ટિફિકેટ જીતો!
          </p>
        </div>
        <button
          onClick={() => navigate('/kbc-quiz')}
          className="z-10 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 px-8 py-4 rounded-2xl font-headline font-black text-lg shadow-2xl active:scale-95 transition whitespace-nowrap flex items-center gap-2 border border-amber-200"
        >
          <span>🎯</span> ક્વિઝ રમો
        </button>
      </section>

      {/* Devotional Cards FEATURE BANNER */}
      <section id="cards-banner" className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-indigo-500/30">
        <div className="absolute right-0 top-0 opacity-10 select-none pointer-events-none text-9xl -translate-y-5 translate-x-10">
          🕉️
        </div>
        <div className="space-y-2 z-10 text-center md:text-left flex-1">
          <span className="bg-indigo-400/20 text-indigo-300 border border-indigo-400/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-1">
            નવું ફિચર 🌟
          </span>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h3 className="font-headline font-black text-3xl md:text-4xl text-indigo-100 tracking-wide">
              ભક્તિ Cards મેકર
            </h3>
            <ShareButton 
              sectionId="cards-banner" 
              successMessage="✨ ભક્તિ કાર્ડ મેકરની લિંક કોપી થઈ ગઈ છે!" 
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
            />
          </div>
          <p className="font-gujarati text-indigo-200/90 text-sm md:text-base max-w-xl mt-2">
            તમારું નામ અને ફોટો લગાવીને સુંદર ભગવાનના સુવિચાર કાર્ડ્સ બનાવો અને મિત્રોને શેર કરો.
          </p>
        </div>
        <button
          onClick={() => navigate('/devotional-cards')}
          className="z-10 bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-300 hover:to-indigo-400 text-indigo-950 px-8 py-4 rounded-2xl font-headline font-black text-lg shadow-2xl active:scale-95 transition whitespace-nowrap flex items-center gap-2 border border-indigo-200"
        >
          <span>✨</span> કાર્ડ બનાવો
        </button>
      </section>

      {/* Main Tab bar */}
      <div className="flex bg-white dark:bg-dark-surface p-1.5 rounded-2xl border border-primary/5 shadow-sm max-w-md mx-auto">
        {[
          { id: "feed", label: "ચર્ચાઓ 💬" },
          { id: "directory", label: "ડિરેક્ટરી 📞" },
          { id: "leaderboard", label: "લીડરબોર્ડ 🏆" },
          { id: "sabha", label: "ગામ સભા 📢" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center rounded-xl font-gujarati font-black text-xs transition-all active:scale-95 truncate ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-stone-500 hover:text-primary dark:text-stone-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Slide-down Location Search Box */}
      {locationSearchOpen && (
        <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-primary/10 shadow-lg space-y-4 animate-fade-in max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <h4 className="font-gujarati font-black text-lg text-on-surface">લોકેશન શોધો 📍</h4>
            <button 
              onClick={() => { setLocationSearchOpen(false); setSearchQuery(""); setLocationSearchResults([]); }} 
              className="h-8 w-8 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 rounded-full flex items-center justify-center transition-all"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => handleLocationSearch(e.target.value)}
            placeholder="ગામ, તાલુકો અથવા જિલ્લો શોધો..."
            className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface"
          />
          
          {locationSearchResults.length > 0 && (
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-60 overflow-y-auto no-scrollbar">
              {locationSearchResults.map((item, idx) => {
                const isFollowed = followedLocations.some(f => f.id === item.id);
                return (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div 
                      className="flex items-start gap-3 cursor-pointer flex-1"
                      onClick={() => {
                        setFeedFilter(item.id);
                        setLocationSearchOpen(false);
                        setSearchQuery("");
                        setLocationSearchResults([]);
                        triggerToast(`📍 હવે તમે ${item.name} ની બેઠક જોઈ રહ્યા છો.`);
                      }}
                    >
                      <span className="material-symbols-outlined text-primary text-xl mt-0.5">location_on</span>
                      <div>
                        <p className="font-gujarati font-black text-sm text-on-surface">{item.label}</p>
                        <p className="font-gujarati text-[10px] text-stone-400">{item.parentLabel}</p>
                      </div>
                    </div>
                    <div>
                      {isFollowed ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleUnfollowLocation(item.id); }}
                          className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                          અનફોલો 📌
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleFollowLocation(item); }}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                        >
                          ફોલો ➕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {searchQuery.trim() && locationSearchResults.length === 0 && (
            <p className="text-center text-xs text-stone-400 font-gujarati py-4">કોઈ લોકેશન મળ્યું નથી.</p>
          )}
        </div>
      )}

      {/* SUB-TAB CONTENTS */}
      
      {/* 1. DISCUSSIONS TAB */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          {/* Discussion Topics (Horizontal) */}
          <section id="discussion-topics" className="space-y-4">
            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-gujarati font-black text-xl text-on-surface">રસના વિષયો</h3>
                    <ShareButton sectionId="discussion-topics" successMessage="✨ રસના વિષયો વિભાગની લિંક કોપી થઈ ગઈ છે!" />
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: "religious", title: "ભક્તિ સંગમ", icon: "temple_hindu", color: "bg-orange-100/70 text-orange-700" },
                { id: "news", title: "સ્થાનિક વેપાર", icon: "storefront", color: "bg-emerald-100/70 text-emerald-700" },
                { id: "news", title: "ખેતીવાડી", icon: "agriculture", color: "bg-green-100/70 text-green-700" },
                { id: "job", title: "નોકરી/વ્યવસાય", icon: "work", color: "bg-blue-100/70 text-blue-700" },
              ].map((topic, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => {
                    if (topic.title === "સ્થાનિક વેપાર") {
                      setActiveTab("directory");
                      triggerToast("📞 સ્થાનિક વેપાર જોવા માટે ડાયરેક્ટરી વિભાગ ઓપન થયો છે.");
                    } else {
                      setFeedFilter(topic.id);
                      triggerToast(`📍 હવે તમે "${topic.title}" સંબંધી ચર્ચાઓ જોઈ રહ્યા છો.`);
                    }
                  }}
                >
                  <div className={`h-20 w-20 ${topic.color} rounded-3xl flex items-center justify-center shadow-sm border border-black/5`}>
                    <span className="material-symbols-outlined text-3xl font-bold">{topic.icon}</span>
                  </div>
                  <span className="font-gujarati font-bold text-xs">{topic.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Action Grid */}
          <section className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setShowCreatePost(true)}
              className="bg-primary/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/5"
            >
              <span className="material-symbols-outlined text-3xl text-on-surface-variant font-bold">add_box</span>
              <span className="font-gujarati font-black text-sm text-primary">પોસ્ટ લખો 📝</span>
            </div>
            
            <div 
              onClick={() => {
                setShowCreatePost(true);
                handleSimulatedImage();
                triggerToast("📸 ચર્ચામાં જોડાવા માટે ફોટો પસંદ કરવામાં આવ્યો છે!");
              }}
              className="bg-[#f47b20]/10 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/5"
            >
              <span className="material-symbols-outlined text-3xl text-on-surface-variant font-bold">photo_camera</span>
              <span className="font-gujarati font-black text-sm text-[#f47b20]">ફોટો મૂકો 🖼️</span>
            </div>
            
            <div 
              onClick={() => triggerToast("🎥 લાઈવ બેઠક ચર્ચા ટૂંક સમયમાં શરૂ થશે!")}
              className="bg-emerald-50/70 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/5"
            >
              <span className="material-symbols-outlined text-3xl text-on-surface-variant font-bold">video_call</span>
              <span className="font-gujarati font-black text-sm text-emerald-700">લાઈવ જાઓ 🎥</span>
            </div>
            
            <div 
              onClick={() => {
                setLocationSearchOpen(true);
                triggerToast("📍 બીજી બેઠકો શોધવા માટે સર્ચ બોક્સ ઓપન થયું છે.");
              }}
              className="bg-stone-100 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform cursor-pointer border border-black/5"
            >
              <span className="material-symbols-outlined text-3xl text-on-surface-variant font-bold">location_on</span>
              <span className="font-gujarati font-black text-sm text-stone-700">નજીકમાં 📍</span>
            </div>
          </section>

          {/* Horizontal Level Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
            {[
              { id: "all", label: "બધું 🌐" },
              { id: "village", label: `${getVillageName(userLocation.talukaId, userLocation.villageId)} 🏘️` },
              { id: "taluka", label: getTalukaName(userLocation.districtId, userLocation.talukaId) },
              { id: "district", label: getDistrictName(userLocation.districtId) },
              { id: "state", label: "ગુજરાત" }
            ].concat(followedLocations.map(f => ({ id: f.id, label: `${f.name} 📌` }))).map(chip => (
              <button
                key={chip.id}
                onClick={() => setFeedFilter(chip.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-gujarati font-bold text-xs border transition-all active:scale-95 ${
                  feedFilter === chip.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-[#fef8f1] dark:bg-dark-surface text-stone-600 dark:text-stone-300 border-primary/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => {
                const category = POST_TYPES.find(c => c.id === post.postType) || POST_TYPES[0];
                const liked = likedPosts[post.id];
                return (
                  <article 
                    key={post.id} 
                    className="bg-white dark:bg-dark-surface rounded-3xl p-6 shadow-sm border border-primary/5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.avatarUrl || `https://i.pravatar.cc/100?u=${post.id}`} 
                          className="h-11 w-11 rounded-full border-2 border-primary/10" 
                          alt={post.userName} 
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-gujarati font-black text-sm text-on-surface">{post.userName}</h4>
                            {post.isRep && (
                              <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                👑 પ્રતિનિધિ
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-stone-400 font-gujarati">
                            <span>{getRelativeTimeString(post.createdAt)}</span>
                            <span>•</span>
                            <span className="text-primary font-bold">📍 {post.locationLabel}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                            📌 પિન્ડ
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border ${category.color}`}>
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="font-gujarati text-stone-800 dark:text-stone-100 text-sm leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Image Attachment */}
                    {post.mediaUrl && (
                      <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative border border-stone-100 dark:border-stone-800">
                        <img 
                          src={post.mediaUrl} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                          alt="Discussion Media" 
                        />
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-primary/5 text-stone-500 dark:text-stone-400">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-2 cursor-pointer transition-all active:scale-75 ${
                          liked ? 'text-red-500 font-bold scale-105' : 'hover:text-red-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: liked ? "'FILL' 1" : "" }}>
                          favorite
                        </span>
                        <span className="text-xs font-headline">{post.likes}</span>
                      </button>

                      <button 
                        onClick={() => handleOpenComments(post.id)}
                        className="flex items-center gap-2 cursor-pointer hover:text-primary transition-all active:scale-75"
                      >
                        <span className="material-symbols-outlined text-xl">chat_bubble</span>
                        <span className="text-xs font-headline">{post.comments.length}</span>
                      </button>

                      <ShareButton 
                        sectionId={post.id}
                        successMessage="✨ ચર્ચાની લિંક શેર કરવા માટે કોપી કરી છે!" 
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="bg-white dark:bg-dark-surface p-12 rounded-[2.5rem] text-center space-y-3 border border-primary/5">
                <span className="material-symbols-outlined text-5xl text-stone-300">chat_bubble_outline</span>
                <p className="font-gujarati text-sm text-stone-400">આ વિભાગમાં હજુ સુધી કોઈ ચર્ચા થઈ નથી.</p>
              </div>
            )}
          </div>

          {/* Floating Action Button (FAB) for Post Creation */}
          <button
            onClick={() => setShowCreatePost(true)}
            className="fixed bottom-24 right-6 h-14 w-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all z-40 border border-orange-400"
            title="નવી પોસ્ટ લખો"
          >
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </button>
        </div>
      )}

      {/* 2. LOCAL DIRECTORY TAB */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4">
            <h3 className="font-gujarati font-black text-xl text-primary dark:text-dark-accent">સ્થાનિક પીળા પાના (ડિરેક્ટરી) 📞</h3>
            <p className="font-gujarati text-xs text-stone-400 leading-normal">
              તમારા ગામ કે સોસાયટીના કારીગરો, વેપારીઓ અને મદદગાર સેવાઓની માહિતી મેળવો અથવા તમારી દુકાન ઉમેરો.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="પ્લમ્બર, ગૅરેજ કે વેપાર શોધો..."
                className="flex-1 bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface"
              />
              <button
                onClick={() => setShowAddListing(true)}
                className="bg-primary text-white px-4 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>ઉમેરો</span>
              </button>
            </div>
          </div>

          {/* Directory Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirectory.length > 0 ? (
              filteredDirectory.map((listing) => (
                <div 
                  key={listing.id}
                  className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-primary/5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="font-gujarati font-black text-base text-on-surface">{listing.name}</h4>
                      <span className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                        {listing.category}
                      </span>
                    </div>
                    <p className="font-gujarati text-xs text-stone-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-stone-400">location_on</span>
                      <span>{listing.address}</span>
                    </p>
                  </div>
                  <a
                    href={`tel:${listing.phone.replace(/\s+/g, '')}`}
                    className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-primary/20 hover:border-primary/50 text-[#994700] dark:text-dark-accent py-2.5 rounded-xl font-gujarati font-black text-xs text-center flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">phone</span>
                    <span>કોલ કરો: {listing.phone}</span>
                  </a>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-dark-surface p-12 rounded-[2.5rem] text-center space-y-3 border border-primary/5 col-span-full">
                <span className="material-symbols-outlined text-5xl text-stone-300">contact_phone</span>
                <p className="font-gujarati text-sm text-stone-400">ડિરેક્ટરીમાં કોઈ વ્યવસાય મળ્યો નથી.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-6 max-w-md mx-auto">
          {/* User Score Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-[2.5rem] text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] opacity-10 select-none pointer-events-none text-9xl">
              emoji_events
            </div>
            
            <div className="space-y-1">
              <h3 className="font-gujarati font-black text-xl">તમારો સ્કોર અને પ્રગતિ 🏆</h3>
              <p className="font-gujarati text-xs text-amber-200">ગામમાં અગ્રણી ભૂમિકા ભજવવા માટે સક્રિય બનો.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div>
                <p className="font-headline font-black text-xl text-yellow-300">{repData.score}</p>
                <p className="font-gujarati text-[9px] text-amber-100">કુલ સ્કોર</p>
              </div>
              <div className="border-x border-white/10">
                <p className="font-headline font-black text-xl">{repData.followers}</p>
                <p className="font-gujarati text-[9px] text-amber-100">ફોલોઅર્સ</p>
              </div>
              <div>
                <p className="font-headline font-black text-xl">{repData.referrals}</p>
                <p className="font-gujarati text-[9px] text-amber-100">આમંત્રણો</p>
              </div>
            </div>

            <button
              onClick={handleInviteReferral}
              className="w-full bg-white text-orange-950 hover:bg-amber-50 py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">share</span>
              <span>મિત્રોને આમંત્રિત કરો (+૧૦ પોઈન્ટ) 🤝</span>
            </button>
          </div>

          {/* Leaderboard Rankings */}
          <div className="space-y-4 bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] border border-primary/5 shadow-sm">
            <h3 className="font-gujarati font-black text-lg text-on-surface border-b border-primary/5 pb-2">ગામના ઓટો-પ્રતિનિધિ રેન્કિંગ 👑</h3>
            
            <div className="space-y-3">
              {leaderboard.map((user, idx) => {
                const isMe = user.name.includes("(તમે)");
                return (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl flex items-center justify-between border ${
                      isMe 
                        ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-300' 
                        : 'bg-[#fef8f1] dark:bg-dark-bg border-stone-100 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center font-bold font-headline ${
                        idx === 0 ? 'bg-amber-400 text-amber-950 text-base' :
                        idx === 1 ? 'bg-stone-300 text-stone-900 text-base' :
                        idx === 2 ? 'bg-amber-600 text-white text-base' :
                        'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 text-xs'
                      }`}>
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </span>
                      <div>
                        <p className={`font-gujarati font-black text-sm ${isMe ? 'text-amber-950 dark:text-amber-200' : 'text-on-surface'}`}>
                          {user.name}
                        </p>
                        <p className="font-gujarati text-[10px] text-stone-400">ગામ: {user.village}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline font-black text-sm text-[#994700] dark:text-dark-accent">{user.score} pts</p>
                      {user.isRep && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[8px] font-black uppercase">
                          પ્રતિનિધિ 👑
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. VILLAGE SABHA / REPRESENTATIVE TAB */}
      {activeTab === "sabha" && (
        <div className="space-y-6 max-w-md mx-auto">
          {/* Representative Header Card */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-6 text-center">
            <h3 className="font-gujarati font-black text-xl text-primary dark:text-dark-accent">ગામની સભા અને પ્રતિનિધિ 📢</h3>
            
            <div className="space-y-3 flex flex-col items-center">
              <div className="h-20 w-20 rounded-full border-4 border-amber-400 overflow-hidden shadow-lg relative">
                <img src="https://i.pravatar.cc/150?img=11" className="w-full h-full object-cover" alt="Representative Dinesh Patel" />
                <span className="absolute bottom-0 right-0 bg-amber-400 text-amber-950 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">👑</span>
              </div>
              <div>
                <h4 className="font-gujarati font-black text-lg text-on-surface">દિનેશભાઈ પટેલ</h4>
                <p className="font-gujarati text-xs text-primary font-bold">ઓટો-પ્રતિનિધિ (દભોઈ બેઠક)</p>
                <p className="font-gujarati text-[10px] text-stone-400 mt-1">સ્કોર: ૩૨૦ પોઈન્ટ્સ • રેન્ક: ૧</p>
              </div>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-left">
              <h5 className="font-gujarati font-black text-xs text-amber-700 dark:text-dark-accent mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">campaign</span>
                <span>તાજી અગત્યની ઘોષણા:</span>
              </h5>
              <p className="font-gujarati text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                "ગ્રામ પંચાયતના આયોજન મુજબ, આગામી શનિવારે શાળા પરિસરમાં વૃક્ષારોપણ અને સ્વચ્છતા અભિયાન યોજાશે. સહુ ગ્રામજનોને જોડાવવા નમ્ર અપીલ."
              </p>
            </div>

            <button
              onClick={() => triggerToast("💬 પ્રતિનિધિ સાથે સીધો ચેટ સપોર્ટ ટૂંક સમયમાં શરૂ થશે!")}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">chat</span>
              <span>પ્રશ્ન પૂછો / રજૂઆત કરો</span>
            </button>
          </div>

          {/* User Progress Panel */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-[2.5rem] border border-primary/5 shadow-sm space-y-4">
            <h4 className="font-gujarati font-black text-base text-on-surface">અગ્રણી પ્રતિનિધિ બનવા પ્રગતિ</h4>
            
            {/* Progress calculation */}
            {(() => {
              const repThreshold = leaderboard.length > 0 ? leaderboard[0].score : 320;
              const userScore = repData.score || 45;
              const progressPercent = Math.min(100, Math.round((userScore / repThreshold) * 100));
              const remaining = Math.max(0, repThreshold - userScore);
              
              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-gujarati font-bold text-stone-400">રેન્ક ૧ બનવા લક્ષ્ય:</span>
                    <span className="font-headline font-black text-primary dark:text-dark-accent">{userScore} / {repThreshold} pts</span>
                  </div>
                  
                  <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  <p className="font-gujarati text-[11px] text-stone-500 leading-relaxed pt-1">
                    {remaining > 0 ? (
                      <span>તમારે ગામના નંબર ૧ પ્રતિનિધિ બનવા માટે વધુ <strong className="text-primary dark:text-dark-accent font-black font-headline text-xs">{remaining} પોઈન્ટ્સ</strong>ની જરૂર છે.</span>
                    ) : (
                      <span>અભિનંદન! તમે ગામના સર્વોચ્ચ અગ્રણી સ્થાન પર છો! 👑</span>
                    )}
                  </p>
                </div>
              );
            })()}

            <button
              onClick={() => alert("પોઈન્ટ્સ મેળવવાની રીતો:\n\n1. બેઠક પર સકારાત્મક ચર્ચા પોસ્ટ કરો: +૧ પોઈન્ટ\n2. તમારી ચર્ચા પર લાઈક્સ/ટિપ્પણીઓ મેળવો: +૨ પોઈન્ટ્સ\n3. તમારા વ્યવસાયને ડિરેક્ટરીમાં લિસ્ટ કરો: +૫ પોઈન્ટ્સ\n4. મિત્રોને કમ્યુનિટીમાં આમંત્રિત કરો: +૧૦ પોઈન્ટ્સ")}
              className="w-full bg-stone-50 hover:bg-stone-100 dark:bg-stone-900/50 text-stone-600 dark:text-stone-300 py-3 rounded-2xl font-gujarati font-black text-[11px] border border-stone-200 dark:border-stone-800 active:scale-95 transition-transform"
            >
              પોઈન્ટ્સ કેવી રીતે વધારવા? 💡
            </button>
          </div>
        </div>
      )}

      {/* 5. DRAWERS & MODALS */}

      {/* A. Post Creation Bottom Sheet */}
      {showCreatePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div 
            className="bg-white dark:bg-dark-surface rounded-t-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] border-t border-primary/10 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#994700] dark:text-dark-accent">add_box</span>
                <h3 className="font-gujarati font-black text-lg text-on-surface">નવી ચર્ચા લખો</h3>
              </div>
              <button 
                onClick={() => { setShowCreatePost(false); setNewPostText(""); setSelectedImageIndex(-1); setNewPostMediaUrl(""); }}
                className="h-10 w-10 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 rounded-full flex items-center justify-center transition-all active:scale-90"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Content */}
            <form onSubmit={handleCreatePostSubmit} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              {/* Category Selector */}
              <div className="space-y-2">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">ચર્ચાનો પ્રકાર પસંદ કરો:</label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {POST_TYPES.map(type => {
                    const isActive = newPostCategory === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setNewPostCategory(type.id)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-xs font-gujarati font-bold transition-all active:scale-95 ${
                          isActive 
                            ? 'bg-primary text-white border-primary shadow-sm' 
                            : 'bg-[#fef8f1] border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Visibility Selector */}
              <div className="space-y-2">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">આ પોસ્ટ કોને દેખાશે?</label>
                <div className="grid grid-cols-2 gap-2">
                  {VISIBILITIES.map(v => {
                    const isActive = newPostVisibility === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setNewPostVisibility(v.id)}
                        className={`py-3 px-4 rounded-2xl border font-gujarati font-bold text-xs transition-all active:scale-95 ${
                          isActive 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-orange-400 shadow-sm' 
                            : 'bg-[#fef8f1] border-stone-200 text-stone-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Post Text Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">સંદેશો લખો:</label>
                  <span className={`text-xs font-headline ${newPostText.length > 450 ? 'text-red-500 font-bold' : newPostText.length > 400 ? 'text-amber-500' : 'text-stone-400'}`}>
                    {newPostText.length}/500
                  </span>
                </div>
                <textarea
                  value={newPostText}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewPostText(e.target.value);
                    }
                  }}
                  placeholder="ગામ કે સોસાયટીમાં ચર્ચા કરવા અહીં લખો..."
                  rows={4}
                  className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-sm focus:outline-none focus:border-primary text-on-surface leading-relaxed"
                ></textarea>
              </div>
              
              {/* Image Attachment (Simulated) */}
              <div className="space-y-3">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">ફોટો જોડો (વૈકલ્પિક):</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSimulatedImage}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary px-5 py-3 rounded-2xl font-gujarati font-black text-xs flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>{selectedImageIndex === -1 ? 'ફોટો પસંદ કરો' : 'બીજો ફોટો બદલો'}</span>
                  </button>
                  
                  {selectedImageIndex !== -1 && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-3 rounded-2xl font-gujarati font-bold text-xs flex items-center justify-center active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  )}
                </div>
                
                {newPostMediaUrl && (
                  <div className="h-40 w-full rounded-2xl overflow-hidden relative border border-stone-100 dark:border-stone-800 mt-2">
                    <img src={newPostMediaUrl} className="w-full h-full object-cover" alt="Attachment preview" />
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-gujarati font-black text-sm shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <span>ચર્ચા શરૂ કરો</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* B. Comments Drawer */}
      {showCommentsPostId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div 
            className="bg-white dark:bg-dark-surface rounded-t-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] border-t border-primary/10 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-primary/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#994700] dark:text-dark-accent">chat_bubble</span>
                <h3 className="font-gujarati font-black text-lg text-on-surface">ચર્ચા પર ટિપ્પણીઓ</h3>
              </div>
              <button 
                onClick={() => { setShowCommentsPostId(null); setNewCommentText(""); }}
                className="h-10 w-10 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 rounded-full flex items-center justify-center transition-all active:scale-90"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {commentsList.length > 0 ? (
                commentsList.map((c, idx) => (
                  <div key={idx} className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-gujarati font-black text-primary dark:text-dark-accent">{c.userName}</span>
                      <span className="text-stone-400 font-label">{getRelativeTimeString(c.createdAt)}</span>
                    </div>
                    <p className="font-gujarati text-xs text-stone-700 dark:text-stone-200">{c.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 space-y-2">
                  <span className="material-symbols-outlined text-4xl text-stone-300">chat_bubble_outline</span>
                  <p className="font-gujarati text-xs text-stone-400">હજી સુધી કોઈ ટિપ્પણી નથી. પ્રથમ ટિપ્પણી કરો!</p>
                </div>
              )}
            </div>
            
            {/* Add form */}
            <form onSubmit={handleAddComment} className="p-6 border-t border-primary/5 bg-white dark:bg-dark-surface flex items-center gap-3">
              <input 
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="ટિપ્પણી લખો..."
                className="flex-1 bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-xs focus:outline-none focus:border-primary text-on-surface"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white h-11 px-5 rounded-2xl font-gujarati font-black text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
              >
                <span>મોકલો</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* C. Add Business Listing Modal */}
      {showAddListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6">
          <div 
            className="bg-white dark:bg-dark-surface rounded-[2.5rem] border border-primary/10 p-8 max-w-sm w-full shadow-2xl space-y-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-gujarati font-black text-lg text-on-surface">વ્યવસાય ઉમેરો ➕</h3>
              <button 
                onClick={() => {
                  setShowAddListing(false);
                  setNewListingName("");
                  setNewListingCategory("કરિયાણું");
                  setNewListingPhone("");
                  setNewListingAddress("");
                }} 
                className="h-8 w-8 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 rounded-full flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleAddListingSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">વ્યવસાય / દુકાનનું નામ *</label>
                <input
                  type="text"
                  value={newListingName}
                  onChange={(e) => setNewListingName(e.target.value)}
                  placeholder="દા.ત. અંબિકા કિરાણા સ્ટોર"
                  className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-xs focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">શ્રેણી (કેટેગરી) *</label>
                <select
                  value={newListingCategory}
                  onChange={(e) => setNewListingCategory(e.target.value)}
                  className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-xs focus:outline-none focus:border-primary text-on-surface"
                >
                  {["કરિયાણું", "ગૅરેજ", "આરોગ્ય / દવા", "ઇલેક્ટ્રિશિયન", "પ્લમ્બર", "કપડાં / રેડીમેડ", "ખાણી-પીણી", "અન્ય"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">મોબાઈલ નંબર *</label>
                <input
                  type="text"
                  value={newListingPhone}
                  onChange={(e) => setNewListingPhone(e.target.value)}
                  placeholder="દા.ત. 98765 43210"
                  className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-xs focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="font-gujarati font-black text-xs text-stone-600 dark:text-stone-300">સરનામું *</label>
                <input
                  type="text"
                  value={newListingAddress}
                  onChange={(e) => setNewListingAddress(e.target.value)}
                  placeholder="દા.ત. બજાર ચોક, રામજી મંદિર પાસે"
                  className="w-full bg-[#fef8f1] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-gujarati text-xs focus:outline-none focus:border-primary text-on-surface"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs shadow-lg active:scale-95 transition-transform"
              >
                સબમિટ કરો ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
