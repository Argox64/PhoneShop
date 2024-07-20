import { CallResponse, PaymentCalls, PaymentIntent } from "common-types";

const BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

export class PaymentsService {
    // Créer une intention de paiement
    public static createPaymentIntent = async (token: string, amount: number, currency: string, orderId: number): Promise<CallResponse<PaymentIntent>> => {
      try {
        const response = await PaymentCalls.createPaymentIntent(BASE_URL, token, amount, currency, orderId);
        return { status: response.status, data: response.data };
      } catch (error) {
        throw error;
      }
    };
  
    // Enregistrer les détails du paiement
    public static savePaymentDetails = async (token: string, paymentIntentId: string, amount: number, currency: string, status: string, description: string, orderId: string, paymentMethodId: string): Promise<CallResponse<{}>> => {
      try {
        const response = await PaymentCalls.savePaymentDetails(BASE_URL, token, paymentIntentId, amount, currency, status, description, orderId, paymentMethodId);
        return { status: response.status, data: response.data };
      } catch (error) {
        throw error;
      }
    };
  
    // Mettre à jour le statut du paiement
    public static updatePaymentStatus = async (token: string, paymentIntentId: string, status: string): Promise<CallResponse<{}>> => {
      try {
        const response = await PaymentCalls.updatePaymentStatus(BASE_URL, token, paymentIntentId, status);
        return { status: response.status, data: response.data };
      } catch (error) {
        throw error;
      }
    };
  }