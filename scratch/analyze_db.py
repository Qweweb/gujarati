# -*- coding: utf-8 -*-
import re

with open("scratch/db.html", "r", encoding="utf-8") as f:
    html = f.read()

# Divya Bhaskar news links contain /news- or end with .html or similar
urls = re.findall(r'href="([^"]+\.html)"', html)
urls_single = re.findall(r"href='([^']+\.html)'", html)
all_urls = set(urls + urls_single)
print("Divya Bhaskar Morbi and Kutch URLs found:")
for u in sorted(all_urls):
    if "morbi" in u or "kutch" in u or "bhuj" in u:
        print(" -", u)
