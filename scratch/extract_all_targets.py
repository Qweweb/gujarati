import json

transcript_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            tool_calls = step.get('tool_calls', [])
            for call in tool_calls:
                name = call.get('name')
                args = call.get('args', {})
                target = args.get('TargetFile', '') or args.get('AbsolutePath', '') or args.get('Target', '')
                if target:
                    print(f"Tool: {name} -> Target: {target}")
        except Exception as e:
            pass
