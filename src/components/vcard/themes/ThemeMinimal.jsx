import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeMinimal = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#000000'; // Pure Black

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-sans bg-white text-neutral-900 pb-20">
      {/* 1. Ultra Minimal Header & Profile */}
      <div className="pt-20 px-8 flex flex-col items-start mb-16">
        <div className="w-24 h-24 mb-10 overflow-hidden rounded-full shadow-md bg-neutral-100">
          {vcard.profile_image ? (
            <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-neutral-400">person</span>
            </div>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-neutral-900 mb-4 leading-none">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-8">
            {vcard.job_title} {vcard.job_title && vcard.company && '—'} {vcard.company}
          </p>
        )}

        {vcard.bio && (
          <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-sm mb-12">
            {vcard.bio}
          </p>
        )}

        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-xl"
        >
          Save Contact
        </button>
      </div>

      {/* 2. Brutalist Contact List */}
      <div className="px-8 mb-20 space-y-8">
        {vcard.contact_details?.map((contact, idx) => {
          let href = '#';
          if (contact.type === 'phone') href = `tel:${contact.value}`;
          if (contact.type === 'email') href = `mailto:${contact.value}`;
          if (contact.type === 'location') href = `https://maps.google.com/?q=${contact.value}`;
          
          return (
            <div key={idx} className="group">
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-2">{contact.label}</p>
              <a href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
                 onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
                 className="text-lg font-light text-neutral-900 group-hover:underline decoration-1 underline-offset-8 transition-all">
                {contact.value}
              </a>
            </div>
          );
        })}
      </div>

      {/* 3. Typography-driven Services */}
      {vcard.products?.length > 0 && (
        <div className="px-8 mb-20">
          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-8">Selected Services</p>
          <div className="space-y-10">
            {vcard.products.map((prod, index) => (
              <div key={index} className="border-l border-neutral-200 pl-6 hover:border-neutral-900 transition-colors duration-500">
                <h4 className="text-xl font-light text-neutral-900 mb-2">{prod.name}</h4>
                {prod.price && <p className="text-sm font-medium text-neutral-500 mb-3">{prod.price}</p>}
                {prod.description && <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">{prod.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Minimalist Hours */}
      {vcard.business_hours && Object.values(vcard.business_hours).some(v => v) && (
        <div className="px-8 mb-20">
          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-8">Availability</p>
          <div className="space-y-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
              const time = vcard.business_hours[day];
              if (!time) return null;
              const isClosed = time.toLowerCase().includes('close');
              return (
                <div key={day} className="flex justify-between items-center text-sm border-b border-neutral-100 pb-2">
                  <span className="capitalize font-light text-neutral-500">{day}</span>
                  <span className={`font-medium ${isClosed ? 'text-neutral-300' : 'text-neutral-900'}`}>{time}</span>
                </div>
              );
            })}
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

export default ThemeMinimal;
