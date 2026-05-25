import { useState, useEffect, useRef } from 'react';
import ShareButton from './ShareButton';
import { DADI_MA_DB, CATEGORIES, QUICK_SUGGESTIONS, searchDadiMaDB } from '../data/dadiMaDatabase';
import { callDadiMaAI, isAIConfigured } from '../utils/aiService';

const CONDITIONS_DATA = {
  "ડાયાબિટીસ (Type 2)": {
    safe_level: "ફાસ્ટિંગ શુગર: ૭૦-૧૦૦ mg/dL, જમ્યા પછી: < ૧૪૦ mg/dL",
    levels_info: [
      { label: "સામાન્ય (Normal - ભૂખ્યા પેટે)", range: "૭૦ - ૧૦૦ mg/dL" },
      { label: "પ્રી-ડાયાબિટીસ (ભૂખ્યા પેટે)", range: "૧૦૧ - ૧૨૫ mg/dL" },
      { label: "ડાયાબિટીસ / હાઈ શુગર", range: "૧૨૬ mg/dL કે વધુ" },
      { label: "સામાન્ય (જમ્યાના ૨ કલાક પછી)", range: "૧૪૦ mg/dL થી ઓછું" }
    ],
    symptoms: ["વારંવાર પેશાબ જવું (ખાસ કરીને રાત્રે)", "વધુ પડતી તરસ અને ભૂખ લાગવી", "આખો દિવસ અતિશય થાક અને અશક્તિ લાગવી", "આંખોમાં ઝાંખપ આવી જવી", "હાથ-પગ સુન્ન થઈ જવા અથવા કળતર થવું", "કોઈપણ ઈજા કે ઘા રૂઝાવવામાં ઘણો સમય લાગવો"],
    causes: ["શરીરમાં પૂરતા પ્રમાણમાં ઇન્સ્યુલિન ન બનવું અથવા ઇન્સ્યુલિન રઝિસ્ટન્સ થવું", "વધારે પડતી ગળપણ અને મેંદાવાળી વસ્તુઓ ખાવાની આદત", "બેઠાડુ જીવનશૈલી અને વ્યાયામનો અભાવ", "વારસાગત / આનુવંશિક કારણો", "માનસિક તણાવ અને અપૂરતી ઊંઘ"],
    dos: [
      "રોજ સવારે ૩૦ મિનિટ યોગાસન, પ્રાણાયામ અથવા ચાલવાનું રાખો.",
      "ભોજનમાં ફાઇબરવાળો અને આખા અનાજનો ખોરાક વધુ લો.",
      "નિયમિત રીતે દર ૧૫-૩૦ દિવસે બ્લડ શુગર ચેક કરાવો.",
      "દાદીમાની સલાહ મુજબ ભોજનમાં હળદર અને મેથીનો પ્રયોગ કરો."
    ],
    donts: [
      "ખાંડ, ગોળ, મીઠાઈ, પેકેજ્ડ જ્યુસ અને આઈસ્ક્રીમ બિલકુલ ન ખાવા.",
      "બટાકા, શક્કરિયા અને વધુ પડતી ચરબીવાળો તળેલો ખોરાક ટાળવો.",
      "જમ્યા પછી તરત બેસી રહેવું અથવા બપોરે લાંબા સમય સુધી સુવું નહીં.",
      "ધૂમ્રપાન અથવા માવો-તમાકુ ખાવાની ટેવ ટાળવી."
    ],
    foods_to_eat: "મેથી દાણા, લીલા પાંદડાવાળા શાકભાજી, ફણગાવેલા કઠોળ, દૂધી, સફરજન, જાંબુ અને જુવાર કે બાજરીની રોટલી.",
    foods_to_avoid: "મેંદો, સફેદ ચોખા, બટાકા, કેરી, કેળા, મીઠી ચા, કોકા-કોલા અને બજારના પેકેટો.",
    remedies: [
      "સવારે નરણા કોઠે (ભૂખ્યા પેટે) ૧ ચમચી મેથીના દાણા રાત્રે પલાળેલા પાણી સાથે ચાવીને ખાવા.",
      "નિયમિત રીતે સવારે કારેલા અને દૂધીનો મિક્સ જ્યુસ અડધો ગ્લાસ પીવો.",
      "જાંબુના ઠળિયાનો પાઉડર ૧-૧ ચમચી સવાર-સાંજ હુંફાળા પાણી સાથે લેવો."
    ]
  },
  "હાઈ બ્લડ પ્રેશર": {
    safe_level: "૧૨૦/૮૦ mmHg (સિસ્ટોલિક/ડાયાસ્ટોલિક)",
    levels_info: [
      { label: "સામાન્ય બીપી (Normal BP)", range: "< ૧૨૦ / ૮૦ mmHg" },
      { label: "સાધારણ વધારે (Elevated)", range: "૧૨૦-૧૨૯ / < ૮૦ mmHg" },
      { label: "સ્ટેજ ૧ હાઈપરટેન્શન", range: "૧૩૦-૧૩૯ / ૮૦-૮૯ mmHg" },
      { label: "સ્ટેજ ૨ (ખૂબ ઊંચું બ્લડ પ્રેશર)", range: "૧૪૦/૯૦ mmHg કે તેથી વધુ" }
    ],
    symptoms: ["માથાના પાછળના ભાગમાં સતત દુખાવો અથવા ભારેપણું રહેવું", "અચાનક ચક્કર આવવા અથવા આંખે અંધારા આવવા", "થોડું ચાલવાથી જ છાતીમાં ધબકારા વધી જવા", "નસકોરી ફૂટવી (નાકમાંથી લોહી વહેવું)", "માનસિક બેચેની અને કારણ વગર ગુસ્સો આવવો"],
    causes: ["ખોરાકમાં ખાટા, ખારા અને તીખા પદાર્થોનું વધુ પડતું સેવન (વધુ મીઠું)", "ચિંતા, ક્રોધ અને સતત માનસિક તણાવ (સ્ટ્રેસ)", "શારીરિક મહેનત કે કસરત બિલકુલ ન કરવી", "શરીરનું વજન ખૂબ વધારે હોવું", "મોડી રાત સુધી જાગવાની આદત"],
    dos: [
      "ખોરાકમાં મીઠું (સોડિયમ) ખૂબ જ ઓછું કરવું (રોક સોલ્ટ અથવા સિંધવ મીઠું વાપરવું).",
      "મગજને શાંત રાખવા રોજ સવારે ૧૫ મિનિટ ભ્રામરી અને અનુલોમ-વિલોમ પ્રાણાયામ કરો.",
      "ખોરાકમાં પોટેશિયમયુક્ત ફળો (જેમ કે કેળા, નાળિયેર પાણી) નો સમાવેશ કરો.",
      "દિવસમાં કમસેકમ ૭ થી ૮ કલાકની ઊંઘ અચૂક લેવી."
    ],
    donts: [
      "અથાણાં, પાપડ, પ્રોસેસ્ડ ચીઝ અને સોલ્ટેડ ડ્રાયફ્રૂટ્સ બિલકુલ ન ખાવા.",
      "બહારનો તળેલો આથાવાળો ખોરાક, સમોસા કે ચિપ્સ ટાળવા.",
      "ધૂમ્રપાન, આલ્કોહોલ અને વધારે પડતી ચા-કોફીનું સેવન ટાળવું.",
      "નકામી બાબતો પર ચિંતા કે ક્રોધ કરવાનું ટાળો."
    ],
    foods_to_eat: "દૂધીનું શાક અથવા જ્યુસ, લસણ, મોસંબી, સફરજન, પાલક, સરગવો અને નાળિયેર પાણી.",
    foods_to_avoid: "પેકેજ્ડ ફૂડ્સ, તૈયાર સૂપ, અથાણાં, પાપડ, માખણ, અને લાલ મરચું.",
    remedies: [
      "રોજ સવારે લસણની ૧ કે ૨ કળી છોલીને ઝીણી કાપીને પાણી સાથે ગળી જવી (લસણ લોહી પાતળું કરે છે).",
      "દૂધીના રસમાં ૪-૫ ફુદીનાના પાન નાખીને સવારે નિયમિત પીવો.",
      "અર્જુનની છાલનો પાવડર અડધી ચમચી સવારે ગરમ પાણીમાં ઉકાળીને ચાની જેમ પીવો."
    ]
  },
  "કોલેસ્ટ્રોલ": {
    safe_level: "ટોટલ કોલેસ્ટ્રોલ: < ૨૦૦ mg/dL, LDL (ખરાબ): < ૧૦૦ mg/dL",
    levels_info: [
      { label: "સામાન્ય ટોટલ કોલેસ્ટ્રોલ", range: "૨૦૦ mg/dL થી ઓછું" },
      { label: "બોર્ડરલાઈન હાઈ કોલેસ્ટ્રોલ", range: "૨૦૦ - ૨૩૯ mg/dL" },
      { label: "જોખમી સ્તર (High Cholesterol)", range: "૨૪૦ mg/dL કે વધુ" },
      { label: "સામાન્ય LDL (ખરાબ કોલેસ્ટ્રોલ)", range: "૧૦૦ mg/dL થી ઓછું" }
    ],
    symptoms: ["ચાલતી વખતે છાતીમાં દબાણ અથવા ઝીણો દુખાવો થવો", "જમ્યા પછી શ્વાસ ચઢવો અથવા વધુ હાંફ ચઢવો", "હાથ અને પગ વારંવાર સુન્ન થઈ જવા", "પગના તળિયામાં બળતરા અથવા દુખાવો રહેવો", "આંખોની પલકોની આજુબાજુ પીળા રંગના ડાઘ (Xanthelasma) થવા"],
    causes: ["ઘી-તેલ અને ડાલડા ઘી વાળી વસ્તુઓનું વધુ સેવન કરવું", "મેંદાવાળો અને ડબલ ફિલ્ટર ન કરેલ તેલવાળો ખોરાક ખાવો", "બપોરે જમીને તરત સુવાની ટેવ", "લિવરની નબળાઈ અને શારીરિક અક્રિયતા"],
    dos: [
      "રસોઈમાં ફિલ્ટર તેલ (સરસવ, મગફળી અથવા તલનું તેલ) ખૂબ ઓછું વાપરવું.",
      "રોજ સવારે અડધો કલાક ઝડપી ચાલવાની કસરત કરો.",
      "દરરોજ ખોરાકમાં ફાઈબર અને ઓટ્સનું પ્રમાણ વધારો.",
      "લીલા શાકભાજી અને તાજા ફળો વિપુલ પ્રમાણમાં ખાઓ."
    ],
    donts: [
      "માખણ, ચીઝ, વનસ્પતિ ઘી (ડાલડા) અને ડબલ ફ્રાય કરેલું તેલ ન વાપરવું.",
      "સમોસા, કચોરી, ભજિયા અને મીઠાઈઓ જેવી બહારની ચરબીયુક્ત વસ્તુઓ ટાળવી.",
      "ભોજન કર્યા બાદ તુરંત પલંગ પર સુઈ જવાનું ટાળો."
    ],
    foods_to_eat: "ઓટ્સ, દલિયા, સફરજન, નારંગી, લસણ, અળસીના બીજ (Flaxseeds) અને લીંબુ પાણી.",
    foods_to_avoid: "બહારનું ફાસ્ટફૂડ, બટાકાની ચિપ્સ, મેયોનેઝ, માખણ, વનસ્પતિ તેલ અને લાલ મીટ.",
    remedies: [
      "રોજ સવારે નવશેકા ગરમ પાણીમાં ૧ ચમચી અસલી મધ અને અડધા લીંબુનો રસ નાખીને પીવો.",
      "અડધી ચમચી અળસીના બીજ સવારે નરણા કોઠે ચાવીને ખાવા.",
      "અડધી ચમચી આદુનો રસ અને ૧ ચમચી લસણનો રસ મેળવીને સવારે પીવો."
    ]
  },
  "થાઈરોઈડ": {
    safe_level: "TSH લેવલ: ૦.૪ થી ૪.૦ mIU/L",
    levels_info: [
      { label: "સામાન્ય TSH સ્તર", range: "૦.૪ - ૪.૦ mIU/L" },
      { label: "હાઈપોથાઈરોઈડ (Hypo - સુસ્તી/વજન વધવું)", range: "> ૪.૫ mIU/L" },
      { label: "હાઈપરથાઈરોઈડ (Hyper - વજન ઘટવું)", range: "< ૦.૪ mIU/L" }
    ],
    symptoms: ["પૂરતી કસરત છતાં અચાનક વજન ખૂબ વધવું અથવા ઘટવું", "કાયમ સુસ્તી રહેવી, સવારે ઉઠ્યા પછી પણ થાક લાગવો", "અતિશય વાળ ખરવા અને ત્વચા ડ્રાય (સૂકી) થઈ જવી", "ગળાના ભાગમાં સોજો કે ભારેપણું લાગવું", "સ્ત્રીઓમાં માસિક ધર્મ અનિયમિત થવો"],
    causes: ["ખોરાકમાં આયોડિનની ઉણપ અથવા વધુ પડતી માત્રા હોવી", "અતિશય માનસિક ચિંતા અને હોર્મોનલ અસંતુલન", "શરીરનું ઓટોઇમ્યુન ડિસઓર્ડર (શરીર પોતે થાઈરોઈડ ગ્રંથિ પર હુમલો કરે)"],
    dos: [
      "ખોરાકમાં સામાન્ય માત્રામાં આયોડિનયુક્ત મીઠું વાપરવું.",
      "ગળાની કસરત અને પ્રાણાયામ (ખાસ કરીને ઉજ્જયી અને સિંહાસન પ્રાણાયામ) કરો.",
      "રાત્રે નિયમિત સમયસર સૂવાની અને વહેલા ઉઠવાની ટેવ પાડો."
    ],
    donts: [
      "વધુ પડતા સોયાબીન, સોયા સોસ કે સોયા મિલ્ક લેવાનું ટાળવું.",
      "કોબીજ, ફ્લાવર, બ્રોકોલી અને મૂળા કાચા ખાવાનું ટાળવું (તેને રાંધીને ખાઈ શકાય).",
      "પ્રોસેસ્ડ ફૂડ, ઠંડા પીણાં અને મેંદાવાળી વસ્તુઓથી દૂર રહેવું."
    ],
    foods_to_eat: "અખરોટ, બદામ, નાળિયેર તેલ, આખા ધાણાનો ઉકાળો, કોળું અને લીલા શાકભાજી.",
    foods_to_avoid: "સોયા પ્રોડક્ટ્સ, પ્રોસેસ્ડ બેકરી પ્રોડક્ટ્સ, પેકેજ્ડ ફૂડ અને ફાસ્ટ ફૂડ.",
    remedies: [
      "૨ ચમચી આખા ધાણા (ધાણા બી) ને ૧ ગ્લાસ પાણીમાં આખી રાત પલાળી રાખો. સવારે તેને ઉકાળીને ગાળી લો અને નવશેકું પીવો.",
      "થાઈરોઈડ ગ્રંથિ પર હળવા હાથે શુદ્ધ નાળિયેર તેલની માલિશ કરવી."
    ]
  },
  "એસિડિટી / ગેસ": {
    safe_level: "જઠરનો સામાન્ય પાચન pH: ૧.૫ થી ૩.૫",
    levels_info: [
      { label: "સામાન્ય જઠર pH (એસિડિક પાચન માટે)", range: "૧.૫ - ૩.૫" },
      { label: "એસિડ રિફ્લક્સ (છાતીમાં બળતરા)", range: "જ્યારે જઠર એસિડ અન્નનળીમાં ઉપર તરફ જાય છે" }
    ],
    symptoms: ["છાતીના મધ્ય ભાગમાં અથવા પેટમાં બળતરા થવી", "વારંવાર ખાટા ઓડકાર આવવા અથવા મોંમાં ખાટું પાણી આવવું", "પેટ ફૂલી જવું (ગેસ ભરાવો) અને પેટ કડક લાગવું", "એસિડિટીના લીધે માથાનો અસહ્ય દુખાવો થવો"],
    causes: ["વધારે પડતો તીખો, તળેલો, ગરમ મસાલેદાર અને આથાવાળો ખોરાક ખાવો", "સમયસર ભોજન ન કરવું અથવા લાંબા સમય સુધી ભૂખ્યા રહેવું", "ચા-કોફીનું વધારે પડતું સેવન કરવું", "જમ્યા પછી તરત જ સૂઈ જવાની ટેવ"],
    dos: [
      "જમ્યા પછી ૧૦-૧૫ મિનિટ માટે 'વજ્રાસન' માં બેસો અથવા ૫૦૦ ડગલાં ધીમેથી ચાલો.",
      "ખોરાક શાંતિથી ચાવી-ચાવીને ખાવો જેથી લાળ ગ્રંથિ પાચનમાં મદદ કરે.",
      "દિવસ દરમિયાન પૂરતા પ્રમાણમાં ૭-૮ ગ્લાસ પાણી પીવું."
    ],
    donts: [
      "રાત્રે મોડેથી ક્યારેય ભારે કે તીખો ભોજન ન કરવું.",
      "જમતી વખતે અથવા જમ્યા પછી તરત જ ઘણું બધું પાણી ન પીવું (અડધો કલાક પહેલા કે પછી પીવું).",
      "ભૂખ્યા પેટે ખાટા ફળો, ચા અથવા કોફી લેવાનું ટાળવું."
    ],
    foods_to_eat: "ઠંડું મોળું દૂધ, પાકેલા કેળા, જીરું, વરિયાળી, કાકડી, નાળિયેર પાણી અને વરિયાળીનું શરબત.",
    foods_to_avoid: "તીખું લાલ મરચું, સરકો (વિનેગર), અથાણાં, વાસી ખોરાક, ઢોકળા, હાંડવો, પિઝા અને સોડા.",
    remedies: [
      "જમ્યા પછી અડધી ચમચી વરિયાળી અને સાકર મોંમાં રાખીને ચાવીને ખાવી.",
      "૧ ગ્લાસ પાણીમાં અડધી ચમચી જીરું ઉકાળી, ગાળીને ઠંડુ કરીને ધીમે ધીમે પીવો.",
      "જ્યારે એસિડિટી થાય ત્યારે અડધો કપ ઠંડુ દૂધ ઘૂંટડે ઘૂંટડે પીવું."
    ]
  },
  "સાંધાનો દુખાવો / વા": {
    safe_level: "યુરિક એસિડ સ્તર: પુરુષોમાં < ૭.૦ mg/dL, સ્ત્રીઓમાં < ૬.૦ mg/dL",
    levels_info: [
      { label: "યુરિક એસિડ (પુરુષોમાં સામાન્ય)", range: "૩.૫ - ૭.૦ mg/dL" },
      { label: "યુરિક એસિડ (સ્ત્રીઓમાં સામાન્ય)", range: "૨.૫ - ૬.૦ mg/dL" },
      { label: "હાઈ યુરિક એસિડ (સાંધાનો દુખાવો વધારે)", range: "> ૭.૦ mg/dL (ગૌટ રોગનું જોખમ)" }
    ],
    symptoms: ["ઘૂંટણ, કમર અથવા આંગળીઓના સાંધામાં દુખાવો અને સોજો રહેવો", "સવારે પથારીમાંથી ઉઠતી વખતે સાંધા અકડાઈ જવા (હલનચલન ન થવું)", "સાંધામાંથી ખટાકા બોલવા કે અવાજ આવવો"],
    causes: ["કેલ્શિયમ અથવા વિટામિન ડી ની શરીરમાં ઉણપ હોવી", "શરીરનું વજન વધવું જેને લીધે ઘૂંટણ પર દબાણ આવે", "વાયુ કરે તેવો ઠંડો-વાસી ખોરાક વધુ ખાવો", "સાંધામાં લુબ્રિકેશન (ગ્રીસ/કાર્ટિલેજ) ઘટી જવું"],
    dos: [
      "રોજ સવારે હળવા હાથથી સાંધાઓ પર તલના તેલ અથવા સરસવના તેલની માલિશ કરવી.",
      "કેલ્શિયમવાળો ખોરાક (દૂધ, પનીર, રાગી) ખોરાકમાં શામેલ કરો.",
      "સાંધા લચીલા રાખવા માટે હળવો વ્યાયામ અને યોગાસન કરો."
    ],
    donts: [
      "વાસી, ઠંડો અને વાયુ કરનાર ખોરાક (બટાકા, વટાણા, ચોળા) ન ખાવા.",
      "ખૂબ ભારે વજન ઉંચકવાનું ટાળવું અને સીડીઓ ચઢ-ઉતર ઓછી કરવી.",
      "ઠંડા પાણીથી સ્નાન કરવાનું અથવા એસી (AC) માં સીધા બેસવાનું ટાળો."
    ],
    foods_to_eat: "મેથી દાણા, આદુ, હળદર, લસણ, તલ, દૂધ, મગની દાળ, રાગી અને અખરોટ.",
    foods_to_avoid: "બટાકા, રીંગણ, ચોળા, ગુવાર, મેંદાની વસ્તુઓ, આઈસ્ક્રીમ અને બરફનું ઠંડુ પાણી.",
    remedies: [
      "૧ ચમચી મેથીના દાણા રાત્રે પાણીમાં પલાળો, સવારે ચાવીને ખાઓ અને તેનું પાણી પીવો.",
      "સરગવાના પાનનો ૨ ચમચી રસ અથવા પાનને પાણીમાં ઉકાળીને તેનો કાઢો પીવો.",
      "સોજો અને દુખાવો ઓછો કરવા સાંધા પર સિંધવ મીઠાવાળા ગરમ પાણીનો શેક કરવો."
    ]
  },
  "મેદસ્વીતા / વજન નિયંત્રણ": {
    safe_level: "BMI (બોડી માસ ઈન્ડેક્સ): ૧૮.૫ થી ૨૪.૯",
    levels_info: [
      { label: "સામાન્ય તંદુરસ્ત વજન (Normal BMI)", range: "૧૮.૫ - ૨૪.૯" },
      { label: "વધારે વજન (Overweight)", range: "૨૫.૦ - ૨૯.૯" },
      { label: "અતિ મેદસ્વીતા (Obese)", range: "૩૦.૦ થી વધુ (હૃદય રોગનું જોખમ)" }
    ],
    symptoms: ["શરીરનું વજન ઊંચાઈના પ્રમાણમાં ખૂબ વધારે હોવું", "પેટ અને કમરની આસપાસ ચરબીના થર જામી જવા", "હલનચલન કે થોડું ચાલવાથી શ્વાસ ચઢવો", "આખો દિવસ આળસ અને સુસ્તી અનુભવવી"],
    causes: ["જરૂરિયાત કરતા વધુ કેલરીવાળો અને જંક ફૂડ ખાવાની ટેવ", "બેઠાડુ જીવન અને શારીરિક શ્રમનો અભાવ", "અતિશય ગળપણ અને કાર્બોહાઇડ્રેટ્સવાળો ખોરાક ખાવો", "થાઈરોઈડ હોર્મોનનું અસંતુલન થવું"],
    dos: [
      "રોજ સવારે ૫ થી ૬ કિલોમીટર ચાલવાની કસરત રાખો.",
      "ભોજનમાં તેલ, ઘી અને અનાજનું પ્રમાણ ઘટાડી સલાડ, શાકભાજી વધારો.",
      "દિવસમાં બે વાર જ ભોજન લો અને વચગાળાનો નાસ્તો ટાળો."
    ],
    donts: [
      "મેંદો, પિઝા, સમોસા, ખાંડ, કોલ્ડ ડ્રિંક્સ અને પેકેજ્ડ ફૂડ સખત રીતે બંધ કરવા.",
      "જમ્યા પછી તરત સુઈ જવું અથવા આળસમાં બેસી રહેવું નહીં.",
      "મોડી રાત્રે ભોજન કરવાનું બિલકુલ ટાળો."
    ],
    foods_to_eat: "પપૈયું, કાકડી, કોબીજ, જુવાર કે બાજરીનો રોટલો, મગની દાળ, મોળી છાસ અને ટામેટા.",
    foods_to_avoid: "બટાકાની ચિપ્સ, ફાસ્ટ ફૂડ, આઈસ્ક્રીમ, પેસ્ટ્રી, ચીઝ, માખણ અને ઘીની મીઠાઈઓ.",
    remedies: [
      "સવારે નવશેકા ગરમ પાણીમાં ૧ ચમચી મધ અને અડધા લીંબુનો રસ નાખીને પીવો.",
      "જમ્યાના અડધા કલાક પછી ૧ ગ્લાસ ગરમ પાણી પીવાની ટેવ પાડો (આ ચરબી ઓગાળે છે).",
      "દરરોજ રાત્રે ત્રિફળા ચૂર્ણ અડધી ચમચી હૂંફાળા પાણી સાથે લેવું."
    ]
  }
};

