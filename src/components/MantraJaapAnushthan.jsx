import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Confetti from 'react-confetti';
import { supabase } from '../supabaseClient';
import { getOrCreateUserId, fetchProfilesForUserIds } from '../utils/otlo_helper';
import LeaderboardUnified, { toGujaratiNum } from './LeaderboardUnified';
import mantraOnlineUrls from '../utils/mantra_online_urls.json';

// --- DEITY & MANTRA DATA WITH FULL TEXT, MEANINGS, RULES, BENEFITS & ONLINE MP3 AUDIO STREAMING ---
const MANTRA_DEITIES = [
  {
    id: 'shiv',
    name: 'ભગવાન શિવજી',
    image: '/images/gods/shiv.webp',
    mantras: [
      { 
        id: 'Om_Namah_Shivaya',
        name: 'ૐ નમઃ શિવાય', 
        fullText: '॥ ૐ નમઃ શિવાય ॥', 
        audioUrl: mantraOnlineUrls['Om_Namah_Shivaya'],
        defaultCount: 108,
        mala: '૧૦૮ દાણાની રુદ્રાક્ષની માળા',
        time: 'સવારે સ્નાન કર્યા પછી કે સંધ્યાકાળે (પ્રદોષ કાળે)',
        direction: 'ઉત્તર કે ઈશાન (ઉત્તર-પૂર્વ) દિશા',
        meaning: 'સચ્ચિદાનંદ પરબ્રહ્મ શિવજીને મારા બારંબાર પ્રણામ.',
        benefits: [
          'માનસિક તણાવ, ચિંતા અને ભયમાંથી મુક્તિ મળે છે.',
          'મનને અદભુત શાંતિ અને આત્મવિશ્વાસ પ્રાપ્ત થાય છે.',
          'સર્વ પાપોનો નાશ થાય છે અને ભગવાન ભોલેનાથની અખંડ કૃપા રહે છે.'
        ]
      },
      { 
        id: 'Mahamrityunjaya_Mantra',
        name: 'મહામૃત્યુંજય મંત્ર', 
        fullText: '॥ ૐ ત્ર્યમ્બકં યજામહે સુગન્ધિં પુષ્ટિબર્ધનમ્ । ઉર્વારુકમિવ બન્ધનાન્મૃત્યોર્મુક્ષીય મામૃતાત્ ॥', 
        audioUrl: mantraOnlineUrls['Mahamrityunjaya_Mantra'],
        defaultCount: 108,
        mala: '૧૦૮ દાણાની રુદ્રાક્ષની માળા',
        time: 'સૂર્યોદય સમયે શિવ મંદિરમાં કે ઘરમાં પૂજા સ્થાન પર',
        direction: 'ઉત્તર દિશા',
        meaning: 'ત્રિનેત્રધારી પરમેશ્વર શિવજીની અમે ઉપાસના કરીએ છીએ. તેઓ આપણને સુગંધ અને પોષણ આપે અને જન્મ-મરણના બંધનમાંથી મુક્ત કરે.',
        benefits: [
          'અકાળ મૃત્યુ અને અકસ્માતના ભયમાંથી સંપૂર્ણ રક્ષણ મળે છે.',
          'ગંભીર રોગો અને અસાધ્ય બીમારીઓનું શમન થાય છે.',
          'શારીરિક અને માનસિક આયુષ્ય-આરોગ્યની પ્રાપ્તિ થાય છે.'
        ]
      },
      { 
        id: 'Shiva_Gayatri_Mantra',
        name: 'શિવ ગાયત્રી મંત્ર', 
        fullText: '॥ ૐ તત્પુરુષાય વિદ્મહે મહાદેવાય ધીમહિ । તન્નો રુદ્રઃ પ્રચોદયાત્ ॥', 
        audioUrl: mantraOnlineUrls['Shiva_Gayatri_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ કે ચંદનની માળા',
        time: 'પ્રાતઃકાળે કે શિવરાત્રિ/સોમવારે',
        direction: 'પૂર્વ દિશા',
        meaning: 'અમે તે મહાદેવને જાણીએ છીએ અને તેમનું ધ્યાન ધરીએ છીએ. રુદ્રદેવ આપણી બુદ્ધિને સતમાર્ગે પ્રેરિત કરે.',
        benefits: [
          'આત્મજ્ઞાન અને આત્મચિંતનની શક્તિ વધે છે.',
          'બુદ્ધિ અને વિચારોમાં પવિત્રતાનો સંચાર થાય છે.',
          'રુદ્રદેવના ઓરા અને દૈવી તેજનું કવચ બને છે.'
        ]
      },
      { 
        id: 'Rudra_Beej_Mantra',
        name: 'રુદ્ર બીજ મંત્ર', 
        fullText: '॥ ૐ નમો ભગવતે રુદ્રાય ॥', 
        audioUrl: mantraOnlineUrls['Rudra_Beej_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષની માળા',
        time: 'સવારે સ્નાન કર્યા પછી શાંત ચિત્તે',
        direction: 'ઉત્તર દિશા',
        meaning: 'ભગવાન મહાકાલ રુદ્રને કોટિ કોટિ વંદન.',
        benefits: [
          'નકારાત્મક શક્તિઓ અને શત્રુ ભયનો નાશ થાય છે.',
          'આત્મવિશ્વાસમાં અપ્રતિમ વધારો થાય છે.',
          'શિવકૃપાથી અસાધ્ય કાર્યો સરળ બને છે.'
        ]
      }
    ]
  },
  {
    id: 'ram',
    name: 'શ્રી રામચંદ્રજી',
    image: '/images/gods/raam.png',
    mantras: [
      { 
        id: 'Shri_Ram_Jai_Ram',
        name: 'શ્રી રામ જય રામ જય જય રામ', 
        fullText: '॥ શ્રી રામ જય રામ જય જય રામ ॥', 
        audioUrl: mantraOnlineUrls['Shri_Ram_Jai_Ram'],
        defaultCount: 108,
        mala: 'તુલસીની કે સ્ફટિકની માળા',
        time: 'કોઈપણ સમયે, ખાસ કરીને સવાર-સાંજના સંધ્યાકાળે',
        direction: 'પૂર્વ કે ઉત્તર દિશા',
        meaning: 'મર્યાદા પુરુષોત્તમ શ્રી રામચંદ્રજીનો વિજય હો, વિજય હો.',
        benefits: [
          'હનુમાનજી અને શ્રીરામની અવિચળ કૃપા પ્રાપ્ત થાય છે.',
          'ઘર અને પરિવારમાં પરમ શાંતિ અને પ્રેમ જળવાય છે.',
          'ચિંતા, માનસિક ક્લેશ અને સંકટો દૂર થાય છે.'
        ]
      },
      { 
        id: 'Ram_Tarak_Mantra',
        name: 'રામ તારક મંત્ર', 
        fullText: '॥ ૐ રાં રામાય નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Ram_Tarak_Mantra'],
        defaultCount: 108,
        mala: 'તુલસીની માળા',
        time: 'બ્રહ્મ મુહૂર્તમાં કે સંધ્યાકાળે',
        direction: 'પૂર્વ દિશા',
        meaning: 'સર્વ દુઃખો અને પાપોને તારનાર રામ નામને નમસ્કાર.',
        benefits: [
          'કળિયુગના સમસ્ત પાપો અને દોષોમાંથી મુક્તિ મળે છે.',
          'આધ્યાત્મિક ઉન્નતિ અને મોક્ષ માર્ગ સુગમ બને છે.',
          'પરિવારમાં સુખ-સમૃદ્ધિનો વાસ થાય છે.'
        ]
      },
      { 
        id: 'Ram_Gayatri_Mantra',
        name: 'રામ ગાયત્રી મંત્ર', 
        fullText: '॥ ૐ દાશરથાય વિદ્મહે સીતાવલ્લભાય ધીમહિ । તન્નો રામઃ પ્રચોદયાત્ ॥', 
        audioUrl: mantraOnlineUrls['Ram_Gayatri_Mantra'],
        defaultCount: 108,
        mala: 'તુલસીની માળા',
        time: 'સૂર્યોદય સમયે',
        direction: 'પૂર્વ દિશા',
        meaning: 'દશરથપુત્ર અને સીતાપતિ શ્રી રામનું ધ્યાન ધરીએ છીએ, તેઓ આપણી બુદ્ધિને સન્માર્ગે દોરે.',
        benefits: [
          'સદાચાર, ધર્મ અને શ્રેષ્ઠ સંસ્કારોનું સિંચન થાય છે.',
          'નેતૃત્વ ક્ષમતા અને નિર્ણય શક્તિમાં વૃદ્ધિ થાય છે.'
        ]
      }
    ]
  },
  {
    id: 'hanuman',
    name: 'હનુમાનજી દાદા',
    image: '/images/gods/hanuman_ji.jpeg',
    mantras: [
      { 
        id: 'Hanuman_Beej_Mantra',
        name: 'હનુમાન બીજ મંત્ર', 
        fullText: '॥ ૐ હં હનુમતે નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Hanuman_Beej_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ કે લાલ ચંદનની માળા',
        time: 'મંગળવાર કે શનિવારે સવારે/સાંજે તેલનો દીવો કરીને',
        direction: 'દક્ષિણ કે પૂર્વ દિશા',
        meaning: 'મહાબલી સંકટમોચન શ્રી હનુમાનજીને નમસ્કાર.',
        benefits: [
          'શનિ સાડાસાતી, રાહુ-કેતુ દોષ અને ગ્રહ પીડામાંથી શાંતિ મળે છે.',
          'ભય, નજર દોષ અને નકારાત્મક ઊર્જા તુરંત દૂર થાય છે.',
          'શારીરિક બળ અને પરાક્રમમાં વૃદ્ધિ થાય છે.'
        ]
      },
      { 
        id: 'Manojavam_Stotra_Mantra',
        name: 'મનોજવં સ્તોત્ર મંત્ર', 
        fullText: '॥ મનોજવં મારુતતુલ્યવેગં જિતેન્દ્રિયં બુદ્ધિમતાં વરિષ્ઠમ્ । વાતાત્મજં વાનરયૂથમુખ્યં શ્રીરામદૂતં શરણં પ્રપદ્યે ॥', 
        audioUrl: mantraOnlineUrls['Manojavam_Stotra_Mantra'],
        defaultCount: 21,
        mala: 'રુદ્રાક્ષની માળા',
        time: 'સંકટ સમયે કે નિત્ય સવારે',
        direction: 'પૂર્વ કે દક્ષિણ દિશા',
        meaning: 'મન અને પવન જેવા વેગ વાળા, જિતેન્દ્રિય, બુદ્ધિમાનોમાં શ્રેષ્ઠ અને શ્રીરામના દૂત હનુમાનજીની શરણે જઉં છું.',
        benefits: [
          'અસાધ્ય વિઘ્નો અને અટકેલા કાર્યો ત્વરિત પૂર્ણ થાય છે.',
          'તીવ્ર બુદ્ધિ, યાદશક્તિ અને મનોબળ પ્રાપ્ત થાય છે.'
        ]
      },
      { 
        id: 'Sankat_Nashak_Hanuman_Mantra',
        name: 'સંકટ નાશક હનુમાન મંત્ર', 
        fullText: '॥ ૐ નમો ભગવતે આંજનેયાય મહાબલાય સ્વાહા ॥', 
        audioUrl: mantraOnlineUrls['Sankat_Nashak_Hanuman_Mantra'],
        defaultCount: 108,
        mala: 'લાલ ચંદન કે રુદ્રાક્ષ માળા',
        time: 'મંગળવારે અને શનિવારે હનુમાનજી સમક્ષ સિંદૂર અર્પણ કરીને',
        direction: 'પૂર્વ દિશા',
        meaning: 'અંજનીપુત્ર મહાબલી હનુમાનજી સમક્ષ સર્વ ભય અને વિઘ્નોનો નાશ થાય.',
        benefits: [
          'જીવનના અણધાર્યા આકસ્મિક સંકટોનો નાશ થાય છે.',
          'કોર્ટ-કચેરી અને વ્યાપારિક વિઘ્નોમાં સફળતા મળે છે.'
        ]
      }
    ]
  },
  {
    id: 'mataji',
    name: 'જગદંબા માતાજી',
    image: '/images/gods/devi.jpeg',
    mantras: [
      { 
        id: 'Navarna_Mantra',
        name: 'નવાર્ણ મંત્ર', 
        fullText: '॥ ૐ ઐં હ્રીં ક્લીં ચામુંડાયૈ વિચ્ચે ॥', 
        audioUrl: mantraOnlineUrls['Navarna_Mantra'],
        defaultCount: 108,
        mala: 'કમળકાકડી કે લાલ ચંદનની માળા',
        time: 'નવરાત્રિમાં કે દર શુક્રવારે/અષ્ટમીએ સાંજે દીવો પ્રગટાવીને',
        direction: 'ઉત્તર કે પૂર્વ દિશા',
        meaning: 'મહાકાળી, મહાલક્ષ્મી અને મહાસરસ્વતી સ્વરૂપા માતા ચામુંડાને કોટિ પ્રણામ.',
        benefits: [
          'મહાકાળી, મહાલક્ષ્મી અને મહાસરસ્વતીની ત્રિવિધ કૃપા મળે છે.',
          'શત્રુ બાધા અને નકારાત્મક વશીકરણનો નાશ થાય છે.',
          'અષ્ટ સિદ્ધિ અને નવ નિધિની પ્રેરણા મળે છે.'
        ]
      },
      { 
        id: 'Gayatri_Mahamantra',
        name: 'ગાયત્રી મહામંત્ર', 
        fullText: '॥ ૐ ભૂર્ભુવઃ સ્વઃ તત્સવિતુર્વરેણ્યં ભર્ગો દેવસ્ય ધીમહિ ધિયો યો નઃ પ્રચોદયાત્ ॥', 
        audioUrl: mantraOnlineUrls['Gayatri_Mahamantra'],
        defaultCount: 108,
        mala: 'તુલસી કે સ્ફટિક માળા',
        time: 'સૂર્યોદય, મધ્યાહ્ન કે સૂર્યાસ્ત સમયે (ત્રિસંધ્યા)',
        direction: 'પૂર્વ દિશા (સૂર્ય સાક્ષીએ)',
        meaning: 'તે પ્રાણસ્વરૂપ, દુઃખનાશક, સુખસ્વરૂપ અને શ્રેષ્ઠ તેજસ્વી પરમાત્માનું અમે ધ્યાન ધરીએ છીએ. તે સૂર્યદેવ આપણી બુદ્ધિને સન્માર્ગે પ્રેરિત કરે.',
        benefits: [
          'બુદ્ધિની તેજસ્વિતા અને એકાગ્રતા શક્તિ અપ્રતિમ વધે છે.',
          'શરીરના સમસ્ત કોષોમાં દૈવી ઊર્જાનું વાઇબ્રેશન આવે છે.',
          'સર્વ વિધિ-વિધાન અને વિદ્યા અભ્યાસમાં શ્રેષ્ઠ સફળતા મળે છે.'
        ]
      },
      { 
        id: 'Mahalakshmi_Beej_Mantra',
        name: 'મહાલક્ષ્મી મંત્ર', 
        fullText: '॥ ૐ શ્રીં હ્રીં ક્લીં ત્રિભુવન મહાલક્ષ્મ્યૈ અસ્માંક દારિદ્ર્ય નાશય પ્રચુર ધન દેહિ દેહિ ક્લીં હ્રીં શ્રીં ૐ ॥', 
        audioUrl: mantraOnlineUrls['Mahalakshmi_Beej_Mantra'],
        defaultCount: 108,
        mala: 'કમળકાકડીની માળા કે સ્ફટિક માળા',
        time: 'શુક્રવારે કે દીપાવલી/પૂનમના દિવસે રાત્રે',
        direction: 'ઉત્તર દિશા (કુબેર સ્થાન)',
        meaning: 'ત્રિલોકની સ્વામિની મહાલક્ષ્મી માતા આપણી દરિદ્રતાનો નાશ કરે અને સુખ-સમૃદ્ધિ આપે.',
        benefits: [
          'અખંડ લક્ષ્મી પ્રાપ્તિ અને દારિદ્ર્ય નાશ થાય છે.',
          'વ્યાપાર-ધંધા અને નોકરીમાં ધન વૃદ્ધિ થાય છે.',
          'ઘરમાં સમૃદ્ધિ અને અન્ન-ધન ભંડાર ભરેલા રહે છે.'
        ]
      },
      { 
        id: 'Sarva_Mangala_Mangalye',
        name: 'સર્વ મંગલ માંગલ્યે શ્લોક', 
        fullText: '॥ સર્વમંગલ માંગલ્યે શિવે સર્વાર્થ સાધિકે । શરણ્યે ત્ર્યંબકે ગૌરિ નારાયણિ નમોऽસ્તુ તે ॥', 
        audioUrl: mantraOnlineUrls['Sarva_Mangala_Mangalye'],
        defaultCount: 21,
        mala: 'તુલસી કે રુદ્રાક્ષ માળા',
        time: 'નિત્ય પૂજા સમયે કે શુભ કાર્ય પ્રસંગે',
        direction: 'પૂર્વ કે ઉત્તર દિશા',
        meaning: 'સર્વ મંગળ કરનારી, કલ્યાણકારી અને પુરુષાર્થ સિદ્ધ કરનારી પવિત્ર જગદંબા નારાયણીને નમસ્કાર હો.',
        benefits: [
          'ઘર પરિવારમાં સતત કલ્યાણ અને મંગળ કાર્યો થાય છે.',
          'દરેક શુભ કાર્ય નિર્વિઘ્ને સંપન્ન થાય છે.'
        ]
      }
    ]
  },
  {
    id: 'krishna',
    name: 'શ્રી કૃષ્ણ ભગવાન',
    image: '/images/gods/krishna.jpg',
    mantras: [
      { 
        id: 'Hare_Krishna_Mahamantra',
        name: 'હરે કૃષ્ણ મહામંત્ર', 
        fullText: '॥ હરે કૃષ્ણ હરે કૃષ્ણ કૃષ્ણ કૃષ્ણ હરે હરે । હરે રામ હરે રામ રામ રામ હરે હરે ॥', 
        audioUrl: mantraOnlineUrls['Hare_Krishna_Mahamantra'],
        defaultCount: 108,
        mala: '૧૦૮ દાણાની તુલસી માળા',
        time: 'બ્રહ્મ મુહૂર્તમાં કે નિત્ય પ્રભાતે',
        direction: 'પૂર્વ કે ઉત્તર દિશા',
        meaning: 'કળિયુગના સમસ્ત પાપો અને તાપોમાંથી મુક્તિ આપનારો પરમ તારક મહામંત્ર.',
        benefits: [
          'આત્માને પરમ આનંદ અને શાંતિની અનુભૂતિ થાય છે.',
          'કૃષ્ણ પ્રેમ અને શુદ્ધ ભક્તિભાવ જાગ્રત થાય છે.',
          'હૃદયમાંથી કામ, ક્રોધ અને અહંકારનો નાશ થાય છે.'
        ]
      },
      { 
        id: 'Vasudev_Mantra',
        name: 'વાસુદેવ મંત્ર', 
        fullText: '॥ ૐ નમો ભગવતે વાસુદેવાય ॥', 
        audioUrl: mantraOnlineUrls['Vasudev_Mantra'],
        defaultCount: 108,
        mala: 'તુલસીની માળા',
        time: 'સવારે સ્નાન કર્યા પછી',
        direction: 'પૂર્વ દિશા',
        meaning: 'સર્વવ્યાપી પરબ્રહ્મ ભગવાન વાસુદેવને મારા પ્રણામ.',
        benefits: [
          'પાપોનું ક્ષાલન થાય છે અને મોક્ષ માર્ગ ખુલે છે.',
          'વિષ્ણુલોકની પ્રાપ્તિ અને પરિવારમાં પરમ સુખ આવે છે.'
        ]
      },
      { 
        id: 'Shri_Krishna_Sharanam_Mama',
        name: 'શ્રી કૃષ્ણ શરણં મમ', 
        fullText: '॥ શ્રી કૃષ્ણઃ શરણં મમ ॥', 
        audioUrl: mantraOnlineUrls['Shri_Krishna_Sharanam_Mama'],
        defaultCount: 108,
        mala: 'તુલસી માળા',
        time: 'પ્રાતઃકાળે કે રાત્રે શયન પૂર્વે',
        direction: 'પૂર્વ કે ઉત્તર દિશા',
        meaning: 'ભગવાન શ્રીકૃષ્ણ જ મારું એકમાત્ર શરણું છે.',
        benefits: [
          'સંપૂર્ણ આત્મસમર્પણ અને ચિંતામાંથી મુક્તિ મળે છે.',
          'ભગવદ્‌ રક્ષણ અને અવિચળ આશ્રય પ્રાપ્ત થાય છે.'
        ]
      }
    ]
  },
  {
    id: 'swaminarayan',
    name: 'સ્વામિનારાયણ ભગવાન',
    image: '/images/gods/swaminarayan.jpeg',
    mantras: [
      { 
        id: 'Swaminarayan_Mahamantra',
        name: 'સ્વામિનારાયણ મહામંત્ર', 
        fullText: '॥ સ્વામિનારાયણ સ્વામિનારાયણ સ્વામિનારાયણ ॥', 
        audioUrl: mantraOnlineUrls['Swaminarayan_Mahamantra'],
        defaultCount: 108,
        mala: 'તુલસી કે ચંદનની માળા',
        time: 'પ્રાતઃ પૂજા સમયે કે દૈનિક સભામાં',
        direction: 'પૂર્વ દિશા',
        meaning: 'પરબ્રહ્મ પુરુષોત્તમ ભગવાન સ્વામિનારાયણનું અખંડ નામ સ્મરણ.',
        benefits: [
          'પરબ્રહ્મ પુરુષોત્તમ નારાયણનો સાક્ષાત્કાર થાય છે.',
          'જીવનું આત્યંતિક કલ્યાણ અને અક્ષરધામની પ્રાપ્તિ થાય છે.',
          'મન પવિત્ર બને છે અને દુષ્વ્યસનો મુક્ત થાય છે.'
        ]
      },
      { 
        id: 'Shri_Swaminarayan_Mantra',
        name: 'શ્રી સ્વામિનારાયણ મંત્ર', 
        fullText: '॥ ૐ શ્રી સ્વામિનારાયણાય નમો નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Shri_Swaminarayan_Mantra'],
        defaultCount: 108,
        mala: 'તુલસી માળા',
        time: 'સવાર-સંખ્યા પૂજા સમયે',
        direction: 'પૂર્વ દિશા',
        meaning: 'ભગવાન સ્વામિનારાયણના ચરણોમાં બારંબાર નમસ્કાર.',
        benefits: [
          'દૈવી ગુણોનો વિકાસ થાય છે.',
          'સાધુતા અને સત્સંગ નિષ્ઠા દ્રઢ બને છે.'
        ]
      }
    ]
  },
  {
    id: 'ganesh',
    name: 'ગણેશજી દાદા',
    image: '/images/gods/ganesh.jpg',
    mantras: [
      { 
        id: 'Ganesh_Beej_Mantra',
        name: 'ગણેશ બીજ મંત્ર', 
        fullText: '॥ ૐ ગં ગણપતયે નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Ganesh_Beej_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ કે રક્તચંદન માળા',
        time: 'બુધવારે કે દૈનિક પૂજાના પ્રારંભે',
        direction: 'ઉત્તર કે પૂર્વ દિશા',
        meaning: 'વિઘ્નહર્તા મંગલમૂર્તિ ગણેશજીને પ્રણામ.',
        benefits: [
          'સર્વ વિઘ્નો, અડચણો અને રૂકાવટો દૂર થાય છે.',
          'બુદ્ધિ, જ્ઞાન અને રિદ્ધિ-સિદ્ધિ પ્રાપ્ત થાય છે.',
          'નવા કાર્યોનો પ્રારંભ શુભ અને સફળ બને છે.'
        ]
      },
      { 
        id: 'Vakratunda_Mahakaya_Shloka',
        name: 'વક્રતુંડ મહાકાય શ્લોક', 
        fullText: '॥ વક્રતુંડ મહાકાય સૂર્યકોટિ સમપ્રભ । નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા ॥', 
        audioUrl: mantraOnlineUrls['Vakratunda_Mahakaya_Shloka'],
        defaultCount: 21,
        mala: 'રુદ્રાક્ષ માળા',
        time: 'કોઈપણ પૂજા કે શુભ કાર્યની શરૂઆતમાં',
        direction: 'ઉત્તર દિશા',
        meaning: 'જેમનું મુખ વક્ર છે, શરીર વિશાળ છે અને કરોડ સૂર્ય સમાન તેજ છે, તે ગણેશજી મારા સર્વ કાર્યો નિર્વિઘ્ને પૂર્ણ કરે.',
        benefits: [
          'કોઈપણ વિઘ્ન કે અડચણ વગર કાર્ય સિદ્ધ થાય છે.',
          'ઘરમાં મંગલકારી ઊર્જાનો પ્રવેશ થાય છે.'
        ]
      },
      { 
        id: 'Ganesh_Gayatri_Mantra',
        name: 'ગણેશ ગાયત્રી મંત્ર', 
        fullText: '॥ ૐ એકદન્તાય વિદ્મહે વક્રતુણ્ડાય ધીમહિ । તન્નો દન્તી પ્રચોદયાત્ ॥', 
        audioUrl: mantraOnlineUrls['Ganesh_Gayatri_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ માળા',
        time: 'પ્રાતઃકાળે સૂર્યોદયે',
        direction: 'પૂર્વ દિશા',
        meaning: 'અમે એકદંત અને વક્રતુંડ ગણેશજીનું ધ્યાન કરીએ છીએ, તેઓ આપણી બુદ્ધિને પ્રકાશિત કરે.',
        benefits: [
          'વિદ્યાર્થીઓ માટે એકાગ્રતા અને બુદ્ધિનો અદભુત વિકાસ.',
          'વિચારીને સાચા નિર્ણયો લેવાની ક્ષમતા વધે છે.'
        ]
      }
    ]
  },
  {
    id: 'surya_navgrah',
    name: 'સૂર્યદેવ અને નવગ્રહ',
    image: '/images/gods/navgraha.jpeg',
    mantras: [
      { 
        id: 'Surya_Gayatri_Mantra',
        name: 'સૂર્ય ગાયત્રી મંત્ર', 
        fullText: '॥ ૐ ભાસ્કરાય વિદ્મહે મહાતેજાય ધીમહિ । તન્નો સૂર્યઃ પ્રચોદયાત્ ॥', 
        audioUrl: mantraOnlineUrls['Surya_Gayatri_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ કે રક્તચંદન માળા',
        time: 'સૂર્યોદય સમયે તાંબાના લોટાથી જળ અર્પણ કરીને',
        direction: 'પૂર્વ દિશા (સૂર્ય તરફ)',
        meaning: 'સર્વ જગતના આત્મા સૂર્યનારાયણ દેવનું ધ્યાન કરીએ છીએ, તેઓ આપણું કલ્યાણ કરે.',
        benefits: [
          'આંખોનું તેજ અને શારીરિક સ્વાસ્થ્ય સુધરે છે.',
          'સમાજમાં પદ, પ્રતિષ્ઠા, માન-સન્માન અને કીર્તિ વધે છે.',
          'આત્મવિશ્વાસ અને તેજસ્વી પ્રભા મંડળ (Aura) બને છે.'
        ]
      },
      { 
        id: 'Surya_Beej_Mantra',
        name: 'સૂર્ય બીજ મંત્ર', 
        fullText: '॥ ૐ ઘૃણિઃ સૂર્યાય નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Surya_Beej_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ માળા',
        time: 'રવિવારે પ્રાતઃકાળે',
        direction: 'પૂર્વ દિશા',
        meaning: 'પ્રત્યક્ષ દેવ સૂર્યનારાયણને કોટિ વંદન.',
        benefits: [
          'પિતૃ દોષ અને સૂર્ય ગ્રહ દોષનું નિવારણ થાય છે.',
          'સરકારી કાર્યો અને ઉચ્ચ હોદ્દાની પ્રાપ્તિ થાય છે.'
        ]
      },
      { 
        id: 'Shani_Beej_Mantra',
        name: 'શનિ બીજ મંત્ર', 
        fullText: '॥ ૐ પ્રાં ત્રીં પ્રોં સઃ શનૈશ્ચરાય નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Shani_Beej_Mantra'],
        defaultCount: 108,
        mala: 'કાળા અકીક કે રુદ્રાક્ષ માળા',
        time: 'શનિવારે સાંજે પીપળાના વૃક્ષ પાસે દીવો પ્રગટાવીને',
        direction: 'ઉત્તર કે પશ્ચિમ દિશા',
        meaning: 'શનિદેવના સાડાસાતી અને પાનોતીના કષ્ટમાંથી મુક્તિ આપનારો પવિત્ર બીજ મંત્ર.',
        benefits: [
          'શનિની સાડાસાતી અને ઢૈય્યા (પાનોતી) ના કષ્ટ શમે છે.',
          'ન્યાયિક બાબતો અને શારીરિક પીડામાં રાહત મળે છે.',
          'શનિદેવની કૃપાથી સ્થિર સંપત્તિ પ્રાપ્ત થાય છે.'
        ]
      },
      { 
        id: 'Rahu_Beej_Mantra',
        name: 'રાહુ બીજ મંત્ર', 
        fullText: '॥ ૐ ભ્રાં ભ્રીં ભ્રૌં સઃ રાહવે નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Rahu_Beej_Mantra'],
        defaultCount: 108,
        mala: 'ચંદન કે રુદ્રાક્ષ માળા',
        time: 'શનિવારે કે રાહુ કાળ પછી સાંજે',
        direction: 'દક્ષિણ-પશ્ચિમ (નૈઋત્ય)',
        meaning: 'રાહુ ગ્રહના શાંતિ અને દોષનિવારણ અર્થે પવિત્ર જપ.',
        benefits: [
          'અણધાર્યા કષ્ટ, ભ્રમ અને અચાનક નુકસાનમાંથી બચાવ.',
          'રાહુ દોષ શાંત થાય છે અને બુદ્ધિ સ્થિર રહે છે.'
        ]
      },
      { 
        id: 'Ketu_Beej_Mantra',
        name: 'કેતુ બીજ મંત્ર', 
        fullText: '॥ ૐ સ્ત્રાં સ્ત્રીં સ્ત્રૌં સઃ કેતવે નમઃ ॥', 
        audioUrl: mantraOnlineUrls['Ketu_Beej_Mantra'],
        defaultCount: 108,
        mala: 'રુદ્રાક્ષ માળા',
        time: 'સાંજના સમયે',
        direction: 'ઉત્તર-પશ્ચિમ (વાગવ્ય)',
        meaning: 'કેતુ ગ્રહના શુભ પ્રભાવ અને રક્ષણ અર્થે જપ.',
        benefits: [
          'આધ્યાત્મિક જાગૃતિ અને ગૂઢ વિજ્ઞાનની સમજ વધે છે.',
          'ત્વચા અને ચર્મ રોગોમાં શાંતિ મળે છે.'
        ]
      },
      { 
        id: 'Navgrah_Pidahai_Mantra',
        name: 'નવગ્રહ પીડાહર મંત્ર', 
        fullText: '॥ ૐ બ્રહ્મા મુરારિ સ્ત્રિપુરાંતકારી ભાનુઃ શશી ભૂમિસુતો બુધશ્ચ । ગુરુશ્ચ શુક્રઃ શનિ રાહુ કેતવઃ સર્વે ગ્રહાઃ શાંતિકરા ભવંતુ ॥', 
        audioUrl: mantraOnlineUrls['Navgrah_Pidahai_Mantra'],
        defaultCount: 21,
        mala: 'રુદ્રાક્ષ માળા',
        time: 'દરોજ સવારે પૂજાના અંતે',
        direction: 'પૂર્વ કે ઉત્તર દિશા',
        meaning: 'બ્રહ્મા, વિષ્ણુ, શિવ અને નવગ્રહો (સૂર્ય, ચંદ્ર, મંગળ, બુધ, ગુરુ, શુક્ર, શનિ, રાહુ, કેતુ) આપણી રક્ષા કરે અને શાંતિ પ્રદાન કરે.',
        benefits: [
          'સમસ્ત નવગ્રહો અનુકૂળ બની શાંતિ અને લાભ આપે છે.',
          'કુંડળીના ગ્રહ દોષોનું અદભુત શમન થાય છે.'
        ]
      }
    ]
  }
];

