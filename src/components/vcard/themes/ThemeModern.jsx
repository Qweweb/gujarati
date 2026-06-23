import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeModern = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#3b82f6'; // Blue

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-slate-100 pb-16 relative overflow-hidden">
      {/* 1. Dynamic Wavy Header */}
      <div className="relative w-full h-72 z-0">
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primaryColor}, #1e40af)` }}></div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        {/* SVG Wave */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,124.64,201.5,115.6,242.45,110.37,283.4,94.23,321.39,56.44Z" className="fill-slate-100"></path>
          </svg>
        </div>
      </div>

      <div className="px-6 relative z-20 flex flex-col items-center -mt-24 text-center">
        {/* 2. Floating Profile Pic */}
        <div className="w-36 h-36 rounded-3xl border-[6px] border-slate-100 overflow-hidden shadow-xl bg-white mb-6 relative hover:-translate-y-2 transition-transform duration-300">
           {vcard.profile_image ? (
            <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200">
              <span className="material-symbols-outlined text-5xl text-slate-400">person</span>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <span className="px-4 py-1.5 rounded-full text-[11px] font-bold text-white uppercase tracking-widest shadow-md mb-6" style={{ backgroundColor: primaryColor }}>
            {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
          </span>
        )}

        {vcard.bio && (
          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-sm mb-10">
            {vcard.bio}
          </p>
        )}

        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="w-full py-4 rounded-2xl font-bold text-white flex justify-center items-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: primaryColor, boxShadow: `0 10px 25px -5px ${primaryColor}60` }}
        >
          <span className="material-symbols-outlined">person_add</span>
          Save Contact
        </button>

        {/* 3. Modern Contact Cards */}
        <div className="w-full mt-10 grid grid-cols-2 gap-3">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className={`p-5 rounded-3xl bg-white shadow-sm border border-slate-200/60 flex flex-col items-center hover:shadow-md hover:border-blue-100 transition-all group ${contact.type === 'location' ? 'col-span-2' : ''}`}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{contact.label}</p>
                <p className="text-sm font-bold text-slate-700 w-full truncate">{contact.value}</p>
              </a>
            );
          })}
        </div>

        {/* 4. Products & Services */}
        {vcard.products?.length > 0 && (
          <div className="w-full mt-12 text-left">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: primaryColor }}>inventory_2</span>
              Products & Services
            </h3>
            <div className="space-y-4">
              {vcard.products.map((prod, index) => (
                <div key={index} className="bg-white rounded-3xl p-3 shadow-sm border border-slate-200/60 flex gap-4 items-center group hover:shadow-md transition-shadow">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                    </div>
                  )}
                  <div className="flex-1 py-1">
                    <h4 className="font-bold text-slate-800 text-base mb-1 leading-tight">{prod.name}</h4>
                    {prod.price && <p className="text-xs font-black mb-1" style={{ color: primaryColor }}>{prod.price}</p>}
                    {prod.description && <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>}
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

export default ThemeModern;
