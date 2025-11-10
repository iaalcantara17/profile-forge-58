import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportService } from '@/lib/exportService';

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    splitTextToSize: vi.fn((text) => [text]),
    text: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn()
  }))
}));

describe('exportService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportResumeAsText', () => {
    it('should format resume data as text', () => {
      const resumeData = {
        personal_info: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890'
        },
        sections: [
          { title: 'Experience', content: 'Software Engineer at Tech Corp', isVisible: true }
        ]
      };

      const result = exportService.exportResumeAsText(resumeData);

      expect(result).toContain('JOHN DOE');
      expect(result).toContain('john@example.com');
      expect(result).toContain('EXPERIENCE');
      expect(result).toContain('Software Engineer at Tech Corp');
    });

    it('should handle missing sections', () => {
      const resumeData = {
        personal_info: { name: 'John Doe' },
        sections: []
      };

      const result = exportService.exportResumeAsText(resumeData);
      expect(result).toContain('JOHN DOE');
    });
  });

  describe('exportStatisticsToCSV', () => {
    it('should format statistics as CSV', () => {
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

      const stats = {
        total: 10,
        byStatus: {
          interested: 2,
          applied: 5,
          phoneScreen: 1,
          interview: 1,
          offer: 0,
          rejected: 1
        }
      };

      exportService.exportStatisticsToCSV(stats, 'test.csv');

      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.download).toBe('test.csv');
    });
  });
});
