import { ProductType } from "./ProductType";

export type SalesAggregatesType = {
    productId: number;
    totalSales: number;
    product: ProductType;
}