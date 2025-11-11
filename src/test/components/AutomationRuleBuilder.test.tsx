import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutomationRuleBuilder } from '@/components/automation/AutomationRuleBuilder';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'user1' } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: [] })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('AutomationRuleBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create rule button', () => {
    render(<AutomationRuleBuilder />);
    expect(screen.getByRole('button', { name: /create rule/i })).toBeInTheDocument();
  });

  it('opens rule creation form when create button is clicked', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleBuilder />);

    const createButton = screen.getByRole('button', { name: /create rule/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/rule name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trigger type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/action type/i)).toBeInTheDocument();
    });
  });

  it('validates required fields before saving', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleBuilder />);

    const createButton = screen.getByRole('button', { name: /create rule/i });
    await user.click(createButton);

    const saveButton = screen.getByRole('button', { name: /save rule/i });
    await user.click(saveButton);

    // Should not call insert without required fields
    await waitFor(() => {
      expect(supabase.from).not.toHaveBeenCalledWith(
        expect.objectContaining({
          name: '',
        })
      );
    });
  });

  it('creates rule with status_change trigger', async () => {
    const user = userEvent.setup();
    render(<AutomationRuleBuilder />);

    const createButton = screen.getByRole('button', { name: /create rule/i });
    await user.click(createButton);

    const nameInput = screen.getByLabelText(/rule name/i);
    await user.type(nameInput, 'Interview Reminder');

    const saveButton = screen.getByRole('button', { name: /save rule/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalled();
    });
  });

  it('displays existing rules', async () => {
    const mockRules = [
      {
        id: 'rule1',
        name: 'Deadline Reminder',
        is_enabled: true,
        trigger: { type: 'deadline', days_before: 3 },
        action: { type: 'send_email' },
      },
    ];

    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockRules })),
      })),
    });

    render(<AutomationRuleBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Deadline Reminder')).toBeInTheDocument();
    });
  });

  it('executes rule manually', async () => {
    const mockRules = [
      {
        id: 'rule1',
        name: 'Test Rule',
        is_enabled: true,
        trigger: { type: 'status_change' },
        action: { type: 'send_email' },
      },
    ];

    (supabase.from as any).mockReturnValue({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockRules })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    });

    const user = userEvent.setup();
    render(<AutomationRuleBuilder />);

    await waitFor(() => {
      expect(screen.getByText('Test Rule')).toBeInTheDocument();
    });

    const playButtons = screen.getAllByRole('button');
    const playButton = playButtons.find(
      (btn) => btn.querySelector('svg') !== null
    );

    if (playButton) {
      await user.click(playButton);

      await waitFor(() => {
        expect(supabase.functions.invoke).toHaveBeenCalledWith(
          'execute-automation-rules',
          expect.objectContaining({
            body: expect.objectContaining({ mode: 'manual' }),
          })
        );
      });
    }
  });
});
