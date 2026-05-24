import { useLocation } from 'react-router-dom';

const ShareButton = ({ sectionId, path, successMessage, className = "" }) => {
  const location = useLocation();

  const handleShare = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const targetPath = path || location.pathname;
    const shareUrl = `${window.location.origin}${targetPath}?section=${sectionId}`;

    const performCopy = () => {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: successMessage } }));
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(performCopy)
        .catch(() => fallbackCopy(shareUrl));
    } else {
      fallbackCopy(shareUrl);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: successMessage } }));
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <button
      onClick={handleShare}
      className={`h-9 w-9 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl flex items-center justify-center transition-all active:scale-90 border border-stone-200/50 dark:border-stone-700 shadow-sm shrink-0 ${className}`}
      title="લિંક શેર કરો"
    >
      <span className="material-symbols-outlined text-[18px] leading-none">share</span>
    </button>
  );
};

export default ShareButton;
