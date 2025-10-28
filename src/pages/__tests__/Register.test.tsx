import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as RTL from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const screen = RTL.screen;
const fireEvent = RTL.fireEvent;
const waitFor = RTL.waitFor;

const MockedRegister = () => (
  <BrowserRouter>
    <AuthProvider>
      <Register />
    </AuthProvider>
  </BrowserRouter>
);

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Form Rendering', () => {
    it('should render registration form', () => {
      render(<MockedRegister />);
      
      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      render(<MockedRegister />);
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      render(<MockedRegister />);
      
      const emailInput = screen.getByLabelText(/^email$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should validate password requirements', async () => {
      render(<MockedRegister />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate password complexity (uppercase, lowercase, number)', async () => {
      render(<MockedRegister />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weakpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/uppercase, lowercase, and number/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      render(<MockedRegister />);
      
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/^email$/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create account/i });

      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully register with valid data', async () => {
      vi.mocked(api.register).mockResolvedValue({
        success: true,
        data: { id: '123', email: 'test@example.com' },
      });

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

      render(<MockedRegister />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/^email$/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
        });
      });
    });

    it('should handle duplicate email error', async () => {
      vi.mocked(api.register).mockResolvedValue({
        success: false,
        error: { code: 400, message: 'Email already exists' },
      });

      render(<MockedRegister />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/^email$/i), {
        target: { value: 'existing@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(api.register).toHaveBeenCalled();
      });
    });

    it('should disable submit button while loading', async () => {
      vi.mocked(api.register).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ success: true, data: { id: '123', email: 'test@example.com' } }), 100))
      );

      render(<MockedRegister />);
      
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/^email$/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^password$/i), {
        target: { value: 'Password123' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123' },
      });

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      });
    });
  });

  describe('OAuth Integration', () => {
    it('should redirect to Google OAuth on button click', () => {
      delete (window as any).location;
      window.location = { href: '' } as any;

      render(<MockedRegister />);
      
      const googleButton = screen.getByRole('button', { name: /google/i });
      fireEvent.click(googleButton);
      
      expect(window.location.href).toBe('https://api.jibbit.app/api/auth/google');
    });
  });

  describe('Navigation Links', () => {
    it('should have sign in link', () => {
      render(<MockedRegister />);
      
      const signinLink = screen.getByText(/sign in/i);
      expect(signinLink).toBeInTheDocument();
      expect(signinLink.closest('a')).toHaveAttribute('href', '/login');
    });
  });
});
