import mongoose, { Schema } from "mongoose";

export interface productType {
  name: string;
  price: number;
  category: string;
  stock: number;
}

const ProductSchema = new Schema<productType>(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { versionKey: false }
);

export const ProductModel = mongoose.model<productType>(
  "ProductV2",
  ProductSchema
);

export default ProductModel;
