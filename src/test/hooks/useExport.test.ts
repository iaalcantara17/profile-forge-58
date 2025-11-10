import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useExport } from '@/hooks/useExport';

// Mock the exportService
vi.mock('@/lib/exportService', () => ({
  exportService: {
    exportResumeToPDF: vi.fn(),
    exportResumeToText: vi.fn(),
    exportCoverLetterToPDF: vi.fn(),
    exportCoverLetterToText: vi.fn(),
    exportStatisticsToCSV: vi.fn(),
  }
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useExport', () => {
  it('provides export functions', () => {
    const { result } = renderHook(() => useExport());

    expect(result.current.exportResumeToPDF).toBeDefined();
    expect(result.current.exportResumeToText).toBeDefined();
    expect(result.current.exportCoverLetterToPDF).toBeDefined();
    expect(result.current.exportCoverLetterToText).toBeDefined();
    expect(result.current.exportStatisticsToCSV).toBeDefined();
  });

  it('calls export functions with correct parameters', async () => {
    const { result } = renderHook(() => useExport());
    const { exportService } = await import('@/lib/exportService');

    const mockResumeData = { title: 'Test Resume', sections: [] };
    await result.current.exportResumeToPDF(mockResumeData, 'test-resume.pdf');

    expect(exportService.exportResumeToPDF).toHaveBeenCalledWith(
      mockResumeData,
      'test-resume.pdf'
    );
  });
});
