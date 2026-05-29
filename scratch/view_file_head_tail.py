# -*- coding: utf-8 -*-
filepath = r"d:\Antigravity\Gujarati\src\data\generateGamesDB.py"

with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

bad_chars = [i for i, c in enumerate(content) if c == '\ufffd']
print("Found", len(bad_chars), "bad character(s) at positions:", bad_chars)

with open(r"d:\Antigravity\Gujarati\scratch\file_structure.txt", "w", encoding="utf-8") as out:
    out.write(f"File character length: {len(content)}\n")
    out.write(f"Number of invalid chars: {len(bad_chars)}\n")
    if bad_chars:
        out.write("Invalid chars locations and context:\n")
        for pos in bad_chars:
            out.write(f"- Position {pos}: {repr(content[max(0, pos-40):pos+40])}\n")

print("Diagnostics written to scratch/file_structure.txt")
