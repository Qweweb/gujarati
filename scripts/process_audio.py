import os
import sys

def process_mp3_files():
    """
    Python script to process MP3 files:
    1. Adjusts speed / pitch
    2. Overlays subtle background drone
    """
    audio_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
    if not os.path.exists(audio_dir):
        os.makedirs(audio_dir, exist_ok=True)

    print(f"Checking for MP3 files in: {os.path.abspath(audio_dir)}")
    files = [f for f in os.listdir(audio_dir) if f.endswith('.mp3')]
    
    if not files:
        print("No MP3 files found in public/audio/ directory yet.")
        return

    print(f"Found {len(files)} MP3 files to process.")

if __name__ == '__main__':
    process_mp3_files()
