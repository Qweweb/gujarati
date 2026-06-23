import json

transcript_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript.jsonl"

print("Searching transcript for modifications...")

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            tool_calls = step.get('tool_calls', [])
            for call in tool_calls:
                name = call.get('name')
                args = call.get('args', {})
                # Check for replace_file_content or write_to_file
                target = args.get('TargetFile', '') or args.get('AbsolutePath', '')
                if 'Dashboard.jsx' in target or 'AdminDashboard.jsx' in target:
                    print(f"--- TOOL CALL: {name} on {target} ---")
                    # print description/instruction
                    if 'Instruction' in args:
                        print("Instruction:", args['Instruction'])
                    if 'Description' in args:
                        print("Description:", args['Description'])
                    # If it's a replacement, print target and replacement content
                    if 'ReplacementContent' in args:
                        print("Replacement Content length:", len(args['ReplacementContent']))
                    elif 'CodeContent' in args:
                        print("Code Content length:", len(args['CodeContent']))
                    elif 'ReplacementChunks' in args:
                        print("Replacement chunks count:", len(args['ReplacementChunks']))
        except Exception as e:
            pass
