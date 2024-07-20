import { ProductType } from "./ProductType";

export type SalesAggregeesType = {
    product_id: number;
    total_nb_sales: number;
    product: ProductType;
}