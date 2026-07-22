# -*- coding: utf-8 -*-
import urllib.request
import re

url = "https://www.vtvgujarati.com/news-details/gujarat-225-taluka-rainfall-last-24-hours"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("Fetched. Length:", len(html))
        
        # Print all lines containing 2026 or July or 2024 or similar
        lines = html.splitlines()
        print("Matching lines count:")
        matches = 0
        for l in lines:
            if "2026" in l or "July" in l or "કલાક" in l or "મિનિટ" in l:
                print(l.strip()[:150])
                matches += 1
                if matches > 20:
                    break
except Exception as e:
    print("Error:", e)
