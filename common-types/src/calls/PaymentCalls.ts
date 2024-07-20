import axios from "axios";
import { CallResponse } from "./CallResponse";
import { PaymentIntent } from "../types/PaymentIntent";

export class PaymentCalls {
  // Créer une intention de paiement
  public static createPaymentIntent = async (endPointURL: string, token: string, amount: number, currency: string, orderId: number): Promise<CallResponse<PaymentIntent>> => {
    try {
        const response = await axios.post(`${endPointURL}/payments`, { 
            amount, 
            currency, 
            orderId 
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  // Enregistrer les détails du paiement
  public static savePaymentDetails = async (endPointURL: string, token: string, paymentIntentId: string, amount: number, currency: string, status: string, description: string, orderId: string, paymentMethodId: string): Promise<CallResponse<{}>> => {
    try {
      const response = await axios.post(`${endPointURL}/payments/save-details`, { paymentIntentId, amount, currency, status, description, orderId, paymentMethodId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour le statut du paiement
  public static updatePaymentStatus = async (endPointURL: string, token: string, paymentIntentId: string, status: string): Promise<CallResponse<{}>> => {
    try {
      const response = await axios.post(`${endPointURL}/payments/update-status`, { paymentIntentId, status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };
}