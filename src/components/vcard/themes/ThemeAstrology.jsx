import React from 'react';

import PaymentSection from './PaymentSection';
import { generateVCF } from '../../../utils/vcard_helper';

const ThemeAstrology = ({ vcard, isPreview, onTrackEvent }) => {
  const primaryColor = vcard.theme_colors?.primary || '#9333ea'; // Deep Purple

  const handleAction = (type, data) => {
    if (!isPreview && onTrackEvent) onTrackEvent(type, data);
  };

  const vcardUrl = `https://gujaratiapp.in/${vcard.slug || vcard.id}`;

  return (
    <div className="min-h-full font-serif bg-[#0a0514] text-purple-100 pb-16 relative overflow-hidden">
      {/* 1. Starlight Galaxy Header */}
      <div className="relative w-full h-72 z-0 overflow-hidden" style={{ borderBottomLeftRadius: '100% 20%', borderBottomRightRadius: '100% 20%' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/50 via-[#0a0514] to-[#0a0514] z-10"></div>
        {vcard.cover_image ? (
          <img src={vcard.cover_image} alt="Cover" className="w-full h-full object-cover opacity-60 mix-blend-screen z-0" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-indigo-900 z-0 opacity-50"></div>
        )}
        <div className="absolute inset-0 z-20 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      {/* 2. Floating Mystic Profile */}
      <div className="px-6 relative z-30 flex flex-col items-center -mt-24 mb-10">
        <div className="relative group">
           {/* Outer rotating ring */}
           <div className="absolute -inset-2 rounded-full border border-dashed border-purple-500/50 animate-[spin_10s_linear_infinite]"></div>
          <div className="w-36 h-36 rounded-full border-4 overflow-hidden shadow-[0_0_40px_rgba(147,51,234,0.4)] bg-[#1a0b2e] relative z-10" style={{ borderColor: primaryColor }}>
            {vcard.profile_image ? (
              <img src={vcard.profile_image} alt={vcard.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-purple-400">flare</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border border-purple-300/30 flex items-center justify-center bg-purple-900 shadow-[0_0_15px_rgba(147,51,234,0.8)] z-20">
             <span className="material-symbols-outlined text-purple-200 text-[16px]">stars</span>
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 tracking-wider text-center">{vcard.name}</h1>
        {(vcard.job_title || vcard.company) && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-purple-500 text-sm">flare</span>
            <p className="text-xs font-bold text-purple-300 uppercase tracking-widest">
              {vcard.job_title} {vcard.job_title && vcard.company && '✦'} {vcard.company}
            </p>
            <span className="material-symbols-outlined text-purple-500 text-sm">flare</span>
          </div>
        )}

        {vcard.bio && (
          <div className="mt-6 p-4 rounded-2xl bg-purple-900/20 border border-purple-800/50 backdrop-blur-sm max-w-sm">
            <p className="text-[13px] text-purple-200 font-medium text-center leading-relaxed italic">
              "{vcard.bio}"
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-12 flex gap-4">
        <button 
          onClick={() => { handleAction('download_vcf'); if(!isPreview) generateVCF(vcard); }}
          className="flex-1 py-4 font-bold text-white flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-transform hover:scale-105 rounded-full uppercase tracking-widest text-xs border border-purple-500/50"
          style={{ background: `linear-gradient(to right, ${primaryColor}, #6b21a8)` }}
        >
          <span className="material-symbols-outlined">auto_awesome</span>
          Connect Spiritually
        </button>
      </div>

      {/* 3. Mystical Contact Grid */}
      <div className="px-6 mb-12 space-y-4">
        {vcard.contact_details?.map((contact, idx) => {
          let href = '#', icon = 'call';
          if (contact.type === 'phone') { href = `tel:${contact.value}`; icon = 'call'; }
          if (contact.type === 'email') { href = `mailto:${contact.value}`; icon = 'mail'; }
          if (contact.type === 'location') { href = `https://maps.google.com/?q=${contact.value}`; icon = 'location_on'; }
          
          return (
            <a key={idx} href={isPreview ? '#' : href} target="_blank" rel="noreferrer"
               onClick={(e) => { if (isPreview) e.preventDefault(); else handleAction(`click_${contact.type}`, contact.value); }}
               className="flex items-center gap-5 p-4 rounded-2xl bg-[#130724] border border-purple-900/50 hover:border-purple-500/50 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-900/30 border border-purple-500/20 text-purple-400">
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
              <div className="text-left flex-1 overflow-hidden">
                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest mb-1">{contact.label}</p>
                <p className="text-sm font-bold text-purple-100 truncate">{contact.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* 4. Services / Reading Offerings */}
      {vcard.products?.length > 0 && (
        <div className="px-6 mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/10 blur-3xl z-0 rounded-full"></div>
          <h3 className="text-sm font-bold text-purple-300 mb-6 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 relative z-10">
            <span className="material-symbols-outlined text-purple-500 text-sm">wb_sunny</span>
            Mystic Services
            <span className="material-symbols-outlined text-purple-500 text-sm">nightlight</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {vcard.products.map((prod, index) => (
              <div key={index} className="bg-[#130724] rounded-3xl p-5 border border-purple-900/50 flex flex-col items-center text-center group hover:bg-[#1a0b2e] transition-colors">
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded-full border-2 border-purple-800 mb-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center border-2 border-purple-800 mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">auto_awesome_mosaic</span>
                  </div>
                )}
                <h4 className="font-bold text-purple-100 text-base mb-1">{prod.name}</h4>
                {prod.price && <p className="text-[11px] font-bold text-purple-400 mb-3 bg-purple-900/30 px-3 py-1 rounded-full">{prod.price}</p>}
                {prod.description && <p className="text-xs text-purple-300/70 line-clamp-3 leading-relaxed">{prod.description}</p>}
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

export default ThemeAstrology;