// --- OFFLINE AUDIO CACHE ENGINE (IndexedDB / Cache API) ---
const AUDIO_CACHE_NAME = 'gujarati-mantra-audio-v1';

const getCachedAudioUrl = async (url) => {
  if (!url || !('caches' in window)) return url;
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    const cachedResponse = await cache.match(url);

    if (cachedResponse) {
      console.log('Playing from offline local cache storage:', url);
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }

    // Background fetch & cache for 100% offline availability next time
    fetch(url).then(async (res) => {
      if (res && res.status === 200) {
        const c = await caches.open(AUDIO_CACHE_NAME);
        c.put(url, res);
        console.log('Audio cached offline for future use:', url);
      }
    }).catch(() => {});

    return url;
  } catch (e) {
    return url;
  }
};

export default function MantraJaapAnushthan() {
  const navigate = useNavigate();

  // Navigation / Screen State
  const [screen, setScreen] = useState('deity'); // 'deity', 'mantra', 'target', 'active', 'certificate'
  const [selectedDeity, setSelectedDeity] = useState(MANTRA_DEITIES[0]);
  const [selectedMantra, setSelectedMantra] = useState(MANTRA_DEITIES[0].mantras[0]);
  const [mantraTarget, setMantraTarget] = useState(108);
  const [mantraCount, setMantraCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-Repeat Hands-Free Audio Chanting Mode
  const [autoChantMode, setAutoChantMode] = useState(false);
  const mantraCountRef = useRef(0);
  const mantraTargetRef = useRef(108);
  const autoChantRef = useRef(false);

  useEffect(() => {
    mantraCountRef.current = mantraCount;
    mantraTargetRef.current = mantraTarget;
    autoChantRef.current = autoChantMode;
  }, [mantraCount, mantraTarget, autoChantMode]);

  // Info Modal State for Mantra Details & Benefits
  const [infoModalMantra, setInfoModalMantra] = useState(null);

  // Audio Playback State (Soothing Calm Mantra Voice)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioInstanceRef = useRef(null);

  // Leaderboard Data
  const [leaderboard, setLeaderboard] = useState([]);
  const [userTotalJaaps, setUserTotalJaaps] = useState(0);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');

  // Sensors & Sound
  const [motionActive, setMotionActive] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const name = profile.name || localStorage.getItem('google_name') || localStorage.getItem('user_full_name') || 'સાધક';
    const city = profile.city || 'અમદાવાદ';
    setUserName(name);
    setUserCity(city);
    fetchLeaderboard();
  }, []);

  // Stop Audio playback
  const stopMantraAudio = () => {
    if (audioInstanceRef.current) {
      if (typeof audioInstanceRef.current.pause === 'function') {
        audioInstanceRef.current.pause();
      }
      audioInstanceRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Soothing Voice Mantra Audio Handler with Offline Caching & Auto-Repeat Hands-Free Mode
  const handleToggleMantraAudio = async (mantraObj, overrideAutoMode = null) => {
    if (isPlayingAudio) {
      stopMantraAudio();
      return;
    }

    const textToSpeak = mantraObj.fullText || mantraObj.name;
    const customUrl = mantraObj.audioUrl;
    const isAutoLoop = overrideAutoMode !== null ? overrideAutoMode : autoChantMode;

    setIsPlayingAudio(true);

    if (customUrl) {
      const playUrl = await getCachedAudioUrl(customUrl);
      const audio = new Audio(playUrl);
      // Automatic 1.02x Speed & Pitch Shift
      audio.playbackRate = 1.02;
      audio.defaultPlaybackRate = 1.02;
      audioInstanceRef.current = audio;

      audio.onended = () => {
        if (autoChantRef.current && screen === 'active') {
          // Auto-Increment Count & Replay next loop hands-free!
          incrementJapaAutoLoop(mantraObj);
        } else {
          setIsPlayingAudio(false);
        }
      };

      audio.play().catch((e) => {
        console.log('Audio playback error:', e);
        setIsPlayingAudio(false);
      });
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = textToSpeak.replace(/[॥।]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.77;
      utterance.pitch = 0.96;

      const voices = window.speechSynthesis.getVoices();
      const guVoice = voices.find(v => v.lang.toLowerCase().includes('gu'));
      const hiVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
      if (guVoice) utterance.voice = guVoice;
      else if (hiVoice) utterance.voice = hiVoice;
      else utterance.lang = 'hi-IN';

      utterance.onend = () => {
        if (autoChantRef.current && screen === 'active') {
          incrementJapaAutoLoop(mantraObj);
        } else {
          setIsPlayingAudio(false);
        }
      };
      utterance.onerror = () => setIsPlayingAudio(false);

      audioInstanceRef.current = {
        stop: () => window.speechSynthesis.cancel()
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "આપના બ્રાઉઝરમાં ઓડિયો પ્લેબેક ઉપલબ્ધ નથી." } }));
    }
  };

  // Helper for Auto-Repeat Chanting Loop
  const incrementJapaAutoLoop = (mantraObj) => {
    const current = mantraCountRef.current;
    const target = mantraTargetRef.current;
    const next = current + 1;

    if (navigator.vibrate) navigator.vibrate(30);

    setMantraCount(next);
    mantraCountRef.current = next;

    if (next % 108 === 0) {
      setCompletedMalas(m => m + 1);
      playTempleBell();
    }

    if (next >= target) {
      // Reached Target!
      playTempleBell();
      setShowConfetti(true);
      stopMantraAudio();
      saveCompletedAnushthan(next);
      setTimeout(() => setScreen('certificate'), 600);
    } else if (autoChantRef.current) {
      // Replay audio for next loop
      setTimeout(() => {
        handleToggleMantraAudio(mantraObj, true);
      }, 150);
    } else {
      setIsPlayingAudio(false);
    }
  };

  // Cleanup audio when leaving or changing screen
  useEffect(() => {
    return () => {
      stopMantraAudio();
    };
  }, [screen]);

  // Play Temple Bell Sound (Audio Synth)
  const playTempleBell = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  // Gyro motion sensor logic
  useEffect(() => {
    let lastTime = 0;
    let lastX = 0, lastY = 0, lastZ = 0;
    const threshold = 15;

    const handleMotion = (event) => {
      if (!motionActive || screen !== 'active') return;
      const current = event.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if ((currentTime - lastTime) > 250) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const deltaX = Math.abs(current.x - lastX);
        const deltaY = Math.abs(current.y - lastY);
        const deltaZ = Math.abs(current.z - lastZ);

        const speed = (deltaX + deltaY + deltaZ) / diffTime * 10000;

        if (speed > threshold) {
          incrementJapa();
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    if (motionActive) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [motionActive, screen, mantraCount, mantraTarget]);

  // Handle Jaap Increment
  const incrementJapa = () => {
    if (screen !== 'active') return;

    if (navigator.vibrate) navigator.vibrate(35);

    setMantraCount(prev => {
      const next = prev + 1;
      mantraCountRef.current = next;
      if (next % 108 === 0) {
        setCompletedMalas(m => m + 1);
        playTempleBell();
      }

      if (next >= mantraTarget) {
        // Target Reached!
        playTempleBell();
        setShowConfetti(true);
        stopMantraAudio();
        saveCompletedAnushthan(next);
        setTimeout(() => setScreen('certificate'), 600);
        return next;
      }
      return next;
    });
  };

  // Save Anushthan Score & Update Leaderboard
  const saveCompletedAnushthan = async (count) => {
    const uid = getOrCreateUserId();
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const uName = userName || profile.name || 'સાધક';
    const uCity = userCity || profile.city || 'અમદાવાદ';

    try {
      // 1. Local Storage tracking
      const previousTotal = parseInt(localStorage.getItem('mantra_total_jaaps') || '0', 10);
      const newTotal = previousTotal + count;
      localStorage.setItem('mantra_total_jaaps', newTotal.toString());
      setUserTotalJaaps(newTotal);

      // 2. Supabase Upsert
      await supabase.from('mantra_jaap_scores').upsert({
        user_id: uid,
        player_name: uName,
        city: uCity,
        mantra_name: selectedMantra.name,
        target_count: mantraTarget,
        total_jaaps: newTotal,
        last_jaap_date: new Date().toISOString()
      }, { onConflict: 'user_id' });

      await fetchLeaderboard();
    } catch (err) {
      console.log('Error saving mantra jaap score:', err);
    }
  };

  // Fetch Leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('mantra_jaap_scores')
        .select('*')
        .order('total_jaaps', { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        const uid = getOrCreateUserId();
        const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
        const userIds = data.map(x => x.user_id).filter(Boolean);
        
        let profileMap = {};
        if (userIds.length > 0) {
          profileMap = await fetchProfilesForUserIds(userIds);
        }

        const mapped = data.map((item) => {
          const isUser = item.user_id === uid || item.player_name === userName;
          const uProf = profileMap[item.user_id] || {};
          return {
            name: item.player_name,
            score: item.total_jaaps,
            mantra: item.mantra_name || 'ૐ નમઃ શિવાય',
            target: item.target_count || 108,
            isUser,
            city: isUser ? (userCity || profile.city || uProf.city) : (item.city || uProf.city || 'અમદાવાદ'),
            avatar: isUser ? (profile.avatar || uProf.photo_url) : (uProf.photo_url || null)
          };
        });
        setLeaderboard(mapped);
      } else {
        // Fallback data for leaderboard
        const uid = getOrCreateUserId();
        const localTotal = parseInt(localStorage.getItem('mantra_total_jaaps') || '108', 10);
        
        const mocks = [
          { name: 'રમેશભાઈ પટેલ', score: 10008, mantra: 'ૐ નમઃ શિવાય', city: 'અમદાવાદ', isUser: false },
          { name: 'ભાવનાબેન જોશી', score: 5100, mantra: 'હરે કૃષ્ણ મહામંત્ર', city: 'રાજકોટ', isUser: false },
          { name: 'વિક્રમસિંહ જાળેલા', score: 2500, mantra: 'ગાયત્રી મંત્ર', city: 'વડોદરા', isUser: false },
          { name: userName + ' (તમે)', score: localTotal, mantra: selectedMantra?.name || 'ૐ નમઃ શિવાય', city: userCity, isUser: true },
          { name: 'હસમુખભાઈ શાહ', score: 1008, mantra: 'શ્રી રામ જય રામ', city: 'સુરત', isUser: false },
          { name: 'સુનીતાબેન મેહતા', score: 501, mantra: 'ૐ ચામુંડાયૈ વિચ્ચે', city: 'જૂનાગઢ', isUser: false }
        ].sort((a, b) => b.score - a.score);

        setLeaderboard(mocks);
      }
    } catch (err) {
      console.log('Error fetching leaderboard:', err);
    }
  };

  // PNG Export Handler using html2canvas
  const exportCertificateAsPNG = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mantra_Anushthan_Certificate_${mantraTarget}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "🎉 પ્રમાણપત્ર HD PNG તરીકે ડાઉનલોડ થઈ ગયું છે!" } }));
    } catch (err) {
      console.error('Export error:', err);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "ડાઉનલોડ કરવામાં અસમર્થ, કૃપા કરીને વોટ્સએપ પર શેર કરો." } }));
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Share Handler
  const handleDirectShare = async () => {
    const shareText = `મેં આજે ઓનલાઇન ગુજરાતી એપ પર શ્રદ્ધાપૂર્વક *${selectedMantra.name}* (${selectedMantra.fullText}) ના *${mantraTarget}* પવિત્ર મંત્ર જાપ પૂર્ણ કરી "મંત્ર જાપ અનુષ્ઠાન પ્રમાણપત્ર" પ્રાપ્ત કર્યું છે! 🙏\n\nઆપ પણ આપની સાધના શરૂ કરવા માટે ડાઉનલોડ કરો ગુજરાતી એપ 🚩`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'મંત્ર જાપ અનુષ્ઠાન પ્રમાણપત્ર',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (e) {}
    }
    
    // WhatsApp Fallback
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  // Determine Certificate Tier
  const getCertificateTier = (count) => {
    if (count >= 1008) return 'diamond'; // Tier 4: Supreme Diamond 1008
    if (count >= 501) return 'gold';     // Tier 3: Royal Gold 501
    if (count >= 108) return 'silver';   // Tier 2: Divya Silver 108
    return 'copper';                     // Tier 1: Classic Copper 11-51
  };

  const currentTier = getCertificateTier(mantraTarget);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans pb-24 relative overflow-x-hidden">
      
      {/* Confetti Cannon on Completion */}
      {showConfetti && (
        <Confetti 
          numberOfPieces={300} 
          recycle={false} 
          onConfettiComplete={() => setShowConfetti(false)}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999 }}
        />
      )}

      {/* --- TOP NAVBAR --- */}
      <div className="sticky top-0 z-40 bg-[#1E293B]/90 backdrop-blur-md border-b border-slate-700/60 px-4 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              stopMantraAudio();
              if (screen === 'deity') navigate('/devotional');
              else if (screen === 'mantra') setScreen('deity');
              else if (screen === 'target') setScreen('mantra');
              else if (screen === 'active') {
                if (window.confirm("શું આપ ખરેખર જપ અનુષ્ઠાન રોકવા માંગો છો?")) setScreen('target');
              }
              else setScreen('deity');
            }}
            className="h-10 w-10 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-600 rounded-2xl flex items-center justify-center text-slate-200 transition-all"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl text-amber-400 flex items-center gap-2">
              <span>🕉️</span> મંત્ર જાપ અનુષ્ઠાન
            </h1>
            <p className="font-gujarati text-[11px] text-slate-400">ઓનલાઇન સાધના અને પ્રમાણપત્ર</p>
          </div>
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('sadhana-leaderboard-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-gujarati font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-sm">trophy</span>
          સાધના લીડરબોર્ડ
        </button>
      </div>

      {/* --- MAIN CONTENT BODY --- */}
      <div className="max-w-xl mx-auto w-full px-4 pt-6 space-y-8 flex-1">

        {/* --- SCREEN 1: DEITY SELECTION --- */}
        {screen === 'deity' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/30 rounded-3xl p-5 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1 rounded-full font-gujarati text-[11px] font-black uppercase tracking-wider inline-block">
                ૧. પ્રારંભ
              </span>
              <h2 className="font-gujarati font-black text-2xl text-amber-300">આપના ઇષ્ટદેવ / દેવી પસંદ કરો</h2>
              <p className="font-gujarati text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                શ્રદ્ધાપૂર્વક મંત્ર જાપ અનુષ્ઠાન શરૂ કરવા માટે પવિત્ર નામ પર ક્લિક કરો
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {MANTRA_DEITIES.map((deity) => (
                <button
                  key={deity.id}
                  onClick={() => { setSelectedDeity(deity); setScreen('mantra'); }}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-3xl p-4 text-center flex flex-col items-center gap-3 transition-all duration-300 group hover:scale-[1.03] active:scale-95 shadow-md cursor-pointer"
                >
                  <div className="h-16 w-16 rounded-full overflow-hidden shadow-lg border-2 border-amber-500/40 group-hover:border-amber-400 group-hover:scale-105 transition-all bg-slate-900">
                    <img src={deity.image} alt={deity.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-gujarati font-black text-sm text-slate-200 group-hover:text-amber-300 transition-colors">
                    {deity.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- SCREEN 2: MANTRA SELECTION WITH FULL WRITTEN TEXT & AUDIO BUTTON --- */}
        {screen === 'mantra' && selectedDeity && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { stopMantraAudio(); setScreen('deity'); }}
                className="h-10 w-10 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 hover:bg-slate-700 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm text-slate-300">arrow_back</span>
              </button>
              <div>
                <h3 className="font-gujarati font-black text-xl text-amber-400">{selectedDeity.name} ના મંત્રો</h3>
                <p className="font-gujarati text-slate-400 text-xs">૨. આપની આસ્થા મુજબનો પવિત્ર મંત્ર પસંદ કરો</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {selectedDeity.mantras.map((mantra, idx) => (
                <div
                  key={idx}
                  onClick={() => { 
                    stopMantraAudio();
                    setSelectedMantra(mantra); 
                    setMantraTarget(mantra.defaultCount);
                    setScreen('target'); 
                  }}
                  className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 rounded-3xl p-5 text-left transition-all group hover:scale-[1.01] active:scale-[0.99] shadow-md space-y-2.5 cursor-pointer relative"
                >
                  <div className="flex justify-between items-center">
                    <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-base text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                      <span>{mantra.name}</span>
                    </p>

                    <div className="flex items-center gap-2">
                      {/* ONLINE & OFFLINE MP3 AUDIO BUTTON 🔊 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMantraAudio(mantra);
                        }}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform active:scale-90 border ${
                          isPlayingAudio && selectedMantra?.name === mantra.name 
                            ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                        }`}
                        title="ઓનલાઇન/ઑફલાઇન મંત્રોચ્ચાર સાંભળો"
                      >
                        <span className="material-symbols-outlined text-base">
                          {isPlayingAudio && selectedMantra?.name === mantra.name ? 'volume_up' : 'volume_up'}
                        </span>
                      </button>

                      {/* INFO BUTTON (i) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInfoModalMantra(mantra);
                        }}
                        className="h-8 w-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-transform active:scale-90 border border-slate-600"
                        title="મંત્ર માહાત્મ્ય, વિધિ અને ફળશ્રુતિ"
                      >
                        <span className="material-symbols-outlined text-base">info</span>
                      </button>

                      <div className="h-8 w-8 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 text-amber-400 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                      </div>
                    </div>
                  </div>

                  {/* FULL WRITTEN MANTRA TEXT BOX */}
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-amber-500/20">
                    <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-bold text-sm text-amber-200 leading-relaxed">
                      {mantra.fullText || mantra.name}
                    </p>
                    {mantra.meaning && (
                      <p className="text-[11px] text-slate-400 font-gujarati mt-1.5 italic border-t border-slate-800 pt-1">
                        💡 અર્થ: {mantra.meaning}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-0.5 text-[11px] font-gujarati">
                    <span className="text-slate-400">
                      સામાન્ય લક્ષ્ય: <b className="text-amber-400">{toGujaratiNum(mantra.defaultCount)} જપ</b>
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoModalMantra(mantra);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-0.5"
                    >
                      <span>જાપ વિધિ & લાભ જુઓ</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SCREEN 3: TARGET COUNT SELECTION WITH HANDS-FREE AUTO CHANT MODE --- */}
        {screen === 'target' && selectedMantra && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { stopMantraAudio(); setScreen('mantra'); }}
                className="h-10 w-10 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 hover:bg-slate-700 active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm text-slate-300">arrow_back</span>
              </button>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h3 className="font-gujarati font-black text-xl text-amber-400">{selectedMantra.name}</h3>
                  <p className="font-gujarati text-slate-400 text-xs">૩. જપ કરવા માટે કુલ સંખ્યા નક્કી કરો</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleMantraAudio(selectedMantra)}
                    className={`h-9 w-9 rounded-full flex items-center justify-center border ${
                      isPlayingAudio 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                    title="ઓનલાઇન/ઑફલાઇન મંત્રોચ્ચાર સાંભળો"
                  >
                    <span className="material-symbols-outlined text-lg">volume_up</span>
                  </button>
                  <button
                    onClick={() => setInfoModalMantra(selectedMantra)}
                    className="h-9 w-9 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center border border-slate-600"
                    title="મંત્ર માહાત્મ્ય, વિધિ અને ફળશ્રુતિ"
                  >
                    <span className="material-symbols-outlined text-lg">info</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/90 rounded-3xl p-6 border border-slate-700 space-y-6 shadow-xl max-w-md mx-auto">
              
              {/* DISPLAY FULL MANTRA TEXT IN TARGET SCREEN */}
              <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 text-center space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-gujarati">પવિત્ર મંત્ર પાઠ</span>
                <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-base text-amber-300 leading-relaxed">
                  {selectedMantra.fullText || selectedMantra.name}
                </p>
              </div>

              <div className="text-center space-y-1">
                <p className="font-gujarati text-xs text-slate-400 uppercase tracking-widest">લક્ષ્ય જપ સંખ્યા</p>
                <div className="font-headline font-black text-6xl text-amber-400 leading-none">
                  {toGujaratiNum(mantraTarget)}
                </div>
                <p className="font-gujarati text-xs text-amber-300/80 pt-1 font-bold">
                  {mantraTarget >= 1008 ? '💎 પરમ સિદ્ધ મહા સાધક પ્રમાણપત્ર' :
                   mantraTarget >= 501 ? '👑 મહા અનુષ્ઠાન સિદ્ધિ પ્રમાણપત્ર' :
                   mantraTarget >= 108 ? '⭐ દિવ્ય સાધક પ્રમાણપત્ર' : '🪔 ભક્તિ રત્ન પ્રમાણપત્ર'}
                </p>
              </div>

              {/* Quick Presets Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                {[11, 21, 51, 108, 501, 1008].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMantraTarget(val)}
                    className={`py-3.5 rounded-2xl font-gujarati text-xs font-black transition-all border ${mantraTarget === val ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105' : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
                  >
                    {toGujaratiNum(val)} જપ
                  </button>
                ))}
              </div>

              {/* Custom Count Stepper */}
              <div className="flex justify-center items-center gap-5 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setMantraTarget(prev => Math.max(1, prev - 1))}
                  className="h-10 w-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center active:scale-90 transition-transform text-amber-400 font-bold"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="font-gujarati text-xs text-slate-300 font-bold">કસ્ટમ ગણતરી બદલો</span>
                <button
                  onClick={() => setMantraTarget(prev => prev + 1)}
                  className="h-10 w-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center active:scale-90 transition-transform text-amber-400 font-bold"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              {/* HANDS-FREE AUTO CHANT MODE TOGGLE CARD */}
              <div className="p-3.5 bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl flex justify-between items-center gap-3">
                <div className="text-left">
                  <span className="font-gujarati font-black text-xs text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-amber-400">headphones</span>
                    ઑટો-જપ મોડ (હસ્ત-મુક્ત સંભળાવ)
                  </span>
                  <p className="text-[10px] text-slate-300 font-gujarati leading-tight mt-0.5">
                    મંત્ર {toGujaratiNum(mantraTarget)} વાર આપોઆપ રીપીટ થશે (ટેપ કરવાની જરૂર નથી)
                  </p>
                </div>
                <button
                  onClick={() => setAutoChantMode(!autoChantMode)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors relative flex items-center ${autoChantMode ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'}`}
                >
                  <div className="h-5 w-5 bg-white rounded-full shadow-md"></div>
                </button>
              </div>

              {/* Start Button */}
              <button
                onClick={() => { 
                  setMantraCount(0); 
                  setCompletedMalas(0); 
                  setScreen('active'); 
                  playTempleBell(); 
                  if (autoChantMode) {
                    setTimeout(() => handleToggleMantraAudio(selectedMantra, true), 300);
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-gujarati font-black py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-800 text-base cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">
                  {autoChantMode ? 'headphones' : 'play_arrow'}
                </span>
                {autoChantMode ? `▶️ ઓટો-જપ શરૂ કરો (${toGujaratiNum(mantraTarget)} વાર)` : '▶️ અનુષ્ઠાન શરૂ કરો'}
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 4: ACTIVE JAPA COUNTER SCREEN WITH AUTO-REPEAT AUDIO --- */}
        {screen === 'active' && selectedMantra && (
          <div className="space-y-6 text-center animate-fade-in py-2">
            
            {/* Header info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="px-4 py-1 rounded-full text-[11px] font-black tracking-widest uppercase border border-amber-500/40 bg-amber-500/10 text-amber-400 inline-block font-gujarati">
                  {selectedDeity?.name}
                </span>

                {/* ONLINE & AUTO AUDIO TOGGLE BUTTON ON ACTIVE SCREEN */}
                <button
                  onClick={() => handleToggleMantraAudio(selectedMantra)}
                  className={`px-3 py-1 rounded-full text-[11px] font-black font-gujarati flex items-center gap-1 border transition-all cursor-pointer ${
                    isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                  <span>{isPlayingAudio ? 'અટકાવો ⏹️' : 'મંત્રોચ્ચાર 🔊'}</span>
                </button>
              </div>

              <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-2xl text-amber-300">
                {selectedMantra.name}
              </h3>
              <p className="font-gujarati text-slate-400 text-xs">
                કુલ લક્ષ્ય: <b className="text-amber-400">{toGujaratiNum(mantraTarget)} જપ</b>
              </p>
            </div>

            {/* FULL WRITTEN MANTRA TEXT CARD FOR REAL-TIME RECITING */}
            <div className="bg-[#1E293B] border-2 border-amber-500/50 rounded-3xl p-4 sm:p-5 max-w-md mx-auto shadow-lg space-y-2 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500"></div>
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black font-gujarati text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30 inline-block">
                  📖 પવિત્ર મંત્ર પાઠ (સાથે બોલતા જાવ)
                </span>
                <button 
                  onClick={() => handleToggleMantraAudio(selectedMantra)}
                  className="text-[11px] text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">volume_up</span>
                  <span>{isPlayingAudio ? 'અટકાવો' : 'સાંભળો'}</span>
                </button>
              </div>
              
              <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-lg sm:text-xl text-amber-200 leading-relaxed">
                {selectedMantra.fullText || selectedMantra.name}
              </p>
              {selectedMantra.meaning && (
                <p className="text-xs text-slate-300 font-gujarati italic pt-1.5 border-t border-slate-700/60">
                  💡 અર્થ: {selectedMantra.meaning}
                </p>
              )}
            </div>

            {/* Circular Progress Ring Counter */}
            <div className="relative h-64 w-64 mx-auto flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="url(#japaRingGrad)" 
                  strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - mantraCount / mantraTarget)}`}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
                <defs>
                  <linearGradient id="japaRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered digits */}
              <div className="space-y-1 z-10">
                <span className="font-gujarati text-[11px] text-amber-400/80 font-bold uppercase tracking-widest block">
                  {autoChantMode ? '🎧 ઓટો રીપીટ જપ' : 'ચાલુ જપ'}
                </span>
                <span className="font-headline font-black text-6xl leading-none text-slate-100 block">
                  {toGujaratiNum(mantraCount)}
                </span>
                <span className="font-gujarati text-xs text-amber-400 font-bold block pt-1">
                  માળા: {toGujaratiNum(completedMalas)} ({toGujaratiNum(mantraCount)} / {toGujaratiNum(mantraTarget)})
                </span>
              </div>
            </div>

            {/* Prayer Bead Tap Button / Hands-Free Control */}
            <div className="space-y-3">
              <button
                onClick={incrementJapa}
                className="h-36 w-36 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 border-4 border-amber-300 shadow-xl shadow-amber-500/20 rounded-full mx-auto flex flex-col items-center justify-center active:scale-90 transition-all hover:scale-[1.03] group relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none"></div>
                <span className="material-symbols-outlined text-5xl text-slate-950 animate-pulse group-hover:scale-110 transition-transform">
                  {autoChantMode ? 'headphones' : 'brightness_5'}
                </span>
                <span className="font-gujarati font-black text-xs text-slate-950 mt-1 tracking-wider">
                  {autoChantMode ? 'હસ્ત-મુક્ત પ્લે' : 'અહીં ટેપ કરો 📿'}
                </span>
              </button>
              <p className="font-gujarati text-slate-400 text-xs">
                {autoChantMode ? '🎧 મંત્ર ઓટો રીપીટ મોડ ચાલુ છે. મંત્રોચ્ચાર સાંભળતા જાવ!' : 'મંત્ર પાઠ બોલતા બોલતા ટેપ કરતા જાવ'}
              </p>
            </div>

            {/* Auto Mode & Gyro toggles */}
            <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex justify-between items-center gap-2">
                <div className="text-left">
                  <span className="font-gujarati font-black text-[11px] text-amber-300 block">🎧 ઓટો જપ રીપીટ</span>
                  <span className="text-[9px] text-slate-400 font-gujarati block">હસ્ત-મુક્ત ઓડિયો</span>
                </div>
                <button
                  onClick={() => {
                    const nextMode = !autoChantMode;
                    setAutoChantMode(nextMode);
                    if (nextMode && !isPlayingAudio) {
                      handleToggleMantraAudio(selectedMantra, true);
                    }
                  }}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${autoChantMode ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'}`}
                >
                  <div className="h-4 w-4 bg-white rounded-full shadow-md"></div>
                </button>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex justify-between items-center gap-2">
                <div className="text-left">
                  <span className="font-gujarati font-black text-[11px] text-amber-300 block">📱 મોશન જપ</span>
                  <span className="text-[9px] text-slate-400 font-gujarati block">મોબાઇલ હલાવીને</span>
                </div>
                <button
                  onClick={() => setMotionActive(!motionActive)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${motionActive ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'}`}
                >
                  <div className="h-4 w-4 bg-white rounded-full shadow-md"></div>
                </button>
              </div>
            </div>

            {/* Exit controls */}
            <div className="pt-4 border-t border-slate-800 flex justify-center gap-4 max-w-sm mx-auto">
              <button
                onClick={() => { 
                  stopMantraAudio();
                  if (window.confirm("શું આપ ખરેખર જપ અધૂરા છોડી બહાર જવા માંગો છો?")) setScreen('target'); 
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 px-4 rounded-2xl font-gujarati font-black text-xs text-slate-300 active:scale-95 transition-transform"
              >
                🛑 જપ બંધ કરો
              </button>
              <button
                onClick={incrementJapa}
                className="flex-1 bg-amber-500 hover:bg-amber-400 py-3.5 px-4 rounded-2xl font-gujarati font-black text-xs text-slate-950 active:scale-95 transition-transform"
              >
                📿 આગળ વધો +1
              </button>
            </div>
          </div>
        )}

        {/* --- SCREEN 5: WORLD CLASS CERTIFICATE GENERATOR SCREEN --- */}
        {screen === 'certificate' && selectedMantra && (
          <div className="space-y-6 animate-fade-in py-2">
            
            {/* Header info */}
            <div className="text-center space-y-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1 rounded-full font-gujarati text-[11px] font-black uppercase tracking-wider inline-block">
                🎉 અભિનંદન! અનુષ્ઠાન સંપન્ન
              </span>
              <h2 className="font-gujarati font-black text-2xl text-amber-300">આપનું પવિત્ર પ્રમાણપત્ર</h2>
              <p className="font-gujarati text-slate-300 text-xs">નીચેનું પ્રમાણપત્ર PNG માં ડાઉનલોડ કરી સોશિયલ મીડિયા પર શેર કરો</p>
            </div>

            {/* --- CERTIFICATE CARD CONTAINER --- */}
            <div className="relative">
              
              {/* THE RENDERED CERTIFICATE DOM NODE FOR HTML2CANVAS */}
              <div 
                ref={certificateRef}
                className={`relative mx-auto w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] shadow-2xl text-center overflow-hidden transition-all duration-500 ${
                  currentTier === 'diamond' 
                    ? 'bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#312E81] border-4 border-amber-400/90 text-slate-100'
                    : currentTier === 'gold'
                    ? 'bg-gradient-to-b from-[#14532D] via-[#064E3B] to-[#022C22] border-4 border-amber-400 text-amber-100'
                    : currentTier === 'silver'
                    ? 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#18181B] border-4 border-slate-300 text-slate-100'
                    : 'bg-gradient-to-b from-[#FFFDF7] via-[#FAF0E6] to-[#F5E6D3] border-4 border-amber-700/80 text-stone-900'
                }`}
              >
                {/* Background Aura & Motifs */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none"></div>

                {/* Inner Border Line */}
                <div className={`absolute inset-3 border-2 rounded-[2rem] pointer-events-none ${
                  currentTier === 'diamond' ? 'border-amber-400/40' :
                  currentTier === 'gold' ? 'border-amber-400/50' :
                  currentTier === 'silver' ? 'border-slate-300/40' : 'border-amber-700/40'
                }`}></div>

                {/* Sacred Top Ornaments */}
                <div className="flex justify-between items-center px-2 mb-3 relative z-10">
                  <span className="text-xl">🪔</span>
                  <span className={`font-black text-xs font-gujarati tracking-widest uppercase ${
                    currentTier === 'copper' ? 'text-amber-800' : 'text-amber-400'
                  }`}>
                    {currentTier === 'diamond' ? '✨ પરમ સિદ્ધ મહા સાધના ✨' :
                     currentTier === 'gold' ? '👑 મહા અનુષ્ઠાન સિદ્ધિ' :
                     currentTier === 'silver' ? '⭐ દિવ્ય સાધક પ્રમાણપત્ર' : '🪔 જપ અનુષ્ઠાન પ્રમાણપત્ર'}
                  </span>
                  <span className="text-xl">🪔</span>
                </div>

                {/* Main Certificate Title */}
                <div className="space-y-1 relative z-10">
                  <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className={`font-black text-2xl sm:text-3xl ${
                    currentTier === 'diamond' ? 'text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]' :
                    currentTier === 'gold' ? 'text-amber-300' :
                    currentTier === 'silver' ? 'text-slate-100' : 'text-amber-900'
                  }`}>
                    {currentTier === 'diamond' ? '✨ પરમ સિદ્ધ મહા સાધક ✨' :
                     currentTier === 'gold' ? '🏆 ભક્તિ રત્ન પ્રમાણપત્ર' :
                     currentTier === 'silver' ? '🥈 દિવ્ય સાધક પ્રમાણપત્ર' : 'ભક્તિ રત્ન પ્રમાણપત્ર'}
                  </h3>
                  <div className={`h-0.5 w-32 mx-auto ${
                    currentTier === 'copper' ? 'bg-amber-800/40' : 'bg-amber-400/60'
                  }`}></div>
                </div>

                {/* Main Body Text with Full Written Mantra */}
                <div className="space-y-4 my-6 px-1 relative z-10">
                  <p className={`font-gujarati text-xs sm:text-sm leading-relaxed ${
                    currentTier === 'copper' ? 'text-stone-800' : 'text-slate-200'
                  }`}>
                    આથી પ્રમાણિત કરવામાં આવે છે કે આપની અપાર ભક્તિ અને નિષ્ઠા સાથે શ્રદ્ધાપૂર્વક
                  </p>

                  {/* Full Mantra Pill */}
                  <div className={`py-3 px-4 rounded-2xl border inline-block shadow-md max-w-xs sm:max-w-sm ${
                    currentTier === 'diamond' ? 'bg-amber-400/20 border-amber-400 text-amber-300' :
                    currentTier === 'gold' ? 'bg-amber-400/20 border-amber-400 text-amber-200' :
                    currentTier === 'silver' ? 'bg-slate-700/60 border-slate-400 text-slate-100' : 'bg-amber-100 border-amber-800 text-amber-950'
                  }`}>
                    <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-sm sm:text-base leading-relaxed">
                      {selectedMantra.fullText || selectedMantra.name}
                    </p>
                  </div>

                  <p className={`font-gujarati text-xs sm:text-sm leading-relaxed ${
                    currentTier === 'copper' ? 'text-stone-800' : 'text-slate-200'
                  }`}>
                    મંત્રના <b className={`text-base px-1 ${
                      currentTier === 'copper' ? 'text-amber-900 font-black' : 'text-amber-400 font-black'
                    }`}>{toGujaratiNum(mantraTarget)}</b> પવિત્ર જપ પૂર્ણ કરી આપશ્રીએ જપ અનુષ્ઠાન સંપન્ન કર્યું છે.
                  </p>

                  <p className={`font-gujarati text-[11px] sm:text-xs italic leading-relaxed ${
                    currentTier === 'copper' ? 'text-stone-600' : 'text-slate-400'
                  }`}>
                    પ્રભુ આપની સર્વ આધ્યાત્મિક અને લૌકિક મનોકામનાઓ શીઘ્ર અતિ શીઘ્ર પૂર્ણ કરે તેવા શુભ આશીર્વાદ!
                  </p>
                </div>

                {/* Certificate Footer Stamp & Date */}
                <div className={`pt-4 border-t flex justify-between items-end text-left relative z-10 ${
                  currentTier === 'copper' ? 'border-amber-800/20' : 'border-slate-700'
                }`}>
                  <div>
                    <p className={`text-[10px] font-gujarati ${currentTier === 'copper' ? 'text-stone-600' : 'text-slate-400'}`}>સાધકનું નામ</p>
                    <p className={`font-gujarati text-xs font-black ${currentTier === 'copper' ? 'text-amber-900' : 'text-amber-300'}`}>
                      {userName} ({userCity})
                    </p>
                    <p className={`text-[9px] font-gujarati mt-0.5 ${currentTier === 'copper' ? 'text-stone-500' : 'text-slate-500'}`}>
                      તારીખ: {new Date().toLocaleDateString('gu-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Stamp Seal */}
                  <div className="text-right flex flex-col items-end">
                    <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center shadow-inner ${
                      currentTier === 'diamond' ? 'border-amber-400 bg-amber-500/20 text-amber-300' :
                      currentTier === 'gold' ? 'border-amber-400 bg-amber-500/20 text-amber-300' :
                      currentTier === 'silver' ? 'border-slate-300 bg-slate-700 text-slate-200' : 'border-amber-800 bg-amber-200 text-amber-900'
                    }`}>
                      <span className="font-gujarati font-black text-[10px] text-center leading-tight">
                        ૐ<br/>સિદ્ધિ
                      </span>
                    </div>
                    <span className={`text-[9px] font-gujarati font-bold mt-1 ${currentTier === 'copper' ? 'text-amber-800' : 'text-amber-400'}`}>
                      ૐ ગુજરાતી એપ
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons Stack */}
            <div className="space-y-3 pt-2 max-w-md mx-auto">
              <button
                onClick={exportCertificateAsPNG}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-gujarati font-black py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-800 text-base cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                {isExporting ? 'પ્રમાણપત્ર ડાઉનલોડ થઈ રહ્યું છે...' : '📥 HD PNG પ્રમાણપત્ર ડાઉનલોડ કરો'}
              </button>

              <button
                onClick={handleDirectShare}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-gujarati font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-emerald-800 text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">share</span>
                📲 વોટ્સએપ પર મિત્રોને મોકલો
              </button>

              <button
                onClick={() => { stopMantraAudio(); setMantraCount(0); setCompletedMalas(0); setScreen('deity'); }}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-gujarati font-black py-3.5 px-6 rounded-2xl active:scale-95 transition-all text-xs"
              >
                🔄 નવો મંત્ર જાપ શરૂ કરો
              </button>
            </div>

          </div>
        )}

        {/* --- DEDICATED SADHANA LEADERBOARD SECTION --- */}
        <div id="sadhana-leaderboard-section" className="pt-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-xl text-amber-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">social_leaderboard</span>
                મંત્ર સાધના લીડરબોર્ડ
              </h3>
              <p className="font-gujarati text-slate-400 text-xs">સૌથી વધુ જપ કરનાર શીર્ષ સાધકોની યાદી</p>
            </div>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-gujarati text-xs font-bold">
              તમારા કુલ જપ: {toGujaratiNum(userTotalJaaps || parseInt(localStorage.getItem('mantra_total_jaaps') || '0', 10))}
            </span>
          </div>

          {/* Render Leaderboard Cards */}
          <div className="space-y-2.5 font-gujarati">
            {leaderboard.map((user, idx) => (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  user.isUser 
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-lg' 
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-md ${
                    idx === 0 ? 'bg-amber-500 text-slate-950' : 
                    idx === 1 ? 'bg-slate-300 text-slate-950' : 
                    idx === 2 ? 'bg-amber-700 text-white' : 
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {toGujaratiNum(idx + 1)}
                  </span>
                  
                  <div className="h-9 w-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'સા'}
                  </div>

                  <div>
                    <h4 className="font-black text-sm text-slate-100 flex items-center gap-1.5">
                      {user.name}
                      {user.isUser && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md font-bold">તમે</span>}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-amber-400 font-bold">{user.mantra}</span>
                      {user.city && (
                        <span className="flex items-center gap-0.5 text-slate-400">
                          📍 {user.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-headline font-black text-base text-amber-400 block">
                    {toGujaratiNum(user.score)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">કુલ જપ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- MANTRA MAHIMA, VIDHI & BENEFITS MODAL (i) WITH SOOTHING VOICE AUDIO BUTTON --- */}
      {infoModalMantra && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1E293B] border-2 border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto font-gujarati text-slate-100">
            
            {/* Close button */}
            <button 
              onClick={() => { stopMantraAudio(); setInfoModalMantra(null); }}
              className="absolute top-4 right-4 h-9 w-9 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-300 border border-slate-700 transition-transform active:scale-90 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Header */}
            <div className="space-y-1 pr-8">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-block">
                📖 મંત્ર મહાત્મ્ય અને જાપ વિધિ
              </span>
              <h3 style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-2xl text-amber-400">
                {infoModalMantra.name}
              </h3>
            </div>

            {/* Full Written Mantra Box */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/30 text-center space-y-1.5 shadow-inner">
              <p style={{ fontFamily: '"Noto Serif Gujarati", serif' }} className="font-black text-lg text-amber-200 leading-relaxed">
                {infoModalMantra.fullText}
              </p>
              {infoModalMantra.meaning && (
                <p className="text-xs text-slate-400 italic pt-1.5 border-t border-slate-800">
                  💡 અર્થ: {infoModalMantra.meaning}
                </p>
              )}
            </div>

            {/* SOOTHING VOICE AUDIO BUTTON 🔊 */}
            <button
              onClick={() => handleToggleMantraAudio(infoModalMantra)}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-md ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
              }`}
            >
              <span className="material-symbols-outlined text-lg">volume_up</span>
              <span>{isPlayingAudio ? '🔊 પવિત્ર મંત્રોચ્ચાર ચાલે છે... (અહીં અટકાવો ⏹️)' : '🔊 પવિત્ર શુદ્ધ મંત્રોચ્ચાર સાંભળો (Online MP3)'}</span>
            </button>

            {/* Rules & Vidhi Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1">
                  📿 શ્રેષ્ઠ માળા
                </span>
                <p className="text-slate-300 font-medium">{infoModalMantra.mala || 'રુદ્રાક્ષ કે તુલસીની માળા'}</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1">
                  🌅 શ્રેષ્ઠ સમય
                </span>
                <p className="text-slate-300 font-medium">{infoModalMantra.time || 'સવારે સ્નાન કર્યા પછી કે સંધ્યાકાળે'}</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1">
                  🧭 પૂજા દિશા
                </span>
                <p className="text-slate-300 font-medium">{infoModalMantra.direction || 'પૂર્વ કે ઉત્તર દિશા'}</p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold block flex items-center gap-1">
                  🔢 ઉત્તમ ગણતરી
                </span>
                <p className="text-slate-300 font-medium">{toGujaratiNum(infoModalMantra.defaultCount || 108)} જપ (અથવા ૧૧, ૨૧, ૫૧)</p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-amber-950/40 to-slate-900 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <h4 className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                <span>🌺</span> આ મંત્ર જપ કરવાના પવિત્ર લાભ (ફળ શ્રુતિ):
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                {Array.isArray(infoModalMantra.benefits) ? (
                  infoModalMantra.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span className="leading-relaxed">{infoModalMantra.benefits || 'મનને શાંતિ અને દૈવી શક્તિઓનો અનુભવ થાય છે.'}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                stopMantraAudio();
                setSelectedMantra(infoModalMantra);
                setMantraTarget(infoModalMantra.defaultCount || 108);
                setInfoModalMantra(null);
                setScreen('target');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-800 text-sm cursor-pointer"
            >
              <span>▶️</span> આ મંત્રનું અનુષ્ઠાન શરૂ કરો
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
