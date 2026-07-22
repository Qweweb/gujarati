# -*- coding: utf-8 -*-
import re

with open("scratch/vtv.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's search for some date strings or time strings on VTV homepage
# e.g., print lines containing "કલાક" (hour) or "મિનિટ" (minute) or "કલાક પહેલા"
lines = html.splitlines()
matches = 0
with open("scratch/vtv_time_matches.txt", "w", encoding="utf-8") as out_f:
    for l in lines:
        if "કલાક" in l or "મિનિટ" in l or "પહેલા" in l:
            out_f.write(l.strip()[:150] + "\n")
            matches += 1
            if matches > 100:
                break
print("SUCCESS: Matches saved to scratch/vtv_time_matches.txt")
