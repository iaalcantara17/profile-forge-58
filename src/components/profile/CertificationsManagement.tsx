import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Award, Calendar, Building2, FileText, Upload, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  dateEarned: string;
  expirationDate: string;
  doesNotExpire: boolean;
  certificationNumber: string;
  documentUrl: string;
}

export const CertificationsManagement = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuingOrganization: '',
    dateEarned: '',
    expirationDate: '',
    doesNotExpire: false,
    certificationNumber: '',
    documentUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Certification name is required';
    if (!formData.issuingOrganization.trim()) newErrors.issuingOrganization = 'Issuing organization is required';
    if (!formData.dateEarned) newErrors.dateEarned = 'Date earned is required';
    
    if (!formData.doesNotExpire && !formData.expirationDate) {
      newErrors.expirationDate = 'Expiration date is required for certifications that expire';
    }
    
    if (formData.dateEarned && formData.expirationDate && !formData.doesNotExpire) {
      if (new Date(formData.expirationDate) < new Date(formData.dateEarned)) {
        newErrors.expirationDate = 'Expiration date must be after date earned';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (editingId) {
      setCertifications(certifications.map(cert => 
        cert.id === editingId ? { ...formData, id: editingId } : cert
      ));
      toast({
        title: 'Certification updated',
        description: 'Your certification has been updated successfully.',
      });
      setEditingId(null);
    } else {
      const newCertification: Certification = {
        ...formData,
        id: Date.now().toString(),
      };
      setCertifications([...certifications, newCertification]);
      toast({
        title: 'Certification added',
        description: 'Your certification has been added successfully.',
      });
    }

    resetForm();
  };

  const handleEdit = (cert: Certification) => {
    setFormData({
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      dateEarned: cert.dateEarned,
      expirationDate: cert.expirationDate,
      doesNotExpire: cert.doesNotExpire,
      certificationNumber: cert.certificationNumber,
      documentUrl: cert.documentUrl,
    });
    setEditingId(cert.id);
    setIsAdding(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      setCertifications(certifications.filter(cert => cert.id !== deleteId));
      toast({
        title: 'Certification deleted',
        description: 'The certification has been removed from your profile.',
      });
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuingOrganization: '',
      dateEarned: '',
      expirationDate: '',
      doesNotExpire: false,
      certificationNumber: '',
      documentUrl: '',
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

  const isExpiringSoon = (expirationDate: string) => {
    if (!expirationDate) return false;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const daysUntilExpiry = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const isExpired = (expirationDate: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  const sortedCertifications = [...certifications].sort((a, b) => {
    return new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime();
  });

  return (
    <div className="space-y-6">
      {isAdding ? (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Certification Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
                  <Input
                    id="issuingOrganization"
                    placeholder="e.g., Amazon Web Services"
                    value={formData.issuingOrganization}
                    onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                    className={errors.issuingOrganization ? 'border-destructive' : ''}
                  />
                  {errors.issuingOrganization && <p className="text-sm text-destructive">{errors.issuingOrganization}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateEarned">Date Earned *</Label>
                  <Input
                    id="dateEarned"
                    type="month"
                    value={formData.dateEarned}
                    onChange={(e) => setFormData({ ...formData, dateEarned: e.target.value })}
                    className={errors.dateEarned ? 'border-destructive' : ''}
                  />
                  {errors.dateEarned && <p className="text-sm text-destructive">{errors.dateEarned}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    type="month"
                    value={formData.expirationDate}
                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                    disabled={formData.doesNotExpire}
                    className={errors.expirationDate ? 'border-destructive' : ''}
                  />
                  {errors.expirationDate && <p className="text-sm text-destructive">{errors.expirationDate}</p>}
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                  <Checkbox
                    id="doesNotExpire"
                    checked={formData.doesNotExpire}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, doesNotExpire: checked as boolean, expirationDate: checked ? '' : formData.expirationDate })
                    }
                  />
                  <Label htmlFor="doesNotExpire" className="cursor-pointer">
                    This certification does not expire
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificationNumber">Certification Number/ID (Optional)</Label>
                  <Input
                    id="certificationNumber"
                    placeholder="e.g., AWS-SAA-12345"
                    value={formData.certificationNumber}
                    onChange={(e) => setFormData({ ...formData, certificationNumber: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentUrl">Certificate URL (Optional)</Label>
                  <Input
                    id="documentUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.documentUrl}
                    onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to your digital certificate or credential
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update Certification' : 'Add Certification'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      )}

      {sortedCertifications.length > 0 ? (
        <div className="space-y-4">
          {sortedCertifications.map((cert) => {
            const expiringSoon = !cert.doesNotExpire && isExpiringSoon(cert.expirationDate);
            const expired = !cert.doesNotExpire && isExpired(cert.expirationDate);
            
            return (
              <Card key={cert.id} className="hover-scale">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-lg font-semibold">{cert.name}</h3>
                              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                                <Building2 className="h-3 w-3" />
                                {cert.issuingOrganization}
                              </p>
                            </div>
                            {expired && (
                              <Badge variant="destructive" className="text-xs">Expired</Badge>
                            )}
                            {expiringSoon && !expired && (
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-700 dark:text-orange-400">
                                Expiring Soon
                              </Badge>
                            )}
                            {cert.doesNotExpire && (
                              <Badge variant="secondary" className="text-xs">No Expiration</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Earned {formatDate(cert.dateEarned)}
                            </span>
                            {!cert.doesNotExpire && cert.expirationDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Expires {formatDate(cert.expirationDate)}
                              </span>
                            )}
                            {cert.certificationNumber && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                ID: {cert.certificationNumber}
                              </span>
                            )}
                          </div>
                          {cert.documentUrl && (
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(cert)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteId(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        !isAdding && (
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No certifications added yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your professional certifications to showcase your expertise
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
              This will permanently delete this certification. This action cannot be undone.
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
