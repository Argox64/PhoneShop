import { PaymentType } from "./PaymentType";

export type PaymentIntent = {
    paymentData: PaymentType,
    stripePaymentIntent: any; //Stripe.Response<Stripe.PaymentIntent>
}