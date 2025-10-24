// API client for backend communication
const API_BASE_URL = 'http://34.207.119.121:5000/api';

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
}

export const api = new ApiClient();
