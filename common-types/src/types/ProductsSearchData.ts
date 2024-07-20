import { ProductType } from "./ProductType";

export type ProductsSearchData = {
    totalCount: number,
    data: ProductType[],
}