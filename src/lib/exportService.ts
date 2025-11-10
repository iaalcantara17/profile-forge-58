import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportService = {
  // Export resume as PDF
  async exportResumeToPDF(resumeData: any, filename: string = 'resume.pdf'): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Helper to add text with word wrap
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) pdf.setFont('helvetica', 'bold');
      else pdf.setFont('helvetica', 'normal');
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 3;
    };

    // Header
    addText(resumeData.personal_info?.name || 'Resume', 18, true);
    if (resumeData.personal_info?.email) {
      addText(resumeData.personal_info.email, 10);
    }
    if (resumeData.personal_info?.phone) {
      addText(resumeData.personal_info.phone, 10);
    }
    yPosition += 5;

    // Sections
    resumeData.sections?.forEach((section: any) => {
      if (!section.isVisible) return;
      
      addText(section.title, 14, true);
      addText(section.content, 11);
      yPosition += 3;
    });

    pdf.save(filename);
  },

  // Export resume as plain text
  exportResumeAsText(resumeData: any): string {
    let text = '';
    
    // Header
    if (resumeData.personal_info?.name) {
      text += `${resumeData.personal_info.name.toUpperCase()}\n`;
      text += '='.repeat(resumeData.personal_info.name.length) + '\n\n';
    }
    
    if (resumeData.personal_info?.email) text += `Email: ${resumeData.personal_info.email}\n`;
    if (resumeData.personal_info?.phone) text += `Phone: ${resumeData.personal_info.phone}\n`;
    if (resumeData.personal_info?.location) text += `Location: ${resumeData.personal_info.location}\n`;
    text += '\n';
    
    // Sections
    resumeData.sections?.forEach((section: any) => {
      if (!section.isVisible) return;
      
      text += `${section.title.toUpperCase()}\n`;
      text += '-'.repeat(section.title.length) + '\n';
      text += `${section.content}\n\n`;
    });
    
    return text;
  },

  // Export cover letter as plain text
  exportCoverLetterAsText(coverLetter: any): string {
    let text = '';
    
    // Header
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    text += `${date}\n\n`;
    
    if (coverLetter.title) {
      text += `${coverLetter.title.toUpperCase()}\n`;
      text += '='.repeat(coverLetter.title.length) + '\n\n';
    }
    
    text += coverLetter.content || '';
    text += '\n\n';
    
    if (coverLetter.user_info?.name) text += `Sincerely,\n${coverLetter.user_info.name}\n`;
    
    return text;
  },

  // Export cover letter as PDF
  async exportCoverLetterToPDF(content: string, metadata: any, filename: string = 'cover-letter.pdf'): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    // Add date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.text(date, margin, yPosition);
    yPosition += 10;

    // Add content with word wrap
    const lines = pdf.splitTextToSize(content, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });

    pdf.save(filename);
  },

  // Download text file
  downloadTextFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export as plain text
  exportAsText(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export resume to text file
  downloadResumeAsText(resumeData: any, filename: string = 'resume.txt'): void {
    const text = this.exportResumeAsText(resumeData);
    this.exportAsText(text, filename);
  },

  // Export cover letter to text file  
  downloadCoverLetterAsText(coverLetter: any, filename: string = 'cover-letter.txt'): void {
    const text = this.exportCoverLetterAsText(coverLetter);
    this.exportAsText(text, filename);
  },

  // Export statistics to CSV
  exportStatisticsToCSV(stats: any, filename: string = 'job-statistics.csv'): void {
    const rows = [
      ['Metric', 'Value'],
      ['Total Jobs', stats.total || 0],
      ['Interested', stats.byStatus?.interested || 0],
      ['Applied', stats.byStatus?.applied || 0],
      ['Phone Screen', stats.byStatus?.phoneScreen || 0],
      ['Interview', stats.byStatus?.interview || 0],
      ['Offer', stats.byStatus?.offer || 0],
      ['Rejected', stats.byStatus?.rejected || 0],
    ];

    const csv = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
