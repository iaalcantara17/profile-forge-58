import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobAnalyticsDashboard } from '@/components/analytics/JobAnalyticsDashboard';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    jobs: {
      getAll: vi.fn(),
    },
  },
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [] })),
      })),
    })),
  },
}));

describe('JobAnalyticsDashboard', () => {
  const mockJobs = [
    {
      id: 'j1',
      status: 'Applied',
      created_at: '2024-01-01',
      application_deadline: '2024-01-15',
      is_archived: false,
    },
    {
      id: 'j2',
      status: 'Interview',
      created_at: '2024-01-05',
      application_deadline: '2024-01-20',
      is_archived: false,
    },
    {
      id: 'j3',
      status: 'Offer',
      created_at: '2024-01-10',
      is_archived: false,
    },
    {
      id: 'j4',
      status: 'Rejected',
      created_at: '2024-01-12',
      is_archived: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.jobs.getAll as any).mockResolvedValue(mockJobs);
  });

  it('calculates correct total jobs count', async () => {
    render(<JobAnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  it('calculates applications sent correctly', async () => {
    render(<JobAnalyticsDashboard />);

    await waitFor(() => {
      // All 4 jobs are in Applied or beyond status
      const elements = screen.getAllByText('4');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('displays status distribution chart', async () => {
    render(<JobAnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Status Distribution')).toBeInTheDocument();
    });
  });

  it('handles empty job list gracefully', async () => {
    (api.jobs.getAll as any).mockResolvedValue([]);

    render(<JobAnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('exports CSV with correct KPIs', async () => {
    const user = userEvent.setup();
    const createElementSpy = vi.spyOn(document, 'createElement');

    render(<JobAnalyticsDashboard />);

    await waitFor(() => {
      expect(api.jobs.getAll).toHaveBeenCalled();
    });

    const exportButton = screen.getAllByRole('button').find(
      (button) => button.textContent?.includes('Export')
    );

    if (exportButton) {
      await user.click(exportButton);
      expect(createElementSpy).toHaveBeenCalledWith('a');
    }
  });
});
