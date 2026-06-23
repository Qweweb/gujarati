import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeVibrant = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#ec4899'; // Vibrant Pink

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-white pb-16 relative overflow-hidden">
      {/* 1. Dynamic Animated Gradient Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-72 h-72 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[spin_8s_linear_infinite] z-0 pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[spin_10s_linear_infinite_reverse] z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-[spin_12s_linear_infinite] z-0 pointer-events-none"></div>

      <div className="px-6 pt-20 relative z-20 text-center">
        {/* 2. Neumorphic/Glass Profile */}
        <div className="relative inline-block mb-8">
           <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 rounded-[2.5rem] rotate-6 blur-lg opacity-60"></div>
          <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/80 bg-white shadow-2xl relative z-10 hover:rotate-0 hover:scale-105 transition-all duration-500 rotate-3">
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-slate-300">face_retouching_natural</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-3 drop-shadow-sm">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md shadow-sm border border-white/50 mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></span>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-700">
              {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
            </p>
          </div>
        )}

        {vcard.bio && (
          <p className="text-sm text-slate-600 font-medium px-4 mb-10 leading-relaxed">
            {vcard.bio}
          </p>
        )}

        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="w-full py-4 rounded-3xl font-black uppercase tracking-widest text-white shadow-[0_10px_40px_rgba(236,72,153,0.4)] hover:scale-105 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6, #06b6d4)` }}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
             <span className="material-symbols-outlined">bolt</span>
             Save Contact
          </span>
        </button>

        {/* 3. Glass Contact Grid */}
        <div className="mt-12 space-y-4 text-left">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:bg-white/60 transition-all group">
                <div className="w-12 h-12 rounded-[1.2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-300" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">{contact.label}</p>
                  <p className="text-[15px] font-bold text-slate-800 truncate">{contact.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* 4. Products / Showcase */}
        {vcard.products?.length > 0 && (
          <div className="mt-16 text-left">
            <h3 className="text-xl font-black text-slate-800 mb-6 drop-shadow-sm">Featured Showcase</h3>
            <div className="grid grid-cols-2 gap-4">
              {vcard.products.map((prod, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-lg rounded-[2rem] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-full h-24 object-cover rounded-[1.5rem] mb-4 shadow-sm" />
                  ) : (
                    <div className="w-full h-24 rounded-[1.5rem] bg-white/50 flex items-center justify-center mb-4 text-slate-400 border border-white/50">
                      <span className="material-symbols-outlined text-4xl">style</span>
                    </div>
                  )}
                  <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{prod.name}</h4>
                  {prod.price && <p className="text-[11px] font-black mb-2" style={{ color: primaryColor }}>{prod.price}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <PaymentSection vcard={vcard} primaryColor={primaryColor || vcard.theme_colors?.primary || '#000'} />

        <div className="mt-12 mb-4 w-full text-center">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Powered by Gujarati App</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeVibrant;
