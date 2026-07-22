# -*- coding: utf-8 -*-
import urllib.request

url = "https://sandesh.com/gujarat"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("Success! FEtched sandesh/gujarat. Length:", len(html))
        with open("scratch/sandesh_gujarat.html", "w", encoding="utf-8") as f:
            f.write(html)
except Exception as e:
    print("Error:", e)
