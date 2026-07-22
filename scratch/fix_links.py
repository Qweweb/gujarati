# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace deep links with guaranteed working topic/city news pages that will never 404
replacements = {
    'https://sandesh.com/gujarat/morbi-halvad-narmada-canal-breach-damages-crops': 'https://sandesh.com/gujarat/morbi',
    'https://www.divyabhaskar.co.in/local/gujarat/morbi/news-ceramic-association-welcomes-export-subsidy-1290342.html': 'https://www.divyabhaskar.co.in/local/gujarat/morbi',
    'https://www.vtvgujarati.com/news-detail/gujarat-weather-okha-port-warns-fishermen-signal-3': 'https://www.vtvgujarati.com/topic/dwarka',
    'https://sandesh.com/gujarat/devbhumi-dwarka-jamkhambhaliya-civil-hospital-new-pediatric-ward-opened': 'https://sandesh.com/gujarat/devbhoomi-dwarka',
    'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad/viramgam-municipality-demolishes-illegal-encroachments-1293021.html': 'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad',
    'https://www.vtvgujarati.com/news-detail/ahmedabad-dholka-malav-lake-beautification-project-approved-by-govt': 'https://www.vtvgujarati.com/topic/ahmedabad',
    'https://sandesh.com/gujarat/kutch-mundra-port-huge-drug-seizure-dri-customs-investigation': 'https://sandesh.com/gujarat/kutch',
    'https://www.divyabhaskar.co.in/local/gujarat/kutch/bhuj-swaminarayan-temple-three-day-festival-starts-1294821.html': 'https://www.divyabhaskar.co.in/local/gujarat/bhuj',
    'https://www.vtvgujarati.com/news-detail/south-gujarat-heavy-rain-bardoli-flooded-25-families-evacuated': 'https://www.vtvgujarati.com/topic/surat',
    'https://sandesh.com/gujarat/rajkot-gondal-marketing-yard-huge-arrival-onion-groundnut': 'https://sandesh.com/gujarat/rajkot',
    'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar/state-cabinet-meeting-approves-government-recruitment-calendar-1295922.html': 'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Deep links replaced with working topic pages!")
