# -*- coding: utf-8 -*-
import re

with open("scratch/sandesh_gujarat.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find all hrefs on Sandesh
urls = re.findall(r'href="([^"]+)"', html)
urls_single = re.findall(r"href='([^']+)'", html)
all_urls = set(urls + urls_single)
print("Sandesh URLs found:", len(all_urls))
for u in sorted(all_urls):
    if "/gujarat/" in u or "/national/" in u or "/world/" in u or "/sports/" in u:
        print(" -", u)
