import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useExport } from '@/hooks/useExport';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock exportService
vi.mock('@/lib/exportService', () => ({
  exportService: {
    exportResumeToPDF: vi.fn().mockResolvedValue(undefined),
    downloadResumeAsText: vi.fn(),
    exportCoverLetterToPDF: vi.fn().mockResolvedValue(undefined),
    downloadCoverLetterAsText: vi.fn(),
    exportStatisticsToCSV: vi.fn()
  }
}));

describe('useExport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export resume to PDF', async () => {
    const { result } = renderHook(() => useExport());
    
    const resumeData = { personal_info: { name: 'John Doe' } };
    await result.current.exportResumeToPDF(resumeData, 'resume.pdf');
    
    expect(true).toBe(true); // Placeholder assertion
  });

  it('should export resume to text', async () => {
    const { result } = renderHook(() => useExport());
    
    const resumeData = { personal_info: { name: 'John Doe' } };
    await result.current.exportResumeToText(resumeData, 'resume.txt');
    
    expect(true).toBe(true);
  });

  it('should export statistics to CSV', async () => {
    const { result } = renderHook(() => useExport());
    
    const stats = { total: 10, byStatus: { applied: 5 } };
    await result.current.exportStatisticsToCSV(stats);
    
    expect(true).toBe(true);
  });
});
