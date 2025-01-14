import express from "express";
import { convertErrorToHttpResponse } from "@app/utils/errors";
import { AuthenticationService } from "@services/AuthenticationService";
import { SessionUser, UNAUTHORIZED_RESSOURCE_ERROR, UnauthorizedError } from "common-types";

export const auth = async(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> => {
    try {
        if(!req.headers.authorization) {
            throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); // No token
        }   
        if (req.headers.authorization.indexOf("Bearer") !== 0) throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); //invalid token

        const token: string = req.headers.authorization.split(" ")[1];
        
        const user: SessionUser = await new AuthenticationService().verifyToken(token);
        req.session.user = user;
        return next();
    } catch(err) {
        return convertErrorToHttpResponse(err as Error, req, res);
    }
}


declare module 'express-session' {
    interface SessionData {
      user: SessionUser
    }
  }