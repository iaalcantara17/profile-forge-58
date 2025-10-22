import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Folder, Calendar, Link as LinkIcon, Github, Code2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  projectUrl: string;
  repositoryUrl: string;
}

const STORAGE_KEY = 'profile_projects';

export const SpecialProjectsManagement = () => {
  const [entries, setEntries] = useState<ProjectEntry[]>(() => {
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
  
  const [formData, setFormData] = useState<Omit<ProjectEntry, 'id'>>({
    name: '',
    description: '',
    role: '',
    technologies: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
    projectUrl: '',
    repositoryUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    if (!formData.role.trim()) newErrors.role = 'Your role is required';
    if (!formData.technologies.trim()) newErrors.technologies = 'Technologies are required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isOngoing && !formData.endDate) {
      newErrors.endDate = 'End date is required for completed projects';
    }
    if (formData.startDate && formData.endDate && !formData.isOngoing) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    if (formData.projectUrl && !isValidUrl(formData.projectUrl)) {
      newErrors.projectUrl = 'Please enter a valid URL';
    }
    if (formData.repositoryUrl && !isValidUrl(formData.repositoryUrl)) {
      newErrors.repositoryUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingId) {
      setEntries(entries.map(entry => 
        entry.id === editingId ? { ...formData, id: editingId } : entry
      ));
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
      setEditingId(null);
    } else {
      const newEntry: ProjectEntry = {
        ...formData,
        id: Date.now().toString(),
      };
      setEntries([...entries, newEntry]);
      toast({
        title: 'Project added',
        description: 'Your project has been added successfully.',
      });
    }

    resetForm();
  };

  const handleEdit = (entry: ProjectEntry) => {
    setFormData({
      name: entry.name,
      description: entry.description,
      role: entry.role,
      technologies: entry.technologies,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isOngoing: entry.isOngoing,
      projectUrl: entry.projectUrl,
      repositoryUrl: entry.repositoryUrl,
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setEntries(entries.filter(entry => entry.id !== deleteId));
      toast({
        title: 'Project deleted',
        description: 'The project has been removed from your profile.',
      });
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      role: '',
      technologies: '',
      startDate: '',
      endDate: '',
      isOngoing: false,
      projectUrl: '',
      repositoryUrl: '',
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
    if (a.isOngoing && !b.isOngoing) return -1;
    if (!a.isOngoing && b.isOngoing) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      {isAdding ? (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., E-commerce Platform"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the project, its goals, and outcomes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/500 characters
                  </p>
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Lead Developer, Project Manager"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={errors.role ? 'border-destructive' : ''}
                  />
                  {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies Used *</Label>
                  <Input
                    id="technologies"
                    placeholder="e.g., React, Node.js, PostgreSQL"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className={errors.technologies ? 'border-destructive' : ''}
                  />
                  {errors.technologies && <p className="text-sm text-destructive">{errors.technologies}</p>}
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
                    disabled={formData.isOngoing}
                    className={errors.endDate ? 'border-destructive' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isOngoing"
                    checked={formData.isOngoing}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isOngoing: checked as boolean, endDate: checked ? '' : formData.endDate })
                    }
                  />
                  <Label htmlFor="isOngoing" className="cursor-pointer">
                    Ongoing project
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectUrl">Project URL (Optional)</Label>
                  <Input
                    id="projectUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className={errors.projectUrl ? 'border-destructive' : ''}
                  />
                  {errors.projectUrl && <p className="text-sm text-destructive">{errors.projectUrl}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repositoryUrl">Repository URL (Optional)</Label>
                  <Input
                    id="repositoryUrl"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={formData.repositoryUrl}
                    onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                    className={errors.repositoryUrl ? 'border-destructive' : ''}
                  />
                  {errors.repositoryUrl && <p className="text-sm text-destructive">{errors.repositoryUrl}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Project' : 'Add Project'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Special Project
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
                        <Folder className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{entry.name}</h3>
                        <p className="text-sm text-muted-foreground font-medium">{entry.role}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(entry.startDate)} - {entry.isOngoing ? 'Present' : formatDate(entry.endDate)}
                            {entry.isOngoing && (
                              <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                Ongoing
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Code2 className="h-3 w-3" />
                            {entry.technologies}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {entry.description}
                        </p>
                        {(entry.projectUrl || entry.repositoryUrl) && (
                          <div className="flex flex-wrap gap-3 mt-3">
                            {entry.projectUrl && (
                              <a
                                href={entry.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <LinkIcon className="h-3 w-3" />
                                View Project
                              </a>
                            )}
                            {entry.repositoryUrl && (
                              <a
                                href={entry.repositoryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <Github className="h-3 w-3" />
                                View Repository
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No special projects added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Showcase your notable projects and achievements
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
              This will permanently delete this project. This action cannot be undone.
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
