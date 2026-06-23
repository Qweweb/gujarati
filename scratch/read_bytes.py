transcript_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'rb') as f:
    data = f.read(100)
    print("Raw bytes:", data)
    print("Decoded as utf-16:", data.decode('utf-16', errors='ignore'))
