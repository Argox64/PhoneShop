import { ProductType } from "common-types";

export interface CartItem extends ProductType {
    quantity: number;
  }