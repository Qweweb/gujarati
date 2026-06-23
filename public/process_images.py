from rembg import remove
from PIL import Image
import os

images = [
    'khaman.png', 'dabeli.png', 'fafda.png', 'sutli_bomb.png',
    'red_kite.png', 'blue_kite.png', 'pigeon.png'
]

for img_name in images:
    if os.path.exists(img_name):
        print(f"Processing {img_name}...")
        img = Image.open(img_name).convert("RGBA")
        
        # If the image is horizontal (wider than it is tall), rotate it to be vertical
        if img.width > img.height:
            # -90 rotates clockwise, meaning the front of a left-facing bus goes UP
            img = img.rotate(-90, expand=True)
            
        # Remove background using AI (rembg)
        output = remove(img)
        output.save(img_name, "PNG")
        print(f"Saved {img_name}")
