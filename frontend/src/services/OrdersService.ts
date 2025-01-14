import { NewOrderDetail, OrderCalls, OrderType } from 'common-types';
import { CallResponse } from 'common-types';

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

class OrdersService {
  static getOrder = async (token: string, id: number, includeProducts: boolean): Promise<CallResponse<OrderType>> => {
    try {
      const response = await OrderCalls.getOrder(BASE_URL, token, id, includeProducts);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  }
  // Récupérer toutes les commandes d'un utilisateur
  static getOrdersByUser = async (token: string): Promise<CallResponse<OrderType[]>> => {
    try {
      const response = await OrderCalls.getOrdersByUserUUID(BASE_URL, token);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  // Ajouter une commande
  static addOrder = async (token: string, orderDetails: NewOrderDetail[], totalPrice: number): Promise<CallResponse<OrderType>> => {
    try {
      const response = await OrderCalls.addOrder(BASE_URL, token, orderDetails, totalPrice);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour une commande existante
  static updateOrder = async (token:string, orderId: string, order: OrderType): Promise<CallResponse<OrderType>> => {
    try {
      const response = await OrderCalls.updateOrder(BASE_URL, token, orderId, order);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une commande
  static deleteOrder = async (token: string, orderId: string): Promise<CallResponse<{}>> => {
    try {
      const response = await OrderCalls.deleteOrder(BASE_URL, token, orderId);
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };
}

export default OrdersService;