from PIL import Image

def analyze():
    img = Image.open(r"C:\Users\alpha\.gemini\antigravity\brain\6a22e19b-8d95-4c14-a5bc-ca000c4a7f96\media__1783063574005.png")
    w, h = img.size
    print(f"Screenshot size: {w}x{h}")
    
    # 1. Let's find the card boundaries.
    # The card background is dark green. The outer background of the page is light grey/white (#f5f5f4).
    # Let's scan from the middle horizontally to find the left and right card edges.
    mid_y = h // 2
    left_edge = None
    right_edge = None
    
    # Find left edge
    for x in range(10, w - 10):
        r, g, b = img.getpixel((x, mid_y))[:3]
        # Dark green template has low R and B, medium G
        if r < 30 and g > 25 and b < 30:
            left_edge = x
            break
            
    # Find right edge
    for x in range(w - 10, 10, -1):
        r, g, b = img.getpixel((x, mid_y))[:3]
        if r < 30 and g > 25 and b < 30:
            right_edge = x
            break
            
    # Find top and bottom edges in the middle X
    mid_x = (left_edge + right_edge) // 2
    top_edge = None
    bottom_edge = None
    
    for y in range(10, h - 10):
        r, g, b = img.getpixel((mid_x, y))[:3]
        if r < 30 and g > 25 and b < 30:
            top_edge = y
            break
            
    for y in range(h - 10, 10, -1):
        r, g, b = img.getpixel((mid_x, y))[:3]
        if r < 30 and g > 25 and b < 30:
            bottom_edge = y
            break
            
    print(f"Card bounds in screenshot: Left={left_edge}, Right={right_edge}, Top={top_edge}, Bottom={bottom_edge}")
    card_w = right_edge - left_edge
    card_h = bottom_edge - top_edge
    print(f"Card dimensions: {card_w}x{card_h} (Aspect ratio: {card_h/card_w:.3f})")
    
    # 2. Find the white circle (the avatar photo, which has white pixels at its border/background or grey/peacock colors)
    # The peacock logo is centered at some point. The avatar has a circular background which is white (#ffffff) or grey/light-green.
    # Let's search inside the bottom-left of the card: X: left_edge to left_edge + card_w/2, Y: top_edge + card_h*0.7 to bottom_edge
    # Find white/light pixels corresponding to the avatar background.
    avatar_pixels = []
    for y in range(int(top_edge + card_h*0.7), bottom_edge):
        for x in range(left_edge, int(left_edge + card_w*0.5)):
            r, g, b = img.getpixel((x, y))[:3]
            # White background of the peacock logo or light grey border
            if r > 240 and g > 240 and b > 240:
                avatar_pixels.append((x, y))
                
    print(f"Found {len(avatar_pixels)} avatar border/bg pixels.")
    avatar_cx, avatar_cy = None, None
    avatar_r = None
    if avatar_pixels:
        xs = [p[0] for p in avatar_pixels]
        ys = [p[1] for p in avatar_pixels]
        avatar_cx = (min(xs) + max(xs)) / 2
        avatar_cy = (min(ys) + max(ys)) / 2
        avatar_r = (max(xs) - min(xs)) / 2
        print(f"Avatar Center: X={avatar_cx} (Rel: {(avatar_cx - left_edge)/card_w*100:.2f}%), Y={avatar_cy} (Rel: {(avatar_cy - top_edge)/card_h*100:.2f}%)")
        print(f"Avatar Radius: {avatar_r} (Rel: {avatar_r/card_w*100:.2f}%)")
        
    # 3. Find the gold circle of the template.
    # In the screenshot, the gold circle has gold pixels.
    # Let's search for gold pixels (R > 130, G > 100, B < 110, R > B + 35) in the bottom-left.
    gold_pixels = []
    for y in range(int(top_edge + card_h*0.7), bottom_edge):
        for x in range(left_edge, int(left_edge + card_w*0.5)):
            r, g, b = img.getpixel((x, y))[:3]
            if r > 130 and g > 100 and b < 110 and r > b + 35 and g > b + 25:
                gold_pixels.append((x, y))
                
    print(f"Found {len(gold_pixels)} gold pixels in bottom-left.")
    if gold_pixels:
        xs = [p[0] for p in gold_pixels]
        ys = [p[1] for p in gold_pixels]
        # Since the avatar might overlap part of the gold circle, let's look at the outer boundaries of the gold circle.
        gold_cx = (min(xs) + max(xs)) / 2
        gold_cy = (min(ys) + max(ys)) / 2
        gold_r = (max(xs) - min(xs)) / 2
        print(f"Gold Circle Center: X={gold_cx} (Rel: {(gold_cx - left_edge)/card_w*100:.2f}%), Y={gold_cy} (Rel: {(gold_cy - top_edge)/card_h*100:.2f}%)")
        print(f"Gold Circle Radius: {gold_r} (Rel: {gold_r/card_w*100:.2f}%)")
        
        # Calculate shift
        if avatar_cx and avatar_cy:
            dx = gold_cx - avatar_cx
            dy = gold_cy - avatar_cy
            print(f"Shift needed: dx={dx} pixels, dy={dy} pixels (positive means shift right/down)")
            
            # Let's calculate the relative shift in the 1080 canvas
            dx_1080 = dx / card_w * 1080
            dy_1080 = dy / card_h * 1350
            print(f"Relative shift in 1080x1350 canvas: dx={dx_1080:.1f}px, dy={dy_1080:.1f}px")

analyze()
