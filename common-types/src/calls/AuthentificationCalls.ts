import axios, { AxiosError } from "axios";
import { SessionUser } from "../types/SessionUser";
import { convertAxiosErrorToHttpError } from "../errors/errors";
import { TokenType } from "../types/TokenType";
import { CallResponse } from "./CallResponse";
import { TokenSessionUser } from "../types/TokenSessionUser";

export class AuthentificationCalls {
    public static login = async (endPointURL: string, email: string, password: string): Promise<CallResponse<TokenSessionUser>>=> {
        try {
          const response = await axios.post(`${endPointURL}/auth/login`, { email, password });
          return { status: response.status, data: response.data };
        } catch (error) {
          if(error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
          else 
            throw error;
        }
      };
    
      // Inscription
      public static register = async (endPointURL: string, email: string, password: string, role: string = "Customer"): Promise<CallResponse<SessionUser>> => {
        try {
          const response = await axios.post(`${endPointURL}/auth/register`, { email, password, role });
          return { status: response.status, data: response.data };
        } catch (error) {
          if(error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
          else 
            throw error;
        }
      };
    
      
    // Vérifier le token
    public static verifyToken = async (endPointURL: string, token: string): Promise<CallResponse<TokenType>> => {
        try {
          const response = await axios.post(`${endPointURL}/auth/verify-token`, {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return { status: response.status, data: response.data };
        } catch (error) {
          if(error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
          else 
            throw error;
        }
      };
}