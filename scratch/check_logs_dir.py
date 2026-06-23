import os

def main():
    folder_path = r"C:\Users\alpha\.gemini\antigravity\brain\f937e03e-63c1-4617-ae30-f617055c8a4c"
    
    print(f"Checking path: {folder_path}")
    if not os.path.exists(folder_path):
        print("Folder does not exist!")
        return
        
    for root, dirs, files in os.walk(folder_path):
        print(f"\nDirectory: {root}")
        for d in dirs:
            print(f"  [DIR] {d}")
        for f in files:
            path = os.path.join(root, f)
            print(f"  [FILE] {f} (Size: {os.path.getsize(path)} bytes)")
            
if __name__ == '__main__':
    main()
