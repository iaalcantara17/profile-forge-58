import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/lib/api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('jobs', () => {
    it('fetches all jobs', async () => {
      const mockJobs = [
        { id: '1', jobTitle: 'Engineer', company: { name: 'Tech Corp' } },
        { id: '2', jobTitle: 'Designer', company: { name: 'Design Co' } }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockJobs
      });

      const jobs = await api.jobs.getAll();
      expect(jobs).toEqual(mockJobs);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/jobs'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('creates a new job', async () => {
      const newJob = {
        jobTitle: 'New Role',
        company: { name: 'New Company' },
        status: 'Interested' as const
      };

      const createdJob = { id: '3', ...newJob };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => createdJob
      });

      const result = await api.jobs.create(newJob);
      expect(result).toEqual(createdJob);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/jobs'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newJob)
        })
      );
    });

    it('handles errors when fetching jobs', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(api.jobs.getAll()).rejects.toThrow();
    });
  });

  describe('resumes', () => {
    it('fetches all resumes', async () => {
      const mockResumes = [
        { id: '1', title: 'Software Engineer Resume' },
        { id: '2', title: 'Senior Developer Resume' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResumes
      });

      const resumes = await api.resumes.getAll();
      expect(resumes).toEqual(mockResumes);
    });

    it('generates resume content', async () => {
      const resumeId = 'resume-1';
      const jobId = 'job-1';
      const sections = ['experience', 'skills'];

      const mockContent = {
        experience: 'Tailored experience content',
        skills: 'Optimized skills list'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockContent
      });

      const result = await api.resumes.generateContent(resumeId, jobId, sections);
      expect(result).toEqual(mockContent);
    });
  });

  describe('cover letters', () => {
    it('fetches all cover letters', async () => {
      const mockLetters = [
        { id: '1', title: 'Tech Corp Application' },
        { id: '2', title: 'Startup Role' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLetters
      });

      const letters = await api.coverLetters.getAll();
      expect(letters).toEqual(mockLetters);
    });
  });

  describe('jobImport', () => {
    it('imports job from URL', async () => {
      const url = 'https://example.com/job';
      const mockJobData = {
        jobTitle: 'Imported Job',
        company: { name: 'Imported Company' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockJobData })
      });

      const result = await api.jobImport.fromUrl(url);
      expect(result).toEqual({ success: true, data: mockJobData });
    });

    it('handles import failures gracefully', async () => {
      const url = 'https://invalid.com/job';

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false, error: 'Failed to parse URL' })
      });

      const result = await api.jobImport.fromUrl(url);
      expect(result.success).toBe(false);
    });
  });
});
