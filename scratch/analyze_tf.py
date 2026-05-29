import re
import json

filepath = r"d:\Antigravity\Gujarati\src\data\gamesDatabase.js"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r"export const TRUE_FALSE_DB = \[(.*?)\];", content, re.DOTALL)
if not match:
    match = re.search(r"export const TRUE_FALSE_DB = \[(.*?)\]", content, re.DOTALL)

if match:
    db_str = "[" + match.group(1) + "]"
    cleaned_str = db_str.strip()
    cleaned_str = re.sub(r',\s*\]', ']', cleaned_str)
    cleaned_str = re.sub(r',\s*\}', '}', cleaned_str)
    
    try:
        db = json.loads(cleaned_str)
        
        with open(r"d:\Antigravity\Gujarati\scratch\tf_output.txt", "w", encoding="utf-8") as out:
            out.write(f"Total loaded: {len(db)}\n")
            
            # Print first 60 questions
            out.write("\nFirst 70 questions in database:\n")
            for idx, entry in enumerate(db[:70]):
                statement = entry.get("statement", "")
                ans = entry.get("answer", "")
                out.write(f"{idx+1}. ID: {entry.get('id')} | Ans: {ans} | Statement: {statement}\n")
                
            # Count duplicate statements after stripping prefixes
            stripped_counts = {}
            for entry in db:
                statement = entry.get("statement", "")
                # Strip "ગુજરાત પ્રદેશ સંબંધિત પ્રશ્ન ક્રમાંક XX: "
                stripped = re.sub(r"ગુજરાત પ્રદેશ સંબંધિત પ્રશ્ન ક્રમાંક \d+:\s*", "", statement)
                stripped_counts[stripped] = stripped_counts.get(stripped, 0) + 1
                
            out.write(f"\nUnique core statements (stripped): {len(stripped_counts)}\n")
            out.write("\nCore statements appearing more than once:\n")
            for s, count in stripped_counts.items():
                if count > 1:
                    out.write(f"- {s} (appears {count} times)\n")
                    
        print("Analysis completed successfully! Saved to scratch/tf_output.txt")
    except Exception as e:
        print("Error parsing JSON:", e)
else:
    print("Could not find TRUE_FALSE_DB array")
