from PIL import Image
import os

images = ['rickshaw.png', 'st_bus.png', 'car.png', 'cow.png']

for img_name in images:
    if os.path.exists(img_name):
        img = Image.open(img_name).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(img_name, "PNG")
        print(f"Processed {img_name}")
    else:
        print(f"Missing {img_name}")
