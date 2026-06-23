import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Downloads a data URI (e.g. base64 image or vcf) across web and native capacitor apps.
 * @param {string} dataUri - The full data URI (e.g., 'data:image/png;base64,iVBOR...')
 * @param {string} filename - The name of the file to save (e.g., 'card.png')
 */
export const downloadFile = async (dataUri, filename) => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Split the dataURI to get the base64 string
      const base64Data = dataUri.split(',')[1];
      
      if (!base64Data) {
        throw new Error("Invalid Data URI");
      }

      // Write the file to the documents directory
      const savedFile = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true
      });
      
      // Share or open the saved file so the user can save to gallery or forward
      await Share.share({
        title: 'Download complete',
        text: 'File saved successfully.',
        url: savedFile.uri,
        dialogTitle: 'Save or Share File',
      });

      return true;
    } catch (error) {
      console.error('Error saving file natively:', error);
      throw error;
    }
  } else {
    try {
      const res = await fetch(dataUri);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = blobUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e) {
      // Fallback if fetch fails
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUri;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

/**
 * Captures a DOM element and downloads it as a PDF file.
 * @param {HTMLElement} element - The DOM element to capture.
 * @param {string} filename - The name of the PDF file (should end in .pdf).
 */
export const downloadAsPDF = async (element, filename) => {
  try {
    const filterFn = (node) => {
      // Exclude elements that have the "print:hidden" class
      if (node.classList && node.classList.contains('print:hidden')) {
        return false;
      }
      return true;
    };

    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      style: { background: 'white' },
      filter: filterFn
    });
    
    // Create an image object to get the dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => (img.onload = resolve));
    
    // A4 dimensions in mm (210 x 297)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidthInMm = pdfWidth;
    const imgHeightInMm = (img.height * pdfWidth) / img.width;
    
    let heightLeft = imgHeightInMm;
    let position = 0;
    
    // First page
    pdf.addImage(dataUrl, 'PNG', 0, position, imgWidthInMm, imgHeightInMm);
    heightLeft -= pdfPageHeight;
    
    // Additional pages if content is taller than one A4 page
    while (heightLeft > 0) {
      position = heightLeft - imgHeightInMm;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidthInMm, imgHeightInMm);
      heightLeft -= pdfPageHeight;
    }
    
    const pdfDataUri = pdf.output('datauristring');
    
    await downloadFile(pdfDataUri, filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
