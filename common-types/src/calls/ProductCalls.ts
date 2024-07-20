import axios, { AxiosError } from "axios";
import { ProductType } from "../types/ProductType";
import { CallResponse } from "./CallResponse";
import { convertAxiosErrorToHttpError } from "../errors/errors";
import { ProductsSearchData } from "../types/ProductsSearchData";
import { ProductFilter } from "../types/ProductFilter";
import { ProductSort } from "../types/ProductSort";

export class ProductCalls {
  public static async getAllProducts(baseUrl: string, limit: number = 100, offset: number = 0, filter: ProductFilter, sort: ProductSort): Promise<CallResponse<ProductsSearchData>> {
    try {
      const response = await axios.get(`${baseUrl}/products`, {
        params: { limit, offset, nameFilter: filter.nameFilter, priceMin: filter.priceMin, priceMax: filter.priceMax, sortBy: sort.by, sortDesc: sort.desc }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
        else
            throw error;
    }
  }

  public static async getProduct(baseUrl: string, id: number): Promise<CallResponse<ProductType>> {
    try {
      const response = await axios.get(`${baseUrl}/products/${id}`);
      return { status: response.status, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
        else
            throw error;
    }
  }

  public static async addProduct(baseUrl: string, token: string, name: string, description: string, price: number, imageUrl: string): Promise<CallResponse<ProductType>> {
    try {
      const response = await axios.post(`${baseUrl}/products`, 
        { name, description, price, imageUrl }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      return { status: response.status, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
        else
            throw error;
    }
  }

  public static async updateProduct(baseUrl: string, token: string, productId: number, name: string, description: string, price: number, imageUrl: string): Promise<CallResponse<ProductType>> {
    try {
      const response = await axios.put(`${baseUrl}/products/${productId}`, {name, description, price, imageUrl}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
        else
            throw error;
    }
  }

  public static async deleteProduct(baseUrl: string, token: string, productId: number): Promise<CallResponse<{}>> {
    try {
      const response = await axios.delete(`${baseUrl}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
        if (error instanceof AxiosError)
            throw convertAxiosErrorToHttpError(error);
        else
            throw error;
    }
  }
}