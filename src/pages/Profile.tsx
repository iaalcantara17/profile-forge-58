import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Loader2, Save, User, Briefcase, GraduationCap, Award, FolderOpen, Camera, X } from 'lucide-react';
import { EmploymentHistory } from '@/components/profile/EmploymentHistory';
import { SkillsManagement } from '@/components/profile/SkillsManagement';
import { EducationManagement } from '@/components/profile/EducationManagement';
import { CertificationsManagement } from '@/components/profile/CertificationsManagement';
import { SpecialProjectsManagement } from '@/components/profile/SpecialProjectsManagement';
import { ProfileOverview } from '@/components/profile/ProfileOverview';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
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
      // TODO: Load profile picture from user.profile.profilePicture when backend is ready
      // setProfilePicture(user.profile?.profilePicture || null);
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, or GIF image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    setUploadProgress(0);
    
    // TODO: Implement actual upload when backend endpoint is ready
    // const formData = new FormData();
    // formData.append('profilePicture', selectedFile);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      toast({
        title: 'Upload Ready',
        description: 'Profile picture upload will be available once backend endpoint is configured.',
      });
      setSelectedFile(null);
      setUploadProgress(0);
    }, 1000);

    // Actual implementation:
    // try {
    //   const response = await fetch('http://34.207.119.121:5000/api/users/me/picture', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //     },
    //     body: formData,
    //   });
    //   
    //   if (response.ok) {
    //     await refreshProfile();
    //     toast({ title: 'Success', description: 'Profile picture updated' });
    //   }
    // } catch (error) {
    //   toast({ title: 'Error', description: 'Failed to upload', variant: 'destructive' });
    // }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
    setSelectedFile(null);
    
    // TODO: Call API to remove picture from backend
    toast({
      title: 'Picture removed',
      description: 'Profile picture has been removed',
    });
  };

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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Work</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Skills</span>
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

            {/* Overview Tab - NEW */}
            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <ProfileOverview />
            </TabsContent>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6 animate-fade-in">
              {/* Profile Picture Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Upload a professional photo (JPG, PNG, or GIF, max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profilePicture || undefined} alt={user?.name} />
                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {profilePicture && (
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                          onClick={handleRemovePicture}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <input
                            type="file"
                            id="profile-picture"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Label htmlFor="profile-picture">
                            <Button type="button" variant="outline" asChild>
                              <span className="cursor-pointer">
                                <Camera className="mr-2 h-4 w-4" />
                                {profilePicture ? 'Change Picture' : 'Upload Picture'}
                              </span>
                            </Button>
                          </Label>
                        </div>
                        
                        {selectedFile && (
                          <Button onClick={handleUploadPicture} disabled={uploadProgress > 0}>
                            {uploadProgress > 0 ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading... {uploadProgress}%
                              </>
                            ) : (
                              'Save Picture'
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Your profile picture helps employers recognize you. Choose a professional headshot for best results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information Form */}
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

              {/* Account Deletion Section */}
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        toast({
                          title: 'Feature Coming Soon',
                          description: 'Account deletion will be available once the backend endpoint is configured.',
                        });
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employment Tab */}
            <TabsContent value="employment" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Employment History</CardTitle>
                  <CardDescription>
                    Document your work experience in reverse chronological order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmploymentHistory />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>
                    Add and organize your skills by category and proficiency level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsManagement />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Document your academic achievements and qualifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EducationManagement />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>
                    Track your professional certifications and credentials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificationsManagement />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle>Special Projects</CardTitle>
                  <CardDescription>
                    Showcase your notable projects, side work, and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SpecialProjectsManagement />
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
