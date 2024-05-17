
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/(auth)/login/page';
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
jest.mock('../../components/Auth/auth-form.tsx', () => jest.fn(({ onSubmit }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit({ email: 'test@example.com', password: 'Password1!' });
  }}>
    <button type="submit">Login</button>
  </form>
)));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signIn as jest.Mock).mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('calls signIn and redirects on successful login', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'Password1!',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('returns an error message on failed login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: 'No user found with this email' });
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'Password1!',
      });
      expect(mockPush).not.toHaveBeenCalled();
      expect(screen.getByText('No user found with this email')).toBeInTheDocument();
    });
  });
});
