import json

map_db = [
    {"id": "m1", "name": "અમદાવાદ (Ahmedabad)", "correctDir": "East"},
    {"id": "m2", "name": "સુરત (Surat)", "correctDir": "South"},
    {"id": "m3", "name": "વડોદરા (Vadodara)", "correctDir": "East"},
    {"id": "m4", "name": "રાજકોટ (Rajkot)", "correctDir": "West"},
    {"id": "m5", "name": "ભાવનગર (Bhavnagar)", "correctDir": "West"},
    {"id": "m6", "name": "જામનગર (Jamnagar)", "correctDir": "West"},
    {"id": "m7", "name": "જૂનાગઢ (Junagadh)", "correctDir": "West"},
    {"id": "m8", "name": "ગાંધીનગર (Gandhinagar)", "correctDir": "East"},
    {"id": "m9", "name": "બનાસકાંઠા (Banaskantha)", "correctDir": "North"},
    {"id": "m10", "name": "સાબરકાંઠા (Sabarkantha)", "correctDir": "North"},
    {"id": "m11", "name": "મહેસાણા (Mehsana)", "correctDir": "North"},
    {"id": "m12", "name": "પાટણ (Patan)", "correctDir": "North"},
    {"id": "m13", "name": "અરવલ્લી (Aravalli)", "correctDir": "North"},
    {"id": "m14", "name": "ખેડા (Kheda)", "correctDir": "East"},
    {"id": "m15", "name": "આણંદ (Anand)", "correctDir": "East"},
    {"id": "m16", "name": "પંચમહાલ (Panchmahal)", "correctDir": "East"},
    {"id": "m17", "name": "મહીસાગર (Mahisagar)", "correctDir": "East"},
    {"id": "m18", "name": "દાહોદ (Dahod)", "correctDir": "East"},
    {"id": "m19", "name": "સુરેન્દ્રનગર (Surendranagar)", "correctDir": "West"},
    {"id": "m20", "name": "મોરબી (Morbi)", "correctDir": "West"},
    {"id": "m21", "name": "અમરેલી (Amreli)", "correctDir": "West"},
    {"id": "m22", "name": "પોરબંદર (Porbandar)", "correctDir": "West"},
    {"id": "m23", "name": "ગીર સોમનાથ (Gir Somnath)", "correctDir": "West"},
    {"id": "m24", "name": "બોટાદ (Botad)", "correctDir": "West"},
    {"id": "m25", "name": "દેવભૂમિ દ્વારકા (Devbhumi Dwarka)", "correctDir": "West"},
    {"id": "m26", "name": "ભરૂચ (Bharuch)", "correctDir": "South"},
    {"id": "m27", "name": "નર્મદા (Narmada)", "correctDir": "South"},
    {"id": "m28", "name": "તાપી (Tapi)", "correctDir": "South"},
    {"id": "m29", "name": "નવસારી (Navsari)", "correctDir": "South"},
    {"id": "m30", "name": "ડાંગ (Dang)", "correctDir": "South"},
    {"id": "m31", "name": "વલસાડ (Valsad)", "correctDir": "South"},
    {"id": "m32", "name": "છોટાઉદેપુર (Chhota Udaipur)", "correctDir": "East"},
    {"id": "m33", "name": "કચ્છ (Kutch)", "correctDir": "North"}
]

with open('src/data/gamesDatabase.js', 'a', encoding='utf-8') as f:
    f.write('\nexport const MAP_DB = ' + json.dumps(map_db, ensure_ascii=False, indent=2) + ';\n')

print('Appended MAP_DB')
