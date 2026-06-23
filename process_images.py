import sys
from PIL import Image

def remove_bg_and_crop():
    # Paths
    khaman_path = r"C:\Users\alpha\.gemini\antigravity\brain\e7c2a1d5-7cd4-416e-abab-ca768a66cf66\media__1781173412080.png"
    jalebi_path = r"C:\Users\alpha\.gemini\antigravity\brain\e7c2a1d5-7cd4-416e-abab-ca768a66cf66\media__1781173517824.png"
    out_dir = r"d:\Antigravity\Gujarati\public\gods"

    try:
        # Process Jalebi (White Background)
        img_j = Image.open(jalebi_path).convert("RGBA")
        data_j = img_j.getdata()
        new_data_j = []
        for item in data_j:
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data_j.append((255, 255, 255, 0))
            else:
                new_data_j.append(item)
        img_j.putdata(new_data_j)
        bbox = img_j.getbbox()
        if bbox:
            img_j = img_j.crop(bbox)
        img_j.save(out_dir + r"\jalebi.png", "PNG")
        print("Jalebi processed.")

        # Process Khaman (Beige Background)
        img_k = Image.open(khaman_path).convert("RGBA")
        # Crop the bottom khaman piece (approx coordinates based on a 4-piece stack)
        w, h = img_k.size
        # The text is at the bottom, the 4 pieces are in the middle. The bottom piece is roughly the bottom-center of the food cluster.
        # Let's crop manually around the bottom piece to remove the others and the text.
        # The image is probably ~800x600 or 1200x800.
        # We will just remove the background first
        data_k = img_k.getdata()
        new_data_k = []
        # Beige bg is around R:245 G:228 B:210. Text is dark green.
        for item in data_k:
            r, g, b, a = item
            # Background tolerance
            if r > 230 and g > 210 and b > 190 and abs(r-g)<30 and abs(g-b)<30:
                new_data_k.append((255, 255, 255, 0))
            # Text is dark green: R<50, G>50, B<50
            elif r < 60 and g > 60 and g < 150 and b < 60:
                new_data_k.append((255, 255, 255, 0))
            else:
                new_data_k.append(item)
        img_k.putdata(new_data_k)
        
        # Now we have the 4 pieces. The user said "use 1 piece".
        # We can crop the bottom 40% of the non-transparent area, which should isolate the bottom piece.
        bbox = img_k.getbbox()
        if bbox:
            img_k = img_k.crop(bbox)
            w, h = img_k.size
            # Crop the bottom-most piece (roughly bottom half, middle width)
            bottom_piece = img_k.crop((w*0.2, h*0.5, w*0.8, h))
            bbox2 = bottom_piece.getbbox()
            if bbox2:
                bottom_piece = bottom_piece.crop(bbox2)
            bottom_piece.save(out_dir + r"\khaman.png", "PNG")
            print("Khaman processed.")
            
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    remove_bg_and_crop()
