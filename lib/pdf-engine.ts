import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateProfessionalPDF(
  element: HTMLDivElement, 
  filename: string,
  options: { backgroundColor?: string } = {}
) {
  try {
    // 1. Professional Styling Injection
    // Force legible black text on white background for the PDF document
    element.classList.add('bg-white', 'text-black', 'p-10');
    element.classList.remove('prose-invert', 'glass-card', 'bg-background');

    // 2. High-DPI Capture
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      logging: false,
      backgroundColor: options.backgroundColor || '#ffffff',
      windowWidth: 1200, // Standardize width for professional report layout
    });

    // 3. Cleanup Styles Immediately (don't break the UI)
    element.classList.remove('bg-white', 'text-black', 'p-10');
    element.classList.add('prose-invert', 'glass-card');

    // 4. Multi-Page Slicing Logic (Smart A4 Layout)
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / imgWidth;
    const canvasPageHeight = pdfHeight / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    while (heightLeft > 0) {
      if (pageCount > 0) pdf.addPage();
      
      pdf.addImage(
        imgData, 
        'PNG', 
        0, 
        -position * ratio, 
        pdfWidth, 
        imgHeight * ratio
      );
      
      heightLeft -= canvasPageHeight;
      position += canvasPageHeight;
      pageCount++;
    }

    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;

  } catch (error: any) {
    console.error('Professional PDF Engine Failure:', error);
    // Explicit digital-only error handling
    throw new Error(`PDF generation failed: ${error.message || 'Unknown render error'}. Please try a modern browser like Chrome or Safari.`);
  }
}

