import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as RTL from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const screen = RTL.screen;

const TestComponent = () => <div>Protected Content</div>;

const MockedProtectedRoute = ({ token }: { token?: string }) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show loading state initially', () => {
    vi.mocked(api.getProfile).mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} as any }), 100))
    );

    render(<MockedProtectedRoute token="test-token" />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', async () => {
    vi.mocked(api.getProfile).mockResolvedValue({
      success: false,
      error: { code: 401, message: 'Unauthorized' },
    });

    render(<MockedProtectedRoute />);

    // Wait for redirect
    await screen.findByText('Login Page');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when authenticated', async () => {
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

    render(<MockedProtectedRoute token="valid-token" />);

    await screen.findByText('Protected Content');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should prevent access without token', () => {
    render(<MockedProtectedRoute />);
    
    // Should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
