import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeAyurveda = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#166534'; // Forest Green

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-serif bg-[#fdfaf6] text-zinc-800 pb-16 relative overflow-hidden">
      {/* 1. Leafy Nature Header */}
      <div className="relative w-full h-64 overflow-hidden rounded-b-[4rem] shadow-sm z-0 bg-[#e2e8f0]">
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover mix-blend-multiply opacity-80" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(180deg, ${primaryColor}60, ${primaryColor}20)` }}></div>
        )}
        {/* Subtle leaf pattern overlay (using circles as abstract leaves) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#dcfce7]/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {/* 2. Floating Natural Profile */}
      <div className="px-6 relative z-20 flex flex-col items-center -mt-24 mb-10">
        <div className="w-40 h-40 rounded-full border-8 border-[#fdfaf6] overflow-hidden shadow-xl bg-white relative">
          <div className="w-full h-full rounded-full overflow-hidden" style={{ border: `2px solid ${primaryColor}` }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#f0fdf4]">
                <span className="material-symbols-outlined text-6xl text-[#166534]/50">eco</span>
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-bold text-[#14532d] tracking-tight text-center">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <div className="mt-2 flex items-center gap-2 text-[#166534]">
             <span className="material-symbols-outlined text-[14px]">spa</span>
            <p className="text-xs font-bold uppercase tracking-widest">
              {vcard.job_title} {vcard.job_title && vcard.company && '|'} {vcard.company}
            </p>
             <span className="material-symbols-outlined text-[14px]">spa</span>
          </div>
        )}

        {vcard.bio && (
          <div className="mt-8 relative max-w-sm">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl text-[#166534]/10 material-symbols-outlined">format_quote</span>
            <p className="text-sm text-zinc-600 italic leading-relaxed text-center px-4">
              "{vcard.bio}"
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-12 flex gap-3">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="flex-1 py-4 font-bold text-white flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1 rounded-[2rem] uppercase tracking-widest text-[11px]"
          style={{ backgroundColor: primaryColor }}
        >
          <span className="material-symbols-outlined">compost</span>
          Connect for Wellness
        </button>
      </div>

      {/* 3. Earthy Contact Grid */}
      <div className="px-6 mb-12 space-y-4">
        {vcard.contact_details?.map((contact, idx) => {
          let href = '#', icon = 'call';
          if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
          if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
          if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
          
          return (
            <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
               onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
               className="flex items-center gap-5 p-4 rounded-[2rem] bg-white border border-[#e4e4e7] hover:border-[#86efac] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0fdf4] group-hover:scale-110 transition-transform" style={{ color: primaryColor }}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">{contact.label}</p>
                <p className="text-sm font-semibold text-zinc-800 truncate">{contact.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 4. Treatments & Herbs */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12">
          <h3 className="text-lg font-bold text-[#14532d] mb-6 text-center flex items-center justify-center gap-2">
            <span className="w-12 h-[1px] bg-[#14532d]/20"></span>
            Treatments & Herbs
            <span className="w-12 h-[1px] bg-[#14532d]/20"></span>
          </h3>
          <div className="grid grid-cols-1 gap-5">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-white rounded-[2rem] p-4 shadow-sm border border-[#e4e4e7] flex gap-5 items-center group hover:shadow-md transition-shadow">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#f0fdf4] flex items-center justify-center shrink-0" style={{ color: primaryColor }}>
                    <span className="material-symbols-outlined text-3xl">medication_liquid</span>
                  </div>
                )}
                <div className="flex-1 py-1">
                  <h4 className="font-bold text-zinc-800 text-[15px] mb-1">{prod.name}</h4>
                  {prod.price && <p className="text-xs font-bold mt-1" style={{ color: primaryColor }}>{prod.price}</p>}
                  {prod.description && <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mt-2">{prod.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Clinic Hours */}
      {vcard.business_hours && Object.values(vcard.business_hours).some(v => v) && (
        <div className="px-6 mb-12">
          <div className="bg-white rounded-[2rem] p-8 border border-[#e4e4e7] shadow-sm relative overflow-hidden text-center">
             <div className="absolute -top-4 -left-4 text-[#166534]/5 rotate-45">
               <span className="material-symbols-outlined text-[100px]">eco</span>
             </div>
            <h3 className="text-sm font-bold text-[#166534] mb-6 uppercase tracking-widest relative z-10">Clinic Timings</h3>
            <div className="space-y-4 relative z-10">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                const time = vcard.business_hours[day];
                if (!time) return null;
                const isClosed = time.toLowerCase().includes('close');
                return (
                  <div key={day} className="flex justify-between items-center text-[13px] pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                    <span className="capitalize font-medium text-zinc-500">{day}</span>
                    <span className={`font-semibold ${isClosed ? 'text-red-500' : 'text-zinc-800'}`}>{time}</span>
                  </div>
                );
              })}
            </div>
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

export default ThemeAyurveda;
