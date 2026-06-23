import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeDark = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#3b82f6'; // Neon Blue

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-[#050505] text-gray-300 pb-16 relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(${primaryColor}30 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}30 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>

      <div className="px-6 pt-16 relative z-10 flex flex-col items-center text-center">
        {/* 1. Neon Glowing Profile */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-1 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" style={{ backgroundColor: primaryColor }}></div>
          <div className="w-36 h-36 rounded-full border-2 bg-black overflow-hidden relative z-10" style={{ borderColor: primaryColor }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gray-600">person</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-black text-white tracking-wider mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">
            <span style={{ color: primaryColor }}>&lt;</span>
            {vcard.job_title} {vcard.job_title && vcard.company && '/'} {vcard.company}
            <span style={{ color: primaryColor }}>/&gt;</span>
          </p>
        )}

        {vcard.bio && (
          <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm mb-10 max-w-sm">
            <p className="text-sm text-gray-400 font-mono leading-relaxed">
              {">"} {vcard.bio}
            </p>
          </div>
        )}

        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-black shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          style={{ backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}40` }}
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
             <span className="material-symbols-outlined">download</span>
             Save Contact
          </span>
        </button>

        {/* 2. Cyberpunk Contact Grid */}
        <div className="w-full mt-12 space-y-3">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/80 backdrop-blur-md border border-gray-800 hover:border-gray-600 transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black border border-gray-800 group-hover:border-current transition-colors" style={{ color: primaryColor }}>
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 font-mono">{contact.label}</p>
                  <p className="text-sm font-bold text-gray-200 truncate">{contact.value}</p>
                </div>
              </a>
            );
          })}
        </div>

        {/* 3. Products / Services */}
        {vcard.products?.length > 0 && (
          <div className="w-full mt-12 text-left">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
               <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
               Services
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {vcard.products.map((prod, index) => (
                <div key={index} className="bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-800 group hover:border-gray-600 transition-colors flex gap-4">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-lg border border-gray-800 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-black border border-gray-800 flex items-center justify-center shrink-0" style={{ color: primaryColor }}>
                      <span className="material-symbols-outlined text-2xl">layers</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-100 text-[15px] mb-1">{prod.name}</h4>
                    {prod.price && <p className="text-[11px] font-mono font-bold mb-2" style={{ color: primaryColor }}>{prod.price}</p>}
                    {prod.description && <p className="text-[11px] text-gray-400 line-clamp-2">{prod.description}</p>}
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

export default ThemeDark;
