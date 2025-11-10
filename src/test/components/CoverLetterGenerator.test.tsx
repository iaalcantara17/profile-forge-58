import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoverLetterGenerator } from '@/components/cover-letters/CoverLetterGenerator';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { content: 'Generated cover letter' } }),
    },
  },
}));

describe('CoverLetterGenerator', () => {
  const mockProps = {
    jobId: 'job-1',
    jobTitle: 'Software Engineer',
    companyName: 'Tech Corp',
    jobDescription: 'Build amazing software',
  };

  it('renders cover letter generator', () => {
    render(<CoverLetterGenerator {...mockProps} />);
    expect(screen.getByText(/cover letter/i)).toBeInTheDocument();
  });

  it('generates cover letter when button clicked', async () => {
    render(<CoverLetterGenerator {...mockProps} />);
    const generateButton = screen.getByRole('button', { name: /generate/i });
    
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/generated cover letter/i)).toBeInTheDocument();
    });
  });

  it('allows tone selection', () => {
    render(<CoverLetterGenerator {...mockProps} />);
    const toneSelect = screen.getByLabelText(/tone/i);
    expect(toneSelect).toBeInTheDocument();
  });
});