import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { InfoCard } from '@/components/ui/info-card';
import { User, Briefcase, GraduationCap, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-lg">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard icon={User} title="Profile" description="Manage your personal information and settings" />
            <InfoCard icon={Briefcase} title="Employment" description="Track your work experience and career history" />
            <InfoCard icon={GraduationCap} title="Education" description="Document your academic achievements" />
            <InfoCard icon={FolderOpen} title="Projects" description="Showcase your special projects and work" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
