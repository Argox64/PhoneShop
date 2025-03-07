import express, { NextFunction } from 'express';
import { PaymentsService } from '@services/PaymentsService';
import { IController } from './IController';
import { auth } from "@app/middlewares/authMiddleware";
import { checkRole } from "@app/middlewares/rbac";
import { Roles, ForbiddenError, FORBIDDEN_ERROR } from 'common-types';

export class PaymentsController implements IController {
    public path = '/payments';
    public router = express.Router();
    private paymentsService = new PaymentsService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, auth, checkRole([Roles.Admin, Roles.Customer]), this.createPaymentIntent);
        this.router.put(`${this.path}/:paymentid`, auth, checkRole([Roles.Admin]), this.updatePaymentStatus);
    }

    private createPaymentIntent = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { amount, currency, orderId } = req.body;

            if(req.session.user) {
                const { userUID, role } = req.session.user;
                const result = await this.paymentsService.createPaymentIntent(userUID, amount, currency, orderId);
                return res.status(201).json(result);
            }
            else
                throw new ForbiddenError(FORBIDDEN_ERROR, {});

        } catch (err) {
            next(err);
        }
    }

    private updatePaymentStatus = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { paymentIntentId: paymentId } = req.params;
            const { status } = req.body;
            const result = await this.paymentsService.updatePaymentStatus(paymentId, status);
            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}