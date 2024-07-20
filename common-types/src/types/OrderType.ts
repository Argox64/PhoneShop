import { OrderDetailType } from "./OrderDetailType";
import { OrderStatus } from "./OrderStatus";
import { UserType } from "./UserType";

export type OrderType = {
    id: number;
    userId: string;
    status: OrderStatus;
    createdAt: Date;
    updatedStatusAt: Date;
    totalPrice: number;
    orderDetails: OrderDetailType[];
    user?: UserType;
}