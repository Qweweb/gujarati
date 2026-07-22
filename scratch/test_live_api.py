# -*- coding: utf-8 -*-
import urllib.request
import json

url = "https://gujaratiapp.in/news_api.php"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as response:
        content = response.read().decode('utf-8', errors='replace')
        data = json.loads(content)
        print("SUCCESS! news_api.php responded with JSON array.")
        print("Total articles fetched:", len(data))
        for item in data[:3]:
            print(f" - [{item['source']}] {item['title']} (Location: {item.get('district')}, Link: {item.get('link')})")
except Exception as e:
    print("Error calling news_api.php:", e)
