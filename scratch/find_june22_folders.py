import os
import json
from datetime import datetime

def main():
    brain_dir = r"C:\Users\alpha\.gemini\antigravity\brain"
    
    print("Folders in brain directory details:")
    folders = []
    
    for name in os.listdir(brain_dir):
        path = os.path.join(brain_dir, name)
        if not os.path.isdir(path):
            continue
            
        # Get creation/modification time of the folder
        stat = os.stat(path)
        mtime = datetime.fromtimestamp(stat.st_mtime)
        ctime = datetime.fromtimestamp(stat.st_ctime)
        
        # Read the first user prompt
        first_prompt = "None"
        logs_dir = os.path.join(path, ".system_generated", "logs")
        if os.path.exists(logs_dir):
            trans_path = os.path.join(logs_dir, "transcript.jsonl")
            if os.path.exists(trans_path):
                try:
                    with open(trans_path, 'r', encoding='utf-8', errors='ignore') as f:
                        for line in f:
                            obj = json.loads(line)
                            if obj.get('type') == "USER_INPUT":
                                first_prompt = obj.get('content', '').strip()[:100]
                                break
                except:
                    pass
                    
        folders.append({
            'name': name,
            'mtime': mtime,
            'ctime': ctime,
            'first_prompt': first_prompt
        })
        
    # Sort folders by mtime descending
    folders.sort(key=lambda x: x['mtime'], reverse=True)
    
    for f in folders[:15]:
        print(f"\nFolder: {f['name']}")
        print(f"  Created: {f['ctime'].strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Modified: {f['mtime'].strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  First Prompt: {f['first_prompt']}")
        
if __name__ == '__main__':
    main()
