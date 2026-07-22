# -*- coding: utf-8 -*-
import os

file_path = r"d:\Antigravity\Gujarati\src\components\GujaratNewsMap.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace endpoint from live_news.json to news_api.php
content = content.replace("fetch('/live_news.json')", "fetch('/news_api.php')")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Endpoint updated to news_api.php in GujaratNewsMap.jsx!")
