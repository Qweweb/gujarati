"""
Remove white/solid backgrounds from game images using PIL/Pillow.
Replaces near-white and solid-color backgrounds with transparency.
"""
from PIL import Image
import numpy as np
import os

def remove_bg(path, bg_color=(255,255,255), threshold=30, edge_feather=True):
    img = Image.open(path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Distance from background color
    dist = np.sqrt(
        (r - bg_color[0])**2 +
        (g - bg_color[1])**2 +
        (b - bg_color[2])**2
    )
    
    # Pixels close to bg color → transparent
    mask = dist < threshold
    data[:,:,3] = np.where(mask, 0, 255)
    
    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(path, "PNG")
    print(f"  OK Fixed: {os.path.basename(path)}")

def remove_magenta_bg(path):
    """Remove magenta/pink background (kago.png)"""
    img = Image.open(path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    # Magenta: high R, low G, high B
    mask = (r > 180) & (g < 100) & (b > 150)
    data[:,:,3] = np.where(mask, 0, 255)
    result = Image.fromarray(data.astype(np.uint8), "RGBA")
    result.save(path, "PNG")
    print(f"  OK Fixed: {os.path.basename(path)}")

base = "public"

# White background images (cars, buses, etc.)
white_bg_files = [
    "car.png",
    "green_car.png", 
    "white_bus.png",
    "st_bus.png",
    "rickshaw.png",
    "white_cow.png",
    "cow.png",
    "police.png",
]

print("Removing white backgrounds...")
for fname in white_bg_files:
    fpath = os.path.join(base, fname)
    if os.path.exists(fpath):
        remove_bg(fpath, bg_color=(255,255,255), threshold=25)
    else:
        print(f"  ⚠️  Not found: {fname}")
