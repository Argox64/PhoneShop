import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import AuthPage from '../pages/AuthPage';
import AuthentificationService from '../services/AuthenticationService';
import { useSession } from '@/components/contexts/AuthProvider';
import { Roles, TokenType, UNAUTHORIZED_RESSOURCE_ERROR, UnauthorizedError } from 'common-types';
import AuthenticationService from '../services/AuthenticationService';

vi.mock('../services/AuthenticationService');
vi.mock('@/components/contexts/AuthProvider');
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(actual as object),
    useNavigate: vi.fn(),
  }
});

const mockUseSession = {
  isAuthenticated: false,
  token: {} as TokenType,
  login: vi.fn(),
  logout: vi.fn(),
  user: null,
};

(useSession as MockedFunction<typeof useSession>).mockReturnValue(mockUseSession);

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<Router>{ui}</Router>);
};

describe('AuthPage', () => {
  const navigate = vi.fn();

  beforeEach(() => {
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(navigate);
  });

  it('should render the component', () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('should display validation errors for empty email and password', async () => {
    renderWithRouter(<AuthPage />);

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Adresse email non valide')).toBeInTheDocument();
    //expect(await screen.findByText('Mot de passe requis')).toBeInTheDocument();
  });

  it('should display validation error for invalid email', async () => {
    renderWithRouter(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/adresse mail/i), { target: { value: 'invalid-email' } });
    fireEvent.blur(screen.getByLabelText(/adresse mail/i));

    expect(await screen.findByText('Adresse email non valide')).toBeInTheDocument();
  });

  it('should display validation errors for empty password', async () => {
    renderWithRouter(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/adresse mail/i), { target: { value: 'test@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Mot de passe requis')).toBeInTheDocument();
  });

  it('should call login method on valid form submission', async () => {
    const mockResponse = {
      status: 200,
      data: {
        tokenType: {
          type: 'Bearer',
          token: 'test-token',
          expiresDate: new Date(),
        },
        userData: { userUID: "uuid", email: 'test@example.com', role: Roles.Customer },
      },
    };

    (AuthentificationService.login as MockedFunction<typeof AuthenticationService.login>).mockResolvedValue(mockResponse);

    renderWithRouter(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/adresse mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => expect(mockUseSession.login).toHaveBeenCalledWith(mockResponse.data.userData, mockResponse.data.tokenType));
    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('should display error on unsuccessful login', async () => {
    (AuthentificationService.login as MockedFunction<typeof AuthenticationService.login>).mockRejectedValue(new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}));

    renderWithRouter(<AuthPage />);

    fireEvent.change(screen.getByLabelText(/adresse mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Mot de passe ou e-mail erroné')).toBeInTheDocument();
  });

  it('should redirect to /account if already authenticated', () => {
    mockUseSession.isAuthenticated = true;
    mockUseSession.token = {} as TokenType;

    renderWithRouter(<AuthPage />);

    expect(mockUseSession.isAuthenticated).toBe(true);
    expect(navigate).toHaveBeenCalledWith('/account');
  });
});
