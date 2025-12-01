/**
 * Sprint 3 Demo Runner - Simplified working version
 */

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DemoSprint3 = () => {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Not authenticated');
        return;
      }

      // Seed basic demo data
      await supabase.from('jobs').insert({
        user_id: user.id,
        job_title: 'Senior Frontend Engineer',
        company_name: 'TechCorp',
        status: 'Interview',
        location: 'San Francisco, CA',
      });

      toast.success('Demo data seeded successfully');
    } catch (error) {
      toast.error('Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Sprint 3 Demo Runner</h1>
            <p className="text-muted-foreground">Guided demo interface for Sprint 3 features</p>
          </div>

          <Card className="p-6">
            <Button onClick={handleSeedData} disabled={isSeeding}>
              {isSeeding ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              Load Demo Data
            </Button>
          </Card>

          <div className="grid gap-4">
            <DemoAction title="Interview Prep" route="/interview-prep" />
            <DemoAction title="Question Bank" route="/question-bank" />
            <DemoAction title="Network Contacts" route="/contacts" />
            <DemoAction title="Analytics" route="/analytics" />
            <DemoAction title="Teams" route="/teams" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoAction = ({ title, route }: { title: string; route: string }) => {
  const navigate = useNavigate();
  return (
    <Card className="p-4 flex items-center justify-between">
      <h4 className="font-medium">{title}</h4>
      <Button size="sm" onClick={() => navigate(route)}>
        Go <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </Card>
  );
};

export default DemoSprint3;
