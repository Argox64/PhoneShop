export enum OrderStatus {
    WaitingForPaiement = "waiting_for_payment",
    WaitingForValidation = "waiting_for_validation",
    InPreparation = "in_preparation",
    Delivered = "delivered",
    Cancelled = "cancelled",
    Returned ="returned"
}

export function convertStrToEnum(convertingStr: string): OrderStatus 
| null {
    if (Object.values(OrderStatus).includes(convertingStr as OrderStatus)) {
        return convertingStr as OrderStatus;
    } else {
        return null;
    }
}