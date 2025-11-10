export interface Job {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobPostingUrl?: string;
  applicationDeadline?: string;
  description: string;
  industry?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  status: 'interested' | 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected';
  notes?: string;
  contacts?: JobContact[];
  applicationHistory?: ApplicationHistoryEntry[];
  importMetadata?: {
    sourceUrl: string;
    importedAt: string;
    importMethod: 'manual' | 'url-scrape';
  };
  applicationMaterials?: {
    resumeId?: string;
    coverLetterId?: string;
    portfolioUrl?: string;
  };
  companyInfo?: CompanyInfo;
  archived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
}

export interface JobContact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  notes?: string;
}

export interface ApplicationHistoryEntry {
  date: string;
  action: string;
  notes?: string;
  status?: string;
}

export interface CompanyInfo {
  name: string;
  size?: string;
  industry?: string;
  website?: string;
  description?: string;
  mission?: string;
  logo?: string;
  rating?: number;
  location?: string;
}

export interface JobFilters {
  search?: string;
  status?: string[];
  industry?: string[];
  jobType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  deadlineBefore?: string;
  deadlineAfter?: string;
  archived?: boolean;
}

export interface JobStats {
  total: number;
  byStatus: Record<string, number>;
  responseRate: number;
  averageResponseTime: number;
  deadlinesUpcoming: number;
  deadlinesOverdue: number;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobPostingUrl?: string;
  applicationDeadline?: string;
  description: string;
  industry?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  status?: 'interested' | 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected';
  notes?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  contacts?: JobContact[];
  applicationHistory?: ApplicationHistoryEntry[];
  archived?: boolean;
  archivedReason?: string;
}
