import { Navigation } from '@/components/Navigation';
import { Users } from 'lucide-react';

const Network = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold">Network</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your professional contacts, track referrals, and leverage your network to unlock new opportunities.
          </p>
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

export default Network;