const VITAMINS_DATA = [
  {
    name: "વિટામિન A",
    normal_level: "૩૦ - ૭૦ mcg/dL",
    part: "આંખોની રોશની, ત્વચા અને રોગપ્રતિકારક શક્તિ",
    disease: "રતાંધળાપણું (આંખે રાત્રે ન દેખાવું), આંખો સુકાઈ જવી અને નબળી ત્વચા",
    foods: "ગાજર, પાકેલું પપૈયું, પાલક, પાકી કેરી, શક્કરિયા અને ગાયનું દૂધ 🥕🥛"
  },
  {
    name: "વિટામિન B-Complex",
    normal_level: "આખા જૂથની જરૂરિયાત",
    part: "ચેતાતંત્ર (Nerves), મગજની કાર્યક્ષમતા અને ખોરાકમાંથી ઊર્જા બનાવવી",
    disease: "મોંમાં વારંવાર ચાંદા પડવા, ચામડીનો સોજો (પેલાગ્રા) અને અતિશય નબળાઈ",
    foods: "આખા અનાજ (બાજરી, જુવાર), દાળ અને કઠોળ, મગફળી અને લીલા પાંદડાવાળા શાકભાજી 🌾🥜"
  },
  {
    name: "વિટામિન B12",
    normal_level: "૨૦૦ - ૯૦૦ pg/mL",
    part: "લાલ રક્તકણો (RBC) નું નિર્માણ, ડીએનએ (DNA) બનાવવું અને મગજની ચેતાઓ",
    disease: "એનિમિયા (લોહીની ઉણપ), હાથ-પગમાં સોય ભોંકાય તેવી કળતર કે ઝણઝણાટી, ચક્કર આવવા અને સ્મરણશક્તિ નબળી થવી",
    foods: "ગાયનું દૂધ, દહીં, તાજું પનીર, માખણ અને ફોર્ટીફાઈડ ખાદ્ય પદાર્થો (શાકાહારીઓ માટે ડેરી ઉત્પાદનો સર્વોત્તમ છે) 🥛🧀"
  },
  {
    name: "વિટામિન C",
    normal_level: "૦.૪ - ૧.૫ mg/dL",
    part: "રોગપ્રતિકારક શક્તિ (Immunity), ઘા રૂઝાવવા, ત્વચામાં કોલાજન અને લોહીની નળીઓ",
    disease: "સ્કર્વી (પેઢામાંથી લોહી નીકળવું અને દાંત નબળા થવા), ઘા મોડા રૂઝાવવા, અને વારંવાર શરદી-ઉધરસ થવી",
    foods: "આમળા (બેસ્ટ સ્ત્રોત), લીંબુ, નારંગી, મોસંબી, જામફળ, કાચા ટામેટા અને કોથમીર 🍋🍊"
  },
  {
    name: "વિટામિન D",
    normal_level: "૩૦ - ૧૦૦ ng/mL",
    part: "શરીરમાં કેલ્શિયમનું શોષણ કરવું, હાડકાં અને દાંતની મજબૂતી અને રોગપ્રતિકારકતા",
    disease: "રિકેટ્સ (હાડકા નબળા અને વાંકા થવા), સાંધા અને કમરનો તીવ્ર દુખાવો, હાડકાં બરડ થઈ જવા (Osteoporosis)",
    foods: "સવારનો કુમળો સૂર્યપ્રકાશ (૧૫-૨૦ મિનિટ બેસવું), ગાયનું દૂધ, પનીર અને મશરૂમ ☀️🥛"
  },
  {
    name: "વિટામિન E",
    normal_level: "૫.૫ - ૧૭ mcg/mL",
    part: "વાળ અને ત્વચાનું લચીલાપણું, એન્ટી-ઓક્સિડન્ટ ગુણો અને કોષોનું રક્ષણ",
    disease: "વાળ તૂટી જવા, ત્વચા શુષ્ક થવી, સમય પહેલા કરચલીઓ પડવી અને સ્નાયુઓની નબળાઈ",
    foods: "બદામ, અખરોટ, સૂર્યમુખીના બીજ, મગફળી, લીલા પાંદડાવાળા શાકભાજી અને સરસવનું તેલ 🥜🌱"
  },
  {
    name: "વિટામિન K",
    normal_level: "૦.૧ - ૨.૨ ng/mL",
    part: "લોહી ગંઠાઈ જવાની પ્રક્રિયા (Blood clotting) અને હાડકાનું બંધારણ",
    disease: "વાગ્યા પછી લોહી વહેતું બંધ ન થવું અને શરીરમાં આંતરિક રક્તસ્રાવ થવાનું જોખમ રહેવું",
    foods: "બ્રોકોલી, કોબીજ, પાલક, પાંદડાવાળા શાકભાજી અને સોયાબીન તેલ 🥬🥦"
  }
];

