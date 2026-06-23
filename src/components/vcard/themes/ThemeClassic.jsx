import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeClassic = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#8b5cf6'; // Violet

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-serif bg-[#faf9f6] pb-16 text-stone-800 border-x-8" style={{ borderColor: `${primaryColor}10` }}>
      {/* 1. Elegant Classic Header */}
      <div className="px-6 pt-12 pb-6 flex flex-col items-center border-b border-stone-200 bg-white">
        <div className="w-40 h-40 rounded-full border border-stone-200 overflow-hidden shadow-sm bg-stone-50 mb-6 p-2 relative">
           <div className="w-full h-full rounded-full overflow-hidden">
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-stone-300">account_circle</span>
              </div>
            )}
           </div>
        </div>

        <h1 className="text-4xl font-bold text-stone-900 tracking-tight text-center mb-2">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-[0.2em] mb-4">
            {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
          </p>
        )}

        {vcard.bio && (
          <div className="w-12 h-[1px] bg-stone-300 mb-6"></div>
        )}
        {vcard.bio && (
          <p className="text-[15px] text-stone-600 font-medium text-center leading-relaxed max-w-sm italic">
            "{vcard.bio}"
          </p>
        )}
      </div>

      <div className="px-6 py-8">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="w-full py-4 border border-stone-300 font-bold text-stone-800 flex justify-center items-center gap-2 shadow-sm transition-all hover:bg-stone-50 uppercase tracking-widest text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
          Add to Address Book
        </button>
      </div>

      {/* 2. Structured Contact Info */}
      <div className="px-6 mb-12">
        <div className="border-t border-b border-stone-200 py-2 divide-y divide-stone-200">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex flex-col py-4 hover:bg-stone-50 transition-colors group">
                <div className="flex items-center gap-2 mb-1 text-stone-500 group-hover:text-stone-900 transition-colors">
                  <span className="material-symbols-outlined text-[14px]">{icon}</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest">{contact.label}</p>
                </div>
                <p className="text-base font-semibold text-stone-900 ml-6">{contact.value}</p>
              </a>
            );
          })}
        </div>
      </div>

      {/* 3. Offerings */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12">
          <h3 className="text-base font-bold text-stone-900 mb-6 uppercase tracking-widest text-center">Featured Offerings</h3>
          <div className="space-y-6">
            {vcard.products.map((prod, index) => (
              <div key={index} className="flex gap-4 items-start">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-24 h-32 object-cover border border-stone-200 p-1 bg-white shrink-0 shadow-sm" />
                ) : (
                  <div className="w-24 h-32 bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl text-stone-300">image</span>
                  </div>
                )}
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-stone-900 text-lg mb-1">{prod.name}</h4>
                  {prod.price && <p className="text-sm font-semibold mb-2 text-stone-500">{prod.price}</p>}
                  {prod.description && <p className="text-[13px] text-stone-600 line-clamp-3 leading-relaxed">{prod.description}</p>}
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

export default ThemeClassic;
