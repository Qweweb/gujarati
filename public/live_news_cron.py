# -*- coding: utf-8 -*-
import urllib.request
import re
import json
import os
from datetime import datetime, timezone, timedelta

# 33 Districts of Gujarat keywords
DISTRICT_KEYWORDS = {
    'kutch': ['કચ્છ', 'ભુજ', 'ગાંધીધામ', 'અંજાર', 'મુન્દ્રા', 'માંડવી', 'રાપર', 'ભચાઉ', 'નખત્રાણા'],
    'banaskantha': ['બનાસકાંઠા', 'પાલનપુર', 'ડીસા', 'થરાદ', 'વાવ', 'દાંતા', 'અમીરગઢ', 'દિયોદર', 'ભાભર'],
    'patan': ['પાટણ', 'સિદ્ધપુર', 'હારીજ', 'ચાણસ્મા', 'રાધનપુર', 'શંખેશ્વર'],
    'mehsana': ['મહેસાણા', 'વિસનગર', 'કડી', 'ઊંઝા', 'ખેરાલુ', 'બેચરાજી'],
    'sabarkantha': ['સાબરકાંઠા', 'હિંમતનગર', 'ઇડર', 'પ્રાંતિજ', 'તલોદ', 'ખેડબ્રહ્મા'],
    'aravalli': ['અરવલ્લી', 'મોડાસા', 'બાયડ', 'મેઘરજ', 'માલપુર', 'ભિલોડા'],
    'gandhinagar': ['ગાંધીનગર', 'કલોલ', 'દહેગામ', 'માણસા'],
    'morbi': ['મોરબી', 'હળવદ', 'વાંકાનેર', 'ટંકારા', 'માળિયા'],
    'surendranagar': ['સુરેન્દ્રનગર', 'વઢવાણ', 'ધ્રાંગધ્રા', 'લીંબડી', 'ચોટીલા', 'સાયલા', 'થાનગઢ'],
    'rajkot': ['રાજકોટ', 'ગોંડલ', 'જેતપુર', 'ધોરાજી', 'ઉપલેટા', 'જસદણ', 'પડધરી'],
    'jamnagar': ['જામનગર', 'ધ્રોલ', 'જોડિયા', 'કાલાવડ', 'લાલપુર'],
    'dwarka': ['દ્વારકા', 'ખંભાળિયા', 'ઓખા', 'કલ્યાણપુર', 'ભાણવડ'],
    'porbandar': ['પોરબંદર', 'રાણાવાવ', 'કુતિયાણા'],
    'junagadh': ['જૂનાગઢ', 'કેશોદ', 'માંગરોળ', 'માણાવદર', 'વિસાવદર', 'વંથલી'],
    'somnath': ['સોમનાથ', 'વેરાવળ', 'કોડીનાર', 'તાલાલા', 'સુત્રાપાડા', 'ઉના'],
    'amreli': ['અમરેલી', 'બાબરા', 'લાઠી', 'સાવરકુંડલા', 'રાજુલા', 'જાફરાબાદ', 'ધારી'],
    'bhavnagar': ['ભાવનગર', 'મહુવા', 'પાલિતાણા', 'તળાજા', 'ગારિયાધાર', 'શિહોર', 'વલ્લભીપુર'],
    'botad': ['બોટાદ', 'ગઢડા', 'બરવાળા', 'રાણપુર'],
    'ahmedabad': ['અમદાવાદ', 'વિરમગામ', 'ધોળકા', 'ધંધુકા', 'સાણંદ', 'બાવળા', 'દસ્ક્રોઈ'],
    'kheda': ['ખેડા', 'નડિયાદ', 'કપડવંજ', 'મહુધા', 'ડાકોર', 'ઠાસરા'],
    'anand': ['આણંદ', 'બોરસદ', 'પેટલાદ', 'ખંભાત', 'ઉમરેઠ', 'તારાપુર'],
    'vadodara': ['વડોદરા', 'ડભોઈ', 'કરજણ', 'પાદરા', 'વાઘોડિયા', 'સાવલી'],
    'panchmahal': ['પંચમહાલ', 'ગોધરા', 'હાલોલ', 'કાલોલ', 'શહેરા'],
    'dahod': ['દાહદ', 'લીમખેડા', 'દેવગઢબારિયા', 'ઝાલોદ'],
    'mahisagar': ['મહીસાગર', 'લુણાવાડા', 'બાલાસિનોર', 'કડાણા', 'સંતરામપુર'],
    'chhotaudepur': ['છોટાઉદેપુર', 'છોટા ઉદેપુર', 'જેતપુર પાવી', 'સંખેડા', 'બોડેલી'],
    'bharuch': ['ભરૂચ', 'અંકલેશ્વર', 'જંબુસર', 'વાગરા', 'ઝગડિયા'],
    'narmada': ['નર્મદા', 'રાજપીપળા', 'ડેડિયાપાડા', 'નાંદોદ'],
    'surat': ['સુરત', 'બારડોલી', 'માંડવી', 'ઓલ怕ડ', 'કામરેજ', 'પલસાણા', 'મહુવા'],
    'tapi': ['તાપી', 'વ્યારા', 'સોનગઢ', 'ઉચ્છલ', 'વાલોડ'],
    'navsari': ['નવસારી', 'ચીખલી', 'ગણદેવી', 'વાંસદા', 'જલાલપોર'],
    'dang': ['ડાંગ', 'આહવા', 'સાપુતારા', 'વઘઈ'],
    'valsad': ['વલસાડ', 'વાપી', 'પારડી', 'ધરમપુર', 'ઉમરગામ']
}

