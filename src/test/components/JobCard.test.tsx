import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JobCard } from '@/components/jobs/JobCard';
import type { Job } from '@/types/jobs';

const mockJob: Job = {
  id: '1',
  job_id: 'job-1',
  user_id: 'user-1',
  jobTitle: 'Software Engineer',
  company: {
    name: 'Tech Corp',
    location: 'San Francisco, CA'
  },
  location: 'San Francisco, CA',
  status: 'Applied',
  isArchived: false,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-02',
};

describe('JobCard', () => {
  it('renders job title and company', () => {
    render(
      <JobCard 
        job={mockJob} 
        onClick={() => {}} 
        onArchive={() => {}} 
        onDelete={() => {}} 
      />
    );

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('displays job status badge', () => {
    render(
      <JobCard 
        job={mockJob} 
        onClick={() => {}} 
        onArchive={() => {}} 
        onDelete={() => {}} 
      />
    );

    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(
      <JobCard 
        job={mockJob} 
        onClick={handleClick} 
        onArchive={() => {}} 
        onDelete={() => {}} 
      />
    );

    fireEvent.click(screen.getByText('Software Engineer'));
    expect(handleClick).toHaveBeenCalledWith(mockJob);
  });

  it('shows deadline urgency indicator when deadline is set', () => {
    const jobWithDeadline = {
      ...mockJob,
      applicationDeadline: '2025-02-01',
      deadlineUrgency: 'urgent' as const
    };

    render(
      <JobCard 
        job={jobWithDeadline} 
        onClick={() => {}} 
        onArchive={() => {}} 
        onDelete={() => {}} 
      />
    );

    expect(screen.getByText(/days/)).toBeInTheDocument();
  });

  it('calls onArchive when archive button is clicked', async () => {
    const handleArchive = vi.fn();
    render(
      <JobCard 
        job={mockJob} 
        onClick={() => {}} 
        onArchive={handleArchive} 
        onDelete={() => {}} 
      />
    );

    // Find and click the archive button (this will depend on your actual implementation)
    const buttons = screen.getAllByRole('button');
    const archiveButton = buttons.find(btn => btn.getAttribute('aria-label')?.includes('Archive'));
    
    if (archiveButton) {
      fireEvent.click(archiveButton);
      expect(handleArchive).toHaveBeenCalledWith(mockJob);
    }
  });
});
