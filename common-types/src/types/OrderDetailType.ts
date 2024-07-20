import { OrderType } from "./OrderType";
import { ProductType } from "./ProductType";

export type OrderDetailType = {
    id: number;
    orderId: number;
    quantity: number;
    order?: OrderType;
    product?: ProductType
}