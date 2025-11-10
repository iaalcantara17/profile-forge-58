import { supabase } from '@/integrations/supabase/client';

// Supabase-based API client
export const api = {
  // Jobs management
  jobs: {
    getAll: async (filters?: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id);

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.isArchived !== undefined) {
        query = query.eq('is_archived', filters.isArchived);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    get: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },

    create: async (jobData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...jobData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, jobData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },

    archive: async (id: string, reason?: string) => {
      return api.jobs.update(id, { is_archived: true, archive_reason: reason });
    },

    unarchive: async (id: string) => {
      return api.jobs.update(id, { is_archived: false, archive_reason: null });
    },

    updateStatus: async (id: string, status: string) => {
      const job = await api.jobs.get(id);
      const statusHistory = job.status_history || [];
      
      statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        previousStatus: job.status,
      });

      return api.jobs.update(id, {
        status,
        status_updated_at: new Date().toISOString(),
        status_history: statusHistory,
      });
    },
  },

  // Resume management
  resumes: {
    getAll: async (isArchived?: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id);

      if (isArchived !== undefined) {
        query = query.eq('is_archived', isArchived);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    get: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },

    create: async (resumeData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .insert({ ...resumeData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, resumeData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('resumes')
        .update(resumeData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },

    generateContent: async (resumeId: string, jobId: string, sections: string[]) => {
      const { data, error } = await supabase.functions.invoke('ai-resume-generate', {
        body: { resumeId, jobId, sections }
      });

      if (error) throw error;
      return data;
    },

    optimizeSkills: async (jobId: string) => {
      const { data, error } = await supabase.functions.invoke('ai-optimize-skills', {
        body: { jobId }
      });

      if (error) throw error;
      return data;
    },

    tailorExperience: async (jobId: string) => {
      const { data, error } = await supabase.functions.invoke('ai-tailor-experience', {
        body: { jobId }
      });

      if (error) throw error;
      return data;
    },
  },

  // Cover letter management
  coverLetters: {
    getAll: async (isArchived?: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id);

      if (isArchived !== undefined) {
        query = query.eq('is_archived', isArchived);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },

    get: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },

    create: async (coverLetterData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cover_letters')
        .insert({ ...coverLetterData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, coverLetterData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('cover_letters')
        .update(coverLetterData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },

    generate: async (jobId: string, tone?: string, template?: string) => {
      const { data, error } = await supabase.functions.invoke('ai-cover-letter-generate', {
        body: { jobId, tone, template }
      });

      if (error) throw error;
      return data;
    },
  },

  // Profile management
  profile: {
    get: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },

    update: async (profileData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: number;
    message: string;
    fields?: string[];
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  _id?: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  industry?: string;
  experienceLevel?: string;
  basicInfo?: {
    phoneNumber?: string;
    location?: string;
    professionalHeadline?: string;
    bio?: string;
    industry?: string;
    experienceLevel?: string;
  };
  employmentHistory?: any[];
  skills?: any[];
  education?: any[];
  certifications?: any[];
  projects?: any[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: 'Network error. Please check your connection.',
        },
      };
    }
  }

  // Auth endpoints
  async register(data: RegisterData) {
    return this.request<{ id: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    return this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async deleteAccount(password: string, isOAuthUser: boolean = false) {
    return this.request<void>('/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify(
        isOAuthUser 
          ? { confirmationText: password }
          : { password }
      ),
    });
  }

  async checkProvider(email: string) {
    return this.request<{ provider: string }>('/auth/check-provider', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async verifyOAuthToken(token: string) {
    return this.request<{ token: string }>('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request<UserProfile>('/users/me');
  }

  async updateProfile(profileData: Partial<UserProfile>) {
    return this.request<UserProfile>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Basic Info endpoints
  async getBasicInfo() {
    return this.request<any | any[]>('/users/me/basic-info');
  }

  async createBasicInfo(data: any) {
    return this.request<any>('/users/me/basic-info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBasicInfo(id: string, data: any) {
    return this.request<any>(`/users/me/basic-info/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBasicInfo(id: string) {
    return this.request<null>(`/users/me/basic-info/${id}`, {
      method: 'DELETE',
    });
  }

  // Employment History endpoints
  async getEmploymentHistory() {
    return this.request<any[]>('/users/me/employment');
  }

  async addEmployment(data: any) {
    return this.request<any>('/users/me/employment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployment(id: string, data: any) {
    return this.request<any>(`/users/me/employment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployment(id: string) {
    return this.request<null>(`/users/me/employment/${id}`, {
      method: 'DELETE',
    });
  }

  // Skills endpoints
  async getSkills() {
    return this.request<any[]>('/users/me/skills');
  }

  async addSkill(data: any) {
    return this.request<any>('/users/me/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSkill(id: string, data: any) {
    return this.request<any>(`/users/me/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSkill(id: string) {
    return this.request<null>(`/users/me/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // Education endpoints
  async getEducation() {
    return this.request<any[]>('/users/me/education');
  }

  async addEducation(data: any) {
    return this.request<any>('/users/me/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEducation(id: string, data: any) {
    return this.request<any>(`/users/me/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: string) {
    return this.request<null>(`/users/me/education/${id}`, {
      method: 'DELETE',
    });
  }

  // Certifications endpoints
  async getCertifications() {
    return this.request<any[]>('/users/me/certifications');
  }

  async addCertification(data: any) {
    return this.request<any>('/users/me/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCertification(id: string, data: any) {
    return this.request<any>(`/users/me/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCertification(id: string) {
    return this.request<null>(`/users/me/certifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects endpoints
  async getProjects() {
    return this.request<any[]>('/users/me/projects');
  }

  async addProject(data: any) {
    return this.request<any>('/users/me/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request<any>(`/users/me/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<null>(`/users/me/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Jobs management (Sprint 2)
  async getJobs(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null) {
          if (Array.isArray(filters[key])) {
            filters[key].forEach((val: string) => params.append(key, val));
          } else {
            params.append(key, filters[key].toString());
          }
        }
      });
    }
    const queryString = params.toString();
    return this.request<any[]>(`/jobs${queryString ? `?${queryString}` : ''}`);
  }

  async getJob(id: string) {
    return this.request<any>(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any) {
    return this.request<any>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request<void>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getJobStats() {
    return this.request<any>('/jobs/stats/summary');
  }

  async importJobFromUrl(url: string) {
    return this.request<any>('/jobs/import', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  async archiveJob(id: string, reason?: string) {
    return this.request<any>(`/jobs/${id}/archive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async unarchiveJob(id: string) {
    return this.request<any>(`/jobs/${id}/unarchive`, {
      method: 'POST',
    });
  }

  // Resume management (Sprint 2 - AI)
  async getResumes(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          params.append(key, filters[key].toString());
        }
      });
    }
    const queryString = params.toString();
    return this.request<any[]>(`/resumes${queryString ? `?${queryString}` : ''}`);
  }

  async getResume(id: string) {
    return this.request<any>(`/resumes/${id}`);
  }

  async createResume(data: any) {
    return this.request<any>('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResume(id: string, data: any) {
    return this.request<any>(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResume(id: string) {
    return this.request<void>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  }

  async generateResumeContent(id: string, jobId?: string, sections?: string[]) {
    return this.request<any>(`/resumes/${id}/generate-content`, {
      method: 'POST',
      body: JSON.stringify({ jobId, sections }),
    });
  }

  async optimizeResumeSkills(id: string, jobId: string) {
    return this.request<any>(`/resumes/${id}/optimize-skills`, {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async tailorResumeExperience(id: string, jobId: string) {
    return this.request<any>(`/resumes/${id}/tailor-experience`, {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async createResumeVersion(id: string, versionName: string, tailoredForJob?: string, notes?: string) {
    return this.request<any>(`/resumes/${id}/versions`, {
      method: 'POST',
      body: JSON.stringify({ versionName, tailoredForJob, notes }),
    });
  }

  async restoreResumeVersion(id: string, versionId: string) {
    return this.request<any>(`/resumes/${id}/restore/${versionId}`, {
      method: 'POST',
    });
  }

  async setDefaultResume(id: string) {
    return this.request<any>(`/resumes/${id}/set-default`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
