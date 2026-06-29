const fs = require('fs');

try {
  let content = fs.readFileSync('src/components/DigitalCard.jsx', 'utf8');

  // 1. Remove the duplicate handleAddProduct & handleAddGallery starting at line 1718
  const duplicateStartStr = `  // Add items handler
  const handleAddProduct = () => {
    if (!tempProdName) return;`;
  
  // Find the exact second occurrence of this string, or just remove the specific block
  const firstIndex = content.indexOf(duplicateStartStr);
  const secondIndex = content.indexOf(duplicateStartStr, firstIndex + 1);

  if (secondIndex !== -1) {
    const endStr = `triggerLocalToast("📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!");\n  };`;
    const endIndex = content.indexOf(endStr, secondIndex) + endStr.length;
    if (endIndex > secondIndex) {
      content = content.substring(0, secondIndex) + content.substring(endIndex);
      console.log("Removed duplicate handler.");
    }
  }

  // 2. Add edit button to products UI
  const productUIDeleteBtn = `<button 
                      onClick={() => setProducts(products.filter(item => item.id !== p.id))} 
                      className="h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>`;
  
  const productUIEditAndDeleteBtn = `<div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => handleEditProduct(p)} 
                        className="h-8 w-8 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => setProducts(products.filter(item => item.id !== p.id))} 
                        className="h-8 w-8 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>`;

  content = content.replace(productUIDeleteBtn, productUIEditAndDeleteBtn);

  // 3. Add edit button to gallery UI
  const galleryUIDeleteBtn = `<button 
                      onClick={() => setGallery(gallery.filter(item => item.id !== g.id))} 
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>`;
                    
  const galleryUIEditAndDeleteBtn = `<button 
                      onClick={() => handleEditGallery(g)} 
                      className="absolute top-1.5 right-8 h-6 w-6 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[10px]">edit</span>
                    </button>
                    <button 
                      onClick={() => setGallery(gallery.filter(item => item.id !== g.id))} 
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[10px]">close</span>
                    </button>`;

  content = content.replace(galleryUIDeleteBtn, galleryUIEditAndDeleteBtn);

  // 4. Change 'ઉમેરો' button text based on edit mode
  // For Product
  const productAddBtn = `<span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો`;
  const productAddBtnUpdated = `{editProductId ? <><span className="material-symbols-outlined text-sm font-bold">save</span> અપડેટ</> : <><span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો</>}`;
  content = content.replace(productAddBtn, productAddBtnUpdated);

  // For Gallery
  const galleryAddBtn = `<span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો`;
  const galleryAddBtnUpdated = `{editGalleryId ? <><span className="material-symbols-outlined text-sm font-bold">save</span> અપડેટ</> : <><span className="material-symbols-outlined text-sm font-bold">add</span> ઉમેરો</>}`;
  content = content.replace(galleryAddBtn, galleryAddBtnUpdated);

  fs.writeFileSync('src/components/DigitalCard.jsx', content);
  console.log("Successfully fixed handlers and updated UI.");

} catch(e) {
  console.error("Error:", e);
}
