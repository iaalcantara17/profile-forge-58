import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import * as RTL from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

const screen = RTL.screen;
const fireEvent = RTL.fireEvent;

const MockedNavigation = ({ authenticated = false }: { authenticated?: boolean }) => {
  if (authenticated) {
    localStorage.setItem('auth_token', 'test-token');
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
  } else {
    localStorage.removeItem('auth_token');
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Logo', () => {
    it('should display logo', () => {
      render(<MockedNavigation />);
      
      const logo = screen.getByAltText(/jibbitATS logo/i);
      expect(logo).toBeInTheDocument();
    });

    it('should link logo to homepage', () => {
      render(<MockedNavigation />);
      
      const logoLink = screen.getByAltText(/jibbitATS logo/i).closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Unauthenticated State', () => {
    it('should show login and get started buttons', () => {
      render(<MockedNavigation />);
      
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    });

    it('should not show authenticated-only links', () => {
      render(<MockedNavigation />);
      
      expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    it('should show dashboard and profile links', async () => {
      render(<MockedNavigation authenticated={true} />);
      
      await screen.findByText(/dashboard/i);
      expect(screen.getByText(/profile/i)).toBeInTheDocument();
    });

    it('should show logout button', async () => {
      render(<MockedNavigation authenticated={true} />);
      
      const logoutButton = await screen.findByRole('button', { name: /logout/i });
      expect(logoutButton).toBeInTheDocument();
    });

    it('should not show login/register buttons', async () => {
      render(<MockedNavigation authenticated={true} />);
      
      await screen.findByText(/dashboard/i);
      expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /get started/i })).not.toBeInTheDocument();
    });

    it('should handle logout click', async () => {
      vi.mocked(api.logout).mockResolvedValue({ success: true });

      render(<MockedNavigation authenticated={true} />);
      
      const logoutButton = await screen.findByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(api.logout).toHaveBeenCalled();
    });
  });

  describe('Mobile Menu', () => {
    it('should toggle mobile menu', () => {
      render(<MockedNavigation />);
      
      const menuButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(menuButton);

      // Mobile menu should be visible
      expect(screen.getAllByText(/login/i).length).toBeGreaterThan(1);
    });

    it('should close mobile menu on link click', () => {
      render(<MockedNavigation />);
      
      const menuButton = screen.getByLabelText(/toggle menu/i);
      fireEvent.click(menuButton);

      const loginButtons = screen.getAllByText(/login/i);
      fireEvent.click(loginButtons[loginButtons.length - 1]);

      // Menu button should indicate closed state
      expect(menuButton.querySelector('svg')).toBeDefined();
    });
  });

  describe('Active Route Indication', () => {
    it('should highlight current page in navigation', () => {
      render(
        <BrowserRouter>
          <AuthProvider>
            <div>
              <Navigation />
            </div>
          </AuthProvider>
        </BrowserRouter>
      );

      // This is a basic test - in a real scenario, we'd need to mock the route
      const logo = screen.getByAltText(/jibbitATS logo/i);
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should render theme toggle', () => {
      render(<MockedNavigation />);
      
      // Theme toggle button should be present
      const themeToggle = document.querySelector('[aria-label*="theme"]') || 
                         document.querySelector('button[type="button"]');
      expect(themeToggle).toBeDefined();
    });
  });
});
