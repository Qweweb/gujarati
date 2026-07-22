# -*- coding: utf-8 -*-
import urllib.request
import re

url = "https://www.vtvgujarati.com/news-details/gujarat-225-taluka-rainfall-last-24-hours"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8', errors='replace')
        print("Fetched VTV successfully. Length:", len(html))
        
        # Search for datePublished or dateCreated anywhere in the HTML
        dates = re.findall(r'"datePublished"\s*:\s*"([^"]+)"', html)
        created = re.findall(r'"dateCreated"\s*:\s*"([^"]+)"', html)
        modified = re.findall(r'"dateModified"\s*:\s*"([^"]+)"', html)
        upload = re.findall(r'"uploadDate"\s*:\s*"([^"]+)"', html)
        
        print("datePublished found:", dates)
        print("dateCreated found:", created)
        print("dateModified found:", modified)
        print("uploadDate found:", upload)
except Exception as e:
    print("Error:", e)
