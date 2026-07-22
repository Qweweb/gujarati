import re

for fname in ['public/slicer.html', 'public/traffic-tod.html']:
    content = open(fname, 'r', encoding='utf-8').read()
    imgs = re.findall(r"['\"]([^\s'\"]*\.png)['\"]", content)
    print(f"\n{fname}:")
    for img in sorted(set(imgs)):
        print(f"  - {img}")
