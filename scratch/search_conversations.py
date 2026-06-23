import os
import json
import glob

brain_dir = r"C:\Users\alpha\.gemini\antigravity\brain"
print(f"Searching in: {brain_dir}")

# Look for transcript.jsonl files
pattern = os.path.join(brain_dir, "**", ".system_generated", "logs", "transcript*.jsonl")
files = glob.glob(pattern, recursive=True)

print(f"Found {len(files)} transcript files.")

target_words = ["scramble", "coupon", "કુપન", "કૂપન", "login"]

for f in files:
    try:
        with open(f, "r", encoding="utf-8", errors="ignore") as file:
            for line in file:
                if any(word in line.lower() for word in target_words):
                    try:
                        data = json.loads(line)
                        if data.get("type") == "USER_INPUT":
                            print(f"\n[File: {os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(f))))}]")
                            print(f"User Input: {data.get('content')}")
                        elif data.get("type") == "PLANNER_RESPONSE":
                            # Check tool calls
                            tc = data.get("tool_calls", [])
                            for c in tc:
                                if "replace_file_content" in c.get("name", ""):
                                    print(f"Edit File: {c.get('arguments', {}).get('TargetFile')}")
                    except Exception as je:
                        pass
    except Exception as e:
        print(f"Error reading {f}: {e}")
