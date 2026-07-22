# -*- coding: utf-8 -*-
import urllib.request
import re

sites = {
    "vtv": "https://www.vtvgujarati.com",
    "sandesh": "https://sandesh.com"
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for name, url in sites.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8', errors='replace')
            print(f"--- {name.upper()} ---")
            print("Fetched successfully. Length:", len(html))
            
            with open(f"scratch/{name}.html", "w", encoding="utf-8") as out_f:
                out_f.write(html)
            print(f"Saved html to scratch/{name}.html")
    except Exception as e:
        print(f"Error on {name}: {e}")
