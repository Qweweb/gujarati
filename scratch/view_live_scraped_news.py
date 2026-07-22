# -*- coding: utf-8 -*-
import urllib.request
import json

url = "https://gujaratiapp.in/live_news.json"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as response:
        content = response.read().decode('utf-8', errors='replace')
        data = json.loads(content)
        
        with open("scratch/live_scraped_news_view.txt", "w", encoding="utf-8") as f:
            f.write(f"Total articles: {len(data)}\n\n")
            for item in data:
                f.write(f"ID: {item['id']}\n")
                f.write(f"Source: {item['source']}\n")
                f.write(f"Title: {item['title']}\n")
                f.write(f"Published At: {item.get('published_at')}\n")
                f.write(f"District: {item.get('district')}\n")
                f.write(f"Town: {item.get('town')}\n")
                f.write(f"Link: {item.get('link')}\n")
                f.write("-" * 50 + "\n")
        print("SUCCESS! News saved to scratch/live_scraped_news_view.txt")
except Exception as e:
    print("Error:", e)
