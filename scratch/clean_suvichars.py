# -*- coding: utf-8 -*-

file_path = r"d:\Antigravity\Gujarati\src\data\suvichars.js"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# We keep lines 1 to 101 (which contain export const SUVICHARS = [ ... and the first 100 suvichars)
# And then we append ]; to close the array properly.
cleaned_lines = lines[:101]
# Make sure the last item has no comma if we want clean JSON, but in JS it's fine.
# Let's add the closing bracket
cleaned_content = "".join(cleaned_lines).rstrip()
if not cleaned_content.endswith("]"):
    if cleaned_content.endswith(","):
        cleaned_content = cleaned_content[:-1]
    cleaned_content += "\n];\n"

with open(file_path, "w", encoding="utf-8") as f:
    f.write(cleaned_content)

print("SUCCESS: Truncated suvichars list to the 100 unique items!")
