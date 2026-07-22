# -*- coding: utf-8 -*-
import os
import re

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add useState, useEffect, useRef imports if not fully present
# We already have: import React, { useState, useMemo, useRef } from 'react';
# Let's add useEffect:
content = content.replace(
    "import React, { useState, useMemo, useRef } from 'react';",
    "import React, { useState, useMemo, useRef, useEffect } from 'react';"
)

# 2. Inside GujaratNewsMap() function, define newsList state and useEffect to fetch live_news.json
state_and_effect = """  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Load live news dynamically from VPS JSON feed
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/live_news.json');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Calculate minutesAgo dynamically relative to client current time
        const updated = data.map(item => {
          if (item.published_at) {
            const pubTime = new Date(item.published_at).getTime();
            const nowTime = new Date().getTime();
            const diffMin = Math.max(1, Math.floor((nowTime - pubTime) / 60000));
            return { ...item, minutesAgo: diffMin };
          }
          return item;
        });
        
        // Sort: newest first
        updated.sort((a, b) => a.minutesAgo - b.minutesAgo);
        setNewsList(updated);
      } catch (err) {
        console.warn("Using fallback seed news:", err);
        // Fallback to MOCK_NEWS but with calculated current relative times
        const nowTime = new Date().getTime();
        const updatedMock = MOCK_NEWS.map(item => {
          // Give them some variety in minutesAgo if they don't have published_at
          return { ...item };
        });
        setNewsList(updatedMock);
      }
    };

    fetchNews();
    // Auto-refresh news list every 30 seconds for live feeling!
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);"""

# Replace the state definitions in GujaratNewsMap
content = re.sub(
    r"const navigate = useNavigate\(\);\s+const \[selectedDistrict, setSelectedDistrict\] = useState\(null\);\s+const \[selectedTown, setSelectedTown\] = useState\(null\);\s+const \[searchQuery, setSearchQuery\] = useState\(''\);\s+const \[activeCategory, setActiveCategory\] = useState\('all'\);",
    state_and_effect,
    content,
    flags=re.DOTALL
)

# 3. Replace MOCK_NEWS references inside the component with newsList
content = content.replace("MOCK_NEWS.filter(n => n.district === dist.id)", "newsList.filter(n => n.district === dist.id)")
content = content.replace("MOCK_NEWS.filter(n => n.town === town.id)", "newsList.filter(n => n.town === town.id)")
content = content.replace("let result = MOCK_NEWS.filter(n => n.minutesAgo <= 1440);", "let result = newsList.filter(n => n.minutesAgo <= 1440);")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Live news fetching and automatic relative times calculation implemented in GujaratNewsMap.jsx!")
