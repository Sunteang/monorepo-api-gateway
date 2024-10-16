import { productType } from "@/database/model/product.model";
import ProductRepository from "@/database/repositories/product.repo";
import {
  PaginationType,
  QueriesType,
} from "@/database/repositories/types/product.type";

class ProductService {
  async getAllProduct(query: QueriesType | undefined): Promise<PaginationType> {
    try {
      const page = query?.page || 1;
      const limit = query?.limit || 5;
      const skip = (page - 1) * limit;

      const sort = query?.sort ? JSON.parse(query?.sort as string) : {};
      const filter = query?.filter ? JSON.parse(query?.filter as string) : {};
      const newFilter: {
        [key: string]: string | number | { [key: string]: string | number };
      } = {};

      for (let i in filter) {
        if (typeof filter[i] === "object") {
          newFilter[i] = {};
          for (let j in filter[i]) {
            if (j === "min") {
              newFilter[i]["$gte"] = filter[i][j];
            } else if (j === "max") {
              newFilter[i]["$lte"] = filter[i][j];
            }
          }
        } else {
          newFilter[i] = filter[i];
        }
      }

      const newSort: { [key: string]: 1 | -1 } = {};
      for (let i in sort) {
        newSort[i] = sort[i] === "asc" ? 1 : -1;
      }

      const newQuery = {
        sort: newSort,
        filter: newFilter,
        limit: limit,
        skip: skip,
        page: page,
      };
      // console.log(newQuery);

      const res = await ProductRepository.getAllProduct(newQuery);
      return res;
    } catch (error) {
      console.error("getAllProduct() Service error", error);
      throw new Error("Failed to fetch getAllProduct() Service");
    }
  }
  async getProductById(id: string): Promise<productType> {
    try {
      const data = await ProductRepository.getProductById(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateProductById(
    id: string,
    update: productType
  ): Promise<productType> {
    try {
      const data = await ProductRepository.updateProductById(id, update);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async deleteProductById(id: string): Promise<productType> {
    try {
      const data = await ProductRepository.deleteProductById(id);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createProduct(newProduct: productType): Promise<productType> {
    try {
      const data = await ProductRepository.newProduct(newProduct);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
export default new ProductService();
