# -*- coding: utf-8 -*-
import urllib.request
import re

url = "https://www.vtvgujarati.com/topic/morbi"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("Success! Page fetched, length:", len(html))
        # Find some links with /news-detail/ or /news-details/
        links = re.findall(r'href="(/news-detail[^"]+)"', html)
        print("Found news detail links:", links[:5])
except Exception as e:
    print("Error:", e)
