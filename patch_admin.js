const fs = require("fs");
let content = fs.readFileSync("src/components/AdminDashboard.jsx", "utf8");

// 1. Add missing state (editPostId, customPosts)
if (!content.includes("editPostId")) {
  content = content.replace(
    /const \[pubLinkDomain, setPubLinkDomain\] = useState\(""\);/,
    `const [pubLinkDomain, setPubLinkDomain] = useState("");\n  const [editPostId, setEditPostId] = useState(null);\n  const [customPosts, setCustomPosts] = useState([]);`
  );
}

// 2. Add useEffect to load customPosts
if (!content.includes("loadCustomPosts")) {
  content = content.replace(
    /  \/\/ Load actual application stats/,
    `  const loadCustomPosts = () => {
    const saved = JSON.parse(localStorage.getItem("sanskari_feed_posts") || "[]");
    setCustomPosts(saved);
  };
  
  useEffect(() => {
    loadCustomPosts();
  }, []);

  // Load actual application stats`
  );
}

// 3. Update handlePublishPost to handle Edit mode
if (!content.includes("isEditMode")) {
  content = content.replace(
    /const saved = JSON\.parse\(localStorage\.getItem\("sanskari_feed_posts"\) \|\| "\[\]"\);\n    saved\.unshift\(newPost\);\n    localStorage\.setItem\("sanskari_feed_posts", JSON\.stringify\(saved\)\);/,
    `const saved = JSON.parse(localStorage.getItem("sanskari_feed_posts") || "[]");
    if (editPostId) {
      const idx = saved.findIndex(p => p.id === editPostId);
      if (idx !== -1) {
        newPost.id = editPostId;
        saved[idx] = newPost;
        alert("????? ??????????? ??????? ??!");
      }
    } else {
      saved.unshift(newPost);
      alert("????? ??????????? ?????? ?? ??!");
    }
    localStorage.setItem("sanskari_feed_posts", JSON.stringify(saved));
    loadCustomPosts();
    window.dispatchEvent(new Event("storage")); // Trigger cross-tab sync locally
    setEditPostId(null);`
  );
  // Remove the old alert since we added it above
  content = content.replace(/alert\("????? ??????????? ?????? ?? ??! ???? ??? ?? ???? ??? ???."\);\n/, "");
}

// 4. Add Delete & Edit Handlers
if (!content.includes("handleDeletePost")) {
  content = content.replace(
    /  \/\/ Load actual application stats/,
    `  const handleEditPost = (post) => {
    setEditPostId(post.id);
    setPubCategory(post.categoryId);
    setPubMediaType(post.content.mediaType);
    setPubText(post.content.text);
    setPubUrl(post.content.mediaUrl || (post.content.linkDetails?.url) || "");
    setPubLinkTitle(post.content.linkDetails?.title || "");
    setPubLinkDomain(post.content.linkDetails?.domain || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = (id) => {
    if (confirm("??? ??? ????? ? ????? ????? ???? ????? ???")) {
      const saved = JSON.parse(localStorage.getItem("sanskari_feed_posts") || "[]");
      const updated = saved.filter(p => p.id !== id);
      localStorage.setItem("sanskari_feed_posts", JSON.stringify(updated));
      loadCustomPosts();
      window.dispatchEvent(new Event("storage"));
    }
  };
  
  // Load actual application stats`
  );
}

// 5. Update UI Button text for Edit Mode
content = content.replace(
  />\s*????? ?????? ???\s*<\/button>/,
  `>{editPostId ? "????? ?????? (Update)" : "????? ?????? ???"}</button>`
);

// 6. Add Custom Posts List View in Publisher Tab
if (!content.includes("????? ?????? ????? ???????")) {
  content = content.replace(
    /<\/form>\n              <\/div>\n            <\/div>\n          \)}/,
    `</form>
              </div>

              {/* POST LIST */}
              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm mt-6">
                <h3 className="font-headline font-black text-base text-stone-900 dark:text-stone-100 mb-4">????? ?????? ????? ??????? ({customPosts.length})</h3>
                {customPosts.length === 0 ? (
                  <p className="text-stone-400 font-gujarati text-xs text-center py-6">??? ???? ??? ????? ?????? ???? ???.</p>
                ) : (
                  <div className="space-y-4">
                    {customPosts.map(post => (
                      <div key={post.id} className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-100 dark:border-stone-900 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex-1">
                          <span className="text-[10px] bg-yellow-600/10 text-yellow-700 px-2 py-0.5 rounded-md font-bold mr-2 uppercase">{post.categoryId}</span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-bold uppercase">{post.content.mediaType}</span>
                          <p className="font-gujarati text-sm text-stone-800 dark:text-stone-200 mt-2 line-clamp-2">{post.content.text}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPost(post)} className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 rounded-lg text-xs font-gujarati font-bold transition">????</button>
                          <button onClick={() => handleDeletePost(post.id)} className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-200 rounded-lg text-xs font-gujarati font-bold transition">?????</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}`
  );
}

fs.writeFileSync("src/components/AdminDashboard.jsx", content);
console.log("Admin Dashboard Patched");

