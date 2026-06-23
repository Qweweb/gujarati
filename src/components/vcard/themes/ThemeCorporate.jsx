import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeCorporate = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#1e3a8a'; // Navy Blue

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-slate-50 pb-16">
      {/* 1. Angled Corporate Header */}
      <div className="relative w-full h-72 overflow-hidden shadow-lg z-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' }}>
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${primaryColor}, #0f172a)` }}></div>
        )}
        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
      </div>

      {/* 2. Overlapping Profile Picture */}
      <div className="px-6 relative z-20 flex flex-col items-center -mt-24 mb-10">
        <div className="w-40 h-40 rounded-2xl border-[6px] border-slate-50 overflow-hidden shadow-xl bg-white rotate-3 hover:rotate-0 transition-transform duration-300">
          <div className="w-full h-full rounded-xl overflow-hidden -rotate-3 hover:rotate-0 transition-transform duration-300 bg-slate-100">
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-slate-300">work</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-black text-slate-800 tracking-tight text-center">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <div className="mt-2 flex items-center gap-2">
            <span className="w-8 h-[2px]" style={{ backgroundColor: primaryColor }}></span>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {vcard.job_title} {vcard.job_title && vcard.company && '|'} {vcard.company}
            </p>
            <span className="w-8 h-[2px]" style={{ backgroundColor: primaryColor }}></span>
          </div>
        )}

        {vcard.bio && (
          <p className="mt-6 text-sm text-slate-600 font-medium text-center leading-relaxed px-4 max-w-sm">
            {vcard.bio}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-12 flex gap-4">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="flex-1 py-4 font-bold text-white flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1 rounded-xl"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="material-symbols-outlined">download</span>
          Save to Contacts
        </button>
      </div>

      {/* 3. Professional Contact Grid */}
      <div className="px-6 mb-12">
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 rounded-2xl group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all" style={{ color: primaryColor }}>
                  <span className="material-symbols-outlined text-[22px]">{icon}</span>
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{contact.label}</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{contact.value}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* 4. Services / Products */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <span className="w-2 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></span>
            Our Expertise
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 group hover:border-slate-300 hover:shadow-md transition-all flex flex-col items-start text-left">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4" style={{ color: primaryColor }}>
                    <span className="material-symbols-outlined">business_center</span>
                  </div>
                )}
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{prod.name}</h4>
                {prod.price && <p className="text-[10px] font-bold text-slate-500 mb-2">{prod.price}</p>}
                {prod.description && <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed mt-auto">{prod.description}</p>}
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

export default ThemeCorporate;
