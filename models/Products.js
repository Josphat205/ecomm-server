import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    category: String,
    name: String,
    description: String,
    price: String,
    image: String,
    quantity: Number
  },
  {
    timestamps: true
  }
);
const ProductModel = mongoose.model("products", ProductSchema);
export default ProductModel;
