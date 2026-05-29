# -*- coding: utf-8 -*-
filepath = r"d:\Antigravity\Gujarati\src\data\generateGamesDB.py"

encodings = ['utf-8', 'utf-8-sig', 'cp1252', 'latin1', 'utf-16', 'utf-16-le', 'utf-16-be']
for enc in encodings:
    try:
        with open(filepath, "r", encoding=enc) as f:
            f.read()
        print(f"Success reading with encoding: {enc}")
    except Exception as e:
        print(f"Failed with {enc}: {e}")

# Read binary context around 82884
with open(filepath, "rb") as f:
    data = f.read()
    print("File size:", len(data))
    context = data[max(0, 82880):min(len(data), 82890)]
    print("Binary context around 82884:", context)
