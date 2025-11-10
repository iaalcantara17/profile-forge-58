import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResumeBuilder } from '@/components/resumes/ResumeBuilder';

// Mock hooks and APIs
vi.mock('@/lib/api', () => ({
  api: {
    resumes: {
      getAll: vi.fn().mockResolvedValue([]),
      getById: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: '1' }),
      update: vi.fn().mockResolvedValue({ id: '1' }),
    },
  },
}));

describe('ResumeBuilder', () => {
  it('renders resume builder interface', () => {
    render(<ResumeBuilder />);
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });

  it('allows creating new resume', async () => {
    render(<ResumeBuilder />);
    const createButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(createButton);
    // Add assertions for creation flow
  });
});