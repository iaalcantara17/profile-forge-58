import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Loader2, Save, User, Briefcase, GraduationCap, Award, FolderOpen } from 'lucide-react';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    industry: '',
    experienceLevel: '',
  });

  useEffect(() => {
    if (user) {
      setBasicInfo({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        location: '',
        headline: '',
        bio: '',
        industry: '',
        experienceLevel: '',
      });
    }
  }, [user]);

  const handleSaveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await api.updateProfile({
        name: basicInfo.name,
        profile: {
          phone: basicInfo.phone,
          location: basicInfo.location,
          headline: basicInfo.headline,
          bio: basicInfo.bio,
          industry: basicInfo.industry,
          experienceLevel: basicInfo.experienceLevel,
        }
      });

      if (response.success) {
        await refreshProfile();
        toast({
          title: 'Profile updated',
          description: 'Your basic information has been saved successfully.',
        });
      } else {
        toast({
          title: 'Update failed',
          description: response.error?.message || 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold">Your Profile</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your professional information
            </p>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Employment</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Certs</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your personal and professional details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveBasicInfo} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={basicInfo.name}
                          onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={basicInfo.email}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={basicInfo.phone}
                          onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={basicInfo.location}
                          onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        placeholder="e.g., Full Stack Developer | React & Node.js Specialist"
                        value={basicInfo.headline}
                        onChange={(e) => setBasicInfo({ ...basicInfo, headline: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Summary</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself and your professional background..."
                        value={basicInfo.bio}
                        onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                        rows={5}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {basicInfo.bio.length}/500 characters
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          placeholder="e.g., Technology, Healthcare"
                          value={basicInfo.industry}
                          onChange={(e) => setBasicInfo({ ...basicInfo, industry: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">Experience Level</Label>
                        <select
                          id="experienceLevel"
                          value={basicInfo.experienceLevel}
                          onChange={(e) => setBasicInfo({ ...basicInfo, experienceLevel: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="">Select level</option>
                          <option value="Entry">Entry Level</option>
                          <option value="Mid">Mid Level</option>
                          <option value="Senior">Senior</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Tab - Placeholder */}
            <TabsContent value="employment" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Employment History</CardTitle>
                  <CardDescription>Manage your work experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Employment history section coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab - Placeholder */}
            <TabsContent value="education" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Manage your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Education section coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab - Placeholder */}
            <TabsContent value="certifications" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Manage your professional certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Certifications section coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab - Placeholder */}
            <TabsContent value="projects" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Showcase your special projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Projects section coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
