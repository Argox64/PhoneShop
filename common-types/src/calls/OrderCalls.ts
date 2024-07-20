import axios, { AxiosError } from "axios";
import { OrderType } from "../types/OrderType";
import { CallResponse } from "./CallResponse";
import { convertAxiosErrorToHttpError } from "../errors/errors";
import { NewOrderDetail } from "../types/NewOrderDetail";

export class OrderCalls {
    public static getOrder = async (endPointURL: string, token: string, id: number, includeProducts: boolean): Promise<CallResponse<OrderType>> => {
        try {
            const response = await axios.get(`${endPointURL}/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { includeProducts }
            });
            return { status: response.status, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError)
                throw convertAxiosErrorToHttpError(error);
            else
                throw error;
        }
    };
    
    // Récupérer les commandes d'un utilisateur par son UUID
    public static getOrdersByUserUUID = async (endPointURL: string, token: string): Promise<CallResponse<OrderType[]>> => {
        try {
            const response = await axios.get(`${endPointURL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { status: response.status, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError)
                throw convertAxiosErrorToHttpError(error);
            else
                throw error;
        }
    };

    // Ajouter une nouvelle commande
    public static addOrder = async (endPointURL: string, token: string, orderDetails: NewOrderDetail[], totalPrice: number): Promise<CallResponse<OrderType>> => {
        try {
            const response = await axios.post(`${endPointURL}/orders`, 
                { orderDetails, totalPrice }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { status: response.status, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError)
                throw convertAxiosErrorToHttpError(error);
            else
                throw error;
        }
    };

    // Mettre à jour une commande
    public static updateOrder = async (endPointURL: string, token: string, orderId: string, orderData: Partial<OrderType>): Promise<CallResponse<OrderType>> => {
        try {
            const response = await axios.put(`${endPointURL}/orders/${orderId}`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { status: response.status, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError)
                throw convertAxiosErrorToHttpError(error);
            else
                throw error;
        }
    };

    // Supprimer une commande
    public static deleteOrder = async (endPointURL: string, token: string, orderId: string): Promise<CallResponse<{}>> => {
        try {
            const response = await axios.delete(`${endPointURL}/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { status: response.status, data: {} };
        } catch (error) {
            if (error instanceof AxiosError)
                throw convertAxiosErrorToHttpError(error);
            else
                throw error;
        }
    };
}