# Key Towns keywords mapped to parents
TOWN_KEYWORDS = {
    'khambhaliya': ['ખંભાળિયા', 'જામખંભાળિયા'],
    'okha': ['ઓખા'],
    'viramgam': ['વિરમગામ'],
    'dholka': ['ધોળકા'],
    'bhuj': ['ભુજ'],
    'anjar': ['અંજાર'],
    'mundra': ['મુન્દ્રા'],
    'halvad': ['હળવદ'],
    'wankaner': ['વાંકાનેર'],
    'bardoli': ['બારડોલી'],
    'dabhoi': ['ડભોઈ'],
    'gondal': ['ગોંડલ'],
    'jetpur': ['જેતપુર']
}

TOWN_TO_DISTRICT = {
    'khambhaliya': 'dwarka', 'okha': 'dwarka',
    'viramgam': 'ahmedabad', 'dholka': 'ahmedabad',
    'bhuj': 'kutch', 'anjar': 'kutch', 'mundra': 'kutch',
    'halvad': 'morbi', 'wankaner': 'morbi',
    'bardoli': 'surat', 'dabhoi': 'vadodara',
    'gondal': 'rajkot', 'jetpur': 'rajkot'
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive'
}

def fetch_html(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as response:
            return response.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_vtv_news():
    print("Scraping VTV Gujarati...")
    html = fetch_html("https://www.vtvgujarati.com")
    if not html:
        return []
    
    # Extract links
    links = re.findall(r'href="(/news-details/([a-zA-Z0-9\-]+))"', html)
    unique_links = list(set(links))
    
    news_items = []
    # Scrape first 8 details to avoid timeouts
    for rel_url, slug in unique_links[:8]:
        full_url = "https://www.vtvgujarati.com" + rel_url
        print(f"  Fetching VTV details: {full_url}")
        detail_html = fetch_html(full_url)
        if not detail_html:
            continue
        
        # Extract title, desc
        title_m = re.search(r'<title>([^<]+)</title>', detail_html)
        desc_m = re.search(r'<meta name="description" content="([^"]+)"', detail_html)
        
        if not title_m:
            continue
            
        title = title_m.group(1).replace(" | VTV Gujarati", "").strip()
        desc = desc_m.group(1).strip() if desc_m else title
        
        # Extract published time
        pub_time = datetime.now(timezone.utc).isoformat()
        date_m = re.search(r'Last Updated:\s*([^<]+)', detail_html)
        if date_m:
            try:
                date_str = date_m.group(1).strip()
                # E.g. "08:04 AM, 4 July 2026"
                dt = datetime.strptime(date_str, "%I:%M %p, %d %B %Y")
                # VTV time is local (Asia/Kolkata +5:30), convert to UTC
                dt_utc = dt - timedelta(hours=5, minutes=30)
                pub_time = dt_utc.replace(tzinfo=timezone.utc).isoformat()
            except Exception as pe:
                print("    VTV date parse error:", pe)
        
        # Check matching locations
        district, town = match_locations(title, desc)
        if district:
            news_items.append({
                'id': len(news_items) + 1,
                'district': district,
                'town': town,
                'source': 'VTV ગુજરાતી',
                'logo': '📺',
                'title': title,
                'desc': desc,
                'category': detect_category(title, desc),
                'published_at': pub_time,
                'link': full_url
            })
            
    return news_items

def extract_sandesh_news():
    print("Scraping Sandesh...")
    html = fetch_html("https://sandesh.com/gujarat")
    if not html:
        return []
    
    # The JSON-LD lists elements like {"@type":"ListItem","position":1,"url":"...","name":"..."}
    items = re.findall(r'{"@type":"ListItem","position":\d+,"url":"([^"]+)","name":"([^"]+)"}', html)
    unique_items = []
    seen_urls = set()
    for url, title in items:
        if url not in seen_urls:
            seen_urls.add(url)
            unique_items.append((url, title))
            
    news_items = []
    # Scrape detail pages for first 8 to get correct datePublished
    for url, title in unique_items[:8]:
        desc = title
        district, town = match_locations(title, desc)
        if district:
            print(f"  Fetching Sandesh details: {url}")
            detail_html = fetch_html(url)
            
            pub_time = datetime.now(timezone.utc).isoformat()
            if detail_html:
                # Extract datePublished from JSON-LD
                date_m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', detail_html)
                if date_m:
                    pub_time = date_m.group(1).strip()
            
            news_items.append({
                'id': len(news_items) + 50,
                'district': district,
                'town': town,
                'source': 'સંદેશ સમાચાર',
                'logo': '📰',
                'title': title.replace('\\u003a', ':').replace('\\u0026', '&').strip(),
                'desc': desc.replace('\\u003a', ':').strip(),
                'category': detect_category(title, desc),
                'published_at': pub_time,
                'link': url
            })
            
    return news_items

def match_locations(title, desc):
    full_text = (title + " " + desc).lower()
    
    # First check town keywords
    matched_town = None
    for town, keywords in TOWN_KEYWORDS.items():
        for kw in keywords:
            if kw in full_text:
                matched_town = town
                break
        if matched_town:
            break
            
    # Then check district keywords
    matched_dist = None
    if matched_town:
        matched_dist = TOWN_TO_DISTRICT[matched_town]
    else:
        for dist, keywords in DISTRICT_KEYWORDS.items():
            for kw in keywords:
                if kw in full_text:
                    matched_dist = dist
                    break
            if matched_dist:
                break
                
    return matched_dist, matched_town

def detect_category(title, desc):
    full_text = (title + " " + desc).lower()
    if any(k in full_text for k in ['વરસાદ', 'હવામાન', 'પૂર', 'નદી', 'વાવાઝોડું', 'ડિપ્રેશન']):
        return 'weather'
    if any(k in full_text for k in ['ચૂંટણી', 'નેતા', 'પટેલ', 'પ્રધાન', 'સરકાર', 'બેઠક', 'ભાજપ', 'કોંગ્રેસ']):
        return 'politics'
    if any(k in full_text for k in ['ધરાશાયી', 'લૂંટ', 'પોલીસ', 'ધરપકડ', 'ચોરી', 'હત્યા', 'દુષ્કર્મ', 'ગુનો', 'ફાયરિંગ']):
        return 'crime'
    if any(k in full_text for k in ['રોકાણ', 'બજેટ', 'સેમિકન્ડક્ટર', 'શેર', 'કંપની', 'ઉદ્યોગ', 'નિકાસ']):
        return 'business'
    if any(k in full_text for k in ['ડોક્ટર', 'હોસ્પિટલ', 'કોરોના', 'આરોગ્ય', 'ચિકિત્સા']):
        return 'health'
    return 'local'

# Fallback seed data (using realistic timestamps relative to execution time)
now = datetime.now(timezone.utc)
SEED_NEWS = [
  { 
    'id': 101, 
    'district': 'morbi', 
    'source': 'દિવ્ય ભાસ્કર', 
    'logo': '🔥', 
    'title': 'મોરબી ખેડૂત આંદોલન: નેહલ અમૃતિયા અને ગુરનામ ચઢૂનીનો કાર્યક્રમ રદ', 
    'desc': 'મોરબીના જેતપર રોડ પર ખેડૂતોના વીજપોલ વિરોધ પ્રદર્શન અંગે આંદોલનકારીઓની સભા અનિવાર્ય સંજોગોસર રદ કરવામાં આવી છે.', 
    'category': 'local', 
    'published_at': (now - timedelta(hours=4)).isoformat(),
    'link': 'https://www.divyabhaskar.co.in/local/gujarat/morbi/news/morbi-farmer-protest-nehul-amrutiya-gurman-chadhuni-program-cancelled-138357420.html' 
  },
  { 
    'id': 102, 
    'district': 'dwarka', 
    'town': 'okha', 
    'source': 'દિવ્ય ભાસ્કર', 
    'logo': '🔥', 
    'title': 'ઓખા પોર્ટ પર ૩ નંબરનું સિગ્નલ લાગુ: માછીમારોને એલર્ટ', 
    'desc': 'અરબી સમુદ્રમાં સર્જાયેલા ડિપ્રેશનને કારણે ૬૦ કિમી પ્રતિ કલાકની ઝડપે ભારે પવન ફૂંકાવાની આગાહીને પગલે ઓખા બંદરે ચેતવણી સિગ્નલ લગાવાયું છે.', 
    'category': 'weather', 
    'published_at': (now - timedelta(hours=5)).isoformat(),
    'link': 'https://www.divyabhaskar.co.in/local/gujarat/dwarka/news/okha-port-3-signal-60kmph-wind-fishermen-alert-138357332.html' 
  },
  { 
    'id': 103, 
    'district': 'ahmedabad', 
    'town': 'viramgam', 
    'source': 'સંદેશ સમાચાર', 
    'logo': '📰', 
    'title': 'અમદાવાદમાં ગેરકાયદે હુક્કાબાર પર ત્રાટકી પોલીસ, કાફેમાં નશીલી ફ્લેવર જપ્ત', 
    'desc': 'હુક્કાબાર પર ત્રાટકી પોલીસ, છારોડીના કાફેમાં નશીલી ફ્લેવરનું વેચાણ ઝડપાયું, સંચાલક અને મેનેજર સામે ગુનો દાખલ.', 
    'category': 'crime', 
    'published_at': (now - timedelta(hours=3)).isoformat(),
    'link': 'https://sandesh.com/gujarat/news/ahmedabad/ahmedabad-chharodi-elysium-cafe-illegal-hookah-bar-raid-sola-police-action' 
  },
  { 
    'id': 104, 
    'district': 'gandhinagar', 
    'source': 'દિવ્ય ભાસ્કર', 
    'logo': '🔥', 
    'title': 'ગુજરાત સેમિકન્ડક્ટર હબ બનશે: ૧.૨૪ લાખ કરોડના રોકાણથી ૫૦,૦૦૦ નોકરીઓ', 
    'desc': 'ગાંધીનગર મહાત્મા મંદિર ખાતે સેમિકન્ડક્ટર પોલીસી હેઠળ મોટા રોકાણને મંજૂરી. વૈશ્વિક સેમિકન્ડક્ટર કંપનીઓ ગુજરાતમાં ઇન્ફ્રાસ્ટ્રક્ચર સ્થાપશે.', 
    'category': 'business', 
    'published_at': (now - timedelta(hours=2)).isoformat(),
    'link': 'https://www.divyabhaskar.co.in/local/gujarat/gandhinagar/news/gujarat-semiconductor-hub-124-lakh-crore-projects-50k-jobs-138357971.html' 
  }
]

def main():
    print("Starting news compilation...")
    compiled_news = []
    
    # 1. Fetch live VTV & Sandesh
    try:
        compiled_news += extract_vtv_news()
    except Exception as e:
        print("VTV scrape failed:", e)
        
    try:
        compiled_news += extract_sandesh_news()
    except Exception as e:
        print("Sandesh scrape failed:", e)
        
    # 2. If nothing fetched, use seed data
    if not compiled_news:
        print("No live news fetched. Compiling seed data...")
        compiled_news = SEED_NEWS
    else:
        # Deduplicate titles
        seen = set()
        deduped = []
        for n in compiled_news:
            clean_title = n['title'].strip()
            if clean_title not in seen:
                seen.add(clean_title)
                deduped.append(n)
        compiled_news = deduped
        
    # Write to live_news.json
    output_path = "live_news.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(compiled_news, f, ensure_ascii=False, indent=2)
        
    print(f"SUCCESS: Saved {len(compiled_news)} articles to {output_path}!")

if __name__ == "__main__":
    main()
