import json
import re

# Update package.json
try:
    with open('package.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    data['version'] = '1.3.32'
    with open('package.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Updated package.json to 1.3.32")
except Exception as e:
    print("Error updating package.json:", e)

# Update build.gradle
try:
    with open('android/app/build.gradle', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'versionCode \d+', 'versionCode 23', content)
    content = re.sub(r'versionName "[\d\.]+"', 'versionName "1.3.32"', content)
    
    with open('android/app/build.gradle', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated android/app/build.gradle to versionCode 23, versionName 1.3.32")
except Exception as e:
    print("Error updating build.gradle:", e)
