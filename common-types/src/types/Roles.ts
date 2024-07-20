export enum Roles {
    Admin = "admin",
    Customer = "customer"
}

export const rolePermissions = {
    [Roles.Customer]: [Roles.Customer], 
    [Roles.Admin]: [Roles.Customer, Roles.Admin], 
};

export function convertStrToEnum(convertingStr: string): Roles 
| null {
    if (Object.values(Roles).includes(convertingStr as Roles)) {
        return convertingStr as Roles;
    } else {
        return null;
    }
}