export default function HealthAssistant() {
  const [activeTab, setActiveTab] = useState("conditions");
  const [activeCondition, setActiveCondition] = useState("ડાયાબિટીસ (Type 2)");
  const [showDadiChat, setShowDadiChat] = useState(false);

  // Dadi-Ma Hybrid Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { id: Date.now(), sender: 'dadi', text: 'બેટા, રામ રામ! 👵\n\nહું છું તારી દાદી-મા. ૮૦ વર્ષના અનુભવ સાથે! 🌿\n\nકોઈ પણ સ્વાસ્થ્ય સમસ્યા ટાઈપ કરો — ઘરેલુ આયુર્વેદિક ઉપાય જણાવીશ!', isDB: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatCategory, setChatCategory] = useState('all');
  const [lastAnswer, setLastAnswer] = useState(null);
  const chatEndRef = useRef(null);

  const currentCondition = CONDITIONS_DATA[activeCondition];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      const voices = window.speechSynthesis.getVoices();
      const guVoice = voices.find(v => v.lang.includes('gu') || v.lang.includes('hi'));
      if (guVoice) utterance.voice = guVoice;
      utterance.lang = 'gu-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text) => {
    const query = text || chatInput.trim();
    if (!query) return;
    setChatInput('');

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600));

    // Step 1: Search local database
    const dbResult = searchDadiMaDB(query, chatCategory);

    if (dbResult) {
      const DISCLAIMER = '\n\n⚠️ *આ ઘરેલુ ઉપાય છે. ગંભીર બીમારી માટે ડૉક્ટર ની સલાહ ચોક્કસ લો.*';
      const finalAnswer = dbResult.answer + DISCLAIMER;
      setIsTyping(false);
      const dadiMsg = { id: Date.now() + 1, sender: 'dadi', text: finalAnswer, isDB: true, raw: dbResult.answer };
      setChatMessages(prev => [...prev, dadiMsg]);
      setLastAnswer(finalAnswer);
      speakText(dbResult.answer);
      return;
    }

    // Step 2: Try AI fallback
    if (isAIConfigured()) {
      try {
        const history = chatMessages.slice(-8);
        const aiAnswer = await callDadiMaAI(query, history);
        const DISCLAIMER = '\n\n⚠️ *આ ઘરેલુ ઉપાય છે. ગંભીર બીમારી માટે ડૉક્ટર ની સલાહ ચોક્કસ લો.*';
        const finalAnswer = aiAnswer + DISCLAIMER;
        setIsTyping(false);
        const dadiMsg = { id: Date.now() + 1, sender: 'dadi', text: finalAnswer, isAI: true, raw: aiAnswer };
        setChatMessages(prev => [...prev, dadiMsg]);
        setLastAnswer(finalAnswer);
        speakText(aiAnswer);
      } catch (err) {
        setIsTyping(false);
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1, sender: 'dadi',
          text: `બેટા, AI સાથે વાત કરવામાં સમસ્યા આવી. 😔\n\n(${err.message})\n\nએડમિન પેનલ → AI સેટિંગ ચેક કરો.`
        }]);
      }
    } else {
      setIsTyping(false);
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'dadi',
        text: 'બેટા, આ વિષે મારી પાસે હાલ જવાબ નથી. 🙏\n\nએડમિન પેનલ → AI સેટિંગ માં API Key સેટ કરો એટલે ગમે તે સવાલ પૂછી શકો!'
      }]);
    }
  };

  const handleShareAnswer = (text) => {
    const shareText = `👵 દાદી-મા ના નુસખા:\n\n${text.replace(/\*\*/g, '')}\n\n— ગુજરાતી એપ | dadi-ma chatbot 🌿`;
    if (navigator.share) {
      navigator.share({ title: 'દાદી-મા ના નુસખા', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('ઉત્તર ક્લિપબોર્ડ પર કૉપી થઈ ગયો! WhatsApp માં paste કરો.');
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Personalized Header with Dadi-ma Avatar */}
      <section id="health-hero" className="bg-gradient-to-br from-[#d2e2d9] to-[#c2d7cc] p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm">
        <div className="absolute right-[-20px] top-[-20px] opacity-10">
          <span className="material-symbols-outlined text-[150px]">health_and_safety</span>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center text-5xl select-none">
            👵
          </div>
          <div className="space-y-1">
            <p className="text-[#004d40] font-black text-xs uppercase tracking-widest">આયુર્વેદિક સ્વાસ્થ્ય સંગાથી 🛡️</p>
            <h2 className="font-gujarati font-black text-3xl text-[#004d40]">દાદી-મા ના નુસખા અને હેલ્થ કેર</h2>
            <p className="font-gujarati text-sm text-[#004d40]/80 px-4 leading-relaxed">
              નમસ્તે બેટા! તમારા રોગ વિશે સાચી માહિતી મેળવો, શું ખાવું અને શું ટાળવું તે જાણો, અને કોઈન્સ કમાઓ.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row w-full gap-3 pt-4 px-4 justify-center">
            <button 
              onClick={() => {
                setShowDadiChat(true);
                // Reset chat if reopened
                setChatMessages([{ sender: "dadi", text: "બેટા, રામ રામ! હું છું તારી દાદી-મા. તબિયત પાણી કેવા છે? તને કોઈ સ્વાસ્થ્યની સમસ્યા કે મૂંઝવણ હોય તો નીચેથી સવાલ પૂછ, હું તને આયુર્વેદિક ઉપચાર જણાવીશ! 👵✨" }]);
              }}
              className="bg-[#004d40] hover:bg-[#003d33] text-white py-4 px-8 rounded-2xl font-gujarati font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-xl">chat</span> દાદી-મા સાથે વાત કરો 👵💬
            </button>
            <a 
              href="#disclaimer-section"
              className="bg-white/70 hover:bg-white text-[#004d40] py-3.5 px-8 rounded-2xl font-gujarati font-bold text-sm active:scale-95 transition-transform border border-[#004d40]/10 flex items-center justify-center"
            >
              ડિસ્ક્લેમર વાંચો ⚠️
            </a>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <section className="flex border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setActiveTab("conditions")}
          className={`flex-1 py-4 text-center font-gujarati font-black text-lg border-b-4 transition-all ${activeTab === "conditions" ? 'border-primary text-primary' : 'border-transparent text-stone-400 dark:text-stone-600'}`}
        >
          🩺 રોગો અને સચોટ માહિતી
        </button>
        <button
          onClick={() => setActiveTab("vitamins")}
          className={`flex-1 py-4 text-center font-gujarati font-black text-lg border-b-4 transition-all ${activeTab === "vitamins" ? 'border-primary text-primary' : 'border-transparent text-stone-400 dark:text-stone-600'}`}
        >
          🥑 શરીરના જરૂરી વિટામિન્સ
        </button>
      </section>

      {/* TAB 1: Diseases & Conditions */}
      {activeTab === "conditions" && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Condition Selector Tabs (Horizontal Scroll) */}
          <section className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {Object.keys(CONDITIONS_DATA).map((c) => (
              <button 
                key={c}
                onClick={() => setActiveCondition(c)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-gujarati font-bold text-sm border-2 transition-all ${
                  activeCondition === c ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-850 text-stone-500 dark:text-stone-450'
                }`}
              >
                ● {c}
              </button>
            ))}
          </section>

          {/* Active Condition Details Panel */}
          {currentCondition && (
            <div className="space-y-6">
              
              {/* 1. Safe Levels Details card */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-2xl font-bold">health_and_safety</span>
                  <h4 className="font-gujarati font-black text-xl">સલામત સ્તર અને સામાન્ય રીડીંગ્સ (Safe Levels)</h4>
                </div>
                <div className="bg-amber-500/10 dark:bg-stone-950 border border-amber-500/20 p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <p className="font-gujarati text-xs text-stone-550 dark:text-stone-400 font-bold uppercase tracking-wider">તંદુરસ્ત રેન્જ (Ideal Value)</p>
                    <h5 className="font-headline font-black text-xl mt-1 text-primary">{currentCondition.safe_level}</h5>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-amber-500 animate-pulse">verified_user</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {currentCondition.levels_info.map((lvl, idx) => (
                    <div key={idx} className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200/50 dark:border-stone-850 flex justify-between items-center">
                      <span className="font-gujarati font-bold text-xs text-stone-700 dark:text-stone-300">{lvl.label}</span>
                      <span className="font-headline font-black text-xs bg-white dark:bg-stone-900 px-3 py-1 rounded-lg border border-black/5 text-primary">{lvl.range || lvl.normal || lvl.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Causes & Symptoms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Symptoms card */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-rose-500">
                    <span className="material-symbols-outlined font-bold">warning</span>
                    <h4 className="font-gujarati font-black text-lg">મુખ્ય લક્ષણો (Symptoms)</h4>
                  </div>
                  <ul className="space-y-2.5 pl-1.5 mt-2">
                    {currentCondition.symptoms.map((s, idx) => (
                      <li key={idx} className="font-gujarati text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2 leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Causes card */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <span className="material-symbols-outlined font-bold">psychology</span>
                    <h4 className="font-gujarati font-black text-lg">થવાના મુખ્ય કારણો (Causes)</h4>
                  </div>
                  <ul className="space-y-2.5 pl-1.5 mt-2">
                    {currentCondition.causes.map((c, idx) => (
                      <li key={idx} className="font-gujarati text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2 leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* 3. Do's and Dont's (Side-by-Side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Do's card */}
                <div className="bg-emerald-500/5 dark:bg-stone-900 border-2 border-emerald-500/10 p-6 rounded-[2.5rem] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-450">
                    <span className="material-symbols-outlined font-bold text-2xl">check_circle</span>
                    <h4 className="font-gujarati font-black text-xl">શું કરવું? (Do's)</h4>
                  </div>
                  <ul className="space-y-3">
                    {currentCondition.dos.map((item, idx) => (
                      <li key={idx} className="font-gujarati text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="material-symbols-outlined text-emerald-500 text-sm mt-0.5 shrink-0">check</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dont's card */}
                <div className="bg-rose-500/5 dark:bg-stone-900 border-2 border-rose-500/10 p-6 rounded-[2.5rem] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-450">
                    <span className="material-symbols-outlined font-bold text-2xl">cancel</span>
                    <h4 className="font-gujarati font-black text-xl">શું ન કરવું? (Don'ts)</h4>
                  </div>
                  <ul className="space-y-3">
                    {currentCondition.donts.map((item, idx) => (
                      <li key={idx} className="font-gujarati text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2.5 leading-relaxed">
                        <span className="material-symbols-outlined text-rose-500 text-sm mt-0.5 shrink-0">close</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* 4. Dietary Guide (Foods to Eat vs Avoid) */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2.5rem] shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-[#004d40]">
                  <span className="material-symbols-outlined text-2xl font-bold">restaurant_menu</span>
                  <h4 className="font-gujarati font-black text-xl">આહાર પદ્ધતિ અને ખોરાક (Diet Guide)</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/10 space-y-2">
                    <h5 className="font-gujarati font-black text-sm text-green-700 dark:text-green-400">👍 શું ખાવું? (Best Foods to Eat)</h5>
                    <p className="font-gujarati text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-bold">
                      {currentCondition.foods_to_eat}
                    </p>
                  </div>
                  <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/10 space-y-2">
                    <h5 className="font-gujarati font-black text-sm text-red-700 dark:text-red-400">👎 શું ટાળવું? (Foods to Avoid)</h5>
                    <p className="font-gujarati text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-bold">
                      {currentCondition.foods_to_avoid}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5. Home remedies / Ayurvedic Nuskhe (Parchment Card) */}
              <div className="bg-[#fbf6ef] dark:bg-stone-900 border-2 border-[#d5bdaf]/40 p-6 rounded-[2.5rem] relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(#d5bdaf_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-[#5c3e21] dark:text-[#e6ccb2]">
                    <span className="material-symbols-outlined font-black text-2xl">spa</span>
                    <h4 className="font-gujarati font-black text-xl">દાદી-મા ના ઘરેલુ આયુર્વેદિક ઉપાયો 🌿</h4>
                  </div>
                  <div className="space-y-3.5 pl-1">
                    {currentCondition.remedies.map((rem, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="h-6 w-6 rounded-full bg-[#f0e3d2] dark:bg-stone-800 text-[#8c6239] font-headline font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                        <p className="font-gujarati text-xs text-stone-750 dark:text-stone-200 leading-relaxed font-bold">
                          {rem}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: Vitamins Guide */}
      {activeTab === "vitamins" && (
        <div className="space-y-6 animate-fade-in">
          <div className="px-2">
            <h4 className="font-gujarati font-black text-2xl text-on-surface">માનવ શરીર માટે અગત્યના વિટામિન્સ 🥑</h4>
            <p className="font-gujarati text-stone-400 text-xs mt-1">શરીરના દરેક ભાગ અને રોગપ્રતિકારકતાને મજબૂત રાખતા મુખ્ય વિટામિન્સની માહિતી.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VITAMINS_DATA.map((vit, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-[2rem] shadow-sm flex flex-col justify-between gap-4 group hover:border-primary/20 transition-all"
              >
                {/* Card Title Header */}
                <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
                  <h5 className="font-gujarati font-black text-xl text-primary">{vit.name}</h5>
                  <span className="font-headline font-black text-[10px] text-stone-400 uppercase tracking-widest bg-stone-50 dark:bg-stone-950 px-2.5 py-1 rounded-md">
                    માત્રા: {vit.normal_level}
                  </span>
                </div>

                {/* Card Details Info */}
                <div className="space-y-3.5 flex-1">
                  
                  {/* Body Part usage */}
                  <div className="flex gap-2 items-start text-xs">
                    <span className="material-symbols-outlined text-blue-500 text-base shrink-0 mt-0.5">favorite</span>
                    <div>
                      <span className="font-gujarati text-stone-400 font-bold uppercase tracking-wider text-[9px] block">ઉપયોગી અંગ / કાર્ય</span>
                      <p className="font-gujarati font-bold text-stone-750 dark:text-stone-200 mt-0.5">{vit.part}</p>
                    </div>
                  </div>

                  {/* Lack of Vitamin symptoms / diseases */}
                  <div className="flex gap-2 items-start text-xs">
                    <span className="material-symbols-outlined text-rose-500 text-base shrink-0 mt-0.5">warning</span>
                    <div>
                      <span className="font-gujarati text-stone-400 font-bold uppercase tracking-wider text-[9px] block">ઉણપથી થતા રોગો / અસરો</span>
                      <p className="font-gujarati font-bold text-stone-750 dark:text-stone-200 mt-0.5">{vit.disease}</p>
                    </div>
                  </div>

                  {/* Food Sources */}
                  <div className="flex gap-2 items-start text-xs">
                    <span className="material-symbols-outlined text-emerald-500 text-base shrink-0 mt-0.5">restaurant_menu</span>
                    <div>
                      <span className="font-gujarati text-stone-400 font-bold uppercase tracking-wider text-[9px] block">મુખ્ય ખોરાક અને સ્રોતો</span>
                      <p className="font-gujarati font-bold text-stone-750 dark:text-stone-200 mt-0.5">{vit.foods}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dadi-Ma HYBRID Chatbot Modal */}
      {showDadiChat && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-[#fdf8f2] dark:bg-stone-950 border border-[#d5bdaf]/40 text-stone-850 dark:text-stone-100 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full sm:max-w-lg shadow-2xl flex flex-col" style={{maxHeight: '92vh'}}>

            {/* Chat Header */}
            <div className="flex gap-3 items-center p-5 border-b border-[#e8d5c0]/50 dark:border-stone-800 shrink-0">
              <div className="relative">
                <span className="text-4xl">👵</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex-1">
                <h3 className="font-gujarati font-black text-base text-[#5c3e21] dark:text-[#f4d6b6]">દાદી-મા ના નુસખા ચેટ</h3>
                <p className="font-gujarati text-[10px] text-stone-400">
                  {isAIConfigured() ? '🤖 AI + Database Hybrid' : '📚 Database Mode'} | 200+ ઘરેલુ ઉપાય
                </p>
              </div>
              <button
                onClick={() => { setShowDadiChat(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }}
                className="h-9 w-9 rounded-full bg-[#f0d8c0]/50 hover:bg-[#e0c8b0] text-[#5c3e21] dark:bg-stone-800 dark:text-stone-300 flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar shrink-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setChatCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-gujarati font-bold whitespace-nowrap transition-all shrink-0 ${
                    chatCategory === cat.id
                      ? 'bg-[#8c6239] text-white shadow-md'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  {msg.sender === 'dadi' && <span className="text-xl mr-2 mt-1 shrink-0">👵</span>}
                  <div className={`group max-w-[82%] relative ${
                    msg.sender === 'user' ? '' : ''
                  }`}>
                    <div className={`px-4 py-2.5 rounded-2xl font-gujarati text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#004d40] text-white rounded-tr-none font-bold'
                        : 'bg-white dark:bg-stone-900 text-[#3d2610] dark:text-stone-200 rounded-tl-none border border-[#e8d5c0]/60 dark:border-stone-800 shadow-sm'
                    }`}>
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                      )}
                    </div>
                    {/* Action buttons on dadi's messages */}
                    {msg.sender === 'dadi' && msg.text.length > 50 && (
                      <div className="flex gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleShareAnswer(msg.raw || msg.text)}
                          className="flex items-center gap-1 text-[10px] font-gujarati px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-500 hover:text-[#8c6239] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[12px]">share</span> WhatsApp
                        </button>
                        <button
                          onClick={() => speakText(msg.raw || msg.text)}
                          className="flex items-center gap-1 text-[10px] font-gujarati px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-500 hover:text-[#8c6239] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[12px]">volume_up</span> સાંભળો
                        </button>
                        {msg.isAI && <span className="text-[9px] px-2 py-1 bg-violet-100 dark:bg-violet-950 text-violet-600 rounded-full font-bold">🤖 AI</span>}
                        {msg.isDB && <span className="text-[9px] px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 rounded-full font-bold">📚 DB</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 animate-fade-in">
                  <span className="text-xl">👵</span>
                  <div className="bg-white dark:bg-stone-900 border border-[#e8d5c0]/60 dark:border-stone-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-[#8c6239] rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                      <div className="w-2 h-2 bg-[#8c6239] rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                      <div className="w-2 h-2 bg-[#8c6239] rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                      <span className="font-gujarati text-[10px] text-stone-400 ml-1">દાદી-મા વિચારી રહ્યાં છે...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 pb-2 shrink-0">
              <p className="font-gujarati text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2">ઝડપ સૂચનો:</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {QUICK_SUGGESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className="shrink-0 text-[11px] font-gujarati px-3 py-2 bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 rounded-xl text-[#8c6239] dark:text-amber-400 hover:bg-amber-100 transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    👵 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#e8d5c0]/50 dark:border-stone-800 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isTyping && handleSendMessage()}
                  placeholder="ગુજરાતી અથવા English માં ટાઈપ કરો..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-[#d5bdaf]/60 dark:border-stone-800 font-gujarati text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-[#8c6239] transition-colors disabled:opacity-60"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isTyping || !chatInput.trim()}
                  className="h-11 w-11 bg-[#8c6239] hover:bg-[#7a5430] disabled:bg-stone-300 dark:disabled:bg-stone-800 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
              <p className="font-gujarati text-[10px] text-stone-400 text-center mt-2">
                ⚠️ ઘરેલુ ઉપાય | ગંભીર બીમારી = ડૉક્ટર ની સલાહ
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Professional Medical Disclaimer Section */}
      <section 
        id="disclaimer-section" 
        className="bg-rose-500/5 dark:bg-stone-900/20 border-2 border-rose-500/20 p-6 rounded-[2.5rem] space-y-3 relative overflow-hidden"
      >
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-450">
          <span className="material-symbols-outlined font-black text-2xl">gavel</span>
          <h4 className="font-gujarati font-black text-lg">સ્વાસ્થ્ય ડિસ્ક્લેમર (Disclaimer) ⚠️</h4>
        </div>
        <p className="font-gujarati text-xs text-stone-605 dark:text-stone-300 leading-relaxed font-bold">
          ડિસ્ક્લેમર: આ એપ્લિકેશનમાં આપવામાં આવેલી તમામ આરોગ્ય સંબંધિત માહિતી, આહાર સૂચનો અને ઘરેલુ આયુર્વેદિક નુસખાઓ માત્ર સામાન્ય જાણકારી અને જાગૃતિ વધારવાના હેતુથી આપવામાં આવ્યા છે. તે કોઈપણ ડૉક્ટર કે મેડિકલ પ્રોફેશનલની તબીબી સલાહનો વિકલ્પ નથી. કોઈપણ નવી દવા, આહાર અથવા ઘરગથ્થુ સારવાર શરૂ કરતાં પહેલાં રજિસ્ટર્ડ મેડિકલ ડૉક્ટર (MBBS/MD) અથવા પ્રમાણિત આયુર્વેદિક ચિકિત્સક સાથે મસલત કરવી અનિવાર્ય છે. કોઈપણ અયોગ્ય ઉપયોગની જવાબદારી એપ તંત્રની રહેશે નહીં.
        </p>
      </section>

    </div>
  );
}
