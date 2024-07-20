import { BadRequestError, UserType } from "common-types";
import Stripe from "stripe";

export class StripeService {
    stripe : Stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "stripe-scret-key", {
        apiVersion: '2024-06-20',
      });

    public async getOrCreateStripeCustomer(
        email : string, 
        fullName: string
    ) : Promise<Stripe.Customer> {
        const customers = await this.stripe.customers.list({ email });
        if (customers.data.length > 0) {
          return customers.data[0];
        } else {
          const customer = await this.stripe.customers.create({ email: email, name: fullName });
          if(!customer)
            throw new Error("Stripe user creation failed.");
          return customer;
        }
    }

    public async createPaymentIntent(
        customer: Stripe.Customer, 
        user: UserType,
        orderId: number, 
        amount: number, 
        currency: string = 'usd'
    ): Promise<Stripe.PaymentIntent> {     

        if (!customer || !customer.id) {
            throw new Error('Invalid Stripe customer');
        }
        if (!user || !user.address || !user.lastName || !user.firstName) {
            throw new Error('Invalid user information');
        }
        if (amount <= 0) {
            throw new BadRequestError('Invalid amount', 'Invalid amount', {});
          }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            customer: customer.id,
            description: `Payment for Order #${ orderId } - ${user?.lastName} ${user?.firstName}`,
            shipping: {
                name: `${user?.lastName} ${user?.firstName}`,
                address: {
                    line1: user.address
                }
            }, //TODO add address infos 
        });
      
        return paymentIntent;
    }

    public async updateStripeCustomer(
        customerId: string,
        updates: Stripe.CustomerUpdateParams
      ): Promise<Stripe.Customer> {
        try {
          const customer = await this.stripe.customers.update(customerId, updates);
          return customer;
        } catch (error) {
          console.error('Error updating Stripe customer:', error);
          throw error;
        }
      }
}