import { productType } from "@/database/model/product.model";
export interface PaginationType {
  data: productType[];
  total: number;
  currentPage: number;
  totalPage: number;
  limit: number;
  skip: number;
}
export interface createProductType {
  name: string;
  price: number;
  category: string;
  stock: number;
}
export interface QueriesType {
  filter?: string;
  sort?: string;
  limit?: number;
  page?: number;
}
