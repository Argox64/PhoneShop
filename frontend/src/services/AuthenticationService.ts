import { AuthentificationCalls, SessionUser, TokenSessionUser, TokenType } from 'common-types';
import { CallResponse } from 'common-types/src/calls/CallResponse';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

class AuthenticationService {
  // Connexion
  static login = async (email: string, password: string): Promise<CallResponse<TokenSessionUser>> => {
    return AuthentificationCalls.login(BASE_URL, email, password);
  };

  // Inscription
  static register = async (email: string, password: string, role: string = "Customer"): Promise<CallResponse<SessionUser>> => {
    return AuthentificationCalls.register(BASE_URL, email, password, role);
  };

  // Vérifier le token
  static verifyToken = async (token: string): Promise<CallResponse<TokenType>> => {
    return AuthentificationCalls.verifyToken(BASE_URL, token);
  };
}

export default AuthenticationService;