import re
import json
import random

with open('src/data/gamesDatabase.js', 'r', encoding='utf-8') as f:
    text = f.read()

def extract_array(var_name):
    match = re.search(f'export const {var_name} = \\[(.*?)\\];', text, re.DOTALL)
    if not match: return []
    # Because it's JS objects, we need to convert to JSON. 
    # This is tricky in Python. Instead, I'll just use node to write a proper JS extractor file.
    return []
