# -*- coding: utf-8 -*-
filepath = r"d:\Antigravity\Gujarati\src\data\generateGamesDB.py"

with open(filepath, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

byte_index = 82884
char_index = len(content.encode('utf-8')[:byte_index].decode('utf-8', errors='replace'))

with open(r"d:\Antigravity\Gujarati\scratch\bad_bytes_output.txt", "w", encoding="utf-8") as out:
    out.write("Context around bad byte:\n")
    out.write(content[max(0, char_index-100):min(len(content), char_index+100)])
    out.write("\n\nRepr representation:\n")
    out.write(repr(content[max(0, char_index-100):min(len(content), char_index+100)]))

print("Diagnostics written to scratch/bad_bytes_output.txt")
