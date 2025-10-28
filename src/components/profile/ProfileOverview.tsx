import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertCircle, Plus, TrendingUp, Award, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProfileSection {
  id: string;
  name: string;
  isComplete: boolean;
  completionPercentage: number;
  requiredFields: string[];
  completedFields: string[];
}

export const ProfileOverview = () => {
  const { user } = useAuth();
  const [, setSearchParams] = useSearchParams();

  const navigateToSection = (section: string) => {
    setSearchParams({ section });
  };

  const calculateSectionCompletion = (): ProfileSection[] => {
    const basicFields = ['Name', 'Phone', 'Location', 'Headline', 'Bio', 'Industry', 'Experience Level'];
    const basicCompleted = [
      user?.name,
      user?.basicInfo?.phoneNumber,
      user?.basicInfo?.location,
      user?.basicInfo?.professionalHeadline,
      user?.basicInfo?.bio,
      user?.basicInfo?.industry,
      user?.basicInfo?.experienceLevel,
    ].filter(Boolean);

    const hasEmployment = user?.employmentHistory && user.employmentHistory.length > 0;
    const hasSkills = user?.skills && user.skills.length > 0;
    const hasEducation = user?.education && user.education.length > 0;
    const hasCertifications = user?.certifications && user.certifications.length > 0;
    const hasProjects = user?.projects && user.projects.length > 0;

    return [
      {
        id: 'basic',
        name: 'Basic Information',
        isComplete: basicCompleted.length === basicFields.length,
        completionPercentage: Math.round((basicCompleted.length / basicFields.length) * 100),
        requiredFields: basicFields,
        completedFields: basicCompleted.map((_, i) => basicFields[i]).filter((_, i) => basicCompleted[i]),
      },
      {
        id: 'employment',
        name: 'Employment History',
        isComplete: hasEmployment,
        completionPercentage: hasEmployment ? 100 : 0,
        requiredFields: ['At least one employment entry'],
        completedFields: hasEmployment ? ['Employment entries added'] : [],
      },
      {
        id: 'skills',
        name: 'Skills',
        isComplete: hasSkills,
        completionPercentage: hasSkills ? 100 : 0,
        requiredFields: ['At least one skill'],
        completedFields: hasSkills ? ['Skills added'] : [],
      },
      {
        id: 'education',
        name: 'Education',
        isComplete: hasEducation,
        completionPercentage: hasEducation ? 100 : 0,
        requiredFields: ['At least one education entry'],
        completedFields: hasEducation ? ['Education entries added'] : [],
      },
      {
        id: 'certifications',
        name: 'Certifications',
        isComplete: hasCertifications,
        completionPercentage: hasCertifications ? 100 : 0,
        requiredFields: ['At least one certification (optional)'],
        completedFields: hasCertifications ? ['Certifications added'] : [],
      },
      {
        id: 'projects',
        name: 'Special Projects',
        isComplete: hasProjects,
        completionPercentage: hasProjects ? 100 : 0,
        requiredFields: ['At least one project (optional)'],
        completedFields: hasProjects ? ['Projects added'] : [],
      },
    ];
  };

  const exportProfile = () => {
    const summary = `
PROFESSIONAL PROFILE SUMMARY
============================

Name: ${user?.name}
Email: ${user?.email}
Phone: ${user?.basicInfo?.phoneNumber || 'N/A'}
Location: ${user?.basicInfo?.location || 'N/A'}
Headline: ${user?.basicInfo?.professionalHeadline || 'N/A'}

SKILLS: ${user?.skills?.length || 0} total
EMPLOYMENT: ${user?.employmentHistory?.length || 0} positions
EDUCATION: ${user?.education?.length || 0} degrees
CERTIFICATIONS: ${user?.certifications?.length || 0} certifications
PROJECTS: ${user?.projects?.length || 0} projects

Generated on ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-summary.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sections = calculateSectionCompletion();
  const overallCompletion = Math.round(
    sections.reduce((acc, section) => acc + section.completionPercentage, 0) / sections.length
  );

  const completedSections = sections.filter(s => s.isComplete).length;
  const totalSections = sections.length;

  // Skills distribution data for chart
  const skillsData = [
    { name: 'Technical', value: user?.skills?.filter(s => s.category === 'Technical').length || 0 },
    { name: 'Soft Skills', value: user?.skills?.filter(s => s.category === 'Soft Skills').length || 0 },
    { name: 'Languages', value: user?.skills?.filter(s => s.category === 'Languages').length || 0 },
    { name: 'Industry', value: user?.skills?.filter(s => s.category === 'Industry-Specific').length || 0 },
  ].filter(item => item.value > 0);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Profile Strength Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Profile Strength
            </CardTitle>
            <Badge variant={overallCompletion === 100 ? 'default' : 'secondary'} className="text-lg px-4 py-1">
              {overallCompletion}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Progress</span>
              <span>{completedSections} of {totalSections} sections complete</span>
            </div>
            <Progress value={overallCompletion} className="h-3" />
          </div>

          <div className="flex gap-2">
            <Button onClick={exportProfile} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Summary
            </Button>
          </div>

          {overallCompletion === 100 && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <Award className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  🎉 Outstanding! Your profile is 100% complete.
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  You are now maximizing your visibility to employers and recruiters.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Completion Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigateToSection(section.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {section.isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : section.completionPercentage > 0 ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.name}</span>
                    <span className="text-sm text-muted-foreground">{section.completionPercentage}%</span>
                  </div>
                  
                  {section.completionPercentage > 0 && section.completionPercentage < 100 && (
                    <Progress value={section.completionPercentage} className="h-1.5" />
                  )}

                  {!section.isComplete && (
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Complete Section
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Distribution Chart */}
      {skillsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      {overallCompletion < 100 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Pro Tips:</strong> Complete all profile sections to stand out. Profiles with 100% completion receive 3x more views from employers!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
