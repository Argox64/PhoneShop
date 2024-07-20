import { OrderDetailType } from "./OrderDetailType";
import { SalesAggregatesType } from "./SalesAggregeesType";

export type ProductType = {
    id: number;
    name:string;
    description:string | null;
    price:number;
    imageUrl:string
    orderDetails: OrderDetailType[],
    salesAggregates?: SalesAggregatesType
}