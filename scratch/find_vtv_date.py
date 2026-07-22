# -*- coding: utf-8 -*-
import re

with open("scratch/vtv_detail.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's find any timestamps or dates
# e.g., search for date/time strings or meta tags
meta_tags = re.findall(r'<meta[^>]*>', html)
print("Total meta tags:", len(meta_tags))

with open("scratch/vtv_detail_dates.txt", "w", encoding="utf-8") as out_f:
    out_f.write("=== META TAGS ===\n")
    for m in meta_tags:
        if "time" in m or "date" in m or "publish" in m or "modified" in m:
            out_f.write(m + "\n")
            
    out_f.write("\n=== TEXT MATCHES ===\n")
    lines = html.splitlines()
    for l in lines:
        if "કલાક" in l or "મિનિટ" in l or "July" in l or "2026" in l:
            out_f.write(l.strip()[:150] + "\n")

print("SUCCESS: Matches saved to scratch/vtv_detail_dates.txt")
