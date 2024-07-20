import { OrderType } from "./OrderType";

export type PaymentType = {
    id: number;
    paymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    orderId: number;
    paymentMethodId: string;
    order?: OrderType;
}