# 🚀 n8n & REST API Blog Automation Setup Guide for Gujarati App

આ ગાઈડની મદદથી તમે **n8n, Make.com, Zapier, Python સ્ક્રિપ્ટ અથવા AI કોન્ટેન્ટ જનરેટર (ChatGPT/Claude)** ની મદદથી રોજેરોજ ઓટોમેટિકલી ગુજરાતી એપમાં બ્લોગ પબ્લિશ કરી શકશો.

---

## 🔑 1. Supabase Credentials (જરૂરી કી)

તમારા **Supabase Dashboard -> Settings -> API** માંથી આ ૨ વિગતો કોપી કરો:

1. **SUPABASE_URL**: `https://your-project-id.supabase.co`
2. **SUPABASE_ANON_KEY** અથવા **SERVICE_ROLE_KEY**: `eyJhbGciOiJKV1Qi...`

---

## 📡 2. Direct REST API Endpoint

તમારા n8n અથવા કોઈપણ ઓટોમેશન ટૂલમાંથી નીચેના એન્ડપોઈન્ટ પર `POST` રિકવેસ્ટ મોકલવાની રહેશે:

- **Method**: `POST`
- **URL**: `https://YOUR_SUPABASE_PROJECT_ID.supabase.co/rest/v1/blogs`

### 🌐 Required Headers:
```http
apikey: YOUR_SUPABASE_ANON_KEY
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
Prefer: return=representation
```

---

## 📝 3. JSON Request Body Parameter Schema (n8n Payload)

n8n માં **HTTP Request Node** નો ઉપયોગ કરીને આ JSON બોડી મોકલવી:

```json
{
  "title": "આજનો પવિત્ર શ્રાવણ માસ શ્લોક અને મહાત્મ્ય",
  "slug": "shravan-shlok-daily-2026-08-19",
  "category": "ધર્મ અને ભક્તિ",
  "author": "AI સ્વચાલિત દૈનિક સાહિત્ય",
  "excerpt": "આજના દિવસનો પવિત્ર શ્લોક અને તેનું સરળ ગુજરાતી ભાષામાં મહાત્મ્ય વાંચો.",
  "content": "## આજનો પવિત્ર શ્લોક\n\nકર્પૂરગૌરં કરુણાવતારં સંસારસારમ્ ભુજગેન્દ્રહારમ્...\n\n### ભાવાર્થ\n\nમહાદેવ શિવ શંભુ સૌનું કલ્યાણ કરે...",
  "cover_image": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000",
  "is_published": true
}
```

---

## ⚡ 4. n8n Node Configuration Step-by-Step

1. n8n માં **Schedule Trigger** મૂકો (દા.ત. રોજ સવારે 8:00 AM).
2. જો તમે AI (OpenAI / Claude) નો ઉપયોગ કરતા હોવ, તો **OpenAI Node** મૂકો અને ગુજરાતીમાં બ્લોગ જનરેટ કરાવો.
3. એના પછી **HTTP Request Node** મૂકો:
   - **Method**: `POST`
   - **URL**: `https://YOUR_SUPABASE_ID.supabase.co/rest/v1/blogs`
   - **Authentication**: `Header Auth`
     - Name: `apikey`
     - Value: `YOUR_SUPABASE_ANON_KEY`
   - **Headers**:
     - `Authorization`: `Bearer YOUR_SUPABASE_ANON_KEY`
     - `Prefer`: `return=representation`
   - **Body Content Type**: `JSON`
   - **Specify Body**: `Using JSON`

---

## 🧪 5. cURL Command (Instant Test for Terminal / Postman)

તમે આ cURL ટર્મિનલમાં રન કરીને પણ નવો ઓટોમેટેડ બ્લોગ ઉમેરી શકો છો:

```bash
curl -X POST "https://YOUR_SUPABASE_ID.supabase.co/rest/v1/blogs" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "title": "દૈનિક વાસ્તુ ટિપ્સ: સવારે ઘરનો મુખ્ય દરવાજો ખોલતી વખતે આ ધ્યાન રાખો",
    "slug": "daily-vastu-tips-morning-door",
    "category": "વાસ્તુ અને જ્યોતિષ",
    "author": "n8n ઓટોમેશન બોટ",
    "excerpt": "સવારે ઘરમાં સકારાત્મક ઊર્જા લાવવા માટે વાસ્તુના આ સરળ નિયમનું પાલન કરો.",
    "content": "## મુખ્ય દરવાજાનું વાસ્તુ મહત્વ\n\nઘરનો મુખ્ય દરવાજો એ સકારાત્મક ઊર્જાનો પ્રવેશદ્વાર છે...\n\n### ઉપાયો\n\n- દરવાજા પાસે સ્વચ્છતા રાખો\n- ઓમ અથવા સ્વસ્તિકનું ચિહ્ન બનાવો",
    "cover_image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
    "is_published": true
  }'
```

---

## 🐍 6. Python Automation Script (માટે કસ્ટમ સ્ક્રિપ્ટ્સ)

```python
import requests
import json
from datetime import datetime

SUPABASE_URL = "https://YOUR_SUPABASE_ID.supabase.co"
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

payload = {
    "title": "રોજિંદા આયુર્વેદિક ઉપચારો અને સ્વાસ્થ્ય સંભાળ",
    "slug": f"daily-ayurveda-{int(datetime.now().timestamp())}",
    "category": "સ્વાસ્થ્ય અને જીવનશૈલી",
    "author": "ઓટોમેટેડ આયુર્વેદ બોટ",
    "excerpt": "આજના આયુર્વેદિક હેલ્થ આર્ટિકલમાં જાણો તુલસી અને આદુના અદ્ભુત ફાયદા.",
    "content": "## તુલસી અને આદુનો ઉકાળો\n\nહવામાન બદલાતા વાયરલ ઇન્ફેક્શનથી બચવા માટે તુલસીનો ઉકાળો ખૂબ જ ફાયદાકારક છે...",
    "cover_image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000",
    "is_published": True
}

response = requests.post(f"{SUPABASE_URL}/rest/v1/blogs", headers=headers, json=payload)
print("Response Code:", response.status_code)
print("Created Blog:", response.json())
```
