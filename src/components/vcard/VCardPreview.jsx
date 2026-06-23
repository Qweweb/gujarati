import React from 'react';
import ThemeModern from './themes/ThemeModern';
import ThemeClassic from './themes/ThemeClassic';
import ThemeGlass from './themes/ThemeGlass';
import ThemeRestaurant from './themes/ThemeRestaurant';
import ThemeCorporate from './themes/ThemeCorporate';
import ThemeMedical from './themes/ThemeMedical';
import ThemeRealEstate from './themes/ThemeRealEstate';
import ThemeAstrology from './themes/ThemeAstrology';
import ThemeAyurveda from './themes/ThemeAyurveda';
import ThemeBlueCollar from './themes/ThemeBlueCollar';
import ThemeMinimal from './themes/ThemeMinimal';
import ThemeVibrant from './themes/ThemeVibrant';
import ThemeDark from './themes/ThemeDark';

const VCardPreview = ({ vcard, isPreview = false, onTrackEvent = null }) => {
  if (!vcard) return null;

  const renderTheme = () => {
    switch (vcard.theme_id) {
      case 'classic': return <ThemeClassic vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'glass': return <ThemeGlass vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'restaurant': return <ThemeRestaurant vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'corporate': return <ThemeCorporate vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'medical': return <ThemeMedical vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'realestate': return <ThemeRealEstate vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'astrology': return <ThemeAstrology vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'ayurveda': return <ThemeAyurveda vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'bluecollar': return <ThemeBlueCollar vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'minimal': return <ThemeMinimal vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'vibrant': return <ThemeVibrant vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'dark': return <ThemeDark vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
      case 'modern':
      default:
        return <ThemeModern vcard={vcard} isPreview={isPreview} onTrackEvent={onTrackEvent} />;
    }
  };

  return (
    <div className="w-full min-h-full">
      {renderTheme()}
    </div>
  );
};

export default VCardPreview;
