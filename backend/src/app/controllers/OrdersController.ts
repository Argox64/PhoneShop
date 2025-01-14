import express, { NextFunction } from "express";
import { IController } from "./IController";
import { OrdersService } from "@services/OrdersService";
import { auth } from "@app/middlewares/authMiddleware";
import { checkRole } from "@app/middlewares/rbac";
import { FORBIDDEN_ERROR, ForbiddenError, Roles } from "common-types";

export class OrdersController implements IController {
    public path: string = "/orders";
    public router = express.Router();
    private ordersService = new OrdersService();

    constructor() {
        this.initializeRoutes();
    }
    
    private initializeRoutes() {
        this.router.get(`${this.path}`, auth, checkRole([Roles.Admin, Roles.Customer]), this.getOrdersByUserId);
        this.router.get(`${this.path}/:orderId`, auth, checkRole([Roles.Admin, Roles.Customer]), this.getOrder);
        this.router.post(`${this.path}`, auth, checkRole([Roles.Admin, Roles.Customer]), this.addOrder);
    }

    private getOrdersByUserId = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            //const { clientUID } = req.params;
            if(req.session.user) {
                const { userUID, role } = req.session.user;
                const result = await this.ordersService.getOrdersByUserUUID(userUID); 
                    return res.status(200).json(result); 
            }
            else
                throw new ForbiddenError(FORBIDDEN_ERROR, {});
        } catch(err) {
            next(err);
        }
    }

    private addOrder = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { orderDetails, totalPrice } = req.body; // Assurez-vous que le corps de la requête contient les bonnes données
            if(req.session.user) {
                const { userUID } = req.session.user;

                const order = await this.ordersService.addOrder(userUID, orderDetails, totalPrice);
                return res.status(201).json(order);
            }
            else
                throw new ForbiddenError(FORBIDDEN_ERROR, {});
        } catch (err) {
            next(err);
        }
    }
    private getOrder = async(req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { orderId } = req.params;
            const { includeProducts } = req.query;
            if(req.session.user) {
                const { userUID } = req.session.user;
                const order = await this.ordersService.getOrder(userUID, parseFloat(orderId), Boolean(includeProducts));
                return res.status(200).json(order);
            }
            else
                throw new ForbiddenError(FORBIDDEN_ERROR, {});
        } catch (err) {
            next(err);
        }
    }
}