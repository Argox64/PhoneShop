import AuthentificationService from '@/services/AuthenticationService';
import { SessionUser, TokenType, UnauthorizedError } from 'common-types';
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useCookies } from 'react-cookie';

type SessionContextType = {
  token: TokenType;
  user: SessionUser | null;
  login: (sessionUser: SessionUser, token: TokenType) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthProvider = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [auth_cookie, set_auth_cookie, remove_auth_cookie] = useCookies(['auth_token', 'auth_user']);

  const isAuthenticated = auth_cookie.auth_token !== undefined;

  const login = (user: SessionUser, token: TokenType) => {
    set_auth_cookie('auth_token', token, { path: '/', expires: new Date(token.expiresDate), secure: true});
    set_auth_cookie('auth_user', user, { path: '/', expires: new Date(token.expiresDate), secure: true});
  };

  const logout = () => {
    remove_auth_cookie('auth_token');
    remove_auth_cookie('auth_user');
  };

  useEffect(() => {
    const storedToken = auth_cookie.auth_token as TokenType;
    const storedUser = auth_cookie.auth_user as SessionUser;

    if (storedToken && storedUser) {
      verifyToken(storedToken.token).then((isValid) => {
        if(isValid)
        {
          login(storedUser, storedToken);
        }
        else {
          logout();
        }
      });
    }
  }, []);

  const verifyToken = (async (token: string): Promise<boolean> => {
    let isValid = false;
    try {
      isValid = (await AuthentificationService.verifyToken(token)).status === 200;
    } catch(err) {
      if(err instanceof UnauthorizedError)
        isValid = false;
    } 
    return isValid;
  });

  return (
    <AuthProvider.Provider value={{ token: auth_cookie.auth_token, user: auth_cookie.auth_user, isAuthenticated, login, logout }}>
      {children}
    </AuthProvider.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthProvider);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};