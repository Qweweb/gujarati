import { useState, useEffect } from 'react';

const StatusGenerator = () => {
  const [userName, setUserName] = useState("");
  const [currentQuote, setCurrentQuote] = useState("દુષ્ટોની સંગતથી સદાચાર નાશ પામે છે!");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // n8n Daily Suvichar Simulator
    const fetchDailyQuote = async () => {
        setLoading(true);
        try {
            // Simulated fetch from n8n + Gemini
            setTimeout(() => {
                setLoading(false);
            }, 600);
        } catch (error) {
            setLoading(false);
        }
    };
    fetchDailyQuote();
  }, []);

  const handleShare = () => {
    const text = `*આજનો સુવિચાર*\n\n"${currentQuote}"\n\n- ${userName || 'સનાતન માર્ગ'}\n\nવધુ સુવિચાર માટે ડાઉનલોડ કરો Gujarati App એપ.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">આજનો સુવિચાર</h2>
        <p className="font-gujarati text-outline text-lg">પ્રેરણાદાયી વિચારો શેર કરો અને પોઝિટિવિટી ફેલાવો.</p>
      </div>

      {/* Main Status Preview Card */}
      <section className="relative overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[3/4] md:aspect-[16/9]">
        {/* Background Image (Temple/Devotional) */}
        <img 
          src="https://images.unsplash.com/photo-1590059536060-65c2765d774d?auto=format&fit=crop&q=80&w=800" 
          alt="Temple Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Quote Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white space-y-6">
          <span className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          <h3 className="font-headline font-black text-3xl md:text-5xl leading-tight drop-shadow-lg scale-in">
            "{currentQuote}"
          </h3>
          <div className="h-1.5 w-24 bg-primary-container rounded-full shadow-lg"></div>
          {userName && (
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                <span className="material-symbols-outlined text-sm">edit</span>
                <p className="font-gujarati font-bold text-lg">{userName}</p>
            </div>
          )}
        </div>
        
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-white/50 text-xl">verified</span>
            <p className="text-white/50 font-label text-[10px] tracking-widest uppercase font-bold">Gujarati App Official</p>
        </div>
      </section>

      {/* Personalization Section */}
      <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-primary/5 space-y-6">
        <div className="space-y-2">
          <h4 className="font-gujarati font-black text-2xl text-on-surface">નામ ઉમેરો (Personalize)</h4>
          <p className="font-gujarati text-outline text-sm">તમારું નામ સ્ટેટસની નીચે જોવા મળશે.</p>
        </div>
        
        <div className="bg-background rounded-2xl p-5 border border-primary/10 group focus-within:border-primary transition-colors">
          <input 
            type="text" 
            placeholder="તમારું નામ લખો..." 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-gujarati text-xl text-primary font-bold placeholder:text-outline/40"
          />
        </div>

        {/* Primary Action: WhatsApp Share */}
        <button 
            onClick={handleShare}
            className="w-full py-6 bg-[#25D366] text-white rounded-[2rem] flex items-center justify-center gap-4 shadow-xl shadow-green-200 active:scale-[0.98] transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span className="material-symbols-outlined text-4xl">share</span>
          <span className="font-gujarati font-black text-2xl">WhatsApp પર સ્ટેટસ મૂકો</span>
        </button>
      </section>

      {/* Style Presets */}
      <section className="space-y-4">
        <p className="font-gujarati font-bold text-center text-outline-variant uppercase tracking-widest text-[10px]">બેકગ્રાઉન્ડ પસંદ કરો</p>
        <div className="flex justify-between items-center gap-4 px-2">
            <StylePreview image="https://images.unsplash.com/photo-1590059536060-65c2765d774d?auto=format&fit=crop&q=80&w=200" active />
            <StylePreview image="https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=200" />
            <StylePreview image="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=200" />
            <StylePreview image="https://images.unsplash.com/photo-1620131448661-0422d36f2fca?auto=format&fit=crop&q=80&w=200" />
        </div>
      </section>

      {/* Premium Badge Card */}
      <section className="bg-primary-container/10 p-8 rounded-[2rem] border-2 border-dashed border-primary-container/30 flex items-center gap-6 group">
        <div className="h-20 w-20 bg-primary-container text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-4xl">auto_awesome</span>
        </div>
        <div>
            <h4 className="font-gujarati font-black text-xl text-primary-container">પ્રીમિયમ ડિઝાઇન</h4>
            <p className="font-gujarati text-outline text-sm">દરેક સુવિચાર માટે અમે ખાસ બેકગ્રાઉન્ડ પસંદ કરીએ છીએ.</p>
        </div>
      </section>
    </div>
  );
};

const StylePreview = ({ image, active }) => (
  <button className={`flex-1 aspect-square rounded-2xl overflow-hidden border-4 transition-all ${active ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
    <img src={image} className="w-full h-full object-cover" alt="style" />
  </button>
);

export default StatusGenerator;
