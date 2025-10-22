import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, GraduationCap, Calendar, Award } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
  gpa: string;
  showGpa: boolean;
  isCurrentlyEnrolled: boolean;
  educationLevel: string;
  achievements: string;
}

const educationLevels = [
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD/Doctorate',
  'Professional Certification',
  'Bootcamp',
  'Other'
];

const STORAGE_KEY = 'profile_education';

export const EducationManagement = () => {
  const [entries, setEntries] = useState<EducationEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<EducationEntry, 'id'>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    graduationDate: '',
    gpa: '',
    showGpa: true,
    isCurrentlyEnrolled: false,
    educationLevel: "Bachelor's Degree",
    achievements: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institution.trim()) newErrors.institution = 'Institution name is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
    if (!formData.isCurrentlyEnrolled && !formData.graduationDate) {
      newErrors.graduationDate = 'Graduation date is required for completed education';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingId) {
      setEntries(entries.map(entry => 
        entry.id === editingId ? { ...formData, id: editingId } : entry
      ));
      toast({
        title: 'Education updated',
        description: 'Your education entry has been updated successfully.',
      });
      setEditingId(null);
    } else {
      const newEntry: EducationEntry = {
        ...formData,
        id: Date.now().toString(),
      };
      setEntries([...entries, newEntry]);
      toast({
        title: 'Education added',
        description: 'Your education entry has been added successfully.',
      });
    }

    resetForm();
  };

  const handleEdit = (entry: EducationEntry) => {
    setFormData({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      graduationDate: entry.graduationDate,
      gpa: entry.gpa,
      showGpa: entry.showGpa,
      isCurrentlyEnrolled: entry.isCurrentlyEnrolled,
      educationLevel: entry.educationLevel,
      achievements: entry.achievements,
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setEntries(entries.filter(entry => entry.id !== deleteId));
      toast({
        title: 'Education deleted',
        description: 'The entry has been removed from your profile.',
      });
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      graduationDate: '',
      gpa: '',
      showGpa: true,
      isCurrentlyEnrolled: false,
      educationLevel: "Bachelor's Degree",
      achievements: '',
    });
    setErrors({});
    setIsAdding(false);
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (a.isCurrentlyEnrolled && !b.isCurrentlyEnrolled) return -1;
    if (!a.isCurrentlyEnrolled && b.isCurrentlyEnrolled) return 1;
    return new Date(b.graduationDate).getTime() - new Date(a.graduationDate).getTime();
  });

  return (
    <div className="space-y-6">
      {isAdding ? (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="institution">Institution Name *</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., Stanford University"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className={errors.institution ? 'border-destructive' : ''}
                  />
                  {errors.institution && <p className="text-sm text-destructive">{errors.institution}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Education Level *</Label>
                  <select
                    id="educationLevel"
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree *</Label>
                  <Input
                    id="degree"
                    placeholder="e.g., Bachelor of Science"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className={errors.degree ? 'border-destructive' : ''}
                  />
                  {errors.degree && <p className="text-sm text-destructive">{errors.degree}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study *</Label>
                  <Input
                    id="fieldOfStudy"
                    placeholder="e.g., Computer Science"
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    className={errors.fieldOfStudy ? 'border-destructive' : ''}
                  />
                  {errors.fieldOfStudy && <p className="text-sm text-destructive">{errors.fieldOfStudy}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationDate">Graduation Date</Label>
                  <Input
                    id="graduationDate"
                    type="month"
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    disabled={formData.isCurrentlyEnrolled}
                    className={errors.graduationDate ? 'border-destructive' : ''}
                  />
                  {errors.graduationDate && <p className="text-sm text-destructive">{errors.graduationDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA (Optional)</Label>
                  <Input
                    id="gpa"
                    placeholder="e.g., 3.8"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCurrentlyEnrolled"
                    checked={formData.isCurrentlyEnrolled}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isCurrentlyEnrolled: checked as boolean, graduationDate: checked ? '' : formData.graduationDate })
                    }
                  />
                  <Label htmlFor="isCurrentlyEnrolled" className="cursor-pointer">
                    Currently enrolled
                  </Label>
                </div>

                {formData.gpa && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showGpa"
                      checked={formData.showGpa}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, showGpa: checked as boolean })
                      }
                    />
                    <Label htmlFor="showGpa" className="cursor-pointer">
                      Show GPA on profile
                    </Label>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements / Honors (Optional)</Label>
                <Textarea
                  id="achievements"
                  placeholder="Honors, awards, relevant coursework, or achievements..."
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Entry' : 'Add Entry'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      )}

      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <Card key={entry.id} className="hover-scale">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{entry.degree}</h3>
                        <p className="text-muted-foreground font-medium">{entry.institution}</p>
                        <p className="text-sm text-muted-foreground">{entry.fieldOfStudy}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {entry.isCurrentlyEnrolled ? 'Expected ' : ''}{formatDate(entry.graduationDate) || 'In Progress'}
                            {entry.isCurrentlyEnrolled && (
                              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </span>
                          {entry.gpa && entry.showGpa && (
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              GPA: {entry.gpa}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {entry.achievements && (
                      <div className="pl-12">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Achievements & Honors</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entry.achievements}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isAdding && (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No education history added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your educational background to showcase your qualifications
              </p>
            </CardContent>
          </Card>
        )
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this education entry. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
