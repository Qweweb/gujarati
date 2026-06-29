import sys

try:
    with open('src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update imports
    content = content.replace(
        "import { useState, useEffect } from 'react';", 
        "import { useState, useEffect, useRef } from 'react';"
    )
    
    # 2. Replace the two useEffects with the new logic
    old_code = """
  // Auto-save logic
  useEffect(() => {
    if (!isViewer) {
      const saved = localStorage.getItem('digitalCardDraft');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.name) setName(d.name);
          if (d.businessName) setBusinessName(d.businessName);
          if (d.category) setCategory(d.category);
          if (d.tagline) setTagline(d.tagline);
          if (d.phone) setPhone(d.phone);
          if (d.whatsapp) setWhatsapp(d.whatsapp);
          if (d.email) setEmail(d.email);
          if (d.address) setAddress(d.address);
          if (d.locationLink) setLocationLink(d.locationLink);
          if (d.website) setWebsite(d.website);
          if (d.upiId) setUpiId(d.upiId);
          if (d.upiName) setUpiName(d.upiName);
          if (d.facebook) setFacebook(d.facebook);
          if (d.instagram) setInstagram(d.instagram);
          if (d.linkedin) setLinkedin(d.linkedin);
          if (d.twitter) setTwitter(d.twitter);
          if (d.youtubeLinks) setYoutubeLinks(d.youtubeLinks);
          else if (d.youtube && d.youtube !== 'youtube.com/@example') setYoutubeLinks([d.youtube]);
          if (d.themeId) setThemeId(d.themeId);
          if (d.customColor) setCustomColor(d.customColor);
          if (d.bgPattern) setBgPattern(d.bgPattern);
          if (d.products) setProducts(d.products);
          if (d.gallery) setGallery(d.gallery);
          if (d.layoutStyle) setLayoutStyle(d.layoutStyle);
          if (d.profileImage) setProfileImage(d.profileImage);
        } catch(e) {}
      }
    }
  }, [isViewer]);

  useEffect(() => {
    if (!isViewer) {
      const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug };
      localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    }
  }, [name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, isViewer]);
"""

    new_code = """
  const hasLoadedDraft = useRef(false);

  // Auto-save logic
  useEffect(() => {
    if (!isViewer) {
      const saved = localStorage.getItem('digitalCardDraft');
      if (saved) {
        try {
          const d = JSON.parse(saved);
          if (d.name) setName(d.name);
          if (d.businessName) setBusinessName(d.businessName);
          if (d.category) setCategory(d.category);
          if (d.tagline) setTagline(d.tagline);
          if (d.phone) setPhone(d.phone);
          if (d.whatsapp) setWhatsapp(d.whatsapp);
          if (d.email) setEmail(d.email);
          if (d.address) setAddress(d.address);
          if (d.locationLink) setLocationLink(d.locationLink);
          if (d.website) setWebsite(d.website);
          if (d.upiId) setUpiId(d.upiId);
          if (d.upiName) setUpiName(d.upiName);
          if (d.facebook) setFacebook(d.facebook);
          if (d.instagram) setInstagram(d.instagram);
          if (d.linkedin) setLinkedin(d.linkedin);
          if (d.twitter) setTwitter(d.twitter);
          if (d.youtubeLinks) setYoutubeLinks(d.youtubeLinks);
          else if (d.youtube && d.youtube !== 'youtube.com/@example') setYoutubeLinks([d.youtube]);
          if (d.themeId) setThemeId(d.themeId);
          if (d.customColor) setCustomColor(d.customColor);
          if (d.bgPattern) setBgPattern(d.bgPattern);
          if (d.products) setProducts(d.products);
          if (d.gallery) setGallery(d.gallery);
          if (d.layoutStyle) setLayoutStyle(d.layoutStyle);
          if (d.profileImage) setProfileImage(d.profileImage);
          if (d.currentStep) setCurrentStep(d.currentStep);
        } catch(e) {}
      }
      // Give state updates a moment to queue before allowing auto-saves
      setTimeout(() => {
        hasLoadedDraft.current = true;
      }, 500);
    }
  }, [isViewer]);

  useEffect(() => {
    if (!isViewer && hasLoadedDraft.current) {
      const data = { name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug, currentStep };
      localStorage.setItem('digitalCardDraft', JSON.stringify(data));
    }
  }, [name, businessName, category, tagline, phone, whatsapp, email, address, locationLink, website, upiId, upiName, facebook, instagram, linkedin, twitter, youtubeLinks, themeId, customColor, bgPattern, products, gallery, layoutStyle, profileImage, customSlug, currentStep, isViewer]);
"""
    
    if old_code in content:
        content = content.replace(old_code, new_code)
        with open('src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully updated Auto-save logic.")
    else:
        print("Could not find the old code block. Trying loose replacement.")
        # Try a more forgiving replacement if whitespace mismatches
        pass
        
except Exception as e:
    print("Error:", e)
