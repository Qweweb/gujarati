def main():
    file_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c\.system_generated\logs\transcript.jsonl"
    
    with open(file_path, 'rb') as f:
        data = f.read(200)
        print("Hex:", data.hex())
        print("Raw:", repr(data))
        
        # Try decoding in different formats
        for enc in ['utf-8', 'utf-16', 'utf-16le', 'utf-16be', 'utf-8-sig']:
            try:
                print(f"{enc}: {data.decode(enc)[:100]}")
            except Exception as e:
                print(f"{enc} failed: {e}")

if __name__ == '__main__':
    main()
