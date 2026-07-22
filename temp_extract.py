import zipfile, io, os

file_path = r'D:\Antigravity\USB Security\xxx\com.ecffri.arrows_0.19.1-1910_2arch_0fdae4bb707c0d2d005432d5d888d339_apkmirror.com.apkm'
out_dir = r'D:\Antigravity\Gujarati\scratch\arrows_apk'
os.makedirs(out_dir, exist_ok=True)

with zipfile.ZipFile(file_path) as z:
    base_apk_data = z.read('base.apk')
    
    with zipfile.ZipFile(io.BytesIO(base_apk_data)) as base_z:
        # Extract everything
        base_z.extractall(out_dir)
        print('Extracted base.apk to', out_dir)
