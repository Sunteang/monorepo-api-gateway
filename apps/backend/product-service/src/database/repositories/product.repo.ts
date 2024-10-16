import ProductModel, { productType } from "../model/product.model";
import { PaginationType } from "./types/product.type";

interface newQueryType {
  sort: {} | { [key: string]: 1 | -1 };
  filter:
    | {}
    | { [key: string]: string | number | { [key: string]: string | number } };
  limit: number;
  skip: number;
  page: number;
}

export class ProductRepository {
  async getAllProduct(query: newQueryType): Promise<PaginationType> {
    try {
      const { filter, limit, page, sort, skip } = query;
      const data = await ProductModel.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .exec();
      const totalItems = await ProductModel.countDocuments(filter);
      const totalPage = Math.ceil(totalItems / limit);
      return {
        data: data,
        total: totalItems,
        currentPage: page,
        totalPage: totalPage,
        limit: limit,
        skip: skip,
      };
    } catch (error) {
      throw new Error("Failed to fetch getAllProduct() in repo");
    }
  }
  async getProductById(id: string): Promise<productType> {
    try {
      const data = await ProductModel.findById(id);
      if (!data) {
        throw new Error("the product not found!");
      }
      return data;
    } catch (error) {
      throw error;
      // throw new Error("Failed to fetch getProductById() in repo");
    }
  }
  async updateProductById(
    id: string,
    newProduct: productType
  ): Promise<productType> {
    try {
      const update = await ProductModel.findByIdAndUpdate(id, newProduct, {
        new: true,
      });
      if (!update) {
        throw new Error("the product not found!");
      }
      return update;
    } catch (error) {
      throw error;
    }
  }
  async deleteProductById(id: string): Promise<productType> {
    try {
      const data = await ProductModel.findByIdAndDelete(id);
      if (!data) {
        throw new Error("the product not found!");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async newProduct(productRequest: productType): Promise<productType> {
    try {
      const newProduct = await ProductModel.create(productRequest);

      return newProduct;
    } catch (error) {
      throw new Error("Failed to create newProduct() in repo");
    }
  }
}
export default new ProductRepository();
