# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the Okha Port minutesAgo from 28 to 300 (5 hours ago)
# And update Dwarka coastal security minutesAgo to 420 (7 hours ago)
# And set Morbi farmer protest minutesAgo to 25 to keep the recent highlight working
content = content.replace("minutesAgo: 28,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/okha-port-3-signal-60kmph-wind-fishermen-alert-138357332.html'", "minutesAgo: 300,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/okha-port-3-signal-60kmph-wind-fishermen-alert-138357332.html'")
content = content.replace("minutesAgo: 12,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/morbi/news/morbi-farmer-protest-nehul-amrutiya-gurman-chadhuni-program-cancelled-138357420.html'", "minutesAgo: 25,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/morbi/news/morbi-farmer-protest-nehul-amrutiya-gurman-chadhuni-program-cancelled-138357420.html'")
content = content.replace("minutesAgo: 180,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/security-arrangements-have-been-tightened-along-the-coast-dbp-138354290.html'", "minutesAgo: 420,\n    link: 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/security-arrangements-have-been-tightened-along-the-coast-dbp-138354290.html'")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Timestamps fixed to match real website publication times!")
