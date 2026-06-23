const fs = require("fs");
let content = fs.readFileSync("src/components/AdminDashboard.jsx", "utf8");

// Add state for Publisher
if (!content.includes("pubCategory")) {
  content = content.replace(
    /const \[newPromoDiscount, setNewPromoDiscount\] = useState\("50%"\);/,
    `const [newPromoDiscount, setNewPromoDiscount] = useState("50%");\n\n  // Feed Publisher State\n  const [pubCategory, setPubCategory] = useState("suvichar");\n  const [pubMediaType, setPubMediaType] = useState("text");\n  const [pubText, setPubText] = useState("");\n  const [pubUrl, setPubUrl] = useState("");\n  const [pubLinkTitle, setPubLinkTitle] = useState("");\n  const [pubLinkDomain, setPubLinkDomain] = useState("");\n\n  const handlePublishPost = (e) => {\n    e.preventDefault();\n    if (!pubText) return alert("???????? ???? ???? ? ??? ???!");\n    \n    const newPost = {\n      id: Date.now(),\n      categoryId: pubCategory,\n      timestamp: "????? ?",\n      content: {\n        text: pubText,\n        mediaType: pubMediaType,\n        mediaUrl: pubMediaType === "image" || pubMediaType === "video" ? pubUrl : null,\n        linkDetails: pubMediaType === "link" ? {\n          title: pubLinkTitle || "Read More",\n          url: pubUrl,\n          domain: pubLinkDomain || "example.com"\n        } : null\n      },\n      likesCount: 0,\n      sharesCount: 0,\n      initialReaction: null\n    };\n    \n    const saved = JSON.parse(localStorage.getItem("sanskari_feed_posts") || "[]");\n    saved.unshift(newPost);\n    localStorage.setItem("sanskari_feed_posts", JSON.stringify(saved));\n    alert("????? ??????????? ?????? ?? ??! ???? ??? ?? ???? ??? ???.");\n    setPubText("");\n    setPubUrl("");\n    setPubLinkTitle("");\n    setPubLinkDomain("");\n  };`
  );
}

// Add Sidebar Tab
if (!content.includes("???? ??? ???????")) {
  content = content.replace(
    /?????????? ????????\s*<\/button>/,
    `?????????? ????????\n            </button>\n            <button \n              onClick={() => setActiveTab("publisher")}\n              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-gujarati font-bold text-sm transition-all \${\n                activeTab === "publisher" \n                  ? "bg-yellow-600 text-white shadow-md shadow-yellow-600/10" \n                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900"\n              }\`}\n            >\n              <span className="material-symbols-outlined text-lg">post_add</span>\n              ???? ??? ???????\n            </button>`
  );
}

// Add Publisher UI section
if (!content.includes("TAB 7: FEED PUBLISHER")) {
  const publisherJSX = `
          {/* TAB 7: FEED PUBLISHER */}
          {activeTab === "publisher" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline font-black text-lg text-stone-900 dark:text-stone-100">???? ??? ???????</h3>
                <span className="font-gujarati text-xs text-stone-500">Live ???????????? ??? ????? ?????</span>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-6 border border-stone-200/50 dark:border-stone-850 shadow-sm">
                <form onSubmit={handlePublishPost} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">??????? ???????</label>
                      <select 
                        value={pubCategory}
                        onChange={(e) => setPubCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-gujarati text-sm text-stone-800 dark:text-stone-200"
                      >
                        <option value="suvichar">??????? (Suvichar)</option>
                        <option value="bhakti">??????? (Bhakti)</option>
                        <option value="news">?????? (News)</option>
                        <option value="janva_jevu">????? ????? (Facts)</option>
                        <option value="gk">??????? ????? (GK)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">?????? ?????? (Media Type)</label>
                      <select 
                        value={pubMediaType}
                        onChange={(e) => setPubMediaType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-gujarati text-sm text-stone-800 dark:text-stone-200"
                      >
                        <option value="text">???? ???? (Text Only)</option>
                        <option value="image">???? (Image)</option>
                        <option value="video">??????? ?????? (YouTube Video)</option>
                        <option value="link">???????/PDF ???? (Web Link)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">???????? ???? (Gujarati Text)</label>
                    <textarea 
                      rows="4"
                      required
                      placeholder="???? ?????????? ???????? ????? ???? ???? ???..."
                      value={pubText}
                      onChange={(e) => setPubText(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-gujarati text-sm text-stone-800 dark:text-stone-200"
                    />
                  </div>

                  {(pubMediaType === "image" || pubMediaType === "video" || pubMediaType === "link") && (
                    <div>
                      <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">
                        {pubMediaType === "image" ? "?????? ???? (Image URL)" : pubMediaType === "video" ? "YouTube Embed URL" : "???????/PDF ?? ???? (URL)"}
                      </label>
                      <input 
                        type="url"
                        placeholder="???? ???? ????? ??? (https://...)"
                        value={pubUrl}
                        onChange={(e) => setPubUrl(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-sans text-sm text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  )}

                  {pubMediaType === "link" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">??????? ????? (Link Title)</label>
                        <input 
                          type="text"
                          placeholder="??.?. ??? ??????? ??????? ???"
                          value={pubLinkTitle}
                          onChange={(e) => setPubLinkTitle(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-gujarati text-sm text-stone-800 dark:text-stone-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-gujarati font-bold text-stone-500 mb-1">????? ??? (Domain Name)</label>
                        <input 
                          type="text"
                          placeholder="??.?. gujarat.gov.in"
                          value={pubLinkDomain}
                          onChange={(e) => setPubLinkDomain(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 font-sans text-sm text-stone-800 dark:text-stone-200"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-gujarati font-bold px-8 py-3 rounded-xl transition active:scale-95 shadow-md shadow-yellow-600/20 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      ????? ?????? ???
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
`;
  content = content.replace(
    /\{\/\* TAB 6: AI SETTINGS \*\/\}/,
    publisherJSX + "\n      {/* TAB 6: AI SETTINGS */}"
  );
}

fs.writeFileSync("src/components/AdminDashboard.jsx", content);
console.log("AdminDashboard updated.");

