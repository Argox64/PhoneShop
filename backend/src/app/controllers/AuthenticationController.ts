import express from "express";
import { IController } from "./IController";
import { convertErrorToHttpResponse } from "../utils/errors";
import { AuthenticationService } from "../services/AuthenticationService";
import { isNullOrEmpty } from "../utils/extensions/stringExtensions";
import { Roles, TokenType, UNAUTHORIZED_RESSOURCE_ERROR, UnauthorizedError } from "common-types";

export class AuthenticationController implements IController {
    public path: string = "/auth";
    public router = express.Router();
    private authenticationService = new AuthenticationService();

    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/verify-token`, this.verifyToken);
    }

    private login = async(req: express.Request, res: express.Response) => {
        try {
            const { email, password } = req.body;
            const data = await this.authenticationService.login(email, password)
            res.status(200).json(data);
        } catch(err) {
            convertErrorToHttpResponse(err as Error, req, res);
        }
    }

    private register = async(req: express.Request, res: express.Response) => {
        try {
            const { email, password, firstName, lastName, address, role } = req.body;

            const sessionUser = req.session.user;
            const _role = (role as string).toLocaleLowerCase() as Roles ?? Roles.Customer;

            const new_user = await this.authenticationService.register(email, password, firstName, lastName, address, _role, sessionUser?.role);

            res.status(200).json(new_user);
        } catch(err) {
            convertErrorToHttpResponse(err as Error, req, res);
        }
    }

    private verifyToken = async(req: express.Request, res: express.Response) => {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {}); //Token is missing
            }
            const token: string = authorizationHeader.split(" ")[1];
            const userSession = await this.authenticationService.verifyToken(token);
            res.status(200).json(userSession);
        } catch(err) {
            convertErrorToHttpResponse(err as Error, req, res);
        }
    }
}