# -*- coding: utf-8 -*-
import urllib.request

url = "https://www.vtvgujarati.com/news-details/gujarat-225-taluka-rainfall-last-24-hours"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("SUCCESS! Fetched VTV details page. Length:", len(html))
        with open("scratch/vtv_detail.html", "w", encoding="utf-8") as f:
            f.write(html)
except Exception as e:
    print("Error:", e)
