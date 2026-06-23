import os
import json

def main():
    folder_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c"
    out_path = r"C:\Users\alpha\.gemini\antigravity\brain\219d488e-2e6d-45c6-adb8-27775e7b526b\scratch\dumped_june22_session.txt"
    
    print("Dumping f937e03e session...")
    
    logs_dir = os.path.join(folder_path, ".system_generated", "logs")
    file_path = os.path.join(logs_dir, "transcript_full.jsonl")
    if not os.path.exists(file_path):
        file_path = os.path.join(logs_dir, "transcript.jsonl")
        
    if not os.path.exists(file_path):
        print("Transcript file not found!")
        return
        
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f, open(out_path, 'w', encoding='utf-8') as out:
        for line_num, line in enumerate(f, 1):
            try:
                obj = json.loads(line)
                type_ = obj.get('type')
                source = obj.get('source')
                
                if type_ == "USER_INPUT":
                    content = obj.get('content', '')
                    out.write(f"\n============================================================\n")
                    out.write(f"Step {obj.get('step_index')}: USER INPUT\n")
                    out.write(f"============================================================\n")
                    out.write(content + "\n")
                elif type_ == "PLANNER_RESPONSE":
                    calls = obj.get('tool_calls', [])
                    if calls:
                        out.write(f"\n--- Step {obj.get('step_index')}: Tool Calls ---\n")
                        for call in calls:
                            name = call.get('name')
                            args = call.get('args', {})
                            out.write(f"  Tool: {name}\n")
                            if 'TargetFile' in args:
                                out.write(f"    Target: {args['TargetFile']}\n")
                            if 'Description' in args:
                                out.write(f"    Description: {args['Description']}\n")
                            # If it's replace_file_content or write_to_file, let's write out the target content and replacement content if small
                            if name in ['replace_file_content', 'write_to_file', 'multi_replace_file_content']:
                                out.write(f"    Instruction: {args.get('Instruction', '')}\n")
            except Exception as e:
                pass
                
    print(f"Done. Output written to {out_path}")

if __name__ == '__main__':
    main()
