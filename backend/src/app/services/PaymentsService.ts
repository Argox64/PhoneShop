import Stripe from 'stripe';
import { Payment } from '../models/Payment';
import { BadRequestError, INVALID_FIELD_ERROR, PaymentIntent, UserType } from 'common-types';
import { OrdersService } from './OrdersService';
import { StripeService } from './StripeService';
import { User } from '../models/User';
import { Op } from 'sequelize';

export class PaymentsService {
  ordersService: OrdersService = new OrdersService();
  stripeService: StripeService = new StripeService();

  public async createPaymentIntent(
    userUID: string,
    amount: number,
    currency: string,
    orderId: number
  ): Promise<PaymentIntent> {
    const order = await this.ordersService.getOrder(userUID, orderId, false);
    if(!order)
      throw new BadRequestError(INVALID_FIELD_ERROR, { fieldName: "orderId" })

    const user = (await User.findOne({ where : { id : { [Op.eq]: order.userId}}}))?.ToType();
    if(!user)
      throw new Error("Something goes wrong. User is invalid.")

    const customer = await this.stripeService.getOrCreateStripeCustomer(
      user.email, 
      user.fullName);
      
    const stripePaymentIntent = await this.stripeService.createPaymentIntent(
      customer,
      user,
      orderId,
      Math.trunc(amount * 100),
      currency
    );

    const new_payment = (await Payment.create({
      paymentIntentId: stripePaymentIntent.id,
      amount: stripePaymentIntent.amount,
      currency: stripePaymentIntent.currency,
      status: stripePaymentIntent.status,
      description : stripePaymentIntent.description,
      paymentMethodId: stripePaymentIntent.payment_method,
      orderId,
    })).ToType()
    
    return { paymentData: new_payment, stripePaymentIntent: stripePaymentIntent};
  }

  public async savePaymentDetails(paymentIntentId: string, 
    amount: number, 
    currency: string, 
    status: string, 
    description: string, 
    orderId: string, 
    paymentMethodId: string
  ): Promise<Payment> {
      const payment = await Payment.create({
          paymentIntentId,
          amount,
          currency,
          status,
          description,
          orderId,
          paymentMethodId,
      });
    return payment;
  }

  public async updatePaymentStatus(paymentId: string, status: string): Promise<Payment> {
    const payment = await Payment.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestError('Payment not found','Payment not found', {});
    }

    payment.status = status;
    await payment.save();

    return payment;
  }
}