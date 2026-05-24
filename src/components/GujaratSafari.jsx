import { useState, useEffect } from 'react';

const MASCOTS = [
  {
    id: "m_lion",
    name_gu: "સિંહ બબ્બર 🦁",
    name_en: "Babbar the Lion",
    place: "સાસણ ગીર (જૂનાગઢ)",
    desc: "નમસ્તે દોસ્તો! હું છું વનરાજ બબ્બર સિંહ. સમગ્ર એશિયામાં એશિયાટિક લાયન ફક્ત જૂનાગઢના ગીર જંગલમાં જ જોવા મળે છે! અમારું રક્ષણ કરવું એ આપણી ફરજ છે!",
    x: "40%", y: "70%",
    avatar: "🦁",
    soundText: "નમસ્તે દોસ્તો! હું છું વનરાજ બબ્બર સિંહ. સમગ્ર એશિયામાં એશિયાટિક લાયન ફક્ત જૂનાગઢના ગીર જંગલમાં જ જોવા મળે છે!"
  },
  {
    id: "m_ghudkhar",
    name_gu: "ઘુડખર ઘુથુ 🦓",
    name_en: "Ghuthu the Wild Ass",
    place: "કચ્છનું નાનું રણ",
    desc: "રામ રામ! મારું નામ ઘુથુ છે, હું એક જંગલી ગધેડો એટલે કે ઘુડખર છું. આખી દુનિયામાં હું ફક્ત કચ્છના રણમાં જ જોવા મળું છું! મને દોડવું બહુ ગમે છે!",
    x: "20%", y: "40%",
    avatar: "🦓",
    soundText: "રામ રામ! મારું નામ ઘુથુ છે, હું એક જંગલી ગધેડો એટલે કે ઘુડખર છું. આખી દુનિયામાં હું ફક્ત કચ્છના રણમાં જ જોવા મળું છું!"
  },
  {
    id: "m_dino",
    name_gu: "ડાયનાસોર રાયો 🦖",
    name_en: "Raiyo the Dinosaur",
    place: "રાયોલી (બાલાસિનોર)",
    desc: "હલો બાળમિત્રો! હું રાયો છું, એક ડાયનાસોર. તમને ખબર છે? મહીસાગરના રાયોલી ગામે કરોડો વર્ષ પહેલા ડાયનાસોરના ઈંડા અને જીવાશ્મ મળ્યા હતા! આ ભારતનું સૌથી મોટું ડાયનાસોર પાર્ક છે!",
    x: "70%", y: "50%",
    avatar: "🦖",
    soundText: "હલો બાળમિત્રો! હું રાયો છું. મહીસાગરના રાયોલી ગામે કરોડો વર્ષ પહેલા ડાયનાસોરના ઈંડા મળ્યા હતા!"
  },
  {
    id: "m_flamingo",
    name_gu: "સુરખાબ ફ્લેમિંગો 🦩",
    name_en: "Surkhab the Flamingo",
    place: "નળ સરોવર (અમદાવાદ)",
    desc: "મીઠા આવકાર! હું સુરખાબ છું, એટલે કે ફ્લેમિંગો. શિયાળો આવતા જ અમે સાઇબેરિયાથી નળ સરોવર અને કચ્છના રણમાં આવીએ છીએ. હું ગુજરાતનું રાજ્ય પક્ષી છું!",
    x: "50%", y: "45%",
    avatar: "🦩",
    soundText: "મીઠા આવકાર! હું સુરખાબ છું, એટલે કે ફ્લેમિંગો. હું ગુજરાતનું સત્તાવાર રાજ્ય પક્ષી છું!"
  },
  {
    id: "m_peacock",
    name_gu: "મોર મયુર 🦚",
    name_en: "Mayur the Peacock",
    place: "દ્વારકા દરિયા કિનારો",
    desc: "જય શ્રી કૃષ્ણ! હું મોર મયુર છું. ભગવાન દ્વારકાધીશની આ પવિત્ર સુવર્ણ નગરી છે. અહીં દરિયા કિનારે અને વન વગડામાં મારા અનેક દોસ્તો રહે છે! આવો ક્યારેક ફરવા!",
    x: "15%", y: "60%",
    avatar: "🦚",
    soundText: "જય શ્રી કૃષ્ણ! હું મોર મયુર છું. ભગવાન દ્વારકાધીશની આ પવિત્ર સુવર્ણ નગરી છે!"
  }
];

