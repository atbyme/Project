import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';

export async function generateProfessionalPDF(
  element: HTMLDivElement, 
  filename: string,
  options: { backgroundColor?: string } = {}
) {
  try {
    // 1. Professional Styling Injection
    element.classList.add('bg-white', 'text-black', 'p-10');
    element.classList.remove('prose-invert', 'glass-card', 'bg-background');

    // 2. High-DPI Capture with stabilization delay
    // We wait 350ms for more robust CSS rendering on mobile browsers
    await new Promise(resolve => setTimeout(resolve, 350));

    // 3. Modern JPEG Capture (Massive size reduction from PNG)
    const dataUrl = await toJpeg(element, {
      pixelRatio: 1.0, // Standard resolution for ultra-low file size (~500KB)
      quality: 0.6,   // Optimized compression ratio
      backgroundColor: options.backgroundColor || '#ffffff',
      cacheBust: true,

      style: {
        visibility: 'visible',
      }
    });

    // 4. Cleanup Styles Immediately
    element.classList.remove('bg-white', 'text-black', 'p-10');
    element.classList.add('prose-invert', 'glass-card');

    // 5. Multi-Page Slicing Logic (Smart A4 Layout)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Create a temporary image to calculate dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise(resolve => img.onload = resolve);
    
    const imgWidth = img.width;
    const imgHeight = img.height;
    const ratio = pdfWidth / imgWidth;
    const canvasPageHeight = pdfHeight / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    while (heightLeft > 0) {
      if (pageCount > 0) pdf.addPage();
      
      pdf.addImage(
        dataUrl, 
        'JPEG', // Correcting image format to match capture
        0, 
        -position * ratio, 
        pdfWidth, 
        imgHeight * ratio,
        undefined,
        'FAST' // Performance optimization
      );
      
      heightLeft -= canvasPageHeight;
      position += canvasPageHeight;
      pageCount++;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;

  } catch (error: any) {
    console.error('Professional PDF Engine Failure:', error);
    throw new Error(`PDF generation failed: ${error.message || 'Unknown render error'}. Please refresh and try again.`);
  }
}



