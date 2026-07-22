# -*- coding: utf-8 -*-
import urllib.request
import re

url = "https://sandesh.com/gujarat/news/ahmedabad/ashwini-vaishnaw-ahmedabad-visit-sanand-semiconductor-plant-omnagar-underpass-bullet-train-progress"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("Fetched successfully. Length:", len(html))
        
        # Look for published time strings
        # E.g. Published: Jul 04, 2026 11:58 am
        pub_times = re.findall(r'Published:\s*([^<]+)', html)
        print("Regex matches for Published:", pub_times)
        
        # Check standard json-ld schema
        json_ld = re.findall(r'type="application/ld\+json">({.*?})</script>', html, re.DOTALL)
        print("Found JSON-LD blocks:", len(json_ld))
        for idx, jl in enumerate(json_ld):
            if "datePublished" in jl:
                print(f"Block {idx} datePublished:")
                print(re.findall(r'"datePublished"\s*:\s*"([^"]+)"', jl))
                print(re.findall(r'"dateModified"\s*:\s*"([^"]+)"', jl))
except Exception as e:
    print("Error:", e)
