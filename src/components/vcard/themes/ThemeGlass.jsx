import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeGlass = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#0ea5e9'; // Sky Blue

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans pb-16 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #f8fafc, ${primaryColor}30)` }}>
      {/* Dynamic Animated Orbs */}
      <div className="fixed top-[-5%] right-[-5%] w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_10s_linear_infinite]" style={{ backgroundColor: primaryColor }}></div>
      <div className="fixed bottom-[10%] left-[-10%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-[spin_15s_linear_infinite_reverse]"></div>

      {/* 1. Frosted Header */}
      <div className="relative w-full h-64 z-0">
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(180deg, ${primaryColor}50, transparent)` }}></div>
        )}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      </div>

      <div className="px-6 relative z-20 flex flex-col items-center -mt-20">
        {/* 2. Frosted Profile Picture */}
        <div className="w-40 h-40 rounded-full p-2 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/60 mb-6">
           <div className="w-full h-full rounded-full overflow-hidden">
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/50">
                <span className="material-symbols-outlined text-6xl text-slate-400">person</span>
              </div>
            )}
           </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2rem] p-8 w-full flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">{vcard.name}</h1>
          {(vcard.job_title || vcard.company) && (
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">
              {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
            </p>
          )}

          {vcard.bio && (
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8">
              {vcard.bio}
            </p>
          )}

          <button 
            onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
            className="w-full py-4 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="material-symbols-outlined">person_add</span>
            Save Contact
          </button>
        </div>

        {/* 3. Glass Contact Grid */}
        <div className="w-full mt-6 space-y-3">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:bg-white/60 transition-all group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/60 shadow-inner text-slate-600 group-hover:text-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">{contact.label}</p>
                  <p className="text-[15px] font-semibold text-slate-800 truncate">{contact.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* 4. Products / Showcase */}
        {vcard.products?.length > 0 && (
          <div className="w-full mt-10">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest pl-2">Showcase</h3>
            <div className="space-y-4">
              {vcard.products.map((prod, index) => (
                <div key={index} className="bg-white/40 backdrop-blur-xl rounded-2xl p-3 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-white/60 flex gap-4 items-center group hover:bg-white/60 transition-colors">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-xl shadow-sm shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl text-slate-400">image</span>
                    </div>
                  )}
                  <div className="flex-1 py-1">
                    <h4 className="font-bold text-slate-800 text-base mb-1">{prod.name}</h4>
                    {prod.price && <p className="text-xs font-bold mb-1" style={{ color: primaryColor }}>{prod.price}</p>}
                    {prod.description && <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{prod.description}</p>}
                  </div>
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

export default ThemeGlass;
