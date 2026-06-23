transcript_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript_full.jsonl"

with open(transcript_path, 'rb') as f:
    data = f.read(100)
    print("Raw bytes of transcript_full.jsonl:", data)
    
    # Check if there are non-zero bytes in the file
    non_zero = False
    f.seek(0)
    chunk = f.read(4096)
    while chunk:
        if any(b != 0 for b in chunk):
            non_zero = True
            break
        chunk = f.read(4096)
    print("Has non-zero bytes:", non_zero)
