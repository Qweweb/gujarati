import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeRealEstate = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#d97706'; // Gold/Amber

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-serif bg-[#111111] pb-16 text-stone-300">
      {/* 1. Full-bleed background hero */}
      <div className="relative w-full h-[380px] z-0">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent z-10"></div>
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover z-0" />
        ) : (
          <div className="w-full h-full bg-stone-800 z-0"></div>
        )}

        {/* 2. Floating Profile overlay inside hero */}
        <div className="absolute bottom-0 w-full px-6 z-20 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full border-[3px] overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.3)] bg-black mb-4" style={{ borderColor: primaryColor }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl" style={{ color: primaryColor }}>real_estate_agent</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-black text-white tracking-wider mb-1 uppercase">{vcard.name}</h1>
          {(vcard.job_title || vcard.company) && (
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6 text-stone-400">
              {vcard.job_title} {vcard.job_title && vcard.company && '✦'} {vcard.company}
            </p>
          )}
        </div>
      </div>

      <div className="px-6 relative z-30 -mt-2">
        {vcard.bio && (
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-stone-800 shadow-xl mb-8 relative">
            <span className="absolute -top-3 left-6 bg-[#111111] px-2 text-xs font-bold uppercase tracking-widest text-stone-500">About</span>
            <p className="text-sm text-stone-400 leading-relaxed italic text-center">
              "{vcard.bio}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-10 flex gap-3">
          <button 
            onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
            className="flex-1 py-4 font-bold text-black flex justify-center items-center gap-2 shadow-[0_4px_20px_rgba(217,119,6,0.2)] transition-transform hover:-translate-y-1 rounded-xl uppercase tracking-widest text-xs"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="material-symbols-outlined">contact_mail</span>
            Save Contact
          </button>
        </div>

        {/* 3. Luxury Contact List */}
        <div className="mb-12 space-y-3">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-5 p-4 rounded-xl bg-[#1a1a1a] border border-stone-800 hover:border-stone-600 transition-colors group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-stone-700 bg-[#222]" style={{ color: primaryColor }}>
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">{contact.label}</p>
                  <p className="text-sm font-bold text-stone-200 truncate">{contact.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* 4. Properties / Projects */}
        {vcard.products?.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-4">
              <span className="w-8 h-[1px] bg-stone-700"></span>
              Featured Properties
              <span className="w-8 h-[1px] bg-stone-700"></span>
            </h3>
            <div className="space-y-6">
              {vcard.products.map((prod, index) => (
                <div key={index} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-stone-800 group">
                  {prod.image ? (
                    <div className="w-full h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-stone-900 flex items-center justify-center border-b border-stone-800">
                      <span className="material-symbols-outlined text-4xl text-stone-700">apartment</span>
                    </div>
                  )}
                  <div className="p-5 relative z-20 -mt-10">
                    <h4 className="font-bold text-white text-lg mb-1">{prod.name}</h4>
                    {prod.price && <p className="text-sm font-black mb-3" style={{ color: primaryColor }}>{prod.price}</p>}
                    {prod.description && <p className="text-[11px] text-stone-400 line-clamp-3 leading-relaxed">{prod.description}</p>}
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

export default ThemeRealEstate;
