# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace topic links with precise google search query links to find the exact article
replacements = {
    'https://sandesh.com/gujarat/morbi': 'https://www.google.com/search?q=site:sandesh.com+હળવદ+નજીક+નર્મદા+કેનાલમાં+ગાબડું+કપાસ',
    'https://www.divyabhaskar.co.in/local/gujarat/morbi': 'https://www.google.com/search?q=site:divyabhaskar.co.in+મોરબી+સિરામિક+એસોસિએશન+નિકાસ+નીતિ',
    'https://www.vtvgujarati.com/topic/dwarka': 'https://www.google.com/search?q=site:vtvgujarati.com+ઓખા+પોર્ટ+૩+નંબર+સિગ્નલ',
    'https://sandesh.com/gujarat/devbhoomi-dwarka': 'https://www.google.com/search?q=site:sandesh.com+જામખંભાળિયા+સિવિલ+હોસ્પિટલ+બાળ+ચિકિત્સા',
    'https://www.divyabhaskar.co.in/local/gujarat/ahmedabad': 'https://www.google.com/search?q=site:divyabhaskar.co.in+વિરમગામ+નગરપાલિકા+ગેરકાયદે+દબાણો',
    'https://www.vtvgujarati.com/topic/ahmedabad': 'https://www.google.com/search?q=site:vtvgujarati.com+ધોળકા+મલાવ+તળાવ+બ્યુટિફિકેશન',
    'https://sandesh.com/gujarat/kutch': 'https://www.google.com/search?q=site:sandesh.com+મુન્દ્રા+કસ્ટમ્સ+પોર્ટ+ડ્રગ્સ',
    'https://www.divyabhaskar.co.in/local/gujarat/bhuj': 'https://www.google.com/search?q=site:divyabhaskar.co.in+ભુજ+સ્વામિનારાયણ+મંદિર+મહોત્સવ',
    'https://www.vtvgujarati.com/topic/surat': 'https://www.google.com/search?q=site:vtvgujarati.com+બારડોલી+વરસાદ+ખાડી+પૂર',
    'https://sandesh.com/gujarat/rajkot': 'https://www.google.com/search?q=site:sandesh.com+ગોંડલ+માર્કેટિંગ+યાર્ડ+લાલ+મરચાં',
    'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar': 'https://www.google.com/search?q=site:divyabhaskar.co.in+ગાંધીનગર+કેબિનેટ+બેઠક+સરકારી+ભરતી'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: News links updated to precise Google search queries!")
