import { productType } from "@/database/model/product.model";
import { QueriesType } from "@/database/repositories/types/product.type";
import ProductService from "@/services/product.service";
import {
  Controller,
  Route,
  Get,
  Tags,
  Path,
  Put,
  Body,
  Delete,
  Queries,
  Post,
} from "tsoa";

@Route("/v2/product")
export class ProductController extends Controller {
  constructor() {
    super();
  }
  @Get("/")
  @Tags("Get Product All")
  public async getAllProduct(@Queries() query: QueriesType) {
    try {
      const res = await ProductService.getAllProduct(query);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Get("{id}")
  @Tags("Get Product By ID")
  async getProductById(@Path() id: string) {
    try {
      const res = await ProductService.getProductById(id);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Put("{id}")
  @Tags("Update Product By ID")
  async updateProductById(@Path() id: string, @Body() reqBody: productType) {
    try {
      const res = await ProductService.updateProductById(id, reqBody);
      return res;
    } catch (error) {
      throw error;
    }
  }
  @Delete("{id}")
  @Tags("Delete Product By ID")
  async deleteProductById(@Path() id: string) {
    try {
      await ProductService.deleteProductById(id);
      return this.setStatus(204);
    } catch (error) {
      throw error;
    }
  }
  @Post("")
  @Tags("Create new Product")
  async createProduct(@Body() reqBody: productType) {
    try {
      const res = await ProductService.createProduct(reqBody);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