export default function GujaratSafari() {
  const [selectedMascot, setSelectedMascot] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setAudioSupported(true);
    }
  }, []);

  const handleMascotClick = (mascot) => {
    setSelectedMascot(mascot);
    
    // Stop any running speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Speak the description
      const utterance = new SpeechSynthesisUtterance(mascot.soundText);
      // Try to find a Gujarati or Hindi voice for phonetic reading
      const voices = window.speechSynthesis.getVoices();
      const guVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('hi'));
      if (guVoice) {
        utterance.voice = guVoice;
      }
      utterance.lang = 'gu-IN';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  useEffect(() => {
    // Cancel voice when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Header */}
      <div className="space-y-1">
        <h2 className="font-gujarati font-black text-4xl text-primary">ગુજરાત સફારી 🦁</h2>
        <p className="font-gujarati text-outline text-lg">બાળકો માટે ખાસ: નકશામાં પ્રાણીઓ અને પાત્રો પર ક્લિક કરી તેમના અવાજમાં શીખો.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Animated Map Panel */}
        <div className="flex-1 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-stone-950 dark:to-stone-900 border-4 border-amber-500/20 rounded-[2.5rem] p-6 shadow-sm min-h-[400px] relative overflow-hidden flex items-center justify-center select-none">
          
          {/* Simulated Map Contour Graphics */}
          <div className="absolute inset-0 opacity-15 dark:opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/50 via-stone-500/30 to-stone-900/80"></div>
          
          {/* Gujarat Outline Placeholder shape */}
          <div className="w-[85%] h-[80%] border-4 border-dashed border-primary/10 rounded-[3rem] relative bg-white/20 dark:bg-stone-900/10 backdrop-blur-xs flex items-center justify-center">
            
            <p className="absolute bottom-4 left-4 font-gujarati font-black text-[10px] text-stone-400 uppercase tracking-widest leading-none">
              અરબી સમુદ્ર (Arabian Sea) 🌊
            </p>
            
            {/* Mascot Map Pins */}
            {MASCOTS.map((mascot) => (
              <button
                key={mascot.id}
                onClick={() => handleMascotClick(mascot)}
                style={{ left: mascot.x, top: mascot.y }}
                className={`absolute h-16 w-16 bg-white dark:bg-stone-800 rounded-full border-4 border-amber-500 shadow-xl flex items-center justify-center text-3xl transition-all cursor-pointer select-none active:scale-90 ${selectedMascot?.id === mascot.id ? 'scale-125 ring-4 ring-primary animate-bounce-short z-30' : 'hover:scale-110 animate-pulse z-10'}`}
                title={mascot.name_gu}
              >
                {mascot.avatar}
              </button>
            ))}
          </div>
        </div>

        {/* Mascot Talk Bubble Dialog Panel */}
        <div className="w-full lg:w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] flex flex-col justify-between gap-6 shadow-sm min-h-[300px]">
          {selectedMascot ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Mascot Header */}
                <div className="flex gap-4 items-center border-b border-stone-100 dark:border-stone-800 pb-4">
                  <div className="h-16 w-16 bg-amber-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner select-none">
                    {selectedMascot.avatar}
                  </div>
                  <div>
                    <h4 className="font-gujarati font-black text-xl text-on-surface">{selectedMascot.name_gu}</h4>
                    <p className="font-gujarati text-[10px] text-primary font-black uppercase tracking-wider">{selectedMascot.place}</p>
                  </div>
                </div>

                {/* Speech Bubble Talk */}
                <div className="relative bg-[#fef8f1] dark:bg-stone-950 p-5 rounded-3xl border border-primary/5 flex flex-col gap-3">
                  <div className="absolute top-4 -left-2.5 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-[#fef8f1] dark:border-r-stone-950 border-b-[8px] border-b-transparent"></div>
                  <p className="font-gujarati font-bold text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    "{selectedMascot.desc}"
                  </p>
                </div>
              </div>

              {/* Speech sound player */}
              {audioSupported && (
                <div className="space-y-3 mt-4">
                  {isPlayingAudio ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handleStopAudio}
                        className="w-full bg-red-500 hover:bg-red-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">volume_off</span>
                        અવાજ બંધ કરો 🔇
                      </button>
                      <div className="flex justify-center gap-1 py-1">
                        <span className="h-4 w-1 bg-primary rounded-full animate-sound-wave-1"></span>
                        <span className="h-4 w-1 bg-primary rounded-full animate-sound-wave-2"></span>
                        <span className="h-4 w-1 bg-primary rounded-full animate-sound-wave-3"></span>
                        <span className="h-4 w-1 bg-primary rounded-full animate-sound-wave-4"></span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMascotClick(selectedMascot)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white py-3.5 rounded-2xl font-gujarati font-black text-xs flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">volume_up</span>
                      માસ્કોટનો અવાજ સાંભળો 🎧
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 text-stone-400 dark:text-stone-600">
              <span className="material-symbols-outlined text-6xl animate-bounce-slow">explore</span>
              <h4 className="font-gujarati font-black text-lg text-stone-600 dark:text-stone-300">સફારી નકશો ખુલ્લો છે!</h4>
              <p className="font-gujarati text-xs leading-normal">
                ડાબી બાજુ નકશા પર દેખાતા કોઈપણ પ્રાણી અથવા પાત્ર પર ક્લિક કરી સફારી શરૂ કરો.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
