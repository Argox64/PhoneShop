import { ProductSortEnum } from "./ProductSortEnum";

export type ProductSort = {
    by?: ProductSortEnum;
    desc?: boolean;
}