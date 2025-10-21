import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">ATS Platform</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Welcome, {user?.name}!</h2>
            <p className="text-muted-foreground mt-2">
              Your professional profile dashboard
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Complete your professional profile
              </p>
              <Button className="mt-4" variant="outline">
                Edit Profile
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Employment</h3>
              <p className="text-sm text-muted-foreground">
                Add your work experience
              </p>
              <Button className="mt-4" variant="outline">
                Add Employment
              </Button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Skills</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your capabilities
              </p>
              <Button className="mt-4" variant="outline">
                Manage Skills
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
