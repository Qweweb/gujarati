import os
import json
from datetime import datetime

def main():
    brain_dir = r"C:\Users\alpha\.gemini\antigravity\brain"
    out_path = r"C:\Users\alpha\.gemini\antigravity\brain\219d488e-2e6d-45c6-adb8-27775e7b526b\scratch\recent_user_prompts.txt"
    
    print("Searching for recent user inputs...")
    
    prompts = []
    
    for folder_name in os.listdir(brain_dir):
        folder_path = os.path.join(brain_dir, folder_name)
        if not os.path.isdir(folder_path):
            continue
            
        logs_dir = os.path.join(folder_path, ".system_generated", "logs")
        if not os.path.exists(logs_dir):
            continue
            
        for file_name in ["transcript.jsonl", "transcript_full.jsonl"]:
            file_path = os.path.join(logs_dir, file_name)
            if not os.path.exists(file_path):
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line_num, line in enumerate(f, 1):
                        obj = json.loads(line)
                        if obj.get('type') == "USER_INPUT":
                            content = obj.get('content', '')
                            # Extract timestamp or date if possible
                            # We can also get the folder creation/modification time
                            mtime = os.path.getmtime(file_path)
                            dt = datetime.fromtimestamp(mtime)
                            prompts.append({
                                'folder': folder_name,
                                'file': file_name,
                                'line': line_num,
                                'content': content,
                                'date': dt
                            })
                            # We only need one entry per unique user input per folder
                            break
            except Exception as e:
                pass
                
    # Sort prompts by date descending
    prompts.sort(key=lambda x: x['date'], reverse=True)
    
    with open(out_path, 'w', encoding='utf-8') as out:
        for p in prompts[:30]: # print most recent 30 conversations
            out.write(f"Folder: {p['folder']} ({p['date'].strftime('%Y-%m-%d %H:%M:%S')})\n")
            out.write(f"User Input: {p['content'].strip()}\n")
            out.write("=" * 80 + "\n")
            
    print(f"Done. Output written to {out_path}")

if __name__ == '__main__':
    main()
