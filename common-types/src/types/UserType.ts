import { OrderType } from "./OrderType";
import { Roles } from "./Roles";

export type UserType = {
    uuid : string;
    email : string;
    firstName: string;
    lastName: string;
    address: string;
    password : string;
    role : Roles;
    fullName: string
    orderDetails: OrderType[]
}