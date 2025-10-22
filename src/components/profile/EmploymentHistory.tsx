import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Briefcase, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EmploymentEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const STORAGE_KEY = 'profile_employment_history';

export const EmploymentHistory = () => {
  const [entries, setEntries] = useState<EmploymentEntry[]>(() => {
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
  
  const [formData, setFormData] = useState<Omit<EmploymentEntry, 'id'>>({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'End date is required for past positions';
    }
    if (formData.startDate && formData.endDate && !formData.isCurrent) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingId) {
      // Update existing entry
      setEntries(entries.map(entry => 
        entry.id === editingId ? { ...formData, id: editingId } : entry
      ));
      toast({
        title: 'Employment updated',
        description: 'Your work experience has been updated successfully.',
      });
      setEditingId(null);
    } else {
      // Add new entry
      const newEntry: EmploymentEntry = {
        ...formData,
        id: Date.now().toString(),
      };
      setEntries([...entries, newEntry]);
      toast({
        title: 'Employment added',
        description: 'Your work experience has been added successfully.',
      });
    }

    resetForm();
  };

  const handleEdit = (entry: EmploymentEntry) => {
    setFormData({
      jobTitle: entry.jobTitle,
      company: entry.company,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      description: entry.description,
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setEntries(entries.filter(entry => entry.id !== deleteId));
      toast({
        title: 'Employment deleted',
        description: 'The entry has been removed from your profile.',
      });
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
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

  // Sort entries by start date (most recent first)
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {isAdding ? (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Employment' : 'Add Employment History'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className={errors.jobTitle ? 'border-destructive' : ''}
                  />
                  {errors.jobTitle && <p className="text-sm text-destructive">{errors.jobTitle}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g., TechCorp Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={errors.company ? 'border-destructive' : ''}
                  />
                  {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={errors.startDate ? 'border-destructive' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.isCurrent}
                    className={errors.endDate ? 'border-destructive' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isCurrent"
                    checked={formData.isCurrent}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isCurrent: checked as boolean, endDate: checked ? '' : formData.endDate })
                    }
                  />
                  <Label htmlFor="isCurrent" className="cursor-pointer">
                    I currently work here
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your responsibilities, achievements, and key projects..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.description.length}/1000 characters
                </p>
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
          Add Employment History
        </Button>
      )}

      {/* Employment List */}
      {sortedEntries.length > 0 ? (
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <Card key={entry.id} className="hover-scale">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{entry.jobTitle}</h3>
                        <p className="text-muted-foreground font-medium">{entry.company}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.startDate)} - {entry.isCurrent ? 'Present' : formatDate(entry.endDate)}
                            {entry.isCurrent && (
                              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                Current
                              </span>
                            )}
                          </span>
                          {entry.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {entry.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                        {entry.description}
                      </p>
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
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No employment history added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your work experience to showcase your professional journey
              </p>
            </CardContent>
          </Card>
        )
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this employment entry. This action cannot be undone.
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
