import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeRestaurant = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#ea580c'; // Vibrant Orange

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-stone-50 pb-16">
      {/* 1. Ultra-Premium Wavy Header */}
      <div className="relative w-full h-64 overflow-hidden rounded-b-[3rem] shadow-md z-0 bg-stone-900">
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-stone-900 to-stone-700"></div>
        )}
        {/* Dynamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        {/* Animated Wave SVG at the bottom inside header */}
        <div className="absolute bottom-0 w-full leading-none z-10 translate-y-[1px]">
           <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-stone-50 fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,124.64,201.5,115.6,242.45,110.37,283.4,94.23,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* 2. Floating Profile Picture */}
      <div className="px-6 relative z-20 flex flex-col items-center -mt-20 mb-8">
        <div className="relative">
          <div className="w-36 h-36 rounded-full border-4 border-stone-50 overflow-hidden shadow-2xl bg-white" style={{ borderColor: 'white' }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-100">
                <span className="material-symbols-outlined text-5xl text-stone-300">restaurant</span>
              </div>
            )}
          </div>
          {/* Badge */}
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg" style={{ backgroundColor: primaryColor }}>
             <span className="material-symbols-outlined text-white text-[16px]">verified</span>
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-black text-stone-800 tracking-tight text-center">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <p className="mt-1 px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest shadow-md" style={{ backgroundColor: primaryColor }}>
            {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
          </p>
        )}

        {vcard.bio && (
          <p className="mt-6 text-sm text-stone-600 font-medium text-center leading-relaxed px-4">
            "{vcard.bio}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-10 flex gap-3">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="flex-1 py-4 rounded-2xl font-bold text-white flex justify-center items-center gap-2 shadow-[0_8px_20px_-6px_rgba(234,88,12,0.5)] transition-transform hover:-translate-y-1"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="material-symbols-outlined">person_add</span>
          Save Contact
        </button>
      </div>

      {/* 3. Glassmorphism Contact Grid */}
      <div className="px-6 mb-12">
        <div className="grid grid-cols-1 gap-4">
          {vcard.contact_details?.map((contact, idx) => {
            let href = '#', icon = 'call';
            if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
            if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
            if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
            
            return (
              <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  <span className="material-symbols-outlined text-[24px]">{icon}</span>
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-0.5">{contact.label}</p>
                  <p className="text-sm font-bold text-stone-800 truncate">{contact.value}</p>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-50 text-stone-300 group-hover:text-stone-500">
                  <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 4. Products / Services */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-stone-800">Our Menu</h3>
            <span className="text-xs font-bold px-2 py-1 rounded bg-stone-200 text-stone-600">{vcard.products.length} Items</span>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-white rounded-3xl p-3 flex gap-4 shadow-sm border border-stone-100 items-center">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-24 h-24 object-cover rounded-2xl shrink-0 shadow-inner" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl text-stone-300">restaurant_menu</span>
                  </div>
                )}
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-stone-800 text-base leading-tight mb-1">{prod.name}</h4>
                  {prod.description && <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{prod.description}</p>}
                  {prod.price && <p className="text-sm font-black mt-2" style={{ color: primaryColor }}>{prod.price}</p>}
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

export default ThemeRestaurant;
