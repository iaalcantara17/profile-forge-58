import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationMaterialsSection } from '@/components/jobs/ApplicationMaterialsSection';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  api: {
    resumes: {
      getAll: vi.fn(),
    },
    coverLetters: {
      getAll: vi.fn(),
    },
    materialsUsage: {
      create: vi.fn(),
    },
    auth: {
      getUser: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ApplicationMaterialsSection', () => {
  const mockResumes = [
    { id: 'r1', title: 'Software Engineer Resume' },
    { id: 'r2', title: 'Full Stack Developer Resume' },
  ];

  const mockCoverLetters = [
    { id: 'c1', title: 'Tech Company Cover Letter' },
    { id: 'c2', title: 'Startup Cover Letter' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (api.resumes.getAll as any).mockResolvedValue(mockResumes);
    (api.coverLetters.getAll as any).mockResolvedValue(mockCoverLetters);
    (api.auth.getUser as any).mockResolvedValue({ data: { user: { id: 'user1' } } });
    (api.materialsUsage.create as any).mockResolvedValue({ id: 'usage1' });
  });

  it('loads and displays resume and cover letter options', async () => {
    render(
      <ApplicationMaterialsSection
        jobId="job1"
        onUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(api.resumes.getAll).toHaveBeenCalled();
      expect(api.coverLetters.getAll).toHaveBeenCalled();
    });

    expect(screen.getByText('Application Materials')).toBeInTheDocument();
  });

  it('creates materials usage record when materials are updated', async () => {
    const onUpdate = vi.fn();
    const user = userEvent.setup();

    render(
      <ApplicationMaterialsSection
        jobId="job1"
        resumeId="r1"
        coverLetterId="c1"
        onUpdate={onUpdate}
      />
    );

    await waitFor(() => {
      expect(api.resumes.getAll).toHaveBeenCalled();
    });

    const updateButton = screen.getByRole('button', { name: /update materials/i });
    await user.click(updateButton);

    await waitFor(() => {
      expect(api.materialsUsage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          job_id: 'job1',
          resume_id: 'r1',
          cover_letter_id: 'c1',
        })
      );
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it('shows download buttons when materials are selected', async () => {
    render(
      <ApplicationMaterialsSection
        jobId="job1"
        resumeId="r1"
        coverLetterId="c1"
        onUpdate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/download resume/i)).toBeInTheDocument();
      expect(screen.getByText(/download cover letter/i)).toBeInTheDocument();
    });
  });
});
