# -*- coding: utf-8 -*-
import re

with open("scratch/vtv.html", "r", encoding="utf-8") as f:
    html = f.read()

urls = re.findall(r'href="([^"]*news-detail[^"]*)"', html)
urls_single = re.findall(r"href='([^']*news-detail[^']*)'", html)
all_vtv = set(urls + urls_single)
print("VTV Detail URLs found:", len(all_vtv))
for u in sorted(all_vtv)[:15]:
    print(" -", u)
