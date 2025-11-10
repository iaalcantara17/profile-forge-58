import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, LayoutGrid, LayoutList, TrendingUp } from 'lucide-react';
import { JobForm } from '@/components/jobs/JobForm';
import { JobCard } from '@/components/jobs/JobCard';
import { Job } from '@/types/jobs';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Jobs = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'pipeline'>('grid');

  const statuses: Array<{ value: string; label: string; count: number }> = [
    { value: 'all', label: 'All Jobs', count: jobs.length },
    { value: 'Interested', label: 'Interested', count: jobs.filter(j => j.status === 'Interested').length },
    { value: 'Applied', label: 'Applied', count: jobs.filter(j => j.status === 'Applied').length },
    { value: 'Phone Screen', label: 'Phone Screen', count: jobs.filter(j => j.status === 'Phone Screen').length },
    { value: 'Interview', label: 'Interview', count: jobs.filter(j => j.status === 'Interview').length },
    { value: 'Offer', label: 'Offer', count: jobs.filter(j => j.status === 'Offer').length },
    { value: 'Rejected', label: 'Rejected', count: jobs.filter(j => j.status === 'Rejected').length },
  ];

  const fetchJobs = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await api.getJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    fetchJobs();
  };

  const handleDeleteJob = async (job: Job) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await api.deleteJob(job.job_id || job._id!);
      if (response.success) {
        toast.success('Job deleted successfully');
        fetchJobs();
      }
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleArchiveJob = async (job: Job) => {
    try {
      const response = await api.archiveJob(job.job_id || job._id!);
      if (response.success) {
        toast.success('Job archived successfully');
        fetchJobs();
      }
    } catch (error) {
      toast.error('Failed to archive job');
    }
  };

  const filteredJobs = selectedStatus === 'all'
    ? jobs.filter(j => !j.isArchived)
    : jobs.filter(j => j.status === selectedStatus && !j.isArchived);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold">Job Tracker</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Manage your job applications and track your progress
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'pipeline' : 'grid')}
              >
                {viewMode === 'grid' ? <TrendingUp className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {statuses.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedStatus === status.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl font-bold">{status.count}</div>
                <div className="text-sm text-muted-foreground">{status.label}</div>
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">
                {selectedStatus === 'all' ? 'No jobs yet' : `No jobs in ${selectedStatus} status`}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Job
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.job_id || job._id}
                  job={job}
                  onDelete={handleDeleteJob}
                  onArchive={handleArchiveJob}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Job Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Enter the details of the job you're interested in or paste a job posting URL to auto-fill
            </DialogDescription>
          </DialogHeader>
          <JobForm
            onSuccess={handleAddSuccess}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
