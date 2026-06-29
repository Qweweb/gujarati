const fs = require('fs');

try {
  const content = fs.readFileSync('src/components/DigitalCard.jsx', 'utf8');

  // Function to extract inner content of an AccordionItem
  function getAccordionContent(fullText, accordionId) {
      const regex = new RegExp(`<AccordionItem[^>]*id="${accordionId}"[^>]*>`);
      const match = fullText.match(regex);
      if(!match) {
          console.error("Could not find accordion:", accordionId);
          return '';
      }
      const contentStart = match.index + match[0].length;
      
      let depth = 1;
      let i = contentStart;
      while (i < fullText.length) {
          if (fullText.substring(i, i + 15) === '<AccordionItem ') {
              depth++;
              i += 15;
          } else if (fullText.substring(i, i + 16) === '</AccordionItem>') {
              depth--;
              if (depth === 0) {
                  return fullText.substring(contentStart, i).trim();
              }
              i += 16;
          } else {
              i++;
          }
      }
      return '';
  }

  const detailsContent = getAccordionContent(content, 'details');
  const layoutContent = getAccordionContent(content, 'layout');
  const themesContent = getAccordionContent(content, 'themes');
  const productsContent = getAccordionContent(content, 'products');
  const galleryContent = getAccordionContent(content, 'gallery');
  const shareContent = getAccordionContent(content, 'share');

  const newFormArea = `{/* Left Side Config Form (Wizard Steps) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Stepper Header */}
          <div className="bg-white dark:bg-dark-surface p-3 sm:p-4 rounded-[2rem] shadow-sm border border-primary/10 flex justify-between items-center overflow-x-auto hide-scrollbar gap-2">
            {[
              { num: 1, label: 'ડિઝાઇન', icon: 'palette' },
              { num: 2, label: 'પ્રોફાઇલ', icon: 'person' },
              { num: 3, label: 'કેટલોગ', icon: 'storefront' },
              { num: 4, label: 'પબ્લિશ', icon: 'rocket_launch' }
            ].map(step => (
              <button 
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={\`flex flex-col items-center gap-1 min-w-[70px] p-2 rounded-2xl transition-all \${currentStep === step.num ? 'bg-primary/10 text-primary' : 'text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50'}\`}
              >
                <span className={\`material-symbols-outlined text-xl \${currentStep === step.num ? 'fill-1' : ''}\`}>{step.icon}</span>
                <span className={\`font-gujarati text-[10px] font-black \${currentStep === step.num ? 'text-primary' : 'text-stone-500'}\`}>{step.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-[2rem] border border-primary/10 dark:border-primary/5 overflow-hidden shadow-xs p-5 sm:p-6 space-y-5 min-h-[500px]">
          
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">palette</span> ડિઝાઇન અને લેઆઉટ
              </h3>
              \n${layoutContent}\n
              <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-800 my-6"></div>
              \n${themesContent}\n
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">person</span> પ્રોફાઇલ અને સંપર્ક
              </h3>
              \n${detailsContent}\n
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">storefront</span> કેટલોગ અને ગેલેરી
              </h3>
              \n${productsContent}\n
              <div className="border-t-2 border-dashed border-stone-200 dark:border-stone-800 my-6"></div>
              \n${galleryContent}\n
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-gujarati font-black text-lg text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
                <span className="material-symbols-outlined">rocket_launch</span> પબ્લિશ કરો
              </h3>
              \n${shareContent}\n
            </div>
          )}
          
          </div>

          {/* Next/Prev Navigation */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={\`flex-1 py-3.5 rounded-2xl font-gujarati font-black text-sm flex items-center justify-center gap-2 transition-all \${currentStep === 1 ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 opacity-50 cursor-not-allowed' : 'bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 active:scale-95 cursor-pointer'}\`}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              પાછળ જાઓ
            </button>
            <button 
              onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
              disabled={currentStep === 4}
              className={\`flex-1 py-3.5 rounded-2xl font-gujarati font-black text-sm flex items-center justify-center gap-2 transition-all \${currentStep === 4 ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 opacity-50 cursor-not-allowed' : 'bg-primary hover:bg-[#0D9488] text-white active:scale-95 cursor-pointer shadow-md hover:shadow-lg'}\`}
            >
              આગળ વધો
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

        </div>`;

  const replaceStartStr = '{/* Left Side Config Form (Accordions) */}';
  const replaceEndStr = '{/* Right Side Live Preview Mockup */}';

  const replaceStart = content.indexOf(replaceStartStr);
  const replaceEnd = content.indexOf(replaceEndStr);

  if (replaceStart === -1 || replaceEnd === -1) {
      console.error("Could not find replacement boundaries.");
      process.exit(1);
  }

  const newContent = content.substring(0, replaceStart) + newFormArea + "\n\n        " + content.substring(replaceEnd);
  fs.writeFileSync('src/components/DigitalCard.jsx', newContent);
  console.log("Successfully rewrote DigitalCard.jsx");
} catch(e) {
  console.error("Error:", e);
}
