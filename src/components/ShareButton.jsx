import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { useLocation } from 'react-router-dom';

const ShareButton = ({ sectionId, path, title, text, successMessage, className = "" }) => {
  const location = useLocation();

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const targetPath = path || location.pathname;
    const shareUrl = `https://gujaratiapp.in${targetPath}${sectionId ? `?section=${sectionId}` : ''}`;
    const shareTitle = title || 'ગુજરાતી App';
    const shareText = text || 'ગુજરાતી App પર આ જુઓ 👇';

    try {
      if (Capacitor.isNativePlatform()) {
        // Native Android share sheet — opens WhatsApp, Facebook, etc.
        await Share.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
          dialogTitle: 'શેર કરો',
        });
      } else if (navigator.share) {
        // Web Share API (works on mobile browsers too)
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Desktop fallback: copy link
        await navigator.clipboard.writeText(shareUrl);
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: successMessage || '✅ લિંક કૉપી થઈ!' }
        }));
        return;
      }
      if (successMessage) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: successMessage }
        }));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // User cancelled — do nothing
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: '✅ લિંક કૉપી થઈ!' }
          }));
        } catch (_) {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`h-9 w-9 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-stone-200/50 dark:border-stone-700 shadow-sm shrink-0 ${className}`}
      title="શેર કરો"
    >
      <span className="material-symbols-outlined text-[18px] leading-none">share</span>
    </button>
  );
};

export default ShareButton;
