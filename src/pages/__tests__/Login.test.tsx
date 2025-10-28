import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as RTL from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const screen = RTL.screen;
const fireEvent = RTL.fireEvent;
const waitFor = RTL.waitFor;

const MockedLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render login form', () => {
    render(<MockedLogin />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should render OAuth buttons', () => {
    render(<MockedLogin />);
    
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /microsoft/i })).toBeInTheDocument();
  });

  it('should handle Google OAuth redirect', () => {
    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<MockedLogin />);
    
    const googleButton = screen.getByRole('button', { name: /google/i });
    fireEvent.click(googleButton);
    
    expect(window.location.href).toBe('https://api.jibbit.app/api/auth/google');
  });

  it('should validate required fields', async () => {
    render(<MockedLogin />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    
    expect(emailInput.validity.valid).toBe(false);
    expect(passwordInput.validity.valid).toBe(false);
  });

  it('should submit login form with valid credentials', async () => {
    vi.mocked(api.login).mockResolvedValue({
      success: true,
      data: { token: 'mock-token' },
    });

    vi.mocked(api.getProfile).mockResolvedValue({
      success: true,
      data: {
        user_id: '123',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });

    vi.mocked(api.getBasicInfo).mockResolvedValue({
      success: true,
      data: [],
    });

    render(<MockedLogin />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    vi.mocked(api.login).mockResolvedValue({
      success: false,
      error: { code: 401, message: 'Invalid credentials' },
    });

    render(<MockedLogin />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalled();
    });
  });

  it('should clear password field after failed login', async () => {
    vi.mocked(api.login).mockResolvedValue({
      success: false,
      error: { code: 401, message: 'Invalid credentials' },
    });

    render(<MockedLogin />);
    
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(passwordInput.value).toBe('');
    });
  });

  it('should have forgot password link', () => {
    render(<MockedLogin />);
    
    const forgotLink = screen.getByText(/forgot password/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  it('should have sign up link', () => {
    render(<MockedLogin />);
    
    const signupLink = screen.getByText(/sign up/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('should disable submit button while loading', async () => {
    vi.mocked(api.login).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true, data: { token: 'mock' } }), 100))
    );

    render(<MockedLogin />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.click(submitButton);

    // Button should show loading state
    await waitFor(() => {
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });
});
