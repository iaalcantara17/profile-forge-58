import { Navigation } from '@/components/Navigation';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUserInterviewsWithJobs } from '@/lib/api/interviews';
import { Interview } from '@/types/interviews';
import { InterviewReminders } from '@/components/interviews/InterviewReminders';

const InterviewPrep = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      if (!user) return;
      
      try {
        const data = await getUserInterviewsWithJobs(user.id);
        setInterviews(data as Interview[]);
      } catch (error) {
        console.error('Error loading interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold">Interview Prep</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            AI-powered interview preparation tools, practice questions, and company-specific insights will help you ace your interviews.
          </p>

          {/* Reminder Banners */}
          {!loading && <InterviewReminders interviews={interviews} />}

          <div className="mt-8 rounded-lg border border-border bg-muted/50 p-8 text-center">
            <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This feature is under development and will be available in Sprint 3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
