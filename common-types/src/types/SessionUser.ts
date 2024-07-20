import { Roles } from "./Roles";

export interface SessionUser {
    userUID: string,
    email: string,
    role: Roles
}