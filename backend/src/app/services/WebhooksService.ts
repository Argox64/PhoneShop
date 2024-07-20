import Stripe from 'stripe';
import { Request, Response } from 'express';
import { BadRequestError, OrderStatus } from 'common-types';
import { StripeService } from './StripeService';
import Payment from '../models/Payment';
import { FindOptions, where, WhereOptions } from 'sequelize';
import { Order } from '../models/Order';
import sequelize from '../db'

export class WebhooksService {
  private stripe: Stripe;
  private stripeService : StripeService = new StripeService();

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "stripe-secret-key", {
      apiVersion: '2024-06-20',
    });
  }

  public handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event | null = null;

    try {
      if (!sig || !endpointSecret) {
        throw new Error('Missing Stripe signature or endpoint secret');
      }

      event = this.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        if(err instanceof Error) {
            console.log(`Webhook Error: ${err.message}`);
            return new BadRequestError("Error",`Webhook Error: ${err.message}`, {});
        }
    }

    // Handle the event
    if(event) {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          // Handle the payment confirmation
          console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
          this._onPaymentIntentSucceeded(paymentIntent);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  };


  private async _onPaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const transaction = await sequelize().transaction();

    try {
      const payment = await Payment.findOne({
        where: { paymentIntentId : paymentIntent.id },
        include: { model: Order },
        transaction
      });

      if (!payment) {
        throw new Error("Payment Intent Id unknown");
      }

      payment.status = paymentIntent.status; // Assurez-vous que `paymentIntent` est défini quelque part dans votre code
      await payment.save({ transaction });

      const order = payment.order;
      if (!order) {
        throw new Error("Associated order not found");
      }

      order.status = OrderStatus.WaitingForValidation;
      await order.save({ transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}