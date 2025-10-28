import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as RTL from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from '../ResetPassword';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const screen = RTL.screen;
const fireEvent = RTL.fireEvent;
const waitFor = RTL.waitFor;

const MockedResetPassword = ({ token = 'test-token' }: { token?: string }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  </BrowserRouter>
);

describe('ResetPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', `/reset-password/test-token`);
  });

  it('should render reset password form', () => {
    render(<MockedResetPassword />);
    
    expect(screen.getByText('Set New Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
  });

  it('should validate password requirements', async () => {
    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should validate password complexity', async () => {
    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'weakpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/uppercase, lowercase, and number/i)).toBeInTheDocument();
    });
  });

  it('should validate password confirmation match', async () => {
    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    fireEvent.change(confirmInput, { target: { value: 'Different123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should successfully reset password', async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({
      success: true,
    });

    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledWith('test-token', 'NewPassword123');
    });
  });

  it('should handle invalid/expired token', async () => {
    vi.mocked(api.resetPassword).mockResolvedValue({
      success: false,
      error: { code: 400, message: 'Invalid or expired token' },
    });

    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalled();
    });
  });

  it('should show password requirements hint', () => {
    render(<MockedResetPassword />);
    
    expect(screen.getByText(/must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('should disable submit button while loading', async () => {
    vi.mocked(api.resetPassword).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<MockedResetPassword />);
    
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    const submitButton = screen.getByRole('button', { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: 'NewPassword123' } });
    fireEvent.change(confirmInput, { target: { value: 'NewPassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/resetting/i)).toBeInTheDocument();
    });
  });
});
