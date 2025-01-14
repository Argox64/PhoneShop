import express, { NextFunction } from 'express';
import { WebhooksService } from '@services/WebhooksService';
import { IController } from './IController';

export class WebhooksController implements IController {
    public path = '/webhooks';
    public router = express.Router();
    private webhooksService: WebhooksService;

    constructor() {
        this.webhooksService = new WebhooksService();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/stripe`, express.raw({type: 'application/json'}), this.handleStripeWebhook);
    }

    private handleStripeWebhook = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            await this.webhooksService.handleStripeWebhook(req, res);
        } catch(err) {
            next(err);
        }
    }
}