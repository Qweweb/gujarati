import React, { useState, useEffect } from 'react';
import { feedDatabase, FEED_CATEGORIES, DESI_REACTIONS } from '../data/feedDatabase';

const CommunityFeed = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [reactions, setReactions] = useState({});
  const [hoveredPostId, setHoveredPostId] = useState(null);
  
  // Cache-first: Load instantly from localStorage if available, fallback to feedDatabase
  const [allPosts, setAllPosts] = useState(() => {
    const cached = localStorage.getItem('sanskari_feed_posts_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Failed to parse cached posts", e);
      }
    }
    return feedDatabase;
  });
  
  const [loading, setLoading] = useState(allPosts.length === 0);

  // Load saved reactions & custom posts from local storage
  useEffect(() => {
    const loadReactions = () => {
      const savedReactions = localStorage.getItem('feed_reactions');
      if (savedReactions) {
        try {
          setReactions(JSON.parse(savedReactions));
        } catch (e) {
          console.error("Failed to parse reactions", e);
        }
      }
    };

    const loadPosts = async () => {
      setLoading(true);
      let sbPosts = [];
      try {
        const { getOtloPosts, getRelativeTimeString } = await import('../utils/otlo_helper');
        const rawPosts = await getOtloPosts('all');
        const savedReactions = JSON.parse(localStorage.getItem('feed_reactions') || '{}');
        
        sbPosts = rawPosts.map(p => {
          const counts = { ...(p.reactionCounts || {}) };
          let userReaction = p.userReaction;
          const localReaction = savedReactions[p.id];
          
          if (localReaction) {
            userReaction = localReaction;
            if (p.userReaction !== localReaction) {
              if (p.userReaction && counts[p.userReaction]) {
                counts[p.userReaction] = Math.max(0, counts[p.userReaction] - 1);
              }
              counts[localReaction] = (counts[localReaction] || 0) + 1;
            }
          }
          
          return {
            id: p.id,
            categoryId: p.postType || 'news',
            content: {
              text: p.content,
              mediaType: p.mediaUrl ? 'image' : 'text',
              mediaUrl: p.mediaUrl,
              linkDetails: null
            },
            likesCount: p.likes || 0,
            sharesCount: p.shares || 0,
            reactionCounts: counts,
            userReaction: userReaction,
            views: p.views || 0,
            isDummy: false,
            timestamp: getRelativeTimeString(p.createdAt)
          };
        });
        
        const deletedDummies = JSON.parse(localStorage.getItem('sanskari_deleted_dummies') || '[]');
        sbPosts = sbPosts.filter(p => !deletedDummies.includes(p.id));
      } catch(err) {
        console.error("CommunityFeed Supabase fetch error", err);
      }

      const savedPosts = localStorage.getItem('sanskari_feed_posts');
      const deletedDummies = JSON.parse(localStorage.getItem('sanskari_deleted_dummies') || '[]');
      const activeDummies = feedDatabase.filter(p => !deletedDummies.includes(p.id));

      let finalPosts = [...sbPosts];

      if (savedPosts) {
        try {
          const customPosts = JSON.parse(savedPosts);
          if (customPosts && customPosts.length > 0) {
            finalPosts = [...finalPosts, ...customPosts];
          }
        } catch (e) {
          console.error("Failed to parse posts", e);
        }
      }
      
      finalPosts = [...finalPosts, ...activeDummies];
      
      // Update state and write to cache
      setAllPosts(finalPosts);
      localStorage.setItem('sanskari_feed_posts_cache', JSON.stringify(finalPosts));
      setLoading(false);
    };

    // Initial load
    loadReactions();
    loadPosts();

    // Listen for changes from other tabs (like AdminDashboard)
    const handleStorageChange = (e) => {
      // e.key is null when window.dispatchEvent(new Event("storage")) is called manually
      if (!e.key || e.key === 'sanskari_feed_posts') {
        loadPosts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Track post views using IntersectionObserver
  useEffect(() => {
    const viewedPosts = new Set(JSON.parse(sessionStorage.getItem('viewed_posts') || '[]'));
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const postId = entry.target.getAttribute('data-post-id');
          const isDummy = entry.target.getAttribute('data-is-dummy') === 'true';
          
          if (postId && !isDummy && !viewedPosts.has(postId)) {
            viewedPosts.add(postId);
            sessionStorage.setItem('viewed_posts', JSON.stringify([...viewedPosts]));
            
            try {
              const { incrementPostView } = await import('../utils/otlo_helper');
              await incrementPostView(postId);
            } catch (e) {
              console.error("Failed to increment view", e);
            }
          }
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% of the post is visible

    const postElements = document.querySelectorAll('.community-post-article');
    postElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [allPosts]);

  const handleReaction = async (postId, reactionId) => {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    // Fast local UI update for feed_reactions (optimistic UI)
    const newReactions = { ...reactions };
    let actionType = 'added';
    let previousReaction = null;

    if (newReactions[postId] === reactionId) {
      delete newReactions[postId];
      actionType = 'removed';
      previousReaction = reactionId;
    } else {
      previousReaction = newReactions[postId];
      newReactions[postId] = reactionId;
      actionType = previousReaction ? 'updated' : 'added';
    }
    
    setReactions(newReactions);
    localStorage.setItem('feed_reactions', JSON.stringify(newReactions));
    setHoveredPostId(null);

    // If it's a Supabase post, sync with database and update local counts
    if (!post.isDummy) {
      try {
        const { togglePostReaction } = await import('../utils/otlo_helper');
        await togglePostReaction(postId, reactionId);
        
        // Update the counts in allPosts so the UI reflects the public reaction counts
        setAllPosts(prevPosts => prevPosts.map(p => {
          if (p.id === postId) {
            const counts = { ...(p.reactionCounts || {}) };
            
            if (actionType === 'removed') {
              counts[reactionId] = Math.max(0, (counts[reactionId] || 0) - 1);
            } else if (actionType === 'updated') {
              if (previousReaction) {
                counts[previousReaction] = Math.max(0, (counts[previousReaction] || 0) - 1);
              }
              counts[reactionId] = (counts[reactionId] || 0) + 1;
            } else if (actionType === 'added') {
              counts[reactionId] = (counts[reactionId] || 0) + 1;
            }
            
            return { ...p, reactionCounts: counts, userReaction: actionType === 'removed' ? null : reactionId };
          }
          return p;
        }));
      } catch (e) {
        console.error("Failed to toggle reaction on Supabase", e);
      }
    }
  };

  const sharePost = async (post) => {
    let shareText = '';
    shareText += `${post.content.text.length > 200 ? post.content.text.substring(0, 200) + '...' : post.content.text}\n`;
    
    if (post.content.mediaType === 'video' && post.content.mediaUrl) {
      shareText += `\n📺 વિડીયો જુઓ: ${post.content.mediaUrl}\n`;
    } else if (post.content.mediaType === 'link' && post.content.linkDetails) {
      shareText += `\n🔗 લિંક ખોલો: ${post.content.linkDetails.url}\n`;
    }
    
    const postLink = `https://gujaratiapp.in/community?post=${post.id}`;
    shareText += `\n👇 વધુ મજેદાર પોસ્ટ્સ અને રોજ નવી માહિતી માટે આપણી પોતાની 'ગુજરાતી એપ' ડાઉનલોડ કરો! 📱\n${postLink}`;

    try {
      const { Capacitor } = await import('@capacitor/core');
      if (Capacitor.isNativePlatform()) {
        const { Share } = await import('@capacitor/share');
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        
        let localUri = null;
        if (post.content.mediaType === 'image' && post.content.mediaUrl) {
          try {
            const response = await fetch(post.content.mediaUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            const base64data = await new Promise(resolve => {
               reader.onloadend = () => resolve(reader.result);
            });
            const savedFile = await Filesystem.writeFile({
               path: `share_post_${post.id}.jpg`,
               data: base64data.split(',')[1],
               directory: Directory.Cache
            });
            localUri = savedFile.uri;
          } catch (e) {
            console.error("Failed to download image for sharing natively", e);
          }
        }
        
        await Share.share({
          title: 'ગુજરાતી બેઠક',
          text: shareText,
          url: localUri || postLink,
          dialogTitle: 'શેર કરો'
        });
        return;
      }
    } catch (error) {
      console.log('Native share error', error);
    }

    // Web Fallback
    const productionUrl = postLink;
    let filesToShare = [];
    if (post.content.mediaType === 'image' && post.content.mediaUrl) {
      try {
        const response = await fetch(post.content.mediaUrl);
        const blob = await response.blob();
        const file = new File([blob], 'gujarati_post.jpg', { type: blob.type });
        filesToShare = [file];
      } catch (e) {
        console.error("Failed to fetch image for sharing", e);
      }
    }

    if (navigator.share) {
      try {
        const shareData = {
          title: `ગુજરાતી બેઠક`,
          text: shareText,
        };

        if (filesToShare.length > 0 && navigator.canShare && navigator.canShare({ files: filesToShare })) {
          shareData.files = filesToShare;
        } else {
          shareData.url = productionUrl;
        }

        await navigator.share(shareData);
        return;
      } catch (error) {
        console.log('Web share failed, trying fallback', error);
      }
    }
    
    // Final Fallback for older browsers
    try {
      await navigator.clipboard.writeText(shareText);
      alert("પોસ્ટની લિંક અને લખાણ કોપી થઈ ગયું છે, તમે તેને કોઈને પણ મોકલી શકો છો.");
    } catch (err) {
      alert("શેર કરવું આ ડિવાઇસમાં સપોર્ટેડ નથી.");
    }
  };

  const filteredPosts = activeFilter === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.categoryId === activeFilter);

  return (
    <div className="space-y-6 mt-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="font-gujarati font-black text-2xl text-[#2D3748] dark:text-[#F4F4F0]">આજની બેઠક</h2>
        <span className="text-xs font-bold text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full border border-[#0D9488]/30">નવું ફીચર</span>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
        {FEED_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`snap-start whitespace-nowrap px-4 py-2 rounded-2xl font-gujarati text-sm font-bold flex items-center gap-2 transition-all ${
              activeFilter === cat.id 
                ? 'bg-[#2D3748] text-white shadow-md border border-[#2D3748]' 
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white dark:bg-[#1E1A18] rounded-3xl p-5 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-stone-200 dark:bg-stone-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-stone-200 dark:bg-stone-700 rounded-md"></div>
                      <div className="h-2.5 w-16 bg-stone-200 dark:bg-stone-700 rounded-md"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-stone-200 dark:bg-stone-700 rounded-md"></div>
                    <div className="h-3 w-5/6 bg-stone-200 dark:bg-stone-700 rounded-md"></div>
                  </div>
                  <div className="h-40 bg-stone-100 dark:bg-stone-800 rounded-2xl w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-[#1E1A18] rounded-3xl border border-stone-200 dark:border-stone-800">
              <span className="material-symbols-outlined text-stone-400 text-4xl mb-2">article</span>
              <p className="font-gujarati text-sm text-stone-500 font-bold">આ કેટેગરીમાં કોઈ પોસ્ટ નથી.</p>
            </div>
          )
        ) : (
          filteredPosts.map(post => {
            const category = FEED_CATEGORIES.find(c => c.id === post.categoryId);
            let isPoll = false;
            let pollData = null;
            let postText = post.content.text;
            let mediaType = post.content.mediaType;
            let mediaUrl = post.content.mediaUrl;

            if (postText?.startsWith("POLL::")) {
              isPoll = true;
              try {
                pollData = JSON.parse(postText.replace("POLL::", ""));
                postText = pollData.question;
              } catch (e) {}
            } else if (mediaType !== 'image' && mediaType !== 'video') {
              const ytMatch = postText?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
              if (ytMatch) {
                mediaType = 'video';
                mediaUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
              }
            }

            const currentReactionId = post.userReaction || reactions[post.id];
            const currentReaction = currentReactionId && !currentReactionId.startsWith('poll_option_') ? DESI_REACTIONS.find(r => r.id === currentReactionId) : null;
            
            return (
              <article 
                key={post.id} 
                data-post-id={post.id}
                data-is-dummy={post.isDummy}
                className="community-post-article bg-white dark:bg-[#1E1A18] rounded-3xl overflow-visible shadow-sm border border-stone-200 dark:border-stone-800"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#0D9488]/10 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#0D9488]">{category?.icon || 'article'}</span>
                    </div>
                    <div>
                      <h3 className="font-gujarati font-black text-[#2D3748] dark:text-[#F4F4F0] text-sm">
                        {category?.label || 'સામાન્ય'}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">{post.timestamp}</p>
                    </div>
                  </div>
                  <button className="text-stone-400 hover:text-stone-600">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="font-gujarati text-[#2D3748] dark:text-[#F4F4F0] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                    {postText}
                  </p>
                </div>

                {/* Media Handling */}
                {mediaType === 'image' && mediaUrl && (
                  <div className="w-full bg-stone-50 dark:bg-stone-900/50 overflow-hidden flex justify-center border-t border-b border-stone-100 dark:border-stone-800">
                    <img 
                      src={mediaUrl} 
                      alt="Post media" 
                      className="w-full h-auto max-h-[500px] object-contain"
                      loading="lazy"
                    />
                  </div>
                )}

                {mediaType === 'video' && mediaUrl && (
                  <div className="w-full bg-stone-900 aspect-video">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={mediaUrl} 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {mediaType === 'link' && post.content.linkDetails && (
                  <div className="mx-4 mb-4 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                    <a href={post.content.linkDetails.url} target="_blank" rel="noreferrer" className="flex items-center p-3 gap-3">
                      <div className="h-12 w-12 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-stone-500">link</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-gujarati font-bold text-sm text-[#2D3748] dark:text-[#F4F4F0] truncate">
                          {post.content.linkDetails.title}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">{post.content.linkDetails.domain}</p>
                      </div>
                    </a>
                  </div>
                )}

                {/* Poll Rendering */}
                {isPoll && pollData && (
                  <div className="px-4 pb-3 space-y-2 mt-2">
                    {pollData.options.map((opt, idx) => {
                      const reactionKey = `poll_option_${idx}`;
                      const voteCount = post.reactionCounts?.[reactionKey] || 0;
                      const totalVotes = Object.keys(post.reactionCounts || {})
                                          .filter(k => k.startsWith('poll_option_'))
                                          .reduce((sum, k) => sum + post.reactionCounts[k], 0);
                      const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      
                      const userVoted = currentReactionId?.startsWith('poll_option_');
                      const isMyVote = currentReactionId === reactionKey;

                      return (
                        <div 
                          key={idx}
                          onClick={() => {
                            if (!userVoted) {
                              handleReaction(post.id, reactionKey);
                            }
                          }}
                          className={`relative overflow-hidden rounded-xl border p-3 flex justify-between items-center transition-all ${userVoted ? 'cursor-default' : 'cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800'} ${isMyVote ? 'border-[#0D9488] bg-[#0D9488]/10' : 'border-stone-200 dark:border-stone-800'}`}
                        >
                          {userVoted && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-stone-100 dark:bg-stone-800 -z-10 transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          )}
                          <span className={`font-gujarati text-sm ${isMyVote ? 'font-bold text-[#0D9488]' : 'text-stone-700 dark:text-stone-300'} z-10`}>
                            {opt.text}
                          </span>
                          {userVoted && (
                            <span className="font-bold text-xs text-stone-500 z-10">{percentage}%</span>
                          )}
                        </div>
                      );
                    })}
                    <div className="text-xs text-stone-400 pt-1 font-gujarati flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">how_to_vote</span>
                      કુલ વોટ: {Object.keys(post.reactionCounts || {})
                                  .filter(k => k.startsWith('poll_option_'))
                                  .reduce((sum, k) => sum + post.reactionCounts[k], 0)}
                    </div>
                  </div>
                )}

                {/* Public Reaction Summaries */}
                {post.reactionCounts && Object.keys(post.reactionCounts).filter(k => !k.startsWith('poll_option_')).length > 0 && (
                  <div className="px-4 py-2 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center -space-x-1">
                      {Object.entries(post.reactionCounts)
                        .filter(([k]) => !k.startsWith('poll_option_'))
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([reactionId]) => {
                          const rInfo = DESI_REACTIONS.find(r => r.id === reactionId);
                          return rInfo ? (
                            <div key={reactionId} className="w-5 h-5 rounded-full bg-stone-50 dark:bg-stone-900 shadow-sm flex items-center justify-center text-[10px] border border-stone-200 dark:border-stone-700 z-10 relative">
                              {rInfo.emoji}
                            </div>
                          ) : null;
                        })}
                    </div>
                    <span className="text-xs text-stone-500 font-medium">
                      {Object.entries(post.reactionCounts).filter(([k]) => !k.startsWith('poll_option_')).reduce((a, [_,v]) => a + v, 0)}
                    </span>
                  </div>
                )}

                <div className="px-2 py-1 flex items-center justify-between relative">
                  
                  {/* Desi Reaction System */}
                  {!isPoll && (
                    <div 
                      className="relative flex-1"
                      onMouseEnter={() => setHoveredPostId(post.id)}
                      onMouseLeave={() => setHoveredPostId(null)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setHoveredPostId(post.id);
                      }}
                    >
                      {/* Reaction Popover */}
                      {hoveredPostId === post.id && (
                        <div className="absolute bottom-full left-0 pb-2 z-50 animate-bounce-in origin-bottom-left w-[200%] sm:w-[350px]">
                          <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-700 p-1 flex items-center justify-between w-full">
                            {DESI_REACTIONS.map((reaction, idx) => (
                              <button
                                key={reaction.id}
                                onClick={(e) => { e.stopPropagation(); handleReaction(post.id, reaction.id); }}
                                className={`group flex flex-col items-center justify-center hover:bg-stone-50 dark:hover:bg-stone-700 py-1.5 rounded-2xl transition-all hover:scale-110 origin-bottom flex-1 min-w-0 ${
                                  (post.userReaction === reaction.id || reactions[post.id] === reaction.id)
                                    ? 'bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-500 scale-105 z-10'
                                    : ''
                                }`}
                              >
                                <span className="text-[20px] sm:text-2xl mb-0.5 group-hover:-translate-y-1 transition-transform">{reaction.emoji}</span>
                                <span className="text-stone-700 dark:text-stone-300 text-[8px] sm:text-[10px] font-gujarati font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-0.5">
                                  {reaction.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Main Action Button */}
                      <button 
                        onClick={() => handleReaction(post.id, 'moj')}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-gujarati font-bold text-sm transition-colors ${
                          currentReaction 
                            ? 'text-[#0D9488] bg-[#0D9488]/5' 
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900/50'
                        }`}
                      >
                        {currentReaction ? (
                          <>
                            <span className="text-xl animate-bounce">{currentReaction.emoji}</span>
                            <span>{currentReaction.label}</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">add_reaction</span>
                            <span>પ્રતિક્રિયા આપો</span>
                          </>
                        )}
                      </button>

                    </div>
                  )}

                  <button 
                    onClick={() => sharePost(post)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-gujarati font-bold text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    <span>શેર કરો</span>
                  </button>

                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
