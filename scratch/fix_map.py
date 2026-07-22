# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

print(f"File exists: {os.path.exists(file_path)}")
if os.path.exists(file_path):
    print(f"File size: {os.path.getsize(file_path)} bytes")

encodings = ['utf-8', 'utf-8-sig', 'windows-1252', 'utf-16', 'utf-16-le', 'utf-16-be', 'latin-1', 'cp1252']

for enc in encodings:
    try:
        with open(file_path, "r", encoding=enc) as f:
            content = f.read()
        print(f"SUCCESS with {enc}: Read first 50 chars: {content[:50]}")
        
        # Perform replacement
        target = 'bg-stone-850 text-white text-[7px]'
        replacement = 'bg-stone-900 text-white text-[9px]'
        
        if target in content:
            content = content.replace(target, replacement)
            content = content.replace('rounded opacity-0 group-hover:opacity-100', 'rounded-lg opacity-0 group-hover:opacity-100 border border-stone-800')
            with open(file_path, "w", encoding=enc) as f:
                f.write(content)
            print("SUCCESS: Tooltip patch written!")
        else:
            print("Target not found.")
        break
    except Exception as e:
        print(f"FAILED with {enc}: {e}")
