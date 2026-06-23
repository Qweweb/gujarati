import json

transcript_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for i in range(5):
        line = f.readline()
        if not line:
            break
        print(f"--- LINE {i} ---")
        try:
            data = json.loads(line)
            print(list(data.keys()))
            if 'tool_calls' in data:
                print("tool_calls:", len(data['tool_calls']))
            else:
                # print snippet of data
                print(str(data)[:200])
        except Exception as e:
            print("Error loading json:", e)
            print(line[:200])
