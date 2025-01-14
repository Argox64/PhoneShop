import express from 'express';
import { convertErrorToHttpResponse } from '@app/utils/errors';
import { FORBIDDEN_ERROR, ForbiddenError, Roles } from 'common-types';

//https://nikitrauniyar.medium.com/role-based-access-control-rbac-in-node-js-typescript-c00417703ad0
export function checkRole(allowedRoles: Roles[]) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = req.session.user;

            if (!user || !allowedRoles.includes(user.role)) {
                throw new ForbiddenError(FORBIDDEN_ERROR, {}); //res.status(403).json({ message: `Forbidden, you are a ${user.role} and this service is only available for ${allowedRoles}` });
            }
        
            return next();
        } catch(err) {
            convertErrorToHttpResponse(err as Error, req, res)
        }
    };
}