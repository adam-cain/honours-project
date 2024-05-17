// src/__tests__/signup-page.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '@/app/(auth)/signup/page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/Auth/auth-form';

// Mock the next-auth signIn function
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthForm component
jest.mock('@/components/Auth/auth-form', () => jest.fn(({ onSubmit }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit({ username: 'testuser', email: 'test@example.com', password: 'password' });
  }}>
    <button type="submit">Signup</button>
  </form>
)));

describe('SignupPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the signup form', () => {
    render(<SignupPage />);
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('calls fetch and signIn on successful signup and redirects to home', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    render(<SignupPage />);
    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        }),
      });

      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password',
      });

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('redirects to login on signup failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Signup failed' }),
    });
    render(<SignupPage />);
    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        }),
      });

      expect(mockPush).toHaveBeenCalledWith('/login');
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
  });

  it('returns an error message on unknown error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<SignupPage />);
    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
        }),
      });

      expect(screen.getByText('Unknown error: Error: Network error')).toBeInTheDocument();
    });
  });
});
