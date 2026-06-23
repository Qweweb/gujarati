import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeBlueCollar = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#eab308'; // Safety Yellow

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-zinc-950 text-zinc-100 pb-16">
      {/* 1. Rugged Header */}
      <div className="relative w-full h-64 overflow-hidden shadow-2xl z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}>
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
        ) : (
          <div className="w-full h-full bg-zinc-800"></div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950/80 to-zinc-950 z-10"></div>
        {/* Hazard Tape overlay */}
        <div className="absolute top-0 w-full h-3 z-20" style={{ background: `repeating-linear-gradient(45deg, ${primaryColor}, ${primaryColor} 10px, #000 10px, #000 20px)` }}></div>
      </div>

      {/* 2. Bold Profile Picture */}
      <div className="px-6 relative z-20 flex flex-col text-left -mt-20 mb-10">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-32 h-32 rounded-2xl border-4 overflow-hidden bg-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative" style={{ borderColor: primaryColor }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-zinc-600">engineering</span>
              </div>
            )}
            <div className="absolute bottom-0 w-full h-2" style={{ background: `repeating-linear-gradient(45deg, ${primaryColor}, ${primaryColor} 5px, #000 5px, #000 10px)` }}></div>
          </div>
          <div className="pb-2 flex-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider mb-1 leading-tight">{vcard.name}</h1>
            {(vcard.job_title || vcard.company) && (
              <div className="inline-block px-2 py-0.5 rounded bg-zinc-800">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
                </p>
              </div>
            )}
          </div>
        </div>

        {vcard.bio && (
          <div className="border-l-4 pl-4 py-1" style={{ borderColor: primaryColor }}>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              {vcard.bio}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-12">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="w-full py-4 font-black text-black flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-transform hover:-translate-y-1 rounded-xl uppercase tracking-[0.2em] text-sm"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="material-symbols-outlined font-bold">person_add</span>
          Save Contact
        </button>
      </div>

      {/* 3. Industrial Contact Grid */}
      <div className="px-6 mb-12 space-y-3">
        {vcard.contact_details?.map((contact, idx) => {
          let href = '#', icon = 'call';
          if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
          if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
          if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
          
          return (
            <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
               onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
               className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all group">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-zinc-950 border border-zinc-800 group-hover:border-zinc-600 transition-colors" style={{ color: primaryColor }}>
                <span className="material-symbols-outlined text-[24px]">{icon}</span>
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">{contact.label}</p>
                <p className="text-base font-black text-zinc-100 truncate">{contact.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 4. Services */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12">
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
             <span className="material-symbols-outlined text-2xl" style={{ color: primaryColor }}>build</span>
             Services
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 relative group hover:border-zinc-700 transition-colors">
                 <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: primaryColor }}></div>
                <div className="p-5 pl-7 flex items-center gap-4">
                   {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-lg border border-zinc-700 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0" style={{ color: primaryColor }}>
                      <span className="material-symbols-outlined text-3xl">handyman</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-black text-zinc-100 text-[15px] mb-1">{prod.name}</h4>
                    {prod.price && <p className="text-[11px] font-bold mb-2" style={{ color: primaryColor }}>{prod.price}</p>}
                    {prod.description && <p className="text-[11px] text-zinc-400 line-clamp-2">{prod.description}</p>}
                  </div>
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
  );
};

export default ThemeBlueCollar;
