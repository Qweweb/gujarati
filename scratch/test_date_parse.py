# -*- coding: utf-8 -*-
from datetime import datetime

date_str = "08:04 AM, 4 July 2026"

try:
    # Try parsing English format
    dt = datetime.strptime(date_str.strip(), "%I:%M %p, %d %B %Y")
    print("Parsed successfully:", dt.isoformat())
except Exception as e:
    print("Error:", e)
