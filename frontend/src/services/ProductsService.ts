import { CallResponse, ProductCalls, ProductFilter, ProductSort, ProductsSearchData, ProductType } from 'common-types';

const BASE_URL =  (import.meta.env.VITE_BACKEND_URL || 'http:localhost/5000');

class ProductsService {
  // Récupérer tous les produits
  public static getAllProducts = async (limit: number = 100, offset: number = 0, filter: ProductFilter= {}, sort: ProductSort = {}): Promise<CallResponse<ProductsSearchData>> => {
      try {
        const response = await ProductCalls.getAllProducts(BASE_URL, limit, offset, filter, sort);
        return { status: response.status, data: response.data };
    } catch (error) {
      throw error;
    }
  };

  public static getProduct = async (id: number): Promise<CallResponse<ProductType>> => {
    try {
      const response = await ProductCalls.getProduct(BASE_URL, id);
      return { status: response.status, data: response.data };
  } catch (error) {
    throw error;
  }
};

  // Ajouter un produit
  public static addProduct = async (token: string, name: string, description: string, price: number, imageUrl: string): Promise<CallResponse<ProductType>> => {
    try {
      const response = await ProductCalls.addProduct(BASE_URL, token, name, description, price, imageUrl);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // Mettre à jour un produit existant
  public static updateProduct = async (token: string, id: number, name: string, description: string, price: number, imageUrl: string) => {
    try {
      const response = await ProductCalls.updateProduct(BASE_URL, token, id, name, description, price, imageUrl);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // Supprimer un produit
  public static deleteProduct = async (token: string, id: number) => {
    try {
      const response = await ProductCalls.deleteProduct(BASE_URL, token, id);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };
}

export default ProductsService;