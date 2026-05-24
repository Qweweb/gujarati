# ગુજરાતી ડેશબોર્ડ - React Integration & n8n Guide

આ પ્રોજેક્ટમાં મેં તમારા HTML કોડને React માં સફળતાપૂર્વક ઈન્ટિગ્રેટ કર્યો છે અને તેને ડાયનેમિક બનાવ્યો છે.

## મુખ્ય ફેરફારો (Key Features)

1.  **React components**: કોડને `Dashboard`, `Clock`, અને `QuickActions` જેવા વિભાગોમાં વહેંચ્યો છે.
2.  **Real-time Clock**: પંચાંગ વિભાગમાં 1-સેકન્ડના અપડેટ સાથે લાઈવ ઘડિયાળ એડ કરી છે.
3.  **Dynamic States**: 'ગ્રીટિંગ', 'તિથિ', 'સૂર્યોદય/સૂર્યાસ્ત', અને 'વાર્તા' ને ડાયનેમિક બનાવ્યા છે.
4.  **Premium UI**: Tailwind CSS અને Material Symbols નો ઉપયોગ કરીને પ્રીમિયમ લુક જાળવી રાખ્યો છે.

## n8n API સાથે કનેક્ટ કેવી રીતે કરવું?

તમારા `src/components/Dashboard.jsx` ફાઇલમાં એક `useEffect` હૂક છે. તેને નીચે મુજબ અપડેટ કરો:

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      // તમારા n8n Webhook URL ને અહીં મૂકો
      const response = await fetch('https://your-n8n-instance.com/webhook/gujarati-data');
      const result = await response.json();
      
      // ડેટા મેપિંગ (n8n માંથી આવતા ડેટા મુજબ)
      setData({
        user: result.userName || "મહેમાન",
        tithi: result.tithi || "વૈશાખ સુદ પાંચમ",
        sunrise: result.sunrise || "06:12 AM",
        sunset: result.sunset || "07:04 PM",
        story: {
          title: result.storyTitle || "ભક્ત પ્રહલાદ",
          description: result.storyDescription || "સત્ય અને અડગ શ્રદ્ધાની અમર ગાથા",
          narrator: result.narrator || "રમેશભાઈ ઓઝા",
          image: result.storyImage || "..."
        }
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching from n8n:", error);
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

## પ્રોજેક્ટ ચલાવવા માટે:

1.  `npm install`
2.  `npm run dev`

વધુ મદદ માટે, તમે n8n માંથી JSON ફોર્મેટ ચેક કરી શકો છો.
