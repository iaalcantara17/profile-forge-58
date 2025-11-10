import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAutoArchive } from '@/hooks/useAutoArchive';

describe('useAutoArchive', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('archives jobs with Rejected status after 30 days', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);

    const jobs = [
      {
        id: '1',
        status: 'Rejected',
        updatedAt: oldDate.toISOString(),
        isArchived: false,
      },
    ];

    localStorage.setItem('jobs', JSON.stringify(jobs));
    const mockCallback = vi.fn();

    renderHook(() => useAutoArchive(mockCallback));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('archives jobs with Offer status after 90 days', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 91);

    const jobs = [
      {
        id: '2',
        status: 'Offer',
        updatedAt: oldDate.toISOString(),
        isArchived: false,
      },
    ];

    localStorage.setItem('jobs', JSON.stringify(jobs));
    const mockCallback = vi.fn();

    renderHook(() => useAutoArchive(mockCallback));

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it('does not archive recent jobs', () => {
    const recentDate = new Date();
    
    const jobs = [
      {
        id: '3',
        status: 'Rejected',
        updatedAt: recentDate.toISOString(),
        isArchived: false,
      },
    ];

    localStorage.setItem('jobs', JSON.stringify(jobs));
    const mockCallback = vi.fn();

    renderHook(() => useAutoArchive(mockCallback));

    expect(mockCallback).not.toHaveBeenCalled();
  });
});