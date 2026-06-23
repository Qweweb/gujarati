import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeMedical = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#0d9488'; // Teal

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-slate-50 pb-16">
      {/* 1. Clean Medical Header with soft curve */}
      <div className="relative w-full h-60 z-0 bg-white shadow-sm overflow-hidden" style={{ borderBottomLeftRadius: '50% 20%', borderBottomRightRadius: '50% 20%' }}>
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(180deg, ${primaryColor}20, ${primaryColor}10)` }}></div>
        )}
      </div>

      {/* 2. Floating Profile Picture with Plus Badge */}
      <div className="px-6 relative z-20 flex flex-col items-center -mt-20 mb-8">
        <div className="relative">
          <div className="w-36 h-36 rounded-full border-4 overflow-hidden shadow-xl bg-white" style={{ borderColor: primaryColor }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-teal-50">
                <span className="material-symbols-outlined text-5xl" style={{ color: primaryColor }}>medical_services</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full border-4 border-slate-50 flex items-center justify-center bg-white shadow-sm" style={{ color: primaryColor }}>
             <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-800 tracking-tight text-center">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <p className="mt-1 text-sm font-bold" style={{ color: primaryColor }}>
            {vcard.job_title} {vcard.job_title && vcard.company && '•'} {vcard.company}
          </p>
        )}

        {vcard.bio && (
          <p className="mt-4 text-[13px] text-slate-500 font-medium text-center leading-relaxed px-6 bg-white py-3 rounded-2xl shadow-sm border border-slate-100 mt-4">
            {vcard.bio}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-10 flex gap-3">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="flex-1 py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          Book Appointment
        </button>
      </div>

      {/* 3. Clinical Contact Cards */}
      <div className="px-6 mb-10 grid grid-cols-2 gap-3">
        {vcard.contact_details?.map((contact, idx) => {
          let href = '#', icon = 'call';
          if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
          if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
          if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
          
          return (
            <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
               onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
               className={`p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex flex-col items-center text-center transition-all hover:scale-105 ${contact.type === 'location' ? 'col-span-2' : ''}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{contact.label}</p>
              <p className="text-xs font-bold text-slate-700">{contact.value}</p>
            </a>
          );
        })}
      </div>

      {/* 4. Services / Treatments */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-10">
          <h3 className="text-base font-bold text-slate-800 mb-4 pl-3 border-l-4" style={{ borderColor: primaryColor }}>Treatments & Services</h3>
          <div className="space-y-3">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex gap-4 items-center">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
                    <span className="material-symbols-outlined text-2xl">vaccines</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{prod.name}</h4>
                  {prod.description && <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>}
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

export default ThemeMedical;
